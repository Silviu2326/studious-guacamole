import { Membresia, UpdateMembresiaRequest, Pago } from '../types';

// Mock data - En producción esto sería llamadas a API real
const mockMembresias: Membresia[] = [
  {
    id: '1',
    clienteId: 'c1',
    clienteNombre: 'Juan Pérez',
    clienteEmail: 'juan@example.com',
    clienteTelefono: '+34600123456',
    tipo: 'privada-pt',
    planId: 'p1',
    planNombre: 'Plan Mensual PT',
    precioMensual: 150,
    fechaInicio: '2024-01-15',
    fechaVencimiento: '2024-12-15',
    estado: 'activa',
    estadoPago: 'pagado',
    ultimoPago: {
      id: 'pay1',
      membresiaId: '1',
      monto: 150,
      fecha: '2024-10-01',
      metodoPago: 'transferencia',
      estado: 'completado',
      referencia: 'TRF-2024-001',
    },
    proximoVencimiento: '2024-11-01',
    entrenadorId: 'trainer1',
    historialPagos: [
      {
        id: 'pay1',
        membresiaId: '1',
        monto: 150,
        fecha: '2024-10-01',
        metodoPago: 'transferencia',
        estado: 'completado',
        referencia: 'TRF-2024-001',
      },
      {
        id: 'pay2',
        membresiaId: '1',
        monto: 150,
        fecha: '2024-09-01',
        metodoPago: 'tarjeta',
        estado: 'completado',
      },
    ],
    fechaCreacion: '2024-01-15',
    fechaActualizacion: '2024-10-01',
  },
  {
    id: '2',
    clienteId: 'c2',
    clienteNombre: 'María García',
    clienteEmail: 'maria@example.com',
    clienteTelefono: '+34600123457',
    tipo: 'privada-pt',
    planId: 'p1',
    planNombre: 'Plan Mensual PT',
    precioMensual: 150,
    fechaInicio: '2024-09-01',
    fechaVencimiento: '2024-12-01',
    estado: 'activa',
    estadoPago: 'pendiente',
    proximoVencimiento: '2024-11-01',
    entrenadorId: 'trainer1',
    historialPagos: [
      {
        id: 'pay3',
        membresiaId: '2',
        monto: 150,
        fecha: '2024-09-01',
        metodoPago: 'transferencia',
        estado: 'completado',
      },
    ],
    fechaCreacion: '2024-09-01',
    fechaActualizacion: '2024-10-01',
  },
  {
    id: '3',
    clienteId: 'c3',
    clienteNombre: 'Carlos López',
    clienteEmail: 'carlos@example.com',
    clienteTelefono: '+34600123458',
    tipo: 'gimnasio',
    planId: 'p2',
    planNombre: 'Membresía Premium',
    precioMensual: 80,
    fechaInicio: '2024-08-01',
    fechaVencimiento: '2024-11-01',
    estado: 'vencida',
    estadoPago: 'vencido',
    diasMorosidad: 5,
    ultimoPago: {
      id: 'pay4',
      membresiaId: '3',
      monto: 80,
      fecha: '2024-09-01',
      metodoPago: 'tarjeta',
      estado: 'completado',
    },
    proximoVencimiento: '2024-11-01',
    historialPagos: [
      {
        id: 'pay4',
        membresiaId: '3',
        monto: 80,
        fecha: '2024-09-01',
        metodoPago: 'tarjeta',
        estado: 'completado',
      },
    ],
    fechaCreacion: '2024-08-01',
    fechaActualizacion: '2024-10-06',
  },
  {
    id: '4',
    clienteId: 'c4',
    clienteNombre: 'Ana Martínez',
    clienteEmail: 'ana@example.com',
    clienteTelefono: '+34600123459',
    tipo: 'gimnasio',
    planId: 'p3',
    planNombre: 'Membresía Básica',
    precioMensual: 50,
    fechaInicio: '2024-07-01',
    fechaVencimiento: '2024-11-01',
    estado: 'activa',
    estadoPago: 'pagado',
    ultimoPago: {
      id: 'pay5',
      membresiaId: '4',
      monto: 50,
      fecha: '2024-10-01',
      metodoPago: 'efectivo',
      estado: 'completado',
    },
    proximoVencimiento: '2024-11-01',
    historialPagos: [
      {
        id: 'pay5',
        membresiaId: '4',
        monto: 50,
        fecha: '2024-10-01',
        metodoPago: 'efectivo',
        estado: 'completado',
      },
    ],
    fechaCreacion: '2024-07-01',
    fechaActualizacion: '2024-10-01',
  },
];

export const getMembresiasActivas = async (
  role: 'entrenador' | 'gimnasio',
  userId?: string
): Promise<Membresia[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  if (role === 'entrenador') {
    // Para entrenadores, solo membresías privadas PT de ese entrenador
    return mockMembresias.filter(
      m => m.tipo === 'privada-pt' && m.entrenadorId === userId
    );
  } else {
    // Para gimnasios, todas las membresías del gimnasio
    return mockMembresias.filter(m => m.tipo === 'gimnasio');
  }
};

export const getSociosActivos = async (
  role: 'entrenador' | 'gimnasio',
  userId?: string
): Promise<Membresia[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Similar a getMembresiasActivas pero enfocado en socios
  if (role === 'entrenador') {
    return mockMembresias.filter(
      m => m.tipo === 'privada-pt' && m.entrenadorId === userId
    );
  } else {
    return mockMembresias.filter(m => m.tipo === 'gimnasio');
  }
};

export const getEstadoPago = async (
  membresiaId: string
): Promise<{ estado: string; ultimoPago?: Pago; proximoVencimiento?: string }> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const membresia = mockMembresias.find(m => m.id === membresiaId);
  if (!membresia) {
    throw new Error('Membresía no encontrada');
  }
  
  return {
    estado: membresia.estadoPago,
    ultimoPago: membresia.ultimoPago,
    proximoVencimiento: membresia.proximoVencimiento,
  };
};

export const updateMembresia = async (
  id: string,
  data: UpdateMembresiaRequest
): Promise<Membresia> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const membresia = mockMembresias.find(m => m.id === id);
  if (!membresia) {
    throw new Error('Membresía no encontrada');
  }
  
  return {
    ...membresia,
    ...data,
    fechaActualizacion: new Date().toISOString().split('T')[0],
  };
};

export const cancelMembresia = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  // En producción, actualizaría el estado a 'cancelada'
};

export const renewMembresia = async (id: string): Promise<Membresia> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const membresia = mockMembresias.find(m => m.id === id);
  if (!membresia) {
    throw new Error('Membresía no encontrada');
  }
  
  // Extender membresía por un mes más
  const nuevaFecha = new Date(membresia.fechaVencimiento);
  nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
  
  return {
    ...membresia,
    fechaVencimiento: nuevaFecha.toISOString().split('T')[0],
    estado: 'activa',
    fechaActualizacion: new Date().toISOString().split('T')[0],
  };
};

export const processPayment = async (
  membresiaId: string,
  monto: number,
  metodoPago: string
): Promise<Pago> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const nuevoPago: Pago = {
    id: `pay-${Date.now()}`,
    membresiaId,
    monto,
    fecha: new Date().toISOString().split('T')[0],
    metodoPago: metodoPago as any,
    estado: 'completado',
    referencia: `REF-${Date.now()}`,
  };
  
  return nuevoPago;
};

export const sendReminder = async (membresiaId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  // En producción, enviaría un recordatorio por email/SMS
};

