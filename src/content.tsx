import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';

const injectApp = () => {
    const existingRoot = document.getElementById('youtube-comment-analyzer-root');
    if (existingRoot) {
        return; // App already injected
    }

    const container = document.createElement('div');
    container.id = 'youtube-comment-analyzer-root';

    // This selector targets the area above the comments section on YouTube.
    // It might need updates if YouTube changes its page structure.
    const pivot = document.querySelector('#comments');
    if (pivot) {
        pivot.before(container);
        const root = ReactDOM.createRoot(container);
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
    } else {
        console.warn("Comment Analyzer: Could not find YouTube comments section to attach to.");
    }
};


// Initial injection
injectApp();

// YouTube uses a lot of dynamic navigation (SPA). We need to re-inject the app on navigation.
// We can use a MutationObserver on the body or a more specific element,
// but for simplicity, we'll listen for a custom event or use an interval.
// A more robust solution would observe URL changes.

let lastUrl = location.href; 
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    // URL changed, we might be on a new video page.
    const existingRoot = document.getElementById('youtube-comment-analyzer-root');
    if (existingRoot) {
        existingRoot.remove();
    }
    // Attempt to inject again after a short delay to allow the page to render.
    setTimeout(injectApp, 1000);
  }
}).observe(document.body, {subtree: true, childList: true});
