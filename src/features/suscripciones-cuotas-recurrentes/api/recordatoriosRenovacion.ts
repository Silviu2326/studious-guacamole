import {
  RecordatorioRenovacion,
  ConfiguracionRecordatorios,
  EnviarRecordatorioRequest,
  Suscripcion,
} from '../types';
import { getSuscripciones } from './suscripciones';

const BASE_DATE = new Date();
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const formatDate = (date: Date) => date.toISOString().split('T')[0];
const addDays = (days: number) =>
  formatDate(new Date(BASE_DATE.getTime() + days * DAY_IN_MS));

// Mock data
const mockRecordatorios: RecordatorioRenovacion[] = [
  {
    id: 'rec-sub1-7',
    suscripcionId: 'sub1',
    clienteId: 'c1',
    clienteNombre: 'Juan Pérez',
    clienteEmail: 'juan@example.com',
    clienteTelefono: '+34600123456',
    fechaRenovacion: addDays(9),
    diasAntes: 7,
    diasAnticipacion: 7,
    canal: 'email',
    canalesEnvio: ['email'],
    plantillaId: 'plantilla-email-1',
    ultimoEnvio: addDays(-1),
    fechaEnvio: addDays(-1),
    monto: 280,
    estado: 'enviado',
    entrenadorId: 'trainer1',
    fechaCreacion: addDays(-1),
  },
  {
    id: 'rec-sub2-3',
    suscripcionId: 'sub2',
    clienteId: 'c2',
    clienteNombre: 'María García',
    clienteEmail: 'maria@example.com',
    clienteTelefono: '+34600234567',
    fechaRenovacion: addDays(4),
    diasAntes: 3,
    diasAnticipacion: 3,
    canal: 'whatsapp',
    canalesEnvio: ['email', 'whatsapp'],
    plantillaId: 'plantilla-whatsapp-1',
    estado: 'pendiente',
    monto: 195,
    entrenadorId: 'trainer1',
    fechaCreacion: addDays(-1),
  },
  {
    id: 'rec-sub6-5',
    suscripcionId: 'sub6',
    clienteId: 'c6',
    clienteNombre: 'Elena Sánchez',
    clienteEmail: 'elena@example.com',
    clienteTelefono: '+34600345678',
    fechaRenovacion: addDays(14),
    diasAntes: 5,
    diasAnticipacion: 5,
    canal: 'email',
    canalesEnvio: ['email'],
    plantillaId: 'plantilla-email-1',
    estado: 'pendiente',
    monto: 520,
    entrenadorId: 'trainer1',
    fechaCreacion: addDays(-2),
  },
  {
    id: 'rec-sub5-10',
    suscripcionId: 'sub5',
    clienteId: 'grp1-owner',
    clienteNombre: 'Equipo Elite',
    clienteEmail: 'grupo@example.com',
    fechaRenovacion: addDays(11),
    diasAntes: 10,
    diasAnticipacion: 10,
    canal: 'email',
    canalesEnvio: ['email'],
    plantillaId: 'plantilla-email-1',
    ultimoEnvio: addDays(-10),
    fechaEnvio: addDays(-10),
    monto: 540,
    estado: 'enviado',
    entrenadorId: 'trainer1',
    fechaCreacion: addDays(-10),
  },
  {
    id: 'rec-sub4-1',
    suscripcionId: 'sub4',
    clienteId: 'c4',
    clienteNombre: 'Ana Martínez',
    clienteEmail: 'ana@example.com',
    clienteTelefono: '+34600567890',
    fechaRenovacion: addDays(20),
    diasAntes: 1,
    diasAnticipacion: 1,
    canal: 'sms',
    canalesEnvio: ['sms'],
    plantillaId: 'plantilla-sms-1',
    estado: 'fallido',
    monto: 55,
    fechaCreacion: addDays(-1),
  },
];

const mockConfiguraciones: Map<string, ConfiguracionRecordatorios> = new Map([
  [
    'sub1',
    {
      suscripcionId: 'sub1',
      activo: true,
      diasAnticipacion: [7, 3, 1],
      canalesEnvio: ['email'],
      plantillaId: 'plantilla-email-1',
    },
  ],
  [
    'sub2',
    {
      suscripcionId: 'sub2',
      activo: true,
      diasAnticipacion: [5, 2],
      canalesEnvio: ['email', 'whatsapp'],
      plantillaEmail: 'Hola {{cliente}}, recuerda tu renovación en {{fechaRenovacion}}.',
      plantillaId: 'plantilla-whatsapp-1',
    },
  ],
  [
    'global',
    {
      activo: true,
      diasAnticipacion: [7, 3, 1],
      canalesEnvio: ['email'],
      plantillaId: 'plantilla-email-default',
    },
  ],
]);

/**
 * Obtiene las configuraciones de recordatorios para una suscripción o plan
 */
export const getConfiguracionRecordatorios = async (
  suscripcionId?: string,
  planId?: string
): Promise<ConfiguracionRecordatorios | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const key = suscripcionId || planId || 'global';
  const config = mockConfiguraciones.get(key);
  if (config) {
    return config;
  }
  
  // Configuración por defecto
  return {
    suscripcionId,
    planId,
    activo: true,
    diasAnticipacion: [7, 3, 1], // Recordatorios 7, 3 y 1 día antes
    canalesEnvio: ['email'],
    plantillaId: 'plantilla-email-default',
  };
};

/**
 * Actualiza la configuración de recordatorios para una suscripción
 */
export const actualizarConfiguracionRecordatorios = async (
  config: ConfiguracionRecordatorios
): Promise<ConfiguracionRecordatorios> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const key = config.suscripcionId || config.planId || 'global';
  mockConfiguraciones.set(key, config);
  return config;
};

/**
 * Guarda la configuración de recordatorios (alias de actualizarConfiguracionRecordatorios)
 */
export const guardarConfiguracionRecordatorios = async (
  config: ConfiguracionRecordatorios
): Promise<ConfiguracionRecordatorios> => {
  return actualizarConfiguracionRecordatorios(config);
};

/**
 * Obtiene los recordatorios pendientes o enviados
 */
export const getRecordatorios = async (
  suscripcionId?: string,
  estado?: 'pendiente' | 'enviado' | 'fallido'
): Promise<RecordatorioRenovacion[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  let recordatorios = [...mockRecordatorios];
  
  if (suscripcionId) {
    recordatorios = recordatorios.filter(r => r.suscripcionId === suscripcionId);
  }
  
  if (estado) {
    recordatorios = recordatorios.filter(r => r.estado === estado);
  }
  
  return recordatorios;
};

/**
 * Obtiene las suscripciones que necesitan recordatorios
 */
export const getSuscripcionesParaRecordatorio = async (
  entrenadorId?: string,
  diasAnticipacion: number = 7
): Promise<Suscripcion[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  const suscripciones = await getSuscripciones(
    entrenadorId ? 'entrenador' : 'gimnasio',
    entrenadorId
  );
  
  // Filtrar suscripciones activas con renovación próxima
  return suscripciones.filter(s => {
    if (s.estado !== 'activa') return false;
    if (!s.proximaRenovacion) return false;
    
    const fechaRenovacion = new Date(s.proximaRenovacion);
    fechaRenovacion.setHours(0, 0, 0, 0);
    const diffDias = Math.ceil((fechaRenovacion.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    
    // Debe estar dentro del rango de anticipación
    return diffDias >= 0 && diffDias <= diasAnticipacion;
  });
};

/**
 * Envía un recordatorio de renovación
 */
export const enviarRecordatorioRenovacion = async (
  data: EnviarRecordatorioRequest
): Promise<RecordatorioRenovacion> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Obtener la suscripción
  const suscripciones = await getSuscripciones('entrenador');
  const suscripcion = suscripciones.find(s => s.id === data.suscripcionId);
  
  if (!suscripcion) {
    throw new Error('Suscripción no encontrada');
  }
  
  if (!suscripcion.proximaRenovacion) {
    throw new Error('La suscripción no tiene fecha de renovación programada');
  }
  
  // Obtener configuración
  const config = await getConfiguracionRecordatorios(data.suscripcionId);
  const canales = data.canales || config?.canalesEnvio || ['email'];
  
  // Crear recordatorio
  const recordatorio: RecordatorioRenovacion = {
    id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    suscripcionId: data.suscripcionId,
    clienteId: suscripcion.clienteId,
    clienteNombre: suscripcion.clienteNombre,
    clienteEmail: suscripcion.clienteEmail,
    clienteTelefono: suscripcion.clienteTelefono,
    fechaRenovacion: suscripcion.proximaRenovacion,
    diasAntes: data.diasAnticipacion,
    diasAnticipacion: data.diasAnticipacion,
    canal: canales[0] || 'email',
    canalesEnvio: canales,
    plantillaId: config?.plantillaId || 'plantilla-email-default',
    monto: suscripcion.precio,
    estado: 'pendiente',
    entrenadorId: suscripcion.entrenadorId,
    fechaCreacion: new Date().toISOString(),
  };
  
  // Simular envío de notificaciones
  try {
    await enviarNotificaciones(recordatorio, suscripcion);
    recordatorio.estado = 'enviado';
    recordatorio.fechaEnvio = new Date().toISOString();
    recordatorio.ultimoEnvio = new Date().toISOString();
  } catch (error) {
    recordatorio.estado = 'fallido';
    console.error('Error enviando recordatorio:', error);
  }
  
  mockRecordatorios.push(recordatorio);
  return recordatorio;
};

/**
 * Registra el envío de un recordatorio de renovación
 */
export const registrarEnvioRecordatorioRenovacion = async (
  recordatorio: Omit<RecordatorioRenovacion, 'id' | 'estado' | 'ultimoEnvio' | 'fechaEnvio'>
): Promise<RecordatorioRenovacion> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const nuevoRecordatorio: RecordatorioRenovacion = {
    ...recordatorio,
    id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    estado: 'enviado',
    ultimoEnvio: new Date().toISOString(),
    fechaEnvio: new Date().toISOString(),
  };
  
  mockRecordatorios.push(nuevoRecordatorio);
  return nuevoRecordatorio;
};

/**
 * Verifica y envía recordatorios automáticos
 */
export const verificarYEnviarRecordatorios = async (
  entrenadorId?: string
): Promise<RecordatorioRenovacion[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const suscripciones = await getSuscripcionesParaRecordatorio(entrenadorId, 7);
  const recordatoriosEnviados: RecordatorioRenovacion[] = [];
  
  for (const suscripcion of suscripciones) {
    // Obtener configuración
    const config = await getConfiguracionRecordatorios(suscripcion.id);
    
    if (!config || !config.activo) {
      continue; // Recordatorios desactivados para esta suscripción
    }
    
    if (!suscripcion.proximaRenovacion) {
      continue;
    }
    
    // Calcular días hasta la renovación
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaRenovacion = new Date(suscripcion.proximaRenovacion);
    fechaRenovacion.setHours(0, 0, 0, 0);
    const diffDias = Math.ceil((fechaRenovacion.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    
    // Verificar si debemos enviar recordatorio hoy
    if (config.diasAnticipacion.includes(diffDias)) {
      // Verificar si ya se envió un recordatorio para este día
      const yaEnviado = mockRecordatorios.some(
        r => r.suscripcionId === suscripcion.id &&
        r.diasAnticipacion === diffDias &&
        r.estado === 'enviado'
      );
      
      if (!yaEnviado) {
        try {
          const recordatorio = await enviarRecordatorioRenovacion({
            suscripcionId: suscripcion.id,
            diasAnticipacion: diffDias,
            canales: config.canalesEnvio,
          });
          recordatoriosEnviados.push(recordatorio);
        } catch (error) {
          console.error(`Error enviando recordatorio para suscripción ${suscripcion.id}:`, error);
        }
      }
    }
  }
  
  return recordatoriosEnviados;
};

/**
 * Función auxiliar para enviar notificaciones por diferentes canales
 */
async function enviarNotificaciones(
  recordatorio: RecordatorioRenovacion,
  suscripcion: Suscripcion
): Promise<void> {
  const mensaje = generarMensajeRecordatorio(recordatorio, suscripcion);
  
  // Simular envío por cada canal
  for (const canal of recordatorio.canalesEnvio) {
    switch (canal) {
      case 'email':
        await enviarEmail(recordatorio, mensaje);
        break;
      case 'sms':
        await enviarSMS(recordatorio, mensaje);
        break;
      case 'whatsapp':
        await enviarWhatsApp(recordatorio, mensaje);
        break;
    }
  }
}

/**
 * Genera el mensaje del recordatorio
 */
function generarMensajeRecordatorio(
  recordatorio: RecordatorioRenovacion,
  suscripcion: Suscripcion
): string {
  const fechaRenovacion = new Date(recordatorio.fechaRenovacion);
  const fechaFormateada = fechaRenovacion.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  let mensaje = `Hola ${recordatorio.clienteNombre},\n\n`;
  mensaje += `Te recordamos que tu suscripción "${suscripcion.planNombre}" se renovará el ${fechaFormateada}.\n\n`;
  mensaje += `Detalles de la renovación:\n`;
  mensaje += `- Plan: ${suscripcion.planNombre}\n`;
  mensaje += `- Monto: ${recordatorio.monto} €\n`;
  mensaje += `- Fecha de renovación: ${fechaFormateada}\n`;
  
  if (suscripcion.pagoRecurrente) {
    mensaje += `- Método de pago: ${suscripcion.pagoRecurrente.metodoPago}\n`;
    if (suscripcion.pagoRecurrente.numeroTarjeta) {
      mensaje += `- Tarjeta: ${suscripcion.pagoRecurrente.numeroTarjeta}\n`;
    }
  }
  
  mensaje += `\nSi deseas cancelar o modificar tu suscripción, por favor contáctanos antes de la fecha de renovación.\n\n`;
  mensaje += `Saludos,\nEquipo de Entrenamiento`;
  
  return mensaje;
}

/**
 * Simula el envío de email
 */
async function enviarEmail(
  recordatorio: RecordatorioRenovacion,
  mensaje: string
): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  console.log('[RecordatoriosRenovacion] Enviando email:', {
    to: recordatorio.clienteEmail,
    subject: `Recordatorio de renovación - ${recordatorio.clienteNombre}`,
    mensaje: mensaje.substring(0, 100) + '...',
  });
  
  // En producción, aquí se enviaría el email real
}

/**
 * Simula el envío de SMS
 */
async function enviarSMS(
  recordatorio: RecordatorioRenovacion,
  mensaje: string
): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (!recordatorio.clienteTelefono) {
    throw new Error('No hay teléfono disponible para enviar SMS');
  }
  
  console.log('[RecordatoriosRenovacion] Enviando SMS:', {
    to: recordatorio.clienteTelefono,
    mensaje: mensaje.substring(0, 100) + '...',
  });
  
  // En producción, aquí se enviaría el SMS real
}

/**
 * Simula el envío de WhatsApp
 */
async function enviarWhatsApp(
  recordatorio: RecordatorioRenovacion,
  mensaje: string
): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (!recordatorio.clienteTelefono) {
    throw new Error('No hay teléfono disponible para enviar WhatsApp');
  }
  
  console.log('[RecordatoriosRenovacion] Enviando WhatsApp:', {
    to: recordatorio.clienteTelefono,
    mensaje: mensaje.substring(0, 100) + '...',
  });
  
  // En producción, aquí se enviaría el mensaje de WhatsApp real
}

