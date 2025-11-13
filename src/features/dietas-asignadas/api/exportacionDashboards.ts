import type {
  ConfiguracionExportacionDashboard,
  DatosExportacionDashboard,
  ResultadoExportacionDashboard,
  TipoDashboardExterno,
} from '../types';
import { getDieta } from './dietas';
import { getInsightsSaludGlobal } from './insightsSaludGlobal';
import { getSeguimientoMacros } from './dietas';

const STORAGE_KEY = 'dietas_exportacion_dashboards';

// Mock storage para configuraciones de exportación
let configuracionesMock: ConfiguracionExportacionDashboard[] = [];

/**
 * Obtiene todas las configuraciones de exportación de un dietista
 */
export async function getConfiguracionesExportacion(
  dietistaId: string
): Promise<ConfiguracionExportacionDashboard[]> {
  await new Promise(resolve => setTimeout(resolve, 200));

  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${dietistaId}`);
    if (stored) {
      configuracionesMock = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error al cargar configuraciones de exportación:', error);
  }

  return configuracionesMock.filter(c => c.creadoPor === dietistaId);
}

/**
 * Obtiene una configuración específica
 */
export async function getConfiguracionExportacion(
  id: string
): Promise<ConfiguracionExportacionDashboard | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return configuracionesMock.find(c => c.id === id) || null;
}

/**
 * Crea una nueva configuración de exportación
 */
export async function crearConfiguracionExportacion(
  configuracion: Omit<ConfiguracionExportacionDashboard, 'id' | 'creadoEn' | 'actualizadoEn'>
): Promise<ConfiguracionExportacionDashboard> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const nuevaConfiguracion: ConfiguracionExportacionDashboard = {
    ...configuracion,
    id: `export-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };

  configuracionesMock.push(nuevaConfiguracion);
  
  // Guardar en localStorage
  try {
    const dietistaId = nuevaConfiguracion.creadoPor;
    localStorage.setItem(
      `${STORAGE_KEY}_${dietistaId}`,
      JSON.stringify(configuracionesMock.filter(c => c.creadoPor === dietistaId))
    );
  } catch (error) {
    console.error('Error al guardar configuración de exportación:', error);
  }

  return nuevaConfiguracion;
}

/**
 * Actualiza una configuración de exportación
 */
export async function actualizarConfiguracionExportacion(
  id: string,
  actualizacion: Partial<ConfiguracionExportacionDashboard>
): Promise<ConfiguracionExportacionDashboard> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const index = configuracionesMock.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Configuración no encontrada');
  }

  const configuracionActualizada: ConfiguracionExportacionDashboard = {
    ...configuracionesMock[index],
    ...actualizacion,
    actualizadoEn: new Date().toISOString(),
  };

  configuracionesMock[index] = configuracionActualizada;

  // Guardar en localStorage
  try {
    const dietistaId = configuracionActualizada.creadoPor;
    localStorage.setItem(
      `${STORAGE_KEY}_${dietistaId}`,
      JSON.stringify(configuracionesMock.filter(c => c.creadoPor === dietistaId))
    );
  } catch (error) {
    console.error('Error al actualizar configuración de exportación:', error);
  }

  return configuracionActualizada;
}

/**
 * Elimina una configuración de exportación
 */
export async function eliminarConfiguracionExportacion(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const index = configuracionesMock.findIndex(c => c.id === id);
  if (index === -1) {
    return false;
  }

  const configuracion = configuracionesMock[index];
  configuracionesMock.splice(index, 1);

  // Guardar en localStorage
  try {
    const dietistaId = configuracion.creadoPor;
    localStorage.setItem(
      `${STORAGE_KEY}_${dietistaId}`,
      JSON.stringify(configuracionesMock.filter(c => c.creadoPor === dietistaId))
    );
  } catch (error) {
    console.error('Error al eliminar configuración de exportación:', error);
  }

  return true;
}

/**
 * Prepara los datos para exportación
 */
export async function prepararDatosExportacion(
  configuracionId: string
): Promise<DatosExportacionDashboard> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const configuracion = await getConfiguracionExportacion(configuracionId);
  if (!configuracion) {
    throw new Error('Configuración no encontrada');
  }

  const dieta = await getDieta(configuracion.dietaId);
  if (!dieta) {
    throw new Error('Dieta no encontrada');
  }

  const datos: DatosExportacionDashboard = {
    dietaId: configuracion.dietaId,
    clienteId: configuracion.clienteId,
    clienteNombre: dieta.clienteNombre,
    fechaExportacion: new Date().toISOString(),
  };

  // Agregar macros si está configurado
  if (configuracion.datosExportar.macros) {
    datos.macros = {
      objetivo: dieta.macros,
      promedio: dieta.macros, // En producción se calcularía el promedio real
      variacion: {
        calorias: 0,
        proteinas: 0,
        carbohidratos: 0,
        grasas: 0,
      },
    };
  }

  // Agregar coste si está configurado
  if (configuracion.datosExportar.coste) {
    try {
      const insights = await getInsightsSaludGlobal(configuracion.dietaId, configuracion.clienteId);
      if (insights?.coste) {
        datos.coste = {
          costeTotalSemanal: insights.coste.costeTotalSemanal,
          costeTotalMensual: insights.coste.costeTotalMensual,
          costePorDia: insights.coste.costePorDia,
          costePorComida: insights.coste.costePorComida,
          tendencia: 'estable',
        };
      }
    } catch (error) {
      console.error('Error al obtener datos de coste:', error);
    }
  }

  // Agregar adherencia si está configurado
  if (configuracion.datosExportar.adherencia) {
    datos.adherencia = {
      promedio: dieta.adherencia || 85,
      tendencia: 'mejora',
      cumplimientoMacros: 90,
      cumplimientoComidas: 85,
      diasCompletados: 6,
      diasTotales: 7,
    };
  }

  // Agregar seguimiento histórico si está configurado
  if (configuracion.datosExportar.seguimientoMacros) {
    try {
      const fecha = configuracion.filtros?.fechaFin || new Date().toISOString().split('T')[0];
      const seguimiento = await getSeguimientoMacros(
        configuracion.clienteId,
        fecha
      );
      if (seguimiento) {
        datos.seguimientoHistorico = [{
          fecha: seguimiento.fecha,
          macrosConsumidos: seguimiento.macrosConsumidos,
          macrosObjetivo: seguimiento.macrosObjetivo,
          cumplimiento: seguimiento.porcentajeCumplimiento,
        }];
      }
    } catch (error) {
      console.error('Error al obtener seguimiento histórico:', error);
    }
  }

  // Agregar período si hay filtros
  if (configuracion.filtros?.fechaInicio && configuracion.filtros?.fechaFin) {
    datos.periodo = {
      fechaInicio: configuracion.filtros.fechaInicio,
      fechaFin: configuracion.filtros.fechaFin,
    };
  }

  return datos;
}

/**
 * Exporta datos a un dashboard externo
 */
export async function exportarADashboard(
  configuracionId: string
): Promise<ResultadoExportacionDashboard> {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const configuracion = await getConfiguracionExportacion(configuracionId);
  if (!configuracion) {
    throw new Error('Configuración no encontrada');
  }

  if (!configuracion.activa) {
    throw new Error('La configuración de exportación no está activa');
  }

  // Preparar datos
  const datosExportados = await prepararDatosExportacion(configuracionId);

  // Simular exportación según el tipo de dashboard
  let exito = true;
  let errores: string[] = [];
  let urlDashboard: string | undefined;

  try {
    switch (configuracion.tipo) {
      case 'power-bi':
        // Simular exportación a Power BI
        urlDashboard = `https://app.powerbi.com/view?r=${configuracion.conexion.workspaceId}/${configuracion.conexion.datasetId}`;
        break;
      case 'looker':
        // Simular exportación a Looker
        urlDashboard = `https://looker.example.com/reports/${configuracion.conexion.reportId}`;
        break;
      case 'tableau':
        // Simular exportación a Tableau
        urlDashboard = `https://tableau.example.com/views/${configuracion.conexion.reportId}`;
        break;
      case 'custom':
        // Exportación personalizada
        if (configuracion.conexion.url) {
          // En producción, aquí se haría una llamada POST a la URL con los datos
          // await fetch(configuracion.conexion.url, {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //     'Authorization': `Bearer ${configuracion.conexion.apiKey}`,
          //   },
          //   body: JSON.stringify(datosExportados),
          // });
        }
        break;
    }

    // Actualizar última sincronización
    await actualizarConfiguracionExportacion(configuracionId, {
      ultimaSincronizacion: new Date().toISOString(),
      ultimaSincronizacionExitosa: new Date().toISOString(),
      erroresSincronizacion: [],
    });
  } catch (error) {
    exito = false;
    errores = [error instanceof Error ? error.message : 'Error desconocido'];
    
    // Actualizar errores
    await actualizarConfiguracionExportacion(configuracionId, {
      ultimaSincronizacion: new Date().toISOString(),
      erroresSincronizacion: errores,
    });
  }

  return {
    configuracionId,
    exito,
    fechaExportacion: new Date().toISOString(),
    datosExportados,
    errores: errores.length > 0 ? errores : undefined,
    mensaje: exito ? 'Exportación realizada exitosamente' : 'Error en la exportación',
    urlDashboard,
  };
}

/**
 * Obtiene el historial de exportaciones de una configuración
 */
export async function getHistorialExportaciones(
  configuracionId: string
): Promise<ResultadoExportacionDashboard[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // En producción, esto vendría de una base de datos
  // Por ahora, retornamos un array vacío
  return [];
}

