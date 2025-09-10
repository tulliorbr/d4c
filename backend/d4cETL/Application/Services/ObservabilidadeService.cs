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

  public async Task<MetricasDetalhadasDto> ObterMetricasDetalhadasAsync(string? entidade = null, int diasHistorico = 7)
  {
    var dataLimite = DateTime.UtcNow.AddDays(-diasHistorico);

    var metricasAtuais = await ObterMetricasAsync(entidade);

    var query = _context.ETLMetrics.AsQueryable();
    if (!string.IsNullOrEmpty(entidade))
      query = query.Where(m => m.Entidade == entidade);

    var tendenciasHistoricas = await query
      .Where(m => m.DataExecucao >= dataLimite)
      .GroupBy(m => new { m.Entidade, Data = m.DataExecucao.Date })
      .Select(g => new
      {
        Entidade = g.Key.Entidade,
        Data = g.Key.Data,
        ThroughputMedio = g.Average(m => m.ThroughputRegistrosPorSegundo),
        LatenciaMedia = g.Average(m => m.LatenciaMediaMs),
        TaxaSucesso = g.Average(m => m.RegistrosProcessados > 0 ?
          (double)(m.RegistrosProcessados - m.RegistrosComErro) / m.RegistrosProcessados * 100 : 0),
        TotalExecucoes = g.Count()
      })
      .OrderBy(t => t.Data)
      .ToListAsync();

    var tendenciasHistoricasDto = tendenciasHistoricas.Select(t => new TendenciaMetricaDto
    {
      Entidade = t.Entidade,
      Data = t.Data,
      ThroughputMedio = (decimal)t.ThroughputMedio,
      LatenciaMedia = (decimal)t.LatenciaMedia,
      TaxaSucesso = (decimal)t.TaxaSucesso,
      TotalExecucoes = t.TotalExecucoes
    }).ToList();

    var alertas = await GerarAlertasAsync(metricasAtuais, tendenciasHistoricasDto);

    var resumoGeral = CalcularResumoPerformance(metricasAtuais, tendenciasHistoricasDto);

    return new MetricasDetalhadasDto
    {
      MetricasAtuais = metricasAtuais,
      TendenciasHistoricas = tendenciasHistoricasDto,
      Alertas = alertas,
      ResumoGeral = resumoGeral
    };
  }

  public async Task<List<AlertaPerformanceDto>> ObterAlertasAsync()
  {
    var metricasAtuais = await ObterMetricasAsync();
    var tendenciasHistoricasData = await _context.ETLMetrics
      .Where(m => m.DataExecucao >= DateTime.UtcNow.AddDays(-7))
      .GroupBy(m => new { m.Entidade, Data = m.DataExecucao.Date })
      .Select(g => new
      {
        Entidade = g.Key.Entidade,
        Data = g.Key.Data,
        ThroughputMedio = g.Average(m => m.ThroughputRegistrosPorSegundo),
        LatenciaMedia = g.Average(m => m.LatenciaMediaMs),
        TaxaSucesso = g.Average(m => m.RegistrosProcessados > 0 ?
          (double)(m.RegistrosProcessados - m.RegistrosComErro) / m.RegistrosProcessados * 100 : 0)
      })
      .ToListAsync();

    var tendenciasHistoricas = tendenciasHistoricasData.Select(t => new TendenciaMetricaDto
    {
      Entidade = t.Entidade,
      Data = t.Data,
      ThroughputMedio = (decimal)t.ThroughputMedio,
      LatenciaMedia = (decimal)t.LatenciaMedia,
      TaxaSucesso = (decimal)t.TaxaSucesso
    }).ToList();

    return await GerarAlertasAsync(metricasAtuais, tendenciasHistoricas);
  }

  private async Task<List<AlertaPerformanceDto>> GerarAlertasAsync(List<ETLMetricsDto> metricasAtuais, List<TendenciaMetricaDto> tendenciasHistoricas)
  {
    var alertas = new List<AlertaPerformanceDto>();

    foreach (var metrica in metricasAtuais)
    {
      var tendenciasEntidade = tendenciasHistoricas.Where(t => t.Entidade == metrica.Entidade).ToList();

      if (metrica.ThroughputMedio < 10)
      {
        alertas.Add(new AlertaPerformanceDto
        {
          Id = Guid.NewGuid().ToString(),
          Entidade = metrica.Entidade,
          Tipo = "Throughput",
          Severidade = metrica.ThroughputMedio < 5 ? "Critica" : "Alta",
          Mensagem = $"Throughput baixo: {metrica.ThroughputMedio:F2} registros/seg",
          ValorAtual = (decimal)metrica.ThroughputMedio,
          LimiteEsperado = 10,
          DataDeteccao = DateTime.UtcNow,
          Ativo = true
        });
      }

      if (metrica.LatenciaMedia > 1000)
      {
        alertas.Add(new AlertaPerformanceDto
        {
          Id = Guid.NewGuid().ToString(),
          Entidade = metrica.Entidade,
          Tipo = "Latencia",
          Severidade = metrica.LatenciaMedia > 5000 ? "Critica" : "Alta",
          Mensagem = $"Latência alta: {metrica.LatenciaMedia:F2}ms",
          ValorAtual = (decimal)metrica.LatenciaMedia,
          LimiteEsperado = 1000,
          DataDeteccao = DateTime.UtcNow,
          Ativo = true
        });
      }

      if (metrica.TaxaSucessoMedia < 95)
      {
        alertas.Add(new AlertaPerformanceDto
        {
          Id = Guid.NewGuid().ToString(),
          Entidade = metrica.Entidade,
          Tipo = "TaxaErro",
          Severidade = metrica.TaxaSucessoMedia < 80 ? "Critica" : "Media",
          Mensagem = $"Taxa de sucesso baixa: {metrica.TaxaSucessoMedia:F1}%",
          ValorAtual = (decimal)metrica.TaxaSucessoMedia,
          LimiteEsperado = 95,
          DataDeteccao = DateTime.UtcNow,
          Ativo = true
        });
      }
    }

    return alertas;
  }

  private ResumoPerformanceDto CalcularResumoPerformance(List<ETLMetricsDto> metricasAtuais, List<TendenciaMetricaDto> tendenciasHistoricas)
  {
    var resumo = new ResumoPerformanceDto
    {
      TotalEntidades = metricasAtuais.Count,
      ThroughputMedioGeral = metricasAtuais.Any() ? (decimal)metricasAtuais.Average(m => m.ThroughputMedio) : 0,
      LatenciaMediaGeral = metricasAtuais.Any() ? (decimal)metricasAtuais.Average(m => m.LatenciaMedia) : 0,
      TaxaSucessoGeral = metricasAtuais.Any() ? (decimal)metricasAtuais.Average(m => m.TaxaSucessoMedia) : 0,
      UltimaAtualizacao = DateTime.UtcNow
    };

    if (tendenciasHistoricas.Any())
    {
      var dataCorte = DateTime.UtcNow.AddDays(-3).Date;
      var recentes = tendenciasHistoricas.Where(t => t.Data >= dataCorte).ToList();
      var anteriores = tendenciasHistoricas.Where(t => t.Data < dataCorte).ToList();

      if (recentes.Any() && anteriores.Any())
      {
        var throughputRecente = (double)recentes.Average(r => r.ThroughputMedio);
        var throughputAnterior = (double)anteriores.Average(a => a.ThroughputMedio);
        resumo.TendenciaThroughput = throughputAnterior > 0 ?
          (decimal)((throughputRecente - throughputAnterior) / throughputAnterior * 100) : 0;

        var latenciaRecente = (double)recentes.Average(r => r.LatenciaMedia);
        var latenciaAnterior = (double)anteriores.Average(a => a.LatenciaMedia);
        resumo.TendenciaLatencia = latenciaAnterior > 0 ?
          (decimal)((latenciaRecente - latenciaAnterior) / latenciaAnterior * 100) : 0;

        var sucessoRecente = (double)recentes.Average(r => r.TaxaSucesso);
        var sucessoAnterior = (double)anteriores.Average(a => a.TaxaSucesso);
        resumo.TendenciaTaxaSucesso = sucessoAnterior > 0 ?
          (decimal)((sucessoRecente - sucessoAnterior) / sucessoAnterior * 100) : 0;
      }
    }

    return resumo;
  }
}