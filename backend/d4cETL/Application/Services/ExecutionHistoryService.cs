using d4cETL.Domain.Entities;
using d4cETL.Domain.Repositories;

namespace d4cETL.Application.Services;

public class ExecutionHistoryService : IExecutionHistoryService
{
    private readonly IExecutionHistoryRepository _repository;

    public ExecutionHistoryService(IExecutionHistoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ExecutionHistory>> GetAllExecutionsAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<ExecutionHistory?> GetExecutionByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<ExecutionHistory>> GetExecutionsByTypeAsync(string type)
    {
        return await _repository.GetByTypeAsync(type);
    }

    public async Task<IEnumerable<ExecutionHistory>> GetRecentExecutionsAsync(int count = 10)
    {
        return await _repository.GetRecentAsync(count);
    }

    public async Task<ExecutionHistory> StartExecutionAsync(string type)
    {
        var brazilTimeZone = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");
        var brazilTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, brazilTimeZone);
        
        var execution = new ExecutionHistory
        {
            Type = type,
            Status = "Running",
            StartTime = brazilTime,
            CreatedAt = brazilTime,
            UpdatedAt = brazilTime
        };

        return await _repository.AddAsync(execution);
    }

    public async Task<ExecutionHistory> StartExecutionAsync(string type, string endpoint)
    {
        var brazilTimeZone = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");
        var brazilTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, brazilTimeZone);
        
        var execution = new ExecutionHistory
        {
            Type = type,
            Endpoint = endpoint,
            Status = "Running",
            StartTime = brazilTime,
            CreatedAt = brazilTime,
            UpdatedAt = brazilTime
        };

        return await _repository.AddAsync(execution);
    }

    public async Task<ExecutionHistory> CompleteExecutionAsync(int id, string status, string? errorMessage = null)
    {
        var execution = await _repository.GetByIdAsync(id);
        if (execution == null)
        {
            throw new ArgumentException($"Execution with ID {id} not found.");
        }

        var brazilTimeZone = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");
        var brazilTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, brazilTimeZone);
        
        execution.Status = status;
        execution.EndTime = brazilTime;
        execution.ErrorMessage = errorMessage;
        execution.UpdatedAt = brazilTime;

        await _repository.UpdateAsync(execution);
        return execution;
    }

    public async Task<ExecutionHistory> CompleteExecutionAsync(int id, bool isSuccess, string? errorMessage = null)
    {
        var execution = await _repository.GetByIdAsync(id);
        if (execution == null)
        {
            throw new ArgumentException($"Execution with ID {id} not found.");
        }

        var brazilTimeZone = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");
        var brazilTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, brazilTimeZone);
        
        execution.IsSuccess = isSuccess;
        execution.Status = isSuccess ? "Completed" : "Failed";
        execution.EndTime = brazilTime;
        execution.ErrorMessage = errorMessage;
        execution.UpdatedAt = brazilTime;

        await _repository.UpdateAsync(execution);
        return execution;
    }

    public async Task<ExecutionHistory> UpdateExecutionAsync(ExecutionHistory execution)
    {
        var brazilTimeZone = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");
        var brazilTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, brazilTimeZone);
        
        execution.UpdatedAt = brazilTime;
        await _repository.UpdateAsync(execution);
        return execution;
    }

    public async Task DeleteExecutionAsync(int id)
    {
        await _repository.DeleteAsync(id);
    }

    public async Task<int> GetTotalExecutionsCountAsync()
    {
        return await _repository.GetTotalCountAsync();
    }

    public async Task<IEnumerable<ExecutionHistory>> GetPagedExecutionsAsync(int page, int pageSize)
    {
        return await _repository.GetPagedAsync(page, pageSize);
    }
}