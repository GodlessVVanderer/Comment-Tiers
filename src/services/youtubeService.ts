import { Comment } from '@/types';

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3/';

const transformComment = (item: any): Comment => {
  const snippet = item.snippet.topLevelComment.snippet;
  return {
    id: item.snippet.topLevelComment.id,
    author: snippet.authorDisplayName,
    authorProfileImageUrl: snippet.authorProfileImageUrl,
    text: snippet.textDisplay,
    publishedAt: snippet.publishedAt,
    likeCount: snippet.likeCount,
    replyCount: item.snippet.totalReplyCount,
    replies: [],
  };
};

const transformReply = (item: any): Comment => {
    const snippet = item.snippet;
    return {
      id: item.id,
      author: snippet.authorDisplayName,
      authorProfileImageUrl: snippet.authorProfileImageUrl,
      text: snippet.textDisplay,
      publishedAt: snippet.publishedAt,
      likeCount: snippet.likeCount,
      replyCount: 0, // Replies don't have replies of their own in this structure
    };
  };

export const fetchComments = async (
  videoId: string,
  apiKey: string,
  onProgress: (percentage: number) => void,
  limit: number
): Promise<Comment[]> => {
  let comments: Comment[] = [];
  let nextPageToken: string | undefined = undefined;
  const maxResults = 100; // Max allowed by API

  try {
    do {
      const url = new URL('commentThreads', YOUTUBE_API_BASE_URL);
      url.searchParams.append('part', 'snippet,replies');
      url.searchParams.append('videoId', videoId);
      url.searchParams.append('key', apiKey);
      url.searchParams.append('maxResults', String(maxResults));
      url.searchParams.append('order', 'relevance');
      if (nextPageToken) {
        url.searchParams.append('pageToken', nextPageToken);
      }

      const response = await fetch(url.toString());
      const data = await response.json();

      if (data.error) {
        const { message, code } = data.error;
        if (code === 403 && message.includes('quotaExceeded')) {
          throw new Error('YOUTUBE_QUOTA_EXCEEDED');
        }
        if (code === 403 && message.includes('commentsDisabled')) {
            throw new Error('YOUTUBE_COMMENTS_DISABLED');
        }
        if (code === 400 && message.includes('API key not valid')) {
            throw new Error('YOUTUBE_INVALID_KEY');
        }
        if (code === 404) {
            throw new Error('YOUTUBE_VIDEO_NOT_FOUND');
        }
        throw new Error(message || 'An unknown YouTube API error occurred.');
      }

      if (!data.items) {
        // No more comments or comments are disabled
        break;
      }

      const newComments = data.items.map(transformComment);
      
      data.items.forEach((item: any, index: number) => {
        if (item.replies) {
          newComments[index].replies = item.replies.comments.map(transformReply);
        }
      });

      comments = [...comments, ...newComments];
      nextPageToken = data.nextPageToken;

      onProgress((comments.length / limit) * 100);

    } while (nextPageToken && comments.length < limit);

    return comments.slice(0, limit);
  } catch (e: any) {
    // Re-throw custom errors
    if (e.message.startsWith('YOUTUBE_')) {
      throw e;
    }
    console.error('Failed to fetch YouTube comments:', e);
    throw new Error('Failed to fetch comments. Check your network connection and API key.');
  }
};
