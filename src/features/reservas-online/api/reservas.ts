import { Reserva, Clase, EstadoReserva, OrigenReserva } from '../types';
import { generarEnlaceVideollamada, getConfiguracionVideollamada } from './enlacesVideollamada';
import { validarTiempoMinimoAnticipacion } from './validacionReservas';

/**
 * Filtros para obtener reservas
 */
export interface FiltrosReservas {
  fechaInicio?: Date;
  fechaFin?: Date;
  clienteId?: string;
  entrenadorId?: string;
  estado?: EstadoReserva | EstadoReserva[];
  origen?: OrigenReserva | OrigenReserva[];
  tipo?: 'sesion-1-1' | 'clase-grupal' | 'fisio' | 'nutricion' | 'masaje';
  tipoSesion?: 'presencial' | 'videollamada';
}

/**
 * Obtiene las reservas con filtros opcionales
 * 
 * @param filtros - Filtros para buscar reservas (fechas, cliente, entrenador, estado, origen)
 * @param role - Rol del usuario ('entrenador' o 'gimnasio')
 * @returns Lista de reservas que cumplen con los filtros
 * 
 * @example
 * ```typescript
 * // Obtener todas las reservas de un cliente
 * const reservas = await getReservas({ clienteId: 'cliente1' }, 'entrenador');
 * 
 * // Obtener reservas confirmadas en un rango de fechas
 * const reservas = await getReservas({
 *   fechaInicio: new Date('2024-01-01'),
 *   fechaFin: new Date('2024-01-31'),
 *   estado: 'confirmada'
 * }, 'entrenador');
 * ```
 * 
 * @remarks
 * En producción, esta función se conectaría con un backend REST/GraphQL:
 * - REST: GET /api/reservas?fechaInicio=...&fechaFin=...&clienteId=...
 * - GraphQL: query { reservas(filtros: {...}) { id, fecha, estado, ... } }
 * 
 * Las validaciones de negocio se centralizarían en el backend para garantizar
 * consistencia y seguridad, mientras que el frontend solo realiza validaciones
 * básicas de formato antes de enviar la petición.
 */
export const getReservas = async (
  filtros: FiltrosReservas = {},
  role: 'entrenador' | 'gimnasio' = 'entrenador'
): Promise<Reserva[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const hoy = new Date();
  const addDays = (days: number) => new Date(hoy.getTime() + days * 86400000);
  const addHours = (hours: number) => new Date(hoy.getTime() + hours * 60 * 60 * 1000);
  
  // Usar filtros proporcionados o valores por defecto
  const fechaInicio = filtros.fechaInicio || addDays(-30);
  const fechaFin = filtros.fechaFin || addDays(30);
  
  // Verificar si estamos buscando reservas en las próximas 24 horas
  // Consideramos que es "próximas 24 horas" si:
  // 1. El rango es aproximadamente 24 horas o menos
  // 2. La fecha de inicio es hoy o muy próxima (dentro de 1 hora)
  const diffTiempo = fechaFin.getTime() - fechaInicio.getTime();
  const diffDesdeAhora = fechaInicio.getTime() - hoy.getTime();
  const esProximas24Horas = 
    diffTiempo <= 25 * 60 * 60 * 1000 && // Rango de hasta 25 horas (con margen)
    diffDesdeAhora >= -60 * 60 * 1000 && // La fecha de inicio no es más de 1 hora en el pasado
    diffDesdeAhora <= 25 * 60 * 60 * 1000; // Y no es más de 25 horas en el futuro
  
  // Datos mock de reservas - cubriendo diferentes casos
  const reservasMock: Reserva[] = [];
  
  if (role === 'entrenador') {
    // ============================================
    // RESERVAS 1:1 PRESENCIALES
    // ============================================
    reservasMock.push(
      {
        id: '1',
        clienteId: 'cliente1',
        entrenadorId: 'entrenador1',
        clienteNombre: 'Juan Pérez',
        fecha: addDays(1),
        fechaInicio: addDays(1),
        fechaFin: addDays(1),
        horaInicio: '10:00',
        horaFin: '11:00',
        tipo: 'sesion-1-1',
        tipoSesion: 'presencial',
        estado: 'confirmada',
        origen: 'appCliente',
        esOnline: false,
        precio: 50,
        pagado: true,
        createdAt: addDays(-5),
        updatedAt: addDays(-2),
      },
      // ============================================
      // RESERVAS 1:1 ONLINE
      // ============================================
      {
        id: '2',
        clienteId: 'cliente2',
        entrenadorId: 'entrenador1',
        clienteNombre: 'María García',
        fecha: addDays(2),
        fechaInicio: addDays(2),
        fechaFin: addDays(2),
        horaInicio: '12:00',
        horaFin: '12:45',
        tipo: 'sesion-1-1',
        tipoSesion: 'videollamada',
        estado: 'confirmada',
        origen: 'appCliente',
        esOnline: true,
        precio: 45,
        pagado: true,
        enlaceVideollamada: 'https://meet.google.com/abc-defg-hij',
        createdAt: addDays(-4),
        updatedAt: addDays(-1),
      },
      // ============================================
      // RESERVAS PENDIENTES
      // ============================================
      {
        id: '3',
        clienteId: 'cliente3',
        entrenadorId: 'entrenador1',
        clienteNombre: 'Carlos Ruiz',
        fecha: addDays(3),
        fechaInicio: addDays(3),
        fechaFin: addDays(3),
        horaInicio: '09:00',
        horaFin: '10:00',
        tipo: 'sesion-1-1',
        tipoSesion: 'presencial',
        estado: 'pendiente',
        origen: 'enlacePublico',
        esOnline: false,
        precio: 50,
        pagado: false,
        createdAt: addDays(-6),
        updatedAt: addDays(-3),
      },
      // ============================================
      // RESERVAS CANCELADAS
      // ============================================
      {
        id: '4',
        clienteId: 'cliente4',
        entrenadorId: 'entrenador1',
        clienteNombre: 'Ana Martínez',
        fecha: addDays(4),
        fechaInicio: addDays(4),
        fechaFin: addDays(4),
        horaInicio: '16:00',
        horaFin: '17:00',
        tipo: 'sesion-1-1',
        tipoSesion: 'presencial',
        estado: 'canceladaCliente',
        origen: 'appCliente',
        esOnline: false,
        precio: 50,
        pagado: false,
        observaciones: 'Cliente canceló por motivo personal',
        createdAt: addDays(-3),
        updatedAt: addDays(-1),
      },
      {
        id: '5',
        clienteId: 'cliente5',
        entrenadorId: 'entrenador1',
        clienteNombre: 'Luis García',
        fecha: addDays(2),
        fechaInicio: addDays(2),
        fechaFin: addDays(2),
        horaInicio: '11:00',
        horaFin: '11:30',
        tipo: 'sesion-1-1',
        tipoSesion: 'videollamada',
        estado: 'canceladaCliente',
        origen: 'manual',
        esOnline: true,
        precio: 45,
        pagado: false,
        observaciones: 'Cliente canceló por motivo personal',
        enlaceVideollamada: 'https://meet.google.com/xyz-wuvt-rst',
        createdAt: addDays(-8),
        updatedAt: addDays(-1),
      },
      // ============================================
      // RESERVAS NO-SHOW
      // ============================================
      {
        id: '6',
        clienteId: 'cliente6',
        entrenadorId: 'entrenador1',
        clienteNombre: 'Pedro Sánchez',
        fecha: addDays(-7),
        fechaInicio: addDays(-7),
        fechaFin: addDays(-7),
        horaInicio: '11:00',
        horaFin: '11:30',
        tipo: 'sesion-1-1',
        tipoSesion: 'videollamada',
        estado: 'noShow',
        origen: 'appCliente',
        esOnline: true,
        precio: 45,
        pagado: false,
        observaciones: 'Cliente no se presentó',
        createdAt: addDays(-12),
        updatedAt: addDays(-7),
      },
      // ============================================
      // RESERVAS COMPLETADAS
      // ============================================
      {
        id: '7',
        clienteId: 'cliente1',
        entrenadorId: 'entrenador1',
        clienteNombre: 'Juan Pérez',
        fecha: addDays(-10),
        fechaInicio: addDays(-10),
        fechaFin: addDays(-10),
        horaInicio: '10:00',
        horaFin: '11:00',
        tipo: 'sesion-1-1',
        tipoSesion: 'presencial',
        estado: 'completada',
        origen: 'appCliente',
        esOnline: false,
        precio: 50,
        pagado: true,
        createdAt: addDays(-15),
        updatedAt: addDays(-10),
      },
      {
        id: '8',
        clienteId: 'cliente2',
        entrenadorId: 'entrenador1',
        clienteNombre: 'María García',
        fecha: addDays(-8),
        fechaInicio: addDays(-8),
        fechaFin: addDays(-8),
        horaInicio: '12:00',
        horaFin: '12:45',
        tipo: 'sesion-1-1',
        tipoSesion: 'videollamada',
        estado: 'completada',
        origen: 'appCliente',
        esOnline: true,
        precio: 45,
        pagado: true,
        createdAt: addDays(-13),
        updatedAt: addDays(-8),
      },
      // ============================================
      // RESERVAS FISIOTERAPIA
      // ============================================
      {
        id: '9',
        clienteId: 'cliente7',
        entrenadorId: 'entrenador2',
        clienteNombre: 'Laura Torres',
        fecha: addDays(5),
        fechaInicio: addDays(5),
        fechaFin: addDays(5),
        horaInicio: '14:00',
        horaFin: '15:00',
        tipo: 'fisio',
        tipoSesion: 'presencial',
        estado: 'confirmada',
        origen: 'manual',
        esOnline: false,
        precio: 60,
        pagado: true,
        createdAt: addDays(-3),
        updatedAt: addDays(-2),
      },
      // ============================================
      // RESERVAS NUTRICIÓN
      // ============================================
      {
        id: '10',
        clienteId: 'cliente8',
        entrenadorId: 'entrenador3',
        clienteNombre: 'Miguel Vargas',
        fecha: addDays(6),
        fechaInicio: addDays(6),
        fechaFin: addDays(6),
        horaInicio: '09:00',
        horaFin: '10:00',
        tipo: 'nutricion',
        tipoSesion: 'presencial',
        estado: 'confirmada',
        origen: 'appCliente',
        esOnline: false,
        precio: 50,
        pagado: true,
        createdAt: addDays(-4),
        updatedAt: addDays(-1),
      },
      // ============================================
      // RESERVAS CON INTEGRACIÓN EXTERNA
      // ============================================
      {
        id: '11',
        clienteId: 'cliente9',
        entrenadorId: 'entrenador1',
        clienteNombre: 'Patricia Jiménez',
        fecha: addDays(7),
        fechaInicio: addDays(7),
        fechaFin: addDays(7),
        horaInicio: '11:00',
        horaFin: '12:00',
        tipo: 'sesion-1-1',
        tipoSesion: 'presencial',
        estado: 'confirmada',
        origen: 'integracionExterna',
        esOnline: false,
        precio: 50,
        pagado: true,
        createdAt: addDays(-2),
        updatedAt: addDays(-1),
      }
    );


    // Agregar reservas adicionales para estadísticas históricas
    reservasMock.push(
      {
        id: '12',
        clienteId: 'cliente1',
        entrenadorId: 'entrenador1',
        clienteNombre: 'Juan Pérez',
        fecha: addDays(-5),
        fechaInicio: addDays(-5),
        fechaFin: addDays(-5),
        horaInicio: '10:00',
        horaFin: '11:00',
        tipo: 'sesion-1-1',
        tipoSesion: 'presencial',
        estado: 'completada',
        origen: 'appCliente',
        esOnline: false,
        precio: 50,
        pagado: true,
        createdAt: addDays(-10),
        updatedAt: addDays(-5),
      },
      {
        id: '13',
        clienteId: 'cliente3',
        entrenadorId: 'entrenador1',
        clienteNombre: 'Carlos Ruiz',
        fecha: addDays(-12),
        fechaInicio: addDays(-12),
        fechaFin: addDays(-12),
        horaInicio: '09:00',
        horaFin: '10:00',
        tipo: 'sesion-1-1',
        tipoSesion: 'presencial',
        estado: 'completada',
        origen: 'appCliente',
        esOnline: false,
        precio: 50,
        pagado: true,
        createdAt: addDays(-17),
        updatedAt: addDays(-12),
      }
    );
    
    // Aplicar filtros
    let reservasFiltradas = reservasMock;
    
    // Filtrar por rango de fechas
    reservasFiltradas = reservasFiltradas.filter(r => {
      const fechaReserva = r.fecha || r.fechaInicio;
      return fechaReserva >= fechaInicio && fechaReserva <= fechaFin;
    });
    
    // Filtrar por cliente
    if (filtros.clienteId) {
      reservasFiltradas = reservasFiltradas.filter(r => r.clienteId === filtros.clienteId);
    }
    
    // Filtrar por entrenador
    if (filtros.entrenadorId) {
      reservasFiltradas = reservasFiltradas.filter(r => r.entrenadorId === filtros.entrenadorId);
    }
    
    // Filtrar por estado
    if (filtros.estado) {
      const estados = Array.isArray(filtros.estado) ? filtros.estado : [filtros.estado];
      reservasFiltradas = reservasFiltradas.filter(r => estados.includes(r.estado));
    }
    
    // Filtrar por origen
    if (filtros.origen) {
      const origenes = Array.isArray(filtros.origen) ? filtros.origen : [filtros.origen];
      reservasFiltradas = reservasFiltradas.filter(r => origenes.includes(r.origen));
    }
    
    // Filtrar por tipo
    if (filtros.tipo) {
      reservasFiltradas = reservasFiltradas.filter(r => r.tipo === filtros.tipo);
    }
    
    // Filtrar por tipo de sesión
    if (filtros.tipoSesion) {
      reservasFiltradas = reservasFiltradas.filter(r => r.tipoSesion === filtros.tipoSesion);
    }
    
    return reservasFiltradas;
  }
  
  // Para gimnasio - clases grupales
  const reservasGimnasio: Reserva[] = [
    {
      id: 'g1',
      clienteId: 'cliente10',
      entrenadorId: 'entrenador1',
      clienteNombre: 'Ana López',
      fecha: hoy,
      fechaInicio: hoy,
      fechaFin: hoy,
      horaInicio: '10:00',
      horaFin: '11:00',
      tipo: 'clase-grupal',
      claseId: 'clase1',
      claseNombre: 'Spinning',
      estado: 'confirmada',
      origen: 'appCliente',
      esOnline: false,
      precio: 15,
      pagado: true,
      capacidad: 20,
      ocupacion: 18,
      createdAt: addDays(-3),
      updatedAt: addDays(-1),
    },
    {
      id: 'g2',
      clienteId: 'cliente11',
      entrenadorId: 'entrenador2',
      clienteNombre: 'Diego Fernández',
      fecha: hoy,
      fechaInicio: hoy,
      fechaFin: hoy,
      horaInicio: '12:00',
      horaFin: '13:00',
      tipo: 'boxeo',
      claseId: 'clase2',
      claseNombre: 'Boxeo',
      estado: 'confirmada',
      origen: 'appCliente',
      esOnline: false,
      precio: 20,
      pagado: true,
      capacidad: 15,
      ocupacion: 12,
      createdAt: addDays(-2),
      updatedAt: addDays(-1),
    },
    {
      id: 'g3',
      clienteId: 'cliente12',
      entrenadorId: 'entrenador1',
      clienteNombre: 'Elena Sánchez',
      fecha: addDays(1),
      fechaInicio: addDays(1),
      fechaFin: addDays(1),
      horaInicio: '08:00',
      horaFin: '09:00',
      tipo: 'clase-grupal',
      claseId: 'clase3',
      claseNombre: 'Spinning',
      estado: 'confirmada',
      origen: 'appCliente',
      esOnline: false,
      precio: 15,
      pagado: true,
      capacidad: 30,
      ocupacion: 28,
      createdAt: addDays(-4),
      updatedAt: addDays(-2),
    },
    {
      id: 'g4',
      clienteId: 'cliente13',
      entrenadorId: 'entrenador3',
      clienteNombre: 'Roberto Martín',
      fecha: addDays(1),
      fechaInicio: addDays(1),
      fechaFin: addDays(1),
      horaInicio: '18:30',
      horaFin: '19:30',
      tipo: 'clase-grupal',
      claseId: 'clase4',
      claseNombre: 'Pilates',
      estado: 'pendiente',
      origen: 'enlacePublico',
      esOnline: false,
      precio: 18,
      pagado: false,
      capacidad: 15,
      ocupacion: 12,
      createdAt: addDays(-2),
      updatedAt: addDays(-2),
    },
    {
      id: 'g5',
      clienteId: 'cliente14',
      entrenadorId: 'entrenador2',
      clienteNombre: 'Laura Torres',
      fecha: addDays(2),
      fechaInicio: addDays(2),
      fechaFin: addDays(2),
      horaInicio: '19:00',
      horaFin: '20:00',
      tipo: 'hiit',
      claseId: 'clase5',
      claseNombre: 'HIIT',
      estado: 'confirmada',
      origen: 'appCliente',
      esOnline: false,
      precio: 20,
      pagado: true,
      capacidad: 20,
      ocupacion: 18,
      createdAt: addDays(-5),
      updatedAt: addDays(-3),
    },
    {
      id: 'g6',
      clienteId: 'cliente15',
      entrenadorId: 'entrenador4',
      clienteNombre: 'Miguel Vargas',
      fecha: addDays(3),
      fechaInicio: addDays(3),
      fechaFin: addDays(3),
      horaInicio: '09:00',
      horaFin: '10:00',
      tipo: 'clase-grupal',
      claseId: 'clase6',
      claseNombre: 'Stretching',
      estado: 'canceladaCentro',
      origen: 'manual',
      esOnline: false,
      precio: 15,
      pagado: false,
      capacidad: 18,
      ocupacion: 14,
      observaciones: 'Cancelación por baja demanda',
      createdAt: addDays(-7),
      updatedAt: addDays(-1),
    },
  ];
  
  // Aplicar filtros a reservas de gimnasio
  let reservasGimnasioFiltradas = reservasGimnasio;
  
  // Filtrar por rango de fechas
  reservasGimnasioFiltradas = reservasGimnasioFiltradas.filter(r => {
    const fechaReserva = r.fecha || r.fechaInicio;
    return fechaReserva >= fechaInicio && fechaReserva <= fechaFin;
  });
  
  // Filtrar por cliente
  if (filtros.clienteId) {
    reservasGimnasioFiltradas = reservasGimnasioFiltradas.filter(r => r.clienteId === filtros.clienteId);
  }
  
  // Filtrar por entrenador
  if (filtros.entrenadorId) {
    reservasGimnasioFiltradas = reservasGimnasioFiltradas.filter(r => r.entrenadorId === filtros.entrenadorId);
  }
  
  // Filtrar por estado
  if (filtros.estado) {
    const estados = Array.isArray(filtros.estado) ? filtros.estado : [filtros.estado];
    reservasGimnasioFiltradas = reservasGimnasioFiltradas.filter(r => estados.includes(r.estado));
  }
  
  // Filtrar por origen
  if (filtros.origen) {
    const origenes = Array.isArray(filtros.origen) ? filtros.origen : [filtros.origen];
    reservasGimnasioFiltradas = reservasGimnasioFiltradas.filter(r => origenes.includes(r.origen));
  }
  
  // Filtrar por tipo
  if (filtros.tipo) {
    reservasGimnasioFiltradas = reservasGimnasioFiltradas.filter(r => r.tipo === filtros.tipo);
  }
  
  // Filtrar por tipo de sesión
  if (filtros.tipoSesion) {
    reservasGimnasioFiltradas = reservasGimnasioFiltradas.filter(r => r.tipoSesion === filtros.tipoSesion);
  }
  
  return reservasGimnasioFiltradas;
};

/**
 * Crea una nueva reserva después de validar las reglas de negocio
 * 
 * @param data - Datos de la reserva a crear (sin id, createdAt, updatedAt, enlaceVideollamada)
 * @param entrenadorId - ID del entrenador (opcional, para validaciones específicas)
 * @returns La reserva creada con todos sus campos
 * 
 * @throws Error si las validaciones fallan
 * 
 * @example
 * ```typescript
 * const nuevaReserva = await createReserva({
 *   clienteId: 'cliente1',
 *   entrenadorId: 'entrenador1',
 *   fechaInicio: new Date('2024-01-15T10:00:00'),
 *   fechaFin: new Date('2024-01-15T11:00:00'),
 *   estado: 'pendiente',
 *   origen: 'appCliente',
 *   esOnline: false,
 *   precio: 50
 * }, 'entrenador1');
 * ```
 * 
 * @remarks
 * En producción, esta función se conectaría con un backend REST/GraphQL:
 * - REST: POST /api/reservas { body: datosReserva }
 * - GraphQL: mutation { createReserva(input: {...}) { id, fecha, estado, ... } }
 * 
 * Las validaciones de negocio se centralizarían en el backend:
 * - Validación de disponibilidad de slots
 * - Validación de políticas de cancelación
 * - Validación de tiempo mínimo de anticipación
 * - Validación de capacidad (para clases grupales)
 * - Validación de permisos y autorización
 * 
 * El frontend solo realiza validaciones básicas de formato antes de enviar.
 */
export const createReserva = async (
  data: Omit<Reserva, 'id' | 'createdAt' | 'updatedAt' | 'enlaceVideollamada'>,
  entrenadorId?: string
): Promise<Reserva> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Importar funciones de validación
  const { validarSlotDisponible, validarAnticipacion } = await import('./validacionReservas');
  
  // Validar tiempo mínimo de anticipación
  if (entrenadorId && data.fechaInicio && data.horaInicio) {
    const fechaReserva = data.fecha || data.fechaInicio;
    const validacionAnticipacion = await validarAnticipacion(
      fechaReserva,
      data.horaInicio || '',
      { horasMinimas: 24 } // Configuración por defecto
    );
    
    if (!validacionAnticipacion.valido) {
      throw new Error(validacionAnticipacion.mensaje || 'La reserva no cumple con el tiempo mínimo de anticipación requerido');
    }
  }
  
  // Validar disponibilidad del slot
  if (entrenadorId && data.fechaInicio && data.horaInicio && data.horaFin) {
    const fechaReserva = data.fecha || data.fechaInicio;
    const validacionSlot = await validarSlotDisponible(
      {
        fecha: fechaReserva,
        horaInicio: data.horaInicio,
        horaFin: data.horaFin,
        tipo: data.tipo || 'sesion-1-1',
        entrenadorId,
      },
      {
        reservasExistentes: await getReservas({ entrenadorId }, 'entrenador'),
      }
    );
    
    if (!validacionSlot.valido) {
      throw new Error(validacionSlot.mensaje || 'El slot seleccionado no está disponible');
    }
  }
  
  // Si es una sesión de videollamada, generar el enlace automáticamente
  let enlaceVideollamada: string | undefined;
  if (data.tipoSesion === 'videollamada' || data.esOnline) {
    try {
      // Obtener configuración de videollamada del entrenador
      const configuracion = entrenadorId 
        ? await getConfiguracionVideollamada(entrenadorId)
        : { plataforma: 'google-meet' as const };
      
      // Generar enlace de videollamada
      const reservaId = Date.now().toString(); // ID temporal, se generará el real después
      const fechaReserva = data.fecha || data.fechaInicio;
      enlaceVideollamada = await generarEnlaceVideollamada(
        reservaId,
        fechaReserva,
        data.horaInicio || '',
        data.horaFin || '',
        data.clienteNombre || '',
        entrenadorId,
        configuracion.plataforma
      );
    } catch (error) {
      console.error('Error generando enlace de videollamada:', error);
      // Continuar sin el enlace si hay error
    }
  }
  
  // Preparar fechas si no están en el formato correcto
  const fechaInicio = data.fechaInicio || data.fecha || new Date();
  const fechaFin = data.fechaFin || data.fecha || new Date();
  
  const nuevaReserva: Reserva = {
    ...data,
    id: Date.now().toString(),
    fecha: fechaInicio, // Mantener compatibilidad
    fechaInicio,
    fechaFin,
    enlaceVideollamada,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Crear notificación de nueva reserva si hay entrenadorId
  if (entrenadorId) {
    try {
      const { crearNotificacionNuevaReserva } = await import('./notificacionesNuevasReservas');
      await crearNotificacionNuevaReserva(nuevaReserva, entrenadorId);
    } catch (error) {
      console.error('Error creando notificación de nueva reserva:', error);
      // No fallar la creación de la reserva si hay error en la notificación
    }
  }
  
  return nuevaReserva;
};

/**
 * @deprecated Usar createReserva en su lugar
 */
export const crearReserva = createReserva;

/**
 * Actualiza una reserva existente después de validar las reglas de negocio
 * 
 * @param id - ID de la reserva a actualizar
 * @param changes - Campos a actualizar (parcial)
 * @param entrenadorId - ID del entrenador (opcional, para validaciones)
 * @returns La reserva actualizada
 * 
 * @throws Error si la reserva no existe o las validaciones fallan
 * 
 * @example
 * ```typescript
 * const reservaActualizada = await updateReserva('reserva1', {
 *   estado: 'confirmada',
 *   precio: 60
 * }, 'entrenador1');
 * ```
 * 
 * @remarks
 * En producción, esta función se conectaría con un backend REST/GraphQL:
 * - REST: PATCH /api/reservas/:id { body: cambios }
 * - GraphQL: mutation { updateReserva(id: "...", input: {...}) { id, estado, ... } }
 * 
 * Las validaciones de negocio se centralizarían en el backend:
 * - Verificar que la reserva existe y pertenece al usuario
 * - Validar cambios de fecha/hora (disponibilidad, anticipación)
 * - Validar cambios de estado (transiciones permitidas)
 * - Validar permisos para modificar la reserva
 */
export const updateReserva = async (
  id: string,
  changes: Partial<Reserva>,
  entrenadorId?: string
): Promise<Reserva> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Obtener la reserva actual
  const fechaInicio = new Date();
  fechaInicio.setMonth(fechaInicio.getMonth() - 1);
  const fechaFin = new Date();
  fechaFin.setMonth(fechaFin.getMonth() + 1);
  const reservas = await getReservas({ fechaInicio, fechaFin }, 'entrenador');
  const reservaExistente = reservas.find(r => r.id === id);
  
  if (!reservaExistente) {
    throw new Error('Reserva no encontrada');
  }
  
  // Importar funciones de validación
  const { validarSlotDisponible, validarAnticipacion } = await import('./validacionReservas');
  
  // Si se cambia la fecha/hora, validar disponibilidad y anticipación
  if ((changes.fechaInicio || changes.fecha || changes.horaInicio || changes.horaFin) && entrenadorId) {
    const nuevaFecha = changes.fechaInicio || changes.fecha || reservaExistente.fechaInicio || reservaExistente.fecha;
    const nuevaHoraInicio = changes.horaInicio || reservaExistente.horaInicio || '';
    const nuevaHoraFin = changes.horaFin || reservaExistente.horaFin || '';
    
    // Validar anticipación
    const validacionAnticipacion = await validarAnticipacion(
      nuevaFecha,
      nuevaHoraInicio,
      { horasMinimas: 24 }
    );
    
    if (!validacionAnticipacion.valido) {
      throw new Error(validacionAnticipacion.mensaje || 'La nueva fecha/hora no cumple con el tiempo mínimo de anticipación');
    }
    
    // Validar disponibilidad (excluyendo la reserva actual)
    const reservasExistentes = reservas.filter(r => r.id !== id);
    const validacionSlot = await validarSlotDisponible(
      {
        fecha: nuevaFecha,
        horaInicio: nuevaHoraInicio,
        horaFin: nuevaHoraFin,
        tipo: changes.tipo || reservaExistente.tipo || 'sesion-1-1',
        entrenadorId,
      },
      { reservasExistentes }
    );
    
    if (!validacionSlot.valido) {
      throw new Error(validacionSlot.mensaje || 'El nuevo slot no está disponible');
    }
  }
  
  // Actualizar la reserva
  const reservaActualizada: Reserva = {
    ...reservaExistente,
    ...changes,
    id, // Asegurar que el ID no cambie
    updatedAt: new Date(),
  };
  
  return reservaActualizada;
};

/**
 * @deprecated Usar updateReserva en su lugar
 */
export const actualizarReserva = updateReserva;

/**
 * Cancela una reserva después de validar las políticas de cancelación
 * 
 * @param id - ID de la reserva a cancelar
 * @param motivo - Motivo de la cancelación (opcional)
 * @param entrenadorId - ID del entrenador (opcional, para validar políticas)
 * @returns La reserva cancelada
 * 
 * @throws Error si la reserva no existe, ya está cancelada o no se puede cancelar según las políticas
 * 
 * @example
 * ```typescript
 * const reservaCancelada = await cancelarReserva('reserva1', 'Motivo personal', 'entrenador1');
 * ```
 * 
 * @remarks
 * En producción, esta función se conectaría con un backend REST/GraphQL:
 * - REST: POST /api/reservas/:id/cancelar { body: { motivo } }
 * - GraphQL: mutation { cancelarReserva(id: "...", motivo: "...") { id, estado, ... } }
 * 
 * Las validaciones de negocio se centralizarían en el backend:
 * - Verificar que la reserva existe y puede ser cancelada
 * - Validar políticas de cancelación (tiempo mínimo, penalizaciones)
 * - Aplicar penalizaciones si corresponde (multas, descuento de bonos)
 * - Notificar a las partes involucradas
 * - Actualizar estadísticas y métricas
 */
export const cancelarReserva = async (
  id: string,
  motivo?: string,
  entrenadorId?: string
): Promise<Reserva> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Obtener la reserva actual
  const fechaInicio = new Date();
  fechaInicio.setMonth(fechaInicio.getMonth() - 1);
  const fechaFin = new Date();
  fechaFin.setMonth(fechaFin.getMonth() + 1);
  const reservas = await getReservas({ fechaInicio, fechaFin }, entrenadorId ? 'entrenador' : 'gimnasio');
  const reserva = reservas.find(r => r.id === id);
  
  if (!reserva) {
    throw new Error('Reserva no encontrada');
  }
  
  // Verificar que la reserva no esté ya cancelada o completada
  if (reserva.estado === 'canceladaCliente' || reserva.estado === 'canceladaCentro' || reserva.estado === 'completada') {
    throw new Error(`No se puede cancelar una reserva en estado: ${reserva.estado}`);
  }
  
  // Importar y validar políticas de cancelación
  const { validarPoliticasCancelacion } = await import('./validacionReservas');
  
  if (entrenadorId) {
    const fechaReserva = reserva.fecha || reserva.fechaInicio;
    const validacionCancelacion = await validarPoliticasCancelacion(
      reserva,
      new Date()
    );
    
    if (!validacionCancelacion.valido) {
      throw new Error(validacionCancelacion.mensaje || 'No se puede cancelar la reserva según las políticas configuradas');
    }
  }
  
  // Determinar el estado de cancelación según quién cancela
  // En producción, esto se determinaría por el contexto del usuario
  const estadoCancelacion: 'canceladaCliente' | 'canceladaCentro' = 
    motivo?.toLowerCase().includes('cliente') || motivo?.toLowerCase().includes('personal')
      ? 'canceladaCliente'
      : 'canceladaCentro';
  
  // Actualizar la reserva como cancelada
  const reservaCancelada: Reserva = {
    ...reserva,
    estado: estadoCancelacion,
    observaciones: motivo 
      ? `${reserva.observaciones || ''}\n[${new Date().toLocaleString('es-ES')}] Cancelada: ${motivo}`.trim()
      : reserva.observaciones || `[${new Date().toLocaleString('es-ES')}] Cancelada`,
    updatedAt: new Date(),
  };
  
  // Si hay un entrenadorId y la reserva pertenece a un entrenador, crear notificación de cancelación
  // Esto notifica al entrenador cuando un cliente cancela una reserva
  // Nota: Si no hay entrenadorId pero la reserva es de tipo trainer (sesion-1-1, fisio, nutricion, masaje),
  // en un sistema real deberíamos obtener el entrenadorId de la reserva o del contexto.
  // Por ahora, solo enviamos notificación si tenemos el entrenadorId explícitamente.
  if (entrenadorId && reserva.estado !== 'cancelada') {
    try {
      const { crearNotificacionCancelacionReserva } = await import('./notificacionesCancelacionReserva');
      await crearNotificacionCancelacionReserva(reservaCancelada, entrenadorId, motivo);
    } catch (error) {
      console.error('Error creando notificación de cancelación:', error);
      // No fallar la cancelación si hay error en la notificación
    }
  } else if (!entrenadorId && reserva.estado !== 'cancelada') {
    // Si no hay entrenadorId pero la reserva es de tipo trainer, loguear para debugging
    // En producción, aquí deberíamos obtener el entrenadorId de la reserva o del contexto
    const tiposTrainer = ['sesion-1-1', 'fisio', 'nutricion', 'masaje'];
    if (tiposTrainer.includes(reserva.tipo)) {
      console.log('[Reservas] Reserva de tipo trainer cancelada pero sin entrenadorId:', {
        reservaId: reserva.id,
        tipo: reserva.tipo,
        cliente: reserva.clienteNombre,
        nota: 'En producción, obtener entrenadorId de la reserva o contexto para enviar notificación',
      });
    }
  }
  
  // Simular actualización en base de datos
  console.log('[Reservas] Reserva cancelada:', {
    reservaId: id,
    cliente: reserva.clienteNombre,
    fecha: reserva.fecha.toLocaleDateString('es-ES'),
    hora: reserva.horaInicio,
    motivo,
    entrenadorId,
  });
  
  return reservaCancelada;
};

export interface ReprogramacionReserva {
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  motivo?: string;
}

export const reprogramarReserva = async (
  id: string,
  reprogramacion: ReprogramacionReserva,
  entrenadorId?: string,
  reservaAnterior?: Reserva
): Promise<Reserva> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En una implementación real, aquí se verificaría la disponibilidad
  // y se actualizaría la reserva en la base de datos
  
  // Obtener la reserva actual si no se proporciona
  let reserva: Reserva;
  if (reservaAnterior) {
    reserva = reservaAnterior;
  } else {
    // Intentar obtener de la lista de reservas (simulado)
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 1);
    const fechaFin = new Date();
    fechaFin.setMonth(fechaFin.getMonth() + 1);
    const reservas = await getReservas({ fechaInicio, fechaFin }, 'entrenador');
    const reservaEncontrada = reservas.find(r => r.id === id);
    
    if (!reservaEncontrada) {
      throw new Error('Reserva no encontrada');
    }
    reserva = reservaEncontrada;
  }
  
  // Validar tiempo mínimo de anticipación si hay entrenadorId
  if (entrenadorId) {
    const validacion = await validarTiempoMinimoAnticipacion(
      reprogramacion.fecha,
      reprogramacion.horaInicio,
      entrenadorId
    );
    
    if (!validacion.valido) {
      throw new Error(validacion.mensaje || 'La reprogramación no cumple con el tiempo mínimo de anticipación requerido');
    }
  }
  
  // Verificar disponibilidad (simulado - en producción se verificaría contra el horario)
  const disponible = await import('./disponibilidad').then(m => 
    m.verificarDisponibilidad(
      reprogramacion.fecha,
      reprogramacion.horaInicio,
      reserva.tipo,
      reserva.claseId,
      entrenadorId,
      reprogramacion.horaFin
    )
  );
  
  if (!disponible) {
    throw new Error('El horario seleccionado no está disponible');
  }
  
  // Si es videollamada y no tiene enlace, o si cambió la fecha/hora, regenerar el enlace
  let enlaceVideollamada = reserva.enlaceVideollamada;
  if (reserva.tipoSesion === 'videollamada') {
    const fechaCambio = reserva.fecha.getTime() !== reprogramacion.fecha.getTime();
    const horaCambio = reserva.horaInicio !== reprogramacion.horaInicio || reserva.horaFin !== reprogramacion.horaFin;
    
    // Si cambió la fecha u hora, o no tiene enlace, generar uno nuevo
    if ((fechaCambio || horaCambio || !enlaceVideollamada) && entrenadorId) {
      try {
        const configuracion = await getConfiguracionVideollamada(entrenadorId);
        enlaceVideollamada = await generarEnlaceVideollamada(
          reserva.id,
          reprogramacion.fecha,
          reprogramacion.horaInicio,
          reprogramacion.horaFin,
          reserva.clienteNombre,
          entrenadorId,
          configuracion.plataforma
        );
      } catch (error) {
        console.error('Error regenerando enlace de videollamada:', error);
        // Mantener el enlace anterior si hay error
      }
    }
  }
  
  // Actualizar la reserva usando updateReserva (requisito explícito)
  const fechaInicioCompleta = new Date(reprogramacion.fecha);
  const [horaInicio, minutoInicio] = reprogramacion.horaInicio.split(':').map(Number);
  fechaInicioCompleta.setHours(horaInicio, minutoInicio, 0, 0);
  
  const [horaFin, minutoFin] = reprogramacion.horaFin.split(':').map(Number);
  const fechaFinCompleta = new Date(fechaInicioCompleta);
  fechaFinCompleta.setHours(horaFin, minutoFin, 0, 0);
  
  const reservaActualizada = await updateReserva(
    reserva.id,
    {
      fecha: reprogramacion.fecha,
      fechaInicio: fechaInicioCompleta,
      fechaFin: fechaFinCompleta,
      horaInicio: reprogramacion.horaInicio,
      horaFin: reprogramacion.horaFin,
      enlaceVideollamada,
      observaciones: reprogramacion.motivo 
        ? `${reserva.observaciones || ''}\n[${new Date().toLocaleString('es-ES')}] Reprogramada: ${reprogramacion.motivo}`.trim()
        : reserva.observaciones,
    },
    entrenadorId
  );
  
  return reservaActualizada;
};

export const getClases = async (fechaInicio: Date, fechaFin: Date): Promise<Clase[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const hoy = new Date();
  const addDays = (days: number) => new Date(hoy.getTime() + days * 86400000);
  
  return [
    {
      id: 'clase1',
      nombre: 'Spinning',
      tipo: 'spinning',
      fecha: hoy,
      horaInicio: '10:00',
      horaFin: '11:00',
      capacidad: 20,
      ocupacion: 18,
      entrenadorId: 'entrenador1',
      entrenadorNombre: 'Elena Sánchez',
      salaId: 'sala1',
      salaNombre: 'Sala A',
      precio: 15,
      disponible: true,
    },
    {
      id: 'clase2',
      nombre: 'Boxeo',
      tipo: 'boxeo',
      fecha: hoy,
      horaInicio: '12:00',
      horaFin: '13:00',
      capacidad: 15,
      ocupacion: 12,
      entrenadorId: 'entrenador2',
      entrenadorNombre: 'Carlos López',
      salaId: 'sala2',
      salaNombre: 'Sala B',
      precio: 20,
      disponible: true,
    },
    {
      id: 'clase3',
      nombre: 'Spinning',
      tipo: 'spinning',
      fecha: addDays(1),
      horaInicio: '08:00',
      horaFin: '09:00',
      capacidad: 30,
      ocupacion: 28,
      entrenadorId: 'entrenador1',
      entrenadorNombre: 'Elena Sánchez',
      salaId: 'sala1',
      salaNombre: 'Sala A',
      precio: 15,
      disponible: true,
    },
    {
      id: 'clase4',
      nombre: 'Pilates',
      tipo: 'hiit',
      fecha: addDays(1),
      horaInicio: '18:30',
      horaFin: '19:30',
      capacidad: 15,
      ocupacion: 12,
      entrenadorId: 'entrenador3',
      entrenadorNombre: 'Roberto Martín',
      salaId: 'sala3',
      salaNombre: 'Sala C',
      precio: 18,
      disponible: true,
    },
    {
      id: 'clase5',
      nombre: 'HIIT',
      tipo: 'hiit',
      fecha: addDays(2),
      horaInicio: '19:00',
      horaFin: '20:00',
      capacidad: 20,
      ocupacion: 18,
      entrenadorId: 'entrenador2',
      entrenadorNombre: 'Carlos López',
      salaId: 'sala2',
      salaNombre: 'Sala B',
      precio: 20,
      disponible: true,
    },
    {
      id: 'clase6',
      nombre: 'Stretching',
      tipo: 'hiit',
      fecha: addDays(3),
      horaInicio: '09:00',
      horaFin: '10:00',
      capacidad: 18,
      ocupacion: 14,
      entrenadorId: 'entrenador4',
      entrenadorNombre: 'Laura Torres',
      salaId: 'sala3',
      salaNombre: 'Sala C',
      precio: 15,
      disponible: false,
    },
    {
      id: 'clase7',
      nombre: 'Fisioterapia',
      tipo: 'fisio',
      fecha: addDays(3),
      horaInicio: '11:00',
      horaFin: '12:00',
      capacidad: 1,
      ocupacion: 1,
      entrenadorId: 'entrenador5',
      entrenadorNombre: 'María González',
      salaId: 'sala4',
      salaNombre: 'Sala Fisioterapia',
      precio: 40,
      disponible: false,
    },
    {
      id: 'clase8',
      nombre: 'Consulta Nutricional',
      tipo: 'nutricion',
      fecha: addDays(4),
      horaInicio: '14:00',
      horaFin: '15:00',
      capacidad: 1,
      ocupacion: 1,
      entrenadorId: 'entrenador6',
      entrenadorNombre: 'Javier Ramos',
      salaId: 'sala5',
      salaNombre: 'Sala Nutrición',
      precio: 50,
      disponible: false,
    },
  ];
};

/**
 * Marca una reserva como pagada manualmente
 * Usado cuando el entrenador recibe pago en efectivo o transferencia
 */
export const marcarReservaComoPagada = async (
  reservaId: string,
  metodoPago: 'efectivo' | 'transferencia',
  entrenadorId?: string
): Promise<Reserva> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Obtener la reserva actual
  const fechaInicio = new Date();
  fechaInicio.setMonth(fechaInicio.getMonth() - 1);
  const fechaFin = new Date();
  fechaFin.setMonth(fechaFin.getMonth() + 1);
  const reservas = await getReservas({ fechaInicio, fechaFin }, 'entrenador');
  const reserva = reservas.find(r => r.id === reservaId);
  
  if (!reserva) {
    throw new Error('Reserva no encontrada');
  }
  
  // Actualizar la reserva como pagada
  const reservaActualizada: Reserva = {
    ...reserva,
    pagado: true,
    updatedAt: new Date(),
    observaciones: reserva.observaciones 
      ? `${reserva.observaciones}\n[${new Date().toLocaleString('es-ES')}] Marcado como pagado manualmente (${metodoPago})`.trim()
      : `[${new Date().toLocaleString('es-ES')}] Marcado como pagado manualmente (${metodoPago})`,
  };
  
  // Simular actualización en base de datos
  console.log('[Reservas] Marcando reserva como pagada:', {
    reservaId,
    metodoPago,
    entrenadorId,
    cliente: reserva.clienteNombre,
    precio: reserva.precio,
  });
  
  return reservaActualizada;
};

/**
 * Marca una reserva como no-show (cliente no se presentó)
 * Usado por entrenadores para llevar control de asistencia
 */
export const marcarReservaComoNoShow = async (
  reservaId: string,
  entrenadorId?: string,
  aplicarPenalizacion?: boolean
): Promise<Reserva> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Obtener la reserva actual
  const fechaInicio = new Date();
  fechaInicio.setMonth(fechaInicio.getMonth() - 1);
  const fechaFin = new Date();
  fechaFin.setMonth(fechaFin.getMonth() + 1);
  const reservas = await getReservas({ fechaInicio, fechaFin }, 'entrenador');
  const reserva = reservas.find(r => r.id === reservaId);
  
  if (!reserva) {
    throw new Error('Reserva no encontrada');
  }
  
  // Verificar que la reserva esté en un estado válido para marcar como no-show
  if (reserva.estado === 'cancelada' || reserva.estado === 'completada') {
    throw new Error('No se puede marcar como no-show una reserva cancelada o completada');
  }
  
  // Actualizar la reserva como no-show
  const reservaActualizada: Reserva = {
    ...reserva,
    estado: 'no-show',
    updatedAt: new Date(),
    observaciones: reserva.observaciones 
      ? `${reserva.observaciones}\n[${new Date().toLocaleString('es-ES')}] Marcado como no-show${aplicarPenalizacion ? ' (penalización aplicada)' : ''}`.trim()
      : `[${new Date().toLocaleString('es-ES')}] Marcado como no-show${aplicarPenalizacion ? ' (penalización aplicada)' : ''}`,
  };
  
  // Simular actualización en base de datos
  console.log('[Reservas] Marcando reserva como no-show:', {
    reservaId,
    entrenadorId,
    cliente: reserva.clienteNombre,
    aplicarPenalizacion,
    fecha: reserva.fecha,
    hora: reserva.horaInicio,
  });
  
  // En producción, aquí se aplicaría la penalización si corresponde:
  // - Aplicar política de penalización (multa, pérdida de bono, etc.)
  // - Notificar al cliente sobre la penalización
  // - Registrar en el historial del cliente
  
  return reservaActualizada;
};

/**
 * Obtiene las reservas con pagos pendientes
 */
export const getReservasConPagosPendientes = async (
  fechaInicio?: Date,
  fechaFin?: Date,
  entrenadorId?: string
): Promise<Reserva[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const inicio = fechaInicio || new Date();
  const fin = fechaFin || new Date();
  fin.setMonth(fin.getMonth() + 1);
  
  const reservas = await getReservas({ fechaInicio: inicio, fechaFin: fin, entrenadorId }, 'entrenador');
  
  // Filtrar solo reservas con pagos pendientes y que no estén canceladas
  return reservas.filter(
    r => !r.pagado && r.estado !== 'cancelada' && r.estado !== 'no-show'
  );
};

/**
 * Marca una reserva como completada manualmente
 * Usado cuando el entrenador completa una sesión con un cliente
 */
export const marcarReservaComoCompletada = async (
  reservaId: string,
  entrenadorId?: string,
  notasCompletacion?: string
): Promise<Reserva> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Obtener la reserva actual
  const fechaInicio = new Date();
  fechaInicio.setMonth(fechaInicio.getMonth() - 1);
  const fechaFin = new Date();
  fechaFin.setMonth(fechaFin.getMonth() + 1);
  const reservas = await getReservas({ fechaInicio, fechaFin }, 'entrenador');
  const reserva = reservas.find(r => r.id === reservaId);
  
  if (!reserva) {
    throw new Error('Reserva no encontrada');
  }
  
  // Verificar que la reserva esté en un estado válido para marcar como completada
  if (reserva.estado === 'cancelada' || reserva.estado === 'no-show') {
    throw new Error('No se puede marcar como completada una reserva cancelada o no-show');
  }
  
  // Actualizar la reserva como completada
  const reservaActualizada: Reserva = {
    ...reserva,
    estado: 'completada',
    updatedAt: new Date(),
    observaciones: reserva.observaciones 
      ? `${reserva.observaciones}\n[${new Date().toLocaleString('es-ES')}] Sesión completada${notasCompletacion ? `: ${notasCompletacion}` : ''}`.trim()
      : notasCompletacion 
        ? `[${new Date().toLocaleString('es-ES')}] Sesión completada: ${notasCompletacion}`
        : `[${new Date().toLocaleString('es-ES')}] Sesión completada`,
  };
  
  // Simular actualización en base de datos
  console.log('[Reservas] Marcando reserva como completada:', {
    reservaId,
    entrenadorId,
    cliente: reserva.clienteNombre,
    fecha: reserva.fecha,
    hora: reserva.horaInicio,
    notasCompletacion,
  });
  
  return reservaActualizada;
};

/**
 * Verifica si una reserva debe marcarse automáticamente como completada
 * Una reserva se marca automáticamente como completada si:
 * - Está en estado 'confirmada' o 'pendiente'
 * - La fecha y hora de la reserva ya pasaron
 * - Han pasado al menos 30 minutos desde que terminó la sesión
 */
export const verificarYMarcarCompletadasAutomaticamente = async (
  reservas: Reserva[],
  entrenadorId?: string
): Promise<Reserva[]> => {
  const ahora = new Date();
  const reservasActualizadas: Reserva[] = [];
  
  for (const reserva of reservas) {
    // Solo procesar reservas confirmadas o pendientes que no estén completadas
    if (reserva.estado !== 'confirmada' && reserva.estado !== 'pendiente') {
      reservasActualizadas.push(reserva);
      continue;
    }
    
    // Combinar fecha y hora de fin de la reserva
    const fechaHoraFin = new Date(reserva.fecha);
    const [horaFin, minutoFin] = reserva.horaFin.split(':').map(Number);
    fechaHoraFin.setHours(horaFin, minutoFin, 0, 0);
    
    // Verificar si la sesión ya terminó y han pasado al menos 30 minutos
    const minutosDesdeFin = (ahora.getTime() - fechaHoraFin.getTime()) / (1000 * 60);
    const debeMarcarComoCompletada = minutosDesdeFin >= 30;
    
    if (debeMarcarComoCompletada) {
      try {
        const reservaCompletada = await marcarReservaComoCompletada(
          reserva.id,
          entrenadorId,
          'Marcado automáticamente después de finalizar la sesión'
        );
        reservasActualizadas.push(reservaCompletada);
      } catch (error) {
        console.error('Error marcando reserva como completada automáticamente:', error);
        reservasActualizadas.push(reserva);
      }
    } else {
      reservasActualizadas.push(reserva);
    }
  }
  
  return reservasActualizadas;
};

/**
 * Obtiene las reservas de las próximas 24 horas para un entrenador
 * Incluye solo reservas confirmadas o pendientes
 */
export const getReservasProximas24Horas = async (
  entrenadorId?: string
): Promise<Reserva[]> => {
  const ahora = new Date();
  const en24Horas = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
  
  // Obtener todas las reservas en el rango
  const reservas = await getReservas({ fechaInicio: ahora, fechaFin: en24Horas }, 'entrenador');
  
  // Filtrar solo reservas confirmadas o pendientes que estén en las próximas 24 horas
  const reservasFiltradas = reservas.filter(reserva => {
    // Solo reservas confirmadas o pendientes
    if (reserva.estado !== 'confirmada' && reserva.estado !== 'pendiente') {
      return false;
    }
    
    // Combinar fecha y hora de inicio de la reserva
    const fechaHoraInicio = new Date(reserva.fecha);
    const [horaInicio, minutoInicio] = reserva.horaInicio.split(':').map(Number);
    fechaHoraInicio.setHours(horaInicio, minutoInicio, 0, 0);
    
    // Verificar que la reserva esté en las próximas 24 horas
    const tiempoReserva = fechaHoraInicio.getTime();
    const tiempoAhora = ahora.getTime();
    const tiempoEn24Horas = en24Horas.getTime();
    
    return tiempoReserva >= tiempoAhora && tiempoReserva <= tiempoEn24Horas;
  });
  
  // Ordenar por fecha y hora de inicio
  reservasFiltradas.sort((a, b) => {
    const fechaHoraA = new Date(a.fecha);
    const [horaA, minutoA] = a.horaInicio.split(':').map(Number);
    fechaHoraA.setHours(horaA, minutoA, 0, 0);
    
    const fechaHoraB = new Date(b.fecha);
    const [horaB, minutoB] = b.horaInicio.split(':').map(Number);
    fechaHoraB.setHours(horaB, minutoB, 0, 0);
    
    return fechaHoraA.getTime() - fechaHoraB.getTime();
  });
  
  return reservasFiltradas;
};
