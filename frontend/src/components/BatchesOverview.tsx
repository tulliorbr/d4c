import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  MinusCircle,
  Circle,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "./Common/Card";
import { LoadingSpinner } from "./Common/LoadingSpinner";
import { ErrorDisplay } from "./Common/ErrorDisplay";
import { batchService } from "../services/batchService";
import { Batch, BatchFilters, BatchesResponse } from "../types";

interface BatchesOverviewProps {
  onViewItems: (batch: Batch) => void;
}

const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
  const iconProps = { className: "h-4 w-4" };

  switch (status.toLowerCase()) {
    case "concluido":
      return <CheckCircle {...iconProps} className="h-4 w-4 text-green-600" />;
    case "erro":
    case "falha":
      return <XCircle {...iconProps} className="h-4 w-4 text-red-600" />;
    case "processando":
    case "em_andamento":
      return <Clock {...iconProps} className="h-4 w-4 text-blue-600" />;
    case "cancelado":
      return <MinusCircle {...iconProps} className="h-4 w-4 text-gray-600" />;
    default:
      return <Circle {...iconProps} className="h-4 w-4 text-gray-600" />;
  }
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "concluido":
        return {
          label: "Concluído",
          className:
            "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400",
        };
      case "erro":
      case "falha":
        return {
          label: "Erro",
          className:
            "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400",
        };
      case "processando":
      case "em_andamento":
        return {
          label: "Processando",
          className:
            "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400",
        };
      case "cancelado":
        return {
          label: "Cancelado",
          className:
            "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400",
        };
      default:
        return {
          label: status,
          className:
            "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      <StatusIcon status={status} />
      {config.label}
    </span>
  );
};

export const BatchesOverview: React.FC<BatchesOverviewProps> = ({
  onViewItems,
}) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<BatchFilters>({
    page: 1,
    pageSize: 10,
  });
  const [showFilters, setShowFilters] = useState(false);

  const loadBatches = async () => {
    try {
      setLoading(true);
      setError(null);

      const response: BatchesResponse = await batchService.getBatches(filters);

      setBatches(response.items || []);
      setPagination({
        currentPage: response.page,
        totalPages: response.totalPages,
        totalItems: response.totalItems,
        pageSize: response.pageSize,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar lotes");
      setBatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, [filters]);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleFilterChange = (
    key: keyof BatchFilters,
    value: string | number
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleRefresh = () => {
    loadBatches();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <ErrorDisplay error={error} onRetry={handleRefresh} />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Lotes de Execução</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filtros
              </button>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </button>
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>

                <select
                  value={filters.status || ""}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Todos os status</option>
                  <option value="Concluido">Concluído</option>
                  <option value="Erro">Erro</option>
                  <option value="Processando">Processando</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Entidade
                </label>
                <select
                  value={filters.entidade || ""}
                  onChange={(e) =>
                    handleFilterChange("entidade", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Todas as entidades</option>
                  <option value="Categorias">Categorias</option>
                  <option value="MovimentosFinanceiros">Movimentos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Itens por página
                </label>
                <select
                  value={filters.pageSize || 10}
                  onChange={(e) =>
                    handleFilterChange("pageSize", parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </motion.div>
          )}
        </CardHeader>
      </Card>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    ID / Batch ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Tipo / Entidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Período
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Registros
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Duração
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {batches.map((batch) => (
                  <motion.tr
                    key={batch.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          #{batch.id}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {batch.batchId.substring(0, 8)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {batch.tipoExecucao}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {batch.entidade}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-1">
                        <div>
                          Início: {batchService.formatDate(batch.dataInicio)}
                        </div>
                        <div>Fim: {batchService.formatDate(batch.dataFim)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={batch.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-1">
                        <div>
                          Processados: {batch.totalRegistrosProcessados}
                        </div>
                        <div>Inseridos: {batch.totalRegistrosInseridos}</div>
                        <div>
                          Atualizados: {batch.totalRegistrosAtualizados}
                        </div>
                        {batch.totalRegistrosComErro > 0 && (
                          <div className="text-red-600">
                            Erros: {batch.totalRegistrosComErro}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {batchService.formatDuration(batch.duracao)}
                      </div>
                      {batch.throughputRegistrosPorSegundo && (
                        <div className="text-xs text-muted-foreground">
                          {batch.throughputRegistrosPorSegundo.toFixed(2)} reg/s
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onViewItems(batch)}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                      >
                        <Eye className="h-3 w-3" />
                        Ver Itens
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {batches.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum lote encontrado
              </h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros ou verificar novamente mais tarde.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {pagination.totalPages > 1 && (
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {(pagination.currentPage - 1) * pagination.pageSize + 1}{" "}
              a{" "}
              {Math.min(
                pagination.currentPage * pagination.pageSize,
                pagination.totalItems
              )}{" "}
              de {pagination.totalItems} lotes
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </button>

              <span className="text-sm">
                Página {pagination.currentPage} de {pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="flex items-center gap-1 px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BatchesOverview;
