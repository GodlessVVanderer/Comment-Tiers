// FIX: Add chrome declaration to satisfy TypeScript when types are not available.
declare const chrome: any;

// FIX: Replaced `chrome.runtime.MessageSender` with `any` to resolve a TypeScript error.
chrome.runtime.onMessage.addListener(
  (request: { action: string }, sender: any, sendResponse: (response?: any) => void) => {
    if (request.action === "openOptionsPage") {
      chrome.runtime.openOptionsPage();
    }
    // Return true to indicate you wish to send a response asynchronously.
    return true;
  }
);
