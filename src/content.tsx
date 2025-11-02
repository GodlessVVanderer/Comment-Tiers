/// <reference types="chrome" />

// This script is injected into YouTube pages to interact with the DOM.
console.log("YouTube Comment Analyzer content script loaded.");

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getVideoId") {
        // Simple regex to get video ID from URL
        const videoIdMatch = window.location.search.match(/v=([^&]+)/);
        if (videoIdMatch) {
            sendResponse({ videoId: videoIdMatch[1] });
        } else {
            sendResponse({ videoId: null });
        }
    }
    return true; // Indicates async response
});
