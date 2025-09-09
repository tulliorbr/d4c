using d4cETL.Application.Configuration;
using d4cETL.Application.Services;
using d4cETL.Infrastructure.Data;
using d4cETL.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Context;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/d4cetl-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<OmieETLContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHttpClient<IOmieApiService, OmieApiService>(client =>
{
  client.BaseAddress = new Uri("https://app.omie.com.br/api/v1/");
  client.Timeout = TimeSpan.FromSeconds(30);
});

builder.Services.Configure<d4cETL.Infrastructure.Configuration.OmieApiSettings>(builder.Configuration.GetSection("OmieApi"));
builder.Services.Configure<d4cETL.Application.Configuration.ETLSettings>(builder.Configuration.GetSection("ETLSettings"));

builder.Services.AddScoped<IOmieApiService, OmieApiService>();
builder.Services.AddScoped<IETLService, ETLService>();
builder.Services.AddScoped<IObservabilidadeService, ObservabilidadeService>();
builder.Services.AddScoped<IRelatoriosService, RelatoriosService>();

builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowAll", policy =>
  {
    policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
  });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Use(async (context, next) =>
{
  using (LogContext.PushProperty("RequestId", Guid.NewGuid()))
  {
    await next();
  }
});

app.Run();
