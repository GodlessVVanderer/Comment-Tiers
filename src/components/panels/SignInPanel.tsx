// FIX: Replaced placeholder text with a functional React component.
import React from 'react';

interface SignInPanelProps {
    onSignIn: () => void;
}

const SignInPanel: React.FC<SignInPanelProps> = ({ onSignIn }) => {
    return (
        <div className="text-center p-8">
            <h2 className="text-lg font-semibold">Sign In Required</h2>
            <p className="text-gray-600 my-4">Please sign in with your Google account to continue.</p>
            <button 
                onClick={onSignIn}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
            >
                Sign In with Google
            </button>
        </div>
    );
};

export default SignInPanel;
