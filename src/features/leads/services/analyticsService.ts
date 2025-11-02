import { LeadAnalytics, SourceBreakdown, StageBreakdown, StatusBreakdown, FunnelStep, TopPerformer, TrendPoint } from '../types';
import { getLeads } from '../api/leads';

export class AnalyticsService {
  static async getAnalytics(
    businessType: 'entrenador' | 'gimnasio',
    userId?: string,
    period?: { start: Date; end: Date }
  ): Promise<LeadAnalytics> {
    const leads = await getLeads({ businessType });
    
    // Filtrar por usuario si es entrenador
    let filteredLeads = leads;
    if (businessType === 'entrenador' && userId) {
      filteredLeads = leads.filter(l => l.assignedTo === userId);
    }

    // Filtrar por período si se proporciona
    if (period) {
      filteredLeads = filteredLeads.filter(
        l => l.createdAt >= period.start && l.createdAt <= period.end
      );
    }

    const totalLeads = filteredLeads.length;
    const newLeads = filteredLeads.filter(l => l.status === 'new').length;
    const convertedLeads = filteredLeads.filter(l => l.status === 'converted').length;
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
    const averageScore = filteredLeads.reduce((sum, l) => sum + l.score, 0) / totalLeads || 0;

    // Calcular tiempo promedio de conversión
    const convertedLeadsWithDate = filteredLeads.filter(
      l => l.status === 'converted' && l.conversionDate
    );
    const averageTimeToConversion = convertedLeadsWithDate.length > 0
      ? convertedLeadsWithDate.reduce((sum, l) => {
          const days = Math.floor(
            (l.conversionDate!.getTime() - l.createdAt.getTime()) / (1000 * 60 * 60 * 24)
          );
          return sum + days;
        }, 0) / convertedLeadsWithDate.length
      : 0;

    // Breakdown por origen
    const sourceMap = new Map<string, { count: number; converted: number; totalScore: number }>();
    filteredLeads.forEach(lead => {
      const source = lead.source;
      const current = sourceMap.get(source) || { count: 0, converted: 0, totalScore: 0 };
      sourceMap.set(source, {
        count: current.count + 1,
        converted: current.converted + (lead.status === 'converted' ? 1 : 0),
        totalScore: current.totalScore + lead.score,
      });
    });

    const bySource: SourceBreakdown[] = Array.from(sourceMap.entries()).map(([source, data]) => ({
      source: source as any,
      count: data.count,
      converted: data.converted,
      conversionRate: data.count > 0 ? (data.converted / data.count) * 100 : 0,
      averageScore: data.count > 0 ? data.totalScore / data.count : 0,
    }));

    // Breakdown por stage
    const stageMap = new Map<string, { count: number; totalScore: number }>();
    filteredLeads.forEach(lead => {
      const stage = lead.stage;
      const current = stageMap.get(stage) || { count: 0, totalScore: 0 };
      stageMap.set(stage, {
        count: current.count + 1,
        totalScore: current.totalScore + lead.score,
      });
    });

    const byStage: StageBreakdown[] = Array.from(stageMap.entries()).map(([stage, data]) => ({
      stage: stage as any,
      count: data.count,
      averageScore: data.count > 0 ? data.totalScore / data.count : 0,
    }));

    // Breakdown por status
    const statusMap = new Map<string, number>();
    filteredLeads.forEach(lead => {
      const status = lead.status;
      statusMap.set(status, (statusMap.get(status) || 0) + 1);
    });

    const byStatus: StatusBreakdown[] = Array.from(statusMap.entries()).map(([status, count]) => ({
      status: status as any,
      count,
    }));

    // Funnel
    const stages = ['captacion', 'interes', 'calificacion', 'oportunidad', 'cierre'];
    const funnelData = stages.map((stage, index) => {
      const count = filteredLeads.filter(l => l.stage === stage).length;
      const previousCount = index > 0
        ? filteredLeads.filter(l => l.stage === stages[index - 1]).length
        : totalLeads;
      const dropoffRate = previousCount > 0
        ? ((previousCount - count) / previousCount) * 100
        : 0;
      return {
        stage: stage as any,
        count,
        percentage: totalLeads > 0 ? (count / totalLeads) * 100 : 0,
        dropoffRate,
      };
    });

    // Top performers (mock)
    const topPerformers: TopPerformer[] = [
      {
        userId: 'user1',
        userName: 'Vendedor 1',
        leadsAssigned: 15,
        converted: 5,
        conversionRate: 33.3,
      },
      {
        userId: 'user2',
        userName: 'Vendedor 2',
        leadsAssigned: 12,
        converted: 4,
        conversionRate: 33.3,
      },
    ];

    // Trends (mock - últimos 7 días)
    const trends: TrendPoint[] = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date,
        newLeads: Math.floor(Math.random() * 5) + 1,
        convertedLeads: Math.floor(Math.random() * 2),
        conversionRate: Math.random() * 30 + 10,
      };
    });

    return {
      period: period || {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
      overview: {
        totalLeads,
        newLeads,
        convertedLeads,
        conversionRate,
        averageTimeToConversion,
        averageScore,
      },
      bySource,
      byStage,
      byStatus,
      conversionFunnel: funnelData,
      topPerformers,
      trends,
    };
  }
}

