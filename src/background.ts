// Fix: Add reference to chrome types to resolve "Cannot find name 'chrome'" error.
/// <reference types="chrome" />
// src/background.ts
console.log("Background script running.");

chrome.runtime.onInstalled.addListener(() => {
    console.log("YouTube Comment Analyzer installed.");
});

// Example of a listener for messages from content scripts or popups
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "analyzeComments") {
        console.log("Received request to analyze comments for video:", request.videoId);
        // Here you would trigger the analysis logic.
        // This is often done in the background script to handle long-running tasks.
        sendResponse({ status: "Analysis started" });
    }
    return true; // Indicates that the response is sent asynchronously
});