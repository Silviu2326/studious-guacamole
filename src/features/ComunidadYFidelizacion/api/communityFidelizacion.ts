import { CommunityFidelizacionSnapshot } from '../types';
import { CommunityVoiceAPI } from './communityVoice';
import { CustomerSegmentationAPI } from './customerSegmentation';
import { WowMomentsAPI } from './wowMoments';
import { TestimonialScriptsAPI } from './testimonialScripts';
import { BestReviewsAutoPublishAPI } from './bestReviewsAutoPublish';
import { ProgressBasedMomentsAPI } from './progressBasedMoments';
import { AIReferralProgramAPI } from './aiReferralProgram';
import { PromoterMissionsAPI } from './promoterMissions';
import { ReferralImpactReportsAPI } from './referralImpactReports';
import { AIAdaptedSurveysAPI } from './aiAdaptedSurveys';
import { AIPlaybookAPI } from './aiPlaybook';
import { AutomatedComplianceMessagesAPI } from './automatedComplianceMessages';
import { SuccessStoriesAPI } from './successStories';
import { CommunityActivityCorrelationAPI } from './communityActivityCorrelation';
import { CommunityHealthRadarAPI } from './communityHealthRadar';
import { getCommunityManagerTemplates, getCommunityManagerGuidelines } from './communityManagerTemplates';
import { CommunityGamificationAPI } from './communityGamification';
import { ContentRecommendationsAPI } from './contentRecommendations';
import { ApprovalManagerAPI } from './approvalManager';
import { InitiativePrioritizationAPI } from './initiativePrioritization';

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
      customerId: 'cliente_001',
      role: 'Miembro Premium',
      quote:
        'El club organizó un reto de 21 días que me hizo sentir parte de algo más grande. Nunca había tenido tanta motivación sostenida.',
      score: 4.9,
      channel: 'Google Reviews',
      impactTag: 'Reto Comunidad',
      createdAt: '2025-10-12T10:00:00Z',
      type: 'texto',
      source: 'google-reviews',
      status: 'publicado',
      tags: ['comunidad', 'motivación', 'reto'],
    },
    {
      id: 'tm_002',
      customerName: 'Carlos Ortega',
      customerId: 'cliente_002',
      role: 'Programa Corporativo',
      quote:
        'El seguimiento personalizado y los recordatorios inteligentes hicieron que todo mi equipo llegara a la meta del programa.',
      score: 4.8,
      channel: 'Encuesta CSAT',
      impactTag: 'Seguimiento Inteligente',
      createdAt: '2025-10-05T08:30:00Z',
      type: 'texto',
      source: 'email',
      status: 'aprobado',
      tags: ['seguimiento', 'equipo', 'programa'],
    },
    {
      id: 'tm_003',
      customerName: 'María González',
      customerId: 'cliente_003',
      role: 'Miembro Online',
      quote:
        'El Engagement Hub nos permite compartir logros y estamos formando grupos de apoyo autogestionados. Me siento escuchada.',
      score: 4.7,
      channel: 'Engagement Hub',
      impactTag: 'Hub Digital',
      createdAt: '2025-09-28T17:45:00Z',
      type: 'video',
      source: 'formulario',
      status: 'publicado',
      tags: ['comunidad', 'hub', 'apoyo'],
      mediaUrl: 'https://example.com/video/testimonial-003.mp4',
    },
    {
      id: 'tm_004',
      customerName: 'Pedro Sánchez',
      customerId: 'cliente_004',
      role: 'Miembro Premium',
      quote:
        'Increíble transformación en solo 3 meses. El entrenador personalizado y la comunidad me ayudaron a alcanzar mis objetivos.',
      score: 5.0,
      channel: 'WhatsApp',
      impactTag: 'Transformación',
      createdAt: '2025-10-15T14:20:00Z',
      type: 'audio',
      source: 'whatsapp',
      status: 'pendiente',
      tags: ['transformación', 'objetivos', 'entrenamiento'],
      mediaUrl: 'https://example.com/audio/testimonial-004.mp3',
    },
    {
      id: 'tm_005',
      customerName: 'Ana Martínez',
      customerId: 'cliente_005',
      role: 'Miembro Online',
      quote:
        'La flexibilidad de horarios y el apoyo constante del equipo me permitieron mantener la constancia que necesitaba.',
      score: 4.6,
      channel: 'Instagram',
      impactTag: 'Flexibilidad',
      createdAt: '2025-10-10T09:15:00Z',
      type: 'texto',
      source: 'redes-sociales',
      status: 'aprobado',
      tags: ['flexibilidad', 'constancia', 'apoyo'],
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
  idealTestimonialMoments: [
    {
      id: 'itm_001',
      clientId: 'cliente_001',
      clientName: 'Laura Méndez',
      momentType: 'objetivo-alcanzado',
      description: 'Cliente alcanzó su objetivo de perder 5kg en 3 meses',
      detectedAt: '2025-10-15T10:30:00Z',
      objectiveId: 'obj_001',
      status: 'pending',
    },
    {
      id: 'itm_002',
      clientId: 'cliente_002',
      clientName: 'Carlos Ortega',
      momentType: 'programa-completado',
      description: 'Cliente completó el programa de entrenamiento de 12 semanas',
      detectedAt: '2025-10-14T14:20:00Z',
      programId: 'prog_001',
      status: 'notified',
      notificationSentAt: '2025-10-14T15:00:00Z',
    },
    {
      id: 'itm_003',
      clientId: 'cliente_003',
      clientName: 'María González',
      momentType: 'feedback-positivo',
      description: 'Cliente dio feedback positivo (5 estrellas) en la última sesión',
      detectedAt: '2025-10-13T16:45:00Z',
      sessionId: 'ses_003',
      feedbackScore: 5,
      status: 'sent',
      notificationSentAt: '2025-10-13T17:00:00Z',
      reminderSentAt: '2025-10-14T10:00:00Z',
    },
    {
      id: 'itm_004',
      clientId: 'cliente_004',
      clientName: 'Pedro Sánchez',
      momentType: 'sesiones-completadas',
      description: 'Cliente completó 10 sesiones consecutivas',
      detectedAt: '2025-10-12T09:15:00Z',
      sessionId: 'ses_004',
      sessionCount: 10,
      status: 'pending',
    },
    {
      id: 'itm_005',
      clientId: 'cliente_005',
      clientName: 'Ana Martínez',
      momentType: 'objetivo-alcanzado',
      description: 'Cliente alcanzó su objetivo de mejorar resistencia cardiovascular',
      detectedAt: '2025-10-11T11:30:00Z',
      objectiveId: 'obj_002',
      status: 'dismissed',
    },
  ],
  postSessionSurveys: [
    {
      id: 'pss_001',
      sessionId: 'ses_001',
      clientId: 'cliente_001',
      clientName: 'Laura Méndez',
      sessionDate: '2025-10-15T08:00:00Z',
      surveySentAt: '2025-10-15T12:00:00Z',
      surveyChannel: 'whatsapp',
      responseReceivedAt: '2025-10-15T13:30:00Z',
      satisfactionScore: 5,
      comment: 'Excelente sesión, me siento muy motivada',
      status: 'responded',
      hasNegativeFeedback: false,
    },
    {
      id: 'pss_002',
      sessionId: 'ses_002',
      clientId: 'cliente_002',
      clientName: 'Carlos Ortega',
      sessionDate: '2025-10-14T10:00:00Z',
      surveySentAt: '2025-10-14T14:00:00Z',
      surveyChannel: 'email',
      responseReceivedAt: '2025-10-14T16:20:00Z',
      satisfactionScore: 4,
      comment: 'Buen entrenamiento, pero me gustaría más variedad en los ejercicios',
      status: 'responded',
      hasNegativeFeedback: false,
    },
    {
      id: 'pss_003',
      sessionId: 'ses_003',
      clientId: 'cliente_003',
      clientName: 'María González',
      sessionDate: '2025-10-13T16:00:00Z',
      surveySentAt: '2025-10-13T20:00:00Z',
      surveyChannel: 'whatsapp',
      responseReceivedAt: '2025-10-13T21:15:00Z',
      satisfactionScore: 2,
      comment: 'La sesión fue muy intensa, me sentí abrumada. Necesito un ritmo más suave.',
      status: 'responded',
      hasNegativeFeedback: true,
    },
    {
      id: 'pss_004',
      sessionId: 'ses_004',
      clientId: 'cliente_004',
      clientName: 'Pedro Sánchez',
      sessionDate: '2025-10-12T09:00:00Z',
      surveySentAt: '2025-10-12T13:00:00Z',
      surveyChannel: 'whatsapp',
      status: 'sent',
      hasNegativeFeedback: false,
    },
    {
      id: 'pss_005',
      sessionId: 'ses_005',
      clientId: 'cliente_005',
      clientName: 'Ana Martínez',
      sessionDate: '2025-10-11T11:00:00Z',
      surveyChannel: 'email',
      status: 'pending',
      hasNegativeFeedback: false,
    },
    {
      id: 'pss_006',
      sessionId: 'ses_006',
      clientId: 'cliente_006',
      clientName: 'Roberto Fernández',
      sessionDate: '2025-10-10T15:00:00Z',
      surveySentAt: '2025-10-10T19:00:00Z',
      surveyChannel: 'email',
      responseReceivedAt: '2025-10-10T20:30:00Z',
      satisfactionScore: 5,
      comment: 'Perfecto, exactamente lo que necesitaba',
      status: 'responded',
      hasNegativeFeedback: false,
    },
  ],
  postSessionSurveyConfig: {
    id: 'pss_config_001',
    enabled: true,
    delayHours: 3,
    channel: 'both',
    question: '¿Cómo calificarías tu sesión de hoy? (1-5 estrellas)',
    allowComment: true,
    autoAlertOnNegative: true,
    negativeThreshold: 3,
  },
  surveyTemplates: [
    {
      id: 'template_001',
      name: 'Satisfacción Post-Sesión',
      type: 'post-session',
      description: 'Encuesta rápida para medir la satisfacción después de cada sesión de entrenamiento',
      defaultQuestions: [
        '¿Cómo calificarías tu sesión de hoy? (1-5 estrellas)',
        '¿Qué te gustó más de la sesión?',
        '¿Hay algo que mejorarías?',
      ],
      estimatedTime: 2,
    },
    {
      id: 'template_002',
      name: 'Progreso Mensual',
      type: 'monthly-progress',
      description: 'Encuesta para evaluar el progreso del cliente durante el último mes',
      defaultQuestions: [
        '¿Cómo sientes que ha sido tu progreso este mes?',
        '¿Has notado mejoras en tu condición física?',
        '¿Qué objetivos has alcanzado este mes?',
        '¿Qué te gustaría lograr el próximo mes?',
      ],
      estimatedTime: 5,
    },
    {
      id: 'template_003',
      name: 'Satisfacción con Programa',
      type: 'program-satisfaction',
      description: 'Encuesta para evaluar la satisfacción general con el programa de entrenamiento',
      defaultQuestions: [
        '¿Cómo calificarías tu satisfacción general con el programa? (1-5 estrellas)',
        '¿El programa está cumpliendo con tus expectativas?',
        '¿Recomendarías este programa a otros?',
        '¿Qué aspectos del programa valoras más?',
      ],
      estimatedTime: 4,
    },
    {
      id: 'template_004',
      name: 'NPS Trimestral',
      type: 'quarterly-nps',
      description: 'Encuesta NPS (Net Promoter Score) para medir la lealtad del cliente trimestralmente',
      defaultQuestions: [
        'En una escala del 0 al 10, ¿qué tan probable es que recomiendes nuestro servicio a un amigo o familiar?',
        '¿Qué es lo que más valoras de nuestro servicio?',
        '¿Qué podríamos mejorar para ofrecerte una mejor experiencia?',
      ],
      estimatedTime: 3,
    },
  ],
  negativeFeedbackAlerts: [
    {
      id: 'alert_001',
      clientId: 'cliente_003',
      clientName: 'María González',
      sessionId: 'ses_003',
      sessionDate: '2025-10-13T16:00:00Z',
      detectedAt: '2025-10-13T21:15:00Z',
      rating: 2,
      comment: 'La sesión fue muy intensa, me sentí abrumada. Necesito un ritmo más suave.',
      priority: 'urgent',
      status: 'pending',
      notificationChannels: ['in-app', 'email', 'whatsapp'],
      clientHistory: {
        totalSessions: 12,
        averageSatisfaction: 3.8,
        daysAsClient: 45,
        lastSessionDate: '2025-10-13T16:00:00Z',
      },
      recentSessions: [
        {
          id: 'ses_003',
          date: '2025-10-13T16:00:00Z',
          notes: 'Sesión de fuerza - piernas',
          satisfactionScore: 2,
        },
        {
          id: 'ses_002',
          date: '2025-10-10T16:00:00Z',
          notes: 'Sesión de cardio',
          satisfactionScore: 4,
        },
        {
          id: 'ses_001',
          date: '2025-10-07T16:00:00Z',
          notes: 'Sesión de flexibilidad',
          satisfactionScore: 4,
        },
      ],
      actionSuggestions: [
        {
          title: 'Ajustar intensidad del entrenamiento',
          description: 'Considera reducir la intensidad de las sesiones para esta cliente. Revisa su historial y adapta el programa.',
        },
        {
          title: 'Contactar inmediatamente',
          description: 'Es importante contactar a la cliente lo antes posible para entender sus preocupaciones y ajustar el plan.',
        },
        {
          title: 'Revisar objetivos del cliente',
          description: 'Verifica si los objetivos actuales están alineados con las expectativas de la cliente.',
        },
      ],
    },
    {
      id: 'alert_002',
      clientId: 'cliente_007',
      clientName: 'Roberto Fernández',
      sessionId: 'ses_007',
      sessionDate: '2025-10-12T10:00:00Z',
      detectedAt: '2025-10-12T15:30:00Z',
      rating: 2,
      comment: 'No me gustó la rutina de hoy, sentí que no avanzaba.',
      priority: 'high',
      status: 'pending',
      notificationChannels: ['in-app', 'email'],
      clientHistory: {
        totalSessions: 8,
        averageSatisfaction: 3.5,
        daysAsClient: 30,
        lastSessionDate: '2025-10-12T10:00:00Z',
      },
      recentSessions: [
        {
          id: 'ses_007',
          date: '2025-10-12T10:00:00Z',
          notes: 'Sesión de fuerza - tren superior',
          satisfactionScore: 2,
        },
        {
          id: 'ses_006',
          date: '2025-10-09T10:00:00Z',
          notes: 'Sesión de cardio',
          satisfactionScore: 3,
        },
      ],
      actionSuggestions: [
        {
          title: 'Revisar progreso del cliente',
          description: 'Analiza el progreso real del cliente y comparte métricas concretas para mostrar avances.',
        },
        {
          title: 'Variar la rutina',
          description: 'Considera introducir más variedad en los ejercicios para mantener el interés y motivación.',
        },
      ],
    },
  ],
  promoterClients: [
    {
      id: 'prom_001',
      clientId: 'cliente_001',
      clientName: 'Laura Méndez',
      email: 'laura@example.com',
      phone: '+34 600 123 456',
      promoterScore: 92,
      satisfactionScore: 4.9,
      attendanceRate: 95,
      objectivesCompleted: 3,
      totalObjectives: 3,
      positiveFeedbackCount: 12,
      lastPositiveFeedback: '2025-10-15T10:00:00Z',
      daysAsClient: 120,
      lastSessionDate: '2025-10-15T08:00:00Z',
      suggestionType: 'ambos',
      suggestionTiming: 'ahora',
      suggestionReason:
        'Cliente con satisfacción excelente (4.9/5), asistencia perfecta (95%) y todos los objetivos completados. Momento ideal para pedir referido y testimonio.',
      tags: ['alta-satisfaccion', 'objetivos-completados', 'asistencia-excelente'],
    },
    {
      id: 'prom_002',
      clientId: 'cliente_002',
      clientName: 'Carlos Ortega',
      email: 'carlos@example.com',
      phone: '+34 600 234 567',
      promoterScore: 85,
      satisfactionScore: 4.8,
      attendanceRate: 88,
      objectivesCompleted: 2,
      totalObjectives: 3,
      positiveFeedbackCount: 8,
      lastPositiveFeedback: '2025-10-14T14:00:00Z',
      daysAsClient: 90,
      lastSessionDate: '2025-10-14T10:00:00Z',
      suggestionType: 'referido',
      suggestionTiming: 'esta-semana',
      suggestionReason:
        'Cliente satisfecho con alta asistencia. Ha mostrado interés en recomendar el servicio. Buen momento para pedir referidos.',
      tags: ['alta-satisfaccion', 'buena-asistencia'],
    },
    {
      id: 'prom_003',
      clientId: 'cliente_003',
      clientName: 'María González',
      email: 'maria@example.com',
      phone: '+34 600 345 678',
      promoterScore: 78,
      satisfactionScore: 4.7,
      attendanceRate: 82,
      objectivesCompleted: 4,
      totalObjectives: 5,
      positiveFeedbackCount: 10,
      lastPositiveFeedback: '2025-10-13T16:00:00Z',
      daysAsClient: 150,
      lastSessionDate: '2025-10-13T16:00:00Z',
      suggestionType: 'testimonio',
      suggestionTiming: 'este-mes',
      suggestionReason:
        'Cliente de larga trayectoria con múltiples objetivos alcanzados. Excelente candidata para testimonio sobre su transformación.',
      tags: ['cliente-veterano', 'múltiples-objetivos'],
    },
    {
      id: 'prom_004',
      clientId: 'cliente_004',
      clientName: 'Pedro Sánchez',
      email: 'pedro@example.com',
      phone: '+34 600 456 789',
      promoterScore: 88,
      satisfactionScore: 5.0,
      attendanceRate: 92,
      objectivesCompleted: 2,
      totalObjectives: 2,
      positiveFeedbackCount: 15,
      lastPositiveFeedback: '2025-10-15T14:00:00Z',
      daysAsClient: 60,
      lastSessionDate: '2025-10-15T14:20:00Z',
      suggestionType: 'ambos',
      suggestionTiming: 'ahora',
      suggestionReason:
        'Cliente nuevo pero muy satisfecho (5.0/5) con excelente asistencia. Ha completado todos sus objetivos. Momento perfecto para pedir referido y testimonio.',
      tags: ['satisfaccion-perfecta', 'objetivos-completados'],
    },
    {
      id: 'prom_005',
      clientId: 'cliente_005',
      clientName: 'Ana Martínez',
      email: 'ana@example.com',
      phone: '+34 600 567 890',
      promoterScore: 75,
      satisfactionScore: 4.6,
      attendanceRate: 85,
      objectivesCompleted: 1,
      totalObjectives: 2,
      positiveFeedbackCount: 6,
      lastPositiveFeedback: '2025-10-10T09:00:00Z',
      daysAsClient: 45,
      lastSessionDate: '2025-10-11T11:00:00Z',
      suggestionType: 'referido',
      suggestionTiming: 'este-mes',
      suggestionReason:
        'Cliente satisfecho con buena asistencia. Puede ser buen momento para pedir referidos después de completar su próximo objetivo.',
      tags: ['buena-asistencia'],
    },
  ],
  referralProgram: {
    id: 'ref_prog_001',
    name: 'Programa de Referidos - Recompensa Especial',
    description:
      'Invita a tus amigos y familiares a unirse. Por cada referido que se convierta en cliente, ambos recibirán una recompensa especial.',
    reward: {
      id: 'reward_001',
      type: 'sesion-gratis',
      name: 'Sesión Gratis',
      description: 'Una sesión de entrenamiento personal gratis para ti y tu referido',
      value: 1,
      isActive: true,
      createdAt: '2025-09-01T00:00:00Z',
    },
    isActive: true,
    createdAt: '2025-09-01T00:00:00Z',
    totalReferrals: 24,
    convertedReferrals: 12,
    totalRewardsGiven: 10,
  },
  referrals: [
    {
      id: 'ref_001',
      programId: 'ref_prog_001',
      referrerClientId: 'cliente_001',
      referrerClientName: 'Laura Méndez',
      referredEmail: 'amiga.laura@example.com',
      referredName: 'Sofía Méndez',
      referralLink: 'https://entrenador.com/ref/laura-abc123',
      status: 'convertido',
      convertedAt: '2025-10-10T12:00:00Z',
      rewardGivenAt: '2025-10-12T10:00:00Z',
      createdAt: '2025-10-05T08:00:00Z',
      notes: 'Referido convertido exitosamente',
    },
    {
      id: 'ref_002',
      programId: 'ref_prog_001',
      referrerClientId: 'cliente_002',
      referrerClientName: 'Carlos Ortega',
      referredEmail: 'carlos.amigo@example.com',
      referredName: 'Miguel Torres',
      referralLink: 'https://entrenador.com/ref/carlos-xyz789',
      status: 'en-proceso',
      createdAt: '2025-10-12T14:00:00Z',
      notes: 'Referido ha agendado consulta inicial',
    },
    {
      id: 'ref_003',
      programId: 'ref_prog_001',
      referrerClientId: 'cliente_001',
      referrerClientName: 'Laura Méndez',
      referredEmail: 'laura.colega@example.com',
      referredName: 'Elena Ruiz',
      referralLink: 'https://entrenador.com/ref/laura-def456',
      status: 'convertido',
      convertedAt: '2025-10-14T16:00:00Z',
      rewardGivenAt: '2025-10-15T09:00:00Z',
      createdAt: '2025-10-08T10:00:00Z',
      notes: 'Segundo referido de Laura',
    },
    {
      id: 'ref_004',
      programId: 'ref_prog_001',
      referrerClientId: 'cliente_004',
      referrerClientName: 'Pedro Sánchez',
      referredEmail: 'pedro.familiar@example.com',
      referralLink: 'https://entrenador.com/ref/pedro-ghi789',
      status: 'pendiente',
      createdAt: '2025-10-15T11:00:00Z',
    },
    {
      id: 'ref_005',
      programId: 'ref_prog_001',
      referrerClientId: 'cliente_002',
      referrerClientName: 'Carlos Ortega',
      referredEmail: 'carlos.otro@example.com',
      referralLink: 'https://entrenador.com/ref/carlos-jkl012',
      status: 'convertido',
      convertedAt: '2025-09-28T10:00:00Z',
      rewardGivenAt: '2025-09-30T14:00:00Z',
      createdAt: '2025-09-20T08:00:00Z',
      notes: 'Primer referido de Carlos',
    },
  ],
  referralStats: {
    totalReferrals: 24,
    convertedReferrals: 12,
    conversionRate: 50.0,
    totalRewardsGiven: 10,
    topReferrers: [
      {
        clientId: 'cliente_001',
        clientName: 'Laura Méndez',
        referralCount: 5,
        convertedCount: 3,
      },
      {
        clientId: 'cliente_002',
        clientName: 'Carlos Ortega',
        referralCount: 4,
        convertedCount: 2,
      },
      {
        clientId: 'cliente_004',
        clientName: 'Pedro Sánchez',
        referralCount: 3,
        convertedCount: 2,
      },
    ],
    referralsByStatus: [
      { status: 'pendiente', count: 8 },
      { status: 'en-proceso', count: 4 },
      { status: 'convertido', count: 10 },
      { status: 'recompensado', count: 10 },
      { status: 'expirado', count: 2 },
    ],
    referralsByMonth: [
      { month: '2025-08', count: 5, converted: 2 },
      { month: '2025-09', count: 8, converted: 4 },
      { month: '2025-10', count: 11, converted: 6 },
    ],
  },
  socialPlatformConnections: [
    {
      id: 'sp_001',
      platform: 'google-my-business',
      name: 'Google My Business',
      isConnected: true,
      connectedAt: '2025-09-15T10:00:00Z',
      lastSyncAt: '2025-10-15T08:30:00Z',
      syncFrequency: 'daily',
      reviewsImported: 48,
      reviewsThisMonth: 12,
      accountName: 'Mi Gimnasio',
      accountId: 'gmb_123456',
    },
    {
      id: 'sp_002',
      platform: 'facebook',
      name: 'Facebook',
      isConnected: true,
      connectedAt: '2025-09-20T14:00:00Z',
      lastSyncAt: '2025-10-15T09:00:00Z',
      syncFrequency: 'daily',
      reviewsImported: 32,
      reviewsThisMonth: 8,
      accountName: 'Mi Gimnasio Oficial',
      accountId: 'fb_789012',
    },
    {
      id: 'sp_003',
      platform: 'instagram',
      name: 'Instagram',
      isConnected: false,
      syncFrequency: 'manual',
      reviewsImported: 0,
      reviewsThisMonth: 0,
    },
  ],
  reviewRequests: [
    {
      id: 'rr_001',
      clientId: 'cliente_001',
      clientName: 'Laura Méndez',
      platform: 'google-my-business',
      requestedAt: '2025-10-10T10:00:00Z',
      status: 'completed',
      link: 'https://g.page/r/example/review',
      completedAt: '2025-10-12T15:30:00Z',
    },
    {
      id: 'rr_002',
      clientId: 'cliente_002',
      clientName: 'Carlos Ortega',
      platform: 'facebook',
      requestedAt: '2025-10-14T11:00:00Z',
      status: 'sent',
      link: 'https://facebook.com/review',
    },
    {
      id: 'rr_003',
      clientId: 'cliente_004',
      clientName: 'Pedro Sánchez',
      platform: 'google-my-business',
      requestedAt: '2025-10-15T09:00:00Z',
      status: 'pending',
    },
  ],
  monthlyReports: [
    {
      id: 'mr_001',
      month: '2025-10',
      period: 'Octubre 2025',
      status: 'completed',
      averageSatisfaction: 4.7,
      testimonialsCollected: 48,
      promoterClients: 41,
      negativeFeedbackResolved: 8,
      trends: [
        {
          metric: 'Satisfacción promedio',
          value: 4.7,
          change: 0.3,
          changeType: 'increase',
          description: 'Aumento del 0.3 puntos respecto al mes anterior',
        },
        {
          metric: 'Testimonios recopilados',
          value: 48,
          change: 12,
          changeType: 'increase',
          description: '12 testimonios más que el mes anterior',
        },
        {
          metric: 'Clientes promotores',
          value: 41,
          change: 5,
          changeType: 'increase',
          description: '5 nuevos clientes promotores identificados',
        },
      ],
      comparisonWithPreviousMonth: {
        averageSatisfaction: { current: 4.7, previous: 4.4, change: 6.8 },
        testimonialsCollected: { current: 48, previous: 36, change: 12 },
        promoterClients: { current: 41, previous: 36, change: 5 },
        negativeFeedbackResolved: { current: 8, previous: 6, change: 2 },
      },
      generatedAt: '2025-11-01T08:00:00Z',
      sentAt: '2025-11-01T08:15:00Z',
      downloadUrl: 'https://example.com/reports/octubre-2025.pdf',
      recipients: ['entrenador@example.com'],
      format: 'both',
      // US-CF-15: Insights accionables y próximas acciones
      highlights: [
        {
          id: 'h1',
          title: 'Récord de Testimonios',
          description: 'Se recopilaron 48 testimonios este mes, un aumento del 33% respecto al mes anterior',
          metric: 'Testimonios',
          value: 48,
          trend: 'positive',
        },
        {
          id: 'h2',
          title: 'Satisfacción en Máximo Histórico',
          description: 'La satisfacción promedio alcanzó 4.7/5, el mejor resultado en los últimos 6 meses',
          metric: 'Satisfacción',
          value: '4.7/5',
          trend: 'positive',
        },
      ],
      actionableInsights: [
        {
          id: 'ai1',
          title: 'Oportunidad de Upsell en Clientes Satisfechos',
          description: 'El 78% de los clientes con satisfacción >4.5 no han sido contactados para programas premium en los últimos 60 días',
          category: 'revenue',
          priority: 'high',
          impact: 'Potencial de incrementar ingresos en un 15-20% mediante upsells estratégicos',
          dataPoints: [
            '41 clientes con satisfacción >4.5',
            '32 no han recibido propuesta de upgrade',
            'Tasa de conversión histórica de upsell: 35%',
          ],
          confidence: 85,
        },
        {
          id: 'ai2',
          title: 'Engagement Bajo en Nuevos Clientes',
          description: 'Los clientes que se unieron en los últimos 30 días muestran un 25% menos de engagement que el promedio',
          category: 'engagement',
          priority: 'medium',
          impact: 'Riesgo de abandono temprano si no se mejora el onboarding',
          dataPoints: [
            '12 nuevos clientes en octubre',
            'Tasa de asistencia: 65% vs 87% promedio',
            'Solo 3 han completado el onboarding completo',
          ],
          confidence: 78,
        },
      ],
      nextActions: [
        {
          id: 'na1',
          title: 'Lanzar Campaña de Upsell para Clientes Satisfechos',
          description: 'Crear una campaña personalizada dirigida a clientes con alta satisfacción para ofrecer programas premium',
          type: 'campaign',
          priority: 'high',
          estimatedImpact: '15-20% aumento en ingresos recurrentes',
          effort: 'medium',
          suggestedTimeline: 'Próximas 2 semanas',
          relatedInsightId: 'ai1',
          actionableSteps: [
            'Segmentar clientes con satisfacción >4.5 y sin upgrade reciente',
            'Crear mensaje personalizado destacando beneficios del programa premium',
            'Configurar automatización para enviar propuesta vía WhatsApp/Email',
            'Seguimiento personalizado para los primeros 10 días',
          ],
        },
        {
          id: 'na2',
          title: 'Mejorar Proceso de Onboarding',
          description: 'Implementar check-ins más frecuentes y contenido educativo para nuevos clientes',
          type: 'automation',
          priority: 'medium',
          estimatedImpact: 'Reducción del 30% en abandono temprano',
          effort: 'low',
          suggestedTimeline: 'Esta semana',
          relatedInsightId: 'ai2',
          actionableSteps: [
            'Crear secuencia de bienvenida automatizada (días 1, 3, 7, 14)',
            'Agregar contenido educativo sobre beneficios del entrenamiento',
            'Programar llamadas de check-in en día 5 y día 10',
            'Crear grupo de WhatsApp exclusivo para nuevos clientes',
          ],
        },
        {
          id: 'na3',
          title: 'Reto Comunitario de 7 Días',
          description: 'Lanzar un reto de 7 días para aumentar engagement y crear contenido social',
          type: 'challenge',
          priority: 'medium',
          estimatedImpact: 'Aumento del 25% en engagement y generación de 15+ testimonios',
          effort: 'low',
          suggestedTimeline: 'Próxima semana',
          actionableSteps: [
            'Definir tema del reto basado en feedback de clientes',
            'Crear assets visuales y copy para redes sociales',
            'Configurar grupo de WhatsApp para participantes',
            'Programar recordatorios diarios y celebración de logros',
          ],
        },
      ],
      learnings: [
        {
          id: 'l1',
          title: 'Testimonios en Video Generan Más Conversión',
          description: 'Los testimonios en video tienen un 3x más de engagement que los de texto',
          category: 'what-worked',
          evidence: ['48 testimonios recopilados', '15 en formato video', 'Videos generaron 450% más views'],
          recommendation: 'Priorizar solicitud de testimonios en video para clientes satisfechos',
        },
        {
          id: 'l2',
          title: 'Feedback Negativo Resuelto Rápidamente Mejora Retención',
          description: 'Los clientes con feedback negativo resuelto en <24h tienen 85% de retención vs 45% si se resuelve después',
          category: 'what-worked',
          evidence: ['8 feedbacks negativos resueltos', '7 resueltos en <24h', '6 clientes retenidos'],
          recommendation: 'Mantener protocolo de respuesta rápida a feedback negativo',
        },
        {
          id: 'l3',
          title: 'Oportunidad: Clientes Promotores No Están Siendo Aprovechados',
          description: '41 clientes promotores identificados pero solo 12 han dado referidos este mes',
          category: 'opportunity',
          evidence: ['41 promotores activos', 'Solo 12 referidos generados', 'Tasa histórica: 60% de promotores dan referidos'],
          recommendation: 'Crear programa de incentivos y facilitar proceso de referidos',
        },
      ],
    },
    {
      id: 'mr_002',
      month: '2025-09',
      period: 'Septiembre 2025',
      status: 'completed',
      averageSatisfaction: 4.4,
      testimonialsCollected: 36,
      promoterClients: 36,
      negativeFeedbackResolved: 6,
      trends: [
        {
          metric: 'Satisfacción promedio',
          value: 4.4,
          change: 0.1,
          changeType: 'increase',
          description: 'Mejora constante en satisfacción',
        },
      ],
      comparisonWithPreviousMonth: {
        averageSatisfaction: { current: 4.4, previous: 4.3, change: 2.3 },
        testimonialsCollected: { current: 36, previous: 32, change: 4 },
        promoterClients: { current: 36, previous: 34, change: 2 },
        negativeFeedbackResolved: { current: 6, previous: 8, change: -2 },
      },
      generatedAt: '2025-10-01T08:00:00Z',
      sentAt: '2025-10-01T08:15:00Z',
      downloadUrl: 'https://example.com/reports/septiembre-2025.pdf',
      recipients: ['entrenador@example.com'],
      format: 'both',
    },
  ],
  monthlyReportConfig: {
    id: 'mrc_001',
    enabled: true,
    autoSend: true,
    sendDate: 1,
    recipients: ['entrenador@example.com'],
    format: 'both',
    includeCharts: true,
    includeTestimonials: true,
    includeTrends: true,
    includeActionableInsights: true,
    includeNextActions: true,
  },
  // US-CF-16: Journey completo del cliente
  clientJourneys: [
    {
      id: 'cj_001',
      clientId: 'cliente_001',
      clientName: 'Laura Méndez',
      currentStage: 'loyalty',
      totalDuration: 245,
      firstContactDate: '2025-02-15T10:00:00Z',
      lastInteractionDate: '2025-10-15T14:30:00Z',
      stages: [
        {
          stage: 'first-contact',
          enteredAt: '2025-02-15T10:00:00Z',
          exitedAt: '2025-02-20T12:00:00Z',
          duration: 5,
          events: [
            {
              id: 'e1',
              type: 'contact',
              title: 'Primer contacto vía Instagram',
              description: 'Cliente contactó después de ver contenido en Instagram',
              date: '2025-02-15T10:00:00Z',
              channel: 'social',
              sentiment: 'positive',
              impact: 85,
            },
            {
              id: 'e2',
              type: 'contact',
              title: 'Llamada de consulta',
              description: 'Llamada de 30 minutos para entender objetivos',
              date: '2025-02-18T15:00:00Z',
              channel: 'phone',
              sentiment: 'positive',
              impact: 90,
            },
          ],
          strengths: ['Respuesta rápida al primer contacto', 'Comunicación clara de objetivos'],
          weaknesses: [],
        },
        {
          stage: 'onboarding',
          enteredAt: '2025-02-20T12:00:00Z',
          exitedAt: '2025-03-10T10:00:00Z',
          duration: 18,
          events: [
            {
              id: 'e3',
              type: 'purchase',
              title: 'Contratación de plan mensual',
              description: 'Contrató plan de entrenamiento personalizado',
              date: '2025-02-20T12:00:00Z',
              channel: 'whatsapp',
              sentiment: 'positive',
              impact: 95,
            },
            {
              id: 'e4',
              type: 'session',
              title: 'Primera sesión de evaluación',
              description: 'Sesión inicial para establecer línea base',
              date: '2025-02-22T09:00:00Z',
              channel: 'in-person',
              sentiment: 'positive',
              impact: 88,
            },
          ],
          metrics: {
            satisfaction: 4.5,
            engagement: 90,
          },
          strengths: ['Alta asistencia desde el inicio', 'Compromiso con el proceso'],
          weaknesses: ['Tardó en unirse al grupo de WhatsApp'],
        },
        {
          stage: 'active',
          enteredAt: '2025-03-10T10:00:00Z',
          exitedAt: '2025-06-15T10:00:00Z',
          duration: 97,
          events: [
            {
              id: 'e5',
              type: 'milestone',
              title: 'Objetivo alcanzado: Pérdida de peso',
              description: 'Alcanzó su objetivo de perder 8kg',
              date: '2025-05-20T10:00:00Z',
              channel: 'in-person',
              sentiment: 'positive',
              impact: 95,
            },
            {
              id: 'e6',
              type: 'feedback',
              title: 'Feedback positivo post-sesión',
              description: 'Calificación 5/5 en encuesta post-sesión',
              date: '2025-05-25T18:00:00Z',
              channel: 'whatsapp',
              sentiment: 'positive',
              impact: 85,
            },
          ],
          metrics: {
            satisfaction: 4.8,
            engagement: 95,
            attendance: 92,
            spending: 1200,
          },
          strengths: ['Excelente adherencia', 'Progreso constante', 'Feedback muy positivo'],
          weaknesses: [],
        },
        {
          stage: 'community',
          enteredAt: '2025-06-15T10:00:00Z',
          exitedAt: '2025-08-20T10:00:00Z',
          duration: 66,
          events: [
            {
              id: 'e7',
              type: 'testimonial',
              title: 'Testimonio en video',
              description: 'Grabó testimonio en video compartido en redes',
              date: '2025-07-10T14:00:00Z',
              channel: 'social',
              sentiment: 'positive',
              impact: 90,
            },
            {
              id: 'e8',
              type: 'referral',
              title: 'Primer referido',
              description: 'Refirió a amiga que se convirtió en cliente',
              date: '2025-07-25T10:00:00Z',
              channel: 'whatsapp',
              sentiment: 'positive',
              impact: 92,
            },
          ],
          metrics: {
            satisfaction: 4.9,
            engagement: 98,
            attendance: 95,
          },
          strengths: ['Alto engagement en comunidad', 'Genera referidos', 'Crea contenido'],
          weaknesses: [],
        },
        {
          stage: 'loyalty',
          enteredAt: '2025-08-20T10:00:00Z',
          events: [
            {
              id: 'e9',
              type: 'purchase',
              title: 'Upgrade a plan premium',
              description: 'Actualizó a plan premium con nutrición incluida',
              date: '2025-08-20T10:00:00Z',
              channel: 'whatsapp',
              sentiment: 'positive',
              impact: 95,
            },
            {
              id: 'e10',
              type: 'referral',
              title: 'Segundo referido',
              description: 'Refirió a segundo contacto',
              date: '2025-09-15T10:00:00Z',
              channel: 'whatsapp',
              sentiment: 'positive',
              impact: 90,
            },
          ],
          metrics: {
            satisfaction: 5.0,
            engagement: 100,
            attendance: 98,
            spending: 1800,
          },
          strengths: ['Cliente embajador', 'Alta satisfacción', 'Genera múltiples referidos'],
          weaknesses: [],
        },
      ],
      analysis: {
        overallHealth: 92,
        strengths: [
          {
            stage: 'onboarding',
            strength: 'strong',
            description: 'Onboarding rápido y efectivo, alta satisfacción desde el inicio',
            evidence: ['Satisfacción 4.5 desde primera sesión', 'Alta asistencia desde el inicio'],
            impact: 'high',
          },
          {
            stage: 'community',
            strength: 'strong',
            description: 'Excelente integración en la comunidad, genera referidos y contenido',
            evidence: ['2 referidos generados', 'Testimonio en video', 'Alto engagement'],
            impact: 'high',
          },
        ],
        weaknesses: [
          {
            stage: 'onboarding',
            strength: 'weak',
            description: 'Tardó en unirse al grupo de WhatsApp de la comunidad',
            evidence: ['Se unió 2 semanas después del inicio'],
            impact: 'low',
          },
        ],
        criticalMoments: [
          {
            id: 'e5',
            type: 'milestone',
            title: 'Objetivo alcanzado: Pérdida de peso',
            description: 'Alcanzó su objetivo de perder 8kg',
            date: '2025-05-20T10:00:00Z',
            channel: 'in-person',
            sentiment: 'positive',
            impact: 95,
          },
          {
            id: 'e9',
            type: 'purchase',
            title: 'Upgrade a plan premium',
            description: 'Actualizó a plan premium con nutrición incluida',
            date: '2025-08-20T10:00:00Z',
            channel: 'whatsapp',
            sentiment: 'positive',
            impact: 95,
          },
        ],
      },
      aiRecommendations: [
        {
          id: 'r1',
          type: 'recognition',
          title: 'Reconocer como Cliente Embajador',
          description: 'Laura ha generado 2 referidos y tiene satisfacción perfecta. Reconocer públicamente su contribución',
          priority: 'high',
          reasoning: 'El reconocimiento público aumenta la probabilidad de más referidos y fortalece la relación',
          expectedImpact: 'Aumento en referidos y mayor engagement',
          suggestedTimeline: 'Esta semana',
          actionableSteps: [
            'Crear post destacando su historia de éxito',
            'Ofrecer beneficio exclusivo como embajador',
            'Incluir en programa de referidos premium',
          ],
          relatedStage: 'loyalty',
          confidence: 90,
        },
        {
          id: 'r2',
          type: 'upsell',
          title: 'Ofrecer Programa de Nutrición Avanzada',
          description: 'Laura está en plan premium básico. Ofrecer programa avanzado de nutrición',
          priority: 'medium',
          reasoning: 'Cliente satisfecha y comprometida, alta probabilidad de aceptar upgrade',
          expectedImpact: 'Aumento de ingresos recurrentes en 30%',
          suggestedTimeline: 'Próximas 2 semanas',
          actionableSteps: [
            'Preparar propuesta personalizada',
            'Destacar beneficios específicos para sus objetivos',
            'Programar llamada para presentar oferta',
          ],
          relatedStage: 'loyalty',
          confidence: 75,
        },
      ],
      metrics: {
        totalSessions: 68,
        totalSpent: 3000,
        averageSatisfaction: 4.9,
        referralsGiven: 2,
        testimonialsGiven: 1,
        lastPurchaseDate: '2025-08-20T10:00:00Z',
        daysSinceLastSession: 5,
      },
      createdAt: '2025-02-15T10:00:00Z',
      updatedAt: '2025-10-15T14:30:00Z',
    },
    {
      id: 'cj_002',
      clientId: 'cliente_002',
      clientName: 'Carlos Ortega',
      currentStage: 'at-risk',
      totalDuration: 120,
      firstContactDate: '2025-06-20T09:00:00Z',
      lastInteractionDate: '2025-09-15T16:00:00Z',
      stages: [
        {
          stage: 'first-contact',
          enteredAt: '2025-06-20T09:00:00Z',
          exitedAt: '2025-06-25T10:00:00Z',
          duration: 5,
          events: [
            {
              id: 'e11',
              type: 'contact',
              title: 'Primer contacto vía referido',
              description: 'Contactó después de ser referido por Laura Méndez',
              date: '2025-06-20T09:00:00Z',
              channel: 'whatsapp',
              sentiment: 'positive',
              impact: 80,
            },
          ],
          strengths: ['Vino por referido (mayor confianza)'],
          weaknesses: [],
        },
        {
          stage: 'onboarding',
          enteredAt: '2025-06-25T10:00:00Z',
          exitedAt: '2025-07-15T10:00:00Z',
          duration: 20,
          events: [
            {
              id: 'e12',
              type: 'purchase',
              title: 'Contratación de plan mensual',
              description: 'Contrató plan básico',
              date: '2025-06-25T10:00:00Z',
              channel: 'whatsapp',
              sentiment: 'positive',
              impact: 85,
            },
            {
              id: 'e13',
              type: 'session',
              title: 'Primera sesión',
              description: 'Sesión inicial completada',
              date: '2025-06-27T09:00:00Z',
              channel: 'in-person',
              sentiment: 'neutral',
              impact: 70,
            },
          ],
          metrics: {
            satisfaction: 3.8,
            engagement: 65,
          },
          strengths: [],
          weaknesses: ['Baja satisfacción inicial', 'Asistencia irregular'],
        },
        {
          stage: 'active',
          enteredAt: '2025-07-15T10:00:00Z',
          exitedAt: '2025-09-10T10:00:00Z',
          duration: 57,
          events: [
            {
              id: 'e14',
              type: 'feedback',
              title: 'Feedback negativo',
              description: 'Expresó frustración con progreso lento',
              date: '2025-08-20T18:00:00Z',
              channel: 'whatsapp',
              sentiment: 'negative',
              impact: 60,
            },
          ],
          metrics: {
            satisfaction: 3.5,
            engagement: 55,
            attendance: 60,
            spending: 600,
          },
          strengths: [],
          weaknesses: ['Baja asistencia', 'Progreso más lento de lo esperado', 'Frustración expresada'],
        },
        {
          stage: 'at-risk',
          enteredAt: '2025-09-10T10:00:00Z',
          events: [
            {
              id: 'e15',
              type: 'interaction',
              title: 'Última sesión hace 35 días',
              description: 'No ha asistido a sesiones en más de un mes',
              date: '2025-09-15T16:00:00Z',
              channel: 'whatsapp',
              sentiment: 'negative',
              impact: 40,
            },
          ],
          metrics: {
            satisfaction: 3.2,
            engagement: 40,
            attendance: 50,
          },
          strengths: [],
          weaknesses: ['Abandono de sesiones', 'Baja comunicación', 'Riesgo de churn'],
        },
      ],
      analysis: {
        overallHealth: 45,
        strengths: [
          {
            stage: 'first-contact',
            strength: 'moderate',
            description: 'Vino por referido, lo que indica confianza inicial',
            evidence: ['Referido por cliente satisfecha'],
            impact: 'medium',
          },
        ],
        weaknesses: [
          {
            stage: 'onboarding',
            strength: 'weak',
            description: 'Onboarding no logró generar suficiente engagement',
            evidence: ['Satisfacción inicial baja (3.8)', 'Asistencia irregular desde el inicio'],
            impact: 'high',
          },
          {
            stage: 'active',
            strength: 'weak',
            description: 'Progreso lento generó frustración y desmotivación',
            evidence: ['Feedback negativo expresado', 'Baja asistencia (60%)'],
            impact: 'high',
          },
          {
            stage: 'at-risk',
            strength: 'weak',
            description: 'Alto riesgo de abandono, no ha asistido en 35 días',
            evidence: ['Última sesión hace 35 días', 'Baja comunicación'],
            impact: 'critical',
          },
        ],
        criticalMoments: [
          {
            id: 'e14',
            type: 'feedback',
            title: 'Feedback negativo',
            description: 'Expresó frustración con progreso lento',
            date: '2025-08-20T18:00:00Z',
            channel: 'whatsapp',
            sentiment: 'negative',
            impact: 60,
          },
        ],
        dropOffPoints: ['active', 'at-risk'],
      },
      aiRecommendations: [
        {
          id: 'r3',
          type: 'reconnection',
          title: 'Reconexión Urgente',
          description: 'Contactar inmediatamente para entender razones del abandono y ofrecer solución',
          priority: 'high',
          reasoning: 'Cliente en riesgo crítico, necesita intervención inmediata para evitar churn',
          expectedImpact: 'Posibilidad de retención del 40-50% si se actúa rápido',
          suggestedTimeline: 'Hoy',
          actionableSteps: [
            'Llamada personalizada para entender situación',
            'Ofrecer ajuste en plan o objetivos',
            'Proponer sesión de re-engagement sin costo',
            'Crear plan de acción personalizado',
          ],
          relatedStage: 'at-risk',
          confidence: 85,
        },
        {
          id: 'r4',
          type: 'retention',
          title: 'Ajustar Objetivos y Expectativas',
          description: 'Revisar objetivos iniciales y ajustarlos a progreso realista',
          priority: 'high',
          reasoning: 'La frustración viene de expectativas no alineadas con progreso real',
          expectedImpact: 'Mejora en satisfacción y retención',
          suggestedTimeline: 'Esta semana',
          actionableSteps: [
            'Revisar objetivos iniciales vs progreso real',
            'Establecer objetivos más realistas y alcanzables',
            'Crear plan de acción con hitos más frecuentes',
            'Aumentar frecuencia de check-ins',
          ],
          relatedStage: 'at-risk',
          confidence: 80,
        },
      ],
      metrics: {
        totalSessions: 18,
        totalSpent: 600,
        averageSatisfaction: 3.5,
        referralsGiven: 0,
        testimonialsGiven: 0,
        lastPurchaseDate: '2025-06-25T10:00:00Z',
        daysSinceLastSession: 35,
      },
      createdAt: '2025-06-20T09:00:00Z',
      updatedAt: '2025-09-15T16:00:00Z',
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
    const cloned = cloneData(snapshot);
    
    // Cargar datos adicionales para US-CF-01, US-CF-02, US-CF-03, US-CF-04, US-CF-05, US-CF-06, US-CF-07, US-CF-08, US-CF-09 y US-CF-10
    // User Story: Correlación de actividades de comunidad con retención e ingresos
    // User Story: Radar IA de salud comunitaria
    try {
      const [
        voiceConfig,
        segments,
        segmentSummary,
        wowMoments,
        testimonialScripts,
        bestReviewConfig,
        autoPublishedReviews,
        progressBasedMoments,
        aiReferralProgram,
        promoterMissions,
        promoterBrandings,
        referralROIReport,
        aiAdaptedSurveys,
        aiAdaptedSurveyTemplates,
        aiAdaptedSurveyStats,
        successStories,
        aiPlaybook,
        aiPlaybookSuggestions,
        complianceMessages,
        complianceMessageConfig,
        activityCorrelationReport,
        communityHealthRadar,
        communityManagerTemplates,
        communityManagerGuidelines,
        approvalConfig,
        pendingApprovals,
        initiativePrioritization,
      ] = await Promise.all([
        CommunityVoiceAPI.getConfig(),
        CustomerSegmentationAPI.getSegments(),
        CustomerSegmentationAPI.getSegmentSummary(),
        WowMomentsAPI.getMoments(),
        TestimonialScriptsAPI.getScripts(),
        BestReviewsAutoPublishAPI.getBestReviewConfig(),
        BestReviewsAutoPublishAPI.getAutoPublishedReviews(),
        ProgressBasedMomentsAPI.getProgressBasedMoments(),
        AIReferralProgramAPI.getAIReferralProgram(),
        PromoterMissionsAPI.getMissions(),
        PromoterMissionsAPI.getPromoterBrandings(),
        ReferralImpactReportsAPI.getReferralROIReport('30d'),
        AIAdaptedSurveysAPI.getSurveys(),
        AIAdaptedSurveysAPI.getTemplates(),
        AIAdaptedSurveysAPI.getSurveyStats('30d'),
        SuccessStoriesAPI.getSuccessStories(),
        AIPlaybookAPI.getPlaybook(),
        AIPlaybookAPI.getSuggestions('playbook_001'),
        AutomatedComplianceMessagesAPI.getMessages(),
        AutomatedComplianceMessagesAPI.getConfig(),
        CommunityActivityCorrelationAPI.getActivityCorrelationReport(period),
        CommunityHealthRadarAPI.getCommunityHealthRadar(period),
        getCommunityManagerTemplates(),
        getCommunityManagerGuidelines(),
        ApprovalManagerAPI.getConfig(),
        ApprovalManagerAPI.getPending(),
        InitiativePrioritizationAPI.getPrioritization(period),
      ]);
      
      cloned.communityVoiceConfig = voiceConfig || undefined;
      cloned.customerSegments = segments;
      cloned.segmentSummary = segmentSummary;
      cloned.wowMoments = wowMoments;
      cloned.testimonialScripts = testimonialScripts;
      cloned.bestReviewConfig = bestReviewConfig || undefined;
      cloned.autoPublishedReviews = autoPublishedReviews;
      cloned.progressBasedMoments = progressBasedMoments;
      cloned.aiReferralProgram = aiReferralProgram || undefined;
      cloned.promoterMissions = promoterMissions;
      cloned.promoterBrandings = promoterBrandings;
      cloned.referralROIReport = referralROIReport || undefined;
      cloned.aiAdaptedSurveys = aiAdaptedSurveys;
      cloned.aiAdaptedSurveyTemplates = aiAdaptedSurveyTemplates;
      cloned.aiAdaptedSurveyStats = aiAdaptedSurveyStats;
      cloned.successStories = successStories;
      cloned.aiPlaybook = aiPlaybook || undefined;
      cloned.aiPlaybookSuggestions = aiPlaybookSuggestions;
      cloned.automatedComplianceMessages = complianceMessages;
      cloned.complianceMessageConfig = complianceMessageConfig || undefined;
      cloned.activityCorrelationReport = activityCorrelationReport || undefined;
      cloned.communityHealthRadar = communityHealthRadar || undefined;
      cloned.communityManagerTemplates = communityManagerTemplates || undefined;
      cloned.communityManagerGuidelines = communityManagerGuidelines || undefined;
      cloned.approvalConfig = approvalConfig || undefined;
      cloned.pendingApprovals = pendingApprovals || undefined;
      cloned.initiativePrioritization = initiativePrioritization || undefined;

      // User Story: Gamificación de la comunidad con IA
      const [gamificationConfig, badges, clientBadges, challenges, recognitions] = await Promise.all([
        CommunityGamificationAPI.getConfig(),
        CommunityGamificationAPI.getBadges(),
        CommunityGamificationAPI.getClientBadges(),
        CommunityGamificationAPI.getChallenges(),
        CommunityGamificationAPI.getRecognitions(),
      ]);
      cloned.communityGamificationConfig = gamificationConfig || undefined;
      cloned.communityBadges = badges || undefined;
      cloned.clientBadges = clientBadges || undefined;
      cloned.communityChallenges = challenges || undefined;
      cloned.recognitions = recognitions || undefined;

      // User Story: Recomendaciones de contenido/comunicaciones basadas en feedback
      const [
        contentRecommendationsConfig,
        feedbackAnalysis,
        contentRecommendations,
        communicationRecommendations,
      ] = await Promise.all([
        ContentRecommendationsAPI.getConfig(),
        ContentRecommendationsAPI.analyzeFeedback(period),
        ContentRecommendationsAPI.getContentRecommendations(),
        ContentRecommendationsAPI.getCommunicationRecommendations(),
      ]);
      cloned.contentRecommendationsConfig = contentRecommendationsConfig || undefined;
      cloned.feedbackAnalysis = feedbackAnalysis || undefined;
      cloned.contentRecommendations = contentRecommendations || undefined;
      cloned.communicationRecommendations = communicationRecommendations || undefined;
    } catch (error) {
      console.error('Error cargando datos adicionales:', error);
    }
    
    return cloned;
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

