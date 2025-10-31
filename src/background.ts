// FIX: Remove reference to chrome types which are unavailable in this environment.
// FIX: Add chrome declaration to satisfy TypeScript when types are not available.
declare const chrome: any;

// FIX: Implement background script to handle opening options page.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openOptionsPage") {
    chrome.runtime.openOptionsPage();
  }
});