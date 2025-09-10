/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { motion } from "framer-motion";
import { useTheme } from "../../../components/ThemeProvider";

interface EChartsData {
  title?: string;
  categories?: string[];
  series?: {
    name: string;
    data: number[];
  }[];
}

interface ReportsChartsProps {
  type: "line" | "bar" | "pie";
  data: EChartsData;
  height?: number;
  className?: string;
}

export const ReportsCharts: React.FC<ReportsChartsProps> = ({
  type,
  data,
  height = 400,
  className = "",
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const { theme } = useTheme();

  const getThemeColors = () => {
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    return {
      text: isDark ? '#ffffff' : '#000000',
      mutedText: isDark ? '#a1a1aa' : '#71717a',
      border: isDark ? '#27272a' : '#e4e4e7',
      background: isDark ? '#09090b' : '#ffffff',
      primary: isDark ? '#3b82f6' : '#2563eb',
      success: isDark ? '#22c55e' : '#16a34a',
      warning: isDark ? '#f59e0b' : '#d97706',
      destructive: isDark ? '#ef4444' : '#dc2626',
      secondary: isDark ? '#6b7280' : '#4b5563',
    };
  };

  useEffect(() => {
    if (!chartRef.current || !data) return;

    chartInstance.current = echarts.init(chartRef.current);

    const colors = getThemeColors();
    let option: echarts.EChartsOption = {};

    switch (type) {
      case "line":
        option = getLineChartOption(data, colors);
        break;
      case "bar":
        option = getBarChartOption(data, colors);
        break;
      case "pie":
        option = getPieChartOption(data, colors);
        break;
    }

    chartInstance.current.setOption(option);

    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
    };
  }, [data, type, theme]);

  const getLineChartOption = (
    chartData: EChartsData,
    colors: ReturnType<typeof getThemeColors>
  ): echarts.EChartsOption => {
    return {
      title: {
        text: chartData.title || "Entradas x Saídas por Mês",
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: "bold",
          color: colors.text,
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6366f1",
          },
        },
        formatter: (params: any) => {
          let result = `<div style="font-weight: bold; margin-bottom: 8px;">${params[0].axisValue}</div>`;
          params.forEach((param: any) => {
            const value = new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(param.value);
            result += `<div style="display: flex; align-items: center; margin-bottom: 4px;">
              <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; border-radius: 50%; margin-right: 8px;"></span>
              ${param.seriesName}: ${value}
            </div>`;
          });
          return result;
        },
      },
      legend: {
        data: chartData.series?.map((s) => s.name) || [],
        top: 40,
        textStyle: {
          color: colors.text,
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: chartData.categories || [],
        axisLine: {
          lineStyle: {
            color: colors.border,
          },
        },
        axisLabel: {
          color: colors.mutedText,
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: colors.border,
          },
        },
        axisLabel: {
          color: colors.mutedText,
          formatter: (value: number) => {
            return new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value);
          },
        },
        splitLine: {
          lineStyle: {
            color: colors.border,
          },
        },
      },
      series:
        chartData.series?.map((series, index) => ({
          name: series.name,
          type: "line",
          smooth: true,
          data: series.data,
          lineStyle: {
            width: 3,
          },
          areaStyle: {
            opacity: 0.1,
          },
          itemStyle: {
            color: index === 0 ? colors.success : colors.destructive,
          },
        })) || [],
    };
  };

  const getBarChartOption = (
    chartData: EChartsData,
    colors: ReturnType<typeof getThemeColors>
  ): echarts.EChartsOption => {
    return {
      title: {
        text: chartData.title || "Top 5 Categorias por Valor",
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: "bold",
          color: colors.text,
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: (params: any) => {
          const param = params[0];
          const value = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(param.value);
          return `<div style="font-weight: bold; margin-bottom: 8px;">${param.axisValue}</div>
                  <div style="display: flex; align-items: center;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; border-radius: 50%; margin-right: 8px;"></span>
                    ${param.seriesName}: ${value}
                  </div>`;
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: chartData.categories || [],
        axisLine: {
          lineStyle: {
            color: colors.border,
          },
        },
        axisLabel: {
          color: colors.mutedText,
          interval: 0,
          rotate: 45,
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: colors.border,
          },
        },
        axisLabel: {
          color: colors.mutedText,
          formatter: (value: number) => {
            return new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value);
          },
        },
        splitLine: {
          lineStyle: {
            color: colors.border,
          },
        },
      },
      series: [
        {
          name: chartData.series?.[0]?.name || "Valor",
          type: "bar",
          data: chartData.series?.[0]?.data || [],
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colors.primary },
              { offset: 1, color: colors.primary + '80' },
            ]),
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colors.primary + '90' },
                { offset: 1, color: colors.primary },
              ]),
            },
          },
        },
      ],
    };
  };

  const getPieChartOption = (
    chartData: EChartsData,
    colors: ReturnType<typeof getThemeColors>
  ): echarts.EChartsOption => {
    const pieData =
      chartData.categories?.map((category, index) => ({
        name: category,
        value: chartData.series?.[0]?.data[index] || 0,
      })) || [];

    return {
      title: {
        text: chartData.title || "Distribuição por Status",
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: "bold",
          color: colors.text,
        },
      },
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          const percentage = params.percent;
          const value = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(params.value);
          return `<div style="font-weight: bold; margin-bottom: 8px;">${params.name}</div>
                  <div>Valor: ${value}</div>
                  <div>Percentual: ${percentage}%</div>`;
        },
      },
      legend: {
        orient: "vertical",
        left: "left",
        top: "middle",
        textStyle: {
          color: colors.text,
        },
      },
      series: [
        {
          name: "Status",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["60%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: "bold",
              color: colors.text,
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          labelLine: {
            show: false,
          },
          data: pieData,
          color: [
            colors.success,
            colors.warning,
            colors.destructive,
            colors.secondary,
            colors.primary,
          ],
        },
      ],
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`w-full ${className}`}
    >
      <div
        ref={chartRef}
        style={{ height: `${height}px`, width: "100%" }}
        className="bg-background rounded-lg"
      />
    </motion.div>
  );
};
