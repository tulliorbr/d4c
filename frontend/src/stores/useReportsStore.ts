/* eslint-disable react-hooks/rules-of-hooks */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { apiService } from '../services/api';
import {
  MovimentoNatureza,
  MovimentoStatus,
  ReportFilters
} from '../types/domain';
import { KPIData } from '../types';
import { MovimentoResumo } from '../types';

export interface ChartData {
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

export interface ReportsState {

  kpis: KPIData | null;


  chartData: ChartData;


  movimentos: MovimentoResumo[];
  totalMovimentos: number;
  currentPage: number;
  totalPages: number;


  filters: ReportFilters;

  loading: {
    kpis: boolean;
    charts: boolean;
    table: boolean;
  };


  errors: {
    kpis: string | null;
    charts: string | null;
    table: string | null;
  };

  pageSize: number;
  autoRefresh: boolean;
  refreshInterval: number;

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
  startAutoRefresh: () => void;
}

const initialFilters: ReportFilters = {
  dataInicio: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
  dataFim: new Date(),
};

const initialChartData: ChartData = {
  monthlyTrend: [],
  topCategories: [],
  statusDistribution: []
};

export const useReportsStore = create<ReportsState>()(devtools(
  (set, get) => ({
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
    refreshInterval: 30000,

    setFilters: (newFilters) => {
      set((state) => ({
        filters: { ...state.filters, ...newFilters },
        currentPage: 1
      }), false, 'setFilters');

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
          ...state,
          kpis,
          loading: { ...state.loading, kpis: false }
        }), false, 'loadKPIs/success');

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar KPIs';
        set((state) => ({
          ...state,
          loading: { ...state.loading, kpis: false },
          errors: { ...state.errors, kpis: errorMessage }
        }), false, 'loadKPIs/error');
      }
    },

    loadChartData: async () => {
      set((state) => ({
        ...state,
        loading: { ...state.loading, charts: true },
        errors: { ...state.errors, charts: null }
      }), false, 'loadChartData/start');

      try {
        const { filters } = get();
        const params = {
          dataInicio: filters.dataInicio?.toISOString().split('T')[0],
          dataFim: filters.dataFim?.toISOString().split('T')[0]
        };

        const [lineData, barData, pieData] = await Promise.all([
          apiService.obterGraficoLinha(params),
          apiService.obterGraficoBarras(params),
          apiService.obterGraficoPizza(params)
        ]);

        const monthlyData = lineData || [];
        const topCategoriesData = barData || [];
        const statusData = pieData || [];

        const chartData: ChartData = {
          monthlyTrend: monthlyData,
          topCategories: topCategoriesData,
          statusDistribution: statusData
        };

        set((state) => ({
          ...state,
          chartData,
          loading: { ...state.loading, charts: false }
        }), false, 'loadChartData/success');

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar dados dos gráficos';
        set((state) => ({
          ...state,
          loading: { ...state.loading, charts: false },
          errors: { ...state.errors, charts: errorMessage }
        }), false, 'loadChartData/error');
      }
    },

    loadMovimentos: async (page) => {
      const targetPage = page || get().currentPage;

      set((state) => ({
        ...state,
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
          tamanhoPagina: pageSize
        };

        const response = await apiService.obterTabela(params);

        set((state) => ({
          ...state,
          movimentos: response.movimentos || [],
          totalMovimentos: response.totalRegistros || 0,
          currentPage: response.paginaAtual || targetPage,
          totalPages: response.totalPaginas || 1,
          loading: { ...state.loading, table: false }
        }), false, 'loadMovimentos/success');

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar movimentos';
        set((state) => ({
          ...state,
          loading: { ...state.loading, table: false },
          errors: { ...state.errors, table: errorMessage }
        }), false, 'loadMovimentos/error');
      }
    },

    loadAllData: async () => {
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
        get().startAutoRefresh();
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

        get().loadAllData();
      }, refreshInterval);
    },


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

export const useReportsSelectors = {
  useKpis: () => useReportsStore((state) => state.kpis),
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