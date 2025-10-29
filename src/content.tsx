
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';

const APP_ID = 'youtube-comment-analyzer-root';
let currentVideoId: string | null = null;
let root: ReactDOM.Root | null = null;

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
    // App is already mounted for this video
    return;
  }
  
  // Unmount previous instance if video changes
  unmountApp();

  const targetElement = document.querySelector('#secondary-inner');
  if (!targetElement) {
    console.warn('Comment Analyzer: Could not find target element to mount app.');
    return;
  }
  
  const appRootContainer = document.createElement('div');
  appRootContainer.id = APP_ID;
  targetElement.prepend(appRootContainer);

  root = ReactDOM.createRoot(appRootContainer);
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

// Listen for YouTube's custom events that signify page navigation
// 'yt-navigate-finish' is fired when a new "page" loads in the SPA
document.body.addEventListener('yt-navigate-finish', () => {
    // Use a timeout to ensure the new page's DOM is ready
    setTimeout(mountApp, 500);
});

// Initial mount on script injection
mountApp();
