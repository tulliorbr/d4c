/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { motion } from "framer-motion";

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

  useEffect(() => {
    if (!chartRef.current || !data) return;

    // Initialize chart
    chartInstance.current = echarts.init(chartRef.current);

    // Configure chart based on type
    let option: echarts.EChartsOption = {};

    switch (type) {
      case "line":
        option = getLineChartOption(data);
        break;
      case "bar":
        option = getBarChartOption(data);
        break;
      case "pie":
        option = getPieChartOption(data);
        break;
    }

    chartInstance.current.setOption(option);

    // Handle resize
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
    };
  }, [data, type]);

  const getLineChartOption = (
    chartData: EChartsData
  ): echarts.EChartsOption => {
    return {
      title: {
        text: chartData.title || "Entradas x Saídas por Mês",
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: "bold",
          color: "hsl(var(--foreground))",
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
          color: "hsl(var(--foreground))",
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
            color: "hsl(var(--border))",
          },
        },
        axisLabel: {
          color: "hsl(var(--muted-foreground))",
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: "hsl(var(--border))",
          },
        },
        axisLabel: {
          color: "hsl(var(--muted-foreground))",
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
            color: "hsl(var(--border))",
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
            color:
              index === 0 ? "hsl(var(--success))" : "hsl(var(--destructive))",
          },
        })) || [],
    };
  };

  const getBarChartOption = (chartData: EChartsData): echarts.EChartsOption => {
    return {
      title: {
        text: chartData.title || "Top 5 Categorias por Valor",
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: "bold",
          color: "hsl(var(--foreground))",
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
            color: "hsl(var(--border))",
          },
        },
        axisLabel: {
          color: "hsl(var(--muted-foreground))",
          interval: 0,
          rotate: 45,
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: "hsl(var(--border))",
          },
        },
        axisLabel: {
          color: "hsl(var(--muted-foreground))",
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
            color: "hsl(var(--border))",
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
              { offset: 0, color: "hsl(var(--primary))" },
              { offset: 1, color: "hsl(var(--primary) / 0.8)" },
            ]),
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "hsl(var(--primary) / 0.9)" },
                { offset: 1, color: "hsl(var(--primary))" },
              ]),
            },
          },
        },
      ],
    };
  };

  const getPieChartOption = (chartData: EChartsData): echarts.EChartsOption => {
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
          color: "hsl(var(--foreground))",
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
          color: "hsl(var(--foreground))",
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
              color: "hsl(var(--foreground))",
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
            "hsl(var(--success))",
            "hsl(var(--warning))",
            "hsl(var(--destructive))",
            "hsl(var(--secondary))",
            "hsl(var(--primary))",
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
