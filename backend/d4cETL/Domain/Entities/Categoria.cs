namespace d4cETL.Domain.Entities;

public class Categoria
{
  public int Id { get; set; }
  public string Codigo { get; set; } = string.Empty;
  public string Descricao { get; set; } = string.Empty;
  public string? DescricaoPadrao { get; set; }
  public string? TipoCategoria { get; set; }
  public string? ContaInativa { get; set; }
  public string? DefinidaPeloUsuario { get; set; }
  public int? IdContaContabil { get; set; }
  public string? TagContaContabil { get; set; }
  public string? ContaDespesa { get; set; }
  public string? ContaReceita { get; set; }
  public string? NaoExibir { get; set; }
  public string? Natureza { get; set; }
  public string? Totalizadora { get; set; }
  public string? Transferencia { get; set; }
  public string? CodigoDre { get; set; }
  public string? CategoriaSuperior { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime? UpdatedAt { get; set; }
  public string? CorrelationId { get; set; }
}