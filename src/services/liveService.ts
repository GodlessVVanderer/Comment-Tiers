
import { GoogleGenAI, Modality, Blob } from '@google/genai';
import { encode, decode, decodeAudioData } from '../audioUtils';
import { TranscriptionTurn } from '../types';

// The LiveSession type is not exported from the library. Using `any` as a workaround.
let session: any | null = null;
let mediaStream: MediaStream | null = null;
let audioContext: AudioContext | null = null;
let scriptProcessor: ScriptProcessorNode | null = null;
let sourceNode: MediaStreamAudioSourceNode | null = null;

let outputAudioContext: AudioContext | null = null;
let nextStartTime = 0;
const sources = new Set<AudioBufferSourceNode>();

interface LiveCallbacks {
    onListening: () => void;
    onSpeaking: () => void;
    onIdle: () => void;
    onTranscription: (turn: TranscriptionTurn) => void;
    onError: (message: string) => void;
}

export const startLiveSession = async (apiKey: string, callbacks: LiveCallbacks) => {
    if (session) return; // Already started

    try {
        const ai = new GoogleGenAI({ apiKey });
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        nextStartTime = 0;

        let currentInputTranscription = '';
        let currentOutputTranscription = '';

        const sessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            callbacks: {
                onopen: () => {
                    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                    sourceNode = audioContext.createMediaStreamSource(mediaStream!);
                    scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);

                    scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        
                        const l = inputData.length;
                        const int16 = new Int16Array(l);
                        for (let i = 0; i < l; i++) {
                            int16[i] = inputData[i] * 32768;
                        }

                        const pcmBlob: Blob = {
                            data: encode(new Uint8Array(int16.buffer)),
                            mimeType: 'audio/pcm;rate=16000',
                        };
                        sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
                    };
                    sourceNode.connect(scriptProcessor);
                    scriptProcessor.connect(audioContext.destination);
                    callbacks.onListening();
                },
                onmessage: async (message) => {
                    if (message.serverContent?.outputTranscription) {
                        currentOutputTranscription += message.serverContent.outputTranscription.text;
                    } else if (message.serverContent?.inputTranscription) {
                        currentInputTranscription += message.serverContent.inputTranscription.text;
                    }

                    if (message.serverContent?.turnComplete) {
                        if (currentInputTranscription) callbacks.onTranscription({ speaker: 'user', text: currentInputTranscription });
                        if (currentOutputTranscription) callbacks.onTranscription({ speaker: 'model', text: currentOutputTranscription });
                        currentInputTranscription = '';
                        currentOutputTranscription = '';
                    }

                    const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (base64Audio && outputAudioContext) {
                        callbacks.onSpeaking();
                        nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
                        const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
                        const source = outputAudioContext.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(outputAudioContext.destination);
                        source.onended = () => {
                            sources.delete(source);
                            if (sources.size === 0) callbacks.onIdle();
                        };
                        source.start(nextStartTime);
                        nextStartTime += audioBuffer.duration;
                        sources.add(source);
                    }
                },
                onclose: () => {
                    // FIX: Ensure onIdle callback is called when the session closes.
                    callbacks.onIdle();
                },
                onerror: (e: ErrorEvent) => {
                    console.error('Live session error:', e);
                    callbacks.onError('An error occurred with the live session.');
                    stopLiveSession();
                }
            },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                inputAudioTranscription: {},
                outputAudioTranscription: {},
            },
        });

        session = await sessionPromise;

    } catch (error) {
        console.error("Failed to start live session:", error);
        if (error instanceof DOMException && error.name === "NotAllowedError") {
            throw new Error("Microphone permission was denied. Please allow microphone access in your browser settings.");
        }
        throw new Error("Could not start live session.");
    }
};

export const stopLiveSession = () => {
    if (session) {
        session.close();
        session = null;
    }
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }
    if (sourceNode) {
        sourceNode.disconnect();
        sourceNode = null;
    }
    if (scriptProcessor) {
        scriptProcessor.disconnect();
        scriptProcessor = null;
    }
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
    if (outputAudioContext) {
        sources.forEach(source => source.stop());
        sources.clear();
        outputAudioContext.close();
        outputAudioContext = null;
    }
};
