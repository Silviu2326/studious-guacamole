import { ReferralROIReport, ReferralImpactPeriod, FunnelStage, CustomerSegmentType } from '../types';

const MOCK_REFERRAL_ROI_REPORT: ReferralROIReport = {
  id: 'report_001',
  period: '30d',
  generatedAt: new Date().toISOString(),
  revenueImpact: {
    totalRevenue: 45000,
    referralRevenue: 18000,
    referralRevenuePercentage: 40,
    averageRevenuePerReferral: 1500,
    lifetimeValue: 3200,
    costPerReferral: 150,
    returnOnInvestment: 900, // 900% ROI
    trendDirection: 'up',
    changePercentage: 15,
  },
  funnelMetrics: [
    {
      stage: 'awareness',
      referrals: 45,
      conversions: 38,
      conversionRate: 84.4,
      revenue: 57000,
      averageOrderValue: 1500,
      timeToConvert: 3.5,
      trendDirection: 'up',
      changePercentage: 12,
    },
    {
      stage: 'interest',
      referrals: 38,
      conversions: 28,
      conversionRate: 73.7,
      revenue: 42000,
      averageOrderValue: 1500,
      timeToConvert: 7.2,
      trendDirection: 'up',
      changePercentage: 8,
    },
    {
      stage: 'consideration',
      referrals: 28,
      conversions: 20,
      conversionRate: 71.4,
      revenue: 30000,
      averageOrderValue: 1500,
      timeToConvert: 12.5,
      trendDirection: 'steady',
      changePercentage: 2,
    },
    {
      stage: 'conversion',
      referrals: 20,
      conversions: 18,
      conversionRate: 90,
      revenue: 27000,
      averageOrderValue: 1500,
      timeToConvert: 18.3,
      trendDirection: 'up',
      changePercentage: 15,
    },
    {
      stage: 'retention',
      referrals: 18,
      conversions: 16,
      conversionRate: 88.9,
      revenue: 18000,
      averageOrderValue: 1125,
      timeToConvert: 25.1,
      trendDirection: 'up',
      changePercentage: 10,
    },
  ],
  segmentImpact: [
    {
      segmentType: 'embajador',
      referralsCount: 15,
      conversionsCount: 12,
      conversionRate: 80,
      revenue: 18000,
      averageOrderValue: 1500,
      roi: 1100,
    },
    {
      segmentType: 'vip',
      referralsCount: 12,
      conversionsCount: 10,
      conversionRate: 83.3,
      revenue: 15000,
      averageOrderValue: 1500,
      roi: 950,
    },
    {
      segmentType: 'regular',
      referralsCount: 10,
      conversionsCount: 7,
      conversionRate: 70,
      revenue: 10500,
      averageOrderValue: 1500,
      roi: 650,
    },
    {
      segmentType: 'nuevo',
      referralsCount: 8,
      conversionsCount: 5,
      conversionRate: 62.5,
      revenue: 7500,
      averageOrderValue: 1500,
      roi: 450,
    },
  ],
  aiInsights: {
    keyFindings: [
      'Los referidos generan el 40% de los ingresos totales con un ROI del 900%',
      'Los segmentos Embajador y VIP tienen las mejores tasas de conversión (80% y 83%)',
      'El tiempo promedio de conversión en la etapa de awareness es de 3.5 días',
      'Los referidos tienen un LTV 25% mayor que los clientes adquiridos por otros canales',
    ],
    recommendations: [
      'Incrementar el programa de referidos para segmentos Embajador y VIP',
      'Optimizar el tiempo de respuesta en la etapa de consideration para reducir el tiempo de conversión',
      'Crear incentivos específicos para referidos que generen más conversiones en la etapa de retention',
      'Implementar seguimiento automatizado para referidos en riesgo de no convertir',
    ],
    topPerformingSegments: ['embajador', 'vip'],
    improvementOpportunities: [
      'Mejorar la tasa de conversión en el segmento "nuevo" mediante mejor onboarding',
      'Reducir el tiempo de conversión en la etapa de consideration',
      'Aumentar el LTV de referidos mediante programas de retención específicos',
    ],
    predictedROI: 1050, // ROI proyectado para el próximo periodo
  },
  comparison: {
    revenueChange: 15,
    conversionRateChange: 8,
    roiChange: 12,
    funnelImprovement: [
      'Mejora del 15% en ingresos por referidos',
      'Aumento del 8% en tasa de conversión general',
      'Reducción del 5% en tiempo de conversión promedio',
    ],
  },
};

export const ReferralImpactReportsAPI = {
  async getReferralROIReport(period: ReferralImpactPeriod = '30d'): Promise<ReferralROIReport> {
    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    return {
      ...MOCK_REFERRAL_ROI_REPORT,
      period,
      generatedAt: new Date().toISOString(),
    };
  },

  async generateReferralROIReport(period: ReferralImpactPeriod): Promise<ReferralROIReport> {
    // Simular generación de reporte con IA
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    return {
      ...MOCK_REFERRAL_ROI_REPORT,
      period,
      generatedAt: new Date().toISOString(),
    };
  },

  async getFunnelMetricsByStage(stage: FunnelStage, period: ReferralImpactPeriod = '30d') {
    const report = await this.getReferralROIReport(period);
    return report.funnelMetrics.find((m) => m.stage === stage);
  },

  async getSegmentImpact(segmentType: CustomerSegmentType, period: ReferralImpactPeriod = '30d') {
    const report = await this.getReferralROIReport(period);
    return report.segmentImpact.find((s) => s.segmentType === segmentType);
  },
};

