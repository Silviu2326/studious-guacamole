// API para gestión de Retargeting & Pixel Manager

export type PixelPlatform = 'facebook' | 'google_analytics' | 'gtm';
export type PixelStatus = 'active' | 'inactive' | 'error' | 'loading';

export interface Pixel {
  id: string;
  platform: PixelPlatform;
  pixelId: string;
  isActive: boolean;
  createdAt?: string;
  lastEventTimestamp?: string;
}

export interface PixelHealthCheck {
  status: PixelStatus;
  lastEvent: Date | null;
  eventsLast24h: number;
  eventsLast7d: number;
}

export interface AudienceSuggestion {
  id: string;
  name: string;
  description: string;
  criteria: {
    type: string;
    path?: string;
    sequence?: string[];
  };
}

export interface PixelEvent {
  id: string;
  name: string;
  platform: PixelPlatform;
  eventType: string;
  count: number;
  percentage: number;
}

// Funciones API simuladas
export const getPixels = async (): Promise<Pixel[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  return [
    {
      id: 'px_001',
      platform: 'facebook',
      pixelId: '123456789012345',
      isActive: true,
      createdAt: '2023-10-27T10:00:00Z',
      lastEventTimestamp: '2024-01-27T14:30:00Z'
    },
    {
      id: 'px_002',
      platform: 'google_analytics',
      pixelId: 'G-XXXXXXXXXX',
      isActive: true,
      createdAt: '2023-11-15T09:00:00Z',
      lastEventTimestamp: '2024-01-27T13:15:00Z'
    }
  ];
};

export const createPixel = async (
  platform: PixelPlatform,
  pixelId: string
): Promise<Pixel> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  return {
    id: `px_${Date.now()}`,
    platform,
    pixelId,
    isActive: true,
    createdAt: new Date().toISOString()
  };
};

export const updatePixel = async (
  pixelId: string,
  isActive: boolean
): Promise<Pixel> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const pixels = await getPixels();
  const existing = pixels.find(p => p.id === pixelId);

  if (!existing) {
    throw new Error('Pixel no encontrado');
  }

  return {
    ...existing,
    isActive
  };
};

export const deletePixel = async (pixelId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 400));
};

export const getPixelHealthCheck = async (pixelId: string): Promise<PixelHealthCheck> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    status: 'active',
    lastEvent: new Date(),
    eventsLast24h: 156,
    eventsLast7d: 1234
  };
};

export const getAudienceSuggestions = async (): Promise<AudienceSuggestion[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  return [
    {
      id: 'sug_001',
      name: 'Visitantes de la página de precios (últimos 30 días)',
      description: 'Personas que han mostrado interés en tus precios pero no han comprado. Ideal para anuncios de oferta o testimonios.',
      criteria: {
        type: 'URL_VISIT',
        path: '/pricing'
      }
    },
    {
      id: 'sug_002',
      name: 'Abandono de inscripción a reto (últimos 7 días)',
      description: 'Personas que iniciaron la inscripción a tu último reto pero no la completaron.',
      criteria: {
        type: 'EVENT_SEQUENCE',
        sequence: ['begin_checkout', '!purchase']
      }
    },
    {
      id: 'sug_003',
      name: 'Visitantes de la página de contacto (últimos 30 días)',
      description: 'Personas que visitaron tu página de contacto pero no enviaron el formulario.',
      criteria: {
        type: 'URL_VISIT',
        path: '/contact'
      }
    },
    {
      id: 'sug_004',
      name: 'Visualizadores de planes de entrenamiento (últimos 14 días)',
      description: 'Personas que vieron tu catálogo de planes pero no compraron ninguno.',
      criteria: {
        type: 'EVENT_SEQUENCE',
        sequence: ['ViewContent', '!purchase']
      }
    }
  ];
};

export const getTopEvents = async (): Promise<PixelEvent[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  return [
    { id: 'e_001', name: 'PageView', platform: 'facebook', eventType: 'PageView', count: 4523, percentage: 45.2 },
    { id: 'e_002', name: 'ViewContent', platform: 'facebook', eventType: 'ViewContent', count: 2341, percentage: 23.4 },
    { id: 'e_003', name: 'Lead', platform: 'facebook', eventType: 'Lead', count: 892, percentage: 8.9 },
    { id: 'e_004', name: 'AddToCart', platform: 'facebook', eventType: 'AddToCart', count: 567, percentage: 5.7 },
    { id: 'e_005', name: 'InitiateCheckout', platform: 'facebook', eventType: 'InitiateCheckout', count: 234, percentage: 2.3 }
  ];
};

export const getPlatformLabel = (platform: PixelPlatform): string => {
  const labels = {
    facebook: 'Facebook Pixel',
    google_analytics: 'Google Analytics',
    gtm: 'Google Tag Manager'
  };
  return labels[platform];
};

export const getPlatformIcon = (platform: PixelPlatform): string => {
  const colors = {
    facebook: 'text-blue-600',
    google_analytics: 'text-orange-600',
    gtm: 'text-blue-500'
  };
  return colors[platform];
};

export const getStatusLabel = (isActive: boolean): string => {
  return isActive ? 'Activo' : 'Inactivo';
};

export const getStatusColor = (isActive: boolean): string => {
  return isActive ? 'text-green-700 bg-green-50' : 'text-gray-700 bg-gray-50';
};

export const getHealthStatusColor = (status: PixelStatus): string => {
  const colors = {
    active: 'text-green-700 bg-green-50',
    inactive: 'text-gray-700 bg-gray-50',
    error: 'text-red-700 bg-red-50',
    loading: 'text-yellow-700 bg-yellow-50'
  };
  return colors[status];
};

export const formatLastEvent = (timestamp?: string): string => {
  if (!timestamp) return 'Nunca';

  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return 'hace unos segundos';
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} minutos`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} horas`;
  return `hace ${Math.floor(diff / 86400)} días`;
};




















