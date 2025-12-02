import { Lead, LeadFilters, LeadHistory, LeadInteraction, HistoryEvent } from '../types';

// Mock data storage (en producción esto vendría de una API)
let mockLeads: Lead[] = [];
let mockHistory: Record<string, HistoryEvent[]> = {};

// Inicializar datos de ejemplo
const initializeMockData = () => {
  if (mockLeads.length > 0) return;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  mockLeads = [
    // === LEADS PARA ENTRENADOR ===
    
    // Lead con seguimiento HOY (urgente)
    {
      id: '1',
      name: 'María González',
      email: 'maria.gonzalez@example.com',
      phone: '+34612345678',
      source: 'instagram',
      status: 'qualified',
      stage: 'oportunidad',
      score: 85,
      assignedTo: '1', // ID del usuario entrenador en MOCK_USERS
      businessType: 'entrenador',
      interactions: [
        {
          id: 'i1',
          type: 'whatsapp_sent',
          channel: 'whatsapp',
          date: yesterday,
          description: 'Mensaje inicial enviado con información de planes',
          outcome: 'positive',
          userId: '1', // ID del usuario entrenador en MOCK_USERS
        },
        {
          id: 'i2',
          type: 'whatsapp_replied',
          channel: 'whatsapp',
          date: yesterday,
          description: 'Respondió preguntando por disponibilidad',
          outcome: 'positive',
          userId: '1', // ID del usuario entrenador en MOCK_USERS
        },
      ],
      notes: ['Muy interesada en entrenamiento personalizado', 'Busca perder 10kg'],
      tags: ['caliente', 'instagram', 'perdida-peso'],
      lastContactDate: yesterday,
      nextFollowUpDate: today, // SEGUIMIENTO HOY
      createdAt: weekAgo,
      updatedAt: yesterday,
    },

    // Lead pendiente de respuesta (sin contacto > 48h)
    {
      id: '2',
      name: 'Carlos Ruiz',
      email: 'carlos.ruiz@example.com',
      phone: '+34623456789',
      source: 'whatsapp',
      status: 'contacted',
      stage: 'interes',
      score: 60,
      assignedTo: '1', // ID del usuario entrenador en MOCK_USERS
      businessType: 'entrenador',
      interactions: [
        {
          id: 'i3',
          type: 'whatsapp_sent',
          channel: 'whatsapp',
          date: threeDaysAgo,
          description: 'Primer contacto - preguntó por precios',
          outcome: 'neutral',
          userId: '1', // ID del usuario entrenador en MOCK_USERS
        },
      ],
      notes: ['Interesado en entrenamiento funcional'],
      tags: ['whatsapp', 'pendiente'],
      lastContactDate: threeDaysAgo, // SIN RESPUESTA > 48H
      nextFollowUpDate: undefined,
      createdAt: twoWeeksAgo,
      updatedAt: threeDaysAgo,
    },

    // Lead nuevo sin contacto
    {
      id: '3',
      name: 'Laura Sánchez',
      email: 'laura.sanchez@example.com',
      phone: '+34634567890',
      source: 'referido',
      status: 'new',
      stage: 'captacion',
      score: 50,
      assignedTo: '1', // ID del usuario entrenador en MOCK_USERS
      businessType: 'entrenador',
      interactions: [],
      notes: ['Referida por cliente satisfecho'],
      tags: ['referido', 'nuevo'],
      lastContactDate: undefined, // NUNCA CONTACTADO
      nextFollowUpDate: undefined,
      createdAt: yesterday,
      updatedAt: yesterday,
    },

    // Lead con seguimiento hoy y alta prioridad
    {
      id: '4',
      name: 'David Torres',
      email: 'david.torres@example.com',
      phone: '+34645678901',
      source: 'instagram',
      status: 'negotiation',
      stage: 'cierre',
      score: 90,
      assignedTo: '1', // ID del usuario entrenador en MOCK_USERS
      businessType: 'entrenador',
      interactions: [
        {
          id: 'i4',
          type: 'call_made',
          channel: 'phone',
          date: yesterday,
          description: 'Llamada de seguimiento - muy interesado',
          outcome: 'positive',
          userId: '1', // ID del usuario entrenador en MOCK_USERS
        },
        {
          id: 'i5',
          type: 'email_sent',
          channel: 'email',
          date: yesterday,
          description: 'Enviado presupuesto personalizado',
          outcome: 'neutral',
          userId: '1', // ID del usuario entrenador en MOCK_USERS
        },
      ],
      notes: ['Listo para cerrar', 'Presupuesto enviado ayer'],
      tags: ['caliente', 'cierre', 'presupuesto-enviado'],
      lastContactDate: yesterday,
      nextFollowUpDate: today, // SEGUIMIENTO HOY
      createdAt: weekAgo,
      updatedAt: yesterday,
    },

    // Lead convertido recientemente
    {
      id: '5',
      name: 'Sofía Martín',
      email: 'sofia.martin@example.com',
      phone: '+34656789012',
      source: 'referido',
      status: 'converted',
      stage: 'cierre',
      score: 95,
      assignedTo: '1', // ID del usuario entrenador en MOCK_USERS
      businessType: 'entrenador',
      interactions: [
        {
          id: 'i6',
          type: 'meeting_completed',
          channel: 'in_person',
          date: weekAgo,
          description: 'Primera consulta realizada',
          outcome: 'positive',
          userId: '1', // ID del usuario entrenador en MOCK_USERS
        },
        {
          id: 'i7',
          type: 'proposal_sent',
          channel: 'email',
          date: weekAgo,
          description: 'Propuesta enviada y aceptada',
          outcome: 'positive',
          userId: '1', // ID del usuario entrenador en MOCK_USERS
        },
      ],
      notes: ['Cliente convertido exitosamente'],
      tags: ['convertido', 'referido', 'exitoso'],
      lastContactDate: weekAgo,
      nextFollowUpDate: undefined,
      conversionDate: weekAgo,
      convertedToClientId: 'client-1',
      createdAt: monthAgo,
      updatedAt: weekAgo,
    },

    // Lead con múltiples interacciones pero sin respuesta reciente
    {
      id: '6',
      name: 'Pablo López',
      email: 'pablo.lopez@example.com',
      phone: '+34667890123',
      source: 'facebook',
      status: 'nurturing',
      stage: 'calificacion',
      score: 55,
      assignedTo: '1', // ID del usuario entrenador en MOCK_USERS
      businessType: 'entrenador',
      interactions: [
        {
          id: 'i8',
          type: 'email_sent',
          channel: 'email',
          date: twoDaysAgo,
          description: 'Email con información general',
          outcome: 'neutral',
          userId: '1', // ID del usuario entrenador en MOCK_USERS
        },
        {
          id: 'i9',
          type: 'social_media_interaction',
          channel: 'facebook',
          date: twoDaysAgo,
          description: 'Comentó en publicación',
          outcome: 'positive',
          userId: '1', // ID del usuario entrenador en MOCK_USERS
        },
      ],
      notes: ['En proceso de nurturing', 'Requiere más información'],
      tags: ['facebook', 'nurturing'],
      lastContactDate: twoDaysAgo, // SIN RESPUESTA > 48H
      nextFollowUpDate: undefined,
      createdAt: twoWeeksAgo,
      updatedAt: twoDaysAgo,
    },

    // Lead con seguimiento hoy
    {
      id: '7',
      name: 'Elena García',
      email: 'elena.garcia@example.com',
      phone: '+34678901234',
      source: 'tiktok',
      status: 'meeting_scheduled',
      stage: 'oportunidad',
      score: 75,
      assignedTo: '1', // ID del usuario entrenador en MOCK_USERS
      businessType: 'entrenador',
      interactions: [
        {
          id: 'i10',
          type: 'whatsapp_sent',
          channel: 'whatsapp',
          date: yesterday,
          description: 'Agendada consulta para hoy',
          outcome: 'positive',
          userId: '1', // ID del usuario entrenador en MOCK_USERS
        },
      ],
      notes: ['Consulta agendada para hoy a las 18:00'],
      tags: ['tiktok', 'consulta-agendada'],
      lastContactDate: yesterday,
      nextFollowUpDate: today, // SEGUIMIENTO HOY
      createdAt: weekAgo,
      updatedAt: yesterday,
    },

    // Lead nuevo de Instagram
    {
      id: '8',
      name: 'Miguel Hernández',
      email: 'miguel.hernandez@example.com',
      phone: '+34689012345',
      source: 'instagram',
      status: 'new',
      stage: 'captacion',
      score: 40,
      assignedTo: '1', // ID del usuario entrenador en MOCK_USERS
      businessType: 'entrenador',
      interactions: [],
      notes: [],
      tags: ['nuevo', 'instagram'],
      lastContactDate: undefined,
      nextFollowUpDate: undefined,
      createdAt: now,
      updatedAt: now,
    },

    // === LEADS PARA GIMNASIO ===
    
    {
      id: '9',
      name: 'Juan Pérez',
      email: 'juan.perez@example.com',
      phone: '+34690123456',
      source: 'landing_page',
      status: 'new',
      stage: 'captacion',
      score: 45,
      businessType: 'gimnasio',
      interactions: [],
      notes: [],
      tags: ['nuevo', 'landing-page'],
      createdAt: now,
      updatedAt: now,
    },

    {
      id: '10',
      name: 'Ana Martínez',
      email: 'ana.martinez@example.com',
      phone: '+34601234567',
      source: 'referido',
      status: 'meeting_scheduled',
      stage: 'oportunidad',
      score: 75,
      assignedTo: '2', // ID del usuario gimnasio en MOCK_USERS
      businessType: 'gimnasio',
      interactions: [
        {
          id: 'i11',
          type: 'call_made',
          channel: 'phone',
          date: yesterday,
          description: 'Llamada inicial exitosa',
          outcome: 'positive',
          userId: '2', // ID del usuario gimnasio en MOCK_USERS
        },
      ],
      notes: ['Referida por cliente satisfecho'],
      tags: ['referido', 'reunion-agendada'],
      lastContactDate: yesterday,
      nextFollowUpDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      createdAt: weekAgo,
      updatedAt: yesterday,
    },

    // Lead convertido para gimnasio
    {
      id: '11',
      name: 'Roberto Silva',
      email: 'roberto.silva@example.com',
      phone: '+34612345098',
      source: 'google_ads',
      status: 'converted',
      stage: 'cierre',
      score: 88,
      assignedTo: '2', // ID del usuario gimnasio en MOCK_USERS
      businessType: 'gimnasio',
      interactions: [
        {
          id: 'i12',
          type: 'visit_center',
          channel: 'in_person',
          date: weekAgo,
          description: 'Visita al centro realizada',
          outcome: 'positive',
          userId: '2', // ID del usuario gimnasio en MOCK_USERS
        },
      ],
      notes: ['Cliente convertido después de visita'],
      tags: ['convertido', 'google-ads'],
      lastContactDate: weekAgo,
      nextFollowUpDate: undefined,
      conversionDate: weekAgo,
      convertedToClientId: 'client-2',
      createdAt: monthAgo,
      updatedAt: weekAgo,
    },

    // Más leads para entrenador - Variedad de estados
    {
      id: '12',
      name: 'Isabel Fernández',
      email: 'isabel.fernandez@example.com',
      phone: '+34623456123',
      source: 'landing_page',
      status: 'qualified',
      stage: 'calificacion',
      score: 70,
      assignedTo: '1', // ID del usuario entrenador en MOCK_USERS
      businessType: 'entrenador',
      interactions: [
        {
          id: 'i13',
          type: 'email_sent',
          channel: 'email',
          date: yesterday,
          description: 'Email de bienvenida enviado',
          outcome: 'neutral',
          userId: '1', // ID del usuario entrenador en MOCK_USERS
        },
      ],
      notes: ['Completó formulario en landing page'],
      tags: ['landing-page', 'calificado'],
      lastContactDate: yesterday,
      nextFollowUpDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      createdAt: twoDaysAgo,
      updatedAt: yesterday,
    },

    {
      id: '13',
      name: 'Javier Moreno',
      email: 'javier.moreno@example.com',
      phone: '+34634567234',
      source: 'evento',
      status: 'contacted',
      stage: 'interes',
      score: 65,
      assignedTo: '1', // ID del usuario entrenador en MOCK_USERS
      businessType: 'entrenador',
      interactions: [
        {
          id: 'i14',
          type: 'whatsapp_sent',
          channel: 'whatsapp',
          date: twoDaysAgo,
          description: 'Contacto después de evento',
          outcome: 'positive',
          userId: '1', // ID del usuario entrenador en MOCK_USERS
        },
      ],
      notes: ['Conoció el servicio en evento de fitness'],
      tags: ['evento', 'interesado'],
      lastContactDate: twoDaysAgo,
      nextFollowUpDate: undefined,
      createdAt: weekAgo,
      updatedAt: twoDaysAgo,
    },

    {
      id: '14',
      name: 'Carmen Díaz',
      email: 'carmen.diaz@example.com',
      phone: '+34645678345',
      source: 'referido',
      status: 'negotiation',
      stage: 'oportunidad',
      score: 80,
      assignedTo: '1', // ID del usuario entrenador en MOCK_USERS
      businessType: 'entrenador',
      interactions: [
        {
          id: 'i15',
          type: 'call_made',
          channel: 'phone',
          date: yesterday,
          description: 'Llamada de negociación',
          outcome: 'positive',
          userId: '1', // ID del usuario entrenador en MOCK_USERS
        },
        {
          id: 'i16',
          type: 'email_sent',
          channel: 'email',
          date: yesterday,
          description: 'Propuesta personalizada enviada',
          outcome: 'neutral',
          userId: '1', // ID del usuario entrenador en MOCK_USERS
        },
      ],
      notes: ['En negociación de precio', 'Muy interesada'],
      tags: ['referido', 'negociacion', 'caliente'],
      lastContactDate: yesterday,
      nextFollowUpDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      createdAt: twoWeeksAgo,
      updatedAt: yesterday,
    },

    {
      id: '15',
      name: 'Andrés Jiménez',
      email: 'andres.jimenez@example.com',
      phone: '+34656789456',
      source: 'tiktok',
      status: 'new',
      stage: 'captacion',
      score: 35,
      assignedTo: '1', // ID del usuario entrenador en MOCK_USERS
      businessType: 'entrenador',
      interactions: [],
      notes: ['Nuevo lead de TikTok'],
      tags: ['nuevo', 'tiktok'],
      lastContactDate: undefined,
      nextFollowUpDate: undefined,
      createdAt: now,
      updatedAt: now,
    },

    // Más leads para gimnasio
    {
      id: '16',
      name: 'Patricia López',
      email: 'patricia.lopez@example.com',
      phone: '+34667890567',
      source: 'facebook',
      status: 'qualified',
      stage: 'calificacion',
      score: 68,
      assignedTo: '2', // ID del usuario gimnasio en MOCK_USERS
      businessType: 'gimnasio',
      interactions: [
        {
          id: 'i17',
          type: 'email_sent',
          channel: 'email',
          date: yesterday,
          description: 'Información de membresías enviada',
          outcome: 'neutral',
          userId: '2', // ID del usuario gimnasio en MOCK_USERS
        },
      ],
      notes: ['Interesada en membresía anual'],
      tags: ['facebook', 'calificado'],
      lastContactDate: yesterday,
      nextFollowUpDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      createdAt: weekAgo,
      updatedAt: yesterday,
    },

    {
      id: '17',
      name: 'Fernando Castro',
      email: 'fernando.castro@example.com',
      phone: '+34678901678',
      source: 'visita_centro',
      status: 'meeting_scheduled',
      stage: 'oportunidad',
      score: 78,
      assignedTo: '2', // ID del usuario gimnasio en MOCK_USERS
      businessType: 'gimnasio',
      interactions: [
        {
          id: 'i18',
          type: 'visit_center',
          channel: 'in_person',
          date: yesterday,
          description: 'Visita al centro - muy interesado',
          outcome: 'positive',
          userId: '2', // ID del usuario gimnasio en MOCK_USERS
        },
      ],
      notes: ['Visita exitosa', 'Reunión agendada para mañana'],
      tags: ['visita-centro', 'reunion-agendada'],
      lastContactDate: yesterday,
      nextFollowUpDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      createdAt: weekAgo,
      updatedAt: yesterday,
    },

    {
      id: '18',
      name: 'Mónica Vega',
      email: 'monica.vega@example.com',
      phone: '+34689012789',
      source: 'instagram',
      status: 'nurturing',
      stage: 'interes',
      score: 58,
      assignedTo: '2', // ID del usuario gimnasio en MOCK_USERS
      businessType: 'gimnasio',
      interactions: [
        {
          id: 'i19',
          type: 'social_media_interaction',
          channel: 'instagram',
          date: twoDaysAgo,
          description: 'Comentó en publicación',
          outcome: 'positive',
          userId: '2', // ID del usuario gimnasio en MOCK_USERS
        },
      ],
      notes: ['En proceso de nurturing'],
      tags: ['instagram', 'nurturing'],
      lastContactDate: twoDaysAgo,
      nextFollowUpDate: undefined,
      createdAt: twoWeeksAgo,
      updatedAt: twoDaysAgo,
    },
  ];
};

export class LeadsService {
  static async getLeads(filters?: LeadFilters): Promise<Lead[]> {
    initializeMockData();
    let leads = [...mockLeads];
    
    console.log('[LeadsService] Total leads iniciales:', leads.length);
    console.log('[LeadsService] Leads iniciales (primeros 3):', leads.slice(0, 3).map(l => ({
      id: l.id,
      name: l.name,
      assignedTo: l.assignedTo,
      businessType: l.businessType,
      status: l.status,
      stage: l.stage,
    })));

    if (filters) {
      console.log('[LeadsService] Aplicando filtros:', filters);
      
      if (filters.status && filters.status.length > 0) {
        const before = leads.length;
        leads = leads.filter(l => filters.status?.includes(l.status));
        console.log('[LeadsService] Filtro status:', { before, after: leads.length, status: filters.status });
      }
      if (filters.stage && filters.stage.length > 0) {
        const before = leads.length;
        leads = leads.filter(l => filters.stage?.includes(l.stage));
        console.log('[LeadsService] Filtro stage:', { before, after: leads.length, stage: filters.stage });
      }
      if (filters.source && filters.source.length > 0) {
        const before = leads.length;
        leads = leads.filter(l => filters.source?.includes(l.source));
        console.log('[LeadsService] Filtro source:', { before, after: leads.length, source: filters.source });
      }
      if (filters.assignedTo && filters.assignedTo.length > 0) {
        const before = leads.length;
        console.log('[LeadsService] Filtro assignedTo - Antes:', {
          filterAssignedTo: filters.assignedTo,
          leadsWithAssignedTo: leads.filter(l => l.assignedTo).map(l => ({ id: l.id, name: l.name, assignedTo: l.assignedTo })),
        });
        leads = leads.filter(l => l.assignedTo && filters.assignedTo?.includes(l.assignedTo));
        console.log('[LeadsService] Filtro assignedTo:', { before, after: leads.length, assignedTo: filters.assignedTo });
      }
      if (filters.businessType) {
        const before = leads.length;
        leads = leads.filter(l => l.businessType === filters.businessType);
        console.log('[LeadsService] Filtro businessType:', { before, after: leads.length, businessType: filters.businessType });
      }
      if (filters.search) {
        const before = leads.length;
        const search = filters.search.toLowerCase();
        leads = leads.filter(l =>
          l.name.toLowerCase().includes(search) ||
          l.email?.toLowerCase().includes(search) ||
          l.phone?.includes(search)
        );
        console.log('[LeadsService] Filtro search:', { before, after: leads.length, search: filters.search });
      }
    }

    console.log('[LeadsService] Leads finales retornados:', {
      total: leads.length,
      leads: leads.map(l => ({ id: l.id, name: l.name, assignedTo: l.assignedTo, businessType: l.businessType, status: l.status, stage: l.stage })),
    });
    return leads;
  }

  static async getLead(id: string): Promise<Lead | null> {
    initializeMockData();
    return mockLeads.find(l => l.id === id) || null;
  }

  static async createLead(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
    initializeMockData();
    const newLead: Lead = {
      ...lead,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockLeads.push(newLead);
    return newLead;
  }

  static async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    initializeMockData();
    const index = mockLeads.findIndex(l => l.id === id);
    if (index === -1) {
      throw new Error('Lead not found');
    }
    mockLeads[index] = {
      ...mockLeads[index],
      ...updates,
      updatedAt: new Date(),
    };
    return mockLeads[index];
  }

  static async deleteLead(id: string): Promise<void> {
    initializeMockData();
    const index = mockLeads.findIndex(l => l.id === id);
    if (index !== -1) {
      mockLeads.splice(index, 1);
    }
  }

  static async addInteraction(
    leadId: string,
    interaction: Omit<LeadInteraction, 'id'>
  ): Promise<Lead> {
    initializeMockData();
    const lead = mockLeads.find(l => l.id === leadId);
    if (!lead) {
      throw new Error('Lead not found');
    }

    const newInteraction: LeadInteraction = {
      ...interaction,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };

    lead.interactions.push(newInteraction);
    lead.lastContactDate = interaction.date;
    lead.updatedAt = new Date();

    // Agregar evento al historial
    if (!mockHistory[leadId]) {
      mockHistory[leadId] = [];
    }
    mockHistory[leadId].push({
      id: Date.now().toString(),
      type: 'interaction_added',
      timestamp: new Date(),
      userId: interaction.userId || 'system',
      description: `Interacción agregada: ${interaction.description}`,
      metadata: {
        interactionId: newInteraction.id,
        channel: interaction.channel,
        type: interaction.type
      }
    });

    return lead;
  }

  static async getLeadHistory(id: string): Promise<LeadHistory> {
    initializeMockData();
    const events = mockHistory[id] || [];
    return {
      leadId: id,
      events: events.sort((a, b) => b.date.getTime() - a.date.getTime()),
    };
  }
}

