using d4cETL.Application.DTOs;
using d4cETL.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace d4cETL.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ObservabilidadeController : ControllerBase
{
  private readonly IObservabilidadeService _observabilidadeService;
  private readonly ILogger<ObservabilidadeController> _logger;

  public ObservabilidadeController(
      IObservabilidadeService observabilidadeService,
      ILogger<ObservabilidadeController> logger)
  {
    _observabilidadeService = observabilidadeService;
    _logger = logger;
  }

  [HttpGet("lotes")]
  public async Task<ActionResult<PaginatedResult<ETLBatchResumoDto>>> ListarLotes([FromQuery] BatchFiltroDto filtro)
  {
    try
    {
      var resultado = await _observabilidadeService.ListarLotesAsync(filtro);
      return Ok(resultado);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Erro ao listar lotes");
      return StatusCode(500, "Erro interno do servidor");
    }
  }

  [HttpGet("lotes/{id:int}")]
  public async Task<ActionResult<ETLBatchDetalheDto>> ObterDetalheLote(int id)
  {
    try
    {
      var lote = await _observabilidadeService.ObterDetalheLoteAsync(id);
      if (lote == null)
        return NotFound($"Lote {id} não encontrado");

      return Ok(lote);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Erro ao obter detalhes do lote {LoteId}", id);
      return StatusCode(500, "Erro interno do servidor");
    }
  }

  [HttpGet("lotes/{loteId:int}/itens")]
  public async Task<ActionResult<PaginatedResult<ETLBatchItemDto>>> ListarItensLote(int loteId, [FromQuery] ItemFiltroDto filtro)
  {
    try
    {
      var resultado = await _observabilidadeService.ListarItensLoteAsync(loteId, filtro);
      return Ok(resultado);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Erro ao listar itens do lote {LoteId}", loteId);
      return StatusCode(500, "Erro interno do servidor");
    }
  }

  [HttpGet("metricas")]
  public async Task<ActionResult<List<ETLMetricsDto>>> ObterMetricas([FromQuery] string? entidade = null)
  {
    try
    {
      var metricas = await _observabilidadeService.ObterMetricasAsync(entidade);
      return Ok(metricas);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Erro ao obter métricas");
      return StatusCode(500, "Erro interno do servidor");
    }
  }

  [HttpGet("metricas/detalhadas")]
  public async Task<ActionResult<MetricasDetalhadasDto>> ObterMetricasDetalhadas([FromQuery] string? entidade = null, [FromQuery] int diasHistorico = 7)
  {
    try
    {
      var metricas = await _observabilidadeService.ObterMetricasDetalhadasAsync(entidade, diasHistorico);
      return Ok(metricas);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Erro ao obter métricas detalhadas");
      return StatusCode(500, "Erro interno do servidor");
    }
  }

  [HttpGet("alertas")]
  public async Task<ActionResult<List<AlertaPerformanceDto>>> ObterAlertas()
  {
    try
    {
      var alertas = await _observabilidadeService.ObterAlertasAsync();
      return Ok(alertas);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Erro ao obter alertas");
      return StatusCode(500, "Erro interno do servidor");
    }
  }

  [HttpPost("lotes/{loteId:int}/reprocessar")]
  public async Task<ActionResult> ReprocessarItensComErro(int loteId)
  {
    try
    {
      var sucesso = await _observabilidadeService.ReprocessarItensComErroAsync(loteId);
      if (!sucesso)
        return BadRequest("Nenhum item com erro encontrado para reprocessamento");

      return Ok(new { message = "Reprocessamento iniciado com sucesso" });
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Erro ao reprocessar itens do lote {LoteId}", loteId);
      return StatusCode(500, "Erro interno do servidor");
    }
  }
}