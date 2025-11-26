// Servicio para checklist de preparación de eventos
import { Evento, ChecklistPreparacion, ItemChecklist, PlantillaChecklist } from '../api/events';
import { TipoEvento } from '../api/events';

const STORAGE_KEY_PLANTILLAS = 'plantillas-checklist-eventos';

/**
 * Crea un checklist de preparación vacío
 */
export const crearChecklistVacio = (): ChecklistPreparacion => {
  return {
    items: [],
    recordatorioUnDiaAntes: true,
    recordatorioEnviado: false,
  };
};

/**
 * Agrega un item al checklist
 */
export const agregarItemChecklist = (
  checklist: ChecklistPreparacion,
  item: Omit<ItemChecklist, 'id' | 'completado' | 'fechaCompletado'>
): ChecklistPreparacion => {
  const nuevoItem: ItemChecklist = {
    ...item,
    id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    completado: false,
  };

  return {
    ...checklist,
    items: [...checklist.items, nuevoItem].sort((a, b) => a.orden - b.orden),
  };
};

/**
 * Actualiza un item del checklist
 */
export const actualizarItemChecklist = (
  checklist: ChecklistPreparacion,
  itemId: string,
  updates: Partial<ItemChecklist>
): ChecklistPreparacion => {
  return {
    ...checklist,
    items: checklist.items.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    ),
  };
};

/**
 * Marca un item como completado
 */
export const completarItemChecklist = (
  checklist: ChecklistPreparacion,
  itemId: string,
  completado: boolean
): ChecklistPreparacion => {
  return {
    ...checklist,
    items: checklist.items.map(item =>
      item.id === itemId
        ? {
            ...item,
            completado,
            fechaCompletado: completado ? new Date() : undefined,
          }
        : item
    ),
  };
};

/**
 * Elimina un item del checklist
 */
export const eliminarItemChecklist = (
  checklist: ChecklistPreparacion,
  itemId: string
): ChecklistPreparacion => {
  return {
    ...checklist,
    items: checklist.items.filter(item => item.id !== itemId),
  };
};

/**
 * Reordena items del checklist
 */
export const reordenarItemsChecklist = (
  checklist: ChecklistPreparacion,
  itemIds: string[]
): ChecklistPreparacion => {
  const itemsMap = new Map(checklist.items.map(item => [item.id, item]));
  const itemsReordenados = itemIds
    .map((id, index) => {
      const item = itemsMap.get(id);
      return item ? { ...item, orden: index } : null;
    })
    .filter((item): item is ItemChecklist => item !== null);

  return {
    ...checklist,
    items: itemsReordenados,
  };
};

/**
 * Aplica una plantilla de checklist a un evento
 */
export const aplicarPlantillaChecklist = (
  checklist: ChecklistPreparacion,
  plantilla: PlantillaChecklist
): ChecklistPreparacion => {
  const nuevosItems: ItemChecklist[] = plantilla.items.map((item, index) => ({
    ...item,
    id: `item-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
    completado: false,
  }));

  return {
    ...checklist,
    items: [...checklist.items, ...nuevosItems].sort((a, b) => a.orden - b.orden),
    plantillaId: plantilla.id,
  };
};

/**
 * Guarda una plantilla de checklist
 */
export const guardarPlantillaChecklist = async (
  plantilla: Partial<PlantillaChecklist>
): Promise<PlantillaChecklist> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const plantillasStorage = localStorage.getItem(STORAGE_KEY_PLANTILLAS);
      const plantillas: PlantillaChecklist[] = plantillasStorage
        ? JSON.parse(plantillasStorage)
        : [];

      const nuevaPlantilla: PlantillaChecklist = {
        id: plantilla.id || `plantilla-${Date.now()}`,
        nombre: plantilla.nombre || 'Nueva Plantilla',
        descripcion: plantilla.descripcion,
        tipoEvento: plantilla.tipoEvento,
        items: plantilla.items || [],
        creadoPor: plantilla.creadoPor || '',
        createdAt: plantilla.createdAt || new Date(),
        updatedAt: new Date(),
        usoFrecuente: plantilla.usoFrecuente || 0,
      };

      const index = plantillas.findIndex(p => p.id === nuevaPlantilla.id);
      if (index >= 0) {
        plantillas[index] = nuevaPlantilla;
      } else {
        plantillas.push(nuevaPlantilla);
      }

      localStorage.setItem(STORAGE_KEY_PLANTILLAS, JSON.stringify(plantillas));
      resolve(nuevaPlantilla);
    }, 300);
  });
};

/**
 * Obtiene todas las plantillas de checklist
 */
export const obtenerPlantillasChecklist = async (
  tipoEvento?: TipoEvento,
  userId?: string
): Promise<PlantillaChecklist[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const plantillasStorage = localStorage.getItem(STORAGE_KEY_PLANTILLAS);
      const plantillas: PlantillaChecklist[] = plantillasStorage
        ? JSON.parse(plantillasStorage)
        : [];

      let plantillasFiltradas = plantillas;

      // Filtrar por usuario si se proporciona
      if (userId) {
        plantillasFiltradas = plantillasFiltradas.filter(
          p => p.creadoPor === userId
        );
      }

      // Filtrar por tipo de evento si se proporciona
      if (tipoEvento) {
        plantillasFiltradas = plantillasFiltradas.filter(
          p => !p.tipoEvento || p.tipoEvento === tipoEvento
        );
      }

      // Ordenar por uso frecuente
      plantillasFiltradas.sort((a, b) => b.usoFrecuente - a.usoFrecuente);

      resolve(plantillasFiltradas);
    }, 300);
  });
};

/**
 * Elimina una plantilla de checklist
 */
export const eliminarPlantillaChecklist = async (
  plantillaId: string
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const plantillasStorage = localStorage.getItem(STORAGE_KEY_PLANTILLAS);
      const plantillas: PlantillaChecklist[] = plantillasStorage
        ? JSON.parse(plantillasStorage)
        : [];

      const plantillasFiltradas = plantillas.filter(p => p.id !== plantillaId);
      localStorage.setItem(STORAGE_KEY_PLANTILLAS, JSON.stringify(plantillasFiltradas));
      resolve();
    }, 300);
  });
};

/**
 * Verifica y envía recordatorios de preparación un día antes
 */
export const verificarYEnviarRecordatoriosPreparacion = async (
  eventos: Evento[]
): Promise<void> => {
  const ahora = new Date();
  const mañana = new Date(ahora);
  mañana.setDate(mañana.getDate() + 1);
  mañana.setHours(0, 0, 0, 0);

  const eventosConRecordatorio = eventos.filter(evento => {
    const checklist = evento.checklistPreparacion;
    if (!checklist || !checklist.recordatorioUnDiaAntes) {
      return false;
    }

    if (checklist.recordatorioEnviado) {
      return false;
    }

    const fechaInicio = new Date(evento.fechaInicio);
    fechaInicio.setHours(0, 0, 0, 0);

    // Verificar si el evento es mañana
    return fechaInicio.getTime() === mañana.getTime() && evento.estado === 'programado';
  });

  for (const evento of eventosConRecordatorio) {
    await enviarRecordatorioPreparacion(evento);
  }
};

/**
 * Envía recordatorio de preparación
 */
export const enviarRecordatorioPreparacion = async (
  evento: Evento
): Promise<{ success: boolean; error?: string }> => {
  try {
    const checklist = evento.checklistPreparacion;
    if (!checklist) {
      return { success: false, error: 'No hay checklist de preparación' };
    }

    const itemsPendientes = checklist.items.filter(item => !item.completado);
    
    if (itemsPendientes.length === 0) {
      return { success: true }; // Todos los items están completados
    }

    // TODO: Integrar con servicio de notificaciones (email/SMS/WhatsApp)
    // Por ahora, solo marcamos como enviado
    console.log(`Enviando recordatorio de preparación para evento: ${evento.nombre}`);
    console.log(`Items pendientes: ${itemsPendientes.map(i => i.nombre).join(', ')}`);

    return { success: true };
  } catch (error) {
    console.error('Error enviando recordatorio de preparación:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};

/**
 * Obtiene el porcentaje de completado del checklist
 */
export const obtenerPorcentajeCompletado = (
  checklist: ChecklistPreparacion
): number => {
  if (checklist.items.length === 0) {
    return 100; // Si no hay items, está completo
  }

  const completados = checklist.items.filter(item => item.completado).length;
  return Math.round((completados / checklist.items.length) * 100);
};

/**
 * Crea plantillas predefinidas por tipo de evento
 */
export const obtenerPlantillasPredefinidas = (): PlantillaChecklist[] => {
  return [
    {
      id: 'plantilla-presencial-default',
      nombre: 'Evento Presencial - Básico',
      descripcion: 'Plantilla básica para eventos presenciales',
      tipoEvento: 'presencial',
      items: [
        {
          nombre: 'Verificar materiales necesarios',
          descripcion: 'Revisar que todos los materiales estén disponibles',
          orden: 0,
          categoria: 'material',
        },
        {
          nombre: 'Confirmar ubicación',
          descripcion: 'Verificar que el espacio esté reservado y disponible',
          orden: 1,
          categoria: 'preparacion',
        },
        {
          nombre: 'Preparar lista de participantes',
          descripcion: 'Tener lista actualizada de participantes confirmados',
          orden: 2,
          categoria: 'documentacion',
        },
        {
          nombre: 'Revisar equipamiento',
          descripcion: 'Comprobar que el equipamiento esté en buen estado',
          orden: 3,
          categoria: 'material',
        },
      ],
      creadoPor: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
      usoFrecuente: 0,
    },
    {
      id: 'plantilla-virtual-default',
      nombre: 'Evento Virtual - Básico',
      descripcion: 'Plantilla básica para eventos virtuales',
      tipoEvento: 'virtual',
      items: [
        {
          nombre: 'Probar conexión a internet',
          descripcion: 'Verificar que la conexión sea estable',
          orden: 0,
          categoria: 'preparacion',
        },
        {
          nombre: 'Probar plataforma (Zoom/Teams)',
          descripcion: 'Asegurar que la plataforma funcione correctamente',
          orden: 1,
          categoria: 'preparacion',
        },
        {
          nombre: 'Preparar materiales de presentación',
          descripcion: 'Tener listos los materiales a compartir',
          orden: 2,
          categoria: 'material',
        },
        {
          nombre: 'Enviar link de acceso',
          descripcion: 'Verificar que los participantes tengan el link',
          orden: 3,
          categoria: 'preparacion',
        },
      ],
      creadoPor: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
      usoFrecuente: 0,
    },
    {
      id: 'plantilla-reto-default',
      nombre: 'Reto - Básico',
      descripcion: 'Plantilla básica para retos',
      tipoEvento: 'reto',
      items: [
        {
          nombre: 'Preparar materiales de seguimiento',
          descripcion: 'Documentos, apps, etc. para seguimiento',
          orden: 0,
          categoria: 'material',
        },
        {
          nombre: 'Configurar sistema de métricas',
          descripcion: 'Asegurar que el sistema de seguimiento esté listo',
          orden: 1,
          categoria: 'preparacion',
        },
        {
          nombre: 'Preparar mensajes motivacionales',
          descripcion: 'Tener listos mensajes para enviar a participantes',
          orden: 2,
          categoria: 'preparacion',
        },
      ],
      creadoPor: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
      usoFrecuente: 0,
    },
  ];
};


