// FIX: Replaced placeholder text with a functional React component for live conversations.
import React, { useEffect, useState, useRef } from 'react';
import { LiveServerMessage } from '@google/genai';
import { startLiveSession, closeLiveSession, sendAudio } from '../services/liveService';
import { decode, decodeAudioData } from '../audioUtils';

const LiveConversation: React.FC = () => {
    const [isListening, setIsListening] = useState(false);
    const [status, setStatus] = useState('Idle');
    const outputAudioContextRef = useRef<AudioContext | null>(null);

    const handleMessage = async (message: LiveServerMessage) => {
        setStatus('Receiving audio...');
        const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
        if (base64Audio && outputAudioContextRef.current) {
            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current, 24000, 1);
            const source = outputAudioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputAudioContextRef.current.destination);
            source.start();
        }
    };

    const handleError = (error: ErrorEvent) => {
        console.error('Live session error:', error);
        setStatus('Error');
        setIsListening(false);
    };

    const handleClose = (event: CloseEvent) => {
        console.log('Live session closed:', event);
        setStatus('Closed');
        setIsListening(false);
    };
    
    useEffect(() => {
        if (isListening) {
            if (!outputAudioContextRef.current) {
                // FIX: Use `(window as any).webkitAudioContext` for compatibility.
                outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            setStatus('Connecting...');
            startLiveSession({ onMessage: handleMessage, onError: handleError, onClose: handleClose });
            // In a real app, you would start capturing microphone audio and calling sendAudio().
        } else {
            closeLiveSession();
        }

        return () => {
            closeLiveSession();
        };
    }, [isListening]);

    return (
        <div className="p-4 border mt-4">
            <h2 className="font-semibold">Live Conversation</h2>
            <p>Status: {status}</p>
            <button onClick={() => setIsListening(prev => !prev)} className="px-4 py-2 bg-blue-500 text-white rounded mt-2">
                {isListening ? 'Stop Listening' : 'Start Listening'}
            </button>
        </div>
    );
};

export default LiveConversation;
