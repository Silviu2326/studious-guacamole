// API para gestión de funnels y landing pages

export interface Funnel {
  funnelId: string;
  name: string;
  trainerId: string;
  createdAt: string;
  updatedAt?: string;
  status: 'draft' | 'published' | 'archived';
  steps: FunnelStep[];
}

export interface FunnelStep {
  pageId: string;
  name: string;
  order: number;
  status?: 'draft' | 'published';
}

export interface LandingPage {
  pageId: string;
  funnelId: string;
  name: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  jsonContent: PageContent;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface PageContent {
  components: PageComponent[];
}

export interface PageComponent {
  id: string;
  type: 'heading' | 'text' | 'image' | 'video' | 'form' | 'button' | 'testimonial' | 'beforeAfter' | 'countdown' | 'socialProof';
  props: Record<string, any>;
  position?: number;
}

export interface FunnelAnalytics {
  funnelId: string;
  range: {
    start: string;
    end: string;
  };
  summary: {
    totalVisitors: number;
    totalLeads: number;
    conversionRate: number;
  };
  steps: StepAnalytics[];
}

export interface StepAnalytics {
  pageId: string;
  name: string;
  visitors: number;
  leads: number;
  conversionRate: number;
}

// Funciones API simuladas (a implementar con backend real)
export const createFunnel = async (name: string, templateId?: string): Promise<Funnel> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newFunnel: Funnel = {
    funnelId: `fun_${Date.now()}`,
    name,
    trainerId: 'trn_xyz789',
    createdAt: new Date().toISOString(),
    status: 'draft',
    steps: [
      {
        pageId: `page_${Date.now()}`,
        name: 'Página de Captura',
        order: 0,
        status: 'draft'
      }
    ]
  };
  
  return newFunnel;
};

export const updateLandingPage = async (
  funnelId: string,
  pageId: string,
  pageData: Partial<LandingPage>
): Promise<LandingPage> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const updatedPage: LandingPage = {
    pageId,
    funnelId,
    name: pageData.name || 'Página sin título',
    slug: pageData.slug || 'pagina-sin-slug',
    status: pageData.status || 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    jsonContent: pageData.jsonContent || { components: [] },
    seo: pageData.seo
  };
  
  return updatedPage;
};

export const getFunnelAnalytics = async (
  funnelId: string,
  startDate: string,
  endDate: string
): Promise<FunnelAnalytics> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    funnelId,
    range: {
      start: startDate,
      end: endDate
    },
    summary: {
      totalVisitors: 1520,
      totalLeads: 180,
      conversionRate: 11.84
    },
    steps: [
      {
        pageId: 'page_def456',
        name: 'Página de Captura',
        visitors: 1520,
        leads: 180,
        conversionRate: 11.84
      }
    ]
  };
};

export const getFunnels = async (): Promise<Funnel[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      funnelId: 'fun_abc123',
      name: 'Reto Verano 2024',
      trainerId: 'trn_xyz789',
      createdAt: '2023-10-27T10:00:00Z',
      status: 'published',
      steps: [
        {
          pageId: 'page_def456',
          name: 'Página de Captura',
          order: 0,
          status: 'published'
        },
        {
          pageId: 'page_ghi789',
          name: 'Página de Agradecimiento',
          order: 1,
          status: 'published'
        }
      ]
    }
  ];
};

export const getFunnel = async (funnelId: string): Promise<Funnel | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const funnels = await getFunnels();
  return funnels.find(f => f.funnelId === funnelId) || null;
};

export const getLandingPage = async (funnelId: string, pageId: string): Promise<LandingPage | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const page: LandingPage = {
    pageId,
    funnelId,
    name: 'Página de Captura',
    slug: 'reto-verano-2024',
    status: 'draft',
    createdAt: '2023-10-27T10:00:00Z',
    updatedAt: '2023-10-27T11:30:00Z',
    jsonContent: {
      components: []
    }
  };
  
  return page;
};

export const publishFunnel = async (funnelId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('Publicando funnel:', funnelId);
};

export const deleteFunnel = async (funnelId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log('Eliminando funnel:', funnelId);
};
















