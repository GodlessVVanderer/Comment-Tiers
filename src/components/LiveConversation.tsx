import React from 'react';
// FIX: Update import paths to be relative
import { useAppStore } from '../store';
import {
  MicrophoneIcon,
  StopCircleIcon,
  SpeakerWaveIcon,
} from './Icons';

export const LiveConversation = () => {
  const { liveSession, transcription, startLiveConversation, stopLiveConversation } =
    useAppStore();

  const { isActive, isListening, isSpeaking, statusMessage } = liveSession;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-white mb-2">
        Live Conversation
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        Talk to the AI about the comments. Click "Start" and allow microphone
        access.
      </p>

      <div className="flex items-center gap-4 mb-4">
        {!isActive ? (
          <button
            onClick={startLiveConversation}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600/80 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <MicrophoneIcon className="w-5 h-5" />
            Start Session
          </button>
        ) : (
          <button
            onClick={stopLiveConversation}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600/80 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <StopCircleIcon className="w-5 h-5" />
            Stop Session
          </button>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-400">
            {isSpeaking && <SpeakerWaveIcon className="w-5 h-5 text-blue-400 animate-pulse" />}
            <span>{statusMessage}</span>
        </div>
      </div>

      <div className="h-64 bg-gray-900/50 border border-gray-700 rounded-lg p-3 space-y-3 overflow-y-auto">
        {transcription.map((turn, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              turn.speaker === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-2 rounded-lg text-sm ${
                turn.speaker === 'user'
                  ? 'bg-blue-800 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              <span className="font-bold block capitalize">{turn.speaker}</span>
              {turn.text}
            </div>
          </div>
        ))}
        {transcription.length === 0 && isActive && (
            <div className="text-center text-gray-500 pt-20">
                Start speaking to the AI...
            </div>
        )}
        {transcription.length === 0 && !isActive && (
            <div className="text-center text-gray-500 pt-20">
                Session is not active.
            </div>
        )}
      </div>
    </div>
  );
};
