import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { apiService } from '../services/api';
import { ETLRequest, ETLResponse, TipoETL, TipoEntidade, ETLStatus } from '../types';

interface ETLExecution {
  id: string;
  type: TipoETL;
  entity: TipoEntidade;
  status: ETLStatus;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  recordsProcessed?: number;
  recordsWithError?: number;
  errorMessage?: string;
  result?: any;
}

interface ETLState {
  // Estado atual
  isExecuting: boolean;
  currentExecution?: ETLExecution;
  executionHistory: ETLExecution[];
  
  // Dados de formulário
  formData: {
    tipoETL: TipoETL;
    entidade: TipoEntidade;
    dataInicio?: Date;
    dataFim?: Date;
    pagina: number;
    registrosPorPagina: number;
  };
  
  // Estados de UI
  loading: boolean;
  error: string | null;
  
  // Actions
  setFormData: (data: Partial<ETLState['formData']>) => void;
  executarMovimentos: () => Promise<void>;
  executarCategorias: () => Promise<void>;
  executarFullLoad: () => Promise<void>;
  executarIncremental: () => Promise<void>;
  executarTransformacao: () => Promise<void>;
  cancelarETL: (loteId: string) => Promise<void>;
  // verificarStatus removido - endpoint não existe no backend
  limparErro: () => void;
  resetForm: () => void;
  addToHistory: (execution: ETLExecution) => void;
  updateCurrentExecution: (updates: Partial<ETLExecution>) => void;
}

const initialFormData = {
  tipoETL: TipoETL.FULL_LOAD,
  entidade: TipoEntidade.MOVIMENTOS,
  pagina: 1,
  registrosPorPagina: 100
};

export const useETLStore = create<ETLState>()(devtools(
  (set, get) => ({
    // Estado inicial
    isExecuting: false,
    currentExecution: undefined,
    executionHistory: [],
    formData: initialFormData,
    loading: false,
    error: null,
    
    // Actions
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
        const response = await apiService.executarMovimentos();
        
        const execution: ETLExecution = {
          id: response.loteId,
          type: TipoETL.FULL_LOAD,
          entity: TipoEntidade.MOVIMENTOS,
          status: ETLStatus.RUNNING,
          startTime: new Date(),
          result: response
        };
        
        set({
          isExecuting: true,
          currentExecution: execution,
          loading: false
        }, false, 'executarMovimentos/success');
        
        // Polling removido - endpoint de status não existe no backend
        
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
        const response = await apiService.executarCategorias();
        
        const execution: ETLExecution = {
          id: response.loteId,
          type: TipoETL.FULL_LOAD,
          entity: TipoEntidade.CATEGORIAS,
          status: ETLStatus.RUNNING,
          startTime: new Date(),
          result: response
        };
        
        set({
          isExecuting: true,
          currentExecution: execution,
          loading: false
        }, false, 'executarCategorias/success');
        
        // Polling removido - endpoint de status não existe no backend
        
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
      set({ loading: true, error: null }, false, 'executarFullLoad/start');
      
      try {
        const response = await apiService.executarFullLoad();
        
        const execution: ETLExecution = {
          id: response.loteId,
          type: TipoETL.FULL_LOAD,
          entity: TipoEntidade.MOVIMENTOS,
          status: ETLStatus.RUNNING,
          startTime: new Date(),
          result: response
        };
        
        set({
          isExecuting: true,
          currentExecution: execution,
          loading: false
        }, false, 'executarFullLoad/success');
        
        // Polling removido - endpoint de status não existe no backend
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        set({
          loading: false,
          error: errorMessage
        }, false, 'executarFullLoad/error');
        throw error;
      }
    },

    executarIncremental: async () => {
      set({ loading: true, error: null }, false, 'executarIncremental/start');
      
      try {
        const response = await apiService.executarIncremental();
        
        const execution: ETLExecution = {
          id: response.loteId,
          type: TipoETL.INCREMENTAL,
          entity: TipoEntidade.MOVIMENTOS,
          status: ETLStatus.RUNNING,
          startTime: new Date(),
          result: response
        };
        
        set({
          isExecuting: true,
          currentExecution: execution,
          loading: false
        }, false, 'executarIncremental/success');
        
        // Polling removido - endpoint de status não existe no backend
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        set({
          loading: false,
          error: errorMessage
        }, false, 'executarIncremental/error');
        throw error;
      }
    },

    executarTransformacao: async () => {
      set({ loading: true, error: null }, false, 'executarTransformacao/start');
      
      try {
        const response = await apiService.executarTransformacao();
        
        const execution: ETLExecution = {
          id: response.loteId,
          type: TipoETL.TRANSFORMATION,
          entity: TipoEntidade.MOVIMENTOS,
          status: ETLStatus.RUNNING,
          startTime: new Date(),
          result: response
        };
        
        set({
          isExecuting: true,
          currentExecution: execution,
          loading: false
        }, false, 'executarTransformacao/success');
        
        // Polling removido - endpoint de status não existe no backend
        
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
        
        const state = get();
        if (state.currentExecution?.id === loteId) {
          const updatedExecution = {
            ...state.currentExecution,
            status: ETLStatus.CANCELLED,
            endTime: new Date()
          };
          
          set({
            isExecuting: false,
            currentExecution: undefined,
            loading: false
          }, false, 'cancelarETL/success');
          
          get().addToHistory(updatedExecution);
        }
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao cancelar ETL';
        set({
          loading: false,
          error: errorMessage
        }, false, 'cancelarETL/error');
        throw error;
      }
    },
    
    // Função verificarStatus removida - endpoint não existe no backend
    
    limparErro: () => {
      set({ error: null }, false, 'limparErro');
    },
    
    resetForm: () => {
      set({ formData: initialFormData }, false, 'resetForm');
    },
    
    addToHistory: (execution) => {
      set((state) => ({
        executionHistory: [execution, ...state.executionHistory].slice(0, 50) // Manter apenas os últimos 50
      }), false, 'addToHistory');
    },
    
    updateCurrentExecution: (updates) => {
      set((state) => ({
        currentExecution: state.currentExecution ? {
          ...state.currentExecution,
          ...updates
        } : undefined
      }), false, 'updateCurrentExecution');
    },
    
    // Funções de polling removidas - endpoint de status não existe no backend
  }),
  {
    name: 'etl-store',
    partialize: (state) => ({
      executionHistory: state.executionHistory,
      formData: state.formData
    })
  }
));

// Selectors para otimização de performance
export const useETLSelectors = {
  isExecuting: () => useETLStore((state) => state.isExecuting),
  currentExecution: () => useETLStore((state) => state.currentExecution),
  executionHistory: () => useETLStore((state) => state.executionHistory),
  formData: () => useETLStore((state) => state.formData),
  loading: () => useETLStore((state) => state.loading),
  error: () => useETLStore((state) => state.error),
  
  // Selectors computados
  canExecute: () => useETLStore((state) => !state.isExecuting && !state.loading),
  lastExecution: () => useETLStore((state) => state.executionHistory[0]),
  successfulExecutions: () => useETLStore((state) => 
    state.executionHistory.filter(exec => exec.status === ETLStatus.COMPLETED)
  ),
  failedExecutions: () => useETLStore((state) => 
    state.executionHistory.filter(exec => exec.status === ETLStatus.FAILED)
  )
};