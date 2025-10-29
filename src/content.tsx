import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import styles from './style.css?inline'; // Import styles as a string for injection
import { useAppStore } from './store';

// FIX: Declare chrome for TypeScript
declare const chrome: any;

console.log("YouTube Comment Analyzer: Content script loaded.");

const INJECTION_POINT_ID = 'youtube-comment-analyzer-root';
let reactRoot: ReactDOM.Root | null = null;

const getVideoId = () => new URLSearchParams(window.location.search).get('v');

const injectApp = (videoId: string) => {
  let appContainer = document.getElementById(INJECTION_POINT_ID);
  
  if (appContainer) {
    console.log("YouTube Comment Analyzer: App container already exists.");
    return;
  }
  
  const commentsSection = document.getElementById('comments');
  if (commentsSection) {
    console.log("YouTube Comment Analyzer: Found comments section, injecting app.");
    appContainer = document.createElement('div');
    appContainer.id = INJECTION_POINT_ID;
    
    // Use Shadow DOM for style isolation
    const shadowRoot = appContainer.attachShadow({ mode: 'open' });
    
    const rootDiv = document.createElement('div');
    shadowRoot.appendChild(rootDiv);

    // Inject styles into the Shadow DOM
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    shadowRoot.appendChild(styleEl);

    commentsSection.prepend(appContainer);

    reactRoot = ReactDOM.createRoot(rootDiv);
    reactRoot.render(
      <React.StrictMode>
        <App videoId={videoId} />
      </React.StrictMode>
    );
  } else {
    console.log("YouTube Comment Analyzer: Could not find comments section to inject app.");
  }
};

const unmountApp = () => {
  if (reactRoot) {
    reactRoot.unmount();
    reactRoot = null;
  }
  const appContainer = document.getElementById(INJECTION_POINT_ID);
  if (appContainer) {
    appContainer.remove();
  }
  console.log("YouTube Comment Analyzer: Unmounted existing app instance.");
};

const main = () => {
    let currentVideoId = getVideoId();

    const attemptInjection = () => {
        if (currentVideoId && document.getElementById('comments')) {
            unmountApp(); // Ensure old instance is gone
            injectApp(currentVideoId);
            return true;
        }
        return false;
    };
    
    // Initial injection attempt
    const injectionInterval = setInterval(() => {
        if (attemptInjection()) {
            clearInterval(injectionInterval);
        }
    }, 500);
    setTimeout(() => clearInterval(injectionInterval), 10000); // Stop trying after 10s

    // Listen for navigations within YouTube's SPA
    const titleObserver = new MutationObserver(() => {
        const newVideoId = getVideoId();
        if (newVideoId && newVideoId !== currentVideoId) {
            console.log("YouTube Comment Analyzer: Detected navigation to new video.");
            currentVideoId = newVideoId;
            const newInjectionInterval = setInterval(() => {
                if (attemptInjection()) {
                    clearInterval(newInjectionInterval);
                }
            }, 500);
            setTimeout(() => clearInterval(newInjectionInterval), 10000);
        }
    });

    const titleElement = document.querySelector('title');
    if (titleElement) {
        titleObserver.observe(titleElement, { childList: true });
    }
};

main();

// Listen for messages from other parts of the extension (e.g., options page)
chrome.runtime.onMessage.addListener((request: any) => {
  if (request.action === 'keys-updated') {
    console.log("YouTube Comment Analyzer: Received keys-updated message. Re-initializing store.");
    // Re-initialize the store to fetch the new keys
    useAppStore.getState().initialize();
  }
});