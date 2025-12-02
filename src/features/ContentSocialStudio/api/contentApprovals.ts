import type {
  ContentApproval,
  ApprovalStatus,
  MobileContentApprovalRequest,
  AIPreviewRequest,
  AIPreviewResponse,
  PlannerContentType,
  SocialPlatform,
  ContentTeamRole,
} from '../types';

// Mock storage - en producción vendría del backend
const approvals: ContentApproval[] = [
  {
    id: '1',
    contentId: 'content_1',
    title: 'Reel: Tips de entrenamiento matutino',
    type: 'reel',
    platform: 'instagram',
    content: {
      caption: '¿Entrenas por la mañana? Aquí tienes 5 tips para maximizar tu rendimiento...',
      script: 'Hook: ¿Entrenas por la mañana? Aquí tienes 5 tips para maximizar tu rendimiento...',
      mediaUrls: ['https://example.com/video1.mp4'],
      hashtags: ['fitness', 'entrenamiento', 'tips'],
    },
    status: 'pending',
    submittedBy: {
      userId: '1',
      userName: 'María González',
      userEmail: 'maria@example.com',
      role: 'video-editor',
    },
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Hace 2 horas
    metadata: {
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Mañana
      tags: ['fitness', 'tips'],
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    contentId: 'content_2',
    title: 'Carousel: Rutina de fuerza',
    type: 'carousel',
    platform: 'instagram',
    content: {
      caption: 'Rutina completa de fuerza para principiantes. 5 ejercicios fundamentales...',
      mediaUrls: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
      hashtags: ['fuerza', 'rutina', 'principiantes'],
    },
    status: 'pending',
    submittedBy: {
      userId: '2',
      userName: 'Carlos Rodríguez',
      userEmail: 'carlos@example.com',
      role: 'designer',
    },
    submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // Hace 5 horas
    metadata: {
      scheduledDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // En 2 días
      tags: ['fuerza', 'rutina'],
    },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Obtiene todas las aprobaciones pendientes
 */
export const getPendingApprovals = async (): Promise<ContentApproval[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return approvals.filter((approval) => approval.status === 'pending');
};

/**
 * Obtiene una aprobación específica por ID
 */
export const getApprovalById = async (id: string): Promise<ContentApproval | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return approvals.find((approval) => approval.id === id) || null;
};

/**
 * Genera un preview de IA para el contenido
 */
export const generateAIPreview = async (request: AIPreviewRequest): Promise<AIPreviewResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simular procesamiento IA

  // Simulación de análisis IA
  const content = request.content.caption || request.content.script || '';
  const estimatedEngagement = calculateEstimatedEngagement(content, request.contentType, request.platform);
  const estimatedReach = calculateEstimatedReach(estimatedEngagement);
  const qualityScore = calculateQualityScore(content, request.contentType);
  const suggestions = generateSuggestions(content, request.contentType, request.platform);

  const preview: AIPreviewResponse = {
    previewImage: `https://example.com/preview_${request.contentId}.jpg`, // URL simulada
    previewVideo: request.contentType === 'reel' || request.contentType === 'video' 
      ? `https://example.com/preview_${request.contentId}.mp4` 
      : undefined,
    estimatedEngagement,
    estimatedReach,
    qualityScore,
    suggestions,
    feedback: generateFeedback(qualityScore, suggestions),
  };

  return preview;
};

/**
 * Aproba o rechaza contenido desde móvil
 */
export const approveContent = async (request: MobileContentApprovalRequest): Promise<ContentApproval> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const approval = approvals.find((a) => a.id === request.approvalId);

  if (!approval) {
    throw new Error('Aprobación no encontrada');
  }

  approval.status = request.status;
  approval.reviewedAt = new Date().toISOString();
  approval.reviewedBy = 'trainer_1'; // En producción vendría del contexto de autenticación
  approval.updatedAt = new Date().toISOString();

  if (request.status === 'rejected') {
    approval.rejectionReason = request.notes || 'Rechazado sin razón específica';
  }

  if (request.status === 'needs-revision') {
    approval.revisionNotes = request.revisionNotes || request.notes || 'Necesita revisiones';
  }

  return approval;
};

/**
 * Obtiene el historial de aprobaciones recientes
 */
export const getRecentApprovals = async (limit: number = 10): Promise<ContentApproval[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return approvals
    .filter((approval) => approval.status !== 'pending')
    .sort((a, b) => new Date(b.reviewedAt || b.createdAt).getTime() - new Date(a.reviewedAt || a.createdAt).getTime())
    .slice(0, limit);
};

/**
 * Obtiene estadísticas de aprobaciones
 */
export const getApprovalStats = async (): Promise<{
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  needsRevisionCount: number;
}> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const pendingCount = approvals.filter((a) => a.status === 'pending').length;
  const approvedCount = approvals.filter((a) => a.status === 'approved').length;
  const rejectedCount = approvals.filter((a) => a.status === 'rejected').length;
  const needsRevisionCount = approvals.filter((a) => a.status === 'needs-revision').length;

  return {
    pendingCount,
    approvedCount,
    rejectedCount,
    needsRevisionCount,
  };
};

// Funciones auxiliares para simular análisis IA

function calculateEstimatedEngagement(
  content: string,
  contentType: PlannerContentType,
  platform?: SocialPlatform
): number {
  let engagement = 100; // Base

  // Ajustar según tipo de contenido
  if (contentType === 'reel' || contentType === 'video') {
    engagement += 200;
  } else if (contentType === 'carousel') {
    engagement += 150;
  } else if (contentType === 'story') {
    engagement += 50;
  }

  // Ajustar según plataforma
  if (platform === 'instagram') {
    engagement += 100;
  } else if (platform === 'tiktok') {
    engagement += 150;
  }

  // Ajustar según longitud del contenido
  const wordCount = content.split(/\s+/).length;
  if (wordCount >= 50 && wordCount <= 200) {
    engagement += 50;
  }

  // Ajustar según hashtags
  const hashtagCount = (content.match(/#\w+/g) || []).length;
  if (hashtagCount >= 5 && hashtagCount <= 10) {
    engagement += 30;
  }

  return Math.round(engagement + Math.random() * 100); // Añadir variabilidad
}

function calculateEstimatedReach(engagement: number): number {
  // El reach suele ser 3-5x el engagement
  return Math.round(engagement * (3 + Math.random() * 2));
}

function calculateQualityScore(content: string, contentType: PlannerContentType): number {
  let score = 70; // Base

  // Verificar longitud adecuada
  const wordCount = content.split(/\s+/).length;
  if (wordCount >= 30 && wordCount <= 300) {
    score += 10;
  }

  // Verificar estructura
  if (content.includes('\n') || content.includes('•') || content.includes('-')) {
    score += 5;
  }

  // Verificar CTA
  if (/(comenta|dime|escribe|reserva|agenda|consulta)/gi.test(content)) {
    score += 10;
  }

  // Verificar hashtags
  const hashtagCount = (content.match(/#\w+/g) || []).length;
  if (hashtagCount >= 3 && hashtagCount <= 10) {
    score += 5;
  }

  return Math.min(100, Math.max(0, score));
}

function generateSuggestions(
  content: string,
  contentType: PlannerContentType,
  platform?: SocialPlatform
): Array<{
  category: 'optimization' | 'engagement' | 'format' | 'timing';
  message: string;
  priority: 'high' | 'medium' | 'low';
}> {
  const suggestions: Array<{
    category: 'optimization' | 'engagement' | 'format' | 'timing';
    message: string;
    priority: 'high' | 'medium' | 'low';
  }> = [];

  const wordCount = content.split(/\s+/).length;

  // Sugerencias de optimización
  if (wordCount < 30) {
    suggestions.push({
      category: 'optimization',
      message: 'El contenido es muy corto. Considera añadir más contexto para aumentar el engagement.',
      priority: 'medium',
    });
  }

  // Sugerencias de engagement
  if (!/(comenta|dime|escribe|reserva|agenda|consulta)/gi.test(content)) {
    suggestions.push({
      category: 'engagement',
      message: 'Añade un llamado a la acción (CTA) para aumentar la interacción.',
      priority: 'high',
    });
  }

  // Sugerencias de formato
  if (contentType === 'reel' && platform === 'instagram') {
    suggestions.push({
      category: 'format',
      message: 'Asegúrate de que el video tenga una duración de 15-30 segundos para máximo engagement.',
      priority: 'low',
    });
  }

  // Sugerencias de timing
  if (platform === 'instagram') {
    suggestions.push({
      category: 'timing',
      message: 'Publica entre las 18:00-20:00 para máximo alcance en Instagram.',
      priority: 'low',
    });
  }

  return suggestions;
}

function generateFeedback(qualityScore: number, suggestions: Array<{ category: string; message: string; priority: string }>): string {
  if (qualityScore >= 80) {
    return 'Excelente contenido. Está bien optimizado y tiene buen potencial de engagement.';
  } else if (qualityScore >= 65) {
    return 'Buen contenido con algunas áreas de mejora. Revisa las sugerencias para optimizarlo.';
  } else {
    return 'El contenido necesita mejoras. Aplica las sugerencias para aumentar su efectividad.';
  }
}

