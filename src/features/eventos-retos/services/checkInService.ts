/**
 * Servicio para gestión de check-in y asistencia en eventos
 * 
 * Este servicio centraliza todas las operaciones relacionadas con check-in:
 * - Marcar asistencia de participantes
 * - Registrar no-shows
 * - Agregar walk-ins (participantes no inscritos)
 */

import { Evento, Participante } from '../api/events';
import { DatosClienteAnonimo } from './participantesService';
export type { DatosClienteAnonimo };

/**
 * Marca la asistencia de un participante
 * 
 * @param eventId ID del evento
 * @param participanteId ID del participante
 * @param eventos Array de eventos actualizado
 * @returns Evento actualizado
 */
export const marcarAsistencia = (
  eventId: string,
  participanteId: string,
  eventos: Evento[]
): Evento => {
  const evento = eventos.find(e => e.id === eventId);
  if (!evento) {
    throw new Error(`Evento con ID ${eventId} no encontrado`);
  }

  const participantesActuales = evento.participantesDetalle || [];
  const participante = participantesActuales.find(p => p.id === participanteId);

  if (!participante) {
    throw new Error(`Participante con ID ${participanteId} no encontrado`);
  }

  // Actualizar asistencia
  const participantesActualizados = participantesActuales.map(p =>
    p.id === participanteId ? { ...p, asistencia: true } : p
  );

  const eventoActualizado: Evento = {
    ...evento,
    participantesDetalle: participantesActualizados,
  };

  return eventoActualizado;
};

/**
 * Registra un no-show (participante que no asistió)
 * 
 * @param eventId ID del evento
 * @param participanteId ID del participante
 * @param eventos Array de eventos actualizado
 * @returns Evento actualizado
 */
export const registrarNoShow = (
  eventId: string,
  participanteId: string,
  eventos: Evento[]
): Evento => {
  const evento = eventos.find(e => e.id === eventId);
  if (!evento) {
    throw new Error(`Evento con ID ${eventId} no encontrado`);
  }

  const participantesActuales = evento.participantesDetalle || [];
  const participante = participantesActuales.find(p => p.id === participanteId);

  if (!participante) {
    throw new Error(`Participante con ID ${participanteId} no encontrado`);
  }

  // Marcar como no asistió
  const participantesActualizados = participantesActuales.map(p =>
    p.id === participanteId ? { ...p, asistencia: false } : p
  );

  const eventoActualizado: Evento = {
    ...evento,
    participantesDetalle: participantesActualizados,
  };

  return eventoActualizado;
};

/**
 * Agrega un walk-in (participante no inscrito que asiste al evento)
 * 
 * @param eventId ID del evento
 * @param datosClienteAnonimo Datos del participante walk-in
 * @param eventos Array de eventos actualizado
 * @returns Evento actualizado
 */
export const agregarWalkIn = (
  eventId: string,
  datosClienteAnonimo: DatosClienteAnonimo,
  eventos: Evento[]
): Evento => {
  const evento = eventos.find(e => e.id === eventId);
  if (!evento) {
    throw new Error(`Evento con ID ${eventId} no encontrado`);
  }

  // Crear participante walk-in
  const nuevoId = `walk-in-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const walkInParticipante: Participante = {
    id: nuevoId,
    nombre: datosClienteAnonimo.nombre.trim(),
    email: datosClienteAnonimo.email?.trim() || undefined,
    telefono: datosClienteAnonimo.telefono?.trim() || undefined,
    confirmado: false,
    asistencia: true, // Walk-ins asisten inmediatamente
    fechaInscripcion: new Date(),
    esNoInscrito: true,
    tipoCliente: 'regular', // Por defecto regular para walk-ins
  };

  // Agregar a participantes
  const participantesActuales = evento.participantesDetalle || [];
  const participantesActualizados = [...participantesActuales, walkInParticipante];
  const participantesIdsActualizados = [...evento.participantes, nuevoId];

  const eventoActualizado: Evento = {
    ...evento,
    participantes: participantesIdsActualizados,
    participantesDetalle: participantesActualizados,
  };

  return eventoActualizado;
};

/**
 * Actualiza múltiples asistencias en un evento (para check-in masivo)
 * 
 * @param eventId ID del evento
 * @param asistencias Mapa de participanteId -> asistencia (boolean)
 * @param eventos Array de eventos actualizado
 * @returns Evento actualizado
 */
export const actualizarAsistenciasMasivas = (
  eventId: string,
  asistencias: Record<string, boolean>,
  eventos: Evento[]
): Evento => {
  const evento = eventos.find(e => e.id === eventId);
  if (!evento) {
    throw new Error(`Evento con ID ${eventId} no encontrado`);
  }

  const participantesActuales = evento.participantesDetalle || [];
  const participantesActualizados = participantesActuales.map(p => {
    if (asistencias[p.id] !== undefined) {
      return { ...p, asistencia: asistencias[p.id] };
    }
    return p;
  });

  const eventoActualizado: Evento = {
    ...evento,
    participantesDetalle: participantesActualizados,
  };

  return eventoActualizado;
};

