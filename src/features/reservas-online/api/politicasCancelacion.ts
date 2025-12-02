// API para gestionar políticas de cancelación

import { PoliticaCancelacion } from '../types';

/**
 * Obtiene la política de cancelación de un entrenador
 */
export const getPoliticaCancelacion = async (entrenadorId: string): Promise<PoliticaCancelacion | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const storageKey = `politica-cancelacion-${entrenadorId}`;
  const politicaStorage = localStorage.getItem(storageKey);

  if (!politicaStorage) {
    // Crear política por defecto si no existe
    const politicaPorDefecto: PoliticaCancelacion = {
      id: `politica-${entrenadorId}`,
      entrenadorId,
      activa: false,
      horasAnticipacionMinimas: 24,
      permitirCancelacionUltimoMomento: true,
      aplicarMultaCancelacionUltimoMomento: false,
      aplicarPenalizacionBono: false,
      notificarCliente: true,
      mensajePersonalizado: 'Por favor, cancela con al menos 24 horas de anticipación para evitar cargos.',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await guardarPoliticaCancelacion(politicaPorDefecto);
    return politicaPorDefecto;
  }

  try {
    const politicaData = JSON.parse(politicaStorage);
    return {
      ...politicaData,
      createdAt: new Date(politicaData.createdAt),
      updatedAt: new Date(politicaData.updatedAt),
    };
  } catch (error) {
    console.error('Error cargando política de cancelación:', error);
    return null;
  }
};

/**
 * Guarda la política de cancelación
 */
export const guardarPoliticaCancelacion = async (politica: PoliticaCancelacion): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const storageKey = `politica-cancelacion-${politica.entrenadorId}`;
  localStorage.setItem(storageKey, JSON.stringify(politica));

  console.log('[PoliticaCancelacion] Política guardada:', {
    entrenadorId: politica.entrenadorId,
    activa: politica.activa,
    horasAnticipacionMinimas: politica.horasAnticipacionMinimas,
  });
};

/**
 * Verifica si una cancelación está dentro del tiempo permitido
 * Retorna información sobre si se puede cancelar y qué penalización aplica
 */
export const verificarPoliticaCancelacion = async (
  entrenadorId: string,
  fechaReserva: Date,
  horaReserva: string,
  precioReserva: number
): Promise<{
  puedeCancelar: boolean;
  esCancelacionUltimoMomento: boolean;
  aplicarMulta: boolean;
  montoMulta: number;
  aplicarPenalizacionBono: boolean;
  mensaje: string;
}> => {
  const politica = await getPoliticaCancelacion(entrenadorId);

  // Si no hay política activa, permitir cancelación sin restricciones
  if (!politica || !politica.activa) {
    return {
      puedeCancelar: true,
      esCancelacionUltimoMomento: false,
      aplicarMulta: false,
      montoMulta: 0,
      aplicarPenalizacionBono: false,
      mensaje: 'Cancelación permitida.',
    };
  }

  // Calcular tiempo hasta la reserva
  const ahora = new Date();
  const fechaHoraReserva = new Date(fechaReserva);
  const [hora, minuto] = horaReserva.split(':').map(Number);
  fechaHoraReserva.setHours(hora, minuto, 0, 0);

  const horasHastaReserva = (fechaHoraReserva.getTime() - ahora.getTime()) / (1000 * 60 * 60);
  const esCancelacionUltimoMomento = horasHastaReserva < politica.horasAnticipacionMinimas;

  // Si es cancelación de último momento y no se permite
  if (esCancelacionUltimoMomento && !politica.permitirCancelacionUltimoMomento) {
    return {
      puedeCancelar: false,
      esCancelacionUltimoMomento: true,
      aplicarMulta: false,
      montoMulta: 0,
      aplicarPenalizacionBono: false,
      mensaje: politica.mensajePersonalizado || `No se pueden cancelar reservas con menos de ${politica.horasAnticipacionMinimas} horas de anticipación.`,
    };
  }

  // Calcular multa si aplica
  let montoMulta = 0;
  if (esCancelacionUltimoMomento && politica.aplicarMultaCancelacionUltimoMomento) {
    if (politica.montoMultaFijo) {
      montoMulta = politica.montoMultaFijo;
    } else if (politica.porcentajeMulta) {
      montoMulta = (precioReserva * politica.porcentajeMulta) / 100;
    }
  }

  // Mensaje informativo
  let mensaje = 'Cancelación permitida.';
  if (esCancelacionUltimoMomento) {
    if (montoMulta > 0) {
      mensaje = `Cancelación de último momento. Se aplicará una multa de €${montoMulta.toFixed(2)}.`;
    } else if (politica.aplicarPenalizacionBono) {
      mensaje = 'Cancelación de último momento. Se descontará una sesión del bono.';
    } else {
      mensaje = politica.mensajePersonalizado || `Cancelación de último momento (menos de ${politica.horasAnticipacionMinimas} horas de anticipación).`;
    }
  } else {
    mensaje = 'Cancelación permitida sin penalización.';
  }

  return {
    puedeCancelar: true,
    esCancelacionUltimoMomento,
    aplicarMulta: montoMulta > 0,
    montoMulta,
    aplicarPenalizacionBono: esCancelacionUltimoMomento && politica.aplicarPenalizacionBono,
    mensaje,
  };
};

/**
 * Aplica las penalizaciones de una política de cancelación
 * Esto se llama cuando se confirma una cancelación
 */
export const aplicarPenalizacionesCancelacion = async (
  entrenadorId: string,
  reservaId: string,
  fechaReserva: Date,
  horaReserva: string,
  precioReserva: number,
  bonoId?: string
): Promise<{
  multaAplicada: number;
  penalizacionBonoAplicada: boolean;
}> => {
  const verificacion = await verificarPoliticaCancelacion(
    entrenadorId,
    fechaReserva,
    horaReserva,
    precioReserva
  );

  let multaAplicada = 0;
  let penalizacionBonoAplicada = false;

  if (verificacion.aplicarMulta) {
    multaAplicada = verificacion.montoMulta;
    // En producción, aquí se registraría el cargo/multa en el sistema de pagos
    console.log('[PoliticaCancelacion] Multa aplicada:', {
      reservaId,
      monto: multaAplicada,
    });
  }

  if (verificacion.aplicarPenalizacionBono && bonoId) {
    penalizacionBonoAplicada = true;
    // En producción, aquí se descontaría una sesión del bono
    console.log('[PoliticaCancelacion] Penalización de bono aplicada:', {
      reservaId,
      bonoId,
    });
  }

  return {
    multaAplicada,
    penalizacionBonoAplicada,
  };
};


