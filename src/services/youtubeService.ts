import { Comment } from '../types';
import { YOUTUBE_API_BASE_URL } from '../constants';

export async function fetchComments(videoId: string, apiKey: string, maxResults: number = 100): Promise<Comment[]> {
  const url = `${YOUTUBE_API_BASE_URL}commentThreads?part=snippet,replies&videoId=${videoId}&key=${apiKey}&maxResults=${Math.min(maxResults, 100)}&order=relevance&textFormat=plainText`;

  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    const message = errorData.error?.message || 'Failed to fetch comments.';
    throw new Error(`YouTube API Error: ${message}`);
  }

  const data = await response.json();

  if (!data.items) {
    return [];
  }

  return data.items.map((item: any): Comment => {
    const topLevelComment = item.snippet.topLevelComment.snippet;
    return {
      id: item.snippet.topLevelComment.id,
      author: topLevelComment.authorDisplayName,
      text: topLevelComment.textDisplay,
      likeCount: topLevelComment.likeCount,
      publishedAt: topLevelComment.publishedAt,
      authorProfileImageUrl: topLevelComment.authorProfileImageUrl,
    };
  });
}
