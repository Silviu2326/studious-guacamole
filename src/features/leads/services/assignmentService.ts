import { Lead, LeadSource } from '../types';
import { getLeads, updateLead } from '../api/leads';

export type AssignmentRuleType = 'round_robin' | 'by_specialty' | 'by_load' | 'by_score' | 'by_source' | 'manual';

export interface AssignmentRule {
  id: string;
  name: string;
  type: AssignmentRuleType;
  businessType: 'entrenador' | 'gimnasio';
  enabled: boolean;
  priority: number; // Mayor número = mayor prioridad
  conditions?: {
    source?: LeadSource[];
    scoreMin?: number;
    scoreMax?: number;
    stage?: Lead['stage'][];
  };
  config?: {
    // Para round_robin
    userIds?: string[];
    // Para by_specialty
    specialtyMap?: Record<string, string[]>; // { 'perdida_peso': ['user1', 'user2'] }
    // Para by_load
    maxLeadsPerUser?: number;
    // Para by_score
    scoreThreshold?: number;
    // Para by_source
    sourceUserMap?: Record<LeadSource, string[]>;
  };
  reassignmentConfig?: {
    enabled: boolean;
    noResponseHours: number; // Reasignar si no hay respuesta en X horas
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserLoad {
  userId: string;
  userName: string;
  activeLeads: number;
  pendingResponse: number;
  convertedThisMonth: number;
  averageResponseTime: number; // en horas
}

export interface AssignmentStats {
  totalUsers: number;
  totalAssigned: number;
  totalReassigned: number;
  activeRules: number;
}

// Mock data storage
let mockRules: AssignmentRule[] = [];
let userLoads: Map<string, UserLoad> = new Map();

// Inicializar datos de ejemplo
const initializeMockData = () => {
  if (mockRules.length > 0) return;

  const now = new Date();

  mockRules = [
    {
      id: 'rule1',
      name: 'Round Robin - Equipo de Ventas',
      type: 'round_robin',
      businessType: 'gimnasio',
      enabled: true,
      priority: 3,
      conditions: {
        stage: ['captacion', 'interes']
      },
      config: {
        userIds: ['2', 'user3', 'user4'] // IDs de vendedores
      },
      reassignmentConfig: {
        enabled: true,
        noResponseHours: 24
      },
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: now
    },
    {
      id: 'rule2',
      name: 'Por Score - Leads Calientes',
      type: 'by_score',
      businessType: 'gimnasio',
      enabled: true,
      priority: 5, // Mayor prioridad
      conditions: {
        scoreMin: 75
      },
      config: {
        userIds: ['2'], // Asignar al mejor vendedor
        scoreThreshold: 75
      },
      createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
      updatedAt: now
    },
    {
      id: 'rule3',
      name: 'Por Fuente - Google Ads',
      type: 'by_source',
      businessType: 'gimnasio',
      enabled: true,
      priority: 4,
      conditions: {
        source: ['google_ads']
      },
      config: {
        sourceUserMap: {
          google_ads: ['user3'] // Vendedor especializado en Google Ads
        }
      },
      createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      updatedAt: now
    },
    {
      id: 'rule4',
      name: 'Por Carga - Distribución Equitativa',
      type: 'by_load',
      businessType: 'gimnasio',
      enabled: true,
      priority: 2,
      config: {
        userIds: ['2', 'user3', 'user4'],
        maxLeadsPerUser: 20
      },
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: now
    }
  ];
};

// Calcular carga de usuarios
const calculateUserLoads = async (businessType: 'entrenador' | 'gimnasio'): Promise<Map<string, UserLoad>> => {
  const leads = await getLeads({ businessType });
  const loads = new Map<string, UserLoad>();

  leads.forEach(lead => {
    if (!lead.assignedTo) return;

    const existing = loads.get(lead.assignedTo) || {
      userId: lead.assignedTo,
      userName: `Usuario ${lead.assignedTo}`,
      activeLeads: 0,
      pendingResponse: 0,
      convertedThisMonth: 0,
      averageResponseTime: 0,
      totalResponseTime: 0,
      responseCount: 0
    };

    // Contar leads activos
    if (lead.status !== 'converted' && lead.status !== 'lost') {
      existing.activeLeads += 1;

      // Contar pendientes de respuesta
      if (lead.lastContactDate) {
        const hoursSinceContact = (Date.now() - new Date(lead.lastContactDate).getTime()) / (1000 * 60 * 60);
        if (hoursSinceContact > 24) {
          existing.pendingResponse += 1;
        }
      } else {
        existing.pendingResponse += 1;
      }
    }

    // Contar convertidos este mes
    if (lead.status === 'converted' && lead.conversionDate) {
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      if (lead.conversionDate >= monthStart) {
        existing.convertedThisMonth += 1;
      }
    }

    // Calcular tiempo promedio de respuesta
    if (lead.interactions.length > 0) {
      lead.interactions.forEach(interaction => {
        if (interaction.type === 'whatsapp_replied' || interaction.type === 'email_opened') {
          const hours = (new Date(interaction.date).getTime() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60);
          existing.totalResponseTime = (existing.totalResponseTime || 0) + hours;
          existing.responseCount = (existing.responseCount || 0) + 1;
        }
      });
    }

    loads.set(lead.assignedTo, existing);
  });

  // Calcular promedio de tiempo de respuesta
  loads.forEach(load => {
    if (load.responseCount > 0) {
      load.averageResponseTime = (load as any).totalResponseTime / (load as any).responseCount;
    }
    delete (load as any).totalResponseTime;
    delete (load as any).responseCount;
  });

  return loads;
};

export class AssignmentService {
  // Alias para compatibilidad
  static async getAssignmentRules(): Promise<AssignmentRule[]> {
    return this.getRules('gimnasio');
  }
  // Obtener todas las reglas
  static async getRules(businessType?: 'entrenador' | 'gimnasio'): Promise<AssignmentRule[]> {
    initializeMockData();
    let rules = [...mockRules];

    if (businessType) {
      rules = rules.filter(r => r.businessType === businessType);
    }

    return rules.filter(r => r.enabled).sort((a, b) => b.priority - a.priority);
  }

  // Obtener una regla por ID
  static async getRule(id: string): Promise<AssignmentRule | null> {
    initializeMockData();
    return mockRules.find(r => r.id === id) || null;
  }

  // Crear nueva regla
  static async createRule(rule: Omit<AssignmentRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<AssignmentRule> {
    initializeMockData();

    const newRule: AssignmentRule = {
      ...rule,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockRules.push(newRule);
    return newRule;
  }

  // Actualizar regla
  static async updateRule(id: string, updates: Partial<AssignmentRule>): Promise<AssignmentRule> {
    initializeMockData();
    const index = mockRules.findIndex(r => r.id === id);

    if (index === -1) {
      throw new Error('Rule not found');
    }

    mockRules[index] = {
      ...mockRules[index],
      ...updates,
      updatedAt: new Date()
    };

    return mockRules[index];
  }

  // Eliminar regla
  static async deleteRule(id: string): Promise<void> {
    initializeMockData();
    const index = mockRules.findIndex(r => r.id === id);
    if (index !== -1) {
      mockRules.splice(index, 1);
    }
  }

  // Asignar lead automáticamente según reglas
  static async assignLead(lead: Lead): Promise<string | null> {
    const rules = await this.getRules(lead.businessType);
    const loads = await calculateUserLoads(lead.businessType);

    for (const rule of rules) {
      // Verificar condiciones
      if (!this.checkConditions(rule, lead)) continue;

      // Aplicar regla
      const assignedUserId = await this.applyRule(rule, lead, loads);
      if (assignedUserId) {
        return assignedUserId;
      }
    }

    return null;
  }

  // Verificar si un lead cumple las condiciones de una regla
  private static checkConditions(rule: AssignmentRule, lead: Lead): boolean {
    if (!rule.conditions) return true;

    if (rule.conditions.source && !rule.conditions.source.includes(lead.source)) {
      return false;
    }

    if (rule.conditions.scoreMin !== undefined && lead.score < rule.conditions.scoreMin) {
      return false;
    }

    if (rule.conditions.scoreMax !== undefined && lead.score > rule.conditions.scoreMax) {
      return false;
    }

    if (rule.conditions.stage && !rule.conditions.stage.includes(lead.stage)) {
      return false;
    }

    return true;
  }

  // Aplicar una regla de asignación
  private static async applyRule(
    rule: AssignmentRule,
    lead: Lead,
    loads: Map<string, UserLoad>
  ): Promise<string | null> {
    if (!rule.config) return null;

    switch (rule.type) {
      case 'round_robin':
        return this.applyRoundRobin(rule, loads);

      case 'by_load':
        return this.applyByLoad(rule, loads);

      case 'by_score':
        return this.applyByScore(rule, lead, loads);

      case 'by_source':
        return this.applyBySource(rule, lead, loads);

      case 'by_specialty':
        return this.applyBySpecialty(rule, lead, loads);

      default:
        return null;
    }
  }

  // Round Robin: asignar rotativamente
  private static applyRoundRobin(rule: AssignmentRule, loads: Map<string, UserLoad>): string | null {
    if (!rule.config?.userIds || rule.config.userIds.length === 0) return null;

    // Obtener último usuario asignado (simulado con timestamp)
    const lastAssignedIndex = Math.floor(Date.now() / 1000) % rule.config.userIds.length;
    return rule.config.userIds[lastAssignedIndex] || null;
  }

  // Por carga: asignar al usuario con menos leads
  private static applyByLoad(rule: AssignmentRule, loads: Map<string, UserLoad>): string | null {
    if (!rule.config?.userIds || rule.config.userIds.length === 0) return null;

    let minLoad = Infinity;
    let selectedUser: string | null = null;

    for (const userId of rule.config.userIds) {
      const load = loads.get(userId);
      const activeLeads = load?.activeLeads || 0;

      if (activeLeads < minLoad) {
        minLoad = activeLeads;
        selectedUser = userId;
      }
    }

    return selectedUser;
  }

  // Por score: asignar leads calientes al mejor vendedor
  private static applyByScore(rule: AssignmentRule, lead: Lead, loads: Map<string, UserLoad>): string | null {
    if (!rule.config?.userIds || rule.config.userIds.length === 0) return null;

    // Si el score es alto, asignar al usuario con mejor tasa de conversión
    if (lead.score >= (rule.config.scoreThreshold || 75)) {
      let bestUser: string | null = null;
      let bestRate = 0;

      for (const userId of rule.config.userIds) {
        const load = loads.get(userId);
        if (load) {
          const conversionRate = load.activeLeads > 0
            ? load.convertedThisMonth / load.activeLeads
            : 0;

          if (conversionRate > bestRate) {
            bestRate = conversionRate;
            bestUser = userId;
          }
        }
      }

      return bestUser || rule.config.userIds[0];
    }

    return null;
  }

  // Por fuente: asignar según el origen del lead
  private static applyBySource(rule: AssignmentRule, lead: Lead, loads: Map<string, UserLoad>): string | null {
    if (!rule.config?.sourceUserMap) return null;

    const users = rule.config.sourceUserMap[lead.source];
    if (users && users.length > 0) {
      // Round robin entre usuarios asignados a esa fuente
      const index = Math.floor(Date.now() / 1000) % users.length;
      return users[index];
    }

    return null;
  }

  // Por especialidad: asignar según características del lead
  private static applyBySpecialty(rule: AssignmentRule, lead: Lead, loads: Map<string, UserLoad>): string | null {
    if (!rule.config?.specialtyMap) return null;

    // Buscar especialidad en tags o customFields
    const leadTags = lead.tags || [];
    const customFields = lead.customFields || {};

    for (const [specialty, userIds] of Object.entries(rule.config.specialtyMap)) {
      if (leadTags.includes(specialty) || customFields.especialidad === specialty) {
        if (userIds.length > 0) {
          const index = Math.floor(Date.now() / 1000) % userIds.length;
          return userIds[index];
        }
      }
    }

    return null;
  }

  // Reasignar leads sin respuesta
  static async reassignUnresponsiveLeads(businessType: 'entrenador' | 'gimnasio'): Promise<number> {
    const rules = await this.getRules(businessType);
    const leads = await getLeads({ businessType });
    const loads = await calculateUserLoads(businessType);
    let reassignedCount = 0;

    for (const rule of rules) {
      if (!rule.reassignmentConfig?.enabled) continue;

      const hoursThreshold = rule.reassignmentConfig.noResponseHours;

      for (const lead of leads) {
        if (!lead.assignedTo) continue;
        if (lead.status === 'converted' || lead.status === 'lost') continue;

        const hoursSinceContact = lead.lastContactDate
          ? (Date.now() - new Date(lead.lastContactDate).getTime()) / (1000 * 60 * 60)
          : (Date.now() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60);

        if (hoursSinceContact >= hoursThreshold) {
          // Intentar reasignar
          const newUserId = await this.applyRule(rule, lead, loads);
          if (newUserId && newUserId !== lead.assignedTo) {
            await updateLead(lead.id, { assignedTo: newUserId });
            reassignedCount++;
          }
        }
      }
    }

    return reassignedCount;
  }

  // Obtener carga de usuarios
  static async getUserLoads(businessType: 'entrenador' | 'gimnasio'): Promise<UserLoad[]> {
    const loads = await calculateUserLoads(businessType);
    return Array.from(loads.values()).sort((a, b) => b.activeLeads - a.activeLeads);
  }

  // Obtener estadísticas de asignación
  static async getAssignmentStats(): Promise<AssignmentStats> {
    initializeMockData();
    const rules = await this.getRules('gimnasio');
    const leads = await getLeads({ businessType: 'gimnasio' });
    const loads = await calculateUserLoads('gimnasio');

    const totalAssigned = leads.filter(l => l.assignedTo).length;
    const activeRules = rules.filter(r => r.enabled).length;

    // Contar reasignaciones (simulado - en producción vendría del historial)
    const totalReassigned = Math.floor(totalAssigned * 0.1); // Aproximación

    return {
      totalUsers: loads.size,
      totalAssigned,
      totalReassigned,
      activeRules
    };
  }
}

