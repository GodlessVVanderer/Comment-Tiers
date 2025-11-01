import { YouTubeComment } from '../types';
import { YOUTUBE_API_BASE_URL } from '../constants';

const MAX_RESULTS_PER_PAGE = 100;

export const fetchComments = async (
  videoId: string,
  apiKey: string,
  limit: number,
  onProgress: (progress: { fetched: number; total: number | 'unknown'; value: number }) => void
): Promise<YouTubeComment[]> => {
  let comments: YouTubeComment[] = [];
  let nextPageToken: string | undefined = undefined;

  onProgress({ fetched: 0, total: limit, value: 0 });
  
  try {
    // First call to get total comment count info
    const initialUrl = `${YOUTUBE_API_BASE_URL}/commentThreads?part=snippet,replies&videoId=${videoId}&key=${apiKey}&maxResults=${MAX_RESULTS_PER_PAGE}&order=relevance`;
    const initialResponse = await fetch(initialUrl);
    
    if (!initialResponse.ok) {
        const errorData = await initialResponse.json();
        throw new Error(errorData.error.message || `HTTP error! status: ${initialResponse.status}`);
    }

    const initialData = await initialResponse.json();

    const totalResults = initialData.pageInfo?.totalResults ?? limit;
    const totalToFetch = Math.min(totalResults, limit);

    let currentData = initialData;

    while (comments.length < limit) {
      const fetchedComments = currentData.items?.map((item: any) => {
        const snippet = item.snippet.topLevelComment.snippet;
        return {
          id: item.snippet.topLevelComment.id,
          text: snippet.textDisplay,
          author: snippet.authorDisplayName,
          authorProfileImageUrl: snippet.authorProfileImageUrl,
          likeCount: snippet.likeCount,
          replyCount: item.snippet.totalReplyCount,
          publishedAt: snippet.publishedAt,
        };
      }) || [];

      comments = comments.concat(fetchedComments);
      nextPageToken = currentData.nextPageToken;
      
      const progressValue = Math.min(Math.round((comments.length / totalToFetch) * 50), 50);
      onProgress({ fetched: comments.length, total: totalToFetch, value: progressValue });

      if (!nextPageToken || comments.length >= limit) {
        break;
      }

      const nextUrl = `${YOUTUBE_API_BASE_URL}/commentThreads?part=snippet,replies&videoId=${videoId}&key=${apiKey}&maxResults=${MAX_RESULTS_PER_PAGE}&pageToken=${nextPageToken}&order=relevance`;
      const response = await fetch(nextUrl);
      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.error.message || `HTTP error! status: ${response.status}`);
      }
      currentData = await response.json();
    }
    
    return comments.slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    throw error;
  }
};
