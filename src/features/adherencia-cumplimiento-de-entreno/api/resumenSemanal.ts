/**
 * API para resúmenes semanales automáticos de adherencia
 */

export interface ConfiguracionResumenSemanal {
  id?: string;
  entrenadorId: string;
  activo: boolean;
  diaEnvio: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';
  horaEnvio: string; // Formato HH:mm
  incluirCambiosAdherencia: boolean;
  incluirAlertasCriticas: boolean;
  soloAlertasAltaPrioridad: boolean;
  emailDestinatario: string;
  ultimoEnvio?: Date;
  proximoEnvio?: Date;
}

export interface CambioAdherencia {
  clienteId: string;
  clienteNombre: string;
  adherenciaAnterior: number;
  adherenciaActual: number;
  cambio: number; // Porcentaje de cambio
  tendencia: 'mejora' | 'empeora' | 'estable';
}

export interface AlertaCritica {
  id: string;
  tipo: string;
  clienteNombre: string;
  detalle: string;
  prioridad: 'alta' | 'media' | 'baja';
  fecha: Date;
}

export interface ResumenSemanal {
  id: string;
  entrenadorId: string;
  fechaInicio: Date;
  fechaFin: Date;
  fechaGeneracion: Date;
  cambiosAdherencia: CambioAdherencia[];
  alertasCriticas: AlertaCritica[];
  resumenNumerico: {
    totalClientes: number;
    clientesMejora: number;
    clientesEmpeora: number;
    totalAlertas: number;
    alertasAltaPrioridad: number;
  };
}

// Simulación de almacenamiento en memoria
const configuraciones = new Map<string, ConfiguracionResumenSemanal>();
const resumenes = new Map<string, ResumenSemanal[]>();

/**
 * Obtener o crear configuración de resumen semanal para un entrenador
 */
export const obtenerConfiguracionResumenSemanal = async (
  entrenadorId: string
): Promise<ConfiguracionResumenSemanal> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const existente = configuraciones.get(entrenadorId);
  if (existente) {
    return existente;
  }

  // Configuración por defecto
  const configPorDefecto: ConfiguracionResumenSemanal = {
    entrenadorId,
    activo: false,
    diaEnvio: 'lunes',
    horaEnvio: '08:00',
    incluirCambiosAdherencia: true,
    incluirAlertasCriticas: true,
    soloAlertasAltaPrioridad: false,
    emailDestinatario: '',
  };

  configuraciones.set(entrenadorId, configPorDefecto);
  return configPorDefecto;
};

/**
 * Guardar configuración de resumen semanal
 */
export const guardarConfiguracionResumenSemanal = async (
  config: ConfiguracionResumenSemanal
): Promise<ConfiguracionResumenSemanal> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const configActualizada: ConfiguracionResumenSemanal = {
    ...config,
    id: config.id || `config-${Date.now()}`,
  };

  // Calcular próximo envío si está activo
  if (configActualizada.activo) {
    configActualizada.proximoEnvio = calcularProximoEnvio(
      configActualizada.diaEnvio,
      configActualizada.horaEnvio
    );
  }

  configuraciones.set(config.entrenadorId, configActualizada);
  return configActualizada;
};

/**
 * Calcular la próxima fecha de envío basada en día y hora
 */
function calcularProximoEnvio(diaEnvio: string, horaEnvio: string): Date {
  const diasSemana = {
    domingo: 0,
    lunes: 1,
    martes: 2,
    miercoles: 3,
    jueves: 4,
    viernes: 5,
    sabado: 6,
  };

  const hoy = new Date();
  const [horas, minutos] = horaEnvio.split(':').map(Number);
  const diaObjetivo = diasSemana[diaEnvio as keyof typeof diasSemana];

  const proximoEnvio = new Date();
  proximoEnvio.setHours(horas, minutos, 0, 0);

  const diasHastaProximo = (diaObjetivo - hoy.getDay() + 7) % 7;
  if (diasHastaProximo === 0 && proximoEnvio <= hoy) {
    proximoEnvio.setDate(proximoEnvio.getDate() + 7);
  } else {
    proximoEnvio.setDate(proximoEnvio.getDate() + diasHastaProximo);
  }

  return proximoEnvio;
}

/**
 * Generar resumen semanal de adherencia
 */
export const generarResumenSemanal = async (
  entrenadorId: string,
  fechaInicio?: Date,
  fechaFin?: Date
): Promise<ResumenSemanal> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const inicio = fechaInicio || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const fin = fechaFin || new Date();

  // Simular datos de cambios de adherencia
  const cambiosAdherencia: CambioAdherencia[] = [
    {
      clienteId: '1',
      clienteNombre: 'María Pérez',
      adherenciaAnterior: 82,
      adherenciaActual: 87.5,
      cambio: 5.5,
      tendencia: 'mejora',
    },
    {
      clienteId: '2',
      clienteNombre: 'Luis García',
      adherenciaAnterior: 70,
      adherenciaActual: 62.5,
      cambio: -7.5,
      tendencia: 'empeora',
    },
    {
      clienteId: '3',
      clienteNombre: 'Elena Sánchez',
      adherenciaAnterior: 50,
      adherenciaActual: 37.5,
      cambio: -12.5,
      tendencia: 'empeora',
    },
    {
      clienteId: '4',
      clienteNombre: 'Sofia López',
      adherenciaAnterior: 55,
      adherenciaActual: 50,
      cambio: -5,
      tendencia: 'empeora',
    },
    {
      clienteId: '5',
      clienteNombre: 'Diego Fernández',
      adherenciaAnterior: 84,
      adherenciaActual: 87.5,
      cambio: 3.5,
      tendencia: 'mejora',
    },
  ];

  // Simular alertas críticas
  const alertasCriticas: AlertaCritica[] = [
    {
      id: '1',
      tipo: 'Baja Adherencia',
      clienteNombre: 'Luis García',
      detalle: '42% en últimos 14d',
      prioridad: 'alta',
      fecha: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      tipo: 'Sesión No Registrada',
      clienteNombre: 'Elena Sánchez',
      detalle: 'Sesión de ayer 19:00 no completada',
      prioridad: 'media',
      fecha: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: '3',
      tipo: 'Objetivo en Riesgo',
      clienteNombre: 'Sofia López',
      detalle: 'Objetivos mensuales al 45%',
      prioridad: 'alta',
      fecha: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: '4',
      tipo: 'Ausencia Prolongada',
      clienteNombre: 'Laura Torres',
      detalle: 'Sin actividad desde hace 10 días',
      prioridad: 'alta',
      fecha: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ];

  const resumen: ResumenSemanal = {
    id: `resumen-${Date.now()}`,
    entrenadorId,
    fechaInicio: inicio,
    fechaFin: fin,
    fechaGeneracion: new Date(),
    cambiosAdherencia,
    alertasCriticas,
    resumenNumerico: {
      totalClientes: cambiosAdherencia.length,
      clientesMejora: cambiosAdherencia.filter(c => c.tendencia === 'mejora').length,
      clientesEmpeora: cambiosAdherencia.filter(c => c.tendencia === 'empeora').length,
      totalAlertas: alertasCriticas.length,
      alertasAltaPrioridad: alertasCriticas.filter(a => a.prioridad === 'alta').length,
    },
  };

  // Guardar resumen en historial
  const historial = resumenes.get(entrenadorId) || [];
  historial.push(resumen);
  resumenes.set(entrenadorId, historial);

  return resumen;
};

/**
 * Enviar resumen semanal por email
 */
export const enviarResumenSemanal = async (
  resumen: ResumenSemanal,
  emailDestinatario: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  // En producción, aquí se enviaría el email real usando un servicio como SendGrid, AWS SES, etc.
  console.log('[ResumenSemanal] Enviando resumen semanal por email:', {
    destinatario: emailDestinatario,
    resumenId: resumen.id,
    fechaInicio: resumen.fechaInicio.toLocaleDateString('es-ES'),
    fechaFin: resumen.fechaFin.toLocaleDateString('es-ES'),
    totalCambios: resumen.cambiosAdherencia.length,
    totalAlertas: resumen.alertasCriticas.length,
  });

  // Actualizar último envío en configuración
  const config = configuraciones.get(resumen.entrenadorId);
  if (config) {
    config.ultimoEnvio = new Date();
    config.proximoEnvio = calcularProximoEnvio(config.diaEnvio, config.horaEnvio);
    configuraciones.set(resumen.entrenadorId, config);
  }
};

/**
 * Obtener historial de resúmenes enviados
 */
export const obtenerHistorialResumenes = async (
  entrenadorId: string,
  limite?: number
): Promise<ResumenSemanal[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const historial = resumenes.get(entrenadorId) || [];
  return limite ? historial.slice(-limite) : historial;
};

/**
 * Generar mensaje de email para el resumen semanal
 */
export const generarMensajeEmailResumen = (resumen: ResumenSemanal): string => {
  const { cambiosAdherencia, alertasCriticas, resumenNumerico } = resumen;
  
  let mensaje = `
Resumen Semanal de Adherencia
${resumen.fechaInicio.toLocaleDateString('es-ES')} - ${resumen.fechaFin.toLocaleDateString('es-ES')}

RESUMEN NUMÉRICO
================
Total de clientes analizados: ${resumenNumerico.totalClientes}
Clientes con mejora: ${resumenNumerico.clientesMejora}
Clientes con empeoramiento: ${resumenNumerico.clientesEmpeora}
Total de alertas: ${resumenNumerico.totalAlertas}
Alertas de alta prioridad: ${resumenNumerico.alertasAltaPrioridad}

`;

  if (cambiosAdherencia.length > 0) {
    mensaje += `
CAMBIOS DE ADHERENCIA
=====================
`;
    cambiosAdherencia.forEach(cambio => {
      const signo = cambio.cambio >= 0 ? '+' : '';
      mensaje += `
${cambio.clienteNombre}
  Adherencia anterior: ${cambio.adherenciaAnterior}%
  Adherencia actual: ${cambio.adherenciaActual}%
  Cambio: ${signo}${cambio.cambio.toFixed(1)}%
  Tendencia: ${cambio.tendencia === 'mejora' ? '📈 Mejora' : cambio.tendencia === 'empeora' ? '📉 Empeora' : '➡️ Estable'}
`;
    });
  }

  if (alertasCriticas.length > 0) {
    mensaje += `
ALERTAS CRÍTICAS
================
`;
    alertasCriticas.forEach(alerta => {
      const prioridadEmoji = alerta.prioridad === 'alta' ? '🔴' : alerta.prioridad === 'media' ? '🟡' : '🔵';
      mensaje += `
${prioridadEmoji} ${alerta.tipo} - ${alerta.clienteNombre}
  ${alerta.detalle}
  Fecha: ${alerta.fecha.toLocaleDateString('es-ES')}
`;
    });
  }

  mensaje += `
---
Este es un resumen automático generado por el sistema de Adherencia y Cumplimiento de Entreno.
Para más detalles, accede al panel de control.

Saludos,
Equipo de Entrenamiento
`;

  return mensaje;
};

