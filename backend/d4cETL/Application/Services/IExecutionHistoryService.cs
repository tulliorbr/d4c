using d4cETL.Domain.Entities;

namespace d4cETL.Application.Services;

public interface IExecutionHistoryService
{
  Task<ExecutionHistory> StartExecutionAsync(string type);
  Task<ExecutionHistory> StartExecutionAsync(string type, string endpoint);
  Task<ExecutionHistory> CompleteExecutionAsync(int id, string status, string? errorMessage = null);
  Task<ExecutionHistory> CompleteExecutionAsync(int id, bool isSuccess, string? errorMessage = null);
  Task<ExecutionHistory> UpdateExecutionAsync(ExecutionHistory execution);
  Task DeleteExecutionAsync(int id);
  Task<int> GetTotalExecutionsCountAsync();
  Task<IEnumerable<ExecutionHistory>> GetPagedExecutionsAsync(int page, int pageSize);
}