namespace d4cETL.Domain.Entities;

public class MovimentoFinanceiro
{
  public int Id { get; set; }
  public long NCodTitulo { get; set; }
  public string? CCodIntTitulo { get; set; }
  public string? CNumTitulo { get; set; }
  public DateTime? DDtEmissao { get; set; }
  public DateTime? DDtVenc { get; set; }
  public DateTime? DDtPrevisao { get; set; }
  public DateTime? DDtPagamento { get; set; }
  public int? NCodCliente { get; set; }
  public string? CCPFCNPJCliente { get; set; }
  public int? NCodCtr { get; set; }
  public string? CNumCtr { get; set; }
  public int? NCodOS { get; set; }
  public string? CNumOS { get; set; }
  public int? NCodCC { get; set; }
  public string? CStatus { get; set; }
  public string? CNatureza { get; set; }
  public string? CTipo { get; set; }
  public string? COperacao { get; set; }
  public string? CNumDocFiscal { get; set; }
  public string? CCodCateg { get; set; }
  public string? CNumParcela { get; set; }
  public decimal NValorTitulo { get; set; }
  public decimal? NValorPIS { get; set; }
  public string? CRetPIS { get; set; }
  public decimal? NValorCOFINS { get; set; }
  public string? CRetCOFINS { get; set; }
  public decimal? NValorCSLL { get; set; }
  public string? CRetCSLL { get; set; }
  public decimal? NValorIR { get; set; }
  public string? CRetIR { get; set; }
  public decimal? NValorISS { get; set; }
  public string? CRetISS { get; set; }
  public decimal? NValorINSS { get; set; }
  public string? CRetINSS { get; set; }
  public int? CCodProjeto { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime? UpdatedAt { get; set; }
  public string? CorrelationId { get; set; }
}