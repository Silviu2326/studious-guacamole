import { Dieta, FiltrosDietas, SeguimientoMacros, MacrosNutricionales, HistorialCambioDieta, TipoCambioDieta, CambioDetalle, ComparacionPlanAnterior, DatosExternosCliente, NotasMetricas, TipoMetrica, Comida, ComparacionSesionAnterior, TipoComida } from '../types';

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
    pesoCliente: 68, // Peso del cliente en kg
    vasosAgua: 8, // Vasos de agua objetivo
    fibra: 25, // Gramos de fibra objetivo
    creadoEn: '2024-12-20T10:00:00Z',
    actualizadoEn: '2025-01-15T10:00:00Z',
    creadoPor: 'entrenador1',
    estadoPublicacion: 'publicado',
    ultimoAutosave: '2025-01-15T10:00:00Z',
    publicadoEn: '2025-01-10T10:00:00Z',
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
    pesoCliente: 82,
    vasosAgua: 10,
    fibra: 35,
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
    pesoCliente: 65,
    vasosAgua: 8,
    fibra: 30,
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
    pesoCliente: 75,
    vasosAgua: 9,
    fibra: 28,
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

export async function guardarComoBorrador(id: string, dieta: Partial<Dieta>): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = dietasMock.findIndex(d => d.id === id);
  if (index === -1) return false;
  const ahora = new Date().toISOString();
  dietasMock[index] = { 
    ...dietasMock[index], 
    ...dieta, 
    estadoPublicacion: 'borrador',
    ultimoAutosave: ahora,
    actualizadoEn: ahora
  };
  return true;
}

export async function publicarDieta(id: string, dieta: Partial<Dieta>): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = dietasMock.findIndex(d => d.id === id);
  if (index === -1) return false;
  const ahora = new Date().toISOString();
  dietasMock[index] = { 
    ...dietasMock[index], 
    ...dieta, 
    estadoPublicacion: 'publicado',
    publicadoEn: ahora,
    ultimoAutosave: ahora,
    actualizadoEn: ahora
  };
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

export type VariacionDieta = 'deficit' | 'mantenimiento' | 'superavit';

export async function duplicarDieta(
  id: string,
  variacion?: VariacionDieta
): Promise<Dieta | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const dietaOriginal = dietasMock.find(d => d.id === id);
  if (!dietaOriginal) return null;

  // Calcular nuevos macros según la variación
  let nuevosMacros = { ...dietaOriginal.macros };
  let nuevoObjetivo = dietaOriginal.objetivo;
  let sufijoNombre = '';

  if (variacion === 'deficit') {
    // Reducir 10-15% de calorías (déficit leve)
    nuevosMacros.calorias = Math.round(dietaOriginal.macros.calorias * 0.88);
    nuevosMacros.carbohidratos = Math.round(dietaOriginal.macros.carbohidratos * 0.88);
    nuevosMacros.grasas = Math.round(dietaOriginal.macros.grasas * 0.88);
    // Mantener proteínas altas
    nuevosMacros.proteinas = Math.round(dietaOriginal.macros.proteinas * 0.95);
    nuevoObjetivo = 'deficit-suave';
    sufijoNombre = ' - Déficit Leve';
  } else if (variacion === 'superavit') {
    // Aumentar 10-15% de calorías (superávit controlado)
    nuevosMacros.calorias = Math.round(dietaOriginal.macros.calorias * 1.12);
    nuevosMacros.carbohidratos = Math.round(dietaOriginal.macros.carbohidratos * 1.12);
    nuevosMacros.grasas = Math.round(dietaOriginal.macros.grasas * 1.12);
    nuevosMacros.proteinas = Math.round(dietaOriginal.macros.proteinas * 1.08);
    nuevoObjetivo = 'superavit-calorico';
    sufijoNombre = ' - Superávit';
  } else {
    // Mantenimiento: ajustar ligeramente hacia valores de mantenimiento
    nuevoObjetivo = 'mantenimiento';
    sufijoNombre = ' - Mantenimiento';
  }

  // Crear nueva dieta duplicada
  const nuevaDieta: Dieta = {
    ...dietaOriginal,
    id: Date.now().toString(),
    nombre: `${dietaOriginal.nombre}${sufijoNombre}`,
    objetivo: nuevoObjetivo as any,
    macros: nuevosMacros,
    comidas: dietaOriginal.comidas.map(comida => ({
      ...comida,
      id: `${comida.id}-${Date.now()}-${Math.random()}`,
      // Ajustar macros de comidas proporcionalmente
      calorias: variacion === 'deficit' 
        ? Math.round(comida.calorias * 0.88)
        : variacion === 'superavit'
        ? Math.round(comida.calorias * 1.12)
        : comida.calorias,
      proteinas: variacion === 'deficit'
        ? Math.round(comida.proteinas * 0.95)
        : variacion === 'superavit'
        ? Math.round(comida.proteinas * 1.08)
        : comida.proteinas,
      carbohidratos: variacion === 'deficit'
        ? Math.round(comida.carbohidratos * 0.88)
        : variacion === 'superavit'
        ? Math.round(comida.carbohidratos * 1.12)
        : comida.carbohidratos,
      grasas: variacion === 'deficit'
        ? Math.round(comida.grasas * 0.88)
        : variacion === 'superavit'
        ? Math.round(comida.grasas * 1.12)
        : comida.grasas,
    })),
    estado: 'activa',
    estadoPublicacion: 'borrador',
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };

  dietasMock.push(nuevaDieta);
  return nuevaDieta;
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

// Historial de cambios - Mock storage
const historialCambiosMock: Record<string, HistorialCambioDieta[]> = {};

// Helper para registrar cambios
export function registrarCambioDieta(
  dietaId: string,
  tipoCambio: TipoCambioDieta,
  descripcion: string,
  cambios: CambioDetalle[],
  snapshot?: Dieta,
  realizadoPor?: string,
  realizadoPorNombre?: string,
  metadata?: Record<string, any>
): HistorialCambioDieta {
  const cambio: HistorialCambioDieta = {
    id: `cambio-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    dietaId,
    tipoCambio,
    fechaCambio: new Date().toISOString(),
    descripcion,
    cambios,
    snapshot: snapshot ? JSON.parse(JSON.stringify(snapshot)) : undefined,
    realizadoPor,
    realizadoPorNombre,
    metadata,
  };

  if (!historialCambiosMock[dietaId]) {
    historialCambiosMock[dietaId] = [];
  }
  historialCambiosMock[dietaId].push(cambio);

  // Mantener solo los últimos 100 cambios por dieta
  if (historialCambiosMock[dietaId].length > 100) {
    historialCambiosMock[dietaId] = historialCambiosMock[dietaId].slice(-100);
  }

  return cambio;
}

// Obtener historial de cambios de una dieta
export async function getHistorialCambios(dietaId: string): Promise<HistorialCambioDieta[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return historialCambiosMock[dietaId] || [];
}

// Revertir a una versión anterior
export async function revertirCambio(dietaId: string, cambioId: string): Promise<Dieta | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const historial = historialCambiosMock[dietaId] || [];
  const cambio = historial.find(c => c.id === cambioId);
  
  if (!cambio || !cambio.snapshot) {
    return null;
  }

  // Restaurar el snapshot
  const dietaRestaurada = { ...cambio.snapshot };
  const index = dietasMock.findIndex(d => d.id === dietaId);
  if (index === -1) return null;

  dietaRestaurada.actualizadoEn = new Date().toISOString();
  dietasMock[index] = dietaRestaurada;

  // Registrar el cambio de reversión
  registrarCambioDieta(
    dietaId,
    'otro',
    `Reversión a versión del ${new Date(cambio.fechaCambio).toLocaleString('es-ES')}`,
    [{ campo: 'reversion', descripcion: `Revertido desde cambio ${cambioId}` }],
    dietaRestaurada
  );

  return dietaRestaurada;
}

/**
 * Obtiene la dieta anterior del cliente para comparación
 */
export async function getDietaAnterior(clienteId: string, fechaActual: string): Promise<Dieta | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Obtener todas las dietas del cliente ordenadas por fecha de inicio (más recientes primero)
  const dietasCliente = dietasMock
    .filter(d => d.clienteId === clienteId)
    .sort((a, b) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime());
  
  // Encontrar la dieta anterior a la fecha actual
  const fechaActualDate = new Date(fechaActual);
  const dietaAnterior = dietasCliente.find(d => {
    const fechaInicio = new Date(d.fechaInicio);
    return fechaInicio < fechaActualDate;
  });
  
  return dietaAnterior || null;
}

/**
 * Compara la dieta actual con la anterior y calcula desviaciones
 */
export async function compararConPlanAnterior(dietaActual: Dieta): Promise<ComparacionPlanAnterior> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const dietaAnterior = await getDietaAnterior(dietaActual.clienteId, dietaActual.fechaInicio);
  
  if (!dietaAnterior) {
    return {
      dietaAnterior: null,
      desviacion: {
        calorias: 0,
        proteinas: 0,
        carbohidratos: 0,
        grasas: 0,
      },
      tendencia: 'estable',
    };
  }
  
  // Calcular desviaciones porcentuales
  const calcularDesviacion = (actual: number, anterior: number): number => {
    if (anterior === 0) return 0;
    return ((actual - anterior) / anterior) * 100;
  };
  
  const desviacion = {
    calorias: calcularDesviacion(dietaActual.macros.calorias, dietaAnterior.macros.calorias),
    proteinas: calcularDesviacion(dietaActual.macros.proteinas, dietaAnterior.macros.proteinas),
    carbohidratos: calcularDesviacion(dietaActual.macros.carbohidratos, dietaAnterior.macros.carbohidratos),
    grasas: calcularDesviacion(dietaActual.macros.grasas, dietaAnterior.macros.grasas),
  };
  
  // Determinar tendencia basada en el objetivo
  let tendencia: 'mejora' | 'estable' | 'empeora' = 'estable';
  
  if (dietaActual.objetivo === 'perdida-peso' || dietaActual.objetivo === 'perdida-grasa') {
    // Para pérdida: menos calorías es mejor
    tendencia = desviacion.calorias < -2 ? 'mejora' : desviacion.calorias > 2 ? 'empeora' : 'estable';
  } else if (dietaActual.objetivo === 'ganancia-muscular' || dietaActual.objetivo === 'superavit-calorico') {
    // Para ganancia: más calorías y proteínas es mejor
    tendencia = desviacion.calorias > 2 && desviacion.proteinas > 2 ? 'mejora' : desviacion.calorias < -2 ? 'empeora' : 'estable';
  } else {
    // Para mantenimiento: cambios pequeños son estables
    const cambioPromedio = (Math.abs(desviacion.calorias) + Math.abs(desviacion.proteinas)) / 2;
    tendencia = cambioPromedio < 3 ? 'estable' : cambioPromedio > 10 ? 'empeora' : 'estable';
  }
  
  return {
    dietaAnterior,
    desviacion,
    tendencia,
  };
}

/**
 * Obtiene datos externos del cliente (actividad, sueño, estrés)
 */
export async function getDatosExternosCliente(clienteId: string, fecha?: string): Promise<DatosExternosCliente | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Datos mock - en producción vendría de integraciones de salud
  const fechaConsulta = fecha || new Date().toISOString();
  
  // Simular datos basados en el clienteId
  const seed = clienteId.charCodeAt(0) % 10;
  
  const datosExternos: DatosExternosCliente = {
    clienteId,
    fecha: fechaConsulta,
    actividad: {
      pasos: 8000 + (seed * 500),
      distancia: 6000 + (seed * 400), // metros
      caloriasQuemadas: 400 + (seed * 30),
      entrenamientos: seed % 3 + 1,
    },
    sueño: {
      duracion: 420 + (seed * 20), // minutos
      calidad: seed < 3 ? 'excellent' : seed < 6 ? 'good' : seed < 8 ? 'fair' : 'poor',
      horasSueño: 7 + (seed * 0.3),
    },
    estres: {
      nivel: 20 + (seed * 5), // 0-100
      fuente: seed < 3 ? 'Bajo' : seed < 6 ? 'Moderado' : 'Alto',
    },
  };
  
  return datosExternos;
}

// Notas de métricas - Mock storage
const notasMetricasMock: Record<string, NotasMetricas> = {};

/**
 * Obtiene las notas de métricas para una dieta
 */
export async function getNotasMetricas(dietaId: string): Promise<NotasMetricas | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (notasMetricasMock[dietaId]) {
    return { ...notasMetricasMock[dietaId] };
  }
  
  // Retornar estructura vacía si no existe
  return {
    dietaId,
    notas: {} as Record<TipoMetrica, string | undefined>,
    actualizadoEn: new Date().toISOString(),
  };
}

/**
 * Guarda las notas de métricas para una dieta
 */
export async function guardarNotasMetricas(dietaId: string, notas: Record<TipoMetrica, string | undefined>): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  notasMetricasMock[dietaId] = {
    dietaId,
    notas,
    actualizadoEn: new Date().toISOString(),
  };
  
  return true;
}

/**
 * Actualiza una nota específica de una métrica
 */
export async function actualizarNotaMetrica(dietaId: string, metricaId: TipoMetrica, nota: string | undefined): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const notasActuales = await getNotasMetricas(dietaId);
  if (!notasActuales) {
    return false;
  }
  
  notasActuales.notas[metricaId] = nota;
  return await guardarNotasMetricas(dietaId, notasActuales.notas);
}

/**
 * Obtiene la comida equivalente de una sesión anterior (día anterior o semana anterior)
 */
export async function getComidaSesionAnterior(
  clienteId: string,
  tipoComida: TipoComida,
  diaSemana?: string,
  fechaActual?: string
): Promise<Comida | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Obtener todas las dietas del cliente ordenadas por fecha
  const dietasCliente = dietasMock
    .filter(d => d.clienteId === clienteId)
    .sort((a, b) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime());
  
  if (dietasCliente.length === 0) return null;
  
  const fechaConsulta = fechaActual ? new Date(fechaActual) : new Date();
  
  // Buscar en la dieta anterior (día anterior)
  const dietaAnterior = dietasCliente.find(d => {
    const fechaInicio = new Date(d.fechaInicio);
    return fechaInicio < fechaConsulta;
  });
  
  if (dietaAnterior) {
    // Buscar comida del mismo tipo y día
    const comidaEncontrada = dietaAnterior.comidas.find(c => {
      if (c.tipo !== tipoComida) return false;
      if (diaSemana && c.dia !== diaSemana) return false;
      return true;
    });
    
    if (comidaEncontrada) {
      return comidaEncontrada;
    }
  }
  
  // Si no se encuentra en día anterior, buscar en semana anterior (mismo día de la semana)
  if (diaSemana) {
    const fechaSemanaAnterior = new Date(fechaConsulta);
    fechaSemanaAnterior.setDate(fechaSemanaAnterior.getDate() - 7);
    
    const dietaSemanaAnterior = dietasCliente.find(d => {
      const fechaInicio = new Date(d.fechaInicio);
      const diffDias = Math.abs((fechaInicio.getTime() - fechaSemanaAnterior.getTime()) / (1000 * 60 * 60 * 24));
      return diffDias <= 3; // Permitir 3 días de margen
    });
    
    if (dietaSemanaAnterior) {
      const comidaEncontrada = dietaSemanaAnterior.comidas.find(c => 
        c.tipo === tipoComida && c.dia === diaSemana
      );
      
      if (comidaEncontrada) {
        return comidaEncontrada;
      }
    }
  }
  
  return null;
}

/**
 * Compara una comida actual con su equivalente en sesión anterior
 */
export async function compararSesionAnterior(
  comidaActual: Comida,
  clienteId: string,
  diaSemana?: string,
  fechaActual?: string
): Promise<ComparacionSesionAnterior> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const comidaAnterior = await getComidaSesionAnterior(
    clienteId,
    comidaActual.tipo,
    diaSemana,
    fechaActual
  );
  
  if (!comidaAnterior) {
    return {
      comidaActual,
      comidaAnterior: null,
      tipoComparacion: 'dia-anterior',
      fechaAnterior: '',
      diferencias: {
        calorias: 0,
        proteinas: 0,
        carbohidratos: 0,
        grasas: 0,
      },
      porcentajesCambio: {
        calorias: 0,
        proteinas: 0,
        carbohidratos: 0,
        grasas: 0,
      },
      tendencia: 'estable',
      mensaje: 'No hay sesión anterior disponible para comparar',
    };
  }
  
  // Calcular diferencias
  const diferencias = {
    calorias: comidaActual.calorias - comidaAnterior.calorias,
    proteinas: comidaActual.proteinas - comidaAnterior.proteinas,
    carbohidratos: comidaActual.carbohidratos - comidaAnterior.carbohidratos,
    grasas: comidaActual.grasas - comidaAnterior.grasas,
  };
  
  // Calcular porcentajes de cambio
  const calcularPorcentaje = (actual: number, anterior: number): number => {
    if (anterior === 0) return actual > 0 ? 100 : 0;
    return ((actual - anterior) / anterior) * 100;
  };
  
  const porcentajesCambio = {
    calorias: calcularPorcentaje(comidaActual.calorias, comidaAnterior.calorias),
    proteinas: calcularPorcentaje(comidaActual.proteinas, comidaAnterior.proteinas),
    carbohidratos: calcularPorcentaje(comidaActual.carbohidratos, comidaAnterior.carbohidratos),
    grasas: calcularPorcentaje(comidaActual.grasas, comidaAnterior.grasas),
  };
  
  // Determinar tendencia
  // Para la mayoría de objetivos, mantener macros similares es estable
  // Mejora: cambios positivos en proteínas sin exceso de calorías
  // Desviación: cambios significativos no deseados
  const cambioCalorias = Math.abs(porcentajesCambio.calorias);
  const cambioProteinas = porcentajesCambio.proteinas;
  
  let tendencia: 'mejora' | 'estable' | 'desviacion' = 'estable';
  let mensaje = '';
  
  if (cambioCalorias < 5 && Math.abs(cambioProteinas) < 5) {
    tendencia = 'estable';
    mensaje = 'Mantiene valores similares a la sesión anterior';
  } else if (cambioProteinas > 5 && cambioCalorias < 10) {
    tendencia = 'mejora';
    mensaje = 'Aumento de proteínas sin exceso calórico';
  } else if (cambioCalorias > 15 || Math.abs(cambioProteinas) > 15) {
    tendencia = 'desviacion';
    mensaje = `Cambio significativo: ${cambioCalorias > 0 ? '+' : ''}${porcentajesCambio.calorias.toFixed(1)}% calorías`;
  } else {
    tendencia = 'estable';
    mensaje = 'Variación dentro del rango esperado';
  }
  
  // Determinar tipo de comparación
  const fechaConsulta = fechaActual ? new Date(fechaActual) : new Date();
  const fechaAnteriorDate = comidaAnterior.fechaComida ? new Date(comidaAnterior.fechaComida) : new Date();
  const diffDias = Math.floor((fechaConsulta.getTime() - fechaAnteriorDate.getTime()) / (1000 * 60 * 60 * 24));
  
  let tipoComparacion: 'dia-anterior' | 'semana-anterior' | 'mismo-dia-semana-anterior' = 'dia-anterior';
  if (diffDias === 7) {
    tipoComparacion = 'mismo-dia-semana-anterior';
  } else if (diffDias > 1 && diffDias < 7) {
    tipoComparacion = 'semana-anterior';
  }
  
  return {
    comidaActual,
    comidaAnterior,
    tipoComparacion,
    fechaAnterior: comidaAnterior.fechaComida || '',
    diferencias,
    porcentajesCambio,
    tendencia,
    mensaje,
  };
}

