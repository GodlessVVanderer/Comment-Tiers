// FIX: 'LiveSession' is not an exported member of '@google/genai'.
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { encode } from '../audioUtils';

let ai: GoogleGenAI | null = null;

// FIX: Define a local interface for the live session to ensure type safety, as the original type is not exported.
interface LiveSession {
    sendRealtimeInput(input: { media: Blob }): void;
    close(): void;
}
let sessionPromise: Promise<LiveSession> | null = null;

const getAiClient = (apiKey: string): GoogleGenAI => {
    ai = new GoogleGenAI({ apiKey });
    return ai;
};

export const startSession = async (
    apiKey: string,
    callbacks: {
        onMessage: (message: LiveServerMessage) => void;
        onError: (error: ErrorEvent) => void;
        onClose: (event: CloseEvent) => void;
        onOpen: () => void;
    }
): Promise<void> => {
    const aiClient = getAiClient(apiKey);
    
    sessionPromise = aiClient.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
            onopen: callbacks.onOpen,
            onmessage: callbacks.onMessage,
            onerror: callbacks.onError,
            onclose: () => {
                sessionPromise = null;
                callbacks.onClose(new CloseEvent('close'));
            },
        },
        config: {
            responseModalities: [Modality.AUDIO],
            inputAudioTranscription: {},
            outputAudioTranscription: {},
        }
    });
};

export const sendAudio = (audioData: Float32Array) => {
    if (!sessionPromise) {
        console.error("Session not started. Cannot send audio.");
        return;
    }

    const l = audioData.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = audioData[i] * 32768;
    }
    const pcmBlob: Blob = {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
    
    sessionPromise.then(session => {
        session.sendRealtimeInput({ media: pcmBlob });
    });
};

export const closeSession = () => {
    if (sessionPromise) {
        sessionPromise.then(session => {
            session.close();
        });
        sessionPromise = null;
    }
};
