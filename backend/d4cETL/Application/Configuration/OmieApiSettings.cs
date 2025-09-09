namespace d4cETL.Application.Configuration;

public class OmieApiSettings
{
  public string BaseUrl { get; set; } = string.Empty;
  public string AppKey { get; set; } = string.Empty;
  public string AppSecret { get; set; } = string.Empty;
  public int TimeoutSeconds { get; set; } = 30;
  public int MaxRetries { get; set; } = 3;
}