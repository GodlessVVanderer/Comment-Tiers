// FIX: Implement YouTube service for fetching comments.
import { YOUTUBE_API_BASE_URL } from '../constants';
import { Comment } from '../types';

export const getVideoIdFromUrl = (): string | null => {
  const url = window.location.href;
  const match = url.match(/(?:v=)([^&?]+)/);
  return match ? match[1] : null;
};

const parseCommentThread = (item: any): Comment => {
  const snippet = item.snippet.topLevelComment.snippet;
  return {
    id: item.snippet.topLevelComment.id,
    text: snippet.textDisplay,
    author: snippet.authorDisplayName,
    authorProfileImageUrl: snippet.authorProfileImageUrl,
    publishedAt: snippet.publishedAt,
    likeCount: snippet.likeCount,
    totalReplyCount: item.snippet.totalReplyCount,
    replies: [],
  };
};

export const fetchAllComments = async (
  apiKey: string,
  videoId: string,
  limit: number,
  onProgress: (progress: { percent: number, processed: number, total: number }) => void
): Promise<Comment[]> => {
  let comments: Comment[] = [];
  let nextPageToken: string | undefined = undefined;
  let fetchedCount = 0;
  let totalCommentsToFetch = limit;

  try {
    do {
      const url = new URL(`${YOUTUBE_API_BASE_URL}/commentThreads`);
      url.searchParams.set('part', 'snippet,replies');
      url.searchParams.set('videoId', videoId);
      url.searchParams.set('key', apiKey);
      url.searchParams.set('maxResults', '100');
      url.searchParams.set('order', 'relevance');
      if (nextPageToken) {
        url.searchParams.set('pageToken', nextPageToken);
      }
      
      const response = await fetch(url.toString());
      if (!response.ok) {
        const errorData = await response.json();
        // FIX: Create Error object without 'cause' in constructor for compatibility.
        const err = new Error(`YouTube API Error: ${errorData.error.message}`);
        (err as any).cause = 'YOUTUBE_API_KEY';
        throw err;
      }
      
      const data = await response.json();
      const newComments = data.items.map(parseCommentThread);
      comments.push(...newComments);
      fetchedCount += newComments.length;
      
      nextPageToken = data.nextPageToken;

      if (fetchedCount === newComments.length) { // On first fetch, set total
          totalCommentsToFetch = Math.min(limit, data.pageInfo.totalResults);
      }
      
      onProgress({ percent: (fetchedCount / totalCommentsToFetch) * 100, processed: fetchedCount, total: totalCommentsToFetch });

    } while (nextPageToken && comments.length < limit);

    return comments.slice(0, limit);
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};
