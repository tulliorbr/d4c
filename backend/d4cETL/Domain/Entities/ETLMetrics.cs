namespace d4cETL.Domain.Entities;

public class ETLMetrics
{
  public int Id { get; set; }
  public string Entidade { get; set; } = string.Empty;
  public DateTime DataExecucao { get; set; }
  public string TipoExecucao { get; set; } = string.Empty;
  public int RegistrosLidos { get; set; }
  public int RegistrosProcessados { get; set; }
  public int RegistrosComErro { get; set; }
  public double ThroughputRegistrosPorSegundo { get; set; }
  public double LatenciaMediaMs { get; set; }
  public double DuracaoTotalMinutos { get; set; }
  public DateTime UltimaExecucao { get; set; }
  public string Status { get; set; } = string.Empty;
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}