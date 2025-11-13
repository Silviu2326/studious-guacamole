import type {
  ApprovedContent,
  ContentToCampaignsRequest,
  ContentToCampaignsResponse,
} from '../types';

// Simular latencia de red
const simulateLatency = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 300 + Math.random() * 200);
  });
};

// Obtener contenido aprobado disponible para enviar a campañas
export async function getApprovedContent(): Promise<ApprovedContent[]> {
  // En producción, esto obtendría el contenido aprobado desde la base de datos
  const approvedContent: ApprovedContent[] = [
    {
      id: 'content-1',
      title: 'Post: 5 Tips para empezar tu transformación',
      type: 'post',
      content: {
        caption: '¿Listo para transformar tu vida? Aquí tienes 5 tips que te ayudarán a empezar...',
        hashtags: ['fitness', 'transformacion', 'salud'],
      },
      platform: 'instagram',
      status: 'approved',
      approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      approvedBy: 'current-user',
      source: 'planner',
      tags: ['educativo', 'motivacion'],
      performance: {
        engagement: 1250,
        reach: 8500,
        engagementRate: 14.7,
      },
    },
    {
      id: 'content-2',
      title: 'Email: Bienvenida al programa',
      type: 'email',
      content: {
        subject: '¡Bienvenido a tu transformación!',
        body: 'Hola {{nombre}},\n\nEstamos emocionados de tenerte en nuestro programa...',
        htmlContent: '<p>Hola {{nombre}},</p><p>Estamos emocionados de tenerte...</p>',
      },
      status: 'approved',
      approvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      approvedBy: 'current-user',
      source: 'ai-generator',
      tags: ['bienvenida', 'onboarding'],
    },
    {
      id: 'content-3',
      title: 'WhatsApp: Recordatorio de sesión',
      type: 'whatsapp',
      content: {
        text: 'Hola {{nombre}}, te recordamos que tienes una sesión mañana a las {{hora}}. ¿Confirmas asistencia?',
      },
      status: 'approved',
      approvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      approvedBy: 'current-user',
      source: 'ai-generator',
      tags: ['recordatorio', 'sesion'],
    },
    {
      id: 'content-4',
      title: 'Reel: Transformación de cliente',
      type: 'reel',
      content: {
        caption: 'Mira la increíble transformación de {{cliente}} en solo 3 meses...',
        mediaUrls: ['https://example.com/video.mp4'],
        hashtags: ['transformacion', 'resultados', 'motivacion'],
      },
      platform: 'instagram',
      status: 'published',
      approvedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      approvedBy: 'current-user',
      source: 'transformation',
      tags: ['testimonial', 'resultados'],
      performance: {
        engagement: 3200,
        reach: 15000,
        engagementRate: 21.3,
      },
    },
  ];

  return simulateLatency(approvedContent);
}

// Enviar contenido aprobado a Campañas & Automatización
export async function sendContentToCampaigns(
  request: ContentToCampaignsRequest,
): Promise<ContentToCampaignsResponse> {
  // En producción, esto enviaría el contenido al módulo de Campañas & Automatización
  // y crearía los mensajes/plantillas/secuencias correspondientes

  const createdItems: ContentToCampaignsResponse['createdItems'] = [];

  request.contentIds.forEach((contentId) => {
    request.channels.forEach((channel) => {
      createdItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: request.targetType === 'template' ? 'template' : request.targetType === 'sequence' ? 'sequence-step' : 'message',
        channel,
        contentId,
        targetId: request.targetId || `target-${Date.now()}`,
      });
    });
  });

  const response: ContentToCampaignsResponse = {
    success: true,
    message: `${createdItems.length} elemento(s) creado(s) exitosamente en Campañas & Automatización`,
    createdItems,
    warnings: request.adaptContent
      ? ['El contenido ha sido adaptado automáticamente al formato de cada canal']
      : undefined,
  };

  return simulateLatency(response);
}

