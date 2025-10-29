import React from 'react';
import ReactDOM from 'react-dom/client';

const Popup = () => {
  return (
    <div style={{ width: 300, padding: 16, backgroundColor: '#1f2937', color: '#d1d5db', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>Comment Analyzer</h1>
      <p style={{ fontSize: 14, color: '#9ca3af', marginTop: '8px' }}>
        Navigate to a YouTube video page. The analysis tool will automatically appear below the video player.
      </p>
      <p style={{ fontSize: 12, color: '#6b7280', marginTop: '16px' }}>
        If it doesn't appear, try refreshing the page. You may need to set your API keys in the extension options.
      </p>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
