import type {
  GetPostCampaignInsightsRequest,
  GetPostCampaignInsightsResponse,
  CampaignInsight,
  BuyerPersona,
  ContentPerformanceByPersona,
  ContentStudioPeriod,
  PlannerContentType,
  SocialPlatform,
} from '../types';

// Mock storage - en producción vendría del backend
const insightsHistory: CampaignInsight[] = [];

/**
 * Obtiene insights post-campaña sobre qué contenido impactó más a cada buyer persona
 */
export const getPostCampaignInsights = async (
  request: GetPostCampaignInsightsRequest = {}
): Promise<GetPostCampaignInsightsResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const { period = '30d', campaignId, personaIds, minEngagement = 0 } = request;

  // Generar personas mock
  const buyerPersonas = generateMockBuyerPersonas();

  // Filtrar personas si se especifican
  const filteredPersonas = personaIds
    ? buyerPersonas.filter((p) => personaIds.includes(p.id))
    : buyerPersonas;

  // Generar insights mock
  const insights = generateMockCampaignInsights(period, campaignId, filteredPersonas, minEngagement);

  // Calcular resumen
  const summary = calculateSummary(insights);

  return {
    insights,
    summary,
  };
};

/**
 * Obtiene un insight específico por ID
 */
export const getInsightById = async (insightId: string): Promise<CampaignInsight | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return insightsHistory.find((i) => i.id === insightId) || null;
};

// Funciones auxiliares para generar datos mock

function generateMockBuyerPersonas(): BuyerPersona[] {
  return [
    {
      id: 'persona_1',
      name: 'Ejecutivos ocupados',
      description: 'Profesionales de 30-45 años que buscan eficiencia y resultados rápidos',
      characteristics: ['Tiempo limitado', 'Buscan resultados rápidos', 'Valoran la eficiencia'],
      painPoints: ['Falta de tiempo', 'Estrés laboral', 'Dificultad para mantener rutinas'],
      goals: ['Mantenerse en forma', 'Reducir estrés', 'Mejorar energía'],
      demographics: {
        ageRange: '30-45',
        gender: 'Mixto',
        location: 'Urban',
      },
    },
    {
      id: 'persona_2',
      name: 'Mamás postparto',
      description: 'Mujeres de 25-35 años que buscan recuperar su forma física después del embarazo',
      characteristics: ['Priorizan la salud', 'Buscan comunidad', 'Necesitan flexibilidad'],
      painPoints: ['Falta de tiempo', 'Cambios corporales', 'Culpa por cuidarse'],
      goals: ['Recuperar fuerza', 'Sentirse bien consigo mismas', 'Energía para cuidar a sus hijos'],
      demographics: {
        ageRange: '25-35',
        gender: 'Femenino',
        location: 'Suburban',
      },
    },
    {
      id: 'persona_3',
      name: 'Deportistas amateur',
      description: 'Personas de 20-40 años que practican deportes y buscan mejorar rendimiento',
      characteristics: ['Competitivos', 'Valoran el conocimiento técnico', 'Buscan mejorar constantemente'],
      painPoints: ['Lesiones', 'Estancamiento', 'Falta de conocimiento técnico'],
      goals: ['Mejorar rendimiento', 'Prevenir lesiones', 'Alcanzar metas deportivas'],
      demographics: {
        ageRange: '20-40',
        gender: 'Mixto',
        location: 'Urban/Suburban',
      },
    },
    {
      id: 'persona_4',
      name: 'Personas que buscan perder peso',
      description: 'Adultos de 25-50 años enfocados en pérdida de peso sostenible',
      characteristics: ['Han intentado múltiples dietas', 'Buscan soluciones sostenibles', 'Necesitan motivación'],
      painPoints: ['Efecto rebote', 'Frustración con dietas', 'Falta de resultados'],
      goals: ['Perder peso de forma sostenible', 'Mejorar salud', 'Aumentar autoestima'],
      demographics: {
        ageRange: '25-50',
        gender: 'Mixto',
        location: 'Mixto',
      },
    },
  ];
}

function generateMockCampaignInsights(
  period: ContentStudioPeriod,
  campaignId?: string,
  personas: BuyerPersona[] = [],
  minEngagement: number = 0
): CampaignInsight[] {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const endDate = new Date();

  // Generar contenido mock
  const contentPerformance = generateMockContentPerformance(personas, startDate, endDate, minEngagement);

  const insight: CampaignInsight = {
    id: campaignId || `insight_${Date.now()}`,
    campaignId,
    campaignName: campaignId ? 'Campaña de Verano 2024' : undefined,
    period: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
    analyzedAt: new Date().toISOString(),
    totalContent: contentPerformance.length,
    buyerPersonas: personas,
    performanceByPersona: contentPerformance,
    topPerformingContent: generateTopPerformingContent(contentPerformance),
    insights: generateInsights(contentPerformance, personas),
    recommendations: generateRecommendations(contentPerformance, personas),
  };

  insightsHistory.push(insight);

  return [insight];
}

function generateMockContentPerformance(
  personas: BuyerPersona[],
  startDate: Date,
  endDate: Date,
  minEngagement: number
): ContentPerformanceByPersona[] {
  const contentTemplates = [
    {
      title: 'Rutina de 15 minutos para ejecutivos',
      type: 'reel' as PlannerContentType,
      platform: 'instagram' as SocialPlatform,
      topics: ['eficiencia', 'tiempo', 'ejecutivos'],
    },
    {
      title: 'Transformación postparto: historia real',
      type: 'carousel' as PlannerContentType,
      platform: 'instagram' as SocialPlatform,
      topics: ['postparto', 'transformación', 'mamás'],
    },
    {
      title: 'Cómo prevenir lesiones en corredores',
      type: 'post' as PlannerContentType,
      platform: 'instagram' as SocialPlatform,
      topics: ['lesiones', 'running', 'prevención'],
    },
    {
      title: 'Mitos sobre pérdida de peso',
      type: 'reel' as PlannerContentType,
      platform: 'tiktok' as SocialPlatform,
      topics: ['pérdida peso', 'mitos', 'nutrición'],
    },
    {
      title: 'Tips de nutrición para mamás ocupadas',
      type: 'carousel' as PlannerContentType,
      platform: 'instagram' as SocialPlatform,
      topics: ['nutrición', 'mamás', 'práctico'],
    },
  ];

  const performance: ContentPerformanceByPersona[] = [];

  contentTemplates.forEach((content, contentIndex) => {
    personas.forEach((persona) => {
      // Calcular impacto basado en relevancia del contenido para la persona
      const relevanceScore = calculateRelevanceScore(content, persona);
      const baseEngagement = Math.floor(relevanceScore * 1000 + Math.random() * 500);

      if (baseEngagement >= minEngagement) {
        const engagementRate = (baseEngagement / (baseEngagement + Math.random() * 5000)) * 100;

        performance.push({
          contentId: `content_${contentIndex + 1}`,
          contentTitle: content.title,
          contentType: content.type,
          platform: content.platform,
          publishedAt: new Date(
            startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
          ).toISOString(),
          personaId: persona.id,
          personaName: persona.name,
          metrics: {
            reach: Math.floor(baseEngagement * 3 + Math.random() * 2000),
            impressions: Math.floor(baseEngagement * 5 + Math.random() * 3000),
            engagement: baseEngagement,
            engagementRate: Math.round(engagementRate * 100) / 100,
            clicks: Math.floor(baseEngagement * 0.1),
            saves: Math.floor(baseEngagement * 0.15),
            shares: Math.floor(baseEngagement * 0.05),
            comments: Math.floor(baseEngagement * 0.08),
            likes: Math.floor(baseEngagement * 0.7),
          },
          impact: {
            score: Math.min(100, Math.floor(relevanceScore * 100 + Math.random() * 20)),
            level: relevanceScore > 0.7 ? 'high' : relevanceScore > 0.5 ? 'medium' : 'low',
            reasons: generateImpactReasons(content, persona, relevanceScore),
            sentiment: relevanceScore > 0.6 ? 'positive' : 'neutral',
          },
          conversion: relevanceScore > 0.6
            ? {
                leadsGenerated: Math.floor(baseEngagement * 0.02),
                consultations: Math.floor(baseEngagement * 0.01),
                sales: Math.floor(baseEngagement * 0.005),
                revenue: Math.floor(baseEngagement * 0.01 * 50), // Asumiendo $50 por venta promedio
              }
            : undefined,
        });
      }
    });
  });

  return performance;
}

function calculateRelevanceScore(
  content: { title: string; topics: string[] },
  persona: BuyerPersona
): number {
  let score = 0.3; // Base score

  // Match por nombre de persona
  if (persona.name.toLowerCase().includes('ejecutivo') && content.title.toLowerCase().includes('ejecutivo')) {
    score += 0.4;
  }
  if (persona.name.toLowerCase().includes('mamá') || persona.name.toLowerCase().includes('postparto')) {
    if (content.title.toLowerCase().includes('mamá') || content.title.toLowerCase().includes('postparto')) {
      score += 0.4;
    }
  }
  if (persona.name.toLowerCase().includes('deportista')) {
    if (content.topics.some((t) => ['lesiones', 'running', 'rendimiento'].includes(t))) {
      score += 0.4;
    }
  }
  if (persona.name.toLowerCase().includes('perder peso')) {
    if (content.topics.some((t) => ['pérdida peso', 'nutrición'].includes(t))) {
      score += 0.4;
    }
  }

  // Match por pain points
  const painPointMatches = persona.painPoints.filter((pp) =>
    content.title.toLowerCase().includes(pp.toLowerCase().split(' ')[0])
  ).length;
  score += painPointMatches * 0.1;

  // Match por goals
  const goalMatches = persona.goals.filter((g) =>
    content.title.toLowerCase().includes(g.toLowerCase().split(' ')[0])
  ).length;
  score += goalMatches * 0.1;

  return Math.min(1, score);
}

function generateImpactReasons(
  content: { title: string; topics: string[] },
  persona: BuyerPersona,
  relevanceScore: number
): string[] {
  const reasons: string[] = [];

  if (relevanceScore > 0.7) {
    reasons.push('El contenido aborda directamente los pain points de esta persona');
    reasons.push('El formato y tono resuenan con las características de la audiencia');
    if (content.topics.some((t) => persona.goals.some((g) => g.toLowerCase().includes(t)))) {
      reasons.push('El tema está alineado con los objetivos principales');
    }
  } else if (relevanceScore > 0.5) {
    reasons.push('El contenido tiene relevancia parcial para esta persona');
    reasons.push('Algunos elementos resuenan pero podría ser más específico');
  } else {
    reasons.push('El contenido no está específicamente dirigido a esta persona');
    reasons.push('Considera adaptar el mensaje para mayor relevancia');
  }

  return reasons;
}

function generateTopPerformingContent(
  performance: ContentPerformanceByPersona[]
): CampaignInsight['topPerformingContent'] {
  // Agrupar por contenido
  const contentMap = new Map<string, ContentPerformanceByPersona[]>();
  performance.forEach((p) => {
    const existing = contentMap.get(p.contentId) || [];
    existing.push(p);
    contentMap.set(p.contentId, existing);
  });

  // Calcular scores y encontrar top persona por contenido
  const topContent = Array.from(contentMap.entries())
    .map(([contentId, performances]) => {
      const totalEngagement = performances.reduce((sum, p) => sum + p.metrics.engagement, 0);
      const totalReach = performances.reduce((sum, p) => sum + p.metrics.reach, 0);
      const avgEngagementRate =
        performances.reduce((sum, p) => sum + p.metrics.engagementRate, 0) / performances.length;

      const topPersona = performances.reduce((top, current) =>
        current.impact.score > top.impact.score ? current : top
      );

      return {
        contentId,
        contentTitle: performances[0].contentTitle,
        overallScore: Math.round(
          (totalEngagement / 1000 + avgEngagementRate + topPersona.impact.score / 100) * 10
        ),
        topPersona: topPersona.personaName,
        metrics: {
          totalEngagement,
          totalReach,
          engagementRate: Math.round(avgEngagementRate * 100) / 100,
        },
      };
    })
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 5);

  return topContent;
}

function generateInsights(
  performance: ContentPerformanceByPersona[],
  personas: BuyerPersona[]
): CampaignInsight['insights'] {
  const insights: CampaignInsight['insights'] = [];

  // Insight por persona
  personas.forEach((persona) => {
    const personaPerformance = performance.filter((p) => p.personaId === persona.id);
    if (personaPerformance.length === 0) return;

    const avgEngagementRate =
      personaPerformance.reduce((sum, p) => sum + p.metrics.engagementRate, 0) / personaPerformance.length;
    const highImpactContent = personaPerformance.filter((p) => p.impact.level === 'high');

    if (highImpactContent.length > 0) {
      insights.push({
        id: `insight_persona_${persona.id}`,
        type: 'pattern',
        title: `${persona.name}: Contenido de alto impacto identificado`,
        description: `${highImpactContent.length} piezas de contenido tuvieron alto impacto en esta persona, con un engagement rate promedio de ${avgEngagementRate.toFixed(2)}%.`,
        personaId: persona.id,
        personaName: persona.name,
        priority: 'high',
        actionable: true,
        actionItems: [
          `Replicar el formato de: ${highImpactContent[0].contentTitle}`,
          `Usar temas similares: ${highImpactContent.map((c) => c.contentTitle).join(', ')}`,
        ],
        relatedContentIds: highImpactContent.map((c) => c.contentId),
      });
    }
  });

  // Insight general
  const totalLeads = performance.reduce((sum, p) => sum + (p.conversion?.leadsGenerated || 0), 0);
  if (totalLeads > 0) {
    insights.push({
      id: 'insight_general_1',
      type: 'opportunity',
      title: 'Oportunidad de optimización de conversión',
      description: `El contenido generó ${totalLeads} leads en total. Considera crear más contenido similar al que generó más conversiones.`,
      priority: 'medium',
      actionable: true,
      actionItems: [
        'Identificar patrones en contenido que genera leads',
        'Crear más contenido con formato y temas similares',
      ],
    });
  }

  return insights;
}

function generateRecommendations(
  performance: ContentPerformanceByPersona[],
  personas: BuyerPersona[]
): CampaignInsight['recommendations'] {
  const recommendations: CampaignInsight['recommendations'] = [];

  personas.forEach((persona) => {
    const personaPerformance = performance.filter((p) => p.personaId === persona.id);
    if (personaPerformance.length === 0) return;

    const topContent = personaPerformance
      .sort((a, b) => b.impact.score - a.impact.score)
      .slice(0, 2);

    if (topContent.length > 0) {
      const top = topContent[0];
      recommendations.push({
        id: `rec_${persona.id}`,
        personaId: persona.id,
        personaName: persona.name,
        recommendation: `Crea más contenido similar a "${top.contentTitle}" para esta persona`,
        reason: `Este contenido tuvo un impacto score de ${top.impact.score}/100 y generó ${top.metrics.engagement} interacciones.`,
        suggestedContentTypes: [top.contentType],
        suggestedTopics: top.contentTitle.split(' ').slice(0, 3),
        priority: top.impact.level === 'high' ? 'high' : 'medium',
      });
    }
  });

  return recommendations;
}

function calculateSummary(insights: CampaignInsight[]): GetPostCampaignInsightsResponse['summary'] {
  if (insights.length === 0) {
    return {
      totalCampaigns: 0,
      totalContent: 0,
      totalPersonas: 0,
      averageEngagementRate: 0,
      topPerformingPersona: {
        personaId: '',
        personaName: '',
        averageEngagementRate: 0,
      },
    };
  }

  const insight = insights[0];
  const totalContent = insight.totalContent;
  const totalPersonas = insight.buyerPersonas.length;

  // Calcular engagement rate promedio por persona
  const personaEngagementRates = insight.buyerPersonas.map((persona) => {
    const personaPerformance = insight.performanceByPersona.filter((p) => p.personaId === persona.id);
    const avgRate =
      personaPerformance.length > 0
        ? personaPerformance.reduce((sum, p) => sum + p.metrics.engagementRate, 0) / personaPerformance.length
        : 0;
    return {
      personaId: persona.id,
      personaName: persona.name,
      averageEngagementRate: avgRate,
    };
  });

  const topPersona = personaEngagementRates.reduce((top, current) =>
    current.averageEngagementRate > top.averageEngagementRate ? current : top
  );

  const averageEngagementRate =
    personaEngagementRates.reduce((sum, p) => sum + p.averageEngagementRate, 0) / totalPersonas;

  return {
    totalCampaigns: insights.length,
    totalContent,
    totalPersonas,
    averageEngagementRate: Math.round(averageEngagementRate * 100) / 100,
    topPerformingPersona: topPersona,
  };
}

