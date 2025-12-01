// API para gestionar plantillas de sesión

import { PlantillaSesion } from '../types';

// Plantillas predefinidas comunes
export const PLANTILLAS_PREDEFINIDAS: Omit<PlantillaSesion, 'id' | 'entrenadorId' | 'createdAt' | 'updatedAt'>[] = [
  {
    nombre: 'Sesión 1 a 1 - Presencial',
    descripcion: 'Sesión personal presencial de 1 hora',
    duracionMinutos: 60,
    precio: 50,
    tipoSesion: 'presencial',
    tipoEntrenamiento: 'sesion-1-1',
    activo: true,
    orden: 1,
  },
  {
    nombre: 'Sesión 1 a 1 - Videollamada',
    descripcion: 'Sesión personal online de 1 hora',
    duracionMinutos: 60,
    precio: 45,
    tipoSesion: 'videollamada',
    tipoEntrenamiento: 'sesion-1-1',
    activo: true,
    orden: 2,
  },
  {
    nombre: 'Sesión Rápida - Presencial',
    descripcion: 'Sesión rápida de 30 minutos',
    duracionMinutos: 30,
    precio: 35,
    tipoSesion: 'presencial',
    tipoEntrenamiento: 'sesion-1-1',
    activo: true,
    orden: 3,
  },
  {
    nombre: 'Fisioterapia - Presencial',
    descripcion: 'Sesión de fisioterapia de 1 hora',
    duracionMinutos: 60,
    precio: 60,
    tipoSesion: 'presencial',
    tipoEntrenamiento: 'fisio',
    activo: true,
    orden: 4,
  },
  {
    nombre: 'Nutrición - Videollamada',
    descripcion: 'Consulta nutricional online de 45 minutos',
    duracionMinutos: 45,
    precio: 40,
    tipoSesion: 'videollamada',
    tipoEntrenamiento: 'nutricion',
    activo: true,
    orden: 5,
  },
];

// ============================================================================
// CONEXIÓN CON EL FLUJO DE RESERVA
// ============================================================================
/**
 * CONEXIÓN CON EL FLUJO DE RESERVA:
 * 
 * Las plantillas de sesión son la base para crear reservas. Cuando un cliente
 * o entrenador crea una reserva:
 * 
 * 1. SELECCIÓN DE PLANTILLA: Se usa getPlantillasSesion() para mostrar las
 *    plantillas disponibles al cliente/entrenador en el formulario de reserva.
 * 
 * 2. CREACIÓN DE RESERVA: Al crear una reserva (createReserva en reservas.ts),
 *    se puede especificar tipoSesionId que hace referencia a una PlantillaSesion.
 *    La plantilla proporciona:
 *    - duracionMinutos: Para calcular fechaFin desde fechaInicio
 *    - precio: Precio base de la sesión
 *    - tipoSesion: Si es presencial o videollamada
 *    - tipoEntrenamiento: Tipo de servicio
 * 
 * 3. CÁLCULO DE PRECIO: Si se usa un bono o paquete, el precio puede ser 0.
 *    Si no, se usa el precio de la plantilla (ajustado según modalidad).
 * 
 * 4. VALIDACIÓN: La plantilla también puede tener límites de plazas (clases grupales)
 *    y configuraciones de buffer time que afectan la disponibilidad.
 * 
 * EJEMPLO DE FLUJO:
 * ```typescript
 * // 1. Obtener plantillas disponibles
 * const plantillas = await getPlantillasSesion(entrenadorId);
 * 
 * // 2. Cliente selecciona una plantilla
 * const plantillaSeleccionada = plantillas[0];
 * 
 * // 3. Crear reserva usando la plantilla
 * const reserva = await createReserva({
 *   clienteId: 'cliente1',
 *   entrenadorId: 'entrenador1',
 *   tipoSesionId: plantillaSeleccionada.id, // Referencia a la plantilla
 *   fechaInicio: new Date('2024-03-01T10:00'),
 *   fechaFin: new Date('2024-03-01T11:00'), // Calculado desde duracionMinutos
 *   estado: 'pendiente',
 *   origen: 'appCliente',
 *   esOnline: plantillaSeleccionada.esOnline,
 *   // Si usa bono: bonoIdOpcional = 'bono1'
 *   // Si usa paquete: paqueteIdOpcional = 'paquete1'
 * });
 * ```
 * 
 * Cuando una reserva se completa, el sistema puede:
 * - Consumir una sesión del bono si bonoIdOpcional está presente
 * - Actualizar estadísticas de uso de plantillas
 * - Generar facturas si no se usó bono/paquete
 */

// ============================================================================
// FUNCIONES PRINCIPALES - API ESTÁNDAR
// ============================================================================

/**
 * Obtiene todas las plantillas de sesión configuradas para un entrenador
 * 
 * @param entrenadorId - ID del entrenador (opcional, puede ser obtenido del contexto)
 * @returns Lista de plantillas de sesión del entrenador
 * 
 * @remarks
 * CONEXIÓN CON RESERVAS:
 * - Se usa al mostrar el selector de tipo de sesión en el formulario de reserva
 * - Permite al cliente/entrenador elegir qué tipo de sesión quiere reservar
 * - Las plantillas definen duración, precio y características de las sesiones
 * 
 * En producción, esta función se conectaría con un backend REST/GraphQL:
 * - REST: GET /api/entrenadores/:entrenadorId/plantillas-sesion
 * - GraphQL: query { entrenador(id: "...") { plantillasSesion { id, nombre, precio, ... } } }
 */
export const getPlantillasSesion = async (entrenadorId?: string): Promise<PlantillaSesion[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  // Si no se proporciona entrenadorId, obtener del contexto o usar un ID por defecto
  const entrenadorIdFinal = entrenadorId || '1'; // En producción, obtener del contexto de autenticación

  const storageKey = `plantillas-sesion-${entrenadorIdFinal}`;
  const plantillasStorage = localStorage.getItem(storageKey);

  if (!plantillasStorage) {
    // Crear plantillas por defecto
    const plantillasPorDefecto: PlantillaSesion[] = PLANTILLAS_PREDEFINIDAS.map((p, index) => ({
      ...p,
      id: `plantilla-${entrenadorIdFinal}-${index}`,
      entrenadorId: entrenadorIdFinal,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await guardarPlantillasSesion(entrenadorIdFinal, plantillasPorDefecto);
    return plantillasPorDefecto;
  }

  try {
    const plantillasData = JSON.parse(plantillasStorage);
    return plantillasData.map((p: any) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    }));
  } catch (error) {
    console.error('Error cargando plantillas de sesión:', error);
    return [];
  }
};

/**
 * Guarda las plantillas de sesión configuradas
 */
export const guardarPlantillasSesion = async (
  entrenadorId: string,
  plantillas: PlantillaSesion[]
): Promise<PlantillaSesion[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const storageKey = `plantillas-sesion-${entrenadorId}`;
  const plantillasActualizadas = plantillas.map(p => ({
    ...p,
    updatedAt: new Date(),
  }));

  localStorage.setItem(storageKey, JSON.stringify(plantillasActualizadas));
  return plantillasActualizadas;
};

/**
 * Obtiene una plantilla de sesión por ID
 */
export const getPlantillaSesionPorId = async (
  entrenadorId: string,
  plantillaId: string
): Promise<PlantillaSesion | null> => {
  const plantillas = await getPlantillasSesion(entrenadorId);
  return plantillas.find(p => p.id === plantillaId) || null;
};

/**
 * Crea una nueva plantilla de sesión
 * 
 * @param data - Datos de la plantilla a crear (sin id, entrenadorId, createdAt, updatedAt)
 * @param entrenadorId - ID del entrenador (opcional, puede obtenerse del contexto)
 * @returns La plantilla creada
 * 
 * @remarks
 * CONEXIÓN CON RESERVAS:
 * - Las nuevas plantillas estarán disponibles inmediatamente para crear reservas
 * - Los cambios afectan todas las reservas futuras que usen esta plantilla
 * - El precio configurado se usará como precio base para las reservas
 * 
 * En producción: POST /api/entrenadores/:entrenadorId/plantillas-sesion
 */
export const createPlantillaSesion = async (
  data: Omit<PlantillaSesion, 'id' | 'entrenadorId' | 'createdAt' | 'updatedAt'> & { entrenadorId?: string }
): Promise<PlantillaSesion> => {
  const entrenadorId = data.entrenadorId || '1'; // En producción, obtener del contexto
  const { entrenadorId: _, ...plantillaData } = data;
  
  return crearPlantillaSesion(entrenadorId, plantillaData);
};

/**
 * Alias para mantener compatibilidad con código existente
 */
export const crearPlantillaSesion = async (
  entrenadorId: string,
  plantilla: Omit<PlantillaSesion, 'id' | 'entrenadorId' | 'createdAt' | 'updatedAt'>
): Promise<PlantillaSesion> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const plantillas = await getPlantillasSesion(entrenadorId);
  const maxOrden = plantillas.length > 0 ? Math.max(...plantillas.map(p => p.orden)) : 0;

  const nuevaPlantilla: PlantillaSesion = {
    ...plantilla,
    id: `plantilla-${Date.now()}`,
    entrenadorId,
    orden: maxOrden + 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const plantillasActualizadas = [...plantillas, nuevaPlantilla];
  await guardarPlantillasSesion(entrenadorId, plantillasActualizadas);
  return nuevaPlantilla;
};

/**
 * Actualiza una plantilla de sesión existente
 * 
 * @param id - ID de la plantilla a actualizar
 * @param changes - Cambios parciales a aplicar
 * @param entrenadorId - ID del entrenador (opcional)
 * @returns La plantilla actualizada
 * 
 * @remarks
 * CONEXIÓN CON RESERVAS:
 * - Los cambios en precio NO afectan reservas ya creadas
 * - Los cambios en duración/descripción pueden afectar reservas futuras
 * - Se debe validar que no haya reservas pendientes que dependan de esta plantilla
 * 
 * En producción: PATCH /api/plantillas-sesion/:id
 */
export const updatePlantillaSesion = async (
  id: string,
  changes: Partial<Omit<PlantillaSesion, 'id' | 'entrenadorId' | 'createdAt' | 'updatedAt'>>,
  entrenadorId?: string
): Promise<PlantillaSesion> => {
  const entrenadorIdFinal = entrenadorId || '1'; // En producción, obtener del contexto
  return actualizarPlantillaSesion(entrenadorIdFinal, id, changes);
};

/**
 * Alias para mantener compatibilidad con código existente
 */
export const actualizarPlantillaSesion = async (
  entrenadorId: string,
  plantillaId: string,
  cambios: Partial<Omit<PlantillaSesion, 'id' | 'entrenadorId' | 'createdAt' | 'updatedAt'>>
): Promise<PlantillaSesion> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const plantillas = await getPlantillasSesion(entrenadorId);
  const plantillaIndex = plantillas.findIndex(p => p.id === plantillaId);

  if (plantillaIndex === -1) {
    throw new Error('Plantilla no encontrada');
  }

  const plantillaActualizada: PlantillaSesion = {
    ...plantillas[plantillaIndex],
    ...cambios,
    updatedAt: new Date(),
  };

  const plantillasActualizadas = [...plantillas];
  plantillasActualizadas[plantillaIndex] = plantillaActualizada;
  await guardarPlantillasSesion(entrenadorId, plantillasActualizadas);
  return plantillaActualizada;
};

/**
 * Elimina una plantilla de sesión
 * 
 * @param id - ID de la plantilla a eliminar
 * @param entrenadorId - ID del entrenador (opcional)
 * @returns void
 * 
 * @remarks
 * CONEXIÓN CON RESERVAS:
 * - Se recomienda hacer soft delete (desactivar) en lugar de eliminar físicamente
 * - Verificar que no haya reservas pendientes usando esta plantilla
 * - Las reservas pasadas que usaron esta plantilla NO se ven afectadas
 * - Las reservas futuras no podrán usar esta plantilla
 * 
 * FLUJO RECOMENDADO:
 * 1. Verificar reservas pendientes con esta plantilla
 * 2. Si hay reservas pendientes, desactivar en lugar de eliminar
 * 3. Si no hay reservas, proceder con eliminación
 * 
 * En producción: DELETE /api/plantillas-sesion/:id
 */
export const deletePlantillaSesion = async (
  id: string,
  entrenadorId?: string
): Promise<void> => {
  const entrenadorIdFinal = entrenadorId || '1'; // En producción, obtener del contexto
  return eliminarPlantillaSesion(entrenadorIdFinal, id);
};

/**
 * Alias para mantener compatibilidad con código existente
 */
export const eliminarPlantillaSesion = async (
  entrenadorId: string,
  plantillaId: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const plantillas = await getPlantillasSesion(entrenadorId);
  const plantillasActualizadas = plantillas.filter(p => p.id !== plantillaId);
  await guardarPlantillasSesion(entrenadorId, plantillasActualizadas);
};

/**
 * Obtiene las plantillas activas de un entrenador
 */
export const getPlantillasSesionActivas = async (entrenadorId: string): Promise<PlantillaSesion[]> => {
  const plantillas = await getPlantillasSesion(entrenadorId);
  return plantillas
    .filter(p => p.activo)
    .sort((a, b) => a.orden - b.orden);
};

/**
 * Calcula el precio de una sesión basado en la plantilla, tipo de sesión y modalidad
 * Esta función implementa la lógica de precios diferenciados según tipo de sesión y modalidad
 * El precio base de la plantilla ya está configurado para su duración específica
 */
export const calcularPrecioSesion = (
  precioBase: number,
  tipoSesion: 'presencial' | 'videollamada',
  duracionMinutos: number,
  multiplicadorModalidad?: number
): number => {
  let precio = precioBase;

  // Aplicar multiplicador de modalidad si existe (para videollamada generalmente es menor)
  // Esto permite tener precios diferenciados según la modalidad (presencial vs videollamada)
  if (multiplicadorModalidad !== undefined) {
    precio = precio * multiplicadorModalidad;
  } else if (tipoSesion === 'videollamada') {
    // Por defecto, videollamada tiene un 10% de descuento
    precio = precio * 0.9;
  }

  // Nota: No ajustamos el precio por duración aquí porque el precioBase de la plantilla
  // ya está configurado para su duración específica. Si se necesita ajustar por duración,
  // se debe crear una plantilla diferente con ese precio específico.

  return Math.round(precio * 100) / 100; // Redondear a 2 decimales
};

/**
 * Obtiene el precio de una sesión basado en la plantilla seleccionada
 */
export const getPrecioPorPlantilla = async (
  entrenadorId: string,
  plantillaId: string,
  tipoSesionOverride?: 'presencial' | 'videollamada',
  duracionOverride?: number
): Promise<number> => {
  const plantilla = await getPlantillaSesionPorId(entrenadorId, plantillaId);
  if (!plantilla) {
    throw new Error('Plantilla no encontrada');
  }

  const tipoSesion = tipoSesionOverride || plantilla.tipoSesion;
  const duracion = duracionOverride || plantilla.duracionMinutos;

  // Calcular precio basado en la plantilla
  // Para videollamada, aplicar un descuento del 10% por defecto si no hay multiplicador específico
  const multiplicadorModalidad = tipoSesion === 'videollamada' ? 0.9 : 1.0;
  
  return calcularPrecioSesion(plantilla.precio, tipoSesion, duracion, multiplicadorModalidad);
};

