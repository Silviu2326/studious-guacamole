// Tipos para el sistema de registro de gastos deducibles

/**
 * ============================================================================
 * TIPOS BASE DEL MÓDULO DE GASTOS
 * ============================================================================
 * Estos tipos son utilizados principalmente en:
 * - GestorGastosDeducibles: Componente principal para gestión de gastos
 * - BankCSVImport: Para relacionar transacciones bancarias con gastos
 * - TaxCalculator: Para cálculos fiscales basados en gastos deducibles
 * - FinancialDashboard: Para visualización de gastos en el dashboard
 * ============================================================================
 */

/**
 * Categoría de gasto
 * Utilizado en: GestorGastosDeducibles, TaxCalculator, FinancialDashboard
 */
export type ExpenseCategory = 
  | 'alquiler'
  | 'material'
  | 'software'
  | 'marketing'
  | 'viajes'
  | 'equipamiento'
  | 'certificaciones'
  | 'transporte'
  | 'materiales'
  | 'seguros'
  | 'servicios_profesionales'
  | 'formacion'
  | 'comunicaciones'
  | 'dietas'
  | 'vestimenta'
  | 'otros';

/**
 * Alias para mantener compatibilidad con código existente
 * @deprecated Usar ExpenseCategory en nuevo código
 */
export type CategoriaGasto = ExpenseCategory;

export interface CategoriaGastoInfo {
  id: CategoriaGasto;
  nombre: string;
  descripcion: string;
  icono?: string;
}

export const CATEGORIAS_GASTO: Record<CategoriaGasto, CategoriaGastoInfo> = {
  equipamiento: {
    id: 'equipamiento',
    nombre: 'Equipamiento',
    descripcion: 'Compra de equipos, máquinas, pesas, material de entrenamiento',
    icono: 'Dumbbell'
  },
  certificaciones: {
    id: 'certificaciones',
    nombre: 'Certificaciones',
    descripcion: 'Cursos, certificaciones profesionales, renovaciones de licencias',
    icono: 'Award'
  },
  marketing: {
    id: 'marketing',
    nombre: 'Marketing',
    descripcion: 'Publicidad, redes sociales, material promocional, fotografía profesional',
    icono: 'Megaphone'
  },
  transporte: {
    id: 'transporte',
    nombre: 'Transporte',
    descripcion: 'Combustible, mantenimiento de vehículo, peajes, parking',
    icono: 'Car'
  },
  materiales: {
    id: 'materiales',
    nombre: 'Materiales',
    descripcion: 'Material consumible, suplementos para demostraciones, toallas, etc.',
    icono: 'Package'
  },
  software: {
    id: 'software',
    nombre: 'Software',
    descripcion: 'Suscripciones a software, aplicaciones, plataformas online',
    icono: 'Laptop'
  },
  seguros: {
    id: 'seguros',
    nombre: 'Seguros',
    descripcion: 'Seguro de responsabilidad civil, seguro de vida, seguros profesionales',
    icono: 'Shield'
  },
  alquiler: {
    id: 'alquiler',
    nombre: 'Alquiler',
    descripcion: 'Alquiler de espacio, sala de entrenamiento, oficina',
    icono: 'Building'
  },
  servicios_profesionales: {
    id: 'servicios_profesionales',
    nombre: 'Servicios Profesionales',
    descripcion: 'Contabilidad, asesoría legal, consultoría, diseño gráfico',
    icono: 'Briefcase'
  },
  formacion: {
    id: 'formacion',
    nombre: 'Formación',
    descripcion: 'Cursos de formación continua, workshops, seminarios',
    icono: 'GraduationCap'
  },
  comunicaciones: {
    id: 'comunicaciones',
    nombre: 'Comunicaciones',
    descripcion: 'Teléfono, internet, servicios de comunicación empresarial',
    icono: 'Phone'
  },
  dietas: {
    id: 'dietas',
    nombre: 'Dietas',
    descripcion: 'Comidas de trabajo cuando se trabaja fuera de casa',
    icono: 'Utensils'
  },
  vestimenta: {
    id: 'vestimenta',
    nombre: 'Vestimenta',
    descripcion: 'Ropa de trabajo específica, calzado deportivo profesional',
    icono: 'Shirt'
  },
  otros: {
    id: 'otros',
    nombre: 'Otros',
    descripcion: 'Otros gastos deducibles no categorizados',
    icono: 'MoreHorizontal'
  }
};

/**
 * Estado del gasto en el flujo de revisión
 * Utilizado en: GestorGastosDeducibles (para flujo de aprobación/rechazo)
 */
export type ExpenseStatus = 
  | 'pendiente_revision'
  | 'aprobado'
  | 'rechazado'
  | 'observacion';

/**
 * Origen del gasto (cómo fue creado/importado)
 * Utilizado en: GestorGastosDeducibles, BankCSVImport
 */
export type ExpenseOrigin = 
  | 'manual'
  | 'banco'
  | 'importacionCSV';

/**
 * Tipo de IVA aplicable al gasto
 * Utilizado en: TaxCalculator, GestorGastosDeducibles
 */
export type TipoIVA = 
  | 'general'      // 21%
  | 'reducido'     // 10%
  | 'superreducido' // 4%
  | 'exento'       // 0%
  | 'no_sujeto';   // No sujeto a IVA

/**
 * Archivo adjunto a un gasto
 * Utilizado en: GestorGastosDeducibles, ExpenseFileUpload
 * @deprecated Usar ExpenseAttachment en nuevo código
 */
export interface ArchivoAdjunto {
  id: string;
  nombre: string;
  url: string;
  tipo: string; // 'image' | 'pdf' | 'other'
  tamaño: number; // en bytes
  fechaSubida: Date;
}

/**
 * Adjunto de gasto con relación explícita al gasto
 * Utilizado en: GestorGastosDeducibles, ExpenseFileUpload, TaxCalculator
 */
export interface ExpenseAttachment {
  id: string;
  expenseId: string; // ID del gasto al que pertenece
  url: string; // URL del archivo almacenado
  nombreArchivo: string; // Nombre original del archivo
  tipoArchivo: string; // MIME type o extensión (ej: 'image/jpeg', 'application/pdf')
  fechaSubida: Date; // Fecha y hora de subida
  tamaño?: number; // Tamaño en bytes (opcional)
}

/**
 * Tipo base completo de gasto con todos los campos requeridos
 * Utilizado en: GestorGastosDeducibles, TaxCalculator, FinancialDashboard, BankCSVImport
 */
export interface Expense {
  id: string;
  fecha: Date; // Fecha del gasto
  descripcion: string; // Descripción/concepto del gasto
  categoria: ExpenseCategory; // Categoría del gasto
  importe: number; // Importe del gasto (siempre positivo)
  tipoIVA: TipoIVA; // Tipo de IVA aplicable
  deducible: boolean; // Indica si el gasto es deducible fiscalmente
  estado: ExpenseStatus; // Estado en el flujo de revisión
  adjuntos: ExpenseAttachment[]; // Array de archivos adjuntos (facturas, recibos, etc.)
  origen: ExpenseOrigin; // Origen del gasto (manual, banco, importación CSV)
  notas?: string; // Notas opcionales adicionales
  // Campos adicionales para compatibilidad y auditoría
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
  usuarioCreacion?: string;
}

/**
 * Tipo legacy para mantener compatibilidad con código existente
 * Utilizado en: GestorGastosDeducibles (código existente)
 * @deprecated Usar Expense en nuevo código
 */
export interface GastoDeducible {
  id: string;
  fecha: Date;
  concepto: string;
  importe: number;
  categoria: CategoriaGasto;
  deducible: boolean; // Indica si el gasto es deducible o no deducible
  notas?: string;
  comprobante?: string; // URL o referencia al comprobante (deprecated, usar archivosAdjuntos)
  archivosAdjuntos?: ArchivoAdjunto[]; // Array de archivos adjuntos (fotos/PDFs)
  fechaCreacion: Date;
  fechaActualizacion: Date;
  usuarioCreacion: string;
}

export interface FiltroGastos {
  fechaInicio?: Date;
  fechaFin?: Date;
  categoria?: CategoriaGasto;
  concepto?: string;
  importeMin?: number;
  importeMax?: number;
  estado?: ExpenseStatus; // Filtro por estado del gasto
  textoLibre?: string; // Búsqueda de texto libre en descripción y notas
}

export interface CrearGastoRequest {
  fecha: Date;
  concepto: string;
  importe: number;
  categoria: CategoriaGasto;
  deducible: boolean;
  notas?: string;
  comprobante?: string;
  archivosAdjuntos?: ArchivoAdjunto[];
}

export interface ActualizarGastoRequest {
  fecha?: Date;
  concepto?: string;
  importe?: number;
  categoria?: CategoriaGasto;
  deducible?: boolean;
  notas?: string;
  comprobante?: string;
  archivosAdjuntos?: ArchivoAdjunto[];
}

export interface ResumenGastos {
  totalGastos: number;
  totalGastosDeducibles: number; // Total de gastos deducibles
  totalGastosNoDeducibles: number; // Total de gastos no deducibles
  cantidadGastos: number;
  cantidadGastosDeducibles: number; // Cantidad de gastos deducibles
  cantidadGastosNoDeducibles: number; // Cantidad de gastos no deducibles
  gastosPorCategoria: {
    categoria: CategoriaGasto;
    total: number;
    totalDeducible: number; // Total deducible de esta categoría
    totalNoDeducible: number; // Total no deducible de esta categoría
    cantidad: number;
    porcentaje: number;
  }[];
  promedioGasto: number;
  periodo: {
    fechaInicio: Date;
    fechaFin: Date;
  };
}

