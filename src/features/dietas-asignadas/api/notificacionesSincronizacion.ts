import type {
  DatosSincronizadosCliente,
  NotificacionSincronizacionDatos,
  ConfiguracionNotificacionesSincronizacion,
  TipoDatoSincronizado,
} from '../types';

const STORAGE_KEY_NOTIFICACIONES = 'dietas_notificaciones_sincronizacion';
const STORAGE_KEY_DATOS = 'dietas_datos_sincronizados';
const STORAGE_KEY_CONFIG = 'dietas_config_notificaciones_sincronizacion';

// Mock storage
let notificacionesMock: NotificacionSincronizacionDatos[] = [];
let datosSincronizadosMock: DatosSincronizadosCliente[] = [];

/**
 * Obtiene la configuración de notificaciones de sincronización
 */
export async function getConfiguracionNotificacionesSincronizacion(
  dietistaId: string
): Promise<ConfiguracionNotificacionesSincronizacion> {
  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    const stored = localStorage.getItem(`${STORAGE_KEY_CONFIG}_${dietistaId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error al cargar configuración de notificaciones:', error);
  }

  // Configuración por defecto
  const configuracionDefault: ConfiguracionNotificacionesSincronizacion = {
    dietistaId,
    tiposDatos: [
      {
        tipo: 'peso',
        notificar: true,
        prioridad: 'alta',
        umbrales: {
          cambioPesoMinimo: 0.5, // kg
        },
      },
      {
        tipo: 'medidas',
        notificar: true,
        prioridad: 'media',
        umbrales: {
          cambioMedidaMinimo: 2, // cm
        },
      },
      {
        tipo: 'analisis-clinicos',
        notificar: true,
        prioridad: 'alta',
        umbrales: {
          notificarFueraRango: true,
        },
      },
      {
        tipo: 'actividad',
        notificar: false,
        prioridad: 'baja',
      },
      {
        tipo: 'sueño',
        notificar: false,
        prioridad: 'baja',
      },
      {
        tipo: 'otro',
        notificar: true,
        prioridad: 'media',
      },
    ],
    notificaciones: {
      email: true,
      push: true,
      inApp: true,
    },
    autoVincularPlan: false,
    soloDatosRelevantes: true,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };

  return configuracionDefault;
}

/**
 * Guarda la configuración de notificaciones de sincronización
 */
export async function guardarConfiguracionNotificacionesSincronizacion(
  configuracion: ConfiguracionNotificacionesSincronizacion
): Promise<ConfiguracionNotificacionesSincronizacion> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const configuracionActualizada: ConfiguracionNotificacionesSincronizacion = {
    ...configuracion,
    actualizadoEn: new Date().toISOString(),
  };

  try {
    localStorage.setItem(
      `${STORAGE_KEY_CONFIG}_${configuracion.dietistaId}`,
      JSON.stringify(configuracionActualizada)
    );
  } catch (error) {
    console.error('Error al guardar configuración de notificaciones:', error);
  }

  return configuracionActualizada;
}

/**
 * Registra datos sincronizados del cliente
 */
export async function registrarDatosSincronizados(
  datos: Omit<DatosSincronizadosCliente, 'id' | 'creadoEn' | 'actualizadoEn'>
): Promise<DatosSincronizadosCliente> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const datosCompletos: DatosSincronizadosCliente = {
    ...datos,
    id: `datos-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };

  datosSincronizadosMock.push(datosCompletos);

  // Guardar en localStorage
  try {
    localStorage.setItem(STORAGE_KEY_DATOS, JSON.stringify(datosSincronizadosMock));
  } catch (error) {
    console.error('Error al guardar datos sincronizados:', error);
  }

  // Crear notificación si corresponde
  await crearNotificacionSiCorresponde(datosCompletos);

  return datosCompletos;
}

/**
 * Crea una notificación si los datos cumplen los criterios
 */
async function crearNotificacionSiCorresponde(
  datos: DatosSincronizadosCliente
): Promise<NotificacionSincronizacionDatos | null> {
  // Obtener configuración del dietista (asumiendo que hay un dietista asociado)
  // En producción, esto vendría de la dieta o del cliente
  const dietistaId = 'dietista1'; // Mock
  const configuracion = await getConfiguracionNotificacionesSincronizacion(dietistaId);

  // Verificar si se debe notificar este tipo de dato
  const configTipo = configuracion.tiposDatos.find(t => t.tipo === datos.tipo);
  if (!configTipo || !configTipo.notificar) {
    return null;
  }

  // Verificar si los datos son relevantes
  if (configuracion.soloDatosRelevantes) {
    const esRelevante = await verificarDatosRelevantes(datos, configTipo);
    if (!esRelevante) {
      return null;
    }
  }

  // Crear notificación
  const notificacion: NotificacionSincronizacionDatos = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    clienteId: datos.clienteId,
    clienteNombre: undefined, // Se puede obtener del cliente
    dietaId: datos.dietaId,
    datosSincronizadosId: datos.id,
    tipo: datos.tipo,
    titulo: generarTituloNotificacion(datos),
    mensaje: generarMensajeNotificacion(datos),
    datos,
    leida: false,
    requiereAccion: true,
    accionRequerida: determinarAccionRequerida(datos),
    vinculadoAPlan: datos.vinculadoAPlan || false,
    prioridad: configTipo.prioridad,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };

  notificacionesMock.push(notificacion);

  // Guardar en localStorage
  try {
    localStorage.setItem(STORAGE_KEY_NOTIFICACIONES, JSON.stringify(notificacionesMock));
  } catch (error) {
    console.error('Error al guardar notificación:', error);
  }

  return notificacion;
}

/**
 * Verifica si los datos son relevantes según los umbrales
 */
async function verificarDatosRelevantes(
  datos: DatosSincronizadosCliente,
  configTipo: { umbrales?: { cambioPesoMinimo?: number; cambioMedidaMinimo?: number; notificarFueraRango?: boolean } }
): Promise<boolean> {
  // En producción, aquí se compararían con datos anteriores
  // Por ahora, retornamos true si hay umbrales configurados
  if (datos.tipo === 'peso' && datos.peso) {
    // Comparar con peso anterior
    return true; // Simplificado
  }

  if (datos.tipo === 'medidas' && datos.medidas) {
    // Comparar con medidas anteriores
    return true; // Simplificado
  }

  if (datos.tipo === 'analisis-clinicos' && datos.analisisClinicos) {
    // Verificar si está fuera de rango
    if (configTipo.umbrales?.notificarFueraRango) {
      return datos.analisisClinicos.some(analisis => {
        if (analisis.rangoNormal) {
          return analisis.valor < analisis.rangoNormal.minimo || 
                 analisis.valor > analisis.rangoNormal.maximo;
        }
        return false;
      });
    }
  }

  return true;
}

/**
 * Genera el título de la notificación
 */
function generarTituloNotificacion(datos: DatosSincronizadosCliente): string {
  switch (datos.tipo) {
    case 'peso':
      return `Nuevo registro de peso: ${datos.peso?.valor} ${datos.peso?.unidad || 'kg'}`;
    case 'medidas':
      return 'Nuevas medidas corporales sincronizadas';
    case 'analisis-clinicos':
      return 'Nuevos análisis clínicos disponibles';
    case 'actividad':
      return 'Nueva actividad física registrada';
    case 'sueño':
      return 'Nuevos datos de sueño sincronizados';
    default:
      return 'Nuevos datos sincronizados';
  }
}

/**
 * Genera el mensaje de la notificación
 */
function generarMensajeNotificacion(datos: DatosSincronizadosCliente): string {
  switch (datos.tipo) {
    case 'peso':
      return `El cliente ha sincronizado un nuevo peso de ${datos.peso?.valor} ${datos.peso?.unidad || 'kg'} el ${new Date(datos.fecha).toLocaleDateString()}.`;
    case 'medidas':
      const medidas = datos.medidas;
      const medidasTexto = Object.entries(medidas || {})
        .filter(([key]) => key !== 'fuente')
        .map(([key, value]) => `${key}: ${value}cm`)
        .join(', ');
      return `Nuevas medidas corporales sincronizadas: ${medidasTexto}`;
    case 'analisis-clinicos':
      const analisis = datos.analisisClinicos || [];
      return `${analisis.length} nuevo(s) análisis clínico(s) disponible(s). Revisa los resultados para ajustar el plan si es necesario.`;
    default:
      return 'El cliente ha sincronizado nuevos datos. Revisa y vincula al plan si es necesario.';
  }
}

/**
 * Determina la acción requerida según el tipo de dato
 */
function determinarAccionRequerida(
  datos: DatosSincronizadosCliente
): 'revisar' | 'ajustar-plan' | 'contactar-cliente' | 'ninguna' {
  if (datos.tipo === 'analisis-clinicos' && datos.analisisClinicos) {
    // Si hay análisis fuera de rango, puede requerir ajuste del plan
    const fueraRango = datos.analisisClinicos.some(analisis => {
      if (analisis.rangoNormal) {
        return analisis.valor < analisis.rangoNormal.minimo || 
               analisis.valor > analisis.rangoNormal.maximo;
      }
      return false;
    });
    if (fueraRango) {
      return 'ajustar-plan';
    }
  }

  if (datos.requiereAtencion) {
    return 'revisar';
  }

  return 'revisar';
}

/**
 * Obtiene todas las notificaciones de sincronización
 */
export async function getNotificacionesSincronizacion(
  dietaId?: string,
  leidas?: boolean
): Promise<NotificacionSincronizacionDatos[]> {
  await new Promise(resolve => setTimeout(resolve, 200));

  try {
    const stored = localStorage.getItem(STORAGE_KEY_NOTIFICACIONES);
    if (stored) {
      notificacionesMock = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error al cargar notificaciones:', error);
  }

  let notificaciones = [...notificacionesMock];

  // Filtrar por dieta
  if (dietaId) {
    notificaciones = notificaciones.filter(n => n.dietaId === dietaId);
  }

  // Filtrar por estado de lectura
  if (leidas !== undefined) {
    notificaciones = notificaciones.filter(n => n.leida === leidas);
  }

  // Ordenar por fecha (más recientes primero)
  notificaciones.sort((a, b) => 
    new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime()
  );

  return notificaciones;
}

/**
 * Marca una notificación como leída
 */
export async function marcarNotificacionLeida(
  notificacionId: string
): Promise<NotificacionSincronizacionDatos> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const index = notificacionesMock.findIndex(n => n.id === notificacionId);
  if (index === -1) {
    throw new Error('Notificación no encontrada');
  }

  const notificacionActualizada: NotificacionSincronizacionDatos = {
    ...notificacionesMock[index],
    leida: true,
    fechaLectura: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };

  notificacionesMock[index] = notificacionActualizada;

  // Guardar en localStorage
  try {
    localStorage.setItem(STORAGE_KEY_NOTIFICACIONES, JSON.stringify(notificacionesMock));
  } catch (error) {
    console.error('Error al actualizar notificación:', error);
  }

  return notificacionActualizada;
}

/**
 * Vincula los datos sincronizados al plan
 */
export async function vincularDatosAPlan(
  datosSincronizadosId: string,
  dietaId: string
): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Actualizar datos sincronizados
  const datosIndex = datosSincronizadosMock.findIndex(d => d.id === datosSincronizadosId);
  if (datosIndex !== -1) {
    datosSincronizadosMock[datosIndex] = {
      ...datosSincronizadosMock[datosIndex],
      vinculadoAPlan: true,
      actualizadoEn: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY_DATOS, JSON.stringify(datosSincronizadosMock));
    } catch (error) {
      console.error('Error al actualizar datos sincronizados:', error);
    }
  }

  // Actualizar notificación relacionada
  const notificacionIndex = notificacionesMock.findIndex(
    n => n.datosSincronizadosId === datosSincronizadosId
  );
  if (notificacionIndex !== -1) {
    notificacionesMock[notificacionIndex] = {
      ...notificacionesMock[notificacionIndex],
      vinculadoAPlan: true,
      fechaVinculacion: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY_NOTIFICACIONES, JSON.stringify(notificacionesMock));
    } catch (error) {
      console.error('Error al actualizar notificación:', error);
    }
  }

  // En producción, aquí se vincularían los datos al plan nutricional
  // Por ejemplo, actualizando el peso del cliente en la dieta, etc.

  return true;
}

/**
 * Obtiene los datos sincronizados de un cliente
 */
export async function getDatosSincronizadosCliente(
  clienteId: string,
  dietaId?: string
): Promise<DatosSincronizadosCliente[]> {
  await new Promise(resolve => setTimeout(resolve, 200));

  try {
    const stored = localStorage.getItem(STORAGE_KEY_DATOS);
    if (stored) {
      datosSincronizadosMock = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error al cargar datos sincronizados:', error);
  }

  let datos = datosSincronizadosMock.filter(d => d.clienteId === clienteId);

  if (dietaId) {
    datos = datos.filter(d => d.dietaId === dietaId);
  }

  // Ordenar por fecha (más recientes primero)
  datos.sort((a, b) => 
    new Date(b.fechaSincronizacion).getTime() - new Date(a.fechaSincronizacion).getTime()
  );

  return datos;
}

