// FIX: Add chrome declaration to satisfy TypeScript when types are not available.
declare const chrome: any;

chrome.runtime.onMessage.addListener(
  (request: { action: string }, sender: any, sendResponse: (response?: any) => void) => {
    if (request.action === "openOptionsPage") {
      chrome.runtime.openOptionsPage();
    }
  }
);
