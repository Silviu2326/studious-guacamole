import {
  BestReviewConfig,
  AutoPublishedReview,
  Testimonial,
  AutoPublishTarget,
  BestReviewCriteria,
} from '../types';

// Simular latencia de red
const simulateLatency = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), 300));
};

// Mock: Obtener configuración de publicación automática
export async function getBestReviewConfig(): Promise<BestReviewConfig> {
  const config: BestReviewConfig = {
    id: 'config_001',
    enabled: true,
    criteria: 'composite',
    minScore: 4.5,
    minRecencyDays: 90,
    autoPublishTargets: ['funnel', 'landing-page'],
    maxReviewsPerFunnel: 5,
    refreshFrequency: 'daily',
    lastRefreshAt: new Date().toISOString(),
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: new Date().toISOString(),
  };

  return simulateLatency(config);
}

// Mock: Guardar configuración
export async function saveBestReviewConfig(
  config: Partial<BestReviewConfig>,
): Promise<BestReviewConfig> {
  const existingConfig = await getBestReviewConfig();
  const updated: BestReviewConfig = {
    ...existingConfig,
    ...config,
    updatedAt: new Date().toISOString(),
  };

  return simulateLatency(updated);
}

// Identificar las mejores reseñas según criterios
export async function identifyBestReviews(
  testimonials: Testimonial[],
  criteria: BestReviewCriteria,
  minScore: number,
  minRecencyDays: number,
): Promise<Testimonial[]> {
  const now = new Date();
  const minDate = new Date(now.getTime() - minRecencyDays * 24 * 60 * 60 * 1000);

  let filtered = testimonials.filter((t) => {
    // Filtros básicos
    if (t.score < minScore) return false;
    if (t.status !== 'aprobado' && t.status !== 'publicado') return false;

    const testimonialDate = new Date(t.createdAt);
    if (testimonialDate < minDate) return false;

    return true;
  });

  // Aplicar criterios de ordenamiento
  switch (criteria) {
    case 'score':
      filtered.sort((a, b) => b.score - a.score);
      break;
    case 'recency':
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'completeness':
      // Priorizar testimonios con más información (tags, media, etc.)
      filtered.sort((a, b) => {
        const aCompleteness =
          (a.tags?.length || 0) + (a.mediaUrl ? 1 : 0) + (a.quote.length > 100 ? 1 : 0);
        const bCompleteness =
          (b.tags?.length || 0) + (b.mediaUrl ? 1 : 0) + (b.quote.length > 100 ? 1 : 0);
        return bCompleteness - aCompleteness;
      });
      break;
    case 'composite':
    default:
      // Score compuesto: score * 0.5 + recency * 0.3 + completeness * 0.2
      filtered.sort((a, b) => {
        const aRecency = Math.min(
          1,
          (now.getTime() - new Date(a.createdAt).getTime()) / (minRecencyDays * 24 * 60 * 60 * 1000),
        );
        const bRecency = Math.min(
          1,
          (now.getTime() - new Date(b.createdAt).getTime()) / (minRecencyDays * 24 * 60 * 60 * 1000),
        );
        const aCompleteness =
          ((a.tags?.length || 0) / 5) * 0.5 + (a.mediaUrl ? 0.3 : 0) + (a.quote.length > 100 ? 0.2 : 0);
        const bCompleteness =
          ((b.tags?.length || 0) / 5) * 0.5 + (b.mediaUrl ? 0.3 : 0) + (b.quote.length > 100 ? 0.2 : 0);

        const aScore = (a.score / 5) * 0.5 + (1 - aRecency) * 0.3 + aCompleteness * 0.2;
        const bScore = (b.score / 5) * 0.5 + (1 - bRecency) * 0.3 + bCompleteness * 0.2;

        return bScore - aScore;
      });
      break;
  }

  return simulateLatency(filtered);
}

// Publicar reseñas automáticamente a funnels y contenido
export async function autoPublishBestReviews(
  config: BestReviewConfig,
  testimonials: Testimonial[],
): Promise<AutoPublishedReview[]> {
  const bestReviews = await identifyBestReviews(
    testimonials,
    config.criteria,
    config.minScore,
    config.minRecencyDays,
  );

  const published: AutoPublishedReview[] = [];
  const maxReviews = config.maxReviewsPerFunnel || 5;

  // Obtener funnels activos
  let activeFunnels: any[] = [];
  try {
    // En producción, esto obtendría los funnels activos del servicio
    // Por ahora usamos un mock
    activeFunnels = [
      { id: 'funnel_001', name: 'Funnel Principal', status: 'active' },
      { id: 'funnel_002', name: 'Funnel Corporativo', status: 'active' },
    ];
  } catch (error) {
    console.error('Error obteniendo funnels:', error);
  }

  // Publicar a cada funnel si está configurado
  if (config.autoPublishTargets.includes('funnel') || config.autoPublishTargets.includes('all')) {
    const targetFunnels = config.funnelIds && config.funnelIds.length > 0
      ? activeFunnels.filter((f) => config.funnelIds!.includes(f.id))
      : activeFunnels;

    for (const funnel of targetFunnels) {
      const reviewsToPublish = bestReviews.slice(0, maxReviews);
      
      for (const review of reviewsToPublish) {
        try {
          // En producción, aquí se conectaría el testimonio al funnel usando:
          // await FunnelsAdquisicionService.connectContentToFunnel({...})
          // Por ahora simulamos la publicación exitosa
          
          published.push({
            id: `auto-pub-${Date.now()}-${review.id}`,
            testimonialId: review.id,
            testimonial: review,
            publishedTo: ['funnel'],
            funnelIds: [funnel.id],
            publishedAt: new Date().toISOString(),
            publishedBy: 'system',
          });
        } catch (error) {
          console.error(`Error publicando reseña ${review.id} al funnel ${funnel.id}:`, error);
        }
      }
    }
  }

  return simulateLatency(published);
}

// Obtener reseñas publicadas automáticamente
export async function getAutoPublishedReviews(): Promise<AutoPublishedReview[]> {
  const reviews: AutoPublishedReview[] = [
    {
      id: 'auto-pub-001',
      testimonialId: 'tm_001',
      testimonial: {
        id: 'tm_001',
        customerName: 'Laura Méndez',
        role: 'Miembro Premium',
        quote: 'El club organizó un reto de 21 días que me hizo sentir parte de algo más grande.',
        score: 4.9,
        channel: 'Google Reviews',
        impactTag: 'Reto Comunidad',
        createdAt: '2025-10-12T10:00:00Z',
        type: 'texto',
        source: 'google-reviews',
        status: 'publicado',
        tags: ['comunidad', 'motivación'],
      },
      publishedTo: ['funnel', 'landing-page'],
      funnelIds: ['funnel_001'],
      publishedAt: '2025-10-13T08:00:00Z',
      publishedBy: 'system',
      performance: {
        views: 1250,
        clicks: 89,
        conversions: 12,
        engagementRate: 7.12,
      },
    },
  ];

  return simulateLatency(reviews);
}

// Actualizar configuración y refrescar publicaciones
export async function refreshAutoPublish(config: BestReviewConfig, testimonials: Testimonial[]): Promise<{
  config: BestReviewConfig;
  published: AutoPublishedReview[];
}> {
  const updatedConfig = await saveBestReviewConfig({
    ...config,
    lastRefreshAt: new Date().toISOString(),
  });

  const published = await autoPublishBestReviews(updatedConfig, testimonials);

  return simulateLatency({ config: updatedConfig, published });
}

export const BestReviewsAutoPublishAPI = {
  getBestReviewConfig,
  saveBestReviewConfig,
  identifyBestReviews,
  autoPublishBestReviews,
  getAutoPublishedReviews,
  refreshAutoPublish,
};

