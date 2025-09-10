import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  BarChart3,
  Database,
  Package,
} from "lucide-react";
import { useObservabilityStore } from "../../stores";
import { LoadingSpinner, ErrorDisplay } from "../../components/Common";
import { MetricsOverview } from "./components";
import BatchesAndItemsSection from "../../components/BatchesAndItemsSection";
import ETLExecutionPanel from "../../components/ETLExecutionPanel";

export const ObservabilityModule: React.FC = () => {
  const {
    lotes,
    metricas: metrics,
    loading,
    errors,
    loadAllData,
    refreshData,
    loadMetricas,
    clearErrors,
  } = useObservabilityStore();

  const isLoading = loading.lotes || loading.metricas;
  const error = errors.lotes || errors.metricas;

  const [activeTab, setActiveTab] = useState<"lotes-itens" | "metrics">(
    "lotes-itens"
  );

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleRefresh = () => {
    clearErrors();

    if (activeTab === "lotes-itens") {
      refreshData();
    } else if (activeTab === "metrics") {
      loadMetricas();
    }
  };

  const tabs = [
    {
      id: "lotes-itens" as const,
      label: "Lotes & Itens",
      icon: Package,
      description: "Visualizar lotes de processamento e seus itens",
    },
    {
      id: "metrics" as const,
      label: "Métricas",
      icon: BarChart3,
      description: "Acompanhar métricas de performance e throughput",
    },
  ];

  const getStatusStats = () => {

    if (!lotes || !Array.isArray(lotes)) {
      return { total: 0, success: 0, error: 0, running: 0 };
    }


    const stats = lotes.reduce(
      (acc, lote) => {
        acc.total++;

        if (lote.status === "Concluido" || lote.status === "Sucesso") {
          acc.success++;
        } else if (lote.status === "Erro" || lote.status === "Falha") {
          acc.error++;
        } else if (
          lote.status === "Executando" ||
          lote.status === "Em Andamento"
        ) {
          acc.running++;
        }

        return acc;
      },
      { total: 0, success: 0, error: 0, running: 0 }
    );

    return stats;
  };

  const statusStats = getStatusStats();

  if (error) {
    return (
      <div className="p-6">
        <ErrorDisplay
          error={error}
          title="Erro ao carregar dados de observabilidade"
          message={error}
          onRetry={handleRefresh}
          type="error"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Observabilidade
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitore lotes e métricas de performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Atualizar
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card p-6 rounded-lg shadow-sm border border-border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total de Lotes
              </p>
              <p className="text-2xl font-bold text-foreground">
                {statusStats.total}
              </p>
            </div>
            <Database className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card p-6 rounded-lg shadow-sm border border-border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Sucessos
              </p>
              <p className="text-2xl font-bold text-green-600">
                {statusStats.success}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card p-6 rounded-lg shadow-sm border border-border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Erros</p>
              <p className="text-2xl font-bold text-destructive">
                {statusStats.error}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card p-6 rounded-lg shadow-sm border border-border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Em Execução
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {statusStats.running}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </motion.div>
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border">
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </motion.button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {isLoading && (
            <LoadingSpinner
              size="lg"
              text="Carregando dados de observabilidade..."
            />
          )}

          {!isLoading && (
            <>
              {activeTab === "lotes-itens" && (
                <div className="space-y-6">
                  <ETLExecutionPanel onExecutionComplete={handleRefresh} />
                  <BatchesAndItemsSection />
                </div>
              )}

              {activeTab === "metrics" && (
                <MetricsOverview
                  metrics={metrics}
                  isLoading={loading.metricas}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ObservabilityModule;
