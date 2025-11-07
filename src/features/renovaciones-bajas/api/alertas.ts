import { AlertaVencimiento, AccionAlerta } from '../types';

// Datos falsos para alertas de vencimiento
const datosFalsosAlertas: AlertaVencimiento[] = [
  {
    id: 'alt-001',
    renovacionId: 'ren-001',
    cliente: { id: 'cl-007', nombre: 'Elena Vidal Soto', email: 'elena.vidal@email.com', telefono: '+34 694 567 890' },
    tipo: 'bono-pt',
    fechaVencimiento: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    diasRestantes: 1,
    prioridad: 'alta',
    leida: false,
    fechaCreacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    mensaje: 'Tu bono PT expira en 1 día. ¡Renueva ahora!',
  },
  {
    id: 'alt-002',
    renovacionId: 'ren-003',
    cliente: { id: 'cl-003', nombre: 'Ana López Sánchez', email: 'ana.lopez@email.com', telefono: '+34 634 567 890' },
    tipo: 'bono-pt',
    fechaVencimiento: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    diasRestantes: 2,
    prioridad: 'alta',
    leida: false,
    fechaCreacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    mensaje: 'Tu bono PT expira en 2 días. Contacta con tu entrenador.',
  },
  {
    id: 'alt-003',
    renovacionId: 'ren-005',
    cliente: { id: 'cl-005', nombre: 'Laura Martínez Jiménez', email: 'laura.martinez@email.com', telefono: '+34 656 789 012' },
    tipo: 'bono-pt',
    fechaVencimiento: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    diasRestantes: 20,
    prioridad: 'baja',
    leida: true,
    fechaCreacion: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    mensaje: 'Tu bono PT expira en 20 días. Plantea renovar próximamente.',
  },
  {
    id: 'alt-004',
    renovacionId: 'ren-007',
    cliente: { id: 'cl-008', nombre: 'Miguel Ortiz Blanco', email: 'miguel.ortiz@email.com', telefono: '+34 695 678 901' },
    tipo: 'cuota-mensual',
    fechaVencimiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    diasRestantes: 7,
    prioridad: 'media',
    leida: false,
    fechaCreacion: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    mensaje: 'Tu membresía mensual expira en 7 días. Renueva para mantener tu acceso.',
  },
  {
    id: 'alt-005',
    renovacionId: 'ren-008',
    cliente: { id: 'cl-009', nombre: 'Patricia Serrano Ruiz', email: 'patricia.serrano@email.com', telefono: '+34 696 789 012' },
    tipo: 'cuota-mensual',
    fechaVencimiento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    diasRestantes: 15,
    prioridad: 'media',
    leida: true,
    fechaCreacion: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    mensaje: 'Tu membresía mensual expira en 15 días. Considera renovar.',
  },
  {
    id: 'alt-006',
    renovacionId: 'ren-009',
    cliente: { id: 'cl-010', nombre: 'Javier Morales Castillo', email: 'javier.morales@email.com', telefono: '+34 697 890 123' },
    tipo: 'bono-pt',
    fechaVencimiento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    diasRestantes: 3,
    prioridad: 'alta',
    leida: false,
    fechaCreacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    mensaje: 'Tu bono PT expira en 3 días. ¡Urgente renovar!',
  },
];

export async function getAlertasVencimiento(userType: 'entrenador' | 'gimnasio'): Promise<AlertaVencimiento[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filtrar según el tipo de usuario
  if (userType === 'entrenador') {
    return datosFalsosAlertas.filter(a => a.tipo === 'bono-pt');
  }
  return datosFalsosAlertas;
}

export async function marcarAlertaLeida(alertaId: string): Promise<boolean> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const alerta = datosFalsosAlertas.find(a => a.id === alertaId);
  if (alerta) {
    alerta.leida = true;
    return true;
  }
  return false;
}

export async function procesarAlerta(alertaId: string, accion: AccionAlerta): Promise<boolean> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = datosFalsosAlertas.findIndex(a => a.id === alertaId);
  if (index !== -1) {
    datosFalsosAlertas.splice(index, 1);
    return true;
  }
  return false;
}

export async function descartarAlerta(alertaId: string): Promise<boolean> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = datosFalsosAlertas.findIndex(a => a.id === alertaId);
  if (index !== -1) {
    datosFalsosAlertas.splice(index, 1);
    return true;
  }
  return false;
}
