import React from 'react';
import { useStore } from '../store';
import { MicIcon, MicOffIcon, LoaderIcon } from './Icons';

export const LiveConversation: React.FC = () => {
    const { isListening, isConnecting, liveError, transcriptions, startListening, stopListening } = useStore();

    const handleToggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    return (
        <div className="flex flex-col h-[400px] bg-gray-800 rounded-lg p-4">
            <div className="flex-grow overflow-y-auto mb-4 pr-2 space-y-4">
                {transcriptions.length === 0 && !isConnecting && !isListening && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <MicIcon className="w-12 h-12 mb-2" />
                        <p>Click the mic to start a conversation.</p>
                    </div>
                )}
                {transcriptions.map((entry, index) => (
                    <div key={index} className={`flex ${entry.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${entry.speaker === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                           <p className="text-sm">{entry.text}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex-shrink-0 flex flex-col items-center">
                {liveError && <p className="text-red-400 text-sm mb-2">{liveError}</p>}
                <button
                    onClick={handleToggleListening}
                    disabled={isConnecting}
                    className="w-16 h-16 rounded-full flex items-center justify-center transition-colors disabled:opacity-50
                        ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}"
                >
                    {isConnecting ? (
                        <LoaderIcon className="w-8 h-8 text-white animate-spin" />
                    ) : isListening ? (
                        <MicOffIcon className="w-8 h-8 text-white" />
                    ) : (
                        <MicIcon className="w-8 h-8 text-white" />
                    )}
                </button>
            </div>
        </div>
    );
};
