using d4cETL.Application.DTOs;
using d4cETL.Domain.Entities;
using d4cETL.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace d4cETL.Application.Services;

public class ObservabilidadeService : IObservabilidadeService
{
  private readonly OmieETLContext _context;
  private readonly ILogger<ObservabilidadeService> _logger;

  public ObservabilidadeService(OmieETLContext context, ILogger<ObservabilidadeService> logger)
  {
    _context = context;
    _logger = logger;
  }

  public async Task<PaginatedResult<ETLBatchResumoDto>> ListarLotesAsync(BatchFiltroDto filtro)
  {
    var query = _context.ETLBatches.AsQueryable();

    if (!string.IsNullOrEmpty(filtro.Entidade))
      query = query.Where(b => b.Entidade == filtro.Entidade);

    if (!string.IsNullOrEmpty(filtro.Status))
      query = query.Where(b => b.Status == filtro.Status);

    if (filtro.DataInicio.HasValue)
      query = query.Where(b => b.DataInicio >= filtro.DataInicio.Value);

    if (filtro.DataFim.HasValue)
      query = query.Where(b => b.DataInicio <= filtro.DataFim.Value);

    var total = await query.CountAsync();

    var lotes = await query
        .OrderByDescending(b => b.DataInicio)
        .Skip((filtro.Pagina - 1) * filtro.TamanhoPagina)
        .Take(filtro.TamanhoPagina)
        .Select(b => new ETLBatchResumoDto
        {
          Id = b.Id,
          BatchId = b.BatchId,
          TipoExecucao = b.TipoExecucao,
          Entidade = b.Entidade,
          DataInicio = b.DataInicio,
          DataFim = b.DataFim,
          Status = b.Status,
          TotalRegistrosLidos = b.TotalRegistrosLidos,
          TotalRegistrosProcessados = b.TotalRegistrosProcessados,
          TotalRegistrosInseridos = b.TotalRegistrosInseridos,
          TotalRegistrosAtualizados = b.TotalRegistrosAtualizados,
          TotalRegistrosComErro = b.TotalRegistrosComErro,
          ThroughputRegistrosPorSegundo = b.ThroughputRegistrosPorSegundo,
          LatenciaMediaMs = b.LatenciaMediaMs,
          MensagemErro = b.MensagemErro
        })
        .ToListAsync();

    return new PaginatedResult<ETLBatchResumoDto>
    {
      Items = lotes,
      TotalItems = total,
      Page = filtro.Pagina,
      PageSize = filtro.TamanhoPagina
    };
  }

  public async Task<ETLBatchDetalheDto?> ObterDetalheLoteAsync(int loteId)
  {
    var lote = await _context.ETLBatches
        .Include(b => b.Itens)
        .FirstOrDefaultAsync(b => b.Id == loteId);

    if (lote == null)
      return null;

    return new ETLBatchDetalheDto
    {
      Id = lote.Id,
      BatchId = lote.BatchId,
      TipoExecucao = lote.TipoExecucao,
      Entidade = lote.Entidade,
      DataInicio = lote.DataInicio,
      DataFim = lote.DataFim,
      Status = lote.Status,
      TotalRegistrosLidos = lote.TotalRegistrosLidos,
      TotalRegistrosProcessados = lote.TotalRegistrosProcessados,
      TotalRegistrosInseridos = lote.TotalRegistrosInseridos,
      TotalRegistrosAtualizados = lote.TotalRegistrosAtualizados,
      TotalRegistrosComErro = lote.TotalRegistrosComErro,
      ThroughputRegistrosPorSegundo = lote.ThroughputRegistrosPorSegundo,
      LatenciaMediaMs = lote.LatenciaMediaMs,
      MensagemErro = lote.MensagemErro,
      Itens = lote.Itens.Select(i => new ETLBatchItemDto
      {
        Id = i.Id,
        ItemId = i.ItemId,
        TipoItem = i.TipoItem,
        Pagina = i.Pagina,
        PosicaoNaPagina = i.PosicaoNaPagina,
        DataInicio = i.DataInicio,
        DataFim = i.DataFim,
        Status = i.Status,
        Operacao = i.Operacao,
        NumeroTentativas = i.NumeroTentativas,
        DuracaoMs = i.DuracaoMs,
        MensagemErro = i.MensagemErro
      }).ToList()
    };
  }

  public async Task<PaginatedResult<ETLBatchItemDto>> ListarItensLoteAsync(int loteId, ItemFiltroDto filtro)
  {
    var query = _context.ETLBatchItems
        .Where(i => i.ETLBatchId == loteId);

    if (!string.IsNullOrEmpty(filtro.Status))
      query = query.Where(i => i.Status == filtro.Status);

    if (!string.IsNullOrEmpty(filtro.TipoItem))
      query = query.Where(i => i.TipoItem == filtro.TipoItem);

    var total = await query.CountAsync();

    var itens = await query
        .OrderBy(i => i.Pagina)
        .ThenBy(i => i.PosicaoNaPagina)
        .Skip((filtro.Pagina - 1) * filtro.TamanhoPagina)
        .Take(filtro.TamanhoPagina)
        .Select(i => new ETLBatchItemDto
        {
          Id = i.Id,
          ItemId = i.ItemId,
          TipoItem = i.TipoItem,
          Pagina = i.Pagina,
          PosicaoNaPagina = i.PosicaoNaPagina,
          DataInicio = i.DataInicio,
          DataFim = i.DataFim,
          Status = i.Status,
          Operacao = i.Operacao,
          NumeroTentativas = i.NumeroTentativas,
          DuracaoMs = i.DuracaoMs,
          MensagemErro = i.MensagemErro
        })
        .ToListAsync();

    return new PaginatedResult<ETLBatchItemDto>
    {
      Items = itens,
      TotalItems = total,
      Page = filtro.Pagina,
      PageSize = filtro.TamanhoPagina
    };
  }

  public async Task<List<ETLMetricsDto>> ObterMetricasAsync(string? entidade = null)
  {
    var query = _context.ETLMetrics.AsQueryable();

    if (!string.IsNullOrEmpty(entidade))
      query = query.Where(m => m.Entidade == entidade);

    var metricas = await query
        .GroupBy(m => m.Entidade)
        .Select(g => new ETLMetricsDto
        {
          Entidade = g.Key,
          UltimaExecucao = g.Max(m => m.UltimaExecucao),
          StatusUltimaExecucao = g.OrderByDescending(m => m.UltimaExecucao).First().Status,
          RegistrosLidosUltimaExecucao = g.OrderByDescending(m => m.UltimaExecucao).First().RegistrosLidos,
          RegistrosProcessadosUltimaExecucao = g.OrderByDescending(m => m.UltimaExecucao).First().RegistrosProcessados,
          RegistrosComErroUltimaExecucao = g.OrderByDescending(m => m.UltimaExecucao).First().RegistrosComErro,
          ThroughputMedio = g.Average(m => m.ThroughputRegistrosPorSegundo),
          LatenciaMedia = g.Average(m => m.LatenciaMediaMs),
          TotalExecucoes = g.Count(),
          TaxaSucessoMedia = g.Average(m => m.RegistrosProcessados > 0 ?
                  (double)(m.RegistrosProcessados - m.RegistrosComErro) / m.RegistrosProcessados * 100 : 0)
        })
        .ToListAsync();

    return metricas;
  }

  public async Task<bool> ReprocessarItensComErroAsync(int loteId)
  {
    var itensComErro = await _context.ETLBatchItems
        .Where(i => i.ETLBatchId == loteId && i.Status == "Erro")
        .ToListAsync();

    if (!itensComErro.Any())
      return false;

    foreach (var item in itensComErro)
    {
      item.Status = "Processando";
      item.NumeroTentativas++;
      item.UpdatedAt = DateTime.UtcNow;
    }

    await _context.SaveChangesAsync();

    _logger.LogInformation("Reprocessamento iniciado para {Count} itens do lote {LoteId}",
        itensComErro.Count, loteId);

    return true;
  }

  public async Task<int> IniciarLoteAsync(string entidade, string tipoExecucao, Dictionary<string, object>? parametros = null)
  {
    var batch = new ETLBatch
    {
      BatchId = Guid.NewGuid().ToString(),
      Entidade = entidade,
      TipoExecucao = tipoExecucao,
      Status = "Executando",
      DataInicio = DateTime.UtcNow,
      CorrelationId = Guid.NewGuid().ToString()
    };

    _context.ETLBatches.Add(batch);
    await _context.SaveChangesAsync();

    _logger.LogInformation("Lote {BatchId} iniciado para entidade {Entidade}", batch.BatchId, entidade);
    return batch.Id;
  }

  public async Task FinalizarLoteAsync(int loteId, string status, string? mensagemErro = null)
  {
    var batch = await _context.ETLBatches.FindAsync(loteId);
    if (batch == null)
      return;

    batch.Status = status;
    batch.DataFim = DateTime.UtcNow;
    batch.UpdatedAt = DateTime.UtcNow;

    if (!string.IsNullOrEmpty(mensagemErro))
      batch.MensagemErro = mensagemErro;

    await _context.SaveChangesAsync();

    _logger.LogInformation("Lote {BatchId} finalizado com status {Status}", batch.BatchId, status);
  }

  public async Task AdicionarItemLoteAsync(int loteId, string itemId, string tipoItem, int pagina, int posicao)
  {
    var item = new ETLBatchItem
    {
      ETLBatchId = loteId,
      ItemId = itemId,
      TipoItem = tipoItem,
      Pagina = pagina,
      PosicaoNaPagina = posicao,
      Status = "Processando",
      Operacao = "Processar",
      DataInicio = DateTime.UtcNow
    };

    _context.ETLBatchItems.Add(item);
    await _context.SaveChangesAsync();
  }

  public async Task RegistrarMetricasAsync(string entidade, string tipoExecucao, int registrosLidos,
      int registrosProcessados, int registrosComErro, double throughput, double latencia, double duracao)
  {
    var metrica = new ETLMetrics
    {
      Entidade = entidade,
      DataExecucao = DateTime.UtcNow,
      TipoExecucao = tipoExecucao,
      RegistrosLidos = registrosLidos,
      RegistrosProcessados = registrosProcessados,
      RegistrosComErro = registrosComErro,
      ThroughputRegistrosPorSegundo = throughput,
      LatenciaMediaMs = latencia,
      DuracaoTotalMinutos = duracao,
      UltimaExecucao = DateTime.UtcNow,
      Status = registrosComErro > 0 ? "Erro" : "Sucesso"
    };

    _context.ETLMetrics.Add(metrica);
    await _context.SaveChangesAsync();
  }

  public async Task RegistrarInicioItemAsync(int loteId, string itemId, string tipoItem, int pagina, int posicaoNaPagina)
  {
    var item = new ETLBatchItem
    {
      ETLBatchId = loteId,
      ItemId = itemId,
      TipoItem = tipoItem,
      Pagina = pagina,
      PosicaoNaPagina = posicaoNaPagina,
      Status = "Processando",
      Operacao = "Processar",
      DataInicio = DateTime.UtcNow,
      NumeroTentativas = 1
    };

    _context.ETLBatchItems.Add(item);
    await _context.SaveChangesAsync();

    _logger.LogInformation("Item {ItemId} iniciado no lote {LoteId}", itemId, loteId);
  }

  public async Task RegistrarFimItemAsync(string itemId, string status, string operacao, double? duracaoMs = null, string? mensagemErro = null)
  {
    var item = await _context.ETLBatchItems
        .FirstOrDefaultAsync(i => i.ItemId == itemId && i.Status == "Processando");

    if (item == null)
    {
      _logger.LogWarning("Item {ItemId} não encontrado ou não está em processamento", itemId);
      return;
    }

    item.Status = status;
    item.Operacao = operacao;
    item.DataFim = DateTime.UtcNow;
    item.UpdatedAt = DateTime.UtcNow;

    if (duracaoMs.HasValue)
      item.DuracaoMs = duracaoMs.Value;
    else
      item.DuracaoMs = (DateTime.UtcNow - item.DataInicio).TotalMilliseconds;

    if (!string.IsNullOrEmpty(mensagemErro))
      item.MensagemErro = mensagemErro;

    await _context.SaveChangesAsync();

    _logger.LogInformation("Item {ItemId} finalizado com status {Status}", itemId, status);
  }

  public async Task RegistrarMetricasAsync(string entidade, int registrosLidos, int registrosProcessados, int registrosComErro, double throughputRegistrosPorSegundo, double latenciaMediaMs, string status)
  {
    var metrica = new ETLMetrics
    {
      Entidade = entidade,
      DataExecucao = DateTime.UtcNow,
      TipoExecucao = "Manual",
      RegistrosLidos = registrosLidos,
      RegistrosProcessados = registrosProcessados,
      RegistrosComErro = registrosComErro,
      ThroughputRegistrosPorSegundo = throughputRegistrosPorSegundo,
      LatenciaMediaMs = latenciaMediaMs,
      DuracaoTotalMinutos = 0,
      UltimaExecucao = DateTime.UtcNow,
      Status = status
    };

    _context.ETLMetrics.Add(metrica);
    await _context.SaveChangesAsync();

    _logger.LogInformation("Métricas registradas para entidade {Entidade}: {RegistrosProcessados} registros processados", entidade, registrosProcessados);
  }
}