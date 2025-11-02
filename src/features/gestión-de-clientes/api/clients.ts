import { Client, Client360Profile } from '../types';

// Mock data - En producción esto se reemplazaría con llamadas reales a la API
const MOCK_CLIENTS: Client[] = [
  {
    id: 'client_1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '+34612345678',
    status: 'activo',
    type: 'cliente',
    registrationDate: '2024-01-15',
    lastCheckIn: '2024-10-28',
    lastSession: '2024-10-27',
    planId: 'plan-1',
    planName: 'Plan Mensual',
    adherenceRate: 85,
    riskScore: 15,
    trainerId: '1', // ID del usuario entrenador de MOCK_USERS
  },
  {
    id: 'client_2',
    name: 'María García',
    email: 'maria@example.com',
    phone: '+34612345679',
    status: 'en-riesgo',
    type: 'cliente',
    registrationDate: '2024-02-20',
    lastCheckIn: '2024-10-15',
    lastSession: '2024-10-10',
    planId: 'plan-2',
    planName: 'Plan Semanal',
    adherenceRate: 45,
    riskScore: 65,
    daysSinceLastVisit: 13,
    trainerId: '1', // ID del usuario entrenador de MOCK_USERS
  },
  {
    id: 'client_3',
    name: 'Carlos López',
    email: 'carlos@example.com',
    phone: '+34612345680',
    status: 'perdido',
    type: 'cliente',
    registrationDate: '2023-11-10',
    lastCheckIn: '2024-09-01',
    lastSession: '2024-08-28',
    planId: 'plan-1',
    planName: 'Plan Mensual',
    adherenceRate: 20,
    riskScore: 95,
    daysSinceLastVisit: 58,
    trainerId: '1', // ID del usuario entrenador de MOCK_USERS
  },
  {
    id: 'client_4',
    name: 'Ana Martínez',
    email: 'ana@example.com',
    phone: '+34612345681',
    status: 'activo',
    type: 'socio',
    registrationDate: '2024-03-10',
    lastCheckIn: '2024-10-29',
    lastSession: '2024-10-28',
    planId: 'plan-3',
    planName: 'Membresía Premium',
    adherenceRate: 92,
    riskScore: 5,
    trainerId: '1', // ID del usuario entrenador de MOCK_USERS
  },
  {
    id: 'client_5',
    name: 'Luis Fernández',
    email: 'luis@example.com',
    phone: '+34612345682',
    status: 'activo',
    type: 'socio',
    registrationDate: '2024-04-05',
    lastCheckIn: '2024-10-26',
    lastSession: '2024-10-25',
    planId: 'plan-4',
    planName: 'Membresía Básica',
    adherenceRate: 75,
    riskScore: 25,
    trainerId: '1', // ID del usuario entrenador de MOCK_USERS
  },
];

export const getClients = async (role: 'entrenador' | 'gimnasio', userId?: string): Promise<Client[]> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (role === 'entrenador') {
    // Filtrar por trainerId si se proporciona, si no, devolver todos
    if (userId) {
      return MOCK_CLIENTS.filter(c => c.trainerId === userId);
    }
    // Si no hay userId, devolver todos los clientes (para desarrollo/testing)
    return MOCK_CLIENTS;
  } else {
    // Para gimnasios, retornar todos los clientes
    return MOCK_CLIENTS.map(c => ({
      ...c,
      membershipStatus: 'activa',
      paymentStatus: 'al-dia',
      gymId: userId,
    }));
  }
};

export const getActiveClients = async (role: 'entrenador' | 'gimnasio', userId?: string): Promise<Client[]> => {
  const clients = await getClients(role, userId);
  return clients.filter(c => c.status === 'activo');
};

export const getRiskClients = async (role: 'entrenador' | 'gimnasio', userId?: string): Promise<Client[]> => {
  const clients = await getClients(role, userId);
  return clients.filter(c => c.status === 'en-riesgo');
};

export const getLostClients = async (role: 'entrenador' | 'gimnasio', userId?: string): Promise<Client[]> => {
  const clients = await getClients(role, userId);
  return clients.filter(c => c.status === 'perdido');
};

export const getClientById = async (clientId: string): Promise<Client360Profile | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const client = MOCK_CLIENTS.find(c => c.id === clientId);
  if (!client) return null;

  // Construir historial basado en las fechas del cliente
  const history: Array<{
    id: string;
    date: string;
    type: 'check-in' | 'session' | 'payment' | 'plan-change' | 'note';
    description: string;
  }> = [];

  if (client.lastCheckIn) {
    history.push({
      id: `${clientId}-h1`,
      date: client.lastCheckIn,
      type: 'check-in',
      description: 'Check-in realizado',
    });
  }

  if (client.lastSession) {
    history.push({
      id: `${clientId}-h2`,
      date: client.lastSession,
      type: 'session',
      description: 'Sesión de entrenamiento completada',
    });
  }

  // Si no hay historial, agregar al menos un registro basado en la fecha de registro
  if (history.length === 0 && client.registrationDate) {
    history.push({
      id: `${clientId}-h0`,
      date: client.registrationDate,
      type: 'plan-change',
      description: 'Cliente registrado',
    });
  }

  return {
    ...client,
    history,
    documents: [],
    consentements: [
      {
        id: `${clientId}-c1`,
        type: 'rgpd',
        granted: true,
        date: client.registrationDate,
      },
    ],
    metrics: {
      totalSessions: 45,
      totalCheckIns: 120,
      adherenceRate: client.adherenceRate || 0,
      averageSessionDuration: 60,
      totalRevenue: 1800,
      lastPaymentDate: '2024-10-01',
      nextPaymentDate: '2024-11-01',
    },
    interactions: [],
  };
};

export const createClient = async (client: Partial<Client>): Promise<Client> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newClient: Client = {
    id: Date.now().toString(),
    name: client.name || '',
    email: client.email || '',
    phone: client.phone,
    status: 'activo',
    type: client.type || 'cliente',
    registrationDate: new Date().toISOString().split('T')[0],
    ...client,
  };
  
  MOCK_CLIENTS.push(newClient);
  return newClient;
};

export const updateClient = async (clientId: string, updates: Partial<Client>): Promise<Client> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = MOCK_CLIENTS.findIndex(c => c.id === clientId);
  if (index === -1) throw new Error('Client not found');
  
  MOCK_CLIENTS[index] = { ...MOCK_CLIENTS[index], ...updates };
  return MOCK_CLIENTS[index];
};

export const deleteClient = async (clientId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = MOCK_CLIENTS.findIndex(c => c.id === clientId);
  if (index !== -1) {
    MOCK_CLIENTS.splice(index, 1);
  }
};

