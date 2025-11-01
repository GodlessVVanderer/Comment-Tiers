import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';

const MOUNT_POINT_SELECTOR = '#secondary.style-scope.ytd-watch-flexy';
const APP_CONTAINER_ID = 'youtube-comment-analyzer-root';

let root: ReactDOM.Root | null = null;

const injectApp = () => {
    const mountPoint = document.querySelector(MOUNT_POINT_SELECTOR);

    if (mountPoint && !document.getElementById(APP_CONTAINER_ID)) {
        const appContainer = document.createElement('div');
        appContainer.id = APP_CONTAINER_ID;
        // Inject as the first element in the secondary column
        mountPoint.prepend(appContainer);

        root = ReactDOM.createRoot(appContainer);
        root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
        );
    }
}

const observer = new MutationObserver((mutations, obs) => {
    const mountPoint = document.querySelector(MOUNT_POINT_SELECTOR);
    if(mountPoint) {
        injectApp();
        obs.disconnect();
    }
});

// For YouTube's SPA navigation
let lastUrl = location.href; 
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    // URL has changed, re-check for injection point
    const container = document.getElementById(APP_CONTAINER_ID);
    if (container) {
        root?.unmount();
        container.remove();
    }
    // Delay injection to allow YouTube to render the new page
    setTimeout(injectApp, 1000);
  }
}).observe(document, {subtree: true, childList: true});


injectApp();
