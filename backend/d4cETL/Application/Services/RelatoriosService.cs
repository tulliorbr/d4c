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



    var todasCategorias = await query
        .Where(m => !string.IsNullOrEmpty(m.CCodCateg))
        .Join(_context.Categorias,
              m => m.CCodCateg,
              c => c.Codigo,
              (m, c) => new { Movimento = m, Categoria = c })
        .GroupBy(mc => new { mc.Movimento.CCodCateg, mc.Movimento.CNatureza, mc.Categoria.Descricao })
        .Select(g => new CategoriaValor
        {
          Nome = g.Key.CCodCateg!,
          Descricao = g.Key.Descricao,
          Natureza = g.Key.CNatureza ?? string.Empty,
          Valor = g.Sum(mc => mc.Movimento.NValorTitulo)
        })
        .ToListAsync(cancellationToken);

    var categorias = todasCategorias.Where(c => c.Valor != 0).ToList();

    var categoriasOrdenadas = categorias
        .OrderByDescending(c => c.Valor)
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
        .GroupJoin(_context.Categorias,
                   m => m.CCodCateg,
                   c => c.Codigo,
                   (m, categorias) => new { Movimento = m, Categorias = categorias })
        .SelectMany(mc => mc.Categorias.DefaultIfEmpty(),
                    (mc, c) => new { mc.Movimento, Categoria = c })
        .OrderByDescending(mc => mc.Movimento.DDtEmissao)
        .Skip((request.Pagina - 1) * request.TamanhoPagina)
        .Take(request.TamanhoPagina)
        .Select(mc => new MovimentoResumo
        {
          NCodTitulo = mc.Movimento.NCodTitulo,
          CCodIntTitulo = mc.Movimento.CCodIntTitulo,
          DDtEmissao = mc.Movimento.DDtEmissao,
          DDtVenc = mc.Movimento.DDtVenc,
          DDtPagamento = mc.Movimento.DDtPagamento,
          CNatureza = mc.Movimento.CNatureza ?? string.Empty,
          CStatus = mc.Movimento.CStatus,
          CCodCateg = mc.Movimento.CCodCateg,
          DescricaoCategoria = mc.Categoria != null ? mc.Categoria.Descricao : null,
          NValorTitulo = mc.Movimento.NValorTitulo,
          CCPFCNPJCliente = mc.Movimento.CCPFCNPJCliente
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