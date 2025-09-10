/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { apiService } from '../services/api';
import { executionHistoryService } from '../services/executionHistoryService';
import { TipoETL, TipoEntidade, ETLStatus } from '../types/domain';

export interface ETLExecution {
  id: number;
  type: TipoETL;
  entity: TipoEntidade;
  status: ETLStatus;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  recordsProcessed?: number;
  recordsWithError?: number;
  errorMessage?: string;
  endpoint?: string;
  isSuccess?: boolean;
  result?: any;
}

export interface ETLState {
  isExecuting: boolean;
  executionHistory: ETLExecution[];

  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };

  formData: {
    tipoETL: TipoETL;
    entidade: TipoEntidade;
    dataInicio?: Date;
    dataFim?: Date;
    pagina: number;
    registrosPorPagina: number;
  };

  loading: boolean;
  error: string | null;
  historyLoading: boolean;

  setFormData: (data: Partial<ETLState['formData']>) => void;
  executarMovimentos: () => Promise<void>;
  executarCategorias: () => Promise<void>;
  executarFullLoad: () => Promise<void>;
  executarIncremental: () => Promise<void>;
  executarTransformacao: () => Promise<void>;
  cancelarETL: (loteId: string) => Promise<void>;
  limparErro: () => void;
  resetForm: () => void;
  addToHistory: (execution: ETLExecution) => void;
  loadExecutionHistory: (page?: number) => Promise<void>;
  refreshHistory: () => Promise<void>;
  goToPage: (page: number) => Promise<void>;
  nextPage: () => Promise<void>;
  previousPage: () => Promise<void>;
}

export type ETLFormData = ETLState['formData'];

const initialFormData = {
  tipoETL: TipoETL.FULL_LOAD,
  entidade: TipoEntidade.MOVIMENTOS,
  pagina: 1,
  registrosPorPagina: 100
};

export const useETLStore = create<ETLState>()(devtools(
  (set, get) => ({
    isExecuting: false,
    executionHistory: [],
    // Adicionar estado inicial de paginação
    pagination: {
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      totalPages: 0
    },
    formData: initialFormData,
    loading: false,
    error: null,
    historyLoading: false,

    setFormData: (data) => {
      set((state) => ({
        formData: { ...state.formData, ...data }
      }), false, 'setFormData');
    },

    executarMovimentos: async () => {
      const state = get();

      if (state.isExecuting) {
        throw new Error('Já existe uma execução ETL em andamento');
      }

      set({ loading: true, error: null }, false, 'executarMovimentos/start');

      try {
        await apiService.executarMovimentos();

        set({
          isExecuting: false,
          loading: false
        }, false, 'executarMovimentos/success');
        await get().refreshHistory();

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        set({
          loading: false,
          error: errorMessage
        }, false, 'executarMovimentos/error');
        throw error;
      }
    },

    executarCategorias: async () => {
      const state = get();

      if (state.isExecuting) {
        throw new Error('Já existe uma execução ETL em andamento');
      }

      set({ loading: true, error: null }, false, 'executarCategorias/start');

      try {
        await apiService.executarCategorias();

        set({
          isExecuting: false,
          loading: false
        }, false, 'executarCategorias/success');
        await get().refreshHistory();

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        set({
          loading: false,
          error: errorMessage
        }, false, 'executarCategorias/error');
        throw error;
      }
    },

    executarFullLoad: async () => {
      set({ loading: true, isExecuting: true, error: null }, false, 'executarFullLoad/start');

      try {
        await apiService.executarFullLoad();

        set({
          isExecuting: false,
          loading: false
        }, false, 'executarFullLoad/success');

        await get().refreshHistory();

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        set({
          loading: false,
          isExecuting: false,
          error: errorMessage
        }, false, 'executarFullLoad/error');
        throw error;
      }
    },

    executarIncremental: async () => {
      set({ loading: true, isExecuting: true, error: null }, false, 'executarIncremental/start');

      try {
        await apiService.executarIncremental();

        set({
          isExecuting: false,
          loading: false
        }, false, 'executarIncremental/success');
        await get().refreshHistory();

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        set({
          loading: false,
          isExecuting: false,
          error: errorMessage
        }, false, 'executarIncremental/error');
        throw error;
      }
    },

    executarTransformacao: async () => {
      set({ loading: true, error: null }, false, 'executarTransformacao/start');

      try {
        await apiService.executarTransformacao();

        set({
          isExecuting: false,
          loading: false
        }, false, 'executarTransformacao/success');

        await get().refreshHistory();


      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        set({
          loading: false,
          error: errorMessage
        }, false, 'executarTransformacao/error');
        throw error;
      }
    },

    cancelarETL: async (loteId: string) => {
      set({ loading: true, error: null }, false, 'cancelarETL/start');

      try {
        await apiService.cancelarETL(loteId);

        set({
          isExecuting: false,
          loading: false
        }, false, 'cancelarETL/success');

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao cancelar ETL';
        set({
          loading: false,
          error: errorMessage
        }, false, 'cancelarETL/error');
        throw error;
      }
    },
    limparErro: () => {
      set({ error: null }, false, 'limparErro');
    },

    resetForm: () => {
      set({ formData: initialFormData }, false, 'resetForm');
    },

    loadExecutionHistory: async (page?: number) => {
      const state = get();
      const currentPage = page || state.pagination.currentPage;
      const pageSize = state.pagination.pageSize;

      set({ historyLoading: true }, false, 'loadExecutionHistory/start');

      try {
        const response = await executionHistoryService.getPagedExecutions(currentPage, pageSize);

        const backendExecutions = response.executions || [];

        const calculateDuration = (startTime: string, endTime?: string): number | undefined => {
          if (!endTime) return undefined;
          const start = new Date(startTime).getTime();
          const end = new Date(endTime).getTime();
          return Math.round((end - start) / 1000);
        };

        const mapBackendTypeToTipoETL = (backendType: string): TipoETL => {
          if (backendType === 'Full Load ETL') return TipoETL.FULL_LOAD;
          if (backendType === 'Incremental ETL') return TipoETL.INCREMENTAL;
          if (backendType === 'ETL_MovimentosFinanceiros') return TipoETL.FULL_LOAD;
          return TipoETL.FULL_LOAD;
        };

        const mapBackendStatusToETLStatus = (backendStatus: string, isSuccess: boolean): ETLStatus => {
          if (backendStatus === 'Completed' && isSuccess) return ETLStatus.COMPLETED;
          if (backendStatus === 'Completed' && !isSuccess) return ETLStatus.FAILED;
          if (backendStatus === 'Running') return ETLStatus.RUNNING;
          return ETLStatus.PENDING;
        };

        const frontendExecutions: ETLExecution[] = backendExecutions.map(execution => {
          const calculatedDuration = calculateDuration(execution.startTime, execution.endTime);

          return {
            id: execution.id,
            type: mapBackendTypeToTipoETL(execution.type),
            entity: TipoEntidade.MOVIMENTOS,
            status: mapBackendStatusToETLStatus(execution.status, execution.isSuccess),
            startTime: new Date(execution.startTime),
            endTime: execution.endTime ? new Date(execution.endTime) : undefined,
            duration: calculatedDuration,
            errorMessage: execution.errorMessage,
            endpoint: execution.endpoint,
            isSuccess: execution.isSuccess,
            result: undefined
          };
        });

        set({
          executionHistory: frontendExecutions,
          pagination: {
            currentPage: response.page || currentPage,
            pageSize: response.pageSize || pageSize,
            totalCount: response.totalCount || 0,
            totalPages: response.totalPages || 0
          },
          historyLoading: false
        }, false, 'loadExecutionHistory/success');

      } catch (error) {
        console.error('❌ Erro ao carregar histórico:', error);
        set({ historyLoading: false }, false, 'loadExecutionHistory/error');
      }
    },

    refreshHistory: async () => {
      const state = get();
      await get().loadExecutionHistory(state.pagination.currentPage);
    },

    goToPage: async (page: number) => {
      await get().loadExecutionHistory(page);
    },

    nextPage: async () => {
      const state = get();
      if (state.pagination.currentPage < state.pagination.totalPages) {
        await get().loadExecutionHistory(state.pagination.currentPage + 1);
      }
    },

    previousPage: async () => {
      const state = get();
      if (state.pagination.currentPage > 1) {
        await get().loadExecutionHistory(state.pagination.currentPage - 1);
      }
    },

    addToHistory: () => {
      get().loadExecutionHistory(1);
    },

  }),
  {
    name: 'etl-store',
    partialize: (state) => ({
      executionHistory: state.executionHistory,
      formData: state.formData
    })
  }
));

export const useETLSelectors = {
  isExecuting: () => useETLStore((state) => state.isExecuting),
  executionHistory: () => useETLStore((state) => state.executionHistory),
  pagination: () => useETLStore((state) => state.pagination),
  formData: () => useETLStore((state) => state.formData),
  loading: () => useETLStore((state) => state.loading),
  error: () => useETLStore((state) => state.error),
  historyLoading: () => useETLStore((state) => state.historyLoading),

  canExecute: () => useETLStore((state) => !state.isExecuting && !state.loading),
  lastExecution: () => useETLStore((state) => state.executionHistory[0]),
  successfulExecutions: () => useETLStore((state) =>
    state.executionHistory.filter(exec => exec.status === ETLStatus.COMPLETED)
  ),
  failedExecutions: () => useETLStore((state) =>
    state.executionHistory.filter(exec => exec.status === ETLStatus.FAILED)
  )
};