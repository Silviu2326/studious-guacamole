import { KPI } from '../types';

export interface ImportedKPI {
  name: string;
  description?: string;
  metric: string;
  unit: string;
  category: string;
  target?: number;
  enabled?: boolean;
  critical?: boolean;
  criticalThreshold?: number;
  rawData: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  kpis: ImportedKPI[];
}

/**
 * Importa KPIs desde un archivo (CSV o Excel)
 */
export const importKPIsFromFile = async (file: File): Promise<ImportedKPI[]> => {
  // Simular delay de procesamiento
  await new Promise(resolve => setTimeout(resolve, 1000));

  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
  if (fileExtension === 'csv') {
    return importFromCSV(file);
  } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
    return importFromExcel(file);
  } else {
    throw new Error('Formato de archivo no soportado');
  }
};

/**
 * Importa KPIs desde un conector externo
 */
export const importKPIsFromConnector = async (
  connectorType: string,
  role: 'entrenador' | 'gimnasio'
): Promise<ImportedKPI[]> => {
  // Simular delay de conexión
  await new Promise(resolve => setTimeout(resolve, 1500));

  // En producción, aquí se haría la conexión real con el conector
  // Por ahora retornamos datos de ejemplo
  const mockData: ImportedKPI[] = [
    {
      name: 'KPI Importado desde ' + connectorType,
      description: 'KPI importado desde conector externo',
      metric: 'imported_metric',
      unit: '%',
      category: 'operacional',
      enabled: true,
      rawData: { connector: connectorType },
    },
  ];

  return mockData;
};

/**
 * Valida los KPIs importados antes de integrarlos
 */
export const validateImportedKPIs = async (
  importedKPIs: ImportedKPI[],
  role: 'entrenador' | 'gimnasio'
): Promise<ValidationResult> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  importedKPIs.forEach((kpi, index) => {
    const prefix = `kpi[${index}]`;

    // Validaciones obligatorias (errores)
    if (!kpi.name || kpi.name.trim().length === 0) {
      errors.push({
        field: `${prefix}.name`,
        message: 'El nombre es obligatorio',
        severity: 'error',
      });
    }

    if (!kpi.metric || kpi.metric.trim().length === 0) {
      errors.push({
        field: `${prefix}.metric`,
        message: 'La métrica es obligatoria',
        severity: 'error',
      });
    }

    if (!kpi.unit || kpi.unit.trim().length === 0) {
      errors.push({
        field: `${prefix}.unit`,
        message: 'La unidad es obligatoria',
        severity: 'error',
      });
    }

    if (!kpi.category || kpi.category.trim().length === 0) {
      errors.push({
        field: `${prefix}.category`,
        message: 'La categoría es obligatoria',
        severity: 'error',
      });
    }

    // Validar que la métrica no esté duplicada
    const duplicateMetric = importedKPIs.find(
      (other, otherIndex) => otherIndex !== index && other.metric === kpi.metric
    );
    if (duplicateMetric) {
      errors.push({
        field: `${prefix}.metric`,
        message: 'La métrica está duplicada en el archivo',
        severity: 'error',
      });
    }

    // Validar formato de métrica (solo letras, números y guiones bajos)
    if (kpi.metric && !/^[a-zA-Z0-9_]+$/.test(kpi.metric)) {
      errors.push({
        field: `${prefix}.metric`,
        message: 'La métrica solo puede contener letras, números y guiones bajos',
        severity: 'error',
      });
    }

    // Validaciones opcionales (advertencias)
    if (!kpi.description || kpi.description.trim().length === 0) {
      warnings.push({
        field: `${prefix}.description`,
        message: 'Se recomienda añadir una descripción',
        severity: 'warning',
      });
    }

    if (kpi.target !== undefined && (isNaN(kpi.target) || kpi.target < 0)) {
      warnings.push({
        field: `${prefix}.target`,
        message: 'El target debe ser un número positivo',
        severity: 'warning',
      });
    }

    if (kpi.critical && kpi.criticalThreshold === undefined) {
      warnings.push({
        field: `${prefix}.criticalThreshold`,
        message: 'Se recomienda definir un umbral crítico si el KPI es crítico',
        severity: 'warning',
      });
    }

    // Validar categoría válida
    const validCategories = ['financiero', 'operacional', 'satisfaccion', 'salud'];
    if (kpi.category && !validCategories.includes(kpi.category.toLowerCase())) {
      warnings.push({
        field: `${prefix}.category`,
        message: `Categoría no estándar. Categorías válidas: ${validCategories.join(', ')}`,
        severity: 'warning',
      });
    }
  });

  // Verificar duplicados con KPIs existentes
  const existingKPIs = await getExistingKPIs(role);
  importedKPIs.forEach((kpi, index) => {
    const existing = existingKPIs.find(existing => existing.metric === kpi.metric);
    if (existing) {
      warnings.push({
        field: `kpi[${index}].metric`,
        message: `Ya existe un KPI con la métrica "${kpi.metric}". Se actualizará el existente.`,
        severity: 'warning',
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    kpis: importedKPIs,
  };
};

/**
 * Obtiene los KPIs existentes para verificar duplicados
 */
const getExistingKPIs = async (role: 'entrenador' | 'gimnasio'): Promise<KPI[]> => {
  const saved = localStorage.getItem(`kpi-config-${role}`);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
};

/**
 * Importa desde archivo CSV
 */
const importFromCSV = async (file: File): Promise<ImportedKPI[]> => {
  const text = await file.text();
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  if (lines.length < 2) {
    throw new Error('El archivo CSV debe tener al menos una fila de encabezados y una fila de datos');
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const kpis: ImportedKPI[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const kpi: ImportedKPI = {
      name: '',
      metric: '',
      unit: '',
      category: '',
      rawData: {},
    };

    headers.forEach((header, index) => {
      const value = values[index] || '';
      kpi.rawData[header] = value;

      switch (header) {
        case 'nombre':
        case 'name':
          kpi.name = value;
          break;
        case 'descripcion':
        case 'description':
          kpi.description = value;
          break;
        case 'metrica':
        case 'metric':
          kpi.metric = value;
          break;
        case 'unidad':
        case 'unit':
          kpi.unit = value;
          break;
        case 'categoria':
        case 'category':
          kpi.category = value;
          break;
        case 'target':
        case 'objetivo':
          kpi.target = parseFloat(value) || undefined;
          break;
        case 'enabled':
        case 'habilitado':
          kpi.enabled = value.toLowerCase() === 'true' || value === '1';
          break;
        case 'critical':
        case 'critico':
          kpi.critical = value.toLowerCase() === 'true' || value === '1';
          break;
        case 'criticalthreshold':
        case 'umbral_critico':
          kpi.criticalThreshold = parseFloat(value) || undefined;
          break;
      }
    });

    if (kpi.name && kpi.metric) {
      kpis.push(kpi);
    }
  }

  return kpis;
};

/**
 * Importa desde archivo Excel
 */
const importFromExcel = async (file: File): Promise<ImportedKPI[]> => {
  // En producción, usar una librería como xlsx para leer archivos Excel
  // Por ahora, simulamos la importación
  await new Promise(resolve => setTimeout(resolve, 500));

  // Datos de ejemplo para Excel
  return [
    {
      name: 'KPI desde Excel 1',
      description: 'Descripción del KPI',
      metric: 'excel_metric_1',
      unit: '%',
      category: 'operacional',
      target: 80,
      enabled: true,
      rawData: { source: 'excel' },
    },
    {
      name: 'KPI desde Excel 2',
      description: 'Descripción del KPI 2',
      metric: 'excel_metric_2',
      unit: '€',
      category: 'financiero',
      target: 10000,
      enabled: true,
      rawData: { source: 'excel' },
    },
  ];
};

