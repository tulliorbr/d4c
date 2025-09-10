namespace d4cETL.Domain.Entities;

public class ETLBatch
{
  public int Id { get; set; }
  public string BatchId { get; set; } = string.Empty;
  public string TipoExecucao { get; set; } = string.Empty;
  public string Entidade { get; set; } = string.Empty;
  public DateTime DataInicio { get; set; }
  public DateTime? DataFim { get; set; }
  public string Status { get; set; } = "Executando";
  public int TotalRegistrosLidos { get; set; }
  public int TotalRegistrosProcessados { get; set; }
  public int TotalRegistrosInseridos { get; set; }
  public int TotalRegistrosAtualizados { get; set; }
  public int TotalRegistrosComErro { get; set; }
  public int TotalPaginas { get; set; }
  public int PaginaAtual { get; set; }
  public double? ThroughputRegistrosPorSegundo { get; set; }
  public double? LatenciaMediaMs { get; set; }
  public string? MensagemErro { get; set; }
  public string? StackTrace { get; set; }
  public string CorrelationId { get; set; } = string.Empty;
  public DateTime CreatedAt { get; set; } = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time"));
  public DateTime? UpdatedAt { get; set; }
  public virtual ICollection<ETLBatchItem> Itens { get; set; } = new List<ETLBatchItem>();
}