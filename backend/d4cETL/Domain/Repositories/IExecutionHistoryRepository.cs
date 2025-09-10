using d4cETL.Domain.Entities;

namespace d4cETL.Domain.Repositories;

public interface IExecutionHistoryRepository
{
    Task<IEnumerable<ExecutionHistory>> GetAllAsync();
    Task<ExecutionHistory?> GetByIdAsync(int id);
    Task<IEnumerable<ExecutionHistory>> GetByTypeAsync(string type);
    Task<IEnumerable<ExecutionHistory>> GetRecentAsync(int count = 10);
    Task<ExecutionHistory> AddAsync(ExecutionHistory executionHistory);
    Task UpdateAsync(ExecutionHistory executionHistory);
    Task DeleteAsync(int id);
    Task<int> GetTotalCountAsync();
    Task<IEnumerable<ExecutionHistory>> GetPagedAsync(int page, int pageSize);
}