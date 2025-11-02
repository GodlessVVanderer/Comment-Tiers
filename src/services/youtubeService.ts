/// <reference types="chrome" />
import { Comment, VideoDetails } from "../types";

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Helper to fetch API key from storage
const getYouTubeApiKey = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['youtubeApiKey'], (result) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            if (result.youtubeApiKey) {
                resolve(result.youtubeApiKey);
            } else {
                reject(new Error("YouTube API key not found in storage."));
            }
        });
    });
}

export const getVideoDetails = async (videoId: string): Promise<VideoDetails> => {
    const apiKey = await getYouTubeApiKey();
    const url = `${YOUTUBE_API_BASE_URL}/videos?id=${videoId}&key=${apiKey}&part=snippet,statistics`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch video details from YouTube API.");
    }
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
        throw new Error("Video not found.");
    }

    const item = data.items[0];
    return {
        id: item.id,
        title: item.snippet.title,
        author: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails.default.url,
        viewCount: parseInt(item.statistics.viewCount, 10),
        likeCount: parseInt(item.statistics.likeCount, 10),
        commentCount: parseInt(item.statistics.commentCount, 10),
    };
};

// Fetches all comment threads for a video
export const getAllComments = async (videoId: string): Promise<Comment[]> => {
    const apiKey = await getYouTubeApiKey();
    let comments: Comment[] = [];
    let nextPageToken: string | undefined = undefined;

    do {
        const url = `${YOUTUBE_API_BASE_URL}/commentThreads?videoId=${videoId}&key=${apiKey}&part=snippet,replies&maxResults=100` +
                    (nextPageToken ? `&pageToken=${nextPageToken}` : '');
        
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            const message = errorData?.error?.message || "Failed to fetch comments from YouTube API.";
            throw new Error(message);
        }
        const data = await response.json();

        const pageComments = data.items.map((item: any) => {
            const topLevelComment = item.snippet.topLevelComment;
            const comment: Comment = {
                id: topLevelComment.id,
                text: topLevelComment.snippet.textDisplay,
                author: topLevelComment.snippet.authorDisplayName,
                authorProfileImageUrl: topLevelComment.snippet.authorProfileImageUrl,
                authorChannelUrl: topLevelComment.snippet.authorChannelUrl,
                likeCount: topLevelComment.snippet.likeCount,
                publishedAt: topLevelComment.snippet.publishedAt,
                replies: [],
            };

            if (item.replies) {
                comment.replies = item.replies.comments.map((reply: any) => ({
                    id: reply.id,
                    text: reply.snippet.textDisplay,
                    author: reply.snippet.authorDisplayName,
                    authorProfileImageUrl: reply.snippet.authorProfileImageUrl,
                    authorChannelUrl: reply.snippet.authorChannelUrl,
                    likeCount: reply.snippet.likeCount,
                    publishedAt: reply.snippet.publishedAt,
                }));
            }
            return comment;
        });

        comments = comments.concat(pageComments);
        nextPageToken = data.nextPageToken;

    } while (nextPageToken);

    return comments;
};
