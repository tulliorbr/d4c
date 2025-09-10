/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from './api';
import { BatchesResponse, BatchItemsResponse, BatchFilters, BatchItemFilters } from '../types';

class BatchService {
  async getBatches(filters?: BatchFilters): Promise<BatchesResponse> {
    try {
      const params: Record<string, any> = {};

      if (filters?.status) params.status = filters.status;
      if (filters?.entidade) params.entidade = filters.entidade;
      if (filters?.page) params.pagina = filters.page;
      if (filters?.pageSize) params.tamanhoPagina = filters.pageSize;

      const response = await apiService['api'].get('/Observabilidade/lotes', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar lotes:', error);
      throw new Error('Falha ao carregar lotes');
    }
  }

  async getBatchItems(batchId: number, filters?: BatchItemFilters): Promise<BatchItemsResponse> {
    try {
      const params: Record<string, any> = {};

      if (filters?.status) params.status = filters.status;
      if (filters?.operacao) params.operacao = filters.operacao;
      if (filters?.page) params.pagina = filters.page;
      if (filters?.pageSize) params.tamanhoPagina = filters.pageSize;

      const response = await apiService['api'].get(`/Observabilidade/lotes/${batchId}/itens`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar itens do lote:', error);
      throw new Error('Falha ao carregar itens do lote');
    }
  }


  formatDuration(duration: string): string {
    try {
      const parts = duration.split(':');
      if (parts.length >= 3) {
        const hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);
        const seconds = parseFloat(parts[2]);

        if (hours > 0) {
          return `${hours}h ${minutes}m ${seconds.toFixed(1)}s`;
        } else if (minutes > 0) {
          return `${minutes}m ${seconds.toFixed(1)}s`;
        } else {
          return `${seconds.toFixed(1)}s`;
        }
      }
      return duration;
    } catch {
      return duration;
    }
  }


  formatDate(dateString: string): string {
    try {
      let utcDate: Date;

      if (!dateString.includes('Z') && !dateString.includes('+') && !dateString.includes('-', 10)) {
        utcDate = new Date(dateString + 'Z');
      } else {
        utcDate = new Date(dateString);
      }

      return utcDate.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'America/Sao_Paulo'
      });
    } catch {
      return dateString;
    }
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'concluido':
      case 'sucesso':
        return 'text-green-600 bg-green-100';
      case 'erro':
      case 'falha':
        return 'text-red-600 bg-red-100';
      case 'processando':
      case 'em_andamento':
        return 'text-blue-600 bg-blue-100';
      case 'cancelado':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'concluido':
      case 'sucesso':
        return 'CheckCircle';
      case 'erro':
      case 'falha':
        return 'XCircle';
      case 'processando':
      case 'em_andamento':
        return 'Clock';
      case 'cancelado':
        return 'MinusCircle';
      default:
        return 'Circle';
    }
  }
}

export const batchService = new BatchService();
export { BatchService };