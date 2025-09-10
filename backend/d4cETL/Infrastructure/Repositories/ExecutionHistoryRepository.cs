using d4cETL.Domain.Entities;
using d4cETL.Domain.Repositories;
using d4cETL.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.Sqlite;

namespace d4cETL.Infrastructure.Repositories;

public class ExecutionHistoryRepository : IExecutionHistoryRepository
{
  private readonly OmieETLContext _context;

  public ExecutionHistoryRepository(OmieETLContext context)
  {
    _context = context;
  }

  public async Task<ExecutionHistory?> GetByIdAsync(int id)
  {
    return await _context.ExecutionHistories
        .FirstOrDefaultAsync(x => x.Id == id);
  }

  public async Task<ExecutionHistory> AddAsync(ExecutionHistory executionHistory)
  {
    var maxRetries = 3;
    var delay = TimeSpan.FromMilliseconds(100);

    for (int attempt = 0; attempt < maxRetries; attempt++)
    {
      try
      {
        _context.ExecutionHistories.Add(executionHistory);
        await _context.SaveChangesAsync();
        return executionHistory;
      }
      catch (DbUpdateException ex) when (ex.InnerException is SqliteException sqliteEx && sqliteEx.SqliteErrorCode == 5)
      {
        if (attempt == maxRetries - 1) throw;

        _context.Entry(executionHistory).State = EntityState.Detached;
        await Task.Delay(delay * (attempt + 1));
      }
    }

    return executionHistory;
  }

  public async Task UpdateAsync(ExecutionHistory executionHistory)
  {
    var maxRetries = 3;
    var delay = TimeSpan.FromMilliseconds(100);

    for (int attempt = 0; attempt < maxRetries; attempt++)
    {
      try
      {
        executionHistory.UpdatedAt = DateTime.UtcNow;
        _context.ExecutionHistories.Update(executionHistory);
        await _context.SaveChangesAsync();
        return;
      }
      catch (DbUpdateException ex) when (ex.InnerException is SqliteException sqliteEx && sqliteEx.SqliteErrorCode == 5)
      {
        if (attempt == maxRetries - 1) throw;

        _context.Entry(executionHistory).State = EntityState.Detached;
        await Task.Delay(delay * (attempt + 1));

        var freshEntity = await _context.ExecutionHistories.FindAsync(executionHistory.Id);
        if (freshEntity != null)
        {
          _context.Entry(freshEntity).CurrentValues.SetValues(executionHistory);
          executionHistory = freshEntity;
        }
      }
    }
  }

  public async Task DeleteAsync(int id)
  {
    var executionHistory = await GetByIdAsync(id);
    if (executionHistory != null)
    {
      _context.ExecutionHistories.Remove(executionHistory);
      await _context.SaveChangesAsync();
    }
  }

  public async Task<int> GetTotalCountAsync()
  {
    return await _context.ExecutionHistories.CountAsync();
  }

  public async Task<IEnumerable<ExecutionHistory>> GetPagedAsync(int page, int pageSize)
  {
    return await _context.ExecutionHistories
        .OrderByDescending(x => x.StartTime)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();
  }
}