/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  ETLExecutionResult,
  MovimentoFinanceiro,
  CategoriaDto,
  ETLBatchResumoDto,
  ETLItemDto,
  ETLMetricsDto,
  KPIData,
  TabelaMovimentosResponse,
  PaginatedResponse
} from '../types/api';
import { env } from '../config/app';

const API_BASE_URL = env.apiUrl;

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      (config) => {

        return config;
      },
      (error) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error('[API] Response error:', error.response?.data || error.message);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message ||
        error.response.data?.error ||
        `Erro ${error.response.status}: ${error.response.statusText}`;
      return new Error(message);
    } else if (error.request) {
      return new Error('Erro de conexão com o servidor. Verifique sua conexão.');
    } else {
      return new Error(error.message || 'Erro desconhecido');
    }
  }

  async executarMovimentos(): Promise<ETLExecutionResult> {
    const response: AxiosResponse<ETLExecutionResult> = await this.api.post('/ETL/executar-movimentos', {});
    return response.data;
  }

  async executarCategorias(): Promise<ETLExecutionResult> {
    const response: AxiosResponse<ETLExecutionResult> = await this.api.post('/ETL/executar-categorias', {});
    return response.data;
  }

  async executarFullLoad(): Promise<ETLExecutionResult> {
    const response: AxiosResponse<ETLExecutionResult> = await this.api.post('/ETL/full-load', {});
    return response.data;
  }

  async executarIncremental(): Promise<ETLExecutionResult> {
    const response: AxiosResponse<ETLExecutionResult> = await this.api.post('/ETL/incremental', {});
    return response.data;
  }

  async executarTransformacao(): Promise<ETLExecutionResult> {
    const response: AxiosResponse<ETLExecutionResult> = await this.api.post('/ETL/transformacao', {});
    return response.data;
  }

  async cancelarETL(loteId: string): Promise<void> {
    await this.api.post(`/etl/cancelar/${loteId}`, {});
  }


  async obterMovimentos(params?: {
    dataInicio?: string;
    dataFim?: string;
    natureza?: string;
    categoria?: string;
    status?: string;
    pagina?: number;
    tamanhoPagina?: number;
  }): Promise<PaginatedResponse<MovimentoFinanceiro>> {
    const response: AxiosResponse<PaginatedResponse<MovimentoFinanceiro>> =
      await this.api.get('/movimentos', { params });
    return response.data;
  }

  async obterMovimentoPorId(id: string): Promise<MovimentoFinanceiro> {
    const response: AxiosResponse<MovimentoFinanceiro> =
      await this.api.get(`/movimentos/${id}`);
    return response.data;
  }

  async obterCategorias(): Promise<CategoriaDto[]> {
    const response: AxiosResponse<CategoriaDto[]> =
      await this.api.get('/categorias');
    return response.data;
  }

  async obterKPIs(params?: {
    dataInicio?: string;
    dataFim?: string;
  }): Promise<KPIData> {
    const response: AxiosResponse<KPIData> =
      await this.api.get('/Relatorios/kpis', { params });
    return response.data;
  }

  async obterGraficoLinha(params?: {
    dataInicio?: string;
    dataFim?: string;
  }): Promise<any[]> {
    const response: AxiosResponse<any[]> =
      await this.api.get('/Relatorios/grafico/linha', { params });
    return response.data;
  }

  async obterGraficoBarras(params?: {
    dataInicio?: string;
    dataFim?: string;
  }): Promise<any[]> {
    const response: AxiosResponse<any[]> =
      await this.api.get('/Relatorios/grafico/barras', { params });
    return response.data;
  }

  async obterGraficoPizza(params?: {
    dataInicio?: string;
    dataFim?: string;
  }): Promise<any[]> {
    const response: AxiosResponse<any[]> =
      await this.api.get('/Relatorios/grafico/pizza', { params });
    return response.data;
  }

  async obterTabela(params?: {
    dataInicio?: string;
    dataFim?: string;
    natureza?: string;
    categoria?: string;
    status?: string;
    pagina?: number;
    tamanhoPagina?: number;
  }): Promise<TabelaMovimentosResponse> {
    const response: AxiosResponse<TabelaMovimentosResponse> =
      await this.api.get('/Relatorios/tabela', { params });
    return response.data;
  }

  async obterLotes(params?: {
    dataInicio?: string;
    dataFim?: string;
    status?: string;
    entidade?: string;
    pagina?: number;
    tamanhoPagina?: number;
  }): Promise<PaginatedResponse<ETLBatchResumoDto>> {
    const response: AxiosResponse<PaginatedResponse<ETLBatchResumoDto>> =
      await this.api.get('/Observabilidade/lotes', { params });
    return response.data;
  }

  async obterLotePorId(id: string): Promise<ETLBatchResumoDto> {
    const response: AxiosResponse<ETLBatchResumoDto> =
      await this.api.get(`/Observabilidade/lotes/${id}`);
    return response.data;
  }

  async obterItensLote(loteId: string, params?: {
    pagina?: number;
    tamanhoPagina?: number;
  }): Promise<PaginatedResponse<ETLItemDto>> {
    const response: AxiosResponse<PaginatedResponse<ETLItemDto>> =
      await this.api.get(`/Observabilidade/lotes/${loteId}/itens`, { params });
    return response.data;
  }

  async obterMetricas(params?: {
    dataInicio?: string;
    dataFim?: string;
    entidade?: string;
  }): Promise<ETLMetricsDto[]> {
    try {
      const response: AxiosResponse<ETLMetricsDto[]> =
        await this.api.get('/Observabilidade/metricas', { params });

      const data = response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erro ao obter métricas:', error);
      return [];
    }
  }

  async obterMetricasDetalhadas(entidade?: string, diasHistorico: number = 7): Promise<any> {
    const params = new URLSearchParams();
    if (entidade) params.append('entidade', entidade);
    params.append('diasHistorico', diasHistorico.toString());

    const response = await this.api.get(`/Observabilidade/metricas/detalhadas?${params}`);
    return response.data;
  }

  async obterAlertas(): Promise<any[]> {
    const response = await this.api.get('/Observabilidade/alertas');
    return response.data;
  }

  async reprocessarLote(loteId: string): Promise<void> {
    await this.api.post(`/Observabilidade/lotes/${loteId}/reprocessar`, {});
  }

  async verificarSaude(): Promise<{ status: string; timestamp: string }> {
    const response: AxiosResponse<{ status: string; timestamp: string }> =
      await this.api.get('/health');
    return response.data;
  }

  async obterHistoricoExecucoes(params?: {
    page?: number;
    pageSize?: number;
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<any> {
    if (params?.page || params?.pageSize) {
      const response = await this.api.get('/executions/history/paged', { params });
      return {
        executions: response.data.data,
        ...response.data.pagination
      };
    }

    const response = await this.api.get('/executions/history', { params });
    return {
      executions: response.data
    };
  }

  async executarETLMovimentos(params: {
    pagina: number;
    registrosPorPagina: number;
  }): Promise<ETLExecutionResult> {
    const response: AxiosResponse<ETLExecutionResult> =
      await this.api.post('/ETL/executar-movimentos', params);
    return response.data;
  }

  async executarETLCategorias(params: {
    pagina: number;
    registrosPorPagina: number;
  }): Promise<ETLExecutionResult> {
    const response: AxiosResponse<ETLExecutionResult> =
      await this.api.post('/ETL/executar-categorias', params);
    return response.data;
  }

  async executarETLFullLoad(params: {
    entidade: string;
    batchSize: number;
  }): Promise<ETLExecutionResult> {
    const response: AxiosResponse<ETLExecutionResult> =
      await this.api.post('/ETL/full-load', params);
    return response.data;
  }

  async executarETLIncremental(params: {
    entidade: string;
    batchSize: number;
  }): Promise<ETLExecutionResult> {
    const response: AxiosResponse<ETLExecutionResult> =
      await this.api.post('/ETL/incremental', params);
    return response.data;
  }
}

export const apiService = new ApiService();

export { ApiService };

export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatDateTimeForAPI = (date: Date): string => {
  return date.toISOString();
};

export const parseAPIDate = (dateString: string): Date => {
  return new Date(dateString);
};
