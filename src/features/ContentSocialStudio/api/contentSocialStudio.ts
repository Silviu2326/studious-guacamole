import { addDays } from 'date-fns';
import type { Campaign } from '../../CreatorinfluencerContentSyndication/api/influencers';
import { getCampaigns, getInfluencers } from '../../CreatorinfluencerContentSyndication/api/influencers';
import { getClips, getCategories } from '../../ContentClipper/api/clips';
import type { ClippedContent } from '../../ContentClipper/api/clips';
import { getContentSuggestions, getSocialAnalytics, getSocialPosts } from '../../PlannerDeRedesSociales/api/social';
import type { ContentSuggestion, SocialPost } from '../../PlannerDeRedesSociales/api/social';
import { getBrandProfile, getContentTemplates, getGenerationHistory } from '../../GeneradorCreativoConIa/api/generator';
import { getSavedIdeas } from '../../GeneradorDeIdeasDeContenidoConIa/api/contentIdeas';
import type { SavedIdea } from '../../GeneradorDeIdeasDeContenidoConIa/api/contentIdeas';
import { getClientsWithProgress, TRANSFORMATION_TEMPLATES } from './clientTransformations';
import { analyzeFrequentlyAskedQuestions, generateFAQContentIdeas } from './faqContent';
import { getBrandProfileConfig } from './brandProfile';
import {
  getPromotionalTemplates,
  getServicePlans,
  getActiveOffers,
} from './promotionalContent';
import type {
  AIContentAssistant,
  AIContentIdea,
  ClipCategorySummary,
  ContentClipSummary,
  ContentSocialSnapshot,
  ContentStudioMetric,
  ContentStudioPeriod,
  ModuleQuickAction,
  PlannerAISuggestion,
  PlannerUpcomingPost,
  SyndicationCampaignSummary,
  VideoProjectSummary,
} from '../types';

interface DateRange {
  start: Date;
  end: Date;
}

const getDateRange = (period: ContentStudioPeriod): DateRange => {
  const end = new Date();
  let start: Date;

  switch (period) {
    case '7d':
      start = addDays(end, -7);
      break;
    case '90d':
      start = addDays(end, -90);
      break;
    case '30d':
    default:
      start = addDays(end, -30);
      break;
  }

  return { start, end };
};

const mapPostsToUpcoming = (posts: SocialPost[]): PlannerUpcomingPost[] => {
  return posts
    .filter((post) => post.scheduledAt)
    .sort((a, b) => {
      if (!a.scheduledAt || !b.scheduledAt) return 0;
      return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
    })
    .slice(0, 6)
    .map((post) => ({
      id: post.id,
      title: post.content.length > 90 ? `${post.content.slice(0, 90)}…` : post.content,
      scheduledAt: post.scheduledAt!,
      platform: post.platform,
      status: post.status,
      contentType: post.mediaUrls.length > 1 ? 'carousel' : post.mediaUrls.length === 0 ? 'post' : 'reel',
      campaign: post.profileName,
      aiGenerated: Boolean(post.hashtags && post.hashtags.length > 0),
    }));
};

const mapSuggestions = (suggestions: ContentSuggestion[]): PlannerAISuggestion[] => {
  return suggestions.slice(0, 4).map((suggestion) => ({
    id: suggestion.id,
    title: suggestion.title,
    description: suggestion.description,
    platform: suggestion.platform,
    scheduledFor: suggestion.suggestedTime,
    priority: suggestion.priority === 'high' ? 'high' : suggestion.priority === 'medium' ? 'medium' : 'low',
    reason: suggestion.reason,
  }));
};

const modulesDefinition: ModuleQuickAction[] = [
  {
    id: 'planner',
    title: 'Planner de Redes Sociales',
    description: 'Calendario editorial, publicación multicanal y optimización por IA.',
    icon: 'calendar',
    href: '/dashboard/content/planner-redes-sociales',
    highlight: 'Sincronizado con biblioteca y funnels',
    pill: { label: 'Core', tone: 'info' },
  },
  {
    id: 'video-studio',
    title: 'Video Marketing & Automation',
    description: 'Producción de video, templates y distribución automática.',
    icon: 'film',
    href: '/dashboard/content/video-studio',
    highlight: 'Video Studio + Playbooks',
  },
  {
    id: 'content-clipper',
    title: 'Content Clipper',
    description: 'Biblioteca curada de fuentes, clips e inspiración reutilizable.',
    icon: 'scissors',
    href: '/dashboard/content/content-clipper',
    highlight: 'Organiza y reutiliza ideas',
  },
  {
    id: 'creator-syndication',
    title: 'Creator & Influencer Syndication',
    description: 'Campañas con creadores, acuerdos y seguimiento de entregables.',
    icon: 'share',
    href: '/dashboard/content/creator-syndication',
    highlight: 'Briefing + tracking avanzado',
  },
  {
    id: 'ai-creative',
    title: 'Generador Creativo con IA',
    description: 'Copys largos, guiones y assets personalizados por voz de marca.',
    icon: 'brain',
    href: '/dashboard/content/ia-generador-creativo',
    pill: { label: 'IA', tone: 'success' },
  },
  {
    id: 'ai-ideas',
    title: 'Generador de Ideas IA',
    description: 'Ideas accionables por objetivo, formato y audiencia.',
    icon: 'lightbulb',
    href: '/dashboard/content/ia-ideas-contenido',
  },
];

const buildVideoProjects = (): VideoProjectSummary[] => [
  {
    id: 'vid_reel_001',
    title: 'Reto HIIT Express - Semana 1',
    format: 'short',
    status: 'editing',
    automationLevel: 'assisted',
    platform: 'instagram',
    duration: '00:45',
    publishDate: addDays(new Date(), 2).toISOString(),
    performanceScore: 82,
  },
  {
    id: 'vid_short_002',
    title: 'Caso Cliente: Transformación de Laura',
    format: 'short',
    status: 'scheduled',
    automationLevel: 'automated',
    platform: 'tiktok',
    duration: '00:30',
    publishDate: addDays(new Date(), 1).toISOString(),
    performanceScore: 88,
  },
  {
    id: 'vid_long_003',
    title: 'Masterclass: Nutrición para Ganar Masa',
    format: 'long',
    status: 'ideation',
    automationLevel: 'manual',
    platform: 'youtube',
    duration: '08:30',
  },
];

const mapClipCategories = (clips: ClippedContent[]): Record<string, number> => {
  return clips.reduce<Record<string, number>>((acc, clip) => {
    if (clip.categoryId) {
      acc[clip.categoryId] = (acc[clip.categoryId] || 0) + 1;
    }
    return acc;
  }, {});
};

const buildClipSummaries = (clips: ClippedContent[]): ContentClipSummary[] =>
  clips.slice(0, 4).map((clip) => ({
    id: clip.id,
    title: clip.title,
    category: clip.category?.name,
    source: clip.source,
    tags: clip.tags.map((tag) => tag.name),
    savedAt: clip.createdAt,
    usageCount: clip.tags.length * 2,
    impact: clip.scrapedDescription,
  }));

const buildTrendingTags = (clips: ClippedContent[]): string[] => {
  const counters = clips.reduce<Record<string, number>>((acc, clip) => {
    clip.tags.forEach((tag) => {
      acc[tag.name] = (acc[tag.name] || 0) + 1;
    });
    return acc;
  }, {});

  return Object.entries(counters)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([tag]) => tag);
};

const mapCampaignStatus = (campaign: Campaign): SyndicationCampaignSummary['status'] => {
  switch (campaign.status) {
    case 'draft':
      return 'briefing';
    case 'active':
      return 'live';
    case 'paused':
      return 'awaiting-content';
    case 'completed':
    case 'cancelled':
    default:
      return 'reporting';
  }
};

const mapCampaigns = (
  campaigns: Campaign[],
  influencerNameById: Record<string, { name: string; niche?: string; followerCount?: number }>
): SyndicationCampaignSummary[] => {
  return campaigns.slice(0, 4).map((campaign) => {
    const influencer = influencerNameById[campaign.influencerId];
    const pendingDeliverable = campaign.deliverables.find((del) => del.status !== 'completed');

    return {
      id: campaign.id,
      title: campaign.name,
      creator: influencer?.name || 'Creator',
      persona: influencer?.niche || 'Fitness',
      channels: ['instagram', 'youtube'],
      status: mapCampaignStatus(campaign),
      nextDelivery: pendingDeliverable?.dueDate || campaign.endDate,
      reachEstimate: influencer?.followerCount,
      alignmentScore: pendingDeliverable ? 82 : 95,
    };
  });
};

const mapAssistants = (templates: ReturnType<typeof getContentTemplates>, lastRun?: string): AIContentAssistant[] => {
  return templates.slice(0, 5).map((template) => ({
    id: template.id,
    title: template.name,
    description: template.description,
    useCases: [
      'Generación guiada por voz de marca',
      'Sincronización con Planner',
      'Ajustes automáticos por plataforma',
    ],
    relatedModule: 'Generador Creativo con IA',
    lastRun,
    icon: template.icon ? 'sparkles' : 'brain',
  }));
};

const mapIdeas = (ideas: SavedIdea[]): AIContentIdea[] =>
  ideas.slice(0, 6).map((idea) => ({
    id: idea.savedId,
    title: idea.originalIdea.title,
    hook: idea.originalIdea.hook,
    format: idea.originalIdea.format,
    channel: idea.originalIdea.format === 'newsletter' ? 'email' : 'instagram',
    callToAction: idea.originalIdea.cta,
  }));

const buildMetrics = (
  posts: SocialPost[],
  snapshot: ContentSocialSnapshot
): ContentStudioMetric[] => {
  const scheduledCount = posts.filter((post) => post.status === 'scheduled').length;
  const draftsCount = posts.filter((post) => post.status === 'draft').length;

  return [
    {
      id: 'scheduled-posts',
      title: 'Publicaciones programadas',
      value: `${scheduledCount}`,
      subtitle: 'Próximos 14 días',
      trend: {
        value: scheduledCount > 0 ? 18 : 0,
        direction: 'up',
        label: 'vs periodo previo',
      },
      icon: 'calendar',
      color: 'primary',
    },
    {
      id: 'video-pipeline',
      title: 'Videos listos',
      value: `${snapshot.video.readyToPublish}`,
      subtitle: 'Listos para publicación',
      icon: 'film',
      color: 'info',
    },
    {
      id: 'clip-library',
      title: 'Activos en biblioteca',
      value: `${snapshot.clipper.totalClips}`,
      subtitle: `${snapshot.clipper.newThisWeek} nuevos esta semana`,
      icon: 'library',
      color: 'success',
    },
    {
      id: 'ai-ideas',
      title: 'Ideas guardadas',
      value: `${snapshot.ai.quickIdeas.length}`,
      subtitle: draftsCount ? `+${draftsCount} borradores` : 'Listas para programar',
      icon: 'sparkles',
      color: 'warning',
    },
  ];
};

export const getContentSocialStudioSnapshot = async (
  period: ContentStudioPeriod = '30d'
): Promise<ContentSocialSnapshot> => {
  const range = getDateRange(period);

  const [
    analytics,
    posts,
    suggestions,
    clipsResponse,
    categories,
    savedIdeas,
    templates,
    history,
    brandProfile,
    brandProfileConfig,
    influencers,
    campaigns,
    clientsWithProgress,
    faqQuestions,
    faqContentIdeas,
    promotionalTemplates,
    servicePlans,
    activeOffers,
  ] = await Promise.all([
    getSocialAnalytics(range.start.toISOString(), range.end.toISOString()),
    getSocialPosts(range.start.toISOString(), range.end.toISOString()),
    getContentSuggestions(),
    getClips(),
    getCategories(),
    getSavedIdeas({ limit: 10 }),
    Promise.resolve(getContentTemplates()),
    getGenerationHistory({ limit: 1 }),
    getBrandProfile(),
    getBrandProfileConfig().catch(() => null),
    getInfluencers(),
    getCampaigns(),
    getClientsWithProgress().catch(() => []),
    analyzeFrequentlyAskedQuestions().catch(() => []),
    generateFAQContentIdeas().catch(() => []),
    getPromotionalTemplates().catch(() => []),
    getServicePlans().catch(() => []),
    getActiveOffers().catch(() => []),
  ]);

  const upcoming = mapPostsToUpcoming(posts);
  const videoProjects = buildVideoProjects();
  const clips = clipsResponse.data;
  const clipCategoryCount = mapClipCategories(clips);

  const clipCategories: ClipCategorySummary[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    count: clipCategoryCount[category.id] || 0,
    color: category.color,
  }));

  const clipperSummary = {
    totalClips: clipsResponse.pagination.totalItems,
    newThisWeek: Math.min(4, clipsResponse.pagination.totalItems),
    categories: clipCategories,
    featured: buildClipSummaries(clips),
    trendingTags: buildTrendingTags(clips),
  };

  const influencerMap = influencers.reduce<
    Record<string, { name: string; niche?: string; followerCount?: number }>
  >((acc, influencer) => {
    acc[influencer.id] = {
      name: influencer.name,
      niche: influencer.niche,
      followerCount: influencer.followerCount,
    };
    return acc;
  }, {});

  const syndicationPipeline = mapCampaigns(campaigns, influencerMap);

  const videoSummary = {
    projects: videoProjects,
    automationPlaybooks: 3,
    readyToPublish: videoProjects.filter((project) => project.status === 'scheduled').length,
    libraryAssets: 28,
  };

  const plannerCoverageDays = (() => {
    if (upcoming.length === 0) return 0;
    const last = upcoming[upcoming.length - 1];
    return Math.max(
      0,
      Math.ceil((new Date(last.scheduledAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    );
  })();

  const planner = {
    backlogCount: posts.filter((post) => post.status === 'draft').length,
    coverageDays: plannerCoverageDays,
    upcoming,
    aiSuggestions: mapSuggestions(suggestions),
  };

  const ai = {
    assistants: mapAssistants(templates, history.results[0]?.createdAt),
    quickIdeas: mapIdeas(savedIdeas),
    brandProfile: brandProfile || undefined,
    brandProfileConfig: brandProfileConfig || undefined,
    lastUpdated: new Date().toISOString(),
  };

  const snapshot: ContentSocialSnapshot = {
    metrics: [], // placeholder, will assign below
    modules: modulesDefinition,
    planner,
    video: videoSummary,
    clipper: clipperSummary,
    syndication: {
      activeCampaigns: campaigns.filter((campaign) => campaign.status === 'active').length,
      creatorsNetwork: influencers.length,
      pipeline: syndicationPipeline,
    },
    ai,
    clientTransformations: {
      availableClients: clientsWithProgress,
      generatedPosts: [],
      templates: TRANSFORMATION_TEMPLATES,
    },
    faqContent: {
      topQuestions: faqQuestions,
      contentIdeas: faqContentIdeas,
    },
    promotionalContent: {
      templates: promotionalTemplates,
      availablePlans: servicePlans,
      activeOffers: activeOffers,
      generatedContent: [],
    },
  };

  snapshot.metrics = buildMetrics(posts, snapshot);

  return snapshot;
};








