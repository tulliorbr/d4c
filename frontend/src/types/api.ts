// Tipos para ETL
export interface ExecutarMovimentosRequest {
  pagina: number;
  registrosPorPagina: number;
}

export interface ExecutarCategoriasRequest {
  pagina: number;
  registrosPorPagina: number;
}

export interface MovimentoFinanceiroDto {
  nCodTitulo: number;
  cNumTitulo: string;
  dDtVencto: string;
  dDtEmissao: string;
  nValorTitulo: number;
  cNatureza: string;
  cStatus: string;
  nCodCategoria: number;
  cDescricaoCategoria: string;
}

export interface MovimentosFinanceirosResponse {
  movimentosFinanceiros: MovimentoFinanceiroDto[];
  totalDePaginas: number;
  totalDeRegistros: number;
}

export interface CategoriaDto {
  codigo: number;
  descricao: string;
  descricaoPadrao: string;
  tipoCategoria: string;
  contaInativa: boolean;
  natureza: string;
}

export interface CategoriasResponse {
  categoriaCadastro: CategoriaDto[];
  totalDePaginas: number;
  totalDeRegistros: number;
}

// Tipos para Observabilidade
export interface ETLBatchResumoDto {
  id: string;
  tipoEntidade: string;
  status: string;
  dataInicio: string;
  dataFim?: string;
  totalItens: number;
  itensProcessados: number;
  itensComErro: number;
  duracaoMs?: number;
  correlationId: string;
}

export interface ETLBatchDetalheDto {
  id: string;
  tipoEntidade: string;
  status: string;
  dataInicio: string;
  dataFim?: string;
  totalItens: number;
  itensProcessados: number;
  itensComErro: number;
  duracaoMs?: number;
  correlationId: string;
  itens: ETLItemDto[];
}

export interface ETLItemDto {
  id: string;
  batchId: string;
  identificadorItem: string;
  status: string;
  dataInicio: string;
  dataFim?: string;
  tentativas: number;
  duracaoMs?: number;
  mensagemErro?: string;
}

export interface ETLMetricsDto {
  id: string;
  batchId: string;
  tipoEntidade: string;
  registrosLidos: number;
  registrosProcessados: number;
  registrosComErro: number;
  throughputPorSegundo: number;
  latenciaMediaMs: number;
  dataExecucao: string;
  duracaoTotalMs: number;
}

// Tipos para Relatórios
export interface KPIData {
  entradas: number;
  saidas: number;
  saldoPeriodo: number;
  percentualRecebido: number;
  percentualPago: number;
}

export interface ChartDataPoint {
  month: string;
  entradas: number;
  saidas: number;
}

export interface CategoryChartData {
  categoria: string;
  valor: number;
  natureza: string;
}

export interface StatusDistribution {
  status: string;
  quantidade: number;
  valor: number;
}

// Interface para movimento financeiro baseada na resposta real da API
export interface MovimentoFinanceiro {
  nCodTitulo: number;
  cCodIntTitulo: string | null;
  dDtEmissao: string;
  dDtVenc: string;
  dDtPagamento: string | null;
  cNatureza: string;
  cStatus: string;
  cCodCateg: string;
  nValorTitulo: number;
  ccpfcnpjCliente: string;
}

// Interface para resposta da API de tabela de relatórios
export interface MovimentosFinanceirosResponse {
  movimentos: MovimentoFinanceiro[];
  totalRegistros: number;
  totalPaginas: number;
  paginaAtual: number;
}

// Manter interface antiga para compatibilidade
export interface MovimentoResumo {
  nCodTitulo: number;
  cNumTitulo: string;
  dDtVencto: string;
  dDtEmissao: string;
  nValorTitulo: number;
  cNatureza: string;
  cStatus: string;
  cDescricaoCategoria: string;
}

export interface MovimentosResumoResponse {
  movimentos: MovimentoResumo[];
  totalRegistros: number;
  totalPaginas: number;
  paginaAtual: number;
}

// Tipos para filtros
export interface FiltroRelatorio {
  dataInicio?: string;
  dataFim?: string;
  natureza?: string;
  categoria?: string;
  status?: string;
  pagina?: number;
  registrosPorPagina?: number;
}

// Tipos de resposta da API
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// Tipos para estados de loading
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Tipos para execução de ETL
export interface ETLExecutionResult {
  success: boolean;
  message: string;
  batchId?: string;
  totalProcessed?: number;
  errors?: string[];
}

// Tipos para métricas do sistema
export interface SystemMetrics {
  performance: {
    throughputMedio: number;
    throughputPico: number;
    latenciaMedia: number;
    tendenciaThroughput: 'up' | 'down' | 'stable';
  };
  qualidade: {
    totalProcessado: number;
    taxaErro: number;
    taxaSucesso: number;
  };
  recursos: {
    cpuUsage: number;
    memoriaUsada: number;
    memoriaTotal: number;
    discoUsado: number;
    discoTotal: number;
  };
  disponibilidade: {
    uptime: number;
    tempoOnline: number;
    ultimaFalha?: Date;
  };
  ultimaAtualizacao: string;
}