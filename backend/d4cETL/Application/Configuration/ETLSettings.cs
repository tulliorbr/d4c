namespace d4cETL.Application.Configuration;

public class ETLSettings
{
  public int BatchSize { get; set; } = 500;
  public int MaxConcurrency { get; set; } = 5;
  public int RetryAttempts { get; set; } = 3;
  public int DelayBetweenBatchesMs { get; set; } = 1000;
}

public class RetryPolicySettings
{
  public int MaxRetries { get; set; } = 3;
  public int DelayBetweenRetriesMs { get; set; } = 1000;
  public int BackoffMultiplier { get; set; } = 2;
}