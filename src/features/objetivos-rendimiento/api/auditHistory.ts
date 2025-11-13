import { AuditHistoryEntry, AuditHistoryFilters, AuditEntityType, AuditActionType, AuditChange } from '../types';

// Mock data - En producción esto sería llamadas a una API real
const mockAuditHistory: AuditHistoryEntry[] = [];

/**
 * User Story 2: Registrar entrada en el historial de auditoría
 */
export const recordAuditEntry = async (
  entry: Omit<AuditHistoryEntry, 'id' | 'timestamp'>
): Promise<AuditHistoryEntry> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const auditEntry: AuditHistoryEntry = {
    ...entry,
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  };
  
  // Guardar en localStorage
  const savedHistory = localStorage.getItem('audit-history');
  const history = savedHistory ? JSON.parse(savedHistory) : [...mockAuditHistory];
  history.push(auditEntry);
  
  // Mantener solo los últimos 10000 registros para evitar que localStorage se llene
  if (history.length > 10000) {
    history.splice(0, history.length - 10000);
  }
  
  localStorage.setItem('audit-history', JSON.stringify(history));
  
  return auditEntry;
};

/**
 * User Story 2: Obtener historial de auditoría con filtros
 */
export const getAuditHistory = async (
  filters?: AuditHistoryFilters
): Promise<AuditHistoryEntry[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const savedHistory = localStorage.getItem('audit-history');
  let history: AuditHistoryEntry[] = savedHistory ? JSON.parse(savedHistory) : [...mockAuditHistory];
  
  // Aplicar filtros
  if (filters) {
    if (filters.entityType) {
      history = history.filter(entry => entry.entityType === filters.entityType);
    }
    
    if (filters.entityId) {
      history = history.filter(entry => entry.entityId === filters.entityId);
    }
    
    if (filters.action) {
      history = history.filter(entry => entry.action === filters.action);
    }
    
    if (filters.performedBy) {
      history = history.filter(entry => entry.performedBy === filters.performedBy);
    }
    
    if (filters.dateFrom) {
      history = history.filter(entry => entry.timestamp >= filters.dateFrom!);
    }
    
    if (filters.dateTo) {
      history = history.filter(entry => entry.timestamp <= filters.dateTo!);
    }
    
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      history = history.filter(entry => 
        entry.entityName.toLowerCase().includes(query) ||
        entry.performedByName.toLowerCase().includes(query) ||
        (entry.performedByEmail && entry.performedByEmail.toLowerCase().includes(query))
      );
    }
  }
  
  // Ordenar por fecha descendente (más recientes primero)
  history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return history;
};

/**
 * User Story 2: Obtener historial de auditoría de una entidad específica
 */
export const getEntityAuditHistory = async (
  entityType: AuditEntityType,
  entityId: string
): Promise<AuditHistoryEntry[]> => {
  return getAuditHistory({ entityType, entityId });
};

/**
 * User Story 2: Crear cambios de auditoría comparando dos objetos
 */
export const createAuditChanges = (
  oldValue: any,
  newValue: any,
  fieldLabels: Record<string, string> = {}
): AuditChange[] => {
  const changes: AuditChange[] = [];
  
  // Comparar campos comunes
  const fieldsToCompare = [
    'title', 'description', 'metric', 'targetValue', 'currentValue', 
    'unit', 'deadline', 'status', 'responsible', 'category', 'progress',
    'name', 'enabled', 'target', 'thresholds', 'formula'
  ];
  
  for (const field of fieldsToCompare) {
    if (oldValue[field] !== undefined || newValue[field] !== undefined) {
      const oldVal = oldValue[field];
      const newVal = newValue[field];
      
      if (oldVal !== newVal) {
        let changeType: 'added' | 'modified' | 'removed' = 'modified';
        if (oldVal === undefined || oldVal === null) {
          changeType = 'added';
        } else if (newVal === undefined || newVal === null) {
          changeType = 'removed';
        }
        
        changes.push({
          field,
          fieldLabel: fieldLabels[field] || field,
          oldValue: oldVal,
          newValue: newVal,
          changeType,
        });
      }
    }
  }
  
  return changes;
};

/**
 * User Story 2: Helper para registrar cambios en objetivos
 */
export const recordObjectiveChange = async (
  objective: any,
  previousObjective: any | null,
  action: AuditActionType,
  performedBy: string,
  performedByName: string,
  performedByEmail?: string,
  reason?: string,
  metadata?: any
): Promise<AuditHistoryEntry> => {
  const changes = previousObjective 
    ? createAuditChanges(previousObjective, objective, {
        title: 'Título',
        description: 'Descripción',
        metric: 'Métrica',
        targetValue: 'Valor Objetivo',
        currentValue: 'Valor Actual',
        unit: 'Unidad',
        deadline: 'Fecha Límite',
        status: 'Estado',
        responsible: 'Responsable',
        category: 'Categoría',
        progress: 'Progreso',
      })
    : [];
  
  return recordAuditEntry({
    entityType: 'objective',
    entityId: objective.id,
    entityName: objective.title || objective.name || 'Objetivo',
    action,
    changes: changes.length > 0 ? changes : undefined,
    performedBy,
    performedByName,
    performedByEmail,
    reason,
    metadata,
  });
};

/**
 * User Story 2: Helper para registrar cambios en KPIs
 */
export const recordKPIChange = async (
  kpi: any,
  previousKPI: any | null,
  action: AuditActionType,
  performedBy: string,
  performedByName: string,
  performedByEmail?: string,
  reason?: string,
  metadata?: any
): Promise<AuditHistoryEntry> => {
  const changes = previousKPI 
    ? createAuditChanges(previousKPI, kpi, {
        name: 'Nombre',
        description: 'Descripción',
        metric: 'Métrica',
        target: 'Objetivo',
        unit: 'Unidad',
        category: 'Categoría',
        enabled: 'Habilitado',
        thresholds: 'Umbrales',
        formula: 'Fórmula',
      })
    : [];
  
  return recordAuditEntry({
    entityType: 'kpi',
    entityId: kpi.id,
    entityName: kpi.name || 'KPI',
    action,
    changes: changes.length > 0 ? changes : undefined,
    performedBy,
    performedByName,
    performedByEmail,
    reason,
    metadata,
  });
};

/**
 * User Story 2: Helper para registrar cambios en planes de acción
 */
export const recordActionPlanChange = async (
  actionPlan: any,
  previousActionPlan: any | null,
  action: AuditActionType,
  performedBy: string,
  performedByName: string,
  performedByEmail?: string,
  reason?: string,
  metadata?: any
): Promise<AuditHistoryEntry> => {
  const changes = previousActionPlan 
    ? createAuditChanges(previousActionPlan, actionPlan, {
        title: 'Título',
        description: 'Descripción',
        status: 'Estado',
      })
    : [];
  
  return recordAuditEntry({
    entityType: 'action_plan',
    entityId: actionPlan.id,
    entityName: actionPlan.title || 'Plan de Acción',
    action,
    changes: changes.length > 0 ? changes : undefined,
    performedBy,
    performedByName,
    performedByEmail,
    reason,
    metadata,
  });
};

