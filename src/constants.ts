// This is a placeholder for constants.ts
// For example:
// export const API_KEY = '...';

import { Category } from './types';

export const COMMENT_LIMITS = [1000, 2000, 5000, 10000, 20000, 30000];
export const DEFAULT_COMMENT_LIMIT = 5000;

export const GEMINI_BATCH_SIZE = 50;
export const CONCURRENCY_LIMIT = 10;
export const MIN_COMMENT_LENGTH = 15; // characters
export const NGRAM_SPAM_THRESHOLD = 0.6; // 60% repetitive n-grams

export const CATEGORIES: Omit<Category, 'comments'>[] = [
  {
    name: 'Questions',
    icon: '❓',
    prompt: 'Comments asking questions about the video content or related topics.',
  },
  {
    name: 'Feedback',
    icon: '💡',
    prompt: 'Comments providing feedback, suggestions, or constructive criticism.',
  },
  {
    name: 'Highlights',
    icon: '⭐',
    prompt: 'Comments pointing out memorable moments or key takeaways from the video.',
  },
  {
    name: 'Discussions',
    icon: '💬',
    prompt: 'Comments engaging in discussions with the creator or other viewers.',
  },
  {
    name: 'Other',
    icon: '📁',
    prompt: 'Comments that do not fit into the other categories, such as jokes, memes, or general statements.',
  },
];
