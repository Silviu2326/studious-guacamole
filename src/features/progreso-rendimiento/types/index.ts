export type UserRole = 'entrenador' | 'gimnasio';

export interface ProgresoCliente {
  id: string;
  clienteId: string;
  clienteNombre: string;
  fechaRegistro: string;
  fechaUltimaActualizacion: string;
  estado: 'activo' | 'completado' | 'pausado';
}

export interface MetricaFuerza {
  id: string;
  progresoId: string;
  ejercicioId: string;
  ejercicioNombre: string;
  pesoMaximo: number;
  repeticionesMaximas: number;
  fecha: string;
  notas?: string;
}

export interface MetricaRangoMovimiento {
  id: string;
  progresoId: string;
  ejercicioId: string;
  ejercicioNombre: string;
  rangoGrados: number;
  flexibilidadScore: number; // 0-100
  fecha: string;
  notas?: string;
}

export interface FotoComparativa {
  id: string;
  progresoId: string;
  tipo: 'frente' | 'lado' | 'espalda' | 'detalle';
  url: string;
  fecha: string;
  etiquetas?: string[];
}

export interface DatosGrafico {
  fecha: string;
  valor: number;
  tipo: 'fuerza' | 'repeticiones' | 'rango_movimiento' | 'flexibilidad';
}

export interface Tendencia {
  id: string;
  progresoId: string;
  tipo: 'fuerza' | 'repeticiones' | 'rango_movimiento';
  ejercicioId?: string;
  direccion: 'mejora' | 'estancamiento' | 'regresion';
  porcentajeCambio: number;
  periodo: string;
  fecha: string;
}

export interface AlertaEstancamiento {
  id: string;
  progresoId: string;
  clienteId: string;
  clienteNombre: string;
  tipo: 'fuerza' | 'repeticiones' | 'rango_movimiento';
  ejercicioId?: string;
  ejercicioNombre?: string;
  diasSinProgreso: number;
  severidad: 'baja' | 'media' | 'alta';
  fecha: string;
  leida: boolean;
}

export interface RecomendacionProgreso {
  id: string;
  progresoId: string;
  tipo: 'aumentar_carga' | 'cambiar_ejercicio' | 'modificar_repeticiones' | 'enfocar_flexibilidad' | 'periodo_descanso';
  titulo: string;
  descripcion: string;
  prioridad: 'baja' | 'media' | 'alta';
  fecha: string;
  aplicada: boolean;
}

export interface HistorialRendimiento {
  id: string;
  progresoId: string;
  fecha: string;
  tipo: 'fuerza' | 'repeticiones' | 'rango_movimiento' | 'foto' | 'check_in';
  datos: Record<string, any>;
  notas?: string;
}

export interface ResumenProgreso {
  clienteId: string;
  clienteNombre: string;
  progresoId: string;
  fuerzaPromedio: number;
  repeticionesPromedio: number;
  rangoMovimientoPromedio: number;
  fotosTotales: number;
  fechaInicio: string;
  fechaUltimaActualizacion: string;
  progresoGeneral: number; // 0-100
}

export interface AnalisisTendencias {
  progresoId: string;
  periodo: string;
  tendencias: Tendencia[];
  progresoPromedio: number;
  ejerciciosMejorados: string[];
  ejerciciosEstancados: string[];
  recomendaciones: RecomendacionProgreso[];
}

