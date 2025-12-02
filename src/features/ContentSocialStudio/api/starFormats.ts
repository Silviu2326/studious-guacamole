import type { StarFormatsConfig, StarFormat, ContentFormat, ExtendedSocialPlatform } from '../types';

// Mock storage - en producción vendría del backend
let starFormatsConfig: StarFormatsConfig | null = null;

/**
 * Obtiene la configuración de formatos estrella del entrenador
 */
export const getStarFormatsConfig = async (): Promise<StarFormatsConfig | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Mock data - en producción vendría del backend
  if (!starFormatsConfig) {
    return null;
  }

  return starFormatsConfig;
};

/**
 * Guarda o actualiza la configuración de formatos estrella
 */
export const saveStarFormatsConfig = async (
  config: Omit<StarFormatsConfig, 'trainerId' | 'updatedAt'>
): Promise<StarFormatsConfig> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const now = new Date().toISOString();
  const trainerId = 'trn_current'; // En producción vendría del contexto de autenticación

  starFormatsConfig = {
    ...config,
    trainerId,
    updatedAt: now,
  };

  return starFormatsConfig;
};

/**
 * Obtiene los formatos de contenido disponibles
 */
export const getAvailableContentFormats = (): Array<{ 
  value: ContentFormat; 
  label: string; 
  description: string;
  defaultPlatforms: ExtendedSocialPlatform[];
}> => {
  return [
    { 
      value: 'reel', 
      label: 'Reels', 
      description: 'Videos cortos y dinámicos para Instagram y Facebook',
      defaultPlatforms: ['instagram', 'facebook'],
    },
    { 
      value: 'carousel', 
      label: 'Carruseles', 
      description: 'Publicaciones con múltiples imágenes o slides',
      defaultPlatforms: ['instagram', 'facebook', 'linkedin'],
    },
    { 
      value: 'email', 
      label: 'Emails', 
      description: 'Newsletters y comunicaciones por correo electrónico',
      defaultPlatforms: [],
    },
    { 
      value: 'post', 
      label: 'Posts', 
      description: 'Publicaciones estándar en redes sociales',
      defaultPlatforms: ['instagram', 'facebook', 'linkedin', 'twitter'],
    },
    { 
      value: 'story', 
      label: 'Stories', 
      description: 'Contenido efímero de 24 horas',
      defaultPlatforms: ['instagram', 'facebook'],
    },
    { 
      value: 'blog', 
      label: 'Blog Posts', 
      description: 'Artículos largos y detallados',
      defaultPlatforms: [],
    },
    { 
      value: 'newsletter', 
      label: 'Newsletters', 
      description: 'Boletines informativos por email',
      defaultPlatforms: [],
    },
    { 
      value: 'tiktok', 
      label: 'TikTok', 
      description: 'Videos cortos para TikTok',
      defaultPlatforms: ['tiktok'],
    },
    { 
      value: 'youtube', 
      label: 'YouTube', 
      description: 'Videos largos para YouTube',
      defaultPlatforms: ['youtube'],
    },
  ];
};

/**
 * Crea una configuración inicial de formatos estrella con valores por defecto
 */
export const getDefaultStarFormats = (): StarFormat[] => {
  const formats = getAvailableContentFormats();
  return formats.map((format) => ({
    format: format.value,
    priority: format.value === 'reel' || format.value === 'carousel' || format.value === 'email' ? 8 : 5,
    enabled: format.value === 'reel' || format.value === 'carousel' || format.value === 'email',
    preferredPlatforms: format.defaultPlatforms,
  }));
};

