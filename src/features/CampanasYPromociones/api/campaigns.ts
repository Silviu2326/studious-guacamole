export interface Segment {
  id: string;
  name: string;
  description: string;
  size: number;
}

export interface CampaignTemplate {
  id: string;
  title: string;
  channel: 'email' | 'sms';
  description: string;
  preset: boolean;
}

export interface Promotion {
  id: string;
  name: string;
  type: 'discount' | 'coupon' | 'referral';
  value: string;
  expiresAt?: string;
}

export const fetchSimpleSegments = async (): Promise<Segment[]> => {
  return [
    {
      id: 'new-members',
      name: 'Nuevos miembros',
      description: 'Personas registradas en los últimos 30 días',
      size: 42,
    },
    {
      id: 'inactive-members',
      name: 'Inactivos',
      description: 'Sin asistir ni interactuar en las últimas 4 semanas',
      size: 27,
    },
    {
      id: 'at-risk-members',
      name: 'En riesgo de baja',
      description: 'Varias ausencias y respuestas negativas recientes',
      size: 18,
    },
  ];
};

export const fetchCampaignTemplates = async (): Promise<CampaignTemplate[]> => {
  return [
    {
      id: 'welcome-boost',
      title: 'Booster de bienvenida',
      channel: 'email',
      description: 'Secuencia básica de 3 correos para nuevos miembros',
      preset: true,
    },
    {
      id: 'reactivation-nudge',
      title: 'Campaña de reactivación rápida',
      channel: 'sms',
      description: 'Plantilla de SMS para reactivar clientes inactivos',
      preset: true,
    },
    {
      id: 'at-risk-checkin',
      title: 'Check-in clientes en riesgo',
      channel: 'email',
      description: 'Correo con CTA para retener clientes cerca de la baja',
      preset: true,
    },
  ];
};

export const fetchActivePromotions = async (): Promise<Promotion[]> => {
  return [
    {
      id: 'friend-pass',
      name: 'Código amigos 2x1',
      type: 'referral',
      value: '2 pase libre',
      expiresAt: '2025-12-31',
    },
    {
      id: 'flash-discount',
      name: 'Promo puntual 15% mensualidad',
      type: 'discount',
      value: '15%',
      expiresAt: '2025-08-15',
    },
    {
      id: 'coupon-backtoschool',
      name: 'Cupón Back to School',
      type: 'coupon',
      value: 'BTSSCHOOL',
      expiresAt: '2025-09-30',
    },
  ];
};

