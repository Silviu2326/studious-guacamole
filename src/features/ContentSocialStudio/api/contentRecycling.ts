import type {
  WinningContent,
  ContentRecycling,
  RecyclingSuggestion,
  TargetContentFormat,
  SourceContentFormat,
} from '../types';
import { getSocialPosts } from '../../PlannerDeRedesSociales/api/social';
import { getContentLeadAnalytics } from './contentAnalytics';

// Obtener contenido ganador basado en métricas de rendimiento
export const getWinningContent = async (options?: {
  minScore?: number;
  limit?: number;
  format?: SourceContentFormat;
}): Promise<WinningContent[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  // Obtener posts de redes sociales
  const posts = await getSocialPosts({ limit: 50 });
  
  // Obtener analytics para calcular scores
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const analytics = await getContentLeadAnalytics(
    thirtyDaysAgo.toISOString(),
    now.toISOString()
  );
  
  // Crear mapa de analytics por post
  const analyticsMap = new Map(
    analytics.map((a) => [a.postId, a])
  );
  
  // Convertir posts a WinningContent con scores calculados
  const winningContent: WinningContent[] = posts
    .filter((post) => {
      const analytics = analyticsMap.get(post.id);
      if (!analytics) return false;
      
      // Calcular score basado en engagement rate y conversiones
      const engagementRate = analytics.engagement.reach > 0
        ? ((analytics.engagement.likes + analytics.engagement.comments + analytics.engagement.shares) / analytics.engagement.reach) * 100
        : 0;
      
      const score = Math.min(100, 
        (engagementRate * 0.5) + 
        (analytics.conversionRate * 0.3) + 
        (Math.min(analytics.leadsGenerated.total / 10, 1) * 20)
      );
      
      return score >= (options?.minScore || 50);
    })
    .map((post) => {
      const analytics = analyticsMap.get(post.id)!;
      const engagementRate = analytics.engagement.reach > 0
        ? ((analytics.engagement.likes + analytics.engagement.comments + analytics.engagement.shares) / analytics.engagement.reach) * 100
        : 0;
      
      const score = Math.min(100,
        (engagementRate * 0.5) +
        (analytics.conversionRate * 0.3) +
        (Math.min(analytics.leadsGenerated.total / 10, 1) * 20)
      );
      
      // Determinar formato original
      let originalFormat: SourceContentFormat = 'post';
      if (post.contentType === 'reel' || post.contentType === 'video') {
        originalFormat = 'video';
      } else if (post.contentType === 'carousel') {
        originalFormat = 'carousel';
      }
      
      return {
        id: `winning_${post.id}`,
        sourceId: post.id,
        title: post.content?.substring(0, 60) || 'Contenido sin título',
        originalFormat,
        originalPlatform: post.platform,
        originalContent: {
          text: post.content || '',
          mediaUrls: post.mediaUrls,
          hashtags: post.hashtags || [],
        },
        performance: {
          engagement: analytics.engagement.likes + analytics.engagement.comments + analytics.engagement.shares,
          reach: analytics.engagement.reach,
          conversions: analytics.leadsGenerated.converted,
          engagementRate,
          score: Math.round(score),
        },
        publishedAt: post.publishedAt || post.scheduledAt,
        topics: extractTopics(post.content || ''),
      };
    })
    .sort((a, b) => b.performance.score - a.performance.score)
    .slice(0, options?.limit || 20);
  
  // Filtrar por formato si se especifica
  if (options?.format) {
    return winningContent.filter((wc) => wc.originalFormat === options.format);
  }
  
  return winningContent;
};

// Extraer temas del contenido
const extractTopics = (content: string): string[] => {
  const topics: string[] = [];
  const lower = content.toLowerCase();
  
  if (lower.includes('nutrición') || lower.includes('nutricion') || lower.includes('dieta')) {
    topics.push('nutrición');
  }
  if (lower.includes('ejercicio') || lower.includes('entrenamiento') || lower.includes('rutina')) {
    topics.push('ejercicio');
  }
  if (lower.includes('transformación') || lower.includes('transformacion') || lower.includes('antes/después')) {
    topics.push('transformación');
  }
  if (lower.includes('motivación') || lower.includes('motivacion') || lower.includes('inspiración')) {
    topics.push('motivación');
  }
  if (lower.includes('salud') || lower.includes('bienestar')) {
    topics.push('bienestar');
  }
  
  return topics.length > 0 ? topics : ['general'];
};

// Obtener sugerencias de reciclaje para contenido ganador
export const getRecyclingSuggestions = async (
  sourceContentId: string
): Promise<RecyclingSuggestion | null> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  const winningContent = await getWinningContent();
  const source = winningContent.find((wc) => wc.id === sourceContentId);
  
  if (!source) {
    return null;
  }
  
  // Generar sugerencias basadas en el formato original
  const suggestions: RecyclingSuggestion['suggestedFormats'] = [];
  
  if (source.originalFormat === 'blog' || source.originalFormat === 'post') {
    suggestions.push(
      {
        format: 'reel',
        platform: 'instagram',
        reason: 'El contenido educativo funciona muy bien en formato reel',
        priority: 'high',
        estimatedReach: Math.round(source.performance.reach * 1.5),
      },
      {
        format: 'carousel',
        platform: 'instagram',
        reason: 'Permite desglosar el contenido en puntos clave',
        priority: 'medium',
        estimatedReach: Math.round(source.performance.reach * 1.2),
      },
      {
        format: 'tiktok',
        platform: 'tiktok',
        reason: 'Alto potencial de alcance en TikTok',
        priority: 'high',
        estimatedReach: Math.round(source.performance.reach * 2),
      }
    );
  } else if (source.originalFormat === 'carousel') {
    suggestions.push(
      {
        format: 'reel',
        platform: 'instagram',
        reason: 'Convierte el carrusel en un video dinámico',
        priority: 'high',
        estimatedReach: Math.round(source.performance.reach * 1.3),
      },
      {
        format: 'post',
        platform: 'instagram',
        reason: 'Extrae el punto principal para un post directo',
        priority: 'medium',
        estimatedReach: Math.round(source.performance.reach * 0.8),
      }
    );
  } else if (source.originalFormat === 'video') {
    suggestions.push(
      {
        format: 'reel',
        platform: 'instagram',
        reason: 'Adapta el video a formato reel corto',
        priority: 'high',
        estimatedReach: Math.round(source.performance.reach * 1.4),
      },
      {
        format: 'tiktok',
        platform: 'tiktok',
        reason: 'Amplía el alcance en TikTok',
        priority: 'high',
        estimatedReach: Math.round(source.performance.reach * 2.5),
      }
    );
  }
  
  return {
    id: `suggestion_${Date.now()}`,
    sourceContent: source,
    suggestedFormats: suggestions,
    createdAt: new Date().toISOString(),
  };
};

// Reciclar contenido a un nuevo formato
export const recycleContent = async (
  sourceContentId: string,
  targetFormat: TargetContentFormat,
  targetPlatform: 'instagram' | 'facebook' | 'tiktok' | 'twitter' | 'linkedin'
): Promise<ContentRecycling> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  const winningContent = await getWinningContent();
  const source = winningContent.find((wc) => wc.id === sourceContentId);
  
  if (!source) {
    throw new Error('Source content not found');
  }
  
  // Generar contenido reciclado usando IA (simulado)
  const recycledContent = generateRecycledContent(source, targetFormat);
  
  return {
    id: `recycling_${Date.now()}`,
    sourceContentId,
    sourceContent: source,
    targetFormat,
    targetPlatform,
    recycledContent,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Generar contenido reciclado (simulado - en producción usaría IA)
const generateRecycledContent = (
  source: WinningContent,
  targetFormat: TargetContentFormat
): ContentRecycling['recycledContent'] => {
  const baseText = source.originalContent.text;
  
  if (targetFormat === 'reel' || targetFormat === 'tiktok') {
    // Extraer puntos clave para un reel
    const keyPoints = baseText.split('.').slice(0, 3).filter((p) => p.trim().length > 20);
    const hook = keyPoints[0]?.substring(0, 100) || baseText.substring(0, 100);
    
    return {
      title: `${source.title} - Reel`,
      caption: `${hook}... 👆 Swipe para más tips! ${source.originalContent.hashtags?.slice(0, 5).join(' ') || ''}`,
      hashtags: [
        ...(source.originalContent.hashtags || []).slice(0, 5),
        '#reels',
        '#fitness',
        '#tips',
      ],
      script: `Hook: ${hook}\n\nPunto 1: ${keyPoints[1] || 'Contenido clave'}\n\nPunto 2: ${keyPoints[2] || 'Consejo final'}\n\nCTA: ¡Sigue para más tips!`,
      visualCues: [
        'Mostrar el problema',
        'Demostrar la solución',
        'Resultado final',
      ],
    };
  } else if (targetFormat === 'carousel') {
    const points = baseText.split('.').filter((p) => p.trim().length > 30).slice(0, 5);
    
    return {
      title: `${source.title} - Carrusel`,
      caption: `📚 ${points.length} puntos clave que debes saber. Swipe 👆 para verlos todos!`,
      hashtags: [
        ...(source.originalContent.hashtags || []).slice(0, 5),
        '#carousel',
        '#tips',
      ],
      mediaSuggestions: points.map((_, i) => `Slide ${i + 1}: ${points[i]?.substring(0, 100)}`),
    };
  } else if (targetFormat === 'post') {
    return {
      title: `${source.title} - Post`,
      caption: baseText.substring(0, 500) + (baseText.length > 500 ? '...' : ''),
      hashtags: source.originalContent.hashtags || [],
    };
  } else {
    return {
      title: `${source.title} - ${targetFormat}`,
      caption: baseText.substring(0, 300),
      hashtags: source.originalContent.hashtags || [],
    };
  }
};

// Obtener todos los reciclajes
export const getContentRecyclings = async (): Promise<ContentRecycling[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  // En producción, esto vendría de la base de datos
  return [];
};

// Actualizar un reciclaje
export const updateContentRecycling = async (
  id: string,
  data: Partial<ContentRecycling>
): Promise<ContentRecycling> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  // En producción, esto actualizaría en la base de datos
  throw new Error('Not implemented - would update in database');
};

// Programar publicación de contenido reciclado
export const scheduleRecycledContent = async (
  recyclingId: string,
  scheduledAt: string
): Promise<ContentRecycling> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  // En producción, esto programaría la publicación
  throw new Error('Not implemented - would schedule publication');
};

