import {
  Notificacion,
  ListaEspera,
  Reserva,
} from '../types';

// Datos mock
const notificacionesMock: Notificacion[] = [
  {
    id: 'notif-1',
    tipo: 'disponibilidad_plaza',
    destinatario: 'socio-1',
    claseId: 'clase-1',
    mensaje: 'Se ha liberado una plaza para Yoga Matutino. Confirma tu asistencia en los próximos 30 minutos.',
    fechaEnvio: new Date('2024-01-15T10:30:00'),
    estado: 'enviada',
    canal: 'email',
  },
];

export const getNotificaciones = async (
  socioId?: string,
  claseId?: string
): Promise<Notificacion[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filtered = [...notificacionesMock];
  
  if (socioId) {
    filtered = filtered.filter(n => n.destinatario === socioId);
  }
  
  if (claseId) {
    filtered = filtered.filter(n => n.claseId === claseId);
  }
  
  return filtered;
};

export const enviarNotificacionDisponibilidad = async (
  listaEsperaId: string
): Promise<Notificacion> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En producción, aquí se obtendría la información de la lista de espera
  const nuevaNotificacion: Notificacion = {
    id: `notif-${Date.now()}`,
    tipo: 'disponibilidad_plaza',
    destinatario: 'socio-1',
    claseId: 'clase-1',
    mensaje: 'Se ha liberado una plaza. Confirma tu asistencia en los próximos 30 minutos.',
    fechaEnvio: new Date(),
    estado: 'pendiente',
    canal: 'email',
  };
  
  notificacionesMock.push(nuevaNotificacion);
  return nuevaNotificacion;
};

export const enviarRecordatorio = async (
  reservaId: string,
  tipo: '24h' | '2h'
): Promise<Notificacion> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const nuevaNotificacion: Notificacion = {
    id: `notif-${Date.now()}`,
    tipo: 'recordatorio_clase',
    destinatario: 'socio-1',
    claseId: 'clase-1',
    mensaje: tipo === '24h' 
      ? 'Recuerda que tienes una clase mañana. ¡Te esperamos!'
      : 'Tu clase es en 2 horas. ¡Nos vemos pronto!',
    fechaEnvio: new Date(),
    estado: 'pendiente',
    canal: 'email',
  };
  
  notificacionesMock.push(nuevaNotificacion);
  return nuevaNotificacion;
};

export const marcarNotificacionLeida = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const notificacion = notificacionesMock.find(n => n.id === id);
  if (notificacion) {
    notificacion.estado = 'leida';
  }
};

export const procesarNotificacionesPendientes = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  // Simular procesamiento de notificaciones pendientes
  notificacionesMock
    .filter(n => n.estado === 'pendiente')
    .forEach(n => {
      n.estado = 'enviada';
    });
};

