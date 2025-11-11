// Tipos para el sistema de registro de gastos deducibles

export type CategoriaGasto = 
  | 'equipamiento'
  | 'certificaciones'
  | 'marketing'
  | 'transporte'
  | 'materiales'
  | 'software'
  | 'seguros'
  | 'alquiler'
  | 'servicios_profesionales'
  | 'formacion'
  | 'comunicaciones'
  | 'dietas'
  | 'vestimenta'
  | 'otros';

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

export interface ArchivoAdjunto {
  id: string;
  nombre: string;
  url: string;
  tipo: string; // 'image' | 'pdf' | 'other'
  tamaño: number; // en bytes
  fechaSubida: Date;
}

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

