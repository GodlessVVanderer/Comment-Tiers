import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  AnalysisResult,
  AppStatus,
  Comment,
  ProgressUpdate,
  TranscriptionEntry,
  View,
  AppError,
} from '@/types';
import { fetchComments } from '@/services/youtubeService';
import { analyzeComments } from '@/services/geminiService';
import { startLiveConversation, stopLiveConversation, sendAudio } from '@/services/liveService';
import { LiveServerMessage } from '@google/genai';
import { decode, decodeAudioData } from '@/audioUtils';

// For background script communication
declare const chrome: any;

interface AppState {
  youtubeApiKey: string | null;
  geminiApiKey: string | null;
  status: AppStatus;
  error: AppError | null;
  analysisResult: AnalysisResult | null;
  progress: ProgressUpdate | null;
  view: View;
  
  // Live conversation state
  isListening: boolean;
  isConnecting: boolean;
  liveError: string | null;
  transcriptions: TranscriptionEntry[];

  // Config
  commentLimit: number;
  targetLanguage: string;

  // Actions
  initialize: () => void;
  setYoutubeApiKey: (key: string) => void;
  setGeminiApiKey: (key: string) => void;
  setView: (view: View) => void;
  setCommentLimit: (limit: number) => void;
  startAnalysis: (videoId: string) => Promise<void>;
  reset: () => void;
  addReply: (path: string, text: string) => void;
  editComment: (path: string, newText: string) => void;
  addComment: (categoryName: string, text: string) => void;
  
  // Live conversation actions
  startListening: () => void;
  stopListening: () => void;
}

// Live conversation audio resources
let inputAudioContext: AudioContext | null = null;
let outputAudioContext: AudioContext | null = null;
let mediaStream: MediaStream | null = null;
let scriptProcessor: ScriptProcessorNode | null = null;
let nextStartTime = 0;
const sources = new Set<AudioBufferSourceNode>();


export const useStore = create<AppState>()(
  persist(
    immer((set, get) => ({
      youtubeApiKey: null,
      geminiApiKey: null,
      status: 'idle',
      error: null,
      analysisResult: null,
      progress: null,
      view: 'stats',
      isListening: false,
      isConnecting: false,
      liveError: null,
      transcriptions: [],
      commentLimit: 5000,
      targetLanguage: navigator.language || 'en',

      initialize: () => {
        chrome.storage.local.get(['youtubeApiKey', 'geminiApiKey'], (result: any) => {
          set((state) => {
            state.youtubeApiKey = result.youtubeApiKey || null;
            state.geminiApiKey = result.geminiApiKey || null;
            if (!state.youtubeApiKey || !state.geminiApiKey) {
              state.status = 'configuring';
            }
          });
        });
      },

      setYoutubeApiKey: (key) => {
        set({ youtubeApiKey: key });
        chrome.storage.local.set({ youtubeApiKey: key }, () => {
          // Notify content script of key update
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
            if (tabs[0]?.id) {
              chrome.tabs.sendMessage(tabs[0].id, { action: 'keys-updated' });
            }
          });
        });
      },

      setGeminiApiKey: (key) => {
        set({ geminiApiKey: key });
        chrome.storage.local.set({ geminiApiKey: key }, () => {
          // Notify content script of key update
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
            if (tabs[0]?.id) {
              chrome.tabs.sendMessage(tabs[0].id, { action: 'keys-updated' });
            }
          });
        });
      },
      
      setView: (view) => set({ view }),
      setCommentLimit: (limit) => set({ commentLimit: limit }),

      reset: () => {
        set({
          status: 'idle',
          error: null,
          analysisResult: null,
          progress: null,
          view: 'stats',
        });
      },

      startAnalysis: async (videoId) => {
        const { youtubeApiKey, geminiApiKey, commentLimit, targetLanguage } = get();
        if (!youtubeApiKey || !geminiApiKey) {
          set({ status: 'configuring', error: null });
          return;
        }

        set({ status: 'fetching', error: null, progress: { percentage: 0 } });
        
        try {
          // 1. Fetch comments
          const allComments = await fetchComments(
            videoId,
            youtubeApiKey,
            (percentage) => set((state) => { if (state.progress) state.progress.percentage = percentage; }),
            commentLimit
          );

          set({ status: 'filtering', progress: null });
          
          // 2. Prefilter comments in background script
          const { filteredComments, totalFiltered } = await new Promise<{ filteredComments: Comment[], totalFiltered: number }>(resolve => {
            chrome.runtime.sendMessage(
              { action: 'prefilter-comments', payload: { comments: allComments } },
              (response: any) => resolve(response)
            );
          });
          
          if (filteredComments.length === 0) {
            throw { code: 'NO_COMMENTS', message: 'No comments found after filtering.' };
          }
          
          set({ status: 'analyzing', progress: { percentage: 0 } });
          
          // 3. Analyze comments
          const result = await analyzeComments(
            filteredComments,
            geminiApiKey,
            (update) => set({ progress: update }),
            targetLanguage
          );

          result.stats.totalComments = allComments.length;
          result.stats.filteredComments = totalFiltered;

          set({ status: 'success', analysisResult: result, progress: null });

          // Send notification
          if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            new Notification('Comment Analysis Complete', {
              body: `Successfully analyzed ${result.stats.analyzedComments} comments for the video.`,
              icon: '/icon48.png'
            });
          }

        } catch (e: any) {
          const errorCode = e.message;
          let errorMessage = 'An unknown error occurred.';
          
          const errorMap: Record<string, string> = {
            YOUTUBE_QUOTA_EXCEEDED: 'YouTube API quota exceeded. Please try again later.',
            YOUTUBE_COMMENTS_DISABLED: 'Comments are disabled for this video.',
            YOUTUBE_INVALID_KEY: 'Your YouTube API key is invalid. Please check it in the options.',
            GEMINI_INVALID_KEY: 'Your Gemini API key is invalid. Please check it in the options.',
            YOUTUBE_VIDEO_NOT_FOUND: 'The video was not found.',
            NO_COMMENTS: 'No relevant comments were found to analyze for this video.',
          };
          
          if (errorMap[errorCode]) {
            errorMessage = errorMap[errorCode];
          } else if (typeof e.message === 'string') {
            errorMessage = e.message;
          }

          set({ status: 'error', error: { code: errorCode, message: errorMessage } });
        }
      },

      addReply: (path, text) => {
        set((state) => {
          if (!state.analysisResult) return;
          const pathParts = path.split(':');
          const categoryName = pathParts[0];
          
          let currentLevel: any = state.analysisResult.categories.find(c => c.name === categoryName);
          if (!currentLevel) return;

          for (let i = 1; i < pathParts.length; i += 2) {
              const key = pathParts[i]; // 'comments' or 'replies'
              const index = parseInt(pathParts[i + 1]);
              if (key === 'comments') {
                  currentLevel = currentLevel.comments[index];
              } else if (key === 'replies') {
                  currentLevel = currentLevel.replies[index];
              }
          }

          if (!currentLevel.replies) {
              currentLevel.replies = [];
          }
          
          const newReply: Comment = {
            id: `local-reply-${Date.now()}`,
            author: 'You',
            authorProfileImageUrl: '/icon48.png',
            text,
            publishedAt: new Date().toISOString(),
            likeCount: 0,
            replyCount: 0,
            isEditable: true,
          };
          currentLevel.replies.push(newReply);
        });
      },

      editComment: (path, newText) => {
        set(state => {
            if (!state.analysisResult) return;
            const pathParts = path.split(':');
            const categoryName = pathParts[0];

            let currentLevel: any = state.analysisResult.categories.find(c => c.name === categoryName);
            if (!currentLevel) return;

            for (let i = 1; i < pathParts.length; i += 2) {
                const key = pathParts[i]; // 'comments' or 'replies'
                const index = parseInt(pathParts[i+1]);
                if (key === 'comments') {
                    currentLevel = currentLevel.comments[index];
                } else if (key === 'replies') {
                    currentLevel = currentLevel.replies[index];
                }
            }
            if (currentLevel) {
                currentLevel.text = newText;
            }
        });
      },

      addComment: (categoryName, text) => {
        set(state => {
            if (!state.analysisResult) return;
            const category = state.analysisResult.categories.find(c => c.name === categoryName);
            if (category) {
                const newComment: Comment = {
                    id: `local-comment-${Date.now()}`,
                    author: 'You',
                    authorProfileImageUrl: '/icon48.png',
                    text,
                    publishedAt: new Date().toISOString(),
                    likeCount: 0,
                    replyCount: 0,
                    isEditable: true,
                    replies: [],
                };
                category.comments.unshift(newComment); // Add to the top
            }
        });
      },

      startListening: async () => {
        const { geminiApiKey } = get();
        if (!geminiApiKey) {
            set({ liveError: 'Gemini API key is not set.' });
            return;
        }

        if (get().isListening) return;
        set({ isConnecting: true, liveError: null, transcriptions: [] });

        try {
            mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            startLiveConversation(geminiApiKey, {
                onOpen: () => {
                    set({ isConnecting: false, isListening: true });
                    // Setup audio processing
                    inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                    outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                    nextStartTime = 0;
                    
                    const source = inputAudioContext.createMediaStreamSource(mediaStream!);
                    scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
                    scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        sendAudio(inputData);
                    };
                    source.connect(scriptProcessor);
                    scriptProcessor.connect(inputAudioContext.destination);
                },
                onMessage: async (message: LiveServerMessage) => {
                    // Handle transcription
                    if (message.serverContent?.inputTranscription) {
                        const text = message.serverContent.inputTranscription.text;
                        set(state => {
                           const last = state.transcriptions[state.transcriptions.length - 1];
                           if (last && last.speaker === 'user' && !message.serverContent?.turnComplete) {
                               last.text += text;
                           } else {
                               state.transcriptions.push({ speaker: 'user', text });
                           }
                        });
                    }
                    if (message.serverContent?.outputTranscription) {
                        const text = message.serverContent.outputTranscription.text;
                         set(state => {
                           const last = state.transcriptions[state.transcriptions.length - 1];
                           if (last && last.speaker === 'model' && !message.serverContent?.turnComplete) {
                               last.text += text;
                           } else {
                               state.transcriptions.push({ speaker: 'model', text });
                           }
                        });
                    }

                    // Handle audio playback
                    const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                    if (base64Audio && outputAudioContext) {
                        nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
                        const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
                        const source = outputAudioContext.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(outputAudioContext.destination);
                        source.addEventListener('ended', () => sources.delete(source));
                        source.start(nextStartTime);
                        nextStartTime += audioBuffer.duration;
                        sources.add(source);
                    }
                     if (message.serverContent?.interrupted) {
                        for (const source of sources.values()) {
                            source.stop();
                            sources.delete(source);
                        }
                        nextStartTime = 0;
                    }
                },
                onError: (e) => {
                    console.error('Live conversation error:', e);
                    set({ isConnecting: false, isListening: false, liveError: 'Connection error. Please try again.' });
                    get().stopListening();
                },
                onClose: () => {
                    set({ isConnecting: false, isListening: false });
                },
            });

        } catch (err) {
            console.error('Error starting microphone:', err);
            set({ isConnecting: false, liveError: 'Could not access microphone.' });
        }
      },

      stopListening: () => {
        stopLiveConversation();
        mediaStream?.getTracks().forEach(track => track.stop());
        scriptProcessor?.disconnect();
        inputAudioContext?.close();
        outputAudioContext?.close();

        mediaStream = null;
        scriptProcessor = null;
        inputAudioContext = null;
        outputAudioContext = null;
        nextStartTime = 0;
        sources.clear();
        
        set({ isListening: false, isConnecting: false });
      },

    })),
    {
      name: 'comment-analyzer-storage',
      storage: createJSONStorage(() => ({
        // Use chrome.storage.local for persistence in the extension
        getItem: (name) =>
          new Promise((resolve) => {
            chrome.storage.local.get([name], (result: any) => {
              resolve(result[name] ? JSON.stringify(result[name]) : null);
            });
          }),
        setItem: (name, value) =>
          new Promise<void>((resolve) => {
            chrome.storage.local.set({ [name]: JSON.parse(value) }, () => {
              resolve();
            });
          }),
        removeItem: (name) =>
          new Promise<void>((resolve) => {
            chrome.storage.local.remove([name], () => {
              resolve();
            });
          }),
      })),
      // Only persist API keys and settings, not transient state
      partialize: (state) => ({ 
        youtubeApiKey: state.youtubeApiKey,
        geminiApiKey: state.geminiApiKey,
        commentLimit: state.commentLimit
      }),
    }
  )
);
