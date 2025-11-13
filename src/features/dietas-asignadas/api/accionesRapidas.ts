import { Dieta } from '../types';
import { generarListaCompra } from '../../lista-de-la-compra-supermercado/api/lista-compra';
import { duplicarDieta } from './dietas';

export type MomentoPlan = 
  | 'recien-creado' // Plan recién creado, no publicado
  | 'inicio' // Primera semana del plan
  | 'en-progreso' // Plan en curso, semana 2+
  | 'cerca-final' // Última semana del plan
  | 'finalizado'; // Plan finalizado

export interface AccionRapidaContextual {
  id: string;
  label: string;
  descripcion: string;
  icono: string;
  disponible: boolean;
  momentoPlan: MomentoPlan[];
  accion: () => Promise<void>;
}

/**
 * Determina el momento del plan basado en las fechas y estado
 */
export function determinarMomentoPlan(dieta: Dieta): MomentoPlan {
  if (!dieta.fechaInicio) {
    return 'recien-creado';
  }

  if (dieta.estado === 'finalizada') {
    return 'finalizado';
  }

  if (dieta.estadoPublicacion === 'borrador') {
    return 'recien-creado';
  }

  const ahora = new Date();
  const fechaInicio = new Date(dieta.fechaInicio);
  const fechaFin = dieta.fechaFin ? new Date(dieta.fechaFin) : null;

  // Calcular días transcurridos
  const diasTranscurridos = Math.floor(
    (ahora.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Si tiene fecha fin, calcular días restantes
  if (fechaFin) {
    const diasRestantes = Math.floor(
      (fechaFin.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diasRestantes <= 7) {
      return 'cerca-final';
    }
  }

  if (diasTranscurridos < 7) {
    return 'inicio';
  }

  return 'en-progreso';
}

/**
 * Genera lista de compra para una dieta
 */
export async function generarListaCompraDieta(dieta: Dieta): Promise<void> {
  try {
    const lista = await generarListaCompra(dieta.clienteId, dieta.id);
    if (lista) {
      // Aquí podrías mostrar una notificación o navegar a la lista
      console.log('Lista de compra generada:', lista);
      alert(`Lista de compra generada para ${dieta.clienteNombre || 'el cliente'}`);
    }
  } catch (error) {
    console.error('Error generando lista de compra:', error);
    alert('Error al generar la lista de compra');
  }
}

/**
 * Duplica la semana actual de una dieta
 */
export async function duplicarSemanaDieta(dieta: Dieta): Promise<void> {
  try {
    const dietaDuplicada = await duplicarDieta(dieta.id);
    if (dietaDuplicada) {
      console.log('Semana duplicada:', dietaDuplicada);
      alert(`Semana duplicada exitosamente. Nueva dieta: ${dietaDuplicada.nombre}`);
      // Aquí podrías navegar a la nueva dieta o recargar la lista
      window.location.reload();
    }
  } catch (error) {
    console.error('Error duplicando semana:', error);
    alert('Error al duplicar la semana');
  }
}

/**
 * Envía resumen al cliente
 */
export async function enviarResumenCliente(dieta: Dieta): Promise<void> {
  try {
    // Simular envío de resumen
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // En producción, aquí harías una llamada a la API para enviar el resumen
    console.log('Enviando resumen a cliente:', dieta.clienteId);
    alert(`Resumen enviado a ${dieta.clienteNombre || 'el cliente'}`);
  } catch (error) {
    console.error('Error enviando resumen:', error);
    alert('Error al enviar el resumen');
  }
}

/**
 * Obtiene las acciones rápidas contextuales disponibles para una dieta
 */
export function getAccionesRapidasContextuales(
  dieta: Dieta,
  onAccionCompletada?: () => void
): AccionRapidaContextual[] {
  const momento = determinarMomentoPlan(dieta);

  const acciones: AccionRapidaContextual[] = [
    {
      id: 'generar-lista-compra',
      label: 'Generar Lista de Compra',
      descripcion: 'Genera una lista de compra con todos los ingredientes necesarios',
      icono: 'ShoppingCart',
      disponible: momento !== 'finalizado',
      momentoPlan: ['recien-creado', 'inicio', 'en-progreso', 'cerca-final'],
      accion: async () => {
        await generarListaCompraDieta(dieta);
        onAccionCompletada?.();
      },
    },
    {
      id: 'duplicar-semana',
      label: 'Duplicar Semana',
      descripcion: 'Crea una copia de esta semana para la próxima',
      icono: 'Copy',
      disponible: momento !== 'finalizado' && momento !== 'recien-creado',
      momentoPlan: ['inicio', 'en-progreso', 'cerca-final'],
      accion: async () => {
        await duplicarSemanaDieta(dieta);
        onAccionCompletada?.();
      },
    },
    {
      id: 'enviar-resumen-cliente',
      label: 'Enviar Resumen al Cliente',
      descripcion: 'Envía un resumen del plan nutricional al cliente',
      icono: 'Send',
      disponible: momento !== 'recien-creado',
      momentoPlan: ['inicio', 'en-progreso', 'cerca-final', 'finalizado'],
      accion: async () => {
        await enviarResumenCliente(dieta);
        onAccionCompletada?.();
      },
    },
  ];

  // Filtrar acciones disponibles según el momento del plan
  return acciones.filter(accion => 
    accion.disponible && accion.momentoPlan.includes(momento)
  );
}

