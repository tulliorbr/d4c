using d4cETL.Application.DTOs;

namespace d4cETL.Application.Services;

public interface IOmieApiService
{
  Task<MovimentosFinanceirosResponse> ListarMovimentosAsync(int pagina = 1, int registrosPorPagina = 500, CancellationToken cancellationToken = default);
  Task<CategoriasResponse> ListarCategoriasAsync(int pagina = 1, int registrosPorPagina = 50, CancellationToken cancellationToken = default);
}