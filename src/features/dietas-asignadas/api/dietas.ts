import { Dieta, FiltrosDietas, SeguimientoMacros, MacrosNutricionales } from '../types';

// Datos mock completos
const dietasMock: Dieta[] = [
  {
    id: '1',
    clienteId: '1',
    clienteNombre: 'María Pérez',
    tipo: 'individual',
    nombre: 'Plan Deficit Calórico María',
    descripcion: 'Dieta personalizada para pérdida de peso sostenible',
    objetivo: 'perdida-peso',
    macros: { calorias: 1650, proteinas: 140, carbohidratos: 150, grasas: 55 },
    comidas: [
      { id: '1', nombre: 'Avena con proteína', tipo: 'desayuno', alimentos: [], horario: '08:00', calorias: 420, proteinas: 35, carbohidratos: 45, grasas: 12 },
      { id: '2', nombre: 'Fruta y yogur', tipo: 'media-manana', alimentos: [], horario: '11:00', calorias: 180, proteinas: 12, carbohidratos: 28, grasas: 4 },
      { id: '3', nombre: 'Pollo con arroz', tipo: 'almuerzo', alimentos: [], horario: '14:00', calorias: 520, proteinas: 52, carbohidratos: 55, grasas: 15 },
      { id: '4', nombre: 'Frutos secos', tipo: 'merienda', alimentos: [], horario: '17:00', calorias: 160, proteinas: 6, carbohidratos: 8, grasas: 12 },
      { id: '5', nombre: 'Pescado con verduras', tipo: 'cena', alimentos: [], horario: '20:00', calorias: 370, proteinas: 35, carbohidratos: 14, grasas: 12 },
    ],
    fechaInicio: '2025-01-01',
    fechaFin: '2025-02-28',
    estado: 'activa',
    restricciones: ['Sin lactosa', 'Bajo en sodio'],
    adherencia: 87,
    creadoEn: '2024-12-20T10:00:00Z',
    actualizadoEn: '2025-01-15T10:00:00Z',
    creadoPor: 'entrenador1',
  },
  {
    id: '2',
    clienteId: '2',
    clienteNombre: 'Carlos Ruiz',
    tipo: 'individual',
    nombre: 'Dieta Hipercalórica Carlos',
    descripcion: 'Plan de ganancia muscular con superávit controlado',
    objetivo: 'ganancia-muscular',
    macros: { calorias: 3200, proteinas: 200, carbohidratos: 380, grasas: 95 },
    comidas: [
      { id: '1', nombre: 'Batido proteico y avena', tipo: 'desayuno', alimentos: [], horario: '08:00', calorias: 650, proteinas: 50, carbohidratos: 85, grasas: 15 },
      { id: '2', nombre: 'Batido ganador de peso', tipo: 'media-manana', alimentos: [], horario: '11:00', calorias: 520, proteinas: 35, carbohidratos: 65, grasas: 12 },
      { id: '3', nombre: 'Arroz, pollo y aguacate', tipo: 'almuerzo', alimentos: [], horario: '14:00', calorias: 850, proteinas: 65, carbohidratos: 110, grasas: 22 },
      { id: '4', nombre: 'Post-entreno', tipo: 'post-entreno', alimentos: [], horario: '18:30', calorias: 480, proteinas: 45, carbohidratos: 65, grasas: 8 },
      { id: '5', nombre: 'Merluza con patata', tipo: 'cena', alimentos: [], horario: '20:30', calorias: 700, proteinas: 85, carbohidratos: 75, grasas: 18 },
    ],
    fechaInicio: '2024-12-15',
    fechaFin: '2025-03-15',
    estado: 'activa',
    restricciones: [],
    adherencia: 92,
    creadoEn: '2024-12-10T10:00:00Z',
    actualizadoEn: '2025-01-15T10:00:00Z',
    creadoPor: 'entrenador1',
  },
  {
    id: '3',
    clienteId: '3',
    clienteNombre: 'Ana Martínez',
    tipo: 'plan-estandar',
    nombre: 'Plan Estándar Femenino',
    descripcion: 'Alimentación equilibrada para mujer activa',
    objetivo: 'mantenimiento',
    macros: { calorias: 2100, proteinas: 130, carbohidratos: 210, grasas: 70 },
    comidas: [],
    fechaInicio: '2025-01-10',
    estado: 'activa',
    adherencia: 75,
    creadoEn: '2024-12-01T10:00:00Z',
    actualizadoEn: '2025-01-12T10:00:00Z',
    creadoPor: 'entrenador1',
  },
  {
    id: '4',
    clienteId: '4',
    clienteNombre: 'Luis García',
    tipo: 'pack-semanal',
    nombre: 'Pack Semanal - Semana 1',
    descripcion: 'Primera semana del plan nutricional',
    objetivo: 'perdida-grasa',
    macros: { calorias: 1800, proteinas: 150, carbohidratos: 120, grasas: 65 },
    comidas: [],
    fechaInicio: '2025-01-05',
    fechaFin: '2025-01-11',
    estado: 'finalizada',
    adherencia: 68,
    creadoEn: '2024-12-20T10:00:00Z',
    actualizadoEn: '2025-01-11T10:00:00Z',
    creadoPor: 'entrenador1',
  },
  {
    id: '5',
    clienteId: '5',
    clienteNombre: 'Sofia López',
    tipo: 'individual',
    nombre: 'Dieta Keto Adaptada',
    descripcion: 'Ceto adaptado con ciclado de carbohidratos',
    objetivo: 'perdida-grasa',
    macros: { calorias: 1550, proteinas: 120, carbohidratos: 40, grasas: 110 },
    comidas: [],
    fechaInicio: '2025-01-08',
    estado: 'activa',
    restricciones: ['Keto', 'Sin gluten'],
    adherencia: 80,
    creadoEn: '2025-01-05T10:00:00Z',
    actualizadoEn: '2025-01-14T10:00:00Z',
    creadoPor: 'entrenador1',
  },
  {
    id: '6',
    clienteId: '6',
    clienteNombre: 'Diego Fernández',
    tipo: 'plan-estandar',
    nombre: 'Plan Atleta Rendimiento',
    descripcion: 'Nutrición optimizada para competición',
    objetivo: 'rendimiento',
    macros: { calorias: 3500, proteinas: 175, carbohidratos: 450, grasas: 90 },
    comidas: [],
    fechaInicio: '2024-11-01',
    estado: 'activa',
    adherencia: 95,
    creadoEn: '2024-10-15T10:00:00Z',
    actualizadoEn: '2025-01-15T10:00:00Z',
    creadoPor: 'entrenador1',
  },
  {
    id: '7',
    clienteId: '7',
    clienteNombre: 'Elena Sánchez',
    tipo: 'individual',
    nombre: 'Dieta Antiinflamatoria',
    descripcion: 'Plan enfocado en reducir inflamación',
    objetivo: 'salud-general',
    macros: { calorias: 1900, proteinas: 100, carbohidratos: 200, grasas: 75 },
    comidas: [],
    fechaInicio: '2025-01-12',
    estado: 'pausada',
    restricciones: ['Sin procesados', 'Alto omega-3'],
    adherencia: 45,
    creadoEn: '2025-01-10T10:00:00Z',
    actualizadoEn: '2025-01-13T10:00:00Z',
    creadoPor: 'entrenador1',
  },
  {
    id: '8',
    clienteId: '8',
    clienteNombre: 'Roberto Martín',
    tipo: 'pack-semanal',
    nombre: 'Pack Semanal - Semana 3',
    descripcion: 'Tercera semana del plan de volumen',
    objetivo: 'ganancia-muscular',
    macros: { calorias: 2800, proteinas: 170, carbohidratos: 320, grasas: 80 },
    comidas: [],
    fechaInicio: '2024-12-23',
    fechaFin: '2024-12-29',
    estado: 'finalizada',
    adherencia: 88,
    creadoEn: '2024-12-15T10:00:00Z',
    actualizadoEn: '2024-12-29T10:00:00Z',
    creadoPor: 'entrenador1',
  },
];

export async function getDietas(filtros?: FiltrosDietas): Promise<Dieta[]> {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simular delay
  
  let resultado = [...dietasMock];
  
  if (filtros?.clienteId) {
    resultado = resultado.filter(d => d.clienteId === filtros.clienteId);
  }
  if (filtros?.tipo) {
    resultado = resultado.filter(d => d.tipo === filtros.tipo);
  }
  if (filtros?.objetivo) {
    resultado = resultado.filter(d => d.objetivo === filtros.objetivo);
  }
  if (filtros?.estado) {
    resultado = resultado.filter(d => d.estado === filtros.estado);
  }
  
  return resultado;
}

export async function getDieta(id: string): Promise<Dieta | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const dieta = dietasMock.find(d => d.id === id);
  if (dieta && id === '1') {
    // Añadir fotos mock a la primera dieta para demo
    return { ...dieta, fotosComida: fotosComidaMock };
  }
  return dieta || null;
}

export async function getDietasCliente(clienteId: string): Promise<Dieta[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return dietasMock.filter(d => d.clienteId === clienteId);
}

export async function crearDieta(dieta: Omit<Dieta, 'id' | 'creadoEn' | 'actualizadoEn'>): Promise<Dieta | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const nuevaDieta: Dieta = {
    ...dieta,
    id: Date.now().toString(),
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };
  dietasMock.push(nuevaDieta);
  return nuevaDieta;
}

export async function actualizarDieta(id: string, dieta: Partial<Dieta>): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = dietasMock.findIndex(d => d.id === id);
  if (index === -1) return false;
  dietasMock[index] = { ...dietasMock[index], ...dieta, actualizadoEn: new Date().toISOString() };
  return true;
}

export async function eliminarDieta(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = dietasMock.findIndex(d => d.id === id);
  if (index === -1) return false;
  dietasMock.splice(index, 1);
  return true;
}

export async function ajustarDieta(id: string, macros: MacrosNutricionales): Promise<Dieta | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const dieta = dietasMock.find(d => d.id === id);
  if (!dieta) return null;
  dieta.macros = macros;
  return dieta;
}

const fotosComidaMock = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    tipoComida: 'desayuno',
    fecha: new Date().toISOString(),
    comentario: 'Avena con frutas y proteína',
    validada: true,
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1553729784-e91953dec042?w=400',
    tipoComida: 'almuerzo',
    fecha: new Date().toISOString(),
    comentario: 'Pollo con arroz integral',
    validada: true,
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1576495199011-eb94736d43d2?w=400',
    tipoComida: 'cena',
    fecha: new Date().toISOString(),
    comentario: 'Salmón con verduras al vapor',
    validada: false,
  },
];

const seguimientoMock: SeguimientoMacros = {
  clienteId: '1',
  fecha: new Date().toISOString(),
  macrosObjetivo: { calorias: 1650, proteinas: 140, carbohidratos: 150, grasas: 55 },
  macrosConsumidos: { calorias: 1580, proteinas: 135, carbohidratos: 142, grasas: 52 },
  diferencia: { calorias: -70, proteinas: -5, carbohidratos: -8, grasas: -3 },
  porcentajeCumplimiento: 95.8,
};

export async function getSeguimientoMacros(clienteId: string, fecha?: string): Promise<SeguimientoMacros | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return seguimientoMock;
}

