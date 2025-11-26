import { Sale, PhaseColumn, Phase, BusinessType, PipelinePhase } from '../types';
import { getPhases } from './phases';

// Datos mock para ventas
const mockSales: Sale[] = [
  // US-11: Entrenador - Contacto Nuevo
  {
    id: '1',
    leadId: 'lead1',
    leadName: 'Juan Pérez',
    leadEmail: 'juan@example.com',
    leadPhone: '+34 600 123 456',
    phase: 'contacto_nuevo',
    businessType: 'entrenador',
    probability: 20,
    value: 500,
    serviceType: '1-1',
    notes: ['Lead nuevo de Instagram'],
    tags: ['instagram'],
    interactions: [],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // US-14
    phaseHistory: [{
      id: 'hist-1',
      toPhase: 'contacto_nuevo',
      movedBy: 'system',
      movedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }]
  },
  {
    id: '2',
    leadId: 'lead2',
    leadName: 'María García',
    leadEmail: 'maria@example.com',
    leadPhone: '+34 611 234 567',
    phase: 'primera_charla',
    businessType: 'entrenador',
    probability: 40,
    value: 600,
    serviceType: 'online',
    notes: ['Primera charla realizada, interesada'],
    tags: ['caliente'],
    interactions: [],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // US-14
    phaseHistory: [{
      id: 'hist-2a',
      toPhase: 'contacto_nuevo',
      movedBy: 'system',
      movedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }, {
      id: 'hist-2b',
      fromPhase: 'contacto_nuevo',
      toPhase: 'primera_charla',
      movedBy: 'trainer1',
      movedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }]
  },
  // Entrenador - Enviado Precio - US-15: Más de 3 días sin contacto
  {
    id: '3',
    leadId: 'lead3',
    leadName: 'Carlos López',
    leadEmail: 'carlos@example.com',
    leadPhone: '+34 622 345 678',
    phase: 'enviado_precio',
    businessType: 'entrenador',
    probability: 60,
    value: 750,
    serviceType: 'nutricion',
    notes: ['Precio enviado el lunes'],
    tags: ['interesado'],
    interactions: [],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    lastContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // US-14: 5 días sin contacto
    phaseHistory: [{
      id: 'hist-3a',
      toPhase: 'contacto_nuevo',
      movedBy: 'system',
      movedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }, {
      id: 'hist-3b',
      fromPhase: 'contacto_nuevo',
      toPhase: 'primera_charla',
      movedBy: 'trainer1',
      movedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    }, {
      id: 'hist-3c',
      fromPhase: 'primera_charla',
      toPhase: 'enviado_precio',
      movedBy: 'trainer1',
      movedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }]
  },
  // Entrenador - Llamada - US-16: Con llamada agendada
  {
    id: '4',
    leadId: 'lead4',
    leadName: 'Ana Martín',
    leadEmail: 'ana@example.com',
    leadPhone: '+34 633 456 789',
    phase: 'llamada',
    businessType: 'entrenador',
    probability: 80,
    value: 800,
    serviceType: 'combo',
    notes: ['Llamada agendada para mañana'],
    tags: ['caliente', 'prioridad'],
    interactions: [],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // US-14
    scheduledCall: { // US-16
      id: 'call-4',
      saleId: '4',
      scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Mañana
      reminderSent: false,
      completed: false,
      notes: 'Llamada de seguimiento sobre la propuesta',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    phaseHistory: [{
      id: 'hist-4a',
      toPhase: 'contacto_nuevo',
      movedBy: 'system',
      movedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }, {
      id: 'hist-4b',
      fromPhase: 'contacto_nuevo',
      toPhase: 'primera_charla',
      movedBy: 'trainer1',
      movedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }, {
      id: 'hist-4c',
      fromPhase: 'primera_charla',
      toPhase: 'enviado_precio',
      movedBy: 'trainer1',
      movedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }, {
      id: 'hist-4d',
      fromPhase: 'enviado_precio',
      toPhase: 'llamada',
      movedBy: 'trainer1',
      movedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      reason: 'Lead muy interesado, agendar llamada'
    }]
  },
  // Entrenador - Cliente
  {
    id: 'ent-10',
    leadId: 'lead10',
    leadName: 'Roberto Díaz',
    leadEmail: 'roberto@example.com',
    leadPhone: '+34 699 111 222',
    phase: 'cliente',
    businessType: 'entrenador',
    probability: 100,
    value: 900,
    serviceType: '1-1',
    notes: ['Cliente cerrado!'],
    tags: ['cerrado'],
    interactions: [],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // US-14
    phaseHistory: [{
      id: 'hist-10a',
      toPhase: 'contacto_nuevo',
      movedBy: 'system',
      movedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    }, {
      id: 'hist-10b',
      fromPhase: 'contacto_nuevo',
      toPhase: 'cliente',
      movedBy: 'trainer1',
      movedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      reason: '¡Cerrado! Comenzó esta semana'
    }]
  },
  // Gimnasio - Tour Hecho
  {
    id: '5',
    leadId: 'lead5',
    leadName: 'Roberto Silva',
    leadEmail: 'roberto@example.com',
    leadPhone: '+34 644 567 890',
    phase: 'tour_hecho',
    businessType: 'gimnasio',
    probability: 50,
    value: 1200,
    notes: ['Tour realizado el martes'],
    tags: ['visitante'],
    interactions: [],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '6',
    leadId: 'lead6',
    leadName: 'Laura Fernández',
    leadEmail: 'laura@example.com',
    leadPhone: '+34 655 678 901',
    phase: 'tour_hecho',
    businessType: 'gimnasio',
    probability: 45,
    value: 1000,
    notes: [],
    tags: [],
    interactions: [],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  // Gimnasio - Oferta Enviada
  {
    id: '7',
    leadId: 'lead7',
    leadName: 'Pedro Ruiz',
    leadEmail: 'pedro@example.com',
    leadPhone: '+34 666 789 012',
    phase: 'oferta_enviada',
    businessType: 'gimnasio',
    probability: 70,
    value: 1500,
    notes: ['Oferta premium enviada'],
    tags: ['interesado'],
    interactions: [],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  // Gimnasio - Matrícula Pendiente
  {
    id: '8',
    leadId: 'lead8',
    leadName: 'Sofía Morales',
    leadEmail: 'sofia@example.com',
    leadPhone: '+34 677 890 123',
    phase: 'matricula_pendiente',
    businessType: 'gimnasio',
    probability: 85,
    value: 1800,
    notes: ['Esperando pago de matrícula'],
    tags: ['pendiente', 'prioridad'],
    interactions: [],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  // Gimnasio - Alta Cerrada
  {
    id: '9',
    leadId: 'lead9',
    leadName: 'Miguel Torres',
    leadEmail: 'miguel@example.com',
    leadPhone: '+34 688 901 234',
    phase: 'alta_cerrada',
    businessType: 'gimnasio',
    probability: 100,
    value: 2000,
    notes: ['Alta completada'],
    tags: ['cerrado'],
    interactions: [],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

export const getPipeline = async (
  businessType: BusinessType,
  userId?: string
): Promise<PhaseColumn[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const phases = await getPhases(businessType);
  const filteredSales = mockSales.filter(sale => {
    if (sale.businessType !== businessType) return false;
    if (userId && sale.assignedTo !== userId) return false;
    return true;
  });
  
  return phases.map(phase => {
    const phaseSales = filteredSales.filter(sale => sale.phase === phase.key);
    
    const totalValue = phaseSales.reduce((sum, sale) => sum + (sale.value || 0), 0);
    const averageProbability = phaseSales.length > 0
      ? phaseSales.reduce((sum, sale) => sum + sale.probability, 0) / phaseSales.length
      : 0;
    
    const now = new Date();
    const averageDaysInPhase = phaseSales.length > 0
      ? phaseSales.reduce((sum, sale) => {
          const daysInPhase = Math.floor(
            (now.getTime() - new Date(sale.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
          );
          return sum + Math.max(0, daysInPhase);
        }, 0) / phaseSales.length
      : 0;
    
    return {
      phase,
      sales: phaseSales,
      metrics: {
        total: phaseSales.length,
        value: totalValue,
        averageProbability,
        averageDaysInPhase,
        conversionRate: 0, // Se calcula con datos históricos
      },
    };
  });
};

// US-12: Movimiento de ventas con historial
export const moveSale = async (saleId: string, newPhase: PipelinePhase, reason?: string): Promise<Sale> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const sale = mockSales.find(s => s.id === saleId);
  if (!sale) {
    throw new Error('Venta no encontrada');
  }
  
  const oldPhase = sale.phase;
  sale.phase = newPhase;
  sale.updatedAt = new Date();
  sale.lastActivity = new Date();
  
  // Agregar entrada al historial
  if (!sale.phaseHistory) {
    sale.phaseHistory = [];
  }
  
  sale.phaseHistory.push({
    id: `hist-${Date.now()}`,
    fromPhase: oldPhase,
    toPhase: newPhase,
    movedBy: 'user', // En producción, usar el ID del usuario actual
    movedAt: new Date(),
    reason
  });
  
  return sale;
};

export const getSale = async (id: string): Promise<Sale | null> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockSales.find(s => s.id === id) || null;
};

export const createSale = async (sale: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>): Promise<Sale> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const newSale: Sale = {
    ...sale,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  mockSales.push(newSale);
  return newSale;
};

export const updateSale = async (id: string, updates: Partial<Sale>): Promise<Sale> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const sale = mockSales.find(s => s.id === id);
  if (!sale) {
    throw new Error('Venta no encontrada');
  }
  
  Object.assign(sale, updates, { updatedAt: new Date() });
  if (updates.phase) {
    sale.lastActivity = new Date();
  }
  
  return sale;
};

export const deleteSale = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = mockSales.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error('Venta no encontrada');
  }
  
  mockSales.splice(index, 1);
};

