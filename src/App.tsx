import React, { useEffect } from 'react';
import { useAppStore } from './store';
import IdlePanel from './components/panels/IdlePanel';
import LoadingPanel from './components/panels/LoadingPanel';
import ResultsPanel from './components/panels/ResultsPanel';
import ErrorPanel from './components/panels/ErrorPanel';
import ConfigErrorPanel from './components/panels/ConfigErrorPanel';
import PricingInfoModal from './components/PricingInfoModal';
import NotificationPermissionBanner from './components/NotificationPermissionBanner';

interface AppProps {
  videoId: string;
}

const App: React.FC<AppProps> = ({ videoId }) => {
    const { 
        status, 
        isPricingModalOpen,
        actions 
    } = useAppStore();

    useEffect(() => {
        actions.setVideoId(videoId);
        actions.checkConfig();
        return () => {
            actions.reset();
        };
    }, [videoId, actions]);

    const renderPanel = () => {
        switch (status) {
            case 'idle':
                return <IdlePanel />;
            case 'loading':
            case 'summarizing':
                return <LoadingPanel />;
            case 'success':
                return <ResultsPanel />;
            case 'error':
                return <ErrorPanel />;
            case 'configuring':
                return <ConfigErrorPanel />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-800 text-gray-300 font-sans p-4 rounded-lg my-4 max-w-4xl mx-auto shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">YouTube Comment Analyzer</h2>
            </div>
            
            <NotificationPermissionBanner />
            
            {renderPanel()}

            {isPricingModalOpen && <PricingInfoModal onClose={actions.togglePricingModal} />}
        </div>
    );
};

export default App;
