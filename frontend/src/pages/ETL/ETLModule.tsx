import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  RefreshCw,
  Calendar,
  Database,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Download,
} from "lucide-react";
import { useETLStore } from "../../stores/useETLStore";
import { LoadingSpinner, ErrorDisplay } from "../../components/Common";
import { TipoETL } from "../../types/domain";

const ETLModule: React.FC = () => {
  const {
    executionHistory,
    loading: isLoading,
    error,
    currentExecution,
    executarFullLoad,
    executarIncremental,
    limparErro,
  } = useETLStore();

  const [selectedType, setSelectedType] = useState<TipoETL>(TipoETL.FULL_LOAD);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Clear any previous errors on mount
    limparErro();
  }, [limparErro]);

  const handleExecuteETL = async () => {
    try {
      setIsExecuting(true);
      if (selectedType === TipoETL.FULL_LOAD) {
        await executarFullLoad();
      } else if (selectedType === TipoETL.INCREMENTAL) {
        await executarIncremental();
      }
    } catch (err) {
      console.error("Erro ao executar ETL:", err);
    } finally {
      setIsExecuting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "concluído":
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "falhou":
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "executando":
      case "running":
        return <Activity className="w-5 h-5 text-blue-500 animate-pulse" />;
      case "pendente":
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "concluído":
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "falhou":
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "executando":
      case "running":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pendente":
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString: string | Date) => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleString("pt-BR");
  };

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        title="Erro no Módulo ETL"
        message="Não foi possível carregar os dados do ETL"
        onRetry={() => limparErro()}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            ETL - Extract, Transform, Load
          </h1>
          <p className="text-muted-foreground mt-2">
            Execute processos de ETL para sincronização de dados financeiros
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-accent rounded-lg transition-colors"
        >
          <Clock className="w-4 h-4" />
          {showHistory ? "Ocultar Histórico" : "Ver Histórico"}
        </motion.button>
      </div>

      {/* ETL Execution Panel */}
      <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Database className="w-5 h-5" />
          Executar ETL
        </h2>

        {/* ETL Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedType === TipoETL.FULL_LOAD
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => setSelectedType(TipoETL.FULL_LOAD)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  selectedType === TipoETL.FULL_LOAD
                    ? "bg-primary border-primary"
                    : "border-muted-foreground"
                }`}
              />
              <div>
                <h3 className="font-semibold text-foreground">
                  Full Load Manual
                </h3>
                <p className="text-sm text-muted-foreground">
                  Carrega dados de 24 meses atrás até 2 meses à frente
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Período: 26 meses</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedType === TipoETL.INCREMENTAL
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => setSelectedType(TipoETL.INCREMENTAL)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  selectedType === TipoETL.INCREMENTAL
                    ? "bg-primary border-primary"
                    : "border-muted-foreground"
                }`}
              />
              <div>
                <h3 className="font-semibold text-foreground">Incremental</h3>
              <p className="text-sm text-muted-foreground">
                  Baseado em data de alteração (checkpoint por entidade)
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="w-4 h-4" />
              <span>Apenas dados modificados</span>
            </div>
          </motion.div>
        </div>

        {/* Execute Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExecuteETL}
          disabled={isExecuting || isLoading}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground font-semibold rounded-lg transition-colors"
        >
          {isExecuting || isLoading ? (
            <LoadingSpinner size="sm" color="white" />
          ) : (
            <Play className="w-5 h-5" />
          )}
          {isExecuting
            ? "Executando..."
            : `Executar ETL ${
                selectedType === TipoETL.FULL_LOAD ? "Full Load" : "Incremental"
              }`}
        </motion.button>
      </div>

      {/* Current Execution Status */}
      <AnimatePresence>
        {currentExecution && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card rounded-xl shadow-lg p-6 border border-border"
          >
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Execução Atual
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(currentExecution.status)}
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p
                    className={`px-2 py-1 rounded text-sm font-medium border ${getStatusColor(
                      currentExecution.status
                    )}`}
                  >
                    {currentExecution.status || "Desconhecido"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Tipo</p>
            <p className="font-semibold text-foreground">
                  {currentExecution.type === TipoETL.FULL_LOAD
                    ? "Full Load"
                    : "Incremental"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Duração</p>
            <p className="font-semibold text-foreground">
                  {currentExecution.duration
                    ? formatDuration(currentExecution.duration)
                    : "Em andamento..."}
                </p>
              </div>
            </div>

            {currentExecution.errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Erro:</strong> {currentExecution.errorMessage}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Execution History */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card rounded-xl shadow-lg border border-border"
          >
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Histórico de Execuções
              </h2>
            </div>

            <div className="p-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="md" text="Carregando histórico..." />
                </div>
              ) : executionHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
          <Database className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>Nenhuma execução encontrada</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {executionHistory.map((execution) => (
                    <motion.div
                      key={execution.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {getStatusIcon(execution.status)}
                        <div>
                          <p className="font-semibold text-foreground">
                            ETL{" "}
                            {execution.type === TipoETL.FULL_LOAD
                              ? "Full Load"
                              : "Incremental"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(execution.startTime)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p
                            className={`px-2 py-1 rounded text-sm font-medium border ${getStatusColor(
                              execution.status
                            )}`}
                          >
                            {execution.status || "Desconhecido"}
                          </p>
                          {execution.duration && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatDuration(execution.duration)}
                            </p>
                          )}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            console.log("Ver detalhes:", execution.id)
                          }
                          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                          title="Ver detalhes"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ETLModule;
