/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Calendar, Filter, X, ChevronDown } from "lucide-react";
import { ReportFilters } from "../../../types/domain";
import { LoadingSpinner } from "../../../components/Common";
import { Button } from "../../../components/Common";

interface DateRange {
  startDate: string;
  endDate: string;
}

interface LocalFilters {
  dateRange: DateRange;
  natureza: string;
  categoria: string;
  status: string;
}

interface ReportsFiltersProps {
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
  isLoading: boolean;
}

export const ReportsFilters: React.FC<ReportsFiltersProps> = ({
  filters,
  onFiltersChange,
  isLoading,
}) => {
  const [localFilters, setLocalFilters] = useState<LocalFilters>({
    dateRange: {
      startDate: filters.dataInicio
        ? filters.dataInicio.toISOString().split("T")[0]
        : new Date(new Date().setMonth(new Date().getMonth() - 1))
            .toISOString()
            .split("T")[0],
      endDate: filters.dataFim
        ? filters.dataFim.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    },
    natureza: filters.natureza || "all",
    categoria: filters.categoria || "all",
    status: filters.status || "all",
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (filters) {
      setLocalFilters({
        dateRange: {
          startDate: filters.dataInicio
            ? filters.dataInicio.toISOString().split("T")[0]
            : new Date(new Date().setMonth(new Date().getMonth() - 1))
                .toISOString()
                .split("T")[0],
          endDate: filters.dataFim
            ? filters.dataFim.toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        },
        natureza: filters.natureza || "all",
        categoria: filters.categoria || "all",
        status: filters.status || "all",
      });
    }
  }, [filters]);

  const handleDateRangeChange = useCallback(
    (field: keyof DateRange, value: string) => {
      if (!localFilters || !localFilters.dateRange) {
        console.warn("localFilters ou dateRange não estão definidos");
        return;
      }

      const newDateRange = {
        ...localFilters.dateRange,
        [field]: value,
      };

      const newLocalFilters = {
        ...localFilters,
        dateRange: newDateRange,
      };

      setLocalFilters(newLocalFilters);
      setTimeout(() => {
        if (!newDateRange.startDate || !newDateRange.endDate) {
          console.warn("startDate ou endDate não estão definidos");
          return;
        }

        const reportFilters: ReportFilters = {
          dataInicio: new Date(newDateRange.startDate),
          dataFim: new Date(newDateRange.endDate),
          natureza:
            newLocalFilters.natureza !== "all"
              ? (newLocalFilters.natureza as any)
              : undefined,
          categoria:
            newLocalFilters.categoria !== "all"
              ? newLocalFilters.categoria
              : undefined,
          status:
            newLocalFilters.status !== "all"
              ? (newLocalFilters.status as any)
              : undefined,
        };

        onFiltersChange(reportFilters);
      }, 0);
    },
    [localFilters, onFiltersChange]
  );

  const handleFilterChange = useCallback(
    (field: keyof LocalFilters, value: any) => {
      if (!localFilters) {
        console.warn("localFilters não está definido");
        return;
      }

      const newLocalFilters = {
        ...localFilters,
        [field]: value,
      };

      setLocalFilters(newLocalFilters);

      setTimeout(() => {
        if (
          !newLocalFilters.dateRange ||
          !newLocalFilters.dateRange.startDate ||
          !newLocalFilters.dateRange.endDate
        ) {
          console.warn("dateRange, startDate ou endDate não estão definidos");
          return;
        }

        const reportFilters: ReportFilters = {
          dataInicio: new Date(newLocalFilters.dateRange.startDate),
          dataFim: new Date(newLocalFilters.dateRange.endDate),
          natureza:
            newLocalFilters.natureza !== "all"
              ? (newLocalFilters.natureza as any)
              : undefined,
          categoria:
            newLocalFilters.categoria !== "all"
              ? newLocalFilters.categoria
              : undefined,
          status:
            newLocalFilters.status !== "all"
              ? (newLocalFilters.status as any)
              : undefined,
        };

        onFiltersChange(reportFilters);
      }, 0);
    },
    [localFilters, onFiltersChange]
  );

  const handleQuickDateRange = useCallback(
    (
      range:
        | "last7days"
        | "last30days"
        | "last3months"
        | "last6months"
        | "last12months"
        | "thisYear"
    ) => {
      const today = new Date();
      let startDate: Date;

      switch (range) {
        case "last7days":
          startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "last30days":
          startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "last3months":
          startDate = new Date(
            today.getFullYear(),
            today.getMonth() - 3,
            today.getDate()
          );
          break;
        case "last6months":
          startDate = new Date(
            today.getFullYear(),
            today.getMonth() - 6,
            today.getDate()
          );
          break;
        case "last12months":
          startDate = new Date(
            today.getFullYear(),
            today.getMonth() - 12,
            today.getDate()
          );
          break;
        case "thisYear":
          startDate = new Date(today.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(
            today.getFullYear(),
            today.getMonth() - 12,
            today.getDate()
          );
      }

      const newDateRange = {
        startDate: startDate.toISOString().split("T")[0],
        endDate: today.toISOString().split("T")[0],
      };

      const newLocalFilters = {
        ...localFilters,
        dateRange: newDateRange,
      };

      setLocalFilters(newLocalFilters);

      const reportFilters: ReportFilters = {
        dataInicio: new Date(newDateRange.startDate),
        dataFim: new Date(newDateRange.endDate),
        natureza:
          newLocalFilters.natureza !== "all"
            ? (newLocalFilters.natureza as any)
            : undefined,
        categoria:
          newLocalFilters.categoria !== "all"
            ? newLocalFilters.categoria
            : undefined,
        status:
          newLocalFilters.status !== "all"
            ? (newLocalFilters.status as any)
            : undefined,
      };

      setTimeout(() => {
        onFiltersChange(reportFilters);
      }, 0);
    },
    [localFilters, onFiltersChange]
  );

  const clearFilters = useCallback(() => {
    const defaultLocalFilters: LocalFilters = {
      dateRange: {
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 12))
          .toISOString()
          .split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
      },
      natureza: "all",
      categoria: "all",
      status: "all",
    };

    setLocalFilters(defaultLocalFilters);

    const reportFilters: ReportFilters = {
      dataInicio: new Date(defaultLocalFilters.dateRange.startDate),
      dataFim: new Date(defaultLocalFilters.dateRange.endDate),
      natureza: undefined,
      categoria: undefined,
      status: undefined,
    };

    setTimeout(() => {
      onFiltersChange(reportFilters);
    }, 0);
  }, [onFiltersChange]);

  const quickRanges = [
    { key: "last7days", label: "Últimos 7 dias" },
    { key: "last30days", label: "Últimos 30 dias" },
    { key: "last3months", label: "Últimos 3 meses" },
    { key: "last6months", label: "Últimos 6 meses" },
    { key: "last12months", label: "Últimos 12 meses" },
    { key: "thisYear", label: "Este ano" },
  ] as const;

  const naturezaOptions = [
    { value: "all", label: "Todas" },
    { value: "R", label: "Receitas (R)" },
    { value: "P", label: "Pagamentos (P)" },
  ];

  const statusOptions = [
    { value: "all", label: "Todos" },
    { value: "aberto", label: "Aberto" },
    { value: "pago", label: "Pago" },
    { value: "vencido", label: "Vencido" },
    { value: "cancelado", label: "Cancelado" },
  ];

  const categoriaOptions = [
    { value: "all", label: "Todas" },
    { value: "vendas", label: "Vendas" },
    { value: "servicos", label: "Serviços" },
    { value: "aluguel", label: "Aluguel" },
    { value: "fornecedores", label: "Fornecedores" },
    { value: "salarios", label: "Salários" },
    { value: "impostos", label: "Impostos" },
    { value: "outros", label: "Outros" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Períodos Rápidos
        </label>
        <div className="flex flex-wrap gap-2">
          {quickRanges.map((range) => (
            <Button
              key={range.key}
              variant="outline"
              size="sm"
              onClick={() => handleQuickDateRange(range.key)}
              disabled={isLoading}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Data Inicial
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="date"
              value={localFilters?.dateRange?.startDate || ""}
              onChange={(e) =>
                handleDateRangeChange("startDate", e.target.value)
              }
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted/50 bg-background text-foreground dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Data Final
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-white" />
            <input
              type="date"
              value={localFilters?.dateRange?.endDate || ""}
              onChange={(e) => handleDateRangeChange("endDate", e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted/50 bg-background text-foreground dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-primary hover:text-primary/80 justify-between "
        >
          <div className="flex gap-2">
            <Filter className="w-4 h-4" />
            Filtros Avançados
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showAdvanced ? "rotate-180" : ""
              }`}
            />
          </div>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          disabled={isLoading}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <div className="flex gap-2">
            <X className="w-4 h-4" />
            Limpar Filtros
          </div>
        </Button>
      </div>

      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border"
        >
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Natureza
            </label>
            <div className="relative">
              <select
                value={localFilters.natureza}
                onChange={(e) => handleFilterChange("natureza", e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted/50 appearance-none bg-background text-foreground"
              >
                {naturezaOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Categoria
            </label>
            <div className="relative">
              <select
                value={localFilters.categoria}
                onChange={(e) =>
                  handleFilterChange("categoria", e.target.value)
                }
                disabled={isLoading}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted/50 appearance-none bg-background text-foreground"
              >
                {categoriaOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Status
            </label>
            <div className="relative">
              <select
                value={localFilters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted/50 appearance-none bg-background text-foreground"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </motion.div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <LoadingSpinner size="sm" text="Aplicando filtros..." />
        </div>
      )}
    </div>
  );
};
