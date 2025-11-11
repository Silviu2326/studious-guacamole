export interface CalendarPost {
  id: string;
  date: string;
  status: 'borrador' | 'programado' | 'publicado';
  title: string;
  platform: 'Instagram' | 'Facebook' | 'TikTok' | 'YouTube' | 'LinkedIn';
  asset?: string;
}

export interface CreativeAsset {
  id: string;
  name: string;
  type: 'imagen' | 'video' | 'documento';
  lastUsed?: string;
  tags: string[];
}

export const fetchCalendarPosts = async (): Promise<CalendarPost[]> => {
  return [
    {
      id: 'post-1',
      date: '2025-11-04',
      status: 'programado',
      title: 'Promo Black Friday',
      platform: 'Instagram',
      asset: 'asset-1',
    },
    {
      id: 'post-2',
      date: '2025-11-07',
      status: 'borrador',
      title: 'Tip nutrición post entrenamiento',
      platform: 'TikTok',
    },
    {
      id: 'post-3',
      date: '2025-11-12',
      status: 'publicado',
      title: 'Testimonio socio transformado',
      platform: 'Facebook',
      asset: 'asset-2',
    },
    {
      id: 'post-4',
      date: '2025-11-19',
      status: 'programado',
      title: 'Clase abierta de HIIT',
      platform: 'Instagram',
    },
  ];
};

export const fetchCreativeAssets = async (): Promise<CreativeAsset[]> => {
  return [
    {
      id: 'asset-1',
      name: 'Promo black friday vertical',
      type: 'imagen',
      lastUsed: '2025-11-04',
      tags: ['promocion', 'oferta', 'instagram'],
    },
    {
      id: 'asset-2',
      name: 'Video testimonio Sara',
      type: 'video',
      lastUsed: '2025-11-12',
      tags: ['testimonio', 'facebook'],
    },
    {
      id: 'asset-3',
      name: 'Plantilla quote motivacional',
      type: 'imagen',
      tags: ['motivacion', 'plantilla'],
    },
  ];
};







