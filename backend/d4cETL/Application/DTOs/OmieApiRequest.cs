using System.Text.Json.Serialization;

namespace d4cETL.Application.DTOs;

public class OmieApiRequest<T>
{
  [JsonPropertyName("call")]
  public string Call { get; set; } = string.Empty;

  [JsonPropertyName("param")]
  public T[] Param { get; set; } = Array.Empty<T>();

  [JsonPropertyName("app_key")]
  public string App_Key { get; set; } = string.Empty;

  [JsonPropertyName("app_secret")]
  public string App_Secret { get; set; } = string.Empty;
}

public class ListarMovimentosRequest
{
  [JsonPropertyName("nPagina")]
  public int NPagina { get; set; } = 1;

  [JsonPropertyName("nRegPorPagina")]
  public int NRegPorPagina { get; set; } = 50;
}

public class ListarCategoriasRequest
{
  [JsonPropertyName("pagina")]
  public int Pagina { get; set; } = 1;

  [JsonPropertyName("registros_por_pagina")]
  public int RegistrosPorPagina { get; set; } = 50;
}