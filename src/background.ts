// Add chrome type declaration to avoid TypeScript errors in a web extension context.
declare const chrome: any;
import { MIN_COMMENT_LENGTH, NGRAM_SPAM_THRESHOLD } from '@/constants';
import { Comment } from '@/types';

// Function to calculate n-grams and check for repetition
const isSpam = (text: string): boolean => {
  const n = 4; // n-gram size
  if (text.length < n) return false;
  
  const ngrams = new Map<string, number>();
  let totalNgrams = 0;
  for (let i = 0; i <= text.length - n; i++) {
    const ngram = text.substring(i, i + n);
    ngrams.set(ngram, (ngrams.get(ngram) || 0) + 1);
    totalNgrams++;
  }

  if (totalNgrams === 0) return false;

  let repetitiveCount = 0;
  for (const count of ngrams.values()) {
    if (count > 1) {
      repetitiveCount += count - 1;
    }
  }
  
  return (repetitiveCount / totalNgrams) > NGRAM_SPAM_THRESHOLD;
};

const prefilterComments = (comments: Comment[]): { filteredComments: Comment[], totalFiltered: number } => {
  const seenComments = new Set<string>();
  const filteredComments = comments.filter(comment => {
    // Basic length check
    if (comment.text.length < MIN_COMMENT_LENGTH) return false;
    
    // Check for repetitive n-grams
    if (isSpam(comment.text.toLowerCase())) return false;

    // Check for exact duplicates
    const normalizedText = comment.text.toLowerCase().trim();
    if (seenComments.has(normalizedText)) return false;

    seenComments.add(normalizedText);
    return true;
  });

  return { filteredComments, totalFiltered: comments.length - filteredComments.length };
};


chrome.runtime.onMessage.addListener((request: any, sender: any, sendResponse: (response?: any) => void) => {
  if (request.action === 'openOptionsPage') {
    chrome.runtime.openOptionsPage();
    return true;
  }

  if (request.action === 'prefilter-comments') {
    const { comments } = request.payload;
    const result = prefilterComments(comments);
    sendResponse(result);
    return true; // Indicates async response
  }
  
  if (request.action === 'injection-failed') {
    console.error('[Comment Tiers] Content script failed to inject. YouTube page structure may have changed.', request.payload.error);
    return true;
  }
});
