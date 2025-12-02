import type {
  AnalyzeSaturatedTopicsRequest,
  GenerateCreativeTwistsRequest,
  SaturatedTopicsAnalysis,
  SaturatedTopic,
  CreativeTwist,
  ContentStudioPeriod,
  TrainerNiche,
  ContentFormat,
  SocialPlatform,
} from '../types';

// Mock storage - en producción vendría del backend
const analysisHistory: SaturatedTopicsAnalysis[] = [];

/**
 * Analiza el contenido para detectar temas saturados y proponer giros creativos
 */
export const analyzeSaturatedTopics = async (
  request: AnalyzeSaturatedTopicsRequest = {}
): Promise<SaturatedTopicsAnalysis> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const { period = '30d', minFrequency = 3, includeSuggestions = true } = request;

  // Simulación de análisis de temas saturados
  const saturatedTopics: SaturatedTopic[] = generateMockSaturatedTopics(period);
  const creativeTwists: CreativeTwist[] = includeSuggestions
    ? generateMockCreativeTwists(saturatedTopics)
    : [];

  const analysis: SaturatedTopicsAnalysis = {
    id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    trainerId: 'trainer_1',
    period,
    analyzedAt: new Date().toISOString(),
    totalTopicsAnalyzed: 45,
    saturatedTopics: saturatedTopics.filter((t) => t.frequency >= minFrequency),
    creativeTwists,
    recommendations: generateRecommendations(saturatedTopics, creativeTwists),
    insights: generateInsights(saturatedTopics, creativeTwists),
  };

  analysisHistory.push(analysis);

  return analysis;
};

/**
 * Genera giros creativos para un tema específico
 */
export const generateCreativeTwists = async (
  request: GenerateCreativeTwistsRequest
): Promise<CreativeTwist[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const { topic, count = 5, niche, format, platform } = request;

  return generateMockCreativeTwistsForTopic(topic, count, niche, format, platform);
};

/**
 * Obtiene el historial de análisis
 */
export const getAnalysisHistory = async (limit: number = 10): Promise<SaturatedTopicsAnalysis[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return analysisHistory
    .sort((a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime())
    .slice(0, limit);
};

// Funciones auxiliares para generar datos mock

function generateMockSaturatedTopics(period: ContentStudioPeriod): SaturatedTopic[] {
  const commonTopics = [
    {
      topic: 'Rutinas de entrenamiento básicas',
      category: 'Ejercicio',
      frequency: 12,
      saturationScore: 85,
      platforms: ['instagram', 'facebook'] as SocialPlatform[],
      reasons: ['Usado en 12 publicaciones en los últimos 30 días', 'Formato muy repetitivo'],
    },
    {
      topic: 'Tips de nutrición generales',
      category: 'Nutrición',
      frequency: 10,
      saturationScore: 78,
      platforms: ['instagram', 'tiktok'] as SocialPlatform[],
      reasons: ['Contenido muy genérico', 'Poca diferenciación'],
    },
    {
      topic: 'Motivación para entrenar',
      category: 'Motivación',
      frequency: 8,
      saturationScore: 72,
      platforms: ['instagram'] as SocialPlatform[],
      reasons: ['Mensajes similares repetidos', 'Falta de personalización'],
    },
    {
      topic: 'Transformaciones de clientes',
      category: 'Testimonios',
      frequency: 6,
      saturationScore: 65,
      platforms: ['instagram', 'facebook'] as SocialPlatform[],
      reasons: ['Formato predecible', 'Estructura repetitiva'],
    },
    {
      topic: 'Errores comunes en el gimnasio',
      category: 'Educación',
      frequency: 7,
      saturationScore: 68,
      platforms: ['instagram', 'tiktok'] as SocialPlatform[],
      reasons: ['Listas similares repetidas', 'Poca profundidad'],
    },
  ];

  return commonTopics.map((t, index) => ({
    id: `topic_${index + 1}`,
    topic: t.topic,
    category: t.category,
    saturationLevel: t.saturationScore >= 75 ? 'high' : t.saturationScore >= 60 ? 'medium' : 'low',
    saturationScore: t.saturationScore,
    frequency: t.frequency,
    lastUsed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    platforms: t.platforms,
    reasons: t.reasons,
    relatedTopics: commonTopics
      .filter((rt, ri) => ri !== index && rt.category === t.category)
      .map((rt) => rt.topic)
      .slice(0, 2),
  }));
}

function generateMockCreativeTwists(saturatedTopics: SaturatedTopic[]): CreativeTwist[] {
  const twists: CreativeTwist[] = [];

  saturatedTopics.slice(0, 3).forEach((topic) => {
    const topicTwists = generateMockCreativeTwistsForTopic(topic.topic, 2);
    twists.push(...topicTwists);
  });

  return twists;
}

function generateMockCreativeTwistsForTopic(
  topic: string,
  count: number = 3,
  niche?: TrainerNiche,
  format?: ContentFormat,
  platform?: SocialPlatform
): CreativeTwist[] {
  const twistTemplates: Array<{
    twist: string;
    angle: string;
    description: string;
    freshnessScore: number;
    confidence: number;
    priority: 'high' | 'medium' | 'low';
  }> = [
    {
      twist: `${topic} desde la perspectiva de la ciencia del comportamiento`,
      angle: 'Enfoque científico y psicológico',
      description: 'Aprovecha la psicología del comportamiento para explicar por qué ciertos enfoques funcionan mejor',
      freshnessScore: 88,
      confidence: 85,
      priority: 'high',
    },
    {
      twist: `${topic} contado a través de historias reales de transformación`,
      angle: 'Storytelling personalizado',
      description: 'Usa narrativas específicas y detalladas en lugar de consejos genéricos',
      freshnessScore: 82,
      confidence: 80,
      priority: 'high',
    },
    {
      twist: `${topic} desmitificando creencias populares`,
      angle: 'Contrarian approach',
      description: 'Desafía mitos comunes y ofrece una perspectiva contraria pero fundamentada',
      freshnessScore: 90,
      confidence: 75,
      priority: 'medium',
    },
    {
      twist: `${topic} aplicado a situaciones específicas de la vida diaria`,
      angle: 'Aplicación práctica contextualizada',
      description: 'Enfócate en cómo aplicar estos conceptos en situaciones reales y específicas',
      freshnessScore: 85,
      confidence: 88,
      priority: 'high',
    },
    {
      twist: `${topic} desde la perspectiva de la neurociencia`,
      angle: 'Enfoque neurocientífico',
      description: 'Explica cómo el cerebro y el sistema nervioso responden a estos estímulos',
      freshnessScore: 87,
      confidence: 82,
      priority: 'medium',
    },
  ];

  return twistTemplates.slice(0, count).map((template, index) => ({
    id: `twist_${Date.now()}_${index}`,
    originalTopic: topic,
    twist: template.twist,
    description: template.description,
    angle: template.angle,
    freshnessScore: template.freshnessScore,
    suggestedFormats: format ? [format] : (['reel', 'carousel', 'post'] as ContentFormat[]),
    suggestedPlatforms: platform ? [platform] : (['instagram', 'tiktok'] as SocialPlatform[]),
    exampleContent: {
      hook: `¿Sabías que ${topic.toLowerCase()} tiene más que ver con tu cerebro que con tu fuerza?`,
      body: `La mayoría de la gente piensa que ${topic.toLowerCase()} es solo cuestión de disciplina, pero la ciencia dice otra cosa...`,
      cta: 'Comenta "CIENCIA" y te explico los 3 factores clave que nadie te cuenta',
    },
    tags: [topic.toLowerCase().split(' ')[0], 'innovación', 'ciencia', 'fresh'],
    confidence: template.confidence,
    priority: template.priority,
  }));
}

function generateRecommendations(
  topics: SaturatedTopic[],
  twists: CreativeTwist[]
): SaturatedTopicsAnalysis['recommendations'] {
  const recommendations: SaturatedTopicsAnalysis['recommendations'] = [];

  topics
    .filter((t) => t.saturationLevel === 'high')
    .slice(0, 3)
    .forEach((topic) => {
      const relatedTwists = twists.filter((tw) => tw.originalTopic === topic.topic);
      recommendations.push({
        id: `rec_${topic.id}`,
        type: relatedTwists.length > 0 ? 'refresh' : 'avoid',
        topic: topic.topic,
        message: relatedTwists.length > 0
          ? `Este tema está muy saturado. Considera usar uno de los giros creativos propuestos.`
          : `Evita este tema por ahora o busca un ángulo completamente nuevo.`,
        priority: topic.saturationLevel === 'high' ? 'high' : 'medium',
        actionItems: relatedTwists.length > 0
          ? [
              `Aplica el giro: "${relatedTwists[0].twist}"`,
              `Usa el formato sugerido: ${relatedTwists[0].suggestedFormats.join(', ')}`,
              `Publica en: ${relatedTwists[0].suggestedPlatforms.join(', ')}`,
            ]
          : [
              `Pausa contenido sobre "${topic.topic}" por al menos 2 semanas`,
              `Explora temas relacionados pero no saturados: ${topic.relatedTopics.join(', ')}`,
            ],
      });
    });

  return recommendations;
}

function generateInsights(
  topics: SaturatedTopic[],
  twists: CreativeTwist[]
): SaturatedTopicsAnalysis['insights'] {
  return [
    {
      id: 'insight_1',
      title: 'Alta saturación en contenido educativo básico',
      description: `Tienes ${topics.filter((t) => t.category === 'Educación').length} temas educativos que están muy saturados. Considera profundizar más o cambiar el formato.`,
      type: 'warning',
      priority: 'high',
    },
    {
      id: 'insight_2',
      title: 'Oportunidad en enfoques científicos',
      description: `Los giros creativos con enfoque científico tienen un freshness score promedio de ${Math.round(twists.filter((t) => t.angle.includes('ciencia') || t.angle.includes('neuro')).reduce((acc, t) => acc + t.freshnessScore, 0) / Math.max(1, twists.filter((t) => t.angle.includes('ciencia') || t.angle.includes('neuro')).length))}.`,
      type: 'opportunity',
      priority: 'medium',
    },
    {
      id: 'insight_3',
      title: 'Tendencia hacia storytelling personalizado',
      description: 'El contenido con historias reales y específicas está generando más engagement que los consejos genéricos.',
      type: 'trend',
      priority: 'medium',
    },
  ];
}

