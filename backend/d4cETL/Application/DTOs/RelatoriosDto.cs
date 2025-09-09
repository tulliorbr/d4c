using System.ComponentModel.DataAnnotations;

namespace d4cETL.Application.DTOs;

public class KPIsResponse
{
  public decimal TotalEntradas { get; set; }
  public decimal TotalSaidas { get; set; }
  public decimal SaldoPeriodo { get; set; }
  public decimal PercentualRecebido { get; set; }
  public decimal PercentualPago { get; set; }
  public int TotalTitulosReceber { get; set; }
  public int TotalTitulosPagar { get; set; }
  public int TitulosRecebidos { get; set; }
  public int TitulosPagos { get; set; }
}

public class GraficoLinhaResponse
{
  public string[] Meses { get; set; } = Array.Empty<string>();
  public decimal[] Entradas { get; set; } = Array.Empty<decimal>();
  public decimal[] Saidas { get; set; } = Array.Empty<decimal>();
}


public class GraficoBarrasResponse
{
  public List<CategoriaValor> Categorias { get; set; } = new();
}

public class CategoriaValor
{
  public string Nome { get; set; } = string.Empty;
  public decimal Valor { get; set; }
  public string Natureza { get; set; } = string.Empty;
}


public class GraficoPizzaResponse
{
  public List<StatusDistribuicao> Distribuicao { get; set; } = new();
}

public class StatusDistribuicao
{
  public string Status { get; set; } = string.Empty;
  public int Quantidade { get; set; }
  public decimal Valor { get; set; }
  public decimal Percentual { get; set; }
}


public class TabelaMovimentosRequest
{
  public DateTime? DataInicio { get; set; }
  public DateTime? DataFim { get; set; }
  public string? Natureza { get; set; }
  public string? Categoria { get; set; }
  public string? Status { get; set; }
  public int Pagina { get; set; } = 1;
  public int TamanhoPagina { get; set; } = 50;
}

public class TabelaMovimentosResponse
{
  public List<MovimentoResumo> Movimentos { get; set; } = new();
  public int TotalRegistros { get; set; }
  public int TotalPaginas { get; set; }
  public int PaginaAtual { get; set; }
}

public class MovimentoResumo
{
  public long NCodTitulo { get; set; }
  public string? CCodIntTitulo { get; set; }
  public DateTime? DDtEmissao { get; set; }
  public DateTime? DDtVenc { get; set; }
  public DateTime? DDtPagamento { get; set; }
  public string CNatureza { get; set; } = string.Empty;
  public string? CStatus { get; set; }
  public string? CCodCateg { get; set; }
  public decimal NValorTitulo { get; set; }
  public string? CCPFCNPJCliente { get; set; }
}

public class RelatorioRequest
{
  public DateTime? DataInicio { get; set; }
  public DateTime? DataFim { get; set; }
  public string? Natureza { get; set; }

  public DateTime DataInicioEfetiva => DataInicio ?? DateTime.Now.AddMonths(-12);
  public DateTime DataFimEfetiva => DataFim ?? DateTime.Now;
}