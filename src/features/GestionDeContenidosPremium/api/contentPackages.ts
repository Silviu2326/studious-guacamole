// API para gestión de contenidos premium

export type AccessType = 'one-time' | 'subscription' | 'free' | 'custom';
export type ContentItemType = 'video' | 'pdf' | 'text' | 'link' | 'image' | 'audio';
export type DripScheduleUnit = 'days' | 'weeks' | 'immediate';

export interface ContentItem {
  id: string;
  type: ContentItemType;
  title: string;
  description?: string;
  url?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  duration?: number; // Para videos en segundos
  order: number;
  isRequired?: boolean;
}

export interface ContentModule {
  id: string;
  title: string;
  description?: string;
  items: ContentItem[];
  order: number;
  dripSchedule?: {
    unit: DripScheduleUnit;
    value: number; // Número de días/semanas después del acceso
  };
}

export interface ContentPackage {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  trainerId: string;
  price: number;
  currency?: string;
  accessType: AccessType;
  subscriptionPlanId?: string; // Si accessType es 'subscription'
  modules: ContentModule[];
  enrolledClients: number;
  totalRevenue?: number;
  createdAt: string;
  updatedAt?: string;
  isPublished?: boolean;
  isDripEnabled?: boolean;
}

export interface ClientAccess {
  clientId: string;
  packageId: string;
  grantedAt: string;
  expiresAt?: string;
  progress?: {
    completedModules: string[];
    lastAccessedAt: string;
    itemsCompleted: string[];
  };
}

export interface PackageAnalytics {
  packageId: string;
  totalEnrolled: number;
  activeUsers: number;
  completionRate: number;
  averageProgress: number;
  revenue: number;
  dropoutPoints: Array<{
    moduleId: string;
    moduleTitle: string;
    dropoutRate: number;
  }>;
  topItems: Array<{
    itemId: string;
    itemTitle: string;
    viewCount: number;
  }>;
}

// Funciones API simuladas (a implementar con backend real)
export const getContentPackages = async (filters?: {
  sortBy?: string;
}): Promise<ContentPackage[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: 'pkg_abc123',
      title: 'Programa de Hipertrofia de 12 Semanas',
      description: 'Programa completo de entrenamiento para ganar masa muscular',
      imageUrl: 'https://via.placeholder.com/400x300',
      trainerId: 'trn_current',
      price: 99.99,
      currency: 'EUR',
      accessType: 'one-time',
      modules: [
        {
          id: 'mod_1',
          title: 'Semana 1: Fundamentos',
          description: 'Introducción y base del programa',
          items: [
            {
              id: 'item_1',
              type: 'video',
              title: 'Bienvenida al Programa',
              url: 'https://example.com/video1',
              duration: 300,
              order: 1,
              isRequired: true
            },
            {
              id: 'item_2',
              type: 'pdf',
              title: 'Guía de Nutrición',
              fileUrl: 'https://example.com/guide.pdf',
              order: 2
            }
          ],
          order: 1
        }
      ],
      enrolledClients: 45,
      totalRevenue: 4499.55,
      createdAt: '2023-10-27T10:00:00Z',
      updatedAt: '2023-11-15T14:30:00Z',
      isPublished: true,
      isDripEnabled: true
    },
    {
      id: 'pkg_def456',
      title: 'Biblioteca de Técnica Avanzada',
      description: 'Videos exclusivos de técnica avanzada para miembros Pro',
      imageUrl: 'https://via.placeholder.com/400x300',
      trainerId: 'trn_current',
      price: 0,
      accessType: 'subscription',
      subscriptionPlanId: 'plan_pro',
      modules: [
        {
          id: 'mod_2',
          title: 'Técnicas de Sentadilla',
          items: [
            {
              id: 'item_3',
              type: 'video',
              title: 'Sentadilla Frontal Avanzada',
              url: 'https://example.com/video2',
              duration: 420,
              order: 1
            }
          ],
          order: 1
        }
      ],
      enrolledClients: 28,
      createdAt: '2023-09-15T09:00:00Z',
      isPublished: true,
      isDripEnabled: false
    },
    {
      id: 'pkg_ghi789',
      title: 'Plan Nutricional Keto - 30 Días',
      description: 'Plan completo para iniciar la dieta cetogénica',
      imageUrl: 'https://via.placeholder.com/400x300',
      trainerId: 'trn_current',
      price: 49.99,
      currency: 'EUR',
      accessType: 'one-time',
      modules: [],
      enrolledClients: 0,
      createdAt: '2023-11-20T12:00:00Z',
      isPublished: false,
      isDripEnabled: false
    }
  ];
};

export const createContentPackage = async (
  packageData: Omit<ContentPackage, 'id' | 'trainerId' | 'createdAt' | 'enrolledClients' | 'modules'>
): Promise<ContentPackage> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const newPackage: ContentPackage = {
    id: `pkg_${Date.now()}`,
    ...packageData,
    trainerId: 'trn_current',
    modules: [],
    enrolledClients: 0,
    createdAt: new Date().toISOString()
  };
  
  return newPackage;
};

export const updateContentPackage = async (
  packageId: string,
  updates: Partial<ContentPackage>
): Promise<ContentPackage> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const packages = await getContentPackages();
  const existing = packages.find(p => p.id === packageId);
  
  if (!existing) {
    throw new Error('Paquete de contenido no encontrado');
  }
  
  return {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };
};

export const getContentPackage = async (packageId: string): Promise<ContentPackage | null> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const packages = await getContentPackages();
  return packages.find(p => p.id === packageId) || null;
};

export const deleteContentPackage = async (packageId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log('Eliminando paquete de contenido:', packageId);
};

export const grantPackageAccess = async (
  packageId: string,
  clientId: string,
  accessDurationDays?: number
): Promise<ClientAccess> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const expiresAt = accessDurationDays
    ? new Date(Date.now() + accessDurationDays * 24 * 60 * 60 * 1000).toISOString()
    : undefined;
  
  return {
    clientId,
    packageId,
    grantedAt: new Date().toISOString(),
    expiresAt,
    progress: {
      completedModules: [],
      lastAccessedAt: new Date().toISOString(),
      itemsCompleted: []
    }
  };
};

export const revokePackageAccess = async (
  packageId: string,
  clientId: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log('Revocando acceso:', packageId, clientId);
};

export const getPackageAnalytics = async (packageId: string): Promise<PackageAnalytics> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    packageId,
    totalEnrolled: 45,
    activeUsers: 32,
    completionRate: 0.67,
    averageProgress: 0.72,
    revenue: 4499.55,
    dropoutPoints: [
      {
        moduleId: 'mod_3',
        moduleTitle: 'Semana 3: Intensificación',
        dropoutRate: 0.25
      },
      {
        moduleId: 'mod_5',
        moduleTitle: 'Semana 5: Pico de Intensidad',
        dropoutRate: 0.35
      }
    ],
    topItems: [
      {
        itemId: 'item_1',
        itemTitle: 'Bienvenida al Programa',
        viewCount: 45
      },
      {
        itemId: 'item_2',
        itemTitle: 'Guía de Nutrición',
        viewCount: 38
      }
    ]
  };
};

export const duplicatePackage = async (packageId: string, newTitle: string): Promise<ContentPackage> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const original = await getContentPackage(packageId);
  if (!original) {
    throw new Error('Paquete no encontrado');
  }
  
  const duplicated: ContentPackage = {
    ...original,
    id: `pkg_${Date.now()}`,
    title: newTitle,
    enrolledClients: 0,
    totalRevenue: 0,
    createdAt: new Date().toISOString(),
    updatedAt: undefined,
    isPublished: false
  };
  
  return duplicated;
};













