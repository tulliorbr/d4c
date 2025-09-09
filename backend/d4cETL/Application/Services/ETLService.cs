using d4cETL.Application.DTOs;
using d4cETL.Application.Configuration;
using d4cETL.Domain.Entities;
using d4cETL.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace d4cETL.Application.Services;

public class ETLService : IETLService
{
  private readonly IOmieApiService _omieApiService;
  private readonly OmieETLContext _context;
  private readonly ILogger<ETLService> _logger;
  private readonly d4cETL.Application.Configuration.ETLSettings _settings;

  public ETLService(
      IOmieApiService omieApiService,
      OmieETLContext context,
      ILogger<ETLService> logger,
      Microsoft.Extensions.Options.IOptions<d4cETL.Application.Configuration.ETLSettings> settings)
  {
    _omieApiService = omieApiService;
    _context = context;
    _logger = logger;
    _settings = settings.Value;
  }

  public async Task<MovimentosFinanceirosResponse> ExecutarETLMovimentosAsync(string correlationId, ExecutarMovimentosRequest request, CancellationToken cancellationToken = default)
  {
    _logger.LogInformation("Iniciando consulta de Movimentos Financeiros. Página: {Pagina}, Registros: {Registros}. CorrelationId: {CorrelationId}",
        request.Pagina, request.RegistrosPorPagina, correlationId);

    try
    {
      var response = await _omieApiService.ListarMovimentosAsync(request.Pagina, request.RegistrosPorPagina, cancellationToken);

      _logger.LogInformation("Consulta de movimentos realizada com sucesso. Total de registros: {Total}. CorrelationId: {CorrelationId}",
          response.MovimentosFinanceiros?.Length ?? 0, correlationId);

      return response;
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Erro ao consultar movimentos financeiros. CorrelationId: {CorrelationId}", correlationId);
      throw;
    }
  }

  public async Task<CategoriasResponse> ConsultarCategoriasAsync(string correlationId, ExecutarCategoriasRequest request, CancellationToken cancellationToken = default)
  {
    _logger.LogInformation("Iniciando consulta de Categorias. Página: {Pagina}, Registros: {Registros}. CorrelationId: {CorrelationId}",
        request.Pagina, request.RegistrosPorPagina, correlationId);

    try
    {
      var response = await _omieApiService.ListarCategoriasAsync(request.Pagina, request.RegistrosPorPagina, cancellationToken);

      _logger.LogInformation("Consulta de categorias realizada com sucesso. Total de registros: {Total}. CorrelationId: {CorrelationId}",
          response.CategoriaCadastro?.Length ?? 0, correlationId);

      return response;
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Erro ao consultar categorias. CorrelationId: {CorrelationId}", correlationId);
      throw;
    }
  }

  public async Task ExecutarETLCategoriasAsync(string correlationId, CancellationToken cancellationToken = default)
  {
    _logger.LogInformation("Iniciando ETL de Categorias. CorrelationId: {CorrelationId}", correlationId);

    await ExecutarETLCategoriasAsync(correlationId, null, cancellationToken);

    _logger.LogInformation("ETL de Categorias finalizado. CorrelationId: {CorrelationId}", correlationId);
  }

  public async Task ExecutarETLCategoriasAsync(string correlationId, ExecutarCategoriasRequest? request, CancellationToken cancellationToken = default)
  {
    _logger.LogInformation("Iniciando ETL de Categorias. CorrelationId: {CorrelationId}", correlationId);

    try
    {
      var paginaInicial = request?.Pagina ?? 1;
      var registrosPorPagina = request?.RegistrosPorPagina ?? _settings.BatchSize;
      var totalProcessado = 0;
      var pagina = paginaInicial;
      CategoriasResponse response;

      _logger.LogInformation("Parâmetros ETL Categorias - Página inicial: {Pagina}, Registros por página: {RegistrosPorPagina}. CorrelationId: {CorrelationId}",
          paginaInicial, registrosPorPagina, correlationId);

      do
      {
        _logger.LogInformation("Listando categorias na página {Pagina}. CorrelationId: {CorrelationId}", pagina, correlationId);

        response = await _omieApiService.ListarCategoriasAsync(pagina, registrosPorPagina, cancellationToken);

        if (response.CategoriaCadastro?.Length > 0)
        {
          var categorias = response.CategoriaCadastro
              .Select(dto => TransformarCategoria(dto, correlationId))
              .ToList();

          await ProcessarCategorias(categorias, cancellationToken);
          totalProcessado += categorias.Count;

          _logger.LogInformation("Processadas {Count} categorias da página {Pagina}. Total: {Total}",
              categorias.Count, pagina, totalProcessado);
        }

        pagina++;

        if (request?.Pagina > 1)
        {
          break;
        }

      } while (pagina <= response.TotalDePaginas);

      _logger.LogInformation("ETL de Categorias finalizado. Total processado: {Total}. CorrelationId: {CorrelationId}",
          totalProcessado, correlationId);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Erro ao executar ETL de categorias. CorrelationId: {CorrelationId}", correlationId);
      throw;
    }
  }

  public async Task ExecutarETLMovimentosAsync(string correlationId, CancellationToken cancellationToken = default)
  {
    _logger.LogInformation("Iniciando ETL de Movimentos Financeiros. CorrelationId: {CorrelationId}", correlationId);

    var pagina = 1;
    var totalProcessado = 0;
    MovimentosFinanceirosResponse response;

    do
    {
      response = await _omieApiService.ListarMovimentosAsync(pagina, _settings.BatchSize, cancellationToken);

      if (response.MovimentosFinanceiros?.Length > 0)
      {
        var movimentos = new List<MovimentoFinanceiro>();

        foreach (var dto in response.MovimentosFinanceiros)
        {
          try
          {
            var movimento = TransformarMovimentoFinanceiro(dto, correlationId);
            movimentos.Add(movimento);
          }
          catch (InvalidOperationException ex)
          {
            _logger.LogWarning(ex, "Movimento ignorado devido a dados inválidos");
          }
        }

        if (movimentos.Any())
        {
          await ProcessarMovimentos(movimentos, cancellationToken);
          totalProcessado += movimentos.Count;

          _logger.LogInformation("Processados {Count} movimentos da página {Pagina}. Total: {Total}",
              movimentos.Count, pagina, totalProcessado);
        }
      }

      pagina++;
    } while (pagina <= response.TotalDePaginas);

    _logger.LogInformation("ETL de Movimentos finalizado. Total processado: {Total}. CorrelationId: {CorrelationId}",
        totalProcessado, correlationId);
  }

  public async Task<MovimentosFinanceirosResponse> ConsultarMovimentosAsync(string correlationId, ExecutarMovimentosRequest request, CancellationToken cancellationToken = default)
  {
    _logger.LogInformation("Iniciando consulta de Movimentos Financeiros. Página: {Pagina}, Registros: {Registros}. CorrelationId: {CorrelationId}",
        request.Pagina, request.RegistrosPorPagina, correlationId);

    try
    {
      var response = await _omieApiService.ListarMovimentosAsync(request.Pagina, request.RegistrosPorPagina, cancellationToken);

      _logger.LogInformation("Consulta de movimentos realizada com sucesso. Total de registros: {Total}. CorrelationId: {CorrelationId}",
          response.MovimentosFinanceiros?.Length ?? 0, correlationId);

      return response;
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Erro ao consultar movimentos financeiros. CorrelationId: {CorrelationId}", correlationId);
      throw;
    }
  }

  private static Categoria TransformarCategoria(CategoriaDto dto, string correlationId)
  {
    return new Categoria
    {
      Codigo = dto.Codigo,
      Descricao = dto.Descricao,
      DescricaoPadrao = dto.DescricaoPadrao,
      TipoCategoria = dto.TipoCategoria,
      ContaInativa = dto.ContaInativa,
      Natureza = dto.Natureza,
      Totalizadora = dto.Totalizadora,
      CorrelationId = correlationId,
      CreatedAt = DateTime.UtcNow
    };
  }

  private MovimentoFinanceiro TransformarMovimentoFinanceiro(MovimentoFinanceiroDto dto, string correlationId)
  {
    var detalhes = dto.Detalhes;
    if (detalhes == null)
    {
      throw new InvalidOperationException("Detalhes do movimento financeiro não podem ser nulos");
    }

    if (!long.TryParse(detalhes.NCodTitulo, out var codTitulo) || codTitulo <= 0)
    {
      _logger.LogWarning("NCodTitulo inválido ignorado: {NCodTitulo}", detalhes.NCodTitulo);
      throw new InvalidOperationException($"NCodTitulo inválido: {detalhes.NCodTitulo}");
    }

    return new MovimentoFinanceiro
    {
      NCodTitulo = codTitulo,
      CCodIntTitulo = detalhes.CCodIntTitulo,
      CNumTitulo = detalhes.CNumTitulo,
      DDtEmissao = NormalizarData(detalhes.DDtEmissao),
      DDtVenc = NormalizarData(detalhes.DDtVenc),
      DDtPrevisao = NormalizarData(detalhes.DDtPrevisao),
      DDtPagamento = NormalizarData(detalhes.DDtPagamento),
      NCodCliente = detalhes.NCodCliente == 0 ? null : (int?)detalhes.NCodCliente,
      CCPFCNPJCliente = detalhes.CCPFCNPJCliente,
      CStatus = detalhes.CStatus,
      CNatureza = NormalizarNatureza(detalhes.CNatureza),
      CTipo = detalhes.CTipo,
      COperacao = detalhes.COperacao,
      CCodCateg = detalhes.CCodCateg,
      NValorTitulo = NormalizarValor(detalhes.NValorTitulo) ?? 0m,
      NValorPIS = NormalizarValor(detalhes.NValorPIS),
      NValorCOFINS = NormalizarValor(detalhes.NValorCOFINS),
      NValorCSLL = NormalizarValor(detalhes.NValorCSLL),
      NValorIR = NormalizarValor(detalhes.NValorIR),
      NValorISS = NormalizarValor(detalhes.NValorISS),
      NValorINSS = NormalizarValor(detalhes.NValorINSS),
      CorrelationId = correlationId,
      CreatedAt = DateTime.UtcNow
    };
  }

  private DateTime? NormalizarData(string? dataString)
  {
    if (string.IsNullOrWhiteSpace(dataString))
      return null;
    var formatos = new[] { "dd/MM/yyyy", "yyyy-MM-dd", "dd-MM-yyyy" };

    foreach (var formato in formatos)
    {
      if (DateTime.TryParseExact(dataString, formato, CultureInfo.InvariantCulture, DateTimeStyles.None, out var data))
      {
        return data;
      }
    }

    _logger.LogWarning("Não foi possível normalizar a data: {Data}", dataString);
    return null;
  }

  private static string? NormalizarNatureza(string? natureza)
  {
    if (string.IsNullOrWhiteSpace(natureza))
      return null;

    return natureza.ToUpperInvariant() switch
    {
      "R" or "RECEBER" or "RECEITA" => "R",
      "P" or "PAGAR" or "PAGAMENTO" or "DESPESA" => "P",
      _ => natureza
    };
  }

  private static decimal? NormalizarValor(decimal? valor)
  {
    if (!valor.HasValue)
      return null;
    return Math.Round(valor.Value, 2);
  }

  private async Task ProcessarMovimentos(List<MovimentoFinanceiro> movimentos, CancellationToken cancellationToken)
  {
    var movimentosValidos = movimentos
        .Where(m => m.NCodTitulo > 0)
        .GroupBy(m => m.NCodTitulo)
        .Select(g => g.First())
        .ToList();

    if (!movimentosValidos.Any())
    {
      _logger.LogWarning("Nenhum movimento válido encontrado para processar");
      return;
    }

    var nCodTitulosExistentes = movimentosValidos.Select(m => m.NCodTitulo).ToList();
    var movimentosExistentes = await _context.MovimentosFinanceiros
        .Where(m => nCodTitulosExistentes.Contains(m.NCodTitulo))
        .ToListAsync(cancellationToken);

    var movimentosExistentesDict = movimentosExistentes.ToDictionary(m => m.NCodTitulo);

    foreach (var movimento in movimentosValidos)
    {
      if (movimentosExistentesDict.TryGetValue(movimento.NCodTitulo, out var existente))
      {
        existente.CNumTitulo = movimento.CNumTitulo;
        existente.DDtEmissao = movimento.DDtEmissao;
        existente.DDtVenc = movimento.DDtVenc;
        existente.DDtPrevisao = movimento.DDtPrevisao;
        existente.DDtPagamento = movimento.DDtPagamento;
        existente.NCodCliente = movimento.NCodCliente;
        existente.CCPFCNPJCliente = movimento.CCPFCNPJCliente;
        existente.CStatus = movimento.CStatus;
        existente.CNatureza = movimento.CNatureza;
        existente.CTipo = movimento.CTipo;
        existente.COperacao = movimento.COperacao;
        existente.CCodCateg = movimento.CCodCateg;
        existente.NValorTitulo = movimento.NValorTitulo;
        existente.NValorPIS = movimento.NValorPIS;
        existente.NValorCOFINS = movimento.NValorCOFINS;
        existente.NValorCSLL = movimento.NValorCSLL;
        existente.NValorIR = movimento.NValorIR;
        existente.NValorISS = movimento.NValorISS;
        existente.NValorINSS = movimento.NValorINSS;
        existente.UpdatedAt = DateTime.UtcNow;
      }
      else
      {
        _context.MovimentosFinanceiros.Add(movimento);
      }
    }

    try
    {
      await _context.SaveChangesAsync(cancellationToken);
      _logger.LogInformation("Processados {Count} movimentos válidos", movimentosValidos.Count);
    }
    catch (DbUpdateException ex) when (ex.InnerException?.Message?.Contains("UNIQUE constraint failed") == true)
    {
      _logger.LogError(ex, "Erro de violação de restrição única detectado. Tentando processar individualmente.");

      await ProcessarMovimentosIndividualmente(movimentosValidos, cancellationToken);
    }
  }

  private async Task ProcessarMovimentosIndividualmente(List<MovimentoFinanceiro> movimentos, CancellationToken cancellationToken)
  {
    foreach (var movimento in movimentos)
    {
      try
      {
        var existente = await _context.MovimentosFinanceiros
            .FirstOrDefaultAsync(m => m.NCodTitulo == movimento.NCodTitulo, cancellationToken);

        if (existente != null)
        {
          existente.CNumTitulo = movimento.CNumTitulo;
          existente.DDtEmissao = movimento.DDtEmissao;
          existente.DDtVenc = movimento.DDtVenc;
          existente.DDtPrevisao = movimento.DDtPrevisao;
          existente.DDtPagamento = movimento.DDtPagamento;
          existente.NCodCliente = movimento.NCodCliente;
          existente.CCPFCNPJCliente = movimento.CCPFCNPJCliente;
          existente.CStatus = movimento.CStatus;
          existente.CNatureza = movimento.CNatureza;
          existente.CTipo = movimento.CTipo;
          existente.COperacao = movimento.COperacao;
          existente.CCodCateg = movimento.CCodCateg;
          existente.NValorTitulo = movimento.NValorTitulo;
          existente.NValorPIS = movimento.NValorPIS;
          existente.NValorCOFINS = movimento.NValorCOFINS;
          existente.NValorCSLL = movimento.NValorCSLL;
          existente.NValorIR = movimento.NValorIR;
          existente.NValorISS = movimento.NValorISS;
          existente.NValorINSS = movimento.NValorINSS;
          existente.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
          _context.MovimentosFinanceiros.Add(movimento);
        }

        await _context.SaveChangesAsync(cancellationToken);
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Erro ao processar movimento NCodTitulo: {NCodTitulo}", movimento.NCodTitulo);
      }
    }
  }
  private async Task ProcessarCategorias(List<Categoria> categorias, CancellationToken cancellationToken)
  {
    foreach (var categoria in categorias)
    {
      var existente = await _context.Categorias
          .FirstOrDefaultAsync(c => c.Codigo == categoria.Codigo, cancellationToken);

      if (existente == null)
      {
        _context.Categorias.Add(categoria);
      }
      else
      {
        existente.Descricao = categoria.Descricao;
        existente.DescricaoPadrao = categoria.DescricaoPadrao;
        existente.TipoCategoria = categoria.TipoCategoria;
        existente.ContaInativa = categoria.ContaInativa;
        existente.Natureza = categoria.Natureza;
        existente.Totalizadora = categoria.Totalizadora;
        existente.UpdatedAt = DateTime.UtcNow;
      }
    }

    await _context.SaveChangesAsync(cancellationToken);
  }

  public async Task<ETLResponse> ExecutarFullLoadETLAsync(string correlationId, FullLoadETLRequest request, CancellationToken cancellationToken = default)
  {
    var startTime = DateTime.UtcNow;
    var stopwatch = System.Diagnostics.Stopwatch.StartNew();

    _logger.LogInformation("Iniciando Full Load ETL. CorrelationId: {CorrelationId}", correlationId);

    try
    {

      var dataInicio = DateTime.Now.AddMonths(-24);
      var dataFim = DateTime.Now.AddMonths(2);

      _logger.LogInformation("Full Load ETL - Período: {DataInicio} até {DataFim}. CorrelationId: {CorrelationId}",
          dataInicio.ToString("yyyy-MM-dd"), dataFim.ToString("yyyy-MM-dd"), correlationId);

      int totalProcessados = 0;
      int totalInseridos = 0;
      int totalAtualizados = 0;
      int pagina = 1;
      bool hasMoreData = true;

      if (request.ForceReload)
      {
        _logger.LogInformation("Force reload ativado - removendo dados existentes. CorrelationId: {CorrelationId}", correlationId);
        var movimentosExistentes = await _context.MovimentosFinanceiros.CountAsync(cancellationToken);
        _context.MovimentosFinanceiros.RemoveRange(_context.MovimentosFinanceiros);
        await _context.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Removidos {Count} movimentos existentes. CorrelationId: {CorrelationId}", movimentosExistentes, correlationId);
      }

      while (hasMoreData && !cancellationToken.IsCancellationRequested)
      {
        try
        {
          var response = await _omieApiService.ListarMovimentosAsync(pagina, request.BatchSize, cancellationToken);

          if (response?.MovimentosFinanceiros == null || response.MovimentosFinanceiros.Length == 0)
          {
            hasMoreData = false;
            break;
          }

          var (inseridos, atualizados) = await ProcessarMovimentosComTransformacao(response.MovimentosFinanceiros, correlationId, cancellationToken);

          totalProcessados += response.MovimentosFinanceiros.Length;
          totalInseridos += inseridos;
          totalAtualizados += atualizados;

          _logger.LogInformation("Página {Pagina} processada: {Processados} registros, {Inseridos} inseridos, {Atualizados} atualizados. CorrelationId: {CorrelationId}",
              pagina, response.MovimentosFinanceiros.Length, inseridos, atualizados, correlationId);

          hasMoreData = pagina < response.TotalDePaginas;
          pagina++;

          await Task.Delay(100, cancellationToken);
        }
        catch (Exception ex)
        {
          _logger.LogError(ex, "Erro ao processar página {Pagina} do Full Load ETL. CorrelationId: {CorrelationId}", pagina, correlationId);
          throw;
        }
      }

      stopwatch.Stop();
      var endTime = DateTime.UtcNow;

      _logger.LogInformation("Full Load ETL concluído. Total: {Total} processados, {Inseridos} inseridos, {Atualizados} atualizados em {Tempo}ms. CorrelationId: {CorrelationId}",
          totalProcessados, totalInseridos, totalAtualizados, stopwatch.ElapsedMilliseconds, correlationId);

      return new ETLResponse
      {
        Sucesso = true,
        Mensagem = $"Full Load ETL executado com sucesso. Período: {dataInicio:yyyy-MM-dd} até {dataFim:yyyy-MM-dd}",
        RegistrosProcessados = totalProcessados,
        RegistrosInseridos = totalInseridos,
        RegistrosAtualizados = totalAtualizados,
        TempoExecucaoMs = stopwatch.ElapsedMilliseconds,
        DataInicio = startTime,
        DataFim = endTime
      };
    }
    catch (Exception ex)
    {
      stopwatch.Stop();
      _logger.LogError(ex, "Erro durante Full Load ETL. CorrelationId: {CorrelationId}", correlationId);

      return new ETLResponse
      {
        Sucesso = false,
        Mensagem = $"Erro durante Full Load ETL: {ex.Message}",
        TempoExecucaoMs = stopwatch.ElapsedMilliseconds,
        DataInicio = startTime,
        DataFim = DateTime.UtcNow
      };
    }
  }

  public async Task<ETLResponse> ExecutarIncrementalETLAsync(string correlationId, IncrementalETLRequest request, CancellationToken cancellationToken = default)
  {
    var startTime = DateTime.UtcNow;
    var stopwatch = System.Diagnostics.Stopwatch.StartNew();

    _logger.LogInformation("Iniciando Incremental ETL para entidade: {Entidade}. CorrelationId: {CorrelationId}", request.Entidade, correlationId);

    try
    {
      var dataCheckpoint = request.DataCheckpoint;
      if (!dataCheckpoint.HasValue)
      {
        var ultimoMovimento = await _context.MovimentosFinanceiros
            .OrderByDescending(m => m.DDtEmissao)
            .FirstOrDefaultAsync(cancellationToken);

        dataCheckpoint = ultimoMovimento?.DDtEmissao ?? DateTime.Now.AddDays(-7);
      }

      _logger.LogInformation("Incremental ETL - Checkpoint: {Checkpoint}. CorrelationId: {CorrelationId}",
          dataCheckpoint.Value.ToString("yyyy-MM-dd HH:mm:ss"), correlationId);

      int totalProcessados = 0;
      int totalInseridos = 0;
      int totalAtualizados = 0;
      int pagina = 1;
      bool hasMoreData = true;
      DateTime? novoCheckpoint = dataCheckpoint;

      while (hasMoreData && !cancellationToken.IsCancellationRequested)
      {
        try
        {
          var response = await _omieApiService.ListarMovimentosAsync(pagina, request.BatchSize, cancellationToken);

          if (response?.MovimentosFinanceiros == null || response.MovimentosFinanceiros.Length == 0)
          {
            hasMoreData = false;
            break;
          }

          var movimentosNovos = response.MovimentosFinanceiros
              .Where(m => NormalizarData(m.Detalhes?.DDtRegistro) > dataCheckpoint)
              .ToArray();

          if (movimentosNovos.Length > 0)
          {
            var (inseridos, atualizados) = await ProcessarMovimentosComTransformacao(movimentosNovos, correlationId, cancellationToken);

            totalProcessados += movimentosNovos.Length;
            totalInseridos += inseridos;
            totalAtualizados += atualizados;

            var datasMaisRecentes = movimentosNovos
                .Select(m => NormalizarData(m.Detalhes?.DDtRegistro))
                .Where(d => d.HasValue)
                .Select(d => d!.Value);

            if (datasMaisRecentes.Any())
            {
              var maxData = datasMaisRecentes.Max();
              if (!novoCheckpoint.HasValue || maxData > novoCheckpoint.Value)
              {
                novoCheckpoint = maxData;
              }
            }

            _logger.LogInformation("Página {Pagina} processada: {Novos}/{Total} registros novos, {Inseridos} inseridos, {Atualizados} atualizados. CorrelationId: {CorrelationId}",
                pagina, movimentosNovos.Length, response.MovimentosFinanceiros.Length, inseridos, atualizados, correlationId);
          }
          else
          {
            _logger.LogInformation("Página {Pagina}: nenhum registro novo encontrado. CorrelationId: {CorrelationId}", pagina, correlationId);
          }

          hasMoreData = pagina < response.TotalDePaginas;
          pagina++;

          await Task.Delay(100, cancellationToken);
        }
        catch (Exception ex)
        {
          _logger.LogError(ex, "Erro ao processar página {Pagina} do Incremental ETL. CorrelationId: {CorrelationId}", pagina, correlationId);
          throw;
        }
      }

      stopwatch.Stop();
      var endTime = DateTime.UtcNow;

      _logger.LogInformation("Incremental ETL concluído. Total: {Total} processados, {Inseridos} inseridos, {Atualizados} atualizados em {Tempo}ms. Novo checkpoint: {NovoCheckpoint}. CorrelationId: {CorrelationId}",
          totalProcessados, totalInseridos, totalAtualizados, stopwatch.ElapsedMilliseconds, novoCheckpoint?.ToString("yyyy-MM-dd HH:mm:ss"), correlationId);

      return new ETLResponse
      {
        Sucesso = true,
        Mensagem = $"Incremental ETL executado com sucesso para {request.Entidade}",
        RegistrosProcessados = totalProcessados,
        RegistrosInseridos = totalInseridos,
        RegistrosAtualizados = totalAtualizados,
        TempoExecucaoMs = stopwatch.ElapsedMilliseconds,
        DataInicio = startTime,
        DataFim = endTime,
        UltimoCheckpoint = novoCheckpoint
      };
    }
    catch (Exception ex)
    {
      stopwatch.Stop();
      _logger.LogError(ex, "Erro durante Incremental ETL. CorrelationId: {CorrelationId}", correlationId);

      return new ETLResponse
      {
        Sucesso = false,
        Mensagem = $"Erro durante Incremental ETL: {ex.Message}",
        TempoExecucaoMs = stopwatch.ElapsedMilliseconds,
        DataInicio = startTime,
        DataFim = DateTime.UtcNow
      };
    }
  }

  public async Task<ETLResponse> ExecutarTransformacaoETLAsync(string correlationId, CancellationToken cancellationToken = default)
  {
    var startTime = DateTime.UtcNow;
    var stopwatch = System.Diagnostics.Stopwatch.StartNew();

    _logger.LogInformation("Iniciando Transformação ETL. CorrelationId: {CorrelationId}", correlationId);

    try
    {
      var movimentos = await _context.MovimentosFinanceiros.ToListAsync(cancellationToken);
      int totalProcessados = 0;
      int totalAtualizados = 0;

      foreach (var movimento in movimentos)
      {
        bool foiAtualizado = false;

        if (!string.IsNullOrEmpty(movimento.CNatureza))
        {
          var naturezaNormalizada = NormalizarNatureza(movimento.CNatureza);
          if (naturezaNormalizada != movimento.CNatureza)
          {
            movimento.CNatureza = naturezaNormalizada;
            foiAtualizado = true;
          }
        }

        if (movimento.NValorTitulo < 0 && movimento.CNatureza == "R")
        {
          movimento.NValorTitulo = Math.Abs(movimento.NValorTitulo);
          foiAtualizado = true;
        }

        if (movimento.DDtVenc.HasValue && movimento.DDtVenc.Value.Year > DateTime.Now.Year + 10)
        {
          movimento.DDtVenc = null;
          foiAtualizado = true;
        }

        if (foiAtualizado)
        {
          totalAtualizados++;
        }

        totalProcessados++;
      }

      if (totalAtualizados > 0)
      {
        await _context.SaveChangesAsync(cancellationToken);
      }

      stopwatch.Stop();
      var endTime = DateTime.UtcNow;

      _logger.LogInformation("Transformação ETL concluída. Total: {Total} processados, {Atualizados} atualizados em {Tempo}ms. CorrelationId: {CorrelationId}",
          totalProcessados, totalAtualizados, stopwatch.ElapsedMilliseconds, correlationId);

      return new ETLResponse
      {
        Sucesso = true,
        Mensagem = "Transformação ETL executada com sucesso",
        RegistrosProcessados = totalProcessados,
        RegistrosAtualizados = totalAtualizados,
        TempoExecucaoMs = stopwatch.ElapsedMilliseconds,
        DataInicio = startTime,
        DataFim = endTime
      };
    }
    catch (Exception ex)
    {
      stopwatch.Stop();
      _logger.LogError(ex, "Erro durante Transformação ETL. CorrelationId: {CorrelationId}", correlationId);

      return new ETLResponse
      {
        Sucesso = false,
        Mensagem = $"Erro durante Transformação ETL: {ex.Message}",
        TempoExecucaoMs = stopwatch.ElapsedMilliseconds,
        DataInicio = startTime,
        DataFim = DateTime.UtcNow
      };
    }
  }

  private async Task<(int inseridos, int atualizados)> ProcessarMovimentosComTransformacao(
      MovimentoFinanceiroDto[] movimentos, string correlationId, CancellationToken cancellationToken)
  {
    var inseridos = 0;
    var atualizados = 0;

    foreach (var movimentoDto in movimentos)
    {
      if (movimentoDto?.Detalhes == null) continue;

      var detalhes = movimentoDto.Detalhes;

      if (!long.TryParse(detalhes.NCodTitulo, out var nCodTituloValue) || nCodTituloValue <= 0)
      {
        _logger.LogWarning("Registro ignorado: NCodTitulo inválido '{NCodTitulo}'. CorrelationId: {CorrelationId}",
                          detalhes.NCodTitulo, correlationId);
        continue;
      }

      var movimentoExistente = await _context.MovimentosFinanceiros
          .FirstOrDefaultAsync(m => m.NCodTitulo == nCodTituloValue, cancellationToken);

      var movimento = movimentoExistente ?? new MovimentoFinanceiro();

      movimento.NCodTitulo = nCodTituloValue;
      movimento.CCodIntTitulo = detalhes.CCodIntTitulo;
      movimento.NCodCliente = detalhes.NCodCliente == 0 ? null : (int?)detalhes.NCodCliente;
      movimento.CCPFCNPJCliente = detalhes.CCPFCNPJCliente;
      movimento.CStatus = detalhes.CStatus;
      movimento.CNatureza = NormalizarNatureza(detalhes.CNatureza);
      movimento.CTipo = detalhes.CTipo;
      movimento.DDtEmissao = NormalizarData(detalhes.DDtEmissao);
      movimento.DDtVenc = NormalizarData(detalhes.DDtVenc);
      movimento.DDtPagamento = NormalizarData(detalhes.DDtPagamento);
      movimento.DDtPrevisao = NormalizarData(detalhes.DDtPrevisao);
      movimento.NValorTitulo = NormalizarValor(detalhes.NValorTitulo, movimento.CNatureza);
      movimento.CNumParcela = detalhes.CNumParcela;
      movimento.CCodCateg = detalhes.CCodCateg;
      movimento.NCodCC = detalhes.NCodCC == 0 ? null : (int?)detalhes.NCodCC;

      if (movimentoExistente == null)
      {
        _context.MovimentosFinanceiros.Add(movimento);
        inseridos++;
      }
      else
      {
        atualizados++;
      }
    }

    await _context.SaveChangesAsync(cancellationToken);
    return (inseridos, atualizados);
  }

  private static string ProcessarNatureza(string? natureza)
  {
    if (string.IsNullOrEmpty(natureza)) return "P";

    return natureza.ToUpperInvariant() switch
    {
      "R" or "RECEBER" or "RECEITA" => "R",
      "P" or "PAGAR" or "DESPESA" => "P",
      _ => natureza.ToUpperInvariant()
    };
  }

  private static decimal NormalizarValor(decimal valor, string? natureza)
  {
    if (natureza == "R" && valor < 0)
    {
      return Math.Abs(valor);
    }

    return valor;
  }
}

public class ETLSettings
{
  public int PageSizeMovimentos { get; set; } = 500;
  public int PageSizeCategorias { get; set; } = 50;
  public int MaxParallelism { get; set; } = 3;
  public RetryPolicySettings RetryPolicy { get; set; } = new();
  public double MockError429Probability { get; set; } = 0.1;
}

public class RetryPolicySettings
{
  public int MaxRetries { get; set; } = 3;
  public int DelayBetweenRetriesMs { get; set; } = 1000;
  public int BackoffMultiplier { get; set; } = 2;
}