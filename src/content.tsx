// FIX: Implement content script to inject the app into YouTube pages.
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';

const APP_ROOT_ID = 'youtube-comment-analyzer-root';
let currentVideoId: string | null = null;

const injectApp = () => {
    const playerContainer = document.querySelector('#player-container.ytd-watch-flexy');
    const existingRoot = document.getElementById(APP_ROOT_ID);
  
    if (playerContainer && !existingRoot) {
      const appRoot = document.createElement('div');
      appRoot.id = APP_ROOT_ID;
      playerContainer.parentNode?.insertBefore(appRoot, playerContainer.nextSibling);
  
      const root = ReactDOM.createRoot(appRoot);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    }
}

// Initial injection
setTimeout(injectApp, 1000);


// Observe for SPA navigation
const observer = new MutationObserver(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('v');

    if (videoId !== currentVideoId) {
        currentVideoId = videoId;
        const existingRoot = document.getElementById(APP_ROOT_ID);
        if(existingRoot) {
            existingRoot.remove();
        }
        if(videoId) {
            // Wait for the page to likely have the player container
            setTimeout(injectApp, 1000);
        }
    }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
