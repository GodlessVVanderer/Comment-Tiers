import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { extractVideoId } from './utils';

const APP_CONTAINER_ID = 'youtube-comment-analyzer-root';

let root: ReactDOM.Root | null = null;
let currentVideoId: string | null = null;

const unmountApp = () => {
  if (root) {
    root.unmount();
    root = null;
  }
  const appContainer = document.getElementById(APP_CONTAINER_ID);
  if (appContainer) {
    appContainer.remove();
  }
  currentVideoId = null;
};

const injectApp = (videoId: string) => {
  // If the app is for the same video, do nothing.
  if (document.getElementById(APP_CONTAINER_ID) && currentVideoId === videoId) {
    return;
  }

  // If the video has changed, or the container exists for a different video, unmount first.
  if (document.getElementById(APP_CONTAINER_ID)) {
    unmountApp();
  }

  const commentsContainer = document.querySelector('#comments');
  if (commentsContainer) {
    const appContainer = document.createElement('div');
    appContainer.id = APP_CONTAINER_ID;
    
    // Inject our app before the #comments element.
    commentsContainer.parentElement?.insertBefore(appContainer, commentsContainer);

    root = ReactDOM.createRoot(appContainer);
    root.render(
      <React.StrictMode>
        <App videoId={videoId} />
      </React.StrictMode>
    );
    currentVideoId = videoId;
  }
};

const main = () => {
  // Use a short delay to ensure the page has settled after navigation.
  setTimeout(() => {
    const videoId = extractVideoId(window.location.href);
    if (videoId) {
      injectApp(videoId);
    } else {
      unmountApp();
    }
  }, 500);
};

// Listen for YouTube's custom navigation event. This is more reliable than MutationObserver.
document.body.addEventListener('yt-navigate-finish', main);

// Run on initial page load as well.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
