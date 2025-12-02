import { PlantillaDieta, FiltrosPlantillas, DatosDuplicacion } from '../types';

const API_BASE = '/api/nutricion/plantillas';

// Mock data temporal - en producción esto sería reemplazado por llamadas reales a la API
const plantillasMock: PlantillaDieta[] = [
  {
    id: '1',
    nombre: 'Vegetariana Deficit 1800 kcal',
    descripcion: 'Plan nutricional vegetariano balanceado para pérdida de peso sostenible',
    categoria: 'vegetariana',
    objetivo: 'deficit-suave',
    calorias: 1800,
    macros: {
      proteinas: 120,
      carbohidratos: 200,
      grasas: 60,
    },
    comidas: [
      { id: '1', nombre: 'Avena con frutas', tipo: 'desayuno', alimentos: [], horario: '08:00', calorias: 380, proteinas: 12, carbohidratos: 58, grasas: 8, notas: 'Frutos rojos y miel' },
      { id: '2', nombre: 'Ensalada de quinoa', tipo: 'almuerzo', alimentos: [], horario: '14:00', calorias: 550, proteinas: 22, carbohidratos: 68, grasas: 18, notas: 'Con aguacate y nueces' },
      { id: '3', nombre: 'Batido proteico', tipo: 'merienda', alimentos: [], horario: '17:00', calorias: 280, proteinas: 25, carbohidratos: 35, grasas: 5 },
      { id: '4', nombre: 'Curry de garbanzos', tipo: 'cena', alimentos: [], horario: '20:00', calorias: 590, proteinas: 61, carbohidratos: 39, grasas: 29, notas: 'Con arroz integral' },
    ],
    horarios: [],
    version: '1.3.0',
    creadoPor: 'system',
    creadoEn: new Date('2024-01-15'),
    actualizadoEn: new Date('2024-03-01'),
    publicada: true,
    usoCount: 127,
    efectividad: {
      tasaExito: 87,
      satisfaccionPromedio: 4.3,
      seguimientoPromedio: 81,
    },
    tags: ['vegetariana', 'perdida-peso', '1800kcal', 'sostenible'],
  },
  {
    id: '2',
    nombre: 'Déficit Inteligente 1600 kcal',
    descripcion: 'Plan para pérdida de peso gradual con alta proteína',
    categoria: 'balanceada',
    objetivo: 'deficit-suave',
    calorias: 1600,
    macros: {
      proteinas: 130,
      carbohidratos: 160,
      grasas: 55,
    },
    comidas: [
      { id: '1', nombre: 'Tortilla con verduras', tipo: 'desayuno', alimentos: [], horario: '08:00', calorias: 340, proteinas: 28, carbohidratos: 22, grasas: 16 },
      { id: '2', nombre: 'Yogur con avena', tipo: 'media-manana', alimentos: [], horario: '11:00', calorias: 220, proteinas: 18, carbohidratos: 28, grasas: 5 },
      { id: '3', nombre: 'Pollo al horno con patata', tipo: 'almuerzo', alimentos: [], horario: '14:00', calorias: 520, proteinas: 52, carbohidratos: 48, grasas: 16 },
      { id: '4', nombre: 'Fruta fresca', tipo: 'merienda', alimentos: [], horario: '17:00', calorias: 120, proteinas: 2, carbohidratos: 28, grasas: 1 },
      { id: '5', nombre: 'Pescado con verduras', tipo: 'cena', alimentos: [], horario: '20:00', calorias: 400, proteinas: 30, carbohidratos: 34, grasas: 17 },
    ],
    horarios: [],
    version: '1.4.0',
    creadoPor: 'system',
    creadoEn: new Date('2024-01-10'),
    actualizadoEn: new Date('2024-02-15'),
    publicada: true,
    usoCount: 203,
    efectividad: {
      tasaExito: 92,
      satisfaccionPromedio: 4.6,
      seguimientoPromedio: 85,
    },
    tags: ['perdida-peso', 'deficit', 'alta-proteina', 'sostenible'],
  },
  {
    id: '3',
    nombre: 'Keto Estricta 1500 kcal',
    descripcion: 'Dieta cetogénica estricta para pérdida rápida de peso',
    categoria: 'keto',
    objetivo: 'perdida-peso',
    calorias: 1500,
    macros: {
      proteinas: 100,
      carbohidratos: 30,
      grasas: 115,
    },
    comidas: [],
    horarios: [],
    version: '2.0.0',
    creadoPor: 'system',
    creadoEn: new Date('2024-02-20'),
    actualizadoEn: new Date('2024-03-10'),
    publicada: true,
    usoCount: 89,
    efectividad: {
      tasaExito: 78,
      satisfaccionPromedio: 3.8,
      seguimientoPromedio: 72,
    },
    tags: ['keto', 'perdida-peso', '1500kcal', 'estricta'],
  },
  {
    id: '4',
    nombre: 'Hipercalórica Volumen 3200 kcal',
    descripcion: 'Plan de ganancia muscular con superávit controlado',
    categoria: 'alta-proteina',
    objetivo: 'ganancia-muscular',
    calorias: 3200,
    macros: {
      proteinas: 200,
      carbohidratos: 380,
      grasas: 95,
    },
    comidas: [],
    horarios: [],
    version: '1.5.0',
    creadoPor: 'system',
    creadoEn: new Date('2024-01-05'),
    actualizadoEn: new Date('2024-02-28'),
    publicada: true,
    usoCount: 156,
    efectividad: {
      tasaExito: 88,
      satisfaccionPromedio: 4.4,
      seguimientoPromedio: 82,
    },
    tags: ['ganancia-muscular', 'volumen', '3200kcal', 'alta-proteina'],
  },
  {
    id: '5',
    nombre: 'Mediterránea Salud 2000 kcal',
    descripcion: 'Dieta mediterránea equilibrada para bienestar general',
    categoria: 'mediterranea',
    objetivo: 'mantenimiento',
    calorias: 2000,
    macros: {
      proteinas: 120,
      carbohidratos: 220,
      grasas: 75,
    },
    comidas: [],
    horarios: [],
    version: '1.1.0',
    creadoPor: 'system',
    creadoEn: new Date('2024-01-20'),
    actualizadoEn: new Date('2024-03-05'),
    publicada: true,
    usoCount: 91,
    efectividad: {
      tasaExito: 85,
      satisfaccionPromedio: 4.5,
      seguimientoPromedio: 79,
    },
    tags: ['mediterranea', 'mantenimiento', '2000kcal', 'salud'],
  },
  {
    id: '6',
    nombre: 'Vegana Competición 2500 kcal',
    descripcion: 'Nutrición vegana optimizada para alto rendimiento',
    categoria: 'vegana',
    objetivo: 'rendimiento',
    calorias: 2500,
    macros: {
      proteinas: 140,
      carbohidratos: 360,
      grasas: 70,
    },
    comidas: [],
    horarios: [],
    version: '1.8.0',
    creadoPor: 'system',
    creadoEn: new Date('2024-02-10'),
    actualizadoEn: new Date('2024-03-12'),
    publicada: true,
    usoCount: 64,
    efectividad: {
      tasaExito: 83,
      satisfaccionPromedio: 4.2,
      seguimientoPromedio: 77,
    },
    tags: ['vegana', 'rendimiento', 'competicion', '2500kcal'],
  },
  {
    id: '7',
    nombre: 'Paleo Atleta 2800 kcal',
    descripcion: 'Alimentación paleolítica para deportistas',
    categoria: 'paleo',
    objetivo: 'rendimiento',
    calorias: 2800,
    macros: {
      proteinas: 175,
      carbohidratos: 280,
      grasas: 110,
    },
    comidas: [],
    horarios: [],
    version: '1.2.0',
    creadoPor: 'system',
    creadoEn: new Date('2024-02-25'),
    actualizadoEn: new Date('2024-03-15'),
    publicada: true,
    usoCount: 42,
    efectividad: {
      tasaExito: 80,
      satisfaccionPromedio: 4.1,
      seguimientoPromedio: 75,
    },
    tags: ['paleo', 'rendimiento', '2800kcal', 'atleta'],
  },
  {
    id: '8',
    nombre: 'Baja Carb Familia 2200 kcal',
    descripcion: 'Plan bajo en carbohidratos para toda la familia',
    categoria: 'baja-carbohidratos',
    objetivo: 'mantenimiento',
    calorias: 2200,
    macros: {
      proteinas: 140,
      carbohidratos: 100,
      grasas: 130,
    },
    comidas: [],
    horarios: [],
    version: '1.6.0',
    creadoPor: 'system',
    creadoEn: new Date('2024-02-01'),
    actualizadoEn: new Date('2024-03-08'),
    publicada: true,
    usoCount: 73,
    efectividad: {
      tasaExito: 86,
      satisfaccionPromedio: 4.3,
      seguimientoPromedio: 80,
    },
    tags: ['baja-carb', 'mantenimiento', '2200kcal', 'familiar'],
  },
  {
    id: '9',
    nombre: 'Balanceada Mujer 1900 kcal',
    descripcion: 'Plan equilibrado para mujer activa',
    categoria: 'balanceada',
    objetivo: 'mantenimiento',
    calorias: 1900,
    macros: {
      proteinas: 110,
      carbohidratos: 210,
      grasas: 68,
    },
    comidas: [],
    horarios: [],
    version: '1.9.0',
    creadoPor: 'system',
    creadoEn: new Date('2024-03-01'),
    actualizadoEn: new Date('2024-03-20'),
    publicada: true,
    usoCount: 118,
    efectividad: {
      tasaExito: 89,
      satisfaccionPromedio: 4.4,
      seguimientoPromedio: 83,
    },
    tags: ['balanceada', 'mujer', '1900kcal', 'activa'],
  },
  {
    id: '10',
    nombre: 'Personalizada Antiinflamatoria 1750 kcal',
    descripcion: 'Dieta personalizada para reducir inflamación crónica',
    categoria: 'personalizada',
    objetivo: 'salud-general',
    calorias: 1750,
    macros: {
      proteinas: 95,
      carbohidratos: 180,
      grasas: 78,
    },
    comidas: [],
    horarios: [],
    version: '1.0.0',
    creadoPor: 'system',
    creadoEn: new Date('2024-03-05'),
    actualizadoEn: new Date('2024-03-18'),
    publicada: true,
    usoCount: 35,
    efectividad: {
      tasaExito: 82,
      satisfaccionPromedio: 4.0,
      seguimientoPromedio: 76,
    },
    tags: ['personalizada', 'antiinflamatoria', '1750kcal', 'salud'],
  },
];

export async function getPlantillas(filtros?: FiltrosPlantillas): Promise<PlantillaDieta[]> {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simular delay
    
  let filtered = [...plantillasMock];
    
    if (filtros?.categoria) {
      filtered = filtered.filter(p => p.categoria === filtros.categoria);
    }
    if (filtros?.objetivo) {
      filtered = filtered.filter(p => p.objetivo === filtros.objetivo);
    }
    if (filtros?.caloriasMin) {
      filtered = filtered.filter(p => p.calorias >= filtros.caloriasMin!);
    }
    if (filtros?.caloriasMax) {
      filtered = filtered.filter(p => p.calorias <= filtros.caloriasMax!);
    }
    if (filtros?.texto) {
      const texto = filtros.texto.toLowerCase();
      filtered = filtered.filter(p => 
        p.nombre.toLowerCase().includes(texto) ||
        p.descripcion?.toLowerCase().includes(texto) ||
        p.tags?.some(tag => tag.toLowerCase().includes(texto))
      );
    }
    if (filtros?.publicadas !== undefined) {
      filtered = filtered.filter(p => p.publicada === filtros.publicadas);
    }
    
    return filtered;
}

export async function getPlantilla(id: string): Promise<PlantillaDieta> {
  await new Promise(resolve => setTimeout(resolve, 200));
    
  const plantilla = plantillasMock.find(p => p.id === id);
  if (!plantilla) {
    throw new Error('Plantilla no encontrada');
  }
  return plantilla;
}

export async function crearPlantilla(plantilla: Omit<PlantillaDieta, 'id' | 'creadoEn' | 'actualizadoEn' | 'version' | 'usoCount'>): Promise<PlantillaDieta> {
  await new Promise(resolve => setTimeout(resolve, 400));
    
  const nueva: PlantillaDieta = {
    ...plantilla,
    id: Date.now().toString(),
    version: '1.0.0',
    usoCount: 0,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
  };
  plantillasMock.push(nueva);
  return nueva;
}

export async function actualizarPlantilla(id: string, plantilla: Partial<PlantillaDieta>): Promise<PlantillaDieta> {
  await new Promise(resolve => setTimeout(resolve, 400));
    
  const index = plantillasMock.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Plantilla no encontrada');
  }
  
  const actualizada: PlantillaDieta = {
    ...plantillasMock[index],
    ...plantilla,
    actualizadoEn: new Date(),
  };
  plantillasMock[index] = actualizada;
  return actualizada;
}

export async function eliminarPlantilla(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
    
  const index = plantillasMock.findIndex(p => p.id === id);
  if (index === -1) {
    return false;
  }
  plantillasMock.splice(index, 1);
  return true;
}

export async function duplicarPlantilla(id: string, datos: DatosDuplicacion): Promise<PlantillaDieta> {
  await new Promise(resolve => setTimeout(resolve, 400));
    
  const original = plantillasMock.find(p => p.id === id);
  if (!original) {
    throw new Error('Plantilla no encontrada');
  }
  
  const duplicada: PlantillaDieta = {
    ...original,
    id: Date.now().toString(),
    nombre: datos.nombreNueva,
    version: '1.0.0',
    usoCount: 0,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
    publicada: false,
    macros: datos.personalizarMacros && datos.macrosAjustados
      ? {
          ...original.macros,
          ...datos.macrosAjustados,
        }
      : original.macros,
    calorias: datos.macrosAjustados?.calorias || original.calorias,
    horarios: datos.mantenerHorarios ? original.horarios : [],
  };
  
  plantillasMock.push(duplicada);
  return duplicada;
}

export async function compartirPlantilla(id: string, usuariosIds: string[]): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return true;
}

