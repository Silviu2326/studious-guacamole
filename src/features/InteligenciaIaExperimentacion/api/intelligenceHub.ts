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
  });
};

export default fetchIntelligenceOverview;

