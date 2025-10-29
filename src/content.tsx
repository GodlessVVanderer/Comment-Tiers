import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import styles from './style.css?inline';

const APP_ID = 'youtube-comment-analyzer-host';
let currentVideoId: string | null = null;
let root: ReactDOM.Root | null = null;
let observer: MutationObserver | null = null;

const getVideoId = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('v');
};

const mountApp = () => {
  const videoId = getVideoId();
  if (!videoId) {
    unmountApp();
    return;
  }
  
  if (videoId === currentVideoId && document.getElementById(APP_ID)) {
    return;
  }
  
  unmountApp();

  const targetElement = document.querySelector('#secondary-inner');
  if (!targetElement) {
    console.warn('Comment Analyzer: Could not find target element to mount app.');
    return;
  }
  
  // Container element that will live on the main page
  const appHost = document.createElement('div');
  appHost.id = APP_ID;

  // Create the Shadow DOM
  const shadowRoot = appHost.attachShadow({ mode: 'open' });
  
  // Create the element for React to mount into
  const appContainer = document.createElement('div');
  shadowRoot.appendChild(appContainer);

  // Inject styles into the Shadow DOM
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  shadowRoot.appendChild(styleElement);

  targetElement.prepend(appHost);

  root = ReactDOM.createRoot(appContainer);
  root.render(
    <React.StrictMode>
      <App videoId={videoId} />
    </React.StrictMode>
  );
  
  currentVideoId = videoId;
};

const unmountApp = () => {
  const existingApp = document.getElementById(APP_ID);
  if (existingApp) {
    if (root) {
        root.unmount();
        root = null;
    }
    existingApp.remove();
    currentVideoId = null;
  }
};

const startObserver = () => {
  // Disconnect any existing observer
  if (observer) observer.disconnect();

  observer = new MutationObserver((mutations) => {
    // We only care that something changed, not what.
    // yt-navigate-finish is more reliable but this is a fallback.
    const newVideoId = getVideoId();
    if (newVideoId !== currentVideoId) {
      mountApp();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

// YouTube uses a single-page app architecture.
// 'yt-navigate-finish' is a custom event fired when a page navigation completes.
document.body.addEventListener('yt-navigate-finish', () => {
    // A small delay can help ensure the page elements are ready.
    setTimeout(mountApp, 500);
});

// Initial mount attempt
setTimeout(mountApp, 1000);
startObserver();