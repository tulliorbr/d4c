import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { apiService } from '../services/api';
import { 
  LoteResponse, 
  ItemLoteResponse, 
  MetricaResponse,
  PaginatedResponse,
  ETLStatus,
  TipoEntidade,
  ObservabilityFilters
} from '../types';

interface ExecutionSummary {
  entidade: TipoEntidade;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageDuration: number;
  averageLatency: number;
  throughput: number;
  lastExecution?: Date;
  totalRecordsProcessed: number;
  totalRecordsWithError: number;
}

interface ObservabilityState {
  // Lotes
  lotes: LoteResponse[];
  selectedLote: LoteResponse | null;
  totalLotes: number;
  currentPage: number;
  totalPages: number;
  
  // Itens do lote selecionado
  itensLote: ItemLoteResponse[];
  totalItensLote: number;
  currentPageItens: number;
  totalPagesItens: number;
  
  // Métricas
  metricas: MetricaResponse[];
  
  // Resumo de execuções
  executionSummaries: ExecutionSummary[];
  
  // Filtros
  filters: ObservabilityFilters;
  
  // Estados de loading
  loading: {
    lotes: boolean;
    itens: boolean;
    metricas: boolean;
    resumo: boolean;
  };
  
  // Erros
  errors: {
    lotes: string | null;
    itens: string | null;
    metricas: string | null;
    resumo: string | null;
  };
  
  // Configurações
  pageSize: number;
  pageSizeItens: number;
  autoRefresh: boolean;
  refreshInterval: number;
  
  // Actions
  setFilters: (filters: Partial<ObservabilityFilters>) => void;
  loadLotes: (page?: number) => Promise<void>;
  selectLote: (lote: LoteResponse) => void;
  loadItensLote: (loteId: string, page?: number) => Promise<void>;
  loadMetricas: () => Promise<void>;
  reprocessarLote: (loteId: string) => Promise<void>;
  loadAllData: () => Promise<void>;
  setPage: (page: number) => void;
  setPageItens: (page: number) => void;
  setPageSize: (size: number) => void;
  clearErrors: () => void;
  resetFilters: () => void;
  toggleAutoRefresh: () => void;
  refreshData: () => Promise<void>;
}

const initialFilters: ObservabilityFilters = {
  dataInicio: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), // 7 dias atrás
  dataFim: new Date(), // Hoje
};

export const useObservabilityStore = create<ObservabilityState>()(devtools(
  (set, get) => ({
    // Estado inicial
    lotes: [],
    selectedLote: null,
    totalLotes: 0,
    currentPage: 1,
    totalPages: 0,
    itensLote: [],
    totalItensLote: 0,
    currentPageItens: 1,
    totalPagesItens: 0,
    metricas: [],
    executionSummaries: [],
    filters: initialFilters,
    loading: {
      lotes: false,
      itens: false,
      metricas: false,
      resumo: false
    },
    errors: {
      lotes: null,
      itens: null,
      metricas: null,
      resumo: null
    },
    pageSize: 20,
    pageSizeItens: 50,
    autoRefresh: false,
    refreshInterval: 10000, // 10 segundos
    
    // Actions
    setFilters: (newFilters) => {
      set((state) => ({
        filters: { ...state.filters, ...newFilters },
        currentPage: 1,
        selectedLote: null,
        itensLote: []
      }), false, 'setFilters');
      
      // Recarregar dados automaticamente
      get().loadAllData();
    },
    
    loadLotes: async (page) => {
      const targetPage = page || get().currentPage;
      
      set((state) => ({
        loading: { ...state.loading, lotes: true },
        errors: { ...state.errors, lotes: null }
      }), false, 'loadLotes/start');
      
      try {
        const { filters, pageSize } = get();
        const params = {
          dataInicio: filters.dataInicio?.toISOString().split('T')[0],
          dataFim: filters.dataFim?.toISOString().split('T')[0],
          status: filters.status,
          entidade: filters.entidade,
          pagina: targetPage,
          registrosPorPagina: pageSize
        };
        
        const response: PaginatedResponse<LoteResponse> = await apiService.obterLotes(params);
        
        set((state) => ({
          lotes: response?.items || [],
          totalLotes: response?.totalItems || 0,
          currentPage: response?.currentPage || 1,
          totalPages: response?.totalPages || 0,
          loading: { ...state.loading, lotes: false }
        }), false, 'loadLotes/success');
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar lotes';
        set((state) => ({
          loading: { ...state.loading, lotes: false },
          errors: { ...state.errors, lotes: errorMessage }
        }), false, 'loadLotes/error');
      }
    },
    
    selectLote: (lote) => {
      set({
        selectedLote: lote,
        itensLote: [],
        currentPageItens: 1
      }, false, 'selectLote');
      
      // Carregar itens do lote automaticamente
      get().loadItensLote(lote.id);
    },
    
    loadItensLote: async (loteId, page) => {
      const targetPage = page || get().currentPageItens;
      
      set((state) => ({
        loading: { ...state.loading, itens: true },
        errors: { ...state.errors, itens: null }
      }), false, 'loadItensLote/start');
      
      try {
        const { pageSizeItens } = get();
        const params = {
          pagina: targetPage,
          registrosPorPagina: pageSizeItens
        };
        
        const response: PaginatedResponse<ItemLoteResponse> = 
          await apiService.obterItensLote(loteId, params);
        
        set((state) => ({
          itensLote: response?.items || [],
          totalItensLote: response?.totalItems || 0,
          currentPageItens: response?.currentPage || 1,
          totalPagesItens: response?.totalPages || 0,
          loading: { ...state.loading, itens: false }
        }), false, 'loadItensLote/success');
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar itens do lote';
        set((state) => ({
          loading: { ...state.loading, itens: false },
          errors: { ...state.errors, itens: errorMessage }
        }), false, 'loadItensLote/error');
      }
    },
    
    loadMetricas: async () => {
      set((state) => ({
        loading: { ...state.loading, metricas: true },
        errors: { ...state.errors, metricas: null }
      }), false, 'loadMetricas/start');
      
      try {
        const { filters } = get();
        const params = {
          dataInicio: filters.dataInicio?.toISOString().split('T')[0],
          dataFim: filters.dataFim?.toISOString().split('T')[0],
          entidade: filters.entidade
        };
        
        const metricas = await apiService.obterMetricas(params);
        
        set((state) => ({
          metricas,
          loading: { ...state.loading, metricas: false }
        }), false, 'loadMetricas/success');
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar métricas';
        set((state) => ({
          loading: { ...state.loading, metricas: false },
          errors: { ...state.errors, metricas: errorMessage }
        }), false, 'loadMetricas/error');
      }
    },
    
    reprocessarLote: async (loteId: string) => {
      set((state) => ({
        loading: { ...state.loading, lotes: true },
        errors: { ...state.errors, lotes: null }
      }), false, 'reprocessarLote/start');
      
      try {
        await apiService.reprocessarLote(loteId);
        
        // Recarregar a lista de lotes após reprocessamento
        await get().loadLotes();
        
        set((state) => ({
          loading: { ...state.loading, lotes: false }
        }), false, 'reprocessarLote/success');
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao reprocessar lote';
        set((state) => ({
          loading: { ...state.loading, lotes: false },
          errors: { ...state.errors, lotes: errorMessage }
        }), false, 'reprocessarLote/error');
        throw error;
      }
    },
    
    loadAllData: async () => {
      // Carregar dados principais em paralelo
      await Promise.all([
        get().loadLotes(1),
        get().loadMetricas()
      ]);
    },
    
    setPage: (page) => {
      set({ currentPage: page }, false, 'setPage');
      get().loadLotes(page);
    },
    
    setPageItens: (page) => {
      const { selectedLote } = get();
      if (selectedLote) {
        set({ currentPageItens: page }, false, 'setPageItens');
        get().loadItensLote(selectedLote.id, page);
      }
    },
    
    setPageSize: (size) => {
      set({ pageSize: size, currentPage: 1 }, false, 'setPageSize');
      get().loadLotes(1);
    },
    
    clearErrors: () => {
      set({
        errors: {
          lotes: null,
          itens: null,
          metricas: null,
          resumo: null
        }
      }, false, 'clearErrors');
    },
    
    resetFilters: () => {
      set({
        filters: initialFilters,
        currentPage: 1,
        selectedLote: null,
        itensLote: []
      }, false, 'resetFilters');
      
      get().loadAllData();
    },
    
    toggleAutoRefresh: () => {
      const { autoRefresh } = get();
      set({ autoRefresh: !autoRefresh }, false, 'toggleAutoRefresh');
      
      if (!autoRefresh) {
        get().startAutoRefresh();
      }
    },
    
    refreshData: async () => {
      const { selectedLote } = get();
      
      // Recarregar dados principais
      await get().loadAllData();
      
      // Se há um lote selecionado, recarregar seus itens também
      if (selectedLote) {
        await get().loadItensLote(selectedLote.id, get().currentPageItens);
      }
    },
    
    // Métodos privados
    startAutoRefresh: () => {
      const { refreshInterval } = get();
      
      const intervalId = setInterval(() => {
        const { autoRefresh } = get();
        if (!autoRefresh) {
          clearInterval(intervalId);
          return;
        }
        
        get().refreshData();
      }, refreshInterval);
    }
  }),
  {
    name: 'observability-store',
    partialize: (state) => ({
      filters: state.filters,
      pageSize: state.pageSize,
      pageSizeItens: state.pageSizeItens,
      autoRefresh: state.autoRefresh,
      refreshInterval: state.refreshInterval
    })
  }
));

// Selectors
export const useObservabilitySelectors = {
  lotes: () => useObservabilityStore((state) => state.lotes),
  selectedLote: () => useObservabilityStore((state) => state.selectedLote),
  itensLote: () => useObservabilityStore((state) => state.itensLote),
  metricas: () => useObservabilityStore((state) => state.metricas),
  executionSummaries: () => useObservabilityStore((state) => state.executionSummaries),
  pagination: () => useObservabilityStore((state) => ({
    current: state.currentPage,
    total: state.totalPages,
    pageSize: state.pageSize,
    totalItems: state.totalLotes
  })),
  paginationItens: () => useObservabilityStore((state) => ({
    current: state.currentPageItens,
    total: state.totalPagesItens,
    pageSize: state.pageSizeItens,
    totalItems: state.totalItensLote
  })),
  filters: () => useObservabilityStore((state) => state.filters),
  loading: () => useObservabilityStore((state) => state.loading),
  errors: () => useObservabilityStore((state) => state.errors),
  
  // Selectors computados
  hasData: () => useObservabilityStore((state) => 
    state.lotes.length > 0 || 
    state.metricas.length > 0 || 
    state.executionSummaries.length > 0
  ),
  isLoading: () => useObservabilityStore((state) => 
    state.loading.lotes || 
    state.loading.itens || 
    state.loading.metricas || 
    state.loading.resumo
  ),
  hasErrors: () => useObservabilityStore((state) => 
    state.errors.lotes !== null || 
    state.errors.itens !== null || 
    state.errors.metricas !== null || 
    state.errors.resumo !== null
  ),
  runningLotes: () => useObservabilityStore((state) => 
    state.lotes.filter(lote => lote.status === ETLStatus.RUNNING)
  ),
  failedLotes: () => useObservabilityStore((state) => 
    state.lotes.filter(lote => lote.status === ETLStatus.FAILED)
  ),
  completedLotes: () => useObservabilityStore((state) => 
    state.lotes.filter(lote => lote.status === ETLStatus.COMPLETED)
  )
};