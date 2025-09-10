namespace d4cETL.Domain.Entities;

public class ExecutionHistory
{
  public int Id { get; set; }
  public string Type { get; set; } = string.Empty;
  public string Endpoint { get; set; } = string.Empty;
  public bool IsSuccess { get; set; }
  public string Status { get; set; } = string.Empty;
  public DateTime StartTime { get; set; }
  public DateTime? EndTime { get; set; }
  public TimeSpan? Duration { get; set; }
  public string? ErrorMessage { get; set; }
  public DateTime CreatedAt { get; set; } = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time"));
  public DateTime? UpdatedAt { get; set; }

  public string FormattedDuration => Duration?.ToString(@"mm\:ss") ?? "--:--";
}