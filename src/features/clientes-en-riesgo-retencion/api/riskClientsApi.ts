import {
  ClientRisk,
  RiskFilters,
  RetentionAction,
  RetentionAnalytics,
  RiskClientsResponse,
  BatchActionRequest,
  UserRole,
  PaginationMeta,
} from '../types';

// Mock data generator
const generateMockClients = (role: UserRole, count: number = 20): ClientRisk[] => {
  const clients: ClientRisk[] = [];
  const names = [
    'Juan Pérez', 'María García', 'Carlos Rodríguez', 'Ana Martínez', 'Luis Sánchez',
    'Laura López', 'Pedro González', 'Carmen Fernández', 'Miguel Torres', 'Isabel Ruiz',
    'David Ramírez', 'Elena Díaz', 'Javier Moreno', 'Sofía Herrera', 'Francisco Jiménez',
    'Lucía Martín', 'Antonio Romero', 'Marta Suárez', 'José Gómez', 'Patricia Navarro'
  ];

  for (let i = 0; i < count; i++) {
    const riskLevels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    
    if (role === 'gym') {
      const paymentStatuses: ('paid' | 'failed' | 'pending_renewal')[] = ['paid', 'failed', 'pending_renewal'];
      clients.push({
        id: `client_${i + 1}`,
        name: names[i % names.length],
        email: `${names[i % names.length].toLowerCase().replace(' ', '.')}@example.com`,
        phone: `+34 600 ${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        riskLevel,
        lastCheckIn: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        daysSinceLastCheckIn: Math.floor(Math.random() * 60) + 1,
        membership: ['Plan Premium', 'Plan Básico', 'Plan VIP', 'Plan Familiar'][Math.floor(Math.random() * 4)],
        paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
        mrr: Math.floor(Math.random() * 200) + 50,
      });
    } else {
      clients.push({
        id: `client_${i + 1}`,
        name: names[i % names.length],
        email: `${names[i % names.length].toLowerCase().replace(' ', '.')}@example.com`,
        phone: `+34 600 ${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        riskLevel,
        missedSessions: Math.floor(Math.random() * 5),
        lastSessionDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        workoutAdherence: Math.floor(Math.random() * 100),
        nutritionAdherence: Math.floor(Math.random() * 100),
        lastCommunication: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
  }
  
  return clients;
};

// API Functions
export const riskClientsApi = {
  /**
   * Obtiene lista paginada de clientes en riesgo
   */
  async getRiskClients(
    role: UserRole,
    filters: RiskFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<RiskClientsResponse> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    let clients = generateMockClients(role, 150);

    // Aplicar filtros
    if (filters.riskLevel) {
      clients = clients.filter(c => c.riskLevel === filters.riskLevel);
    }

    if (role === 'gym') {
      if (filters.lastCheckInDays !== undefined) {
        clients = clients.filter(c => 
          c.daysSinceLastCheckIn !== undefined && 
          c.daysSinceLastCheckIn >= filters.lastCheckInDays!
        );
      }
      if (filters.paymentStatus) {
        clients = clients.filter(c => c.paymentStatus === filters.paymentStatus);
      }
    } else {
      if (filters.missedSessions !== undefined) {
        clients = clients.filter(c => 
          c.missedSessions !== undefined && 
          c.missedSessions >= filters.missedSessions!
        );
      }
      if (filters.minWorkoutAdherence !== undefined) {
        clients = clients.filter(c => 
          c.workoutAdherence !== undefined && 
          c.workoutAdherence <= filters.minWorkoutAdherence!
        );
      }
      if (filters.minNutritionAdherence !== undefined) {
        clients = clients.filter(c => 
          c.nutritionAdherence !== undefined && 
          c.nutritionAdherence <= filters.minNutritionAdherence!
        );
      }
    }

    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedClients = clients.slice(startIndex, endIndex);

    return {
      data: paginatedClients,
      pagination: {
        total: clients.length,
        page,
        limit,
        totalPages: Math.ceil(clients.length / limit),
      },
    };
  },

  /**
   * Obtiene analytics del dashboard de retención
   */
  async getAnalytics(role: UserRole): Promise<RetentionAnalytics> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const baseAnalytics: RetentionAnalytics = {
      totalAtRisk: 150,
      churnRateMonthly: 5.2,
      retentionSuccessRate: 35.5,
      avgDaysSinceLastVisit: 28,
      riskDistribution: {
        low: 80,
        medium: 50,
        high: 20,
      },
    };

    if (role === 'gym') {
      return {
        ...baseAnalytics,
        mrrAtRisk: 7500,
      };
    }

    return baseAnalytics;
  },

  /**
   * Registra una acción de retención para un cliente
   */
  async createRetentionAction(
    clientId: string,
    action: Omit<RetentionAction, 'id' | 'createdAt' | 'agentId'>
  ): Promise<RetentionAction> {
    await new Promise(resolve => setTimeout(resolve, 400));

    return {
      id: `action_${Date.now()}`,
      clientId,
      agentId: 'current_user_123',
      ...action,
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * Ejecuta una acción en lote para múltiples clientes
   */
  async executeBatchAction(request: BatchActionRequest): Promise<{
    status: 'success' | 'partial';
    message: string;
    details: {
      successful: number;
      failed: number;
    };
  }> {
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simular algunos fallos aleatorios
    const failedCount = Math.floor(Math.random() * request.clientIds.length * 0.1);
    const successful = request.clientIds.length - failedCount;

    return {
      status: failedCount === 0 ? 'success' : 'partial',
      message: `Acción en lote procesada para ${request.clientIds.length} clientes.`,
      details: {
        successful,
        failed: failedCount,
      },
    };
  },
};

