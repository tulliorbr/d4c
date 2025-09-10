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

export interface ETLBatchResumoDto {
  id: number;
  batchId: string;
  tipoExecucao: string;
  entidade: string;
  dataInicio: string;
  dataFim?: string;
  status: string;
  totalRegistrosLidos: number;
  totalRegistrosProcessados: number;
  totalRegistrosInseridos: number;
  totalRegistrosAtualizados: number;
  totalRegistrosComErro: number;
  throughputRegistrosPorSegundo?: number;
  latenciaMediaMs?: number;
  mensagemErro?: string;
  duracao?: string;
  percentualSucesso?: number;
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
  entidade: string;
  ultimaExecucao: string;
  statusUltimaExecucao: string;
  registrosLidosUltimaExecucao: number;
  registrosProcessadosUltimaExecucao: number;
  registrosComErroUltimaExecucao: number;
  throughputMedio: number;
  latenciaMedia: number;
  totalExecucoes: number;
  taxaSucessoMedia: number;
}

export interface MetricasDetalhadasDto {
  metricasAtuais: ETLMetricsDto[];
  tendenciasHistoricas: TendenciaMetricaDto[];
  alertas: AlertaPerformanceDto[];
  resumoGeral: ResumoPerformanceDto;
}

export interface TendenciaMetricaDto {
  entidade: string;
  data: string;
  throughputMedio: number;
  latenciaMedia: number;
  taxaSucesso: number;
  totalExecucoes: number;
}

export interface AlertaPerformanceDto {
  id: string;
  entidade: string;
  tipo: string;
  severidade: string;
  mensagem: string;
  valorAtual: number;
  limiteEsperado: number;
  dataDeteccao: string;
  ativo: boolean;
}

export interface ResumoPerformanceDto {
  totalEntidades: number;
  entidadesComAlertas: number;
  throughputMedioGeral: number;
  latenciaMediaGeral: number;
  taxaSucessoGeral: number;
  tendenciaThroughput: number;
  tendenciaLatencia: number;
  tendenciaTaxaSucesso: number;
  ultimaAtualizacao: string;
}

export interface KPIData {
  totalEntradas: number;
  totalSaidas: number;
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

export interface MovimentosFinanceirosResponse {
  movimentos: MovimentoFinanceiro[];
  totalRegistros: number;
  totalPaginas: number;
  paginaAtual: number;
}

export interface TabelaMovimentosResponse {
  movimentos: MovimentoResumo[];
  totalRegistros: number;
  totalPaginas: number;
  paginaAtual: number;
}

export interface MovimentoResumo {
  nCodTitulo: number;
  cCodIntTitulo?: string;
  dDtEmissao?: string;
  dDtVenc?: string;
  dDtPagamento?: string;
  cNatureza: string;
  cStatus?: string;
  cCodCateg?: string;
  descricaoCategoria?: string;
  nValorTitulo: number;
  ccpfcnpjCliente?: string;
}

export interface MovimentosResumoResponse {
  movimentos: MovimentoResumo[];
  totalRegistros: number;
  totalPaginas: number;
  paginaAtual: number;
}

export interface FiltroRelatorio {
  dataInicio?: string;
  dataFim?: string;
  natureza?: string;
  categoria?: string;
  status?: string;
  pagina?: number;
  registrosPorPagina?: number;
}

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

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface ETLExecutionResult {
  success: boolean;
  message: string;
  batchId?: string;
  totalProcessed?: number;
  errors?: string[];
}

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