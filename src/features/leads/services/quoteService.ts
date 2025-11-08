import { Quote, QuoteItem, Lead, HistoryEvent, HistoryEventType } from '../types';
import { getLead, updateLead } from '../api/leads';

// Mock data storage
let mockQuotes: Quote[] = [];
let quoteCounter = 1;

// Inicializar datos de ejemplo
const initializeMockData = () => {
  if (mockQuotes.length > 0) return;

  const now = new Date();
  const validUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 días

  mockQuotes = [
    {
      id: 'quote1',
      leadId: '4',
      quoteNumber: 'QUOTE-2024-001',
      title: 'Plan de Entrenamiento Personalizado - 3 Meses',
      description: 'Plan completo de entrenamiento personalizado con seguimiento nutricional',
      items: [
        {
          id: 'item1',
          name: 'Entrenamiento Personalizado - 3 Meses',
          description: '12 sesiones de entrenamiento personalizado (1 sesión/semana)',
          quantity: 12,
          unitPrice: 50,
          total: 600
        },
        {
          id: 'item2',
          name: 'Plan Nutricional Personalizado',
          description: 'Plan de alimentación adaptado a tus objetivos',
          quantity: 1,
          unitPrice: 100,
          total: 100
        },
        {
          id: 'item3',
          name: 'Seguimiento y Ajustes',
          description: 'Ajustes mensuales del plan según progreso',
          quantity: 3,
          unitPrice: 30,
          total: 90
        }
      ],
      subtotal: 790,
      discount: {
        type: 'percentage',
        value: 10,
        description: 'Descuento por pago anticipado'
      },
      tax: {
        rate: 21,
        amount: 149.1
      },
      total: 860.1,
      currency: 'EUR',
      validUntil,
      status: 'sent',
      sentAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      viewedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      createdBy: '1'
    },
    {
      id: 'quote2',
      leadId: '14',
      quoteNumber: 'QUOTE-2024-002',
      title: 'Membresía Anual - Gimnasio',
      description: 'Membresía anual con acceso completo a instalaciones y clases',
      items: [
        {
          id: 'item4',
          name: 'Membresía Anual',
          description: 'Acceso ilimitado a instalaciones, clases grupales y equipamiento',
          quantity: 1,
          unitPrice: 600,
          total: 600
        },
        {
          id: 'item5',
          name: 'Evaluación Inicial',
          description: 'Evaluación física y plan de entrenamiento inicial',
          quantity: 1,
          unitPrice: 50,
          total: 50
        }
      ],
      subtotal: 650,
      discount: {
        type: 'fixed',
        value: 50,
        description: 'Descuento promocional'
      },
      tax: {
        rate: 21,
        amount: 126
      },
      total: 726,
      currency: 'EUR',
      validUntil: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
      status: 'draft',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      createdBy: '2'
    }
  ];
};

// Generar número de presupuesto único
const generateQuoteNumber = (): string => {
  const year = new Date().getFullYear();
  const number = quoteCounter.toString().padStart(3, '0');
  quoteCounter++;
  return `QUOTE-${year}-${number}`;
};

// Calcular totales del presupuesto
const calculateTotals = (items: QuoteItem[], discount?: Quote['discount'], tax?: Quote['tax']): {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
} => {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  let discountAmount = 0;
  if (discount) {
    if (discount.type === 'percentage') {
      discountAmount = (subtotal * discount.value) / 100;
    } else {
      discountAmount = discount.value;
    }
  }

  const subtotalAfterDiscount = subtotal - discountAmount;

  let taxAmount = 0;
  if (tax) {
    taxAmount = (subtotalAfterDiscount * tax.rate) / 100;
  }

  const total = subtotalAfterDiscount + taxAmount;

  return {
    subtotal,
    discountAmount,
    taxAmount,
    total
  };
};

export class QuoteService {
  // Obtener todos los presupuestos
  static async getQuotes(filters?: {
    leadId?: string;
    status?: Quote['status'];
    createdBy?: string;
  }): Promise<Quote[]> {
    initializeMockData();
    let quotes = [...mockQuotes];

    if (filters) {
      if (filters.leadId) {
        quotes = quotes.filter(q => q.leadId === filters.leadId);
      }
      if (filters.status) {
        quotes = quotes.filter(q => q.status === filters.status);
      }
      if (filters.createdBy) {
        quotes = quotes.filter(q => q.createdBy === filters.createdBy);
      }
    }

    return quotes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Obtener un presupuesto por ID
  static async getQuote(id: string): Promise<Quote | null> {
    initializeMockData();
    return mockQuotes.find(q => q.id === id) || null;
  }

  // Obtener presupuestos de un lead
  static async getLeadQuotes(leadId: string): Promise<Quote[]> {
    return this.getQuotes({ leadId });
  }

  // Crear nuevo presupuesto
  static async createQuote(
    quote: Omit<Quote, 'id' | 'quoteNumber' | 'createdAt' | 'updatedAt' | 'status' | 'subtotal' | 'total'>
  ): Promise<Quote> {
    initializeMockData();

    const totals = calculateTotals(quote.items, quote.discount, quote.tax);

    const newQuote: Quote = {
      ...quote,
      id: Date.now().toString(),
      quoteNumber: generateQuoteNumber(),
      subtotal: totals.subtotal,
      total: totals.total,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Ajustar tax amount si se proporcionó
    if (newQuote.tax) {
      newQuote.tax.amount = totals.taxAmount;
    }

    mockQuotes.push(newQuote);
    return newQuote;
  }

  // Actualizar presupuesto
  static async updateQuote(id: string, updates: Partial<Quote>): Promise<Quote> {
    initializeMockData();
    const index = mockQuotes.findIndex(q => q.id === id);

    if (index === -1) {
      throw new Error('Quote not found');
    }

    const existingQuote = mockQuotes[index];
    const updatedItems = updates.items || existingQuote.items;
    const updatedDiscount = updates.discount !== undefined ? updates.discount : existingQuote.discount;
    const updatedTax = updates.tax !== undefined ? updates.tax : existingQuote.tax;

    const totals = calculateTotals(updatedItems, updatedDiscount, updatedTax);

    mockQuotes[index] = {
      ...existingQuote,
      ...updates,
      items: updatedItems,
      discount: updatedDiscount,
      tax: updatedTax,
      subtotal: totals.subtotal,
      total: totals.total,
      updatedAt: new Date()
    };

    if (mockQuotes[index].tax) {
      mockQuotes[index].tax!.amount = totals.taxAmount;
    }

    return mockQuotes[index];
  }

  // Enviar presupuesto
  static async sendQuote(id: string): Promise<Quote> {
    const quote = await this.getQuote(id);
    if (!quote) {
      throw new Error('Quote not found');
    }

    const updated = await this.updateQuote(id, {
      status: 'sent',
      sentAt: new Date()
    });

    // Registrar en historial del lead
    const lead = await getLead(quote.leadId);
    if (lead) {
      const historyEvent: HistoryEvent = {
        id: `quote-sent-${quote.id}`,
        type: 'proposal_sent' as HistoryEventType,
        date: new Date(),
        userId: quote.createdBy,
        userName: `Usuario ${quote.createdBy}`,
        description: `Presupuesto enviado: ${quote.quoteNumber} - Total: ${quote.total} ${quote.currency}`,
        metadata: {
          quoteId: quote.id,
          quoteNumber: quote.quoteNumber,
          total: quote.total
        }
      };

      // En producción, esto enviaría el email con PDF
      console.log('[QuoteService] Presupuesto enviado:', historyEvent);

      // Simular generación de PDF
      updated.pdfUrl = `/quotes/${quote.id}.pdf`;
    }

    return updated;
  }

  // Marcar como visto
  static async markAsViewed(id: string): Promise<Quote> {
    const quote = await this.getQuote(id);
    if (!quote) {
      throw new Error('Quote not found');
    }

    if (quote.status === 'sent' && !quote.viewedAt) {
      return this.updateQuote(id, {
        status: 'viewed',
        viewedAt: new Date()
      });
    }

    return quote;
  }

  // Aprobar presupuesto
  static async approveQuote(id: string, notes?: string): Promise<Quote> {
    const quote = await this.getQuote(id);
    if (!quote) {
      throw new Error('Quote not found');
    }

    const updated = await this.updateQuote(id, {
      status: 'approved',
      approvedAt: new Date(),
      notes: notes || quote.notes
    });

    // Convertir lead a cliente
    const lead = await getLead(quote.leadId);
    if (lead) {
      await updateLead(quote.leadId, {
        status: 'converted',
        conversionDate: new Date(),
        convertedToClientId: `client-${quote.leadId}`,
        notes: [...(lead.notes || []), `Presupuesto ${quote.quoteNumber} aprobado`]
      });

      const historyEvent: HistoryEvent = {
        id: `quote-approved-${quote.id}`,
        type: 'converted' as HistoryEventType,
        date: new Date(),
        userId: quote.createdBy,
        userName: `Usuario ${quote.createdBy}`,
        description: `Presupuesto ${quote.quoteNumber} aprobado. Lead convertido a cliente.`,
        metadata: {
          quoteId: quote.id,
          quoteNumber: quote.quoteNumber,
          total: quote.total
        }
      };

      console.log('[QuoteService] Presupuesto aprobado y lead convertido:', historyEvent);
    }

    return updated;
  }

  // Rechazar presupuesto
  static async rejectQuote(id: string, reason: string): Promise<Quote> {
    const quote = await this.getQuote(id);
    if (!quote) {
      throw new Error('Quote not found');
    }

    const updated = await this.updateQuote(id, {
      status: 'rejected',
      rejectedAt: new Date(),
      rejectionReason: reason
    });

    // Registrar en historial del lead
    const lead = await getLead(quote.leadId);
    if (lead) {
      const historyEvent: HistoryEvent = {
        id: `quote-rejected-${quote.id}`,
        type: 'note_added' as HistoryEventType,
        date: new Date(),
        userId: quote.createdBy,
        userName: `Usuario ${quote.createdBy}`,
        description: `Presupuesto ${quote.quoteNumber} rechazado. Razón: ${reason}`,
        metadata: {
          quoteId: quote.id,
          quoteNumber: quote.quoteNumber,
          rejectionReason: reason
        }
      };

      console.log('[QuoteService] Presupuesto rechazado:', historyEvent);
    }

    return updated;
  }

  // Eliminar presupuesto
  static async deleteQuote(id: string): Promise<void> {
    initializeMockData();
    const index = mockQuotes.findIndex(q => q.id === id);
    if (index !== -1) {
      mockQuotes.splice(index, 1);
    }
  }

  // Verificar presupuestos expirados
  static async checkExpiredQuotes(): Promise<Quote[]> {
    const now = new Date();
    const quotes = await this.getQuotes({ status: 'sent' });
    const expired = quotes.filter(q => q.validUntil < now);

    for (const quote of expired) {
      await this.updateQuote(quote.id, { status: 'expired' });
    }

    return expired;
  }
}

