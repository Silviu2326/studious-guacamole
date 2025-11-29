import { LeadScoring, Lead, ScoringFactor, ConversionPrediction } from '../types';
import { getLead } from '../api/leads';
import { PredictionService } from './predictionService';

export class ScoringService {
  static async calculateLeadScore(leadId: string, includePrediction: boolean = true): Promise<LeadScoring & { prediction?: ConversionPrediction }> {
    const lead = await getLead(leadId);
    if (!lead) {
      throw new Error('Lead not found');
    }

    // Calcular scores basados en interacciones, tiempo, engagement
    const interactionScore = this.calculateInteractionScore(lead);
    const engagementScore = this.calculateEngagementScore(lead);
    const timeScore = this.calculateTimeScore(lead);
    
    const baseScore = 50;
    let totalScore = baseScore + interactionScore + engagementScore + timeScore;

    // Mejorar score con predicción de conversión si está habilitado
    let prediction: ConversionPrediction | undefined;
    if (includePrediction) {
      try {
        prediction = await PredictionService.getPrediction(leadId);
        // Ajustar score basado en probabilidad de conversión (peso del 20%)
        const predictionAdjustment = (prediction.probability - 50) * 0.2;
        totalScore += predictionAdjustment;
      } catch (error) {
        console.warn('Error obteniendo predicción para score:', error);
      }
    }

    const factors: ScoringFactor[] = [
      {
        factor: 'Interacciones',
        weight: 0.3,
        value: interactionScore,
        description: `Basado en ${lead.interactions.length} interacciones`,
      },
      {
        factor: 'Engagement',
        weight: 0.25,
        value: engagementScore,
        description: 'Basado en respuesta y participación',
      },
      {
        factor: 'Tiempo',
        weight: 0.2,
        value: timeScore,
        description: 'Basado en tiempo desde creación y última interacción',
      },
      {
        factor: 'Origen',
        weight: 0.25,
        value: this.calculateSourceScore(lead.source),
        description: `Score por origen: ${lead.source}`,
      },
    ];

    const result: LeadScoring & { prediction?: ConversionPrediction } = {
      leadId,
      baseScore,
      interactionScore,
      engagementScore,
      timeScore,
      totalScore: Math.min(100, Math.max(0, totalScore)),
      factors,
      lastCalculated: new Date(),
    };

    if (prediction) {
      result.prediction = prediction;
    }

    return result;
  }

  private static calculateInteractionScore(lead: Lead): number {
    let score = 0;
    lead.interactions.forEach(interaction => {
      if (interaction.outcome === 'positive') score += 5;
      else if (interaction.outcome === 'neutral') score += 2;
    });
    return Math.min(25, score);
  }

  private static calculateEngagementScore(lead: Lead): number {
    let score = 0;
    if (lead.interactions.some(i => i.type === 'email_opened')) score += 3;
    if (lead.interactions.some(i => i.type === 'email_clicked')) score += 5;
    if (lead.interactions.some(i => i.type === 'whatsapp_replied')) score += 8;
    if (lead.interactions.some(i => i.type === 'call_received')) score += 10;
    return Math.min(25, score);
  }

  private static calculateTimeScore(lead: Lead): number {
    const daysSinceCreated = Math.floor(
      (new Date().getTime() - lead.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysSinceLastContact = lead.lastContactDate
      ? Math.floor(
          (new Date().getTime() - lead.lastContactDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      : daysSinceCreated;

    // Score positivo si es reciente, negativo si es antiguo
    let score = 10;
    if (daysSinceCreated > 30) score -= 5;
    if (daysSinceLastContact > 14) score -= 5;
    return Math.max(0, score);
  }

  private static calculateSourceScore(source: string): number {
    const sourceScores: Record<string, number> = {
      referido: 15,
      visita_centro: 12,
      landing_page: 8,
      whatsapp: 10,
      instagram: 7,
      facebook: 6,
      tiktok: 5,
      google_ads: 9,
      evento: 8,
      contenido_organico: 4,
      otro: 3,
    };
    return sourceScores[source] || 5;
  }

  static async recalculateAllScores(businessType: 'entrenador' | 'gimnasio'): Promise<void> {
    // En producción, esto recalcularía todos los scores
    // Por ahora es un placeholder
    console.log(`Recalculating scores for ${businessType}`);
  }

  static async getTopScoredLeads(limit: number = 10, businessType?: 'entrenador' | 'gimnasio'): Promise<Lead[]> {
    const { getLeads } = await import('../api/leads');
    const leads = await getLeads(businessType ? { businessType } : undefined);
    return leads
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}

