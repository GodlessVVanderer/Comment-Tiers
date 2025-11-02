// FIX: Implemented a placeholder Live service according to Gemini API guidelines to resolve parsing errors.
// FIX: Removed `LiveSession` as it is not an exported member of `@google/genai` and added a local interface.
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from "@google/genai";
import { encode } from "../audioUtils";

interface LiveSession {
    sendRealtimeInput(input: { media: Blob }): void;
    close(): void;
}

let sessionPromise: Promise<LiveSession> | null = null;

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

export function startLiveSession(callbacks: {
    onMessage: (message: LiveServerMessage) => void;
    onError: (error: ErrorEvent) => void;
    onClose: (event: CloseEvent) => void;
}): void {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API key not available");
    }
    const ai = new GoogleGenAI({ apiKey });

    sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
            onopen: () => {
                console.log('Live session opened.');
            },
            onmessage: callbacks.onMessage,
            onerror: callbacks.onError,
            onclose: callbacks.onClose,
        },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
            },
        },
    });
}

export async function sendAudio(audioData: Float32Array): Promise<void> {
    if (!sessionPromise) {
        console.error("Session not started.");
        return;
    }
    const pcmBlob = createBlob(audioData);
    sessionPromise.then((session) => {
        session.sendRealtimeInput({ media: pcmBlob });
    });
}

export async function closeLiveSession(): Promise<void> {
    if (!sessionPromise) {
        return;
    }
    const session = await sessionPromise;
    session.close();
    sessionPromise = null;
    console.log('Live session closed.');
}
