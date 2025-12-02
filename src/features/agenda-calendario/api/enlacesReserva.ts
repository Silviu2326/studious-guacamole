import { EnlaceReservaPublica, ReservaPublica, TipoCita, Cita } from '../types';

// Mock API - En producción, esto haría llamadas reales a la API
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1/agenda';

/**
 * Obtiene todos los enlaces de reserva pública del entrenador
 */
export const getEnlacesReserva = async (entrenadorId: string): Promise<EnlaceReservaPublica[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock data - en producción, esto vendría de la API
      const enlaces: EnlaceReservaPublica[] = [
        // Ejemplo:
        // {
        //   id: '1',
        //   entrenadorId,
        //   slug: 'entrenador-juan',
        //   nombrePersonalizado: 'Juan Pérez - Entrenador Personal',
        //   activo: true,
        //   tiposSesionDisponibles: ['sesion-1-1', 'videollamada', 'evaluacion'],
        //   mensajeBienvenida: '¡Reserva tu sesión conmigo!',
        //   requiereConfirmacion: false,
        //   mostrarHorariosDisponibles: true,
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
      ];
      resolve(enlaces);
    }, 300);
  });
};

/**
 * Obtiene un enlace de reserva por su slug
 */
export const getEnlaceReservaPorSlug = async (slug: string): Promise<EnlaceReservaPublica | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock data - en producción, esto vendría de la API
      // Por ahora, retornamos null si no existe
      resolve(null);
    }, 300);
  });
};

/**
 * Crea un nuevo enlace de reserva pública
 */
export const crearEnlaceReserva = async (enlace: Omit<EnlaceReservaPublica, 'id' | 'createdAt' | 'updatedAt'>): Promise<EnlaceReservaPublica> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const nuevoEnlace: EnlaceReservaPublica = {
        ...enlace,
        id: `enlace-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      resolve(nuevoEnlace);
    }, 300);
  });
};

/**
 * Actualiza un enlace de reserva pública
 */
export const actualizarEnlaceReserva = async (id: string, enlace: Partial<EnlaceReservaPublica>): Promise<EnlaceReservaPublica> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const enlaceActualizado: EnlaceReservaPublica = {
        id,
        entrenadorId: enlace.entrenadorId || '',
        slug: enlace.slug || '',
        nombrePersonalizado: enlace.nombrePersonalizado,
        activo: enlace.activo ?? true,
        tiposSesionDisponibles: enlace.tiposSesionDisponibles || [],
        mensajeBienvenida: enlace.mensajeBienvenida,
        requiereConfirmacion: enlace.requiereConfirmacion ?? false,
        mostrarHorariosDisponibles: enlace.mostrarHorariosDisponibles ?? true,
        createdAt: enlace.createdAt || new Date(),
        updatedAt: new Date(),
      };
      resolve(enlaceActualizado);
    }, 300);
  });
};

/**
 * Elimina un enlace de reserva pública
 */
export const eliminarEnlaceReserva = async (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  });
};

/**
 * Obtiene las reservas públicas realizadas a través de un enlace
 */
export const getReservasPublicas = async (enlaceId?: string, entrenadorId?: string): Promise<ReservaPublica[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock data
      const reservas: ReservaPublica[] = [];
      resolve(reservas);
    }, 300);
  });
};

/**
 * Crea una nueva reserva pública desde el enlace
 */
export const crearReservaPublica = async (reserva: Omit<ReservaPublica, 'id' | 'createdAt' | 'updatedAt' | 'estado' | 'citaId'>): Promise<ReservaPublica> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const nuevaReserva: ReservaPublica = {
        ...reserva,
        id: `reserva-${Date.now()}`,
        estado: reserva.confirmadoAutomaticamente ? 'confirmada' : 'pendiente',
        fechaConfirmacion: reserva.confirmadoAutomaticamente ? new Date() : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      resolve(nuevaReserva);
    }, 500);
  });
};

/**
 * Obtiene los horarios disponibles para un entrenador en un rango de fechas
 */
export const getHorariosDisponibles = async (
  entrenadorId: string,
  fechaInicio: Date,
  fechaFin: Date,
  tiposSesion: TipoCita[]
): Promise<Array<{ fecha: Date; hora: number; minuto: number; disponible: boolean }>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock data - en producción, esto consultaría la agenda del entrenador
      // y los horarios de trabajo para determinar disponibilidad
      const horarios: Array<{ fecha: Date; hora: number; minuto: number; disponible: boolean }> = [];
      
      // Generar slots de 30 minutos entre 9:00 y 20:00
      const fechaActual = new Date(fechaInicio);
      while (fechaActual <= fechaFin) {
        for (let hora = 9; hora < 20; hora++) {
          horarios.push({
            fecha: new Date(fechaActual),
            hora,
            minuto: 0,
            disponible: true,
          });
          horarios.push({
            fecha: new Date(fechaActual),
            hora,
            minuto: 30,
            disponible: true,
          });
        }
        fechaActual.setDate(fechaActual.getDate() + 1);
      }
      
      resolve(horarios);
    }, 300);
  });
};

/**
 * Confirma una reserva pública y crea la cita correspondiente
 */
export const confirmarReservaPublica = async (reservaId: string): Promise<{ reserva: ReservaPublica; cita: Cita }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock data
      const reserva: ReservaPublica = {
        id: reservaId,
        enlaceId: 'enlace-1',
        entrenadorId: 'entrenador-1',
        nombreCliente: 'Cliente Ejemplo',
        emailCliente: 'cliente@ejemplo.com',
        tipoSesion: 'sesion-1-1',
        fechaInicio: new Date(),
        fechaFin: new Date(),
        estado: 'confirmada',
        confirmadoAutomaticamente: false,
        fechaConfirmacion: new Date(),
        citaId: 'cita-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const cita: Cita = {
        id: 'cita-1',
        titulo: `Sesión con ${reserva.nombreCliente}`,
        tipo: reserva.tipoSesion,
        estado: 'confirmada',
        fechaInicio: reserva.fechaInicio,
        fechaFin: reserva.fechaFin,
        clienteNombre: reserva.nombreCliente,
        notas: reserva.notas,
      };
      
      resolve({ reserva, cita });
    }, 500);
  });
};

/**
 * Cancela una reserva pública
 */
export const cancelarReservaPublica = async (reservaId: string, motivo?: string): Promise<ReservaPublica> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reserva: ReservaPublica = {
        id: reservaId,
        enlaceId: 'enlace-1',
        entrenadorId: 'entrenador-1',
        nombreCliente: 'Cliente Ejemplo',
        emailCliente: 'cliente@ejemplo.com',
        tipoSesion: 'sesion-1-1',
        fechaInicio: new Date(),
        fechaFin: new Date(),
        estado: 'cancelada',
        confirmadoAutomaticamente: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      resolve(reserva);
    }, 300);
  });
};

/**
 * Genera un slug único para un enlace de reserva
 */
export const generarSlug = async (nombre: string, entrenadorId: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Convertir nombre a slug (ej: "Juan Pérez" -> "juan-perez")
      const slug = nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // En producción, verificaría que el slug sea único
      resolve(slug);
    }, 100);
  });
};

/**
 * Verifica si un slug está disponible
 */
export const verificarSlugDisponible = async (slug: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock - en producción, consultaría la base de datos
      resolve(true);
    }, 200);
  });
};


