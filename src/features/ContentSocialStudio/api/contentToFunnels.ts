import { fetchAcquisitionTopFunnels } from '../../FunnelsAdquisicion/api/funnelsAdquisicion';
import type { FunnelsAcquisitionPeriod } from '../../FunnelsAdquisicion/types';
import { FunnelsAdquisicionService } from '../../FunnelsAdquisicion/services/funnelsAdquisicionService';
import type {
  ActiveFunnel,
  ContentToFunnelLinkRequest,
  ContentToFunnelLinkResponse,
  ApprovedContent,
} from '../types';

// Simular latencia de red
const simulateLatency = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 300 + Math.random() * 200);
  });
};

// Obtener funnels activos
export async function getActiveFunnels(): Promise<ActiveFunnel[]> {
  // Obtener funnels desde el módulo de FunnelsAdquisicion
  const period: FunnelsAcquisitionPeriod = '30d';
  const funnels = await fetchAcquisitionTopFunnels(period);

  // Transformar a ActiveFunnel
  const activeFunnels: ActiveFunnel[] = funnels
    .filter((funnel) => funnel.stage) // Solo funnels con stage definido
    .map((funnel) => ({
      id: funnel.id,
      name: funnel.name,
      description: `Funnel ${funnel.stage} con ${funnel.qualifiedLeads} leads calificados`,
      status: 'active' as const,
      stage: funnel.stage as 'TOFU' | 'MOFU' | 'BOFU',
      revenue: funnel.revenue,
      conversionRate: funnel.conversionRate,
      stages: [
        { id: 'stage-1', name: 'Landing Page', type: 'Captación' },
        { id: 'stage-2', name: 'Email Sequence', type: 'Nurturing' },
        { id: 'stage-3', name: 'WhatsApp Follow-up', type: 'Nurturing' },
      ],
    }));

  return simulateLatency(activeFunnels);
}

// Vincular contenido a funnels activos
export async function linkContentToFunnel(
  request: ContentToFunnelLinkRequest,
): Promise<ContentToFunnelLinkResponse> {
  // Usar el servicio existente de FunnelsAdquisicion para conectar contenido
  // Primero necesitamos determinar el tipo de contenido
  const linkedContent: ContentToFunnelLinkResponse['linkedContent'] = [];

  // Para cada contenido, crear la conexión
  for (const contentId of request.contentIds) {
    // Determinar el tipo de contenido basado en el ID o datos
    // Por ahora, asumimos que es un reel o testimonial
    const contentType = 'reel'; // En producción, esto se determinaría dinámicamente

    try {
      // Usar la función existente connectContentToFunnel
      const connectionRequest = {
        funnelId: request.funnelId,
        stageId: request.stageId,
        contentType: contentType as 'reel' | 'testimonial',
        contentIds: [contentId],
        placement: request.placement === 'nurture-email' || request.placement === 'nurture-whatsapp'
          ? 'social_proof'
          : request.placement === 'landing-page'
          ? 'hero'
          : request.placement === 'thank-you-page'
          ? 'cta'
          : 'features',
        autoSelect: false,
      };

      const result = await FunnelsAdquisicionService.connectContentToFunnel(connectionRequest);

      if (result.success && result.connections.length > 0) {
        const connection = result.connections[0];
        linkedContent.push({
          contentId,
          funnelId: request.funnelId,
          stageId: request.stageId,
          placement: request.placement,
          adaptedContent: request.autoAdapt
            ? {
                text: 'content' in connection.contentData ? (connection.contentData as any).caption || '' : '',
                mediaUrls: 'mediaUrl' in connection.contentData ? [(connection.contentData as any).mediaUrl] : undefined,
              }
            : undefined,
        });
      }
    } catch (error) {
      console.error(`Error linking content ${contentId} to funnel:`, error);
    }
  }

  const response: ContentToFunnelLinkResponse = {
    success: linkedContent.length > 0,
    message:
      linkedContent.length > 0
        ? `${linkedContent.length} contenido(s) vinculado(s) exitosamente al funnel`
        : 'No se pudo vincular el contenido al funnel',
    linkedContent,
    warnings:
      linkedContent.length < request.contentIds.length
        ? ['Algunos contenidos no se pudieron vincular']
        : undefined,
  };

  return simulateLatency(response);
}

// Obtener contenido clave recomendado para funnels
export async function getKeyContentForFunnels(): Promise<ApprovedContent[]> {
  // Obtener contenido aprobado con mejor rendimiento que sea adecuado para funnels
  const { getApprovedContent } = await import('./contentToCampaigns');
  const allContent = await getApprovedContent();

  // Filtrar y ordenar por rendimiento
  const keyContent = allContent
    .filter((content) => {
      // Priorizar contenido con buen rendimiento o contenido educativo/motivacional
      return (
        (content.performance && content.performance.engagementRate && content.performance.engagementRate > 10) ||
        content.tags?.some((tag) => ['educativo', 'motivacion', 'testimonial', 'resultados'].includes(tag))
      );
    })
    .sort((a, b) => {
      const scoreA = a.performance?.engagementRate || 0;
      const scoreB = b.performance?.engagementRate || 0;
      return scoreB - scoreA;
    })
    .slice(0, 10); // Top 10

  return simulateLatency(keyContent);
}

