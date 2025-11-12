// API para gestión de videos y contenido de video marketing

export interface VideoProject {
  videoId: string;
  title: string;
  description?: string;
  status: 'draft' | 'processing' | 'ready' | 'published' | 'failed';
  thumbnailUrl?: string;
  duration?: number;
  templateId?: string;
  timelineData?: TimelineData;
  sourceFileUrl?: string;
  processedUrls?: {
    hd?: string;
    sd?: string;
    thumbnail?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TimelineData {
  tracks: TimelineTrack[];
  duration: number;
}

export interface TimelineTrack {
  id: string;
  type: 'video' | 'audio' | 'text' | 'overlay';
  clips: TimelineClip[];
}

export interface TimelineClip {
  id: string;
  assetId: string;
  startTime: number;
  duration: number;
  position?: {
    x: number;
    y: number;
  };
  scale?: number;
  opacity?: number;
  text?: string;
  style?: ClipStyle;
}

export interface ClipStyle {
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  fontWeight?: string;
}

export interface MediaAsset {
  assetId: string;
  name: string;
  type: 'video' | 'image' | 'audio' | 'logo';
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  size?: number;
  contentType: string;
  createdAt: string;
}

export interface VideoTemplate {
  templateId: string;
  name: string;
  description?: string;
  category: 'workout' | 'promotion' | 'testimonial' | 'tutorial' | 'tip' | 'transformation';
  previewUrl?: string;
  structureJson?: TimelineData;
  createdAt?: string;
}

export interface SocialPublication {
  platform: 'instagram' | 'tiktok' | 'youtube';
  accountId: string;
  caption?: string;
  hashtags?: string[];
  publishAt: string;
}

export interface ScheduledPublication {
  jobId: string;
  videoId: string;
  publications: SocialPublication[];
  status: 'pending' | 'processing' | 'published' | 'failed';
  createdAt: string;
  publishedAt?: string;
}

export interface VideoStats {
  videoId: string;
  views: number;
  likes?: number;
  comments?: number;
  shares?: number;
  engagement_rate?: number;
  reach?: number;
  impressions?: number;
  platform_breakdown?: {
    platform: string;
    views: number;
    engagement_rate: number;
  }[];
}

export interface UploadUrlResponse {
  uploadUrl: string;
  assetId: string;
}

export interface CreateVideoPayload {
  title: string;
  templateId?: string;
  description?: string;
}

// Funciones API simuladas (a implementar con backend real)
export const createVideoProject = async (payload: CreateVideoPayload): Promise<VideoProject> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En producción: POST /api/content/videos
  return {
    videoId: `vid_${Date.now()}`,
    title: payload.title,
    description: payload.description,
    status: 'draft',
    templateId: payload.templateId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const getVideoProjects = async (
  page?: number,
  limit?: number,
  sortBy?: string
): Promise<{ data: VideoProject[]; pagination: { total: number; page: number; limit: number } }> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // En producción: GET /api/content/videos?page={page}&limit={limit}&sortBy={sortBy}
  return {
    data: [],
    pagination: {
      total: 0,
      page: page || 1,
      limit: limit || 10
    }
  };
};

export const getVideoProject = async (videoId: string): Promise<VideoProject | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: GET /api/content/videos/{videoId}
  return null;
};

export const updateVideoProject = async (
  videoId: string,
  updates: Partial<VideoProject>
): Promise<VideoProject> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // En producción: PUT /api/content/videos/{videoId}
  return {
    videoId,
    title: updates.title || 'Video',
    status: updates.status || 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const deleteVideoProject = async (videoId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: DELETE /api/content/videos/{videoId}
  console.log('Eliminando proyecto de video:', videoId);
};

export const scheduleVideoPublication = async (
  videoId: string,
  publications: SocialPublication[],
  publishAt: string
): Promise<ScheduledPublication> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En producción: POST /api/content/videos/{videoId}/schedule
  return {
    jobId: `job_${Date.now()}`,
    videoId,
    publications,
    status: 'pending',
    createdAt: new Date().toISOString(),
    publishAt
  };
};

export const getScheduledPublications = async (): Promise<ScheduledPublication[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: GET /api/content/videos/scheduled
  return [];
};

export const cancelScheduledPublication = async (jobId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: DELETE /api/content/videos/scheduled/{jobId}
  console.log('Cancelando publicación programada:', jobId);
};

export const getVideoStats = async (videoId: string): Promise<VideoStats | null> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // En producción: GET /api/content/videos/{videoId}/stats
  return null;
};

export const getVideoTemplates = async (): Promise<VideoTemplate[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: GET /api/content/video-templates
  return [];
};

export const getMediaAssets = async (type?: string): Promise<MediaAsset[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: GET /api/content/media-assets?type={type}
  return [];
};

export const getUploadUrl = async (
  filename: string,
  contentType: string
): Promise<UploadUrlResponse> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // En producción: POST /api/content/media-assets/upload-url
  return {
    uploadUrl: `https://s3.example.com/upload/${filename}`,
    assetId: `asset_${Date.now()}`
  };
};

export const deleteMediaAsset = async (assetId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: DELETE /api/content/media-assets/{assetId}
  console.log('Eliminando activo de medios:', assetId);
};

export const renderVideo = async (videoId: string): Promise<{ status: string; estimatedTime?: number }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En producción: POST /api/content/videos/{videoId}/render
  return {
    status: 'processing',
    estimatedTime: 120 // segundos
  };
};

export const getRenderStatus = async (videoId: string): Promise<{ status: string; progress?: number }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: GET /api/content/videos/{videoId}/render-status
  return {
    status: 'completed',
    progress: 100
  };
};



















