import {
  ListaEspera,
  Reserva,
  Clase,
  Socio,
  FiltroListaEspera,
} from '../types';

// Datos mock - en producción estos serían llamadas reales a la API
const listaEsperaMock: ListaEspera[] = [
  {
    id: '1',
    claseId: 'clase-1',
    socioId: 'socio-1',
    fechaIngreso: new Date('2024-01-15T10:00:00'),
    posicion: 1,
    prioridad: 'normal',
    estado: 'activa',
    tiempoLimiteRespuesta: 30,
  },
  {
    id: '2',
    claseId: 'clase-1',
    socioId: 'socio-2',
    fechaIngreso: new Date('2024-01-15T10:05:00'),
    posicion: 2,
    prioridad: 'premium',
    estado: 'activa',
    tiempoLimiteRespuesta: 30,
  },
];

const clasesMock: Clase[] = [
  {
    id: 'clase-1',
    nombre: 'Yoga Matutino',
    fecha: new Date('2024-01-16'),
    horaInicio: '08:00',
    horaFin: '09:00',
    instructor: 'María González',
    capacidadMaxima: 15,
    reservasConfirmadas: 15,
    estado: 'programada',
  },
];

const sociosMock: Socio[] = [
  {
    id: 'socio-1',
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    telefono: '+34 600 123 456',
    membresia: 'Premium',
  },
  {
    id: 'socio-2',
    nombre: 'Ana García',
    email: 'ana@example.com',
    telefono: '+34 600 789 012',
    membresia: 'Básica',
  },
];

export const getListaEspera = async (filters?: FiltroListaEspera): Promise<ListaEspera[]> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filtered = [...listaEsperaMock];
  
  if (filters?.claseId) {
    filtered = filtered.filter(item => item.claseId === filters.claseId);
  }
  
  if (filters?.socioId) {
    filtered = filtered.filter(item => item.socioId === filters.socioId);
  }
  
  if (filters?.estado) {
    filtered = filtered.filter(item => item.estado === filters.estado);
  }
  
  if (filters?.prioridad) {
    filtered = filtered.filter(item => item.prioridad === filters.prioridad);
  }
  
  return filtered;
};

export const getListaEsperaByClase = async (claseId: string): Promise<ListaEspera[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return listaEsperaMock.filter(item => item.claseId === claseId);
};

export const addToListaEspera = async (
  claseId: string,
  socioId: string,
  prioridad: 'normal' | 'premium' | 'alta' = 'normal'
): Promise<ListaEspera> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const listaEsperaClase = listaEsperaMock.filter(item => item.claseId === claseId);
  const nuevaPosicion = listaEsperaClase.length + 1;
  
  const nuevaListaEspera: ListaEspera = {
    id: `lista-${Date.now()}`,
    claseId,
    socioId,
    fechaIngreso: new Date(),
    posicion: nuevaPosicion,
    prioridad,
    estado: 'activa',
    tiempoLimiteRespuesta: 30,
  };
  
  listaEsperaMock.push(nuevaListaEspera);
  return nuevaListaEspera;
};

export const removeFromListaEspera = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = listaEsperaMock.findIndex(item => item.id === id);
  if (index > -1) {
    listaEsperaMock.splice(index, 1);
    // Reordenar posiciones
    listaEsperaMock.forEach((item, idx) => {
      item.posicion = idx + 1;
    });
  }
};

export const updateListaEspera = async (
  id: string,
  updates: Partial<ListaEspera>
): Promise<ListaEspera> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = listaEsperaMock.findIndex(item => item.id === id);
  
  if (index === -1) {
    throw new Error('Lista de espera no encontrada');
  }
  
  listaEsperaMock[index] = { ...listaEsperaMock[index], ...updates };
  return listaEsperaMock[index];
};

export const confirmarReservaDesdeLista = async (
  listaEsperaId: string
): Promise<Reserva> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const listaEspera = listaEsperaMock.find(item => item.id === listaEsperaId);
  if (!listaEspera) {
    throw new Error('Lista de espera no encontrada');
  }
  
  // Actualizar estado de lista de espera
  listaEspera.estado = 'confirmada';
  listaEspera.fechaConfirmacion = new Date();
  
  // Crear reserva confirmada
  const nuevaReserva: Reserva = {
    id: `reserva-${Date.now()}`,
    claseId: listaEspera.claseId,
    socioId: listaEspera.socioId,
    fechaReserva: new Date(),
    estado: 'confirmada',
    fechaConfirmacion: new Date(),
  };
  
  // Remover de lista de espera
  await removeFromListaEspera(listaEsperaId);
  
  return nuevaReserva;
};

export const getClase = async (id: string): Promise<Clase | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return clasesMock.find(c => c.id === id) || null;
};

export const getSocio = async (id: string): Promise<Socio | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return sociosMock.find(s => s.id === id) || null;
};

