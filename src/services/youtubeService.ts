import { YOUTUBE_API_BASE_URL } from '../constants';
import { Comment } from '../types';

export async function fetchComments(
  videoId: string,
  apiKey: string,
  onProgress: (progress: number) => void,
  maxComments: number = 2000
): Promise<Comment[]> {
  let allComments: Comment[] = [];
  let nextPageToken: string | undefined = undefined;

  try {
    do {
      const url = new URL(`${YOUTUBE_API_BASE_URL}commentThreads`);
      url.searchParams.append('part', 'snippet,replies');
      url.searchParams.append('videoId', videoId);
      url.searchParams.append('key', apiKey);
      url.searchParams.append('maxResults', '100');
      if (nextPageToken) {
        url.searchParams.append('pageToken', nextPageToken);
      }

      const response = await fetch(url.toString());
      const data = await response.json();

      if (data.error) {
        const errorReason = data.error.errors?.[0]?.reason;
        if (errorReason === 'commentsDisabled') {
          throw new Error('YOUTUBE_COMMENTS_DISABLED');
        }
        if (errorReason === 'quotaExceeded') {
            throw new Error('YOUTUBE_QUOTA_EXCEEDED');
        }
        throw new Error(data.error.message || 'Unknown YouTube API error');
      }

      for (const item of data.items) {
        const topLevelComment = item.snippet.topLevelComment.snippet;
        allComments.push({
          id: item.snippet.topLevelComment.id,
          author: topLevelComment.authorDisplayName,
          text: topLevelComment.textOriginal,
          likeCount: topLevelComment.likeCount,
          publishedAt: topLevelComment.publishedAt,
          authorProfileImageUrl: topLevelComment.authorProfileImageUrl,
        });

        if (item.replies) {
          for (const reply of item.replies.comments) {
            const replySnippet = reply.snippet;
            allComments.push({
              id: reply.id,
              author: replySnippet.authorDisplayName,
              text: replySnippet.textOriginal,
              likeCount: replySnippet.likeCount,
              publishedAt: replySnippet.publishedAt,
              authorProfileImageUrl: replySnippet.authorProfileImageUrl,
            });
          }
        }
      }

      nextPageToken = data.nextPageToken;
      onProgress(Math.min(100, (allComments.length / maxComments) * 100));

    } while (nextPageToken && allComments.length < maxComments);
    
    return allComments.slice(0, maxComments);

  } catch (error) {
    console.error('Error fetching YouTube comments:', error);
    if (error instanceof Error && error.message.startsWith('YOUTUBE_')) {
        throw error; // Re-throw specific errors
    }
    throw new Error('Failed to fetch YouTube comments. Check your network connection and API key.');
  }
}
