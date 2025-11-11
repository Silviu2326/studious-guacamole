import { MessageTemplate } from '../types';

// Mock storage for templates
let templates: MessageTemplate[] = [
  {
    id: 'tmpl_001',
    name: 'Bienvenida inicial',
    content: '¡Hola {{nombre}}! 👋 Gracias por tu mensaje. Me alegra que estés interesado/a en mejorar tu salud y forma física. ¿En qué puedo ayudarte hoy?',
    category: 'servicios',
    variables: ['nombre'],
    usageCount: 45,
    lastUsed: new Date('2024-11-08')
  },
  {
    id: 'tmpl_002',
    name: 'Info de precios - Entrenamiento Personal',
    content: 'Hola {{nombre}}! 💪 Los planes de entrenamiento personal son:\n\n📋 Plan Básico: {{precio_basico}}/mes\n- 2 sesiones semanales\n- Plan personalizado\n\n📋 Plan Premium: {{precio_premium}}/mes\n- 3 sesiones semanales\n- Plan + nutrición\n\n¿Cuál te interesa más?',
    category: 'precios',
    variables: ['nombre', 'precio_basico', 'precio_premium'],
    usageCount: 89,
    lastUsed: new Date('2024-11-09')
  },
  {
    id: 'tmpl_003',
    name: 'Horarios disponibles',
    content: 'Hola {{nombre}}! 🕐 Estos son mis horarios disponibles:\n\n🌅 Mañanas: 7:00 - 10:00\n🌤️ Mediodía: 12:00 - 14:00\n🌆 Tarde: 18:00 - 21:00\n\n¿Qué horario te viene mejor?',
    category: 'horarios',
    variables: ['nombre'],
    usageCount: 67,
    lastUsed: new Date('2024-11-09')
  },
  {
    id: 'tmpl_004',
    name: 'Seguimiento - Primera semana',
    content: 'Hola {{nombre}}! 🎉 ¿Qué tal tu primera semana? Me gustaría saber cómo te has sentido con los entrenamientos. ¿Alguna duda o ajuste que necesites?',
    category: 'seguimiento',
    variables: ['nombre'],
    usageCount: 34,
    lastUsed: new Date('2024-11-07')
  },
  {
    id: 'tmpl_005',
    name: 'Servicios completos',
    content: 'Hola {{nombre}}! Estos son los servicios que ofrezco:\n\n💪 Entrenamiento Personal 1:1\n📱 Plan de entreno online\n🥗 Plan nutricional\n📊 Seguimiento semanal\n\n¿Cuál te interesa más o necesitas más info de alguno?',
    category: 'servicios',
    variables: ['nombre'],
    usageCount: 56,
    lastUsed: new Date('2024-11-08')
  },
  {
    id: 'tmpl_006',
    name: 'Recontacto después de 3 días',
    content: 'Hola {{nombre}}! 👋 Te escribo para ver si sigues interesado/a en {{servicio}}. Estoy aquí para resolver cualquier duda que tengas. ¿Hablamos?',
    category: 'seguimiento',
    variables: ['nombre', 'servicio'],
    usageCount: 23,
    lastUsed: new Date('2024-11-06')
  },
  {
    id: 'tmpl_007',
    name: 'Info nutrición',
    content: 'Hola {{nombre}}! 🥗 El plan nutricional incluye:\n\n✅ Evaluación inicial completa\n✅ Plan personalizado según tus objetivos\n✅ Lista de compras semanal\n✅ Seguimiento y ajustes\n\nInversión: {{precio}}/mes\n\n¿Te gustaría empezar?',
    category: 'precios',
    variables: ['nombre', 'precio'],
    usageCount: 41,
    lastUsed: new Date('2024-11-08')
  },
  {
    id: 'tmpl_008',
    name: 'Confirmar interés',
    content: 'Hola {{nombre}}! ¿Sigues interesado/a? Tengo disponibilidad esta semana para una sesión de prueba gratuita. ¿Te animas? 💪',
    category: 'seguimiento',
    variables: ['nombre'],
    usageCount: 28,
    lastUsed: new Date('2024-11-07')
  }
];

export class MessageTemplateService {
  static async getTemplates(): Promise<MessageTemplate[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...templates].sort((a, b) => b.usageCount - a.usageCount);
  }

  static async getTemplatesByCategory(category: MessageTemplate['category']): Promise<MessageTemplate[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return templates.filter(t => t.category === category);
  }

  static async getTemplate(id: string): Promise<MessageTemplate | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return templates.find(t => t.id === id) || null;
  }

  static async createTemplate(template: Omit<MessageTemplate, 'id' | 'usageCount' | 'lastUsed'>): Promise<MessageTemplate> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newTemplate: MessageTemplate = {
      ...template,
      id: `tmpl_${Date.now()}`,
      usageCount: 0
    };
    templates.push(newTemplate);
    return newTemplate;
  }

  static async updateTemplate(id: string, updates: Partial<MessageTemplate>): Promise<MessageTemplate> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = templates.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Template not found');
    
    templates[index] = { ...templates[index], ...updates };
    return templates[index];
  }

  static async deleteTemplate(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    templates = templates.filter(t => t.id !== id);
  }

  static async useTemplate(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const template = templates.find(t => t.id === id);
    if (template) {
      template.usageCount++;
      template.lastUsed = new Date();
    }
  }

  static replaceVariables(content: string, values: Record<string, string>): string {
    let result = content;
    Object.entries(values).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return result;
  }

  static extractVariables(content: string): string[] {
    const regex = /{{([^}]+)}}/g;
    const variables: string[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }
    return variables;
  }
}

