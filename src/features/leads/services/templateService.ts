import { MessageTemplate, InteractionChannel, Lead } from '../types';

// Extender MessageTemplate con campos adicionales para gestión
export interface MessageTemplateExtended extends MessageTemplate {
  name: string;
  category: 'bienvenida' | 'seguimiento' | 'cierre' | 'reactivacion' | 'personalizada';
  channel: InteractionChannel;
  businessType: 'entrenador' | 'gimnasio';
  usageCount: number;
  lastUsed?: Date;
  effectiveness?: {
    sent: number;
    opened?: number;
    clicked?: number;
    replied?: number;
    converted?: number;
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

// Mock data storage
let mockTemplates: MessageTemplateExtended[] = [];

// Inicializar datos de ejemplo
const initializeMockData = () => {
  if (mockTemplates.length > 0) return;

  const now = new Date();

  mockTemplates = [
    // Plantillas para Entrenador
    {
      id: 't1',
      name: 'Bienvenida Instagram',
      category: 'bienvenida',
      channel: 'whatsapp',
      businessType: 'entrenador',
      subject: undefined,
      body: '¡Hola {{name}}! 👋 Vi que te interesó nuestro contenido en Instagram. ¿Te gustaría conocer más sobre nuestros planes de entrenamiento personalizado? Estoy aquí para ayudarte a alcanzar tus objetivos 💪',
      variables: ['name'],
      personalizations: [
        {
          variable: 'name',
          source: 'lead_data',
          field: 'name',
          defaultValue: 'amigo/a'
        }
      ],
      usageCount: 45,
      lastUsed: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      effectiveness: {
        sent: 45,
        replied: 18,
        converted: 8
      },
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      createdBy: '1'
    },
    {
      id: 't2',
      name: 'Seguimiento Sin Respuesta',
      category: 'seguimiento',
      channel: 'whatsapp',
      businessType: 'entrenador',
      subject: undefined,
      body: 'Hola {{name}}, te escribo de nuevo porque creo que nuestro servicio podría ser perfecto para ti. ¿Tienes alguna pregunta o te gustaría agendar una consulta gratuita? 📅',
      variables: ['name'],
      personalizations: [
        {
          variable: 'name',
          source: 'lead_data',
          field: 'name',
          defaultValue: 'amigo/a'
        }
      ],
      usageCount: 32,
      lastUsed: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      effectiveness: {
        sent: 32,
        replied: 12,
        converted: 5
      },
      createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      createdBy: '1'
    },
    {
      id: 't3',
      name: 'Cierre - Oferta Especial',
      category: 'cierre',
      channel: 'whatsapp',
      businessType: 'entrenador',
      subject: undefined,
      body: '{{name}}, tengo una oferta especial que podría interesarte. Si te decides esta semana, te ofrezco un {{descuento}}% de descuento en tu primer mes. ¿Te parece bien? 🎯',
      variables: ['name', 'descuento'],
      personalizations: [
        {
          variable: 'name',
          source: 'lead_data',
          field: 'name',
          defaultValue: 'amigo/a'
        },
        {
          variable: 'descuento',
          source: 'custom',
          field: 'descuento',
          defaultValue: '20'
        }
      ],
      usageCount: 15,
      lastUsed: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      effectiveness: {
        sent: 15,
        replied: 10,
        converted: 7
      },
      createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      createdBy: '1'
    },
    {
      id: 't4',
      name: 'Email Bienvenida',
      category: 'bienvenida',
      channel: 'email',
      businessType: 'entrenador',
      subject: '¡Bienvenido {{name}}! Tu transformación comienza aquí',
      body: `Hola {{name}},

Gracias por tu interés en nuestros servicios de entrenamiento personalizado.

Estoy aquí para ayudarte a alcanzar tus objetivos de fitness. ¿Te gustaría agendar una consulta gratuita para conocerte mejor y diseñar un plan personalizado?

Puedes responder este email o contactarme directamente por WhatsApp.

¡Espero saber de ti pronto!

Saludos,
{{entrenador_name}}`,
      variables: ['name', 'entrenador_name'],
      personalizations: [
        {
          variable: 'name',
          source: 'lead_data',
          field: 'name',
          defaultValue: 'amigo/a'
        },
        {
          variable: 'entrenador_name',
          source: 'user_profile',
          field: 'name',
          defaultValue: 'Tu entrenador'
        }
      ],
      usageCount: 28,
      lastUsed: new Date(now.getTime() - 5 * 60 * 60 * 1000),
      effectiveness: {
        sent: 28,
        opened: 22,
        clicked: 12,
        replied: 8,
        converted: 4
      },
      createdAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      createdBy: '1'
    },
    // Plantillas para Gimnasio
    {
      id: 't5',
      name: 'Bienvenida Landing Page',
      category: 'bienvenida',
      channel: 'email',
      businessType: 'gimnasio',
      subject: '¡Bienvenido a {{gimnasio_name}}!',
      body: `Hola {{name}},

Gracias por completar nuestro formulario. Estamos emocionados de tenerte como parte de nuestra comunidad.

{{gimnasio_name}} ofrece:
- Instalaciones de última generación
- Entrenadores certificados
- Clases grupales ilimitadas
- Plan nutricional personalizado

¿Te gustaría agendar una visita guiada? Puedes responder este email o llamarnos al {{telefono}}.

¡Esperamos verte pronto!

El equipo de {{gimnasio_name}}`,
      variables: ['name', 'gimnasio_name', 'telefono'],
      personalizations: [
        {
          variable: 'name',
          source: 'lead_data',
          field: 'name',
          defaultValue: 'amigo/a'
        },
        {
          variable: 'gimnasio_name',
          source: 'user_profile',
          field: 'name',
          defaultValue: 'Nuestro Gimnasio'
        },
        {
          variable: 'telefono',
          source: 'custom',
          field: 'telefono',
          defaultValue: '+34 900 123 456'
        }
      ],
      usageCount: 67,
      lastUsed: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      effectiveness: {
        sent: 67,
        opened: 52,
        clicked: 31,
        replied: 18,
        converted: 12
      },
      createdAt: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      createdBy: '2'
    },
    {
      id: 't6',
      name: 'Reactivación - Oferta Especial',
      category: 'reactivacion',
      channel: 'email',
      businessType: 'gimnasio',
      subject: '{{name}}, tenemos algo especial para ti',
      body: `Hola {{name}},

Hace tiempo que no te vemos por aquí y queríamos recordarte que tu lugar en {{gimnasio_name}} te está esperando.

Por eso, tenemos una oferta especial: {{descuento}}% de descuento en tu primera mensualidad si te reactivas antes del {{fecha_limite}}.

¿Te gustaría aprovechar esta oportunidad?

Responde este email o llámanos para más información.

¡Esperamos verte de nuevo!

El equipo de {{gimnasio_name}}`,
      variables: ['name', 'gimnasio_name', 'descuento', 'fecha_limite'],
      personalizations: [
        {
          variable: 'name',
          source: 'lead_data',
          field: 'name',
          defaultValue: 'amigo/a'
        },
        {
          variable: 'gimnasio_name',
          source: 'user_profile',
          field: 'name',
          defaultValue: 'Nuestro Gimnasio'
        },
        {
          variable: 'descuento',
          source: 'custom',
          field: 'descuento',
          defaultValue: '30'
        },
        {
          variable: 'fecha_limite',
          source: 'custom',
          field: 'fecha_limite',
          defaultValue: 'fin de mes'
        }
      ],
      usageCount: 23,
      lastUsed: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      effectiveness: {
        sent: 23,
        opened: 18,
        clicked: 9,
        replied: 5,
        converted: 3
      },
      createdAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      createdBy: '2'
    }
  ];
};

// Personalizar mensaje con variables del lead y usuario
const personalizeMessage = (
  template: MessageTemplateExtended,
  lead: Lead,
  user?: { id: string; name: string; email?: string; phone?: string },
  customValues?: Record<string, any>
): { subject?: string; body: string } => {
  let body = template.body;
  let subject = template.subject;

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
      } else if (rule.source === 'user_profile' && user) {
        if (rule.field === 'name') value = user.name;
        else if (rule.field === 'email') value = user.email || '';
        else if (rule.field === 'phone') value = user.phone || '';
      } else if (rule.source === 'custom' && customValues) {
        value = customValues[rule.field] || rule.defaultValue || '';
      }

      const regex = new RegExp(`{{${rule.variable}}}`, 'g');
      body = body.replace(regex, value);
      if (subject) {
        subject = subject.replace(regex, value);
      }
    });
  }

  return { subject, body };
};

export class TemplateService {
  // Obtener todas las plantillas
  static async getTemplates(
    businessType?: 'entrenador' | 'gimnasio',
    channel?: InteractionChannel,
    category?: string
  ): Promise<MessageTemplateExtended[]> {
    initializeMockData();
    let templates = [...mockTemplates];

    if (businessType) {
      templates = templates.filter(t => t.businessType === businessType);
    }

    if (channel) {
      templates = templates.filter(t => t.channel === channel);
    }

    if (category) {
      templates = templates.filter(t => t.category === category);
    }

    return templates.sort((a, b) => {
      // Ordenar por uso reciente y frecuencia
      if (a.lastUsed && b.lastUsed) {
        return b.lastUsed.getTime() - a.lastUsed.getTime();
      }
      return b.usageCount - a.usageCount;
    });
  }

  // Obtener una plantilla por ID
  static async getTemplate(id: string): Promise<MessageTemplateExtended | null> {
    initializeMockData();
    return mockTemplates.find(t => t.id === id) || null;
  }

  // Crear nueva plantilla
  static async createTemplate(
    template: Omit<MessageTemplateExtended, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'effectiveness'>
  ): Promise<MessageTemplateExtended> {
    initializeMockData();

    const newTemplate: MessageTemplateExtended = {
      ...template,
      id: Date.now().toString(),
      usageCount: 0,
      effectiveness: {
        sent: 0,
        opened: 0,
        clicked: 0,
        replied: 0,
        converted: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockTemplates.push(newTemplate);
    return newTemplate;
  }

  // Actualizar plantilla
  static async updateTemplate(
    id: string,
    updates: Partial<MessageTemplateExtended>
  ): Promise<MessageTemplateExtended> {
    initializeMockData();
    const index = mockTemplates.findIndex(t => t.id === id);

    if (index === -1) {
      throw new Error('Template not found');
    }

    mockTemplates[index] = {
      ...mockTemplates[index],
      ...updates,
      updatedAt: new Date()
    };

    return mockTemplates[index];
  }

  // Eliminar plantilla
  static async deleteTemplate(id: string): Promise<void> {
    initializeMockData();
    const index = mockTemplates.findIndex(t => t.id === id);
    if (index !== -1) {
      mockTemplates.splice(index, 1);
    }
  }

  // Usar plantilla (incrementar contador y actualizar efectividad)
  static async useTemplate(
    id: string,
    lead: Lead,
    user?: { id: string; name: string; email?: string; phone?: string },
    customValues?: Record<string, any>,
    outcome?: 'sent' | 'opened' | 'clicked' | 'replied' | 'converted'
  ): Promise<{ subject?: string; body: string }> {
    const template = await this.getTemplate(id);
    if (!template) {
      throw new Error('Template not found');
    }

    // Personalizar mensaje
    const personalized = personalizeMessage(template, lead, user, customValues);

    // Actualizar estadísticas
    const index = mockTemplates.findIndex(t => t.id === id);
    if (index !== -1) {
      mockTemplates[index].usageCount += 1;
      mockTemplates[index].lastUsed = new Date();

      if (mockTemplates[index].effectiveness) {
        mockTemplates[index].effectiveness!.sent += 1;
        if (outcome === 'opened') mockTemplates[index].effectiveness!.opened = (mockTemplates[index].effectiveness!.opened || 0) + 1;
        if (outcome === 'clicked') mockTemplates[index].effectiveness!.clicked = (mockTemplates[index].effectiveness!.clicked || 0) + 1;
        if (outcome === 'replied') mockTemplates[index].effectiveness!.replied = (mockTemplates[index].effectiveness!.replied || 0) + 1;
        if (outcome === 'converted') mockTemplates[index].effectiveness!.converted = (mockTemplates[index].effectiveness!.converted || 0) + 1;
      }
    }

    return personalized;
  }

  // Obtener plantillas más usadas
  static async getMostUsedTemplates(
    businessType?: 'entrenador' | 'gimnasio',
    limit: number = 5
  ): Promise<MessageTemplateExtended[]> {
    const templates = await this.getTemplates(businessType);
    return templates
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  // Obtener plantillas más efectivas
  static async getMostEffectiveTemplates(
    businessType?: 'entrenador' | 'gimnasio',
    limit: number = 5
  ): Promise<MessageTemplateExtended[]> {
    const templates = await this.getTemplates(businessType);
    return templates
      .filter(t => t.effectiveness && t.effectiveness.sent > 0)
      .sort((a, b) => {
        const aRate = a.effectiveness!.converted / a.effectiveness!.sent;
        const bRate = b.effectiveness!.converted / b.effectiveness!.sent;
        return bRate - aRate;
      })
      .slice(0, limit);
  }

  // Personalizar plantilla con datos del lead
  static personalizeTemplate(
    template: MessageTemplateExtended,
    lead: Lead,
    user?: { id: string; name: string; email?: string; phone?: string },
    customValues?: Record<string, any>
  ): string {
    const result = personalizeMessage(template, lead, user, customValues);
    return result.body;
  }

  // Incrementar uso de plantilla
  static async incrementUsage(templateId: string): Promise<void> {
    initializeMockData();
    const index = mockTemplates.findIndex(t => t.id === templateId);
    if (index !== -1) {
      mockTemplates[index].usageCount += 1;
      mockTemplates[index].lastUsed = new Date();
      if (mockTemplates[index].effectiveness) {
        mockTemplates[index].effectiveness!.sent += 1;
      }
    }
  }

  // Obtener efectividad de plantilla
  static async getTemplateEffectiveness(
    templateId: string
  ): Promise<MessageTemplateExtended['effectiveness']> {
    const template = await this.getTemplate(templateId);
    return template?.effectiveness;
  }

  // Buscar plantillas
  static async searchTemplates(
    businessType: 'entrenador' | 'gimnasio',
    query: string,
    filters?: {
      category?: string;
      channel?: InteractionChannel;
    }
  ): Promise<MessageTemplateExtended[]> {
    let templates = await this.getTemplates(businessType, filters?.channel, filters?.category);
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      templates = templates.filter(t =>
        t.name.toLowerCase().includes(lowerQuery) ||
        t.body.toLowerCase().includes(lowerQuery)
      );
    }

    return templates;
  }
}

