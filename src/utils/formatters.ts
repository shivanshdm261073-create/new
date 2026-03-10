export function formatINR(value: number, decimals = 2): string {
  if (isNaN(value)) return '—';
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
  return `₹${formatted}`;
}

export function formatMarketCap(crores: number): string {
  if (crores >= 100000) {
    return `₹${(crores / 100000).toFixed(1)}L Cr`;
  }
  return `₹${crores.toLocaleString('en-IN')} Cr`;
}

export function formatVolume(vol: number): string {
  if (vol >= 10000000) return `${(vol / 10000000).toFixed(2)} Cr`;
  if (vol >= 100000) return `${(vol / 100000).toFixed(2)} L`;
  return vol.toLocaleString('en-IN');
}

export function formatChange(change: number, pct: number): { text: string; pctText: string; isPositive: boolean } {
  const isPositive = change >= 0;
  const arrow = isPositive ? '▲' : '▼';
  return {
    text: `${arrow} ${formatINR(Math.abs(change))}`,
    pctText: `${isPositive ? '+' : '-'}${Math.abs(pct).toFixed(2)}%`,
    isPositive,
  };
}
