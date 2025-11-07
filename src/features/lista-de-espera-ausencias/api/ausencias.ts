import {
  Ausencia,
  Reserva,
  Clase,
  Socio,
  FiltroAusencias,
  AnalyticsAusencias,
} from '../types';

// Datos mock
const ausenciasMock: Ausencia[] = [
  {
    id: 'ausencia-1',
    reservaId: 'reserva-1',
    claseId: 'clase-1',
    socioId: 'socio-1',
    fechaAusencia: new Date('2024-01-15'),
    tipo: 'no_show',
    notificadoListaEspera: true,
    penalizacion: {
      tipo: 'multa',
      monto: 10,
    },
  },
];

const reservasMock: Reserva[] = [
  {
    id: 'reserva-1',
    claseId: 'clase-1',
    socioId: 'socio-1',
    fechaReserva: new Date('2024-01-14'),
    estado: 'ausente',
  },
];

export const getAusencias = async (filters?: FiltroAusencias): Promise<Ausencia[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filtered = [...ausenciasMock];
  
  if (filters?.claseId) {
    filtered = filtered.filter(item => item.claseId === filters.claseId);
  }
  
  if (filters?.socioId) {
    filtered = filtered.filter(item => item.socioId === filters.socioId);
  }
  
  if (filters?.tipo) {
    filtered = filtered.filter(item => item.tipo === filters.tipo);
  }
  
  if (filters?.conPenalizacion) {
    filtered = filtered.filter(item => item.penalizacion !== undefined);
  }
  
  return filtered;
};

export const registrarAusencia = async (
  reservaId: string,
  tipo: 'no_show' | 'cancelacion_tardia' | 'ausencia_justificada',
  justificacion?: string
): Promise<Ausencia> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const reserva = reservasMock.find(r => r.id === reservaId);
  if (!reserva) {
    throw new Error('Reserva no encontrada');
  }
  
  const nuevaAusencia: Ausencia = {
    id: `ausencia-${Date.now()}`,
    reservaId,
    claseId: reserva.claseId,
    socioId: reserva.socioId,
    fechaAusencia: new Date(),
    tipo,
    notificadoListaEspera: false,
  };
  
  // Aplicar penalización según tipo
  if (tipo === 'no_show') {
    nuevaAusencia.penalizacion = {
      tipo: 'multa',
      monto: 10,
    };
  }
  
  ausenciasMock.push(nuevaAusencia);
  reserva.estado = 'ausente';
  
  return nuevaAusencia;
};

export const liberarPlaza = async (reservaId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const reserva = reservasMock.find(r => r.id === reservaId);
  if (reserva) {
    reserva.estado = 'cancelada';
  }
};

export const getAnalyticsAusencias = async (
  periodo: 'diario' | 'semanal' | 'mensual' = 'mensual'
): Promise<AnalyticsAusencias> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    periodo,
    totalAusencias: ausenciasMock.length,
    ausenciasPorTipo: {
      no_show: ausenciasMock.filter(a => a.tipo === 'no_show').length,
      cancelacion_tardia: ausenciasMock.filter(a => a.tipo === 'cancelacion_tardia').length,
      ausencia_justificada: ausenciasMock.filter(a => a.tipo === 'ausencia_justificada').length,
    },
    clasesMasAfectadas: [
      {
        claseId: 'clase-1',
        nombreClase: 'Yoga Matutino',
        ausencias: 3,
      },
    ],
    sociosMasAusentes: [
      {
        socioId: 'socio-1',
        nombre: 'Juan Pérez',
        ausencias: 2,
      },
    ],
    tasaAusencias: 15.5,
    tendencia: 'disminuyendo',
    impactoFinanciero: 120,
  };
};

