export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatEta = (seconds?: number): string => {
    if (seconds === undefined || seconds < 0) {
        return 'Calculating ETA...';
    }
    if (seconds === 0) {
        return 'Finalizing...';
    }
    if (seconds < 60) {
        return `ETA: ~${Math.round(seconds)} seconds`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `ETA: ~${minutes}m ${remainingSeconds}s`;
};
