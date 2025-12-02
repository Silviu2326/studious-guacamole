/**
 * Servicio mock para gestión de checklists de preparación
 * 
 * Este servicio soporta la parte de gestión de checklists de preparación para eventos.
 * Proporciona funciones para obtener plantillas disponibles, asignar checklists a eventos
 * y actualizar el estado de los items del checklist.
 */

import { PreparationChecklist } from '../types';
import { cargarEventos, guardarEventos } from '../api/events';

// Mock storage para plantillas de checklist
const MOCK_STORAGE_KEY_PLANTILLAS = 'mock_checklist_templates';

/**
 * Obtiene las plantillas de checklist disponibles
 * 
 * @returns Lista de plantillas de PreparationChecklist disponibles
 */
export const obtenerChecklistsDisponibles = async (): Promise<PreparationChecklist[]> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    // Intentar obtener plantillas guardadas
    const stored = localStorage.getItem(MOCK_STORAGE_KEY_PLANTILLAS);
    if (stored) {
      const plantillas = JSON.parse(stored);
      return plantillas.map((p: any) => ({
        ...p,
        items: p.items.map((item: any) => ({
          ...item,
          fechaCompletado: item.fechaCompletado ? new Date(item.fechaCompletado) : undefined,
        })),
      }));
    }

    // Retornar plantillas predefinidas si no hay guardadas
    return obtenerPlantillasPredefinidas();
  } catch (error) {
    console.error('Error obteniendo checklists disponibles:', error);
    return obtenerPlantillasPredefinidas();
  }
};

/**
 * Asigna un checklist a un evento
 * 
 * @param eventId - ID del evento al que se asignará el checklist
 * @param checklistId - ID del checklist (plantilla) a asignar
 * @returns Resultado de la asignación
 */
export const asignarChecklistAEvento = async (
  eventId: string,
  checklistId: string
): Promise<{
  success: boolean;
  checklist?: PreparationChecklist;
  error?: string;
}> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 400));

  try {
    // Obtener el checklist (plantilla)
    const checklists = await obtenerChecklistsDisponibles();
    const plantilla = checklists.find(c => c.id === checklistId);

    if (!plantilla) {
      return {
        success: false,
        error: `Checklist con ID ${checklistId} no encontrado`,
      };
    }

    // Cargar eventos
    const eventos = cargarEventos();
    const eventoIndex = eventos.findIndex(e => e.id === eventId);

    if (eventoIndex === -1) {
      return {
        success: false,
        error: `Evento con ID ${eventId} no encontrado`,
      };
    }

    // Crear una copia del checklist para el evento (no es plantilla)
    const checklistParaEvento: PreparationChecklist = {
      id: `checklist-${eventId}-${Date.now()}`,
      nombre: plantilla.nombre,
      items: plantilla.items.map(item => ({
        ...item,
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        completado: false,
        fechaCompletado: undefined,
        completadoPor: undefined,
      })),
      esPlantilla: false,
      eventId: eventId,
    };

    // Asignar checklist al evento
    if (!eventos[eventoIndex].checklistPreparacion) {
      eventos[eventoIndex].checklistPreparacion = {
        items: checklistParaEvento.items.map(item => ({
          id: item.id,
          nombre: item.descripcion, // Mapear descripcion a nombre para compatibilidad
          descripcion: item.descripcion,
          orden: item.orden,
          categoria: item.categoria,
          completado: item.completado,
          obligatorio: item.obligatorio,
        })),
        recordatorioUnDiaAntes: true,
        recordatorioEnviado: false,
        plantillaId: checklistId,
      };
    }

    // Guardar eventos
    guardarEventos(eventos);

    console.log(`[ChecklistPreparacionService] Checklist ${checklistId} asignado al evento ${eventId}`);

    return {
      success: true,
      checklist: checklistParaEvento,
    };
  } catch (error) {
    console.error('Error asignando checklist a evento:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al asignar checklist',
    };
  }
};

/**
 * Actualiza el estado de un item del checklist
 * 
 * @param eventId - ID del evento
 * @param itemId - ID del item a actualizar
 * @param completado - Nuevo estado de completado
 * @returns Resultado de la actualización
 */
export const actualizarEstadoItem = async (
  eventId: string,
  itemId: string,
  completado: boolean
): Promise<{
  success: boolean;
  error?: string;
}> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    // Cargar eventos
    const eventos = cargarEventos();
    const eventoIndex = eventos.findIndex(e => e.id === eventId);

    if (eventoIndex === -1) {
      return {
        success: false,
        error: `Evento con ID ${eventId} no encontrado`,
      };
    }

    const evento = eventos[eventoIndex];

    if (!evento.checklistPreparacion) {
      return {
        success: false,
        error: 'El evento no tiene checklist de preparación asignado',
      };
    }

    // Buscar y actualizar el item
    const itemIndex = evento.checklistPreparacion.items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      return {
        success: false,
        error: `Item con ID ${itemId} no encontrado en el checklist`,
      };
    }

    // Actualizar estado del item
    evento.checklistPreparacion.items[itemIndex].completado = completado;

    // Si se marca como completado, agregar fecha y usuario (mock)
    if (completado) {
      // En una implementación real, se obtendría del contexto de usuario
      evento.checklistPreparacion.items[itemIndex].fechaCompletado = new Date();
      evento.checklistPreparacion.items[itemIndex].completadoPor = 'usuario-actual';
    } else {
      evento.checklistPreparacion.items[itemIndex].fechaCompletado = undefined;
      evento.checklistPreparacion.items[itemIndex].completadoPor = undefined;
    }

    // Guardar eventos
    guardarEventos(eventos);

    console.log(`[ChecklistPreparacionService] Item ${itemId} del evento ${eventId} actualizado: ${completado ? 'completado' : 'pendiente'}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error actualizando estado de item:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al actualizar item',
    };
  }
};

/**
 * Obtiene plantillas predefinidas de checklist
 */
export function obtenerPlantillasPredefinidas(): PreparationChecklist[] {
  return [
    {
      id: 'plantilla-presencial-basica',
      nombre: 'Evento Presencial - Básico',
      items: [
        {
          id: 'item-1',
          descripcion: 'Verificar materiales necesarios',
          obligatorio: true,
          completado: false,
          orden: 0,
          categoria: 'material',
        },
        {
          id: 'item-2',
          descripcion: 'Confirmar ubicación y disponibilidad',
          obligatorio: true,
          completado: false,
          orden: 1,
          categoria: 'preparacion',
        },
        {
          id: 'item-3',
          descripcion: 'Preparar lista de participantes confirmados',
          obligatorio: false,
          completado: false,
          orden: 2,
          categoria: 'documentacion',
        },
        {
          id: 'item-4',
          descripcion: 'Revisar equipamiento y estado',
          obligatorio: true,
          completado: false,
          orden: 3,
          categoria: 'material',
        },
      ],
      esPlantilla: true,
    },
    {
      id: 'plantilla-virtual-basica',
      nombre: 'Evento Virtual - Básico',
      items: [
        {
          id: 'item-5',
          descripcion: 'Probar conexión a internet',
          obligatorio: true,
          completado: false,
          orden: 0,
          categoria: 'preparacion',
        },
        {
          id: 'item-6',
          descripcion: 'Probar plataforma (Zoom/Teams/etc)',
          obligatorio: true,
          completado: false,
          orden: 1,
          categoria: 'preparacion',
        },
        {
          id: 'item-7',
          descripcion: 'Preparar materiales de presentación',
          obligatorio: false,
          completado: false,
          orden: 2,
          categoria: 'material',
        },
        {
          id: 'item-8',
          descripcion: 'Enviar link de acceso a participantes',
          obligatorio: true,
          completado: false,
          orden: 3,
          categoria: 'preparacion',
        },
      ],
      esPlantilla: true,
    },
    {
      id: 'plantilla-reto-basica',
      nombre: 'Reto - Básico',
      items: [
        {
          id: 'item-9',
          descripcion: 'Preparar materiales de seguimiento',
          obligatorio: false,
          completado: false,
          orden: 0,
          categoria: 'material',
        },
        {
          id: 'item-10',
          descripcion: 'Configurar sistema de métricas',
          obligatorio: true,
          completado: false,
          orden: 1,
          categoria: 'preparacion',
        },
        {
          id: 'item-11',
          descripcion: 'Preparar mensajes motivacionales',
          obligatorio: false,
          completado: false,
          orden: 2,
          categoria: 'preparacion',
        },
      ],
      esPlantilla: true,
    },
  ];
}

/**
 * Función auxiliar para guardar plantillas personalizadas (mock)
 */
export const guardarPlantillaChecklist = async (
  plantilla: PreparationChecklist
): Promise<PreparationChecklist> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const plantillas = await obtenerChecklistsDisponibles();
  const index = plantillas.findIndex(p => p.id === plantilla.id);

  if (index >= 0) {
    plantillas[index] = plantilla;
  } else {
    plantillas.push(plantilla);
  }

  localStorage.setItem(MOCK_STORAGE_KEY_PLANTILLAS, JSON.stringify(plantillas));

  return plantilla;
};
