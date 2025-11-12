// API para gestión de precios dinámicos y ofertas inteligentes

export type ConditionType = 
  | 'time_of_day' 
  | 'day_of_week' 
  | 'client_inactivity' 
  | 'seasonal' 
  | 'demand_level'
  | 'client_loyalty'
  | 'service_type';

export type ActionType = 
  | 'percentage_discount' 
  | 'fixed_discount' 
  | 'fixed_price' 
  | 'percentage_increase';

export interface PricingCondition {
  type: ConditionType;
  // Para time_of_day
  from?: string;
  to?: string;
  days?: number[];
  // Para client_inactivity
  daysInactive?: number;
  // Para seasonal
  season?: 'spring' | 'summer' | 'fall' | 'winter';
  startDate?: string;
  endDate?: string;
  // Para demand_level
  remainingSlots?: number;
  // Para client_loyalty
  minMonthsAsClient?: number;
  // Para service_type
  serviceIds?: string[];
}

export interface PricingAction {
  type: ActionType;
  value: number;
  currency?: string;
}

export interface TargetAudience {
  type: 'all' | 'segment' | 'specific_clients';
  segmentId?: string;
  clientIds?: string[];
}

export interface DynamicPricingRule {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  priority: number; // Menor número = mayor prioridad
  conditions: PricingCondition[];
  action: PricingAction;
  targetAudience: TargetAudience;
  serviceIds?: string[]; // Servicios a los que se aplica
  createdAt: string;
  updatedAt?: string;
  stats?: {
    offersGenerated?: number;
    conversions?: number;
    additionalRevenue?: number;
  };
}

export interface PriceSimulation {
  originalPrice: number;
  finalPrice: number;
  discountAmount: number;
  appliedRuleId?: string;
  appliedRuleName?: string;
}

export interface SimulationContext {
  serviceId: string;
  clientId?: string;
  date?: string;
  time?: string;
}

// Funciones API simuladas (a implementar con backend real)
export const getDynamicPricingRules = async (): Promise<DynamicPricingRule[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockRules: DynamicPricingRule[] = [
    {
      id: 'rule_123',
      name: 'Descuento Horas Valle',
      description: 'Descuento del 15% en sesiones individuales en horario valle',
      isActive: true,
      priority: 10,
      conditions: [
        {
          type: 'time_of_day',
          from: '10:00',
          to: '14:00',
          days: [1, 2, 3, 4] // Lunes a Jueves
        }
      ],
      action: {
        type: 'percentage_discount',
        value: 15
      },
      targetAudience: {
        type: 'all'
      },
      serviceIds: ['service_1'],
      createdAt: '2023-10-15T09:00:00Z',
      stats: {
        offersGenerated: 45,
        conversions: 12,
        additionalRevenue: 720
      }
    },
    {
      id: 'rule_456',
      name: 'Oferta Reactivación',
      description: 'Descuento de 20€ para clientes inactivos más de 30 días',
      isActive: true,
      priority: 20,
      conditions: [
        {
          type: 'client_inactivity',
          daysInactive: 30
        }
      ],
      action: {
        type: 'fixed_discount',
        value: 20,
        currency: 'EUR'
      },
      targetAudience: {
        type: 'segment',
        segmentId: 'inactive_clients'
      },
      createdAt: '2023-10-01T10:00:00Z',
      stats: {
        offersGenerated: 18,
        conversions: 8,
        additionalRevenue: 640
      }
    },
    {
      id: 'rule_789',
      name: 'Oferta Verano',
      description: 'Descuento del 10% en programas de grupo durante el verano',
      isActive: false,
      priority: 15,
      conditions: [
        {
          type: 'seasonal',
          season: 'summer',
          startDate: '2024-06-01',
          endDate: '2024-08-31'
        }
      ],
      action: {
        type: 'percentage_discount',
        value: 10
      },
      targetAudience: {
        type: 'all'
      },
      serviceIds: ['service_group'],
      createdAt: '2023-09-15T08:00:00Z'
    }
  ];
  
  return mockRules;
};

export const createDynamicPricingRule = async (
  ruleData: Omit<DynamicPricingRule, 'id' | 'createdAt' | 'stats'>
): Promise<DynamicPricingRule> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const newRule: DynamicPricingRule = {
    id: `rule_${Date.now()}`,
    ...ruleData,
    createdAt: new Date().toISOString(),
    stats: {
      offersGenerated: 0,
      conversions: 0,
      additionalRevenue: 0
    }
  };
  
  return newRule;
};

export const updateDynamicPricingRule = async (
  ruleId: string,
  updates: Partial<DynamicPricingRule>
): Promise<DynamicPricingRule> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: PUT /api/monetization/dynamic-rules/{ruleId}
  const rules = await getDynamicPricingRules();
  const existing = rules.find(r => r.id === ruleId);
  
  if (!existing) {
    throw new Error('Regla no encontrada');
  }
  
  return {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };
};

export const deleteDynamicPricingRule = async (ruleId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log('Eliminando regla:', ruleId);
};

export const toggleRuleStatus = async (
  ruleId: string,
  isActive: boolean
): Promise<DynamicPricingRule> => {
  return await updateDynamicPricingRule(ruleId, { isActive });
};

export const simulatePrice = async (
  context: SimulationContext
): Promise<PriceSimulation> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Simulación simple: aplicar una regla si hay condiciones que coincidan
  const rules = await getDynamicPricingRules();
  const activeRules = rules
    .filter(r => r.isActive)
    .sort((a, b) => a.priority - b.priority);
  
  const originalPrice = 100; // Precio base del servicio
  let finalPrice = originalPrice;
  let appliedRule: DynamicPricingRule | null = null;
  
  // Lógica simple de simulación
  for (const rule of activeRules) {
    const condition = rule.conditions[0];
    if (condition?.type === 'time_of_day' && context.time) {
      const time = context.time;
      if (time >= (condition.from || '') && time <= (condition.to || '')) {
        appliedRule = rule;
        if (rule.action.type === 'percentage_discount') {
          finalPrice = originalPrice * (1 - rule.action.value / 100);
        } else if (rule.action.type === 'fixed_discount') {
          finalPrice = Math.max(0, originalPrice - rule.action.value);
        }
        break;
      }
    }
  }
  
  return {
    originalPrice,
    finalPrice,
    discountAmount: originalPrice - finalPrice,
    appliedRuleId: appliedRule?.id,
    appliedRuleName: appliedRule?.name
  };
};





















