/**
 * Servicio para gestión de participantes en eventos
 * 
 * Este servicio centraliza todas las operaciones relacionadas con participantes:
 * - Agregar participantes (con tipo de cliente)
 * - Eliminar participantes
 * - Mover participantes a/desde lista de espera
 * - Gestión de capacidad y lista de espera automática
 */

import { Evento, Participante } from '../api/events';
import { ClientType } from '../types';

export interface DatosCliente {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  foto?: string;
}

export interface DatosClienteAnonimo {
  nombre: string;
  email?: string;
  telefono?: string;
}

/**
 * Agrega un participante a un evento
 * 
 * @param eventId ID del evento
 * @param datosCliente Datos del cliente a agregar
 * @param tipoCliente Tipo de cliente (regular, premium, vip) para pricing diferenciado
 * @param eventos Array de eventos actualizado
 * @returns Objeto con el evento actualizado y si el participante fue agregado a lista de espera
 */
export const agregarParticipante = (
  eventId: string,
  datosCliente: DatosCliente,
  tipoCliente: ClientType,
  eventos: Evento[]
): { eventoActualizado: Evento; enListaEspera: boolean } => {
  const evento = eventos.find(e => e.id === eventId);
  if (!evento) {
    throw new Error(`Evento con ID ${eventId} no encontrado`);
  }

  // Verificar si el participante ya está inscrito
  const participantesActuales = evento.participantesDetalle || [];
  const yaInscrito = participantesActuales.some(p => p.id === datosCliente.id);
  if (yaInscrito) {
    throw new Error('El participante ya está inscrito en este evento');
  }

  // Crear objeto participante
  const nuevoParticipante: Participante = {
    id: datosCliente.id,
    nombre: datosCliente.nombre,
    email: datosCliente.email,
    telefono: datosCliente.telefono,
    foto: datosCliente.foto,
    confirmado: false,
    asistencia: false,
    fechaInscripcion: new Date(),
    esNoInscrito: false,
    tipoCliente,
  };

  // Verificar capacidad
  const espaciosDisponibles = evento.capacidad - participantesActuales.length;
  const enListaEspera = espaciosDisponibles <= 0;

  // Actualizar evento
  const participantesActualizados = enListaEspera
    ? participantesActuales
    : [...participantesActuales, nuevoParticipante];

  const participantesIdsActualizados = enListaEspera
    ? evento.participantes
    : [...evento.participantes, nuevoParticipante.id];

  const listaEsperaActual = evento.listaEspera || [];
  const nuevaListaEspera = enListaEspera
    ? [...listaEsperaActual, nuevoParticipante]
    : listaEsperaActual;

  const eventoActualizado: Evento = {
    ...evento,
    participantes: participantesIdsActualizados,
    participantesDetalle: participantesActualizados,
    listaEspera: nuevaListaEspera,
  };

  return { eventoActualizado, enListaEspera };
};

/**
 * Elimina un participante de un evento
 * 
 * @param eventId ID del evento
 * @param participanteId ID del participante a eliminar
 * @param eventos Array de eventos actualizado
 * @param motivoCancelacion Motivo opcional de cancelación
 * @returns Objeto con el evento actualizado y si se movió alguien de lista de espera
 */
export const eliminarParticipante = (
  eventId: string,
  participanteId: string,
  eventos: Evento[],
  motivoCancelacion?: string
): { eventoActualizado: Evento; participanteMovidoDeEspera: boolean } => {
  const evento = eventos.find(e => e.id === eventId);
  if (!evento) {
    throw new Error(`Evento con ID ${eventId} no encontrado`);
  }

  const participantesActuales = evento.participantesDetalle || [];
  const participante = participantesActuales.find(p => p.id === participanteId);
  
  if (!participante) {
    throw new Error(`Participante con ID ${participanteId} no encontrado`);
  }

  // Remover de participantes confirmados
  const participantesActualizados = participantesActuales.filter(p => p.id !== participanteId);
  const participantesIdsActualizados = evento.participantes.filter(id => id !== participanteId);

  // Verificar si hay espacio y personas en lista de espera
  const hayEspacio = participantesActualizados.length < evento.capacidad;
  const listaEsperaActual = evento.listaEspera || [];
  let nuevaListaEspera = listaEsperaActual;
  let participanteMovidoDeEspera = false;

  // Si hay espacio, mover el primero de la lista de espera
  if (hayEspacio && listaEsperaActual.length > 0) {
    const primerEnEspera = listaEsperaActual[0];
    participantesActualizados.push({
      ...primerEnEspera,
      confirmado: false,
      fechaInscripcion: new Date(),
    });
    participantesIdsActualizados.push(primerEnEspera.id);
    nuevaListaEspera = listaEsperaActual.slice(1);
    participanteMovidoDeEspera = true;
  }

  // Crear registro de cancelación
  const cancelaciones = evento.cancelaciones || [];
  cancelaciones.push({
    participanteId: participante.id,
    participanteNombre: participante.nombre,
    fechaCancelacion: new Date(),
    motivo: motivoCancelacion,
    movidoAEspera: false,
  });

  const eventoActualizado: Evento = {
    ...evento,
    participantes: participantesIdsActualizados,
    participantesDetalle: participantesActualizados,
    listaEspera: nuevaListaEspera,
    cancelaciones,
  };

  return { eventoActualizado, participanteMovidoDeEspera };
};

/**
 * Mueve un participante a la lista de espera
 * 
 * @param eventId ID del evento
 * @param participanteId ID del participante a mover
 * @param eventos Array de eventos actualizado
 * @returns Evento actualizado
 */
export const moverParticipanteAListaEspera = (
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

  // Remover de participantes confirmados
  const participantesActualizados = participantesActuales.filter(p => p.id !== participanteId);
  const participantesIdsActualizados = evento.participantes.filter(id => id !== participanteId);

  // Agregar a lista de espera
  const listaEsperaActual = evento.listaEspera || [];
  const nuevaListaEspera = [...listaEsperaActual, {
    ...participante,
    confirmado: false,
  }];

  const eventoActualizado: Evento = {
    ...evento,
    participantes: participantesIdsActualizados,
    participantesDetalle: participantesActualizados,
    listaEspera: nuevaListaEspera,
  };

  return eventoActualizado;
};

/**
 * Mueve un participante desde la lista de espera a participantes confirmados
 * 
 * @param eventId ID del evento
 * @param participanteId ID del participante a mover
 * @param eventos Array de eventos actualizado
 * @returns Evento actualizado
 */
export const moverParticipanteDeListaEspera = (
  eventId: string,
  participanteId: string,
  eventos: Evento[]
): Evento => {
  const evento = eventos.find(e => e.id === eventId);
  if (!evento) {
    throw new Error(`Evento con ID ${eventId} no encontrado`);
  }

  const listaEsperaActual = evento.listaEspera || [];
  const participante = listaEsperaActual.find(p => p.id === participanteId);
  
  if (!participante) {
    throw new Error(`Participante con ID ${participanteId} no está en la lista de espera`);
  }

  // Verificar capacidad
  const participantesActuales = evento.participantesDetalle || [];
  if (participantesActuales.length >= evento.capacidad) {
    throw new Error('El evento está lleno. No se puede mover de la lista de espera.');
  }

  // Remover de lista de espera
  const nuevaListaEspera = listaEsperaActual.filter(p => p.id !== participanteId);

  // Agregar a participantes confirmados
  const participantesActualizados = [...participantesActuales, {
    ...participante,
    confirmado: false,
    fechaInscripcion: new Date(),
  }];
  const participantesIdsActualizados = [...evento.participantes, participante.id];

  const eventoActualizado: Evento = {
    ...evento,
    participantes: participantesIdsActualizados,
    participantesDetalle: participantesActualizados,
    listaEspera: nuevaListaEspera,
  };

  return eventoActualizado;
};

