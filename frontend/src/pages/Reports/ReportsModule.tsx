/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Filter,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import { useReportsStore } from "../../stores/useReportsStore";
import {
  LoadingSpinner,
  ErrorDisplay,
  Card,
  CardHeader,
  CardContent,
  Button,
} from "../../components/Common";
import { ReportsCharts } from "./components/ReportsCharts";
import { ReportsTable } from "./components/ReportsTable";
import { ReportsFilters } from "./components/ReportsFilters";
import { ReportsKPIs } from "./components/ReportsKPIs";
import { ReportFilters } from "../../types";

interface DateRange {
  startDate: string;
  endDate: string;
}

const ReportsModule: React.FC = () => {
  const {
    kpis,
    chartData,
    movimentos: tableData,
    currentPage,
    totalPages,
    totalMovimentos,
    filters,
    loading,
    errors,
    loadKPIs,
    loadChartData,
    loadMovimentos: loadTableData,
    setFilters: updateFilters,
    setPage,
    exportData,
  } = useReportsStore();

  const isLoading = loading.kpis || loading.charts || loading.table;
  const error = errors.kpis || errors.charts || errors.table;

  const [showFilters, setShowFilters] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "charts" | "table">(
    "overview"
  );
  const [isExporting, setIsExporting] = useState(false);

  // Default date range: last 12 months
  const defaultDateRange: DateRange = {
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 12))
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  };

  useEffect(() => {
    // Initialize with default filters
    const initialFilters: ReportFilters = {
      dataInicio: new Date(defaultDateRange.startDate),
      dataFim: new Date(defaultDateRange.endDate),
      natureza: undefined,
      categoria: undefined,
      status: undefined,
    };

    updateFilters(initialFilters);
  }, []); // Array de dependências vazio para executar apenas uma vez na montagem

  const handleFiltersChange = async (newFilters: ReportFilters) => {
    updateFilters(newFilters);
  };

  const handleRefresh = async () => {
    try {
      await Promise.all([loadKPIs(), loadChartData(), loadTableData()]);
    } catch (err) {
      console.error("Erro ao carregar dados dos relatórios:", err);
    }
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleExport = async (format: "excel" | "csv") => {
    try {
      setIsExporting(true);
      await exportData(format);
    } catch (err) {
      console.error("Erro ao exportar dados:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Funções para transformar dados do store para formato ECharts
  const transformToLineChart = (monthlyTrend: any[]) => {
    if (!monthlyTrend || monthlyTrend.length === 0) return null;

    return {
      title: "Entradas x Saídas por Mês",
      categories: monthlyTrend.map((item) => item.month),
      series: [
        {
          name: "Entradas",
          data: monthlyTrend.map((item) => item.entradas),
        },
        {
          name: "Saídas",
          data: monthlyTrend.map((item) => item.saidas),
        },
      ],
    };
  };

  const transformToBarChart = (topCategories: any[]) => {
    if (!topCategories || topCategories.length === 0) return null;

    return {
      title: "Top 5 Categorias por Valor",
      categories: topCategories.map((item) => item.categoria),
      series: [
        {
          name: "Valor",
          data: topCategories.map((item) => item.valor),
        },
      ],
    };
  };

  const transformToPieChart = (statusDistribution: any[]) => {
    if (!statusDistribution || statusDistribution.length === 0) return null;

    return {
      title: "Distribuição por Status",
      categories: statusDistribution.map((item) => item.status),
      series: [
        {
          name: "Valor",
          data: statusDistribution.map((item) => item.value),
        },
      ],
    };
  };

  // Transformar dados do store
  const lineChartData = transformToLineChart(chartData.monthlyTrend);
  const barChartData = transformToBarChart(chartData.topCategories);
  const pieChartData = transformToPieChart(chartData.statusDistribution);

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        title="Erro no Módulo de Relatórios"
        message="Não foi possível carregar os dados dos relatórios"
        onRetry={handleRefresh}
      />
    );
  }

  const tabs = [
    { id: "overview", label: "Visão Geral", icon: BarChart3 },
    { id: "charts", label: "Gráficos", icon: PieChart },
    { id: "table", label: "Tabela", icon: Eye },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold text-foreground">
            Relatórios Financeiros
          </h1>
          <p className="text-muted-foreground mt-2">
            Análise detalhada de entradas, saídas e performance financeira
          </p>
        </motion.div>

        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            icon={showFilters ? EyeOff : Eye}
          >
            {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
          </Button>

          <Button
            variant="primary"
            onClick={handleRefresh}
            disabled={isLoading}
            loading={isLoading}
            icon={RefreshCw}
          >
            Atualizar
          </Button>

          <Button
            variant="success"
            onClick={() => handleExport("excel")}
            disabled={isExporting}
            loading={isExporting}
            icon={Download}
          >
            Exportar
          </Button>
        </motion.div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass">
              <CardHeader icon={Filter} iconColor="text-primary">
                <h2 className="text-lg font-semibold text-foreground">
                  Filtros
                </h2>
              </CardHeader>
              <CardContent>
                <ReportsFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Tabs */}
      <Card className="glass">
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
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* KPIs */}
                <ReportsKPIs
                  kpis={kpis}
                  isLoading={isLoading}
                  formatCurrency={formatCurrency}
                  formatPercentage={formatPercentage}
                />

                {/* Quick Charts Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card hover className="p-6">
                    <CardHeader icon={TrendingUp} iconColor="text-green-600">
                      <h3 className="text-lg font-semibold text-foreground">
                        Entradas vs Saídas
                      </h3>
                    </CardHeader>
                    <CardContent>
                      {lineChartData && (
                        <ReportsCharts
                          type="line"
                          data={lineChartData}
                          height={300}
                        />
                      )}
                    </CardContent>
                  </Card>

                  <Card hover className="p-6">
                    <CardHeader icon={PieChart} iconColor="text-blue-600">
                      <h3 className="text-lg font-semibold text-foreground">
                        Distribuição por Status
                      </h3>
                    </CardHeader>
                    <CardContent>
                      {pieChartData && (
                        <ReportsCharts
                          type="pie"
                          data={pieChartData}
                          height={300}
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {activeTab === "charts" && (
              <motion.div
                key="charts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Line Chart */}
                <Card className="glass">
                  <CardHeader icon={TrendingUp} iconColor="text-green-600">
                    <h3 className="text-xl font-semibold text-foreground">
                      Entradas x Saídas por Mês
                    </h3>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex justify-center py-12">
                        <LoadingSpinner
                          size="md"
                          text="Carregando gráfico..."
                        />
                      </div>
                    ) : lineChartData ? (
                      <ReportsCharts
                        type="line"
                        data={lineChartData}
                        height={400}
                      />
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p>Nenhum dado disponível para o período selecionado</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Bar Chart */}
                <Card className="glass">
                  <CardHeader icon={BarChart3} iconColor="text-blue-600">
                    <h3 className="text-xl font-semibold text-foreground">
                      Top 5 Categorias por Valor
                    </h3>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex justify-center py-12">
                        <LoadingSpinner
                          size="md"
                          text="Carregando gráfico..."
                        />
                      </div>
                    ) : barChartData ? (
                      <ReportsCharts
                        type="bar"
                        data={barChartData}
                        height={400}
                      />
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p>Nenhum dado disponível para o período selecionado</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Pie Chart */}
                <Card className="glass">
                  <CardHeader icon={PieChart} iconColor="text-purple-600">
                    <h3 className="text-xl font-semibold text-foreground">
                      Distribuição por Status
                    </h3>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex justify-center py-12">
                        <LoadingSpinner
                          size="md"
                          text="Carregando gráfico..."
                        />
                      </div>
                    ) : pieChartData ? (
                      <ReportsCharts
                        type="pie"
                        data={pieChartData}
                        height={400}
                      />
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <PieChart className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p>Nenhum dado disponível para o período selecionado</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "table" && (
              <motion.div
                key="table"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <ReportsTable
                  data={tableData}
                  loading={loading.table}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalMovimentos}
                  itemsPerPage={20}
                  onPageChange={handlePageChange}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};

export default ReportsModule;
