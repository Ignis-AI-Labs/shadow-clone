import type { ParamValue } from './types';

export const asString = (v: ParamValue): string =>
  typeof v === 'string' ? v.trim() : '';

export const asStringArray = (v: ParamValue): string[] => {
  if (Array.isArray(v)) return v.map((s) => s.trim()).filter(Boolean);
  if (typeof v === 'string') {
    return v.split('\n').map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

export const joinList = (items: string[]): string => items.join(', ');

export const optionalSection = (value: string, block: string): string =>
  value ? block : '';
