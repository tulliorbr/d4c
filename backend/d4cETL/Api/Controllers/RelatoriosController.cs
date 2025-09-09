using Microsoft.AspNetCore.Mvc;
using d4cETL.Application.Services;
using d4cETL.Application.DTOs;

namespace d4cETL.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RelatoriosController : ControllerBase
{
  private readonly IRelatoriosService _relatoriosService;
  private readonly ILogger<RelatoriosController> _logger;

  public RelatoriosController(IRelatoriosService relatoriosService, ILogger<RelatoriosController> logger)
  {
    _relatoriosService = relatoriosService;
    _logger = logger;
  }

  /// <summary>
  /// Obtém KPIs do período (Entradas, Saídas, Saldo, % Recebido/Pago)
  /// </summary>
  [HttpGet("kpis")]
  public async Task<ActionResult<KPIsResponse>> ObterKPIs([FromQuery] RelatorioRequest request, CancellationToken cancellationToken = default)
  {
    try
    {
      var kpis = await _relatoriosService.ObterKPIsAsync(request, cancellationToken);
      return Ok(kpis);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Erro ao obter KPIs");
      return StatusCode(500, "Erro interno do servidor");
    }
  }

  /// <summary>
  /// Obtém dados para gráfico de linha/área (Entradas x Saídas por mês) - Apache ECharts
  /// </summary>
  [HttpGet("grafico/linha")]
  public async Task<ActionResult<GraficoLinhaResponse>> ObterGraficoLinha([FromQuery] RelatorioRequest request, CancellationToken cancellationToken = default)
  {
    try
    {
      var dados = await _relatoriosService.ObterGraficoLinhaAsync(request, cancellationToken);
      return Ok(dados);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Erro ao obter dados do gráfico de linha");
      return StatusCode(500, "Erro interno do servidor");
    }
  }

  /// <summary>
  /// Obtém dados para gráfico de barras (Top 5 Categorias por valor) - Apache ECharts
  /// </summary>
  [HttpGet("grafico/barras")]
  public async Task<ActionResult<GraficoBarrasResponse>> ObterGraficoBarras([FromQuery] RelatorioRequest request, CancellationToken cancellationToken = default)
  {
    try
    {
      var dados = await _relatoriosService.ObterGraficoBarrasAsync(request, cancellationToken);
      return Ok(dados);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Erro ao obter dados do gráfico de barras");
      return StatusCode(500, "Erro interno do servidor");
    }
  }

  /// <summary>
  /// Obtém dados para gráfico de pizza/rosca (Distribuição por Status) - Apache ECharts
  /// </summary>
  [HttpGet("grafico/pizza")]
  public async Task<ActionResult<GraficoPizzaResponse>> ObterGraficoPizza([FromQuery] RelatorioRequest request, CancellationToken cancellationToken = default)
  {
    try
    {
      var dados = await _relatoriosService.ObterGraficoPizzaAsync(request, cancellationToken);
      return Ok(dados);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Erro ao obter dados do gráfico de pizza");
      return StatusCode(500, "Erro interno do servidor");
    }
  }

  /// <summary>
  /// Obtém tabela de movimentos com filtros e paginação
  /// </summary>
  [HttpGet("tabela")]
  public async Task<ActionResult<TabelaMovimentosResponse>> ObterTabelaMovimentos([FromQuery] TabelaMovimentosRequest request, CancellationToken cancellationToken = default)
  {
    try
    {
      var dados = await _relatoriosService.ObterTabelaMovimentosAsync(request, cancellationToken);
      return Ok(dados);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Erro ao obter tabela de movimentos");
      return StatusCode(500, "Erro interno do servidor");
    }
  }
}