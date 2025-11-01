import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
// FIX: Use relative path for module import.
import { encode, decode, decodeAudioData } from '../audioUtils';
// FIX: Use relative path for module import.
import { LiveSessionStatus, TranscriptionTurn } from '../types';

let sessionPromise: Promise<any> | null = null;
let inputAudioContext: AudioContext | null = null;
let outputAudioContext: AudioContext | null = null;
let scriptProcessor: ScriptProcessorNode | null = null;
let mediaStreamSource: MediaStreamAudioSourceNode | null = null;
let stream: MediaStream | null = null;
let nextStartTime = 0;
const sources = new Set<AudioBufferSourceNode>();

interface LiveCallbacks {
  onTranscriptionUpdate: (turn: TranscriptionTurn) => void;
  onStatusUpdate: (status: LiveSessionStatus) => void;
  onError: (error: string) => void;
}

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

export const startSession = async (apiKey: string, callbacks: LiveCallbacks): Promise<void> => {
    const ai = new GoogleGenAI({ apiKey });
    
    inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    let currentInputTranscription = '';
    let currentOutputTranscription = '';

    try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        sessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            config: {
                responseModalities: [Modality.AUDIO],
                inputAudioTranscription: {},
                outputAudioTranscription: {},
            },
            callbacks: {
                onopen: () => {
                    if (!inputAudioContext || !stream) return;
                    mediaStreamSource = inputAudioContext.createMediaStreamSource(stream);
                    scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
                    
                    scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        const pcmBlob = createBlob(inputData);
                        sessionPromise?.then((session) => {
                          session.sendRealtimeInput({ media: pcmBlob });
                        });
                    };
                    
                    mediaStreamSource.connect(scriptProcessor);
                    scriptProcessor.connect(inputAudioContext!.destination);
                    callbacks.onStatusUpdate('listening');
                },
                onmessage: async (message: LiveServerMessage) => {
                    if (message.serverContent?.inputTranscription) {
                        const text = message.serverContent.inputTranscription.text;
                        currentInputTranscription += text;
                        callbacks.onTranscriptionUpdate({ speaker: 'user', text: currentInputTranscription });
                        callbacks.onStatusUpdate('processing');
                    }
                    if (message.serverContent?.outputTranscription) {
                        const text = message.serverContent.outputTranscription.text;
                        currentOutputTranscription += text;
                        callbacks.onTranscriptionUpdate({ speaker: 'model', text: currentOutputTranscription });
                    }
                    if(message.serverContent?.turnComplete) {
                        currentInputTranscription = '';
                        currentOutputTranscription = '';
                    }

                    const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (base64Audio && outputAudioContext) {
                        callbacks.onStatusUpdate('speaking');
                        nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
                        const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
                        const source = outputAudioContext.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(outputAudioContext.destination);
                        source.addEventListener('ended', () => {
                            sources.delete(source);
                            if(sources.size === 0) {
                                callbacks.onStatusUpdate('listening');
                            }
                        });
                        source.start(nextStartTime);
                        nextStartTime += audioBuffer.duration;
                        sources.add(source);
                    }
                },
                onclose: () => {
                    callbacks.onStatusUpdate('idle');
                },
                onerror: (e) => {
                    console.error('Live session error:', e);
                    callbacks.onError('An error occurred with the live session.');
                    stopSession();
                },
            },
        });
    } catch (error) {
        console.error('Error starting live session:', error);
        callbacks.onError('Could not start microphone. Please grant permission.');
        stopSession();
    }
};

export const stopSession = () => {
    sessionPromise?.then(session => session.close());
    sessionPromise = null;
    
    stream?.getTracks().forEach(track => track.stop());
    stream = null;

    scriptProcessor?.disconnect();
    mediaStreamSource?.disconnect();
    inputAudioContext?.close().catch(console.error);
    outputAudioContext?.close().catch(console.error);
    
    scriptProcessor = null;
    mediaStreamSource = null;
    inputAudioContext = null;
    outputAudioContext = null;

    nextStartTime = 0;
    sources.forEach(s => s.stop());
    sources.clear();
};