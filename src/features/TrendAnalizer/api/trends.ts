// API para gestión de análisis de tendencias y inteligencia de mercado

export interface Trend {
  id: string;
  title: string;
  description?: string;
  velocity_score: number;
  saturation_level: 'low' | 'medium' | 'high';
  platform: 'instagram' | 'tiktok' | 'youtube' | 'blogs' | 'search';
  category?: 'exercise' | 'nutrition' | 'mindset' | 'equipment' | 'lifestyle';
  examples?: string[];
  volume_24h?: number;
  volume_7d?: number;
  relevance_score?: number;
  engagement_rate?: number;
  estimated_reach?: number;
  createdAt?: string;
}

export interface ContentSuggestion {
  id: string;
  format: 'Reel' | 'Post' | 'Story' | 'Article' | 'Video';
  title: string;
  description: string;
  suggested_cta?: string;
  trend_id?: string;
  platform?: string;
  createdAt?: string;
}

export interface Competitor {
  id: string;
  social_handle: string;
  platform: 'instagram' | 'tiktok' | 'youtube';
  status: 'pending_first_analysis' | 'analyzing' | 'active' | 'error';
  name?: string;
  followers?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CompetitorAnalysis {
  last_updated: string;
  top_posts: CompetitorPost[];
  posting_frequency: string;
  top_hashtags: string[];
  main_topics: string[];
  engagement_rate?: number;
  average_likes?: number;
  average_comments?: number;
}

export interface CompetitorPost {
  url: string;
  engagement_rate: number;
  likes?: number;
  comments?: number;
  shares?: number;
  posted_at?: string;
  caption?: string;
}

export interface TrendAlert {
  id: string;
  keyword: string;
  category?: string;
  platform?: string;
  is_active: boolean;
  threshold?: number;
  createdAt: string;
  last_triggered?: string;
}

export interface TrendFilters {
  platform?: 'instagram' | 'tiktok' | 'youtube' | 'blogs' | 'search';
  category?: 'exercise' | 'nutrition' | 'mindset' | 'equipment' | 'lifestyle';
  saturation_level?: 'low' | 'medium' | 'high';
  min_velocity_score?: number;
  limit?: number;
}

// Funciones API simuladas (a implementar con backend real)
export const getTrends = async (filters?: TrendFilters): Promise<Trend[]> => {
  // Simulación - en producción: GET /api/intelligence/trends?platform={platform}&category={category}&limit={limit}
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [];
};

export const getTrendDetails = async (trendId: string): Promise<Trend | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: GET /api/intelligence/trends/{trendId}
  return null;
};

export const getContentSuggestions = async (
  trendId: string, 
  count?: number
): Promise<ContentSuggestion[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // En producción: GET /api/intelligence/content-suggestions?trend_id={trendId}&count={count}
  return [];
};

export const saveContentSuggestion = async (suggestionId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: POST /api/intelligence/content-suggestions/{suggestionId}/save
  console.log('Guardando sugerencia de contenido:', suggestionId);
};

export const createCompetitor = async (
  socialHandle: string, 
  platform: 'instagram' | 'tiktok' | 'youtube'
): Promise<Competitor> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En producción: POST /api/intelligence/competitors
  const newCompetitor: Competitor = {
    id: `comp_${Date.now()}`,
    social_handle: socialHandle,
    platform: platform,
    status: 'pending_first_analysis',
    createdAt: new Date().toISOString()
  };
  
  return newCompetitor;
};

export const getCompetitors = async (): Promise<Competitor[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: GET /api/intelligence/competitors
  return [];
};

export const getCompetitorAnalysis = async (competitorId: string): Promise<CompetitorAnalysis | null> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // En producción: GET /api/intelligence/competitors/{competitorId}/analysis
  return null;
};

export const deleteCompetitor = async (competitorId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: DELETE /api/intelligence/competitors/{competitorId}
  console.log('Eliminando competidor:', competitorId);
};

export const createTrendAlert = async (
  keyword: string,
  category?: string,
  platform?: string,
  threshold?: number
): Promise<TrendAlert> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // En producción: POST /api/intelligence/trend-alerts
  return {
    id: `alert_${Date.now()}`,
    keyword,
    category,
    platform,
    is_active: true,
    threshold,
    createdAt: new Date().toISOString()
  };
};

export const getTrendAlerts = async (): Promise<TrendAlert[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: GET /api/intelligence/trend-alerts
  return [];
};

export const deleteTrendAlert = async (alertId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: DELETE /api/intelligence/trend-alerts/{alertId}
  console.log('Eliminando alerta de tendencia:', alertId);
};

export const toggleTrendAlert = async (alertId: string, isActive: boolean): Promise<TrendAlert> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: PUT /api/intelligence/trend-alerts/{alertId}
  return {
    id: alertId,
    keyword: '',
    is_active: isActive,
    createdAt: new Date().toISOString()
  };
};













