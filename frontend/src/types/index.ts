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

export interface Batch {
  id: number;
  batchId: string;
  tipoExecucao: string;
  entidade: string;
  dataInicio: string;
  dataFim: string;
  status: string;
  totalRegistrosLidos: number;
  totalRegistrosProcessados: number;
  totalRegistrosInseridos: number;
  totalRegistrosAtualizados: number;
  totalRegistrosComErro: number;
  throughputRegistrosPorSegundo: number | null;
  latenciaMediaMs: number | null;
  mensagemErro: string | null;
  duracao: string;
  percentualSucesso: number | null;
}

export interface BatchItem {
  id: number;
  itemId: string;
  tipoItem: string;
  pagina: number;
  posicaoNaPagina: number;
  dataInicio: string;
  dataFim: string;
  status: string;
  operacao: string;
  numeroTentativas: number;
  duracaoMs: number;
  mensagemErro: string | null;
}

export interface BatchesResponse {
  items: Batch[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BatchItemsResponse {
  items: BatchItem[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BatchFilters {
  status?: string;
  entidade?: string;
  page?: number;
  pageSize?: number;
}

export interface BatchItemFilters {
  status?: string;
  operacao?: string;
  page?: number;
  pageSize?: number;
}

export interface MetricasDetalhadasDto {
  entidade: string;
  totalExecucoes: number;
  sucessos: number;
  falhas: number;
  percentualSucesso: number;
  tempoMedioExecucao: number;
  throughputMedio: number;
  ultimaExecucao: string;
}

export interface AlertaPerformanceDto {
  id: string;
  tipo: string;
  severidade: 'Low' | 'Medium' | 'High' | 'Critical';
  mensagem: string;
  entidade: string;
  dataOcorrencia: string;
  resolvido: boolean;
}