using d4cETL.Application.DTOs;
using d4cETL.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace d4cETL.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
  private readonly IHealthCheckService _healthCheckService;
  private readonly ILogger<HealthController> _logger;

  public HealthController(
      IHealthCheckService healthCheckService,
      ILogger<HealthController> logger)
  {
    _healthCheckService = healthCheckService;
    _logger = logger;
  }

  [HttpGet]
  [ProducesResponseType(typeof(HealthCheckResponse), 200)]
  [ProducesResponseType(typeof(HealthCheckResponse), 503)]
  public async Task<ActionResult<HealthCheckResponse>> GetHealthStatus()
  {
    try
    {
      _logger.LogInformation("Iniciando verificação de health check");

      var healthStatus = await _healthCheckService.GetHealthStatusAsync();

      _logger.LogInformation("Health check concluído com status: {Status}", healthStatus.Status);

      if (healthStatus.Status == HealthStatus.Unhealthy)
      {
        return StatusCode(503, healthStatus);
      }

      return Ok(healthStatus);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Erro inesperado durante health check");

      var errorResponse = new HealthCheckResponse
      {
        Status = HealthStatus.Unhealthy,
        Timestamp = DateTime.UtcNow,
        Components = new Dictionary<string, ComponentHealth>
        {
          ["system"] = new ComponentHealth
          {
            Status = HealthStatus.Unhealthy,
            Description = "Erro interno do sistema",
            ResponseTimeMs = 0
          }
        },
        ResponseTimeMs = 0
      };

      return StatusCode(503, errorResponse);
    }
  }
}