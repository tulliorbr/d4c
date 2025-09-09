/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Calendar,
  Timer,
  Hash,
  Search,
} from "lucide-react";
import { LoadingSpinner } from "../../../components/Common";
import { formatDate, formatDuration } from "../../../utils/formatters";

interface BatchListProps {
  batches: any[];
  selectedBatch: string | null;
  onBatchSelect: (batchId: string) => void;
  isLoading: boolean;
}

export const BatchList: React.FC<BatchListProps> = ({
  batches,
  selectedBatch,
  onBatchSelect,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"dataInicio" | "dataFim" | "duracao">(
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
      case "executando":
      case "processando":
        return <Play className="w-4 h-4 text-blue-600" />;
      case "pausado":
        return <Pause className="w-4 h-4 text-yellow-600" />;
      case "cancelado":
        return <XCircle className="w-4 h-4 text-muted-foreground" />;
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
      case "executando":
      case "processando":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pausado":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelado":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-orange-100 text-orange-800 border-orange-200";
    }
  };

  const filteredAndSortedBatches = React.useMemo(() => {
    if (!batches || !Array.isArray(batches)) {
      return [];
    }

    const filtered = batches.filter((batch) => {
      if (!batch) return false;

      const matchesSearch =
        (batch.id?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (batch.entidade?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        );
      const matchesStatus =
        statusFilter === "all" ||
        (batch.status?.toLowerCase() || "") === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "dataInicio":
          aValue = a.dataInicio ? new Date(a.dataInicio).getTime() : 0;
          bValue = b.dataInicio ? new Date(b.dataInicio).getTime() : 0;
          break;
        case "dataFim":
          aValue = a.dataFim ? new Date(a.dataFim).getTime() : 0;
          bValue = b.dataFim ? new Date(b.dataFim).getTime() : 0;
          break;
        case "duracao":
          aValue = a.duracao || 0;
          bValue = b.duracao || 0;
          break;
        default:
          return 0;
      }

      const comparison = aValue - bValue;
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [batches, searchTerm, statusFilter, sortBy, sortOrder]);

  const statusOptions = [
    { value: "all", label: "Todos" },
    { value: "executando", label: "Executando" },
    { value: "concluido", label: "Concluído" },
    { value: "erro", label: "Erro" },
    { value: "pausado", label: "Pausado" },
    { value: "cancelado", label: "Cancelado" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Lotes de Processamento
        </h3>
        <LoadingSpinner size="md" text="Carregando lotes..." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Lotes de Processamento
        </h3>
        <span className="text-sm text-muted-foreground">
          {filteredAndSortedBatches.length}{" "}
          {filteredAndSortedBatches.length === 1 ? "lote" : "lotes"}
        </span>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por ID ou entidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
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
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
            >
              <option value="dataInicio-desc">Mais recentes</option>
              <option value="dataInicio-asc">Mais antigos</option>
              <option value="duracao-desc">Maior duração</option>
              <option value="duracao-asc">Menor duração</option>
            </select>
          </div>
        </div>
      </div>

      {/* Batch List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredAndSortedBatches.map((batch, index) => (
          <motion.div
            key={batch.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onBatchSelect(batch.id)}
            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
              selectedBatch === batch.id
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-border bg-card hover:border-muted"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-sm font-medium text-foreground">
                  {batch.id}
                </span>
              </div>

              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  batch.status
                )}`}
              >
                {getStatusIcon(batch.status)}
                {batch.status}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Entidade:</span>
                <span>{batch.entidade}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Início:</span>
                <span>{formatDate(batch.dataInicio)}</span>
              </div>

              {batch.dataFim && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Fim:</span>
                  <span>{formatDate(batch.dataFim)}</span>
                </div>
              )}

              {batch.duracao && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Timer className="w-4 h-4" />
                  <span>Duração:</span>
                  <span>{formatDuration(batch.duracao)}</span>
                </div>
              )}

              {batch.tentativas > 1 && (
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <RotateCcw className="w-4 h-4" />
                  <span>Tentativas:</span>
                  <span>{batch.tentativas}</span>
                </div>
              )}

              {batch.mensagemErro && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  <strong>Erro:</strong> {batch.mensagemErro}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedBatches.length === 0 && (
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Nenhum lote encontrado
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== "all"
              ? "Tente ajustar os filtros para encontrar os lotes desejados."
              : "Não há lotes de processamento disponíveis no momento."}
          </p>
        </div>
      )}
    </div>
  );
};
