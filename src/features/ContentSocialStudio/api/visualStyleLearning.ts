import type {
  VisualStyle,
  VisualStyleAttribute,
  VisualStylePerformance,
  VisualStyleRecommendation,
  VisualStyleLearningConfig,
  VisualStyleLearningSnapshot,
  GetVisualStyleRecommendationsRequest,
  GetVisualStyleRecommendationsResponse,
  ContentFormat,
  SocialPlatform,
  TrainerNiche,
} from '../types';

// Mock storage - en producción vendría del backend
let learningConfig: VisualStyleLearningConfig | null = null;
let learnedStyles: VisualStylePerformance[] = [];
let recommendations: VisualStyleRecommendation[] = [];

/**
 * Simula latencia de red
 */
const simulateLatency = async (ms: number = 300) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Inicializa la configuración de aprendizaje por defecto
 */
function getDefaultConfig(): VisualStyleLearningConfig {
  return {
    trainerId: 'trn_current',
    enabled: true,
    learningPeriod: '30d',
    minPostsForLearning: 3,
    attributesToTrack: [
      'color-scheme',
      'composition',
      'typography-style',
      'image-style',
      'video-pacing',
      'overlay-style',
      'text-placement',
      'filter-style',
    ],
    autoRecommendations: true,
    recommendationFrequency: 'weekly',
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Obtiene o crea la configuración de aprendizaje
 */
export const getVisualStyleLearningConfig = async (): Promise<VisualStyleLearningConfig> => {
  await simulateLatency(200);

  if (!learningConfig) {
    learningConfig = getDefaultConfig();
  }

  return learningConfig;
};

/**
 * Actualiza la configuración de aprendizaje
 */
export const updateVisualStyleLearningConfig = async (
  updates: Partial<VisualStyleLearningConfig>
): Promise<VisualStyleLearningConfig> => {
  await simulateLatency(300);

  if (!learningConfig) {
    learningConfig = getDefaultConfig();
  }

  learningConfig = {
    ...learningConfig,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return learningConfig;
};

/**
 * Genera estilos visuales aprendidos basados en contenido existente (mock)
 */
function generateLearnedStyles(): VisualStylePerformance[] {
  const styles: VisualStyle[] = [
    {
      id: 'style-1',
      attributes: {
        'color-scheme': 'vibrant-warm',
        'composition': 'centered-subject',
        'typography-style': 'bold-overlay',
        'image-style': 'high-contrast',
        'overlay-style': 'gradient-dark',
        'text-placement': 'bottom-center',
      },
      description: 'Estilo vibrante con colores cálidos, sujeto centrado y texto en negrita',
      tags: ['vibrante', 'calido', 'alto-contraste', 'centrado'],
      thumbnailUrl: '/mock-thumbnails/style-1.jpg',
    },
    {
      id: 'style-2',
      attributes: {
        'color-scheme': 'minimal-cool',
        'composition': 'rule-of-thirds',
        'typography-style': 'minimal-clean',
        'image-style': 'soft-focus',
        'overlay-style': 'subtle-white',
        'text-placement': 'top-left',
      },
      description: 'Estilo minimalista con colores fríos y composición rule of thirds',
      tags: ['minimalista', 'frio', 'limpio', 'rule-of-thirds'],
      thumbnailUrl: '/mock-thumbnails/style-2.jpg',
    },
    {
      id: 'style-3',
      attributes: {
        'color-scheme': 'monochrome',
        'composition': 'asymmetric',
        'typography-style': 'bold-serif',
        'image-style': 'black-white',
        'overlay-style': 'none',
        'text-placement': 'center',
      },
      description: 'Estilo monocromático con composición asimétrica',
      tags: ['monocromo', 'blanco-negro', 'asimetrico', 'elegante'],
      thumbnailUrl: '/mock-thumbnails/style-3.jpg',
    },
    {
      id: 'style-4',
      attributes: {
        'color-scheme': 'energetic-bright',
        'composition': 'diagonal',
        'typography-style': 'playful-bold',
        'image-style': 'saturated',
        'overlay-style': 'color-splash',
        'text-placement': 'diagonal',
        'video-pacing': 'fast-cuts',
      },
      description: 'Estilo energético con colores brillantes y cortes rápidos',
      tags: ['energetico', 'brillante', 'rapido', 'jugueton'],
      thumbnailUrl: '/mock-thumbnails/style-4.jpg',
    },
  ];

  return styles.map((style, index) => {
    const baseEngagement = [8500, 12000, 6800, 15000][index];
    const baseReach = baseEngagement * 3;
    const engagementRate = [8.5, 12.0, 6.8, 15.0][index];
    const leadsGenerated = Math.floor(baseEngagement * 0.02);

    return {
      styleId: style.id,
      style,
      metrics: {
        totalPosts: [12, 18, 8, 25][index],
        averageEngagement: baseEngagement,
        averageReach: baseReach,
        averageEngagementRate: engagementRate,
        averageLeadsGenerated: leadsGenerated,
        averageRevenue: leadsGenerated * 150,
        topPerformingContent: [
          {
            contentId: `content-${style.id}-1`,
            engagement: baseEngagement * 1.5,
            reach: baseReach * 1.5,
            engagementRate: engagementRate * 1.2,
          },
          {
            contentId: `content-${style.id}-2`,
            engagement: baseEngagement * 1.3,
            reach: baseReach * 1.3,
            engagementRate: engagementRate * 1.1,
          },
        ],
      },
      trend: {
        direction: index < 2 ? 'up' : index === 2 ? 'stable' : 'up',
        changePercentage: [15, 22, 0, 30][index],
        period: '30d',
      },
      score: [75, 88, 65, 92][index],
      priority: index < 2 ? 'high' : index === 2 ? 'medium' : 'high',
    };
  });
}

/**
 * Genera recomendaciones basadas en estilos aprendidos
 */
function generateRecommendations(
  learnedStyles: VisualStylePerformance[],
  request?: GetVisualStyleRecommendationsRequest
): VisualStyleRecommendation[] {
  const topStyles = learnedStyles
    .filter((sp) => sp.score >= 70)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return topStyles.map((stylePerf, index) => {
    const similarStyles = learnedStyles
      .filter((sp) => sp.styleId !== stylePerf.styleId && sp.score >= 70)
      .slice(0, 2)
      .map((sp) => ({
        styleId: sp.styleId,
        style: sp.style,
        performance: {
          engagement: sp.metrics.averageEngagement,
          engagementRate: sp.metrics.averageEngagementRate,
        },
      }));

    const suggestedFormats: Array<{
      format: ContentFormat;
      platform: SocialPlatform;
      priority: 'high' | 'medium' | 'low';
      reason: string;
    }> = [];

    if (!request?.contentType || request.contentType === 'reel') {
      suggestedFormats.push({
        format: 'reel',
        platform: 'instagram',
        priority: 'high',
        reason: 'Este estilo ha mostrado excelente rendimiento en formato reel',
      });
    }
    if (!request?.contentType || request.contentType === 'post') {
      suggestedFormats.push({
        format: 'post',
        platform: 'instagram',
        priority: 'medium',
        reason: 'Estilo probado con buen engagement en posts',
      });
    }
    if (!request?.contentType || request.contentType === 'carousel') {
      suggestedFormats.push({
        format: 'carousel',
        platform: 'instagram',
        priority: 'medium',
        reason: 'Composición ideal para carousels',
      });
    }

    return {
      id: `rec-${stylePerf.styleId}-${Date.now()}`,
      recommendedStyle: stylePerf.style,
      reason: `Este estilo ha obtenido un engagement promedio de ${stylePerf.metrics.averageEngagement.toLocaleString()} interacciones con una tasa del ${stylePerf.metrics.averageEngagementRate}%`,
      confidence: Math.min(95, stylePerf.score + 5),
      expectedEngagement: {
        min: Math.floor(stylePerf.metrics.averageEngagement * 0.8),
        max: Math.floor(stylePerf.metrics.averageEngagement * 1.3),
        average: stylePerf.metrics.averageEngagement,
      },
      similarHighPerformingStyles: similarStyles,
      suggestedFormats,
      createdAt: new Date().toISOString(),
    };
  });
}

/**
 * Obtiene el snapshot completo de aprendizaje de estilos visuales
 */
export const getVisualStyleLearningSnapshot = async (): Promise<VisualStyleLearningSnapshot> => {
  await simulateLatency(400);

  const config = await getVisualStyleLearningConfig();

  // Si no hay estilos aprendidos, generarlos
  if (learnedStyles.length === 0) {
    learnedStyles = generateLearnedStyles();
  }

  // Si no hay recomendaciones, generarlas
  if (recommendations.length === 0) {
    recommendations = generateRecommendations(learnedStyles);
  }

  const insights = [
    {
      id: 'insight-1',
      title: 'Estilos vibrantes con alto contraste generan más engagement',
      description:
        'Los estilos con colores vibrantes y alto contraste han mostrado un 30% más de engagement que los estilos minimalistas',
      type: 'trend' as const,
      priority: 'high' as const,
      relatedStyles: ['style-1', 'style-4'],
    },
    {
      id: 'insight-2',
      title: 'Composición centrada funciona mejor en reels',
      description:
        'Los reels con composición centrada y texto en la parte inferior tienen un 25% más de engagement',
      type: 'pattern' as const,
      priority: 'high' as const,
      relatedStyles: ['style-1'],
    },
    {
      id: 'insight-3',
      title: 'Recomendación: Probar más contenido con estilo energético',
      description:
        'El estilo energético con cortes rápidos está mostrando excelentes resultados. Considera aumentar su uso.',
      type: 'recommendation' as const,
      priority: 'high' as const,
      relatedStyles: ['style-4'],
    },
  ];

  return {
    config,
    learnedStyles,
    recommendations,
    insights,
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Obtiene recomendaciones de estilos visuales
 */
export const getVisualStyleRecommendations = async (
  request?: GetVisualStyleRecommendationsRequest
): Promise<GetVisualStyleRecommendationsResponse> => {
  await simulateLatency(300);

  const snapshot = await getVisualStyleLearningSnapshot();

  let filteredRecommendations = snapshot.recommendations;

  // Filtrar por formato si se especifica
  if (request?.contentType) {
    filteredRecommendations = filteredRecommendations.filter((rec) =>
      rec.suggestedFormats.some((sf) => sf.format === request.contentType)
    );
  }

  // Filtrar por plataforma si se especifica
  if (request?.platform) {
    filteredRecommendations = filteredRecommendations.filter((rec) =>
      rec.suggestedFormats.some((sf) => sf.platform === request.platform)
    );
  }

  // Filtrar por confianza mínima
  if (request?.minConfidence) {
    filteredRecommendations = filteredRecommendations.filter(
      (rec) => rec.confidence >= request.minConfidence!
    );
  }

  // Limitar resultados
  if (request?.limit) {
    filteredRecommendations = filteredRecommendations.slice(0, request.limit);
  }

  // Generar insights relevantes
  const insights = snapshot.insights.filter((insight) => {
    if (request?.contentType) {
      // Filtrar insights relevantes al formato
      return true; // Simplificado, en producción sería más específico
    }
    return true;
  });

  return {
    recommendations: filteredRecommendations,
    insights: insights.slice(0, 3),
  };
};

/**
 * Actualiza el aprendizaje con nuevo contenido (mock - en producción analizaría contenido real)
 */
export const updateVisualStyleLearning = async (): Promise<VisualStyleLearningSnapshot> => {
  await simulateLatency(500);

  // En producción, aquí se analizaría el contenido nuevo y se actualizarían los estilos aprendidos
  // Por ahora, regeneramos los estilos aprendidos
  learnedStyles = generateLearnedStyles();
  recommendations = generateRecommendations(learnedStyles);

  return getVisualStyleLearningSnapshot();
};

