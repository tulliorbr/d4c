import { AppConfig } from '../types/domain';

export const appConfig: AppConfig = {
  apiBaseUrl: 'http://localhost:5131/api',
  defaultPageSize: 20,
  refreshInterval: 5000,
  animationDuration: 300,
  chartColors: [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#06B6D4',
    '#84CC16',
    '#F97316',
    '#EC4899',
    '#6366F1',
  ],
  dateFormat: 'dd/MM/yyyy',
  currencyFormat: {
    locale: 'pt-BR',
    currency: 'BRL'
  }
};

export const env = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiUrl: import.meta.env.VITE_API_URL || appConfig.apiBaseUrl,
};

export const navigation = {
  items: [
    {
      id: 'etl',
      label: 'ETL',
      icon: 'Database',
      path: '/etl',
      description: 'Execução de processos ETL'
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: 'BarChart3',
      path: '/reports',
      description: 'Dashboards e análises'
    },
    {
      id: 'observability',
      label: 'Observabilidade',
      icon: 'Activity',
      path: '/observability',
      description: 'Monitoramento e métricas'
    }
  ]
};

export const theme = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    success: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
  },
};

export const animations = {
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  },
  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.2 }
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.2 }
  },
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
};

export const chartDefaults = {
  animation: true,
  animationDuration: 750,
  animationEasing: 'cubicOut',
  backgroundColor: 'transparent',
  textStyle: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 12,
    color: '#374151'
  },
  tooltip: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 8,
    textStyle: {
      color: '#374151',
      fontSize: 12
    },
    extraCssText: 'box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '10%',
    containLabel: true
  },
  legend: {
    textStyle: {
      color: '#6b7280',
      fontSize: 12
    }
  }
};

export const validation = {
  rules: {
    required: (message = 'Campo obrigatório') => ({
      required: true,
      message
    }),
    email: (message = 'Email inválido') => ({
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message
    }),
    minLength: (min: number, message?: string) => ({
      min,
      message: message || `Mínimo de ${min} caracteres`
    }),
    maxLength: (max: number, message?: string) => ({
      max,
      message: message || `Máximo de ${max} caracteres`
    }),
    number: (message = 'Deve ser um número') => ({
      pattern: /^\d+$/,
      message
    }),
    currency: (message = 'Valor monetário inválido') => ({
      pattern: /^\d+([.,]\d{1,2})?$/,
      message
    })
  }
};

export const formatters = {
  currency: (value: number): string => {
    return new Intl.NumberFormat(appConfig.currencyFormat.locale, {
      style: 'currency',
      currency: appConfig.currencyFormat.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  },

  number: (value: number, decimals = 0): string => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  },

  percentage: (value: number, decimals = 1): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value / 100);
  },

  date: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('pt-BR').format(d);
  },

  dateTime: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(d);
  },

  duration: (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
};

export const timing = {
  debounce: {
    search: 300,
    input: 500,
    resize: 250
  },
  throttle: {
    scroll: 100,
    api: 1000
  }
};