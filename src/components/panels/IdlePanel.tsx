import React from 'react';

interface IdlePanelProps {
  onAnalyze: () => void;
}

const IdlePanel: React.FC<IdlePanelProps> = ({ onAnalyze }) => {
  return (
    <div className="text-center p-8">
      <p className="mb-4">Click the button to analyze comments from this video.</p>
      <button
        onClick={onAnalyze}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md"
      >
        Analyze Comments
      </button>
    </div>
  );
};

export default IdlePanel;
