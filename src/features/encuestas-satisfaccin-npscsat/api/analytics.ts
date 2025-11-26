import { SatisfactionMetrics, ComparisonReport, SurveyArea } from '../types';
import { getResponses, getNPSResponses, getCSATResponses } from './responses';

const calculateNPS = (scores: number[]): { score: number; promotors: number; neutrals: number; detractors: number } => {
  const promotors = scores.filter((s) => s >= 9).length;
  const detractors = scores.filter((s) => s <= 6).length;
  const neutrals = scores.length - promotors - detractors;
  const npsScore = ((promotors - detractors) / scores.length) * 100;
  return {
    score: Math.round(npsScore),
    promotors,
    neutrals,
    detractors,
  };
};

const calculateCSAT = (scores: number[]): { average: number; distribution: Record<number, number> } => {
  const total = scores.length;
  const sum = scores.reduce((acc, s) => acc + s, 0);
  const average = total > 0 ? sum / total : 0;
  
  const distribution: Record<number, number> = {};
  scores.forEach((s) => {
    distribution[s] = (distribution[s] || 0) + 1;
  });
  
  return {
    average: Math.round(average * 10) / 10,
    distribution,
  };
};

export const getAnalytics = async (): Promise<SatisfactionMetrics> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const npsResponses = await getNPSResponses();
  const csatResponses = await getCSATResponses();
  const allResponses = await getResponses();
  
  const npsScores = npsResponses.map((r) => r.score);
  const nps = calculateNPS(npsScores);
  
  const csatScores = csatResponses.map((r) => r.score);
  const csat = calculateCSAT(csatScores);
  
  // Calcular por área
  const byArea: Record<SurveyArea, { nps?: number; csat?: number; total: number }> = {
    servicio_general: { total: 0 },
    clases: { total: 0 },
    instalaciones: { total: 0 },
    atencion_recepcion: { total: 0 },
    equipamiento: { total: 0 },
  };
  
  const areaResponses: Record<SurveyArea, number[]> = {
    servicio_general: [],
    clases: [],
    instalaciones: [],
    atencion_recepcion: [],
    equipamiento: [],
  };
  
  allResponses.forEach((r) => {
    if (r.area) {
      byArea[r.area].total++;
      areaResponses[r.area].push(r.score);
    }
  });
  
  // Calcular métricas por área
  Object.keys(byArea).forEach((area) => {
    const areaKey = area as SurveyArea;
    const scores = areaResponses[areaKey];
    if (scores.length > 0) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (scores.some((s) => s >= 0 && s <= 10 && scores.length > 5)) {
        // Puede tener NPS
        byArea[areaKey].nps = Math.round((scores.filter((s) => s >= 9).length - scores.filter((s) => s <= 6).length) / scores.length * 100);
      }
      if (scores.some((s) => s >= 1 && s <= 5)) {
        // CSAT
        byArea[areaKey].csat = Math.round(avg * 10) / 10;
      }
    }
  });
  
  // Tendencias (últimos 6 meses)
  const trends = [
    { period: '2024-01', nps: 45, csat: 4.2 },
    { period: '2024-02', nps: 52, csat: 4.3 },
    { period: '2024-03', nps: 48, csat: 4.1 },
    { period: '2024-04', nps: 55, csat: 4.4 },
    { period: '2024-05', nps: 58, csat: 4.5 },
    { period: '2024-06', nps: nps.score, csat: csat.average },
  ];
  
  return {
    nps: {
      ...nps,
      total: npsScores.length,
    },
    csat: {
      ...csat,
      total: csatScores.length,
    },
    byArea,
    trends,
  };
};

export const getComparisonReports = async (
  team?: string,
  department?: string
): Promise<ComparisonReport[]> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  const analytics = await getAnalytics();
  
  return [
    {
      period: '2024-06',
      team,
      department,
      metrics: analytics,
    },
    {
      period: '2024-05',
      metrics: {
        ...analytics,
        nps: { ...analytics.nps, score: 55 },
        csat: { ...analytics.csat, average: 4.4 },
      },
    },
    {
      period: '2024-04',
      metrics: {
        ...analytics,
        nps: { ...analytics.nps, score: 52 },
        csat: { ...analytics.csat, average: 4.3 },
      },
    },
  ];
};

