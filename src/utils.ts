// FIX: Implement utility functions

export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

export const formatEta = (seconds?: number): string => {
  if (seconds === undefined || seconds < 0) return 'ETA: calculating...';
  if (seconds < 60) return `ETA: < 1 min`;
  const minutes = Math.ceil(seconds / 60);
  return `ETA: ~${minutes} min`;
};

export function batch<T>(array: T[], size: number): T[][] {
    const batched: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        batched.push(array.slice(i, i + size));
    }
    return batched;
}
