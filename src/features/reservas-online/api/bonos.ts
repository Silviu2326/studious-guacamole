import { BonoActivo } from '../types';
import { getPaquetesSesiones } from './paquetesSesiones';

// ============================================================================
// CONEXIÓN CON EL FLUJO DE RESERVA Y MONETIZACIÓN
// ============================================================================
/**
 * CONEXIÓN CON EL FLUJO DE RESERVA Y MONETIZACIÓN:
 * 
 * Los bonos activos representan la relación entre un cliente y un paquete comprado.
 * Son el mecanismo mediante el cual los clientes usan las sesiones de los paquetes
 * que compraron. El flujo completo es:
 * 
 * 1. CREACIÓN DEL BONO: Cuando un cliente compra un paquete (en tienda online):
 *    - Se llama a crearBonoDesdePaquete(clienteId, paqueteId)
 *    - Esto crea un BonoActivo vinculado al cliente y al paquete
 *    - El bono tiene sesionesRestantes = numeroSesiones del paquete
 *    - Se establece fechaCaducidadOpcional según caducidadOpcional del paquete
 * 
 * 2. CREACIÓN DE RESERVA CON BONO: Al crear una reserva:
 *    - El cliente puede elegir usar un bono de getBonosActivosPorCliente()
 *    - Se especifica bonoIdOpcional en la reserva
 *    - El precio de la reserva será 0 (ya pagado en el paquete)
 *    - El sistema valida que el bono tenga sesionesRestantes > 0
 *    - El sistema valida que el bono no esté vencido
 * 
 * 3. CONSUMO DE SESIÓN: Cuando la reserva se completa (marcada como 'completada'):
 *    - Se llama a consumirSesionDeBono(bonoId)
 *    - Esto reduce sesionesRestantes en 1
 *    - Esto incrementa sesionesUsadas en 1
 *    - Si sesionesRestantes llega a 0, el bono se marca como 'agotado'
 * 
 * 4. CANCELACIÓN CON BONO: Si se cancela una reserva que usó un bono:
 *    - Se puede reembolsar la sesión con reembolsarSesionBono() (opcional)
 *    - Esto incrementa sesionesRestantes en 1
 *    - Esto reduce sesionesUsadas en 1
 *    - El estado del bono vuelve a 'activo' si estaba agotado
 * 
 * VALIDACIONES IMPORTANTES:
 * - Antes de crear una reserva con bono, validar que el bono esté activo
 * - Verificar que sesionesRestantes > 0
 * - Verificar que fechaCaducidadOpcional no haya pasado (si existe)
 * - Solo consumir sesiones cuando la reserva se marca como completada
 * 
 * EJEMPLO DE FLUJO COMPLETO:
 * ```typescript
 * // 1. Cliente compra un paquete y se crea el bono
 * const bono = await crearBonoDesdePaquete('cliente1', 'paquete1');
 * // bono tiene: sesionesRestantes = 10, estado = 'activo'
 * 
 * // 2. Cliente quiere crear una reserva
 * const bonosDisponibles = await getBonosActivosPorCliente('cliente1');
 * // Retorna solo bonos con sesionesRestantes > 0 y no vencidos
 * 
 * // 3. Cliente crea reserva usando el bono
 * const reserva = await createReserva({
 *   clienteId: 'cliente1',
 *   entrenadorId: 'entrenador1',
 *   tipoSesionId: 'plantilla1',
 *   fechaInicio: new Date('2024-03-01T10:00'),
 *   fechaFin: new Date('2024-03-01T11:00'),
 *   bonoIdOpcional: bono.id, // Usar el bono
 *   estado: 'confirmada',
 *   origen: 'appCliente',
 *   // precio: 0 (ya pagado en el paquete)
 * });
 * 
 * // 4. Cuando la sesión se completa
 * await consumirSesionDeBono(bono.id);
 * // bono.sesionesRestantes ahora es 9, sesionesUsadas es 1
 * 
 * // 5. Si se cancela la reserva (antes de completarse)
 * await reembolsarSesionBono(bono.id);
 * // bono.sesionesRestantes vuelve a 10
 * ```
 * 
 * MONETIZACIÓN:
 * - Los bonos permiten ingresos anticipados (el cliente paga el paquete antes de usar las sesiones)
 * - El sistema rastrea cuántas sesiones quedan para incentivar compras futuras
 * - Los bonos agotados pueden incentivar nuevas compras de paquetes
 */

// ============================================================================
// ALMACENAMIENTO MOCK
// ============================================================================
// Simulación de almacenamiento en memoria (en producción sería una base de datos)
// En producción, esto se almacenaría en una tabla de bonos activos
// Los bonos se crean cuando un cliente compra un paquete
let bonosStorage: BonoActivo[] = [
  {
    id: 'b1',
    paqueteId: 'p1',
    paqueteNombre: 'Paquete Básico 5 Sesiones',
    clienteId: 'client_1',
    clienteNombre: 'Juan Pérez',
    sesionesTotal: 5,
    sesionesUsadas: 2,
    sesionesRestantes: 3,
    fechaCompra: new Date('2024-01-20'),
    fechaVencimiento: new Date('2024-04-20'),
    estado: 'activo',
    precio: 225,
  },
  {
    id: 'b2',
    paqueteId: 'p2',
    paqueteNombre: 'Paquete Estándar 10 Sesiones',
    clienteId: 'client_2',
    clienteNombre: 'María García',
    sesionesTotal: 10,
    sesionesUsadas: 7,
    sesionesRestantes: 3,
    fechaCompra: new Date('2024-01-15'),
    fechaVencimiento: new Date('2024-07-15'),
    estado: 'activo',
    precio: 425,
  },
  {
    id: 'b3',
    paqueteId: 'p3',
    paqueteNombre: 'Paquete Premium 20 Sesiones',
    clienteId: 'client_1',
    clienteNombre: 'Juan Pérez',
    sesionesTotal: 20,
    sesionesUsadas: 0,
    sesionesRestantes: 20,
    fechaCompra: new Date('2024-02-01'),
    fechaVencimiento: new Date('2025-02-01'),
    estado: 'activo',
    precio: 800,
  },
  {
    id: 'b4',
    paqueteId: 'p2',
    paqueteNombre: 'Paquete Estándar 10 Sesiones',
    clienteId: 'client_4',
    clienteNombre: 'Ana Martínez',
    sesionesTotal: 10,
    sesionesUsadas: 3,
    sesionesRestantes: 7,
    fechaCompra: new Date('2024-02-10'),
    fechaVencimiento: new Date('2024-08-10'),
    estado: 'activo',
    precio: 425,
  },
];

// ============================================================================
// FUNCIONES PRINCIPALES - API ESTÁNDAR
// ============================================================================

/**
 * Obtiene todos los bonos activos de un cliente
 * 
 * @param clienteId - ID del cliente
 * @returns Lista de bonos activos del cliente (no vencidos, no agotados)
 * 
 * @remarks
 * CONEXIÓN CON RESERVAS:
 * - Se usa para mostrar los bonos disponibles al crear una reserva
 * - Solo retorna bonos que pueden ser usados (sesionesRestantes > 0, no vencidos)
 * - Los bonos vencidos o agotados NO se incluyen en el resultado
 * - El cliente puede elegir qué bono usar al crear una reserva
 * 
 * FILTROS APLICADOS:
 * - estado === 'activo'
 * - sesionesRestantes > 0
 * - fechaCaducidadOpcional no ha pasado (si existe)
 * 
 * En producción: GET /api/clientes/:clienteId/bonos-activos
 */
export const getBonosActivosPorCliente = async (
  clienteId: string
): Promise<BonoActivo[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const ahora = new Date();
  let bonos = bonosStorage.filter(
    b => b.clienteId === clienteId && b.estado === 'activo'
  );
  
  // Verificar si los bonos están vencidos o agotados
  bonos = bonos.map(bono => {
    // Verificar si está agotado
    if (bono.sesionesRestantes === 0) {
      return { ...bono, estado: 'agotado' as const };
    }
    
    // Verificar si está vencido
    const fechaVencimiento = bono.fechaCaducidadOpcional || bono.fechaVencimiento;
    if (fechaVencimiento && fechaVencimiento < ahora) {
      return { ...bono, estado: 'vencido' as const };
    }
    
    return bono;
  });
  
  // Actualizar el storage con los estados actualizados
  bonos.forEach(bonoActualizado => {
    const indice = bonosStorage.findIndex(b => b.id === bonoActualizado.id);
    if (indice !== -1) {
      bonosStorage[indice] = bonoActualizado;
    }
  });
  
  // Filtrar solo los activos (no vencidos, no agotados)
  return bonos.filter(b => b.estado === 'activo' && b.sesionesRestantes > 0);
};

/**
 * Alias para mantener compatibilidad con código existente
 */
export const getBonosActivosCliente = async (
  clienteId: string,
  entrenadorId?: string
): Promise<BonoActivo[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let bonos = bonosStorage.filter(
    b => b.clienteId === clienteId && b.estado === 'activo'
  );
  
  // Verificar si los bonos están vencidos o agotados
  const ahora = new Date();
  bonos = bonos.map(bono => {
    if (bono.sesionesRestantes === 0) {
      return { ...bono, estado: 'agotado' as const };
    }
    const fechaVencimiento = bono.fechaCaducidadOpcional || bono.fechaVencimiento;
    if (fechaVencimiento && fechaVencimiento < ahora) {
      return { ...bono, estado: 'vencido' as const };
    }
    return bono;
  });
  
  // Actualizar el storage con los estados actualizados
  bonos.forEach(bonoActualizado => {
    const indice = bonosStorage.findIndex(b => b.id === bonoActualizado.id);
    if (indice !== -1) {
      bonosStorage[indice] = bonoActualizado;
    }
  });
  
  // Filtrar solo los activos
  return bonos.filter(b => b.estado === 'activo');
};

/**
 * Obtener un bono por ID
 */
export const getBonoPorId = async (bonoId: string): Promise<BonoActivo | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return bonosStorage.find(b => b.id === bonoId) || null;
};

/**
 * Crear un nuevo bono (cuando un cliente compra un paquete)
 */
export const crearBono = async (
  bono: Omit<BonoActivo, 'id' | 'createdAt' | 'updatedAt'>
): Promise<BonoActivo> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const nuevoBono: BonoActivo = {
    ...bono,
    id: `b${Date.now()}`,
  };
  
  bonosStorage.push(nuevoBono);
  return nuevoBono;
};

/**
 * Consume una sesión de un bono (descuenta una sesión)
 * 
 * @param bonoId - ID del bono del cual consumir la sesión
 * @returns El bono actualizado después de consumir la sesión
 * 
 * @throws Error si el bono no existe, no tiene sesiones disponibles, está vencido o no está activo
 * 
 * @remarks
 * CONEXIÓN CON RESERVAS:
 * - Se llama cuando una reserva que usó un bono se marca como 'completada'
 * - Reduce sesionesRestantes en 1
 * - Incrementa sesionesUsadas en 1
 * - Si sesionesRestantes llega a 0, marca el bono como 'agotado'
 * - NO se llama al crear la reserva, solo al completarla
 * 
 * VALIDACIONES:
 * - El bono debe existir
 * - El bono debe estar activo
 * - sesionesRestantes > 0
 * - El bono no debe estar vencido
 * 
 * CUANDO SE LLAMA:
 * - Al completar una reserva que tiene bonoIdOpcional
 * - No se llama si la reserva se cancela antes de completarse
 * 
 * En producción: POST /api/bonos/:bonoId/consumir-sesion
 */
export const consumirSesionDeBono = async (bonoId: string): Promise<BonoActivo> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const indice = bonosStorage.findIndex(b => b.id === bonoId);
  
  if (indice === -1) {
    throw new Error('Bono no encontrado');
  }
  
  const bono = bonosStorage[indice];
  
  // Validaciones
  if (bono.sesionesRestantes <= 0) {
    throw new Error('El bono no tiene sesiones disponibles');
  }
  
  const fechaVencimiento = bono.fechaCaducidadOpcional || bono.fechaVencimiento;
  if (fechaVencimiento && fechaVencimiento < new Date()) {
    throw new Error('El bono está vencido');
  }
  
  if (bono.estado !== 'activo') {
    throw new Error('El bono no está activo');
  }
  
  // Consumir una sesión
  const sesionesRestantesNuevo = bono.sesionesRestantes - 1;
  bonosStorage[indice] = {
    ...bono,
    sesionesUsadas: bono.sesionesUsadas + 1,
    sesionesRestantes: sesionesRestantesNuevo,
    estado: sesionesRestantesNuevo === 0 ? 'agotado' : 'activo',
  };
  
  return bonosStorage[indice];
};

/**
 * Alias para mantener compatibilidad con código existente
 */
export const usarSesionBono = async (bonoId: string): Promise<BonoActivo> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const indice = bonosStorage.findIndex(b => b.id === bonoId);
  
  if (indice === -1) {
    throw new Error('Bono no encontrado');
  }
  
  const bono = bonosStorage[indice];
  
  if (bono.sesionesRestantes <= 0) {
    throw new Error('El bono no tiene sesiones disponibles');
  }
  
  if (bono.fechaVencimiento < new Date()) {
    throw new Error('El bono está vencido');
  }
  
  if (bono.estado !== 'activo') {
    throw new Error('El bono no está activo');
  }
  
  // Descontar una sesión
  bonosStorage[indice] = {
    ...bono,
    sesionesUsadas: bono.sesionesUsadas + 1,
    sesionesRestantes: bono.sesionesRestantes - 1,
    estado: bono.sesionesRestantes - 1 === 0 ? 'agotado' : 'activo',
  };
  
  return bonosStorage[indice];
};

/**
 * Crea un nuevo bono activo a partir de un paquete de sesiones comprado
 * 
 * @param clienteId - ID del cliente que compró el paquete
 * @param paqueteId - ID del paquete de sesiones comprado
 * @returns El bono activo creado
 * 
 * @throws Error si el paquete no existe o no está activo
 * 
 * @remarks
 * CONEXIÓN CON RESERVAS:
 * - Se llama cuando un cliente compra un paquete (en el checkout de la tienda online)
 * - Crea un BonoActivo que el cliente puede usar para crear reservas
 * - El bono tiene sesionesRestantes = numeroSesiones del paquete
 * - Se establece fechaCaducidadOpcional según caducidadOpcional del paquete
 * - El precio del bono es el precio del paquete (para tracking de ingresos)
 * 
 * FLUJO DE COMPRA:
 * 1. Cliente selecciona un paquete en la tienda online
 * 2. Cliente completa el pago
 * 3. Se llama a crearBonoDesdePaquete(clienteId, paqueteId)
 * 4. El bono queda disponible para usar en reservas
 * 
 * EJEMPLO:
 * ```typescript
 * // Cliente compra un paquete
 * const bono = await crearBonoDesdePaquete('cliente1', 'paquete1');
 * // bono tiene:
 * //   - sesionesRestantes: 10 (del paquete)
 * //   - sesionesUsadas: 0
 * //   - estado: 'activo'
 * //   - fechaCaducidadOpcional: hoy + 180 días (del paquete)
 * ```
 * 
 * En producción: POST /api/clientes/:clienteId/bonos { body: { paqueteId } }
 */
export const crearBonoDesdePaquete = async (
  clienteId: string,
  paqueteId: string
): Promise<BonoActivo> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Obtener el paquete - buscar en todos los paquetes
  const todosLosPaquetes = await getPaquetesSesiones();
  const paquete = todosLosPaquetes.find(p => p.id === paqueteId);
  
  if (!paquete) {
    throw new Error('Paquete no encontrado');
  }
  
  if (!paquete.activo) {
    throw new Error('El paquete no está activo');
  }
  
  // Calcular fecha de caducidad
  let fechaCaducidadOpcional: Date | undefined;
  if (paquete.caducidadOpcional || paquete.validezMeses) {
    const diasCaducidad = paquete.caducidadOpcional || (paquete.validezMeses ? paquete.validezMeses * 30 : undefined);
    if (diasCaducidad) {
      fechaCaducidadOpcional = new Date();
      fechaCaducidadOpcional.setDate(fechaCaducidadOpcional.getDate() + diasCaducidad);
    }
  }
  
  // Crear el bono
  const nuevoBono: BonoActivo = {
    id: `bono-${Date.now()}`,
    clienteId,
    paqueteId,
    sesionesUsadas: 0,
    sesionesRestantes: paquete.numeroSesiones,
    fechaCompra: new Date(),
    fechaCaducidadOpcional,
    paqueteNombre: paquete.nombre,
    sesionesTotal: paquete.numeroSesiones,
    estado: 'activo',
    precio: paquete.precio || paquete.precioTotal,
  };
  
  bonosStorage.push(nuevoBono);
  return nuevoBono;
};

/**
 * Reembolsar una sesión de un bono (si se cancela una reserva)
 * 
 * @param bonoId - ID del bono al cual reembolsar la sesión
 * @returns El bono actualizado después del reembolso
 * 
 * @remarks
 * CONEXIÓN CON RESERVAS:
 * - Se llama opcionalmente cuando se cancela una reserva que usó un bono
 * - Solo se debe llamar si la reserva se canceló ANTES de completarse
 * - Incrementa sesionesRestantes en 1
 * - Reduce sesionesUsadas en 1
 * - Reactiva el bono si estaba agotado
 * 
 * NOTA: Esto es opcional según la política de cancelación.
 * Algunos negocios pueden no reembolsar sesiones de bonos si se cancela muy cerca de la fecha.
 * 
 * En producción: POST /api/bonos/:bonoId/reembolsar-sesion
 */
export const reembolsarSesionBono = async (bonoId: string): Promise<BonoActivo> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const indice = bonosStorage.findIndex(b => b.id === bonoId);
  
  if (indice === -1) {
    throw new Error('Bono no encontrado');
  }
  
  const bono = bonosStorage[indice];
  
  // Reembolsar una sesión
  const sesionesTotal = bono.sesionesTotal || (bono.sesionesUsadas + bono.sesionesRestantes);
  bonosStorage[indice] = {
    ...bono,
    sesionesUsadas: Math.max(0, bono.sesionesUsadas - 1),
    sesionesRestantes: Math.min(sesionesTotal, bono.sesionesRestantes + 1),
    estado: 'activo', // Reactivar si estaba agotado
  };
  
  return bonosStorage[indice];
};

