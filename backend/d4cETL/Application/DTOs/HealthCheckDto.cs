using System.ComponentModel.DataAnnotations;

namespace d4cETL.Application.DTOs;

public class HealthCheckResponse
{
    public string Status { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public Dictionary<string, ComponentHealth> Components { get; set; } = new();
    public long ResponseTimeMs { get; set; }
}

public class ComponentHealth
{
    public string Status { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Dictionary<string, object>? Details { get; set; }
    public long ResponseTimeMs { get; set; }
}

public static class HealthStatus
{
    public const string Healthy = "Healthy";
    public const string Degraded = "Degraded";
    public const string Unhealthy = "Unhealthy";
}

public static class ComponentNames
{
    public const string Database = "database";
    public const string ETL = "etl";
    public const string Reports = "reports";
    public const string Observability = "observability";
}