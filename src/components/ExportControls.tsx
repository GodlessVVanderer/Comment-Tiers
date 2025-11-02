// FIX: Replaced placeholder text with a functional React component.
import React from 'react';
import { AnalysisResult } from '../types';

interface ExportControlsProps {
    result: AnalysisResult | null;
}

const ExportControls: React.FC<ExportControlsProps> = ({ result }) => {
    const handleExport = (format: 'json' | 'csv') => {
        if (!result) return;
        console.log(`Exporting to ${format}:`, result);
        // In a real app, this would trigger a file download.
        alert(`Exporting as ${format.toUpperCase()}... (Check console)`);
    };

    return (
        <div className="p-4 border-t mt-4">
            <h3 className="font-semibold">Export Results</h3>
            <div className="flex gap-2 mt-2">
                <button onClick={() => handleExport('json')} className="px-4 py-2 bg-gray-200 rounded">
                    Export as JSON
                </button>
                <button onClick={() => handleExport('csv')} className="px-4 py-2 bg-gray-200 rounded">
                    Export as CSV
                </button>
            </div>
        </div>
    );
};

export default ExportControls;
