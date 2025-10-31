import { Blob, GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { encode } from '@/audioUtils';

let sessionPromise: Promise<any> | null = null;
const aiStore: { ai: GoogleGenAI | null } = { ai: null };

function getAi(apiKey: string) {
    if (!aiStore.ai) {
        aiStore.ai = new GoogleGenAI({ apiKey });
    }
    return aiStore.ai;
}

export const startLiveConversation = (apiKey: string, callbacks: {
    onOpen: () => void;
    onMessage: (message: LiveServerMessage) => void;
    onError: (e: ErrorEvent) => void;
    onClose: (e: CloseEvent) => void;
}) => {
    const ai = getAi(apiKey);
    sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
            onopen: callbacks.onOpen,
            onmessage: callbacks.onMessage,
            onerror: callbacks.onError,
            onclose: () => {
                sessionPromise = null;
                aiStore.ai = null;
                callbacks.onClose(new CloseEvent('close'));
            },
        },
        config: {
            responseModalities: [Modality.AUDIO],
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
            },
        },
    });
};

export const stopLiveConversation = () => {
    if (sessionPromise) {
        sessionPromise.then(session => {
            session.close();
        }).catch(e => console.error("Error closing session:", e));
        sessionPromise = null;
        aiStore.ai = null;
    }
};

function createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
}

export const sendAudio = (data: Float32Array) => {
    if (sessionPromise) {
        const pcmBlob = createBlob(data);
        sessionPromise.then(session => {
            session.sendRealtimeInput({ media: pcmBlob });
        });
    }
};
