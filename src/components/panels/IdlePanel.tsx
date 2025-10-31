import React, { useState } from 'react';
import { useStore } from '../../store';
import { WandIcon, InformationCircleIcon } from '../Icons';
import { COMMENT_LIMITS } from '../../constants';
import { ApiKeyHelpModal } from '../ApiKeyHelpModal';
import { GeminiApiKeyHelpModal } from '../GeminiApiKeyHelpModal';
import { PricingInfoModal } from '../PricingInfoModal';
import { NotificationPermissionBanner } from '../NotificationPermissionBanner';


interface IdlePanelProps {
    videoId: string;
}

export const IdlePanel: React.FC<IdlePanelProps> = ({ videoId }) => {
    const { startAnalysis, commentLimit, setCommentLimit } = useStore();
    const [showYoutubeHelp, setShowYoutubeHelp] = useState(false);
    const [showGeminiHelp, setShowGeminiHelp] = useState(false);
    const [showPricingInfo, setShowPricingInfo] = useState(false);

    return (
        <div className="flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-white">YouTube Comment Analyzer</h2>
            <p className="text-sm text-gray-400 mt-2 max-w-md">
                Get a quick overview of the comment section. This tool fetches, filters, and uses Gemini to categorize comments, providing you with a summary and insights.
            </p>

            <NotificationPermissionBanner />

            <div className="my-6 w-full max-w-sm">
                <label htmlFor="commentLimit" className="block text-sm font-medium text-gray-300 mb-2">
                    Number of comments to analyze:
                </label>
                <select
                    id="commentLimit"
                    value={commentLimit}
                    onChange={(e) => setCommentLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                >
                    {COMMENT_LIMITS.map(limit => (
                        <option key={limit} value={limit}>
                            Up to {limit.toLocaleString()} comments
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={() => startAnalysis(videoId)}
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
                <WandIcon className="w-5 h-5 mr-2" />
                Analyze Comments
            </button>
            <div className="flex items-center mt-4 text-xs text-gray-500">
                <InformationCircleIcon className="w-4 h-4 mr-1" />
                <button onClick={() => setShowPricingInfo(true)} className="hover:underline">How API usage is billed</button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
                Need help with API keys?
                {' '}
                <button onClick={() => setShowYoutubeHelp(true)} className="text-blue-400 hover:underline">YouTube</button>
                {' / '}
                <button onClick={() => setShowGeminiHelp(true)} className="text-blue-400 hover:underline">Gemini</button>
            </p>

            <ApiKeyHelpModal isOpen={showYoutubeHelp} onClose={() => setShowYoutubeHelp(false)} />
            <GeminiApiKeyHelpModal isOpen={showGeminiHelp} onClose={() => setShowGeminiHelp(false)} />
            <PricingInfoModal isOpen={showPricingInfo} onClose={() => setShowPricingInfo(false)} />
        </div>
    );
};
