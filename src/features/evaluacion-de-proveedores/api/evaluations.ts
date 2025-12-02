import { 
  SupplierEvaluation, 
  EvaluationFilters, 
  EvaluationFormData, 
  PaginatedEvaluationsResponse,
  Supplier,
  EvaluationStats 
} from '../types';

// Simulación de datos para desarrollo
let evaluationsMock: SupplierEvaluation[] = [
  {
    id: 'eval_001',
    supplierId: '1',
    supplierName: 'Proveedor Eléctrico S.A.',
    evaluationDate: new Date('2024-01-15'),
    overallScore: 4.5,
    criteriaRatings: {
      quality: 5,
      timeliness: 4,
      support: 5,
      costBenefit: 4,
      communication: 4,
    },
    notes: 'Excelente calidad de las nuevas mancuernas. El transportista llegó 2 horas tarde.',
    evaluatorName: 'Carlos Rodriguez',
    evaluatorId: 'user_001',
    concept: 'Compra e instalación de 5 bicicletas de spinning modelo X2',
    attachments: [],
  },
  {
    id: 'eval_002',
    supplierId: '2',
    supplierName: 'Suplementos Fitness Pro',
    evaluationDate: new Date('2024-01-20'),
    overallScore: 4.8,
    criteriaRatings: {
      quality: 5,
      timeliness: 5,
      support: 4,
      costBenefit: 5,
      communication: 5,
    },
    notes: 'Productos de excelente calidad, entrega puntual. Muy recomendable.',
    evaluatorName: 'Ana Martínez',
    evaluatorId: 'user_002',
    concept: 'Pedido mensual de suplementos proteicos',
    attachments: [],
  },
  {
    id: 'eval_003',
    supplierId: '3',
    supplierName: 'Mantenimiento Equipos GYM',
    evaluationDate: new Date('2024-01-10'),
    overallScore: 3.8,
    criteriaRatings: {
      quality: 4,
      timeliness: 3,
      support: 4,
      costBenefit: 4,
      communication: 3,
    },
    notes: 'Buen servicio pero demoraron más de lo esperado en la reparación.',
    evaluatorName: 'Luis García',
    evaluatorId: 'user_003',
    concept: 'Reparación de máquinas de cardio',
    attachments: [],
  },
];

let suppliersMock: Supplier[] = [
  {
    id: '1',
    name: 'Proveedor Eléctrico S.A.',
    contact: 'Juan Pérez',
    email: 'contacto@electrico-sa.com',
    phone: '+57 300 123 4567',
    averageScore: 4.5,
    totalEvaluations: 1,
    category: 'Equipamiento',
    active: true,
  },
  {
    id: '2',
    name: 'Suplementos Fitness Pro',
    contact: 'María González',
    email: 'ventas@fitnesspro.com',
    phone: '+57 300 987 6543',
    averageScore: 4.8,
    totalEvaluations: 1,
    category: 'Suplementos',
    active: true,
  },
  {
    id: '3',
    name: 'Mantenimiento Equipos GYM',
    contact: 'Carlos Ramírez',
    email: 'servicio@mantenimiento-gym.com',
    phone: '+57 300 555 1234',
    averageScore: 3.8,
    totalEvaluations: 1,
    category: 'Mantenimiento',
    active: true,
  },
];

/**
 * Obtiene una lista paginada y filtrada de evaluaciones
 */
export const getEvaluations = async (
  gymId: string,
  filters?: EvaluationFilters,
  page: number = 1,
  limit: number = 10,
  sortBy?: string
): Promise<PaginatedEvaluationsResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filtered = [...evaluationsMock];
  
  // Aplicar filtros
  if (filters) {
    if (filters.supplierId) {
      filtered = filtered.filter(e => e.supplierId === filters.supplierId);
    }
    
    if (filters.dateFrom) {
      const dateFrom = new Date(filters.dateFrom);
      filtered = filtered.filter(e => new Date(e.evaluationDate) >= dateFrom);
    }
    
    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo);
      filtered = filtered.filter(e => new Date(e.evaluationDate) <= dateTo);
    }
    
    if (filters.minScore !== undefined) {
      filtered = filtered.filter(e => e.overallScore >= filters.minScore!);
    }
    
    if (filters.maxScore !== undefined) {
      filtered = filtered.filter(e => e.overallScore <= filters.maxScore!);
    }
    
    if (filters.searchTerm) {
      const search = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(e =>
        e.supplierName.toLowerCase().includes(search) ||
        e.concept?.toLowerCase().includes(search) ||
        e.notes?.toLowerCase().includes(search)
      );
    }
  }
  
  // Ordenar
  if (sortBy) {
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'evaluationDate':
          return new Date(b.evaluationDate).getTime() - new Date(a.evaluationDate).getTime();
        case 'overallScore':
          return b.overallScore - a.overallScore;
        case 'supplierName':
          return a.supplierName.localeCompare(b.supplierName);
        default:
          return 0;
      }
    });
  } else {
    // Por defecto ordenar por fecha más reciente
    filtered.sort((a, b) => new Date(b.evaluationDate).getTime() - new Date(a.evaluationDate).getTime());
  }
  
  // Paginación
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const paginatedData = filtered.slice(startIndex, startIndex + limit);
  
  return {
    data: paginatedData,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

/**
 * Crea una nueva evaluación
 */
export const createEvaluation = async (
  gymId: string,
  evaluationData: EvaluationFormData,
  evaluatorId: string,
  evaluatorName: string
): Promise<SupplierEvaluation> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Calcular overallScore como promedio de los criterios
  const ratings = evaluationData.criteriaRatings;
  const scores = [
    ratings.quality,
    ratings.timeliness,
    ratings.support,
    ratings.costBenefit || 0,
    ratings.communication || 0,
  ].filter(s => s > 0);
  const overallScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  
  // Obtener nombre del proveedor si no se proporcionó
  const supplier = suppliersMock.find(s => s.id === evaluationData.supplierId);
  const supplierName = evaluationData.supplierName || supplier?.name || 'Proveedor Desconocido';
  
  const newEvaluation: SupplierEvaluation = {
    id: `eval_${Date.now()}`,
    supplierId: evaluationData.supplierId,
    supplierName,
    evaluationDate: evaluationData.evaluationDate,
    overallScore: Math.round(overallScore * 10) / 10, // Redondear a 1 decimal
    criteriaRatings: evaluationData.criteriaRatings,
    notes: evaluationData.notes,
    evaluatorName,
    evaluatorId,
    concept: evaluationData.concept,
    attachments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  evaluationsMock.unshift(newEvaluation);
  
  // Actualizar promedio del proveedor
  updateSupplierAverageScore(evaluationData.supplierId);
  
  return newEvaluation;
};

/**
 * Actualiza una evaluación existente
 */
export const updateEvaluation = async (
  gymId: string,
  evaluationId: string,
  updateData: Partial<EvaluationFormData>
): Promise<SupplierEvaluation> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const index = evaluationsMock.findIndex(e => e.id === evaluationId);
  if (index === -1) {
    throw new Error('Evaluación no encontrada');
  }
  
  const existing = evaluationsMock[index];
  
  // Si se actualizan las calificaciones, recalcular overallScore
  if (updateData.criteriaRatings) {
    const ratings = updateData.criteriaRatings;
    const scores = [
      ratings.quality || existing.criteriaRatings.quality,
      ratings.timeliness || existing.criteriaRatings.timeliness,
      ratings.support || existing.criteriaRatings.support,
      ratings.costBenefit || existing.criteriaRatings.costBenefit || 0,
      ratings.communication || existing.criteriaRatings.communication || 0,
    ].filter(s => s > 0);
    const overallScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    existing.overallScore = Math.round(overallScore * 10) / 10;
  }
  
  // Actualizar otros campos
  if (updateData.notes !== undefined) existing.notes = updateData.notes;
  if (updateData.concept !== undefined) existing.concept = updateData.concept;
  if (updateData.evaluationDate !== undefined) existing.evaluationDate = updateData.evaluationDate;
  if (updateData.criteriaRatings) {
    existing.criteriaRatings = {
      ...existing.criteriaRatings,
      ...updateData.criteriaRatings,
    };
  }
  
  existing.updatedAt = new Date();
  
  // Actualizar promedio del proveedor
  updateSupplierAverageScore(existing.supplierId);
  
  return existing;
};

/**
 * Elimina una evaluación
 */
export const deleteEvaluation = async (
  gymId: string,
  evaluationId: string
): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = evaluationsMock.findIndex(e => e.id === evaluationId);
  if (index === -1) {
    throw new Error('Evaluación no encontrada');
  }
  
  const supplierId = evaluationsMock[index].supplierId;
  evaluationsMock.splice(index, 1);
  
  // Actualizar promedio del proveedor
  updateSupplierAverageScore(supplierId);
  
  return {
    success: true,
    message: 'Evaluación eliminada exitosamente.',
  };
};

/**
 * Obtiene estadísticas de evaluaciones
 */
export const getEvaluationStats = async (gymId: string): Promise<EvaluationStats> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const allEvaluations = evaluationsMock;
  const totalEvaluations = allEvaluations.length;
  
  if (totalEvaluations === 0) {
    return {
      averageScore: 0,
      totalEvaluations: 0,
      evaluationsLast30Days: 0,
      top3Suppliers: [],
      bottom3Suppliers: [],
      premiumSuppliersPercentage: 0,
      averageTimeWithoutEvaluation: 0,
    };
  }
  
  const averageScore = allEvaluations.reduce((sum, e) => sum + e.overallScore, 0) / totalEvaluations;
  
  // Evaluaciones en los últimos 30 días
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const evaluationsLast30Days = allEvaluations.filter(
    e => new Date(e.evaluationDate) >= thirtyDaysAgo
  ).length;
  
  // Calcular promedios por proveedor
  const supplierScores: Record<string, { supplierId: string; supplierName: string; scores: number[] }> = {};
  allEvaluations.forEach(e => {
    if (!supplierScores[e.supplierId]) {
      supplierScores[e.supplierId] = {
        supplierId: e.supplierId,
        supplierName: e.supplierName,
        scores: [],
      };
    }
    supplierScores[e.supplierId].scores.push(e.overallScore);
  });
  
  const supplierAverages = Object.values(supplierScores).map(s => ({
    supplierId: s.supplierId,
    supplierName: s.supplierName,
    averageScore: s.scores.reduce((sum, sc) => sum + sc, 0) / s.scores.length,
  }));
  
  // Top 3 y Bottom 3
  const sorted = [...supplierAverages].sort((a, b) => b.averageScore - a.averageScore);
  const top3Suppliers = sorted.slice(0, 3);
  const bottom3Suppliers = sorted.slice(-3).reverse();
  
  // % de proveedores premium (> 4.5)
  const premiumSuppliers = supplierAverages.filter(s => s.averageScore > 4.5).length;
  const premiumSuppliersPercentage = supplierAverages.length > 0
    ? (premiumSuppliers / supplierAverages.length) * 100
    : 0;
  
  // Tiempo medio sin evaluar (simplificado)
  const averageTimeWithoutEvaluation = 45; // días (valor simulado)
  
  return {
    averageScore: Math.round(averageScore * 10) / 10,
    totalEvaluations,
    evaluationsLast30Days,
    top3Suppliers,
    bottom3Suppliers,
    premiumSuppliersPercentage: Math.round(premiumSuppliersPercentage * 10) / 10,
    averageTimeWithoutEvaluation,
  };
};

/**
 * Obtiene proveedores para el selector
 */
export const getSuppliers = async (gymId: string): Promise<Supplier[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return suppliersMock.filter(s => s.active !== false);
};

/**
 * Función auxiliar para actualizar el promedio de un proveedor
 */
function updateSupplierAverageScore(supplierId: string) {
  const supplierEvaluations = evaluationsMock.filter(e => e.supplierId === supplierId);
  if (supplierEvaluations.length > 0) {
    const average = supplierEvaluations.reduce((sum, e) => sum + e.overallScore, 0) / supplierEvaluations.length;
    const supplier = suppliersMock.find(s => s.id === supplierId);
    if (supplier) {
      supplier.averageScore = Math.round(average * 10) / 10;
      supplier.totalEvaluations = supplierEvaluations.length;
    }
  }
}

