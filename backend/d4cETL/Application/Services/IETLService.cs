using d4cETL.Application.DTOs;

namespace d4cETL.Application.Services;

public interface IETLService
{
  Task ExecutarETLMovimentosAsync(string correlationId, CancellationToken cancellationToken = default);
  Task ExecutarETLCategoriasAsync(string correlationId, CancellationToken cancellationToken = default);

  Task<MovimentosFinanceirosResponse> ConsultarMovimentosAsync(string correlationId, ExecutarMovimentosRequest request, CancellationToken cancellationToken = default);
  Task<CategoriasResponse> ConsultarCategoriasAsync(string correlationId, ExecutarCategoriasRequest request, CancellationToken cancellationToken = default);

  Task<ETLResponse> ExecutarFullLoadETLAsync(string correlationId, FullLoadETLRequest request, CancellationToken cancellationToken = default);
  Task<ETLResponse> ExecutarIncrementalETLAsync(string correlationId, IncrementalETLRequest request, CancellationToken cancellationToken = default);
  Task<ETLResponse> ExecutarTransformacaoETLAsync(string correlationId, CancellationToken cancellationToken = default);
}