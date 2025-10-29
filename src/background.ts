import type { Comment } from './types';

// FIX: Declare chrome for TypeScript to prevent 'Cannot find name' errors.
declare const chrome: any;

console.log("Comment Analyzer background script initialized.");

// Open the options page when the extension icon is clicked.
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

/**
 * Prefilters comments by removing spam and low-effort content.
 * This runs in the background to avoid freezing the YouTube page.
 */
const prefilterComments = (
  comments: Comment[], 
  minWordCount: number, 
  ngramSize: number, 
  spamThreshold: number
): Comment[] => {
  // 1. Filter by minimum word count
  const contentfulComments = comments.filter(
    (c) => (c.text.match(/\b\w+\b/g) || []).length >= minWordCount
  );

  // 2. n-gram based spam detection
  const ngrams = new Map<string, number>();
  contentfulComments.forEach((comment) => {
    const words = comment.text.toLowerCase().match(/\b\w+\b/g) || [];
    if (words.length >= ngramSize) {
      for (let i = 0; i <= words.length - ngramSize; i++) {
        const ngram = words.slice(i, i + ngramSize).join(' ');
        ngrams.set(ngram, (ngrams.get(ngram) || 0) + 1);
      }
    }
  });

  const spamNgrams = new Set<string>();
  for (const [ngram, count] of ngrams.entries()) {
    if (count >= spamThreshold) {
      spamNgrams.add(ngram);
    }
  }

  if (spamNgrams.size === 0) {
    return contentfulComments;
  }

  // 3. Filter out comments containing spam n-grams
  return contentfulComments.filter((comment) => {
    const words = comment.text.toLowerCase().match(/\b\w+\b/g) || [];
    if (words.length >= ngramSize) {
      for (let i = 0; i <= words.length - ngramSize; i++) {
        const ngram = words.slice(i, i + ngramSize).join(' ');
        if (spamNgrams.has(ngram)) {
          return false; // Found spam, filter out this comment
        }
      }
    }
    return true; // No spam found, keep this comment
  });
};

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request: any, sender: any, sendResponse: (response: any) => void) => {
  if (request.action === 'prefilter-comments') {
    const { comments, minWordCount, ngramSize, spamThreshold } = request.payload;
    const filteredComments = prefilterComments(comments, minWordCount, ngramSize, spamThreshold);
    sendResponse(filteredComments);
    return true; // Indicates you wish to send a response asynchronously
  }
});