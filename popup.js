// popup.js

import { MESSAGES } from './constants.js';

const authContainer = document.getElementById('auth-container');
const mainContainer = document.getElementById('main-container');
const authButton = document.getElementById('auth-button');
const analyzeButton = document.getElementById('analyze-button');
const userDisplay = document.getElementById('user-display');
const authStatus = document.getElementById('auth-status');

function updateUI(isAuthenticated, userInfo = null) {
    if (isAuthenticated) {
        authContainer.style.display = 'none';
        mainContainer.style.display = 'flex';
        if (userInfo && userInfo.email) {
            userDisplay.textContent = `Signed in as ${userInfo.email}`;
        }
    } else {
        authContainer.style.display = 'flex';
        mainContainer.style.display = 'none';
        authStatus.textContent = "Please sign in to use the extension's full features.";
    }
}

// 1. Initial Check and Status
async function checkAuthStatus() {
    const response = await chrome.runtime.sendMessage({ message: MESSAGES.GET_USER_INFO });
    const userInfo = response ? response.info : null;
    updateUI(!!userInfo, userInfo);
}

// 2. Event Listeners
authButton.addEventListener('click', async () => {
    authStatus.textContent = "Signing in...";
    const response = await chrome.runtime.sendMessage({ message: MESSAGES.AUTHENTICATE });
    if (response && response.token) {
        // Re-check status after successful auth
        await checkAuthStatus();
    } else {
        authStatus.textContent = "Sign in failed. Please try again.";
    }
});

analyzeButton.addEventListener('click', async () => {
    // Send message to Content Script to extract comments and toggle UI
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab && tab.url.includes('youtube.com/watch')) {
        chrome.tabs.sendMessage(tab.id, { message: MESSAGES.TOGGLE_FORUM_UI });
        window.close(); // Close the popup after action is sent
    } else {
        document.getElementById('status').textContent = "Please navigate to a YouTube video page first.";
    }
});

// Start the application
checkAuthStatus();
