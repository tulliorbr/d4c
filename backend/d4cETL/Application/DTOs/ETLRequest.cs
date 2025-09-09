using System.Text.Json.Serialization;

namespace d4cETL.Application.DTOs;

public class ExecutarMovimentosRequest
{
  [JsonPropertyName("pagina")]
  public int Pagina { get; set; } = 1;

  [JsonPropertyName("registros_por_pagina")]
  public int RegistrosPorPagina { get; set; } = 500;
}

public class ExecutarCategoriasRequest
{
  [JsonPropertyName("pagina")]
  public int Pagina { get; set; } = 1;

  [JsonPropertyName("registros_por_pagina")]
  public int RegistrosPorPagina { get; set; } = 50;
}

public class FullLoadETLRequest
{
  [JsonPropertyName("force_reload")]
  public bool ForceReload { get; set; } = false;

  [JsonPropertyName("batch_size")]
  public int BatchSize { get; set; } = 500;
}

public class IncrementalETLRequest
{
  [JsonPropertyName("entidade")]
  public string Entidade { get; set; } = "movimentos";

  [JsonPropertyName("data_checkpoint")]
  public DateTime? DataCheckpoint { get; set; }

  [JsonPropertyName("batch_size")]
  public int BatchSize { get; set; } = 500;
}

public class ETLResponse
{
  [JsonPropertyName("sucesso")]
  public bool Sucesso { get; set; }

  [JsonPropertyName("mensagem")]
  public string Mensagem { get; set; } = string.Empty;

  [JsonPropertyName("registros_processados")]
  public int RegistrosProcessados { get; set; }

  [JsonPropertyName("registros_inseridos")]
  public int RegistrosInseridos { get; set; }

  [JsonPropertyName("registros_atualizados")]
  public int RegistrosAtualizados { get; set; }

  [JsonPropertyName("tempo_execucao_ms")]
  public long TempoExecucaoMs { get; set; }

  [JsonPropertyName("data_inicio")]
  public DateTime DataInicio { get; set; }

  [JsonPropertyName("data_fim")]
  public DateTime DataFim { get; set; }

  [JsonPropertyName("ultimo_checkpoint")]
  public DateTime? UltimoCheckpoint { get; set; }
}