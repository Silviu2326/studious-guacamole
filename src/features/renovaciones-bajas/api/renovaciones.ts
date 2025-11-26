import { Renovacion, ProcessRenovacionRequest } from '../types';

// Datos falsos para renovaciones
const datosFalsosRenovaciones: Renovacion[] = [
  {
    id: 'ren-001',
    membresiaId: 'mem-001',
    cliente: { id: 'cl-001', nombre: 'María González Pérez', email: 'maria.gonzalez@email.com', telefono: '+34 612 345 678' },
    membresia: { id: 'mem-001', clienteId: 'cl-001', tipo: 'bono-pt', fechaVencimiento: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), activa: true },
    estado: 'pendiente',
    fechaCreacion: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    fechaVencimiento: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    diasRestantes: 5,
    intentosRecordatorio: 2,
  },
  {
    id: 'ren-002',
    membresiaId: 'mem-002',
    cliente: { id: 'cl-002', nombre: 'Carlos Ruiz Martínez', email: 'carlos.ruiz@email.com', telefono: '+34 623 456 789' },
    membresia: { id: 'mem-002', clienteId: 'cl-002', tipo: 'cuota-mensual', fechaVencimiento: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), activa: true },
    estado: 'pendiente',
    fechaCreacion: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    fechaVencimiento: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    diasRestantes: 10,
    intentosRecordatorio: 1,
  },
  {
    id: 'ren-003',
    membresiaId: 'mem-003',
    cliente: { id: 'cl-003', nombre: 'Ana López Sánchez', email: 'ana.lopez@email.com', telefono: '+34 634 567 890' },
    membresia: { id: 'mem-003', clienteId: 'cl-003', tipo: 'bono-pt', fechaVencimiento: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), activa: true },
    estado: 'pendiente',
    fechaCreacion: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    fechaVencimiento: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    diasRestantes: 2,
    intentosRecordatorio: 3,
  },
  {
    id: 'ren-004',
    membresiaId: 'mem-004',
    cliente: { id: 'cl-004', nombre: 'Juan García Fernández', email: 'juan.garcia@email.com', telefono: '+34 645 678 901' },
    membresia: { id: 'mem-004', clienteId: 'cl-004', tipo: 'cuota-mensual', fechaVencimiento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), activa: true },
    estado: 'procesada',
    fechaCreacion: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    fechaVencimiento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    diasRestantes: 15,
    intentosRecordatorio: 0,
    fechaProcesamiento: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ren-005',
    membresiaId: 'mem-005',
    cliente: { id: 'cl-005', nombre: 'Laura Martínez Jiménez', email: 'laura.martinez@email.com', telefono: '+34 656 789 012' },
    membresia: { id: 'mem-005', clienteId: 'cl-005', tipo: 'bono-pt', fechaVencimiento: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), activa: true },
    estado: 'pendiente',
    fechaCreacion: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    fechaVencimiento: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    diasRestantes: 20,
    intentosRecordatorio: 0,
  },
  {
    id: 'ren-006',
    membresiaId: 'mem-006',
    cliente: { id: 'cl-006', nombre: 'Pedro Sánchez López', email: 'pedro.sanchez@email.com', telefono: '+34 667 890 123' },
    membresia: { id: 'mem-006', clienteId: 'cl-006', tipo: 'cuota-mensual', fechaVencimiento: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), activa: true },
    estado: 'cancelada',
    fechaCreacion: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    fechaVencimiento: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    diasRestantes: 8,
    intentosRecordatorio: 1,
  },
];

export async function getRenovaciones(userType: 'entrenador' | 'gimnasio'): Promise<Renovacion[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filtrar según el tipo de usuario
  if (userType === 'entrenador') {
    return datosFalsosRenovaciones.filter(r => r.membresia.tipo === 'bono-pt');
  }
  return datosFalsosRenovaciones;
}

export async function procesarRenovacion(
  id: string,
  data: ProcessRenovacionRequest
): Promise<Renovacion | null> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const renovacion = datosFalsosRenovaciones.find(r => r.id === id);
  if (renovacion) {
    return { ...renovacion, estado: 'procesada', fechaProcesamiento: new Date().toISOString() };
  }
  return null;
}

export async function cancelarRenovacion(id: string): Promise<boolean> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const renovacion = datosFalsosRenovaciones.find(r => r.id === id);
  return renovacion !== undefined;
}

export async function enviarRecordatorio(id: string): Promise<boolean> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const renovacion = datosFalsosRenovaciones.find(r => r.id === id);
  if (renovacion) {
    renovacion.intentosRecordatorio += 1;
    return true;
  }
  return false;
}
