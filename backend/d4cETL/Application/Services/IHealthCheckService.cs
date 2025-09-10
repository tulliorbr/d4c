using d4cETL.Application.DTOs;

namespace d4cETL.Application.Services;

public interface IHealthCheckService
{
    Task<HealthCheckResponse> GetHealthStatusAsync();
    Task<ComponentHealth> CheckDatabaseHealthAsync();
    Task<ComponentHealth> CheckETLHealthAsync();
    Task<ComponentHealth> CheckReportsHealthAsync();
    Task<ComponentHealth> CheckObservabilityHealthAsync();
}