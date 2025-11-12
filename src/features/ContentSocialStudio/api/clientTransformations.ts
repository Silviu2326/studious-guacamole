import type {
  ClientProgressMetrics,
  PostTemplate,
  GeneratedTransformationPost,
} from '../types';
import { getClientById } from '../../gestión-de-clientes/api/clients';
import { getClient360 } from '../../cliente-360/api/client360';
import type { BodyMeasurement } from '../../cliente-360/types';

// Plantillas de posts profesionales
export const TRANSFORMATION_TEMPLATES: PostTemplate[] = [
  {
    id: 'template-1',
    name: 'Transformación Inspiradora',
    description: 'Destaca el progreso con un enfoque motivacional',
    format: 'post',
    structure: {
      hook: '¡Increíble transformación!',
      body: '{clientName} ha logrado {achievement} en {timeframe}. De {weightBefore}kg a {weightAfter}kg, perdiendo {weightLoss}kg. {measurements}',
      cta: '¿Listo para tu transformación? Agenda tu consulta gratuita',
    },
  },
  {
    id: 'template-2',
    name: 'Logro Destacado',
    description: 'Enfoque en logros específicos y métricas',
    format: 'carousel',
    structure: {
      hook: 'Resultados reales, trabajo real',
      body: 'Conoce la historia de {clientName}: {achievement}. {progressDetails}',
      cta: 'Descubre cómo podemos ayudarte a alcanzar tus objetivos',
    },
  },
  {
    id: 'template-3',
    name: 'Antes y Después',
    description: 'Formato visual con fotos de progreso',
    format: 'reel',
    structure: {
      hook: 'La transformación de {clientName}',
      body: '{timeframe} de dedicación y resultados: {achievement}. {keyMetrics}',
      cta: 'Comienza tu propio viaje hoy',
    },
  },
];

// Obtener métricas de progreso de un cliente
export const getClientProgressMetrics = async (
  clientId: string
): Promise<ClientProgressMetrics | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const client = await getClientById(clientId);
  if (!client) return null;

  const client360 = await getClient360(clientId);
  if (!client360) return null;

  // Obtener mediciones más recientes
  const measurements = client360.measurements || [];
  const latestMeasurement = measurements[0];
  const previousMeasurement = measurements[1];

  // Calcular cambios
  const weight = latestMeasurement?.weightKg
    ? {
        current: latestMeasurement.weightKg,
        previous: previousMeasurement?.weightKg || latestMeasurement.weightKg,
        change: latestMeasurement.weightKg - (previousMeasurement?.weightKg || latestMeasurement.weightKg),
        unit: 'kg' as const,
      }
    : undefined;

  const measurementsData = latestMeasurement
    ? {
        chest: latestMeasurement.chest && previousMeasurement?.chest
          ? {
              current: latestMeasurement.chest,
              previous: previousMeasurement.chest,
              change: latestMeasurement.chest - previousMeasurement.chest,
            }
          : undefined,
        waist: latestMeasurement.waist && previousMeasurement?.waist
          ? {
              current: latestMeasurement.waist,
              previous: previousMeasurement.waist,
              change: latestMeasurement.waist - previousMeasurement.waist,
            }
          : undefined,
        hips: latestMeasurement.hips && previousMeasurement?.hips
          ? {
              current: latestMeasurement.hips,
              previous: previousMeasurement.hips,
              change: latestMeasurement.hips - previousMeasurement.hips,
            }
          : undefined,
        arms: latestMeasurement.arms && previousMeasurement?.arms
          ? {
              current: latestMeasurement.arms,
              previous: previousMeasurement.arms,
              change: latestMeasurement.arms - previousMeasurement.arms,
            }
          : undefined,
        legs: latestMeasurement.legs && previousMeasurement?.legs
          ? {
              current: latestMeasurement.legs,
              previous: previousMeasurement.legs,
              change: latestMeasurement.legs - previousMeasurement.legs,
            }
          : undefined,
      }
    : undefined;

  // Determinar logros
  const achievements: string[] = [];
  if (weight && weight.change < 0) {
    achievements.push(`Pérdida de ${Math.abs(weight.change).toFixed(1)}kg`);
  }
  if (measurementsData?.waist && measurementsData.waist.change < 0) {
    achievements.push(`Reducción de ${Math.abs(measurementsData.waist.change)}cm en cintura`);
  }

  return {
    clientId: client.id,
    clientName: client.name,
    weight,
    measurements: measurementsData,
    photos: {
      hasPermission: false, // Por defecto, no hay permiso
    },
    achievements,
    startDate: client.registrationDate || new Date().toISOString(),
    currentDate: new Date().toISOString(),
  };
};

// Obtener todos los clientes con métricas disponibles
export const getClientsWithProgress = async (): Promise<ClientProgressMetrics[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // En producción, esto obtendría todos los clientes activos
  const clientIds = ['client_1', 'cli_12345'];
  const clients: ClientProgressMetrics[] = [];

  for (const clientId of clientIds) {
    const metrics = await getClientProgressMetrics(clientId);
    if (metrics) {
      clients.push(metrics);
    }
  }

  return clients;
};

// Generar post de transformación
export const generateTransformationPost = async (
  clientId: string,
  templateId: string
): Promise<GeneratedTransformationPost> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const metrics = await getClientProgressMetrics(clientId);
  if (!metrics) {
    throw new Error('Cliente no encontrado');
  }

  const template = TRANSFORMATION_TEMPLATES.find((t) => t.id === templateId);
  if (!template) {
    throw new Error('Plantilla no encontrada');
  }

  // Generar contenido basado en la plantilla
  const timeframe = Math.floor(
    (new Date(metrics.currentDate).getTime() - new Date(metrics.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const daysText = timeframe < 30 ? `${timeframe} días` : `${Math.floor(timeframe / 30)} meses`;

  let body = template.structure.body
    .replace('{clientName}', metrics.clientName)
    .replace('{timeframe}', daysText)
    .replace('{achievement}', metrics.achievements?.[0] || 'progreso significativo');

  if (metrics.weight) {
    body = body
      .replace('{weightBefore}', metrics.weight.previous.toFixed(1))
      .replace('{weightAfter}', metrics.weight.current.toFixed(1))
      .replace('{weightLoss}', Math.abs(metrics.weight.change).toFixed(1));
  }

  if (metrics.measurements) {
    const measurementsText = Object.entries(metrics.measurements)
      .filter(([_, value]) => value && value.change !== 0)
      .map(([key, value]) => {
        const changeText = value!.change > 0 ? `+${value!.change}` : `${value!.change}`;
        return `${key}: ${changeText}cm`;
      })
      .join(', ');
    body = body.replace('{measurements}', measurementsText || 'progreso constante');
  }

  const progressDetails = metrics.achievements?.join(', ') || 'progreso constante';
  body = body.replace('{progressDetails}', progressDetails);

  const keyMetrics = metrics.weight
    ? `Peso: ${metrics.weight.current.toFixed(1)}kg (${metrics.weight.change > 0 ? '+' : ''}${metrics.weight.change.toFixed(1)}kg)`
    : 'Progreso constante';
  body = body.replace('{keyMetrics}', keyMetrics);

  const caption = `${template.structure.hook}\n\n${body}\n\n${template.structure.cta}`;

  const hashtags = [
    '#transformacion',
    '#fitness',
    '#entrenamientopersonal',
    '#resultadosreales',
    '#motivacion',
    '#salud',
    '#bienestar',
  ];

  return {
    id: `post_${Date.now()}`,
    clientId: metrics.clientId,
    clientName: metrics.clientName,
    template,
    content: {
      caption,
      hashtags,
      mediaUrls: metrics.photos?.hasPermission && metrics.photos.after ? [metrics.photos.after] : undefined,
    },
    permissionStatus: 'not_requested',
    createdAt: new Date().toISOString(),
  };
};

// Solicitar permiso al cliente
export const requestClientPermission = async (
  clientId: string,
  postId: string
): Promise<{ success: boolean; permissionStatus: 'pending' | 'granted' | 'denied' }> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // En producción, esto enviaría un mensaje al cliente
  // Por ahora, simulamos que se envía la solicitud
  return {
    success: true,
    permissionStatus: 'pending',
  };
};

