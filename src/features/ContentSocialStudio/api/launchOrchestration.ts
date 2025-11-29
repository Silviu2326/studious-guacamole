import type {
  LaunchOrchestration,
  LaunchPhaseContent,
  FunnelOption,
  CampaignOption,
  LaunchPhase,
} from '../types';
import { getSocialPosts } from '../../PlannerDeRedesSociales/api/social';

// Mock data - En producción, esto vendría de una API real
const mockFunnels: FunnelOption[] = [
  {
    id: 'fun_001',
    name: 'Reto Verano 2024',
    description: 'Funnel de captación para programa de verano',
    status: 'active',
    landingPageUrl: 'https://example.com/reto-verano',
  },
  {
    id: 'fun_002',
    name: 'Programa Hipertrofia',
    description: 'Funnel para programa de ganancia de masa',
    status: 'active',
    landingPageUrl: 'https://example.com/hipertrofia',
  },
  {
    id: 'fun_003',
    name: 'Consulta Gratuita',
    description: 'Funnel de captación con consulta gratuita',
    status: 'draft',
  },
];

const mockCampaigns: CampaignOption[] = [
  {
    id: 'camp_001',
    name: 'Campaña Enero 2024',
    description: 'Campaña promocional de inicio de año',
    status: 'active',
    type: 'promotional',
  },
  {
    id: 'camp_002',
    name: 'Colaboración Influencer FitLife',
    description: 'Campaña con influencer para nuevo programa',
    status: 'active',
    type: 'influencer',
  },
  {
    id: 'camp_003',
    name: 'Programa de Referidos Q1',
    description: 'Campaña de referidos primer trimestre',
    status: 'active',
    type: 'referral',
  },
];

// Obtener funnels disponibles
export const getFunnelOptions = async (): Promise<FunnelOption[]> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockFunnels;
};

// Obtener campañas disponibles
export const getCampaignOptions = async (): Promise<CampaignOption[]> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockCampaigns;
};

// Obtener todos los lanzamientos
export const getLaunchOrchestrations = async (): Promise<LaunchOrchestration[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  
  return [
    {
      id: 'launch_001',
      name: 'Lanzamiento Programa Verano',
      description: 'Lanzamiento completo del programa de verano con todas las fases',
      funnelId: 'fun_001',
      campaignId: 'camp_001',
      startDate: now.toISOString(),
      endDate: twoWeeks.toISOString(),
      phases: {
        teasing: {
          startDate: now.toISOString(),
          endDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          content: [
            {
              id: 'content_001',
              phase: 'teasing',
              title: 'Teaser 1: ¿Listo para el verano?',
              description: 'Primer teaser generando expectativa',
              scheduledDate: now.toISOString().split('T')[0],
              scheduledTime: '09:00',
              platform: 'instagram',
              contentType: 'reel',
              content: {
                caption: '🔥 ¿Listo para transformar tu verano? Algo grande viene... #Verano2024 #Fitness',
                hashtags: ['#Verano2024', '#Fitness', '#Transformacion'],
              },
              status: 'published',
              createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ],
        },
        apertura: {
          startDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          content: [
            {
              id: 'content_002',
              phase: 'apertura',
              title: 'Apertura: Programa Verano Disponible',
              description: 'Anuncio oficial del programa',
              scheduledDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              scheduledTime: '10:00',
              platform: 'instagram',
              contentType: 'carousel',
              content: {
                caption: '🎉 ¡Ya está aquí! El Programa Verano 2024. Descubre cómo transformar tu cuerpo en 12 semanas. Link en bio 👆',
                hashtags: ['#ProgramaVerano', '#Fitness', '#Transformacion'],
              },
              status: 'scheduled',
              createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ],
        },
        cierre: {
          startDate: new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: twoWeeks.toISOString(),
          status: 'pending',
          content: [
            {
              id: 'content_003',
              phase: 'cierre',
              title: 'Cierre: Últimas horas de descuento',
              description: 'Mensaje de urgencia y cierre',
              scheduledDate: new Date(now.getTime() + 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              scheduledTime: '18:00',
              platform: 'instagram',
              contentType: 'post',
              content: {
                caption: '⏰ Últimas horas para unirte al Programa Verano con 20% de descuento. No te lo pierdas. Link en bio 👆',
                hashtags: ['#Oferta', '#ProgramaVerano', '#Fitness'],
              },
              status: 'draft',
              createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ],
        },
      },
      status: 'active',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: now.toISOString(),
    },
  ];
};

// Obtener un lanzamiento específico
export const getLaunchOrchestration = async (id: string): Promise<LaunchOrchestration | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const launches = await getLaunchOrchestrations();
  return launches.find((l) => l.id === id) || null;
};

// Crear un nuevo lanzamiento
export const createLaunchOrchestration = async (
  data: Omit<LaunchOrchestration, 'id' | 'createdAt' | 'updatedAt'>
): Promise<LaunchOrchestration> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const now = new Date();
  return {
    id: `launch_${Date.now()}`,
    ...data,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
};

// Actualizar un lanzamiento
export const updateLaunchOrchestration = async (
  id: string,
  data: Partial<LaunchOrchestration>
): Promise<LaunchOrchestration> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  const existing = await getLaunchOrchestration(id);
  if (!existing) {
    throw new Error('Launch orchestration not found');
  }
  
  return {
    ...existing,
    ...data,
    updatedAt: new Date().toISOString(),
  };
};

// Agregar contenido a una fase
export const addContentToPhase = async (
  launchId: string,
  phase: LaunchPhase,
  content: Omit<LaunchPhaseContent, 'id' | 'createdAt'>
): Promise<LaunchPhaseContent> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  const launch = await getLaunchOrchestration(launchId);
  if (!launch) {
    throw new Error('Launch orchestration not found');
  }
  
  const newContent: LaunchPhaseContent = {
    ...content,
    id: `content_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  
  // En producción, esto actualizaría en el backend
  return newContent;
};

// Programar contenido de una fase
export const schedulePhaseContent = async (
  launchId: string,
  phase: LaunchPhase,
  contentIds: string[]
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  // En producción, esto actualizaría el estado en el backend
};

