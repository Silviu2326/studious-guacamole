import { Lead, LeadFilters, LeadHistory, LeadInteraction, HistoryEvent } from '../types';

// Mock data storage (en producción esto vendría de una API)
let mockLeads: Lead[] = [];
let mockHistory: Record<string, HistoryEvent[]> = {};

// Inicializar datos de ejemplo
const initializeMockData = () => {
  if (mockLeads.length > 0) return;

  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  mockLeads = [
    {
      id: '1',
      name: 'María González',
      email: 'maria@example.com',
      phone: '+34612345678',
      source: 'instagram',
      status: 'qualified',
      stage: 'oportunidad',
      score: 85,
      assignedTo: 'user1',
      businessType: 'entrenador',
      interactions: [
        {
          id: 'i1',
          type: 'whatsapp_sent',
          channel: 'whatsapp',
          date: yesterday,
          description: 'Mensaje inicial enviado',
          outcome: 'positive',
          userId: 'user1',
        },
      ],
      notes: ['Muy interesada en entrenamiento personalizado'],
      tags: ['caliente', 'instagram'],
      lastContactDate: yesterday,
      nextFollowUpDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      createdAt: weekAgo,
      updatedAt: yesterday,
    },
    {
      id: '2',
      name: 'Juan Pérez',
      email: 'juan@example.com',
      phone: '+34687654321',
      source: 'landing_page',
      status: 'new',
      stage: 'captacion',
      score: 45,
      businessType: 'gimnasio',
      interactions: [],
      notes: [],
      tags: ['nuevo'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '3',
      name: 'Ana Martínez',
      email: 'ana@example.com',
      phone: '+34611111111',
      source: 'referido',
      status: 'meeting_scheduled',
      stage: 'oportunidad',
      score: 75,
      assignedTo: 'user2',
      businessType: 'gimnasio',
      interactions: [
        {
          id: 'i2',
          type: 'call_made',
          channel: 'phone',
          date: yesterday,
          description: 'Llamada inicial exitosa',
          outcome: 'positive',
          userId: 'user2',
        },
      ],
      notes: ['Referida por cliente satisfecho'],
      tags: ['referido', 'reunion-agendada'],
      lastContactDate: yesterday,
      nextFollowUpDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      createdAt: weekAgo,
      updatedAt: yesterday,
    },
  ];
};

export class LeadsService {
  static async getLeads(filters?: LeadFilters): Promise<Lead[]> {
    initializeMockData();
    let leads = [...mockLeads];

    if (filters) {
      if (filters.status && filters.status.length > 0) {
        leads = leads.filter(l => filters.status?.includes(l.status));
      }
      if (filters.stage && filters.stage.length > 0) {
        leads = leads.filter(l => filters.stage?.includes(l.stage));
      }
      if (filters.source && filters.source.length > 0) {
        leads = leads.filter(l => filters.source?.includes(l.source));
      }
      if (filters.assignedTo && filters.assignedTo.length > 0) {
        leads = leads.filter(l => l.assignedTo && filters.assignedTo?.includes(l.assignedTo));
      }
      if (filters.businessType) {
        leads = leads.filter(l => l.businessType === filters.businessType);
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        leads = leads.filter(l =>
          l.name.toLowerCase().includes(search) ||
          l.email?.toLowerCase().includes(search) ||
          l.phone?.includes(search)
        );
      }
    }

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

  static async getLeadHistory(id: string): Promise<LeadHistory> {
    initializeMockData();
    const events = mockHistory[id] || [];
    return {
      leadId: id,
      events: events.sort((a, b) => b.date.getTime() - a.date.getTime()),
    };
  }
}

