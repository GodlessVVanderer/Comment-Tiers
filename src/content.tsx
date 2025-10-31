// FIX: Add chrome type declaration to avoid TypeScript errors in a web extension context.
declare const chrome: any;
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { useStore } from './store';
// Explicitly import styles as a string for Shadow DOM injection
import styles from './style.css?inline';

let mountPoint: HTMLElement | null = null;
let root: ReactDOM.Root | null = null;
let currentVideoId: string | null = null;

const INJECTION_POINT_ID = 'comments';
const APP_ROOT_ID = 'youtube-comment-analyzer-root';

const injectApp = (videoId: string) => {
  if (document.getElementById(APP_ROOT_ID)) {
    return; // Already injected
  }

  const pivot = document.getElementById(INJECTION_POINT_ID);
  if (!pivot) {
    console.error('[Comment Tiers] Could not find injection point #comments.');
    return;
  }

  mountPoint = document.createElement('div');
  mountPoint.id = APP_ROOT_ID;
  pivot.prepend(mountPoint);
  
  const shadowRoot = mountPoint.attachShadow({ mode: 'open' });
  const appContainer = document.createElement('div');
  shadowRoot.appendChild(appContainer);

  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  shadowRoot.appendChild(styleSheet);
  
  root = ReactDOM.createRoot(appContainer);
  root.render(
    <React.StrictMode>
      <App videoId={videoId} />
    </React.StrictMode>
  );
  currentVideoId = videoId;
};

const unmountApp = () => {
  if (root) {
    root.unmount();
    root = null;
  }
  if (mountPoint) {
    mountPoint.remove();
    mountPoint = null;
  }
  currentVideoId = null;
};

const main = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get('v');

  if (videoId) {
    if (videoId !== currentVideoId) {
      unmountApp();
      injectApp(videoId);
    }
  } else {
    unmountApp();
  }
};

// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener((request: any) => {
  if (request.action === 'keys-updated') {
    // Re-initialize the store's state which will trigger a re-render in the App
    useStore.getState().initialize();
  }
});

// Handle YouTube's SPA navigation
const observer = new MutationObserver(() => {
  // A simple check to see if the URL has changed is sufficient for YouTube's navigation
  const urlParams = new URLSearchParams(window.location.search);
  const newVideoId = urlParams.get('v');
  if (newVideoId !== currentVideoId) {
    main();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Initial run
main();