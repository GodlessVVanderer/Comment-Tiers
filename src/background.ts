// FIX: Add chrome declaration to satisfy TypeScript when types are not available.
declare const chrome: any;

/**
 * Listens for messages from other parts of the extension.
 * This is primarily used to allow content scripts to open the extension's options page,
 * as they don't have direct access to the `chrome.runtime.openOptionsPage` API.
 */
chrome.runtime.onMessage.addListener(
  (request: { action: string }, sender: any, sendResponse: (response?: any) => void) => {
    if (request.action === 'openOptionsPage') {
      chrome.runtime.openOptionsPage();
    }
    // Return true to indicate you wish to send a response asynchronously.
    // This is good practice even if you don't send a response.
    return true;
  }
);

/**
 * Optional: Log a message when the extension is installed or updated.
 * This can be useful for debugging or for triggering actions on first install.
 */
chrome.runtime.onInstalled.addListener((details: { reason: string }) => {
  if (details.reason === 'install') {
    console.log('YouTube Comment Analyzer extension has been installed.');
  } else if (details.reason === 'update') {
    console.log('YouTube Comment Analyzer extension has been updated.');
  }
});
