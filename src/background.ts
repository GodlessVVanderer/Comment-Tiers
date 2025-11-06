// Fix: Add reference to chrome types to resolve 'chrome' is not defined errors.
/// <reference types="chrome" />

import { MESSAGES, SYSTEM_INSTRUCTION } from './constants';
import { UserInfo, Comment, AnalysisResult } from './types';
// Fix: Import GoogleGenAI to use the Gemini API SDK as per guidelines.
import { GoogleGenAI } from '@google/genai';

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

// Fix: Refactored to use the @google/genai SDK with an API key as per the coding guidelines,
// instead of fetch with an OAuth token.
async function analyzeComments(comments: Comment[]): Promise<AnalysisResult | { error: string }> {
  try {
    // Per instructions, API key must be from process.env.API_KEY and is assumed to be available.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: [{ 
            role: "user",
            parts: [{ text: `Analyze the following YouTube comments for Triage and Thematic Grouping: ${JSON.stringify(comments)}` }] 
        }],
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
        }
    });

    // Per guidelines, use response.text to get the model's output.
    const jsonText = response.text;
    if (!jsonText) {
        throw new Error("Empty response from Gemini API.");
    }
    
    return JSON.parse(jsonText) as AnalysisResult;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return { error: `Gemini API call failed: ${error.message}` };
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
      });
    return true;
  }
});