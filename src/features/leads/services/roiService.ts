import { LeadSource, Lead, CampaignCost, ROIMetrics, ROITrend, ROIAlert } from '../types';
import { getLeads } from '../api/leads';

// Re-exportar tipos para compatibilidad
export type { CampaignCost, ROIMetrics, ROITrend, ROIAlert };

// Mock data storage
let mockCampaignCosts: CampaignCost[] = [];
let revenuePerLead: Map<LeadSource, number> = new Map(); // Ingresos promedio por lead convertido

// Inicializar datos de ejemplo
const initializeMockData = () => {
  if (mockCampaignCosts.length > 0) return;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  // Ingresos promedio por fuente (simulado)
  revenuePerLead.set('google_ads', 120);
  revenuePerLead.set('instagram', 80);
  revenuePerLead.set('facebook', 75);
  revenuePerLead.set('referido', 100);
  revenuePerLead.set('landing_page', 90);
  revenuePerLead.set('whatsapp', 85);
  revenuePerLead.set('tiktok', 70);
  revenuePerLead.set('evento', 95);
  revenuePerLead.set('visita_centro', 110);

  mockCampaignCosts = [
    {
      id: 'cost1',
      source: 'google_ads',
      campaignName: 'Campaña Google Ads - Enero 2024',
      period: {
        start: monthStart,
        end: now
      },
      cost: 500,
      currency: 'EUR',
      businessType: 'gimnasio',
      notes: 'Campaña de búsqueda y display',
      createdAt: monthStart,
      updatedAt: now,
      createdBy: '2'
    },
    {
      id: 'cost2',
      source: 'instagram',
      campaignName: 'Instagram Ads - Enero 2024',
      period: {
        start: monthStart,
        end: now
      },
      cost: 300,
      currency: 'EUR',
      businessType: 'gimnasio',
      notes: 'Campaña de stories y feed',
      createdAt: monthStart,
      updatedAt: now,
      createdBy: '2'
    },
    {
      id: 'cost3',
      source: 'facebook',
      campaignName: 'Facebook Ads - Enero 2024',
      period: {
        start: monthStart,
        end: now
      },
      cost: 250,
      currency: 'EUR',
      businessType: 'gimnasio',
      notes: 'Campaña de engagement',
      createdAt: monthStart,
      updatedAt: now,
      createdBy: '2'
    },
    {
      id: 'cost4',
      source: 'google_ads',
      campaignName: 'Campaña Google Ads - Diciembre 2023',
      period: {
        start: lastMonthStart,
        end: lastMonthEnd
      },
      cost: 450,
      currency: 'EUR',
      businessType: 'gimnasio',
      notes: 'Campaña mensual',
      createdAt: lastMonthStart,
      updatedAt: lastMonthEnd,
      createdBy: '2'
    },
    {
      id: 'cost5',
      source: 'instagram',
      campaignName: 'Instagram Ads - Diciembre 2023',
      period: {
        start: lastMonthStart,
        end: lastMonthEnd
      },
      cost: 280,
      currency: 'EUR',
      businessType: 'gimnasio',
      createdAt: lastMonthStart,
      updatedAt: lastMonthEnd,
      createdBy: '2'
    }
  ];
};

// Calcular ingresos totales de leads convertidos
const calculateRevenue = (leads: Lead[], source: LeadSource): number => {
  const convertedLeads = leads.filter(l => l.source === source && l.status === 'converted');
  const avgRevenue = revenuePerLead.get(source) || 0;
  return convertedLeads.length * avgRevenue;
};

export class ROIService {
  // Obtener todos los costos de campañas
  static async getCampaignCosts(filters?: {
    source?: LeadSource;
    businessType?: 'entrenador' | 'gimnasio';
    period?: { start: Date; end: Date };
  }): Promise<CampaignCost[]> {
    initializeMockData();
    let costs = [...mockCampaignCosts];

    if (filters) {
      if (filters.source) {
        costs = costs.filter(c => c.source === filters.source);
      }
      if (filters.businessType) {
        costs = costs.filter(c => c.businessType === filters.businessType);
      }
      if (filters.period) {
        costs = costs.filter(c => {
          return (
            c.period.start >= filters.period!.start &&
            c.period.end <= filters.period!.end
          );
        });
      }
    }

    return costs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Obtener un costo por ID
  static async getCampaignCost(id: string): Promise<CampaignCost | null> {
    initializeMockData();
    return mockCampaignCosts.find(c => c.id === id) || null;
  }

  // Crear nuevo costo de campaña
  static async createCampaignCost(
    cost: Omit<CampaignCost, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<CampaignCost> {
    initializeMockData();

    const newCost: CampaignCost = {
      ...cost,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockCampaignCosts.push(newCost);
    return newCost;
  }

  // Actualizar costo de campaña
  static async updateCampaignCost(
    id: string,
    updates: Partial<CampaignCost>
  ): Promise<CampaignCost> {
    initializeMockData();
    const index = mockCampaignCosts.findIndex(c => c.id === id);

    if (index === -1) {
      throw new Error('Campaign cost not found');
    }

    mockCampaignCosts[index] = {
      ...mockCampaignCosts[index],
      ...updates,
      updatedAt: new Date()
    };

    return mockCampaignCosts[index];
  }

  // Eliminar costo de campaña
  static async deleteCampaignCost(id: string): Promise<void> {
    initializeMockData();
    const index = mockCampaignCosts.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCampaignCosts.splice(index, 1);
    }
  }

  // Calcular ROI por fuente
  static async calculateROIBySource(
    businessType: 'entrenador' | 'gimnasio',
    period?: { start: Date; end: Date }
  ): Promise<ROIMetrics[]> {
    initializeMockData();
    const leads = await getLeads({ businessType });
    const costs = await this.getCampaignCosts({ businessType, period });

    // Agrupar costos por fuente
    const costsBySource = new Map<LeadSource, number>();
    costs.forEach(cost => {
      const existing = costsBySource.get(cost.source) || 0;
      costsBySource.set(cost.source, existing + cost.cost);
    });

    // Calcular métricas por fuente
    const metrics: ROIMetrics[] = [];
    const sources = Array.from(new Set(leads.map(l => l.source)));

    for (const source of sources) {
      const sourceLeads = leads.filter(l => {
        if (l.source !== source) return false;
        if (period) {
          return l.createdAt >= period.start && l.createdAt <= period.end;
        }
        return true;
      });

      const convertedLeads = sourceLeads.filter(l => l.status === 'converted');
      const totalCost = costsBySource.get(source) || 0;
      const totalLeads = sourceLeads.length;
      const convertedCount = convertedLeads.length;
      const conversionRate = totalLeads > 0 ? (convertedCount / totalLeads) * 100 : 0;
      const costPerLead = totalLeads > 0 ? totalCost / totalLeads : 0;
      const costPerConversion = convertedCount > 0 ? totalCost / convertedCount : 0;
      const revenue = calculateRevenue(sourceLeads, source);
      const roi = totalCost > 0 ? ((revenue - totalCost) / totalCost) * 100 : 0;
      const roiRatio = totalCost > 0 ? revenue / totalCost : 0;

      metrics.push({
        source,
        totalCost,
        totalLeads,
        convertedLeads: convertedCount,
        conversionRate,
        costPerLead,
        costPerConversion,
        totalRevenue: revenue,
        roi,
        roiRatio,
        period: period || {
          start: new Date(0),
          end: new Date()
        }
      });
    }

    return metrics.sort((a, b) => b.roi - a.roi);
  }

  // Obtener tendencias de ROI
  static async getROITrends(
    source: LeadSource,
    businessType: 'entrenador' | 'gimnasio',
    days: number = 30
  ): Promise<ROITrend[]> {
    initializeMockData();
    const leads = await getLeads({ businessType });
    const costs = await this.getCampaignCosts({ source, businessType });

    const trends: ROITrend[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000 - 1);

      const dayLeads = leads.filter(l => {
        return l.source === source &&
               l.createdAt >= dayStart &&
               l.createdAt <= dayEnd;
      });

      const dayCosts = costs.filter(c => {
        return c.period.start <= dayEnd && c.period.end >= dayStart;
      });

      const dayCost = dayCosts.reduce((sum, c) => {
        // Proporcionar costo diario si el período abarca múltiples días
        const daysInPeriod = (c.period.end.getTime() - c.period.start.getTime()) / (1000 * 60 * 60 * 24) + 1;
        return sum + (c.cost / daysInPeriod);
      }, 0);

      const conversions = dayLeads.filter(l => l.status === 'converted').length;
      const revenue = calculateRevenue(dayLeads, source);
      const roi = dayCost > 0 ? ((revenue - dayCost) / dayCost) * 100 : 0;

      trends.push({
        date: dayStart,
        source,
        cost: dayCost,
        leads: dayLeads.length,
        conversions,
        revenue,
        roi
      });
    }

    return trends;
  }

  // Verificar alertas de ROI
  static async checkROIAlerts(
    businessType: 'entrenador' | 'gimnasio',
    thresholds?: {
      minROI?: number; // ROI mínimo aceptable (%)
      maxCostPerLead?: number; // Costo máximo por lead
      minConversionRate?: number; // Tasa de conversión mínima (%)
    }
  ): Promise<ROIAlert[]> {
    const metrics = await this.calculateROIBySource(businessType);
    const alerts: ROIAlert[] = [];

    const defaultThresholds = {
      minROI: thresholds?.minROI || 50, // 50% ROI mínimo
      maxCostPerLead: thresholds?.maxCostPerLead || 20, // 20 EUR máximo por lead
      minConversionRate: thresholds?.minConversionRate || 10 // 10% conversión mínima
    };

    for (const metric of metrics) {
      // Alerta: ROI negativo o muy bajo
      if (metric.roi < defaultThresholds.minROI) {
        alerts.push({
          id: `alert-roi-${metric.source}`,
          source: metric.source,
          type: metric.roi < 0 ? 'negative_roi' : 'low_roi',
          message: `ROI de ${metric.roi.toFixed(1)}% para ${metric.source} está por debajo del umbral (${defaultThresholds.minROI}%)`,
          severity: metric.roi < 0 ? 'critical' : 'warning',
          threshold: defaultThresholds.minROI,
          currentValue: metric.roi,
          createdAt: new Date()
        });
      }

      // Alerta: Costo por lead muy alto
      if (metric.costPerLead > defaultThresholds.maxCostPerLead) {
        alerts.push({
          id: `alert-cpl-${metric.source}`,
          source: metric.source,
          type: 'high_cost_per_lead',
          message: `Costo por lead de ${metric.costPerLead.toFixed(2)} EUR para ${metric.source} excede el umbral (${defaultThresholds.maxCostPerLead} EUR)`,
          severity: 'warning',
          threshold: defaultThresholds.maxCostPerLead,
          currentValue: metric.costPerLead,
          createdAt: new Date()
        });
      }

      // Alerta: Tasa de conversión muy baja
      if (metric.totalLeads > 10 && metric.conversionRate < defaultThresholds.minConversionRate) {
        alerts.push({
          id: `alert-conv-${metric.source}`,
          source: metric.source,
          type: 'low_conversion',
          message: `Tasa de conversión de ${metric.conversionRate.toFixed(1)}% para ${metric.source} está por debajo del umbral (${defaultThresholds.minConversionRate}%)`,
          severity: 'warning',
          threshold: defaultThresholds.minConversionRate,
          currentValue: metric.conversionRate,
          createdAt: new Date()
        });
      }
    }

    return alerts.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  // Obtener resumen de ROI
  static async getROISummary(
    businessType: 'entrenador' | 'gimnasio',
    period?: { start: Date; end: Date }
  ): Promise<{
    totalCost: number;
    totalLeads: number;
    totalConversions: number;
    totalRevenue: number;
    averageROI: number;
    bestSource: LeadSource | null;
    worstSource: LeadSource | null;
  }> {
    const metrics = await this.calculateROIBySource(businessType, period);

    const totalCost = metrics.reduce((sum, m) => sum + m.totalCost, 0);
    const totalLeads = metrics.reduce((sum, m) => sum + m.totalLeads, 0);
    const totalConversions = metrics.reduce((sum, m) => sum + m.convertedLeads, 0);
    const totalRevenue = metrics.reduce((sum, m) => sum + m.totalRevenue, 0);
    const averageROI = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0;

    const bestSource = metrics.length > 0 && metrics[0].roi > 0 ? metrics[0].source : null;
    const worstSource = metrics.length > 0 ? metrics[metrics.length - 1].source : null;

    return {
      totalCost,
      totalLeads,
      totalConversions,
      totalRevenue,
      averageROI,
      bestSource,
      worstSource
    };
  }

  // Actualizar ingresos promedio por fuente
  static setRevenuePerLead(source: LeadSource, revenue: number): void {
    revenuePerLead.set(source, revenue);
  }

  // Obtener ingresos promedio por fuente
  static getRevenuePerLead(source: LeadSource): number {
    return revenuePerLead.get(source) || 0;
  }
}

