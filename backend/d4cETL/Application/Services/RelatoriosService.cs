using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using d4cETL.Application.DTOs;
using d4cETL.Infrastructure.Data;
using System.Globalization;

namespace d4cETL.Application.Services;

public class RelatoriosService : IRelatoriosService
{
  private readonly OmieETLContext _context;
  private readonly ILogger<RelatoriosService> _logger;

  public RelatoriosService(OmieETLContext context, ILogger<RelatoriosService> logger)
  {
    _context = context;
    _logger = logger;
  }

  public async Task<KPIsResponse> ObterKPIsAsync(RelatorioRequest request, CancellationToken cancellationToken = default)
  {
    var query = _context.MovimentosFinanceiros
        .Where(m => m.DDtEmissao >= request.DataInicioEfetiva && m.DDtEmissao <= request.DataFimEfetiva);

    if (!string.IsNullOrEmpty(request.Natureza))
    {
      query = query.Where(m => m.CNatureza == request.Natureza);
    }

    var movimentos = await query.ToListAsync(cancellationToken);

    var entradas = movimentos.Where(m => m.CNatureza == "R");
    var saidas = movimentos.Where(m => m.CNatureza == "P");

    var totalEntradas = entradas.Sum(m => m.NValorTitulo);
    var totalSaidas = saidas.Sum(m => m.NValorTitulo);

    var titulosRecebidos = entradas.Count(m => m.CStatus?.ToUpper() == "PAGO" || m.DDtPagamento.HasValue);
    var titulosPagos = saidas.Count(m => m.CStatus?.ToUpper() == "PAGO" || m.DDtPagamento.HasValue);

    var totalTitulosReceber = entradas.Count();
    var totalTitulosPagar = saidas.Count();

    return new KPIsResponse
    {
      TotalEntradas = totalEntradas,
      TotalSaidas = totalSaidas,
      SaldoPeriodo = totalEntradas - totalSaidas,
      PercentualRecebido = totalTitulosReceber > 0 ? (decimal)titulosRecebidos / totalTitulosReceber * 100 : 0,
      PercentualPago = totalTitulosPagar > 0 ? (decimal)titulosPagos / totalTitulosPagar * 100 : 0,
      TotalTitulosReceber = totalTitulosReceber,
      TotalTitulosPagar = totalTitulosPagar,
      TitulosRecebidos = titulosRecebidos,
      TitulosPagos = titulosPagos
    };
  }

  public async Task<GraficoLinhaResponse> ObterGraficoLinhaAsync(RelatorioRequest request, CancellationToken cancellationToken = default)
  {
    var movimentos = await _context.MovimentosFinanceiros
        .Where(m => m.DDtEmissao >= request.DataInicioEfetiva && m.DDtEmissao <= request.DataFimEfetiva)
        .ToListAsync(cancellationToken);

    var dadosPorMes = movimentos
        .Where(m => m.DDtEmissao.HasValue)
        .GroupBy(m => new { Ano = m.DDtEmissao!.Value.Year, Mes = m.DDtEmissao!.Value.Month })
        .Select(g => new
        {
          AnoMes = $"{g.Key.Ano}-{g.Key.Mes:D2}",
          Data = new DateTime(g.Key.Ano, g.Key.Mes, 1),
          Entradas = g.Where(m => m.CNatureza == "R").Sum(m => m.NValorTitulo),
          Saidas = g.Where(m => m.CNatureza == "P").Sum(m => m.NValorTitulo)
        })
        .OrderBy(x => x.Data)
        .ToList();

    return new GraficoLinhaResponse
    {
      Meses = dadosPorMes.Select(d => d.Data.ToString("MMM/yyyy", new CultureInfo("pt-BR"))).ToArray(),
      Entradas = dadosPorMes.Select(d => d.Entradas).ToArray(),
      Saidas = dadosPorMes.Select(d => d.Saidas).ToArray()
    };
  }

  public async Task<GraficoBarrasResponse> ObterGraficoBarrasAsync(RelatorioRequest request, CancellationToken cancellationToken = default)
  {
    var query = _context.MovimentosFinanceiros
        .Where(m => m.DDtEmissao >= request.DataInicioEfetiva && m.DDtEmissao <= request.DataFimEfetiva);

    if (!string.IsNullOrEmpty(request.Natureza))
    {
      query = query.Where(m => m.CNatureza == request.Natureza);
    }

    var categorias = await query
        .Where(m => !string.IsNullOrEmpty(m.CCodCateg))
        .GroupBy(m => new { m.CCodCateg, m.CNatureza })
        .Select(g => new CategoriaValor
        {
          Nome = g.Key.CCodCateg!,
          Natureza = g.Key.CNatureza ?? string.Empty,
          Valor = g.Sum(m => m.NValorTitulo)
        })
        .ToListAsync(cancellationToken);


    var categoriasOrdenadas = categorias
        .OrderByDescending(c => c.Valor)
        .Take(5)
        .ToList();

    return new GraficoBarrasResponse { Categorias = categoriasOrdenadas };
  }

  public async Task<GraficoPizzaResponse> ObterGraficoPizzaAsync(RelatorioRequest request, CancellationToken cancellationToken = default)
  {
    var query = _context.MovimentosFinanceiros
        .Where(m => m.DDtEmissao >= request.DataInicioEfetiva && m.DDtEmissao <= request.DataFimEfetiva);

    if (!string.IsNullOrEmpty(request.Natureza))
    {
      query = query.Where(m => m.CNatureza == request.Natureza);
    }

    var movimentos = await query.ToListAsync(cancellationToken);
    var total = movimentos.Count;

    var distribuicao = movimentos
        .GroupBy(m => m.CStatus ?? "Sem Status")
        .Select(g => new StatusDistribuicao
        {
          Status = g.Key,
          Quantidade = g.Count(),
          Valor = g.Sum(m => m.NValorTitulo),
          Percentual = total > 0 ? (decimal)g.Count() / total * 100 : 0
        })
        .OrderByDescending(s => s.Quantidade)
        .ToList();

    return new GraficoPizzaResponse { Distribuicao = distribuicao };
  }

  public async Task<TabelaMovimentosResponse> ObterTabelaMovimentosAsync(TabelaMovimentosRequest request, CancellationToken cancellationToken = default)
  {
    var query = _context.MovimentosFinanceiros.AsQueryable();

    if (request.DataInicio.HasValue)
      query = query.Where(m => m.DDtEmissao >= request.DataInicio.Value);

    if (request.DataFim.HasValue)
      query = query.Where(m => m.DDtEmissao <= request.DataFim.Value);

    if (!string.IsNullOrEmpty(request.Natureza))
      query = query.Where(m => m.CNatureza == request.Natureza);

    if (!string.IsNullOrEmpty(request.Categoria))
      query = query.Where(m => m.CCodCateg == request.Categoria);

    if (!string.IsNullOrEmpty(request.Status))
      query = query.Where(m => m.CStatus == request.Status);

    var totalRegistros = await query.CountAsync(cancellationToken);
    var totalPaginas = (int)Math.Ceiling((double)totalRegistros / request.TamanhoPagina);

    var movimentos = await query
        .OrderByDescending(m => m.DDtEmissao)
        .Skip((request.Pagina - 1) * request.TamanhoPagina)
        .Take(request.TamanhoPagina)
        .Select(m => new MovimentoResumo
        {
          NCodTitulo = m.NCodTitulo,
          CCodIntTitulo = m.CCodIntTitulo,
          DDtEmissao = m.DDtEmissao,
          DDtVenc = m.DDtVenc,
          DDtPagamento = m.DDtPagamento,
          CNatureza = m.CNatureza ?? string.Empty,
          CStatus = m.CStatus,
          CCodCateg = m.CCodCateg,
          NValorTitulo = m.NValorTitulo,
          CCPFCNPJCliente = m.CCPFCNPJCliente
        })
        .ToListAsync(cancellationToken);

    return new TabelaMovimentosResponse
    {
      Movimentos = movimentos,
      TotalRegistros = totalRegistros,
      TotalPaginas = totalPaginas,
      PaginaAtual = request.Pagina
    };
  }
}