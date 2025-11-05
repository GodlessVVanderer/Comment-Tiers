/// <reference types="chrome" />

import { MESSAGES, GEMINI_API_URL, SYSTEM_INSTRUCTION } from './constants';
import { UserInfo, Comment, AnalysisResult } from './types';

let accessToken: string | null = null;

function clearStaleToken(): Promise<void> {
    return new Promise(resolve => {
        const tokenToRemove = accessToken || "";
        if (chrome.identity && tokenToRemove) {
            chrome.identity.removeCachedAuthToken({ token: tokenToRemove }, () => {
                if (chrome.runtime.lastError) {
                    console.warn("Token clear warning:", chrome.runtime.lastError.message);
                } else {
                    console.log("Stale OAuth token cleared successfully.");
                }
                accessToken = null;
                resolve();
            });
        } else {
            accessToken = null;
            resolve();
        }
    });
}

function authenticateAndGetToken(interactive: boolean = true): Promise<string | null> {
    return new Promise(async (resolve) => {
        if (interactive) {
            await clearStaleToken();
        }
        chrome.identity.getAuthToken({ interactive }, (token) => {
            if (chrome.runtime.lastError || !token) {
                console.error('getAuthToken failed:', chrome.runtime.lastError?.message);
                accessToken = null;
                resolve(null);
                return;
            }
            accessToken = token;
            resolve(token);
        });
    });
}

async function fetchUserInfo(): Promise<UserInfo | null> {
    if (!accessToken) {
        await authenticateAndGetToken(false);
    }
    if (!accessToken) return null;

    try {
        const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        if (response.status === 401) {
            console.log("User info fetch failed with 401, clearing token.");
            await clearStaleToken();
            return null;
        }
        if (!response.ok) {
           throw new Error(`Failed to fetch user info: ${response.statusText}`);
        }
        const data = await response.json();
        return {
            email: data.email || '',
            name: data.name || 'Anonymous',
            picture: data.picture || ''
        };
    } catch (error) {
        console.error("Error fetching user info:", error);
        await clearStaleToken();
        return null;
    }
}

async function analyzeComments(comments: Comment[]): Promise<AnalysisResult | { error: string }> {
  if (!accessToken) {
    await authenticateAndGetToken(false);
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
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            await clearStaleToken();
            return { error: "Authentication expired or invalid. Please sign in again." };
        }
        const errorMessage = data?.error?.message || 'Unknown API error';
        throw new Error(`API call failed: ${errorMessage}`);
    }

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Invalid response structure from API.");
    }

    const jsonText = data.candidates[0].content.parts[0].text;
    const cleanedJsonText = jsonText.replace(/^```json\s*|\s*```\s*$/g, '').trim();
    const analysis = JSON.parse(cleanedJsonText);
    return analysis;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { error: `Gemini API call failed: ${(error as Error).message}` };
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === MESSAGES.AUTHENTICATE) {
    authenticateAndGetToken(true)
      .then(() => fetchUserInfo())
      .then(userInfo => sendResponse({ success: !!userInfo, userInfo }))
      .catch(e => sendResponse({ success: false, error: (e as Error).message }));
    return true;
  }
  
  if (request.message === 'SIGN_OUT') {
    clearStaleToken()
      .then(() => sendResponse({ success: true }))
      .catch(() => sendResponse({ success: false }));
    return true;
  }

  if (request.message === MESSAGES.GET_USER_INFO) {
    fetchUserInfo()
      .then(info => sendResponse({ userInfo: info }))
      .catch(() => sendResponse({ userInfo: null }));
    return true;
  }

  if (request.message === MESSAGES.SEND_COMMENTS_TO_BACKGROUND) {
    analyzeComments(request.comments)
      .then(analysis => {
        if (sender.tab?.id) {
            chrome.tabs.sendMessage(sender.tab.id, {
              message: MESSAGES.SEND_ANALYSIS_TO_CONTENT,
              analysis: analysis
            });
        }
      })
      .catch(error => {
          if (sender.tab?.id) {
              chrome.tabs.sendMessage(sender.tab.id, {
                  message: MESSAGES.SEND_ANALYSIS_TO_CONTENT,
                  analysis: { error: (error as Error).message }
              });
          }
      });
    sendResponse({ success: true });
    return true;
  }
});