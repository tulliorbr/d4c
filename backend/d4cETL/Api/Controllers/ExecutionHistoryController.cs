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
}