import { apiService } from './api';
import type { ExecutionHistory } from '../types/domain';

export interface ExecutionHistoryResponse {
  data: ExecutionHistory[];
  executions: ExecutionHistory[];
  totalCount: number;
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

  async getExecutionStats(): Promise<{
    total: number;
    successful: number;
    failed: number;
    running: number;
    successRate: number;
  }> {
    const response = await this.getPagedExecutions(1, 1000); // Get a large page to calculate stats
    const executions = response.executions || [];

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