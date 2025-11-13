import type {
  PlantillaPersonalizada,
  RespuestaCuestionarioMetodologia,
  ConfiguracionColumnaExcel,
} from '../types';

// Mock storage - en producción sería una llamada a la API
const STORAGE_KEY = 'plantillas_personalizadas';

/**
 * Obtiene todas las plantillas personalizadas del dietista
 */
export async function getPlantillasPersonalizadas(
  dietistaId: string
): Promise<PlantillaPersonalizada[]> {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${dietistaId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error('Error obteniendo plantillas personalizadas:', error);
    return [];
  }
}

/**
 * Obtiene una plantilla personalizada por ID
 */
export async function getPlantillaPersonalizada(
  dietistaId: string,
  plantillaId: string
): Promise<PlantillaPersonalizada | null> {
  try {
    const plantillas = await getPlantillasPersonalizadas(dietistaId);
    return plantillas.find((p) => p.id === plantillaId) || null;
  } catch (error) {
    console.error('Error obteniendo plantilla personalizada:', error);
    return null;
  }
}

/**
 * Crea una nueva plantilla personalizada
 */
export async function crearPlantillaPersonalizada(
  plantilla: Omit<PlantillaPersonalizada, 'id' | 'creadoEn' | 'actualizadoEn' | 'vecesUsada'>
): Promise<PlantillaPersonalizada> {
  try {
    const plantillas = await getPlantillasPersonalizadas(plantilla.dietistaId);
    const ahora = new Date().toISOString();

    const nuevaPlantilla: PlantillaPersonalizada = {
      ...plantilla,
      id: `plantilla_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      vecesUsada: 0,
      creadoEn: ahora,
      actualizadoEn: ahora,
    };

    const nuevasPlantillas = [...plantillas, nuevaPlantilla];
    localStorage.setItem(
      `${STORAGE_KEY}_${plantilla.dietistaId}`,
      JSON.stringify(nuevasPlantillas)
    );

    return nuevaPlantilla;
  } catch (error) {
    console.error('Error creando plantilla personalizada:', error);
    throw error;
  }
}

/**
 * Actualiza una plantilla personalizada existente
 */
export async function actualizarPlantillaPersonalizada(
  dietistaId: string,
  plantillaId: string,
  actualizaciones: Partial<Omit<PlantillaPersonalizada, 'id' | 'dietistaId' | 'creadoEn'>>
): Promise<PlantillaPersonalizada> {
  try {
    const plantillas = await getPlantillasPersonalizadas(dietistaId);
    const plantillaIndex = plantillas.findIndex((p) => p.id === plantillaId);

    if (plantillaIndex === -1) {
      throw new Error('Plantilla no encontrada');
    }

    const plantillaActualizada: PlantillaPersonalizada = {
      ...plantillas[plantillaIndex],
      ...actualizaciones,
      actualizadoEn: new Date().toISOString(),
    };

    plantillas[plantillaIndex] = plantillaActualizada;
    localStorage.setItem(`${STORAGE_KEY}_${dietistaId}`, JSON.stringify(plantillas));

    return plantillaActualizada;
  } catch (error) {
    console.error('Error actualizando plantilla personalizada:', error);
    throw error;
  }
}

/**
 * Elimina una plantilla personalizada
 */
export async function eliminarPlantillaPersonalizada(
  dietistaId: string,
  plantillaId: string
): Promise<void> {
  try {
    const plantillas = await getPlantillasPersonalizadas(dietistaId);
    const nuevasPlantillas = plantillas.filter((p) => p.id !== plantillaId);
    localStorage.setItem(`${STORAGE_KEY}_${dietistaId}`, JSON.stringify(nuevasPlantillas));
  } catch (error) {
    console.error('Error eliminando plantilla personalizada:', error);
    throw error;
  }
}

/**
 * Guarda la configuración actual como plantilla personalizada
 */
export async function guardarConfiguracionComoPlantilla(
  dietistaId: string,
  nombre: string,
  descripcion: string | undefined,
  configuracion: RespuestaCuestionarioMetodologia,
  estilo?: PlantillaPersonalizada['estilo'],
  formatoCondicional?: PlantillaPersonalizada['formatoCondicional'],
  tags?: string[]
): Promise<PlantillaPersonalizada> {
  const plantilla: Omit<PlantillaPersonalizada, 'id' | 'creadoEn' | 'actualizadoEn' | 'vecesUsada'> = {
    nombre,
    descripcion,
    dietistaId,
    columnasExcel: configuracion.columnasExcel,
    formulasPersonalizadas: configuracion.formulasPersonalizadas || {},
    estilo,
    formatoCondicional,
    tags,
    favorita: false,
  };

  return await crearPlantillaPersonalizada(plantilla);
}

/**
 * Aplica una plantilla personalizada a una configuración
 */
export async function aplicarPlantillaPersonalizada(
  plantilla: PlantillaPersonalizada
): Promise<RespuestaCuestionarioMetodologia> {
  // Incrementar contador de uso
  await actualizarPlantillaPersonalizada(plantilla.dietistaId, plantilla.id, {
    vecesUsada: plantilla.vecesUsada + 1,
    ultimoUso: new Date().toISOString(),
  });

  // Crear configuración basada en la plantilla
  const configuracion: RespuestaCuestionarioMetodologia = {
    dietistaId: plantilla.dietistaId,
    metricas: plantilla.columnasExcel.map((col) => col.id as any),
    nivelDetalle: 'completo', // Valor por defecto
    focoCliente: [], // Valor por defecto
    columnasExcel: plantilla.columnasExcel.map((col) => ({
      ...col,
      // Aplicar ancho de columna si está definido en el estilo
      ancho: plantilla.estilo?.anchoColumnas?.[col.id] || col.ancho,
    })),
    formulasPersonalizadas: plantilla.formulasPersonalizadas,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
    version: 1,
  };

  return configuracion;
}

/**
 * Marca/desmarca una plantilla como favorita
 */
export async function toggleFavoritaPlantilla(
  dietistaId: string,
  plantillaId: string
): Promise<PlantillaPersonalizada> {
  const plantilla = await getPlantillaPersonalizada(dietistaId, plantillaId);
  if (!plantilla) {
    throw new Error('Plantilla no encontrada');
  }

  return await actualizarPlantillaPersonalizada(dietistaId, plantillaId, {
    favorita: !plantilla.favorita,
  });
}

/**
 * Busca plantillas por nombre o tags
 */
export async function buscarPlantillasPersonalizadas(
  dietistaId: string,
  busqueda: string
): Promise<PlantillaPersonalizada[]> {
  const plantillas = await getPlantillasPersonalizadas(dietistaId);
  const busquedaLower = busqueda.toLowerCase();

  return plantillas.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busquedaLower) ||
      p.descripcion?.toLowerCase().includes(busquedaLower) ||
      p.tags?.some((tag) => tag.toLowerCase().includes(busquedaLower))
  );
}

/**
 * Obtiene las plantillas más usadas
 */
export async function getPlantillasMasUsadas(
  dietistaId: string,
  limite: number = 5
): Promise<PlantillaPersonalizada[]> {
  const plantillas = await getPlantillasPersonalizadas(dietistaId);
  return plantillas
    .sort((a, b) => b.vecesUsada - a.vecesUsada)
    .slice(0, limite);
}

/**
 * Obtiene las plantillas favoritas
 */
export async function getPlantillasFavoritas(
  dietistaId: string
): Promise<PlantillaPersonalizada[]> {
  const plantillas = await getPlantillasPersonalizadas(dietistaId);
  return plantillas.filter((p) => p.favorita);
}

