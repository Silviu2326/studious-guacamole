import { Alert, Objective, AlertType, AlertPriority, DetectedCause, MitigationPlan, KPI } from '../types';
import { getObjectives } from './objectives';
import { getKPIs } from './metrics';

// User Story 2: Genera un plan de mitigación con IA basado en la causa detectada
const generateMitigationPlan = async (
  alertType: AlertType,
  detectedCause: DetectedCause,
  objective?: Objective,
  kpi?: KPI
): Promise<MitigationPlan> => {
  // Simular delay de procesamiento de IA
  await new Promise(resolve => setTimeout(resolve, 400));
  
  let plan: MitigationPlan;
  
  switch (detectedCause.type) {
    case 'threshold_exceeded':
      // Plan para cuando se excede un umbral
      const deviation = detectedCause.details?.deviation || 0;
      const threshold = detectedCause.details?.threshold || 0;
      
      plan = {
        id: `mitigation-${Date.now()}`,
        title: 'Plan de corrección para desviación de objetivo',
        description: `Plan de acción para corregir la desviación del ${deviation.toFixed(1)}% detectada en el objetivo`,
        steps: [
          {
            id: 'step-1',
            title: 'Analizar causas raíz',
            description: 'Revisar los factores que han causado la desviación del objetivo. Identificar si es un problema de recursos, estrategia o factores externos.',
            priority: 'high',
            estimatedImpact: 'high',
            estimatedEffort: 'medium',
            order: 1,
          },
          {
            id: 'step-2',
            title: 'Ajustar recursos o estrategia',
            description: deviation > 20 
              ? 'Aumentar recursos asignados o revisar la estrategia actual para acelerar el progreso'
              : 'Realizar ajustes menores en la estrategia o redistribuir recursos',
            priority: deviation > 20 ? 'high' : 'medium',
            estimatedImpact: 'high',
            estimatedEffort: deviation > 20 ? 'high' : 'medium',
            order: 2,
          },
          {
            id: 'step-3',
            title: 'Establecer checkpoints de seguimiento',
            description: 'Programar revisiones periódicas más frecuentes para monitorear el progreso y hacer ajustes oportunos',
            priority: 'medium',
            estimatedImpact: 'medium',
            estimatedEffort: 'low',
            order: 3,
          },
        ],
        rationale: `La desviación del ${deviation.toFixed(1)}% indica que el objetivo requiere atención inmediata. El plan propuesto aborda primero la identificación de causas, luego la corrección y finalmente el seguimiento continuo para prevenir futuras desviaciones.`,
        confidence: deviation > 20 ? 85 : 75,
        estimatedTimeToResolve: deviation > 20 ? '1-2 semanas' : '3-5 días',
        generatedAt: new Date().toISOString(),
      };
      break;
      
    case 'kpi_drop':
      // Plan para cuando cae un KPI crítico
      const currentValue = detectedCause.details?.currentValue || 0;
      const expectedValue = detectedCause.details?.expectedValue || 0;
      const dropPercent = expectedValue > 0 ? ((expectedValue - currentValue) / expectedValue) * 100 : 0;
      
      plan = {
        id: `mitigation-${Date.now()}`,
        title: `Plan de recuperación para ${kpi?.name || 'KPI crítico'}`,
        description: `Plan de acción para recuperar el KPI que ha caído un ${dropPercent.toFixed(1)}%`,
        steps: [
          {
            id: 'step-1',
            title: 'Identificar factores de impacto',
            description: 'Analizar qué factores internos o externos han causado la caída del KPI. Revisar cambios recientes en estrategias, procesos o condiciones del mercado.',
            priority: 'high',
            estimatedImpact: 'high',
            estimatedEffort: 'medium',
            order: 1,
          },
          {
            id: 'step-2',
            title: 'Implementar acciones correctivas inmediatas',
            description: dropPercent > 15
              ? 'Aplicar medidas urgentes para detener la caída y comenzar la recuperación'
              : 'Aplicar ajustes estratégicos para revertir la tendencia',
            priority: 'high',
            estimatedImpact: 'high',
            estimatedEffort: dropPercent > 15 ? 'high' : 'medium',
            order: 2,
          },
          {
            id: 'step-3',
            title: 'Monitorear tendencia de recuperación',
            description: 'Establecer un sistema de monitoreo diario para verificar que las acciones correctivas están funcionando',
            priority: 'medium',
            estimatedImpact: 'medium',
            estimatedEffort: 'low',
            order: 3,
          },
        ],
        rationale: `La caída del ${dropPercent.toFixed(1)}% en ${kpi?.name || 'el KPI crítico'} requiere una respuesta rápida y estructurada. El plan se enfoca en identificar causas, aplicar correcciones y monitorear la recuperación.`,
        confidence: 80,
        estimatedTimeToResolve: dropPercent > 15 ? '2-3 semanas' : '1-2 semanas',
        generatedAt: new Date().toISOString(),
      };
      break;
      
    case 'stale_objective':
      // Plan para objetivos no actualizados
      const daysSinceUpdate = detectedCause.details?.daysSinceUpdate || 0;
      
      plan = {
        id: `mitigation-${Date.now()}`,
        title: 'Plan de actualización de objetivo',
        description: `Plan para actualizar el objetivo que no ha sido actualizado en ${daysSinceUpdate} días`,
        steps: [
          {
            id: 'step-1',
            title: 'Revisar estado actual del objetivo',
            description: 'Recopilar información actualizada sobre el progreso real del objetivo y compararlo con el último registro',
            priority: 'high',
            estimatedImpact: 'high',
            estimatedEffort: 'low',
            order: 1,
          },
          {
            id: 'step-2',
            title: 'Actualizar valores y progreso',
            description: 'Registrar el valor actual y recalcular el progreso del objetivo con la información más reciente',
            priority: 'high',
            estimatedImpact: 'high',
            estimatedEffort: 'low',
            order: 2,
          },
          {
            id: 'step-3',
            title: 'Establecer recordatorio de actualización',
            description: 'Configurar recordatorios automáticos para asegurar actualizaciones regulares del objetivo',
            priority: 'medium',
            estimatedImpact: 'medium',
            estimatedEffort: 'low',
            order: 3,
          },
        ],
        rationale: `Un objetivo no actualizado en ${daysSinceUpdate} días puede tener información desactualizada que afecta la toma de decisiones. El plan asegura que el objetivo se actualice y se mantenga actualizado.`,
        confidence: 90,
        estimatedTimeToResolve: '1 día',
        generatedAt: new Date().toISOString(),
      };
      break;
      
    default:
      // Plan genérico
      plan = {
        id: `mitigation-${Date.now()}`,
        title: 'Plan de mitigación',
        description: 'Plan de acción para abordar la alerta detectada',
        steps: [
          {
            id: 'step-1',
            title: 'Revisar situación',
            description: 'Analizar la situación actual y entender el contexto de la alerta',
            priority: 'high',
            estimatedImpact: 'medium',
            estimatedEffort: 'low',
            order: 1,
          },
          {
            id: 'step-2',
            title: 'Aplicar acciones correctivas',
            description: 'Implementar las acciones necesarias para resolver la situación',
            priority: 'high',
            estimatedImpact: 'high',
            estimatedEffort: 'medium',
            order: 2,
          },
        ],
        rationale: 'Plan genérico de mitigación para abordar la alerta detectada.',
        confidence: 70,
        estimatedTimeToResolve: '3-5 días',
        generatedAt: new Date().toISOString(),
      };
  }
  
  return plan;
};

// User Story 2: Calcula la prioridad de una alerta basada en su tipo y severidad
const calculateAlertPriority = (
  alertType: AlertType,
  severity: 'low' | 'medium' | 'high',
  detectedCause?: DetectedCause
): AlertPriority => {
  // Si es una alerta crítica de KPI o objetivo fallido, prioridad crítica
  if (alertType === 'kpi_critical_drop' || alertType === 'objective_failed') {
    return 'critical';
  }
  
  // Si la severidad es alta, prioridad alta o crítica según el tipo
  if (severity === 'high') {
    if (alertType === 'objective_deviation' || alertType === 'objective_at_risk') {
      // Revisar la desviación para determinar si es crítica
      const deviation = detectedCause?.details?.deviation || 0;
      return deviation > 30 ? 'critical' : 'high';
    }
    return 'high';
  }
  
  // Si la severidad es media, prioridad media
  if (severity === 'medium') {
    return 'medium';
  }
  
  // Por defecto, prioridad baja
  return 'low';
};

// User Story 1: Detecta alertas de desviación de objetivos más allá de umbral
const detectObjectiveDeviations = async (role?: 'entrenador' | 'gimnasio'): Promise<Alert[]> => {
  const objectives = await getObjectives({}, role);
  const alerts: Alert[] = [];
  
  for (const objective of objectives) {
    // Solo verificar objetivos activos
    if (objective.status === 'achieved' || objective.status === 'failed') continue;
    
    // Verificar si tiene umbrales configurados
    if (!objective.automaticAlerts?.enabled || !objective.colorThresholds?.enabled) continue;
    
    const thresholds = objective.colorThresholds;
    const progress = objective.progress;
    
    // Calcular progreso esperado basado en tiempo transcurrido
    const now = new Date();
    const deadline = new Date(objective.deadline);
    const createdAt = new Date(objective.createdAt);
    const totalDays = Math.ceil((deadline.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const expectedProgress = totalDays > 0 ? Math.min((elapsedDays / totalDays) * 100, 100) : 0;
    
    // Verificar desviación del progreso esperado
    if (objective.automaticAlerts.notifyOnDeviation && objective.automaticAlerts.deviationThreshold) {
      const deviation = expectedProgress - progress;
      if (deviation >= objective.automaticAlerts.deviationThreshold) {
        const detectedCause: DetectedCause = {
          type: 'threshold_exceeded',
          description: `El objetivo se ha desviado ${deviation.toFixed(1)}% del progreso esperado`,
          details: {
            threshold: objective.automaticAlerts.deviationThreshold,
            currentValue: progress,
            expectedValue: expectedProgress,
            deviation: deviation,
          },
        };
        
        const mitigationPlan = await generateMitigationPlan('objective_deviation', detectedCause, objective);
        const priority = calculateAlertPriority('objective_deviation', deviation > 20 ? 'high' : 'medium', detectedCause);
        
        alerts.push({
          id: `deviation-${objective.id}-${Date.now()}`,
          type: 'warning',
          alertType: 'objective_deviation',
          title: `Desviación detectada: ${objective.title}`,
          message: `El objetivo "${objective.title}" se ha desviado ${deviation.toFixed(1)}% del progreso esperado. Progreso actual: ${progress.toFixed(1)}%, esperado: ${expectedProgress.toFixed(1)}%`,
          objectiveId: objective.id,
          severity: deviation > 20 ? 'high' : 'medium',
          priority,
          detectedCause,
          mitigationPlan,
          createdAt: new Date().toISOString(),
          read: false,
        });
      }
    }
    
    // Verificar si entró en zona roja
    if (objective.automaticAlerts.notifyOnRed && progress < thresholds.red) {
      const detectedCause: DetectedCause = {
        type: 'threshold_exceeded',
        description: `El objetivo ha entrado en zona roja (progreso: ${progress.toFixed(1)}%)`,
        details: {
          threshold: thresholds.red,
          currentValue: progress,
          expectedValue: expectedProgress,
          deviation: expectedProgress - progress,
        },
      };
      
      const mitigationPlan = await generateMitigationPlan('objective_deviation', detectedCause, objective);
      
      alerts.push({
        id: `red-zone-${objective.id}-${Date.now()}`,
        type: 'error',
        alertType: 'objective_at_risk',
        title: `Zona roja: ${objective.title}`,
        message: `El objetivo "${objective.title}" ha entrado en zona roja con un progreso del ${progress.toFixed(1)}%`,
        objectiveId: objective.id,
        severity: 'high',
        priority: 'critical',
        detectedCause,
        mitigationPlan,
        createdAt: new Date().toISOString(),
        read: false,
      });
    }
  }
  
  return alerts;
};

// User Story 1: Detecta caídas de KPIs críticos
const detectCriticalKPIDrops = async (role?: 'entrenador' | 'gimnasio'): Promise<Alert[]> => {
  const kpis = await getKPIs(role);
  const objectives = await getObjectives({}, role);
  const alerts: Alert[] = [];
  
  // Filtrar solo KPIs críticos
  const criticalKPIs = kpis.filter(kpi => kpi.critical && kpi.enabled && kpi.target);
  
  for (const kpi of criticalKPIs) {
    // Buscar objetivo relacionado con este KPI
    const relatedObjective = objectives.find(obj => obj.metric === kpi.metric);
    
    if (!relatedObjective || !kpi.target) continue;
    
    // Calcular si el KPI ha caído por debajo del umbral crítico
    const currentValue = relatedObjective.currentValue;
    const targetValue = kpi.target;
    const threshold = kpi.criticalThreshold || 10; // Por defecto 10% por debajo del target
    const thresholdValue = targetValue * (1 - threshold / 100);
    
    if (currentValue < thresholdValue) {
      const dropPercent = ((targetValue - currentValue) / targetValue) * 100;
      
      const detectedCause: DetectedCause = {
        type: 'kpi_drop',
        description: `${kpi.name} ha caído un ${dropPercent.toFixed(1)}% por debajo del objetivo`,
        details: {
          currentValue,
          expectedValue: targetValue,
          threshold: thresholdValue,
          deviation: dropPercent,
        },
      };
      
      const mitigationPlan = await generateMitigationPlan('kpi_critical_drop', detectedCause, relatedObjective, kpi);
      const priority = calculateAlertPriority('kpi_critical_drop', dropPercent > 20 ? 'high' : 'medium', detectedCause);
      
      alerts.push({
        id: `kpi-drop-${kpi.id}-${Date.now()}`,
        type: 'error',
        alertType: 'kpi_critical_drop',
        title: `KPI crítico en caída: ${kpi.name}`,
        message: `${kpi.name} ha caído un ${dropPercent.toFixed(1)}% por debajo del objetivo (${targetValue} ${kpi.unit}). Valor actual: ${currentValue} ${kpi.unit}`,
        objectiveId: relatedObjective.id,
        kpiId: kpi.id,
        metricId: kpi.metric,
        severity: dropPercent > 20 ? 'high' : 'medium',
        priority,
        detectedCause,
        mitigationPlan,
        createdAt: new Date().toISOString(),
        read: false,
      });
    }
  }
  
  return alerts;
};

// User Story 1: Detecta objetivos que no se han actualizado
const detectStaleObjectives = async (role?: 'entrenador' | 'gimnasio'): Promise<Alert[]> => {
  const objectives = await getObjectives({}, role);
  const alerts: Alert[] = [];
  const staleThresholdDays = 7; // Alertar si no se actualiza en 7 días
  
  for (const objective of objectives) {
    // Solo verificar objetivos activos
    if (objective.status === 'achieved' || objective.status === 'failed') continue;
    
    const lastUpdate = new Date(objective.updatedAt);
    const now = new Date();
    const daysSinceUpdate = Math.ceil((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceUpdate >= staleThresholdDays) {
      const detectedCause: DetectedCause = {
        type: 'stale_objective',
        description: `El objetivo no ha sido actualizado en ${daysSinceUpdate} días`,
        details: {
          daysSinceUpdate,
          daysUntilDeadline: Math.ceil((new Date(objective.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
        },
      };
      
      const mitigationPlan = await generateMitigationPlan('objective_not_updated', detectedCause, objective);
      const priority = calculateAlertPriority('objective_not_updated', daysSinceUpdate > 14 ? 'high' : 'medium', detectedCause);
      
      alerts.push({
        id: `stale-${objective.id}-${Date.now()}`,
        type: 'warning',
        alertType: 'objective_not_updated',
        title: `Objetivo sin actualizar: ${objective.title}`,
        message: `El objetivo "${objective.title}" no ha sido actualizado en ${daysSinceUpdate} días. Última actualización: ${lastUpdate.toLocaleDateString('es-ES')}`,
        objectiveId: objective.id,
        severity: daysSinceUpdate > 14 ? 'high' : 'medium',
        priority,
        detectedCause,
        mitigationPlan,
        createdAt: new Date().toISOString(),
        read: false,
      });
    }
  }
  
  return alerts;
};

// Mock data - En producción esto vendría de una API real
const mockAlerts: Alert[] = [];

/**
 * User Story 1 & 2: Obtiene todas las alertas detectadas automáticamente
 * Incluye: desviaciones de objetivos, caídas de KPIs críticos, objetivos no actualizados
 */
export const getAlerts = async (role?: 'entrenador' | 'gimnasio'): Promise<Alert[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Cargar alertas guardadas desde localStorage
  const savedAlerts = localStorage.getItem('alerts-data');
  let existingAlerts: Alert[] = savedAlerts ? JSON.parse(savedAlerts) : [];
  
  // Detectar nuevas alertas
  const [deviationAlerts, kpiDropAlerts, staleAlerts] = await Promise.all([
    detectObjectiveDeviations(role),
    detectCriticalKPIDrops(role),
    detectStaleObjectives(role),
  ]);
  
  // Combinar todas las alertas
  const allDetectedAlerts = [...deviationAlerts, ...kpiDropAlerts, ...staleAlerts];
  
  // Filtrar alertas duplicadas (mismo tipo y objetivo)
  const uniqueAlerts = new Map<string, Alert>();
  
  // Agregar alertas existentes primero
  existingAlerts.forEach(alert => {
    if (!alert.read) {
      uniqueAlerts.set(`${alert.alertType}-${alert.objectiveId || alert.kpiId}`, alert);
    }
  });
  
  // Agregar nuevas alertas detectadas (sobrescriben las existentes si son del mismo tipo)
  allDetectedAlerts.forEach(alert => {
    const key = `${alert.alertType}-${alert.objectiveId || alert.kpiId}`;
    const existing = uniqueAlerts.get(key);
    
    // Solo agregar si no existe o si la nueva es más reciente
    if (!existing || new Date(alert.createdAt) > new Date(existing.createdAt)) {
      uniqueAlerts.set(key, alert);
    }
  });
  
  const finalAlerts = Array.from(uniqueAlerts.values());
  
  // Guardar alertas actualizadas
  localStorage.setItem('alerts-data', JSON.stringify(finalAlerts));
  
  // Ordenar por prioridad y fecha (críticas primero, luego por fecha)
  return finalAlerts.sort((a, b) => {
    const priorityOrder: Record<AlertPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

/**
 * Obtiene alertas críticas (prioridad critical o high)
 */
export const getCriticalAlerts = async (role?: 'entrenador' | 'gimnasio'): Promise<Alert[]> => {
  const allAlerts = await getAlerts(role);
  return allAlerts.filter(alert => 
    (alert.priority === 'critical' || alert.priority === 'high') && !alert.read
  );
};

/**
 * User Story: Crea una alerta automática basada en umbrales de color
 * Actualizado para usar la nueva estructura de Alert con prioridad y mitigación
 */
export const createAutomaticAlert = async (
  objective: Objective,
  alertType: 'yellow' | 'red' | 'deviation',
  deviation?: number
): Promise<Alert> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  let title = '';
  let message = '';
  let type: Alert['type'] = 'warning';
  let alertTypeEnum: AlertType = 'objective_at_risk';
  let detectedCause: DetectedCause | undefined;
  
  if (alertType === 'yellow') {
    title = `Objetivo "${objective.title}" en zona amarilla`;
    message = `El objetivo "${objective.title}" ha entrado en la zona amarilla (${objective.progress.toFixed(1)}% de progreso). Se recomienda revisar el progreso.`;
    type = 'warning';
    alertTypeEnum = 'objective_at_risk';
  } else if (alertType === 'red') {
    title = `Objetivo "${objective.title}" en zona roja`;
    message = `El objetivo "${objective.title}" ha entrado en la zona roja (${objective.progress.toFixed(1)}% de progreso). Requiere atención inmediata.`;
    type = 'error';
    alertTypeEnum = 'objective_at_risk';
    detectedCause = {
      type: 'threshold_exceeded',
      description: `El objetivo ha entrado en zona roja`,
      details: {
        currentValue: objective.progress,
        threshold: objective.colorThresholds?.red || 50,
      },
    };
  } else if (alertType === 'deviation' && deviation !== undefined) {
    title = `Desviación detectada en "${objective.title}"`;
    message = `El objetivo "${objective.title}" se ha desviado ${deviation.toFixed(1)}% del progreso esperado. Progreso actual: ${objective.progress.toFixed(1)}%.`;
    type = 'warning';
    alertTypeEnum = 'objective_deviation';
    detectedCause = {
      type: 'threshold_exceeded',
      description: `El objetivo se ha desviado ${deviation.toFixed(1)}% del progreso esperado`,
      details: {
        deviation,
        currentValue: objective.progress,
      },
    };
  }
  
  // Generar plan de mitigación si hay causa detectada
  let mitigationPlan: MitigationPlan | undefined;
  if (detectedCause) {
    mitigationPlan = await generateMitigationPlan(alertTypeEnum, detectedCause, objective);
  }
  
  const priority = calculateAlertPriority(alertTypeEnum, alertType === 'red' ? 'high' : 'medium', detectedCause);
  
  const newAlert: Alert = {
    id: `auto-alert-${objective.id}-${Date.now()}`,
    type,
    alertType: alertTypeEnum,
    title,
    message,
    objectiveId: objective.id,
    severity: alertType === 'red' ? 'high' : 'medium',
    priority,
    detectedCause,
    mitigationPlan,
    createdAt: new Date().toISOString(),
    read: false,
  };
  
  // Guardar en localStorage
  const savedAlerts = localStorage.getItem('alerts-data');
  const alerts: Alert[] = savedAlerts ? JSON.parse(savedAlerts) : [];
  alerts.push(newAlert);
  localStorage.setItem('alerts-data', JSON.stringify(alerts));
  
  return newAlert;
};

/**
 * User Story 2: Marca una alerta como leída
 */
export const markAlertAsRead = async (alertId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const savedAlerts = localStorage.getItem('alerts-data');
  if (!savedAlerts) return;
  
  const alerts: Alert[] = JSON.parse(savedAlerts);
  const updatedAlerts = alerts.map(alert => 
    alert.id === alertId ? { ...alert, read: true } : alert
  );
  
  localStorage.setItem('alerts-data', JSON.stringify(updatedAlerts));
};

/**
 * User Story 2: Reconoce una alerta (acknowledge)
 */
export const acknowledgeAlert = async (alertId: string, acknowledgedBy?: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const savedAlerts = localStorage.getItem('alerts-data');
  if (!savedAlerts) return;
  
  const alerts: Alert[] = JSON.parse(savedAlerts);
  const updatedAlerts = alerts.map(alert => 
    alert.id === alertId 
      ? { ...alert, acknowledged: true, acknowledgedAt: new Date().toISOString(), acknowledgedBy } 
      : alert
  );
  
  localStorage.setItem('alerts-data', JSON.stringify(updatedAlerts));
};

/**
 * User Story: Convierte una alerta en un ajuste de objetivo
 */
export const convertAlertToAdjustment = async (
  alertId: string,
  adjustmentData: {
    type: 'target_value' | 'deadline' | 'metric' | 'responsible' | 'other';
    newValue: any;
    reason: string;
  }
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const savedAlerts = localStorage.getItem('alerts-data');
  if (!savedAlerts) throw new Error('Alert not found');
  
  const alerts: Alert[] = JSON.parse(savedAlerts);
  const alert = alerts.find(a => a.id === alertId);
  if (!alert || !alert.objectiveId) throw new Error('Alert or objective not found');
  
  // Importar funciones de objectives
  const { createQuickAdjustment } = await import('./objectives');
  
  // Crear el ajuste
  const adjustment = await createQuickAdjustment(alert.objectiveId, {
    ...adjustmentData,
    createdBy: 'user',
    createdByName: 'Manager',
  });
  
  // Actualizar la alerta con la conversión
  const updatedAlerts = alerts.map(a => 
    a.id === alertId 
      ? {
          ...a,
          conversion: {
            type: 'adjustment' as const,
            convertedAt: new Date().toISOString(),
            convertedBy: 'user',
            convertedByName: 'Manager',
            convertedToId: adjustment.id,
            convertedToTitle: `Ajuste: ${adjustmentData.type}`,
          },
          result: {
            status: 'converted' as const,
            resultDescription: `Convertida en ajuste de ${adjustmentData.type}`,
            resolvedAt: new Date().toISOString(),
            resolvedBy: 'user',
            resolvedByName: 'Manager',
            conversion: {
              type: 'adjustment' as const,
              convertedAt: new Date().toISOString(),
              convertedBy: 'user',
              convertedByName: 'Manager',
              convertedToId: adjustment.id,
              convertedToTitle: `Ajuste: ${adjustmentData.type}`,
            },
          },
        }
      : a
  );
  
  localStorage.setItem('alerts-data', JSON.stringify(updatedAlerts));
};

/**
 * User Story: Convierte una alerta en una tarea
 */
export const convertAlertToTask = async (
  alertId: string,
  taskData: {
    title: string;
    description?: string;
    priority: 'high' | 'medium' | 'low';
    assignedTo?: string;
    assignedToName?: string;
    dueDate?: string;
  }
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const savedAlerts = localStorage.getItem('alerts-data');
  if (!savedAlerts) throw new Error('Alert not found');
  
  const alerts: Alert[] = JSON.parse(savedAlerts);
  const alert = alerts.find(a => a.id === alertId);
  if (!alert || !alert.objectiveId) throw new Error('Alert or objective not found');
  
  // Importar funciones de objectives
  const { createQuickTask } = await import('./objectives');
  
  // Crear la tarea
  const task = await createQuickTask(alert.objectiveId, {
    ...taskData,
    blockerReason: `Generada desde alerta: ${alert.title}`,
    createdBy: 'user',
    createdByName: 'Manager',
  });
  
  // Actualizar la alerta con la conversión
  const updatedAlerts = alerts.map(a => 
    a.id === alertId 
      ? {
          ...a,
          conversion: {
            type: 'task' as const,
            convertedAt: new Date().toISOString(),
            convertedBy: 'user',
            convertedByName: 'Manager',
            convertedToId: task.id,
            convertedToTitle: task.title,
          },
          result: {
            status: 'converted' as const,
            resultDescription: `Convertida en tarea: ${task.title}`,
            resolvedAt: new Date().toISOString(),
            resolvedBy: 'user',
            resolvedByName: 'Manager',
            conversion: {
              type: 'task' as const,
              convertedAt: new Date().toISOString(),
              convertedBy: 'user',
              convertedByName: 'Manager',
              convertedToId: task.id,
              convertedToTitle: task.title,
            },
          },
        }
      : a
  );
  
  localStorage.setItem('alerts-data', JSON.stringify(updatedAlerts));
};

/**
 * User Story: Convierte una alerta en un plan de acción
 */
export const convertAlertToActionPlan = async (
  alertId: string,
  actionPlanData: {
    title: string;
    description?: string;
    steps: {
      id: string;
      title: string;
      description: string;
      completed: boolean;
      priority: 'high' | 'medium' | 'low';
    }[];
  }
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const savedAlerts = localStorage.getItem('alerts-data');
  if (!savedAlerts) throw new Error('Alert not found');
  
  const alerts: Alert[] = JSON.parse(savedAlerts);
  const alert = alerts.find(a => a.id === alertId);
  if (!alert || !alert.objectiveId) throw new Error('Alert or objective not found');
  
  // Importar funciones de objectives
  const { addActionPlanToObjective } = await import('./objectives');
  
  // Crear el plan de acción
  const actionPlan = await addActionPlanToObjective(alert.objectiveId, {
    title: actionPlanData.title,
    description: actionPlanData.description,
    steps: actionPlanData.steps.map(step => ({
      ...step,
      dueDate: undefined,
      assignedTo: undefined,
      assignedToName: undefined,
    })),
    createdBy: 'user',
    status: 'active',
  });
  
  // Actualizar la alerta con la conversión
  const updatedAlerts = alerts.map(a => 
    a.id === alertId 
      ? {
          ...a,
          conversion: {
            type: 'action_plan' as const,
            convertedAt: new Date().toISOString(),
            convertedBy: 'user',
            convertedByName: 'Manager',
            convertedToId: actionPlan.id,
            convertedToTitle: actionPlan.title,
          },
          result: {
            status: 'converted' as const,
            resultDescription: `Convertida en plan de acción: ${actionPlan.title}`,
            resolvedAt: new Date().toISOString(),
            resolvedBy: 'user',
            resolvedByName: 'Manager',
            conversion: {
              type: 'action_plan' as const,
              convertedAt: new Date().toISOString(),
              convertedBy: 'user',
              convertedByName: 'Manager',
              convertedToId: actionPlan.id,
              convertedToTitle: actionPlan.title,
            },
          },
        }
      : a
  );
  
  localStorage.setItem('alerts-data', JSON.stringify(updatedAlerts));
};

/**
 * User Story: Obtiene el historial de alertas por objetivo
 */
export const getAlertHistoryByObjective = async (objectiveId: string): Promise<Alert[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const savedAlerts = localStorage.getItem('alerts-data');
  if (!savedAlerts) return [];
  
  const alerts: Alert[] = JSON.parse(savedAlerts);
  
  // Filtrar alertas por objetivo y ordenar por fecha (más recientes primero)
  return alerts
    .filter(alert => alert.objectiveId === objectiveId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

/**
 * User Story: Actualiza el resultado de una alerta (efectividad, notas, etc.)
 */
export const updateAlertResult = async (
  alertId: string,
  resultData: {
    status?: 'resolved' | 'mitigated' | 'dismissed' | 'converted' | 'pending';
    resultDescription?: string;
    wasEffective?: boolean;
    effectivenessNotes?: string;
  }
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const savedAlerts = localStorage.getItem('alerts-data');
  if (!savedAlerts) throw new Error('Alert not found');
  
  const alerts: Alert[] = JSON.parse(savedAlerts);
  const alert = alerts.find(a => a.id === alertId);
  if (!alert) throw new Error('Alert not found');
  
  const updatedAlerts = alerts.map(a => 
    a.id === alertId 
      ? {
          ...a,
          result: {
            ...a.result,
            ...resultData,
            resolvedAt: resultData.status === 'resolved' || resultData.status === 'mitigated' 
              ? new Date().toISOString() 
              : a.result?.resolvedAt,
            resolvedBy: resultData.status === 'resolved' || resultData.status === 'mitigated'
              ? 'user'
              : a.result?.resolvedBy,
            resolvedByName: resultData.status === 'resolved' || resultData.status === 'mitigated'
              ? 'Manager'
              : a.result?.resolvedByName,
            conversion: a.conversion || a.result?.conversion,
          },
        }
      : a
  );
  
  localStorage.setItem('alerts-data', JSON.stringify(updatedAlerts));
};

