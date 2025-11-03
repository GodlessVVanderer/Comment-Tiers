// background.js

import { MESSAGES, GEMINI_API_URL, GEMINI_MODEL, SYSTEM_INSTRUCTION } from './constants.js';

let accessToken = null;
let profileEmail = null;

// --- 1. Identity/Authentication Functions ---

async function authenticateAndGetToken(interactive = true) {
  return new Promise((resolve) => {
    chrome.identity.getAuthToken({ interactive: interactive }, (token) => {
      if (chrome.runtime.lastError || !token) {
        accessToken = null;
        resolve(null);
        return;
      }
      accessToken = token;
      resolve(token);
    });
  });
}

async function fetchUserInfo() {
    if (!accessToken) return null;
    try {
        const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const userInfo = await response.json();
        profileEmail = userInfo.email;
        return userInfo;
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
}

// --- 2. Gemini API Call Function ---

async function analyzeComments(comments) {
  if (!accessToken) {
    await authenticateAndGetToken(false); // Try silent auth first
    if (!accessToken) {
      return { error: "User not authenticated. Click 'Sign In' in the popup." };
    }
  }

  const prompt = `Analyze the following YouTube comments for Triage and Thematic Grouping: ${JSON.stringify(comments)}`;
  
  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}` 
      },
      body: JSON.stringify({
        // Using the official `systemInstruction` field for clarity and correctness.
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        // The user's prompt is the main content.
        contents: [
          { 
            role: "user",
            parts: [{ text: prompt }] 
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
        if (response.status === 401) {
            chrome.identity.removeCachedAuthToken({ token: accessToken });
            accessToken = null;
            return { error: "Authentication expired. Please sign in again." };
        }
        // Ensure data.error and data.error.message exist before accessing
        const errorMessage = data?.error?.message || 'Unknown API error';
        throw new Error(`API call failed: ${errorMessage}`);
    }

    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error("Invalid response structure from API.");
    }

    const jsonText = data.candidates[0].content.parts[0].text;
    // The API might wrap the JSON in markdown, so we need to clean it.
    const cleanedJsonText = jsonText.replace(/^```json\s*|```\s*$/g, '');
    const analysis = JSON.parse(cleanedJsonText);
    return analysis;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { error: `Gemini API call failed: ${error.message}` };
  }
}

// --- 3. Message Listener (Router) ---

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === MESSAGES.AUTHENTICATE) {
    authenticateAndGetToken(true) // Interactive auth
      .then(token => sendResponse({ token: !!token }))
      .catch(e => sendResponse({ token: false }));
    return true; 
  }

  if (request.message === MESSAGES.GET_USER_INFO) {
    fetchUserInfo()
      .then(info => sendResponse({ info: info }))
      .catch(e => sendResponse({ info: null }));
    return true; 
  }

  if (request.message === MESSAGES.SEND_COMMENTS_TO_BACKGROUND) {
    analyzeComments(request.comments)
      .then(analysis => {
        // Send result back to the content script 
        chrome.tabs.sendMessage(sender.tab.id, {
          message: MESSAGES.SEND_ANALYSIS_TO_CONTENT,
          analysis: analysis
        });
      })
      .catch(error => {
         // Send an error back
         chrome.tabs.sendMessage(sender.tab.id, {
            message: MESSAGES.SEND_ANALYSIS_TO_CONTENT,
            analysis: { error: error.message }
        });
      });
    return true; 
  }
});