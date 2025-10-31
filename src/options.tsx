import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { useAppStore } from './store';
import './style.css';
import ApiKeyHelpModal from './components/ApiKeyHelpModal';
import GeminiApiKeyHelpModal from './components/GeminiApiKeyHelpModal';

const Options = () => {
  const { 
    youtubeApiKey, 
    geminiApiKey,
    isHelpModalOpen,
    isGeminiHelpModalOpen,
    actions 
  } = useAppStore();

  // Temporary local state for input fields
  const [localYoutubeKey, setLocalYoutubeKey] = React.useState(youtubeApiKey || '');
  const [localGeminiKey, setLocalGeminiKey] = React.useState(geminiApiKey || '');
  const [saved, setSaved] = React.useState(false);

  // Sync local state when persisted state loads
  useEffect(() => {
    setLocalYoutubeKey(youtubeApiKey || '');
    setLocalGeminiKey(geminiApiKey || '');
  }, [youtubeApiKey, geminiApiKey]);

  const handleSave = () => {
    actions.setYoutubeApiKey(localYoutubeKey);
    actions.setGeminiApiKey(localGeminiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="w-[500px] p-6 bg-gray-900 text-gray-300 font-sans">
      <h1 className="text-2xl font-bold text-white mb-4">Settings</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">YouTube API Key</label>
          <input
            type="password"
            value={localYoutubeKey}
            onChange={(e) => setLocalYoutubeKey(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-sm"
          />
           <button onClick={actions.toggleHelpModal} className="text-xs text-blue-400 hover:underline mt-1">
            How to get a YouTube API key?
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Gemini API Key</label>
          <input
            type="password"
            value={localGeminiKey}
            onChange={(e) => setLocalGeminiKey(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-sm"
          />
           <button onClick={actions.toggleGeminiHelpModal} className="text-xs text-blue-400 hover:underline mt-1">
            How to get a Gemini API key?
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center">
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Save Keys
        </button>
        {saved && <span className="ml-4 text-green-400 text-sm">Settings saved!</span>}
      </div>
      
      {isHelpModalOpen && <ApiKeyHelpModal onClose={actions.toggleHelpModal} />}
      {isGeminiHelpModalOpen && <GeminiApiKeyHelpModal onClose={actions.toggleGeminiHelpModal} />}
    </div>
  );
};

const initialize = () => {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
        throw new Error("Could not find root element to mount to");
    }
    const root = ReactDOM.createRoot(rootElement);

    root.render(
        <React.StrictMode>
            <Options />
        </React.StrictMode>
    );
};

// Use DOMContentLoaded to ensure the script runs after the DOM is ready.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}
