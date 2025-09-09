import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  ETLRequest, 
  ETLResponse, 
  MovimentoResponse, 
  CategoriaResponse, 
  LoteResponse, 
  ItemLoteResponse, 
  MetricaResponse,
  KPIResponse,
  ApiResponse,
  PaginatedResponse
} from '../types';
import { env } from '../config/app';

// Configuração base da API
const API_BASE_URL = env.apiUrl;

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000, // 30 segundos
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para requests
    this.api.interceptors.request.use(
      (config) => {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor para responses
    this.api.interceptors.response.use(
      (response) => {
        console.log(`[API] Response ${response.status}:`, response.data);
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
      // Erro de resposta do servidor
      const message = error.response.data?.message || 
                     error.response.data?.error || 
                     `Erro ${error.response.status}: ${error.response.statusText}`;
      return new Error(message);
    } else if (error.request) {
      // Erro de rede
      return new Error('Erro de conexão com o servidor. Verifique sua conexão.');
    } else {
      // Erro de configuração
      return new Error(error.message || 'Erro desconhecido');
    }
  }

  // ETL Services
  async executarMovimentos(): Promise<ETLResponse> {
    const response: AxiosResponse<ApiResponse<ETLResponse>> = await this.api.post('/ETL/executar-movimentos', {});
    return response.data.data;
  }

  async executarCategorias(): Promise<ETLResponse> {
    const response: AxiosResponse<ApiResponse<ETLResponse>> = await this.api.post('/ETL/executar-categorias', {});
    return response.data.data;
  }

  async executarFullLoad(): Promise<ETLResponse> {
    const response: AxiosResponse<ApiResponse<ETLResponse>> = await this.api.post('/ETL/full-load', {});
    return response.data.data;
  }

  async executarIncremental(): Promise<ETLResponse> {
    const response: AxiosResponse<ApiResponse<ETLResponse>> = await this.api.post('/ETL/incremental', {});
    return response.data.data;
  }

  async executarTransformacao(): Promise<ETLResponse> {
    const response: AxiosResponse<ApiResponse<ETLResponse>> = await this.api.post('/ETL/transformacao', {});
    return response.data.data;
  }

  // Função removida - endpoint não existe no backend

  async cancelarETL(loteId: string): Promise<void> {
    await this.api.post(`/etl/cancelar/${loteId}`, {});
  }

  // Movimentos Services
  async obterMovimentos(params?: {
    dataInicio?: string;
    dataFim?: string;
    natureza?: string;
    categoria?: string;
    status?: string;
    pagina?: number;
    registrosPorPagina?: number;
  }): Promise<PaginatedResponse<MovimentoResponse>> {
    const response: AxiosResponse<ApiResponse<PaginatedResponse<MovimentoResponse>>> = 
      await this.api.get('/movimentos', { params });
    return response.data.data;
  }

  async obterMovimentoPorId(id: string): Promise<MovimentoResponse> {
    const response: AxiosResponse<ApiResponse<MovimentoResponse>> = 
      await this.api.get(`/movimentos/${id}`);
    return response.data.data;
  }

  // Categorias Services
  async obterCategorias(): Promise<CategoriaResponse[]> {
    const response: AxiosResponse<ApiResponse<CategoriaResponse[]>> = 
      await this.api.get('/categorias');
    return response.data.data;
  }

  // Relatórios Services
  async obterKPIs(params?: {
    dataInicio?: string;
    dataFim?: string;
  }): Promise<KPIResponse> {
    const response: AxiosResponse<ApiResponse<KPIResponse>> = 
      await this.api.get('/Relatorios/kpis', { params });
    return response.data.data;
  }

  async obterGraficoLinha(params?: {
    dataInicio?: string;
    dataFim?: string;
  }): Promise<any[]> {
    const response: AxiosResponse<ApiResponse<any[]>> = 
      await this.api.get('/Relatorios/grafico/linha', { params });
    return response.data.data;
  }

  async obterGraficoBarras(params?: {
    dataInicio?: string;
    dataFim?: string;
  }): Promise<any[]> {
    const response: AxiosResponse<ApiResponse<any[]>> = 
      await this.api.get('/Relatorios/grafico/barras', { params });
    return response.data.data;
  }

  async obterGraficoPizza(params?: {
    dataInicio?: string;
    dataFim?: string;
  }): Promise<any[]> {
    const response: AxiosResponse<ApiResponse<any[]>> = 
      await this.api.get('/Relatorios/grafico/pizza', { params });
    return response.data.data;
  }

  async obterTabela(params?: {
    dataInicio?: string;
    dataFim?: string;
  }): Promise<any[]> {
    const response: AxiosResponse<ApiResponse<any[]>> = 
      await this.api.get('/Relatorios/tabela', { params });
    return response.data.data;
  }

  // Observabilidade Services
  async obterLotes(params?: {
    dataInicio?: string;
    dataFim?: string;
    status?: string;
    entidade?: string;
    pagina?: number;
    registrosPorPagina?: number;
  }): Promise<PaginatedResponse<LoteResponse>> {
    const response: AxiosResponse<ApiResponse<PaginatedResponse<LoteResponse>>> = 
      await this.api.get('/Observabilidade/lotes', { params });
    return response.data.data;
  }

  async obterLotePorId(id: string): Promise<LoteResponse> {
    const response: AxiosResponse<ApiResponse<LoteResponse>> = 
      await this.api.get(`/Observabilidade/lotes/${id}`);
    return response.data.data;
  }

  async obterItensLote(loteId: string, params?: {
    pagina?: number;
    registrosPorPagina?: number;
  }): Promise<PaginatedResponse<ItemLoteResponse>> {
    const response: AxiosResponse<ApiResponse<PaginatedResponse<ItemLoteResponse>>> = 
      await this.api.get(`/Observabilidade/lotes/${loteId}/itens`, { params });
    return response.data.data;
  }

  async obterMetricas(params?: {
    dataInicio?: string;
    dataFim?: string;
    entidade?: string;
  }): Promise<MetricaResponse[]> {
    const response: AxiosResponse<ApiResponse<MetricaResponse[]>> = 
      await this.api.get('/Observabilidade/metricas', { params });
    return response.data.data;
  }

  async reprocessarLote(loteId: string): Promise<void> {
    await this.api.post(`/Observabilidade/lotes/${loteId}/reprocessar`, {});
  }

  // Health Check
  async verificarSaude(): Promise<{ status: string; timestamp: string }> {
    const response: AxiosResponse<{ status: string; timestamp: string }> = 
      await this.api.get('/health');
    return response.data;
  }
}

// Instância singleton do serviço
export const apiService = new ApiService();

// Exportar a classe para casos especiais
export { ApiService };

// Funções utilitárias para formatação de parâmetros
export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatDateTimeForAPI = (date: Date): string => {
  return date.toISOString();
};

export const parseAPIDate = (dateString: string): Date => {
  return new Date(dateString);
};

// Interface PollingConfig removida - polling não é mais necessário