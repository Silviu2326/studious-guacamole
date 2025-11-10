import {
  EstadisticasNoShowsCliente,
  EstadisticasNoShowsClienteExtendida,
  ConfiguracionPoliticaCancelacion,
  AlertaNoShow,
  EstadoCita,
  TendenciaNoShows,
  SugerenciaConversacion,
  ExcepcionPoliticaCancelacion,
  RegistroCancelacionTardia,
  EstadisticasCumplimientoPolitica,
  Cita,
  MotivoCancelacion,
} from '../types';
import { getCitas } from './calendario';

// Mock data storage (en producción sería una base de datos)
let configuracionPoliticaCancelacion: ConfiguracionPoliticaCancelacion | null = null;
let alertasNoShow: AlertaNoShow[] = [];
let registrosCancelacionTardia: RegistroCancelacionTardia[] = [];

/**
 * Obtiene la configuración de política de cancelación
 */
export const getConfiguracionPoliticaCancelacion = async (
  userId?: string
): Promise<ConfiguracionPoliticaCancelacion> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!configuracionPoliticaCancelacion) {
        // Crear configuración por defecto
        configuracionPoliticaCancelacion = {
          id: 'config-politica-1',
          userId,
          activo: true,
          tiempoMinimoCancelacionHoras: 24,
          penalizacionNoShow: true,
          tipoPenalizacion: 'advertencia',
          maxNoShowsAntesAlerta: 2,
          maxNoShowsAntesPenalizacion: 3,
          autoMarcarNoShow: false,
          minutosEsperaAutoNoShow: 15,
          notificarPoliticaAlCrear: true,
          mensajePolitica: 'Recordatorio: Por favor cancela con al menos 24 horas de anticipación para evitar penalizaciones.',
          aplicarPenalizacionCancelacionTardia: true,
          tipoPenalizacionCancelacionTardia: 'advertencia',
          excepciones: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
      resolve(configuracionPoliticaCancelacion);
    }, 300);
  });
};

/**
 * Actualiza la configuración de política de cancelación
 */
export const actualizarConfiguracionPoliticaCancelacion = async (
  config: Partial<ConfiguracionPoliticaCancelacion>,
  userId?: string
): Promise<ConfiguracionPoliticaCancelacion> => {
  return new Promise(async (resolve) => {
    const configActual = await getConfiguracionPoliticaCancelacion(userId);
    const configActualizada: ConfiguracionPoliticaCancelacion = {
      ...configActual,
      ...config,
      id: configActual.id,
      updatedAt: new Date(),
    };
    
    setTimeout(() => {
      configuracionPoliticaCancelacion = configActualizada;
      resolve(configActualizada);
    }, 300);
  });
};

/**
 * Obtiene estadísticas de no-shows por cliente
 */
export const getEstadisticasNoShowsCliente = async (
  clienteId: string,
  userId?: string
): Promise<EstadisticasNoShowsCliente | null> => {
  return new Promise(async (resolve) => {
    try {
      // Obtener todas las citas del cliente
      const fechaInicio = new Date(0);
      const fechaFin = new Date('2099-12-31');
      const todasLasCitas = await getCitas(fechaInicio, fechaFin, 'entrenador');
      
      const citasCliente = todasLasCitas.filter(c => c.clienteId === clienteId);
      
      if (citasCliente.length === 0) {
        resolve(null);
        return;
      }
      
      const sesionesCompletadas = citasCliente.filter(c => c.estado === 'completada').length;
      const sesionesNoShow = citasCliente.filter(c => c.estado === 'no-show').length;
      const sesionesCanceladas = citasCliente.filter(c => c.estado === 'cancelada').length;
      const totalSesiones = citasCliente.length;
      
      const tasaNoShow = totalSesiones > 0
        ? Math.round((sesionesNoShow / totalSesiones) * 100)
        : 0;
      
      const tasaAsistencia = totalSesiones > 0
        ? Math.round((sesionesCompletadas / totalSesiones) * 100)
        : 0;
      
      // Obtener última sesión no-show
      const ultimaSesionNoShow = citasCliente
        .filter(c => c.estado === 'no-show')
        .sort((a, b) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime())[0];
      
      // Verificar si tiene alerta
      const config = await getConfiguracionPoliticaCancelacion(userId);
      const tieneAlerta = sesionesNoShow >= (config.maxNoShowsAntesAlerta || 2);
      
      const estadisticas: EstadisticasNoShowsCliente = {
        clienteId,
        clienteNombre: citasCliente[0]?.clienteNombre || 'Cliente desconocido',
        totalSesiones,
        sesionesCompletadas,
        sesionesNoShow,
        sesionesCanceladas,
        tasaNoShow,
        tasaAsistencia,
        ultimaSesionNoShow: ultimaSesionNoShow?.fechaInicio,
        tieneAlerta,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setTimeout(() => {
        resolve(estadisticas);
      }, 300);
    } catch (error) {
      console.error('Error obteniendo estadísticas de no-shows:', error);
      resolve(null);
    }
  });
};

/**
 * Obtiene estadísticas de no-shows para todos los clientes
 */
export const getEstadisticasNoShowsTodosClientes = async (
  userId?: string
): Promise<EstadisticasNoShowsCliente[]> => {
  return new Promise(async (resolve) => {
    try {
      const fechaInicio = new Date(0);
      const fechaFin = new Date('2099-12-31');
      const todasLasCitas = await getCitas(fechaInicio, fechaFin, 'entrenador');
      
      // Agrupar por cliente
      const citasPorCliente = new Map<string, typeof todasLasCitas>();
      todasLasCitas.forEach(cita => {
        if (cita.clienteId) {
          const citas = citasPorCliente.get(cita.clienteId) || [];
          citas.push(cita);
          citasPorCliente.set(cita.clienteId, citas);
        }
      });
      
      const estadisticas: EstadisticasNoShowsCliente[] = [];
      const config = await getConfiguracionPoliticaCancelacion(userId);
      
      for (const [clienteId, citas] of citasPorCliente.entries()) {
        const sesionesCompletadas = citas.filter(c => c.estado === 'completada').length;
        const sesionesNoShow = citas.filter(c => c.estado === 'no-show').length;
        const sesionesCanceladas = citas.filter(c => c.estado === 'cancelada').length;
        const totalSesiones = citas.length;
        
        const tasaNoShow = totalSesiones > 0
          ? Math.round((sesionesNoShow / totalSesiones) * 100)
          : 0;
        
        const tasaAsistencia = totalSesiones > 0
          ? Math.round((sesionesCompletadas / totalSesiones) * 100)
          : 0;
        
        const ultimaSesionNoShow = citas
          .filter(c => c.estado === 'no-show')
          .sort((a, b) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime())[0];
        
        const tieneAlerta = sesionesNoShow >= (config.maxNoShowsAntesAlerta || 2);
        
        estadisticas.push({
          clienteId,
          clienteNombre: citas[0]?.clienteNombre || 'Cliente desconocido',
          totalSesiones,
          sesionesCompletadas,
          sesionesNoShow,
          sesionesCanceladas,
          tasaNoShow,
          tasaAsistencia,
          ultimaSesionNoShow: ultimaSesionNoShow?.fechaInicio,
          tieneAlerta,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      
      // Ordenar por número de no-shows (más no-shows primero)
      estadisticas.sort((a, b) => b.sesionesNoShow - a.sesionesNoShow);
      
      setTimeout(() => {
        resolve(estadisticas);
      }, 300);
    } catch (error) {
      console.error('Error obteniendo estadísticas de no-shows:', error);
      resolve([]);
    }
  });
};

/**
 * Obtiene alertas de no-show activas
 */
export const getAlertasNoShow = async (userId?: string): Promise<AlertaNoShow[]> => {
  return new Promise(async (resolve) => {
    try {
      const estadisticas = await getEstadisticasNoShowsTodosClientes(userId);
      const config = await getConfiguracionPoliticaCancelacion(userId);
      
      // Generar alertas basadas en estadísticas
      const alertas: AlertaNoShow[] = [];
      
      for (const estadistica of estadisticas) {
        if (estadistica.tieneAlerta && estadistica.sesionesNoShow > 0) {
          const tipoAlerta = estadistica.sesionesNoShow >= (config.maxNoShowsAntesPenalizacion || 3)
            ? 'critica'
            : 'advertencia';
          
          const mensaje = tipoAlerta === 'critica'
            ? `El cliente ${estadistica.clienteNombre} tiene ${estadistica.sesionesNoShow} no-shows. Se recomienda aplicar penalización.`
            : `El cliente ${estadistica.clienteNombre} tiene ${estadistica.sesionesNoShow} no-shows. Se recomienda advertir al cliente.`;
          
          // Verificar si ya existe una alerta para este cliente
          const alertaExistente = alertasNoShow.find(a => a.clienteId === estadistica.clienteId);
          
          if (alertaExistente) {
            // Actualizar alerta existente
            alertaExistente.tipoAlerta = tipoAlerta;
            alertaExistente.mensaje = mensaje;
            alertaExistente.noShowsCount = estadistica.sesionesNoShow;
            alertaExistente.fechaUltimoNoShow = estadistica.ultimaSesionNoShow || new Date();
            alertaExistente.activa = true;
            alertaExistente.updatedAt = new Date();
            alertas.push(alertaExistente);
          } else {
            // Crear nueva alerta
            const nuevaAlerta: AlertaNoShow = {
              id: `alerta-${Date.now()}-${estadistica.clienteId}`,
              clienteId: estadistica.clienteId,
              clienteNombre: estadistica.clienteNombre,
              tipoAlerta,
              mensaje,
              noShowsCount: estadistica.sesionesNoShow,
              fechaUltimoNoShow: estadistica.ultimaSesionNoShow || new Date(),
              activa: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            alertasNoShow.push(nuevaAlerta);
            alertas.push(nuevaAlerta);
          }
        }
      }
      
      // Marcar como inactivas las alertas que ya no aplican
      alertasNoShow.forEach(alerta => {
        const estadistica = estadisticas.find(e => e.clienteId === alerta.clienteId);
        if (!estadistica || !estadistica.tieneAlerta) {
          alerta.activa = false;
          alerta.updatedAt = new Date();
        }
      });
      
      // Filtrar solo alertas activas
      const alertasActivas = alertas.filter(a => a.activa);
      
      setTimeout(() => {
        resolve(alertasActivas);
      }, 300);
    } catch (error) {
      console.error('Error obteniendo alertas de no-show:', error);
      resolve([]);
    }
  });
};

/**
 * Marca una alerta como resuelta
 */
export const resolverAlertaNoShow = async (alertaId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const alerta = alertasNoShow.find(a => a.id === alertaId);
      if (alerta) {
        alerta.activa = false;
        alerta.updatedAt = new Date();
      }
      resolve();
    }, 300);
  });
};

/**
 * Obtiene la tendencia de no-shows de los últimos 3 meses para un cliente
 */
export const getTendenciaNoShowsCliente = async (
  clienteId: string,
  userId?: string
): Promise<TendenciaNoShows[]> => {
  return new Promise(async (resolve) => {
    try {
      const fechaFin = new Date();
      const fechaInicio = new Date();
      fechaInicio.setMonth(fechaInicio.getMonth() - 3);
      
      const todasLasCitas = await getCitas(fechaInicio, fechaFin, 'entrenador');
      const citasCliente = todasLasCitas.filter(c => c.clienteId === clienteId);
      
      // Agrupar por mes
      const citasPorMes = new Map<string, typeof citasCliente>();
      
      citasCliente.forEach(cita => {
        const fecha = new Date(cita.fechaInicio);
        const mesKey = `${fecha.getFullYear()}-${fecha.getMonth()}`;
        const citas = citasPorMes.get(mesKey) || [];
        citas.push(cita);
        citasPorMes.set(mesKey, citas);
      });
      
      const tendencia: TendenciaNoShows[] = [];
      const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                     'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      
      // Obtener los últimos 3 meses
      for (let i = 2; i >= 0; i--) {
        const fecha = new Date();
        fecha.setMonth(fecha.getMonth() - i);
        const mesKey = `${fecha.getFullYear()}-${fecha.getMonth()}`;
        const citas = citasPorMes.get(mesKey) || [];
        
        const sesionesCompletadas = citas.filter(c => c.estado === 'completada').length;
        const sesionesNoShow = citas.filter(c => c.estado === 'no-show').length;
        const sesionesCanceladas = citas.filter(c => c.estado === 'cancelada').length;
        const totalSesiones = citas.length;
        
        const tasaNoShow = totalSesiones > 0
          ? Math.round((sesionesNoShow / totalSesiones) * 100)
          : 0;
        
        const tasaAsistencia = totalSesiones > 0
          ? Math.round((sesionesCompletadas / totalSesiones) * 100)
          : 0;
        
        tendencia.push({
          mes: `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`,
          mesNumero: fecha.getMonth() + 1,
          anio: fecha.getFullYear(),
          totalSesiones,
          sesionesCompletadas,
          sesionesNoShow,
          sesionesCanceladas,
          tasaNoShow,
          tasaAsistencia,
        });
      }
      
      setTimeout(() => {
        resolve(tendencia);
      }, 300);
    } catch (error) {
      console.error('Error obteniendo tendencia de no-shows:', error);
      resolve([]);
    }
  });
};

/**
 * Genera una sugerencia de conversación para un cliente con baja adherencia
 */
export const generarSugerenciaConversacion = async (
  clienteId: string,
  estadisticas: EstadisticasNoShowsCliente,
  tendencia: TendenciaNoShows[],
  userId?: string
): Promise<SugerenciaConversacion | null> => {
  return new Promise(async (resolve) => {
    try {
      // Analizar las estadísticas para determinar el tipo de sugerencia
      const tasaNoShow = estadisticas.tasaNoShow;
      const tasaAsistencia = estadisticas.tasaAsistencia;
      const totalNoShows = estadisticas.sesionesNoShow;
      
      // Calcular tendencia (mejorando o empeorando)
      const tendenciaMejorando = tendencia.length >= 2 
        ? tendencia[tendencia.length - 1].tasaNoShow < tendencia[0].tasaNoShow
        : false;
      
      let sugerencia: SugerenciaConversacion | null = null;
      
      if (tasaNoShow >= 30 || totalNoShows >= 3) {
        // Situación crítica - advertencia firme
        sugerencia = {
          tipo: 'advertencia',
          titulo: 'Conversación sobre compromiso y asistencia',
          mensaje: `Hola ${estadisticas.clienteNombre}, he notado que has faltado a ${totalNoShows} sesiones (${tasaNoShow}% de las sesiones). Entiendo que pueden surgir imprevistos, pero tu compromiso es importante para alcanzar tus objetivos.`,
          puntosClave: [
            `Tasa de asistencia: ${tasaAsistencia}%`,
            `Total de no-shows: ${totalNoShows}`,
            'Es importante comunicar con anticipación si no puedes asistir',
            'Propongo revisar juntos el plan de entrenamiento para asegurar que sea realista',
          ],
          tono: 'firme',
        };
      } else if (tasaNoShow >= 15 || (totalNoShows >= 2 && !tendenciaMejorando)) {
        // Situación de advertencia - profesional pero amigable
        sugerencia = {
          tipo: 'advertencia',
          titulo: 'Recordatorio sobre importancia de la asistencia',
          mensaje: `Hola ${estadisticas.clienteNombre}, quería tocar base contigo sobre tu asistencia. He notado que has faltado a algunas sesiones. Tu progreso es importante y la consistencia es clave.`,
          puntosClave: [
            `Tasa de asistencia: ${tasaAsistencia}%`,
            `Tasa de no-shows: ${tasaNoShow}%`,
            'La consistencia es fundamental para ver resultados',
            '¿Hay algo que podamos ajustar en tu plan para mejorar la asistencia?',
          ],
          tono: 'profesional',
        };
      } else if (tasaAsistencia < 70 && totalNoShows >= 1) {
        // Situación de mejora - enfoque positivo
        sugerencia = {
          tipo: 'mejora',
          titulo: 'Conversación de apoyo y mejora',
          mensaje: `Hola ${estadisticas.clienteNombre}, quería revisar contigo cómo van las cosas. Veo que tu asistencia ha sido del ${tasaAsistencia}%. Estamos haciendo buen progreso, pero podemos mejorar aún más.`,
          puntosClave: [
            `Tasa de asistencia actual: ${tasaAsistencia}%`,
            'La consistencia mejorará tus resultados',
            'Podemos ajustar horarios si es necesario',
            'Tu compromiso está dando frutos, sigamos así',
          ],
          tono: 'amigable',
        };
      } else if (tasaAsistencia >= 80 && tendenciaMejorando) {
        // Situación positiva - reconocimiento
        sugerencia = {
          tipo: 'recompensa',
          titulo: 'Reconocimiento por excelente asistencia',
          mensaje: `Hola ${estadisticas.clienteNombre}, quería reconocer tu excelente asistencia. Has mantenido una tasa del ${tasaAsistencia}% y eso se refleja en tu progreso. ¡Sigue así!`,
          puntosClave: [
            `Excelente tasa de asistencia: ${tasaAsistencia}%`,
            'Tu compromiso está dando resultados',
            'Gracias por tu dedicación',
          ],
          tono: 'amigable',
        };
      }
      
      setTimeout(() => {
        resolve(sugerencia);
      }, 300);
    } catch (error) {
      console.error('Error generando sugerencia de conversación:', error);
      resolve(null);
    }
  });
};

/**
 * Obtiene estadísticas extendidas de no-shows para un cliente (incluye tendencia y sugerencias)
 */
export const getEstadisticasNoShowsClienteExtendida = async (
  clienteId: string,
  userId?: string
): Promise<EstadisticasNoShowsClienteExtendida | null> => {
  return new Promise(async (resolve) => {
    try {
      const estadisticas = await getEstadisticasNoShowsCliente(clienteId, userId);
      if (!estadisticas) {
        resolve(null);
        return;
      }
      
      const tendencia = await getTendenciaNoShowsCliente(clienteId, userId);
      const sugerencia = await generarSugerenciaConversacion(clienteId, estadisticas, tendencia, userId);
      
      // Calcular porcentaje de adherencia (basado en asistencia y cancelaciones)
      const porcentajeAdherencia = estadisticas.tasaAsistencia;
      
      const estadisticasExtendida: EstadisticasNoShowsClienteExtendida = {
        ...estadisticas,
        tendenciaUltimos3Meses: tendencia,
        sugerenciaConversacion: sugerencia || undefined,
        porcentajeAdherencia,
      };
      
      setTimeout(() => {
        resolve(estadisticasExtendida);
      }, 300);
    } catch (error) {
      console.error('Error obteniendo estadísticas extendidas:', error);
      resolve(null);
    }
  });
};

/**
 * Obtiene estadísticas extendidas de no-shows para todos los clientes
 */
export const getEstadisticasNoShowsTodosClientesExtendida = async (
  userId?: string
): Promise<EstadisticasNoShowsClienteExtendida[]> => {
  return new Promise(async (resolve) => {
    try {
      const estadisticas = await getEstadisticasNoShowsTodosClientes(userId);
      const estadisticasExtendida: EstadisticasNoShowsClienteExtendida[] = [];
      
      for (const estadistica of estadisticas) {
        const tendencia = await getTendenciaNoShowsCliente(estadistica.clienteId, userId);
        const sugerencia = await generarSugerenciaConversacion(
          estadistica.clienteId,
          estadistica,
          tendencia,
          userId
        );
        
        estadisticasExtendida.push({
          ...estadistica,
          tendenciaUltimos3Meses: tendencia,
          sugerenciaConversacion: sugerencia || undefined,
          porcentajeAdherencia: estadistica.tasaAsistencia,
        });
      }
      
      setTimeout(() => {
        resolve(estadisticasExtendida);
      }, 500);
    } catch (error) {
      console.error('Error obteniendo estadísticas extendidas:', error);
      resolve([]);
    }
  });
};

/**
 * Registra una cancelación tardía
 */
export const registrarCancelacionTardia = async (
  cita: Cita,
  motivoCancelacion: MotivoCancelacion,
  notas?: string,
  userId?: string
): Promise<RegistroCancelacionTardia> => {
  return new Promise(async (resolve, reject) => {
    try {
      const config = await getConfiguracionPoliticaCancelacion(userId);
      
      if (!config.activo) {
        reject(new Error('La política de cancelación no está activa'));
        return;
      }

      const fechaSesion = new Date(cita.fechaInicio);
      const fechaCancelacion = new Date();
      const horasAnticipacion = (fechaSesion.getTime() - fechaCancelacion.getTime()) / (1000 * 60 * 60);
      
      // Verificar si hay excepción aplicable
      let excepcionAplicada: ExcepcionPoliticaCancelacion | null = null;
      if (config.excepciones && config.excepciones.length > 0) {
        excepcionAplicada = config.excepciones.find(exc => 
          exc.activa && (
            (exc.tipo === 'cliente' && exc.clienteId === cita.clienteId) ||
            (exc.tipo === 'tipo-sesion' && exc.tipoSesion === cita.tipo) ||
            exc.tipo === 'situacion'
          )
        ) || null;
      }

      // Determinar tiempo mínimo requerido
      const tiempoMinimoRequerido = excepcionAplicada?.tiempoMinimoHoras || config.tiempoMinimoCancelacionHoras;
      const esTardia = horasAnticipacion < tiempoMinimoRequerido;

      // Determinar penalización
      let penalizacionAplicada: 'advertencia' | 'cobro' | 'bloqueo' | 'ninguna' = 'ninguna';
      if (esTardia && !excepcionAplicada?.aplicaPenalizacion && config.aplicarPenalizacionCancelacionTardia) {
        penalizacionAplicada = config.tipoPenalizacionCancelacionTardia || 'advertencia';
      }

      const registro: RegistroCancelacionTardia = {
        id: `reg-${Date.now()}`,
        citaId: cita.id,
        clienteId: cita.clienteId,
        clienteNombre: cita.clienteNombre,
        fechaSesion,
        fechaCancelacion,
        horasAnticipacion: Math.max(0, horasAnticipacion),
        tiempoMinimoRequerido,
        esTardia,
        penalizacionAplicada,
        excepcionAplicada: excepcionAplicada?.id,
        motivoCancelacion,
        notas,
        createdAt: new Date(),
      };

      registrosCancelacionTardia.push(registro);

      setTimeout(() => {
        resolve(registro);
      }, 300);
    } catch (error) {
      console.error('Error registrando cancelación tardía:', error);
      setTimeout(() => {
        reject(error);
      }, 300);
    }
  });
};

/**
 * Obtiene los registros de cancelaciones tardías
 */
export const getRegistrosCancelacionTardia = async (
  userId?: string,
  fechaInicio?: Date,
  fechaFin?: Date
): Promise<RegistroCancelacionTardia[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let registros = [...registrosCancelacionTardia];
      
      if (fechaInicio) {
        registros = registros.filter(r => r.fechaCancelacion >= fechaInicio);
      }
      if (fechaFin) {
        registros = registros.filter(r => r.fechaCancelacion <= fechaFin);
      }
      
      // Ordenar por fecha de cancelación (más recientes primero)
      registros.sort((a, b) => b.fechaCancelacion.getTime() - a.fechaCancelacion.getTime());
      
      resolve(registros);
    }, 300);
  });
};

/**
 * Obtiene estadísticas de cumplimiento de la política de cancelación
 */
export const getEstadisticasCumplimientoPolitica = async (
  userId?: string,
  periodo?: { inicio: Date; fin: Date }
): Promise<EstadisticasCumplimientoPolitica> => {
  return new Promise(async (resolve) => {
    try {
      const fechaInicio = periodo?.inicio || new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const fechaFin = periodo?.fin || new Date();
      
      const registros = await getRegistrosCancelacionTardia(userId, fechaInicio, fechaFin);
      
      const totalCancelaciones = registros.length;
      const cancelacionesTardias = registros.filter(r => r.esTardia).length;
      const cancelacionesOnTime = totalCancelaciones - cancelacionesTardias;
      const tasaCumplimiento = totalCancelaciones > 0
        ? Math.round((cancelacionesOnTime / totalCancelaciones) * 100)
        : 100;
      
      const promedioHorasAnticipacion = registros.length > 0
        ? registros.reduce((sum, r) => sum + r.horasAnticipacion, 0) / registros.length
        : 0;
      
      const penalizacionesAplicadas = registros.filter(r => 
        r.penalizacionAplicada && r.penalizacionAplicada !== 'ninguna'
      ).length;
      
      const excepcionesAplicadas = registros.filter(r => r.excepcionAplicada).length;
      
      // Agrupar por cliente
      const porClienteMap = new Map<string, {
        clienteId: string;
        clienteNombre: string;
        totalCancelaciones: number;
        cancelacionesTardias: number;
      }>();
      
      registros.forEach(registro => {
        if (registro.clienteId) {
          const cliente = porClienteMap.get(registro.clienteId) || {
            clienteId: registro.clienteId,
            clienteNombre: registro.clienteNombre || 'Cliente desconocido',
            totalCancelaciones: 0,
            cancelacionesTardias: 0,
          };
          cliente.totalCancelaciones++;
          if (registro.esTardia) {
            cliente.cancelacionesTardias++;
          }
          porClienteMap.set(registro.clienteId, cliente);
        }
      });
      
      const porCliente = Array.from(porClienteMap.values()).map(cliente => ({
        ...cliente,
        tasaCumplimiento: cliente.totalCancelaciones > 0
          ? Math.round(((cliente.totalCancelaciones - cliente.cancelacionesTardias) / cliente.totalCancelaciones) * 100)
          : 100,
      }));
      
      const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                     'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      const periodoStr = `${meses[fechaInicio.getMonth()]} ${fechaInicio.getFullYear()}`;
      
      const estadisticas: EstadisticasCumplimientoPolitica = {
        periodo: periodoStr,
        totalCancelaciones,
        cancelacionesTardias,
        cancelacionesOnTime,
        tasaCumplimiento,
        promedioHorasAnticipacion: Math.round(promedioHorasAnticipacion * 10) / 10,
        penalizacionesAplicadas,
        excepcionesAplicadas,
        porCliente,
      };
      
      setTimeout(() => {
        resolve(estadisticas);
      }, 300);
    } catch (error) {
      console.error('Error obteniendo estadísticas de cumplimiento:', error);
      setTimeout(() => {
        resolve({
          periodo: 'Error',
          totalCancelaciones: 0,
          cancelacionesTardias: 0,
          cancelacionesOnTime: 0,
          tasaCumplimiento: 100,
          promedioHorasAnticipacion: 0,
          penalizacionesAplicadas: 0,
          excepcionesAplicadas: 0,
          porCliente: [],
        });
      }, 300);
    }
  });
};

/**
 * Agrega una excepción a la política de cancelación
 */
export const agregarExcepcionPolitica = async (
  excepcion: Omit<ExcepcionPoliticaCancelacion, 'id' | 'createdAt' | 'updatedAt'>,
  userId?: string
): Promise<ExcepcionPoliticaCancelacion> => {
  return new Promise(async (resolve) => {
    const config = await getConfiguracionPoliticaCancelacion(userId);
    
    const nuevaExcepcion: ExcepcionPoliticaCancelacion = {
      ...excepcion,
      id: `exc-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const excepciones = config.excepciones || [];
    excepciones.push(nuevaExcepcion);
    
    await actualizarConfiguracionPoliticaCancelacion({ excepciones }, userId);
    
    setTimeout(() => {
      resolve(nuevaExcepcion);
    }, 300);
  });
};

/**
 * Elimina una excepción de la política de cancelación
 */
export const eliminarExcepcionPolitica = async (
  excepcionId: string,
  userId?: string
): Promise<void> => {
  return new Promise(async (resolve) => {
    const config = await getConfiguracionPoliticaCancelacion(userId);
    const excepciones = (config.excepciones || []).filter(exc => exc.id !== excepcionId);
    
    await actualizarConfiguracionPoliticaCancelacion({ excepciones }, userId);
    
    setTimeout(() => {
      resolve();
    }, 300);
  });
};

/**
 * Verifica si una cancelación es tardía y aplica la política
 */
export const verificarCancelacionTardia = async (
  cita: Cita,
  userId?: string
): Promise<{ esTardia: boolean; penalizacionAplicada?: string; excepcionAplicada?: string }> => {
  return new Promise(async (resolve) => {
    try {
      const config = await getConfiguracionPoliticaCancelacion(userId);
      
      if (!config.activo) {
        resolve({ esTardia: false });
        return;
      }

      const fechaSesion = new Date(cita.fechaInicio);
      const fechaCancelacion = new Date();
      const horasAnticipacion = (fechaSesion.getTime() - fechaCancelacion.getTime()) / (1000 * 60 * 60);
      
      // Verificar si hay excepción aplicable
      let excepcionAplicada: ExcepcionPoliticaCancelacion | null = null;
      if (config.excepciones && config.excepciones.length > 0) {
        excepcionAplicada = config.excepciones.find(exc => 
          exc.activa && (
            (exc.tipo === 'cliente' && exc.clienteId === cita.clienteId) ||
            (exc.tipo === 'tipo-sesion' && exc.tipoSesion === cita.tipo) ||
            exc.tipo === 'situacion'
          )
        ) || null;
      }

      // Determinar tiempo mínimo requerido
      const tiempoMinimoRequerido = excepcionAplicada?.tiempoMinimoHoras || config.tiempoMinimoCancelacionHoras;
      const esTardia = horasAnticipacion < tiempoMinimoRequerido;

      // Determinar penalización
      let penalizacionAplicada: string | undefined;
      if (esTardia && !excepcionAplicada?.aplicaPenalizacion && config.aplicarPenalizacionCancelacionTardia) {
        penalizacionAplicada = config.tipoPenalizacionCancelacionTardia || 'advertencia';
      }

      setTimeout(() => {
        resolve({
          esTardia,
          penalizacionAplicada,
          excepcionAplicada: excepcionAplicada?.id,
        });
      }, 300);
    } catch (error) {
      console.error('Error verificando cancelación tardía:', error);
      setTimeout(() => {
        resolve({ esTardia: false });
      }, 300);
    }
  });
};

