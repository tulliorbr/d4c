import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Circle,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "./Common/Card";
import { LoadingSpinner } from "./Common/LoadingSpinner";
import { ErrorDisplay } from "./Common/ErrorDisplay";
import { batchService } from "../services/batchService";
import {
  Batch,
  BatchItem,
  BatchItemFilters,
  BatchItemsResponse,
} from "../types";

interface BatchItemsViewProps {
  batch: Batch;
  onBack: () => void;
}

const ItemStatusIcon: React.FC<{ status: string }> = ({ status }) => {
  const iconProps = { className: "h-4 w-4" };

  switch (status.toLowerCase()) {
    case "sucesso":
      return <CheckCircle {...iconProps} className="h-4 w-4 text-green-600" />;
    case "erro":
    case "falha":
      return <XCircle {...iconProps} className="h-4 w-4 text-red-600" />;
    case "processando":
    case "em_andamento":
      return <Clock {...iconProps} className="h-4 w-4 text-blue-600" />;
    case "aviso":
    case "warning":
      return (
        <AlertTriangle {...iconProps} className="h-4 w-4 text-yellow-600" />
      );
    default:
      return <Circle {...iconProps} className="h-4 w-4 text-gray-600" />;
  }
};

const ItemStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "sucesso":
        return {
          label: "Sucesso",
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
      case "aviso":
      case "warning":
        return {
          label: "Aviso",
          className:
            "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400",
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
      <ItemStatusIcon status={status} />
      {config.label}
    </span>
  );
};

export const BatchItemsView: React.FC<BatchItemsViewProps> = ({
  batch,
  onBack,
}) => {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 20,
  });
  const [filters, setFilters] = useState<BatchItemFilters>({
    page: 1,
    pageSize: 20,
  });
  const [showFilters, setShowFilters] = useState(false);

  const loadBatchItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const response: BatchItemsResponse = await batchService.getBatchItems(
        batch.id,
        filters
      );

      setItems(response.items || []);
      setPagination({
        currentPage: response.page,
        totalPages: response.totalPages,
        totalItems: response.totalItems,
        pageSize: response.pageSize,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar itens do lote"
      );
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatchItems();
  }, [batch.id, filters]);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleFilterChange = (
    key: keyof BatchItemFilters,
    value: string | number
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleRefresh = () => {
    loadBatchItems();
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
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>

            <div className="flex-1">
              <h2 className="text-xl font-semibold">
                Itens do Lote #{batch.id}
              </h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>Batch ID: {batch.batchId.substring(0, 16)}...</span>
                <span>Entidade: {batch.entidade}</span>
                <span>Tipo: {batch.tipoExecucao}</span>
              </div>
            </div>

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
              className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t"
            >
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Status
                </label>
                <select
                  value={filters.status || ""}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Todos os status</option>
                  <option value="Sucesso">Sucesso</option>
                  <option value="Erro">Erro</option>
                  <option value="Processando">Processando</option>
                  <option value="Aviso">Aviso</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Itens por página
                </label>
                <select
                  value={filters.pageSize || 20}
                  onChange={(e) =>
                    handleFilterChange("pageSize", parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
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
                    Item ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Tipo / Posição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Período
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Operação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          #{item.id}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono break-all">
                          {item.itemId.length > 30
                            ? `${item.itemId.substring(0, 30)}...`
                            : item.itemId}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {item.tipoItem}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Página {item.pagina}, Posição {item.posicaoNaPagina}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-1">
                        <div>
                          Início: {batchService.formatDate(item.dataInicio)}
                        </div>
                        <div>Fim: {batchService.formatDate(item.dataFim)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <ItemStatusBadge status={item.status} />
                      {item.mensagemErro && (
                        <div
                          className="text-xs text-red-600 mt-1 max-w-xs truncate"
                          title={item.mensagemErro}
                        >
                          {item.mensagemErro}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {item.operacao}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Tentativas: {item.numeroTentativas}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-1">
                        <div className="font-medium">
                          {item.duracaoMs.toFixed(2)}ms
                        </div>
                        {item.duracaoMs > 1000 && (
                          <div className="text-yellow-600">Lento</div>
                        )}
                        {item.duracaoMs > 5000 && (
                          <div className="text-red-600">Muito lento</div>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {items.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum item encontrado
              </h3>
              <p className="text-muted-foreground">
                Este lote não possui itens ou tente ajustar os filtros.
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
              de {pagination.totalItems} itens
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

export default BatchItemsView;
