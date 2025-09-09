import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { apiService } from '../services/api';
import { 
  KPIResponse, 
  MovimentoResponse, 
  MovimentoNatureza, 
  MovimentoStatus,
  PaginatedResponse,
  ReportFilters,
  MovimentoFinanceiro,
  MovimentosFinanceirosResponse
} from '../types';

interface ChartData {
  monthlyTrend: {
    month: string;
    entradas: number;
    saidas: number;
    saldo: number;
  }[];
  topCategories: {
    categoria: string;
    valor: number;
    natureza: MovimentoNatureza;
    count: number;
  }[];
  statusDistribution: {
    status: MovimentoStatus;
    value: number;
    count: number;
    percentage: number;
  }[];
}

interface ReportsState {
  // KPIs
  kpis: KPIResponse | null;
  
  // Dados dos gráficos
  chartData: ChartData;
  
  // Dados da tabela
  movimentos: MovimentoFinanceiro[];
  totalMovimentos: number;
  currentPage: number;
  totalPages: number;
  
  // Filtros
  filters: ReportFilters;
  
  // Estados de loading
  loading: {
    kpis: boolean;
    charts: boolean;
    table: boolean;
  };
  
  // Erros
  errors: {
    kpis: string | null;
    charts: string | null;
    table: string | null;
  };
  
  // Configurações
  pageSize: number;
  autoRefresh: boolean;
  refreshInterval: number;
  
  // Actions
  setFilters: (filters: Partial<ReportFilters>) => void;
  loadKPIs: () => Promise<void>;
  loadChartData: () => Promise<void>;
  loadMovimentos: (page?: number) => Promise<void>;
  loadAllData: () => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  clearErrors: () => void;
  resetFilters: () => void;
  toggleAutoRefresh: () => void;
  exportData: (type: 'csv' | 'excel') => Promise<void>;
}

const initialFilters: ReportFilters = {
  dataInicio: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), // Mês passado
  dataFim: new Date(), // Hoje
};

const initialChartData: ChartData = {
  monthlyTrend: [],
  topCategories: [],
  statusDistribution: []
};

export const useReportsStore = create<ReportsState>()(devtools(
  (set, get) => ({
    // Estado inicial
    kpis: null,
    chartData: initialChartData,
    movimentos: [],
    totalMovimentos: 0,
    currentPage: 1,
    totalPages: 0,
    filters: initialFilters,
    loading: {
      kpis: false,
      charts: false,
      table: false
    },
    errors: {
      kpis: null,
      charts: null,
      table: null
    },
    pageSize: 20,
    autoRefresh: false,
    refreshInterval: 30000, // 30 segundos
    
    // Actions
    setFilters: (newFilters) => {
      set((state) => ({
        filters: { ...state.filters, ...newFilters },
        currentPage: 1 // Reset para primeira página ao filtrar
      }), false, 'setFilters');
      
      // Recarregar dados automaticamente
      get().loadAllData();
    },
    
    loadKPIs: async () => {
      set((state) => ({
        loading: { ...state.loading, kpis: true },
        errors: { ...state.errors, kpis: null }
      }), false, 'loadKPIs/start');
      
      try {
        const { filters } = get();
        const params = {
          dataInicio: filters.dataInicio?.toISOString().split('T')[0],
          dataFim: filters.dataFim?.toISOString().split('T')[0]
        };
        
        const kpis = await apiService.obterKPIs(params);
        
        set((state) => ({
          kpis,
          loading: { ...state.loading, kpis: false }
        }), false, 'loadKPIs/success');
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar KPIs';
        set((state) => ({
          loading: { ...state.loading, kpis: false },
          errors: { ...state.errors, kpis: errorMessage }
        }), false, 'loadKPIs/error');
      }
    },
    
    loadChartData: async () => {
      set((state) => ({
        loading: { ...state.loading, charts: true },
        errors: { ...state.errors, charts: null }
      }), false, 'loadChartData/start');
      
      try {
        const { filters } = get();
        const params = {
          dataInicio: filters.dataInicio?.toISOString().split('T')[0],
          dataFim: filters.dataFim?.toISOString().split('T')[0]
        };
        
        // Carregar dados em paralelo
        const [lineData, barData, pieData] = await Promise.all([
          apiService.obterGraficoLinha(params),
          apiService.obterGraficoBarras(params),
          apiService.obterGraficoPizza(params)
        ]);
        
        // Processar dados para o formato esperado
        const monthlyData = lineData || [];
        const topCategoriesData = barData || [];
        const statusData = pieData || [];
        
        const chartData: ChartData = {
          monthlyTrend: monthlyData,
          topCategories: topCategoriesData,
          statusDistribution: statusData
        };
        
        set((state) => ({
          chartData,
          loading: { ...state.loading, charts: false }
        }), false, 'loadChartData/success');
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar dados dos gráficos';
        set((state) => ({
          loading: { ...state.loading, charts: false },
          errors: { ...state.errors, charts: errorMessage }
        }), false, 'loadChartData/error');
      }
    },
    
    loadMovimentos: async (page) => {
      const targetPage = page || get().currentPage;
      
      set((state) => ({
        loading: { ...state.loading, table: true },
        errors: { ...state.errors, table: null }
      }), false, 'loadMovimentos/start');
      
      try {
        const { filters, pageSize } = get();
        const params = {
          dataInicio: filters.dataInicio?.toISOString().split('T')[0],
          dataFim: filters.dataFim?.toISOString().split('T')[0],
          natureza: filters.natureza,
          categoria: filters.categoria,
          status: filters.status,
          pagina: targetPage,
          registrosPorPagina: pageSize
        };
        
        const response: MovimentosFinanceirosResponse = await apiService.obterTabela(params);
        
        set((state) => ({
          movimentos: response?.movimentos || [],
          totalMovimentos: response?.totalRegistros || 0,
          currentPage: response?.paginaAtual || 1,
          totalPages: response?.totalPaginas || 0,
          loading: { ...state.loading, table: false }
        }), false, 'loadMovimentos/success');
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar movimentos';
        set((state) => ({
          loading: { ...state.loading, table: false },
          errors: { ...state.errors, table: errorMessage }
        }), false, 'loadMovimentos/error');
      }
    },
    
    loadAllData: async () => {
      // Carregar todos os dados em paralelo
      await Promise.all([
        get().loadKPIs(),
        get().loadChartData(),
        get().loadMovimentos(1)
      ]);
    },
    
    setPage: (page) => {
      set({ currentPage: page }, false, 'setPage');
      get().loadMovimentos(page);
    },
    
    setPageSize: (size) => {
      set({ pageSize: size, currentPage: 1 }, false, 'setPageSize');
      get().loadMovimentos(1);
    },
    
    clearErrors: () => {
      set({
        errors: {
          kpis: null,
          charts: null,
          table: null
        }
      }, false, 'clearErrors');
    },
    
    resetFilters: () => {
      set({
        filters: initialFilters,
        currentPage: 1
      }, false, 'resetFilters');
      
      get().loadAllData();
    },
    
    toggleAutoRefresh: () => {
      const { autoRefresh } = get();
      set({ autoRefresh: !autoRefresh }, false, 'toggleAutoRefresh');
      
      if (!autoRefresh) {
        // Iniciar auto refresh
        get().startAutoRefresh();
      }
    },
    
    exportData: async (type) => {
      try {
        const { movimentos, filters } = get();
        
        // Obter todos os dados para exportação (sem paginação)
        const params = {
          dataInicio: filters.dataInicio?.toISOString().split('T')[0],
          dataFim: filters.dataFim?.toISOString().split('T')[0],
          natureza: filters.natureza,
          categoria: filters.categoria,
          status: filters.status,
          registrosPorPagina: 10000 // Limite alto para exportação
        };
        
        const response: MovimentosFinanceirosResponse = await apiService.obterTabela(params);
        
        // Implementar exportação baseada no tipo
        if (type === 'csv') {
          get().exportToCSV(response?.movimentos || []);
        } else if (type === 'excel') {
          get().exportToExcel(response?.movimentos || []);
        }
        
      } catch (error) {
        console.error('Erro ao exportar dados:', error);
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
        
        get().loadAllData();
      }, refreshInterval);
    },
    
    exportToCSV: (data: MovimentoFinanceiro[]) => {
      const headers = [
        'Código Título',
        'Data Emissão',
        'Data Vencimento',
        'Data Pagamento',
        'Natureza',
        'Status',
        'Categoria',
        'Valor',
        'CPF/CNPJ Cliente'
      ];
      
      const csvContent = [
        headers.join(','),
        ...data.map(item => [
          item.nCodTitulo,
          item.dDtEmissao,
          item.dDtVenc,
          item.dDtPagamento || '',
          item.cNatureza,
          item.cStatus,
          item.cCodCateg,
          item.nValorTitulo,
          `"${item.ccpfcnpjCliente}"`
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `movimentos_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    },
    
    exportToExcel: (data: MovimentoFinanceiro[]) => {
      // Implementação básica - em produção, usar biblioteca como xlsx
      console.log('Exportação para Excel não implementada ainda');
    }
  }),
  {
    name: 'reports-store',
    partialize: (state) => ({
      filters: state.filters,
      pageSize: state.pageSize,
      autoRefresh: state.autoRefresh,
      refreshInterval: state.refreshInterval
    })
  }
));

// Selectors
export const useReportsSelectors = {
  kpis: () => useReportsStore((state) => state.kpis),
  chartData: () => useReportsStore((state) => state.chartData),
  movimentos: () => useReportsStore((state) => state.movimentos),
  pagination: () => useReportsStore((state) => ({
    current: state.currentPage,
    total: state.totalPages,
    pageSize: state.pageSize,
    totalItems: state.totalMovimentos
  })),
  filters: () => useReportsStore((state) => state.filters),
  loading: () => useReportsStore((state) => state.loading),
  errors: () => useReportsStore((state) => state.errors),
  
  // Selectors computados
  hasData: () => useReportsStore((state) => 
    state.kpis !== null || 
    state.chartData.monthlyTrend.length > 0 || 
    state.movimentos.length > 0
  ),
  isLoading: () => useReportsStore((state) => 
    state.loading.kpis || state.loading.charts || state.loading.table
  ),
  hasErrors: () => useReportsStore((state) => 
    state.errors.kpis !== null || 
    state.errors.charts !== null || 
    state.errors.table !== null
  )
};