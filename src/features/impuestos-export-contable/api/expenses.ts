/**
 * ============================================================================
 * API MOCK PARA GESTIÓN DE GASTOS DEDUCIBLES
 * ============================================================================
 * 
 * Este archivo contiene funciones mock asíncronas para el sistema de gestión
 * de gastos deducibles. En producción, estas funciones se conectarían a una
 * API REST real o directamente a la base de datos.
 * 
 * MAPEO A BASE DE DATOS REAL:
 * 
 * Tabla: expenses (gastos)
 * - id: UUID PRIMARY KEY
 * - fecha: DATE NOT NULL
 * - descripcion: VARCHAR(500) NOT NULL
 * - categoria_id: VARCHAR(50) NOT NULL -> FK a expense_categories
 * - importe: DECIMAL(10,2) NOT NULL
 * - tipo_iva: VARCHAR(20) NOT NULL
 * - deducible: BOOLEAN NOT NULL DEFAULT true
 * - estado: VARCHAR(30) NOT NULL DEFAULT 'pendiente_revision'
 * - origen: VARCHAR(20) NOT NULL DEFAULT 'manual'
 * - notas: TEXT
 * - fecha_creacion: TIMESTAMP NOT NULL DEFAULT NOW()
 * - fecha_actualizacion: TIMESTAMP NOT NULL DEFAULT NOW()
 * - usuario_creacion: VARCHAR(100)
 * - deleted_at: TIMESTAMP NULL (para soft delete)
 * 
 * Tabla: expense_categories (categorías de gastos)
 * - id: VARCHAR(50) PRIMARY KEY
 * - nombre: VARCHAR(100) NOT NULL
 * - descripcion: TEXT
 * - icono: VARCHAR(50)
 * 
 * Tabla: expense_attachments (adjuntos de gastos)
 * - id: UUID PRIMARY KEY
 * - expense_id: UUID NOT NULL -> FK a expenses
 * - url: VARCHAR(500) NOT NULL (ruta del archivo en storage)
 * - nombre_archivo: VARCHAR(255) NOT NULL
 * - tipo_archivo: VARCHAR(100) NOT NULL
 * - fecha_subida: TIMESTAMP NOT NULL DEFAULT NOW()
 * - tamaño: BIGINT (bytes)
 * 
 * Tabla: expense_validations (validaciones/cambios de estado)
 * - id: UUID PRIMARY KEY
 * - expense_id: UUID NOT NULL -> FK a expenses
 * - estado_anterior: VARCHAR(30)
 * - estado_nuevo: VARCHAR(30) NOT NULL
 * - motivo: TEXT
 * - usuario_validacion: VARCHAR(100)
 * - fecha_validacion: TIMESTAMP NOT NULL DEFAULT NOW()
 * 
 * ============================================================================
 */

import { 
  Expense,
  ExpenseCategory,
  ExpenseStatus,
  ExpenseOrigin,
  TipoIVA,
  ExpenseAttachment,
  FiltroGastos,
  GastoDeducible,
  CrearGastoRequest,
  ActualizarGastoRequest,
  ResumenGastos,
  CATEGORIAS_GASTO
} from '../types/expenses';

// ============================================================================
// DATOS MOCK - En producción vendrían de la base de datos
// ============================================================================

/**
 * Almacenamiento en memoria de gastos (simula tabla expenses)
 * En producción: SELECT * FROM expenses WHERE deleted_at IS NULL
 */
let mockExpenses: Expense[] = [
  {
    id: 'exp-001',
    fecha: new Date('2024-01-15'),
    descripcion: 'Compra de pesas y mancuernas para entrenamiento',
    categoria: 'equipamiento',
    importe: 150000,
    tipoIVA: 'general',
    deducible: true,
    estado: 'aprobado',
    adjuntos: [
      {
        id: 'att-001',
        expenseId: 'exp-001',
        url: '/uploads/expenses/factura-pesas-001.pdf',
        nombreArchivo: 'factura-pesas.pdf',
        tipoArchivo: 'application/pdf',
        fechaSubida: new Date('2024-01-15'),
        tamaño: 245678
      }
    ],
    origen: 'manual',
    notas: 'Pesas de 5kg, 10kg y 15kg para sesiones de entrenamiento',
    fechaCreacion: new Date('2024-01-15'),
    fechaActualizacion: new Date('2024-01-15'),
    usuarioCreacion: 'user1'
  },
  {
    id: 'exp-002',
    fecha: new Date('2024-01-20'),
    descripcion: 'Certificación NASM Personal Trainer',
    categoria: 'certificaciones',
    importe: 350000,
    tipoIVA: 'general',
    deducible: true,
    estado: 'aprobado',
    adjuntos: [],
    origen: 'manual',
    notas: 'Renovación de certificación anual',
    fechaCreacion: new Date('2024-01-20'),
    fechaActualizacion: new Date('2024-01-20'),
    usuarioCreacion: 'user1'
  },
  {
    id: 'exp-003',
    fecha: new Date('2024-02-01'),
    descripcion: 'Publicidad en Instagram Ads',
    categoria: 'marketing',
    importe: 50000,
    tipoIVA: 'general',
    deducible: true,
    estado: 'pendiente_revision',
    adjuntos: [],
    origen: 'banco',
    notas: 'Campaña de publicidad para nuevo servicio',
    fechaCreacion: new Date('2024-02-01'),
    fechaActualizacion: new Date('2024-02-01'),
    usuarioCreacion: 'user1'
  },
  {
    id: 'exp-004',
    fecha: new Date('2024-02-05'),
    descripcion: 'Combustible para desplazamientos profesionales',
    categoria: 'transporte',
    importe: 80000,
    tipoIVA: 'general',
    deducible: true,
    estado: 'aprobado',
    adjuntos: [],
    origen: 'banco',
    notas: 'Combustible del mes de febrero',
    fechaCreacion: new Date('2024-02-05'),
    fechaActualizacion: new Date('2024-02-05'),
    usuarioCreacion: 'user1'
  },
  {
    id: 'exp-005',
    fecha: new Date('2024-02-10'),
    descripcion: 'Suscripción mensual a software de gestión',
    categoria: 'software',
    importe: 45000,
    tipoIVA: 'general',
    deducible: true,
    estado: 'aprobado',
    adjuntos: [],
    origen: 'banco',
    fechaCreacion: new Date('2024-02-10'),
    fechaActualizacion: new Date('2024-02-10'),
    usuarioCreacion: 'user1'
  },
  {
    id: 'exp-006',
    fecha: new Date('2024-02-15'),
    descripcion: 'Alquiler de sala de entrenamiento',
    categoria: 'alquiler',
    importe: 500000,
    tipoIVA: 'general',
    deducible: true,
    estado: 'observacion',
    adjuntos: [],
    origen: 'banco',
    notas: 'Requiere revisión de contrato',
    fechaCreacion: new Date('2024-02-15'),
    fechaActualizacion: new Date('2024-02-16'),
    usuarioCreacion: 'user1'
  },
  {
    id: 'exp-007',
    fecha: new Date('2024-02-20'),
    descripcion: 'Curso de nutrición deportiva online',
    categoria: 'formacion',
    importe: 120000,
    tipoIVA: 'exento',
    deducible: true,
    estado: 'aprobado',
    adjuntos: [],
    origen: 'manual',
    fechaCreacion: new Date('2024-02-20'),
    fechaActualizacion: new Date('2024-02-20'),
    usuarioCreacion: 'user1'
  }
];

// ============================================================================
// FUNCIONES DE CATEGORIZACIÓN AUTOMÁTICA
// ============================================================================

/**
 * Categoriza automáticamente un gasto basándose en palabras clave en la descripción
 * 
 * En producción: Podría usar ML/NLP o reglas más complejas basadas en historial
 * 
 * @param descripcion - Descripción del gasto
 * @returns Categoría sugerida o 'otros' si no se encuentra coincidencia
 */
function categorizarGasto(descripcion: string): ExpenseCategory {
  const descripcionLower = descripcion.toLowerCase();
  
  // Palabras clave por categoría (orden de prioridad)
  const keywords: Record<ExpenseCategory, string[]> = {
    equipamiento: ['pesa', 'mancuerna', 'equipo', 'maquina', 'aparato', 'material de entrenamiento', 'bicicleta', 'cinta'],
    certificaciones: ['certificacion', 'certificado', 'licencia', 'acreditacion', 'nasm', 'ace', 'nsca'],
    marketing: ['publicidad', 'ads', 'instagram', 'facebook', 'marketing', 'promocion', 'redes sociales', 'fotografia'],
    transporte: ['combustible', 'gasolina', 'diesel', 'peaje', 'parking', 'estacionamiento', 'mantenimiento vehiculo', 'taxi', 'uber'],
    materiales: ['material', 'suplemento', 'toalla', 'consumible', 'proteina', 'creatina'],
    software: ['software', 'suscripcion', 'app', 'aplicacion', 'plataforma', 'sistema', 'saas', 'cloud'],
    seguros: ['seguro', 'poliza', 'responsabilidad civil', 'aseguradora'],
    alquiler: ['alquiler', 'renta', 'arriendo', 'sala', 'espacio', 'oficina', 'local'],
    servicios_profesionales: ['contabilidad', 'asesoria', 'legal', 'abogado', 'consultoria', 'diseño grafico', 'diseñador'],
    formacion: ['curso', 'formacion', 'workshop', 'seminario', 'capacitacion', 'entrenamiento personal', 'nutricion'],
    comunicaciones: ['telefono', 'internet', 'wifi', 'movil', 'comunicacion', 'linea telefonica'],
    dietas: ['comida', 'almuerzo', 'cena', 'restaurante', 'dieta', 'alimentacion trabajo'],
    vestimenta: ['ropa', 'uniforme', 'calzado', 'zapatillas', 'camiseta', 'pantalon trabajo'],
    otros: []
  };
  
  // Buscar coincidencias (prioridad por orden de categorías)
  for (const [categoria, palabras] of Object.entries(keywords)) {
    if (palabras.some(palabra => descripcionLower.includes(palabra))) {
      return categoria as ExpenseCategory;
    }
  }
  
  return 'otros';
}

/**
 * Determina el tipo de IVA basándose en la categoría y descripción
 * 
 * En producción: Consultaría reglas fiscales o tabla de configuración
 * 
 * @param categoria - Categoría del gasto
 * @param descripcion - Descripción del gasto
 * @returns Tipo de IVA aplicable
 */
function determinarTipoIVA(categoria: ExpenseCategory, descripcion: string): TipoIVA {
  const descripcionLower = descripcion.toLowerCase();
  
  // Reglas básicas de IVA
  if (categoria === 'formacion' && (descripcionLower.includes('curso') || descripcionLower.includes('formacion'))) {
    return 'exento';
  }
  
  if (categoria === 'seguros') {
    return 'exento';
  }
  
  // Por defecto, IVA general (21%)
  return 'general';
}

// ============================================================================
// API PRINCIPAL - Funciones asíncronas mock
// ============================================================================

/**
 * Obtiene gastos con filtros opcionales
 * 
 * En producción:
 * SELECT * FROM expenses 
 * WHERE deleted_at IS NULL
 *   AND (fecha_inicio IS NULL OR fecha >= :fecha_inicio)
 *   AND (fecha_fin IS NULL OR fecha <= :fecha_fin)
 *   AND (categoria IS NULL OR categoria_id = :categoria)
 *   AND (estado IS NULL OR estado = :estado)
 *   AND (texto_libre IS NULL OR descripcion LIKE :texto_libre OR notas LIKE :texto_libre)
 *   AND (importe_min IS NULL OR importe >= :importe_min)
 *   AND (importe_max IS NULL OR importe <= :importe_max)
 * ORDER BY fecha DESC
 * 
 * @param filtros - Filtros opcionales para la búsqueda
 * @returns Promise con array de gastos
 */
export async function getExpenses(filtros?: FiltroGastos): Promise<Expense[]> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let gastos = [...mockExpenses];
  
  if (!filtros) {
    return gastos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  }
  
  // Filtro por fecha inicio
  if (filtros.fechaInicio) {
    const fechaInicio = new Date(filtros.fechaInicio);
    fechaInicio.setHours(0, 0, 0, 0);
    gastos = gastos.filter(g => {
      const fechaGasto = new Date(g.fecha);
      fechaGasto.setHours(0, 0, 0, 0);
      return fechaGasto >= fechaInicio;
    });
  }
  
  // Filtro por fecha fin
  if (filtros.fechaFin) {
    const fechaFin = new Date(filtros.fechaFin);
    fechaFin.setHours(23, 59, 59, 999);
    gastos = gastos.filter(g => {
      const fechaGasto = new Date(g.fecha);
      fechaGasto.setHours(23, 59, 59, 999);
      return fechaGasto <= fechaFin;
    });
  }
  
  // Filtro por categoría
  if (filtros.categoria) {
    gastos = gastos.filter(g => g.categoria === filtros.categoria);
  }
  
  // Filtro por estado
  if (filtros.estado) {
    gastos = gastos.filter(g => g.estado === filtros.estado);
  }
  
  // Filtro por texto libre (búsqueda en descripción y notas)
  if (filtros.textoLibre) {
    const textoLower = filtros.textoLibre.toLowerCase();
    gastos = gastos.filter(g => 
      g.descripcion.toLowerCase().includes(textoLower) ||
      (g.notas && g.notas.toLowerCase().includes(textoLower))
    );
  }
  
  // Filtro por concepto (compatibilidad con código legacy)
  if (filtros.concepto) {
    const conceptoLower = filtros.concepto.toLowerCase();
    gastos = gastos.filter(g => 
      g.descripcion.toLowerCase().includes(conceptoLower)
    );
  }
  
  // Filtro por importe mínimo
  if (filtros.importeMin !== undefined) {
    gastos = gastos.filter(g => g.importe >= filtros.importeMin!);
  }
  
  // Filtro por importe máximo
  if (filtros.importeMax !== undefined) {
    gastos = gastos.filter(g => g.importe <= filtros.importeMax!);
  }
  
  // Ordenar por fecha descendente (más recientes primero)
  return gastos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
}

/**
 * Crea un nuevo gasto
 * 
 * En producción:
 * INSERT INTO expenses (id, fecha, descripcion, categoria_id, importe, tipo_iva, 
 *                       deducible, estado, origen, notas, fecha_creacion, usuario_creacion)
 * VALUES (:id, :fecha, :descripcion, :categoria_id, :importe, :tipo_iva, 
 *         :deducible, :estado, :origen, :notas, NOW(), :usuario_creacion)
 * RETURNING *;
 * 
 * Si hay adjuntos:
 * INSERT INTO expense_attachments (id, expense_id, url, nombre_archivo, tipo_archivo, fecha_subida, tamaño)
 * VALUES (:id, :expense_id, :url, :nombre_archivo, :tipo_archivo, NOW(), :tamaño);
 * 
 * @param data - Datos del gasto sin ID (se genera automáticamente)
 * @returns Promise con el gasto creado
 */
export async function createExpense(data: Omit<Expense, 'id'>): Promise<Expense> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Generar ID único
  const id = `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Categorización automática si no se proporciona categoría
  let categoria = data.categoria;
  if (!categoria && data.descripcion) {
    categoria = categorizarGasto(data.descripcion);
  }
  
  // Determinar tipo de IVA si no se proporciona
  let tipoIVA = data.tipoIVA;
  if (!tipoIVA && categoria) {
    tipoIVA = determinarTipoIVA(categoria, data.descripcion);
  }
  
  // Crear el gasto
  const nuevoGasto: Expense = {
    id,
    fecha: data.fecha,
    descripcion: data.descripcion,
    categoria: categoria || 'otros',
    importe: data.importe,
    tipoIVA: tipoIVA || 'general',
    deducible: data.deducible !== undefined ? data.deducible : true,
    estado: data.estado || 'pendiente_revision',
    adjuntos: data.adjuntos || [],
    origen: data.origen || 'manual',
    notas: data.notas,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date(),
    usuarioCreacion: data.usuarioCreacion || 'current-user'
  };
  
  // Asignar expenseId a los adjuntos si no lo tienen
  nuevoGasto.adjuntos = nuevoGasto.adjuntos.map(adjunto => ({
    ...adjunto,
    expenseId: id
  }));
  
  // Guardar en "base de datos" mock
  mockExpenses.push(nuevoGasto);
  
  return nuevoGasto;
}

/**
 * Actualiza un gasto existente
 * 
 * En producción:
 * UPDATE expenses 
 * SET fecha = COALESCE(:fecha, fecha),
 *     descripcion = COALESCE(:descripcion, descripcion),
 *     categoria_id = COALESCE(:categoria_id, categoria_id),
 *     importe = COALESCE(:importe, importe),
 *     tipo_iva = COALESCE(:tipo_iva, tipo_iva),
 *     deducible = COALESCE(:deducible, deducible),
 *     estado = COALESCE(:estado, estado),
 *     notas = COALESCE(:notas, notas),
 *     fecha_actualizacion = NOW()
 * WHERE id = :id AND deleted_at IS NULL
 * RETURNING *;
 * 
 * @param id - ID del gasto a actualizar
 * @param cambios - Campos a actualizar (parcial)
 * @returns Promise con el gasto actualizado
 * @throws Error si el gasto no existe
 */
export async function updateExpense(id: string, cambios: Partial<Expense>): Promise<Expense> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockExpenses.findIndex(g => g.id === id);
  
  if (index === -1) {
    throw new Error(`Gasto con ID ${id} no encontrado`);
  }
  
  // Si se actualiza la descripción, recategorizar si no hay categoría explícita
  if (cambios.descripcion && !cambios.categoria) {
    cambios.categoria = categorizarGasto(cambios.descripcion);
  }
  
  // Actualizar el gasto
  const gastoActualizado: Expense = {
    ...mockExpenses[index],
    ...cambios,
    fechaActualizacion: new Date()
  };
  
  // Actualizar expenseId en adjuntos si se modifican
  if (cambios.adjuntos) {
    gastoActualizado.adjuntos = cambios.adjuntos.map(adjunto => ({
      ...adjunto,
      expenseId: id
    }));
  }
  
  mockExpenses[index] = gastoActualizado;
  
  return gastoActualizado;
}

/**
 * Elimina un gasto (soft delete)
 * 
 * En producción:
 * UPDATE expenses 
 * SET deleted_at = NOW()
 * WHERE id = :id AND deleted_at IS NULL;
 * 
 * O si se requiere hard delete:
 * DELETE FROM expense_attachments WHERE expense_id = :id;
 * DELETE FROM expense_validations WHERE expense_id = :id;
 * DELETE FROM expenses WHERE id = :id;
 * 
 * @param id - ID del gasto a eliminar
 * @returns Promise<void>
 * @throws Error si el gasto no existe
 */
export async function deleteExpense(id: string): Promise<void> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockExpenses.findIndex(g => g.id === id);
  
  if (index === -1) {
    throw new Error(`Gasto con ID ${id} no encontrado`);
  }
  
  // Soft delete: marcar como eliminado (en producción se usaría deleted_at)
  // Para el mock, simplemente eliminamos del array
  // En producción: mockExpenses[index].deletedAt = new Date();
  mockExpenses.splice(index, 1);
}

/**
 * Valida/cambia el estado de un gasto
 * 
 * En producción:
 * BEGIN TRANSACTION;
 * 
 * UPDATE expenses 
 * SET estado = :nuevo_estado,
 *     fecha_actualizacion = NOW()
 * WHERE id = :id AND deleted_at IS NULL;
 * 
 * INSERT INTO expense_validations (id, expense_id, estado_anterior, estado_nuevo, 
 *                                  motivo, usuario_validacion, fecha_validacion)
 * VALUES (gen_random_uuid(), :id, :estado_anterior, :nuevo_estado, 
 *         :motivo, :usuario_validacion, NOW());
 * 
 * COMMIT;
 * 
 * @param id - ID del gasto a validar
 * @param nuevoEstado - Nuevo estado a asignar
 * @param motivoOpcional - Motivo opcional del cambio de estado
 * @returns Promise con el gasto actualizado
 * @throws Error si el gasto no existe
 */
export async function validateExpense(
  id: string, 
  nuevoEstado: ExpenseStatus, 
  motivoOpcional?: string
): Promise<Expense> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const index = mockExpenses.findIndex(g => g.id === id);
  
  if (index === -1) {
    throw new Error(`Gasto con ID ${id} no encontrado`);
  }
  
  const estadoAnterior = mockExpenses[index].estado;
  
  // Actualizar estado
  const gastoActualizado: Expense = {
    ...mockExpenses[index],
    estado: nuevoEstado,
    fechaActualizacion: new Date(),
    notas: motivoOpcional 
      ? `${mockExpenses[index].notas || ''}\n[Validación ${nuevoEstado}]: ${motivoOpcional}`.trim()
      : mockExpenses[index].notas
  };
  
  mockExpenses[index] = gastoActualizado;
  
  // En producción, aquí se registraría en expense_validations
  // await db.insert('expense_validations', {
  //   expense_id: id,
  //   estado_anterior: estadoAnterior,
  //   estado_nuevo: nuevoEstado,
  //   motivo: motivoOpcional,
  //   usuario_validacion: currentUser.id,
  //   fecha_validacion: new Date()
  // });
  
  return gastoActualizado;
}

// ============================================================================
// API LEGACY - Compatibilidad con código existente
// ============================================================================

/**
 * API legacy para mantener compatibilidad con código existente
 * Mapea entre tipos GastoDeducible (legacy) y Expense (nuevo)
 */
export const expensesAPI = {
  /**
   * Obtener todos los gastos con filtros opcionales (legacy)
   */
  async obtenerGastos(filtros?: FiltroGastos): Promise<GastoDeducible[]> {
    const expenses = await getExpenses(filtros);
    // Convertir Expense a GastoDeducible para compatibilidad
    return expenses.map(expense => ({
      id: expense.id,
      fecha: expense.fecha,
      concepto: expense.descripcion,
      importe: expense.importe,
      categoria: expense.categoria,
      deducible: expense.deducible,
      notas: expense.notas,
      archivosAdjuntos: expense.adjuntos.map(adj => ({
        id: adj.id,
        nombre: adj.nombreArchivo,
        url: adj.url,
        tipo: adj.tipoArchivo.startsWith('image/') ? 'image' : 
              adj.tipoArchivo === 'application/pdf' ? 'pdf' : 'other',
        tamaño: adj.tamaño || 0,
        fechaSubida: adj.fechaSubida
      })),
      fechaCreacion: expense.fechaCreacion || new Date(),
      fechaActualizacion: expense.fechaActualizacion || new Date(),
      usuarioCreacion: expense.usuarioCreacion || 'unknown'
    }));
  },

  /**
   * Obtener un gasto por ID (legacy)
   */
  async obtenerGasto(id: string): Promise<GastoDeducible | null> {
    const expenses = await getExpenses();
    const expense = expenses.find(e => e.id === id);
    if (!expense) return null;
    
    return {
      id: expense.id,
      fecha: expense.fecha,
      concepto: expense.descripcion,
      importe: expense.importe,
      categoria: expense.categoria,
      deducible: expense.deducible,
      notas: expense.notas,
      archivosAdjuntos: expense.adjuntos.map(adj => ({
        id: adj.id,
        nombre: adj.nombreArchivo,
        url: adj.url,
        tipo: adj.tipoArchivo.startsWith('image/') ? 'image' : 
              adj.tipoArchivo === 'application/pdf' ? 'pdf' : 'other',
        tamaño: adj.tamaño || 0,
        fechaSubida: adj.fechaSubida
      })),
      fechaCreacion: expense.fechaCreacion || new Date(),
      fechaActualizacion: expense.fechaActualizacion || new Date(),
      usuarioCreacion: expense.usuarioCreacion || 'unknown'
    };
  },

  /**
   * Crear un nuevo gasto (legacy)
   */
  async crearGasto(gasto: CrearGastoRequest): Promise<GastoDeducible> {
    const expense = await createExpense({
      fecha: gasto.fecha,
      descripcion: gasto.concepto,
      categoria: gasto.categoria,
      importe: gasto.importe,
      tipoIVA: 'general',
      deducible: gasto.deducible !== undefined ? gasto.deducible : true,
      estado: 'pendiente_revision',
      adjuntos: gasto.archivosAdjuntos?.map(adj => ({
        id: adj.id,
        expenseId: '', // Se asignará en createExpense
        url: adj.url,
        nombreArchivo: adj.nombre,
        tipoArchivo: adj.tipo === 'image' ? 'image/jpeg' : 
                     adj.tipo === 'pdf' ? 'application/pdf' : 'application/octet-stream',
        fechaSubida: adj.fechaSubida,
        tamaño: adj.tamaño
      })) || [],
      origen: 'manual',
      notas: gasto.notas,
      usuarioCreacion: 'current-user'
    });
    
    return {
      id: expense.id,
      fecha: expense.fecha,
      concepto: expense.descripcion,
      importe: expense.importe,
      categoria: expense.categoria,
      deducible: expense.deducible,
      notas: expense.notas,
      archivosAdjuntos: expense.adjuntos.map(adj => ({
        id: adj.id,
        nombre: adj.nombreArchivo,
        url: adj.url,
        tipo: adj.tipoArchivo.startsWith('image/') ? 'image' : 
              adj.tipoArchivo === 'application/pdf' ? 'pdf' : 'other',
        tamaño: adj.tamaño || 0,
        fechaSubida: adj.fechaSubida
      })),
      fechaCreacion: expense.fechaCreacion || new Date(),
      fechaActualizacion: expense.fechaActualizacion || new Date(),
      usuarioCreacion: expense.usuarioCreacion || 'unknown'
    };
  },

  /**
   * Actualizar un gasto existente (legacy)
   */
  async actualizarGasto(id: string, datos: ActualizarGastoRequest): Promise<GastoDeducible> {
    const cambios: Partial<Expense> = {};
    
    if (datos.fecha) cambios.fecha = datos.fecha;
    if (datos.concepto) cambios.descripcion = datos.concepto;
    if (datos.categoria) cambios.categoria = datos.categoria;
    if (datos.importe !== undefined) cambios.importe = datos.importe;
    if (datos.deducible !== undefined) cambios.deducible = datos.deducible;
    if (datos.notas !== undefined) cambios.notas = datos.notas;
    if (datos.archivosAdjuntos) {
      cambios.adjuntos = datos.archivosAdjuntos.map(adj => ({
        id: adj.id,
        expenseId: id,
        url: adj.url,
        nombreArchivo: adj.nombre,
        tipoArchivo: adj.tipo === 'image' ? 'image/jpeg' : 
                     adj.tipo === 'pdf' ? 'application/pdf' : 'application/octet-stream',
        fechaSubida: adj.fechaSubida,
        tamaño: adj.tamaño
      }));
    }
    
    const expense = await updateExpense(id, cambios);
    
    return {
      id: expense.id,
      fecha: expense.fecha,
      concepto: expense.descripcion,
      importe: expense.importe,
      categoria: expense.categoria,
      deducible: expense.deducible,
      notas: expense.notas,
      archivosAdjuntos: expense.adjuntos.map(adj => ({
        id: adj.id,
        nombre: adj.nombreArchivo,
        url: adj.url,
        tipo: adj.tipoArchivo.startsWith('image/') ? 'image' : 
              adj.tipoArchivo === 'application/pdf' ? 'pdf' : 'other',
        tamaño: adj.tamaño || 0,
        fechaSubida: adj.fechaSubida
      })),
      fechaCreacion: expense.fechaCreacion || new Date(),
      fechaActualizacion: expense.fechaActualizacion || new Date(),
      usuarioCreacion: expense.usuarioCreacion || 'unknown'
    };
  },

  /**
   * Eliminar un gasto (legacy)
   */
  async eliminarGasto(id: string): Promise<void> {
    await deleteExpense(id);
  },

  /**
   * Obtener resumen de gastos (legacy)
   */
  async obtenerResumenGastos(filtros?: FiltroGastos): Promise<ResumenGastos> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const gastos = await this.obtenerGastos(filtros);
    
    const totalGastos = gastos.reduce((sum, g) => sum + g.importe, 0);
    const totalGastosDeducibles = gastos.filter(g => g.deducible).reduce((sum, g) => sum + g.importe, 0);
    const totalGastosNoDeducibles = gastos.filter(g => !g.deducible).reduce((sum, g) => sum + g.importe, 0);
    const cantidadGastos = gastos.length;
    const cantidadGastosDeducibles = gastos.filter(g => g.deducible).length;
    const cantidadGastosNoDeducibles = gastos.filter(g => !g.deducible).length;
    const promedioGasto = cantidadGastos > 0 ? totalGastos / cantidadGastos : 0;
    
    // Agrupar por categoría
    const gastosPorCategoria = new Map<string, { total: number; totalDeducible: number; totalNoDeducible: number; cantidad: number }>();
    
    gastos.forEach(gasto => {
      const actual = gastosPorCategoria.get(gasto.categoria) || { total: 0, totalDeducible: 0, totalNoDeducible: 0, cantidad: 0 };
      gastosPorCategoria.set(gasto.categoria, {
        total: actual.total + gasto.importe,
        totalDeducible: actual.totalDeducible + (gasto.deducible ? gasto.importe : 0),
        totalNoDeducible: actual.totalNoDeducible + (!gasto.deducible ? gasto.importe : 0),
        cantidad: actual.cantidad + 1
      });
    });
    
    // Convertir a array y calcular porcentajes
    const gastosPorCategoriaArray = Array.from(gastosPorCategoria.entries())
      .map(([categoria, datos]) => ({
        categoria: categoria as any,
        total: datos.total,
        totalDeducible: datos.totalDeducible,
        totalNoDeducible: datos.totalNoDeducible,
        cantidad: datos.cantidad,
        porcentaje: totalGastos > 0 ? (datos.total / totalGastos) * 100 : 0
      }))
      .sort((a, b) => b.total - a.total);
    
    return {
      totalGastos,
      totalGastosDeducibles,
      totalGastosNoDeducibles,
      cantidadGastos,
      cantidadGastosDeducibles,
      cantidadGastosNoDeducibles,
      gastosPorCategoria: gastosPorCategoriaArray,
      promedioGasto,
      periodo: {
        fechaInicio: filtros?.fechaInicio || new Date(new Date().getFullYear(), 0, 1),
        fechaFin: filtros?.fechaFin || new Date()
      }
    };
  },

  /**
   * Obtener gastos agrupados por mes y categoría para comparación (legacy)
   */
  async obtenerGastosMensualesPorCategoria(fechaInicio?: Date, fechaFin?: Date): Promise<{
    mes: string;
    año: number;
    mesNumero: number;
    categorias: {
      categoria: ExpenseCategory;
      total: number;
      cantidad: number;
    }[];
  }[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Si no se proporcionan fechas, usar los últimos 6 meses
    const hoy = new Date();
    const fechaInicioDefault = fechaInicio || new Date(hoy.getFullYear(), hoy.getMonth() - 5, 1);
    const fechaFinDefault = fechaFin || hoy;
    
    const filtros: FiltroGastos = {
      fechaInicio: fechaInicioDefault,
      fechaFin: fechaFinDefault
    };
    
    const gastos = await this.obtenerGastos(filtros);
    
    // Agrupar por mes y categoría
    const gastosPorMes = new Map<string, {
      año: number;
      mesNumero: number;
      categorias: Map<ExpenseCategory, { total: number; cantidad: number }>;
    }>();
    
    gastos.forEach(gasto => {
      const fecha = new Date(gasto.fecha);
      const año = fecha.getFullYear();
      const mes = fecha.getMonth();
      const claveMes = `${año}-${String(mes + 1).padStart(2, '0')}`;
      
      if (!gastosPorMes.has(claveMes)) {
        gastosPorMes.set(claveMes, {
          año,
          mesNumero: mes + 1,
          categorias: new Map()
        });
      }
      
      const datosMes = gastosPorMes.get(claveMes)!;
      const datosCategoria = datosMes.categorias.get(gasto.categoria) || { total: 0, cantidad: 0 };
      
      datosMes.categorias.set(gasto.categoria, {
        total: datosCategoria.total + gasto.importe,
        cantidad: datosCategoria.cantidad + 1
      });
    });
    
    // Convertir a array y ordenar por fecha
    const meses = Array.from(gastosPorMes.entries())
      .map(([claveMes, datos]) => ({
        mes: claveMes,
        año: datos.año,
        mesNumero: datos.mesNumero,
        categorias: Array.from(datos.categorias.entries())
          .map(([categoria, datosCategoria]) => ({
            categoria,
            total: datosCategoria.total,
            cantidad: datosCategoria.cantidad
          }))
          .sort((a, b) => b.total - a.total)
      }))
      .sort((a, b) => {
        if (a.año !== b.año) return a.año - b.año;
        return a.mesNumero - b.mesNumero;
      });
    
    return meses;
  }
};
