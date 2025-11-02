export * from './categorize';

export function formatNumber(num: number): string {
    if (num === undefined || num === null) return '0';
    return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(num);
}
