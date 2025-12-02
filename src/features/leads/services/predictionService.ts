import { Lead, LeadSource, PipelineStage, LeadStatus } from '../types';
import { getLeads } from '../api/leads';

export interface ConversionPrediction {
  leadId: string;
  probability: number; // 0-100%
  confidence: 'low' | 'medium' | 'high';
  factors: PredictionFactor[];
  recommendations: string[];
  lastCalculated: Date;
}

export interface PredictionFactor {
  name: string;
  impact: number; // -100 a +100, impacto en la probabilidad
  description: string;
  currentValue: any;
  optimalValue?: any;
  suggestion?: string;
}

// Modelo de predicción simple basado en regresión logística simplificada
// En producción, esto sería un modelo ML entrenado con datos históricos
class SimplePredictionModel {
  // Pesos del modelo (entrenados con datos históricos simulados)
  private weights = {
    baseScore: 0.25,
    interactions: 0.20,
    recency: 0.15,
    source: 0.15,
    stage: 0.15,
    responseRate: 0.10
  };

  // Calcular probabilidad de conversión
  predict(lead: Lead, historicalData?: { conversionRate: number; averageTimeToConvert: number }): ConversionPrediction {
    const factors: PredictionFactor[] = [];
    let probability = 50; // Base 50%

    // Factor 1: Score actual
    const scoreImpact = (lead.score - 50) * 0.5; // Cada punto de score = 0.5% de probabilidad
    probability += scoreImpact * this.weights.baseScore;
    factors.push({
      name: 'Score Actual',
      impact: scoreImpact,
      description: `Score de ${lead.score} puntos`,
      currentValue: lead.score,
      optimalValue: 75,
      suggestion: lead.score < 50 ? 'Mejora el engagement del lead' : undefined
    });

    // Factor 2: Interacciones
    const interactionCount = lead.interactions.length;
    const interactionImpact = Math.min(interactionCount * 5, 30); // Máximo 30% de impacto
    probability += interactionImpact * this.weights.interactions;
    factors.push({
      name: 'Número de Interacciones',
      impact: interactionImpact,
      description: `${interactionCount} interacciones registradas`,
      currentValue: interactionCount,
      optimalValue: 5,
      suggestion: interactionCount < 3 ? 'Aumenta el contacto con el lead' : undefined
    });

    // Factor 3: Recencia (tiempo desde última interacción)
    const now = new Date();
    const daysSinceCreated = (now.getTime() - lead.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    const daysSinceLastContact = lead.lastContactDate
      ? (now.getTime() - new Date(lead.lastContactDate).getTime()) / (1000 * 60 * 60 * 24)
      : daysSinceCreated;

    let recencyImpact = 0;
    if (daysSinceLastContact <= 1) {
      recencyImpact = 20; // Muy reciente
    } else if (daysSinceLastContact <= 3) {
      recencyImpact = 10;
    } else if (daysSinceLastContact <= 7) {
      recencyImpact = 0;
    } else if (daysSinceLastContact <= 14) {
      recencyImpact = -10;
    } else {
      recencyImpact = -20; // Muy antiguo
    }

    probability += recencyImpact * this.weights.recency;
    factors.push({
      name: 'Recencia de Contacto',
      impact: recencyImpact,
      description: `${Math.floor(daysSinceLastContact)} días desde último contacto`,
      currentValue: Math.floor(daysSinceLastContact),
      optimalValue: '< 3 días',
      suggestion: daysSinceLastContact > 7 ? 'Contacta al lead pronto para mantener el interés' : undefined
    });

    // Factor 4: Origen (fuente)
    const sourceScores: Record<LeadSource, number> = {
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
      campaña_pagada: 7,
      otro: 3
    };
    const sourceImpact = sourceScores[lead.source] || 0;
    probability += sourceImpact * this.weights.source;
    factors.push({
      name: 'Origen del Lead',
      impact: sourceImpact,
      description: `Fuente: ${lead.source}`,
      currentValue: lead.source,
      optimalValue: 'referido',
      suggestion: sourceImpact < 5 ? 'Considera enfocarte en fuentes de mayor calidad' : undefined
    });

    // Factor 5: Etapa del pipeline
    const stageScores: Record<PipelineStage, number> = {
      captacion: -10,
      interes: 0,
      calificacion: 10,
      oportunidad: 20,
      cierre: 30
    };
    const stageImpact = stageScores[lead.stage] || 0;
    probability += stageImpact * this.weights.stage;
    factors.push({
      name: 'Etapa del Pipeline',
      impact: stageImpact,
      description: `Etapa: ${lead.stage}`,
      currentValue: lead.stage,
      optimalValue: 'oportunidad',
      suggestion: lead.stage === 'captacion' ? 'Avanza el lead a etapas más avanzadas' : undefined
    });

    // Factor 6: Tasa de respuesta
    const positiveInteractions = lead.interactions.filter(i => i.outcome === 'positive').length;
    const responseRate = lead.interactions.length > 0
      ? (positiveInteractions / lead.interactions.length) * 100
      : 0;
    const responseImpact = (responseRate - 50) * 0.3; // Cada % de respuesta positiva = 0.3% de probabilidad
    probability += responseImpact * this.weights.responseRate;
    factors.push({
      name: 'Tasa de Respuesta Positiva',
      impact: responseImpact,
      description: `${responseRate.toFixed(0)}% de interacciones positivas`,
      currentValue: responseRate,
      optimalValue: 70,
      suggestion: responseRate < 50 ? 'Mejora la calidad de las interacciones' : undefined
    });

    // Factor 7: Estado del lead
    const statusImpact = lead.status === 'converted' ? 100 :
                         lead.status === 'negotiation' ? 30 :
                         lead.status === 'meeting_scheduled' ? 20 :
                         lead.status === 'qualified' ? 15 :
                         lead.status === 'contacted' ? 5 : 0;
    probability += statusImpact * 0.1; // Peso menor porque ya está reflejado en stage
    factors.push({
      name: 'Estado Actual',
      impact: statusImpact,
      description: `Estado: ${lead.status}`,
      currentValue: lead.status,
      optimalValue: 'negotiation'
    });

    // Factor 8: Tiempo desde creación (leads frescos tienen más probabilidad)
    const freshnessImpact = daysSinceCreated <= 7 ? 10 :
                            daysSinceCreated <= 14 ? 5 :
                            daysSinceCreated <= 30 ? 0 :
                            daysSinceCreated <= 60 ? -5 : -10;
    probability += freshnessImpact * 0.05;
    factors.push({
      name: 'Antigüedad del Lead',
      impact: freshnessImpact,
      description: `${Math.floor(daysSinceCreated)} días desde creación`,
      currentValue: Math.floor(daysSinceCreated),
      optimalValue: '< 7 días',
      suggestion: daysSinceCreated > 30 ? 'Lead antiguo, considera reactivación' : undefined
    });

    // Normalizar probabilidad entre 0 y 100
    probability = Math.max(0, Math.min(100, probability));

    // Calcular confianza basada en cantidad de datos
    let confidence: 'low' | 'medium' | 'high' = 'low';
    if (lead.interactions.length >= 3 && daysSinceCreated >= 7) {
      confidence = 'high';
    } else if (lead.interactions.length >= 1 || daysSinceCreated >= 3) {
      confidence = 'medium';
    }

    // Generar recomendaciones
    const recommendations: string[] = [];
    
    if (probability < 30) {
      recommendations.push('Lead de baja probabilidad. Considera nurturing o pausar esfuerzos.');
    } else if (probability < 50) {
      recommendations.push('Aumenta el contacto y engagement para mejorar probabilidad.');
      if (daysSinceLastContact > 7) {
        recommendations.push('Contacta urgentemente - han pasado más de 7 días.');
      }
    } else if (probability < 70) {
      recommendations.push('Lead prometedor. Mantén contacto regular y avanza en el pipeline.');
      if (lead.stage === 'captacion' || lead.stage === 'interes') {
        recommendations.push('Avanza el lead a etapa de calificación u oportunidad.');
      }
    } else {
      recommendations.push('Lead de alta probabilidad. Prioriza este lead para cierre rápido.');
      if (lead.stage !== 'cierre') {
        recommendations.push('Considera enviar propuesta o agendar reunión de cierre.');
      }
    }

    // Recomendaciones específicas basadas en factores
    factors.forEach(factor => {
      if (factor.suggestion && factor.impact < 0) {
        recommendations.push(factor.suggestion);
      }
    });

    // Eliminar duplicados
    const uniqueRecommendations = Array.from(new Set(recommendations));

    return {
      leadId: lead.id,
      probability: Math.round(probability * 10) / 10,
      confidence,
      factors: factors.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact)), // Ordenar por impacto absoluto
      recommendations: uniqueRecommendations.slice(0, 5), // Máximo 5 recomendaciones
      lastCalculated: new Date()
    };
  }

  // Entrenar modelo con datos históricos (simulado)
  train(historicalLeads: Lead[]): void {
    // En producción, esto entrenaría un modelo ML real
    // Por ahora, ajustamos pesos basados en datos históricos
    const convertedLeads = historicalLeads.filter(l => l.status === 'converted');
    const totalLeads = historicalLeads.length;

    if (totalLeads > 0) {
      const conversionRate = (convertedLeads.length / totalLeads) * 100;
      
      // Ajustar pesos si la tasa de conversión es muy baja o alta
      if (conversionRate < 10) {
        // Reducir peso de factores menos importantes
        this.weights.baseScore *= 1.1;
        this.weights.interactions *= 1.1;
      }
    }
  }
}

// Instancia del modelo
const predictionModel = new SimplePredictionModel();

// Datos históricos para entrenamiento (simulado)
let historicalData: { conversionRate: number; averageTimeToConvert: number } | null = null;

const calculateHistoricalData = async (businessType: 'entrenador' | 'gimnasio'): Promise<void> => {
  const leads = await getLeads({ businessType });
  const convertedLeads = leads.filter(l => l.status === 'converted' && l.conversionDate);
  
  const conversionRate = leads.length > 0 ? (convertedLeads.length / leads.length) * 100 : 0;
  
  let averageTimeToConvert = 0;
  if (convertedLeads.length > 0) {
    const totalDays = convertedLeads.reduce((sum, lead) => {
      if (lead.conversionDate) {
        const days = (lead.conversionDate.getTime() - lead.createdAt.getTime()) / (1000 * 60 * 60 * 24);
        return sum + days;
      }
      return sum;
    }, 0);
    averageTimeToConvert = totalDays / convertedLeads.length;
  }

  historicalData = {
    conversionRate,
    averageTimeToConvert
  };

  // Entrenar modelo con datos históricos
  predictionModel.train(leads);
};

export class PredictionService {
  // Obtener predicción para un lead
  static async getPrediction(leadId: string): Promise<ConversionPrediction> {
    const { getLead } = await import('../api/leads');
    const lead = await getLead(leadId);
    
    if (!lead) {
      throw new Error('Lead not found');
    }

    if (!historicalData) {
      await calculateHistoricalData(lead.businessType);
    }

    return predictionModel.predict(lead, historicalData || undefined);
  }

  // Obtener predicciones para múltiples leads
  static async getPredictions(
    leads: Lead[],
    businessType?: 'entrenador' | 'gimnasio'
  ): Promise<Map<string, ConversionPrediction>> {
    if (!historicalData && businessType) {
      await calculateHistoricalData(businessType);
    }

    const predictions = new Map<string, ConversionPrediction>();
    
    for (const lead of leads) {
      const prediction = predictionModel.predict(lead, historicalData || undefined);
      predictions.set(lead.id, prediction);
    }

    return predictions;
  }

  // Filtrar leads por probabilidad de conversión
  static async filterByProbability(
    leads: Lead[],
    minProbability: number,
    maxProbability?: number
  ): Promise<Lead[]> {
    const predictions = await this.getPredictions(leads);
    const filtered: Lead[] = [];

    for (const lead of leads) {
      const prediction = predictions.get(lead.id);
      if (prediction) {
        if (prediction.probability >= minProbability) {
          if (maxProbability === undefined || prediction.probability <= maxProbability) {
            filtered.push(lead);
          }
        }
      }
    }

    return filtered.sort((a, b) => {
      const predA = predictions.get(a.id);
      const predB = predictions.get(b.id);
      return (predB?.probability || 0) - (predA?.probability || 0);
    });
  }

  // Obtener leads con mayor probabilidad de conversión
  static async getTopProbableLeads(
    businessType: 'entrenador' | 'gimnasio',
    limit: number = 10
  ): Promise<Array<Lead & { prediction: ConversionPrediction }>> {
    const leads = await getLeads({ businessType });
    const activeLeads = leads.filter(l => l.status !== 'converted' && l.status !== 'lost');
    
    const predictions = await this.getPredictions(activeLeads, businessType);
    
    const leadsWithPredictions = activeLeads.map(lead => ({
      ...lead,
      prediction: predictions.get(lead.id)!
    }));

    return leadsWithPredictions
      .sort((a, b) => b.prediction.probability - a.prediction.probability)
      .slice(0, limit);
  }

  // Recalcular todas las predicciones (para actualización automática)
  static async recalculateAllPredictions(
    businessType: 'entrenador' | 'gimnasio'
  ): Promise<void> {
    await calculateHistoricalData(businessType);
    // En producción, esto actualizaría las predicciones en la base de datos
    console.log(`[PredictionService] Predicciones recalculadas para ${businessType}`);
  }

  // Obtener factores más influyentes (análisis general)
  static async getMostInfluentialFactors(
    businessType: 'entrenador' | 'gimnasio'
  ): Promise<Array<{ factor: string; averageImpact: number; frequency: number }>> {
    const leads = await getLeads({ businessType });
    const predictions = await this.getPredictions(leads, businessType);

    const factorMap = new Map<string, { totalImpact: number; count: number }>();

    predictions.forEach(prediction => {
      prediction.factors.forEach(factor => {
        const existing = factorMap.get(factor.name) || { totalImpact: 0, count: 0 };
        factorMap.set(factor.name, {
          totalImpact: existing.totalImpact + Math.abs(factor.impact),
          count: existing.count + 1
        });
      });
    });

    return Array.from(factorMap.entries())
      .map(([factor, data]) => ({
        factor,
        averageImpact: data.totalImpact / data.count,
        frequency: data.count
      }))
      .sort((a, b) => b.averageImpact - a.averageImpact);
  }
}

