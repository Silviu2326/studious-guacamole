// API para gestión de la Librería de Campañas (Playbooks)

export interface PlaybookAsset {
  id: string;
  type: 'email' | 'social_post' | 'landing_page' | 'sms';
  name: string;
  previewContent: string;
}

export interface PlaybookSummary {
  id: string;
  name: string;
  description: string;
  objective: 'lead_generation' | 'retention' | 'monetization';
  tags: string[];
  assetCounts: {
    emails: number;
    socialPosts: number;
    landingPages: number;
    sms: number;
  };
}

export interface PlaybookDetail extends PlaybookSummary {
  fullDescription: string;
  assets: PlaybookAsset[];
}

export interface PlaybookResponse {
  data: PlaybookSummary[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ActivationResponse {
  success: boolean;
  message: string;
  campaignId: string;
}

// Funciones API simuladas
export const getPlaybookTemplates = async (
  page: number = 1,
  limit: number = 10,
  filters?: {
    objective?: string;
    tags?: string[];
  }
): Promise<PlaybookResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const allPlaybooks: PlaybookSummary[] = [
    {
      id: 'playbook-001',
      name: 'Reto de 30 Días para Abdominales',
      description: 'Campaña completa para captar leads y vender un reto de fitness online de 30 días.',
      objective: 'lead_generation',
      tags: ['reto', 'online', 'captacion', 'verano'],
      assetCounts: {
        emails: 7,
        socialPosts: 15,
        landingPages: 2,
        sms: 3
      }
    },
    {
      id: 'playbook-002',
      name: 'Transformación de Verano en 6 Semanas',
      description: 'Embudo completo para convertir leads en clientes con un programa intensivo de verano.',
      objective: 'lead_generation',
      tags: ['verano', 'transformacion', 'captacion', 'programa'],
      assetCounts: {
        emails: 8,
        socialPosts: 20,
        landingPages: 1,
        sms: 4
      }
    },
    {
      id: 'playbook-003',
      name: 'Te Echamos de Menos - Reactivación',
      description: 'Campaña de reactivación para recuperar clientes inactivos con ofertas irresistibles.',
      objective: 'retention',
      tags: ['reactivacion', 'retencion', 're-engagement'],
      assetCounts: {
        emails: 5,
        socialPosts: 10,
        landingPages: 1,
        sms: 2
      }
    },
    {
      id: 'playbook-004',
      name: 'Oferta de Año Nuevo - Nuevos Propósitos',
      description: 'Campaña estacional para aprovechar los propósitos de Año Nuevo y captar nuevos clientes.',
      objective: 'lead_generation',
      tags: ['ano_nuevo', 'estacional', 'captacion', 'inicio_ano'],
      assetCounts: {
        emails: 6,
        socialPosts: 18,
        landingPages: 2,
        sms: 3
      }
    },
    {
      id: 'playbook-005',
      name: 'Programa de Referidos - Trae un Amigo',
      description: 'Campaña para incentivar que tus clientes traigan amigos y familiares a tu programa.',
      objective: 'retention',
      tags: ['referidos', 'retencion', 'viral'],
      assetCounts: {
        emails: 4,
        socialPosts: 12,
        landingPages: 1,
        sms: 2
      }
    },
    {
      id: 'playbook-006',
      name: 'Lanzamiento de Coaching Premium',
      description: 'Embudo de venta para programas de coaching de alto valor con apoyo 1-a-1.',
      objective: 'monetization',
      tags: ['premium', 'monetizacion', 'coaching', 'alta_conversion'],
      assetCounts: {
        emails: 10,
        socialPosts: 25,
        landingPages: 3,
        sms: 5
      }
    }
  ];

  // Aplicar filtros
  let filteredPlaybooks = allPlaybooks;
  if (filters?.objective) {
    filteredPlaybooks = filteredPlaybooks.filter(p => p.objective === filters.objective);
  }
  if (filters?.tags && filters.tags.length > 0) {
    filteredPlaybooks = filteredPlaybooks.filter(p =>
      filters.tags!.some(tag => p.tags.includes(tag))
    );
  }

  // Paginación
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedPlaybooks = filteredPlaybooks.slice(start, end);

  return {
    data: paginatedPlaybooks,
    pagination: {
      total: filteredPlaybooks.length,
      page,
      limit
    }
  };
};

export const getPlaybookTemplate = async (templateId: string): Promise<PlaybookDetail | null> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const templates = await getPlaybookTemplates();
  const template = templates.data.find(p => p.id === templateId);
  
  if (!template) return null;
  
  // Generar assets simulados
  const assets: PlaybookAsset[] = [];
  
  // Emails
  for (let i = 1; i <= template.assetCounts.emails; i++) {
    assets.push({
      id: `asset-email-${i}`,
      type: 'email',
      name: `Email ${i}: ${i === 1 ? 'Anuncio Inicial' : i === template.assetCounts.emails ? 'Última Oportunidad' : `Seguimiento ${i}`}`,
      previewContent: `Este es el contenido del email ${i}. Incluye una introducción atractiva, el cuerpo del mensaje con beneficios clave, y un call-to-action claro para maximizar la conversión.`
    });
  }
  
  // Social Posts
  for (let i = 1; i <= template.assetCounts.socialPosts; i++) {
    assets.push({
      id: `asset-social-${i}`,
      type: 'social_post',
      name: `Post ${i}: ${i <= 5 ? 'Anuncio inicial' : 'Contenido de valor'}`,
      previewContent: `Post captivador para Instagram/Facebook con copy persuasivo, hashtags relevantes y CTA efectivo.`
    });
  }
  
  // Landing Pages
  for (let i = 1; i <= template.assetCounts.landingPages; i++) {
    assets.push({
      id: `asset-landing-${i}`,
      type: 'landing_page',
      name: `Landing Page ${i}${i === 1 ? ' - Principal' : ' - Seguimiento'}`,
      previewContent: `Diseño de landing page optimizado para conversión con formulario de captura, testimonios y garantías.`
    });
  }
  
  // SMS
  for (let i = 1; i <= template.assetCounts.sms; i++) {
    assets.push({
      id: `asset-sms-${i}`,
      type: 'sms',
      name: `SMS ${i}: Recordatorio`,
      previewContent: `Mensaje SMS conciso para recordar la oferta y generar urgencia.`
    });
  }
  
  return {
    ...template,
    fullDescription: `${template.description} Este playbook incluye todos los activos necesarios para ejecutar una campaña profesional y efectiva. Todos los materiales están listos para personalizarse con tu marca y lanzarse.`,
    assets
  };
};

export const activatePlaybook = async (
  templateId: string,
  campaignName: string
): Promise<ActivationResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    message: `Campaña '${campaignName}' creada exitosamente`,
    campaignId: `camp-${Date.now()}`
  };
};

export const getPlaybookStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    totalPlaybooks: 25,
    totalActivations: 1520,
    avgConversionRate: 0.32,
    mostPopular: [
      { id: 'playbook-002', name: 'Transformación de Verano', activations: 245 },
      { id: 'playbook-001', name: 'Reto de 30 Días', activations: 189 },
      { id: 'playbook-004', name: 'Oferta de Año Nuevo', activations: 167 }
    ]
  };
};






















