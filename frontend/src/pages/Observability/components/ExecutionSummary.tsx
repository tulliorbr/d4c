/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Database,
  Zap,
  Timer,
  Calendar,
  BarChart3,
} from "lucide-react";
import { LoadingSpinner } from "../../../components/Common";
import {
  formatDate,
  formatDuration,
  formatNumber,
} from "../../../utils/formatters";

interface ExecutionSummaryProps {
  summaries: any[];
  isLoading: boolean;
}

export const ExecutionSummary: React.FC<ExecutionSummaryProps> = ({
  summaries,
  isLoading,
}) => {
  const getEntityIcon = (entity: string) => {
    switch (entity.toLowerCase()) {
      case "contas_receber":
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case "contas_pagar":
        return <TrendingUp className="w-5 h-5 text-red-600" />;
      case "categorias":
        return <BarChart3 className="w-5 h-5 text-blue-600" />;
      default:
        return <Database className="w-5 h-5 text-gray-600" />;
    }
  };

  const getEntityColor = (entity: string) => {
    switch (entity.toLowerCase()) {
      case "contas_receber":
        return "bg-green-50 border-green-200";
      case "contas_pagar":
        return "bg-red-50 border-red-200";
      case "categorias":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const calculateThroughput = (
    registrosProcessados: number,
    duracao: number
  ) => {
    if (duracao === 0) return 0;
    return registrosProcessados / (duracao / 1000); // registros por segundo
  };

  const getSuccessRate = (processados: number, comErro: number) => {
    const total = processados + comErro;
    if (total === 0) return 0;
    return (processados / total) * 100;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Resumo das Execuções
        </h3>
        <LoadingSpinner size="md" text="Carregando resumo..." />
      </div>
    );
  }

  if (!summaries || summaries.length === 0) {
    return (
      <div className="text-center py-8">
        <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          Nenhuma execução encontrada
        </h3>
        <p className="text-muted-foreground">
          Execute um processo ETL para ver o resumo das execuções aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Resumo das Execuções
        </h3>
        <div className="text-sm text-muted-foreground">
          {summaries.length} entidade{summaries.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="grid gap-4">
        {summaries.map((summary, index) => {
          const throughput = calculateThroughput(
            summary.registrosProcessados,
            summary.duracaoMedia
          );
          const successRate = getSuccessRate(
            summary.registrosProcessados,
            summary.registrosComErro
          );

          return (
            <motion.div
              key={summary.entidade}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border border-border rounded-lg p-6 ${getEntityColor(
                summary.entidade
              )}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getEntityIcon(summary.entidade)}
                  <div>
                    <h4 className="text-lg font-semibold text-foreground capitalize">
                      {summary.entidade.replace("_", " ")}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Última execução: {formatDate(summary.ultimaExecucao)}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    successRate >= 95
                      ? "bg-green-100 text-green-800"
                      : successRate >= 80
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {successRate.toFixed(1)}% sucesso
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card/60 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Database className="w-4 h-4" />
                    Registros Lidos
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    {formatNumber(summary.registrosLidos)}
                  </div>
                </div>

                <div className="bg-card/60 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <CheckCircle className="w-4 h-4" />
                    Processados
                  </div>
                  <div className="text-xl font-bold text-green-700">
                    {formatNumber(summary.registrosProcessados)}
                  </div>
                </div>

                <div className="bg-card/60 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <XCircle className="w-4 h-4" />
                    Com Erro
                  </div>
                  <div className="text-xl font-bold text-red-700">
                    {formatNumber(summary.registrosComErro)}
                  </div>
                </div>

                <div className="bg-card/60 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Zap className="w-4 h-4" />
                    Throughput
                  </div>
                  <div className="text-xl font-bold text-blue-700">
                    {throughput.toFixed(1)}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      reg/s
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card/60 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Timer className="w-4 h-4" />
                    Latência Média
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {formatDuration(summary.latenciaMedia)}
                  </div>
                </div>

                <div className="bg-card/60 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Clock className="w-4 h-4" />
                    Duração Média
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {formatDuration(summary.duracaoMedia)}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Taxa de Sucesso</span>
                  <span>{successRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${successRate}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-2 rounded-full ${
                      successRate >= 95
                        ? "bg-green-500"
                        : successRate >= 80
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  />
                </div>
              </div>

              {/* Performance Indicators */}
              <div className="mt-4 flex flex-wrap gap-2">
                {throughput > 100 && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    <Zap className="w-3 h-3" />
                    Alto throughput
                  </div>
                )}

                {summary.latenciaMedia < 1000 && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    <Timer className="w-3 h-3" />
                    Baixa latência
                  </div>
                )}

                {successRate >= 99 && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    Excelente qualidade
                  </div>
                )}

                {summary.registrosComErro > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                    <XCircle className="w-3 h-3" />
                    Requer atenção
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
