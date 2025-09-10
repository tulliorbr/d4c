/* eslint-disable @typescript-eslint/no-require-imports */

export { useETLStore, useETLSelectors } from './useETLStore';
export { useReportsStore, useReportsSelectors } from './useReportsStore';
export { useObservabilityStore, useObservabilitySelectors } from './useObservabilityStore';

export type {
  ETLState,
  ETLExecution,
  ETLFormData
} from './useETLStore';

export type {
  ReportsState,
  ChartData
} from './useReportsStore';

export type {
  ObservabilityState
} from './useObservabilityStore';

export const storeUtils = {
  isAnyStoreLoading: () => {
    const { useETLStore } = require('./useETLStore');
    const { useReportsStore } = require('./useReportsStore');
    const { useObservabilityStore } = require('./useObservabilityStore');

    const etlStore = useETLStore.getState();
    const reportsStore = useReportsStore.getState();
    const observabilityStore = useObservabilityStore.getState();

    return (
      etlStore.loading ||
      etlStore.historyLoading ||
      reportsStore.loading.kpis ||
      reportsStore.loading.charts ||
      reportsStore.loading.table ||
      observabilityStore.loading.lotes ||
      observabilityStore.loading.itens ||
      observabilityStore.loading.metricas
    );
  },

  getAllErrors: () => {
    const { useETLStore } = require('./useETLStore');
    const { useReportsStore } = require('./useReportsStore');
    const { useObservabilityStore } = require('./useObservabilityStore');

    const etlStore = useETLStore.getState();
    const reportsStore = useReportsStore.getState();
    const observabilityStore = useObservabilityStore.getState();

    const errors: string[] = [];

    if (etlStore.error) errors.push(`ETL: ${etlStore.error}`);

    if (reportsStore.errors.kpis) errors.push(`Reports KPIs: ${reportsStore.errors.kpis}`);
    if (reportsStore.errors.charts) errors.push(`Reports Charts: ${reportsStore.errors.charts}`);
    if (reportsStore.errors.table) errors.push(`Reports Table: ${reportsStore.errors.table}`);

    if (observabilityStore.errors.lotes) errors.push(`Observability Lotes: ${observabilityStore.errors.lotes}`);
    if (observabilityStore.errors.itens) errors.push(`Observability Itens: ${observabilityStore.errors.itens}`);
    if (observabilityStore.errors.metricas) errors.push(`Observability Métricas: ${observabilityStore.errors.metricas}`);

    return errors;
  },

  clearAllErrors: () => {
    const { useETLStore } = require('./useETLStore');
    const { useReportsStore } = require('./useReportsStore');
    const { useObservabilityStore } = require('./useObservabilityStore');

    useETLStore.getState().limparErro();
    useReportsStore.getState().clearErrors();
    useObservabilityStore.getState().clearErrors();
  }
};

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