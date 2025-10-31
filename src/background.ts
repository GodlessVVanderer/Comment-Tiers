/// <reference types="chrome" />

// This file is the service worker for the extension.
// It runs in the background and handles events.

// A listener for messages from other parts of the extension.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openOptionsPage') {
    chrome.runtime.openOptionsPage();
  }
  return true; // Indicates you wish to send a response asynchronously
});
