import { useState, useEffect } from 'react';
import { healthService } from '../services/healthService';
import { useETLStore } from '../stores/useETLStore';

interface StoreStatus {
  loading: boolean;
  hasErrors: boolean;
  lastUpdate?: Date;
}

interface StoreStatusMap {
  etl: StoreStatus;
  reports: StoreStatus;
  observability: StoreStatus;
}

export const useStoreStatus = () => {
  const { loadExecutionHistory } = useETLStore();

  const [stores, setStores] = useState<StoreStatusMap>({
    etl: { loading: false, hasErrors: false },
    reports: { loading: false, hasErrors: false },
    observability: { loading: false, hasErrors: false }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      setIsLoading(true);

      try {
        const [healthResponse] = await Promise.all([
          healthService.getSystemHealth(),
          loadExecutionHistory()
        ]);
        const storeStatuses = healthService.mapComponentsToStores(healthResponse);

        const updatedStores: StoreStatusMap = {
          etl: {
            loading: storeStatuses.etl?.isLoading ?? false,
            hasErrors: storeStatuses.etl?.hasErrors ?? false,
            lastUpdate: storeStatuses.etl?.lastCheck ?? new Date()
          },
          reports: {
            loading: storeStatuses.reports?.isLoading ?? false,
            hasErrors: storeStatuses.reports?.hasErrors ?? false,
            lastUpdate: storeStatuses.reports?.lastCheck ?? new Date()
          },
          observability: {
            loading: storeStatuses.observability?.isLoading ?? false,
            hasErrors: storeStatuses.observability?.hasErrors ?? false,
            lastUpdate: storeStatuses.observability?.lastCheck ?? new Date()
          }
        };

        setStores(updatedStores);

        const hasAnyErrors = Object.values(updatedStores).some(store => store.hasErrors);
        setHasErrors(hasAnyErrors);

      } catch (error) {
        console.error('Erro ao verificar status dos módulos:', error);

        setStores({
          etl: { loading: false, hasErrors: true, lastUpdate: new Date() },
          reports: { loading: false, hasErrors: true, lastUpdate: new Date() },
          observability: { loading: false, hasErrors: true, lastUpdate: new Date() }
        });

        setHasErrors(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();

    const interval = setInterval(checkStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  const updateStoreStatus = (storeId: keyof StoreStatusMap, status: Partial<StoreStatus>) => {
    setStores(prev => ({
      ...prev,
      [storeId]: {
        ...prev[storeId],
        ...status,
        lastUpdate: new Date()
      }
    }));
  };

  return {
    stores,
    isLoading,
    hasErrors,
    updateStoreStatus
  };
};