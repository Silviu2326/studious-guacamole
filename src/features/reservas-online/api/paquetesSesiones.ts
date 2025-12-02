import { PaqueteSesiones } from '../types';

// ============================================================================
// CONEXIÓN CON EL FLUJO DE RESERVA Y MONETIZACIÓN
// ============================================================================
/**
 * CONEXIÓN CON EL FLUJO DE RESERVA Y MONETIZACIÓN:
 * 
 * Los paquetes de sesiones son productos que los clientes pueden comprar para
 * obtener múltiples sesiones a un precio con descuento. El flujo completo es:
 * 
 * 1. CREACIÓN DE PAQUETE: El entrenador crea paquetes de sesiones con:
 *    - numeroSesiones: Cuántas sesiones incluye
 *    - precio: Precio total (generalmente con descuento)
 *    - caducidadOpcional: Días de validez desde la compra
 * 
 * 2. COMPRA DEL PAQUETE: Cuando un cliente compra un paquete (en tienda online):
 *    - Se llama a crearBonoDesdePaquete(clienteId, paqueteId)
 *    - Esto crea un BonoActivo que el cliente puede usar
 *    - El bono tiene sesionesRestantes = numeroSesiones del paquete
 * 
 * 3. CREACIÓN DE RESERVA CON PAQUETE: Al crear una reserva:
 *    - El cliente puede elegir usar un bono disponible
 *    - Si usa un bono, se especifica bonoIdOpcional en la reserva
 *    - También se puede especificar paqueteIdOpcional para tracking
 *    - El precio de la reserva será 0 (ya pagado en el paquete)
 * 
 * 4. CONSUMO DE SESIÓN: Cuando la reserva se completa:
 *    - Se llama a consumirSesionDeBono(bonoId)
 *    - Esto reduce sesionesRestantes en 1
 *    - Si sesionesRestantes llega a 0, el bono se marca como agotado
 * 
 * 5. CANCELACIÓN: Si se cancela una reserva que usó un bono:
 *    - Se puede reembolsar la sesión con reembolsarSesionBono()
 *    - Esto incrementa sesionesRestantes en 1
 * 
 * EJEMPLO DE FLUJO COMPLETO:
 * ```typescript
 * // 1. Entrenador crea un paquete
 * const paquete = await createPaqueteSesiones({
 *   nombre: 'Paquete 10 Sesiones',
 *   numeroSesiones: 10,
 *   precio: 425,
 *   caducidadOpcional: 180, // 6 meses
 *   tiposSesionIncluidos: ['presencial', 'videollamada'],
 * });
 * 
 * // 2. Cliente compra el paquete (en tienda online)
 * const bono = await crearBonoDesdePaquete('cliente1', paquete.id);
 * // bono tiene: sesionesRestantes = 10, fechaCaducidadOpcional = hoy + 180 días
 * 
 * // 3. Cliente crea una reserva usando el bono
 * const reserva = await createReserva({
 *   clienteId: 'cliente1',
 *   entrenadorId: 'entrenador1',
 *   tipoSesionId: 'plantilla1',
 *   fechaInicio: new Date('2024-03-01T10:00'),
 *   fechaFin: new Date('2024-03-01T11:00'),
 *   bonoIdOpcional: bono.id, // Usar el bono
 *   paqueteIdOpcional: paquete.id, // Para tracking
 *   estado: 'confirmada',
 *   origen: 'appCliente',
 *   // precio: 0 (ya pagado en el paquete)
 * });
 * 
 * // 4. Cuando la sesión se completa
 * await consumirSesionDeBono(bono.id);
 * // bono.sesionesRestantes ahora es 9
 * ```
 * 
 * MONETIZACIÓN:
 * - Los paquetes permiten obtener ingresos anticipados
 * - El descuento incentiva compras de mayor volumen
 * - Los bonos agotados o vencidos pueden reactivarse mediante políticas de negocio
 */

// ============================================================================
// ALMACENAMIENTO MOCK
// ============================================================================
// Simulación de almacenamiento en memoria (en producción sería una base de datos)
// En producción, esto se almacenaría en una tabla de paquetes de sesiones
let paquetesStorage: PaqueteSesiones[] = [
  {
    id: 'p1',
    entrenadorId: '1',
    nombre: 'Paquete Básico 5 Sesiones',
    descripcion: 'Perfecto para comenzar tu entrenamiento personalizado',
    numeroSesiones: 5,
    precioPorSesion: 50,
    precioTotal: 225,
    descuento: 10,
    validezMeses: 3,
    tipoSesion: 'ambos',
    tipoEntrenamiento: 'sesion-1-1',
    activo: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'p2',
    entrenadorId: '1',
    nombre: 'Paquete Estándar 10 Sesiones',
    descripcion: 'La opción más popular para entrenamientos regulares',
    numeroSesiones: 10,
    precioPorSesion: 50,
    precioTotal: 425,
    descuento: 15,
    validezMeses: 6,
    tipoSesion: 'ambos',
    tipoEntrenamiento: 'sesion-1-1',
    activo: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'p3',
    entrenadorId: '1',
    nombre: 'Paquete Premium 20 Sesiones',
    descripcion: 'Máximo valor para entrenamientos intensivos',
    numeroSesiones: 20,
    precioPorSesion: 50,
    precioTotal: 800,
    descuento: 20,
    validezMeses: 12,
    tipoSesion: 'ambos',
    tipoEntrenamiento: 'sesion-1-1',
    activo: true,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
];

// ============================================================================
// FUNCIONES PRINCIPALES - API ESTÁNDAR
// ============================================================================

/**
 * Obtiene todos los paquetes de sesiones disponibles
 * 
 * @param entrenadorId - ID del entrenador (opcional, puede obtenerse del contexto)
 * @returns Lista de paquetes de sesiones
 * 
 * @remarks
 * CONEXIÓN CON RESERVAS:
 * - Se usa para mostrar paquetes disponibles en la tienda online
 * - Los clientes pueden comprar estos paquetes para obtener bonos
 * - Los paquetes activos aparecen en el catálogo de ventas
 * 
 * En producción: GET /api/paquetes-sesiones?entrenadorId=...
 */
export const getPaquetesSesiones = async (entrenadorId?: string): Promise<PaqueteSesiones[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Si no se proporciona entrenadorId, retornar todos (o obtener del contexto)
  if (!entrenadorId) {
    return paquetesStorage;
  }
  
  return paquetesStorage.filter(p => p.entrenadorId === entrenadorId);
};

/**
 * Obtener paquetes activos de un entrenador
 */
export const getPaquetesSesionesActivos = async (entrenadorId: string): Promise<PaqueteSesiones[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return paquetesStorage.filter(p => p.entrenadorId === entrenadorId && p.activo);
};

/**
 * Obtener un paquete por ID
 */
export const getPaqueteSesionesPorId = async (
  entrenadorId: string,
  paqueteId: string
): Promise<PaqueteSesiones | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const paquete = paquetesStorage.find(
    p => p.id === paqueteId && p.entrenadorId === entrenadorId
  );
  return paquete || null;
};

/**
 * Crea un nuevo paquete de sesiones
 * 
 * @param data - Datos del paquete a crear (sin id, entrenadorId, createdAt, updatedAt)
 * @param entrenadorId - ID del entrenador (opcional, puede obtenerse del contexto)
 * @returns El paquete creado
 * 
 * @remarks
 * CONEXIÓN CON RESERVAS:
 * - Los paquetes nuevos estarán disponibles inmediatamente para la venta
 * - Cuando un cliente compra el paquete, se crea un bono mediante crearBonoDesdePaquete()
 * - Los bonos creados a partir de este paquete tendrán numeroSesiones = data.numeroSesiones
 * 
 * VALIDACIONES RECOMENDADAS:
 * - numeroSesiones > 0
 * - precio > 0 y preferiblemente menor que precioIndividual * numeroSesiones (descuento)
 * - caducidadOpcional debe ser positiva si se especifica
 * 
 * En producción: POST /api/paquetes-sesiones
 */
export const createPaqueteSesiones = async (
  data: Omit<PaqueteSesiones, 'id' | 'entrenadorId' | 'createdAt' | 'updatedAt'> & { entrenadorId?: string }
): Promise<PaqueteSesiones> => {
  const entrenadorId = data.entrenadorId || '1'; // En producción, obtener del contexto
  const { entrenadorId: _, ...paqueteData } = data;
  
  return crearPaqueteSesiones(entrenadorId, paqueteData);
};

/**
 * Alias para mantener compatibilidad con código existente
 */
export const crearPaqueteSesiones = async (
  entrenadorId: string,
  paquete: Omit<PaqueteSesiones, 'id' | 'entrenadorId' | 'createdAt' | 'updatedAt'>
): Promise<PaqueteSesiones> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const nuevoPaquete: PaqueteSesiones = {
    ...paquete,
    id: `p${Date.now()}`,
    entrenadorId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  paquetesStorage.push(nuevoPaquete);
  return nuevoPaquete;
};

/**
 * Actualiza un paquete de sesiones existente
 * 
 * @param id - ID del paquete a actualizar
 * @param changes - Cambios parciales a aplicar
 * @param entrenadorId - ID del entrenador (opcional)
 * @returns El paquete actualizado
 * 
 * @remarks
 * CONEXIÓN CON RESERVAS:
 * - Los cambios NO afectan bonos ya creados a partir de este paquete
 * - Los cambios en precio/númeroSesiones solo afectan compras futuras
 * - Se puede desactivar (activo: false) para ocultarlo del catálogo sin eliminar
 * 
 * IMPORTANTE:
 * - No cambiar numeroSesiones si hay bonos activos usando este paquete
 * - Considerar el impacto en bonos vencidos/agotados
 * 
 * En producción: PATCH /api/paquetes-sesiones/:id
 */
export const updatePaqueteSesiones = async (
  id: string,
  changes: Partial<Omit<PaqueteSesiones, 'id' | 'entrenadorId' | 'createdAt' | 'updatedAt'>>,
  entrenadorId?: string
): Promise<PaqueteSesiones> => {
  const entrenadorIdFinal = entrenadorId || '1'; // En producción, obtener del contexto
  return actualizarPaqueteSesiones(entrenadorIdFinal, id, changes);
};

/**
 * Alias para mantener compatibilidad con código existente
 */
export const actualizarPaqueteSesiones = async (
  entrenadorId: string,
  paqueteId: string,
  datos: Partial<Omit<PaqueteSesiones, 'id' | 'entrenadorId' | 'createdAt' | 'updatedAt'>>
): Promise<PaqueteSesiones> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const indice = paquetesStorage.findIndex(
    p => p.id === paqueteId && p.entrenadorId === entrenadorId
  );
  
  if (indice === -1) {
    throw new Error('Paquete no encontrado');
  }
  
  paquetesStorage[indice] = {
    ...paquetesStorage[indice],
    ...datos,
    updatedAt: new Date(),
  };
  
  return paquetesStorage[indice];
};

/**
 * Elimina un paquete de sesiones (soft delete - desactivar)
 * 
 * @param id - ID del paquete a eliminar
 * @param entrenadorId - ID del entrenador (opcional)
 * @returns void
 * 
 * @remarks
 * CONEXIÓN CON RESERVAS:
 * - Se hace soft delete (desactivar) para mantener integridad de datos históricos
 * - Los bonos creados a partir de este paquete NO se ven afectados
 * - El paquete desaparece del catálogo pero sigue existiendo en la base de datos
 * - Las reservas que usaron bonos de este paquete mantienen su referencia
 * 
 * IMPORTANTE:
 * - Verificar si hay bonos activos usando este paquete antes de eliminar
 * - Considerar si se deben crear más bonos a partir de este paquete
 * 
 * En producción: DELETE /api/paquetes-sesiones/:id
 */
export const deletePaqueteSesiones = async (
  id: string,
  entrenadorId?: string
): Promise<void> => {
  const entrenadorIdFinal = entrenadorId || '1'; // En producción, obtener del contexto
  return eliminarPaqueteSesiones(entrenadorIdFinal, id);
};

/**
 * Alias para mantener compatibilidad con código existente
 */
export const eliminarPaqueteSesiones = async (
  entrenadorId: string,
  paqueteId: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const indice = paquetesStorage.findIndex(
    p => p.id === paqueteId && p.entrenadorId === entrenadorId
  );
  
  if (indice === -1) {
    throw new Error('Paquete no encontrado');
  }
  
  // Soft delete - desactivar en lugar de eliminar
  paquetesStorage[indice] = {
    ...paquetesStorage[indice],
    activo: false,
    updatedAt: new Date(),
  };
};


