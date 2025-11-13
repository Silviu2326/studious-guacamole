import type { CondicionExterna, PlanContingencia, TipoCondicionExterna } from '../types';

// Mock data - En producción vendría de la API real
const condicionesMock: CondicionExterna[] = [
  {
    id: '1',
    dietaId: 'dieta-1',
    clienteId: 'cliente-1',
    tipo: 'viaje',
    titulo: 'Viaje de trabajo a Barcelona',
    descripcion: 'Viaje de 3 días para conferencia',
    fechaInicio: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    fechaFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    severidad: 'media',
    detalles: {
      destino: 'Barcelona',
    },
    detectadoEn: new Date().toISOString(),
    confirmado: false,
  },
  {
    id: '2',
    dietaId: 'dieta-1',
    clienteId: 'cliente-1',
    tipo: 'evento-social',
    titulo: 'Cena de cumpleaños',
    descripcion: 'Cena en restaurante con amigos',
    fechaInicio: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    severidad: 'baja',
    detalles: {
      tipoEvento: 'Cena social',
    },
    detectadoEn: new Date().toISOString(),
    confirmado: true,
  },
];

const planesContingenciaMock: PlanContingencia[] = [
  {
    id: '1',
    condicionId: '1',
    dietaId: 'dieta-1',
    clienteId: 'cliente-1',
    nombre: 'Plan de viaje - Barcelona',
    descripcion: 'Ajuste nutricional para mantener adherencia durante el viaje',
    ajustes: {
      macros: {
        calorias: -200, // Reducción ligera por menor actividad
      },
      comidasModificadas: [
        {
          tipoComida: 'desayuno',
          sustituciones: ['desayuno-hotel'],
          ajustes: ['Opción de desayuno de hotel compatible'],
        },
        {
          tipoComida: 'almuerzo',
          sustituciones: ['almuerzo-restaurante'],
          ajustes: ['Guía de selección en restaurantes'],
        },
      ],
      recomendaciones: [
        'Llevar snacks saludables para el viaje',
        'Priorizar proteínas en cada comida',
        'Mantener hidratación durante el vuelo',
        'Evitar comidas pesadas antes de dormir',
      ],
    },
    diasAfectados: ['viernes', 'sabado', 'domingo'],
    prioridad: 'alta',
    aplicado: false,
    relevancia: 85,
    razones: [
      'Viaje detectado en calendario del cliente',
      'Cambio de rutina puede afectar adherencia',
      'Disponibilidad de alimentos diferente',
    ],
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  },
  {
    id: '2',
    condicionId: '2',
    dietaId: 'dieta-1',
    clienteId: 'cliente-1',
    nombre: 'Ajuste para cena social',
    descripcion: 'Compensación nutricional para evento social',
    ajustes: {
      macros: {
        calorias: 300, // Aumento esperado en la cena
      },
      recomendaciones: [
        'Reducir ligeramente el desayuno y almuerzo',
        'Aumentar actividad física durante el día',
        'Elegir opciones más ligeras en la cena si es posible',
        'No saltarse comidas previas',
      ],
    },
    diasAfectados: ['sabado'],
    prioridad: 'media',
    aplicado: false,
    relevancia: 70,
    razones: [
      'Evento social confirmado',
      'Riesgo de exceso calórico',
      'Mantener flexibilidad sin comprometer objetivos',
    ],
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  },
];

/**
 * Detecta condiciones externas que pueden afectar el plan nutricional
 */
export async function detectarCondicionesExternas(
  dietaId: string,
  clienteId: string
): Promise<CondicionExterna[]> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // En producción, esto analizaría:
  // - Calendario del cliente (viajes, eventos)
  // - Feedback del cliente (lesiones, cambios)
  // - Integraciones externas (apps de salud, etc.)
  
  return condicionesMock.filter(c => c.dietaId === dietaId && c.clienteId === clienteId);
}

/**
 * Obtiene los planes de contingencia sugeridos para una condición externa
 */
export async function getPlanesContingencia(
  condicionId: string
): Promise<PlanContingencia[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return planesContingenciaMock.filter(p => p.condicionId === condicionId);
}

/**
 * Obtiene todos los planes de contingencia para una dieta
 */
export async function getPlanesContingenciaPorDieta(
  dietaId: string
): Promise<PlanContingencia[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return planesContingenciaMock.filter(p => p.dietaId === dietaId);
}

/**
 * Genera un plan de contingencia automático basado en una condición externa
 */
export async function generarPlanContingencia(
  condicionId: string,
  dietaId: string,
  clienteId: string
): Promise<PlanContingencia> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const condicion = condicionesMock.find(c => c.id === condicionId);
  if (!condicion) {
    throw new Error('Condición no encontrada');
  }
  
  // Lógica de generación automática basada en el tipo de condición
  const plan: PlanContingencia = {
    id: `plan-${Date.now()}`,
    condicionId,
    dietaId,
    clienteId,
    nombre: `Plan de contingencia - ${condicion.titulo}`,
    descripcion: `Ajuste automático para ${condicion.tipo}`,
    ajustes: generarAjustesPorTipo(condicion.tipo),
    diasAfectados: calcularDiasAfectados(condicion),
    prioridad: condicion.severidad === 'alta' ? 'alta' : 'media',
    aplicado: false,
    relevancia: calcularRelevancia(condicion),
    razones: generarRazones(condicion),
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };
  
  planesContingenciaMock.push(plan);
  return plan;
}

/**
 * Aplica un plan de contingencia a la dieta
 */
export async function aplicarPlanContingencia(
  planId: string
): Promise<PlanContingencia> {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const indice = planesContingenciaMock.findIndex(p => p.id === planId);
  if (indice === -1) {
    throw new Error('Plan de contingencia no encontrado');
  }
  
  planesContingenciaMock[indice] = {
    ...planesContingenciaMock[indice],
    aplicado: true,
    fechaAplicacion: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };
  
  return planesContingenciaMock[indice];
}

/**
 * Confirma una condición externa detectada
 */
export async function confirmarCondicionExterna(
  condicionId: string
): Promise<CondicionExterna> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const indice = condicionesMock.findIndex(c => c.id === condicionId);
  if (indice === -1) {
    throw new Error('Condición no encontrada');
  }
  
  condicionesMock[indice] = {
    ...condicionesMock[indice],
    confirmado: true,
  };
  
  return condicionesMock[indice];
}

// Funciones auxiliares

function generarAjustesPorTipo(tipo: TipoCondicionExterna) {
  switch (tipo) {
    case 'viaje':
      return {
        macros: {
          calorias: -200,
        },
        recomendaciones: [
          'Mantener estructura de comidas',
          'Llevar snacks saludables',
          'Priorizar proteínas',
        ],
      };
    case 'evento-social':
      return {
        macros: {
          calorias: 300,
        },
        recomendaciones: [
          'Compensar con comidas previas más ligeras',
          'Aumentar actividad física',
        ],
      };
    case 'lesion':
      return {
        macros: {
          calorias: -300,
          proteinas: 20, // Aumentar proteínas para recuperación
        },
        recomendaciones: [
          'Enfoque en recuperación',
          'Aumentar proteínas',
          'Mantener hidratación',
        ],
      };
    default:
      return {
        recomendaciones: ['Ajustar según necesidad específica'],
      };
  }
}

function calcularDiasAfectados(condicion: CondicionExterna): string[] {
  // Simplificado: en producción calcularía los días reales
  if (condicion.fechaFin) {
    return ['viernes', 'sabado', 'domingo'];
  }
  return ['sabado'];
}

function calcularRelevancia(condicion: CondicionExterna): number {
  if (condicion.severidad === 'alta') return 90;
  if (condicion.severidad === 'media') return 70;
  return 50;
}

function generarRazones(condicion: CondicionExterna): string[] {
  return [
    `${condicion.tipo} detectado en calendario`,
    'Puede afectar la adherencia al plan',
    'Ajuste preventivo recomendado',
  ];
}

