/// <reference types="chrome" />

export const signIn = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
            if (chrome.runtime.lastError || !token) {
                reject(new Error(chrome.runtime.lastError?.message || "Authentication failed."));
            } else {
                resolve(token);
            }
        });
    });
};

export const signOut = (): Promise<void> => {
    return new Promise((resolve) => {
        chrome.identity.getAuthToken({ interactive: false }, (token) => {
            if (token) {
                // To "sign out", we revoke the token.
                const url = `https://accounts.google.com/o/oauth2/revoke?token=${token}`;
                fetch(url).finally(() => {
                     chrome.identity.removeCachedAuthToken({ token }, () => resolve());
                });
            } else {
                resolve();
            }
        });
    });
};

export const checkAuthStatus = (): Promise<string | null> => {
    return new Promise((resolve) => {
        chrome.identity.getAuthToken({ interactive: false }, (token) => {
            if (chrome.runtime.lastError || !token) {
                resolve(null);
            } else {
                resolve(token);
            }
        });
    });
};
