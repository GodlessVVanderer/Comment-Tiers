import React from 'react';
// FIX: Use relative paths for imports
import { useAppStore } from '../store';
import { MicrophoneIcon, StopCircleIcon, SpeakerWaveIcon } from './Icons';
import { LiveSessionStatus } from '../types';

const statusInfo: Record<LiveSessionStatus, { text: string; icon: React.ReactNode }> = {
  idle: { text: 'Click to start conversation', icon: <MicrophoneIcon /> },
  listening: { text: 'Listening...', icon: <MicrophoneIcon className="h-6 w-6 text-green-400" /> },
  processing: { text: 'Thinking...', icon: <div className="h-6 w-6 rounded-full bg-yellow-400 animate-pulse" /> },
  speaking: { text: 'Speaking...', icon: <SpeakerWaveIcon className="h-6 w-6 text-blue-400 animate-pulse" /> },
};

const LiveConversation: React.FC = () => {
  const { liveSession, actions } = useAppStore();
  const { status, transcription, error } = liveSession;

  const handleToggleSession = () => {
    if (status === 'idle') {
      actions.startLiveSession();
    } else {
      actions.stopLiveSession();
    }
  };

  return (
    <div className="mt-6 border-t border-gray-700 pt-4">
      <h3 className="text-lg font-bold mb-4">Live Conversation</h3>
      <div className="flex items-center gap-4">
        <button
          onClick={handleToggleSession}
          className={`p-3 rounded-full ${status === 'idle' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}
        >
          {status === 'idle' ? <MicrophoneIcon /> : <StopCircleIcon />}
        </button>
        <div className="flex items-center gap-2">
            {statusInfo[status].icon}
            <span className="text-gray-400">{statusInfo[status].text}</span>
        </div>
      </div>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      <div className="mt-4 p-4 bg-gray-900 rounded-md h-48 overflow-y-auto space-y-2">
        {transcription.map((turn, index) => (
            <div key={index} className={`text-sm ${turn.speaker === 'user' ? 'text-gray-300' : 'text-blue-300'}`}>
                <span className="font-bold capitalize">{turn.speaker}: </span>
                <span>{turn.text}</span>
            </div>
        ))}
         {transcription.length === 0 && <p className="text-gray-500 text-sm">Conversation will appear here...</p>}
      </div>
    </div>
  );
};

export default LiveConversation;
