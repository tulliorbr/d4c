namespace d4cETL.Domain.Entities;

public class ETLBatchItem
{
  public int Id { get; set; }
  public int ETLBatchId { get; set; }
  public string ItemId { get; set; } = string.Empty;
  public string TipoItem { get; set; } = string.Empty;
  public int Pagina { get; set; }
  public int PosicaoNaPagina { get; set; }
  public DateTime DataInicio { get; set; }
  public DateTime? DataFim { get; set; }
  public string Status { get; set; } = "Processando";
  public string Operacao { get; set; } = string.Empty;
  public int NumeroTentativas { get; set; } = 1;
  public double? DuracaoMs { get; set; }
  public string? MensagemErro { get; set; }
  public string? DadosOriginais { get; set; }
  public DateTime CreatedAt { get; set; } = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time"));
  public DateTime? UpdatedAt { get; set; }

  public virtual ETLBatch ETLBatch { get; set; } = null!;
}