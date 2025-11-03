// content.js

import { MESSAGES } from './constants.js';

const FORUM_VIEW_ID = 'gemini-forum-view';
let originalCommentData = []; // Stores the extracted {id, text, author, element} for easy lookup

// --- 1. Comment Extraction ---

function getYouTubeVideoId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('v');
}

function extractComments() {
  const videoId = getYouTubeVideoId();
  if (!videoId) return { videoId: null, comments: [] };
  
  const commentNodes = document.querySelectorAll('#comments ytd-comment-thread-renderer');
  
  let comments = [];
  const maxComments = Math.min(commentNodes.length, 100); // Process up to 100 comments
  
  for (let i = 0; i < maxComments; i++) {
    const node = commentNodes[i];
    const textElement = node.querySelector('#content-text');
    const authorElement = node.querySelector('#author-text');
    
    if (textElement && authorElement) {
      const commentId = `${videoId}_comment_${i}`;
      comments.push({
        id: commentId,
        text: textElement.textContent.trim(),
        author: authorElement.textContent.trim(),
        element: node 
      });
    }
  }
  return { videoId, comments };
}

// --- 2. Forum State Persistence ---

async function loadForumState() {
    const videoId = getYouTubeVideoId();
    if (!videoId) return null;
    
    const key = `forum_state_${videoId}`;
    const result = await chrome.storage.sync.get(key);
    
    return result[key] || { analysis: null, interactions: {} };
}

async function saveForumState(state) {
    const videoId = getYouTubeVideoId();
    if (!videoId) return;
    
    const key = `forum_state_${videoId}`;
    await chrome.storage.sync.set({ [key]: state });
}

// --- 3. UI Rendering ---

function renderForumUI(state) {
    const { analysis, interactions } = state;
    const commentSection = document.getElementById('comments');
    if (!commentSection) return;

    const nativeComments = commentSection.querySelector('#contents');
    if (nativeComments) nativeComments.style.display = 'none';

    let forumContainer = document.getElementById(FORUM_VIEW_ID);
    if (!forumContainer) {
        forumContainer = document.createElement('div');
        forumContainer.id = FORUM_VIEW_ID;
        commentSection.prepend(forumContainer);
    }
    forumContainer.innerHTML = ''; // Clear existing content
  
    const originalCommentMap = originalCommentData.reduce((map, c) => {
        map[c.id] = c;
        return map;
    }, {});
    
    analysis.threads.forEach((thread) => {
        const threadEl = document.createElement('div');
        threadEl.className = 'gemini-thread';
        
        let originalCommentsHtml = thread.comment_ids.map(id => {
            const comment = originalCommentMap[id];
            return comment ? `
                <div class="original-comment-container">
                    <p class="original-comment"><strong>${comment.author}:</strong> ${comment.text}</p>
                    <button class="report-comment" data-comment-id="${id}">Report</button>
                </div>
            ` : '';
        }).join('');

        let repliesHtml = (interactions[thread.title] || []).map(reply => `
            <div class="user-reply" data-reply-id="${reply.id}">
                <p><strong>You:</strong> ${reply.text}</p>
                <button class="delete-reply">Delete</button>
            </div>
        `).join('');

        threadEl.innerHTML = `
            <h3 class="thread-title">▶️ ${thread.title}</h3>
            <p class="thread-summary">${thread.summary}</p>
            <div class="thread-content" style="display:none;">
                <div class="thread-comments">${originalCommentsHtml}</div>
                <div class="forum-replies">${repliesHtml}</div>
                <div class="reply-form">
                    <textarea placeholder="Add your reply to this topic..."></textarea>
                    <button class="save-reply">Post Reply</button>
                </div>
            </div>
        `;
        
        forumContainer.appendChild(threadEl);
    });

    addEventListeners(forumContainer);
}

function addEventListeners(container) {
    container.addEventListener('click', async (e) => {
        const target = e.target;
        const threadEl = target.closest('.gemini-thread');
        if (!threadEl) return;

        const title = threadEl.querySelector('.thread-title').textContent.replace('▶️ ', '').replace('🔽 ', '');
        const state = await loadForumState();

        if (target.classList.contains('thread-title')) {
            const content = threadEl.querySelector('.thread-content');
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            target.textContent = (isHidden ? '🔽 ' : '▶️ ') + title;
        }

        if (target.classList.contains('save-reply')) {
            const textarea = threadEl.querySelector('.reply-form textarea');
            const text = textarea.value.trim();
            if (!text) return;

            if (!state.interactions[title]) {
                state.interactions[title] = [];
            }
            state.interactions[title].push({ id: `reply_${Date.now()}`, text: text });
            
            await saveForumState(state);
            renderForumUI(state); // Re-render to show new reply
        }

        if (target.classList.contains('delete-reply')) {
            const replyEl = target.closest('.user-reply');
            const replyId = replyEl.dataset.replyId;
            
            if (state.interactions[title]) {
                state.interactions[title] = state.interactions[title].filter(r => r.id !== replyId);
            }

            await saveForumState(state);
            renderForumUI(state); // Re-render to remove the reply
        }

        if (target.classList.contains('report-comment')) {
            const commentId = target.dataset.commentId;
            console.log(`Comment reported: ${commentId}`);
            target.textContent = 'Reported';
            target.disabled = true;
        }
    });
}

// --- 4. Message Router ---

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.message === MESSAGES.TOGGLE_FORUM_UI) {
    let state = await loadForumState();
    
    if (!state.analysis) {
        const { comments } = extractComments();
        if (comments.length === 0) {
            alert("No comments loaded on the page. Scroll down to load comments first!");
            return;
        }
        originalCommentData = comments; 
        chrome.runtime.sendMessage({
            message: MESSAGES.SEND_COMMENTS_TO_BACKGROUND,
            comments: comments.map(c => ({ id: c.id, text: c.text })),
            tabId: sender.tab.id
        });
        alert("Analyzing comments... this may take a moment.");
    } else {
        const forumContainer = document.getElementById(FORUM_VIEW_ID);
        const nativeComments = document.getElementById('comments')?.querySelector('#contents');
        
        if (forumContainer && forumContainer.style.display !== 'none') {
             forumContainer.style.display = 'none';
             if (nativeComments) nativeComments.style.display = 'block';
        } else {
             if (originalCommentData.length === 0) originalCommentData = extractComments().comments;
             renderForumUI(state);
             if (forumContainer) forumContainer.style.display = 'block';
        }
    }
  } 
  
  if (request.message === MESSAGES.SEND_ANALYSIS_TO_CONTENT) {
    const analysis = request.analysis;
    if (analysis.error) {
      alert(`AI Analysis Error: ${analysis.error}`);
      return;
    }
    
    const state = { analysis, interactions: {} };
    await saveForumState(state);
    renderForumUI(state);
  }
});

// Initial load check - hide native comments if forum view is already rendered.
document.addEventListener('DOMContentLoaded', async () => {
    const state = await loadForumState();
    if(state && state.analysis) {
        if (originalCommentData.length === 0) originalCommentData = extractComments().comments;
        renderForumUI(state);
        const forumContainer = document.getElementById(FORUM_VIEW_ID);
        if(forumContainer) forumContainer.style.display = 'none';
    }
});