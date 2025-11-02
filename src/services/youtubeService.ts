
// Fix: Add Chrome types reference to resolve 'Cannot find name chrome' error.
/// <reference types="chrome" />
import { Comment, VideoDetails } from "../types";

const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3";

async function fetchYouTubeApi(endpoint: string, params: Record<string, string>) {
    const result = await chrome.storage.local.get("youtubeApiKey");
    const apiKey = result.youtubeApiKey;
    if (!apiKey) {
        throw new Error("YouTube API key not found. Please set it in the options page.");
    }
    
    const url = new URL(`${YOUTUBE_API_URL}/${endpoint}`);
    url.searchParams.append("key", apiKey);
    for (const key in params) {
        url.searchParams.append(key, params[key]);
    }
    
    const response = await fetch(url.toString());
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`YouTube API Error: ${errorData.error.message}`);
    }
    return response.json();
}

export async function getVideoDetails(videoId: string): Promise<VideoDetails> {
    const data = await fetchYouTubeApi("videos", {
        part: "snippet,statistics",
        id: videoId,
    });

    if (!data.items || data.items.length === 0) {
        throw new Error("Video not found");
    }

    const video = data.items[0];
    return {
        title: video.snippet.title,
        author: video.snippet.channelTitle,
        viewCount: parseInt(video.statistics.viewCount, 10),
        likeCount: parseInt(video.statistics.likeCount, 10),
        commentCount: parseInt(video.statistics.commentCount, 10),
    };
}

export async function getAllComments(videoId: string, onProgress: (loaded: number) => void): Promise<Comment[]> {
    let allComments: Comment[] = [];
    let nextPageToken: string | undefined = undefined;

    do {
        const params: Record<string, string> = {
            part: "snippet",
            videoId: videoId,
            maxResults: "100",
            textFormat: "html",
            order: 'relevance',
        };
        if (nextPageToken) {
            params.pageToken = nextPageToken;
        }

        const data = await fetchYouTubeApi("commentThreads", params);
        
        if (!data.items) break;

        const comments = data.items.map((item: any) => {
            const topLevelComment = item.snippet.topLevelComment.snippet;
            return {
                id: item.snippet.topLevelComment.id,
                text: topLevelComment.textDisplay,
                author: topLevelComment.authorDisplayName,
                authorProfileImageUrl: topLevelComment.authorProfileImageUrl,
                publishedAt: topLevelComment.publishedAt,
                likeCount: topLevelComment.likeCount,
                replyCount: item.snippet.totalReplyCount,
            };
        });
        
        allComments = [...allComments, ...comments];
        onProgress(allComments.length);

        nextPageToken = data.nextPageToken;

    } while (nextPageToken && allComments.length < 1000); // Limit to 1000 comments to avoid excessive API usage

    return allComments;
}