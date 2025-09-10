using d4cETL.Application.DTOs;
using d4cETL.Domain.Entities;

namespace d4cETL.Application.Services;

public interface IObservabilidadeService
{
  Task<PaginatedResult<ETLBatchResumoDto>> ListarLotesAsync(BatchFiltroDto filtro);
  Task<ETLBatchDetalheDto?> ObterDetalheLoteAsync(int loteId);
  Task<PaginatedResult<ETLBatchItemDto>> ListarItensLoteAsync(int loteId, ItemFiltroDto filtro);
  Task<List<ETLMetricsDto>> ObterMetricasAsync(string? entidade = null);
  Task<MetricasDetalhadasDto> ObterMetricasDetalhadasAsync(string? entidade = null, int diasHistorico = 7);
  Task<List<AlertaPerformanceDto>> ObterAlertasAsync();
  Task<bool> ReprocessarItensComErroAsync(int loteId);

  Task<int> IniciarLoteAsync(string entidade, string tipoExecucao, Dictionary<string, object>? parametros = null);
  Task FinalizarLoteAsync(int loteId, string status, string? mensagemErro = null);
  Task RegistrarInicioItemAsync(int loteId, string itemId, string tipoItem, int pagina, int posicaoNaPagina);
  Task RegistrarFimItemAsync(string itemId, string status, string operacao, double? duracaoMs = null, string? mensagemErro = null);
  Task RegistrarMetricasAsync(string entidade, int registrosLidos, int registrosProcessados, int registrosComErro, double throughputRegistrosPorSegundo, double latenciaMediaMs, string status);
  Task AdicionarItemLoteAsync(int loteId, string itemId, string tipoItem, int pagina, int posicao);
  Task RegistrarMetricasAsync(string entidade, string tipoExecucao, int registrosLidos, int registrosProcessados, int registrosComErro, double throughput, double latencia, double duracao);
}