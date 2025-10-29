// FIX: Provide implementation for the background script.
// This script runs in the background to handle tasks like data processing.

// FIX: Define chrome for TypeScript to avoid compilation errors.
declare const chrome: any;

/**
 * A simplified Comment interface for use within the background script.
 * We only need id and text for pre-filtering.
 */
interface Comment {
  id: string;
  text: string;
}

/**
 * Generates n-grams (sequences of n words) from a given text.
 * @param text The input string.
 * @param n The size of the n-grams.
 * @returns An array of unique n-grams.
 */
const generateNgrams = (text: string, n: number): string[] => {
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  const ngrams = new Set<string>();
  if (words.length >= n) {
    for (let i = 0; i <= words.length - n; i++) {
      ngrams.add(words.slice(i, i + n).join(' '));
    }
  }
  return Array.from(ngrams);
};

/**
 * Prefilters a list of comments to remove low-effort content and potential spam.
 * @param comments The array of comments to filter.
 * @param minWordCount The minimum number of words a comment must have.
 * @param ngramSize The size of n-grams to use for spam detection.
 * @param spamThreshold The number of times an n-gram must appear to be considered spam.
 * @returns A new array of filtered comments.
 */
const prefilterComments = (
  comments: Comment[],
  minWordCount: number,
  ngramSize: number,
  spamThreshold: number
): Comment[] => {
  // 1. Filter by minimum word count.
  const contentfulComments = comments.filter(
    (comment) => comment.text.split(/\s+/).length >= minWordCount
  );

  // 2. Identify repetitive spam using n-grams.
  const ngramCounts = new Map<string, number>();
  const commentNgrams = new Map<string, string[]>();

  // Generate n-grams for each comment and count their global occurrences.
  for (const comment of contentfulComments) {
    const ngrams = generateNgrams(comment.text, ngramSize);
    commentNgrams.set(comment.id, ngrams);
    for (const ngram of ngrams) {
      ngramCounts.set(ngram, (ngramCounts.get(ngram) || 0) + 1);
    }
  }

  // Identify n-grams that appear more often than the spam threshold.
  const spamNgrams = new Set<string>();
  for (const [ngram, count] of ngramCounts.entries()) {
    if (count >= spamThreshold) {
      spamNgrams.add(ngram);
    }
  }

  // 3. Filter out comments that contain any of the identified spam n-grams.
  const filteredComments = contentfulComments.filter((comment) => {
    const ngrams = commentNgrams.get(comment.id) || [];
    for (const ngram of ngrams) {
      if (spamNgrams.has(ngram)) {
        return false; // This comment is considered spam.
      }
    }
    return true;
  });

  return filteredComments;
};

// Listen for messages from other parts of the extension.
chrome.runtime.onMessage.addListener(
  (
    request: { action: string; payload: any },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ) => {
    if (request.action === 'prefilter-comments') {
      const { comments, minWordCount, ngramSize, spamThreshold } = request.payload;
      try {
        const filtered = prefilterComments(
          comments,
          minWordCount,
          ngramSize,
          spamThreshold
        );
        sendResponse(filtered);
      } catch (error) {
        console.error('Error during pre-filtering:', error);
        sendResponse([]); // Send back an empty array on error
      }
    }
    // Return true to indicate that the response will be sent asynchronously.
    return true;
  }
);
