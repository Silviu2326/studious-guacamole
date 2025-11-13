import { CustomAlertRule, AlertRuleTestResult, Alert, Objective, AlertCondition, AlertConditionLogic } from '../types';
import { getObjectives } from './objectives';

/**
 * Obtiene todas las reglas de alerta personalizadas
 */
export const getCustomAlertRules = async (role?: 'entrenador' | 'gimnasio'): Promise<CustomAlertRule[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const saved = localStorage.getItem('custom-alert-rules');
  if (!saved) return [];
  
  const rules: CustomAlertRule[] = JSON.parse(saved);
  return rules.filter(rule => !role || rule.enabled);
};

/**
 * Obtiene una regla de alerta personalizada por ID
 */
export const getCustomAlertRule = async (ruleId: string): Promise<CustomAlertRule | null> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const saved = localStorage.getItem('custom-alert-rules');
  if (!saved) return null;
  
  const rules: CustomAlertRule[] = JSON.parse(saved);
  return rules.find(rule => rule.id === ruleId) || null;
};

/**
 * Crea una nueva regla de alerta personalizada
 */
export const createCustomAlertRule = async (rule: Omit<CustomAlertRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomAlertRule> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const saved = localStorage.getItem('custom-alert-rules');
  const rules: CustomAlertRule[] = saved ? JSON.parse(saved) : [];
  
  const newRule: CustomAlertRule = {
    ...rule,
    id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    active: false, // Por defecto inactiva hasta que se pruebe
  };
  
  rules.push(newRule);
  localStorage.setItem('custom-alert-rules', JSON.stringify(rules));
  
  return newRule;
};

/**
 * Actualiza una regla de alerta personalizada
 */
export const updateCustomAlertRule = async (ruleId: string, updates: Partial<CustomAlertRule>): Promise<CustomAlertRule> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const saved = localStorage.getItem('custom-alert-rules');
  if (!saved) throw new Error('Rule not found');
  
  const rules: CustomAlertRule[] = JSON.parse(saved);
  const index = rules.findIndex(rule => rule.id === ruleId);
  
  if (index === -1) throw new Error('Rule not found');
  
  rules[index] = {
    ...rules[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem('custom-alert-rules', JSON.stringify(rules));
  
  return rules[index];
};

/**
 * Elimina una regla de alerta personalizada
 */
export const deleteCustomAlertRule = async (ruleId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const saved = localStorage.getItem('custom-alert-rules');
  if (!saved) return;
  
  const rules: CustomAlertRule[] = JSON.parse(saved);
  const filtered = rules.filter(rule => rule.id !== ruleId);
  
  localStorage.setItem('custom-alert-rules', JSON.stringify(filtered));
};

/**
 * Evalúa una condición contra un objetivo
 */
const evaluateCondition = (condition: AlertCondition, objective: Objective): boolean => {
  const { field, operator, value, value2 } = condition;
  
  let fieldValue: any;
  
  switch (field) {
    case 'progress':
      fieldValue = objective.progress;
      break;
    case 'currentValue':
      fieldValue = objective.currentValue;
      break;
    case 'targetValue':
      fieldValue = objective.targetValue;
      break;
    case 'deviation': {
      const now = new Date();
      const deadline = new Date(objective.deadline);
      const createdAt = new Date(objective.createdAt);
      const totalDays = Math.ceil((deadline.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      const elapsedDays = Math.ceil((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      const expectedProgress = totalDays > 0 ? Math.min((elapsedDays / totalDays) * 100, 100) : 0;
      fieldValue = expectedProgress - objective.progress;
      break;
    }
    case 'daysUntilDeadline': {
      const now = new Date();
      const deadline = new Date(objective.deadline);
      fieldValue = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      break;
    }
    case 'daysSinceUpdate': {
      const now = new Date();
      const updatedAt = new Date(objective.updatedAt);
      fieldValue = Math.ceil((now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));
      break;
    }
    case 'status':
      fieldValue = objective.status;
      break;
    case 'metric':
      fieldValue = objective.metric;
      break;
    case 'category':
      fieldValue = objective.category;
      break;
    default:
      return false;
  }
  
  // Evaluar operador
  switch (operator) {
    case 'greater_than':
      return fieldValue > value;
    case 'less_than':
      return fieldValue < value;
    case 'equals':
      return fieldValue === value || String(fieldValue).toLowerCase() === String(value).toLowerCase();
    case 'not_equals':
      return fieldValue !== value && String(fieldValue).toLowerCase() !== String(value).toLowerCase();
    case 'greater_or_equal':
      return fieldValue >= value;
    case 'less_or_equal':
      return fieldValue <= value;
    case 'between':
      return value2 !== undefined && fieldValue >= value && fieldValue <= value2;
    case 'contains':
      return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
    case 'not_contains':
      return !String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
    default:
      return false;
  }
};

/**
 * Evalúa todas las condiciones de una regla contra un objetivo
 */
const evaluateRuleConditions = (rule: CustomAlertRule, objective: Objective): boolean => {
  if (rule.conditions.length === 0) return false;
  
  // Filtrar por responsables si está configurado
  if (rule.responsibleIds && rule.responsibleIds.length > 0) {
    if (!objective.responsible || !rule.responsibleIds.includes(objective.responsible)) {
      return false;
    }
  }
  
  // Filtrar por categoría si está configurado
  if (rule.category && objective.category !== rule.category) {
    return false;
  }
  
  // Filtrar por IDs de objetivos si está configurado
  if (rule.objectiveIds && rule.objectiveIds.length > 0) {
    if (!rule.objectiveIds.includes(objective.id)) {
      return false;
    }
  }
  
  // Evaluar condiciones
  const results = rule.conditions.map(condition => evaluateCondition(condition, objective));
  
  if (rule.conditionLogic === 'AND') {
    return results.every(result => result === true);
  } else {
    return results.some(result => result === true);
  }
};

/**
 * Prueba una regla de alerta personalizada
 */
export const testCustomAlertRule = async (
  rule: CustomAlertRule,
  testedBy: string,
  testedByName: string
): Promise<AlertRuleTestResult> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Obtener todos los objetivos
  const objectives = await getObjectives({}, undefined);
  
  // Filtrar objetivos que cumplen las condiciones
  const matchedObjectives = objectives.filter(obj => evaluateRuleConditions(rule, obj));
  
  // Generar alertas de ejemplo
  const sampleAlerts: Alert[] = matchedObjectives.slice(0, 5).map(objective => {
    const title = rule.titleTemplate 
      ? rule.titleTemplate.replace('{objective}', objective.title)
      : `Alerta: ${objective.title}`;
    
    const message = rule.messageTemplate
      ? rule.messageTemplate.replace('{objective}', objective.title).replace('{progress}', objective.progress.toFixed(1))
      : `El objetivo "${objective.title}" cumple las condiciones de la regla "${rule.name}"`;
    
    return {
      id: `test-alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: rule.alertType === 'objective_at_risk' ? 'error' : rule.alertType === 'objective_deviation' ? 'warning' : 'info',
      alertType: rule.alertType,
      title,
      message,
      objectiveId: objective.id,
      severity: rule.severity,
      priority: rule.priority,
      createdAt: new Date().toISOString(),
      read: false,
      customRuleId: rule.id,
    };
  });
  
  // Calcular nivel de ruido
  const totalObjectives = objectives.length;
  const matchPercentage = totalObjectives > 0 ? (matchedObjectives.length / totalObjectives) * 100 : 0;
  
  let noiseLevel: 'low' | 'medium' | 'high' = 'low';
  let noiseReason = '';
  const recommendations: string[] = [];
  
  if (matchPercentage > 50) {
    noiseLevel = 'high';
    noiseReason = `La regla coincide con más del 50% de los objetivos (${matchPercentage.toFixed(1)}%)`;
    recommendations.push('Considera agregar condiciones más específicas');
    recommendations.push('Filtra por responsables o categorías específicas');
  } else if (matchPercentage > 20) {
    noiseLevel = 'medium';
    noiseReason = `La regla coincide con ${matchPercentage.toFixed(1)}% de los objetivos`;
    recommendations.push('Considera agregar condiciones adicionales para reducir falsos positivos');
  } else {
    noiseReason = `La regla coincide con ${matchPercentage.toFixed(1)}% de los objetivos`;
  }
  
  if (matchedObjectives.length === 0) {
    recommendations.push('La regla no coincide con ningún objetivo. Verifica las condiciones.');
  }
  
  const testResult: AlertRuleTestResult = {
    id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ruleId: rule.id,
    testedAt: new Date().toISOString(),
    testedBy,
    testedByName,
    matchedObjectives: matchedObjectives.map(obj => obj.id),
    matchedCount: matchedObjectives.length,
    wouldGenerateAlerts: matchedObjectives.length,
    sampleAlerts,
    noiseLevel,
    noiseReason,
    recommendations,
  };
  
  // Guardar resultado de prueba en la regla
  const saved = localStorage.getItem('custom-alert-rules');
  if (saved) {
    const rules: CustomAlertRule[] = JSON.parse(saved);
    const index = rules.findIndex(r => r.id === rule.id);
    if (index !== -1) {
      if (!rules[index].testResults) {
        rules[index].testResults = [];
      }
      rules[index].testResults!.push(testResult);
      rules[index].lastTestedAt = testResult.testedAt;
      rules[index].lastTestedBy = testedBy;
      localStorage.setItem('custom-alert-rules', JSON.stringify(rules));
    }
  }
  
  return testResult;
};

/**
 * Activa una regla de alerta personalizada (después de probarla)
 */
export const activateCustomAlertRule = async (ruleId: string): Promise<CustomAlertRule> => {
  return updateCustomAlertRule(ruleId, { active: true, enabled: true });
};

/**
 * Desactiva una regla de alerta personalizada
 */
export const deactivateCustomAlertRule = async (ruleId: string): Promise<CustomAlertRule> => {
  return updateCustomAlertRule(ruleId, { active: false });
};

/**
 * Ejecuta todas las reglas activas y genera alertas
 */
export const executeActiveCustomAlertRules = async (role?: 'entrenador' | 'gimnasio'): Promise<Alert[]> => {
  const rules = await getCustomAlertRules(role);
  const activeRules = rules.filter(rule => rule.active && rule.enabled);
  
  const objectives = await getObjectives({}, role);
  const generatedAlerts: Alert[] = [];
  
  for (const rule of activeRules) {
    const matchedObjectives = objectives.filter(obj => evaluateRuleConditions(rule, obj));
    
    for (const objective of matchedObjectives) {
      // Verificar si ya existe una alerta similar reciente (últimas 24 horas)
      const existingAlerts = localStorage.getItem('alerts-data');
      if (existingAlerts) {
        const alerts: Alert[] = JSON.parse(existingAlerts);
        const recentAlert = alerts.find(
          alert => 
            alert.customRuleId === rule.id &&
            alert.objectiveId === objective.id &&
            new Date(alert.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000
        );
        if (recentAlert) continue; // Ya existe una alerta reciente, no generar otra
      }
      
      const title = rule.titleTemplate 
        ? rule.titleTemplate.replace('{objective}', objective.title)
        : `Alerta: ${objective.title}`;
      
      const message = rule.messageTemplate
        ? rule.messageTemplate
            .replace('{objective}', objective.title)
            .replace('{progress}', objective.progress.toFixed(1))
            .replace('{currentValue}', objective.currentValue.toString())
            .replace('{targetValue}', objective.targetValue.toString())
        : `El objetivo "${objective.title}" cumple las condiciones de la regla "${rule.name}"`;
      
      const alert: Alert = {
        id: `custom-alert-${rule.id}-${objective.id}-${Date.now()}`,
        type: rule.alertType === 'objective_at_risk' ? 'error' : rule.alertType === 'objective_deviation' ? 'warning' : 'info',
        alertType: rule.alertType,
        title,
        message,
        objectiveId: objective.id,
        severity: rule.severity,
        priority: rule.priority,
        createdAt: new Date().toISOString(),
        read: false,
        customRuleId: rule.id,
      };
      
      generatedAlerts.push(alert);
    }
  }
  
  // Guardar alertas generadas
  if (generatedAlerts.length > 0) {
    const existingAlerts = localStorage.getItem('alerts-data');
    const alerts: Alert[] = existingAlerts ? JSON.parse(existingAlerts) : [];
    alerts.push(...generatedAlerts);
    localStorage.setItem('alerts-data', JSON.stringify(alerts));
  }
  
  return generatedAlerts;
};

