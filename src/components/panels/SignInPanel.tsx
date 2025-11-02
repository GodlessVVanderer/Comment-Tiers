/// <reference types="chrome" />

import React from 'react';
import { useAuthStore } from '../../store';
import { GoogleIcon } from '../Icons';

const SignInPanel = () => {
  const { authState, actions } = useAuthStore();

  const handleSignIn = () => {
    // FIX: Directly call the signIn action from the auth store
    actions.signIn();
  };

  return (
    <div className="text-center p-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Authentication Required</h3>
      <p className="text-gray-600 mb-6">
        Please sign in with your Google account to analyze comments.
      </p>
      <button
        onClick={handleSignIn}
        disabled={authState.status === 'loading'}
        className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400"
      >
        <GoogleIcon />
        <span>
          {authState.status === 'loading' ? 'Signing In...' : 'Sign in with Google'}
        </span>
      </button>
       <p className="text-xs text-gray-500 mt-4">
        This will open a Google authentication window.
      </p>
    </div>
  );
};

export default SignInPanel;
