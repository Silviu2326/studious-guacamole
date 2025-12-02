import type {
  ProgresoCliente,
  MetricaFuerza,
  MetricaRangoMovimiento,
  FotoComparativa,
  HistorialRendimiento,
  ResumenProgreso,
} from '../types';

const API_BASE = '/api/entrenamiento/progreso';

export async function getProgresos(): Promise<ProgresoCliente[]> {
  // Simulación de API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          clienteId: 'c1',
          clienteNombre: 'Juan Pérez',
          fechaRegistro: '2024-01-15',
          fechaUltimaActualizacion: '2024-12-20',
          estado: 'activo',
        },
        {
          id: '2',
          clienteId: 'c2',
          clienteNombre: 'María García',
          fechaRegistro: '2024-02-10',
          fechaUltimaActualizacion: '2024-12-18',
          estado: 'activo',
        },
      ]);
    }, 500);
  });
}

export async function getProgresoPorCliente(clienteId: string): Promise<ProgresoCliente | null> {
  const progresos = await getProgresos();
  return progresos.find(p => p.clienteId === clienteId) || null;
}

export async function crearProgreso(
  clienteId: string,
  datosIniciales: Partial<ProgresoCliente>
): Promise<ProgresoCliente> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now().toString(),
        clienteId,
        clienteNombre: datosIniciales.clienteNombre || 'Cliente',
        fechaRegistro: new Date().toISOString().split('T')[0],
        fechaUltimaActualizacion: new Date().toISOString().split('T')[0],
        estado: 'activo',
      });
    }, 500);
  });
}

export async function getMetricasFuerza(progresoId: string): Promise<MetricaFuerza[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          progresoId,
          ejercicioId: 'e1',
          ejercicioNombre: 'Press de Banca',
          pesoMaximo: 80,
          repeticionesMaximas: 8,
          fecha: '2024-12-20',
          notas: 'Buen progreso',
        },
        {
          id: '2',
          progresoId,
          ejercicioId: 'e2',
          ejercicioNombre: 'Sentadillas',
          pesoMaximo: 100,
          repeticionesMaximas: 10,
          fecha: '2024-12-18',
        },
      ]);
    }, 500);
  });
}

export async function registrarMetricaFuerza(
  progresoId: string,
  metrica: Omit<MetricaFuerza, 'id' | 'progresoId'>
): Promise<MetricaFuerza> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now().toString(),
        progresoId,
        ...metrica,
      });
    }, 500);
  });
}

export async function getMetricasRangoMovimiento(progresoId: string): Promise<MetricaRangoMovimiento[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          progresoId,
          ejercicioId: 'e3',
          ejercicioNombre: 'Flexión de Cadera',
          rangoGrados: 120,
          flexibilidadScore: 85,
          fecha: '2024-12-20',
        },
      ]);
    }, 500);
  });
}

export async function registrarMetricaRangoMovimiento(
  progresoId: string,
  metrica: Omit<MetricaRangoMovimiento, 'id' | 'progresoId'>
): Promise<MetricaRangoMovimiento> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now().toString(),
        progresoId,
        ...metrica,
      });
    }, 500);
  });
}

export async function getFotosComparativas(progresoId: string): Promise<FotoComparativa[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          progresoId,
          tipo: 'frente',
          url: '/placeholder-foto.jpg',
          fecha: '2024-01-15',
          etiquetas: ['inicial'],
        },
        {
          id: '2',
          progresoId,
          tipo: 'frente',
          url: '/placeholder-foto.jpg',
          fecha: '2024-12-20',
          etiquetas: ['actual'],
        },
      ]);
    }, 500);
  });
}

export async function subirFotoComparativa(
  progresoId: string,
  foto: Omit<FotoComparativa, 'id' | 'progresoId'>
): Promise<FotoComparativa> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now().toString(),
        progresoId,
        ...foto,
      });
    }, 500);
  });
}

export async function getHistorialRendimiento(progresoId: string): Promise<HistorialRendimiento[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          progresoId,
          fecha: '2024-12-20',
          tipo: 'fuerza',
          datos: { ejercicio: 'Press de Banca', peso: 80, repeticiones: 8 },
          notas: 'Buen entrenamiento',
        },
      ]);
    }, 500);
  });
}

export async function getResumenProgreso(progresoId: string): Promise<ResumenProgreso | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        clienteId: 'c1',
        clienteNombre: 'Juan Pérez',
        progresoId,
        fuerzaPromedio: 85,
        repeticionesPromedio: 9,
        rangoMovimientoPromedio: 80,
        fotosTotales: 4,
        fechaInicio: '2024-01-15',
        fechaUltimaActualizacion: '2024-12-20',
        progresoGeneral: 75,
      });
    }, 500);
  });
}

