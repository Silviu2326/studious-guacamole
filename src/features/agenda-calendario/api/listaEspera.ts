import {
  EntradaListaEspera,
  EstadoListaEspera,
  HorarioPopular,
  NotificacionSlotLiberado,
  ConfiguracionListaEspera,
  ResumenListaEspera,
  Cita,
} from '../types';
import { getCitas, crearCita } from './calendario';

// Mock data para lista de espera
let mockListaEspera: EntradaListaEspera[] = [
  {
    id: 'le1',
    entrenadorId: 'entrenador1',
    clienteId: '1',
    clienteNombre: 'Juan Pérez',
    clienteEmail: 'juan@example.com',
    clienteTelefono: '+1234567890',
    diaSemana: 1, // Lunes
    horaInicio: '10:00',
    horaFin: '11:00',
    fechaSolicitud: new Date(),
    estado: 'activa',
    prioridad: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'le2',
    entrenadorId: 'entrenador1',
    clienteId: '2',
    clienteNombre: 'María García',
    clienteEmail: 'maria@example.com',
    clienteTelefono: '+1234567891',
    diaSemana: 1, // Lunes
    horaInicio: '10:00',
    horaFin: '11:00',
    fechaSolicitud: new Date(Date.now() - 86400000),
    estado: 'activa',
    prioridad: 2,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'le3',
    entrenadorId: 'entrenador1',
    clienteId: '3',
    clienteNombre: 'Carlos Ruiz',
    clienteEmail: 'carlos@example.com',
    clienteTelefono: '+1234567892',
    diaSemana: 3, // Miércoles
    horaInicio: '16:00',
    horaFin: '17:00',
    fechaSolicitud: new Date(Date.now() - 86400000 * 2),
    estado: 'activa',
    prioridad: 1,
    createdAt: new Date(Date.now() - 86400000 * 2),
    updatedAt: new Date(Date.now() - 86400000 * 2),
  },
];

// Mock data para notificaciones
let mockNotificaciones: NotificacionSlotLiberado[] = [];

// Mock data para configuración
let mockConfiguracion: ConfiguracionListaEspera = {
  id: 'config1',
  entrenadorId: 'entrenador1',
  activo: true,
  tiempoRespuestaHoras: 24,
  notificacionAutomatica: true,
  metodoNotificacion: 'email',
  maxEntradasPorCliente: 5,
  diasValidez: 30,
  createdAt: new Date(),
  updatedAt: new Date(),
};

/**
 * Obtiene todas las entradas de la lista de espera
 */
export const getListaEspera = async (
  entrenadorId: string,
  estado?: EstadoListaEspera
): Promise<EntradaListaEspera[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let lista = mockListaEspera.filter(le => le.entrenadorId === entrenadorId);
      
      if (estado) {
        lista = lista.filter(le => le.estado === estado);
      }
      
      // Ordenar por prioridad (menor número = mayor prioridad) y fecha de solicitud
      lista.sort((a, b) => {
        if (a.prioridad !== b.prioridad) {
          return a.prioridad - b.prioridad;
        }
        return a.fechaSolicitud.getTime() - b.fechaSolicitud.getTime();
      });
      
      resolve(lista);
    }, 300);
  });
};

/**
 * Agrega un cliente a la lista de espera
 */
export const agregarClienteListaEspera = async (
  entrada: Omit<EntradaListaEspera, 'id' | 'fechaSolicitud' | 'estado' | 'prioridad' | 'createdAt' | 'updatedAt'>
): Promise<EntradaListaEspera> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Verificar si el cliente ya está en la lista de espera para ese horario
      const existe = mockListaEspera.find(le => 
        le.entrenadorId === entrada.entrenadorId &&
        le.clienteId === entrada.clienteId &&
        le.diaSemana === entrada.diaSemana &&
        le.horaInicio === entrada.horaInicio &&
        le.estado === 'activa'
      );
      
      if (existe) {
        reject(new Error('El cliente ya está en la lista de espera para este horario'));
        return;
      }
      
      // Obtener configuración
      const config = await getConfiguracionListaEspera(entrada.entrenadorId);
      
      // Verificar número máximo de entradas por cliente
      const entradasCliente = mockListaEspera.filter(le => 
        le.clienteId === entrada.clienteId && 
        le.entrenadorId === entrada.entrenadorId &&
        le.estado === 'activa'
      ).length;
      
      if (entradasCliente >= config.maxEntradasPorCliente) {
        reject(new Error(`El cliente ya tiene el máximo de ${config.maxEntradasPorCliente} entradas en la lista de espera`));
        return;
      }
      
      // Calcular prioridad (número de entradas activas + 1)
      const entradasActivas = mockListaEspera.filter(le => 
        le.entrenadorId === entrada.entrenadorId && le.estado === 'activa'
      ).length;
      
      // Calcular fecha de expiración
      const fechaExpiracion = new Date();
      fechaExpiracion.setDate(fechaExpiracion.getDate() + config.diasValidez);
      
      const nuevaEntrada: EntradaListaEspera = {
        ...entrada,
        id: `le${Date.now()}`,
        fechaSolicitud: new Date(),
        estado: 'activa',
        prioridad: entradasActivas + 1,
        fechaExpiracion,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      mockListaEspera.push(nuevaEntrada);
      
      setTimeout(() => {
        resolve(nuevaEntrada);
      }, 300);
    } catch (error) {
      console.error('Error agregando cliente a lista de espera:', error);
      setTimeout(() => {
        reject(error);
      }, 300);
    }
  });
};

/**
 * Elimina un cliente de la lista de espera
 */
export const eliminarClienteListaEspera = async (
  entradaId: string,
  entrenadorId: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockListaEspera.findIndex(le => 
        le.id === entradaId && le.entrenadorId === entrenadorId
      );
      
      if (index === -1) {
        reject(new Error('Entrada no encontrada'));
        return;
      }
      
      mockListaEspera[index].estado = 'cancelada';
      mockListaEspera[index].updatedAt = new Date();
      
      // Reorganizar prioridades
      reorganizarPrioridades(entrenadorId);
      
      resolve();
    }, 300);
  });
};

/**
 * Reorganiza las prioridades de la lista de espera
 */
const reorganizarPrioridades = (entrenadorId: string): void => {
  const entradasActivas = mockListaEspera
    .filter(le => le.entrenadorId === entrenadorId && le.estado === 'activa')
    .sort((a, b) => {
      // Ordenar por fecha de solicitud (más antiguas primero)
      return a.fechaSolicitud.getTime() - b.fechaSolicitud.getTime();
    });
  
  entradasActivas.forEach((entrada, index) => {
    entrada.prioridad = index + 1;
    entrada.updatedAt = new Date();
  });
};

/**
 * Obtiene los horarios populares
 */
export const getHorariosPopulares = async (
  entrenadorId: string
): Promise<HorarioPopular[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const entradasActivas = mockListaEspera.filter(le => 
        le.entrenadorId === entrenadorId && le.estado === 'activa'
      );
      
      // Agrupar por horario
      const horariosMap = new Map<string, EntradaListaEspera[]>();
      
      entradasActivas.forEach(entrada => {
        const key = `${entrada.diaSemana}-${entrada.horaInicio}-${entrada.horaFin}`;
        const horario = horariosMap.get(key) || [];
        horario.push(entrada);
        horariosMap.set(key, horario);
      });
      
      // Convertir a HorarioPopular
      const horariosPopulares: HorarioPopular[] = [];
      
      horariosMap.forEach((entradas, key) => {
        const primera = entradas[0];
        const asignadas = mockListaEspera.filter(le => 
          le.entrenadorId === entrenadorId &&
          le.diaSemana === primera.diaSemana &&
          le.horaInicio === primera.horaInicio &&
          le.horaFin === primera.horaFin &&
          le.estado === 'asignada'
        );
        
        horariosPopulares.push({
          diaSemana: primera.diaSemana,
          horaInicio: primera.horaInicio,
          horaFin: primera.horaFin,
          numeroSolicitudes: entradas.length,
          ultimaAsignacion: asignadas.length > 0
            ? asignadas.sort((a, b) => 
                (b.fechaAsignacion || b.createdAt).getTime() - 
                (a.fechaAsignacion || a.createdAt).getTime()
              )[0].fechaAsignacion
            : undefined,
          frecuenciaAsignacion: asignadas.length,
        });
      });
      
      // Ordenar por número de solicitudes (mayor a menor)
      horariosPopulares.sort((a, b) => b.numeroSolicitudes - a.numeroSolicitudes);
      
      resolve(horariosPopulares);
    }, 300);
  });
};

/**
 * Notifica a los clientes cuando se libera un slot
 */
export const notificarSlotLiberado = async (
  citaCancelada: Cita,
  entrenadorId: string
): Promise<NotificacionSlotLiberado[]> => {
  return new Promise(async (resolve) => {
    try {
      // Obtener configuración
      const config = await getConfiguracionListaEspera(entrenadorId);
      
      if (!config.activo || !config.notificacionAutomatica) {
        resolve([]);
        return;
      }
      
      // Obtener fecha y hora de la cita cancelada
      const fechaSlot = new Date(citaCancelada.fechaInicio);
      const diaSemana = fechaSlot.getDay();
      const horaInicio = fechaSlot.getHours().toString().padStart(2, '0') + ':' + 
                        fechaSlot.getMinutes().toString().padStart(2, '0');
      const fechaFin = new Date(citaCancelada.fechaFin);
      const horaFin = fechaFin.getHours().toString().padStart(2, '0') + ':' + 
                     fechaFin.getMinutes().toString().padStart(2, '0');
      
      // Buscar clientes en lista de espera para ese horario
      const entradasRelevantes = mockListaEspera.filter(le =>
        le.entrenadorId === entrenadorId &&
        le.estado === 'activa' &&
        le.diaSemana === diaSemana &&
        le.horaInicio === horaInicio &&
        le.horaFin === horaFin
      );
      
      if (entradasRelevantes.length === 0) {
        resolve([]);
        return;
      }
      
      // Notificar al primero en la lista (mayor prioridad)
      const primeraEntrada = entradasRelevantes.sort((a, b) => a.prioridad - b.prioridad)[0];
      
      // Crear notificación
      const fechaExpiracion = new Date();
      fechaExpiracion.setHours(fechaExpiracion.getHours() + config.tiempoRespuestaHoras);
      
      const notificacion: NotificacionSlotLiberado = {
        id: `notif${Date.now()}`,
        entradaListaEsperaId: primeraEntrada.id,
        clienteId: primeraEntrada.clienteId,
        clienteNombre: primeraEntrada.clienteNombre,
        fechaSlot,
        horaInicio,
        horaFin,
        enviada: true,
        fechaEnvio: new Date(),
        leida: false,
        metodoNotificacion: config.metodoNotificacion,
        fechaExpiracion,
        confirmada: false,
        createdAt: new Date(),
      };
      
      mockNotificaciones.push(notificacion);
      
      // Actualizar estado de la entrada
      primeraEntrada.estado = 'notificada';
      primeraEntrada.fechaNotificacion = new Date();
      primeraEntrada.updatedAt = new Date();
      
      // En producción, aquí se enviaría la notificación real (email, SMS, etc.)
      
      setTimeout(() => {
        resolve([notificacion]);
      }, 300);
    } catch (error) {
      console.error('Error notificando slot liberado:', error);
      setTimeout(() => {
        resolve([]);
      }, 300);
    }
  });
};

/**
 * Asigna un slot a un cliente de la lista de espera
 */
export const asignarSlotListaEspera = async (
  entradaId: string,
  fechaSlot: Date,
  entrenadorId: string
): Promise<Cita> => {
  return new Promise(async (resolve, reject) => {
    try {
      const entrada = mockListaEspera.find(le => 
        le.id === entradaId && le.entrenadorId === entrenadorId
      );
      
      if (!entrada) {
        reject(new Error('Entrada no encontrada'));
        return;
      }
      
      if (entrada.estado !== 'notificada' && entrada.estado !== 'activa') {
        reject(new Error('La entrada no está disponible para asignación'));
        return;
      }
      
      // Crear la cita
      const fechaInicio = new Date(fechaSlot);
      const [hora, minuto] = entrada.horaInicio.split(':').map(Number);
      fechaInicio.setHours(hora, minuto, 0, 0);
      
      const fechaFin = new Date(fechaSlot);
      const [horaFin, minutoFin] = entrada.horaFin.split(':').map(Number);
      fechaFin.setHours(horaFin, minutoFin, 0, 0);
      
      const nuevaCita = await crearCita({
        titulo: `Sesión con ${entrada.clienteNombre}`,
        tipo: 'sesion-1-1',
        estado: 'confirmada',
        fechaInicio,
        fechaFin,
        clienteId: entrada.clienteId,
        clienteNombre: entrada.clienteNombre,
        notas: `Asignada desde lista de espera`,
      });
      
      // Actualizar entrada
      entrada.estado = 'asignada';
      entrada.fechaAsignacion = new Date();
      entrada.citaId = nuevaCita.id;
      entrada.updatedAt = new Date();
      
      // Reorganizar prioridades
      reorganizarPrioridades(entrenadorId);
      
      setTimeout(() => {
        resolve(nuevaCita);
      }, 300);
    } catch (error) {
      console.error('Error asignando slot de lista de espera:', error);
      setTimeout(() => {
        reject(error);
      }, 300);
    }
  });
};

/**
 * Obtiene el resumen de la lista de espera
 */
export const getResumenListaEspera = async (
  entrenadorId: string
): Promise<ResumenListaEspera> => {
  return new Promise(async (resolve) => {
    try {
      const entradas = await getListaEspera(entrenadorId);
      const horariosPopulares = await getHorariosPopulares(entrenadorId);
      
      const resumen: ResumenListaEspera = {
        totalEntradas: entradas.length,
        entradasActivas: entradas.filter(e => e.estado === 'activa').length,
        entradasNotificadas: entradas.filter(e => e.estado === 'notificada').length,
        entradasAsignadas: entradas.filter(e => e.estado === 'asignada').length,
        horariosPopulares: horariosPopulares.slice(0, 5), // Top 5
        proximasNotificaciones: entradas.filter(e => 
          e.estado === 'activa' && e.prioridad <= 3
        ).length,
      };
      
      setTimeout(() => {
        resolve(resumen);
      }, 300);
    } catch (error) {
      console.error('Error obteniendo resumen de lista de espera:', error);
      setTimeout(() => {
        resolve({
          totalEntradas: 0,
          entradasActivas: 0,
          entradasNotificadas: 0,
          entradasAsignadas: 0,
          horariosPopulares: [],
          proximasNotificaciones: 0,
        });
      }, 300);
    }
  });
};

/**
 * Obtiene la configuración de lista de espera
 */
export const getConfiguracionListaEspera = async (
  entrenadorId: string
): Promise<ConfiguracionListaEspera> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockConfiguracion);
    }, 300);
  });
};

/**
 * Actualiza la configuración de lista de espera
 */
export const actualizarConfiguracionListaEspera = async (
  config: Partial<ConfiguracionListaEspera>,
  entrenadorId: string
): Promise<ConfiguracionListaEspera> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockConfiguracion = {
        ...mockConfiguracion,
        ...config,
        updatedAt: new Date(),
      };
      resolve(mockConfiguracion);
    }, 300);
  });
};

/**
 * Obtiene las notificaciones de slots liberados
 */
export const getNotificacionesSlotsLiberados = async (
  entrenadorId: string
): Promise<NotificacionSlotLiberado[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Obtener notificaciones relacionadas con entradas del entrenador
      const entradasIds = mockListaEspera
        .filter(le => le.entrenadorId === entrenadorId)
        .map(le => le.id);
      
      const notificaciones = mockNotificaciones.filter(notif =>
        entradasIds.includes(notif.entradaListaEsperaId)
      );
      
      // Ordenar por fecha de creación (más recientes primero)
      notificaciones.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      resolve(notificaciones);
    }, 300);
  });
};


