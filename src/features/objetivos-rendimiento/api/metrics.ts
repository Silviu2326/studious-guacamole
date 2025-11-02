import { KPI, Metric } from '../types';

const mockKPIs: KPI[] = [
  {
    id: 'facturacion',
    name: 'Facturación',
    description: 'Ingresos totales facturados',
    metric: 'facturacion',
    unit: '€',
    category: 'financiero',
    enabled: true,
    role: ['entrenador', 'gimnasio'],
  },
  {
    id: 'adherencia',
    name: 'Adherencia de Clientes',
    description: 'Porcentaje de clientes que cumplen con sus entrenamientos',
    metric: 'adherencia',
    unit: '%',
    category: 'operacional',
    enabled: true,
    role: ['entrenador'],
  },
  {
    id: 'retencion',
    name: 'Retención de Clientes',
    description: 'Porcentaje de clientes que se mantienen activos',
    metric: 'retencion',
    unit: '%',
    category: 'operacional',
    enabled: true,
    role: ['entrenador'],
  },
  {
    id: 'ocupacion',
    name: 'Ocupación Media',
    description: 'Porcentaje medio de ocupación de las instalaciones',
    metric: 'ocupacion',
    unit: '%',
    category: 'operacional',
    enabled: true,
    role: ['gimnasio'],
  },
  {
    id: 'tasa_bajas',
    name: 'Tasa de Bajas',
    description: 'Porcentaje de socios que dan de baja',
    metric: 'tasa_bajas',
    unit: '%',
    category: 'operacional',
    enabled: true,
    role: ['gimnasio'],
  },
];

export const getKPIs = async (role?: 'entrenador' | 'gimnasio'): Promise<KPI[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (!role) return mockKPIs;
  
  return mockKPIs.filter(kpi => kpi.role.includes(role));
};

export const getKPI = async (id: string): Promise<KPI | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockKPIs.find(kpi => kpi.id === id) || null;
};

export const createKPI = async (kpi: Omit<KPI, 'id'>): Promise<KPI> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newKPI: KPI = {
    ...kpi,
    id: Date.now().toString(),
  };
  
  mockKPIs.push(newKPI);
  return newKPI;
};

export const updateKPI = async (id: string, updates: Partial<KPI>): Promise<KPI> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockKPIs.findIndex(kpi => kpi.id === id);
  if (index === -1) throw new Error('KPI not found');
  
  const updated = {
    ...mockKPIs[index],
    ...updates,
  };
  
  mockKPIs[index] = updated;
  return updated;
};

export const getMetricsByCategory = async (category: string, role?: 'entrenador' | 'gimnasio'): Promise<Metric[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Esto sería una llamada real a la API que obtiene métricas filtradas
  return [];
};

