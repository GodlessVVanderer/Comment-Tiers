import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';
// @ts-ignore
import styles from './style.css?inline';

const APP_ROOT_ID = 'youtube-comment-analyzer-root';

let root: ReactDOM.Root | null = null;
let appContainer: HTMLElement | null = null;

const mountApp = (target: Element) => {
  if (appContainer) {
    unmountApp();
  }

  appContainer = document.createElement('div');
  appContainer.id = APP_ROOT_ID;
  target.parentElement?.insertBefore(appContainer, target);

  const shadowRoot = appContainer.attachShadow({ mode: 'open' });
  const appRootDiv = document.createElement('div');
  shadowRoot.appendChild(appRootDiv);

  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  shadowRoot.appendChild(styleSheet);

  const videoId = new URLSearchParams(window.location.search).get('v');
  if (videoId) {
    root = ReactDOM.createRoot(appRootDiv);
    root.render(
      <React.StrictMode>
        <App videoId={videoId} />
      </React.StrictMode>
    );
  }
};

const unmountApp = () => {
  if (root) {
    root.unmount();
    root = null;
  }
  if (appContainer) {
    appContainer.remove();
    appContainer = null;
  }
};

const observer = new MutationObserver(() => {
  const commentsHeader = document.querySelector('ytd-comments-header-renderer');
  const existingApp = document.getElementById(APP_ROOT_ID);
  
  if (commentsHeader && !existingApp) {
    mountApp(commentsHeader);
  }
});

const startObserver = () => {
  observer.observe(document.body, { childList: true, subtree: true });
};

// Handle YouTube's SPA navigation
document.addEventListener('yt-navigate-finish', () => {
    unmountApp();
    // A small delay to allow YouTube's new page to render
    setTimeout(() => {
        const commentsHeader = document.querySelector('ytd-comments-header-renderer');
        if(commentsHeader){
            mountApp(commentsHeader);
        }
    }, 500);
});


startObserver();
// Initial check in case the page is already loaded
const initialCommentsHeader = document.querySelector('ytd-comments-header-renderer');
if (initialCommentsHeader) {
    mountApp(initialCommentsHeader);
}
