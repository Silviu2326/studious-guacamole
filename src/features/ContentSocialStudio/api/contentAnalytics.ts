import type { SocialPost } from '../../PlannerDeRedesSociales/api/social';
import { getSocialPosts } from '../../PlannerDeRedesSociales/api/social';
import { getLeads } from '../../leads/api/leads';

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

