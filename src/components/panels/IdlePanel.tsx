import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { getYouTubeVideoId } from '../../utils';

const IdlePanel: React.FC = () => {
    const { actions } = useAppStore();
    const [videoUrl, setVideoUrl] = useState('');
    const [error, setError] = useState('');

    const handleAnalyze = () => {
        const videoId = getYouTubeVideoId(videoUrl);
        if (videoId) {
            setError('');
            actions.startAnalysis(videoId);
        } else {
            setError('Please enter a valid YouTube video URL.');
        }
    };

    return (
        <div className="p-4 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Analyze</h3>
            <p className="text-gray-600 mb-4">
                Paste a YouTube video URL below to get started.
            </p>
            <div className="flex flex-col gap-2">
                <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    onClick={handleAnalyze}
                    className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                >
                    Analyze Comments
                </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
};

export default IdlePanel;
