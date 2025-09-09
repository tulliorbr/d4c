using d4cETL.Application.DTOs;

namespace d4cETL.Application.Services;

public interface IRelatoriosService
{
  Task<KPIsResponse> ObterKPIsAsync(RelatorioRequest request, CancellationToken cancellationToken = default);
  Task<GraficoLinhaResponse> ObterGraficoLinhaAsync(RelatorioRequest request, CancellationToken cancellationToken = default);
  Task<GraficoBarrasResponse> ObterGraficoBarrasAsync(RelatorioRequest request, CancellationToken cancellationToken = default);
  Task<GraficoPizzaResponse> ObterGraficoPizzaAsync(RelatorioRequest request, CancellationToken cancellationToken = default);
  Task<TabelaMovimentosResponse> ObterTabelaMovimentosAsync(TabelaMovimentosRequest request, CancellationToken cancellationToken = default);
}