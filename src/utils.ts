
export const formatEta = (seconds: number | null): string => {
  if (seconds === null || seconds < 0) {
    return 'ETA: Calculating...';
  }
  if (seconds < 60) {
    return `ETA: ~${Math.round(seconds)} seconds`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  
  return `ETA: ~${minutes}m ${remainingSeconds}s remaining`;
};