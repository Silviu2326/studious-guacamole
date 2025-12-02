import type { SocialPost } from '../../PlannerDeRedesSociales/api/social';
import { getSocialPosts } from '../../PlannerDeRedesSociales/api/social';
import { getLeads } from '../../leads/api/leads';
import type {
  ContentSalesAnalytics,
  ContentSalesPattern,
  ContentSalesAnalyticsSummary,
} from '../types';

export interface PostLeadAnalytics {
  postId: string;
  postContent: string;
  platform: 'instagram' | 'facebook' | 'tiktok' | 'twitter' | 'linkedin';
  contentType: 'post' | 'reel' | 'story' | 'video' | 'carousel';
  publishedAt: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    reach: number;
  };
  leadsGenerated: {
    total: number;
    consultations: number;
    interestMessages: number;
    converted: number;
  };
  leadDetails: Array<{
    leadId: string;
    leadName: string;
    source: string;
    type: 'consultation' | 'interest_message' | 'converted';
    date: string;
    status: string;
  }>;
  conversionRate: number;
  pattern?: {
    contentType: string;
    topic: string;
    timeOfDay: string;
    dayOfWeek: string;
  };
}

export interface ContentPattern {
  contentType: string;
  topic: string;
  timeOfDay: string;
  dayOfWeek: string;
  averageLeads: number;
  conversionRate: number;
  postsCount: number;
}

/**
 * Obtiene analytics de contenido que generó leads reales
 * US-CSS-011: Dashboard de analytics que muestre qué posts, reels o stories generaron leads reales
 */
export const getContentLeadAnalytics = async (
  startDate: string,
  endDate: string
): Promise<{
  postsWithLeads: PostLeadAnalytics[];
  patterns: ContentPattern[];
  summary: {
    totalPosts: number;
    postsWithLeads: number;
    totalLeads: number;
    totalConsultations: number;
    totalInterestMessages: number;
    averageConversionRate: number;
  };
}> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  // Obtener posts y leads
  const [posts, leads] = await Promise.all([
    getSocialPosts(startDate, endDate),
    getLeads({ businessType: 'entrenador' })
  ]);

  // Filtrar leads del período
  const periodLeads = leads.filter(lead => {
    const leadDate = new Date(lead.createdAt);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return leadDate >= start && leadDate <= end;
  });

  // Simular asociación entre posts y leads basado en source
  const postsWithLeads: PostLeadAnalytics[] = posts
    .filter(post => {
      // Solo incluir posts que tengan engagement significativo
      return post.engagement && (post.engagement.likes > 10 || post.engagement.comments > 0);
    })
    .map((post, index) => {
      // Simular leads generados por este post
      const postLeads = periodLeads.filter(lead => {
        // Asociar leads de redes sociales con posts
        const socialSources = ['instagram', 'facebook', 'tiktok', 'contenido_organico'];
        return socialSources.includes(lead.source) && 
               Math.random() > 0.7; // 30% de probabilidad de asociación
      }).slice(0, Math.floor(Math.random() * 5) + 1); // 1-5 leads por post

      const consultations = postLeads.filter(l => 
        l.stage === 'interes' || l.stage === 'oportunidad'
      ).length;
      
      const interestMessages = postLeads.filter(l => 
        l.stage === 'captacion' || l.stage === 'interes'
      ).length;

      const converted = postLeads.filter(l => l.status === 'converted').length;

      const publishedDate = new Date(post.publishedAt || post.scheduledAt);
      const dayOfWeek = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][publishedDate.getDay()];
      const hour = publishedDate.getHours();
      const timeOfDay = hour < 12 ? 'mañana' : hour < 18 ? 'tarde' : 'noche';

      // Extraer tema del contenido
      const content = post.content || '';
      let topic = 'general';
      if (content.toLowerCase().includes('nutrición') || content.toLowerCase().includes('nutricion') || content.toLowerCase().includes('dieta')) {
        topic = 'nutrición';
      } else if (content.toLowerCase().includes('ejercicio') || content.toLowerCase().includes('entrenamiento') || content.toLowerCase().includes('rutina')) {
        topic = 'ejercicio';
      } else if (content.toLowerCase().includes('transformación') || content.toLowerCase().includes('transformacion') || content.toLowerCase().includes('antes/después')) {
        topic = 'transformación';
      } else if (content.toLowerCase().includes('motivación') || content.toLowerCase().includes('motivacion') || content.toLowerCase().includes('inspiración')) {
        topic = 'motivación';
      }

      return {
        postId: post.id,
        postContent: post.content || 'Sin contenido',
        platform: post.platform,
        contentType: post.contentType || 'post',
        publishedAt: post.publishedAt || post.scheduledAt,
        engagement: {
          likes: post.engagement?.likes || 0,
          comments: post.engagement?.comments || 0,
          shares: post.engagement?.shares || 0,
          saves: post.engagement?.saves || 0,
          reach: post.engagement?.reach || 0,
        },
        leadsGenerated: {
          total: postLeads.length,
          consultations,
          interestMessages,
          converted,
        },
        leadDetails: postLeads.map(lead => ({
          leadId: lead.id,
          leadName: lead.name,
          source: lead.source,
          type: lead.status === 'converted' ? 'converted' as const : 
                (lead.stage === 'interes' || lead.stage === 'oportunidad') ? 'consultation' as const : 
                'interest_message' as const,
          date: lead.createdAt.toISOString(),
          status: lead.status,
        })),
        conversionRate: postLeads.length > 0 ? (converted / postLeads.length) * 100 : 0,
        pattern: {
          contentType: post.contentType || 'post',
          topic,
          timeOfDay,
          dayOfWeek,
        },
      };
    })
    .filter(post => post.leadsGenerated.total > 0) // Solo posts que generaron leads
    .sort((a, b) => b.leadsGenerated.total - a.leadsGenerated.total);

  // Calcular patrones
  const patternMap = new Map<string, {
    contentType: string;
    topic: string;
    timeOfDay: string;
    dayOfWeek: string;
    totalLeads: number;
    totalConverted: number;
    postsCount: number;
  }>();

  postsWithLeads.forEach(post => {
    if (!post.pattern) return;
    
    const key = `${post.pattern.contentType}-${post.pattern.topic}-${post.pattern.timeOfDay}-${post.pattern.dayOfWeek}`;
    const existing = patternMap.get(key) || {
      contentType: post.pattern.contentType,
      topic: post.pattern.topic,
      timeOfDay: post.pattern.timeOfDay,
      dayOfWeek: post.pattern.dayOfWeek,
      totalLeads: 0,
      totalConverted: 0,
      postsCount: 0,
    };

    patternMap.set(key, {
      ...existing,
      totalLeads: existing.totalLeads + post.leadsGenerated.total,
      totalConverted: existing.totalConverted + post.leadsGenerated.converted,
      postsCount: existing.postsCount + 1,
    });
  });

  const patterns: ContentPattern[] = Array.from(patternMap.values())
    .map(p => ({
      contentType: p.contentType,
      topic: p.topic,
      timeOfDay: p.timeOfDay,
      dayOfWeek: p.dayOfWeek,
      averageLeads: p.totalLeads / p.postsCount,
      conversionRate: p.totalLeads > 0 ? (p.totalConverted / p.totalLeads) * 100 : 0,
      postsCount: p.postsCount,
    }))
    .sort((a, b) => b.averageLeads - a.averageLeads);

  const totalLeads = postsWithLeads.reduce((sum, p) => sum + p.leadsGenerated.total, 0);
  const totalConsultations = postsWithLeads.reduce((sum, p) => sum + p.leadsGenerated.consultations, 0);
  const totalInterestMessages = postsWithLeads.reduce((sum, p) => sum + p.leadsGenerated.interestMessages, 0);
  const totalConverted = postsWithLeads.reduce((sum, p) => sum + p.leadsGenerated.converted, 0);

  return {
    postsWithLeads,
    patterns,
    summary: {
      totalPosts: posts.length,
      postsWithLeads: postsWithLeads.length,
      totalLeads,
      totalConsultations,
      totalInterestMessages,
      averageConversionRate: totalLeads > 0 ? (totalConverted / totalLeads) * 100 : 0,
    },
  };
};

/**
 * Obtiene analytics de contenido con datos de ventas/revenue
 * User Story 2: Dashboard que muestre qué piezas generan más leads/ventas para priorizar
 */
export const getContentSalesAnalytics = async (
  startDate: string,
  endDate: string
): Promise<{
  postsWithSales: ContentSalesAnalytics[];
  patterns: ContentSalesPattern[];
  summary: ContentSalesAnalyticsSummary;
}> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  // Obtener analytics base
  const baseAnalytics = await getContentLeadAnalytics(startDate, endDate);

  // Simular datos de ventas para los leads convertidos
  const postsWithSales: ContentSalesAnalytics[] = baseAnalytics.postsWithLeads.map(post => {
    const convertedLeads = post.leadDetails.filter(l => l.type === 'converted' || l.status === 'converted');
    
    // Simular ventas y revenue
    const totalSales = convertedLeads.length;
    const averageOrderValue = 79.99 + Math.random() * 100; // Entre 79.99 y 179.99
    const totalRevenue = totalSales * averageOrderValue;
    
    // Calcular ROI (simulado - asumiendo coste de creación de contenido)
    const contentCost = 0; // Coste de creación (puede ser 0 si es orgánico)
    const roi = contentCost > 0 ? ((totalRevenue - contentCost) / contentCost) * 100 : undefined;

    // Determinar prioridad basada en leads + ventas
    let priority: 'high' | 'medium' | 'low' = 'low';
    const score = post.leadsGenerated.total * 2 + totalSales * 5 + totalRevenue / 10;
    if (score > 50) priority = 'high';
    else if (score > 20) priority = 'medium';

    // Agregar revenue a los lead details
    const leadDetailsWithRevenue = post.leadDetails.map(lead => ({
      ...lead,
      revenue: lead.type === 'converted' || lead.status === 'converted' 
        ? averageOrderValue + (Math.random() * 50 - 25) // Variación de ±25
        : undefined,
    }));

    return {
      ...post,
      sales: {
        totalRevenue,
        totalSales,
        averageOrderValue,
        conversionRate: post.leadsGenerated.total > 0 
          ? (totalSales / post.leadsGenerated.total) * 100 
          : 0,
      },
      leadDetails: leadDetailsWithRevenue,
      roi,
      priority,
    };
  }).sort((a, b) => {
    // Ordenar por prioridad (high > medium > low) y luego por revenue
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return b.sales.totalRevenue - a.sales.totalRevenue;
  });

  // Calcular patrones con datos de ventas
  const patternMap = new Map<string, {
    contentType: string;
    topic: string;
    timeOfDay: string;
    dayOfWeek: string;
    totalLeads: number;
    totalConverted: number;
    totalRevenue: number;
    totalSales: number;
    postsCount: number;
  }>();

  postsWithSales.forEach(post => {
    if (!post.pattern) return;
    
    const key = `${post.pattern.contentType}-${post.pattern.topic}-${post.pattern.timeOfDay}-${post.pattern.dayOfWeek}`;
    const existing = patternMap.get(key) || {
      contentType: post.pattern.contentType,
      topic: post.pattern.topic,
      timeOfDay: post.pattern.timeOfDay,
      dayOfWeek: post.pattern.dayOfWeek,
      totalLeads: 0,
      totalConverted: 0,
      totalRevenue: 0,
      totalSales: 0,
      postsCount: 0,
    };

    patternMap.set(key, {
      ...existing,
      totalLeads: existing.totalLeads + post.leadsGenerated.total,
      totalConverted: existing.totalConverted + post.leadsGenerated.converted,
      totalRevenue: existing.totalRevenue + post.sales.totalRevenue,
      totalSales: existing.totalSales + post.sales.totalSales,
      postsCount: existing.postsCount + 1,
    });
  });

  const patterns: ContentSalesPattern[] = Array.from(patternMap.values())
    .map(p => {
      const averageRevenue = p.totalRevenue / p.postsCount;
      const averageSales = p.totalSales / p.postsCount;
      const averageLeads = p.totalLeads / p.postsCount;
      const conversionRate = p.totalLeads > 0 ? (p.totalConverted / p.totalLeads) * 100 : 0;
      const roi = averageRevenue > 0 ? (averageRevenue / 10) * 100 : 0; // ROI simulado

      // Determinar prioridad del patrón
      let priority: 'high' | 'medium' | 'low' = 'low';
      const score = averageLeads * 2 + averageSales * 5 + averageRevenue / 10;
      if (score > 50) priority = 'high';
      else if (score > 20) priority = 'medium';

      return {
        contentType: p.contentType,
        topic: p.topic,
        timeOfDay: p.timeOfDay,
        dayOfWeek: p.dayOfWeek,
        averageLeads,
        averageRevenue,
        averageSales,
        conversionRate,
        roi,
        postsCount: p.postsCount,
        priority,
      };
    })
    .sort((a, b) => {
      // Ordenar por prioridad y luego por revenue
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.averageRevenue - a.averageRevenue;
    });

  const totalSales = postsWithSales.reduce((sum, p) => sum + p.sales.totalSales, 0);
  const totalRevenue = postsWithSales.reduce((sum, p) => sum + p.sales.totalRevenue, 0);
  const postsWithSalesCount = postsWithSales.filter(p => p.sales.totalSales > 0).length;
  const totalRoi = postsWithSales
    .filter(p => p.roi !== undefined)
    .reduce((sum, p) => sum + (p.roi || 0), 0);
  const avgRoi = postsWithSales.filter(p => p.roi !== undefined).length > 0
    ? totalRoi / postsWithSales.filter(p => p.roi !== undefined).length
    : 0;

  const topPerformingContent = postsWithSales
    .filter(p => p.sales.totalSales > 0)
    .slice(0, 10);

  return {
    postsWithSales,
    patterns,
    summary: {
      totalPosts: baseAnalytics.summary.totalPosts,
      postsWithLeads: baseAnalytics.summary.postsWithLeads,
      postsWithSales: postsWithSalesCount,
      totalLeads: baseAnalytics.summary.totalLeads,
      totalConsultations: baseAnalytics.summary.totalConsultations,
      totalInterestMessages: baseAnalytics.summary.totalInterestMessages,
      totalSales,
      totalRevenue,
      averageConversionRate: baseAnalytics.summary.averageConversionRate,
      averageROI: avgRoi,
      topPerformingContent,
    },
  };
};

