using System.Net.Http;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using d4cETL.Application.Services;
using d4cETL.Application.DTOs;
using d4cETL.Infrastructure.Configuration;

namespace d4cETL.Infrastructure.Services;

public class OmieApiService : IOmieApiService
{
  private readonly HttpClient _httpClient;
  private readonly OmieApiSettings _settings;
  private readonly ILogger<OmieApiService> _logger;
  private readonly JsonSerializerOptions _jsonOptions;

  public OmieApiService(HttpClient httpClient, IOptions<OmieApiSettings> settings, ILogger<OmieApiService> logger)
  {
    _httpClient = httpClient;
    _settings = settings.Value;
    _logger = logger;

    _logger.LogInformation("OmieApiService inicializado - AppKey: {AppKey}, AppSecret: {AppSecret}",
        string.IsNullOrEmpty(_settings.AppKey) ? "[VAZIO]" : "[CONFIGURADO]",
        string.IsNullOrEmpty(_settings.AppSecret) ? "[VAZIO]" : "[CONFIGURADO]");

    _jsonOptions = new JsonSerializerOptions
    {
      PropertyNamingPolicy = null,
      WriteIndented = false
    };
  }

  public async Task<CategoriasResponse> ListarCategoriasAsync(int pagina, int registrosPorPagina, CancellationToken cancellationToken = default)
  {
    var requestBody = new
    {
      call = "ListarCategorias",
      param = new[]
        {
                new
                {
                    pagina,
                    registros_por_pagina = registrosPorPagina
                }
            },
      app_key = _settings.AppKey,
      app_secret = _settings.AppSecret
    };

    var json = JsonSerializer.Serialize(requestBody, _jsonOptions);
    var content = new StringContent(json, Encoding.UTF8, "application/json");

    content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

    var response = await _httpClient.PostAsync("https://app.omie.com.br/api/v1/geral/categorias/", content, cancellationToken);
    var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);

    if (!response.IsSuccessStatusCode)
    {
      _logger.LogError("Erro na API OMIE Categorias - Status: {StatusCode}, Response: {Response}", response.StatusCode, responseContent);

      if (responseContent.StartsWith("<?xml"))
      {
        throw new HttpRequestException($"Erro de autenticação na API OMIE. Verifique as credenciais. Status: {response.StatusCode}");
      }

      throw new HttpRequestException($"Erro na API OMIE: {response.StatusCode} - {responseContent}");
    }

    if (responseContent.StartsWith("<?xml"))
    {
      _logger.LogError("API OMIE retornou XML em vez de JSON: {Response}", responseContent);
      throw new HttpRequestException("API OMIE retornou formato inválido (XML em vez de JSON)");
    }

    return JsonSerializer.Deserialize<CategoriasResponse>(responseContent, _jsonOptions) ?? new CategoriasResponse();
  }

  public async Task<MovimentosFinanceirosResponse> ListarMovimentosAsync(int pagina, int registrosPorPagina, CancellationToken cancellationToken = default)
  {
    var requestBody = new
    {
      call = "ListarMovimentos",
      param = new[]
        {
                new
                {
                    nPagina = pagina,
                    nRegPorPagina = registrosPorPagina
                }
            },
      app_key = _settings.AppKey,
      app_secret = _settings.AppSecret
    };

    var json = JsonSerializer.Serialize(requestBody, _jsonOptions);
    var content = new StringContent(json, Encoding.UTF8, "application/json");

    _logger.LogInformation("Enviando requisição para OMIE: {Json}", json);

    content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

    var response = await _httpClient.PostAsync("https://app.omie.com.br/api/v1/financas/mf/", content, cancellationToken);
    var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);

    _logger.LogInformation("Resposta da API OMIE para movimentos: {ResponseContent}", responseContent);
    _logger.LogWarning("DEBUG - Tamanho da resposta: {Size} caracteres", responseContent.Length);
    _logger.LogWarning("DEBUG - Primeiros 500 caracteres: {Preview}", responseContent[..Math.Min(500, responseContent.Length)]);

    if (!response.IsSuccessStatusCode)
    {
      _logger.LogError("Erro na API OMIE Movimentos - Status: {StatusCode}, Response: {Response}", response.StatusCode, responseContent);

      if (responseContent.StartsWith("<?xml"))
      {
        throw new HttpRequestException($"Erro de autenticação na API OMIE. Verifique as credenciais. Status: {response.StatusCode}");
      }

      throw new HttpRequestException($"Erro na API OMIE: {response.StatusCode} - {responseContent}");
    }

    if (responseContent.StartsWith("<?xml"))
    {
      _logger.LogError("API OMIE retornou XML em vez de JSON: {Response}", responseContent);
      throw new HttpRequestException("API OMIE retornou formato inválido (XML em vez de JSON)");
    }

    var result = JsonSerializer.Deserialize<MovimentosFinanceirosResponse>(responseContent, _jsonOptions) ?? new MovimentosFinanceirosResponse();

    _logger.LogWarning("DEBUG - Movimentos deserializados: {Count}", result.MovimentosFinanceiros?.Length ?? 0);
    _logger.LogWarning("DEBUG - Total de registros na resposta: {Total}", result.TotalDeRegistros);

    return result;
  }
}