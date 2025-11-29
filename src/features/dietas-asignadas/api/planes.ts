import { PlanNutricional, PackSemanal } from '../types';

// Datos mock completos
const planesMock: PlanNutricional[] = [
  {
    id: '1',
    nombre: 'Plan Deficit Calórico Inteligente',
    descripcion: 'Reducción de peso sostenible y saludable con alto contenido proteico',
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
    id: '2',
    nombre: 'Plan Hipercalórico Volumen',
    descripcion: 'Ganancia muscular maximizada con estrategias nutricionales avanzadas',
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
    id: '3',
    nombre: 'Plan Equilibrio Femenino',
    descripcion: 'Nutrición balanceada para mujer activa que busca bienestar general',
    nivel: 'Todos los niveles',
    categoria: 'mantenimiento',
    objetivo: 'mantenimiento',
    macros: { calorias: 2100, proteinas: 130, carbohidratos: 210, grasas: 70 },
    comidas: [],
    duracionSemanas: 4,
    precio: 99,
    activo: true,
    usoCount: 67,
    efectividad: { tasaExito: 75, satisfaccionPromedio: 4.3 },
    creadoEn: '2024-01-20T10:00:00Z',
  },
  {
    id: '4',
    nombre: 'Plan Atleta Rendimiento',
    descripcion: 'Optimización nutricional para competición y alto rendimiento',
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
  {
    id: '5',
    nombre: 'Plan Keto Adaptado',
    descripcion: 'Cetonosis controlada con ciclado estratégico de carbohidratos',
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
    id: '6',
    nombre: 'Plan Salud Antiinflamatorio',
    descripcion: 'Reducción de inflamación mediante nutrición inteligente',
    nivel: 'Todos los niveles',
    categoria: 'salud-general',
    objetivo: 'salud-general',
    macros: { calorias: 1900, proteinas: 100, carbohidratos: 200, grasas: 75 },
    comidas: [],
    duracionSemanas: 8,
    precio: 169,
    activo: true,
    usoCount: 31,
    efectividad: { tasaExito: 71, satisfaccionPromedio: 4.4 },
    creadoEn: '2024-01-30T10:00:00Z',
  },
];

const packsMock: PackSemanal[] = [
  {
    id: '1',
    nombre: 'Pack Semana 1 - Deficit',
    descripcion: 'Primera semana del plan deficit calórico',
    planId: '1',
    semanaNumero: 1,
    macros: { calorias: 1650, proteinas: 140, carbohidratos: 150, grasas: 55 },
    comidas: [],
    fechaInicio: '2025-01-06',
    fechaFin: '2025-01-12',
  },
  {
    id: '2',
    nombre: 'Pack Semana 2 - Deficit',
    descripcion: 'Segunda semana con ajustes metabólicos',
    planId: '1',
    semanaNumero: 2,
    macros: { calorias: 1630, proteinas: 142, carbohidratos: 145, grasas: 54 },
    comidas: [],
    fechaInicio: '2025-01-13',
    fechaFin: '2025-01-19',
  },
  {
    id: '3',
    nombre: 'Pack Semana 3 - Volumen',
    descripcion: 'Tercera semana plan volumen',
    planId: '2',
    semanaNumero: 3,
    macros: { calorias: 3200, proteinas: 200, carbohidratos: 380, grasas: 95 },
    comidas: [],
    fechaInicio: '2025-01-20',
    fechaFin: '2025-01-26',
  },
];

export async function getPlanes(categoria?: string, activos?: boolean): Promise<PlanNutricional[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let resultado = [...planesMock];
  
  if (categoria) {
    resultado = resultado.filter(p => p.categoria === categoria);
  }
  if (activos !== undefined) {
    resultado = resultado.filter(p => p.activo === activos);
  }
  
  return resultado;
}

export async function getPlan(id: string): Promise<PlanNutricional | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return planesMock.find(p => p.id === id) || null;
}

export async function crearPlan(plan: Omit<PlanNutricional, 'id' | 'creadoEn' | 'usoCount'>): Promise<PlanNutricional | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const nuevoPlan: PlanNutricional = {
    ...plan,
    id: Date.now().toString(),
    usoCount: 0,
    creadoEn: new Date().toISOString(),
  };
  planesMock.push(nuevoPlan);
  return nuevoPlan;
}

export async function actualizarPlan(id: string, plan: Partial<PlanNutricional>): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = planesMock.findIndex(p => p.id === id);
  if (index === -1) return false;
  planesMock[index] = { ...planesMock[index], ...plan };
  return true;
}

export async function eliminarPlan(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = planesMock.findIndex(p => p.id === id);
  if (index === -1) return false;
  planesMock.splice(index, 1);
  return true;
}

export async function getPacksSemanal(planId: string, semanaNumero?: number): Promise<PackSemanal[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  let resultado = packsMock.filter(p => p.planId === planId);
  
  if (semanaNumero !== undefined) {
    resultado = resultado.filter(p => p.semanaNumero === semanaNumero);
  }
  
  return resultado;
}

export async function crearPackSemanal(pack: Omit<PackSemanal, 'id'>): Promise<PackSemanal | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const nuevoPack: PackSemanal = {
    ...pack,
    id: Date.now().toString(),
  };
  packsMock.push(nuevoPack);
  return nuevoPack;
}
