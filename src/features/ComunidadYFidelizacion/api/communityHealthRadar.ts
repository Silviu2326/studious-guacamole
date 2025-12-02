import {
  CommunityHealthRadar as CommunityHealthRadarType,
  HealthMetric,
  CommunityHealthAlert,
  HealthStatus,
  AlertPriority,
  HealthMetricType,
  CommunityFidelizacionSnapshot,
  CustomerSegmentType,
} from '../types';

const MOCK_HEALTH_METRICS: HealthMetric[] = [
  {
    id: 'metric_001',
    type: 'engagement',
    label: 'Engagement Comunitario',
    value: 78,
    previousValue: 72,
    trend: 'up',
    changePercentage: 8.3,
    status: 'buena',
    target: 85,
    threshold: {
      critical: 40,
      warning: 60,
      good: 75,
    },
    description: 'Nivel de participación y actividad en la comunidad',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'metric_002',
    type: 'satisfaccion',
    label: 'Satisfacción del Cliente',
    value: 85,
    previousValue: 83,
    trend: 'up',
    changePercentage: 2.4,
    status: 'excelente',
    target: 90,
    threshold: {
      critical: 50,
      warning: 70,
      good: 80,
    },
    description: 'Nivel de satisfacción general de los clientes',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'metric_003',
    type: 'referidos',
    label: 'Programa de Referidos',
    value: 68,
    previousValue: 65,
    trend: 'up',
    changePercentage: 4.6,
    status: 'regular',
    target: 75,
    threshold: {
      critical: 30,
      warning: 50,
      good: 65,
    },
    description: 'Actividad y éxito del programa de referidos',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'metric_004',
    type: 'retencion',
    label: 'Retención de Clientes',
    value: 82,
    previousValue: 79,
    trend: 'up',
    changePercentage: 3.8,
    status: 'buena',
    target: 85,
    threshold: {
      critical: 50,
      warning: 65,
      good: 75,
    },
    description: 'Tasa de retención de clientes activos',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'metric_005',
    type: 'advocacy',
    label: 'Advocacy y Promotores',
    value: 75,
    previousValue: 73,
    trend: 'up',
    changePercentage: 2.7,
    status: 'buena',
    target: 80,
    threshold: {
      critical: 40,
      warning: 60,
      good: 70,
    },
    description: 'Nivel de advocacy y clientes promotores',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'metric_006',
    type: 'comunidad',
    label: 'Salud de la Comunidad',
    value: 80,
    previousValue: 76,
    trend: 'up',
    changePercentage: 5.3,
    status: 'buena',
    target: 85,
    threshold: {
      critical: 45,
      warning: 65,
      good: 75,
    },
    description: 'Salud general de la comunidad y relaciones',
    lastUpdated: new Date().toISOString(),
  },
];

const MOCK_HEALTH_ALERTS: CommunityHealthAlert[] = [
  {
    id: 'alert_001',
    type: 'referral-drop',
    priority: 'high',
    metric: 'referidos',
    title: 'Caída en Programa de Referidos',
    description:
      'El programa de referidos ha experimentado una caída del 4.6% en el último mes. Aunque el valor actual (68) está por encima del umbral de advertencia (50), se recomienda acción proactiva para evitar una caída adicional.',
    currentValue: 68,
    previousValue: 65,
    changePercentage: -4.6,
    threshold: 50,
    aiRecommendations: [
      {
        action: 'Lanzar campaña de incentivos para referidos',
        rationale:
          'Una campaña de incentivos puede aumentar la actividad de referidos en un 15-20% según datos históricos.',
        expectedImpact: 'high',
        urgency: 'soon',
        actionableSteps: [
          'Crear oferta especial de incentivos para referidos',
          'Comunicar la campaña a clientes embajadores y VIP',
          'Establecer objetivos y seguimiento semanal',
        ],
      },
      {
        action: 'Revisar y optimizar el proceso de referidos',
        rationale:
          'El proceso actual podría tener fricciones que reducen la tasa de referidos. Una revisión puede identificar áreas de mejora.',
        expectedImpact: 'medium',
        urgency: 'planned',
        actionableSteps: [
          'Auditar el proceso actual de referidos',
          'Identificar puntos de fricción',
          'Implementar mejoras en el proceso',
        ],
      },
    ],
    context: {
      relatedActivities: ['act_001', 'act_007'],
      relatedSegments: ['embajador', 'vip'],
      timeframe: 'Últimos 30 días',
      historicalData: [
        { date: '2025-09-01', value: 70 },
        { date: '2025-09-15', value: 68 },
        { date: '2025-10-01', value: 68 },
      ],
    },
    status: 'active',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'alert_002',
    type: 'engagement-drop',
    priority: 'medium',
    metric: 'engagement',
    title: 'Engagement Comunitario por Debajo del Objetivo',
    description:
      'El engagement comunitario (78) está por debajo del objetivo (85). Aunque ha mejorado en los últimos 30 días (+8.3%), aún necesita atención para alcanzar el objetivo.',
    currentValue: 78,
    previousValue: 72,
    changePercentage: 8.3,
    threshold: 75,
    aiRecommendations: [
      {
        action: 'Aumentar frecuencia de actividades comunitarias',
        rationale:
          'Un aumento en la frecuencia de actividades puede mejorar el engagement en un 10-15% según análisis históricos.',
        expectedImpact: 'high',
        urgency: 'soon',
        actionableSteps: [
          'Planificar actividades adicionales para el próximo mes',
          'Crear contenido de engagement semanal',
          'Implementar challenges comunitarios',
        ],
      },
      {
        action: 'Mejorar comunicación y seguimiento',
        rationale:
          'Una mejor comunicación y seguimiento puede aumentar el engagement al hacer que los miembros se sientan más conectados.',
        expectedImpact: 'medium',
        urgency: 'planned',
        actionableSteps: [
          'Implementar sistema de seguimiento automatizado',
          'Mejorar frecuencia de comunicaciones',
          'Personalizar mensajes según segmento',
        ],
      },
    ],
    context: {
      relatedActivities: ['act_001', 'act_003', 'act_006'],
      relatedSegments: ['regular', 'nuevo'],
      timeframe: 'Últimos 30 días',
    },
    status: 'active',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_HEALTH_RADAR: CommunityHealthRadarType = {
  id: 'radar_001',
  period: '30d',
  generatedAt: new Date().toISOString(),
  metrics: MOCK_HEALTH_METRICS,
  overallHealthScore: 78,
  previousHealthScore: 74,
  healthTrend: 'up',
  healthStatus: 'buena',
  alerts: MOCK_HEALTH_ALERTS,
  activeAlertsCount: 2,
  criticalAlertsCount: 0,
  aiAnalysis: {
    overallAssessment:
      'La salud general de la comunidad es buena (78/100) con una tendencia positiva. Las métricas clave están por encima de los umbrales de advertencia, pero hay oportunidades de mejora en el programa de referidos y el engagement comunitario.',
    strengths: [
      'Satisfacción del cliente en nivel excelente (85)',
      'Retención de clientes mejorando constantemente (82)',
      'Salud general de la comunidad en buen nivel (80)',
      'Advocacy y promotores en crecimiento (75)',
    ],
    weaknesses: [
      'Programa de referidos por debajo del objetivo (68 vs 75)',
      'Engagement comunitario por debajo del objetivo (78 vs 85)',
      'Falta de actividades proactivas para aumentar referidos',
    ],
    opportunities: [
      'Aumentar frecuencia de actividades comunitarias para mejorar engagement',
      'Lanzar campaña de incentivos para referidos',
      'Expandir programas exitosos a más segmentos',
      'Implementar sistema de seguimiento automatizado',
    ],
    risks: [
      'Si el programa de referidos continúa cayendo, podría afectar el crecimiento',
      'El engagement comunitario podría estancarse si no se toman acciones proactivas',
      'La falta de actividades podría reducir la satisfacción del cliente a largo plazo',
    ],
    recommendations: [
      {
        priority: 'high',
        action: 'Lanzar campaña de incentivos para referidos',
        rationale:
          'El programa de referidos necesita atención inmediata. Una campaña de incentivos puede aumentar la actividad en un 15-20%.',
        expectedImpact: 'Incremento del 15-20% en referidos en 30 días',
        timeline: 'Implementar en los próximos 7 días',
      },
      {
        priority: 'high',
        action: 'Aumentar frecuencia de actividades comunitarias',
        rationale:
          'El engagement comunitario está por debajo del objetivo. Un aumento en la frecuencia de actividades puede mejorar el engagement en un 10-15%.',
        expectedImpact: 'Incremento del 10-15% en engagement en 60 días',
        timeline: 'Planificar para el próximo mes',
      },
      {
        priority: 'medium',
        action: 'Revisar y optimizar el proceso de referidos',
        rationale:
          'El proceso actual podría tener fricciones que reducen la tasa de referidos. Una revisión puede identificar áreas de mejora.',
        expectedImpact: 'Mejora del 5-10% en tasa de referidos',
        timeline: 'Completar en los próximos 30 días',
      },
      {
        priority: 'medium',
        action: 'Mejorar comunicación y seguimiento',
        rationale:
          'Una mejor comunicación y seguimiento puede aumentar el engagement al hacer que los miembros se sientan más conectados.',
        expectedImpact: 'Mejora del 5-8% en engagement',
        timeline: 'Implementar en los próximos 14 días',
      },
    ],
    predictiveInsights: [
      {
        metric: 'referidos',
        prediction:
          'Si no se toman acciones, el programa de referidos podría caer por debajo del umbral de advertencia (50) en los próximos 60 días.',
        confidence: 75,
        timeframe: '60 días',
      },
      {
        metric: 'engagement',
        prediction:
          'Con las acciones recomendadas, el engagement comunitario podría alcanzar el objetivo (85) en los próximos 90 días.',
        confidence: 80,
        timeframe: '90 días',
      },
      {
        metric: 'satisfaccion',
        prediction:
          'La satisfacción del cliente se mantendrá en nivel excelente si se mantienen las actividades actuales y se mejoran las áreas de oportunidad.',
        confidence: 85,
        timeframe: '90 días',
      },
    ],
  },
  historicalComparison: [
    {
      period: 'Hace 30 días',
      healthScore: 74,
      metrics: [
        { type: 'engagement', value: 72 },
        { type: 'satisfaccion', value: 83 },
        { type: 'referidos', value: 65 },
        { type: 'retencion', value: 79 },
        { type: 'advocacy', value: 73 },
        { type: 'comunidad', value: 76 },
      ],
    },
    {
      period: 'Hace 60 días',
      healthScore: 71,
      metrics: [
        { type: 'engagement', value: 68 },
        { type: 'satisfaccion', value: 81 },
        { type: 'referidos', value: 62 },
        { type: 'retencion', value: 77 },
        { type: 'advocacy', value: 70 },
        { type: 'comunidad', value: 73 },
      ],
    },
  ],
  segmentHealth: [
    {
      segmentType: 'embajador',
      healthScore: 92,
      metrics: [
        {
          id: 'seg_emb_001',
          type: 'engagement',
          label: 'Engagement Embajadores',
          value: 95,
          trend: 'up',
          status: 'excelente',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 'seg_emb_002',
          type: 'satisfaccion',
          label: 'Satisfacción Embajadores',
          value: 90,
          trend: 'up',
          status: 'excelente',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 'seg_emb_003',
          type: 'referidos',
          label: 'Referidos Embajadores',
          value: 88,
          trend: 'up',
          status: 'excelente',
          lastUpdated: new Date().toISOString(),
        },
      ],
      alerts: [],
    },
    {
      segmentType: 'vip',
      healthScore: 85,
      metrics: [
        {
          id: 'seg_vip_001',
          type: 'engagement',
          label: 'Engagement VIP',
          value: 82,
          trend: 'up',
          status: 'buena',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 'seg_vip_002',
          type: 'satisfaccion',
          label: 'Satisfacción VIP',
          value: 88,
          trend: 'up',
          status: 'excelente',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 'seg_vip_003',
          type: 'referidos',
          label: 'Referidos VIP',
          value: 75,
          trend: 'steady',
          status: 'buena',
          lastUpdated: new Date().toISOString(),
        },
      ],
      alerts: [],
    },
    {
      segmentType: 'regular',
      healthScore: 72,
      metrics: [
        {
          id: 'seg_reg_001',
          type: 'engagement',
          label: 'Engagement Regular',
          value: 70,
          trend: 'up',
          status: 'regular',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 'seg_reg_002',
          type: 'satisfaccion',
          label: 'Satisfacción Regular',
          value: 82,
          trend: 'up',
          status: 'buena',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 'seg_reg_003',
          type: 'referidos',
          label: 'Referidos Regular',
          value: 55,
          trend: 'down',
          status: 'regular',
          lastUpdated: new Date().toISOString(),
        },
      ],
      alerts: [
        {
          id: 'alert_seg_reg_001',
          type: 'referral-drop',
          priority: 'medium',
          metric: 'referidos',
          title: 'Caída en Referidos del Segmento Regular',
          description:
            'El segmento regular ha experimentado una caída en referidos. Se recomienda acción proactiva para aumentar la actividad.',
          currentValue: 55,
          previousValue: 58,
          changePercentage: -5.2,
          threshold: 50,
          aiRecommendations: [
            {
              action: 'Crear incentivos específicos para el segmento regular',
              rationale:
                'Incentivos específicos pueden aumentar la actividad de referidos en este segmento.',
              expectedImpact: 'medium',
              urgency: 'soon',
              actionableSteps: [
                'Diseñar oferta especial para segmento regular',
                'Comunicar incentivos a través de canales preferidos',
                'Establecer seguimiento semanal',
              ],
            },
          ],
          context: {
            relatedSegments: ['regular'],
            timeframe: 'Últimos 30 días',
          },
          status: 'active',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    },
    {
      segmentType: 'nuevo',
      healthScore: 65,
      metrics: [
        {
          id: 'seg_nue_001',
          type: 'engagement',
          label: 'Engagement Nuevo',
          value: 60,
          trend: 'up',
          status: 'regular',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 'seg_nue_002',
          type: 'satisfaccion',
          label: 'Satisfacción Nuevo',
          value: 78,
          trend: 'up',
          status: 'regular',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 'seg_nue_003',
          type: 'referidos',
          label: 'Referidos Nuevo',
          value: 35,
          trend: 'steady',
          status: 'baja',
          lastUpdated: new Date().toISOString(),
        },
      ],
      alerts: [],
    },
  ],
};

export const CommunityHealthRadarAPI = {
  async getCommunityHealthRadar(
    period: CommunityFidelizacionSnapshot['period'] = '30d',
  ): Promise<CommunityHealthRadarType> {
    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      ...MOCK_HEALTH_RADAR,
      period,
      generatedAt: new Date().toISOString(),
    };
  },

  async generateCommunityHealthRadar(
    period: CommunityFidelizacionSnapshot['period'],
  ): Promise<CommunityHealthRadarType> {
    // Simular generación de radar con IA
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      ...MOCK_HEALTH_RADAR,
      period,
      generatedAt: new Date().toISOString(),
    };
  },

  async getHealthMetric(metricType: HealthMetricType) {
    const radar = await this.getCommunityHealthRadar('30d');
    return radar.metrics.find((m) => m.type === metricType);
  },

  async getHealthAlerts(priority?: AlertPriority) {
    const radar = await this.getCommunityHealthRadar('30d');
    if (priority) {
      return radar.alerts.filter((a) => a.priority === priority && a.status === 'active');
    }
    return radar.alerts.filter((a) => a.status === 'active');
  },
};
