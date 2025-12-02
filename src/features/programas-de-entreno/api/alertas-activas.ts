import { AlertaActiva, NivelPrioridad, TipoAlerta } from '../types';

// Mock data - En producción esto se reemplazaría con llamadas reales a la API
const MOCK_ALERTAS: AlertaActiva[] = [];

/**
 * Obtiene todas las alertas activas (no resueltas) para un cliente o todos los clientes
 */
export const getAlertasActivas = async (clienteId?: string): Promise<AlertaActiva[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Generar datos mock si no hay datos
  if (MOCK_ALERTAS.length === 0) {
    const ahora = new Date();
    const clientes = [
      { id: '1', nombre: 'Carla' },
      { id: '2', nombre: 'Miguel' },
      { id: '3', nombre: 'Ana' },
    ];

    const tipos: TipoAlerta[] = ['dolor', 'contraindicacion', 'incidencia'];
    const prioridades: NivelPrioridad[] = ['critica', 'alta', 'media', 'baja'];

    clientes.forEach((cliente, idx) => {
      // Crear 2-3 alertas por cliente
      for (let i = 0; i < 2 + (idx % 2); i++) {
        const tipo = tipos[Math.floor(Math.random() * tipos.length)];
        const prioridad = prioridades[Math.floor(Math.random() * prioridades.length)];
        const fecha = new Date(ahora.getTime() - i * 24 * 60 * 60 * 1000);

        let titulo = '';
        let descripcion = '';
        let ejerciciosRiesgosos: string[] = [];
        let recomendaciones: string[] = [];

        switch (tipo) {
          case 'dolor':
            titulo = `Dolor en ${['rodilla', 'espalda', 'hombro', 'muñeca'][i % 4]}`;
            descripcion = `El cliente reporta dolor persistente en ${['la rodilla derecha', 'la zona lumbar', 'el hombro izquierdo', 'la muñeca derecha'][i % 4]}.`;
            ejerciciosRiesgosos = ['Sentadillas', 'Peso muerto', 'Press de hombro'];
            recomendaciones = [
              'Evitar ejercicios de impacto',
              'Aplicar hielo después del entrenamiento',
              'Considerar ejercicios de movilidad',
            ];
            break;
          case 'contraindicacion':
            titulo = 'Contraindicación médica activa';
            descripcion = 'El cliente tiene una contraindicación médica que limita ciertos movimientos.';
            ejerciciosRiesgosos = ['Ejercicios de alta intensidad', 'Movimientos explosivos'];
            recomendaciones = [
              'Consultar con médico antes de continuar',
              'Ajustar intensidad del programa',
              'Priorizar ejercicios de bajo impacto',
            ];
            break;
          case 'incidencia':
            titulo = 'Incidencia reciente reportada';
            descripcion = 'Se ha reportado una incidencia durante la última sesión de entrenamiento.';
            ejerciciosRiesgosos = ['Ejercicios similares a los de la sesión anterior'];
            recomendaciones = [
              'Revisar técnica de ejecución',
              'Reducir carga o intensidad',
              'Aumentar tiempo de descanso',
            ];
            break;
        }

        MOCK_ALERTAS.push({
          id: `alerta-${cliente.id}-${i}`,
          tipo,
          titulo,
          descripcion,
          prioridad,
          clienteId: cliente.id,
          clienteNombre: cliente.nombre,
          fechaCreacion: fecha.toISOString(),
          fechaActualizacion: fecha.toISOString(),
          relacionadoCon: {
            tipo: tipo === 'dolor' ? 'lesion' : tipo === 'contraindicacion' ? 'ejercicio' : 'sesion',
            id: `rel-${i}`,
            nombre: tipo === 'dolor' ? 'Lesión de rodilla' : tipo === 'contraindicacion' ? 'Hipertensión' : 'Sesión del 15/01',
          },
          ejerciciosRiesgosos,
          recomendaciones,
          resuelta: false,
        });
      }
    });
  }

  // Filtrar por cliente si se especifica
  let alertas = MOCK_ALERTAS.filter(a => !a.resuelta);
  if (clienteId) {
    alertas = alertas.filter(a => a.clienteId === clienteId);
  }

  // Ordenar por prioridad (critica > alta > media > baja) y luego por fecha
  const ordenPrioridad: Record<NivelPrioridad, number> = {
    critica: 4,
    alta: 3,
    media: 2,
    baja: 1,
  };

  return alertas.sort((a, b) => {
    const diffPrioridad = ordenPrioridad[b.prioridad] - ordenPrioridad[a.prioridad];
    if (diffPrioridad !== 0) return diffPrioridad;
    return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
  });
};

/**
 * Marca una alerta como resuelta
 */
export const resolverAlerta = async (alertaId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const alerta = MOCK_ALERTAS.find(a => a.id === alertaId);
  if (alerta) {
    alerta.resuelta = true;
    alerta.resueltaEn = new Date().toISOString();
    alerta.fechaActualizacion = new Date().toISOString();
    return true;
  }
  return false;
};

/**
 * Obtiene el resumen de alertas por prioridad
 */
export const getResumenAlertas = async (clienteId?: string): Promise<{
  total: number;
  criticas: number;
  altas: number;
  medias: number;
  bajas: number;
}> => {
  const alertas = await getAlertasActivas(clienteId);
  
  return {
    total: alertas.length,
    criticas: alertas.filter(a => a.prioridad === 'critica').length,
    altas: alertas.filter(a => a.prioridad === 'alta').length,
    medias: alertas.filter(a => a.prioridad === 'media').length,
    bajas: alertas.filter(a => a.prioridad === 'baja').length,
  };
};

