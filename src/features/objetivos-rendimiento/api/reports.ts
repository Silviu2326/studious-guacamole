import { 
  Report, 
  PerformanceData, 
  ScheduledReport, 
  AINarrativeSummary,
  ObjectiveVsTargetComparison,
  DetectedRisk,
  ProposedAction,
  Objective,
  ReportTemplate,
  ReportCustomizationPermission,
  UserReportConfig,
  CustomReportConfig,
  RawDataExport,
  RawObjectiveData,
  GlobalFilters
} from '../types';
import { getObjectives } from './objectives';

const createReportData = (
  id: string,
  type: Report['type'],
  period: string,
  data: PerformanceData
): Report => {
  return {
    id,
    title: `Reporte ${type === 'daily' ? 'Diario' : type === 'weekly' ? 'Semanal' : type === 'monthly' ? 'Mensual' : type === 'quarterly' ? 'Trimestral' : 'Anual'} - ${period}`,
    type,
    period,
    data,
    generatedAt: new Date().toISOString(),
  };
};

export const getReports = async (type?: Report['type']): Promise<Report[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const mockReports: Report[] = [
    createReportData('1', 'monthly', 'Noviembre 2024', {
      period: '2024-11',
      metrics: [],
      objectives: [],
      summary: {
        totalObjectives: 5,
        achievedObjectives: 2,
        inProgressObjectives: 2,
        atRiskObjectives: 1,
      },
    }),
    createReportData('2', 'weekly', 'Semana 46', {
      period: '2024-11-11',
      metrics: [],
      objectives: [],
      summary: {
        totalObjectives: 5,
        achievedObjectives: 2,
        inProgressObjectives: 2,
        atRiskObjectives: 1,
      },
    }),
  ];
  
  // Cargar reportes personalizados desde localStorage
  const savedCustomReports = localStorage.getItem('custom-reports');
  const customReports = savedCustomReports ? JSON.parse(savedCustomReports) : [];
  
  const allReports = [...mockReports, ...customReports];
  
  if (type) {
    return allReports.filter(r => r.type === type);
  }
  
  return allReports;
};

export const getReport = async (id: string): Promise<Report | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const reports = await getReports();
  return reports.find(r => r.id === id) || null;
};

export const generateReport = async (
  type: Report['type'],
  period: string,
  role: 'entrenador' | 'gimnasio',
  options?: {
    includeAINarrative?: boolean;
    includeObjectivesVsTargets?: boolean;
    includeRisks?: boolean;
    includeProposedActions?: boolean;
  }
): Promise<Report> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const data: PerformanceData = {
    period,
    metrics: [],
    objectives: [],
    summary: {
      totalObjectives: 5,
      achievedObjectives: 2,
      inProgressObjectives: 2,
      atRiskObjectives: 1,
    },
  };
  
  const report = createReportData(Date.now().toString(), type, period, data);
  
  // User Story 1: Generar resumen narrativo de IA si se solicita
  if (options?.includeAINarrative !== false) {
    report.aiNarrativeSummary = await generateAINarrativeSummary(report.id, data);
  }
  
  // User Story 2: Generar comparativas, riesgos y acciones si se solicitan
  if (options?.includeObjectivesVsTargets !== false) {
    report.objectivesVsTargets = await generateObjectivesVsTargetsComparison(role, period);
  }
  
  if (options?.includeRisks !== false) {
    report.detectedRisks = await detectRisks(role, period);
  }
  
  if (options?.includeProposedActions !== false) {
    report.proposedActions = await generateProposedActions(role, report.detectedRisks, period);
  }
  
  return report;
};

export const exportReport = async (reportId: string, format: 'pdf' | 'excel' | 'csv' | 'presentation'): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simular generación de archivo
  const extension = format === 'presentation' ? 'pptx' : format;
  const filename = `reporte-${reportId}.${extension}`;
  return filename;
};

// User Story 2: Función para generar reporte personalizado
export const generateCustomReport = async (
  config: CustomReportConfig,
  role: 'entrenador' | 'gimnasio'
): Promise<Report> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const period = new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  
  const data: PerformanceData = {
    period,
    metrics: [],
    objectives: [],
    summary: {
      totalObjectives: 5,
      achievedObjectives: 2,
      inProgressObjectives: 2,
      atRiskObjectives: 1,
    },
  };
  
  const report: Report = {
    id: `custom_${Date.now()}`,
    title: `Reporte Personalizado - ${config.audience === 'management' ? 'Dirección' : config.audience === 'investors' ? 'Inversores' : 'Equipo'}`,
    type: 'custom',
    period,
    data,
    generatedAt: new Date().toISOString(),
    customReportConfig: config,
  };
  
  // User Story 1 & 2: Incluir nuevas secciones si están configuradas
  // Por defecto, incluir todas las secciones para reportes personalizados
  report.aiNarrativeSummary = await generateAINarrativeSummary(report.id, data);
  report.objectivesVsTargets = await generateObjectivesVsTargetsComparison(role, period);
  report.detectedRisks = await detectRisks(role, period);
  report.proposedActions = await generateProposedActions(role, report.detectedRisks, period);
  
  // Guardar en localStorage (simulado)
  const savedReports = localStorage.getItem('custom-reports');
  const reports = savedReports ? JSON.parse(savedReports) : [];
  reports.push(report);
  localStorage.setItem('custom-reports', JSON.stringify(reports));
  
  return report;
};

// User Story 1: Obtener reportes programados
export const getScheduledReports = async (): Promise<ScheduledReport[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
  return [
    {
      id: '1',
      reportType: 'weekly',
      frequency: 'weekly',
      enabled: true,
      recipients: ['user1', 'user2'],
      recipientEmails: ['manager@example.com'],
      dayOfWeek: 1, // Lunes
      time: '09:00',
      timezone: 'Europe/Madrid',
      includeAINarrative: true,
      includeObjectivesVsTargets: true,
      includeRisks: true,
      includeProposedActions: true,
      lastSentAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      nextScheduledAt: nextWeek.toISOString(),
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: now.toISOString(),
      createdBy: 'user1',
    },
    {
      id: '2',
      reportType: 'monthly',
      frequency: 'monthly',
      enabled: true,
      recipients: ['user1'],
      dayOfMonth: 1,
      time: '08:00',
      timezone: 'Europe/Madrid',
      includeAINarrative: true,
      includeObjectivesVsTargets: true,
      includeRisks: true,
      includeProposedActions: true,
      lastSentAt: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString(),
      nextScheduledAt: nextMonth.toISOString(),
      createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: now.toISOString(),
      createdBy: 'user1',
    },
  ];
};

// User Story 1: Crear o actualizar reporte programado
export const saveScheduledReport = async (scheduledReport: Partial<ScheduledReport> & { reportType: 'weekly' | 'monthly' }): Promise<ScheduledReport> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const now = new Date();
  const id = scheduledReport.id || Date.now().toString();
  
  // Calcular próxima fecha programada
  let nextScheduledAt = new Date();
  if (scheduledReport.reportType === 'weekly' && scheduledReport.dayOfWeek !== undefined) {
    const daysUntilNext = (scheduledReport.dayOfWeek - nextScheduledAt.getDay() + 7) % 7 || 7;
    nextScheduledAt = new Date(nextScheduledAt.getTime() + daysUntilNext * 24 * 60 * 60 * 1000);
  } else if (scheduledReport.reportType === 'monthly' && scheduledReport.dayOfMonth !== undefined) {
    nextScheduledAt = new Date(nextScheduledAt.getFullYear(), nextScheduledAt.getMonth() + 1, scheduledReport.dayOfMonth);
  }
  
  return {
    id,
    reportType: scheduledReport.reportType,
    frequency: scheduledReport.frequency || scheduledReport.reportType,
    enabled: scheduledReport.enabled !== undefined ? scheduledReport.enabled : true,
    recipients: scheduledReport.recipients || [],
    recipientEmails: scheduledReport.recipientEmails || [],
    dayOfWeek: scheduledReport.dayOfWeek,
    dayOfMonth: scheduledReport.dayOfMonth,
    time: scheduledReport.time || '09:00',
    timezone: scheduledReport.timezone || 'Europe/Madrid',
    includeAINarrative: scheduledReport.includeAINarrative !== undefined ? scheduledReport.includeAINarrative : true,
    includeObjectivesVsTargets: scheduledReport.includeObjectivesVsTargets !== undefined ? scheduledReport.includeObjectivesVsTargets : true,
    includeRisks: scheduledReport.includeRisks !== undefined ? scheduledReport.includeRisks : true,
    includeProposedActions: scheduledReport.includeProposedActions !== undefined ? scheduledReport.includeProposedActions : true,
    lastSentAt: scheduledReport.lastSentAt,
    nextScheduledAt: scheduledReport.nextScheduledAt || nextScheduledAt.toISOString(),
    createdAt: scheduledReport.createdAt || now.toISOString(),
    updatedAt: now.toISOString(),
    createdBy: scheduledReport.createdBy || 'current-user',
  };
};

// User Story 1: Eliminar reporte programado
export const deleteScheduledReport = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  // Simular eliminación
};

// User Story 1: Generar resumen narrativo con IA
export const generateAINarrativeSummary = async (
  reportId: string,
  reportData: PerformanceData,
  language: 'es' | 'en' | 'ca' = 'es'
): Promise<AINarrativeSummary> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const { summary, objectives } = reportData;
  const totalObjectives = summary.totalObjectives;
  const achievedObjectives = summary.achievedObjectives;
  const atRiskObjectives = summary.atRiskObjectives;
  const achievementRate = totalObjectives > 0 ? (achievedObjectives / totalObjectives) * 100 : 0;
  
  // Generar resumen narrativo basado en los datos
  const summaryText = language === 'es' 
    ? `Durante este período, se han gestionado ${totalObjectives} objetivos en total. ${achievedObjectives} objetivos han sido alcanzados exitosamente, lo que representa una tasa de logro del ${achievementRate.toFixed(1)}%. ${atRiskObjectives > 0 ? `Se han identificado ${atRiskObjectives} objetivos en riesgo que requieren atención inmediata.` : 'Todos los objetivos están en buen camino.'} El rendimiento general muestra un progreso ${achievementRate >= 80 ? 'excelente' : achievementRate >= 60 ? 'bueno' : 'moderado'} hacia los objetivos establecidos.`
    : `During this period, ${totalObjectives} objectives were managed in total. ${achievedObjectives} objectives have been successfully achieved, representing an achievement rate of ${achievementRate.toFixed(1)}%. ${atRiskObjectives > 0 ? `${atRiskObjectives} objectives at risk have been identified that require immediate attention.` : 'All objectives are on track.'} Overall performance shows ${achievementRate >= 80 ? 'excellent' : achievementRate >= 60 ? 'good' : 'moderate'} progress towards established objectives.`;
  
  const keyHighlights = language === 'es'
    ? [
        `${achievedObjectives} de ${totalObjectives} objetivos alcanzados`,
        `Tasa de logro: ${achievementRate.toFixed(1)}%`,
        atRiskObjectives > 0 ? `${atRiskObjectives} objetivos requieren atención` : 'Todos los objetivos en buen camino',
      ]
    : [
        `${achievedObjectives} of ${totalObjectives} objectives achieved`,
        `Achievement rate: ${achievementRate.toFixed(1)}%`,
        atRiskObjectives > 0 ? `${atRiskObjectives} objectives require attention` : 'All objectives on track',
      ];
  
  const trends = language === 'es'
    ? [
        achievementRate >= 80 ? 'Tendencia positiva en el cumplimiento de objetivos' : 'Progreso constante hacia los objetivos',
        atRiskObjectives > 0 ? 'Aumento en objetivos en riesgo detectados' : 'Estabilidad en el estado de los objetivos',
      ]
    : [
        achievementRate >= 80 ? 'Positive trend in objective achievement' : 'Steady progress towards objectives',
        atRiskObjectives > 0 ? 'Increase in at-risk objectives detected' : 'Stability in objective status',
      ];
  
  const insights = language === 'es'
    ? [
        `El ${achievementRate.toFixed(1)}% de los objetivos han sido completados exitosamente`,
        atRiskObjectives > 0 ? `Se requiere atención inmediata en ${atRiskObjectives} objetivos críticos` : 'El rendimiento general es satisfactorio',
      ]
    : [
        `${achievementRate.toFixed(1)}% of objectives have been successfully completed`,
        atRiskObjectives > 0 ? `Immediate attention required on ${atRiskObjectives} critical objectives` : 'Overall performance is satisfactory',
      ];
  
  const recommendations = language === 'es'
    ? [
        atRiskObjectives > 0 ? 'Revisar y ajustar estrategias para objetivos en riesgo' : 'Mantener el ritmo actual de trabajo',
        'Continuar monitoreando el progreso de los objetivos activos',
        'Celebrar los logros alcanzados y mantener la motivación del equipo',
      ]
    : [
        atRiskObjectives > 0 ? 'Review and adjust strategies for at-risk objectives' : 'Maintain current work pace',
        'Continue monitoring progress of active objectives',
        'Celebrate achieved milestones and maintain team motivation',
      ];
  
  return {
    id: `narrative-${Date.now()}`,
    reportId,
    summary: summaryText,
    keyHighlights,
    trends,
    insights,
    recommendations,
    generatedAt: new Date().toISOString(),
    confidence: 85,
    language,
  };
};

// User Story 2: Generar comparativa objetivos vs targets
export const generateObjectivesVsTargetsComparison = async (
  role: 'entrenador' | 'gimnasio',
  period?: string
): Promise<ObjectiveVsTargetComparison[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const objectives = await getObjectives(role);
  const now = new Date();
  
  return objectives.map((obj: Objective) => {
    const deadline = new Date(obj.deadline);
    const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const gap = obj.targetValue - obj.currentValue;
    const gapPercentage = obj.targetValue !== 0 ? (gap / obj.targetValue) * 100 : 0;
    
    // Determinar estado
    let status: 'on_track' | 'at_risk' | 'behind' | 'exceeded';
    if (obj.progress >= 100) {
      status = 'exceeded';
    } else if (obj.progress >= 80) {
      status = 'on_track';
    } else if (obj.progress >= 50) {
      status = 'at_risk';
    } else {
      status = 'behind';
    }
    
    // Determinar tendencia (simulado)
    const trend: 'improving' | 'declining' | 'stable' = 
      obj.progress > 60 ? 'improving' : obj.progress < 40 ? 'declining' : 'stable';
    
    // Calcular fecha estimada de completado
    let estimatedCompletion: string | undefined;
    if (trend === 'improving' && obj.progress > 0) {
      const daysElapsed = Math.ceil((now.getTime() - new Date(obj.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      const progressPerDay = obj.progress / daysElapsed;
      if (progressPerDay > 0) {
        const daysToComplete = (100 - obj.progress) / progressPerDay;
        estimatedCompletion = new Date(now.getTime() + daysToComplete * 24 * 60 * 60 * 1000).toISOString();
      }
    }
    
    return {
      objectiveId: obj.id,
      objectiveTitle: obj.title,
      currentValue: obj.currentValue,
      targetValue: obj.targetValue,
      progress: obj.progress,
      gap,
      gapPercentage,
      status,
      trend,
      unit: obj.unit,
      deadline: obj.deadline,
      daysRemaining: Math.max(0, daysRemaining),
      estimatedCompletion,
      confidence: trend === 'improving' ? 75 : trend === 'stable' ? 60 : 45,
    };
  });
};

// User Story 2: Detectar riesgos
export const detectRisks = async (
  role: 'entrenador' | 'gimnasio',
  period?: string
): Promise<DetectedRisk[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const objectives = await getObjectives(role);
  const now = new Date();
  const risks: DetectedRisk[] = [];
  
  objectives.forEach((obj: Objective) => {
    // Riesgo por bajo progreso
    if (obj.progress < 50 && obj.status === 'at_risk') {
      const deadline = new Date(obj.deadline);
      const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      risks.push({
        id: `risk-${obj.id}-progress`,
        objectiveId: obj.id,
        title: `Objetivo "${obj.title}" con bajo progreso`,
        description: `El objetivo tiene un progreso del ${obj.progress.toFixed(1)}% y quedan ${daysRemaining} días para la fecha límite. Es probable que no se alcance el objetivo si no se toman medidas correctivas.`,
        severity: daysRemaining < 7 ? 'critical' : daysRemaining < 30 ? 'high' : 'medium',
        category: 'performance',
        detectedAt: now.toISOString(),
        currentImpact: 100 - obj.progress,
        potentialImpact: 100 - obj.progress,
        probability: daysRemaining < 7 ? 90 : daysRemaining < 30 ? 70 : 50,
        status: 'new',
        mitigationActions: [
          'Revisar y ajustar la estrategia del objetivo',
          'Asignar recursos adicionales si es necesario',
          'Considerar extender la fecha límite si es apropiado',
        ],
        relatedObjectives: [obj.id],
      });
    }
    
    // Riesgo por fecha límite próxima
    const deadline = new Date(obj.deadline);
    const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysRemaining < 14 && obj.progress < 80) {
      risks.push({
        id: `risk-${obj.id}-deadline`,
        objectiveId: obj.id,
        title: `Fecha límite próxima para "${obj.title}"`,
        description: `Quedan ${daysRemaining} días para alcanzar el objetivo y el progreso actual es del ${obj.progress.toFixed(1)}%. Se requiere acción inmediata.`,
        severity: daysRemaining < 3 ? 'critical' : 'high',
        category: 'deadline',
        detectedAt: now.toISOString(),
        currentImpact: 80,
        potentialImpact: 100,
        probability: 75,
        status: 'new',
        mitigationActions: [
          'Priorizar acciones para este objetivo',
          'Reasignar recursos si es necesario',
          'Comunicar el riesgo al equipo responsable',
        ],
        relatedObjectives: [obj.id],
      });
    }
  });
  
  return risks;
};

// User Story 2: Generar acciones propuestas
export const generateProposedActions = async (
  role: 'entrenador' | 'gimnasio',
  risks?: DetectedRisk[],
  period?: string
): Promise<ProposedAction[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const actions: ProposedAction[] = [];
  const now = new Date();
  
  // Si no se proporcionan riesgos, detectarlos
  const detectedRisks = risks || await detectRisks(role, period);
  
  detectedRisks.forEach((risk) => {
    if (risk.severity === 'critical' || risk.severity === 'high') {
      actions.push({
        id: `action-${risk.id}`,
        title: `Mitigar riesgo: ${risk.title}`,
        description: risk.description,
        type: 'corrective',
        priority: risk.severity === 'critical' ? 'urgent' : 'high',
        objectiveId: risk.objectiveId,
        riskId: risk.id,
        estimatedImpact: risk.potentialImpact > 70 ? 'high' : risk.potentialImpact > 40 ? 'medium' : 'low',
        estimatedEffort: 'medium',
        suggestedBy: 'ai',
        suggestedAt: now.toISOString(),
        rationale: `Este riesgo tiene una probabilidad del ${risk.probability}% y un impacto potencial de ${risk.potentialImpact}%. La acción inmediata es necesaria para evitar el incumplimiento del objetivo.`,
        steps: risk.mitigationActions?.map((action, index) => ({
          id: `step-${risk.id}-${index}`,
          title: action,
          description: action,
          order: index + 1,
        })),
        status: 'proposed',
      });
    }
  });
  
  // Agregar acciones preventivas basadas en objetivos en riesgo
  const objectives = await getObjectives(role);
  objectives.forEach((obj: Objective) => {
    if (obj.status === 'at_risk' && obj.progress < 60) {
      actions.push({
        id: `action-preventive-${obj.id}`,
        title: `Prevenir deterioro del objetivo "${obj.title}"`,
        description: `El objetivo muestra signos de riesgo. Se recomienda tomar medidas preventivas para asegurar su cumplimiento.`,
        type: 'preventive',
        priority: 'medium',
        objectiveId: obj.id,
        estimatedImpact: 'medium',
        estimatedEffort: 'low',
        suggestedBy: 'ai',
        suggestedAt: now.toISOString(),
        rationale: `El objetivo tiene un progreso del ${obj.progress.toFixed(1)}% y está marcado como en riesgo. Las acciones preventivas ahora pueden evitar problemas mayores más adelante.`,
        steps: [
          {
            id: `step-${obj.id}-1`,
            title: 'Revisar estrategia actual',
            description: 'Analizar qué está funcionando y qué no',
            order: 1,
          },
          {
            id: `step-${obj.id}-2`,
            title: 'Ajustar plan de acción',
            description: 'Modificar el plan según los hallazgos',
            order: 2,
          },
          {
            id: `step-${obj.id}-3`,
            title: 'Aumentar frecuencia de seguimiento',
            description: 'Monitorear más de cerca el progreso',
            order: 3,
          },
        ],
        status: 'proposed',
      });
    }
  });
  
  return actions;
};

// User Story 1: Obtener plantillas de reportes
export const getReportTemplates = async (userId?: string): Promise<ReportTemplate[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const savedTemplates = localStorage.getItem('report-templates');
  let templates: ReportTemplate[] = savedTemplates ? JSON.parse(savedTemplates) : [];
  
  // Si no hay plantillas guardadas, crear algunas por defecto
  if (templates.length === 0) {
    const defaultTemplates: ReportTemplate[] = [
      {
        id: 'template-1',
        name: 'Reporte Ejecutivo',
        description: 'Plantilla para reportes ejecutivos con resumen de alto nivel',
        isCommon: true,
        createdBy: 'system',
        createdByName: 'Sistema',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        config: {
          audience: 'management',
          includeMetrics: true,
          includeCharts: true,
          includeComments: false,
          selectedObjectives: [],
          selectedMetrics: [],
          chartTypes: ['bar', 'line'],
          template: 'executive',
        },
        isDefault: true,
      },
      {
        id: 'template-2',
        name: 'Reporte Detallado',
        description: 'Plantilla para reportes detallados con métricas y comentarios',
        isCommon: true,
        createdBy: 'system',
        createdByName: 'Sistema',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        config: {
          audience: 'team',
          includeMetrics: true,
          includeCharts: true,
          includeComments: true,
          selectedObjectives: [],
          selectedMetrics: [],
          chartTypes: ['bar', 'line', 'pie'],
          template: 'detailed',
        },
      },
    ];
    templates = defaultTemplates;
    localStorage.setItem('report-templates', JSON.stringify(templates));
  }
  
  // Filtrar por usuario si se especifica
  if (userId) {
    return templates.filter(
      t => t.isCommon || t.createdBy === userId || t.sharedWith?.includes(userId)
    );
  }
  
  return templates;
};

// User Story 1: Crear o actualizar plantilla de reporte
export const saveReportTemplate = async (template: Partial<ReportTemplate> & { name: string; config: CustomReportConfig }): Promise<ReportTemplate> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const templates = await getReportTemplates();
  const now = new Date().toISOString();
  const id = template.id || `template-${Date.now()}`;
  
  const existingIndex = templates.findIndex(t => t.id === id);
  const newTemplate: ReportTemplate = {
    id,
    name: template.name,
    description: template.description,
    isCommon: template.isCommon || false,
    createdBy: template.createdBy || 'current-user',
    createdByName: template.createdByName || 'Usuario Actual',
    createdAt: template.createdAt || now,
    updatedAt: now,
    config: template.config,
    sharedWith: template.sharedWith,
    isDefault: template.isDefault || false,
  };
  
  if (existingIndex >= 0) {
    templates[existingIndex] = { ...templates[existingIndex], ...newTemplate };
  } else {
    templates.push(newTemplate);
  }
  
  localStorage.setItem('report-templates', JSON.stringify(templates));
  return newTemplate;
};

// User Story 1: Eliminar plantilla de reporte
export const deleteReportTemplate = async (templateId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const templates = await getReportTemplates();
  const filtered = templates.filter(t => t.id !== templateId);
  localStorage.setItem('report-templates', JSON.stringify(filtered));
};

// User Story 1: Obtener permisos de personalización de reportes
export const getReportCustomizationPermissions = async (): Promise<ReportCustomizationPermission[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const saved = localStorage.getItem('report-customization-permissions');
  return saved ? JSON.parse(saved) : [];
};

// User Story 1: Otorgar o actualizar permiso de personalización
export const grantReportCustomizationPermission = async (
  permission: Partial<ReportCustomizationPermission> & { userId: string; userName: string }
): Promise<ReportCustomizationPermission> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const permissions = await getReportCustomizationPermissions();
  const now = new Date().toISOString();
  
  const existingIndex = permissions.findIndex(p => p.userId === permission.userId);
  const newPermission: ReportCustomizationPermission = {
    userId: permission.userId,
    userName: permission.userName,
    canCustomizeReports: permission.canCustomizeReports !== undefined ? permission.canCustomizeReports : true,
    canCreateTemplates: permission.canCreateTemplates !== undefined ? permission.canCreateTemplates : false,
    canShareTemplates: permission.canShareTemplates !== undefined ? permission.canShareTemplates : false,
    grantedBy: permission.grantedBy || 'current-manager',
    grantedByName: permission.grantedByName || 'Manager',
    grantedAt: permission.grantedAt || now,
    expiresAt: permission.expiresAt,
  };
  
  if (existingIndex >= 0) {
    permissions[existingIndex] = newPermission;
  } else {
    permissions.push(newPermission);
  }
  
  localStorage.setItem('report-customization-permissions', JSON.stringify(permissions));
  return newPermission;
};

// User Story 1: Verificar si un usuario tiene permiso para personalizar reportes
export const hasReportCustomizationPermission = async (userId: string): Promise<boolean> => {
  const permissions = await getReportCustomizationPermissions();
  const permission = permissions.find(p => p.userId === userId);
  
  if (!permission) return false;
  
  // Verificar si el permiso ha expirado
  if (permission.expiresAt) {
    const expiresAt = new Date(permission.expiresAt);
    if (expiresAt < new Date()) {
      return false;
    }
  }
  
  return permission.canCustomizeReports;
};

// User Story 1: Obtener configuraciones personalizadas de reportes de un usuario
export const getUserReportConfigs = async (userId: string): Promise<UserReportConfig[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const saved = localStorage.getItem(`user-report-configs-${userId}`);
  return saved ? JSON.parse(saved) : [];
};

// User Story 1: Guardar configuración personalizada de reporte
export const saveUserReportConfig = async (
  config: Partial<UserReportConfig> & { userId: string; userName: string; name: string; config: CustomReportConfig }
): Promise<UserReportConfig> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const configs = await getUserReportConfigs(config.userId);
  const now = new Date().toISOString();
  const id = config.id || `user-config-${Date.now()}`;
  
  const existingIndex = configs.findIndex(c => c.id === id);
  const newConfig: UserReportConfig = {
    id,
    userId: config.userId,
    userName: config.userName,
    name: config.name,
    description: config.description,
    templateId: config.templateId,
    config: config.config,
    createdAt: config.createdAt || now,
    updatedAt: now,
    isDefault: config.isDefault || false,
  };
  
  if (existingIndex >= 0) {
    configs[existingIndex] = newConfig;
  } else {
    configs.push(newConfig);
  }
  
  // Si se marca como default, desmarcar los demás
  if (newConfig.isDefault) {
    configs.forEach(c => {
      if (c.id !== id) c.isDefault = false;
    });
  }
  
  localStorage.setItem(`user-report-configs-${config.userId}`, JSON.stringify(configs));
  return newConfig;
};

// User Story 1: Eliminar configuración personalizada de reporte
export const deleteUserReportConfig = async (userId: string, configId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const configs = await getUserReportConfigs(userId);
  const filtered = configs.filter(c => c.id !== configId);
  localStorage.setItem(`user-report-configs-${userId}`, JSON.stringify(filtered));
};

// User Story 2: Exportar datos en bruto con etiquetas
export const exportRawData = async (
  role: 'entrenador' | 'gimnasio',
  format: 'csv' | 'excel' | 'json',
  filters?: GlobalFilters,
  period?: string
): Promise<RawDataExport> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const objectives = await getObjectives({}, role);
  const now = new Date();
  
  // Transformar objetivos a formato de datos en bruto con etiquetas
  const rawObjectives: RawObjectiveData[] = objectives.map((obj: Objective) => {
    // Obtener etiquetas del equipo y responsable
    const equipo = obj.assignment?.name || filters?.equipo || 'Sin equipo';
    const responsable = obj.responsibleName || obj.responsible || 'Sin responsable';
    const objetivo = obj.title;
    
    return {
      objectiveId: obj.id,
      objectiveTitle: obj.title,
      objectiveDescription: obj.description,
      objetivo,
      equipo,
      responsable,
      responsableId: obj.responsible,
      metric: obj.metric,
      targetValue: obj.targetValue,
      currentValue: obj.currentValue,
      unit: obj.unit,
      progress: obj.progress,
      status: obj.status,
      category: obj.category,
      deadline: obj.deadline,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
      objectiveType: obj.objectiveType,
      horizon: obj.horizon,
      assignmentType: obj.assignment?.type,
      assignmentId: obj.assignment?.id,
      assignmentName: obj.assignment?.name,
    };
  });
  
  return {
    objectives: rawObjectives,
    metadata: {
      exportedAt: now.toISOString(),
      exportedBy: 'current-user',
      exportedByName: 'Usuario Actual',
      period,
      filters,
    },
  };
};

