// FIX: Provide implementation for the content script.
// This script is injected into YouTube pages to add the analysis UI.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const APP_ROOT_ID = 'youtube-comment-analyzer-root';
let currentVideoId: string | null = null;
let appRoot: HTMLDivElement | null = null;
let reactRoot: ReactDOM.Root | null = null;

/**
 * Removes the injected app from the DOM and unmounts the React component.
 */
const cleanup = () => {
  if (reactRoot) {
    reactRoot.unmount();
    reactRoot = null;
  }
  if (appRoot) {
    appRoot.remove();
    appRoot = null;
  }
  currentVideoId = null;
};

/**
 * Injects the React application into the YouTube video page.
 * @param videoId The ID of the YouTube video to analyze.
 */
const injectApp = (videoId: string) => {
  // If we are already displaying the analyzer for this video, do nothing.
  if (currentVideoId === videoId && document.getElementById(APP_ROOT_ID)) {
    return;
  }

  // Clean up any previous instance of the app.
  cleanup();
  
  // Find the injection point below the video player.
  const target = document.querySelector('#below');
  if (!target) {
    // Retry after a short delay, as the page might still be loading.
    setTimeout(() => injectApp(videoId), 500);
    return;
  }
  
  // Create the root element for our app and inject it.
  appRoot = document.createElement('div');
  appRoot.id = APP_ROOT_ID;
  target.prepend(appRoot);
  
  // Render the React app into our root element.
  reactRoot = ReactDOM.createRoot(appRoot);
  reactRoot.render(
    <React.StrictMode>
      <App videoId={videoId} />
    </React.StrictMode>
  );
  
  currentVideoId = videoId;
};

/**
 * Main function to check the current URL and decide whether to inject or clean up the app.
 */
const main = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get('v');
  
  if (window.location.pathname === '/watch' && videoId) {
    injectApp(videoId);
  } else {
    // If we are not on a watch page, ensure the app is removed.
    cleanup();
  }
};

// Initial run when the content script is loaded.
main();

// YouTube is a Single Page Application (SPA). We need to listen for navigation events
// to re-run our injection logic. The 'yt-navigate-finish' event is a reliable way to do this.
window.addEventListener('yt-navigate-finish', main);

// As a fallback, use a MutationObserver to detect URL changes in case the event doesn't fire.
// This is less efficient but more robust.
let lastUrl = location.href; 
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    // Use a small delay to allow the new page content to render.
    setTimeout(main, 100);
  }
}).observe(document.body, { childList: true, subtree: true });
