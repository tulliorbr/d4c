/* eslint-disable @typescript-eslint/no-explicit-any */
// Tipos para o domínio da aplicação

// Enums
export enum ETLStatus {
  PENDING = 'Pendente',
  RUNNING = 'Executando',
  COMPLETED = 'Concluído',
  FAILED = 'Falhou',
  CANCELLED = 'Cancelado'
}

export enum MovimentoNatureza {
  RECEITA = 'R',
  PAGAMENTO = 'P'
}

export enum MovimentoStatus {
  ABERTO = 'Aberto',
  PAGO = 'Pago',
  VENCIDO = 'Vencido',
  CANCELADO = 'Cancelado',
  PARCIAL = 'Parcial'
}

export enum TipoETL {
  FULL_LOAD = 'full_load',
  INCREMENTAL = 'incremental'
}

export enum TipoEntidade {
  MOVIMENTOS = 'movimentos',
  CATEGORIAS = 'categorias'
}

// Interfaces para componentes
export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  description?: string;
}

export interface DashboardCard {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: string;
  color?: string;
}

export interface ChartConfig {
  title: string;
  type: 'line' | 'bar' | 'pie' | 'area';
  data: any[];
  options?: any;
}

export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number) => void;
  };
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
}

// Estados da aplicação
export interface ETLState {
  isExecuting: boolean;
  lastExecution?: {
    type: TipoETL;
    entity: TipoEntidade;
    timestamp: Date;
    result: any;
  };
  executionHistory: any[];
}

export interface ReportsState {
  kpis: {
    entradas: number;
    saidas: number;
    saldoPeriodo: number;
    percentualRecebido: number;
    percentualPago: number;
  };
  chartData: {
    monthlyTrend: any[];
    topCategories: any[];
    statusDistribution: any[];
  };
  tableData: {
    movimentos: any[];
    totalPages: number;
    currentPage: number;
  };
  filters: {
    dateRange: [Date?, Date?];
    natureza?: MovimentoNatureza;
    categoria?: string;
    status?: MovimentoStatus;
  };
  isLoading: boolean;
}

export interface ObservabilityState {
  batches: any[];
  selectedBatch?: any;
  batchItems: any[];
  metrics: any[];
  isLoading: boolean;
  filters: {
    dateRange: [Date?, Date?];
    status?: ETLStatus;
    entity?: TipoEntidade;
  };
}

export interface AppState {
  etl: ETLState;
  reports: ReportsState;
  observability: ObservabilityState;
  ui: {
    sidebarCollapsed: boolean;
    theme: 'light' | 'dark';
    notifications: Notification[];
  };
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  autoClose?: boolean;
}

// Tipos para formulários
export interface ETLFormData {
  tipoETL: TipoETL;
  entidade: TipoEntidade;
  dataInicio?: Date;
  dataFim?: Date;
  pagina?: number;
  registrosPorPagina?: number;
}

export interface ReportFilters {
  dataInicio?: Date;
  dataFim?: Date;
  natureza?: MovimentoNatureza;
  categoria?: string;
  status?: MovimentoStatus;
}

export interface ObservabilityFilters {
  dataInicio?: Date;
  dataFim?: Date;
  status?: ETLStatus;
  entidade?: TipoEntidade;
}

// Tipos para animações
export interface AnimationConfig {
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
}

export interface PageTransition {
  enter: AnimationConfig;
  exit: AnimationConfig;
}

// Tipos para configuração de gráficos ECharts
export interface EChartsOption {
  title?: any;
  tooltip?: any;
  legend?: any;
  grid?: any;
  xAxis?: any;
  yAxis?: any;
  series?: any[];
  color?: string[];
  backgroundColor?: string;
  animation?: boolean;
  animationDuration?: number;
}

// Tipos para métricas de performance
export interface PerformanceMetrics {
  throughput: number;
  latency: number;
  errorRate: number;
  successRate: number;
  totalProcessed: number;
  averageProcessingTime: number;
}

// Tipos para configuração da aplicação
export interface AppConfig {
  apiBaseUrl: string;
  defaultPageSize: number;
  refreshInterval: number;
  animationDuration: number;
  chartColors: string[];
  dateFormat: string;
  currencyFormat: {
    locale: string;
    currency: string;
  };
}