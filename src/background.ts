// FIX: Add chrome type declaration to fix build errors due to missing @types/chrome.
declare const chrome: any;

import { NGRAM_SIZE, NGRAM_THRESHOLD, MIN_WORD_COUNT } from './constants';

// Helper for n-gram generation
const getNgrams = (text: string, size: number): Set<string> => {
  const ngrams = new Set<string>();
  const words = text.toLowerCase().split(/\s+/);
  for (let i = 0; i <= words.length - size; i++) {
    ngrams.add(words.slice(i, i + size).join(' '));
  }
  return ngrams;
};

const prefilterComments = (comments: any[]): any[] => {
  const ngramCounts: Record<string, number> = {};
  const spamNgrams = new Set<string>();

  // First pass: count all n-grams
  comments.forEach(comment => {
    const text = comment.snippet?.topLevelComment?.snippet?.textOriginal || '';
    const ngrams = getNgrams(text, NGRAM_SIZE);
    ngrams.forEach(ngram => {
      ngramCounts[ngram] = (ngramCounts[ngram] || 0) + 1;
    });
  });

  // Identify spam n-grams
  for (const ngram in ngramCounts) {
    if (ngramCounts[ngram] >= NGRAM_THRESHOLD) {
      spamNgrams.add(ngram);
    }
  }

  // Second pass: filter comments
  const filtered = comments.filter(comment => {
    const text = comment.snippet?.topLevelComment?.snippet?.textOriginal || '';
    const wordCount = text.split(/\s+/).length;
    
    // Rule 1: Minimum word count
    if (wordCount < MIN_WORD_COUNT) return false;

    // Rule 2: Spam n-gram check
    const ngrams = getNgrams(text, NGRAM_SIZE);
    for (const ngram of ngrams) {
      if (spamNgrams.has(ngram)) return false;
    }
    
    return true;
  });

  return filtered;
};


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'prefilter-comments') {
    const filteredComments = prefilterComments(request.comments);
    sendResponse({ filteredComments });
    return true; // Indicates you will send a response asynchronously
  }
  
  if (request.action === 'open-options-page') {
    chrome.runtime.openOptionsPage();
  }

  if (request.action === 'injection-failed') {
    console.error("[Comment Tiers] Content script failed to inject the application into the YouTube page.");
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});