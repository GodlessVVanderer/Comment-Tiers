import React, { useEffect } from 'react';
import { useAppStore, useAuthStore } from './store';
import IdlePanel from './components/panels/IdlePanel';
import LoadingPanel from './components/panels/LoadingPanel';
import ResultsPanel from './components/panels/ResultsPanel';
import ErrorPanel from './components/panels/ErrorPanel';
import ConfigErrorPanel from './components/panels/ConfigErrorPanel';
import SignInPanel from './components/panels/SignInPanel';
import DonationCTA from './components/DonationCTA';

const App: React.FC = () => {
    const { appStatus, analysisResult, error, videoDetails } = useAppStore();
    const { authState, actions: { checkAuthStatus } } = useAuthStore();

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const renderPanel = () => {
        if (authState.status !== 'authenticated') {
            return <SignInPanel />;
        }
        
        switch (appStatus) {
            case 'idle':
                return <IdlePanel />;
            case 'loading':
                return <LoadingPanel />;
            case 'error':
                return <ErrorPanel message={error} />;
            case 'config-error':
                return <ConfigErrorPanel />;
            case 'success':
                if (analysisResult && videoDetails) {
                    return <ResultsPanel result={analysisResult} videoDetails={videoDetails} />;
                }
                return <ErrorPanel message="Analysis successful, but data is missing." />;
            default:
                return <IdlePanel />;
        }
    };

    return (
        <div className="w-[400px] bg-gray-50 p-4 font-sans">
            <header className="mb-4">
                <h1 className="text-xl font-bold text-gray-800">YouTube Comment Analyzer</h1>
            </header>
            <main>
                {renderPanel()}
            </main>
            <footer className="mt-4">
                <DonationCTA />
            </footer>
        </div>
    );
};

export default App;
