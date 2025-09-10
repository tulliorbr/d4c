using d4cETL.Domain.Entities;

namespace d4cETL.Domain.Repositories;

public interface IExecutionHistoryRepository
{
  Task<ExecutionHistory?> GetByIdAsync(int id);
  Task<ExecutionHistory> AddAsync(ExecutionHistory executionHistory);
  Task UpdateAsync(ExecutionHistory executionHistory);
  Task DeleteAsync(int id);
  Task<int> GetTotalCountAsync();
  Task<IEnumerable<ExecutionHistory>> GetPagedAsync(int page, int pageSize);
}