import { RecursoBiblioteca, AdherenciaHistoricaRecurso, DatosBloquePersonalizado, Alergeno, MacrosNutricionales } from '../types';

// Mock de recursos - en producción vendría de la API
const recursosMock: RecursoBiblioteca[] = [
  {
    id: 'receta-1',
    tipo: 'receta',
    nombre: 'Bowl de avena con frutos rojos',
    descripcion: 'Desayuno nutritivo con avena, frutos rojos y proteína',
    macros: { calorias: 420, proteinas: 22, carbohidratos: 52, grasas: 12 },
    fibra: 8,
    sodio: 120,
    tiempoPreparacion: 10,
    estiloCulinario: ['vegetariano', 'alto-proteina'],
    alergenos: ['gluten'],
    costeEstimado: 2.5,
    huellaCarbono: 0.5,
    tags: ['Alto en proteína', 'Vegetariano', 'Desayuno'],
    alimentos: [
      { id: '1', nombre: 'Avena', cantidad: 50, unidad: 'g', calorias: 200, proteinas: 7, carbohidratos: 40, grasas: 4 },
      { id: '2', nombre: 'Frutos rojos', cantidad: 100, unidad: 'g', calorias: 50, proteinas: 1, carbohidratos: 12, grasas: 0 },
      { id: '3', nombre: 'Proteína en polvo', cantidad: 30, unidad: 'g', calorias: 120, proteinas: 20, carbohidratos: 3, grasas: 2 },
      { id: '4', nombre: 'Almendras', cantidad: 15, unidad: 'g', calorias: 90, proteinas: 3, carbohidratos: 3, grasas: 8 },
    ],
    creadoEn: '2024-12-20T10:00:00Z',
    actualizadoEn: '2024-12-20T10:00:00Z',
  },
  {
    id: 'receta-2',
    tipo: 'receta',
    nombre: 'Pollo al horno con brócoli',
    descripcion: 'Plato principal rico en proteína',
    macros: { calorias: 350, proteinas: 35, carbohidratos: 20, grasas: 12 },
    fibra: 5,
    sodio: 400,
    tiempoPreparacion: 45,
    estiloCulinario: ['alto-proteina'],
    costeEstimado: 4.5,
    huellaCarbono: 1.2,
    tags: ['Alto en proteína', 'Principal'],
    alimentos: [
      { id: '5', nombre: 'Pechuga de pollo', cantidad: 150, unidad: 'g', calorias: 250, proteinas: 30, carbohidratos: 0, grasas: 5 },
      { id: '6', nombre: 'Brócoli', cantidad: 200, unidad: 'g', calorias: 60, proteinas: 5, carbohidratos: 12, grasas: 1 },
      { id: '7', nombre: 'Aceite de oliva', cantidad: 10, unidad: 'ml', calorias: 90, proteinas: 0, carbohidratos: 0, grasas: 10 },
    ],
    creadoEn: '2024-12-20T10:00:00Z',
    actualizadoEn: '2024-12-20T10:00:00Z',
  },
  {
    id: 'receta-3',
    tipo: 'receta',
    nombre: 'Ensalada de quinoa y aguacate',
    descripcion: 'Ensalada completa y nutritiva',
    macros: { calorias: 380, proteinas: 15, carbohidratos: 45, grasas: 18 },
    fibra: 10,
    sodio: 200,
    tiempoPreparacion: 20,
    estiloCulinario: ['vegetariano', 'vegano'],
    costeEstimado: 3.8,
    huellaCarbono: 0.4,
    ingredientesTemporada: true,
    tags: ['Vegetariano', 'Vegano', 'Ensalada'],
    alimentos: [
      { id: '8', nombre: 'Quinoa', cantidad: 100, unidad: 'g', calorias: 220, proteinas: 8, carbohidratos: 40, grasas: 4 },
      { id: '9', nombre: 'Aguacate', cantidad: 100, unidad: 'g', calorias: 160, proteinas: 2, carbohidratos: 9, grasas: 15 },
      { id: '10', nombre: 'Espinacas', cantidad: 50, unidad: 'g', calorias: 12, proteinas: 1, carbohidratos: 2, grasas: 0 },
    ],
    creadoEn: '2024-12-20T10:00:00Z',
    actualizadoEn: '2024-12-20T10:00:00Z',
  },
];

/**
 * Obtiene todos los recursos disponibles
 */
export async function getRecursos(): Promise<RecursoBiblioteca[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return [...recursosMock];
}

/**
 * Agrega un nuevo recurso a la biblioteca
 */
export async function agregarRecurso(recurso: RecursoBiblioteca): Promise<RecursoBiblioteca> {
  await new Promise(resolve => setTimeout(resolve, 200));
  recursosMock.push(recurso);
  return recurso;
}

// Mock de adherencia histórica - en producción vendría de la API
const adherenciaHistoricaMock: AdherenciaHistoricaRecurso[] = [
  {
    clienteId: 'cliente-1',
    recursoId: 'receta-1',
    vecesUsado: 15,
    adherenciaPromedio: 85,
    ultimoUso: '2024-12-19T10:00:00Z',
    tendencia: 'mejora',
    observaciones: 'El cliente muestra buena adherencia con esta receta',
  },
];

/**
 * Obtiene la adherencia histórica de un cliente para un recurso específico
 */
export async function getAdherenciaHistoricaRecurso(
  clienteId: string,
  recursoId: string
): Promise<AdherenciaHistoricaRecurso | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const adherencia = adherenciaHistoricaMock.find(
    a => a.clienteId === clienteId && a.recursoId === recursoId
  );

  if (adherencia) {
    return adherencia;
  }

  // Si no hay datos históricos, devolver valores por defecto
  return {
    clienteId,
    recursoId,
    vecesUsado: 0,
    adherenciaPromedio: 0,
    tendencia: 'estable',
  };
}

/**
 * Obtiene un recurso por ID
 */
export async function getRecursoPorId(id: string): Promise<RecursoBiblioteca | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // En producción, esto buscaría en la base de datos
  // Por ahora, buscar en el mock o en otras APIs
  const recurso = recursosMock.find(r => r.id === id);
  if (recurso) return recurso;

  // Si no se encuentra en el mock, intentar buscar en otras APIs
  // (esto sería una llamada real a la API en producción)
  return null;
}

/**
 * Crea un bloque personalizado con múltiples recetas
 */
export async function crearBloquePersonalizado(
  datos: DatosBloquePersonalizado
): Promise<RecursoBiblioteca> {
  await new Promise(resolve => setTimeout(resolve, 400));

  // Calcular macros si no se proporcionaron
  let macros: MacrosNutricionales = datos.macros || {
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0,
  };

  // Si no se proporcionaron macros, se deberían calcular sumando las recetas
  // Por ahora, usamos los valores proporcionados o valores por defecto
  if (!datos.macros) {
    // En producción, aquí se sumarían los macros de las recetas seleccionadas
    macros = {
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0,
    };
  }

  // Calcular alérgenos únicos de todas las recetas
  const alergenos: Alergeno[] = datos.alergenos || [];

  // Calcular coste estimado si no se proporcionó
  const costeEstimado = datos.costeEstimado || 0;

  const nuevoBloque: RecursoBiblioteca = {
    id: `bloque-${Date.now()}`,
    tipo: 'bloque',
    nombre: datos.nombre,
    descripcion: datos.descripcion,
    macros,
    alergenos,
    costeEstimado,
    tags: datos.tags || [],
    estiloCulinario: datos.estiloCulinario || [],
    recetas: datos.recetas,
    favorito: false,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
    creadoPor: 'user-1', // En producción vendría del contexto de autenticación
  };

  // En producción, esto guardaría el bloque en la base de datos
  recursosMock.push(nuevoBloque);

  return nuevoBloque;
}

/**
 * Actualiza un bloque personalizado
 */
export async function actualizarBloquePersonalizado(
  id: string,
  datos: Partial<DatosBloquePersonalizado>
): Promise<RecursoBiblioteca | null> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const bloque = recursosMock.find(r => r.id === id && r.tipo === 'bloque');
  if (!bloque) return null;

  // Actualizar campos
  if (datos.nombre) bloque.nombre = datos.nombre;
  if (datos.descripcion !== undefined) bloque.descripcion = datos.descripcion;
  if (datos.macros) bloque.macros = datos.macros;
  if (datos.alergenos) bloque.alergenos = datos.alergenos;
  if (datos.costeEstimado !== undefined) bloque.costeEstimado = datos.costeEstimado;
  if (datos.tags) bloque.tags = datos.tags;
  if (datos.estiloCulinario) bloque.estiloCulinario = datos.estiloCulinario;
  if (datos.recetas) bloque.recetas = datos.recetas;

  bloque.actualizadoEn = new Date().toISOString();

  return bloque;
}

/**
 * Elimina un bloque personalizado
 */
export async function eliminarBloquePersonalizado(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const index = recursosMock.findIndex(r => r.id === id && r.tipo === 'bloque');
  if (index === -1) return false;

  recursosMock.splice(index, 1);
  return true;
}

/**
 * Obtiene todos los bloques personalizados del usuario
 */
export async function getBloquesPersonalizados(): Promise<RecursoBiblioteca[]> {
  await new Promise(resolve => setTimeout(resolve, 300));

  // En producción, esto filtraría por usuario creador
  return recursosMock.filter(r => r.tipo === 'bloque');
}

