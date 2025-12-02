import { addDays, startOfDay, endOfDay, differenceInHours } from 'date-fns';
import type {
  CalendarGap,
  CalendarGapAlert,
  PlannerUpcomingPost,
  AITemplateFormat,
  SocialPlatform,
  PlannerAISuggestion,
} from '../types';

interface GapDetectionConfig {
  minPostsPerDay: number;
  optimalPostTimes: string[]; // HH:mm format
  daysToAnalyze: number;
  minGapDuration: number; // hours
  platforms: SocialPlatform[];
}

const defaultConfig: GapDetectionConfig = {
  minPostsPerDay: 1,
  optimalPostTimes: ['09:00', '12:00', '18:00', '21:00'],
  daysToAnalyze: 14,
  minGapDuration: 24,
  platforms: ['instagram', 'facebook', 'tiktok', 'linkedin'],
};

const detectGapsInDay = (
  date: Date,
  posts: PlannerUpcomingPost[],
  config: GapDetectionConfig
): CalendarGap[] => {
  const gaps: CalendarGap[] = [];
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);
  
  // Filter posts for this day
  const dayPosts = posts.filter((post) => {
    const postDate = new Date(post.scheduledAt);
    return postDate >= dayStart && postDate <= dayEnd;
  });

  // Check if day has minimum posts
  if (dayPosts.length < config.minPostsPerDay) {
    const gap: CalendarGap = {
      id: `gap_${date.toISOString().split('T')[0]}`,
      date: date.toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '21:00',
      duration: 12,
      priority: dayPosts.length === 0 ? 'high' : 'medium',
      reason: `Solo ${dayPosts.length} publicación${dayPosts.length !== 1 ? 'es' : ''} programada${dayPosts.length !== 1 ? 's' : ''} para este día`,
      suggestedFormats: ['post', 'reel', 'story'],
      suggestedPlatforms: config.platforms,
    };
    gaps.push(gap);
  }

  // Check for gaps between optimal posting times
  const optimalTimes = config.optimalPostTimes.map((time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes, 0, 0);
    return dateTime;
  });

  for (let i = 0; i < optimalTimes.length - 1; i++) {
    const currentTime = optimalTimes[i];
    const nextTime = optimalTimes[i + 1];
    
    // Check if there's a post in this time range
    const hasPostInRange = dayPosts.some((post) => {
      const postDate = new Date(post.scheduledAt);
      return postDate >= currentTime && postDate < nextTime;
    });

    if (!hasPostInRange) {
      const gapDuration = differenceInHours(nextTime, currentTime);
      
      if (gapDuration >= config.minGapDuration) {
        const gap: CalendarGap = {
          id: `gap_${date.toISOString().split('T')[0]}_${i}`,
          date: date.toISOString().split('T')[0],
          startTime: config.optimalPostTimes[i],
          endTime: config.optimalPostTimes[i + 1],
          duration: gapDuration,
          priority: gapDuration >= 6 ? 'high' : 'medium',
          reason: `Hueco detectado entre ${config.optimalPostTimes[i]} y ${config.optimalPostTimes[i + 1]}`,
          suggestedFormats: ['post', 'story'],
          suggestedPlatforms: ['instagram', 'facebook'],
        };
        gaps.push(gap);
      }
    }
  }

  return gaps;
};

export const detectCalendarGaps = async (
  posts: PlannerUpcomingPost[],
  config?: Partial<GapDetectionConfig>
): Promise<CalendarGap[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  const detectionConfig = { ...defaultConfig, ...config };
  const gaps: CalendarGap[] = [];
  const today = new Date();
  
  // Analyze next N days
  for (let i = 0; i < detectionConfig.daysToAnalyze; i++) {
    const date = addDays(today, i);
    const dayGaps = detectGapsInDay(date, posts, detectionConfig);
    gaps.push(...dayGaps);
  }
  
  // Sort by priority and date
  return gaps.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
};

export const generateGapAlerts = async (
  gaps: CalendarGap[],
  posts: PlannerUpcomingPost[]
): Promise<CalendarGapAlert[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const alerts: CalendarGapAlert[] = [];
  const today = new Date();
  const nextWeek = addDays(today, 7);
  
  // High priority gaps in next 7 days
  const highPriorityGaps = gaps.filter((gap) => {
    const gapDate = new Date(gap.date);
    return gap.priority === 'high' && gapDate >= today && gapDate <= nextWeek;
  });
  
  if (highPriorityGaps.length > 0) {
    alerts.push({
      id: 'alert_gaps_high',
      type: 'gap',
      severity: 'high',
      title: `${highPriorityGaps.length} hueco${highPriorityGaps.length !== 1 ? 's' : ''} prioritario${highPriorityGaps.length !== 1 ? 's' : ''} detectado${highPriorityGaps.length !== 1 ? 's' : ''}`,
      message: `Hay ${highPriorityGaps.length} hueco${highPriorityGaps.length !== 1 ? 's' : ''} en tu calendario editorial que deberías llenar.`,
      gaps: highPriorityGaps,
      createdAt: new Date().toISOString(),
    });
  }
  
  // Low coverage days
  const upcomingDays = [];
  for (let i = 0; i < 7; i++) {
    const date = addDays(today, i);
    const dayPosts = posts.filter((post) => {
      const postDate = new Date(post.scheduledAt);
      return postDate.toDateString() === date.toDateString();
    });
    
    if (dayPosts.length < defaultConfig.minPostsPerDay) {
      upcomingDays.push({
        date: date.toISOString().split('T')[0],
        posts: dayPosts.length,
      });
    }
  }
  
  if (upcomingDays.length > 0) {
    alerts.push({
      id: 'alert_low_coverage',
      type: 'low_coverage',
      severity: 'medium',
      title: `${upcomingDays.length} día${upcomingDays.length !== 1 ? 's' : ''} con baja cobertura`,
      message: `Los próximos ${upcomingDays.length} días tienen menos publicaciones de las recomendadas.`,
      createdAt: new Date().toISOString(),
    });
  }
  
  // Balance check (if we have usage data)
  const totalGaps = gaps.length;
  if (totalGaps > 5) {
    alerts.push({
      id: 'alert_imbalance',
      type: 'imbalance',
      severity: 'low',
      title: 'Desbalance en el calendario',
      message: `Se detectaron ${totalGaps} huecos en el calendario. Considera programar más contenido para mantener una presencia constante.`,
      createdAt: new Date().toISOString(),
    });
  }
  
  return alerts;
};

export const generateAISuggestionsForGap = async (
  gap: CalendarGap
): Promise<PlannerAISuggestion[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const suggestions: PlannerAISuggestion[] = [];
  
  // Generate suggestions based on gap time and format
  const timeOfDay = parseInt(gap.startTime.split(':')[0]);
  let contentType = 'post';
  let priority: 'high' | 'medium' | 'low' = gap.priority;
  
  if (timeOfDay >= 9 && timeOfDay < 12) {
    // Morning: educational content
    suggestions.push({
      id: `suggestion_gap_${gap.id}_1`,
      title: 'Tip de Ejercicio Matutino',
      description: 'Comparte un ejercicio o técnica que tus seguidores puedan practicar durante el día',
      platform: gap.suggestedPlatforms[0] || 'instagram',
      scheduledFor: `${gap.date}T${gap.startTime}`,
      priority,
      reason: 'Contenido educativo funciona bien en horas matutinas',
    });
  } else if (timeOfDay >= 12 && timeOfDay < 15) {
    // Lunch time: motivational content
    suggestions.push({
      id: `suggestion_gap_${gap.id}_2`,
      title: 'Motivación de Mediodía',
      description: 'Inspira a tu audiencia con una cita motivacional o historia de transformación',
      platform: gap.suggestedPlatforms[0] || 'instagram',
      scheduledFor: `${gap.date}T${gap.startTime}`,
      priority,
      reason: 'Contenido inspiracional tiene buen engagement en horas de almuerzo',
    });
  } else if (timeOfDay >= 18 && timeOfDay < 21) {
    // Evening: promotional or engagement content
    suggestions.push({
      id: `suggestion_gap_${gap.id}_3`,
      title: 'Contenido de Tarde',
      description: 'Comparte un testimonio o promoción que capture la atención de tu audiencia',
      platform: gap.suggestedPlatforms[0] || 'instagram',
      scheduledFor: `${gap.date}T${gap.startTime}`,
      priority,
      reason: 'Horario óptimo para contenido promocional y engagement',
    });
  } else {
    // Default: general content
    suggestions.push({
      id: `suggestion_gap_${gap.id}_4`,
      title: 'Contenido de Reels',
      description: 'Crea un reel corto que muestre un ejercicio o tip rápido',
      platform: gap.suggestedPlatforms[0] || 'instagram',
      scheduledFor: `${gap.date}T${gap.startTime}`,
      priority,
      reason: 'Los reels tienen alto alcance en cualquier momento del día',
    });
  }
  
  return suggestions;
};

export const fillGapWithAI = async (
  gap: CalendarGap,
  templateId?: string
): Promise<PlannerUpcomingPost> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  // Generate AI suggestion for the gap
  const suggestions = await generateAISuggestionsForGap(gap);
  const suggestion = suggestions[0];
  
  if (!suggestion) {
    throw new Error('No se pudo generar una sugerencia para este hueco');
  }
  
  // Create post from suggestion
  const post: PlannerUpcomingPost = {
    id: `post_gap_${gap.id}_${Date.now()}`,
    title: suggestion.title,
    scheduledAt: suggestion.scheduledFor,
    platform: suggestion.platform,
    status: 'draft',
    contentType: 'post',
    aiGenerated: true,
  };
  
  return post;
};

export const fillMultipleGapsWithAI = async (
  gaps: CalendarGap[]
): Promise<PlannerUpcomingPost[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const posts: PlannerUpcomingPost[] = [];
  
  // Fill gaps in parallel (limit to 5 at a time to avoid overwhelming)
  const gapsToFill = gaps.slice(0, 5);
  const fillPromises = gapsToFill.map((gap) => fillGapWithAI(gap));
  const results = await Promise.all(fillPromises);
  
  posts.push(...results);
  
  return posts;
};

