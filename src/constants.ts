/**
 * Options for the maximum number of comments to fetch and analyze.
 */
export const COMMENT_LIMIT_OPTIONS = [1000, 2000, 5000, 10000, 20000, 30000];

/**
 * The number of comments to process in a single batch API call to Gemini.
 */
export const BATCH_SIZE = 200;

/**
 * The number of concurrent/parallel requests to make to the Gemini API.
 */
export const CONCURRENCY_LIMIT = 10;

/**
 * The size of n-grams (sequence of words) to use for spam detection.
 * Used to identify repetitive phrases.
 */
export const NGRAM_SIZE = 5;

/**
 * The minimum number of times an n-gram must appear across different comments
 * to be considered potential spam.
 */
export const NGRAM_SPAM_THRESHOLD = 2;

/**
 * The minimum number of words a comment must have to be considered for analysis,
 * used as a proxy to filter out very low-effort comments.
 */
export const MIN_WORD_COUNT = 25;