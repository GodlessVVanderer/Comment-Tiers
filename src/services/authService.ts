// Fix: Add reference to chrome types to resolve "Cannot find name 'chrome'" error.
/// <reference types="chrome" />
// src/services/authService.ts

export async function signIn(): Promise<string | null> {
    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
                return;
            }
            resolve(token ?? null);
        });
    });
}

export async function getProfile(): Promise<{ email: string } | null> {
    return new Promise((resolve, reject) => {
        chrome.identity.getProfileUserInfo({ accountStatus: 'ANY' }, (userInfo) => {
            if (chrome.runtime.lastError) {
                // Not necessarily an error, user might just not be signed in
                resolve(null);
                return;
            }
            resolve(userInfo);
        });
    });
}

export async function checkAuthStatus(): Promise<boolean> {
    const token = await new Promise<string | undefined>((resolve) => {
        chrome.identity.getAuthToken({ interactive: false }, (token) => {
            // Check lastError to see if the user is not signed in.
            if (chrome.runtime.lastError) {
                resolve(undefined);
            } else {
                resolve(token);
            }
        });
    });
    return !!token;
}