export interface RegistroPeso {
  id?: string;
  clienteId: string;
  fecha: string;
  peso: number; // En kg
  observaciones?: string;
  createdAt?: string;
}

// Mock data
const registrosPesoMock: RegistroPeso[] = [
  {
    id: '1',
    clienteId: 'cliente1',
    fecha: new Date().toISOString().split('T')[0],
    peso: 75.5,
    observaciones: 'Peso matutino',
  },
  {
    id: '2',
    clienteId: 'cliente1',
    fecha: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    peso: 75.8,
    observaciones: 'Después del entrenamiento',
  },
  {
    id: '3',
    clienteId: 'cliente1',
    fecha: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    peso: 75.2,
    observaciones: 'Peso matutino',
  },
  {
    id: '4',
    clienteId: 'cliente1',
    fecha: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    peso: 75.9,
    observaciones: '',
  },
  {
    id: '5',
    clienteId: 'cliente1',
    fecha: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
    peso: 76.1,
    observaciones: 'Fin de semana',
  },
  {
    id: '6',
    clienteId: 'cliente1',
    fecha: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    peso: 76.0,
    observaciones: '',
  },
  {
    id: '7',
    clienteId: 'cliente1',
    fecha: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0],
    peso: 76.3,
    observaciones: 'Después del entrenamiento',
  },
];

export async function getRegistrosPeso(clienteId: string, fechaInicio?: string, fechaFin?: string): Promise<RegistroPeso[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  let resultado = registrosPesoMock.filter(r => r.clienteId === clienteId);
  
  if (fechaInicio) {
    resultado = resultado.filter(r => r.fecha >= fechaInicio);
  }
  if (fechaFin) {
    resultado = resultado.filter(r => r.fecha <= fechaFin);
  }
  
  return resultado.sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export async function crearRegistroPeso(registro: Omit<RegistroPeso, 'id' | 'createdAt'>): Promise<RegistroPeso | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const nuevoRegistro: RegistroPeso = {
    ...registro,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  registrosPesoMock.push(nuevoRegistro);
  return nuevoRegistro;
}

export async function actualizarRegistroPeso(id: string, registro: Partial<RegistroPeso>): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = registrosPesoMock.findIndex(r => r.id === id);
  if (index === -1) return false;
  
  registrosPesoMock[index] = { ...registrosPesoMock[index], ...registro };
  return true;
}

export async function getTendenciaPeso(clienteId: string, dias?: number): Promise<{
  pesoInicial: number;
  pesoActual: number;
  diferencia: number;
  tendencia: 'bajando' | 'estable' | 'subiendo';
  registros: RegistroPeso[];
}> {
  await new Promise(resolve => setTimeout(resolve, 250));
  
  const registros = registrosPesoMock
    .filter(r => r.clienteId === clienteId)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
  
  if (registros.length < 2) {
    return {
      pesoInicial: registros[0]?.peso || 0,
      pesoActual: registros[0]?.peso || 0,
      diferencia: 0,
      tendencia: 'estable',
      registros,
    };
  }
  
  const pesoActual = registros[0].peso;
  const pesoInicial = registros[registros.length - 1].peso;
  const diferencia = pesoActual - pesoInicial;
  
  let tendencia: 'bajando' | 'estable' | 'subiendo';
  if (Math.abs(diferencia) < 0.5) {
    tendencia = 'estable';
  } else if (diferencia > 0) {
    tendencia = 'subiendo';
  } else {
    tendencia = 'bajando';
  }
  
  return {
    pesoInicial,
    pesoActual,
    diferencia,
    tendencia,
    registros,
  };
}

