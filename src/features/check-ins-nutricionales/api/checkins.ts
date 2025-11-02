export interface CheckInNutricional {
  id?: string;
  clienteId: string;
  fecha: string;
  tipoComida: 'desayuno' | 'almuerzo' | 'merienda' | 'cena' | 'snack';
  fotoComida?: string;
  hambreAntes: number; // Escala 1-10
  hambreDespues?: number; // Escala 1-10
  saciedad: number; // Escala 1-10
  peso?: number; // Peso diario en kg
  cumplimientoMacros?: number; // Porcentaje de cumplimiento
  observaciones?: string;
  feedbackEntrenador?: string;
  ajusteAplicado?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HistorialCheckInNutricional {
  checkIn: CheckInNutricional;
  fecha: string;
  adherencia: number;
  tendencia?: 'mejora' | 'estable' | 'empeora';
}

// Mock data
const checkInsMock: CheckInNutricional[] = [
  {
    id: '1',
    clienteId: 'cliente1',
    fecha: new Date().toISOString().split('T')[0],
    tipoComida: 'desayuno',
    hambreAntes: 3,
    hambreDespues: 8,
    saciedad: 7,
    peso: 75.5,
    cumplimientoMacros: 85,
    observaciones: 'Desayuno completo con avena y frutas. Me sentí muy satisfecho.',
    feedbackEntrenador: 'Buen desayuno balanceado. Mantener esta rutina.',
    ajusteAplicado: false,
  },
  {
    id: '2',
    clienteId: 'cliente1',
    fecha: new Date().toISOString().split('T')[0],
    tipoComida: 'almuerzo',
    hambreAntes: 7,
    hambreDespues: 9,
    saciedad: 8,
    peso: 75.5,
    cumplimientoMacros: 92,
    observaciones: 'Pollo con arroz integral y ensalada. Perfecto para post-entreno.',
  },
  {
    id: '3',
    clienteId: 'cliente1',
    fecha: new Date().toISOString().split('T')[0],
    tipoComida: 'merienda',
    hambreAntes: 4,
    hambreDespues: 7,
    saciedad: 6,
    cumplimientoMacros: 78,
    observaciones: 'Batido de proteína con fresas.',
  },
  {
    id: '4',
    clienteId: 'cliente1',
    fecha: new Date().toISOString().split('T')[0],
    tipoComida: 'cena',
    hambreAntes: 5,
    hambreDespues: 8,
    saciedad: 7,
    cumplimientoMacros: 88,
    observaciones: 'Salmón con verduras al vapor. Ligero y nutritivo.',
  },
  {
    id: '5',
    clienteId: 'cliente1',
    fecha: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    tipoComida: 'desayuno',
    hambreAntes: 2,
    hambreDespues: 7,
    saciedad: 6,
    cumplimientoMacros: 80,
    observaciones: 'Huevos revueltos con aguacate.',
  },
  {
    id: '6',
    clienteId: 'cliente1',
    fecha: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    tipoComida: 'almuerzo',
    hambreAntes: 6,
    hambreDespues: 8,
    saciedad: 7,
    cumplimientoMacros: 85,
    observaciones: 'Pasta integral con atún.',
  },
  {
    id: '7',
    clienteId: 'cliente1',
    fecha: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    tipoComida: 'desayuno',
    hambreAntes: 3,
    hambreDespues: 8,
    saciedad: 7,
    cumplimientoMacros: 90,
    observaciones: 'Batido de avena y plátano.',
  },
  {
    id: '8',
    clienteId: 'cliente1',
    fecha: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    tipoComida: 'almuerzo',
    hambreAntes: 7,
    hambreDespues: 9,
    saciedad: 8,
    cumplimientoMacros: 95,
    observaciones: 'Pechuga de pollo con patatas.',
  },
];

export async function getCheckInsNutricionales(clienteId?: string, fecha?: string): Promise<CheckInNutricional[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let resultado = [...checkInsMock];
  
  if (clienteId) {
    resultado = resultado.filter(ci => ci.clienteId === clienteId);
  }
  if (fecha) {
    resultado = resultado.filter(ci => ci.fecha === fecha);
  }
  
  return resultado;
}

export async function crearCheckInNutricional(checkIn: Omit<CheckInNutricional, 'id' | 'createdAt' | 'updatedAt'>): Promise<CheckInNutricional | null> {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const nuevoCheckIn: CheckInNutricional = {
    ...checkIn,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  checkInsMock.push(nuevoCheckIn);
  return nuevoCheckIn;
}

export async function actualizarCheckInNutricional(id: string, checkIn: Partial<CheckInNutricional>): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = checkInsMock.findIndex(ci => ci.id === id);
  if (index === -1) return false;
  
  checkInsMock[index] = {
    ...checkInsMock[index],
    ...checkIn,
    updatedAt: new Date().toISOString(),
  };
  return true;
}

export async function eliminarCheckInNutricional(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = checkInsMock.findIndex(ci => ci.id === id);
  if (index === -1) return false;
  
  checkInsMock.splice(index, 1);
  return true;
}

export async function getHistorialNutricional(clienteId: string, dias?: number): Promise<HistorialCheckInNutricional[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const checkIns = checkInsMock.filter(ci => ci.clienteId === clienteId);
  const ahora = new Date();
  
  const historial: HistorialCheckInNutricional[] = checkIns.map(ci => {
    const fecha = new Date(ci.fecha);
    const diasDesde = Math.floor((ahora.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dias && diasDesde > dias) {
      return null;
    }
    
    return {
      checkIn: ci,
      fecha: ci.fecha,
      adherencia: ci.cumplimientoMacros || 0,
      tendencia: ci.cumplimientoMacros >= 85 ? 'mejora' : ci.cumplimientoMacros >= 70 ? 'estable' : 'empeora',
    };
  }).filter((h): h is HistorialCheckInNutricional => h !== null);
  
  return historial;
}

