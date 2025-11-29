export interface Location {
  id: string;
  name: string;
}

export interface ComparisonData {
  locationId: string;
  locationName: string;
  value: number;
}

export interface ComparisonFilters {
  locationIds: string[];
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  kpis: string[];
}

export interface ComparisonResponse {
  data: {
    [kpi: string]: ComparisonData[];
  };
}

export type KPI = 
  | 'totalRevenue'
  | 'activeMembers'
  | 'churnRate'
  | 'newMembers'
  | 'averageTicket'
  | 'averageAttendance'
  | 'classOccupancyRate';

export interface KPIDefinition {
  id: KPI;
  label: string;
  description: string;
  format: 'currency' | 'number' | 'percentage';
}

export const KPI_DEFINITIONS: KPIDefinition[] = [
  {
    id: 'totalRevenue',
    label: 'Ingresos Totales',
    description: 'Suma de todos los ingresos generados por la sede en el período seleccionado',
    format: 'currency',
  },
  {
    id: 'activeMembers',
    label: 'Número de Miembros Activos',
    description: 'Recuento total de miembros con una suscripción válida y no congelada',
    format: 'number',
  },
  {
    id: 'churnRate',
    label: 'Tasa de Abandono (Churn Rate)',
    description: 'Porcentaje de miembros que cancelaron su suscripción durante el período',
    format: 'percentage',
  },
  {
    id: 'newMembers',
    label: 'Nuevas Altas de Miembros',
    description: 'Número total de nuevas membresías vendidas en el período',
    format: 'number',
  },
  {
    id: 'averageTicket',
    label: 'Ticket Promedio por Miembro',
    description: 'Ingresos Totales / Número de Miembros Activos',
    format: 'currency',
  },
  {
    id: 'averageAttendance',
    label: 'Asistencia Promedio a Clases',
    description: 'Asistencia promedio a clases por sede',
    format: 'number',
  },
  {
    id: 'classOccupancyRate',
    label: 'Tasa de Ocupación de Clases (%)',
    description: 'Porcentaje de ocupación de las clases en la sede',
    format: 'percentage',
  },
];

