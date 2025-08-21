/**
 * Utility functions for working with stock data
 */

export const getChangeColorClass = (change: number): string => {
  if (change > 0) return 'text-success';
  if (change < 0) return 'text-danger';
  return 'text-text-secondary';
};

export const getChangeBackgroundClass = (change: number): string => {
  if (change > 0) return 'text-success bg-success-light';
  if (change < 0) return 'text-danger bg-danger-light';
  return 'text-text-secondary bg-surface-secondary';
};

export const formatChange = (change: number): string => {
  return `${change > 0 ? '+' : ''}${change.toFixed(2)}`;
};

export const formatChangePercent = (changePercent: number): string => {
  return `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
};
