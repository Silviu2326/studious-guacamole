import {
  IntelligentSummary,
  ShareableSummaryLink,
  Objective,
  Alert,
  PerformanceData,
} from '../types';
import { getObjectives } from './objectives';
import { getCriticalAlerts } from './alerts';
import { getPerformanceMetrics } from './performance';

const STORAGE_KEY_SUMMARIES = 'intelligent-summaries';
const STORAGE_KEY_SHAREABLE_LINKS = 'shareable-summary-links';

/**
 * User Story 2: Genera un resumen inteligente completo
 */
export const generateIntelligentSummary = async (
  role: 'entrenador' | 'gimnasio',
  period: string,
  config?: {
    includeDetailedMetrics?: boolean;
    includeCharts?: boolean;
    includeActionItems?: boolean;
    audience?: 'management' | 'investors' | 'team' | 'stakeholders';
    language?: 'es' | 'en' | 'ca';
  }
): Promise<IntelligentSummary> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const objectives = await getObjectives({}, role);
  const alerts = await getCriticalAlerts(role);
  const metrics = await getPerformanceMetrics(role, 'mes');

  const now = new Date();
  const language = config?.language || 'es';

  // Calcular métricas clave
  const totalObjectives = objectives.length;
  const achievedObjectives = objectives.filter(o => o.status === 'achieved').length;
  const inProgressObjectives = objectives.filter(o => o.status === 'in_progress').length;
  const atRiskObjectives = objectives.filter(o => o.status === 'at_risk').length;
  const failedObjectives = objectives.filter(o => o.status === 'failed').length;
  const overallProgress = totalObjectives > 0
    ? objectives.reduce((sum, o) => sum + o.progress, 0) / totalObjectives
    : 0;
  const successRate = totalObjectives > 0
    ? (achievedObjectives / totalObjectives) * 100
    : 0;

  // Generar narrativa
  const narrative = generateNarrative(
    objectives,
    achievedObjectives,
    atRiskObjectives,
    overallProgress,
    successRate,
    language
  );

  // Obtener métricas clave
  const keyMetrics = {
    totalObjectives,
    achievedObjectives,
    inProgressObjectives,
    atRiskObjectives,
    failedObjectives,
    overallProgress,
    successRate,
    metrics: metrics.slice(0, 10).map(m => ({
      metricId: m.id,
      metricName: m.name,
      currentValue: m.value,
      targetValue: m.target,
      progress: m.target ? (m.value / m.target) * 100 : 0,
      unit: m.unit,
      trend: m.trend?.direction || 'stable',
      changePercent: m.variation,
    })),
  };

  // Obtener alertas críticas
  const criticalAlerts = alerts
    .filter(a => a.severity === 'high' || a.severity === 'critical')
    .slice(0, 10)
    .map(a => ({
      alertId: a.id,
      title: a.title,
      message: a.message,
      severity: a.severity,
      objectiveId: a.objectiveId,
      actionRequired: a.severity === 'critical' || a.severity === 'high',
      recommendedAction: a.mitigationPlan?.steps?.[0]?.title || 'Revisar objetivo',
    }));

  // Obtener objetivos destacados
  const highlightedObjectives = getHighlightedObjectives(objectives);

  // Crear resumen
  const summary: IntelligentSummary = {
    id: `summary-${Date.now()}`,
    title: language === 'es'
      ? `Resumen Inteligente - ${period}`
      : language === 'en'
      ? `Intelligent Summary - ${period}`
      : `Resum Intel·ligent - ${period}`,
    period,
    generatedAt: now.toISOString(),
    narrative,
    keyMetrics,
    criticalAlerts,
    highlightedObjectives,
    config: {
      includeDetailedMetrics: config?.includeDetailedMetrics ?? true,
      includeCharts: config?.includeCharts ?? true,
      includeActionItems: config?.includeActionItems ?? true,
      audience: config?.audience || 'stakeholders',
      language,
    },
    sharing: {
      shareable: true,
    },
    exportFormats: ['pdf', 'presentation', 'email', 'link'],
  };

  // Guardar resumen
  const saved = localStorage.getItem(STORAGE_KEY_SUMMARIES);
  const summaries: IntelligentSummary[] = saved ? JSON.parse(saved) : [];
  summaries.push(summary);
  localStorage.setItem(STORAGE_KEY_SUMMARIES, JSON.stringify(summaries));

  return summary;
};

/**
 * User Story 2: Obtiene resúmenes generados
 */
export const getIntelligentSummaries = async (): Promise<IntelligentSummary[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const saved = localStorage.getItem(STORAGE_KEY_SUMMARIES);
  return saved ? JSON.parse(saved) : [];
};

/**
 * User Story 2: Obtiene un resumen por ID
 */
export const getIntelligentSummary = async (id: string): Promise<IntelligentSummary | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const summaries = await getIntelligentSummaries();
  return summaries.find(s => s.id === id) || null;
};

/**
 * User Story 2: Crea un enlace compartible para un resumen
 */
export const createShareableLink = async (
  summaryId: string,
  options?: {
    expiresInDays?: number;
    passwordProtected?: boolean;
    password?: string;
  }
): Promise<ShareableSummaryLink> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const token = generateShareToken();
  const now = new Date();
  const expiresAt = options?.expiresInDays
    ? new Date(now.getTime() + options.expiresInDays * 24 * 60 * 60 * 1000)
    : undefined;

  const link: ShareableSummaryLink = {
    token,
    summaryId,
    createdAt: now.toISOString(),
    expiresAt: expiresAt?.toISOString(),
    accessCount: 0,
    passwordProtected: options?.passwordProtected || false,
    passwordHash: options?.password ? hashPassword(options.password) : undefined,
  };

  // Guardar enlace
  const saved = localStorage.getItem(STORAGE_KEY_SHAREABLE_LINKS);
  const links: ShareableSummaryLink[] = saved ? JSON.parse(saved) : [];
  links.push(link);
  localStorage.setItem(STORAGE_KEY_SHAREABLE_LINKS, JSON.stringify(links));

  // Actualizar resumen con token
  const summaries = await getIntelligentSummaries();
  const summary = summaries.find(s => s.id === summaryId);
  if (summary) {
    summary.sharing.shareToken = token;
    summary.sharing.sharedAt = now.toISOString();
    summary.sharing.expiresAt = expiresAt?.toISOString();
    localStorage.setItem(STORAGE_KEY_SUMMARIES, JSON.stringify(summaries));
  }

  return link;
};

/**
 * User Story 2: Obtiene un resumen desde un token compartible
 */
export const getSummaryFromToken = async (
  token: string,
  password?: string
): Promise<IntelligentSummary | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const saved = localStorage.getItem(STORAGE_KEY_SHAREABLE_LINKS);
  const links: ShareableSummaryLink[] = saved ? JSON.parse(saved) : [];

  const link = links.find(l => l.token === token);
  if (!link) {
    return null;
  }

  // Verificar expiración
  if (link.expiresAt) {
    const expiresAt = new Date(link.expiresAt);
    if (expiresAt < new Date()) {
      return null;
    }
  }

  // Verificar contraseña
  if (link.passwordProtected) {
    if (!password || hashPassword(password) !== link.passwordHash) {
      throw new Error('Contraseña incorrecta');
    }
  }

  // Actualizar contador de acceso
  link.accessCount += 1;
  link.lastAccessed = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY_SHAREABLE_LINKS, JSON.stringify(links));

  // Obtener resumen
  return await getIntelligentSummary(link.summaryId);
};

/**
 * User Story 2: Exporta un resumen en formato PDF
 */
export const exportSummaryAsPDF = async (summaryId: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const summary = await getIntelligentSummary(summaryId);
  if (!summary) {
    throw new Error('Resumen no encontrado');
  }

  // Simular generación de PDF
  const filename = `resumen-inteligente-${summary.period}-${Date.now()}.pdf`;
  return filename;
};

/**
 * User Story 2: Exporta un resumen como presentación
 */
export const exportSummaryAsPresentation = async (summaryId: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const summary = await getIntelligentSummary(summaryId);
  if (!summary) {
    throw new Error('Resumen no encontrado');
  }

  // Simular generación de presentación
  const filename = `resumen-inteligente-${summary.period}-${Date.now()}.pptx`;
  return filename;
};

/**
 * User Story 2: Envía un resumen por email
 */
export const sendSummaryByEmail = async (
  summaryId: string,
  recipients: string[]
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const summary = await getIntelligentSummary(summaryId);
  if (!summary) {
    throw new Error('Resumen no encontrado');
  }

  // Simular envío de email
  console.log(`Enviando resumen ${summaryId} a:`, recipients);
};

// Funciones auxiliares

function generateNarrative(
  objectives: Objective[],
  achieved: number,
  atRisk: number,
  overallProgress: number,
  successRate: number,
  language: 'es' | 'en' | 'ca'
): IntelligentSummary['narrative'] {
  const total = objectives.length;

  if (language === 'es') {
    return {
      executiveSummary: `Durante este período, se gestionaron ${total} objetivos. ${achieved} objetivos fueron alcanzados exitosamente, representando una tasa de éxito del ${successRate.toFixed(1)}%. El progreso general es del ${overallProgress.toFixed(1)}%. ${atRisk > 0 ? `${atRisk} objetivos requieren atención inmediata.` : 'Todos los objetivos están en buen camino.'}`,
      keyHighlights: [
        `${achieved} de ${total} objetivos alcanzados`,
        `Tasa de éxito: ${successRate.toFixed(1)}%`,
        `Progreso general: ${overallProgress.toFixed(1)}%`,
        atRisk > 0 ? `${atRisk} objetivos en riesgo` : 'Todos los objetivos en buen camino',
      ],
      progressOverview: `El rendimiento general muestra un progreso ${overallProgress >= 80 ? 'excelente' : overallProgress >= 60 ? 'bueno' : 'moderado'} hacia los objetivos establecidos. ${achieved > 0 ? `Se han logrado ${achieved} objetivos exitosamente.` : ''} ${atRisk > 0 ? `Se requiere atención en ${atRisk} objetivos que están en riesgo.` : ''}`,
      challenges: atRisk > 0
        ? [
            `${atRisk} objetivos están en riesgo y requieren atención`,
            'Algunos objetivos pueden necesitar ajustes en estrategia o recursos',
          ]
        : ['No se identificaron desafíos críticos en este período'],
      opportunities: [
        'Continuar con las estrategias que han demostrado ser efectivas',
        'Replicar prácticas exitosas en otros objetivos',
        overallProgress < 80 ? 'Hay margen para mejorar el progreso general' : 'Mantener el momentum actual',
      ],
      recommendations: [
        atRisk > 0 ? 'Priorizar acciones para objetivos en riesgo' : 'Mantener el ritmo actual de trabajo',
        'Continuar monitoreando el progreso de los objetivos activos',
        'Celebrar los logros alcanzados y mantener la motivación del equipo',
      ],
    };
  } else if (language === 'en') {
    return {
      executiveSummary: `During this period, ${total} objectives were managed. ${achieved} objectives were successfully achieved, representing a success rate of ${successRate.toFixed(1)}%. Overall progress is ${overallProgress.toFixed(1)}%. ${atRisk > 0 ? `${atRisk} objectives require immediate attention.` : 'All objectives are on track.'}`,
      keyHighlights: [
        `${achieved} of ${total} objectives achieved`,
        `Success rate: ${successRate.toFixed(1)}%`,
        `Overall progress: ${overallProgress.toFixed(1)}%`,
        atRisk > 0 ? `${atRisk} objectives at risk` : 'All objectives on track',
      ],
      progressOverview: `Overall performance shows ${overallProgress >= 80 ? 'excellent' : overallProgress >= 60 ? 'good' : 'moderate'} progress towards established objectives. ${achieved > 0 ? `${achieved} objectives have been successfully achieved.` : ''} ${atRisk > 0 ? `Attention is required on ${atRisk} objectives that are at risk.` : ''}`,
      challenges: atRisk > 0
        ? [
            `${atRisk} objectives are at risk and require attention`,
            'Some objectives may need strategy or resource adjustments',
          ]
        : ['No critical challenges identified in this period'],
      opportunities: [
        'Continue with strategies that have proven effective',
        'Replicate successful practices in other objectives',
        overallProgress < 80 ? 'There is room to improve overall progress' : 'Maintain current momentum',
      ],
      recommendations: [
        atRisk > 0 ? 'Prioritize actions for at-risk objectives' : 'Maintain current work pace',
        'Continue monitoring progress of active objectives',
        'Celebrate achieved milestones and maintain team motivation',
      ],
    };
  } else {
    // Catalan
    return {
      executiveSummary: `Durant aquest període, es van gestionar ${total} objectius. ${achieved} objectius van ser assolits amb èxit, representant una taxa d'èxit del ${successRate.toFixed(1)}%. El progrés general és del ${overallProgress.toFixed(1)}%. ${atRisk > 0 ? `${atRisk} objectius requereixen atenció immediata.` : 'Tots els objectius estan en bon camí.'}`,
      keyHighlights: [
        `${achieved} de ${total} objectius assolits`,
        `Taxa d'èxit: ${successRate.toFixed(1)}%`,
        `Progrés general: ${overallProgress.toFixed(1)}%`,
        atRisk > 0 ? `${atRisk} objectius en risc` : 'Tots els objectius en bon camí',
      ],
      progressOverview: `El rendiment general mostra un progrés ${overallProgress >= 80 ? 'excel·lent' : overallProgress >= 60 ? 'bo' : 'moderat'} cap als objectius establerts. ${achieved > 0 ? `S'han assolit ${achieved} objectius amb èxit.` : ''} ${atRisk > 0 ? `Es requereix atenció en ${atRisk} objectius que estan en risc.` : ''}`,
      challenges: atRisk > 0
        ? [
            `${atRisk} objectius estan en risc i requereixen atenció`,
            'Alguns objectius poden necessitar ajustos en estratègia o recursos',
          ]
        : ['No s\'han identificat desafiaments crítics en aquest període'],
      opportunities: [
        'Continuar amb les estratègies que han demostrat ser efectives',
        'Replicar pràctiques exitoses en altres objectius',
        overallProgress < 80 ? 'Hi ha marge per millorar el progrés general' : 'Mantenir el momentum actual',
      ],
      recommendations: [
        atRisk > 0 ? 'Prioritzar accions per a objectius en risc' : 'Mantenir el ritme actual de treball',
        'Continuar monitoritzant el progrés dels objectius actius',
        'Celebrar els assoliments aconseguits i mantenir la motivació de l\'equip',
      ],
    };
  }
}

function getHighlightedObjectives(objectives: Objective[]): IntelligentSummary['highlightedObjectives'] {
  const highlighted: IntelligentSummary['highlightedObjectives'] = [];

  // Objetivos alcanzados
  const achieved = objectives.filter(o => o.status === 'achieved');
  achieved.slice(0, 3).forEach(obj => {
    highlighted.push({
      objectiveId: obj.id,
      title: obj.title,
      status: obj.status,
      progress: obj.progress,
      highlightReason: 'achieved',
      summary: `Objetivo alcanzado con un progreso del ${obj.progress.toFixed(1)}%`,
    });
  });

  // Objetivos en riesgo crítico
  const atRisk = objectives.filter(o => o.status === 'at_risk' && o.progress < 50);
  atRisk.slice(0, 3).forEach(obj => {
    highlighted.push({
      objectiveId: obj.id,
      title: obj.title,
      status: obj.status,
      progress: obj.progress,
      highlightReason: 'critical',
      summary: `Objetivo en riesgo crítico con un progreso del ${obj.progress.toFixed(1)}%`,
    });
  });

  // Objetivos que excedieron el target
  const exceeded = objectives.filter(o => o.progress > 100);
  exceeded.slice(0, 2).forEach(obj => {
    highlighted.push({
      objectiveId: obj.id,
      title: obj.title,
      status: obj.status,
      progress: obj.progress,
      highlightReason: 'exceeded',
      summary: `Objetivo superado con un progreso del ${obj.progress.toFixed(1)}%`,
    });
  });

  return highlighted;
}

function generateShareToken(): string {
  return `share_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

function hashPassword(password: string): string {
  // En producción, usar un hash real como bcrypt
  return btoa(password);
}

