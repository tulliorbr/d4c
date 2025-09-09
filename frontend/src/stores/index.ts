// Store exports
export { useETLStore, useETLSelectors } from './useETLStore';
export { useReportsStore, useReportsSelectors } from './useReportsStore';
export { useObservabilityStore, useObservabilitySelectors } from './useObservabilityStore';

// Store types
export type {
  ETLState,
  ETLExecution,
  ETLFormData
} from './useETLStore';

export type {
  ReportsState,
  ChartData,
  KPIData
} from './useReportsStore';

export type {
  ObservabilityState,
  ExecutionSummary
} from './useObservabilityStore';

// Common store utilities
export const storeUtils = {
  // Reset all stores
  resetAllStores: () => {
    // Note: Individual stores should implement their own reset methods
    console.log('Resetting all stores...');
  },
  
  // Check if any store is loading
  isAnyStoreLoading: () => {
    const etlStore = useETLStore.getState();
    const reportsStore = useReportsStore.getState();
    const observabilityStore = useObservabilityStore.getState();
    
    return (
      etlStore.loading.executions ||
      etlStore.loading.history ||
      reportsStore.loading.kpis ||
      reportsStore.loading.charts ||
      reportsStore.loading.table ||
      observabilityStore.loading.lotes ||
      observabilityStore.loading.itens ||
      observabilityStore.loading.metricas ||
      observabilityStore.loading.resumo
    );
  },
  
  // Get all store errors
  getAllErrors: () => {
    const etlStore = useETLStore.getState();
    const reportsStore = useReportsStore.getState();
    const observabilityStore = useObservabilityStore.getState();
    
    const errors: string[] = [];
    
    // ETL errors
    if (etlStore.errors.executions) errors.push(`ETL: ${etlStore.errors.executions}`);
    if (etlStore.errors.history) errors.push(`ETL History: ${etlStore.errors.history}`);
    
    // Reports errors
    if (reportsStore.errors.kpis) errors.push(`Reports KPIs: ${reportsStore.errors.kpis}`);
    if (reportsStore.errors.charts) errors.push(`Reports Charts: ${reportsStore.errors.charts}`);
    if (reportsStore.errors.table) errors.push(`Reports Table: ${reportsStore.errors.table}`);
    
    // Observability errors
    if (observabilityStore.errors.lotes) errors.push(`Observability Lotes: ${observabilityStore.errors.lotes}`);
    if (observabilityStore.errors.itens) errors.push(`Observability Itens: ${observabilityStore.errors.itens}`);
    if (observabilityStore.errors.metricas) errors.push(`Observability Métricas: ${observabilityStore.errors.metricas}`);
    if (observabilityStore.errors.resumo) errors.push(`Observability Resumo: ${observabilityStore.errors.resumo}`);
    
    return errors;
  },
  
  // Clear all errors
  clearAllErrors: () => {
    useETLStore.getState().clearErrors();
    useReportsStore.getState().clearErrors();
    useObservabilityStore.getState().clearErrors();
  }
};

// Store hooks for common operations
export const useStoreStatus = () => {
  return {
    isLoading: false,
    hasErrors: false,
    stores: {
      etl: {
        loading: false,
        hasErrors: false
      },
      reports: {
        loading: false,
        hasErrors: false
      },
      observability: {
        loading: false,
        hasErrors: false
      }
    }
  };
};