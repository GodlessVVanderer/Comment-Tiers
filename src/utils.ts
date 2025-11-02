export function formatNumber(num: number): string {
    if (num === undefined || num === null) return '0';
    return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(num);
}

export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}
