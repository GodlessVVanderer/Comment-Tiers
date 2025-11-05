/// <reference types="chrome" />

import React from 'react';
import ReactDOM from 'react-dom/client';
import { MESSAGES } from './constants';
import { UserInfo } from './types';
import './styles.css';

const Popup = () => {
    const [userInfo, setUserInfo] = React.useState<UserInfo | null>(null);
    const [status, setStatus] = React.useState({ message: 'Loading...', color: 'grey' });

    React.useEffect(() => {
        chrome.runtime.sendMessage({ message: MESSAGES.GET_USER_INFO }, (response) => {
            updateUI(response?.userInfo);
        });
    }, []);

    const updateUI = (info: UserInfo | null) => {
        if (info && info.email) {
            setUserInfo(info);
            setStatus({ message: 'Ready to analyze comments.', color: 'green' });
        } else {
            setUserInfo(null);
            setStatus({ message: 'Please sign in with Google.', color: 'grey' });
        }
    };

    const handleSignIn = () => {
        setStatus({ message: 'Signing in...', color: 'orange' });
        chrome.runtime.sendMessage({ message: MESSAGES.AUTHENTICATE }, (response) => {
            if (response?.success) {
                setStatus({ message: 'Sign in successful!', color: 'green' });
                updateUI(response.userInfo);
            } else {
                setStatus({ message: 'Sign in failed or was cancelled.', color: 'red' });
            }
        });
    };

    const handleSignOut = () => {
        setStatus({ message: 'Signing out...', color: 'orange' });
        chrome.runtime.sendMessage({ message: 'SIGN_OUT' }, (response) => {
            if (response?.success) {
                setStatus({ message: 'Signed out successfully.', color: 'grey' });
                updateUI(null);
            } else {
                setStatus({ message: 'Sign out failed.', color: 'red' });
            }
        });
    };

    return (
        <div className="popup-container">
            <h1>Gemini Forum Analyzer</h1>
            <div id="status-message" style={{ color: status.color }}>{status.message}</div>
            
            {userInfo ? (
                <div id="analyze-container">
                    <div id="user-info">
                        <span>Signed in as: <strong>{userInfo.email}</strong></span>
                        {userInfo.picture && <img src={userInfo.picture} alt="User profile" />}
                    </div>
                    <button id="sign-out-button" onClick={handleSignOut}>Sign Out</button>
                </div>
            ) : (
                <div id="auth-container">
                    <button id="sign-in-button" onClick={handleSignIn}>
                        <svg aria-hidden="true" className="google-icon" viewBox="0 0 18 18">
                            <path d="M16.51 8.1H8.98v3.2h4.57c-.2 1.18-.86 2.18-1.94 2.83v2.05h2.64c1.55-1.43 2.44-3.61 2.44-6.13z" fill="#4285F4"></path>
                            <path d="M8.98 17c2.43 0 4.47-.8 5.96-2.18l-2.64-2.05c-.8.55-1.84.88-2.9.88-2.23 0-4.14-1.5-4.82-3.52H1.4v2.12C2.92 14.88 5.74 17 8.98 17z" fill="#34A853"></path>
                            <path d="M4.16 10.37c-.18-.55-.28-1.15-.28-1.78s.1-1.23.28-1.78V4.7H1.4C.56 6.33 0 8.1 0 10s.56 3.67 1.4 5.3l2.76-2.12z" fill="#FBBC05"></path>
                            <path d="M8.98 3.5c1.32 0 2.5.45 3.44 1.34l2.34-2.34C13.46.8 11.43 0 8.98 0 5.74 0 2.92 2.12 1.4 5.3l2.76 2.12c.68-2.02 2.59-3.52 4.82-3.52z" fill="#EA4335"></path>
                        </svg>
                        Sign in with Google
                    </button>
                </div>
            )}
        </div>
    );
};

const rootEl = document.getElementById('root');
if (rootEl) {
    const root = ReactDOM.createRoot(rootEl);
    root.render(
      <React.StrictMode>
        <Popup />
      </React.StrictMode>
    );
}