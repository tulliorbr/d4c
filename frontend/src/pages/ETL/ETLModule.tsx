import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  RefreshCw,
  Calendar,
  Database,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useETLStore } from "../../stores/useETLStore";
import { LoadingSpinner, ErrorDisplay } from "../../components/Common";
import { TipoETL } from "../../types/domain";
import { formatDate } from "../../utils/formatters";

const ETLModule: React.FC = () => {
  const {
    executionHistory,
    historyLoading,
    isExecuting,
    error,
    pagination,
    executarFullLoad,
    executarIncremental,
    limparErro,
    loadExecutionHistory,
    goToPage,
    nextPage,
    previousPage,
  } = useETLStore();

  const [selectedType, setSelectedType] = useState<TipoETL>(TipoETL.FULL_LOAD);
  const [showHistory, setShowHistory] = useState(true);

  useEffect(() => {
    limparErro();
    loadExecutionHistory();
  }, [limparErro, loadExecutionHistory]);

  const handleExecuteETL = async () => {
    try {
      if (selectedType === TipoETL.FULL_LOAD) {
        await executarFullLoad();
      } else if (selectedType === TipoETL.INCREMENTAL) {
        await executarIncremental();
      }
    } catch (err) {
      console.error("Erro ao executar ETL:", err);
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
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

      <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Database className="w-5 h-5" />
          Executar ETL
        </h2>

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

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExecuteETL}
          disabled={isExecuting}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground font-semibold rounded-lg transition-colors"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            {isExecuting ? (
              <LoadingSpinner size="sm" color="white" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </div>
          {isExecuting
            ? "Executando..."
            : `Executar ETL ${
                selectedType === TipoETL.FULL_LOAD ? "Full Load" : "Incremental"
              }`}
        </motion.button>
      </div>

      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card rounded-xl shadow-lg border border-border"
          >
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Histórico de Execuções
              </h2>
            </div>

            <div className="p-4">
              {historyLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="md" text="Carregando histórico..." />
                </div>
              ) : executionHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Database className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>Nenhuma execução encontrada</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {executionHistory.map((execution) => (
                    <motion.div
                      key={execution.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                    >
                      <div className="flex items-center justify-between p-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-foreground">
                            {execution.type === TipoETL.FULL_LOAD
                              ? "Full Load"
                              : "Incremental"}
                          </div>
                          {execution.endpoint && (
                            <div className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                              {execution.endpoint.replace("/api/ETL/", "")}
                            </div>
                          )}
                        </div>

                        {execution.isSuccess !== undefined && (
                          <div
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                              execution.isSuccess
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${
                                execution.isSuccess
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            ></div>
                            {execution.isSuccess ? "Sucesso" : "Falha"}
                          </div>
                        )}
                      </div>

                      <div className="p-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <span>{formatDate(execution.startTime)}</span>
                            <span>•</span>
                            <span>
                              {execution.duration !== undefined &&
                              execution.duration !== null
                                ? formatDuration(execution.duration)
                                : !execution.duration &&
                                  execution.startTime &&
                                  execution.endTime
                                ? formatDuration(
                                    Math.round(
                                      (execution.endTime.getTime() -
                                        execution.startTime.getTime()) /
                                        1000
                                    )
                                  )
                                : "Em andamento..."}
                            </span>
                          </div>
                          <span className="text-xs">
                            {execution.status || "Desconhecido"}
                          </span>
                        </div>

                        {execution.errorMessage && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                            {execution.errorMessage}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {!historyLoading &&
                executionHistory.length > 0 &&
                pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                    <div className="text-sm text-muted-foreground">
                      Página {pagination.currentPage} de {pagination.totalPages}{" "}
                      • {pagination.totalCount} execuções
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={previousPage}
                        disabled={pagination.currentPage <= 1 || historyLoading}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Anterior
                      </button>

                      <div className="flex items-center gap-1">
                        {pagination.currentPage > 3 && (
                          <>
                            <button
                              onClick={() => goToPage(1)}
                              className="px-3 py-2 text-sm font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-muted hover:text-foreground transition-colors"
                            >
                              1
                            </button>
                            {pagination.currentPage > 4 && (
                              <span className="px-2 text-muted-foreground">
                                ...
                              </span>
                            )}
                          </>
                        )}

                        {Array.from(
                          { length: Math.min(5, pagination.totalPages) },
                          (_, i) => {
                            const startPage = Math.max(
                              1,
                              pagination.currentPage - 2
                            );
                            const endPage = Math.min(
                              pagination.totalPages,
                              startPage + 4
                            );
                            const adjustedStartPage = Math.max(1, endPage - 4);
                            const page = adjustedStartPage + i;

                            if (page > endPage) return null;

                            return (
                              <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                  page === pagination.currentPage
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground bg-background border border-border hover:bg-muted hover:text-foreground"
                                }`}
                              >
                                {page}
                              </button>
                            );
                          }
                        )}

                        {pagination.currentPage < pagination.totalPages - 2 && (
                          <>
                            {pagination.currentPage <
                              pagination.totalPages - 3 && (
                              <span className="px-2 text-muted-foreground">
                                ...
                              </span>
                            )}
                            <button
                              onClick={() => goToPage(pagination.totalPages)}
                              className="px-3 py-2 text-sm font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-muted hover:text-foreground transition-colors"
                            >
                              {pagination.totalPages}
                            </button>
                          </>
                        )}
                      </div>

                      <button
                        onClick={nextPage}
                        disabled={
                          pagination.currentPage >= pagination.totalPages ||
                          historyLoading
                        }
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Próxima
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
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
