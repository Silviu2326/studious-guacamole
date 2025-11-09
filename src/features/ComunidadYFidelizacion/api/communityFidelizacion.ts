import { CommunityFidelizacionSnapshot } from '../types';

type SnapshotPeriod = CommunityFidelizacionSnapshot['period'];

const BASE_SNAPSHOT: CommunityFidelizacionSnapshot = {
  period: '30d',
  summary: {
    cNps: 58,
    advocates: 132,
    testimonialsCollected: 48,
    retentionLift: 5.6,
  },
  pulseMetrics: [
    {
      id: 'reviews',
      label: 'Nuevas reseñas verificadas',
      value: '48',
      delta: 22,
      trend: 'up',
      description: 'Comparado con los 30 días anteriores',
    },
    {
      id: 'responses',
      label: 'Feedback respondido en <24h',
      value: '92%',
      delta: 8,
      trend: 'up',
      description: 'Service level agreement alcanzado en encuestas críticas',
    },
    {
      id: 'engagement',
      label: 'Engagement Hub activo',
      value: '84%',
      delta: -3,
      trend: 'down',
      description: 'Participación semanal vs objetivo del 90%',
    },
    {
      id: 'advocacy',
      label: 'Clientes promotores',
      value: '41%',
      delta: 4,
      trend: 'up',
      description: 'Usuarios con probabilidad alta de referir el servicio',
    },
  ],
  testimonials: [
    {
      id: 'tm_001',
      customerName: 'Laura Méndez',
      role: 'Miembro Premium',
      quote:
        'El club organizó un reto de 21 días que me hizo sentir parte de algo más grande. Nunca había tenido tanta motivación sostenida.',
      score: 4.9,
      channel: 'Google Reviews',
      impactTag: 'Reto Comunidad',
      createdAt: '2025-10-12T10:00:00Z',
    },
    {
      id: 'tm_002',
      customerName: 'Carlos Ortega',
      role: 'Programa Corporativo',
      quote:
        'El seguimiento personalizado y los recordatorios inteligentes hicieron que todo mi equipo llegara a la meta del programa.',
      score: 4.8,
      channel: 'Encuesta CSAT',
      impactTag: 'Seguimiento Inteligente',
      createdAt: '2025-10-05T08:30:00Z',
    },
    {
      id: 'tm_003',
      customerName: 'María González',
      role: 'Miembro Online',
      quote:
        'El Engagement Hub nos permite compartir logros y estamos formando grupos de apoyo autogestionados. Me siento escuchada.',
      score: 4.7,
      channel: 'Engagement Hub',
      impactTag: 'Hub Digital',
      createdAt: '2025-09-28T17:45:00Z',
    },
  ],
  insights: [
    {
      id: 'insight_001',
      topic: 'Onboarding de nuevos miembros',
      sentiment: 'positive',
      responseRate: 78,
      change: 12,
      keyFinding: 'El nuevo recorrido guiado elevó el NPS inicial a 61.',
      followUpAction: 'Automatizar la encuesta en el día 3 para medir adopción.',
      lastRun: '2025-10-11',
    },
    {
      id: 'insight_002',
      topic: 'Programa de fidelización',
      sentiment: 'neutral',
      responseRate: 63,
      change: -4,
      keyFinding: 'Los clientes valoran la personalización, pero piden más recompensas sociales.',
      followUpAction: 'Probar badges de comunidad vinculados a retos trimestrales.',
      lastRun: '2025-10-07',
    },
    {
      id: 'insight_003',
      topic: 'Clases híbridas',
      sentiment: 'positive',
      responseRate: 54,
      change: 9,
      keyFinding: 'El 86% quiere más retransmisiones interactivas con chat moderado.',
      followUpAction: 'Programar piloto con coaches embajadores en noviembre.',
      lastRun: '2025-10-02',
    },
  ],
  automations: [
    {
      id: 'auto_001',
      name: 'Solicitar reseña tras 5 sesiones',
      trigger: 'Completar 5 check-ins en 21 días',
      audience: 'Miembros activos',
      status: 'active',
      lastRun: '2025-10-12',
      nextAction: 'Enviar recordatorio personalizado a quienes no respondieron',
    },
    {
      id: 'auto_002',
      name: 'Alertas de feedback negativo',
      trigger: 'Sentimiento < 3 en encuesta NPS',
      audience: 'Clientes en riesgo',
      status: 'active',
      lastRun: '2025-10-11',
      nextAction: 'Asignar caso a Customer Success para seguimiento proactivo',
    },
    {
      id: 'auto_003',
      name: 'Campaña embajadores',
      trigger: 'NPS > 9 y participación en hub',
      audience: 'Promotores',
      status: 'paused',
      lastRun: '2025-09-30',
      nextAction: 'Actualizar beneficios antes de reactivar',
    },
  ],
  programs: [
    {
      id: 'prg_001',
      title: 'Círculos de comunidad',
      description: 'Grupos cerrados por objetivos que se reúnen semanalmente con un coach.',
      owner: 'Marina (CX Lead)',
      kpi: 'Retention uplift',
      progress: 64,
      trend: 'positive',
    },
    {
      id: 'prg_002',
      title: 'Embajadores del mes',
      description: 'Programa que identifica promotores y los nutre para generar referidos.',
      owner: 'Luis (Marketing)',
      kpi: 'Referidos generados',
      progress: 48,
      trend: 'flat',
    },
    {
      id: 'prg_003',
      title: 'Feedback continuo',
      description: 'Ciclo automático de encuestas temáticas y cierre de loop en <48h.',
      owner: 'Adriana (Research)',
      kpi: 'CSAT post-servicio',
      progress: 72,
      trend: 'positive',
    },
  ],
  advocacyMoments: [
    {
      id: 'adv_001',
      title: 'Reto comunidad Noviembre',
      type: 'campaña',
      owner: 'Growth',
      dueDate: '2025-11-03',
      status: 'planificado',
      impact: 'Incrementar retención mensual en 3%',
    },
    {
      id: 'adv_002',
      title: 'Panel de historias de éxito',
      type: 'evento',
      owner: 'Brand',
      dueDate: '2025-10-26',
      status: 'en curso',
      impact: 'Generar 10 nuevos testimonios en video',
    },
    {
      id: 'adv_003',
      title: 'Seguimiento casos críticos',
      type: 'seguimiento',
      owner: 'CX Ops',
      dueDate: '2025-10-15',
      status: 'en curso',
      impact: 'Cerrar feedback loop en menos de 48h',
    },
  ],
};

const MOCK_SNAPSHOTS: Record<SnapshotPeriod, CommunityFidelizacionSnapshot> = {
  '30d': BASE_SNAPSHOT,
  '90d': createSnapshotFromBase(BASE_SNAPSHOT, '90d'),
  '12m': createSnapshotFromBase(BASE_SNAPSHOT, '12m'),
};

function createSnapshotFromBase(
  base: CommunityFidelizacionSnapshot,
  period: SnapshotPeriod,
): CommunityFidelizacionSnapshot {
  const cloned = cloneData(base);
  cloned.period = period;
  cloned.summary = {
    ...cloned.summary,
    cNps: Math.round(base.summary.cNps * (period === '12m' ? 1.05 : 0.95)),
    advocates: Math.round(base.summary.advocates * (period === '12m' ? 1.6 : 1.2)),
    testimonialsCollected: Math.round(base.summary.testimonialsCollected * (period === '12m' ? 3.2 : 1.8)),
    retentionLift: parseFloat((base.summary.retentionLift * (period === '12m' ? 1.7 : 1.3)).toFixed(1)),
  };
  cloned.pulseMetrics = base.pulseMetrics.map((metric) => ({
    ...metric,
    value:
      metric.id === 'reviews'
        ? `${Math.round(parseInt(metric.value, 10) * (period === '12m' ? 6 : 2.4))}`
        : metric.id === 'responses'
          ? `${Math.min(97, parseInt(metric.value, 10) + (period === '12m' ? 5 : 3))}%`
          : metric.id === 'engagement'
            ? `${Math.max(78, parseInt(metric.value, 10) - (period === '12m' ? 1 : 2))}%`
            : metric.id === 'advocacy'
              ? `${Math.min(58, parseInt(metric.value, 10) + (period === '12m' ? 9 : 5))}%`
              : metric.value,
    delta: metric.delta + (period === '12m' ? 10 : 4),
    description:
      period === '12m'
        ? 'Promedio anual comparado con el año anterior'
        : 'Tendencia trimestral sobre el ciclo previo',
  }));

  cloned.programs = base.programs.map((program) => ({
    ...program,
    progress: Math.min(100, Math.round(program.progress * (period === '12m' ? 1.35 : 1.1))),
    trend: period === '12m' ? 'positive' : program.trend,
  }));

  cloned.advocacyMoments = base.advocacyMoments.map((advocacy) => ({
    ...advocacy,
    status:
      period === '12m'
        ? 'completado'
        : advocacy.status === 'planificado' && period === '90d'
          ? 'en curso'
          : advocacy.status,
  }));

  return cloned;
}

export const CommunityFidelizacionAPI = {
  async getSnapshot(period: SnapshotPeriod): Promise<CommunityFidelizacionSnapshot> {
    await delay(320);
    const snapshot = MOCK_SNAPSHOTS[period];
    if (!snapshot) {
      throw new Error(`No se encontró snapshot para el periodo ${period}`);
    }
    return cloneData(snapshot);
  },
};

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function cloneData<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

