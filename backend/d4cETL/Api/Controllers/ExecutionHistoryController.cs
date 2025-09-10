using d4cETL.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace d4cETL.Api.Controllers;

[ApiController]
[Route("api/executions")]
public class ExecutionHistoryController : ControllerBase
{
  private readonly IExecutionHistoryService _executionHistoryService;

  public ExecutionHistoryController(IExecutionHistoryService executionHistoryService)
  {
    _executionHistoryService = executionHistoryService;
  }

  [HttpGet("history")]
  public async Task<IActionResult> GetExecutionHistory()
  {
    try
    {
      var executions = await _executionHistoryService.GetAllExecutionsAsync();
      return Ok(executions);
    }
    catch (Exception ex)
    {
      return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
    }
  }

  [HttpGet("history/paged")]
  public async Task<IActionResult> GetPagedExecutionHistory([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
  {
    try
    {
      var executions = await _executionHistoryService.GetPagedExecutionsAsync(page, pageSize);
      var totalCount = await _executionHistoryService.GetTotalExecutionsCountAsync();

      return Ok(new
      {
        data = executions,
        pagination = new
        {
          page,
          pageSize,
          totalCount,
          totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
        }
      });
    }
    catch (Exception ex)
    {
      return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
    }
  }

  [HttpGet("history/recent")]
  public async Task<IActionResult> GetRecentExecutions([FromQuery] int count = 10)
  {
    try
    {
      var executions = await _executionHistoryService.GetRecentExecutionsAsync(count);
      return Ok(executions);
    }
    catch (Exception ex)
    {
      return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
    }
  }

  [HttpGet("history/{id}")]
  public async Task<IActionResult> GetExecutionById(int id)
  {
    try
    {
      var execution = await _executionHistoryService.GetExecutionByIdAsync(id);
      if (execution == null)
      {
        return NotFound(new { message = "Execução não encontrada" });
      }
      return Ok(execution);
    }
    catch (Exception ex)
    {
      return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
    }
  }

  [HttpGet("history/type/{type}")]
  public async Task<IActionResult> GetExecutionsByType(string type)
  {
    try
    {
      var executions = await _executionHistoryService.GetExecutionsByTypeAsync(type);
      return Ok(executions);
    }
    catch (Exception ex)
    {
      return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
    }
  }


}