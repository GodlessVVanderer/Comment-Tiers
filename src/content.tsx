// FIX: Add chrome type declaration to fix build errors due to missing @types/chrome.
declare const chrome: any;

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { INJECTION_ROOT_ID } from './constants';
import { useAppStore } from './store';
import styles from './style.css?inline';

let root: ReactDOM.Root | null = null;
let container: HTMLDivElement | null = null;
let currentVideoId: string | null = null;

const mountApp = (target: Element, videoId: string) => {
  if (container) return; // Already mounted

  container = document.createElement('div');
  container.id = INJECTION_ROOT_ID;
  target.parentElement?.insertBefore(container, target);

  const shadowRoot = container.attachShadow({ mode: 'open' });
  const appRoot = document.createElement('div');
  shadowRoot.appendChild(appRoot);

  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  shadowRoot.appendChild(styleSheet);
  
  root = ReactDOM.createRoot(appRoot);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  useAppStore.getState().initialize(videoId);
};

const unmountApp = () => {
  if (root) {
    root.unmount();
    root = null;
  }
  if (container) {
    container.remove();
    container = null;
  }
  useAppStore.getState().reset();
};

const observer = new MutationObserver(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const videoIdOnPage = urlParams.get('v');
  
  if (videoIdOnPage !== currentVideoId) {
    currentVideoId = videoIdOnPage;
    unmountApp(); // Unmount on navigation
  }

  const commentsElement = document.querySelector('#comments');

  if (commentsElement && currentVideoId) {
    if (!container) { // If app is not on page, mount it
      mountApp(commentsElement, currentVideoId);
    }
  } else {
    if (container) { // If app is on page but shouldn't be, unmount it
      unmountApp();
    }
  }
});

const startObserver = () => {
    observer.observe(document.body, { childList: true, subtree: true });
};

const retryInjection = (retries = 20, delay = 500) => {
  const commentsElement = document.querySelector('#comments');
  currentVideoId = new URLSearchParams(window.location.search).get('v');

  if (commentsElement && currentVideoId) {
    mountApp(commentsElement, currentVideoId);
    startObserver();
  } else if (retries > 0) {
    setTimeout(() => retryInjection(retries - 1, delay), delay);
  } else {
    console.error('[Comment Tiers] Could not find YouTube comments section to inject into after 10 seconds.');
    chrome.runtime.sendMessage({ action: 'injection-failed' });
  }
};

// Listen for messages from options page
chrome.runtime.onMessage.addListener(async (request) => {
    if (request.action === 'keys-updated') {
        const videoId = new URLSearchParams(window.location.search).get('v');
        // Re-hydrate the store to get the new keys
        await useAppStore.persist.rehydrate();
        useAppStore.getState().initialize(videoId);
    }
});


retryInjection();