/* eslint-disable react-hooks/rules-of-hooks */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PaginatedResponse, ETLBatchResumoDto, ETLMetricsDto } from '../types';
import { ObservabilityFilters, ItemLoteResponse, ETLStatus } from '../types/domain';
import { apiService } from '../services/api';



export interface ObservabilityState {
  lotes: ETLBatchResumoDto[];
  selectedLote: ETLBatchResumoDto | null;
  totalLotes: number;
  currentPage: number;
  totalPages: number;
  
  itensLote: ItemLoteResponse[];
  totalItensLote: number;
  currentPageItens: number;
  totalPagesItens: number;
  metricas: ETLMetricsDto[];
  filters: ObservabilityFilters;
  
  loading: {
    lotes: boolean;
    itens: boolean;
    metricas: boolean;

  };
  
  errors: {
    lotes: string | null;
    itens: string | null;
    metricas: string | null;

  };
  
  pageSize: number;
  pageSizeItens: number;
  autoRefresh: boolean;
  refreshInterval: number;
  
  setFilters: (filters: Partial<ObservabilityFilters>) => void;
  loadLotes: (page?: number) => Promise<void>;
  selectLote: (lote: ETLBatchResumoDto) => void;
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
  dataInicio: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000), 
  dataFim: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
};

export const useObservabilityStore = create<ObservabilityState>()(devtools(
  (set, get) => ({
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

    filters: initialFilters,
    loading: {
      lotes: false,
      itens: false,
      metricas: false,

    },
    errors: {
      lotes: null,
      itens: null,
      metricas: null,

    },
    pageSize: 20,
    pageSizeItens: 50,
    autoRefresh: false,
    refreshInterval: 10000,
    
    setFilters: (newFilters) => {
      set((state) => ({
        filters: { ...state.filters, ...newFilters },
        currentPage: 1,
        selectedLote: null,
        itensLote: []
      }), false, 'setFilters');
      
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
          tamanhoPagina: pageSize
        };
        const response: PaginatedResponse<ETLBatchResumoDto> = await apiService.obterLotes(params);
        
        set((state) => ({
          lotes: response?.items || [],
          totalLotes: response?.totalItems || 0,
          currentPage: response?.currentPage || 1,
          totalPages: response?.totalPages || 0,
          loading: { ...state.loading, lotes: false }
        }), false, 'loadLotes/success');
        
      } catch (error) {
        console.error('ObservabilityStore - Error loading lotes:', error);
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
      
      get().loadItensLote(lote.id.toString());
    },
    
    loadItensLote: async (loteId: string, page?: number) => {
      const targetPage = page || get().currentPageItens;
      
      set((state) => ({
        loading: { ...state.loading, itens: true },
        errors: { ...state.errors, itens: null }
      }), false, 'loadItensLote/start');
      
      try {
        const { pageSizeItens } = get();
        const params = {
          pagina: targetPage,
          tamanhoPagina: pageSizeItens
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
        const response = await apiService.obterMetricas();
        const metricas = Array.isArray(response) ? response : [];
        
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
        get().loadItensLote(selectedLote.id.toString(), page);
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
          metricas: null
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
      
    },
    
    refreshData: async () => {
      const { selectedLote } = get();
      await get().loadAllData();
      if (selectedLote) {
        await get().loadItensLote(selectedLote.id.toString(), get().currentPageItens);
      }
    },
    
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

export const useObservabilitySelectors = {
  lotes: () => useObservabilityStore((state) => state.lotes),
  selectedLote: () => useObservabilityStore((state) => state.selectedLote),
  itensLote: () => useObservabilityStore((state) => state.itensLote),
  metricas: () => useObservabilityStore((state) => state.metricas),

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
  
  hasData: () => useObservabilityStore((state) => 
    state.lotes.length > 0 || 
    state.metricas.length > 0
  ),
  isLoading: () => useObservabilityStore((state) => 
    state.loading.lotes || 
    state.loading.itens || 
    state.loading.metricas
  ),
  hasErrors: () => useObservabilityStore((state) => 
    state.errors.lotes !== null || 
    state.errors.itens !== null || 
    state.errors.metricas !== null
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