/* eslint-disable @typescript-eslint/no-explicit-any */
export * from './api';
export * from './domain';

export type { ReactNode, ComponentProps, FC } from 'react';

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface CustomEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
}

// Tipos para hooks
export interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export interface UsePaginationResult {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (size: number) => void;
}

// Tipos para validação
export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Tipos para formatação
export interface FormatOptions {
  currency?: {
    locale: string;
    currency: string;
  };
  date?: {
    format: string;
    locale: string;
  };
  number?: {
    decimals: number;
    thousandsSeparator: string;
    decimalSeparator: string;
  };
}