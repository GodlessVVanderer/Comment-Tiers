import type { Comment } from '../types';

const API_BASE_URL = 'https://www.googleapis.com/youtube/v3/commentThreads';
const MAX_RESULTS_PER_PAGE = 100;

interface YouTubeCommentSnippet {
  authorDisplayName: string;
  textDisplay: string;
}

interface YouTubeComment {
  snippet: {
    topLevelComment: {
      id: string;
      snippet: YouTubeCommentSnippet;
    };
  };
}

export const fetchComments = async (videoId: string, apiKey: string, maxComments: number): Promise<Comment[]> => {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('YouTube API key is missing. Please provide it in the input field.');
  }

  let comments: Comment[] = [];
  let pageToken: string | undefined = undefined;

  try {
    while (comments.length < maxComments) {
      const params = new URLSearchParams({
        part: 'snippet',
        videoId: videoId,
        key: apiKey,
        maxResults: MAX_RESULTS_PER_PAGE.toString(),
        order: 'relevance', 
      });

      if (pageToken) {
        params.append('pageToken', pageToken);
      }

      const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        const reason = errorData.error?.errors?.[0]?.reason;
        
        let specificMessage = `YouTube API Error: ${errorData.error?.message || `Request failed with status ${response.status}`}`;

        switch (reason) {
            case 'quotaExceeded':
                specificMessage = 'YOUTUBE_QUOTA_EXCEEDED';
                break;
            case 'videoNotFound':
                specificMessage = 'YOUTUBE_VIDEO_NOT_FOUND';
                break;
            case 'commentsDisabled':
                specificMessage = 'YOUTUBE_COMMENTS_DISABLED';
                break;
            case 'forbidden':
                 if (errorData.error?.message.toLowerCase().includes('api key not valid')) {
                    specificMessage = 'YOUTUBE_INVALID_KEY';
                 } else {
                    specificMessage = 'YOUTUBE_FORBIDDEN'; // Generic permission error
                 }
                break;
        }
        throw new Error(specificMessage);
      }

      const data = await response.json();
      
      const newComments = data.items.map((item: YouTubeComment) => ({
        id: item.snippet.topLevelComment.id,
        author: item.snippet.topLevelComment.snippet.authorDisplayName,
        text: item.snippet.topLevelComment.snippet.textDisplay,
      }));
      
      comments = comments.concat(newComments);
      
      pageToken = data.nextPageToken;
      if (!pageToken) {
        break; // No more pages
      }
    }
  } catch (error) {
    console.error('Error fetching YouTube comments:', error);
    if (error instanceof Error) {
        // Re-throw the specific error or a generic one
        throw error;
    }
    throw new Error('An unknown error occurred while fetching comments.');
  }

  // Ensure we don't return more comments than requested
  if (comments.length > maxComments) {
    comments = comments.slice(0, maxComments);
  }

  if (comments.length === 0 && maxComments > 0) {
      console.warn("Fetched 0 comments. The video might have comments disabled or no comments yet.");
  }

  return comments;
};