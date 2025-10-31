
import { Comment } from '../types';

declare const chrome: any;

const BASE_URL = 'https://www.googleapis.com/youtube/v3/';

// This function needs to handle pagination
export const fetchAllComments = async (
  videoId: string,
  apiKey: string,
  limit: number,
  onUpdate: (processed: number, total: number) => void
): Promise<any[]> => {
  let comments: any[] = [];
  let nextPageToken: string | undefined = undefined;
  let fetchedCount = 0;

  do {
    const params = new URLSearchParams({
      part: 'snippet,replies',
      videoId: videoId,
      key: apiKey,
      maxResults: '100',
      textFormat: 'plainText',
    });
    if (nextPageToken) {
      params.set('pageToken', nextPageToken);
    }

    const response = await fetch(`${BASE_URL}commentThreads?${params.toString()}`);
    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || `HTTP error! status: ${response.status}`;
        if (errorMessage.toLowerCase().includes('apikeyinvalid')) {
            throw new Error('YOUTUBE_INVALID_KEY');
        }
        if (errorMessage.toLowerCase().includes('quota')) { // quotaExceeded, etc.
            throw new Error('YOUTUBE_QUOTA_EXCEEDED');
        }
        throw new Error('YOUTUBE_API_ERROR');
    }

    const data = await response.json();
    comments = comments.concat(data.items);
    fetchedCount = comments.length;
    nextPageToken = data.nextPageToken;
    
    // We use the limit as the total for progress reporting.
    onUpdate(fetchedCount, limit);

  } while (nextPageToken && fetchedCount < limit);

  return comments.slice(0, limit);
};

export const getVideoDetails = async (videoId: string, apiKey: string) => {
    const params = new URLSearchParams({
        part: 'snippet,statistics',
        id: videoId,
        key: apiKey,
    });

    const response = await fetch(`${BASE_URL}videos?${params.toString()}`);
    if (!response.ok) {
        console.error('Failed to fetch video details');
        return null;
    }
    const data = await response.json();
    if (data.items && data.items.length > 0) {
        return data.items[0];
    }
    return null;
};
