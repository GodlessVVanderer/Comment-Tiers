export const extractVideoId = (url: string): string | null => {
    if (!url) return null;
    try {
      // Standard URL: https://www.youtube.com/watch?v=...
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        const videoId = urlObj.searchParams.get('v');
        if (videoId) return videoId;
      }
      // Shortened URL: https://youtu.be/...
      if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1);
      }
    } catch (e) {
      // Fallback for URLs without a protocol (e.g., 'youtu.be/...')
      const match = url.match(/(?:v=|youtu\.be\/)([^&?]+)/);
      if (match) return match[1];
    }
    return null;
  };

export const formatEta = (seconds: number | null): string | null => {
    if (seconds === null || seconds < 1) return null;
    if (seconds < 60) return `about ${Math.round(seconds)} seconds remaining`;
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);

    if (remainingSeconds < 15) return `about ${minutes} minute${minutes > 1 ? 's' : ''} remaining`;
    if (remainingSeconds > 45) return `about ${minutes + 1} minute${minutes > 0 ? 's' : ''} remaining`;
    return `about ${minutes} minute${minutes > 1 ? 's' : ''} and a half remaining`;
};
