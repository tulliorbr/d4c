import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Database,
  Zap,
  Target,
  Calendar,
} from "lucide-react";
import { ETLMetricsDto } from "../../../types";
import { LoadingSpinner } from "../../../components/Common";

interface MetricsOverviewProps {
  metrics: ETLMetricsDto[] | null;
  isLoading: boolean;
}

const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString("pt-BR");
};

const formatDuration = (ms: number): string => {
  if (ms < 1000) {
    return `${ms.toFixed(0)}ms`;
  }
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`;
  }
  return `${(ms / 60000).toFixed(1)}min`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "sucesso":
      return "text-green-600";
    case "erro":
    case "falha":
      return "text-red-600";
    case "executando":
    case "em andamento":
      return "text-yellow-600";
    default:
      return "text-gray-600";
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "sucesso":
      return CheckCircle;
    case "erro":
    case "falha":
      return AlertTriangle;
    case "executando":
    case "em andamento":
      return Clock;
    default:
      return Minus;
  }
};

const getThroughputTrend = (throughput: number) => {
  if (throughput > 50) return { icon: TrendingUp, color: "text-green-600" };
  if (throughput < 20) return { icon: TrendingDown, color: "text-red-600" };
  return { icon: Minus, color: "text-gray-600" };
};

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color?: string;
  trend?: React.ElementType;
  trendColor?: string;
}> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "text-blue-600",
  trend: TrendIcon,
  trendColor,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card p-6 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow"
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground mb-1">
          {title}
        </p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {TrendIcon && <TrendIcon className={`w-4 h-4 ${trendColor}`} />}
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </div>
  </motion.div>
);

const EntityMetricsCard: React.FC<{ metric: ETLMetricsDto }> = ({ metric }) => {
  const StatusIcon = getStatusIcon(metric.statusUltimaExecucao);
  const statusColor = getStatusColor(metric.statusUltimaExecucao);
  const throughputTrend = getThroughputTrend(metric.throughputMedio);
  const successRate = metric.taxaSucessoMedia;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card p-6 rounded-lg shadow-sm border border-border hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {metric.entidade}
        </h3>
        <div className="flex items-center gap-2">
          <StatusIcon className={`w-5 h-5 ${statusColor}`} />
          <span className={`text-sm font-medium ${statusColor}`}>
            {metric.statusUltimaExecucao}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Registros Processados</p>
          <p className="text-xl font-bold text-foreground">
            {formatNumber(metric.registrosProcessadosUltimaExecucao)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
          <p
            className={`text-xl font-bold ${
              successRate >= 95
                ? "text-green-600"
                : successRate >= 80
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {successRate.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Throughput</p>
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold text-foreground">
              {metric.throughputMedio.toFixed(1)} reg/s
            </p>
            <throughputTrend.icon
              className={`w-4 h-4 ${throughputTrend.color}`}
            />
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Latência Média</p>
          <p className="text-lg font-semibold text-foreground">
            {formatDuration(metric.latenciaMedia)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Total de Execuções</p>
          <p className="text-lg font-semibold text-foreground">
            {formatNumber(metric.totalExecucoes)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Registros com Erro</p>
          <p
            className={`text-lg font-semibold ${
              metric.registrosComErroUltimaExecucao > 0
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {formatNumber(metric.registrosComErroUltimaExecucao)}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Última execução: {formatDate(metric.ultimaExecucao)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  metrics,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!metrics || metrics.length === 0) {
    return (
      <div className="text-center py-12">
        <Database className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Nenhuma métrica disponível
        </h3>
        <p className="text-muted-foreground">
          Execute um processo ETL para visualizar as métricas de performance.
        </p>
      </div>
    );
  }

  const totalRegistrosProcessados = metrics.reduce(
    (sum, m) => sum + m.registrosProcessadosUltimaExecucao,
    0
  );
  const totalRegistrosComErro = metrics.reduce(
    (sum, m) => sum + m.registrosComErroUltimaExecucao,
    0
  );
  const throughputMedio =
    metrics.reduce((sum, m) => sum + m.throughputMedio, 0) / metrics.length;
  const latenciaMedia =
    metrics.reduce((sum, m) => sum + m.latenciaMedia, 0) / metrics.length;
  const taxaSucessoGeral =
    metrics.reduce((sum, m) => sum + m.taxaSucessoMedia, 0) / metrics.length;
  const totalExecucoes = metrics.reduce((sum, m) => sum + m.totalExecucoes, 0);

  const throughputTrend = getThroughputTrend(throughputMedio);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Visão Geral das Métricas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Registros Processados"
            value={formatNumber(totalRegistrosProcessados)}
            subtitle="Total geral"
            icon={Database}
            color="text-blue-600"
          />
          <MetricCard
            title="Taxa de Sucesso"
            value={`${taxaSucessoGeral.toFixed(1)}%`}
            subtitle="Média geral"
            icon={Target}
            color={
              taxaSucessoGeral >= 95
                ? "text-green-600"
                : taxaSucessoGeral >= 80
                ? "text-yellow-600"
                : "text-red-600"
            }
          />
          <MetricCard
            title="Throughput Médio"
            value={`${throughputMedio.toFixed(1)}`}
            subtitle="registros/segundo"
            icon={Zap}
            color="text-purple-600"
            trend={throughputTrend.icon}
            trendColor={throughputTrend.color}
          />
          <MetricCard
            title="Latência Média"
            value={formatDuration(latenciaMedia)}
            subtitle="Tempo de resposta"
            icon={Clock}
            color="text-orange-600"
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Métricas por Entidade
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {metrics.map((metric, index) => (
            <EntityMetricsCard
              key={`${metric.entidade}-${index}`}
              metric={metric}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Resumo de Execuções
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Total de Execuções"
            value={formatNumber(totalExecucoes)}
            subtitle="Todas as entidades"
            icon={Activity}
            color="text-indigo-600"
          />
          <MetricCard
            title="Registros com Erro"
            value={formatNumber(totalRegistrosComErro)}
            subtitle="Requer atenção"
            icon={AlertTriangle}
            color={
              totalRegistrosComErro > 0 ? "text-red-600" : "text-green-600"
            }
          />
          <MetricCard
            title="Entidades Monitoradas"
            value={metrics.length}
            subtitle="Ativas no sistema"
            icon={Database}
            color="text-teal-600"
          />
        </div>
      </div>
    </div>
  );
};

export default MetricsOverview;
