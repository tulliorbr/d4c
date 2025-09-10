/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  Search,
  Hash,
  Calendar,
  Timer,
  FileText,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { LoadingSpinner } from "../../../components/Common";
import { formatDate, formatDuration } from "../../../utils/formatters";

interface BatchDetailsProps {
  batchId: string;
  batchItems: any[];
  isLoading: boolean;
}

export const BatchDetails: React.FC<BatchDetailsProps> = ({
  batchId,
  batchItems,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"dataInicio" | "dataFim" | "tentativas">(
    "dataInicio"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "concluido":
      case "sucesso":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "erro":
      case "falha":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "processando":
      case "executando":
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "concluido":
      case "sucesso":
        return "bg-green-100 text-green-800 border-green-200";
      case "erro":
      case "falha":
        return "bg-red-100 text-red-800 border-red-200";
      case "processando":
      case "executando":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-orange-100 text-orange-800 border-orange-200";
    }
  };

  const toggleItemExpansion = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const filteredAndSortedItems = React.useMemo(() => {
    const filtered = batchItems.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.dados &&
          JSON.stringify(item.dados)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));
      const matchesStatus =
        statusFilter === "all" ||
        item.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "dataInicio":
          aValue = new Date(a.dataInicio).getTime();
          bValue = new Date(b.dataInicio).getTime();
          break;
        case "dataFim":
          aValue = a.dataFim ? new Date(a.dataFim).getTime() : 0;
          bValue = b.dataFim ? new Date(b.dataFim).getTime() : 0;
          break;
        case "tentativas":
          aValue = a.tentativas || 0;
          bValue = b.tentativas || 0;
          break;
        default:
          return 0;
      }

      const comparison = aValue - bValue;
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [batchItems, searchTerm, statusFilter, sortBy, sortOrder]);

  const getItemStats = () => {
    if (!batchItems || batchItems.length === 0) {
      return { total: 0, success: 0, error: 0, processing: 0 };
    }

    return batchItems.reduce(
      (acc, item) => {
        acc.total++;
        switch (item.status.toLowerCase()) {
          case "concluido":
          case "sucesso":
            acc.success++;
            break;
          case "erro":
          case "falha":
            acc.error++;
            break;
          case "processando":
          case "executando":
            acc.processing++;
            break;
        }
        return acc;
      },
      { total: 0, success: 0, error: 0, processing: 0 }
    );
  };

  const itemStats = getItemStats();

  const statusOptions = [
    { value: "all", label: "Todos" },
    { value: "processando", label: "Processando" },
    { value: "concluido", label: "Concluído" },
    { value: "erro", label: "Erro" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Itens do Lote</h3>
        <LoadingSpinner size="md" text="Carregando itens..." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Itens do Lote
          </h3>
          <p className="text-sm text-muted-foreground font-mono">{batchId}</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Exportar
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="text-xs text-muted-foreground">Total</div>
          <div className="text-lg font-semibold text-foreground">
            {itemStats.total}
          </div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-xs text-green-600">Sucesso</div>
          <div className="text-lg font-semibold text-green-700">
            {itemStats.success}
          </div>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <div className="text-xs text-red-600">Erro</div>
          <div className="text-lg font-semibold text-red-700">
            {itemStats.error}
          </div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-xs text-blue-600">Processando</div>
          <div className="text-lg font-semibold text-blue-700">
            {itemStats.processing}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <input
            type="text"
            placeholder="Buscar por ID ou dados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(field as any);
                setSortOrder(order as any);
              }}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
            >
              <option value="dataInicio-desc">Mais recentes</option>
              <option value="dataInicio-asc">Mais antigos</option>
              <option value="tentativas-desc">Mais tentativas</option>
              <option value="tentativas-asc">Menos tentativas</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredAndSortedItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="border border-border rounded-lg bg-card"
          >
            <div
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleItemExpansion(item.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {expandedItems.has(item.id) ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}

                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono text-sm font-medium text-foreground">
                      {item.id}
                    </span>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    item.status
                  )}`}
                >
                  {getStatusIcon(item.status)}
                  {item.status}
                </div>
              </div>

              <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(item.dataInicio)}</span>
                </div>

                {item.dataFim && (
                  <div className="flex items-center gap-1">
                    <Timer className="w-4 h-4" />
                    <span>
                      {formatDuration(
                        new Date(item.dataFim).getTime() -
                          new Date(item.dataInicio).getTime()
                      )}
                    </span>
                  </div>
                )}

                {item.tentativas > 1 && (
                  <div className="flex items-center gap-1 text-orange-600">
                    <span>Tentativas: {item.tentativas}</span>
                  </div>
                )}
              </div>
            </div>

            {expandedItems.has(item.id) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-border p-4 bg-muted/50"
              >
                <div className="space-y-3">
                  {item.dados && (
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                        <FileText className="w-4 h-4" />
                        Dados Processados
                      </div>
                      <div className="bg-background p-3 rounded border text-xs font-mono text-foreground max-h-32 overflow-y-auto">
                        <pre>{JSON.stringify(item.dados, null, 2)}</pre>
                      </div>
                    </div>
                  )}

                  {item.mensagemErro && (
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-destructive mb-2">
                        <XCircle className="w-4 h-4" />
                        Mensagem de Erro
                      </div>
                      <div className="bg-destructive/10 border border-destructive/20 p-3 rounded text-sm text-destructive">
                        {item.mensagemErro}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Início:</span>
                      <span className="ml-2 font-medium">
                        {formatDate(item.dataInicio)}
                      </span>
                    </div>

                    {item.dataFim && (
                      <div>
                        <span className="text-muted-foreground">Fim:</span>
                        <span className="ml-2 font-medium">
                          {formatDate(item.dataFim)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredAndSortedItems.length === 0 && (
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Nenhum item encontrado
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== "all"
              ? "Tente ajustar os filtros para encontrar os itens desejados."
              : "Este lote não possui itens ou ainda não foram carregados."}
          </p>
        </div>
      )}
    </div>
  );
};
