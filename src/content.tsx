/// <reference types="chrome" />

import React from 'react';
import ReactDOM from 'react-dom/client';
import { MESSAGES } from './constants';
import { AnalysisResult, Comment as RawComment, UserInfo } from './types';

// NOTE: In a real app, this large component would be broken down into smaller,
// more manageable components (e.g., Forum, ThematicGroup, Reply, etc.).
const ForumApp = ({ analysis, originalComments, userInfo }: { analysis: AnalysisResult, originalComments: RawComment[], userInfo: UserInfo | null }) => {
    // This is a placeholder for the full forum UI.
    // A complete implementation would have state for replies, edits, sorting, etc.
    return (
        <div id="gemini-forum-container">
            <div className="forum-header">
                <h1>Gemini Analysis Summary</h1>
                <p>Processed {analysis.triage.total_processed} comments.</p>
            </div>
            <div className="thematic-groups-container">
                {analysis.thematic_groups.map((group, index) => (
                    <div key={index} className="thematic-group">
                        <div className="thread-header">
                            {group.theme_title}
                        </div>
                        <div className="thread-body">
                            <p><strong>Summary:</strong> {group.summary}</p>
                            <p><strong>Related Comments:</strong> {group.comment_ids.length}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const APP_ROOT_ID = 'gemini-forum-react-root';
let appRoot: HTMLElement | null = null;
let reactRoot: ReactDOM.Root | null = null;
let analysisCache: AnalysisResult | null = null;
let commentsCache: RawComment[] = [];
let userInfoCache: UserInfo | null = null;
let forumVisible = false;

function injectReactApp(analysis: AnalysisResult, comments: RawComment[], userInfo: UserInfo | null) {
    const nativeComments = document.getElementById('comments');
    if (!nativeComments) return;

    nativeComments.style.display = 'none';

    if (!appRoot) {
        appRoot = document.createElement('div');
        appRoot.id = APP_ROOT_ID;
        nativeComments.parentNode?.insertBefore(appRoot, nativeComments);
        reactRoot = ReactDOM.createRoot(appRoot);
    }

    if (appRoot) appRoot.style.display = 'block';
    reactRoot?.render(
        <React.StrictMode>
            <ForumApp analysis={analysis} originalComments={comments} userInfo={userInfo} />
        </React.StrictMode>
    );
}

function toggleForumVisibility(show: boolean) {
    const root = document.getElementById(APP_ROOT_ID);
    const nativeComments = document.getElementById('comments');
    if (root) root.style.display = show ? 'block' : 'none';
    if (nativeComments) nativeComments.style.display = show ? 'none' : 'block';
}

function handleAnalyzeToggle() {
    if (analysisCache) {
        forumVisible = !forumVisible;
        toggleForumVisibility(forumVisible);
        return;
    }

    const button = document.getElementById('gemini-analyze-button-react') as HTMLButtonElement;
    if (button) {
        button.textContent = 'Analyzing...';
        button.disabled = true;
    }

    commentsCache = Array.from(document.querySelectorAll('#content-text')).map((el, i) => ({
        id: el.closest('ytd-comment-renderer, ytd-comment-thread-renderer')?.id || `comment_${i}`,
        text: el.textContent?.trim() || '',
    })).filter(c => c.text.length > 10);

    if (commentsCache.length === 0) {
        alert("No substantial comments found to analyze.");
        if (button) {
            button.textContent = 'Analyze / Toggle Forum';
            button.disabled = false;
        }
        return;
    }

    chrome.runtime.sendMessage({ message: MESSAGES.SEND_COMMENTS_TO_BACKGROUND, comments: commentsCache });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === MESSAGES.SEND_ANALYSIS_TO_CONTENT && request.analysis) {
        const button = document.getElementById('gemini-analyze-button-react') as HTMLButtonElement;
        if (button) {
            button.textContent = 'Analyze / Toggle Forum';
            button.disabled = false;
        }

        if (request.analysis.error) {
            alert(`Analysis Error: ${request.analysis.error}`);
            return;
        }
        analysisCache = request.analysis;

        chrome.runtime.sendMessage({ message: MESSAGES.GET_USER_INFO }, (response) => {
            userInfoCache = response?.userInfo;
            injectReactApp(analysisCache!, commentsCache, userInfoCache);
            forumVisible = true;
        });
        sendResponse({ success: true });
    }
});

function injectAnalyzeButton() {
    const buttonId = 'gemini-analyze-button-react';
    if (document.getElementById(buttonId)) return;
    const target = document.querySelector('#subscribe-button');
    if (!target?.parentElement) return;

    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = 'Analyze / Toggle Forum';
    button.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--filled yt-spec-button-shape-next--call-to-action';
    button.style.marginLeft = '16px';
    button.onclick = handleAnalyzeToggle;

    target.parentElement.appendChild(button);
}

const observer = new MutationObserver(() => {
    if (document.querySelector('#subscribe-button')) {
        injectAnalyzeButton();
        observer.disconnect();
    }
});

if (window.location.href.includes("youtube.com/watch")) {
    observer.observe(document.body, { childList: true, subtree: true });
}