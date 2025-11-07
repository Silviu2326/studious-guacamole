import { Baja, MotivoBaja, CreateMotivoBajaRequest, UpdateMotivoBajaRequest } from '../types';

// Datos falsos para bajas
const datosFalsosBajas: Baja[] = [
  {
    id: 'baj-001',
    cliente: { id: 'cl-101', nombre: 'Roberto Díaz Valero', email: 'roberto.diaz@email.com', telefono: '+34 678 901 234' },
    membresiaId: 'mem-101',
    motivoId: 'mot-002',
    motivoTexto: 'Precio elevado de la membresía',
    categoria: 'Motivos Economicos',
    fechaBaja: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    fechaRegistro: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    notas: 'Cliente encontró una alternativa más económica en otro gimnasio',
  },
  {
    id: 'baj-002',
    cliente: { id: 'cl-102', nombre: 'Sofia Ramírez Castro', email: 'sofia.ramirez@email.com', telefono: '+34 689 012 345' },
    membresiaId: 'mem-102',
    motivoId: 'mot-005',
    motivoTexto: 'Cambio de residencia',
    categoria: 'Motivos de Ubicacion',
    fechaBaja: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    fechaRegistro: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    notas: 'Se mudó a otra ciudad por trabajo',
  },
  {
    id: 'baj-003',
    cliente: { id: 'cl-103', nombre: 'Daniel Herrera Mora', email: 'daniel.herrera@email.com', telefono: '+34 690 123 456' },
    membresiaId: 'mem-103',
    motivoId: 'mot-003',
    motivoTexto: 'Horarios no disponibles',
    categoria: 'Motivos de Servicio',
    fechaBaja: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    fechaRegistro: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    notas: 'Los horarios de clases no coinciden con su disponibilidad',
  },
  {
    id: 'baj-004',
    cliente: { id: 'cl-104', nombre: 'Carmen Torres Gil', email: 'carmen.torres@email.com', telefono: '+34 691 234 567' },
    membresiaId: 'mem-104',
    motivoId: 'mot-006',
    motivoTexto: 'Problema de salud',
    categoria: 'Motivos de Salud',
    fechaBaja: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    fechaRegistro: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    notas: 'Lesión en rodilla, debe hacer reposo prolongado',
  },
  {
    id: 'baj-005',
    cliente: { id: 'cl-105', nombre: 'Alejandro Moreno Nieto', email: 'alejandro.moreno@email.com', telefono: '+34 692 345 678' },
    membresiaId: 'mem-105',
    motivoId: 'mot-004',
    motivoTexto: 'Falta de tiempo',
    categoria: 'Motivos Personales',
    fechaBaja: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    fechaRegistro: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    notas: 'Trabajo exigente no le permite dedicar tiempo al gimnasio',
  },
  {
    id: 'baj-006',
    cliente: { id: 'cl-106', nombre: 'Isabel Jiménez Pardo', email: 'isabel.jimenez@email.com', telefono: '+34 693 456 789' },
    membresiaId: 'mem-106',
    motivoId: 'mot-001',
    motivoTexto: 'Instalaciones necesitan mejoras',
    categoria: 'Motivos de Servicio',
    fechaBaja: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    fechaRegistro: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notas: 'Espacios muy pequeños y equipo anticuado',
  },
];

export async function getBajas(): Promise<Baja[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  return datosFalsosBajas;
}

export async function procesarBaja(
  id: string,
  motivoId?: string,
  motivoTexto?: string
): Promise<Baja | null> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const baja = datosFalsosBajas.find(b => b.id === id);
  return baja || null;
}

export async function cancelarBaja(id: string): Promise<boolean> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = datosFalsosBajas.findIndex(b => b.id === id);
  if (index !== -1) {
    datosFalsosBajas.splice(index, 1);
    return true;
  }
  return false;
}

export async function exportarBajas(): Promise<Blob | null> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Crear un blob CSV simple
  const csv = 'Cliente,Email,Motivo,Categoría,Fecha Baja\n' +
    datosFalsosBajas.map(b => 
      `"${b.cliente.nombre}","${b.cliente.email}","${b.motivoTexto || ''}","${b.categoria || ''}","${b.fechaBaja}"`
    ).join('\n');
  
  return new Blob([csv], { type: 'text/csv' });
}

// Datos falsos para motivos de baja
const datosFalsosMotivos: MotivoBaja[] = [
  {
    id: 'mot-001',
    nombre: 'Instalaciones necesitan mejoras',
    categoria: 'Motivos de Servicio',
    descripcion: 'Cliente menciona que las instalaciones no cumplen sus expectativas',
    activo: true,
  },
  {
    id: 'mot-002',
    nombre: 'Precio elevado de la membresía',
    categoria: 'Motivos Economicos',
    descripcion: 'El costo de la membresía es demasiado alto para el cliente',
    activo: true,
  },
  {
    id: 'mot-003',
    nombre: 'Horarios no disponibles',
    categoria: 'Motivos de Servicio',
    descripcion: 'Los horarios de clases no coinciden con la disponibilidad del cliente',
    activo: true,
  },
  {
    id: 'mot-004',
    nombre: 'Falta de tiempo',
    categoria: 'Motivos Personales',
    descripcion: 'El cliente no tiene tiempo suficiente para asistir al gimnasio',
    activo: true,
  },
  {
    id: 'mot-005',
    nombre: 'Cambio de residencia',
    categoria: 'Motivos de Ubicacion',
    descripcion: 'El cliente se mudó a otra ubicación',
    activo: true,
  },
  {
    id: 'mot-006',
    nombre: 'Problema de salud',
    categoria: 'Motivos de Salud',
    descripcion: 'El cliente tiene una lesión o condición de salud que le impide entrenar',
    activo: true,
  },
  {
    id: 'mot-007',
    nombre: 'Falta de motivación',
    categoria: 'Motivos Personales',
    descripcion: 'El cliente perdió el interés o motivación para continuar',
    activo: true,
  },
  {
    id: 'mot-008',
    nombre: 'Condiciones climáticas',
    categoria: 'Motivos Personales',
    descripcion: 'Prefiere hacer ejercicio al aire libre en otra temporada',
    activo: false,
  },
];

export async function getMotivosBaja(): Promise<MotivoBaja[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  return datosFalsosMotivos;
}

export async function crearMotivoBaja(data: CreateMotivoBajaRequest): Promise<MotivoBaja | null> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const nuevoMotivo: MotivoBaja = {
    id: `mot-${Date.now()}`,
    ...data,
    activo: true,
  };
  datosFalsosMotivos.push(nuevoMotivo);
  return nuevoMotivo;
}

export async function actualizarMotivoBaja(
  id: string,
  data: UpdateMotivoBajaRequest
): Promise<boolean> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = datosFalsosMotivos.findIndex(m => m.id === id);
  if (index !== -1) {
    datosFalsosMotivos[index] = { ...datosFalsosMotivos[index], ...data };
    return true;
  }
  return false;
}

export async function eliminarMotivoBaja(id: string): Promise<boolean> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = datosFalsosMotivos.findIndex(m => m.id === id);
  if (index !== -1) {
    datosFalsosMotivos.splice(index, 1);
    return true;
  }
  return false;
}
