import { ResumenObjetivosProgreso, ObjetivoCliente, MetricaProgreso } from '../types';

// Mock data - En producción esto se reemplazaría con llamadas reales a la API
const MOCK_OBJETIVOS_PROGRESO: Map<string, ResumenObjetivosProgreso> = new Map();

const initializeMockData = (clienteId: string) => {
  if (!MOCK_OBJETIVOS_PROGRESO.has(clienteId)) {
    const objetivos: ObjetivoCliente[] = [
      {
        id: 'obj-1',
        titulo: 'Perder 5 kg',
        descripcion: 'Meta de pérdida de peso para mejorar la salud general',
        categoria: 'peso',
        horizonte: 'corto',
        valorObjetivo: 5,
        valorActual: 2.5,
        unidad: 'kg',
        fechaLimite: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estado: 'in_progress',
        progreso: 50,
        fechaCreacion: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fechaActualizacion: new Date().toISOString().split('T')[0],
      },
      {
        id: 'obj-2',
        titulo: 'Correr 10 km sin parar',
        descripcion: 'Mejorar resistencia cardiovascular',
        categoria: 'resistencia',
        horizonte: 'medio',
        valorObjetivo: 10,
        valorActual: 7,
        unidad: 'km',
        fechaLimite: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estado: 'in_progress',
        progreso: 70,
        fechaCreacion: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fechaActualizacion: new Date().toISOString().split('T')[0],
      },
      {
        id: 'obj-3',
        titulo: 'Aumentar masa muscular 3 kg',
        descripcion: 'Ganar masa muscular mediante entrenamiento de fuerza',
        categoria: 'fuerza',
        horizonte: 'largo',
        valorObjetivo: 3,
        valorActual: 1.5,
        unidad: 'kg',
        fechaLimite: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estado: 'in_progress',
        progreso: 50,
        fechaCreacion: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fechaActualizacion: new Date().toISOString().split('T')[0],
      },
      {
        id: 'obj-4',
        titulo: 'Reducir grasa corporal al 15%',
        descripcion: 'Mejorar composición corporal',
        categoria: 'salud',
        horizonte: 'medio',
        valorObjetivo: 15,
        valorActual: 18.5,
        unidad: '%',
        fechaLimite: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estado: 'at_risk',
        progreso: 20,
        fechaCreacion: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fechaActualizacion: new Date().toISOString().split('T')[0],
      },
    ];

    const metricas: MetricaProgreso[] = [
      {
        id: 'met-1',
        nombre: 'Peso',
        categoria: 'composicion',
        valorActual: 75.5,
        valorAnterior: 78,
        cambio: -2.5,
        cambioPorcentual: -3.2,
        unidad: 'kg',
        tendencia: 'down',
        fecha: new Date().toISOString().split('T')[0],
      },
      {
        id: 'met-2',
        nombre: 'Grasa Corporal',
        categoria: 'composicion',
        valorActual: 18.5,
        valorAnterior: 20,
        cambio: -1.5,
        cambioPorcentual: -7.5,
        unidad: '%',
        tendencia: 'down',
        fecha: new Date().toISOString().split('T')[0],
      },
      {
        id: 'met-3',
        nombre: 'Masa Muscular',
        categoria: 'composicion',
        valorActual: 61.5,
        valorAnterior: 60,
        cambio: 1.5,
        cambioPorcentual: 2.5,
        unidad: 'kg',
        tendencia: 'up',
        fecha: new Date().toISOString().split('T')[0],
      },
      {
        id: 'met-4',
        nombre: 'Fuerza Máxima (Press Banca)',
        categoria: 'fuerza',
        valorActual: 85,
        valorAnterior: 80,
        cambio: 5,
        cambioPorcentual: 6.25,
        unidad: 'kg',
        tendencia: 'up',
        fecha: new Date().toISOString().split('T')[0],
      },
      {
        id: 'met-5',
        nombre: 'Distancia Máxima Corrida',
        categoria: 'resistencia',
        valorActual: 7,
        valorAnterior: 5,
        cambio: 2,
        cambioPorcentual: 40,
        unidad: 'km',
        tendencia: 'up',
        fecha: new Date().toISOString().split('T')[0],
      },
      {
        id: 'met-6',
        nombre: 'Adherencia Semanal',
        categoria: 'comportamiento',
        valorActual: 75,
        valorAnterior: 70,
        cambio: 5,
        cambioPorcentual: 7.1,
        unidad: '%',
        tendencia: 'up',
        fecha: new Date().toISOString().split('T')[0],
      },
    ];

    const objetivosCorto = objetivos.filter(o => o.horizonte === 'corto').length;
    const objetivosMedio = objetivos.filter(o => o.horizonte === 'medio').length;
    const objetivosLargo = objetivos.filter(o => o.horizonte === 'largo').length;
    const objetivosEnProgreso = objetivos.filter(o => o.estado === 'in_progress').length;
    const objetivosCompletados = objetivos.filter(o => o.estado === 'achieved').length;
    const objetivosEnRiesgo = objetivos.filter(o => o.estado === 'at_risk').length;
    const progresoPromedio =
      objetivos.reduce((acc, o) => acc + o.progreso, 0) / objetivos.length;

    MOCK_OBJETIVOS_PROGRESO.set(clienteId, {
      clienteId,
      clienteNombre: 'Cliente Ejemplo',
      objetivos,
      metricas,
      resumen: {
        totalObjetivos: objetivos.length,
        objetivosCortoPlazo: objetivosCorto,
        objetivosMedioPlazo: objetivosMedio,
        objetivosLargoPlazo: objetivosLargo,
        objetivosEnProgreso,
        objetivosCompletados,
        objetivosEnRiesgo,
        progresoPromedio: Math.round(progresoPromedio),
      },
      ultimaActualizacion: new Date().toISOString(),
    });
  }
};

/**
 * Obtiene el resumen completo de objetivos y progreso del cliente
 */
export const getObjetivosProgreso = async (
  clienteId: string
): Promise<ResumenObjetivosProgreso | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  initializeMockData(clienteId);
  return MOCK_OBJETIVOS_PROGRESO.get(clienteId) || null;
};

/**
 * Obtiene lista de clientes (para selector)
 */
export const getClientes = async (): Promise<Array<{ id: string; nombre: string }>> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return [
    { id: '1', nombre: 'Carla' },
    { id: '2', nombre: 'Miguel' },
    { id: '3', nombre: 'Ana' },
  ];
};

