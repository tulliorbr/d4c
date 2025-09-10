using d4cETL.Application.Services;
using d4cETL.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace d4cETL.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ETLController : ControllerBase
{
    private readonly IETLService _etlService;
    private readonly IExecutionHistoryService _executionHistoryService;
    private readonly ILogger<ETLController> _logger;

    public ETLController(IETLService etlService, IExecutionHistoryService executionHistoryService, ILogger<ETLController> logger)
    {
        _etlService = etlService;
        _executionHistoryService = executionHistoryService;
        _logger = logger;
    }

  [HttpPost("executar-movimentos")]
  public async Task<IActionResult> ExecutarETLMovimentos([FromBody] ExecutarMovimentosRequest request, CancellationToken cancellationToken)
  {
    var correlationId = Guid.NewGuid().ToString();

    try
    {
      _logger.LogInformation("Recebida requisição para executar ETL de movimentos: {@Request}. CorrelationId: {CorrelationId}", request, correlationId);

      await _etlService.ExecutarETLMovimentosAsync(correlationId, cancellationToken);

      return Ok(new
      {
        Message = "ETL de movimentos executado com sucesso",
        CorrelationId = correlationId
      });
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Erro ao executar ETL de movimentos. CorrelationId: {CorrelationId}", correlationId);
      return StatusCode(500, new { Message = "Erro interno do servidor", CorrelationId = correlationId });
    }
  }

  [HttpPost("executar-categorias")]
  public async Task<IActionResult> ExecutarETLCategorias([FromBody] ExecutarCategoriasRequest request, CancellationToken cancellationToken)
  {
    var correlationId = Guid.NewGuid().ToString();

    try
    {
      _logger.LogInformation("Recebida requisição para executar ETL de categorias: {@Request}. CorrelationId: {CorrelationId}", request, correlationId);

      await _etlService.ExecutarETLCategoriasAsync(correlationId, cancellationToken);

      return Ok(new
      {
        Message = "ETL de categorias executado com sucesso",
        CorrelationId = correlationId
      });
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Erro ao executar ETL de categorias. CorrelationId: {CorrelationId}", correlationId);
      return StatusCode(500, new { Message = "Erro interno do servidor", CorrelationId = correlationId });
    }
  }

  [HttpPost("full-load")]
  public async Task<IActionResult> ExecutarFullLoadETL([FromBody] FullLoadETLRequest request, CancellationToken cancellationToken)
  {
    var correlationId = Guid.NewGuid().ToString();
    var execution = await _executionHistoryService.StartExecutionAsync("Full Load ETL", "/api/ETL/full-load");

    try
    {
      _logger.LogInformation("Recebida requisição para Full Load ETL: {@Request}. CorrelationId: {CorrelationId}", request, correlationId);

      var response = await _etlService.ExecutarFullLoadETLAsync(correlationId, request, cancellationToken);

      await _executionHistoryService.CompleteExecutionAsync(execution.Id, true);

      return Ok(new
      {
        Message = "Full Load ETL executado",
        CorrelationId = correlationId,
        Data = response
      });
    }
    catch (Exception ex)
    {
      await _executionHistoryService.CompleteExecutionAsync(execution.Id, false, ex.Message);
      _logger.LogError(ex, "Erro ao executar Full Load ETL. CorrelationId: {CorrelationId}", correlationId);
      return StatusCode(500, new { Message = "Erro interno do servidor", CorrelationId = correlationId });
    }
  }

  [HttpPost("incremental")]
  public async Task<IActionResult> ExecutarIncrementalETL([FromBody] IncrementalETLRequest request, CancellationToken cancellationToken)
  {
    var correlationId = Guid.NewGuid().ToString();
    var execution = await _executionHistoryService.StartExecutionAsync("Incremental ETL", "/api/ETL/incremental");

    try
    {
      _logger.LogInformation("Recebida requisição para Incremental ETL: {@Request}. CorrelationId: {CorrelationId}", request, correlationId);

      var response = await _etlService.ExecutarIncrementalETLAsync(correlationId, request, cancellationToken);

      await _executionHistoryService.CompleteExecutionAsync(execution.Id, true);

      return Ok(new
      {
        Message = "Incremental ETL executado",
        CorrelationId = correlationId,
        Data = response
      });
    }
    catch (Exception ex)
    {
      await _executionHistoryService.CompleteExecutionAsync(execution.Id, false, ex.Message);
      
      _logger.LogError(ex, "Erro ao executar Incremental ETL. CorrelationId: {CorrelationId}", correlationId);
      return StatusCode(500, new { Message = "Erro interno do servidor", CorrelationId = correlationId });
    }
  }

  [HttpPost("transformacao")]
  public async Task<IActionResult> ExecutarTransformacaoETL(CancellationToken cancellationToken)
  {
    var correlationId = Guid.NewGuid().ToString();

    try
    {
      _logger.LogInformation("Recebida requisição para Transformação ETL. CorrelationId: {CorrelationId}", correlationId);

      var response = await _etlService.ExecutarTransformacaoETLAsync(correlationId, cancellationToken);

      return Ok(new
      {
        Message = "Transformação ETL executada",
        CorrelationId = correlationId,
        Data = response
      });
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Erro ao executar Transformação ETL. CorrelationId: {CorrelationId}", correlationId);
      return StatusCode(500, new { Message = "Erro interno do servidor", CorrelationId = correlationId });
    }
  }
}