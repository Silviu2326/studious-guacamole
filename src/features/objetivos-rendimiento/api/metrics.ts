import { KPI, Metric, TimeSeriesData, GlobalFilters, MultiKPIComparison, KPIVersion, KPIVersionHistoryEntry, KPIChange, KPIToObjectiveMapping, Objective } from '../types';

const mockKPIs: KPI[] = [
  {
    id: 'facturacion',
    name: 'Facturación',
    description: 'Ingresos totales facturados',
    metric: 'facturacion',
    unit: '€',
    category: 'financiero',
    enabled: true,
    role: ['entrenador', 'gimnasio'],
    order: 1,
    visible: true,
    critical: true, // User Story 1: KPI crítico
    criticalThreshold: 10, // Alertar si cae 10% por debajo del target
  },
  {
    id: 'retencion',
    name: 'Retención de Clientes',
    description: 'Porcentaje de clientes que se mantienen activos',
    metric: 'retencion',
    unit: '%',
    category: 'operacional',
    enabled: true,
    role: ['entrenador', 'gimnasio'],
    order: 2,
    visible: true,
    critical: true, // User Story 1: KPI crítico
    criticalThreshold: 15, // Alertar si cae 15% por debajo del target
  },
  {
    id: 'nps',
    name: 'NPS (Net Promoter Score)',
    description: 'Puntuación de promotores netos - satisfacción del cliente',
    metric: 'nps',
    unit: 'puntos',
    category: 'operacional',
    enabled: true,
    role: ['entrenador', 'gimnasio'],
    order: 3,
    visible: true,
  },
  {
    id: 'adherencia',
    name: 'Adherencia de Clientes',
    description: 'Porcentaje de clientes que cumplen con sus entrenamientos',
    metric: 'adherencia',
    unit: '%',
    category: 'operacional',
    enabled: true,
    role: ['entrenador'],
    order: 4,
    visible: true,
    critical: true, // User Story 1: KPI crítico para entrenadores
    criticalThreshold: 12, // Alertar si cae 12% por debajo del target
  },
  {
    id: 'ocupacion',
    name: 'Ocupación Media',
    description: 'Porcentaje medio de ocupación de las instalaciones',
    metric: 'ocupacion',
    unit: '%',
    category: 'operacional',
    enabled: true,
    role: ['gimnasio'],
    order: 5,
    visible: true,
  },
  {
    id: 'tasa_bajas',
    name: 'Tasa de Bajas',
    description: 'Porcentaje de socios que dan de baja',
    metric: 'tasa_bajas',
    unit: '%',
    category: 'operacional',
    enabled: true,
    role: ['gimnasio'],
    order: 6,
    visible: true,
  },
];

export const getKPIs = async (role?: 'entrenador' | 'gimnasio'): Promise<KPI[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Load from localStorage if available
  const savedConfig = localStorage.getItem(`kpi-config-${role || 'all'}`);
  if (savedConfig) {
    try {
      const savedKPIs = JSON.parse(savedConfig);
      // Merge with defaults to ensure all KPIs exist
      const merged = mockKPIs.map(defaultKPI => {
        const saved = savedKPIs.find((k: KPI) => k.id === defaultKPI.id);
        return saved ? { ...defaultKPI, ...saved } : defaultKPI;
      });
      // Add any new KPIs from defaults that weren't saved
      savedKPIs.forEach((saved: KPI) => {
        if (!merged.find((k: KPI) => k.id === saved.id)) {
          merged.push(saved);
        }
      });
      const filtered = role ? merged.filter(kpi => kpi.role.includes(role)) : merged;
      return filtered.sort((a, b) => (a.order || 999) - (b.order || 999));
    } catch (e) {
      console.error('Error loading KPI config:', e);
    }
  }
  
  if (!role) return mockKPIs.sort((a, b) => (a.order || 999) - (b.order || 999));
  
  return mockKPIs
    .filter(kpi => kpi.role.includes(role))
    .sort((a, b) => (a.order || 999) - (b.order || 999));
};

export const getKPI = async (id: string): Promise<KPI | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockKPIs.find(kpi => kpi.id === id) || null;
};

export const createKPI = async (kpi: Omit<KPI, 'id'>): Promise<KPI> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newKPI: KPI = {
    ...kpi,
    id: Date.now().toString(),
  };
  
  mockKPIs.push(newKPI);
  
  // Save to localStorage
  const role = newKPI.role[0]; // Use first role for storage key
  const currentKPIs = await getKPIs(role as 'entrenador' | 'gimnasio');
  const updatedKPIs = [...currentKPIs, newKPI];
  localStorage.setItem(`kpi-config-${role}`, JSON.stringify(updatedKPIs));
  
  return newKPI;
};

export const updateKPI = async (
  id: string, 
  updates: Partial<KPI>,
  createVersion: boolean = true,
  changeNotes?: string,
  userId: string = 'user-1',
  userName: string = 'Usuario'
): Promise<KPI> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockKPIs.findIndex(kpi => kpi.id === id);
  if (index === -1) throw new Error('KPI not found');
  
  const previousKPI = { ...mockKPIs[index] };
  const updated = {
    ...previousKPI,
    ...updates,
  };
  
  mockKPIs[index] = updated;
  
  // User Story 2: Crear versión automáticamente si hay cambios significativos
  if (createVersion && Object.keys(updates).length > 0) {
    try {
      await createKPIVersion(id, updated, changeNotes, userId, userName);
    } catch (error) {
      console.error('Error creating KPI version:', error);
      // Continuar aunque falle la creación de versión
    }
  }
  
  // Save to localStorage
  const role = updated.role[0]; // Use first role for storage key
  const currentKPIs = await getKPIs(role as 'entrenador' | 'gimnasio');
  const updatedKPIs = currentKPIs.map(kpi => kpi.id === id ? updated : kpi);
  localStorage.setItem(`kpi-config-${role}`, JSON.stringify(updatedKPIs));
  
  return updated;
};

export const updateKPIsOrder = async (kpiIds: string[], role?: 'entrenador' | 'gimnasio'): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const currentKPIs = await getKPIs(role);
  const updatedKPIs = currentKPIs.map((kpi, index) => {
    const newOrder = kpiIds.indexOf(kpi.id);
    return {
      ...kpi,
      order: newOrder >= 0 ? newOrder : kpi.order || 999,
    };
  });
  
  const storageKey = role ? `kpi-config-${role}` : 'kpi-config-all';
  localStorage.setItem(storageKey, JSON.stringify(updatedKPIs));
};

export const getMetricsByCategory = async (category: string, role?: 'entrenador' | 'gimnasio'): Promise<Metric[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Esto sería una llamada real a la API que obtiene métricas filtradas
  return [];
};

// User Story 1: Obtener datos temporales para gráficos interactivos
export const getTimeSeriesData = async (
  metricId: string,
  role: 'entrenador' | 'gimnasio',
  period: 'week' | 'month' | 'quarter' | 'year' = 'month',
  filters?: GlobalFilters
): Promise<TimeSeriesData> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const kpi = mockKPIs.find(k => k.id === metricId);
  if (!kpi) {
    throw new Error(`KPI with id ${metricId} not found`);
  }
  
  // Generar datos temporales simulados
  const days = period === 'week' ? 7 : period === 'month' ? 30 : period === 'quarter' ? 90 : 365;
  const baseValue = role === 'entrenador' 
    ? (metricId === 'facturacion' ? 1000 : metricId === 'adherencia' ? 75 : metricId === 'retencion' ? 85 : 50)
    : (metricId === 'facturacion' ? 8000 : metricId === 'ocupacion' ? 65 : metricId === 'retencion' ? 82 : 50);
  
  const dataPoints = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Simular variación con tendencia y ruido
    const trend = 0.1 * (days - i) / days; // Tendencia creciente
    const noise = (Math.random() - 0.5) * 0.1; // Ruido aleatorio
    const value = baseValue * (1 + trend + noise);
    
    dataPoints.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(0, value),
      metricId,
      metricName: kpi.name,
      unit: kpi.unit,
      segmento: filters?.segmento || 'Todos',
      responsable: filters?.responsable || 'Todos',
      origen: filters?.origen || 'Todos',
    });
  }
  
  return {
    metricId,
    metricName: kpi.name,
    unit: kpi.unit,
    dataPoints,
  };
};

// User Story 2: Obtener comparación de múltiples KPIs
export const getMultiKPIComparison = async (
  kpiIds: string[],
  role: 'entrenador' | 'gimnasio',
  period: 'week' | 'month' | 'quarter' | 'year' = 'month',
  filters?: GlobalFilters
): Promise<MultiKPIComparison> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  if (kpiIds.length === 0) {
    throw new Error('At least one KPI must be selected');
  }
  
  const kpis = kpiIds
    .map(id => mockKPIs.find(k => k.id === id))
    .filter((k): k is KPI => k !== undefined)
    .filter(k => k.role.includes(role));
  
  if (kpis.length === 0) {
    throw new Error('No valid KPIs found for the selected role');
  }
  
  // Colores para cada KPI
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  
  const kpiConfigs = kpis.map((kpi, index) => ({
    id: kpi.id,
    name: kpi.name,
    unit: kpi.unit,
    color: colors[index % colors.length],
  }));
  
  // Generar datos temporales para todos los KPIs
  const days = period === 'week' ? 7 : period === 'month' ? 30 : period === 'quarter' ? 90 : 365;
  const today = new Date();
  
  // Valores base por KPI
  const baseValues: Record<string, number> = {
    facturacion: role === 'entrenador' ? 1000 : 8000,
    adherencia: 75,
    retencion: role === 'entrenador' ? 85 : 82,
    nps: 50,
    ocupacion: 65,
    tasa_bajas: 8,
  };
  
  const dataPoints: MultiKPIDataPoint[] = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const point: MultiKPIDataPoint = {
      date: date.toISOString().split('T')[0],
    };
    
    // Primero calcular todos los valores base
    kpis.forEach((kpi) => {
      const baseValue = baseValues[kpi.id] || 50;
      const trend = 0.1 * (days - i) / days;
      const noise = (Math.random() - 0.5) * 0.1;
      const value = baseValue * (1 + trend + noise);
      point[kpi.id] = Math.max(0, value);
    });
    
    // Luego aplicar correlaciones si aplican
    if (kpiIds.includes('tasa_bajas') && kpiIds.includes('adherencia')) {
      const adherenciaValue = point.adherencia as number;
      // Correlación inversa: si adherencia sube, tasa_bajas baja
      const correlationFactor = 1 - (adherenciaValue / 100 - 0.75) * 0.5;
      point.tasa_bajas = Math.max(0, baseValues.tasa_bajas * correlationFactor * (1 + (Math.random() - 0.5) * 0.1));
    }
    
    dataPoints.push(point);
  }
  
  // Calcular correlaciones
  const correlations: MultiKPIComparison['correlations'] = [];
  
  if (kpiIds.length >= 2) {
    // Calcular correlación entre adherencia y tasa_bajas si ambos están presentes
    if (kpiIds.includes('adherencia') && kpiIds.includes('tasa_bajas')) {
      const adherenciaValues = dataPoints.map(p => p.adherencia as number);
      const tasaBajasValues = dataPoints.map(p => p.tasa_bajas as number);
      
      // Calcular correlación de Pearson simplificada
      const meanAdherencia = adherenciaValues.reduce((a, b) => a + b, 0) / adherenciaValues.length;
      const meanTasaBajas = tasaBajasValues.reduce((a, b) => a + b, 0) / tasaBajasValues.length;
      
      let numerator = 0;
      let denomAdherencia = 0;
      let denomTasaBajas = 0;
      
      for (let i = 0; i < adherenciaValues.length; i++) {
        const diffAdherencia = adherenciaValues[i] - meanAdherencia;
        const diffTasaBajas = tasaBajasValues[i] - meanTasaBajas;
        numerator += diffAdherencia * diffTasaBajas;
        denomAdherencia += diffAdherencia * diffAdherencia;
        denomTasaBajas += diffTasaBajas * diffTasaBajas;
      }
      
      const correlation = numerator / Math.sqrt(denomAdherencia * denomTasaBajas);
      
      correlations.push({
        kpi1: 'adherencia',
        kpi2: 'tasa_bajas',
        correlation: isNaN(correlation) ? -0.7 : correlation,
        description: correlation < -0.5 
          ? 'Cuando sube la adherencia, baja la morosidad'
          : correlation > 0.5
          ? 'Cuando sube la adherencia, sube la morosidad'
          : 'No hay correlación significativa entre adherencia y morosidad',
      });
    }
  }
  
  return {
    kpis: kpiConfigs,
    dataPoints,
    correlations,
  };
};

// User Story 2: Obtener historial de versiones de un KPI
export const getKPIVersionHistory = async (kpiId: string): Promise<KPIVersionHistoryEntry[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const saved = localStorage.getItem(`kpi-version-history-${kpiId}`);
  if (saved) {
    return JSON.parse(saved);
  }
  
  return [];
};

// User Story 2: Crear nueva versión de un KPI
export const createKPIVersion = async (
  kpiId: string | KPI,
  kpi: KPI,
  changeNotes?: string,
  userId: string = 'user-1',
  userName: string = 'Usuario'
): Promise<KPIVersion> => {
  const actualKpiId = typeof kpiId === 'string' ? kpiId : kpiId.id;
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Obtener versión anterior
  const previousVersions = await getKPIVersionHistory(actualKpiId);
  const previousVersion = previousVersions.find(v => v.isCurrentVersion);
  
  // Calcular número de versión
  const versionNumber = previousVersions.length + 1;
  const version = `v${versionNumber}.0`;
  
  // Detectar cambios
  const changes: KPIChange[] = [];
  if (previousVersion) {
    // Obtener la versión anterior completa para comparar
    const previousVersionFull = await getKPIVersion(previousVersion.versionId);
    if (previousVersionFull) {
      const fieldMappings: Record<string, string> = {
        name: 'Nombre',
        description: 'Descripción',
        target: 'Objetivo',
        unit: 'Unidad',
        category: 'Categoría',
        critical: 'Crítico',
        criticalThreshold: 'Umbral Crítico',
        enabled: 'Estado',
        visible: 'Visible',
      };
      
      Object.keys(fieldMappings).forEach(field => {
        if ((kpi as any)[field] !== (previousVersionFull as any)[field]) {
          changes.push({
            field,
            oldValue: (previousVersionFull as any)[field],
            newValue: (kpi as any)[field],
            fieldLabel: fieldMappings[field],
          });
        }
      });
    }
  }
  
  // Crear nueva versión
  const newVersion: KPIVersion = {
    id: `version-${actualKpiId}-${Date.now()}`,
    kpiId: actualKpiId,
    version,
    name: kpi.name,
    description: kpi.description,
    metric: kpi.metric,
    target: kpi.target,
    unit: kpi.unit,
    category: kpi.category,
    enabled: kpi.enabled,
    role: kpi.role,
    order: kpi.order,
    visible: kpi.visible,
    critical: kpi.critical,
    criticalThreshold: kpi.criticalThreshold,
    isCustom: kpi.isCustom,
    formula: kpi.formula,
    dataSource: kpi.dataSource,
    thresholds: kpi.thresholds,
    responsibles: kpi.responsibles,
    family: kpi.family,
    frameworkId: kpi.frameworkId,
    frameworkName: kpi.frameworkName,
    autoCalculate: kpi.autoCalculate,
    calculationFrequency: kpi.calculationFrequency,
    createdAt: new Date().toISOString(),
    createdBy: userId,
    createdByName: userName,
    changeNotes,
    isCurrentVersion: true,
    previousVersionId: previousVersion?.versionId,
  };
  
  // Actualizar versiones anteriores para marcar como no actuales
  const allVersions = await getKPIVersionHistory(actualKpiId);
  allVersions.forEach(v => {
    v.isCurrentVersion = false;
  });
  
  // Crear entrada de historial
  const historyEntry: KPIVersionHistoryEntry = {
    id: `history-${actualKpiId}-${Date.now()}`,
    kpiId: actualKpiId,
    version,
    versionId: newVersion.id,
    changes,
    createdAt: new Date().toISOString(),
    createdBy: userId,
    createdByName: userName,
    changeNotes,
    isCurrentVersion: true,
  };
  
  // Guardar historial
  allVersions.push(historyEntry);
  localStorage.setItem(`kpi-version-history-${actualKpiId}`, JSON.stringify(allVersions));
  
  // Guardar versión completa
  const savedVersions = localStorage.getItem('kpi-versions');
  const versions: KPIVersion[] = savedVersions ? JSON.parse(savedVersions) : [];
  versions.push(newVersion);
  localStorage.setItem('kpi-versions', JSON.stringify(versions));
  
  // Actualizar KPI con versión actual (sin crear nueva versión para evitar recursión)
  const index = mockKPIs.findIndex(k => k.id === actualKpiId);
  if (index !== -1) {
    mockKPIs[index] = {
      ...mockKPIs[index],
      currentVersion: version,
      versionHistory: allVersions,
    };
    const role = mockKPIs[index].role[0];
    const currentKPIs = await getKPIs(role as 'entrenador' | 'gimnasio');
    const updatedKPIs = currentKPIs.map(k => k.id === actualKpiId ? mockKPIs[index] : k);
    localStorage.setItem(`kpi-config-${role}`, JSON.stringify(updatedKPIs));
  }
  
  return newVersion;
};

// User Story 2: Obtener una versión específica de un KPI
export const getKPIVersion = async (versionId: string): Promise<KPIVersion | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Buscar en todos los KPIs
  const saved = localStorage.getItem('kpi-versions');
  if (saved) {
    const versions: KPIVersion[] = JSON.parse(saved);
    return versions.find(v => v.id === versionId) || null;
  }
  
  return null;
};

// User Story 2: Restaurar una versión anterior de un KPI
export const restoreKPIVersion = async (
  kpiId: string,
  versionId: string,
  userId: string = 'user-1',
  userName: string = 'Usuario'
): Promise<KPI> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const version = await getKPIVersion(versionId);
  if (!version) {
    throw new Error('Versión no encontrada');
  }
  
  // Crear nueva versión con los datos restaurados
  const restoredKPI: Partial<KPI> = {
    name: version.name,
    description: version.description,
    target: version.target,
    unit: version.unit,
    category: version.category,
    enabled: version.enabled,
    visible: version.visible,
    critical: version.critical,
    criticalThreshold: version.criticalThreshold,
    isCustom: version.isCustom,
    formula: version.formula,
    dataSource: version.dataSource,
    thresholds: version.thresholds,
    responsibles: version.responsibles,
    family: version.family,
    frameworkId: version.frameworkId,
    frameworkName: version.frameworkName,
    autoCalculate: version.autoCalculate,
    calculationFrequency: version.calculationFrequency,
  };
  
  // Actualizar KPI
  const updated = await updateKPI(kpiId, restoredKPI);
  
  // Crear nueva versión con nota de restauración
  await createKPIVersion(
    kpiId,
    updated,
    `Restaurado desde versión ${version.version}`,
    userId,
    userName
  );
  
  return updated;
};

// User Story 1: Mapear un KPI a un objetivo
export const mapKPIToObjective = async (
  kpiId: string,
  objectiveId: string,
  weight?: number,
  notes?: string,
  userId: string = 'user-1',
  userName: string = 'Usuario'
): Promise<KPIToObjectiveMapping> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Obtener KPI y objetivo
  const kpi = await getKPI(kpiId);
  if (!kpi) throw new Error('KPI no encontrado');
  
  // Importar getObjectives dinámicamente para evitar dependencia circular
  const { getObjectives } = await import('./objectives');
  const objectives = await getObjectives();
  const objective = objectives.find(o => o.id === objectiveId);
  if (!objective) throw new Error('Objetivo no encontrado');
  
  // Crear mapeo
  const mapping: KPIToObjectiveMapping = {
    id: `mapping-${kpiId}-${objectiveId}-${Date.now()}`,
    kpiId,
    kpiName: kpi.name,
    objectiveId,
    objectiveTitle: objective.title,
    weight,
    linkedAt: new Date().toISOString(),
    linkedBy: userId,
    linkedByName: userName,
    notes,
  };
  
  // Guardar mapeo
  const saved = localStorage.getItem('kpi-objective-mappings');
  const mappings: KPIToObjectiveMapping[] = saved ? JSON.parse(saved) : [];
  mappings.push(mapping);
  localStorage.setItem('kpi-objective-mappings', JSON.stringify(mappings));
  
  // Actualizar KPI con objetivo vinculado
  const linkedObjectives = kpi.linkedObjectives || [];
  linkedObjectives.push({
    objectiveId,
    objectiveTitle: objective.title,
    weight,
    linkedAt: mapping.linkedAt,
  });
  await updateKPI(kpiId, { linkedObjectives });
  
  // Actualizar objetivo con KPI vinculado (usando la API de objetivos)
  const { linkKPIToObjective } = await import('./objectives');
  await linkKPIToObjective(objectiveId, kpiId, weight);
  
  return mapping;
};

// User Story 1: Desvincular un KPI de un objetivo
export const unmapKPIFromObjective = async (
  kpiId: string,
  objectiveId: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Eliminar mapeo
  const saved = localStorage.getItem('kpi-objective-mappings');
  if (saved) {
    const mappings: KPIToObjectiveMapping[] = JSON.parse(saved);
    const filtered = mappings.filter(
      m => !(m.kpiId === kpiId && m.objectiveId === objectiveId)
    );
    localStorage.setItem('kpi-objective-mappings', JSON.stringify(filtered));
  }
  
  // Actualizar KPI
  const kpi = await getKPI(kpiId);
  if (kpi && kpi.linkedObjectives) {
    const filtered = kpi.linkedObjectives.filter(o => o.objectiveId !== objectiveId);
    await updateKPI(kpiId, { linkedObjectives: filtered });
  }
  
  // Actualizar objetivo
  const { unlinkKPIFromObjective } = await import('./objectives');
  await unlinkKPIFromObjective(objectiveId, kpiId);
};

// User Story 1: Obtener todos los mapeos KPI-Objetivo
export const getKPIToObjectiveMappings = async (): Promise<KPIToObjectiveMapping[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const saved = localStorage.getItem('kpi-objective-mappings');
  return saved ? JSON.parse(saved) : [];
};

// User Story 1: Obtener objetivos vinculados a un KPI
export const getObjectivesForKPI = async (kpiId: string): Promise<KPIToObjectiveMapping[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const allMappings = await getKPIToObjectiveMappings();
  return allMappings.filter(m => m.kpiId === kpiId);
};

// User Story 1: Obtener KPIs vinculados a un objetivo
export const getKPIsForObjective = async (objectiveId: string): Promise<KPIToObjectiveMapping[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const allMappings = await getKPIToObjectiveMappings();
  return allMappings.filter(m => m.objectiveId === objectiveId);
};

