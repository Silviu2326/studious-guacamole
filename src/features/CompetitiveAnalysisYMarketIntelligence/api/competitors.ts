// API para gestión de competidores

export interface Competitor {
  id: string;
  name: string;
  websiteUrl: string;
  socialMediaHandle?: string;
  summary: {
    avgPricePerSession: number;
    socialEngagementRate: number;
    lastUpdate: string;
  };
  status: 'pending_first_scan' | 'scanning' | 'active' | 'error';
}

export interface CompetitorDetails extends Competitor {
  packages: CompetitorPackage[];
  socialMetrics: {
    followers: number;
    postsPerWeek: number;
    avgEngagementRate: number;
    lastPostDate: string;
  };
  services: string[];
  location?: string;
}

export interface CompetitorPackage {
  id: string;
  name: string;
  price: number;
  sessions: number;
  duration: string;
  extras?: string[];
}

// Funciones API simuladas (a implementar con backend real)
export const getCompetitors = async (): Promise<Competitor[]> => {
  // Simulación - en producción esto haría una llamada real
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Datos de ejemplo
  return [
    {
      id: 'comp-abc',
      name: 'FitLife Studio',
      websiteUrl: 'https://fitlifestudio.com',
      summary: {
        avgPricePerSession: 55,
        socialEngagementRate: 2.5,
        lastUpdate: '2023-10-27T10:00:00Z'
      },
      status: 'active'
    },
    {
      id: 'comp-xyz',
      name: 'Joe\'s Personal Training',
      websiteUrl: 'https://joestraining.com',
      summary: {
        avgPricePerSession: 45,
        socialEngagementRate: 3.2,
        lastUpdate: '2023-10-26T14:30:00Z'
      },
      status: 'active'
    }
  ];
};

export const getCompetitorDetails = async (id: string): Promise<CompetitorDetails | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const competitors = await getCompetitors();
  const competitor = competitors.find(c => c.id === id);
  
  if (!competitor) return null;
  
  return {
    ...competitor,
    packages: [
      {
        id: 'pkg-1',
        name: 'Paquete Mensual Estándar',
        price: 200,
        sessions: 4,
        duration: '1 mes',
        extras: ['Seguimiento nutricional']
      },
      {
        id: 'pkg-2',
        name: 'Paquete Premium',
        price: 350,
        sessions: 8,
        duration: '1 mes',
        extras: ['Seguimiento nutricional', 'App móvil']
      }
    ],
    socialMetrics: {
      followers: 12500,
      postsPerWeek: 4,
      avgEngagementRate: 2.5,
      lastPostDate: '2023-10-27T10:00:00Z'
    },
    services: ['Entrenamiento Funcional', 'HIIT', 'Asesoría Nutricional'],
    location: 'Madrid, ES'
  };
};

export const createCompetitor = async (url: string): Promise<Competitor> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En producción: POST /api/intelligence/competitors
  // Validación de URL y creación del registro
  const newCompetitor: Competitor = {
    id: `comp-${Date.now()}`,
    name: 'Competidor en análisis...',
    websiteUrl: url,
    summary: {
      avgPricePerSession: 0,
      socialEngagementRate: 0,
      lastUpdate: new Date().toISOString()
    },
    status: 'pending_first_scan'
  };
  
  return newCompetitor;
};

export const deleteCompetitor = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: DELETE /api/intelligence/competitors/{id}
  // No retorna nada en caso de éxito, o lanza error si falla
  console.log('Eliminando competidor:', id);
};

