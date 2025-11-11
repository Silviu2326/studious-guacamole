import {
  NotificacionSesion,
  ConfiguracionNotificacionesSesion,
  Cita,
  TipoNotificacionSesion,
  ConfiguracionTipoNotificacion,
  HorarioNoMolestar,
} from '../types';
import { getCitas } from './calendario';

// Obtener configuración de notificaciones de sesión
export const getConfiguracionNotificacionesSesion = async (
  userId?: string
): Promise<ConfiguracionNotificacionesSesion> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Configuración por defecto de tipos de notificación
      const tiposNotificacion: ConfiguracionTipoNotificacion[] = [
        {
          tipo: 'nueva-reserva',
          activo: true,
          push: true,
          sonido: true,
          sonidoPersonalizado: 'default',
          vibrar: true,
        },
        {
          tipo: 'cancelacion',
          activo: true,
          push: true,
          sonido: true,
          sonidoPersonalizado: 'alert',
          vibrar: true,
        },
        {
          tipo: 'recordatorio',
          activo: true,
          push: true,
          sonido: true,
          sonidoPersonalizado: 'default',
          vibrar: false,
        },
        {
          tipo: 'no-show',
          activo: true,
          push: true,
          sonido: true,
          sonidoPersonalizado: 'alert',
          vibrar: true,
        },
        {
          tipo: 'confirmacion',
          activo: true,
          push: true,
          sonido: false,
          sonidoPersonalizado: 'default',
          vibrar: false,
        },
        {
          tipo: 'reprogramacion',
          activo: true,
          push: true,
          sonido: true,
          sonidoPersonalizado: 'default',
          vibrar: false,
        },
      ];

      const horarioNoMolestar: HorarioNoMolestar = {
        activo: false,
        horaInicio: '22:00',
        horaFin: '08:00',
        diasSemana: [0, 1, 2, 3, 4, 5, 6], // Todos los días
        permitirUrgentes: true,
      };

      // En producción, esto haría una llamada real al backend
      const config: ConfiguracionNotificacionesSesion = {
        id: '1',
        userId,
        activo: true,
        tiempoAnticipacionMinutos: 10, // Por defecto 10 minutos
        sonidoActivo: true,
        notificacionesPush: true,
        tiposNotificacion,
        horarioNoMolestar,
        mostrarBadge: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      resolve(config);
    }, 300);
  });
};

// Actualizar configuración de notificaciones de sesión
export const actualizarConfiguracionNotificacionesSesion = async (
  configuracion: Partial<ConfiguracionNotificacionesSesion>
): Promise<ConfiguracionNotificacionesSesion> => {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      // Obtener configuración existente para preservar valores no modificados
      const configExistente = await getConfiguracionNotificacionesSesion(configuracion.userId);
      
      const config: ConfiguracionNotificacionesSesion = {
        id: configuracion.id || '1',
        userId: configuracion.userId,
        activo: configuracion.activo ?? configExistente.activo,
        tiempoAnticipacionMinutos: configuracion.tiempoAnticipacionMinutos ?? configExistente.tiempoAnticipacionMinutos,
        sonidoActivo: configuracion.sonidoActivo ?? configExistente.sonidoActivo,
        notificacionesPush: configuracion.notificacionesPush ?? configExistente.notificacionesPush,
        tiposNotificacion: configuracion.tiposNotificacion ?? configExistente.tiposNotificacion,
        horarioNoMolestar: configuracion.horarioNoMolestar ?? configExistente.horarioNoMolestar,
        mostrarBadge: configuracion.mostrarBadge ?? configExistente.mostrarBadge,
        createdAt: configuracion.createdAt || configExistente.createdAt,
        updatedAt: new Date(),
      };
      resolve(config);
    }, 300);
  });
};

// Obtener notificaciones pendientes de sesiones
export const getNotificacionesSesionPendientes = async (
  entrenadorId: string,
  opciones?: { incluirLeidas?: boolean; tipo?: TipoNotificacionSesion }
): Promise<NotificacionSesion[]> => {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      // En producción, esto haría una llamada real al backend
      // Por ahora, calculamos las notificaciones basándose en las citas próximas
      const ahora = new Date();
      const fechaFin = new Date(ahora.getTime() + 24 * 60 * 60 * 1000); // Próximas 24 horas

      const citas = await getCitas(ahora, fechaFin, 'entrenador');
      const config = await getConfiguracionNotificacionesSesion(entrenadorId);

      // Notificaciones de recordatorio (basadas en tiempo de anticipación)
      const notificacionesRecordatorio: NotificacionSesion[] = citas
        .filter((cita) => {
          const fechaInicio = new Date(cita.fechaInicio);
          const tiempoRestante = fechaInicio.getTime() - ahora.getTime();
          const minutosRestantes = tiempoRestante / (1000 * 60);

          // Solo incluir citas que estén dentro del tiempo de anticipación
          return minutosRestantes > 0 && minutosRestantes <= config.tiempoAnticipacionMinutos + 60;
        })
        .map((cita) => {
          const fechaInicio = new Date(cita.fechaInicio);
          const tiempoRestante = fechaInicio.getTime() - ahora.getTime();
          const minutosRestantes = tiempoRestante / (1000 * 60);
          const tipoNotif: TipoNotificacionSesion = 'recordatorio';
          const configTipo = config.tiposNotificacion.find(t => t.tipo === tipoNotif);

          return {
            id: `notif-recordatorio-${cita.id}`,
            citaId: cita.id,
            entrenadorId,
            clienteNombre: cita.clienteNombre || 'Cliente',
            tipoSesion: cita.tipo,
            tipoNotificacion: tipoNotif,
            fechaInicio: new Date(cita.fechaInicio),
            fechaFin: new Date(cita.fechaFin),
            tiempoAnticipacionMinutos: Math.round(minutosRestantes),
            fechaNotificacion: new Date(),
            estado: minutosRestantes <= config.tiempoAnticipacionMinutos ? 'pendiente' : 'pendiente',
            vecesSnoozed: 0,
            sonidoActivo: configTipo?.sonido ?? config.sonidoActivo,
            prioridad: minutosRestantes <= 5 ? 'urgente' : minutosRestantes <= 15 ? 'alta' : 'media',
            accionUrl: `/agenda-calendario?citaId=${cita.id}`,
            accionTexto: 'Ver sesión',
            datosAdicionales: { citaId: cita.id },
            createdAt: new Date(),
          };
        });

      // Notificaciones de cancelación (si hay citas canceladas recientes)
      const notificacionesCancelacion: NotificacionSesion[] = citas
        .filter((cita) => cita.estado === 'cancelada')
        .map((cita) => {
          const tipoNotif: TipoNotificacionSesion = 'cancelacion';
          const configTipo = config.tiposNotificacion.find(t => t.tipo === tipoNotif);

          return {
            id: `notif-cancelacion-${cita.id}`,
            citaId: cita.id,
            entrenadorId,
            clienteNombre: cita.clienteNombre || 'Cliente',
            tipoSesion: cita.tipo,
            tipoNotificacion: tipoNotif,
            fechaInicio: new Date(cita.fechaInicio),
            fechaFin: new Date(cita.fechaFin),
            tiempoAnticipacionMinutos: 0,
            fechaNotificacion: new Date(),
            estado: 'pendiente',
            vecesSnoozed: 0,
            sonidoActivo: configTipo?.sonido ?? config.sonidoActivo,
            prioridad: 'alta',
            accionUrl: `/agenda-calendario?citaId=${cita.id}`,
            accionTexto: 'Ver detalle',
            datosAdicionales: { citaId: cita.id },
            createdAt: new Date(),
          };
        });

      // Combinar todas las notificaciones
      let todasNotificaciones = [...notificacionesRecordatorio, ...notificacionesCancelacion];

      // Filtrar por tipo si se especifica
      if (opciones?.tipo) {
        todasNotificaciones = todasNotificaciones.filter(n => n.tipoNotificacion === opciones.tipo);
      }

      // Filtrar por estado si no se incluyen leídas
      if (!opciones?.incluirLeidas) {
        todasNotificaciones = todasNotificaciones.filter(n => n.estado !== 'leida' && n.estado !== 'dismissed');
      }

      resolve(todasNotificaciones);
    }, 300);
  });
};

// Obtener contador de notificaciones no leídas
export const getContadorNotificacionesNoLeidas = async (
  entrenadorId: string
): Promise<number> => {
  const notificaciones = await getNotificacionesSesionPendientes(entrenadorId, { incluirLeidas: false });
  return notificaciones.filter(n => n.estado === 'pendiente').length;
};

// Marcar notificación como mostrada
export const marcarNotificacionComoMostrada = async (
  notificacionId: string
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[notificacionesSesion] Notificación ${notificacionId} marcada como mostrada`);
      resolve();
    }, 300);
  });
};

// Snoozear notificación (5 minutos)
export const snoozeNotificacion = async (
  notificacionId: string,
  minutos: number = 5
): Promise<NotificacionSesion> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const fechaSnooze = new Date();
      fechaSnooze.setMinutes(fechaSnooze.getMinutes() + minutos);

      const notificacion: NotificacionSesion = {
        id: notificacionId,
        citaId: '',
        entrenadorId: '',
        clienteNombre: '',
        tipoSesion: 'sesion-1-1',
        fechaInicio: new Date(),
        fechaFin: new Date(),
        tiempoAnticipacionMinutos: minutos,
        fechaNotificacion: new Date(),
        estado: 'snoozed',
        fechaSnooze,
        vecesSnoozed: 1,
        sonidoActivo: true,
        createdAt: new Date(),
      };

      console.log(`[notificacionesSesion] Notificación ${notificacionId} snoozeada por ${minutos} minutos`);
      resolve(notificacion);
    }, 300);
  });
};

// Descartar notificación
export const descartarNotificacion = async (
  notificacionId: string
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[notificacionesSesion] Notificación ${notificacionId} descartada`);
      resolve();
    }, 300);
  });
};

// Programar notificaciones para citas futuras
export const programarNotificacionesSesiones = async (
  entrenadorId: string
): Promise<void> => {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      const config = await getConfiguracionNotificacionesSesion(entrenadorId);
      
      if (!config.activo) {
        resolve();
        return;
      }

      const ahora = new Date();
      const fechaFin = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000); // Próximos 7 días

      const citas = await getCitas(ahora, fechaFin, 'entrenador');

      // En producción, esto programaría las notificaciones en el backend
      // Por ahora, solo logueamos
      console.log(`[notificacionesSesion] Programando notificaciones para ${citas.length} citas`);
      
      citas.forEach((cita) => {
        const fechaInicio = new Date(cita.fechaInicio);
        const fechaNotificacion = new Date(
          fechaInicio.getTime() - config.tiempoAnticipacionMinutos * 60 * 1000
        );

        if (fechaNotificacion > ahora) {
          const tiempoRestante = fechaNotificacion.getTime() - ahora.getTime();
          console.log(
            `[notificacionesSesion] Notificación programada para cita ${cita.id} en ${Math.round(tiempoRestante / 1000 / 60)} minutos`
          );
        }
      });

      resolve();
    }, 300);
  });
};

// Reproducir sonido de notificación
export const reproducirSonidoNotificacion = (tipoSonido: string = 'default'): void => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Diferentes frecuencias según el tipo de sonido
    const sonidos: Record<string, { frequency: number; duration: number; type: OscillatorType }> = {
      default: { frequency: 800, duration: 0.5, type: 'sine' },
      alert: { frequency: 1000, duration: 0.3, type: 'square' },
      success: { frequency: 600, duration: 0.4, type: 'sine' },
      warning: { frequency: 400, duration: 0.6, type: 'triangle' },
    };

    const configSonido = sonidos[tipoSonido] || sonidos.default;

    oscillator.frequency.value = configSonido.frequency;
    oscillator.type = configSonido.type;

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + configSonido.duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + configSonido.duration);
  } catch (error) {
    console.warn('No se pudo reproducir el sonido de notificación:', error);
  }
};

// Verificar si está en horario de no molestar
export const estaEnHorarioNoMolestar = (horario: HorarioNoMolestar): boolean => {
  if (!horario.activo) return false;

  const ahora = new Date();
  const horaActual = ahora.getHours();
  const minutoActual = ahora.getMinutes();
  const diaSemana = ahora.getDay();

  // Verificar si el día actual está en la lista de días
  if (!horario.diasSemana.includes(diaSemana)) return false;

  const [horaInicio, minutoInicio] = horario.horaInicio.split(':').map(Number);
  const [horaFin, minutoFin] = horario.horaFin.split(':').map(Number);

  const tiempoActual = horaActual * 60 + minutoActual;
  const tiempoInicio = horaInicio * 60 + minutoInicio;
  const tiempoFin = horaFin * 60 + minutoFin;

  // Si el horario cruza medianoche (ej: 22:00 - 08:00)
  if (tiempoInicio > tiempoFin) {
    return tiempoActual >= tiempoInicio || tiempoActual < tiempoFin;
  } else {
    return tiempoActual >= tiempoInicio && tiempoActual < tiempoFin;
  }
};

// Mostrar notificación push del navegador
export const mostrarNotificacionPush = async (
  notificacion: NotificacionSesion,
  config?: ConfiguracionNotificacionesSesion
): Promise<void> => {
  if (!('Notification' in window)) {
    console.warn('Este navegador no soporta notificaciones');
    return;
  }

  // Obtener configuración si no se proporciona
  if (!config) {
    config = await getConfiguracionNotificacionesSesion(notificacion.entrenadorId);
  }

  // Verificar horario de no molestar
  if (config.horarioNoMolestar.activo && estaEnHorarioNoMolestar(config.horarioNoMolestar)) {
    // Solo mostrar si es urgente y se permiten urgentes
    if (notificacion.prioridad !== 'urgente' || !config.horarioNoMolestar.permitirUrgentes) {
      console.log('Notificación bloqueada por horario de no molestar');
      return;
    }
  }

  // Verificar si el tipo de notificación está activo
  const configTipo = config.tiposNotificacion.find(t => t.tipo === notificacion.tipoNotificacion);
  if (!configTipo || !configTipo.activo || !configTipo.push) {
    console.log('Notificación desactivada para este tipo');
    return;
  }

  if (Notification.permission === 'default') {
    await Notification.requestPermission();
  }

  if (Notification.permission === 'granted') {
    const fechaInicio = new Date(notificacion.fechaInicio);
    
    // Título según el tipo de notificación
    const titulos: Record<TipoNotificacionSesion, string> = {
      'nueva-reserva': 'Nueva reserva',
      'cancelacion': 'Sesión cancelada',
      'recordatorio': `Sesión en ${notificacion.tiempoAnticipacionMinutos} minutos`,
      'no-show': 'No-show detectado',
      'confirmacion': 'Sesión confirmada',
      'reprogramacion': 'Sesión reprogramada',
    };

    const cuerpo: Record<TipoNotificacionSesion, string> = {
      'nueva-reserva': `Cliente: ${notificacion.clienteNombre}\nTipo: ${notificacion.tipoSesion}\nHora: ${fechaInicio.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`,
      'cancelacion': `Sesión cancelada: ${notificacion.clienteNombre}\n${fechaInicio.toLocaleDateString('es-ES')} ${fechaInicio.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`,
      'recordatorio': `Cliente: ${notificacion.clienteNombre}\nTipo: ${notificacion.tipoSesion}\nHora: ${fechaInicio.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`,
      'no-show': `Cliente: ${notificacion.clienteNombre} no asistió a la sesión`,
      'confirmacion': `Cliente: ${notificacion.clienteNombre} confirmó la sesión`,
      'reprogramacion': `Sesión reprogramada: ${notificacion.clienteNombre}`,
    };

    const opciones: NotificationOptions = {
      body: cuerpo[notificacion.tipoNotificacion],
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: notificacion.id,
      requireInteraction: notificacion.prioridad === 'urgente',
      data: {
        notificacionId: notificacion.id,
        citaId: notificacion.citaId,
        accionUrl: notificacion.accionUrl,
        tipoNotificacion: notificacion.tipoNotificacion,
      },
      vibrate: configTipo.vibrar ? [200, 100, 200] : undefined,
    };

    const browserNotification = new Notification(
      titulos[notificacion.tipoNotificacion],
      opciones
    );

    browserNotification.onclick = () => {
      window.focus();
      if (notificacion.accionUrl) {
        // Navegar a la URL de acción si está disponible
        window.location.href = notificacion.accionUrl;
      }
      browserNotification.close();
    };

    // Reproducir sonido si está activo
    if (configTipo.sonido) {
      reproducirSonidoNotificacion(configTipo.sonidoPersonalizado || 'default');
    }

    // Auto-cerrar después de 10 segundos (excepto urgentes)
    if (notificacion.prioridad !== 'urgente') {
      setTimeout(() => {
        browserNotification.close();
      }, 10000);
    }
  }
};

// Marcar notificación como leída
export const marcarNotificacionComoLeida = async (
  notificacionId: string
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[notificacionesSesion] Notificación ${notificacionId} marcada como leída`);
      resolve();
    }, 300);
  });
};

