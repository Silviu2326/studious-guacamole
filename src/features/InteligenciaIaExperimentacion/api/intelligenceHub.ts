import { IntelligenceOverviewResponse } from '../types';

/**
 * Mock API call for the Inteligencia, IA & Experimentación feature.
 * Replace with real API integration when backend endpoints are available.
 */
export const fetchIntelligenceOverview = async (): Promise<IntelligenceOverviewResponse> => {
  return Promise.resolve({
    metrics: [
      {
        id: 'playbooks',
        title: 'Playbooks activos',
        value: '12',
        subtitle: 'Lanzados este trimestre',
        trend: {
          value: 18,
          direction: 'up',
          label: 'vs trimestre anterior',
        },
        color: 'primary',
      },
      {
        id: 'experiments',
        title: 'Experimentos en marcha',
        value: '8',
        subtitle: 'A/B Tests y multivariantes',
        trend: {
          value: 3,
          direction: 'up',
          label: 'nuevos esta semana',
        },
        color: 'info',
      },
      {
        id: 'personalization',
        title: 'Personalizaciones activas',
        value: '24',
        subtitle: 'Segmentos personalizados',
        trend: {
          value: 6,
          direction: 'up',
          label: 'últimos 30 días',
        },
        color: 'success',
      },
      {
        id: 'insights',
        title: 'Insights detectados',
        value: '5',
        subtitle: 'Últimos 7 días',
        trend: {
          value: 2,
          direction: 'up',
          label: 'nuevos hallazgos',
        },
        color: 'warning',
      },
    ],
    playbooks: [
      {
        id: 'pb-001',
        name: 'Onboarding Premium 30 días',
        objective: 'Incrementar engagement inicial',
        channels: ['Email', 'SMS', 'In-App'],
        owner: 'Equipo Growth',
        status: 'active',
        impact: 'Alto',
      },
      {
        id: 'pb-002',
        name: 'Reactivación clientes dormidos',
        objective: 'Recuperar clientes inactivos 60+',
        channels: ['Email', 'WhatsApp'],
        owner: 'Marketing Automation',
        status: 'draft',
        impact: 'Medio',
      },
      {
        id: 'pb-003',
        name: 'Fidelización ambassadors',
        objective: 'Potenciar referencias orgánicas',
        channels: ['Comunidad', 'Eventos'],
        owner: 'Community',
        status: 'paused',
        impact: 'Alto',
      },
    ],
    feedbackLoops: [
      {
        id: 'fb-001',
        title: 'Pulse semanal clientes premium',
        audience: 'Segmento VIP',
        lastRun: '2025-11-05',
        responseRate: 62,
        status: 'active',
      },
      {
        id: 'fb-002',
        title: 'Encuesta abandono clases',
        audience: 'Clientes churn riesgo',
        lastRun: '2025-11-01',
        responseRate: 48,
        status: 'scheduled',
      },
    ],
    experiments: [
      {
        id: 'exp-001',
        name: 'Hero landing IA vs estática',
        hypothesis: 'El copy personalizado aumenta conversiones',
        status: 'running',
        primaryMetric: 'CTR',
        uplift: 12,
      },
      {
        id: 'exp-002',
        name: 'Secuencia nutrición personalización',
        hypothesis: 'Contenido adaptado mejora retención',
        status: 'planned',
        primaryMetric: 'Retención 30d',
        uplift: null,
      },
      {
        id: 'exp-003',
        name: 'Test de pricing premium',
        hypothesis: 'Precio dinámico aumenta conversión',
        status: 'completed',
        primaryMetric: 'Conversión',
        uplift: 18,
      },
      {
        id: 'exp-004',
        name: 'Email subject lines A/B',
        hypothesis: 'Subject personalizado mejora apertura',
        status: 'completed',
        primaryMetric: 'Open Rate',
        uplift: 8,
      },
      {
        id: 'exp-005',
        name: 'Onboarding flow simplificado',
        hypothesis: 'Menos pasos aumenta completitud',
        status: 'running',
        primaryMetric: 'Completion Rate',
        uplift: null,
      },
    ],
    topCampaigns: [
      {
        id: 'camp-001',
        name: 'Onboarding Premium Q4',
        channel: 'Email + SMS',
        conversionRate: 24.5,
        revenue: 125000,
        engagementRate: 68.2,
        sent: 5000,
        converted: 1225,
      },
      {
        id: 'camp-002',
        name: 'Reactivación Inactivos 60+',
        channel: 'WhatsApp',
        conversionRate: 18.3,
        revenue: 89000,
        engagementRate: 72.1,
        sent: 3200,
        converted: 586,
      },
      {
        id: 'camp-003',
        name: 'Promoción Black Friday',
        channel: 'Email + Push',
        conversionRate: 31.2,
        revenue: 245000,
        engagementRate: 75.8,
        sent: 8500,
        converted: 2652,
      },
    ],
    insights: [
      {
        id: 'ins-001',
        title: 'Tendencia: HIIT híbrido + mindfulness',
        description: 'Incremento 22% en búsquedas y conversaciones sociales',
        source: 'Trend Analyzer',
        severity: 'medium',
      },
      {
        id: 'ins-002',
        title: 'Competidor lanza programa corporativo',
        description: 'GymX anunció paquetes B2B con IA de bienestar',
        source: 'Competitive Intelligence',
        severity: 'high',
      },
      {
        id: 'ins-003',
        title: 'Mayor satisfacción en entrenadores online',
        description: 'NPS +15 puntos en cohortes con soporte IA',
        source: 'Feedback Loop',
        severity: 'low',
      },
    ],
    upcomingSends: [
      {
        id: 'send-001',
        name: 'Recordatorio de sesión mañana',
        type: 'automation',
        scheduledDate: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(), // 20 horas desde ahora
        channel: 'WhatsApp',
        recipientCount: 8,
        status: 'scheduled',
      },
      {
        id: 'send-002',
        name: 'Seguimiento de progreso quincenal',
        type: 'scheduled_message',
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 días desde ahora
        channel: 'Email',
        recipientCount: 24,
        status: 'scheduled',
      },
      {
        id: 'send-003',
        name: 'Recordatorio de pago pendiente',
        type: 'automation',
        scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 días desde ahora
        channel: 'SMS',
        recipientCount: 3,
        status: 'scheduled',
      },
      {
        id: 'send-004',
        name: 'Check-in mensual de objetivos',
        type: 'playbook',
        scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 días desde ahora
        channel: 'Email',
        recipientCount: 15,
        status: 'scheduled',
      },
    ],
    objectives: [
      {
        id: 'obj-001',
        name: 'Nuevos clientes',
        currentValue: 145,
        targetValue: 200,
        unit: 'clientes',
      },
      {
        id: 'obj-002',
        name: 'Clientes reactivados',
        currentValue: 32,
        targetValue: 50,
        unit: 'clientes',
      },
      {
        id: 'obj-003',
        name: 'Leads generados',
        currentValue: 420,
        targetValue: 500,
        unit: 'leads',
      },
    ],
    campaignPerformanceMetric: {
      type: 'roi',
      value: 3.8,
      previousMonthValue: 3.2,
      percentageChange: 18.75,
      label: 'ROI Estimado',
      unit: 'x',
    },
    sectorTrends: {
      successfulStrategies: [
        {
          id: 'strategy-001',
          category: 'strategy',
          title: 'Micro-influencers generan 3x más engagement',
          description: 'Campañas con influencers de 10K-50K seguidores muestran mayor tasa de conversión',
          impact: 'high',
        },
        {
          id: 'strategy-002',
          category: 'strategy',
          title: 'Gamificación aumenta retención 40%',
          description: 'Programas con badges y recompensas muestran mejor retención a 90 días',
          impact: 'high',
        },
        {
          id: 'strategy-003',
          category: 'strategy',
          title: 'Contenido educativo supera promocional',
          description: 'Posts educativos generan 2.5x más leads que contenido promocional directo',
          impact: 'medium',
        },
      ],
      bestPostingTimes: [
        {
          id: 'timing-001',
          category: 'timing',
          title: 'Martes y Miércoles 9-11 AM',
          description: 'Mayor engagement en estos días y horarios para contenido de fitness',
          impact: 'high',
        },
        {
          id: 'timing-002',
          category: 'timing',
          title: 'Viernes 6-8 PM para promociones',
          description: 'Mejor momento para publicar ofertas y promociones especiales',
          impact: 'medium',
        },
        {
          id: 'timing-003',
          category: 'timing',
          title: 'Domingos 10-12 AM para contenido motivacional',
          description: 'Contenido inspiracional tiene mayor alcance los domingos por la mañana',
          impact: 'medium',
        },
      ],
      topContentTypes: [
        {
          id: 'content-001',
          category: 'content',
          title: 'Videos cortos (30-60 seg)',
          description: 'Videos cortos generan 4x más leads que imágenes estáticas',
          impact: 'high',
        },
        {
          id: 'content-002',
          category: 'content',
          title: 'Testimonios con resultados',
          description: 'Contenido con antes/después y métricas reales aumenta conversión 35%',
          impact: 'high',
        },
        {
          id: 'content-003',
          category: 'content',
          title: 'Guías paso a paso',
          description: 'Contenido educativo en formato guía genera más leads cualificados',
          impact: 'medium',
        },
      ],
    },
  });
};

export default fetchIntelligenceOverview;

