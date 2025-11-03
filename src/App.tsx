// Fix: Add reference to chrome types to resolve "Cannot find name 'chrome'" error.
/// <reference types="chrome" />
import React from 'react';
import { useStore } from './store';
import IdlePanel from './components/panels/IdlePanel';
import LoadingPanel from './components/panels/LoadingPanel';
import ResultsPanel from './components/panels/ResultsPanel';
import ErrorPanel from './components/panels/ErrorPanel';
import ConfigErrorPanel from './components/panels/ConfigErrorPanel';
import { getYouTubeVideoId } from './utils';
import { analyzeComments } from './actions'; // Assuming actions file for logic
import SignInPanel from './components/panels/SignInPanel';
import { checkAuthStatus, signIn } from './services/authService';

const App: React.FC = () => {
    const { status, analysisResult, error, reset, setStatus, setError } = useStore();
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        // Check for API keys on load
        Promise.all([
            chrome.storage.local.get("geminiApiKey"),
            chrome.storage.local.get("youtubeApiKey"),
        ]).then(([geminiRes, youtubeRes]) => {
            if (!geminiRes.geminiApiKey || !youtubeRes.youtubeApiKey) {
                setStatus('config_error');
            }
        });
        
        checkAuthStatus().then(isAuthenticated => {
            if(!isAuthenticated) {
                setStatus('unauthenticated');
            }
        });

    }, [setStatus]);

    const handleAnalyze = async () => {
        setIsLoading(true);
        setStatus('loading');
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const url = tabs[0]?.url;
            if (url) {
                const videoId = getYouTubeVideoId(url);
                if (videoId) {
                    await analyzeComments(videoId); // This is a conceptual action
                } else {
                    setError("Not a valid YouTube video page.");
                }
            } else {
                setError("Could not get current tab URL.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignIn = async () => {
        try {
            await signIn();
            setStatus('idle');
        } catch (error) {
            setError('Sign-in failed. Please try again.');
        }
    }

    const renderPanel = () => {
        switch (status) {
            case 'idle':
                return <IdlePanel onAnalyze={handleAnalyze} isLoading={isLoading} />;
            case 'loading':
                return <LoadingPanel />;
            case 'success':
                return analysisResult ? <ResultsPanel result={analysisResult} /> : <ErrorPanel error="Analysis complete but no result found." onRetry={reset} />;
            case 'error':
                return <ErrorPanel error={error} onRetry={reset} />;
            case 'config_error':
                return <ConfigErrorPanel />;
            case 'unauthenticated':
                return <SignInPanel onSignIn={handleSignIn} />;
            default:
                return <IdlePanel onAnalyze={handleAnalyze} isLoading={isLoading} />;
        }
    };

    return (
        <main className="w-[400px] p-4 bg-gray-50 min-h-[300px]">
            <h1 className="text-xl font-bold text-center mb-4">YouTube Comment Analyzer</h1>
            {renderPanel()}
        </main>
    );
};

// Dummy action function
const analyzeComments = async (videoId: string) => {
    console.log(`Analyzing comments for ${videoId}`);
    // In a real app, this would call youtubeService, then geminiService, and update the store.
    return new Promise(resolve => setTimeout(resolve, 2000));
}

export default App;