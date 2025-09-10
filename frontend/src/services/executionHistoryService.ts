import { apiService } from './api';
import type { ExecutionHistory } from '../types/domain';

export interface ExecutionHistoryResponse {
  data: ExecutionHistory[];
  executions: ExecutionHistory[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ExecutionHistoryFilters {
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

class ExecutionHistoryService {
  private readonly baseUrl = '/executions';

  async getPagedExecutions(
    page: number = 1,
    pageSize: number = 10,
    filters: ExecutionHistoryFilters = {}
  ): Promise<ExecutionHistoryResponse> {
    const response = await apiService.obterHistoricoExecucoes({
      page,
      pageSize,
      ...filters
    });
    return response;
  }

  async getAllExecutions(): Promise<ExecutionHistory[]> {
    const response = await apiService.obterHistoricoExecucoes();
    return response.executions || [];
  }

  async getRecentExecutions(): Promise<ExecutionHistory[]> {
    const response = await apiService.obterHistoricoExecucoes({ pageSize: 10 });
    return response.executions || [];
  }

  async getExecutionById(id: string): Promise<ExecutionHistory> {
    const response = await apiService.obterHistoricoExecucoes();
    const execution = response.executions?.find((exec: ExecutionHistory) => exec.id.toString() === id);
    if (!execution) {
      throw new Error(`Execução com ID ${id} não encontrada`);
    }
    return execution;
  }

  async getExecutionsByType(type: string): Promise<ExecutionHistory[]> {
    const response = await apiService.obterHistoricoExecucoes({ type });
    return response.executions || [];
  }

  async getExecutionStats(): Promise<{
    total: number;
    successful: number;
    failed: number;
    running: number;
    successRate: number;
  }> {
    const executions = await this.getAllExecutions();

    const total = executions.length;
    const successful = executions.filter(e => e.status === 'Concluído').length;
    const failed = executions.filter(e => e.status === 'Erro').length;
    const running = executions.filter(e => e.status === 'Em Execução').length;
    const successRate = total > 0 ? (successful / total) * 100 : 0;

    return {
      total,
      successful,
      failed,
      running,
      successRate: Math.round(successRate * 100) / 100
    };
  }
}

export const executionHistoryService = new ExecutionHistoryService();
export default executionHistoryService;