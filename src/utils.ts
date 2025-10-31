// FIX: Add chrome type declaration to fix build errors due to missing @types/chrome.
declare const chrome: any;

import { Comment } from './types';

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatDuration = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
};

// This function now runs in the content script context, but communicates with background.js
export const prefilterComments = (
    rawComments: any[],
    onUpdate: (processed: number) => void
): Promise<string[]> => {
    return new Promise((resolve) => {
        // We send the comments to the background script to do the heavy lifting,
        // to avoid blocking the main UI thread on the YouTube page.
        chrome.runtime.sendMessage(
            { action: 'prefilter-comments', comments: rawComments },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Error communicating with background script:', chrome.runtime.lastError.message);
                    resolve([]); // Resolve with empty on error
                    return;
                }

                const filteredCommentObjects: any[] = response.filteredComments;
                
                // Now we need to map the full comment objects back to just their text
                const commentMap = new Map<string, any>();
                const flattenComments = (items: any[]) => {
                    items.forEach(item => {
                        const topLevelComment = item.snippet?.topLevelComment;
                        if (topLevelComment) {
                            commentMap.set(topLevelComment.id, topLevelComment);
                        }
                        if (item.replies?.comments) {
                            item.replies.comments.forEach((reply: any) => commentMap.set(reply.id, reply));
                        }
                    });
                };
                flattenComments(rawComments);

                const finalFilteredTexts = filteredCommentObjects.map(item => {
                    const fullComment = commentMap.get(item.snippet.topLevelComment.id);
                    return fullComment.snippet.textOriginal;
                });
                
                // The background script does the work, so we just signal completion here.
                onUpdate(rawComments.length);
                resolve(finalFilteredTexts);
            }
        );
    });
};