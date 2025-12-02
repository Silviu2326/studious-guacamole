import { 
  NurturingSequence, 
  NurturingStep, 
  NurturingTrigger, 
  NurturingMetrics,
  MessageTemplate,
  TriggerEvent,
  InteractionChannel,
  Lead,
  LeadInteraction,
  InteractionType
} from '../types';
import { getLeads, getLead, updateLead } from '../api/leads';

// Mock data storage
let mockSequences: NurturingSequence[] = [];
let activeExecutions: Map<string, { sequenceId: string; leadId: string; currentStep: number; nextExecution: Date }> = new Map();

// Inicializar datos de ejemplo
const initializeMockData = () => {
  if (mockSequences.length > 0) return;

  const now = new Date();

  // Secuencia para entrenador - Nuevos leads de Instagram
  const template1: MessageTemplate = {
    id: 't1',
    subject: '¡Hola {{name}}! 👋',
    body: 'Hola {{name}}, vi que te interesó nuestro contenido en Instagram. ¿Te gustaría conocer más sobre nuestros planes de entrenamiento personalizado?',
    variables: ['name'],
    personalizations: [
      {
        variable: 'name',
        source: 'lead_data',
        field: 'name',
        defaultValue: 'amigo/a'
      }
    ]
  };

  const template2: MessageTemplate = {
    id: 't2',
    subject: 'Información sobre nuestros planes',
    body: '{{name}}, aquí tienes información detallada sobre nuestros planes. ¿Tienes alguna pregunta?',
    variables: ['name'],
    personalizations: [
      {
        variable: 'name',
        source: 'lead_data',
        field: 'name',
        defaultValue: 'amigo/a'
      }
    ]
  };

  mockSequences = [
    {
      id: 'seq1',
      name: 'Seguimiento Instagram - Entrenador',
      description: 'Secuencia automática para leads nuevos de Instagram',
      businessType: 'entrenador',
      steps: [
        {
          id: 'step1',
          order: 1,
          name: 'Mensaje de bienvenida',
          channel: 'whatsapp',
          template: template1,
          delay: { value: 1, unit: 'hours' },
        },
        {
          id: 'step2',
          order: 2,
          name: 'Email informativo',
          channel: 'email',
          template: template2,
          delay: { value: 2, unit: 'days' },
          conditions: [
            { type: 'no_response', value: true }
          ]
        },
        {
          id: 'step3',
          order: 3,
          name: 'Llamada de seguimiento',
          channel: 'phone',
          template: {
            id: 't3',
            body: 'Llamada programada para {{name}}',
            variables: ['name'],
            personalizations: [
              {
                variable: 'name',
                source: 'lead_data',
                field: 'name',
                defaultValue: 'el lead'
              }
            ]
          },
          delay: { value: 3, unit: 'days' },
          conditions: [
            { type: 'no_response', value: true }
          ]
        }
      ],
      triggers: [
        {
          event: 'lead_created',
          conditions: [
            { field: 'source', operator: 'equals', value: 'instagram' },
            { field: 'status', operator: 'equals', value: 'new' }
          ]
        }
      ],
      status: 'active',
      metrics: {
        totalLeads: 15,
        activeSequences: 8,
        completedSequences: 5,
        responseRate: 33.3,
        conversionRate: 20.0,
        averageResponseTime: 12.5
      },
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: now
    },
    {
      id: 'seq2',
      name: 'Nurturing Leads Fríos - Gimnasio',
      description: 'Reactivación de leads sin respuesta',
      businessType: 'gimnasio',
      steps: [
        {
          id: 'step4',
          order: 1,
          name: 'Email de reactivación',
          channel: 'email',
          template: {
            id: 't4',
            subject: '¿Aún interesado en unirte?',
            body: 'Hola {{name}}, vimos que te interesaste en nuestro gimnasio. Tenemos una oferta especial que podría interesarte.',
            variables: ['name'],
            personalizations: [
              {
                variable: 'name',
                source: 'lead_data',
                field: 'name',
                defaultValue: 'amigo/a'
              }
            ]
          },
          delay: { value: 7, unit: 'days' }
        }
      ],
      triggers: [
        {
          event: 'no_response_days',
          conditions: [
            { field: 'days', operator: 'greater_than', value: 7 }
          ]
        }
      ],
      status: 'active',
      metrics: {
        totalLeads: 25,
        activeSequences: 12,
        completedSequences: 8,
        responseRate: 25.0,
        conversionRate: 12.0,
        averageResponseTime: 24.0
      },
      createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      updatedAt: now
    },
    {
      id: 'seq3',
      name: 'Seguimiento Alta Prioridad',
      description: 'Para leads con score alto',
      businessType: 'entrenador',
      steps: [
        {
          id: 'step5',
          order: 1,
          name: 'WhatsApp inmediato',
          channel: 'whatsapp',
          template: {
            id: 't5',
            body: '¡Hola {{name}}! Vi tu interés y quería contactarte personalmente. ¿Cuándo te viene bien para una consulta?',
            variables: ['name'],
            personalizations: [
              {
                variable: 'name',
                source: 'lead_data',
                field: 'name',
                defaultValue: 'amigo/a'
              }
            ]
          },
          delay: { value: 30, unit: 'minutes' }
        }
      ],
      triggers: [
        {
          event: 'score_threshold',
          conditions: [
            { field: 'score', operator: 'greater_than', value: 75 }
          ]
        }
      ],
      status: 'paused',
      metrics: {
        totalLeads: 10,
        activeSequences: 3,
        completedSequences: 5,
        responseRate: 60.0,
        conversionRate: 40.0,
        averageResponseTime: 2.0
      },
      createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
    }
  ];
};

// Personalizar mensaje con variables del lead
const personalizeMessage = (template: MessageTemplate, lead: Lead): string => {
  let message = template.body;
  if (template.subject) {
    // Para emails, también personalizar subject
  }

  if (template.personalizations) {
    template.personalizations.forEach(rule => {
      let value = rule.defaultValue || '';
      
      if (rule.source === 'lead_data') {
        if (rule.field === 'name') value = lead.name;
        else if (rule.field === 'email') value = lead.email || '';
        else if (rule.field === 'phone') value = lead.phone || '';
        else if (lead.customFields && lead.customFields[rule.field]) {
          value = lead.customFields[rule.field];
        }
      }

      const regex = new RegExp(`{{${rule.variable}}}`, 'g');
      message = message.replace(regex, value);
    });
  }

  return message;
};

// Convertir delay a milisegundos
const delayToMs = (delay: { value: number; unit: 'minutes' | 'hours' | 'days' }): number => {
  const multipliers = {
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000
  };
  return delay.value * multipliers[delay.unit];
};

// Verificar si se cumplen las condiciones de un paso
const checkStepConditions = (step: NurturingStep, lead: Lead, previousSteps: LeadInteraction[]): boolean => {
  if (!step.conditions || step.conditions.length === 0) return true;

  return step.conditions.every(condition => {
    switch (condition.type) {
      case 'no_response':
        // Verificar si no hay respuesta en los últimos pasos
        const recentInteractions = previousSteps.filter(i => {
          const interactionDate = new Date(i.date);
          const daysSince = (Date.now() - interactionDate.getTime()) / (1000 * 60 * 60 * 24);
          return daysSince < 7;
        });
        const hasResponse = recentInteractions.some(i => 
          i.type === 'whatsapp_replied' || 
          i.type === 'email_opened' || 
          i.type === 'call_received'
        );
        return condition.value ? !hasResponse : hasResponse;

      case 'previous_step_opened':
        // Verificar si el paso anterior fue abierto
        return previousSteps.some(i => i.type === 'email_opened' || i.type === 'email_clicked');

      case 'previous_step_clicked':
        return previousSteps.some(i => i.type === 'email_clicked');

      case 'lead_status':
        return lead.status === condition.value;

      default:
        return true;
    }
  });
};

// Verificar si un trigger se cumple para un lead
const checkTrigger = (trigger: NurturingTrigger, lead: Lead, event: TriggerEvent): boolean => {
  if (trigger.event !== event) return false;

  if (!trigger.conditions || trigger.conditions.length === 0) return true;

  return trigger.conditions.every(condition => {
    let leadValue: any;

    switch (condition.field) {
      case 'source':
        leadValue = lead.source;
        break;
      case 'status':
        leadValue = lead.status;
        break;
      case 'score':
        leadValue = lead.score;
        break;
      case 'stage':
        leadValue = lead.stage;
        break;
      case 'days':
        if (lead.lastContactDate) {
          const daysSince = (Date.now() - new Date(lead.lastContactDate).getTime()) / (1000 * 60 * 60 * 24);
          leadValue = daysSince;
        } else {
          const daysSince = (Date.now() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24);
          leadValue = daysSince;
        }
        break;
      default:
        if (lead.customFields && lead.customFields[condition.field]) {
          leadValue = lead.customFields[condition.field];
        }
        break;
    }

    switch (condition.operator) {
      case 'equals':
        return leadValue === condition.value;
      case 'not_equals':
        return leadValue !== condition.value;
      case 'greater_than':
        return leadValue > condition.value;
      case 'less_than':
        return leadValue < condition.value;
      case 'contains':
        return String(leadValue).includes(String(condition.value));
      default:
        return true;
    }
  });
};

export class NurturingService {
  // Obtener todas las secuencias
  static async getSequences(businessType?: 'entrenador' | 'gimnasio'): Promise<NurturingSequence[]> {
    initializeMockData();
    let sequences = [...mockSequences];

    if (businessType) {
      sequences = sequences.filter(s => s.businessType === businessType);
    }

    return sequences;
  }

  // Obtener una secuencia por ID
  static async getSequence(id: string): Promise<NurturingSequence | null> {
    initializeMockData();
    return mockSequences.find(s => s.id === id) || null;
  }

  // Crear nueva secuencia
  static async createSequence(sequence: Omit<NurturingSequence, 'id' | 'createdAt' | 'updatedAt' | 'metrics'>): Promise<NurturingSequence> {
    initializeMockData();
    
    const newSequence: NurturingSequence = {
      ...sequence,
      id: Date.now().toString(),
      metrics: {
        totalLeads: 0,
        activeSequences: 0,
        completedSequences: 0,
        responseRate: 0,
        conversionRate: 0,
        averageResponseTime: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockSequences.push(newSequence);
    return newSequence;
  }

  // Actualizar secuencia
  static async updateSequence(id: string, updates: Partial<NurturingSequence>): Promise<NurturingSequence> {
    initializeMockData();
    const index = mockSequences.findIndex(s => s.id === id);
    
    if (index === -1) {
      throw new Error('Sequence not found');
    }

    mockSequences[index] = {
      ...mockSequences[index],
      ...updates,
      updatedAt: new Date()
    };

    return mockSequences[index];
  }

  // Eliminar secuencia
  static async deleteSequence(id: string): Promise<void> {
    initializeMockData();
    const index = mockSequences.findIndex(s => s.id === id);
    if (index !== -1) {
      mockSequences.splice(index, 1);
    }
  }

  // Pausar/reanudar secuencia
  static async toggleSequenceStatus(id: string): Promise<NurturingSequence> {
    const sequence = await this.getSequence(id);
    if (!sequence) {
      throw new Error('Sequence not found');
    }

    const newStatus = sequence.status === 'active' ? 'paused' : 'active';
    return this.updateSequence(id, { status: newStatus });
  }

  // Asignar secuencia a un lead manualmente
  static async assignSequenceToLead(sequenceId: string, leadId: string): Promise<void> {
    const sequence = await this.getSequence(sequenceId);
    const lead = await getLead(leadId);

    if (!sequence || !lead) {
      throw new Error('Sequence or lead not found');
    }

    // Actualizar lead con la secuencia asignada
    await updateLead(leadId, {
      nurturingSequence: sequenceId
    });

    // Iniciar ejecución
    const executionId = `${sequenceId}-${leadId}`;
    const firstStep = sequence.steps[0];
    const delayMs = delayToMs(firstStep.delay);
    const nextExecution = new Date(Date.now() + delayMs);

    activeExecutions.set(executionId, {
      sequenceId,
      leadId,
      currentStep: 0,
      nextExecution
    });

    // Simular ejecución del primer paso (en producción sería un job/worker)
    setTimeout(() => {
      this.executeStep(sequenceId, leadId, 0);
    }, delayMs);
  }

  // Ejecutar un paso de la secuencia
  static async executeStep(sequenceId: string, leadId: string, stepIndex: number): Promise<void> {
    const sequence = await this.getSequence(sequenceId);
    const lead = await getLead(leadId);

    if (!sequence || !lead) {
      return;
    }

    // Verificar si el lead ya fue convertido o perdido
    if (lead.status === 'converted' || lead.status === 'lost') {
      return;
    }

    const step = sequence.steps[stepIndex];
    if (!step) {
      return;
    }

    // Verificar condiciones del paso
    const previousInteractions = lead.interactions || [];
    if (!checkStepConditions(step, lead, previousInteractions)) {
      // Saltar este paso y continuar con el siguiente
      if (stepIndex + 1 < sequence.steps.length) {
        const nextStep = sequence.steps[stepIndex + 1];
        const delayMs = delayToMs(nextStep.delay);
        const nextExecution = new Date(Date.now() + delayMs);
        
        const executionId = `${sequenceId}-${leadId}`;
        activeExecutions.set(executionId, {
          sequenceId,
          leadId,
          currentStep: stepIndex + 1,
          nextExecution
        });

        setTimeout(() => {
          this.executeStep(sequenceId, leadId, stepIndex + 1);
        }, delayMs);
      }
      return;
    }

    // Personalizar mensaje
    const personalizedMessage = personalizeMessage(step.template, lead);

    // Determinar tipo de interacción según el canal
    let interactionType: InteractionType;
    switch (step.channel) {
      case 'email':
        interactionType = 'email_sent';
        break;
      case 'whatsapp':
        interactionType = 'whatsapp_sent';
        break;
      case 'phone':
        interactionType = 'call_made';
        break;
      default:
        interactionType = 'email_sent';
    }

    // Crear interacción
    const interaction: LeadInteraction = {
      id: `nurturing-${Date.now()}`,
      type: interactionType,
      channel: step.channel,
      date: new Date(),
      description: `${step.name}: ${personalizedMessage.substring(0, 100)}...`,
      outcome: 'neutral',
      userId: lead.assignedTo || 'system',
      metadata: {
        sequenceId,
        stepId: step.id,
        automated: true
      }
    };

    // Actualizar lead con la interacción
    const updatedInteractions = [...previousInteractions, interaction];
    await updateLead(leadId, {
      interactions: updatedInteractions,
      lastContactDate: new Date()
    });

    // Programar siguiente paso si existe
    if (stepIndex + 1 < sequence.steps.length) {
      const nextStep = sequence.steps[stepIndex + 1];
      const delayMs = delayToMs(nextStep.delay);
      const nextExecution = new Date(Date.now() + delayMs);
      
      const executionId = `${sequenceId}-${leadId}`;
      activeExecutions.set(executionId, {
        sequenceId,
        leadId,
        currentStep: stepIndex + 1,
        nextExecution
      });

      setTimeout(() => {
        this.executeStep(sequenceId, leadId, stepIndex + 1);
      }, delayMs);
    } else {
      // Secuencia completada
      const executionId = `${sequenceId}-${leadId}`;
      activeExecutions.delete(executionId);

      // Actualizar métricas
      const updatedSequence = await this.getSequence(sequenceId);
      if (updatedSequence) {
        await this.updateSequence(sequenceId, {
          metrics: {
            ...updatedSequence.metrics,
            completedSequences: updatedSequence.metrics.completedSequences + 1
          }
        });
      }
    }
  }

  // Verificar triggers y asignar secuencias automáticamente
  static async checkTriggers(lead: Lead, event: TriggerEvent): Promise<void> {
    const sequences = await this.getSequences(lead.businessType);
    const activeSequences = sequences.filter(s => s.status === 'active');

    for (const sequence of activeSequences) {
      for (const trigger of sequence.triggers) {
        if (checkTrigger(trigger, lead, event)) {
          // Asignar secuencia al lead
          await this.assignSequenceToLead(sequence.id, lead.id);
          break; // Solo una secuencia por lead
        }
      }
    }
  }

  // Obtener métricas de una secuencia
  static async getSequenceMetrics(sequenceId: string): Promise<NurturingMetrics> {
    const sequence = await this.getSequence(sequenceId);
    if (!sequence) {
      throw new Error('Sequence not found');
    }
    return sequence.metrics;
  }

  // Obtener leads activos en una secuencia
  static async getActiveLeadsInSequence(sequenceId: string): Promise<Lead[]> {
    const leads = await getLeads();
    return leads.filter(l => l.nurturingSequence === sequenceId);
  }
}

