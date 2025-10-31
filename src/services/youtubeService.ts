import { Comment } from '../types';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3/';

const transformApiComment = (item: any, isReply = false): Comment => {
    const snippet = isReply ? item.snippet : item.snippet.topLevelComment.snippet;
    return {
        id: item.id,
        author: snippet.authorDisplayName,
        text: snippet.textOriginal,
        likeCount: snippet.likeCount,
        publishedAt: snippet.publishedAt,
        authorProfileImageUrl: snippet.authorProfileImageUrl,
        replies: [],
        totalReplyCount: isReply ? 0 : item.snippet.totalReplyCount,
    };
};

export const fetchComments = async (
    videoId: string,
    apiKey: string,
    limit: number,
    onProgress: (fetched: number) => void
): Promise<Comment[]> => {
    let comments: Comment[] = [];
    let nextPageToken: string | undefined = undefined;

    try {
        while (comments.length < limit) {
            const params = new URLSearchParams({
                part: 'snippet,replies',
                videoId: videoId,
                key: apiKey,
                maxResults: '100',
                order: 'relevance',
                textFormat: 'plainText'
            });

            if (nextPageToken) {
                params.set('pageToken', nextPageToken);
            }

            const response = await fetch(`${YOUTUBE_API_BASE}commentThreads?${params.toString()}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || `YouTube API error: ${response.status}`);
            }

            const data = await response.json();
            const fetchedComments = data.items.map((item: any) => transformApiComment(item));
            comments = [...comments, ...fetchedComments];
            
            onProgress(comments.length);

            if (!data.nextPageToken || comments.length >= limit) {
                break;
            }
            nextPageToken = data.nextPageToken;
        }

        return comments.slice(0, limit);
    } catch (error) {
        console.error('Failed to fetch YouTube comments:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to fetch comments: ${error.message}`);
        }
        throw new Error('An unknown error occurred while fetching comments.');
    }
};

export const fetchReplies = async (commentId: string, apiKey: string, pageToken?: string): Promise<{replies: Comment[], nextPageToken?: string}> => {
    const params = new URLSearchParams({
        part: 'snippet',
        parentId: commentId,
        key: apiKey,
        maxResults: '100',
        textFormat: 'plainText'
    });

    if(pageToken) {
        params.set('pageToken', pageToken);
    }

    const response = await fetch(`${YOUTUBE_API_BASE}comments?${params.toString()}`);
    if(!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || `YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    const replies = data.items.map((item: any) => transformApiComment(item, true));
    
    return { replies, nextPageToken: data.nextPageToken };
};
