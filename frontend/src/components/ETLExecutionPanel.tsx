/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "./Common/Card";
import { apiService } from "../services/api";
import { ETLExecutionResult } from "../types/api";

interface ETLExecutionPanelProps {
  onExecutionComplete?: () => void;
}

const ETLExecutionPanel: React.FC<ETLExecutionPanelProps> = ({
  onExecutionComplete,
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<ETLExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executeETL = async (
    type: "movimentos" | "categorias" | "full-load" | "incremental"
  ) => {
    setIsExecuting(true);
    setError(null);
    setLastResult(null);

    try {
      let result: ETLExecutionResult;

      switch (type) {
        case "movimentos":
          result = await apiService.executarETLMovimentos({
            pagina: 1,
            registrosPorPagina: 100,
          });
          break;
        case "categorias":
          result = await apiService.executarETLCategorias({
            pagina: 1,
            registrosPorPagina: 100,
          });
          break;
        case "full-load":
          result = await apiService.executarETLFullLoad({
            entidade: "movimentos",
            batchSize: 100,
          });
          break;
        case "incremental":
          result = await apiService.executarETLIncremental({
            entidade: "categorias",
            batchSize: 100,
          });
          break;
        default:
          throw new Error("Tipo de ETL não suportado");
      }

      setLastResult(result);
      onExecutionComplete?.();
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Erro ao executar ETL"
      );
    } finally {
      setIsExecuting(false);
    }
  };

  const etlOptions = [
    {
      id: "movimentos",
      title: "Entidade de Movimentos",
      description: "Executa ETL para movimentos financeiros",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      id: "categorias",
      title: "Entidade de Categorias",
      description: "Executa ETL para categorias",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      id: "full-load",
      title: "Full Load",
      description: "Executa carga completa de dados",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      id: "incremental",
      title: "Incremental",
      description: "Executa carga incremental",
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Executar ETL</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Execute processos ETL para gerar mais dados nos lotes & itens
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {etlOptions.map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => executeETL(option.id as any)}
              disabled={isExecuting}
              className={`p-4 rounded-lg text-white text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${option.color}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{option.title}</h3>
                  <p className="text-sm opacity-90">{option.description}</p>
                </div>
                {isExecuting ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {lastResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Sucesso!</span>
            </div>
            <p className="text-sm text-green-700 mt-1">{lastResult.message}</p>
            {lastResult.batchId && (
              <p className="text-xs text-green-600 mt-1 font-mono">
                Batch ID: {lastResult.batchId}
              </p>
            )}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Erro</span>
            </div>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </motion.div>
        )}

        {isExecuting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-blue-600 mt-4"
          >
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm">Executando ETL...</span>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default ETLExecutionPanel;
