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

    // Top performers - calcular basándose en leads reales
    const userMap = new Map<string, { assigned: number; converted: number }>();
    filteredLeads.forEach(lead => {
      if (lead.assignedTo) {
        const current = userMap.get(lead.assignedTo) || { assigned: 0, converted: 0 };
        userMap.set(lead.assignedTo, {
          assigned: current.assigned + 1,
          converted: current.converted + (lead.status === 'converted' ? 1 : 0),
        });
      }
    });

    const topPerformers: TopPerformer[] = Array.from(userMap.entries())
      .map(([userId, data]) => ({
        userId,
        userName: userId === '1' ? 'Entrenador Principal' : userId === '2' ? 'Vendedor 2' : `Usuario ${userId}`,
        leadsAssigned: data.assigned,
        converted: data.converted,
        conversionRate: data.assigned > 0 ? (data.converted / data.assigned) * 100 : 0,
      }))
      .sort((a, b) => b.conversionRate - a.conversionRate)
      .slice(0, 5);

    // Si no hay usuarios asignados, usar datos mock
    if (topPerformers.length === 0) {
      topPerformers.push(
        {
          userId: '1',
          userName: 'Entrenador Principal',
          leadsAssigned: filteredLeads.filter(l => l.assignedTo === '1' || !l.assignedTo).length,
          converted: filteredLeads.filter(l => (l.assignedTo === '1' || !l.assignedTo) && l.status === 'converted').length,
          conversionRate: 0,
        }
      );
      if (topPerformers[0].leadsAssigned > 0) {
        topPerformers[0].conversionRate = (topPerformers[0].converted / topPerformers[0].leadsAssigned) * 100;
      }
    }

    // Trends - calcular basándose en leads reales (últimos 7 días)
    const trends: TrendPoint[] = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);
      
      const dayLeads = filteredLeads.filter(l => {
        const leadDate = new Date(l.createdAt);
        return leadDate >= startOfDay && leadDate <= endOfDay;
      });
      
      const newLeads = dayLeads.filter(l => l.status === 'new' || l.stage === 'captacion').length;
      const convertedLeads = dayLeads.filter(l => l.status === 'converted').length;
      const conversionRate = dayLeads.length > 0 ? (convertedLeads / dayLeads.length) * 100 : 0;
      
      return {
        date,
        newLeads,
        convertedLeads,
        conversionRate: Math.round(conversionRate * 10) / 10, // Redondear a 1 decimal
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

