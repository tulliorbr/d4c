using System.ComponentModel.DataAnnotations;

namespace d4cETL.Application.DTOs;

public class ETLBatchResumoDto
{
  public int Id { get; set; }
  public string BatchId { get; set; } = string.Empty;
  public string TipoExecucao { get; set; } = string.Empty;
  public string Entidade { get; set; } = string.Empty;
  public DateTime DataInicio { get; set; }
  public DateTime? DataFim { get; set; }
  public string Status { get; set; } = string.Empty;
  public int TotalRegistrosLidos { get; set; }
  public int TotalRegistrosProcessados { get; set; }
  public int TotalRegistrosInseridos { get; set; }
  public int TotalRegistrosAtualizados { get; set; }
  public int TotalRegistrosComErro { get; set; }
  public double? ThroughputRegistrosPorSegundo { get; set; }
  public double? LatenciaMediaMs { get; set; }
  public string? MensagemErro { get; set; }
  public TimeSpan? Duracao => DataFim?.Subtract(DataInicio);
  public double? PercentualSucesso => TotalRegistrosLidos > 0 ?
      (double)(TotalRegistrosProcessados - TotalRegistrosComErro) / TotalRegistrosLidos * 100 : null;
}

public class ETLBatchItemDto
{
  public int Id { get; set; }
  public string ItemId { get; set; } = string.Empty;
  public string TipoItem { get; set; } = string.Empty;
  public int Pagina { get; set; }
  public int PosicaoNaPagina { get; set; }
  public DateTime DataInicio { get; set; }
  public DateTime? DataFim { get; set; }
  public string Status { get; set; } = string.Empty;
  public string Operacao { get; set; } = string.Empty;
  public int NumeroTentativas { get; set; }
  public double? DuracaoMs { get; set; }
  public string? MensagemErro { get; set; }
}

public class ETLBatchDetalheDto : ETLBatchResumoDto
{
  public List<ETLBatchItemDto> Itens { get; set; } = new();
  public int TotalItens => Itens.Count;
  public int ItensComSucesso => Itens.Count(i => i.Status == "Sucesso");
  public int ItensComErro => Itens.Count(i => i.Status == "Erro");
  public int ItensIgnorados => Itens.Count(i => i.Status == "Ignorado");
}

public class ETLMetricsDto
{
  public string Entidade { get; set; } = string.Empty;
  public DateTime UltimaExecucao { get; set; }
  public string StatusUltimaExecucao { get; set; } = string.Empty;
  public int RegistrosLidosUltimaExecucao { get; set; }
  public int RegistrosProcessadosUltimaExecucao { get; set; }
  public int RegistrosComErroUltimaExecucao { get; set; }
  public double ThroughputMedio { get; set; }
  public double LatenciaMedia { get; set; }
  public int TotalExecucoes { get; set; }
  public double TaxaSucessoMedia { get; set; }
}

public class ObservabilidadeResumoDto
{
  public List<ETLBatchResumoDto> UltimosLotes { get; set; } = new();
  public List<ETLMetricsDto> MetricasPorEntidade { get; set; } = new();
  public int TotalLotesHoje { get; set; }
  public int LotesComSucessoHoje { get; set; }
  public int LotesComErroHoje { get; set; }
  public double ThroughputMedioHoje { get; set; }
  public double LatenciaMediaHoje { get; set; }
}

public class FiltroObservabilidadeRequest
{
  public DateTime? DataInicio { get; set; }
  public DateTime? DataFim { get; set; }
  public string? Entidade { get; set; }
  public string? Status { get; set; }
  public string? TipoExecucao { get; set; }
  public int Pagina { get; set; } = 1;
  public int TamanhoPagina { get; set; } = 20;
}

public class BatchResumoDto
{
  public Guid Id { get; set; }
  public string Entidade { get; set; } = string.Empty;
  public DateTime DataInicio { get; set; }
  public DateTime? DataFim { get; set; }
  public string Status { get; set; } = string.Empty;
  public int TotalItens { get; set; }
  public int ItensProcessados { get; set; }
  public int ItensComErro { get; set; }
  public TimeSpan? Duracao { get; set; }
}

public class BatchDetalheDto : BatchResumoDto
{
  public List<BatchItemDto> Itens { get; set; } = new();
  public string? MensagemErro { get; set; }
  public Dictionary<string, object> Parametros { get; set; } = new();
}

public class BatchItemDto
{
  public Guid Id { get; set; }
  public Guid BatchId { get; set; }
  public string TipoOperacao { get; set; } = string.Empty;
  public string? RegistroId { get; set; }
  public DateTime DataInicio { get; set; }
  public DateTime? DataFim { get; set; }
  public string Status { get; set; } = string.Empty;
  public int Tentativas { get; set; }
  public string? MensagemErro { get; set; }
  public TimeSpan? Duracao { get; set; }
}

public class MetricasResumoDto
{
  public string Entidade { get; set; } = string.Empty;
  public DateTime PeriodoInicio { get; set; }
  public DateTime PeriodoFim { get; set; }
  public int TotalExecucoes { get; set; }
  public int ExecucoesSucesso { get; set; }
  public int ExecucoesErro { get; set; }
  public double TaxaSucesso { get; set; }
  public long TotalRegistrosLidos { get; set; }
  public long TotalRegistrosProcessados { get; set; }
  public double ThroughputMedio { get; set; }
  public TimeSpan LatenciaMedia { get; set; }
  public DateTime? UltimaExecucao { get; set; }
}

public class ExecucaoResumoDto
{
  public string Entidade { get; set; } = string.Empty;
  public long RegistrosLidos { get; set; }
  public long RegistrosProcessados { get; set; }
  public long RegistrosComErro { get; set; }
  public double Throughput { get; set; }
  public TimeSpan LatenciaMedia { get; set; }
  public DateTime UltimaExecucao { get; set; }
  public string StatusUltimaExecucao { get; set; } = string.Empty;
}

public class PerformanceDto
{
  public double ThroughputAtual { get; set; }
  public double ThroughputMedio { get; set; }
  public TimeSpan LatenciaAtual { get; set; }
  public TimeSpan LatenciaMedia { get; set; }
  public long MemoriaUtilizada { get; set; }
  public double CpuUtilizacao { get; set; }
  public int ConexoesAtivas { get; set; }
  public DateTime UltimaAtualizacao { get; set; }
}

public class BatchFiltroDto
{
  public string? Entidade { get; set; }
  public string? Status { get; set; }
  public DateTime? DataInicio { get; set; }
  public DateTime? DataFim { get; set; }
  public int Pagina { get; set; } = 1;
  public int TamanhoPagina { get; set; } = 20;
}

public class ItemFiltroDto
{
  public string? Status { get; set; }
  public string? TipoItem { get; set; }
  public int Pagina { get; set; } = 1;
  public int TamanhoPagina { get; set; } = 50;
}

public class PaginatedResult<T>
{
  public List<T> Items { get; set; } = new();
  public int TotalItems { get; set; }
  public int Page { get; set; }
  public int PageSize { get; set; }
  public int TotalPages => (int)Math.Ceiling((double)TotalItems / PageSize);
  public bool HasNextPage => Page < TotalPages;
  public bool HasPreviousPage => Page > 1;
}

public class MetricasFiltroDto
{
  public string? Entidade { get; set; }
  public DateTime? DataInicio { get; set; }
  public DateTime? DataFim { get; set; }
  public string? TipoExecucao { get; set; }
  public int Pagina { get; set; } = 1;
  public int TamanhoPagina { get; set; } = 20;
}