import React from 'react';
import { AnalysisResult } from '../../types';
import StatsCard from '../StatsCard';
import CategoryAccordion from '../CategoryAccordion';
import ExportControls from '../ExportControls';

interface ResultsPanelProps {
    result: AnalysisResult;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ result }) => {
    const { summary, sentiment, categories, stats } = result;

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-lg font-bold">Analysis Summary</h2>
                <p className="text-sm text-gray-700 mt-2">{summary}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
                <StatsCard title="Positive" value={`${sentiment.positive}%`} />
                <StatsCard title="Negative" value={`${sentiment.negative}%`} />
                <StatsCard title="Neutral" value={`${sentiment.neutral}%`} />
            </div>

            <div>
                <h3 className="font-semibold mt-4 mb-2">Comment Categories</h3>
                <div className="border rounded-md">
                    {categories.map((category, index) => (
                        <CategoryAccordion
                            key={category.name + index}
                            title={category.name}
                            comments={category.comments}
                        />
                    ))}
                </div>
            </div>
            <ExportControls result={result} />
        </div>
    );
};

export default ResultsPanel;
