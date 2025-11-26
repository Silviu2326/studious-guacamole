import { AsignacionDieta, DatosAsignacion, AnalyticsNutricion } from '../types';

// Datos mock
const asignacionesMock: AsignacionDieta[] = [
  {
    id: '1',
    dietaId: '1',
    clienteId: '1',
    planId: '1',
    fechaAsignacion: '2024-12-20T10:00:00Z',
    fechaInicio: '2025-01-01T00:00:00Z',
    fechaFin: '2025-02-28T00:00:00Z',
    estado: 'activa',
    observaciones: 'Ajustar macros según progreso semanal',
  },
  {
    id: '2',
    dietaId: '2',
    clienteId: '2',
    fechaAsignacion: '2024-12-10T10:00:00Z',
    fechaInicio: '2024-12-15T00:00:00Z',
    fechaFin: '2025-03-15T00:00:00Z',
    estado: 'activa',
  },
];

export async function asignarDieta(datos: DatosAsignacion): Promise<AsignacionDieta | null> {
  await new Promise(resolve => setTimeout(resolve, 400));
  const nuevaAsignacion: AsignacionDieta = {
    id: Date.now().toString(),
    dietaId: datos.dietaId || '',
    clienteId: datos.clienteId,
    planId: datos.planId,
    packId: datos.packId,
    fechaAsignacion: new Date().toISOString(),
    fechaInicio: datos.fechaInicio,
    fechaFin: datos.fechaFin,
    estado: 'activa',
    observaciones: '',
  };
  asignacionesMock.push(nuevaAsignacion);
  return nuevaAsignacion;
}

export async function getAsignaciones(clienteId?: string): Promise<AsignacionDieta[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  if (clienteId) {
    return asignacionesMock.filter(a => a.clienteId === clienteId);
  }
  return [...asignacionesMock];
}

export async function actualizarAsignacion(id: string, asignacion: Partial<AsignacionDieta>): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = asignacionesMock.findIndex(a => a.id === id);
  if (index === -1) return false;
  asignacionesMock[index] = { ...asignacionesMock[index], ...asignacion };
  return true;
}

export async function cancelarAsignacion(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = asignacionesMock.findIndex(a => a.id === id);
  if (index === -1) return false;
  asignacionesMock.splice(index, 1);
  return true;
}

export async function getAnalyticsNutricion(): Promise<AnalyticsNutricion> {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Mock analytics data
  return {
    totalDietas: 8,
    dietasActivas: 6,
    adherenciaPromedio: 79.5,
    clientesConDieta: 8,
    planesMasUsados: [
      {
        id: '3',
        nombre: 'Plan Equilibrio Femenino',
        descripcion: 'Nutrición balanceada para mujer activa',
        nivel: 'Todos los niveles',
        categoria: 'mantenimiento',
        objetivo: 'mantenimiento',
        macros: { calorias: 2100, proteinas: 130, carbohidratos: 210, grasas: 70 },
        comidas: [],
        precio: 99,
        activo: true,
        usoCount: 67,
        efectividad: { tasaExito: 75, satisfaccionPromedio: 4.3 },
        creadoEn: '2024-01-20T10:00:00Z',
      },
      {
        id: '1',
        nombre: 'Plan Deficit Calórico Inteligente',
        descripcion: 'Reducción de peso sostenible',
        nivel: 'Principiante - Intermedio',
        categoria: 'perdida-grasa',
        objetivo: 'perdida-peso',
        macros: { calorias: 1650, proteinas: 140, carbohidratos: 150, grasas: 55 },
        comidas: [],
        duracionSemanas: 8,
        precio: 149,
        activo: true,
        usoCount: 45,
        efectividad: { tasaExito: 82, satisfaccionPromedio: 4.5 },
        creadoEn: '2024-01-15T10:00:00Z',
      },
      {
        id: '5',
        nombre: 'Plan Keto Adaptado',
        descripcion: 'Cetonosis controlada',
        nivel: 'Intermedio',
        categoria: 'perdida-grasa',
        objetivo: 'perdida-grasa',
        macros: { calorias: 1550, proteinas: 120, carbohidratos: 40, grasas: 110 },
        comidas: [],
        duracionSemanas: 6,
        precio: 179,
        activo: true,
        usoCount: 52,
        efectividad: { tasaExito: 78, satisfaccionPromedio: 4.2 },
        creadoEn: '2024-02-15T10:00:00Z',
      },
      {
        id: '2',
        nombre: 'Plan Hipercalórico Volumen',
        descripcion: 'Ganancia muscular maximizada',
        nivel: 'Intermedio - Avanzado',
        categoria: 'ganancia-muscular',
        objetivo: 'ganancia-muscular',
        macros: { calorias: 3200, proteinas: 200, carbohidratos: 380, grasas: 95 },
        comidas: [],
        duracionSemanas: 12,
        precio: 199,
        activo: true,
        usoCount: 38,
        efectividad: { tasaExito: 88, satisfaccionPromedio: 4.8 },
        creadoEn: '2024-02-01T10:00:00Z',
      },
      {
        id: '4',
        nombre: 'Plan Atleta Rendimiento',
        descripcion: 'Optimización nutricional',
        nivel: 'Avanzado',
        categoria: 'rendimiento',
        objetivo: 'rendimiento',
        macros: { calorias: 3500, proteinas: 175, carbohidratos: 450, grasas: 90 },
        comidas: [],
        duracionSemanas: 6,
        precio: 249,
        activo: true,
        usoCount: 24,
        efectividad: { tasaExito: 92, satisfaccionPromedio: 4.9 },
        creadoEn: '2024-03-10T10:00:00Z',
      },
    ],
    cumplimientoMacrosPromedio: 82.3,
    tendenciaAdherencia: 'mejora',
  };
}
