// Servicio para gestión de recordatorios automáticos de eventos
import { Evento, RecordatorioEnviado, ConfiguracionRecordatoriosEvento, RecordatorioConfiguracionEvento, Participante } from '../api/events';

/**
 * Personaliza la plantilla de recordatorio con datos del evento y participante
 */
export const personalizarPlantillaRecordatorio = (
  plantilla: string,
  evento: Evento,
  participante: Participante,
  tiempoAnticipacionHoras: number
): string => {
  const fechaInicio = new Date(evento.fechaInicio);
  const fechaFormateada = fechaInicio.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const horaFormateada = fechaInicio.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  let mensaje = plantilla
    .replace(/{nombre}/g, participante.nombre)
    .replace(/{eventoNombre}/g, evento.nombre)
    .replace(/{fecha}/g, fechaFormateada)
    .replace(/{hora}/g, horaFormateada)
    .replace(/{ubicacion}/g, evento.ubicacion || evento.plataforma || evento.linkAcceso || 'Por confirmar')
    .replace(/{tiempoAnticipacion}/g, tiempoAnticipacionHoras.toString())
    .replace(/{tipoEvento}/g, evento.tipo === 'presencial' ? 'evento presencial' : evento.tipo === 'virtual' ? 'webinar virtual' : 'reto');

  // Agregar información adicional según el tipo de evento
  if (evento.tipo === 'presencial' && evento.ubicacion) {
    mensaje += `\n\nUbicación: ${evento.ubicacion}`;
    if (evento.requisitosFisicos) {
      mensaje += `\nRequisitos: ${evento.requisitosFisicos}`;
    }
  }
  if (evento.tipo === 'virtual' && evento.linkAcceso) {
    mensaje += `\n\nLink de acceso: ${evento.linkAcceso}`;
    if (evento.plataforma) {
      mensaje += `\nPlataforma: ${evento.plataforma}`;
    }
  }

  return mensaje;
};

/**
 * Crea la configuración por defecto de recordatorios
 */
export const crearConfiguracionRecordatoriosPorDefecto = (): ConfiguracionRecordatoriosEvento => {
  return {
    activo: true,
    recordatorios: [
      {
        id: `rec-${Date.now()}-1`,
        tiempoAnticipacionHoras: 24,
        activo: true,
        canales: ['whatsapp', 'email'],
        orden: 1,
      },
      {
        id: `rec-${Date.now()}-2`,
        tiempoAnticipacionHoras: 2,
        activo: true,
        canales: ['whatsapp'],
        orden: 2,
      },
    ],
    plantillaRecordatorio: 'Hola {nombre}, te recordamos que tienes el evento "{eventoNombre}" el {fecha} a las {hora} en {ubicacion}. ¡Te esperamos!',
    canalPorDefecto: 'ambos',
  };
};

/**
 * Verifica si se debe enviar un recordatorio y lo envía
 */
export const verificarYEnviarRecordatorios = async (evento: Evento): Promise<RecordatorioEnviado[]> => {
  const recordatoriosEnviados: RecordatorioEnviado[] = [];

  // Verificar si los recordatorios están activos
  if (!evento.recordatoriosConfiguracion?.activo) {
    return recordatoriosEnviados;
  }

  const ahora = new Date();
  const fechaEvento = new Date(evento.fechaInicio);
  const tiempoHastaEvento = fechaEvento.getTime() - ahora.getTime();
  const horasHastaEvento = tiempoHastaEvento / (1000 * 60 * 60);

  // Solo procesar si el evento está en el futuro
  if (horasHastaEvento <= 0) {
    return recordatoriosEnviados;
  }

  const configuracion = evento.recordatoriosConfiguracion;
  const participantes = evento.participantesDetalle || [];
  const recordatoriosEnviadosAnteriormente = evento.recordatoriosEnviados || [];

  // Procesar cada configuración de recordatorio
  for (const recordatorioConfig of configuracion.recordatorios) {
    if (!recordatorioConfig.activo) continue;

    const horasAnticipacion = recordatorioConfig.tiempoAnticipacionHoras;
    const ventanaEnvio = 1; // Ventana de 1 hora para enviar el recordatorio

    // Verificar si estamos en la ventana de tiempo para enviar este recordatorio
    if (
      horasHastaEvento <= horasAnticipacion + ventanaEnvio &&
      horasHastaEvento >= horasAnticipacion - ventanaEnvio
    ) {
      // Enviar recordatorios a todos los participantes activos
      for (const participante of participantes) {
        // Verificar si el participante ya recibió este recordatorio
        const yaEnviado = recordatoriosEnviadosAnteriormente.some(
          rec =>
            rec.participanteId === participante.id &&
            rec.tiempoAnticipacionHoras === horasAnticipacion
        );

        if (yaEnviado || participante.fechaCancelacion) {
          continue; // Ya se envió o el participante canceló
        }

        // Enviar por cada canal configurado
        for (const canal of recordatorioConfig.canales) {
          const plantilla = configuracion.plantillaRecordatorio || crearConfiguracionRecordatoriosPorDefecto().plantillaRecordatorio || '';
          const mensaje = personalizarPlantillaRecordatorio(plantilla, evento, participante, horasAnticipacion);

          const recordatorio: RecordatorioEnviado = {
            id: `rec-env-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            participanteId: participante.id,
            participanteNombre: participante.nombre,
            tiempoAnticipacionHoras: horasAnticipacion,
            canal,
            mensaje,
            fechaEnvio: new Date(),
            estado: 'enviado',
            leido: false,
          };

          // Simular envío (en producción, aquí se enviaría el mensaje real)
          console.log('[RecordatoriosService] Enviando recordatorio:', {
            participante: participante.nombre,
            evento: evento.nombre,
            tiempoAnticipacion: horasAnticipacion,
            canal,
            mensaje: mensaje.substring(0, 100) + '...',
          });

          recordatoriosEnviados.push(recordatorio);
        }
      }
    }
  }

  return recordatoriosEnviados;
};

/**
 * Programa la verificación periódica de recordatorios para todos los eventos
 */
export const iniciarVerificacionRecordatorios = (): NodeJS.Timeout => {
  // Verificar cada 5 minutos si hay recordatorios pendientes
  return setInterval(async () => {
    const eventosStorage = localStorage.getItem('eventos');
    if (!eventosStorage) return;

    try {
      const eventos: Evento[] = JSON.parse(eventosStorage).map((e: any) => ({
        ...e,
        fechaInicio: new Date(e.fechaInicio),
        fechaFin: e.fechaFin ? new Date(e.fechaFin) : undefined,
        createdAt: new Date(e.createdAt),
        participantesDetalle: e.participantesDetalle?.map((p: any) => ({
          ...p,
          fechaInscripcion: new Date(p.fechaInscripcion),
          fechaCancelacion: p.fechaCancelacion ? new Date(p.fechaCancelacion) : undefined,
        })) || [],
        recordatoriosEnviados: e.recordatoriosEnviados?.map((r: any) => ({
          ...r,
          fechaEnvio: new Date(r.fechaEnvio),
          fechaLectura: r.fechaLectura ? new Date(r.fechaLectura) : undefined,
        })) || [],
      }));

      // Procesar solo eventos programados o en-curso
      const eventosActivos = eventos.filter(
        e => e.estado === 'programado' || e.estado === 'en-curso'
      );

      for (const evento of eventosActivos) {
        const nuevosRecordatorios = await verificarYEnviarRecordatorios(evento);
        if (nuevosRecordatorios.length > 0) {
          // Actualizar evento con nuevos recordatorios
          evento.recordatoriosEnviados = [
            ...(evento.recordatoriosEnviados || []),
            ...nuevosRecordatorios,
          ];

          // Guardar en localStorage
          const eventosActualizados = eventos.map(e =>
            e.id === evento.id ? evento : e
          );
          localStorage.setItem('eventos', JSON.stringify(eventosActualizados));
        }
      }
    } catch (error) {
      console.error('Error verificando recordatorios:', error);
    }
  }, 5 * 60 * 1000); // 5 minutos
};

/**
 * Obtiene el historial de recordatorios de un evento
 */
export const obtenerHistorialRecordatorios = (evento: Evento): RecordatorioEnviado[] => {
  return evento.recordatoriosEnviados || [];
};

/**
 * Obtiene estadísticas de recordatorios
 */
export const obtenerEstadisticasRecordatorios = (evento: Evento): {
  total: number;
  enviados: number;
  entregados: number;
  leidos: number;
  tasaEntrega: number;
  tasaLectura: number;
} => {
  const recordatorios = evento.recordatoriosEnviados || [];
  const enviados = recordatorios.filter(r => r.estado === 'enviado' || r.estado === 'entregado').length;
  const entregados = recordatorios.filter(r => r.estado === 'entregado').length;
  const leidos = recordatorios.filter(r => r.leido).length;
  const tasaEntrega = enviados > 0 ? (entregados / enviados) * 100 : 0;
  const tasaLectura = entregados > 0 ? (leidos / entregados) * 100 : 0;

  return {
    total: recordatorios.length,
    enviados,
    entregados,
    leidos,
    tasaEntrega: Math.round(tasaEntrega * 10) / 10,
    tasaLectura: Math.round(tasaLectura * 10) / 10,
  };
};


