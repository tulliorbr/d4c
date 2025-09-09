import { useState, useEffect } from 'react';

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
  const [stores, setStores] = useState<StoreStatusMap>({
    etl: { loading: false, hasErrors: false },
    reports: { loading: false, hasErrors: false },
    observability: { loading: false, hasErrors: false }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  // Simular verificação de status dos módulos
  useEffect(() => {
    const checkStatus = async () => {
      setIsLoading(true);
      
      try {
        // Simular verificação de conectividade com backend
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Atualizar status dos stores
        setStores({
          etl: { loading: false, hasErrors: false, lastUpdate: new Date() },
          reports: { loading: false, hasErrors: false, lastUpdate: new Date() },
          observability: { loading: false, hasErrors: false, lastUpdate: new Date() }
        });
        
        setHasErrors(false);
      } catch (error) {
        console.error('Erro ao verificar status dos módulos:', error);
        setHasErrors(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
    
    // Verificar status a cada 30 segundos
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