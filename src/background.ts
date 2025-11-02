/// <reference types="chrome" />

console.log("YouTube Comment Analyzer background script loaded.");

// Listener for when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed.');
});

// A listener for messages from other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GREETING') {
    sendResponse({ farewell: 'goodbye' });
  }
  return true; // Keep the message channel open for async response
});
