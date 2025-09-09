import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  Database,
  Zap,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Timer,
  Cpu,
} from "lucide-react";
import { SystemMetrics } from "../../../types";
import { LoadingSpinner } from "../../../components/Common";
import {
  formatNumber,
  formatDuration,
  formatBytes,
} from "../../../utils/formatters";

interface MetricsOverviewProps {
  metrics: SystemMetrics | null;
  isLoading: boolean;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  metrics,
  isLoading,
}) => {
  const getHealthStatus = (
    value: number,
    thresholds: { good: number; warning: number }
  ) => {
    if (value >= thresholds.good) return { color: "green", label: "Excelente" };
    if (value >= thresholds.warning)
      return { color: "yellow", label: "Atenção" };
    return { color: "red", label: "Crítico" };
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Métricas do Sistema
        </h3>
        <LoadingSpinner size="md" text="Carregando métricas..." />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-8">
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          Métricas indisponíveis
        </h3>
        <p className="text-muted-foreground">
          Não foi possível carregar as métricas do sistema no momento.
        </p>
      </div>
    );
  }

  const performanceHealth = getHealthStatus(
    metrics.performance.throughputMedio,
    { good: 80, warning: 50 }
  );
  const errorRateHealth = getHealthStatus(100 - metrics.qualidade.taxaErro, {
    good: 95,
    warning: 90,
  });
  const uptimeHealth = getHealthStatus(metrics.disponibilidade.uptime, {
    good: 99,
    warning: 95,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Métricas do Sistema
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          Atualizado há{" "}
          {Math.floor(
            (Date.now() - new Date(metrics.ultimaAtualizacao).getTime()) / 60000
          )}{" "}
          min
        </div>
      </div>

      {/* Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-4 rounded-lg border-2 ${
            performanceHealth.color === "green"
              ? "bg-green-50 border-green-200"
              : performanceHealth.color === "yellow"
              ? "bg-yellow-50 border-yellow-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap
                className={`w-5 h-5 ${
                  performanceHealth.color === "green"
                    ? "text-green-600"
                    : performanceHealth.color === "yellow"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              />
              <span className="font-medium text-foreground">Performance</span>
            </div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                performanceHealth.color === "green"
                  ? "bg-green-100 text-green-800"
                  : performanceHealth.color === "yellow"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {performanceHealth.label}
            </span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {metrics.performance.throughputMedio.toFixed(1)}
            <span className="text-sm font-normal text-muted-foreground ml-1">
              reg/s
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`p-4 rounded-lg border-2 ${
            errorRateHealth.color === "green"
              ? "bg-green-50 border-green-200"
              : errorRateHealth.color === "yellow"
              ? "bg-yellow-50 border-yellow-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle
                className={`w-5 h-5 ${
                  errorRateHealth.color === "green"
                    ? "text-green-600"
                    : errorRateHealth.color === "yellow"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              />
              <span className="font-medium text-foreground">Qualidade</span>
            </div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                errorRateHealth.color === "green"
                  ? "bg-green-100 text-green-800"
                  : errorRateHealth.color === "yellow"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {errorRateHealth.label}
            </span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {(100 - metrics.qualidade.taxaErro).toFixed(1)}
            <span className="text-sm font-normal text-muted-foreground ml-1">
              %
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`p-4 rounded-lg border-2 ${
            uptimeHealth.color === "green"
              ? "bg-green-50 border-green-200"
              : uptimeHealth.color === "yellow"
              ? "bg-yellow-50 border-yellow-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity
                className={`w-5 h-5 ${
                  uptimeHealth.color === "green"
                    ? "text-green-600"
                    : uptimeHealth.color === "yellow"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              />
              <span className="font-medium text-foreground">
                Disponibilidade
              </span>
            </div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                uptimeHealth.color === "green"
                  ? "bg-green-100 text-green-800"
                  : uptimeHealth.color === "yellow"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {uptimeHealth.label}
            </span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {metrics.disponibilidade.uptime.toFixed(2)}
            <span className="text-sm font-normal text-muted-foreground ml-1">
              %
            </span>
          </div>
        </motion.div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-blue-600" />
            <h4 className="text-lg font-semibold text-foreground">
              Performance
            </h4>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-muted-foreground">
                  Latência Média
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {formatDuration(metrics.performance.latenciaMedia)}
                </span>
                {getTrendIcon("stable")}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-muted-foreground">
                  Throughput Médio
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {metrics.performance.throughputMedio.toFixed(1)} reg/s
                </span>
                {getTrendIcon(metrics.performance.tendenciaThroughput)}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-muted-foreground">
                  Pico de Throughput
                </span>
              </div>
              <span className="font-semibold text-foreground">
                {metrics.performance.throughputPico.toFixed(1)} reg/s
              </span>
            </div>
          </div>
        </motion.div>

        {/* Quality Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h4 className="text-lg font-semibold text-foreground">Qualidade</h4>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-muted-foreground">
                  Taxa de Erro
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`font-semibold ${
                    metrics.qualidade.taxaErro < 1
                      ? "text-green-700"
                      : metrics.qualidade.taxaErro < 5
                      ? "text-yellow-700"
                      : "text-red-700"
                  }`}
                >
                  {metrics.qualidade.taxaErro.toFixed(2)}%
                </span>
                {getTrendIcon(metrics.qualidade.taxaErro > 1 ? "up" : "down")}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-muted-foreground">
                  Total Processado
                </span>
              </div>
              <span className="font-semibold text-foreground">
                {formatNumber(metrics.qualidade.totalProcessado)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-muted-foreground">
                  Taxa de Sucesso
                </span>
              </div>
              <span className="font-semibold text-green-700">
                {metrics.qualidade.taxaSucesso.toFixed(2)}%
              </span>
            </div>
          </div>
        </motion.div>

        {/* System Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5 text-purple-600" />
            <h4 className="text-lg font-semibold text-foreground">Recursos</h4>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">CPU</span>
                <span className="font-semibold text-foreground">
                  {metrics.recursos.cpuUsage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metrics.recursos.cpuUsage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-2 rounded-full ${
                    metrics.recursos.cpuUsage < 70
                      ? "bg-green-500"
                      : metrics.recursos.cpuUsage < 85
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Memória</span>
                <span className="font-semibold text-foreground">
                  {formatBytes(metrics.recursos.memoriaUsada)} /{" "}
                  {formatBytes(metrics.recursos.memoriaTotal)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      (metrics.recursos.memoriaUsada /
                        metrics.recursos.memoriaTotal) *
                      100
                    }%`,
                  }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className={`h-2 rounded-full ${
                    metrics.recursos.memoriaUsada /
                      metrics.recursos.memoriaTotal <
                    0.7
                      ? "bg-green-500"
                      : metrics.recursos.memoriaUsada /
                          metrics.recursos.memoriaTotal <
                        0.85
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Availability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-indigo-600" />
            <h4 className="text-lg font-semibold text-foreground">
              Disponibilidade
            </h4>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Uptime</span>
              <span className="font-semibold text-foreground">
                {metrics.disponibilidade.uptime.toFixed(3)}%
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Tempo Online
              </span>
              <span className="font-semibold text-foreground">
                {formatDuration(metrics.disponibilidade.tempoOnline)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Última Falha
              </span>
              <span className="font-semibold text-foreground">
                {metrics.disponibilidade.ultimaFalha
                  ? formatDuration(
                      Date.now() -
                        new Date(metrics.disponibilidade.ultimaFalha).getTime()
                    ) + " atrás"
                  : "Nenhuma"}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
