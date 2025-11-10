import { 
  ChurnedClient, 
  ChurnedClientsResponse, 
  ChurnedClientsFilters,
  CancellationReason,
  ChurnStats
} from '../types';

// Datos mock para motivos de cancelación
export const mockCancellationReasons: CancellationReason[] = [
  { id: '1', label: 'Cambio de domicilio', type: 'formal', category: 'Personal' },
  { id: '2', label: 'Precio muy alto', type: 'informal', category: 'Económico' },
  { id: '3', label: 'Falta de tiempo', type: 'informal', category: 'Personal' },
  { id: '4', label: 'Insatisfacción con el servicio', type: 'formal', category: 'Servicio' },
  { id: '5', label: 'Problemas de salud', type: 'formal', category: 'Personal' },
  { id: '6', label: 'Falta de resultados', type: 'informal', category: 'Servicio' },
  { id: '7', label: 'Cambio de gimnasio', type: 'informal', category: 'Competencia' },
  { id: '8', label: 'Falta de equipamiento adecuado', type: 'formal', category: 'Instalaciones' },
];

// Datos mock para clientes dados de baja
export const mockChurnedClients: ChurnedClient[] = [
  {
    id: '1',
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    cancellationDate: '2025-01-15T10:30:00Z',
    reason: 'Cambio de domicilio',
    plan: 'Plan Premium',
    trainerId: 't1',
    trainerName: 'Carlos Ramírez',
    subscriptionId: 'sub-001',
    notes: 'Cliente se mudó a otra ciudad',
    documentUrl: undefined,
  },
  {
    id: '2',
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    cancellationDate: '2025-01-20T14:20:00Z',
    reason: 'Precio muy alto',
    plan: 'Plan Básico',
    trainerId: 't2',
    trainerName: 'Ana Martínez',
    subscriptionId: 'sub-002',
    notes: 'Cliente mencionó que el precio era demasiado alto',
    documentUrl: undefined,
  },
  {
    id: '3',
    name: 'Laura Fernández',
    email: 'laura.fernandez@email.com',
    cancellationDate: '2025-01-22T09:15:00Z',
    reason: 'Falta de tiempo',
    plan: 'Plan Intermedio',
    trainerId: undefined,
    trainerName: undefined,
    subscriptionId: 'sub-003',
    notes: 'Cliente no tenía tiempo para asistir regularmente',
    documentUrl: undefined,
  },
  {
    id: '4',
    name: 'Roberto Sánchez',
    email: 'roberto.sanchez@email.com',
    cancellationDate: '2025-01-25T16:45:00Z',
    reason: 'Insatisfacción con el servicio',
    plan: 'Plan Premium',
    trainerId: 't3',
    trainerName: 'Miguel Torres',
    subscriptionId: 'sub-004',
    notes: 'Cliente no estaba satisfecho con la atención recibida',
    documentUrl: 'https://example.com/doc-004.pdf',
  },
  {
    id: '5',
    name: 'Carmen López',
    email: 'carmen.lopez@email.com',
    cancellationDate: '2025-01-28T11:00:00Z',
    reason: 'Problemas de salud',
    plan: 'Plan Básico',
    trainerId: undefined,
    trainerName: undefined,
    subscriptionId: 'sub-005',
    notes: 'Cliente tuvo problemas de salud que le impiden continuar',
    documentUrl: undefined,
  },
  {
    id: '6',
    name: 'David Ruiz',
    email: 'david.ruiz@email.com',
    cancellationDate: '2025-01-30T13:30:00Z',
    reason: 'Falta de resultados',
    plan: 'Plan Intermedio',
    trainerId: 't1',
    trainerName: 'Carlos Ramírez',
    subscriptionId: 'sub-006',
    notes: 'Cliente no vio los resultados esperados',
    documentUrl: undefined,
  },
  {
    id: '7',
    name: 'Elena Gómez',
    email: 'elena.gomez@email.com',
    cancellationDate: '2025-02-02T10:00:00Z',
    reason: 'Cambio de gimnasio',
    plan: 'Plan Premium',
    trainerId: 't2',
    trainerName: 'Ana Martínez',
    subscriptionId: 'sub-007',
    notes: 'Cliente cambió a otro gimnasio más cercano',
    documentUrl: undefined,
  },
  {
    id: '8',
    name: 'Fernando Díaz',
    email: 'fernando.diaz@email.com',
    cancellationDate: '2025-02-05T15:20:00Z',
    reason: 'Falta de equipamiento adecuado',
    plan: 'Plan Intermedio',
    trainerId: undefined,
    trainerName: undefined,
    subscriptionId: 'sub-008',
    notes: 'Cliente requería equipamiento especializado',
    documentUrl: undefined,
  },
  {
    id: '9',
    name: 'Isabel Moreno',
    email: 'isabel.moreno@email.com',
    cancellationDate: '2025-02-08T09:45:00Z',
    reason: 'Precio muy alto',
    plan: 'Plan Premium',
    trainerId: 't3',
    trainerName: 'Miguel Torres',
    subscriptionId: 'sub-009',
    notes: 'Cliente no pudo afrontar el precio del plan premium',
    documentUrl: undefined,
  },
  {
    id: '10',
    name: 'Andrés Castro',
    email: 'andres.castro@email.com',
    cancellationDate: '2025-02-10T12:00:00Z',
    reason: 'Falta de tiempo',
    plan: 'Plan Básico',
    trainerId: undefined,
    trainerName: undefined,
    subscriptionId: 'sub-010',
    notes: 'Cliente tuvo cambios en su horario laboral',
    documentUrl: undefined,
  },
];

// Función helper para simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Función para obtener clientes dados de baja con datos mock
export async function getMockChurnedClients(
  filters: ChurnedClientsFilters = {}
): Promise<ChurnedClientsResponse> {
  await delay(500); // Simular latencia de red

  let filteredClients = [...mockChurnedClients];

  // Aplicar filtros
  if (filters.startDate) {
    const startDate = new Date(filters.startDate);
    filteredClients = filteredClients.filter(
      client => new Date(client.cancellationDate) >= startDate
    );
  }

  if (filters.endDate) {
    const endDate = new Date(filters.endDate);
    filteredClients = filteredClients.filter(
      client => new Date(client.cancellationDate) <= endDate
    );
  }

  if (filters.reasonId) {
    const reason = mockCancellationReasons.find(r => r.id === filters.reasonId);
    if (reason) {
      filteredClients = filteredClients.filter(
        client => client.reason === reason.label
      );
    }
  }

  // Paginación
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedClients = filteredClients.slice(startIndex, endIndex);

  return {
    data: paginatedClients,
    pagination: {
      total: filteredClients.length,
      page,
      limit,
      totalPages: Math.ceil(filteredClients.length / limit),
    },
  };
}

// Función para obtener motivos de cancelación con datos mock
export async function getMockCancellationReasons(): Promise<CancellationReason[]> {
  await delay(300);
  return [...mockCancellationReasons];
}

// Función para obtener estadísticas de churn con datos mock
export async function getMockChurnStats(): Promise<ChurnStats> {
  await delay(400);

  // Calcular distribución de motivos
  const reasonsDistribution = mockCancellationReasons.map(reason => ({
    reason: reason.label,
    count: mockChurnedClients.filter(client => client.reason === reason.label).length,
  })).filter(rd => rd.count > 0);

  // Calcular top planes por churn
  const planCounts = new Map<string, number>();
  mockChurnedClients.forEach(client => {
    const count = planCounts.get(client.plan) || 0;
    planCounts.set(client.plan, count + 1);
  });

  const topPlansByChurn: { plan: string; cancellations: number; churnRate: number }[] = [];
  planCounts.forEach((count, plan) => {
    // Simular tasa de churn (porcentaje de cancelaciones sobre total de suscriptores)
    const totalSubscribers = 100; // Valor simulado
    const churnRate = (count / totalSubscribers) * 100;
    topPlansByChurn.push({
      plan,
      cancellations: count,
      churnRate: Math.round(churnRate * 100) / 100,
    });
  });

  return {
    customerChurnRate: 12.5, // Porcentaje simulado
    mrrChurnRate: 8.3, // Porcentaje simulado
    totalCancellations: mockChurnedClients.length,
    reasonsDistribution,
    averageLtvOfChurned: 850.50, // Valor simulado en euros/dólares
    topPlansByChurn: topPlansByChurn.sort((a, b) => b.cancellations - a.cancellations),
  };
}















