/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";
import { StatCard, SkeletonCard } from "../../../components/Common";
import { KPIData } from "../../../types";

interface ReportsKPIsProps {
  kpis: KPIData | null;
  isLoading: boolean;
  formatCurrency: (value: number) => string;
  formatPercentage: (value: number) => string;
}

export const ReportsKPIs: React.FC<ReportsKPIsProps> = ({
  kpis,
  isLoading,
  formatCurrency,
  formatPercentage,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (!kpis) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <StatCard
            key={index}
            title="Sem dados"
            value="--"
            icon={DollarSign}
          />
        ))}
      </div>
    );
  }

  const kpiCards = [
    {
      id: "entradas",
      title: "Entradas (R)",
      value: kpis.totalEntradas,
      formatted: formatCurrency(kpis.totalEntradas),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50/50",
      borderColor: "border-green-200/50",
      trend: (kpis as any).entradasTrend || "neutral",
      change: (kpis as any).entradasChange || 0,
    },
    {
      id: "saidas",
      title: "Saídas (P)",
      value: kpis.totalSaidas,
      formatted: formatCurrency(kpis.totalSaidas),
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50/50",
      borderColor: "border-red-200/50",
      trend: (kpis as any).saidasTrend || "neutral",
      change: (kpis as any).saidasChange || 0,
    },
    {
      id: "saldo",
      title: "Saldo do Período",
      value: kpis.saldoPeriodo,
      formatted: formatCurrency(kpis.saldoPeriodo),
      icon: DollarSign,
      color: kpis.saldoPeriodo >= 0 ? "text-blue-600" : "text-orange-600",
      bgColor: kpis.saldoPeriodo >= 0 ? "bg-blue-50/50" : "bg-orange-50/50",
      borderColor:
        kpis.saldoPeriodo >= 0 ? "border-blue-200/50" : "border-orange-200/50",
      trend: (kpis as any).saldoTrend || "neutral",
      change: (kpis as any).saldoChange || 0,
    },
    {
      id: "percentual",
      title: "% Recebido/Pago",
      value: kpis.percentualRecebido / kpis.percentualPago,
      formatted: `${formatPercentage(
        kpis.percentualRecebido
      )} / ${formatPercentage(kpis.percentualPago)}`,
      icon: Percent,
      color: "text-purple-600",
      bgColor: "bg-purple-50/50",
      borderColor: "border-purple-200/50",
      trend: (kpis as any).percentualTrend || "neutral",
      change: (kpis as any).percentualChange || 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiCards.map((kpi, index) => {
        return (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard title={kpi.title} value={kpi.formatted} icon={kpi.icon} />
          </motion.div>
        );
      })}
    </div>
  );
};
