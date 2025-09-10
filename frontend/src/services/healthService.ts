/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ComponentHealth {
  status: 'Healthy' | 'Degraded' | 'Unhealthy';
  description: string;
  details?: Record<string, any>;
  responseTimeMs: number;
}

export interface HealthCheckResponse {
  status: 'Healthy' | 'Degraded' | 'Unhealthy';
  timestamp: string;
  components: Record<string, ComponentHealth>;
  responseTimeMs: number;
}

export interface StoreStatus {
  isLoading: boolean;
  hasErrors: boolean;
  lastCheck?: Date;
  details?: ComponentHealth;
}

class HealthService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = 'http://localhost:5131/api';
  }

  async getSystemHealth(): Promise<HealthCheckResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: HealthCheckResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao verificar health check:', error);

      return {
        status: 'Unhealthy',
        timestamp: new Date().toISOString(),
        components: {
          system: {
            status: 'Unhealthy',
            description: error instanceof Error ? error.message : 'Erro desconhecido',
            responseTimeMs: 0
          }
        },
        responseTimeMs: 0
      };
    }
  }

  async getDatabaseHealth(): Promise<ComponentHealth> {
    try {
      const response = await fetch(`${this.baseUrl}/health/database`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ComponentHealth = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao verificar saúde do banco:', error);

      return {
        status: 'Unhealthy',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        responseTimeMs: 0
      };
    }
  }

  convertToStoreStatus(componentHealth: ComponentHealth): StoreStatus {
    return {
      isLoading: false,
      hasErrors: componentHealth.status !== 'Healthy',
      lastCheck: new Date(),
      details: componentHealth
    };
  }


  mapComponentsToStores(healthResponse: HealthCheckResponse): Record<string, StoreStatus> {
    const storeMap: Record<string, StoreStatus> = {};

    const componentMapping = {
      'Database': 'etl',
      'ETL': 'etl',
      'Reports': 'reports',
      'Observability': 'observability'
    };

    Object.entries(healthResponse.components).forEach(([componentName, health]) => {
      const storeName = componentMapping[componentName as keyof typeof componentMapping];
      if (storeName) {
        storeMap[storeName] = this.convertToStoreStatus(health);
      }
    });

    if (Object.keys(storeMap).length === 0) {
      const generalStatus: StoreStatus = {
        isLoading: false,
        hasErrors: healthResponse.status !== 'Healthy',
        lastCheck: new Date()
      };

      storeMap.etl = generalStatus;
      storeMap.reports = generalStatus;
      storeMap.observability = generalStatus;
    }

    return storeMap;
  }
}

export const healthService = new HealthService();
export default healthService;