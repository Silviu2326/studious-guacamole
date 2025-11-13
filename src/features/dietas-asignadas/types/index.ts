export interface Dieta {
  id: string;
  clienteId: string;
  clienteNombre?: string;
  tipo: 'individual' | 'plan-estandar' | 'pack-semanal';
  nombre: string;
  descripcion?: string;
  objetivo: ObjetivoNutricional;
  macros: MacrosNutricionales;
  comidas: Comida[];
  fechaInicio: string;
  fechaFin?: string;
  estado: 'activa' | 'pausada' | 'finalizada';
  restricciones?: string[];
  fotosComida?: FotoComida[];
  adherencia?: number; // Porcentaje de cumplimiento
  creadoEn: string;
  actualizadoEn: string;
  creadoPor: string;
  estadoPublicacion?: 'borrador' | 'publicado'; // Estado de publicación
  ultimoAutosave?: string; // Timestamp del último autosave
  publicadoEn?: string; // Timestamp de publicación
  // Métricas adicionales para visualización
  pesoCliente?: number; // Peso del cliente en kg (para calcular ratio proteína/kg)
  vasosAgua?: number; // Vasos de agua objetivo por día
  fibra?: number; // Gramos de fibra objetivo por día
  // Distribución de bloques por día (nuevo)
  distribucionBloques?: DistribucionBloquesDia[]; // Configuración de bloques activos por día
  indicadoresAdherencia?: IndicadorAdherenciaDia[]; // Indicadores de adherencia prevista por día
  // Metadatos por día (tags y comentarios)
  metadatosDia?: MetadatosDia[]; // Tags y comentarios visibles por día
  // Recordatorios de suplementos e hidratación (User Story 1)
  recordatorios?: Recordatorio[]; // Recordatorios asociados a comidas
  // Actividades de ejercicio y su impacto (User Story 2)
  actividadesEjercicio?: ActividadEjercicio[]; // Actividades de ejercicio adicionales
  // Notas, acuerdos y recordatorios etiquetados (User Story 1)
  notasRecordatorios?: NotaRecordatorio[]; // Notas, acuerdos y recordatorios del dietista
  // User Story 2: Presupuesto del cliente
  presupuestoSemanal?: number; // Presupuesto semanal en euros
  // User Story 1: Encuestas rápidas
  encuestasRapidas?: EncuestaRapida[]; // Encuestas rápidas asociadas a la dieta
  // User Story 2: Permisos de colaboradores
  permisosColaboradores?: PermisoColaborador[]; // Permisos de colaboradores para esta dieta
}

export interface PlanNutricional {
  id: string;
  nombre: string;
  descripcion: string;
  nivel: string; // Ej: "Nivel 1", "Nivel 2"
  categoria: CategoriaPlan;
  objetivo: ObjetivoNutricional;
  macros: MacrosNutricionales;
  comidas: Comida[];
  duracionSemanas?: number;
  precio?: number;
  activo: boolean;
  usoCount: number;
  efectividad?: {
    tasaExito: number;
    satisfaccionPromedio: number;
  };
  creadoEn: string;
}

export interface PackSemanal {
  id: string;
  nombre: string;
  descripcion: string;
  planId?: string;
  semanaNumero: number;
  macros: MacrosNutricionales;
  comidas: Comida[];
  fechaInicio: string;
  fechaFin: string;
}

export interface MacrosNutricionales {
  calorias: number;
  proteinas: number; // gramos
  carbohidratos: number; // gramos
  grasas: number; // gramos
}

// Notas de bloques (texto, audio, video)
export type TipoNota = 'texto' | 'audio' | 'video';

export interface NotaBloque {
  id: string;
  bloqueId: string; // ID del bloque/comida
  tipo: TipoNota;
  contenido?: string; // Para notas de texto
  urlArchivo?: string; // URL del archivo de audio o video
  duracion?: number; // Duración en segundos (para audio/video)
  creadoEn: string;
  creadoPor: string;
  actualizadoEn: string;
}

// Datos de temporizador para recetas
export interface TiempoReceta {
  id: string;
  recetaId: string;
  tiempoReal: number; // Tiempo real en minutos
  fecha: string;
  notas?: string; // Notas opcionales sobre el tiempo
}

export interface DatosTemporizador {
  recetaId: string; // ID de la receta/comida
  tiempoEstimado?: number; // Tiempo estimado en minutos
  tiempoReal?: number; // Tiempo real invertido en minutos
  historialTiempos: TiempoReceta[]; // Historial de tiempos reales
  ultimaEjecucion?: string; // Fecha de la última ejecución del temporizador
}

export interface Comida {
  id: string;
  nombre: string;
  tipo: TipoComida;
  alimentos: Alimento[];
  horario?: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  notas?: string;
  dia?: string; // ID del día de la semana (lunes, martes, etc.) - opcional para compatibilidad
  bloqueado?: boolean; // Si está bloqueado, no puede ser modificado por IA o automatizaciones
  // Campos avanzados (modo avanzado)
  tempoCulinario?: number; // Tiempo de preparación en minutos
  satisfaccionPrevista?: number; // Satisfacción prevista (1-5 o 0-100)
  sustitutos?: SustitutoComida[]; // Lista de sustitutos posibles
  instruccionesDetalladas?: string; // Instrucciones detalladas de preparación
  fechaComida?: string; // Fecha específica de la comida (para comparaciones)
  // Notas de bloque (texto, audio, video)
  notasBloque?: NotaBloque[]; // Notas personalizadas del dietista para el bloque
  // Datos de temporizador
  datosTemporizador?: DatosTemporizador; // Datos del temporizador para la receta
}

export interface SustitutoComida {
  id: string;
  nombre: string;
  razon: string; // Razón del sustituto (ej: "si no hay pollo", "versión vegana")
  macros: MacrosNutricionales;
  alimentos: Alimento[];
}

export interface Alimento {
  id: string;
  nombre: string;
  cantidad: number;
  unidad: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
}

export interface FotoComida {
  id: string;
  url: string;
  tipoComida: TipoComida;
  fecha: string;
  comentario?: string;
  validada: boolean;
}

export interface AsignacionDieta {
  id: string;
  dietaId: string;
  clienteId: string;
  planId?: string;
  packId?: string;
  fechaAsignacion: string;
  fechaInicio: string;
  fechaFin?: string;
  estado: 'activa' | 'pausada' | 'finalizada';
  observaciones?: string;
}

export interface SeguimientoMacros {
  clienteId: string;
  fecha: string;
  macrosObjetivo: MacrosNutricionales;
  macrosConsumidos: MacrosNutricionales;
  diferencia: MacrosNutricionales;
  porcentajeCumplimiento: number;
}

export interface AnalyticsNutricion {
  totalDietas: number;
  dietasActivas: number;
  adherenciaPromedio: number;
  clientesConDieta: number;
  planesMasUsados: PlanNutricional[];
  cumplimientoMacrosPromedio: number;
  tendenciaAdherencia: 'mejora' | 'estable' | 'empeora';
}

export type ObjetivoNutricional =
  | 'perdida-peso'
  | 'perdida-grasa'
  | 'ganancia-muscular'
  | 'mantenimiento'
  | 'rendimiento'
  | 'salud-general'
  | 'deficit-suave'
  | 'superavit-calorico';

export type CategoriaPlan =
  | 'perdida-grasa'
  | 'ganancia-muscular'
  | 'mantenimiento'
  | 'rendimiento'
  | 'salud-general';

export type TipoComida =
  | 'desayuno'
  | 'media-manana'
  | 'almuerzo'
  | 'merienda'
  | 'cena'
  | 'post-entreno';

export interface FiltrosDietas {
  clienteId?: string;
  tipo?: 'individual' | 'plan-estandar' | 'pack-semanal';
  objetivo?: ObjetivoNutricional;
  estado?: 'activa' | 'pausada' | 'finalizada';
  fechaInicio?: string;
  fechaFin?: string;
}

export interface DatosAsignacion {
  clienteId: string;
  tipo: 'individual' | 'plan-estandar' | 'pack-semanal';
  dietaId?: string;
  planId?: string;
  packId?: string;
  fechaInicio: string;
  fechaFin?: string;
  ajustarMacros?: boolean;
  macrosAjustados?: MacrosNutricionales;
  restricciones?: string[];
}

// Historial de cambios
export type TipoCambioDieta =
  | 'creacion'
  | 'actualizacion_macros'
  | 'actualizacion_comidas'
  | 'cambio_objetivo'
  | 'cambio_estado'
  | 'cambio_restricciones'
  | 'publicacion'
  | 'guardado_borrador'
  | 'duplicacion_semana'
  | 'otro';

export interface CambioDetalle {
  campo: string;
  valorAnterior?: any;
  valorNuevo?: any;
  descripcion?: string;
}

export interface HistorialCambioDieta {
  id: string;
  dietaId: string;
  tipoCambio: TipoCambioDieta;
  fechaCambio: string;
  descripcion: string;
  cambios: CambioDetalle[];
  realizadoPor?: string;
  realizadoPorNombre?: string;
  snapshot?: Dieta; // Snapshot completo de la dieta en ese momento
  metadata?: Record<string, any>;
}

// Atajos rápidos
export type TipoAccionRapida =
  | 'duplicar_semana'
  | 'generar_lista_compra'
  | 'equilibrar_macros_ia'
  | 'variar_recetas'
  | 'exportar_excel'
  | 'optimizar_semana_ia';

export interface AccionRapida {
  id: TipoAccionRapida;
  label: string;
  pinned: boolean;
  orden?: number;
}

// Configuración de métricas personalizables
export type TipoMetrica = 'kcal' | 'macronutrientes' | 'ratio-proteina' | 'vasos-agua' | 'fibra';

export interface ConfiguracionMetrica {
  id: TipoMetrica;
  label: string;
  visible: boolean;
  orden: number;
  nota?: string; // Nota o mini objetivo para la métrica (ej: "subir a 2000 ml de agua")
}

export interface PreferenciasMetricas {
  metricas: ConfiguracionMetrica[];
  clienteId?: string; // Si está definido, las preferencias son específicas del cliente
}

// Datos externos para contextualizar el plan nutricional
export interface DatosExternosCliente {
  clienteId: string;
  fecha: string;
  actividad?: {
    pasos: number;
    distancia: number; // en metros
    caloriasQuemadas: number;
    entrenamientos: number;
  };
  sueño?: {
    duracion: number; // en minutos
    calidad: 'poor' | 'fair' | 'good' | 'excellent';
    horasSueño: number;
  };
  estres?: {
    nivel: number; // 0-100
    fuente?: string;
  };
}

// Comparación con plan anterior
export interface ComparacionPlanAnterior {
  dietaAnterior: Dieta | null;
  desviacion: {
    calorias: number; // porcentaje
    proteinas: number; // porcentaje
    carbohidratos: number; // porcentaje
    grasas: number; // porcentaje
  };
  tendencia: 'mejora' | 'estable' | 'empeora';
}

// Notas de métricas por dieta
export interface NotasMetricas {
  dietaId: string;
  notas: Record<TipoMetrica, string | undefined>; // Mapa de métrica -> nota
  actualizadoEn: string;
}

// Recursos de biblioteca (para drag and drop)
export type TipoRecurso = 'receta' | 'plantilla' | 'alimento' | 'bloque';

export type EstiloCulinario =
  | 'mediterraneo'
  | 'asiatico'
  | 'mexicano'
  | 'italiano'
  | 'vegetariano'
  | 'vegano'
  | 'keto'
  | 'paleo'
  | 'low-carb'
  | 'alto-proteina'
  | 'sin-gluten'
  | 'sin-lactosa'
  | 'otro';

export type Alergeno =
  | 'gluten'
  | 'lactosa'
  | 'huevos'
  | 'pescado'
  | 'mariscos'
  | 'frutos-secos'
  | 'cacahuetes'
  | 'soja'
  | 'sesamo'
  | 'apio'
  | 'mostaza'
  | 'altramuces'
  | 'moluscos'
  | 'sulfitos';

export interface RecursoBiblioteca {
  id: string;
  tipo: TipoRecurso;
  nombre: string;
  descripcion?: string;
  macros: MacrosNutricionales;
  fibra?: number; // gramos
  sodio?: number; // miligramos
  tiempoPreparacion?: number; // minutos
  estiloCulinario?: EstiloCulinario[];
  restricciones?: string[]; // Ej: 'sin-gluten', 'sin-lactosa', 'sin-nueces'
  alergenos?: Alergeno[]; // Alérgenos presentes en el recurso
  costeEstimado?: number; // Coste estimado en euros
  huellaCarbono?: number; // Huella de carbono en kg CO2 equivalente
  proveedorExterno?: string; // ID del proveedor externo si fue importado
  certificado?: boolean; // Si el recurso está certificado
  ingredientesTemporada?: boolean; // Si contiene ingredientes de temporada
  tags?: string[];
  alimentos?: Alimento[]; // Para recetas y bloques
  comidas?: Comida[]; // Para plantillas y bloques
  recetas?: string[]; // IDs de recetas incluidas (para bloques)
  imagenUrl?: string;
  favorito?: boolean;
  creadoEn?: string;
  actualizadoEn?: string;
  creadoPor?: string; // ID del usuario que creó el recurso
  // Etiquetas de adherencia/satisfacción (agregadas o calculadas)
  nivelAdherencia?: NivelAdherencia; // Nivel de adherencia promedio o etiquetado
  nivelSatisfaccion?: NivelSatisfaccion; // Nivel de satisfacción promedio o etiquetado
  adherenciaPromedio?: number; // Adherencia promedio histórica (0-100)
  satisfaccionPromedio?: number; // Satisfacción promedio histórica (0-100)
}

// Filtros avanzados para biblioteca
export interface FiltrosBiblioteca {
  // Valores nutricionales
  caloriasMin?: number;
  caloriasMax?: number;
  proteinasMin?: number;
  proteinasMax?: number;
  carbohidratosMin?: number;
  carbohidratosMax?: number;
  grasasMin?: number;
  grasasMax?: number;
  fibraMin?: number;
  fibraMax?: number;
  sodioMin?: number;
  sodioMax?: number;
  // Estilo culinario
  estilosCulinarios?: EstiloCulinario[];
  // Restricciones
  restricciones?: string[];
  incluirSinRestricciones?: boolean;
  // Tiempo de preparación
  tiempoPreparacionMax?: number; // minutos
  // Otros
  tiposRecurso?: TipoRecurso[];
  tags?: string[];
  favoritos?: boolean;
  busqueda?: string; // Búsqueda por texto
  // Sostenibilidad y presupuesto
  costeMin?: number; // Coste mínimo en euros
  costeMax?: number; // Coste máximo en euros
  huellaCarbonoMax?: number; // Huella de carbono máxima en kg CO2
  soloCertificados?: boolean; // Solo recursos certificados
  soloTemporada?: boolean; // Solo ingredientes de temporada
  // Filtros de adherencia/satisfacción
  nivelAdherencia?: NivelAdherencia[]; // Filtrar por niveles de adherencia
  nivelSatisfaccion?: NivelSatisfaccion[]; // Filtrar por niveles de satisfacción
  minimaAdherencia?: number; // Adherencia mínima (0-100)
  minimaSatisfaccion?: number; // Satisfacción mínima (0-100)
  ordenarPor?: 'adherencia' | 'satisfaccion' | 'nombre' | 'calorias'; // Ordenar resultados
}

// Datos para drag and drop
export interface DragData {
  tipo: TipoRecurso;
  recurso: RecursoBiblioteca;
  origen: 'biblioteca'; // En el futuro podría ser 'calendario' para reordenar
}

// Datos para drop target
export interface DropTarget {
  dia?: string; // ID del día (para vista semanal)
  tipoComida?: TipoComida; // Tipo de comida (para vista semanal y diaria)
  fecha?: string; // Fecha específica (para vista diaria)
  bloqueId?: string; // ID del bloque de comida específico
}

// Colecciones de recursos favoritos
export interface ColeccionRecursos {
  id: string;
  nombre: string;
  descripcion?: string;
  color?: string; // Color para identificar visualmente la colección
  recursos: {
    id: string; // ID del recurso
    tipo: TipoRecurso; // Tipo: 'receta' | 'plantilla'
    agregadoEn: string; // Fecha de agregado
  }[];
  creadoEn: string;
  actualizadoEn: string;
  creadoPor: string;
}

// Filtros personalizados guardados
export interface FiltroPersonalizado {
  id: string;
  nombre: string;
  descripcion?: string;
  filtros: FiltrosBiblioteca;
  creadoEn: string;
  actualizadoEn: string;
  usadoCount: number; // Contador de veces que se ha usado
  creadoPor: string;
}

// Niveles de adherencia/satisfacción para recursos
export type NivelAdherencia = 'excelente' | 'muy-bueno' | 'bueno' | 'regular' | 'bajo';
export type NivelSatisfaccion = 'muy-alto' | 'alto' | 'medio' | 'bajo' | 'muy-bajo';

// Datos de adherencia histórica del cliente para un recurso
export interface AdherenciaHistoricaRecurso {
  clienteId: string;
  recursoId: string;
  vecesUsado: number;
  adherenciaPromedio: number; // Porcentaje de adherencia (0-100)
  ultimoUso?: string; // Fecha del último uso
  tendencia?: 'mejora' | 'estable' | 'empeora';
  observaciones?: string;
  nivelAdherencia?: NivelAdherencia; // Nivel de adherencia etiquetado
  nivelSatisfaccion?: NivelSatisfaccion; // Nivel de satisfacción etiquetado
}

// Etiquetas de adherencia/satisfacción agregadas a un recurso (global o por cliente)
export interface EtiquetaAdherenciaRecurso {
  recursoId: string;
  clienteId?: string; // Si está definido, la etiqueta es específica del cliente
  nivelAdherencia?: NivelAdherencia;
  nivelSatisfaccion?: NivelSatisfaccion;
  observaciones?: string;
  etiquetadoPor: string; // ID del usuario que etiquetó
  etiquetadoEn: string; // Fecha de etiquetado
  actualizadoEn: string;
}

// Datos para crear/editar un bloque personalizado
export interface DatosBloquePersonalizado {
  nombre: string;
  descripcion?: string;
  recetas: string[]; // IDs de recetas a incluir
  macros?: MacrosNutricionales; // Se calculará automáticamente si no se proporciona
  alergenos?: Alergeno[];
  costeEstimado?: number;
  tags?: string[];
  estiloCulinario?: EstiloCulinario[];
}

// Proveedores externos y marketplaces
export type TipoProveedor = 'marketplace' | 'api' | 'csv' | 'webhook';

export interface ProveedorExterno {
  id: string;
  nombre: string;
  tipo: TipoProveedor;
  descripcion?: string;
  url?: string;
  apiKey?: string; // Encriptado en producción
  activo: boolean;
  configuracion?: Record<string, any>;
  ultimaSincronizacion?: string;
  recursosImportados?: number;
  creadoEn: string;
  actualizadoEn: string;
}

// Configuración de distribución de bloques por día
export interface DistribucionBloquesDia {
  dia: string; // ID del día (lunes, martes, etc.)
  bloquesActivos: TipoComida[]; // Bloques de comida activos para este día
  macrosObjetivo?: MacrosNutricionales; // Macros objetivo específicos para este día (opcional)
}

// Indicador de adherencia prevista por día
export interface IndicadorAdherenciaDia {
  dia: string; // ID del día
  adherenciaPrevista: number; // Porcentaje de adherencia prevista (0-100)
  nivelRiesgo: 'bajo' | 'medio' | 'alto'; // Nivel de riesgo de incumplimiento
  factoresRiesgo: string[]; // Factores que influyen en el riesgo
  feedbackHistorico?: {
    diasSimilares: number; // Número de días similares en el historial
    adherenciaPromedio: number; // Adherencia promedio en días similares
    tendencia: 'mejora' | 'estable' | 'empeora';
  };
}

// Metadatos por día (tags y comentarios)
export interface MetadatosDia {
  dia: string; // ID del día (lunes, martes, etc.)
  tags?: string[]; // Tags contextuales (ej: "día pre-competición", "viaje")
  comentario?: string; // Comentario visible para contextualizar el día
}

export interface RecursoProveedorExterno {
  id: string;
  proveedorId: string;
  nombre: string;
  descripcion?: string;
  tipo: TipoRecurso;
  macros?: MacrosNutricionales;
  costeEstimado?: number;
  huellaCarbono?: number;
  certificado: boolean;
  ingredientesTemporada: boolean;
  imagenUrl?: string;
  enlace?: string;
  metadata?: Record<string, any>;
}

export interface ResultadoBusquedaProveedor {
  proveedor: ProveedorExterno;
  recursos: RecursoProveedorExterno[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

// Variaciones automáticas
export interface VariacionAutomatica {
  id: string;
  dietaId: string;
  tipoComida: TipoComida;
  dia: string; // ID del día (lunes, martes, etc.)
  opciones: Comida[]; // Lista de comidas que rotarán automáticamente
  activa: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface ConfiguracionVariaciones {
  dietaId: string;
  variaciones: VariacionAutomatica[];
}

// Comparación con sesión anterior
export interface ComparacionSesionAnterior {
  comidaActual: Comida;
  comidaAnterior: Comida | null;
  tipoComparacion: 'dia-anterior' | 'semana-anterior' | 'mismo-dia-semana-anterior';
  fechaAnterior: string;
  diferencias: {
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
  };
  porcentajesCambio: {
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
  };
  tendencia: 'mejora' | 'estable' | 'desviacion';
  mensaje?: string; // Mensaje descriptivo de la comparación
}

// Feedback del cliente tras cada comida (User Story 1)
export interface FeedbackCliente {
  id: string;
  comidaId: string;
  dietaId: string;
  clienteId: string;
  fecha: string;
  // Sensación del cliente (1-5)
  sensacion: number; // 1 = muy mal, 5 = excelente
  // Saciedad (1-5)
  saciedad: number; // 1 = nada saciado, 5 = muy saciado
  // Digestión (1-5) - User Story 2
  digestion?: number; // 1 = muy mal, 5 = excelente
  // Gusto (1-5) - User Story 2
  gusto?: number; // 1 = muy mal, 5 = excelente
  // Tiempo real consumido en minutos
  tiempoRealConsumido: number;
  // Comentarios opcionales
  comentarios?: string;
  // Si la comida fue completada
  completada: boolean;
  // Porcentaje de la comida consumido (0-100)
  porcentajeConsumido?: number;
  // Respuestas del dietista - User Story 2
  respuestas?: RespuestaFeedbackCliente[];
  creadoEn: string;
  actualizadoEn: string;
}

// Sugerencias de ajuste automático basadas en feedback
export interface SugerenciaAjusteAutomatico {
  id: string;
  feedbackId: string;
  tipo: 'reducir' | 'aumentar' | 'sustituir' | 'ajustar-horario' | 'modificar-cantidad';
  descripcion: string;
  razon: string; // Razón basada en el feedback
  accion: string; // Acción específica a realizar
  impacto: 'alto' | 'medio' | 'bajo';
  aplicada: boolean;
  creadoEn: string;
}

// Alertas de sobrecarga detectadas por IA (User Story 2)
export type TipoSobrecarga = 
  | 'exceso-fibra'
  | 'deficiencia-fibra' // Nueva: deficiencia de fibra
  | 'baja-hidratacion'
  | 'exceso-proteina'
  | 'exceso-carbohidratos'
  | 'exceso-grasas'
  | 'exceso-procesados' // Nueva: exceso de alimentos procesados
  | 'deficit-calorico'
  | 'exceso-calorico'
  | 'patron-repetitivo';

export interface AlertaSobrecarga {
  id: string;
  dietaId: string;
  clienteId: string;
  tipo: TipoSobrecarga;
  severidad: 'alta' | 'media' | 'baja';
  titulo: string;
  descripcion: string;
  // Detalles específicos del problema
  detalles: {
    diasAfectados: string[]; // IDs de días afectados
    valores?: Record<string, number>; // Valores específicos (ej: { fibra: 45, objetivo: 30 })
    patron?: string; // Descripción del patrón detectado
  };
  // Soluciones concretas (User Story 1)
  soluciones?: string[]; // Lista de soluciones concretas y accionables
  // Bloque preventivo sugerido
  bloquePreventivo?: BloquePreventivo;
  // Si la alerta ha sido vista
  vista: boolean;
  // Si se ha aplicado el bloque preventivo
  bloqueAplicado: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

// Bloque preventivo que se puede añadir con un clic
export interface BloquePreventivo {
  id: string;
  alertaId: string;
  tipo: 'comida' | 'snack' | 'bebida' | 'ajuste-macros';
  nombre: string;
  descripcion: string;
  // Comida sugerida (si aplica)
  comidaSugerida?: Comida;
  // Ajuste de macros (si aplica)
  ajusteMacros?: {
    calorias?: number;
    proteinas?: number;
    carbohidratos?: number;
    grasas?: number;
    fibra?: number;
    agua?: number; // ml
  };
  // Días donde aplicar el bloque
  diasAplicar: string[]; // IDs de días
  // Tipo de comida donde aplicar
  tipoComida?: TipoComida;
  creadoEn: string;
}

// Recordatorios de suplementos e hidratación (User Story 1)
export type TipoRecordatorio = 'suplemento' | 'hidratacion';

export interface RecordatorioSuplemento {
  id: string;
  tipo: 'suplemento';
  nombre: string; // Ej: "Proteína en polvo", "Creatina", "Vitamina D"
  cantidad?: string; // Ej: "1 scoop", "5g", "1 cápsula"
  horario?: string; // Hora del recordatorio (ej: "08:00")
  tipoComidaAsociada?: TipoComida; // Tipo de comida con la que se asocia
  comidaId?: string; // ID específico de la comida si está asociado a una comida concreta
  dia?: string; // ID del día (lunes, martes, etc.) - opcional
  notas?: string; // Notas adicionales
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface RecordatorioHidratacion {
  id: string;
  tipo: 'hidratacion';
  cantidad: number; // Cantidad en ml
  horario?: string; // Hora del recordatorio
  tipoComidaAsociada?: TipoComida; // Tipo de comida con la que se asocia
  comidaId?: string; // ID específico de la comida si está asociado a una comida concreta
  dia?: string; // ID del día (lunes, martes, etc.) - opcional
  notas?: string; // Notas adicionales (ej: "Con electrolitos")
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export type Recordatorio = RecordatorioSuplemento | RecordatorioHidratacion;

// Actividades de ejercicio y su impacto calórico (User Story 2)
export interface ActividadEjercicio {
  id: string;
  nombre: string; // Ej: "Running", "Ciclismo", "Entrenamiento de fuerza"
  tipo: 'cardio' | 'fuerza' | 'flexibilidad' | 'otro';
  duracion: number; // Duración en minutos
  intensidad: 'baja' | 'moderada' | 'alta' | 'muy-alta';
  caloriasPorHora: number; // Calorías quemadas por hora (estimado)
  caloriasTotales: number; // Calorías totales quemadas (calculado)
  horarioInicio?: string; // Hora de inicio (ej: "18:00")
  horarioFin?: string; // Hora de fin (ej: "19:30")
  dia?: string; // ID del día (lunes, martes, etc.)
  fecha?: string; // Fecha específica si aplica
  notas?: string; // Notas adicionales
  // Impacto en ajuste de ingesta
  requiereAjusteIngesta?: boolean; // Si requiere ajustar la ingesta calórica
  ajusteRecomendado?: {
    calorias: number; // Calorías adicionales recomendadas
    proteinas?: number; // Proteínas adicionales recomendadas (g)
    carbohidratos?: number; // Carbohidratos adicionales recomendadas (g)
    tipoComidaRecomendada?: TipoComida; // Tipo de comida recomendada para el ajuste
  };
  creadoEn: string;
  actualizadoEn: string;
}

// Impacto estimado de ejercicio en el timeline
export interface ImpactoEjercicioTimeline {
  actividadId: string;
  horaInicio: string; // Hora de inicio en formato HH:mm
  horaFin: string; // Hora de fin en formato HH:mm
  caloriasPorHora: number;
  caloriasTotales: number;
  impactoEnIngesta: {
    caloriasAdicionalesRecomendadas: number;
    distribucionRecomendada: {
      tipoComida: TipoComida;
      calorias: number;
      proteinas?: number;
      carbohidratos?: number;
    }[];
  };
}

// Cuestionario de metodología del dietista (User Story 1 y 2)
export type TipoMetricaExcel = 
  | 'calorias'
  | 'proteinas'
  | 'carbohidratos'
  | 'grasas'
  | 'fibra'
  | 'azucares'
  | 'sodio'
  | 'ratio-proteina'
  | 'vasos-agua'
  | 'adherencia'
  | 'tiempo-preparacion'
  | 'coste'
  | 'satisfaccion-prevista';

export type NivelDetalle = 'basico' | 'intermedio' | 'avanzado' | 'completo';

export type FocoCliente = 
  | 'perdida-peso'
  | 'ganancia-muscular'
  | 'rendimiento'
  | 'salud-general'
  | 'deficit-calorico'
  | 'superavit-calorico'
  | 'mantenimiento'
  | 'flexibilidad';

export interface ConfiguracionColumnaExcel {
  id: TipoMetricaExcel;
  label: string;
  visible: boolean;
  orden: number;
  formula?: string; // Fórmula Excel opcional (ej: "=SUM(B2:B8)")
  formato?: 'numero' | 'porcentaje' | 'moneda' | 'texto' | 'fecha';
  ancho?: number; // Ancho de columna
}

export interface RespuestaCuestionarioMetodologia {
  id?: string;
  dietistaId: string;
  // Métricas preferidas
  metricas: TipoMetricaExcel[];
  // Nivel de detalle
  nivelDetalle: NivelDetalle;
  // Foco del cliente
  focoCliente: FocoCliente[];
  // Configuración de columnas generada
  columnasExcel: ConfiguracionColumnaExcel[];
  // Fórmulas personalizadas
  formulasPersonalizadas?: Record<string, string>; // Mapa de columna -> fórmula
  // Fecha de creación y última actualización
  creadoEn: string;
  actualizadoEn: string;
  // Versión del cuestionario (para tracking de cambios)
  version: number;
}

export interface ConfiguracionVistaExcel {
  cuestionarioId: string;
  columnas: ConfiguracionColumnaExcel[];
  formulas: Record<string, string>;
  estilo?: {
    colorEncabezados?: string;
    colorFilasAlternas?: string;
    formatoNumeros?: string;
  };
}

// Plantillas sugeridas basadas en cuestionario (User Story 1)
export type TipoPlantillaSugerida = 
  | 'entrenador-fuerza'
  | 'nutricionista-endurance'
  | 'perdida-peso'
  | 'ganancia-muscular'
  | 'salud-general'
  | 'rendimiento-deportivo'
  | 'flexibilidad-macros';

export interface PlantillaSugerida {
  id: string;
  tipo: TipoPlantillaSugerida;
  nombre: string;
  descripcion: string;
  icono?: string;
  // Configuración de columnas adaptada
  columnasRecomendadas: TipoMetricaExcel[];
  // Configuración de resúmenes adaptada
  resumenesRecomendados: {
    tipo: 'diario' | 'semanal' | 'mensual';
    metricas: TipoMetricaExcel[];
  }[];
  // Fórmulas predefinidas para esta plantilla
  formulasPredefinidas?: Record<string, string>;
  // Puntuación de coincidencia (0-100)
  puntuacionCoincidencia: number;
  // Razones por las que se sugiere
  razones: string[];
}

// Fórmulas personalizadas avanzadas (User Story 2)
export type TipoFormulaPersonalizada = 
  | 'tonelaje'
  | 'densidad-energetica'
  | 'porcentaje-vegetariano'
  | 'ratio-carbohidratos-proteina'
  | 'indice-saciedad'
  | 'carga-glicemica'
  | 'custom';

export interface FormulaPersonalizada {
  id: string;
  nombre: string;
  tipo: TipoFormulaPersonalizada;
  descripcion?: string;
  // Fórmula en formato JavaScript/Excel
  formula: string;
  // Variables disponibles en la fórmula
  variables: {
    nombre: string;
    descripcion: string;
    tipo: 'numero' | 'porcentaje' | 'texto';
  }[];
  // Formato de salida
  formato: 'numero' | 'porcentaje' | 'moneda' | 'texto';
  // Unidad de medida
  unidad?: string;
  // Si se recalcula automáticamente
  recalculoAutomatico: boolean;
  // Columna donde se muestra (si aplica)
  columnaId?: string;
  // Orden de visualización
  orden: number;
  // Activa o no
  activa: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface ConfiguracionFormulasPersonalizadas {
  dietistaId: string;
  formulas: FormulaPersonalizada[];
  version: number;
  actualizadoEn: string;
}

// Plantillas personalizadas con fórmulas y formatos (User Story 2)
export interface PlantillaPersonalizada {
  id: string;
  nombre: string;
  descripcion?: string;
  dietistaId: string;
  // Configuración de columnas guardada
  columnasExcel: ConfiguracionColumnaExcel[];
  // Fórmulas personalizadas guardadas
  formulasPersonalizadas: Record<string, string>; // Mapa de columna -> fórmula
  // Estilos y formatos guardados
  estilo?: {
    colorEncabezados?: string;
    colorFilasAlternas?: string;
    formatoNumeros?: string;
    anchoColumnas?: Record<string, number>; // Mapa de columna -> ancho
  };
  // Configuración de formato condicional
  formatoCondicional?: {
    reglas: {
      columna: string;
      condicion: 'mayor-que' | 'menor-que' | 'entre' | 'igual';
      valor1: number;
      valor2?: number;
      estilo: {
        backgroundColor?: string;
        color?: string;
        fontWeight?: string;
      };
    }[];
  };
  // Tags para categorización
  tags?: string[];
  // Si es favorita
  favorita?: boolean;
  // Contador de uso
  vecesUsada: number;
  // Fecha de creación y última actualización
  creadoEn: string;
  actualizadoEn: string;
  ultimoUso?: string;
}

// Notas, acuerdos y recordatorios etiquetados (User Story 1)
export type TipoNotaRecordatorio = 'nota' | 'acuerdo' | 'recordatorio';

export type EtiquetaRecordatorio = 
  | 'revisar-suplementacion'
  | 'coordinar-con-entrenador'
  | 'seguimiento-cliente'
  | 'ajuste-macros'
  | 'revision-semanal'
  | 'feedback-cliente'
  | 'cambio-objetivo'
  | 'restricciones'
  | 'otro';

export interface NotaRecordatorio {
  id: string;
  dietaId: string;
  tipo: TipoNotaRecordatorio;
  titulo: string;
  contenido: string;
  etiquetas: EtiquetaRecordatorio[];
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: string;
  completado: boolean;
  fechaCompletado?: string;
  prioridad?: 'alta' | 'media' | 'baja';
  fechaRecordatorio?: string; // Fecha/hora para recordatorios
}

// Timeline de hitos y tareas pendientes (User Story 1)
export type TipoHito = 
  | 'control-medico'
  | 'competicion'
  | 'sesion-clave'
  | 'evaluacion'
  | 'evento-deportivo'
  | 'otro';

export interface Hito {
  id: string;
  dietaId: string;
  clienteId: string;
  tipo: TipoHito;
  titulo: string;
  descripcion?: string;
  fecha: string; // Fecha del hito
  hora?: string; // Hora opcional
  ubicacion?: string;
  importancia: 'alta' | 'media' | 'baja';
  // Impacto nutricional esperado
  impactoNutricional?: {
    ajusteMacrosRecomendado?: {
      calorias?: number;
      proteinas?: number;
      carbohidratos?: number;
      grasas?: number;
    };
    recomendaciones?: string[];
    diasPreparacion?: number; // Días antes del hito para preparación
    diasRecuperacion?: number; // Días después del hito para recuperación
  };
  completado: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export type TipoTarea = 
  | 'revisar-macros'
  | 'ajustar-plan'
  | 'coordinar-entrenador'
  | 'revisar-suplementacion'
  | 'feedback-cliente'
  | 'preparacion-hito'
  | 'seguimiento'
  | 'otro';

export interface TareaPendiente {
  id: string;
  dietaId: string;
  clienteId: string;
  tipo: TipoTarea;
  titulo: string;
  descripcion?: string;
  fechaLimite?: string; // Fecha límite para completar
  prioridad: 'alta' | 'media' | 'baja';
  relacionadaConHito?: string; // ID del hito relacionado
  completada: boolean;
  fechaCompletado?: string;
  creadoEn: string;
  actualizadoEn: string;
}

// Planes de contingencia (User Story 2)
export type TipoCondicionExterna = 
  | 'viaje'
  | 'evento-social'
  | 'lesion'
  | 'enfermedad'
  | 'cambio-horario'
  | 'restriccion-temporal'
  | 'otro';

export interface CondicionExterna {
  id: string;
  dietaId: string;
  clienteId: string;
  tipo: TipoCondicionExterna;
  titulo: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin?: string; // Opcional si es un evento puntual
  severidad: 'alta' | 'media' | 'baja';
  // Detalles específicos según el tipo
  detalles?: {
    destino?: string; // Para viajes
    tipoEvento?: string; // Para eventos sociales
    tipoLesion?: string; // Para lesiones
    restricciones?: string[]; // Restricciones temporales
  };
  detectadoEn: string; // Fecha de detección
  confirmado: boolean; // Si el dietista ha confirmado la condición
}

export interface PlanContingencia {
  id: string;
  condicionId: string;
  dietaId: string;
  clienteId: string;
  nombre: string;
  descripcion: string;
  // Ajustes al plan nutricional
  ajustes: {
    macros?: {
      calorias?: number; // Ajuste en calorías (puede ser negativo)
      proteinas?: number; // Ajuste en gramos
      carbohidratos?: number; // Ajuste en gramos
      grasas?: number; // Ajuste en gramos
    };
    comidasModificadas?: {
      tipoComida: TipoComida;
      sustituciones?: string[]; // IDs de comidas sustitutas
      ajustes?: string[]; // Descripción de ajustes
    }[];
    recomendaciones?: string[]; // Recomendaciones específicas
  };
  // Días afectados
  diasAfectados: string[]; // IDs de días (lunes, martes, etc.)
  // Prioridad de aplicación
  prioridad: 'alta' | 'media' | 'baja';
  // Si el plan ha sido aplicado
  aplicado: boolean;
  fechaAplicacion?: string;
  // Puntuación de relevancia (0-100)
  relevancia: number;
  // Razones por las que se sugiere
  razones: string[];
  creadoEn: string;
  actualizadoEn: string;
}

// User Story 1: Insights de Salud Global (coste, variedad nutricional, grado de procesamiento)
export type NivelProcesamiento = 'sin-procesar' | 'minimamente-procesado' | 'procesado' | 'ultra-procesado';

export interface AlimentoProcesamiento {
  alimentoId: string;
  nombre: string;
  nivelProcesamiento: NivelProcesamiento;
  porcentajeEnDieta: number; // Porcentaje que representa en la dieta total
}

export interface InsightVariedadNutricional {
  gruposAlimentarios: {
    grupo: string; // Ej: 'frutas', 'verduras', 'cereales', 'proteínas', 'lácteos', etc.
    alimentos: number; // Cantidad de alimentos únicos en este grupo
    porcentaje: number; // Porcentaje del total de alimentos
    recomendado: boolean; // Si cumple con las recomendaciones de variedad
  }[];
  puntuacionVariedad: number; // 0-100, puntuación de variedad nutricional
  recomendaciones: string[]; // Recomendaciones para mejorar la variedad
}

export interface InsightGradoProcesamiento {
  distribucion: {
    nivel: NivelProcesamiento;
    porcentaje: number; // Porcentaje de alimentos en este nivel
    alimentos: AlimentoProcesamiento[];
  }[];
  puntuacionProcesamiento: number; // 0-100, mayor = menos procesado (mejor)
  recomendaciones: string[]; // Recomendaciones para reducir procesamiento
  alimentosUltraProcesados: AlimentoProcesamiento[]; // Lista de alimentos ultra-procesados
}

export interface InsightCoste {
  costeTotalSemanal: number; // Coste total estimado por semana en euros
  costeTotalMensual: number; // Coste total estimado por mes en euros
  costePorDia: number; // Coste promedio por día
  costePorComida: number; // Coste promedio por comida
  distribucionPorTipoComida: {
    tipoComida: TipoComida;
    coste: number;
    porcentaje: number;
  }[];
  comparacionMercado: {
    promedio: number; // Promedio del mercado
    diferencia: number; // Diferencia con el promedio (positivo = más caro)
    porcentajeDiferencia: number; // Porcentaje de diferencia
  };
  recomendaciones: string[]; // Recomendaciones para optimizar costes
}

export interface InsightsSaludGlobal {
  dietaId: string;
  clienteId: string;
  coste: InsightCoste;
  variedadNutricional: InsightVariedadNutricional;
  gradoProcesamiento: InsightGradoProcesamiento;
  puntuacionGeneral: number; // 0-100, puntuación general de salud global
  resumen: string; // Resumen ejecutivo de los insights
  recomendacionesPrioritarias: string[]; // Top 3-5 recomendaciones prioritarias
  generadoEn: string;
  actualizadoEn: string;
}

// User Story 2: Contenido Educativo Sugerido
export type TipoContenidoEducativo = 'articulo' | 'video' | 'infografia' | 'podcast' | 'receta';

export type TipoRetoCliente = 
  | 'adherencia-baja'
  | 'falta-variedad'
  | 'exceso-procesados'
  | 'coste-alto'
  | 'falta-motivacion'
  | 'dificultad-preparacion'
  | 'restricciones-alimentarias'
  | 'objetivos-no-cumplidos'
  | 'falta-conocimiento-nutricional'
  | 'horarios-irregulares'
  | 'otro';

export interface ContenidoEducativo {
  id: string;
  tipo: TipoContenidoEducativo;
  titulo: string;
  descripcion: string;
  url: string;
  duracion?: number; // Duración en minutos (para videos/podcasts)
  imagenUrl?: string;
  autor?: string;
  fechaPublicacion?: string;
  tags?: string[];
  relevancia: number; // 0-100, relevancia para el reto específico
  dificultad: 'basico' | 'intermedio' | 'avanzado';
  idioma?: string;
  fuente?: string; // Fuente del contenido (ej: "Blog Nutrición", "YouTube", etc.)
}

export interface RetoCliente {
  id: string;
  tipo: TipoRetoCliente;
  titulo: string;
  descripcion: string;
  severidad: 'alta' | 'media' | 'baja';
  detectadoEn: string; // Fecha de detección
  evidencias?: string[]; // Evidencias que respaldan el reto
  contenidoRecomendado: ContenidoEducativo[]; // Contenido educativo recomendado para este reto
}

export interface SugerenciasContenidoEducativo {
  dietaId: string;
  clienteId: string;
  retos: RetoCliente[];
  contenidoPrioritario: ContenidoEducativo[]; // Top 5-10 contenidos más relevantes
  resumen: string; // Resumen de los retos detectados y contenido recomendado
  generadoEn: string;
  actualizadoEn: string;
}

// User Story 1: Reglas de balanceo automático de macros
export interface ReglaBalanceoMacros {
  id: string;
  dietistaId: string;
  nombre: string;
  descripcion?: string;
  activa: boolean;
  // Reglas de proteína
  proteinaMinima?: number; // gramos mínimos de proteína
  proteinaMaxima?: number; // gramos máximos de proteína
  // Reglas de carbohidratos
  carbohidratosMinimos?: number; // gramos mínimos
  carbohidratosMaximos?: number; // gramos máximos
  // Reglas de grasas
  grasasMinimas?: number; // gramos mínimos
  grasasMaximas?: number; // gramos máximos
  // Reglas de azúcares
  azucaresMaximos?: number; // gramos máximos de azúcares
  // Reglas de calorías
  caloriasMinimas?: number; // calorías mínimas
  caloriasMaximas?: number; // calorías máximas
  // Reglas adicionales
  fibraMinima?: number; // gramos mínimos de fibra
  sodioMaximo?: number; // miligramos máximos de sodio
  // Prioridad de ajuste (qué macros ajustar primero si hay conflicto)
  prioridadAjuste: ('proteinas' | 'carbohidratos' | 'grasas' | 'calorias')[];
  // Aplicar a todos los clientes o solo a clientes específicos
  aplicarATodos: boolean;
  clienteIds?: string[]; // IDs de clientes específicos si aplicarATodos es false
  creadoEn: string;
  actualizadoEn: string;
}

export type AlcanceBalanceo = 'dia' | 'semana';

export interface ResultadoBalanceoMacros {
  dietaId: string;
  alcance: AlcanceBalanceo;
  diasAfectados?: string[]; // IDs de días afectados si alcance es 'dia'
  macrosAntes: MacrosNutricionales;
  macrosDespues: MacrosNutricionales;
  cambios: {
    comidaId: string;
    nombreComida: string;
    cambios: {
      campo: 'calorias' | 'proteinas' | 'carbohidratos' | 'grasas';
      valorAnterior: number;
      valorNuevo: number;
      diferencia: number;
      explicacion?: string; // USER STORY 1: Explicación clara del ajuste
    }[];
    explicacionGeneral?: string; // USER STORY 1: Explicación general del cambio en esta comida
  }[];
  reglasAplicadas: string[]; // IDs de reglas aplicadas
  explicacionesReglas?: { // USER STORY 1: Explicaciones detalladas de las reglas aplicadas
    reglaId: string;
    nombreRegla: string;
    explicacion: string; // Por qué se aplicó esta regla
    impacto: string; // Qué impacto tiene en la dieta
  }[];
  explicacionGeneral?: string; // USER STORY 1: Explicación general del balanceo
  tiempoEjecucion: number; // milisegundos
  exito: boolean;
  mensaje?: string;
  advertencias?: string[];
}

// User Story 2: Reglas personalizadas (condiciones + acciones)
export type TipoCondicionRegla =
  | 'dia-libre'
  | 'dia-entreno'
  | 'dia-descanso'
  | 'dia-especifico'
  | 'tag-dia'
  | 'cumplimiento-macros'
  | 'adherencia-baja'
  | 'evento-calendario'
  | 'fecha-especifica'
  | 'dia-semana'
  | 'feedback-negativo' // USER STORY 2: Evento de feedback negativo del cliente
  | 'ingesta-fuera-rango' // USER STORY 2: Ingesta registrada fuera del rango objetivo
  | 'feedback-bajo' // USER STORY 2: Feedback con sensación/saciedad baja
  | 'cumplimiento-bajo'; // USER STORY 2: Cumplimiento bajo en seguimiento

export type TipoAccionRegla =
  | 'añadir-comida'
  | 'añadir-postre'
  | 'ajustar-macros'
  | 'sustituir-comida'
  | 'eliminar-comida'
  | 'modificar-cantidad'
  | 'añadir-suplemento'
  | 'notificar-dietista'
  | 'aplicar-plantilla';

export type FrecuenciaEjecucion = 'bajo-demanda' | 'diaria' | 'semanal' | 'mensual' | 'recurrente';

export interface CondicionRegla {
  tipo: TipoCondicionRegla;
  parametros: Record<string, any>; // Parámetros específicos según el tipo
  // Ejemplos:
  // - Para 'dia-libre': { activo: true }
  // - Para 'dia-semana': { dias: ['sabado', 'domingo'] }
  // - Para 'tag-dia': { tags: ['viaje', 'evento'] }
  // - Para 'cumplimiento-macros': { porcentajeMinimo: 80 }
}

export interface AccionRegla {
  tipo: TipoAccionRegla;
  parametros: Record<string, any>; // Parámetros específicos según el tipo
  // Ejemplos:
  // - Para 'añadir-comida': { tipoComida: 'postre', macros: {...}, nombre: 'Postre libre' }
  // - Para 'ajustar-macros': { calorias: 200, proteinas: 10 }
  // - Para 'sustituir-comida': { tipoComida: 'cena', comidaId: '...' }
}

export interface ReglaPersonalizada {
  id: string;
  dietistaId: string;
  nombre: string;
  descripcion?: string;
  activa: boolean;
  condicion: CondicionRegla;
  accion: AccionRegla;
  frecuencia: FrecuenciaEjecucion;
  // Para frecuencia 'recurrente', especificar patrón
  patronRecurrencia?: {
    tipo: 'diaria' | 'semanal' | 'mensual';
    dias?: string[]; // Para semanal: ['lunes', 'miercoles']
    diaMes?: number; // Para mensual: día del mes (1-31)
    hora?: string; // Hora de ejecución (HH:mm)
  };
  // Aplicar a todas las dietas o solo a dietas específicas
  aplicarATodas: boolean;
  dietaIds?: string[]; // IDs de dietas específicas si aplicarATodas es false
  // Historial de ejecuciones
  ultimaEjecucion?: string;
  vecesEjecutada: number;
  // Configuración adicional
  requiereConfirmacion: boolean; // Si requiere confirmación antes de ejecutar
  notificarDietista: boolean; // Si notificar al dietista cuando se ejecuta
  creadoEn: string;
  actualizadoEn: string;
}

export interface EjecucionRegla {
  id: string;
  reglaId: string;
  dietaId: string;
  fechaEjecucion: string;
  exito: boolean;
  resultado?: {
    cambiosAplicados: number;
    detalles: string[];
  };
  error?: string;
  confirmada: boolean; // Si requiere confirmación y fue confirmada
  confirmadaPor?: string; // ID del usuario que confirmó
  confirmadaEn?: string;
}

// User Story 2: Simulación de impacto de recomendaciones IA
export interface SimulacionImpactoIA {
  id: string;
  recomendacionId: string;
  tipoRecomendacion: 'sustitucion-receta' | 'ajuste-macros' | 'añadir-comida' | 'eliminar-comida' | 'modificar-cantidad';
  descripcion: string;
  // Estado antes de la recomendación
  estadoAntes: {
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
    costeTotal: number; // En euros
    tiempoPreparacionTotal: number; // En minutos
    numeroComidas: number;
  };
  // Estado después de aplicar la recomendación
  estadoDespues: {
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
    costeTotal: number;
    tiempoPreparacionTotal: number;
    numeroComidas: number;
  };
  // Variaciones calculadas
  variaciones: {
    calorias: {
      valor: number; // Diferencia absoluta
      porcentaje: number; // Porcentaje de cambio
      tendencia: 'aumento' | 'disminucion' | 'sin-cambio';
    };
    coste: {
      valor: number; // Diferencia absoluta en euros
      porcentaje: number; // Porcentaje de cambio
      tendencia: 'aumento' | 'disminucion' | 'sin-cambio';
    };
    tiempoPreparacion: {
      valor: number; // Diferencia absoluta en minutos
      porcentaje: number; // Porcentaje de cambio
      tendencia: 'aumento' | 'disminucion' | 'sin-cambio';
    };
    macros?: {
      proteinas: {
        valor: number;
        porcentaje: number;
        tendencia: 'aumento' | 'disminucion' | 'sin-cambio';
      };
      carbohidratos: {
        valor: number;
        porcentaje: number;
        tendencia: 'aumento' | 'disminucion' | 'sin-cambio';
      };
      grasas: {
        valor: number;
        porcentaje: number;
        tendencia: 'aumento' | 'disminucion' | 'sin-cambio';
      };
    };
  };
  // Impacto en objetivos nutricionales
  impactoObjetivos?: {
    objetivo: ObjetivoNutricional;
    cumplimientoAntes: number; // Porcentaje de cumplimiento
    cumplimientoDespues: number;
    mejora: number; // Diferencia en porcentaje
  };
  // Recomendaciones adicionales
  recomendacionesAdicionales?: string[];
  // Si la simulación ha sido aplicada
  aplicada: boolean;
  fechaSimulacion: string;
}

export interface RecomendacionIA {
  id: string;
  tipo: 'sustitucion-receta' | 'ajuste-macros' | 'añadir-comida' | 'eliminar-comida' | 'modificar-cantidad';
  titulo: string;
  descripcion: string;
  razon: string;
  prioridad: 'alta' | 'media' | 'baja';
  // Detalles específicos según el tipo
  detalles: {
    comidaId?: string; // ID de la comida afectada
    recursoId?: string; // ID del recurso a usar
    recurso?: RecursoBiblioteca; // Recurso completo
    ajusteMacros?: {
      calorias?: number;
      proteinas?: number;
      carbohidratos?: number;
      grasas?: number;
    };
    cantidad?: number; // Nueva cantidad
    tipoComida?: TipoComida; // Tipo de comida para añadir
  };
  // Simulación de impacto (se calcula al solicitar)
  simulacion?: SimulacionImpactoIA;
}

// User Story 1: Conexión con apps externas (MyFitnessPal, Cronometer) e inventario de ingredientes
export type TipoConexionExterna = 'myfitnesspal' | 'cronometer' | 'inventario-ingredientes' | 'otro';

export interface ConexionExterna {
  id: string;
  tipo: TipoConexionExterna;
  nombre: string;
  descripcion?: string;
  activa: boolean;
  // Credenciales (encriptadas en producción)
  credenciales?: {
    apiKey?: string;
    token?: string;
    usuario?: string;
    configuracion?: Record<string, any>;
  };
  // Configuración de sincronización
  sincronizacionAutomatica: boolean;
  frecuenciaSincronizacion?: 'diaria' | 'semanal' | 'manual';
  ultimaSincronizacion?: string;
  // Estadísticas
  ingredientesSincronizados?: number;
  recetasSincronizadas?: number;
  ultimaActualizacion?: string;
  creadoEn: string;
  actualizadoEn: string;
  creadoPor: string;
}

export interface IngredienteInventario {
  id: string;
  nombre: string;
  categoria?: string; // Ej: 'proteínas', 'carbohidratos', 'verduras', etc.
  // Valores nutricionales por 100g
  macros: MacrosNutricionales;
  fibra?: number; // gramos
  sodio?: number; // miligramos
  // Información adicional
  unidadBase: string; // 'g', 'ml', 'unidad'
  costePorUnidad?: number; // Coste por unidad base
  proveedor?: string;
  fechaCaducidad?: string;
  stock?: number; // Cantidad disponible
  stockMinimo?: number; // Cantidad mínima recomendada
  // Metadatos
  tags?: string[];
  imagenUrl?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface DatosSincronizacionExterna {
  conexionId: string;
  tipo: TipoConexionExterna;
  // Datos sincronizados
  ingredientes?: IngredienteInventario[];
  recetas?: RecursoBiblioteca[];
  macrosActualizados?: {
    alimentoId: string;
    macros: MacrosNutricionales;
    fuente: string; // De dónde viene el dato
  }[];
  fechaSincronizacion: string;
  exito: boolean;
  errores?: string[];
  resumen?: {
    ingredientesNuevos: number;
    ingredientesActualizados: number;
    recetasNuevas: number;
    recetasActualizadas: number;
    macrosActualizados: number;
  };
}

export interface ResultadoActualizacionValores {
  dietaId: string;
  alimentosActualizados: {
    alimentoId: string;
    nombre: string;
    valoresAnteriores: MacrosNutricionales;
    valoresNuevos: MacrosNutricionales;
    diferencia: MacrosNutricionales;
    fuente: string; // 'myfitnesspal', 'cronometer', 'inventario'
  }[];
  comidasAfectadas: string[]; // IDs de comidas afectadas
  macrosDietaAntes: MacrosNutricionales;
  macrosDietaDespues: MacrosNutricionales;
  fechaActualizacion: string;
}

// User Story 2: Generación de planes alternativos
export type TipoPlanAlternativo = 
  | 'vegetariano'
  | 'vegano'
  | 'presupuesto-reducido'
  | 'alto-presupuesto'
  | 'sin-gluten'
  | 'sin-lactosa'
  | 'keto'
  | 'paleo'
  | 'mediterraneo'
  | 'bajo-carbohidratos'
  | 'alto-carbohidratos'
  | 'alto-proteina'
  | 'bajo-sodio'
  | 'personalizado';

export interface ConfiguracionPlanAlternativo {
  tipo: TipoPlanAlternativo;
  nombre?: string; // Nombre personalizado si es 'personalizado'
  // Restricciones específicas
  restricciones?: string[];
  // Ajustes de macros (opcional, se calcularán automáticamente si no se especifican)
  ajusteMacros?: {
    calorias?: number; // Porcentaje de ajuste (-20 a +20)
    proteinas?: number;
    carbohidratos?: number;
    grasas?: number;
  };
  // Ajustes de presupuesto (para presupuesto-reducido/alto-presupuesto)
  ajustePresupuesto?: {
    porcentaje?: number; // -30% para reducido, +30% para alto
    costeMaximoPorDia?: number; // Coste máximo por día en euros
  };
  // Preferencias de estilo culinario
  estiloCulinario?: EstiloCulinario[];
  // Mantener estructura original
  mantenerEstructura: boolean; // Si true, mantiene la misma estructura de comidas
  // Días a modificar (si está vacío, modifica toda la semana)
  diasModificar?: string[]; // IDs de días
}

export interface PlanAlternativo {
  id: string;
  dietaOriginalId: string;
  nombre: string;
  descripcion: string;
  tipo: TipoPlanAlternativo;
  configuracion: ConfiguracionPlanAlternativo;
  // Plan generado
  dieta: Dieta;
  // Comparación con el plan original
  comparacion: {
    macros: {
      calorias: { original: number; alternativo: number; diferencia: number; porcentaje: number };
      proteinas: { original: number; alternativo: number; diferencia: number; porcentaje: number };
      carbohidratos: { original: number; alternativo: number; diferencia: number; porcentaje: number };
      grasas: { original: number; alternativo: number; diferencia: number; porcentaje: number };
    };
    coste?: {
      original: number; // Coste semanal estimado
      alternativo: number;
      diferencia: number;
      porcentaje: number;
    };
    cambios: {
      comidasModificadas: number;
      comidasSustituidas: number;
      comidasEliminadas: number;
      comidasAñadidas: number;
    };
  };
  // Razones de los cambios
  razonesCambios: string[];
  // Si el plan ha sido aplicado
  aplicado: boolean;
  fechaAplicacion?: string;
  creadoEn: string;
  creadoPor: string;
}

export interface OpcionesGeneracionPlanAlternativo {
  dietaId: string;
  configuracion: ConfiguracionPlanAlternativo;
  // Opciones avanzadas
  usarIA?: boolean; // Si usar IA para optimizar las sustituciones
  mantenerMacrosObjetivo?: boolean; // Si mantener los macros objetivo del plan original
  priorizarIngredientesDisponibles?: boolean; // Si priorizar ingredientes del inventario
  conexionExternaId?: string; // ID de conexión externa para obtener datos reales
}

// User Story 1 y 2: Listas de compra por cliente, semana o tipo de comida
export type CategoriaAlimento = 
  | 'frutas'
  | 'verduras'
  | 'proteinas'
  | 'carbohidratos'
  | 'lacteos'
  | 'despensa'
  | 'condimentos'
  | 'bebidas'
  | 'frutos-secos'
  | 'aceites-grasas'
  | 'otros';

export interface ItemListaCompra {
  id: string;
  nombre: string;
  cantidad: number;
  unidad: string; // 'g', 'kg', 'ml', 'l', 'unidades', etc.
  categoria: CategoriaAlimento;
  // Información adicional
  notas?: string; // Notas opcionales sobre el ingrediente
  adquirido?: boolean; // Si ya fue adquirido
  prioridad?: 'alta' | 'media' | 'baja';
  // Origen del ingrediente (para tracking)
  origenComidas?: {
    comidaId: string;
    comidaNombre: string;
    tipoComida: TipoComida;
    dia?: string;
  }[];
}

export interface ListaCompra {
  id: string;
  clienteId: string;
  clienteNombre?: string;
  dietaId?: string;
  dietaNombre?: string;
  // Filtros aplicados
  filtros: {
    tipoFiltro: 'cliente' | 'semana' | 'tipo-comida' | 'completa';
    semanaNumero?: number; // Si es por semana
    fechaInicio?: string; // Fecha de inicio de la semana
    fechaFin?: string; // Fecha de fin de la semana
    tiposComida?: TipoComida[]; // Si es por tipo de comida
  };
  // Items agrupados por categoría
  itemsPorCategoria: Record<CategoriaAlimento, ItemListaCompra[]>;
  // Items sin agrupar (para compatibilidad)
  items: ItemListaCompra[];
  // Ajustes aplicados
  ajustes?: {
    numeroPersonas: number;
    numeroRaciones?: number; // Raciones por persona
    multiplicador: number; // Multiplicador aplicado (ej: 2 personas = 2.0)
  };
  // Metadatos
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: string;
  // Totales
  totalItems: number;
  totalCategorias: number;
  // User Story 1: Sugerencias de meal prep
  sugerenciasMealPrep?: SugerenciaMealPrep[];
  // User Story 2: Cálculo de coste y presupuesto
  calculoCoste?: CalculoCosteSemanal;
}

export interface FiltrosGeneracionListaCompra {
  clienteId?: string;
  dietaId?: string;
  tipoFiltro: 'cliente' | 'semana' | 'tipo-comida' | 'completa';
  semanaNumero?: number;
  fechaInicio?: string;
  fechaFin?: string;
  tiposComida?: TipoComida[];
  // Ajustes iniciales
  numeroPersonas?: number;
  numeroRaciones?: number;
}

export interface AjusteRaciones {
  listaCompraId: string;
  numeroPersonas: number;
  numeroRaciones?: number; // Raciones por persona (por defecto 1)
  mantenerProporciones?: boolean; // Si mantener las proporciones originales
}

// User Story 1: Sugerencias de Meal Prep
export interface SugerenciaMealPrep {
  id: string;
  listaCompraId: string;
  dia: string; // 'lunes', 'martes', etc.
  descripcion: string; // Ej: "Prepara 3 raciones de pollo el lunes"
  itemsRelacionados: string[]; // IDs de items de la lista de compra relacionados
  prioridad: 'alta' | 'media' | 'baja';
  completada?: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

// User Story 2: Presupuesto y Coste
export interface PresupuestoCliente {
  clienteId: string;
  presupuestoSemanal: number; // Presupuesto semanal en euros
  moneda?: string; // Por defecto 'EUR'
  fechaInicio?: string;
  fechaFin?: string;
  activo: boolean;
}

export interface CalculoCosteSemanal {
  costeTotal: number; // Coste total estimado en euros
  costePorDia: number; // Coste promedio por día
  costePorComida: number; // Coste promedio por comida
  itemsConCoste: Array<{
    itemId: string;
    nombre: string;
    cantidad: number;
    unidad: string;
    costeUnitario: number;
    costeTotal: number;
  }>;
  comparacionPresupuesto?: {
    presupuesto: number;
    diferencia: number; // costeTotal - presupuesto
    porcentaje: number; // (costeTotal / presupuesto) * 100
    excedePresupuesto: boolean;
  };
}

// User Story 1: Comentarios y menciones para otros profesionales (entrenadores, médicos)
export type TipoProfesional = 'entrenador' | 'medico' | 'fisioterapeuta' | 'psicologo' | 'otro';

export interface MencionProfesional {
  profesionalId: string;
  profesionalNombre: string;
  tipo: TipoProfesional;
}

export interface ComentarioProfesional {
  id: string;
  dietaId: string;
  clienteId: string;
  // Contexto del comentario
  comidaId?: string; // Si está relacionado con una comida específica
  dia?: string; // Si está relacionado con un día específico
  tipoComida?: TipoComida; // Si está relacionado con un tipo de comida
  // Contenido
  contenido: string;
  // Menciones a profesionales
  menciones: MencionProfesional[];
  // Prioridad y estado
  prioridad?: 'alta' | 'media' | 'baja';
  resuelto: boolean;
  fechaResolucion?: string;
  // Metadatos
  creadoPor: string;
  creadoPorNombre?: string;
  creadoEn: string;
  actualizadoEn: string;
  // Respuestas de profesionales mencionados
  respuestas?: RespuestaComentarioProfesional[];
}

export interface RespuestaComentarioProfesional {
  id: string;
  comentarioId: string;
  contenido: string;
  respondidoPor: string;
  respondidoPorNombre: string;
  tipoProfesional: TipoProfesional;
  creadoEn: string;
  actualizadoEn: string;
}

// User Story 2: Respuestas del dietista al feedback del cliente
export interface RespuestaFeedbackCliente {
  id: string;
  feedbackId: string;
  dietaId: string;
  clienteId: string;
  contenido: string;
  // Si la respuesta incluye un ajuste propuesto
  incluyeAjuste?: boolean;
  ajustePropuesto?: {
    tipo: 'modificar-comida' | 'sustituir-comida' | 'ajustar-macros' | 'cambiar-horario' | 'otro';
    descripcion: string;
    aplicado: boolean;
    fechaAplicacion?: string;
  };
  // Metadatos
  creadoPor: string;
  creadoPorNombre?: string;
  creadoEn: string;
  actualizadoEn: string;
  // Si el cliente ha visto la respuesta
  vistoPorCliente: boolean;
  fechaVistoPorCliente?: string;
}

// User Story 1: Reportes semanales/mensuales con evolución de métricas y hábitos
export type TipoPeriodoReporte = 'semanal' | 'mensual';

export interface EvolucionMetrica {
  metrica: string; // Nombre de la métrica (ej: 'calorias', 'proteinas', 'adherencia')
  valores: {
    fecha: string;
    valor: number;
    objetivo?: number; // Valor objetivo si aplica
  }[];
  tendencia: 'mejora' | 'estable' | 'empeora';
  cambioPorcentual: number; // Cambio porcentual desde el inicio del período
  promedio: number;
  minimo: number;
  maximo: number;
}

export interface EvolucionHabito {
  habito: string; // Nombre del hábito (ej: 'comidas-completadas', 'hidratacion', 'ejercicio')
  valores: {
    fecha: string;
    cumplimiento: number; // Porcentaje de cumplimiento (0-100)
    observaciones?: string;
  }[];
  tendencia: 'mejora' | 'estable' | 'empeora';
  cumplimientoPromedio: number; // Porcentaje promedio de cumplimiento
  diasCompletados: number; // Días con cumplimiento >= 80%
  diasTotales: number;
}

export interface ResumenPeriodo {
  fechaInicio: string;
  fechaFin: string;
  periodo: TipoPeriodoReporte;
  metricas: {
    calorias: { promedio: number; objetivo: number; cumplimiento: number };
    proteinas: { promedio: number; objetivo: number; cumplimiento: number };
    carbohidratos: { promedio: number; objetivo: number; cumplimiento: number };
    grasas: { promedio: number; objetivo: number; cumplimiento: number };
    adherencia: { promedio: number; tendencia: 'mejora' | 'estable' | 'empeora' };
  };
  habitos: {
    comidasCompletadas: { porcentaje: number; tendencia: 'mejora' | 'estable' | 'empeora' };
    hidratacion: { porcentaje: number; tendencia: 'mejora' | 'estable' | 'empeora' };
    ejercicio: { dias: number; tendencia: 'mejora' | 'estable' | 'empeora' };
  };
  logros: string[]; // Logros destacados del período
  areasMejora: string[]; // Áreas que requieren atención
}

export interface ReporteEvolucion {
  id: string;
  dietaId: string;
  clienteId: string;
  clienteNombre?: string;
  periodo: TipoPeriodoReporte;
  fechaInicio: string;
  fechaFin: string;
  resumen: ResumenPeriodo;
  evolucionMetricas: EvolucionMetrica[];
  evolucionHabitos: EvolucionHabito[];
  graficos?: {
    tipo: 'linea' | 'barras' | 'area';
    datos: any; // Datos para gráficos (formato flexible)
  }[];
  notas?: string; // Notas adicionales del dietista
  generadoEn: string;
  generadoPor: string;
  compartidoCon?: string[]; // IDs de usuarios/equipos con los que se compartió
}

export interface OpcionesGeneracionReporte {
  dietaId: string;
  clienteId: string;
  periodo: TipoPeriodoReporte;
  fechaInicio: string;
  fechaFin: string;
  incluirMetricas?: string[]; // IDs de métricas a incluir
  incluirHabitos?: string[]; // IDs de hábitos a incluir
  incluirGraficos?: boolean;
  formato?: 'pdf' | 'excel' | 'html';
}

// User Story 2: Gestión de versiones de planes
export interface VersionPlan {
  id: string;
  dietaId: string;
  numeroVersion: number; // Número de versión (1, 2, 3, ...)
  nombre?: string; // Nombre opcional de la versión (ej: "Versión con ajuste de macros")
  descripcion?: string; // Descripción de los cambios en esta versión
  snapshot: Dieta; // Snapshot completo de la dieta en esta versión
  cambios: {
    campo: string;
    valorAnterior?: any;
    valorNuevo?: any;
    descripcion?: string;
  }[];
  creadoEn: string;
  creadoPor: string;
  creadoPorNombre?: string;
  esVersionActual: boolean; // Si es la versión actualmente activa
  etiquetas?: string[]; // Etiquetas para categorizar versiones (ej: 'backup', 'experimental')
}

export interface ComparacionVersiones {
  versionOrigen: VersionPlan;
  versionDestino: VersionPlan;
  diferencias: {
    campo: string;
    valorOrigen?: any;
    valorDestino?: any;
    tipoCambio: 'modificado' | 'añadido' | 'eliminado';
    descripcion?: string;
  }[];
  resumen: {
    totalCambios: number;
    cambiosMacros: number;
    cambiosComidas: number;
    cambiosOtros: number;
  };
  impactoEstimado?: {
    nivel: 'bajo' | 'medio' | 'alto';
    descripcion: string;
  };
}

export interface OpcionesCrearVersion {
  dietaId: string;
  nombre?: string;
  descripcion?: string;
  etiquetas?: string[];
  incluirSnapshot: boolean; // Si incluir snapshot completo o solo cambios
}

export interface OpcionesRecuperarVersion {
  versionId: string;
  dietaId: string;
  crearNuevaVersion?: boolean; // Si crear una nueva versión antes de recuperar (para mantener historial)
  mantenerVersionActual?: boolean; // Si mantener la versión actual como backup
}

// User Story 1: Encuestas rápidas para clientes
export type TipoEncuestaRapida = 
  | 'satisfaccion-semanal'
  | 'facilidad-preparacion'
  | 'satisfaccion-comida'
  | 'saciedad'
  | 'digestion'
  | 'gusto'
  | 'adherencia'
  | 'dificultades'
  | 'sugerencias'
  | 'personalizada';

export type TipoPreguntaEncuesta = 
  | 'escala' // Escala 1-5 o 1-10
  | 'si-no'
  | 'texto'
  | 'multiple-opcion'
  | 'rating-estrellas';

export interface PreguntaEncuestaRapida {
  id: string;
  tipo: TipoPreguntaEncuesta;
  texto: string;
  requerida: boolean;
  opciones?: string[]; // Para múltiple opción
  escalaMin?: number; // Para escala (por defecto 1)
  escalaMax?: number; // Para escala (por defecto 5)
  etiquetaMin?: string; // Etiqueta para valor mínimo (ej: "Muy difícil")
  etiquetaMax?: string; // Etiqueta para valor máximo (ej: "Muy fácil")
  orden: number;
}

export interface EncuestaRapida {
  id: string;
  dietaId: string;
  clienteId: string;
  nombre: string;
  descripcion?: string;
  tipo: TipoEncuestaRapida;
  preguntas: PreguntaEncuestaRapida[];
  // Configuración de envío
  frecuencia?: 'una-vez' | 'semanal' | 'mensual' | 'personalizada';
  diaSemana?: string[]; // Para frecuencia semanal (ej: ['lunes'])
  fechaEnvio?: string; // Para envío único
  // Estado
  activa: boolean;
  enviada: boolean;
  fechaCreacion: string;
  fechaEnvio?: string;
  fechaVencimiento?: string;
  // Respuestas
  respuestasRecibidas: number;
  totalRespuestasEsperadas: number;
  // Configuración adicional
  recordatorio?: boolean; // Si enviar recordatorio
  recordatorioHoras?: number; // Horas después del envío para recordatorio
  creadoPor: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface RespuestaEncuestaRapida {
  id: string;
  encuestaId: string;
  dietaId: string;
  clienteId: string;
  clienteNombre?: string;
  respuestas: {
    preguntaId: string;
    valor: string | number | boolean;
    texto?: string; // Para respuestas de texto
  }[];
  completada: boolean;
  fechaEnvio?: string;
  fechaRespuesta?: string;
  tiempoCompletado?: number; // Tiempo en segundos para completar
  creadoEn: string;
  actualizadoEn: string;
}

export interface InsightEncuestaRapida {
  encuestaId: string;
  encuestaNombre: string;
  tipo: TipoEncuestaRapida;
  totalRespuestas: number;
  promedioPuntuacion?: number; // Si tiene preguntas de escala
  distribucionRespuestas?: {
    preguntaId: string;
    preguntaTexto: string;
    distribucion: Record<string, number>; // valor -> cantidad
    promedio?: number;
  }[];
  respuestasTexto?: {
    preguntaId: string;
    preguntaTexto: string;
    respuestas: string[];
  }[];
  tendencia?: 'mejora' | 'estable' | 'empeora';
  recomendaciones?: string[];
  generadoEn: string;
}

// User Story 2: Permisos de colaboradores para dietas
export type TipoPermisoDieta = 
  | 'solo-lectura' // Solo puede ver la dieta
  | 'sugerencias' // Puede ver y hacer sugerencias, pero no editar
  | 'edicion-completa'; // Puede editar completamente la dieta

export interface PermisoColaborador {
  id: string;
  dietaId: string;
  colaboradorId: string;
  colaboradorNombre?: string;
  colaboradorEmail?: string;
  tipo: TipoPermisoDieta;
  // Permisos específicos
  permisos: {
    ver: boolean;
    sugerir: boolean;
    editar: boolean;
    eliminar: boolean;
    asignar: boolean; // Asignar a otros clientes
    publicar: boolean; // Publicar la dieta
    comentar: boolean; // Comentar en la dieta
  };
  // Restricciones opcionales
  restricciones?: {
    soloComidas?: boolean; // Solo puede editar comidas, no macros
    soloBloques?: string[]; // Solo puede editar ciertos bloques/días
    requiereAprobacion?: boolean; // Los cambios requieren aprobación
  };
  // Metadatos
  asignadoPor: string;
  asignadoPorNombre?: string;
  asignadoEn: string;
  activo: boolean;
  fechaInicio?: string;
  fechaFin?: string;
  actualizadoEn: string;
}

export interface SugerenciaColaborador {
  id: string;
  dietaId: string;
  colaboradorId: string;
  colaboradorNombre?: string;
  tipo: 'modificar-comida' | 'sustituir-comida' | 'ajustar-macros' | 'añadir-comida' | 'eliminar-comida' | 'cambiar-horario' | 'otro';
  titulo: string;
  descripcion: string;
  // Detalles de la sugerencia
  detalles: {
    comidaId?: string;
    tipoComida?: TipoComida;
    dia?: string;
    cambiosPropuestos?: {
      campo: string;
      valorAnterior?: any;
      valorNuevo: any;
      razon?: string;
    }[];
  };
  // Estado
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'aplicada';
  aprobadaPor?: string;
  aprobadaPorNombre?: string;
  fechaAprobacion?: string;
  rechazadaPor?: string;
  fechaRechazo?: string;
  razonRechazo?: string;
  aplicadaPor?: string;
  fechaAplicacion?: string;
  // Metadatos
  creadoEn: string;
  actualizadoEn: string;
  comentarios?: ComentarioSugerencia[];
}

export interface ComentarioSugerencia {
  id: string;
  sugerenciaId: string;
  contenido: string;
  creadoPor: string;
  creadoPorNombre?: string;
  creadoEn: string;
  tipo: 'comentario' | 'aprobacion' | 'rechazo';
}

export interface HistorialPermisos {
  id: string;
  dietaId: string;
  colaboradorId: string;
  accion: 'asignado' | 'modificado' | 'revocado' | 'activado' | 'desactivado';
  permisosAnteriores?: TipoPermisoDieta;
  permisosNuevos?: TipoPermisoDieta;
  realizadoPor: string;
  realizadoPorNombre?: string;
  fecha: string;
  razon?: string;
}

// User Story 1: Historial cronológico de comentarios y decisiones por bloque
export type TipoEntradaHistorial = 
  | 'comentario-profesional'
  | 'nota-bloque'
  | 'cambio-dieta'
  | 'feedback-cliente'
  | 'decision-dietista'
  | 'sugerencia-colaborador'
  | 'version-plan';

export interface EntradaHistorialBloque {
  id: string;
  bloqueId: string; // ID del bloque/comida
  tipo: TipoEntradaHistorial;
  fecha: string; // Fecha/hora del evento (orden cronológico)
  titulo: string;
  descripcion: string;
  // Datos específicos según el tipo
  datos?: {
    // Para comentarios profesionales
    comentarioId?: string;
    mencionaProfesionales?: string[];
    // Para notas de bloque
    notaId?: string;
    tipoNota?: TipoNota;
    // Para cambios de dieta
    cambioId?: string;
    tipoCambio?: TipoCambioDieta;
    cambiosDetalle?: CambioDetalle[];
    // Para feedback del cliente
    feedbackId?: string;
    sensacion?: number;
    saciedad?: number;
    // Para decisiones del dietista
    decision?: string;
    razon?: string;
    // Para sugerencias de colaboradores
    sugerenciaId?: string;
    estadoSugerencia?: 'pendiente' | 'aprobada' | 'rechazada' | 'aplicada';
    // Para versiones
    versionId?: string;
    numeroVersion?: number;
  };
  // Metadatos
  realizadoPor: string;
  realizadoPorNombre?: string;
  metadata?: Record<string, any>;
}

export interface HistorialBloque {
  bloqueId: string;
  bloqueNombre?: string;
  entradas: EntradaHistorialBloque[];
  totalEntradas: number;
  fechaPrimeraEntrada?: string;
  fechaUltimaEntrada?: string;
}

// User Story 2: Preferencias de tema y tamaño de fuente
export type TemaColor = 'claro' | 'oscuro' | 'auto' | 'sepia' | 'alto-contraste';

export type TamañoFuente = 'pequeño' | 'mediano' | 'grande' | 'muy-grande';

export interface PreferenciasTemaFuente {
  dietistaId: string;
  tema: TemaColor;
  tamañoFuente: TamañoFuente;
  // Configuración avanzada
  configuracionAvanzada?: {
    colorFondo?: string; // Color personalizado de fondo (hex)
    colorTexto?: string; // Color personalizado de texto (hex)
    colorPrimario?: string; // Color primario personalizado (hex)
    tamañoFuentePersonalizado?: number; // Tamaño en px
    espaciadoLinea?: number; // Espaciado entre líneas (1.0 - 2.0)
    contraste?: number; // Nivel de contraste (1.0 - 3.0)
  };
  // Aplicar a módulos específicos
  aplicarAModulos?: string[]; // IDs de módulos donde aplicar (si está vacío, aplica a todos)
  creadoEn: string;
  actualizadoEn: string;
}

// User Story 1: Entrenamiento contextual (tooltips, vídeos cortos)
export interface ContenidoEntrenamiento {
  id: string;
  featureId: string; // ID de la función/componente relacionado
  featureNombre: string; // Nombre de la función
  tipo: 'tooltip' | 'video' | 'ambos';
  titulo: string;
  descripcion: string;
  contenido: {
    tooltip?: {
      texto: string;
      posicion?: 'top' | 'bottom' | 'left' | 'right';
      duracion?: number; // Duración en ms antes de auto-ocultar (0 = no auto-ocultar)
    };
    video?: {
      url: string;
      duracion: number; // Duración en segundos
      thumbnail?: string;
      subtitulos?: string; // URL de archivo de subtítulos
    };
  };
  nivel: 'basico' | 'intermedio' | 'avanzado';
  tags: string[];
  visto: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface EstadoEntrenamiento {
  dietistaId: string;
  contenidoVisto: string[]; // IDs de contenido visto
  preferencias: {
    mostrarTooltips: boolean;
    mostrarVideos: boolean;
    autoMostrarNuevasFunciones: boolean;
    nivelPreferido: 'basico' | 'intermedio' | 'avanzado' | 'todos';
  };
  ultimaActualizacion: string;
}

// User Story 2: Accesibilidad - Soporte para lectores de pantalla
export interface ConfiguracionAccesibilidad {
  dietistaId: string;
  modoAltoContraste: boolean;
  soporteLectorPantalla: boolean;
  anunciosLectorPantalla: {
    cambiosEstado: boolean; // Anunciar cambios de estado (guardado, error, etc.)
    navegacion: boolean; // Anunciar navegación entre secciones
    interacciones: boolean; // Anunciar interacciones (clic, hover, etc.)
    contenidoDinamico: boolean; // Anunciar cambios de contenido dinámico
  };
  etiquetasARIA: {
    usarLabelsDescriptivos: boolean;
    usarLandmarks: boolean;
    usarRoles: boolean;
    usarLiveRegions: boolean; // Para anuncios dinámicos
  };
  navegacionTeclado: {
    skipLinks: boolean; // Enlaces para saltar al contenido principal
    focusVisible: boolean; // Mostrar indicador de foco claramente
    ordenTab: boolean; // Optimizar orden de tabulación
  };
  creadoEn: string;
  actualizadoEn: string;
}

// User Story 1: Personalización de densidad del layout
export type DensidadLayout = 'compacto' | 'estandar' | 'amplio';

export interface PreferenciasDensidadLayout {
  dietistaId: string;
  densidad: DensidadLayout;
  // Configuración específica por módulo (opcional)
  densidadPorModulo?: Record<string, DensidadLayout>; // Mapa de módulo -> densidad
  creadoEn: string;
  actualizadoEn: string;
}

// User Story 2: Configuración de notificaciones
export type TipoNotificacion = 'email' | 'push' | 'in-app';

export type TipoEventoNotificacion = 
  | 'feedback-recibido' // Feedback recibido del cliente
  | 'ia-detecta-riesgo' // IA detecta riesgo
  | 'alerta-sobrecarga' // Alerta de sobrecarga detectada
  | 'nuevo-comentario' // Nuevo comentario de profesional
  | 'encuesta-completada' // Encuesta completada por cliente
  | 'adherencia-baja' // Adherencia baja detectada
  | 'sugerencia-colaborador' // Nueva sugerencia de colaborador
  | 'version-creada'; // Nueva versión de plan creada

export interface ConfiguracionNotificacionEvento {
  evento: TipoEventoNotificacion;
  email: boolean;
  push: boolean;
  inApp: boolean;
  // Configuración adicional por tipo de evento
  configuracionAdicional?: {
    // Para feedback-recibido
    soloFeedbackNegativo?: boolean; // Solo notificar si el feedback es negativo
    // Para ia-detecta-riesgo
    soloRiesgosAltos?: boolean; // Solo notificar riesgos de severidad alta
    // Para alerta-sobrecarga
    soloSobrecargasAltas?: boolean; // Solo notificar sobrecargas de severidad alta
    // Para adherencia-baja
    umbralAdherencia?: number; // Umbral de adherencia para notificar (0-100)
  };
}

export interface PreferenciasNotificaciones {
  dietistaId: string;
  // Configuración global de notificaciones
  notificacionesActivas: boolean; // Activar/desactivar todas las notificaciones
  // Configuración por tipo de evento
  eventos: ConfiguracionNotificacionEvento[];
  // Configuración de horarios (opcional)
  horariosSilenciosos?: {
    inicio: string; // Hora de inicio en formato HH:mm (ej: "22:00")
    fin: string; // Hora de fin en formato HH:mm (ej: "08:00")
    diasSemana?: string[]; // Días de la semana afectados (lunes, martes, etc.)
  };
  // Preferencias de frecuencia
  frecuenciaMaxima?: {
    porEvento: number; // Máximo de notificaciones por evento por hora
    total: number; // Máximo de notificaciones totales por hora
  };
  creadoEn: string;
  actualizadoEn: string;
}

// User Story 1: Importación de datos de apps de seguimiento (calorías consumidas, síntomas digestivos)
export type TipoAppSeguimiento = 'myfitnesspal' | 'cronometer' | 'fatsecret' | 'lifesum' | 'yazio' | 'otro';

export interface DatosSeguimientoImportados {
  id: string;
  clienteId: string;
  dietaId: string;
  appOrigen: TipoAppSeguimiento;
  fecha: string; // Fecha de los datos importados
  // Calorías consumidas
  caloriasConsumidas?: {
    total: number;
    desayuno?: number;
    mediaManana?: number;
    almuerzo?: number;
    merienda?: number;
    cena?: number;
    postEntreno?: number;
  };
  // Macros consumidos
  macrosConsumidos?: MacrosNutricionales;
  // Síntomas digestivos
  sintomasDigestivos?: SintomaDigestivo[];
  // Datos adicionales
  datosAdicionales?: {
    hidratacion?: number; // ml de agua consumidos
    ejercicio?: {
      tipo: string;
      duracion: number; // minutos
      caloriasQuemadas: number;
    };
    peso?: number; // kg
    notas?: string;
  };
  // Metadatos
  fechaImportacion: string;
  sincronizado: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface SintomaDigestivo {
  id: string;
  tipo: TipoSintomaDigestivo;
  intensidad: 'leve' | 'moderado' | 'severo';
  descripcion?: string;
  hora?: string; // Hora del día cuando ocurrió
  relacionadoConComida?: string; // ID de la comida relacionada
  fecha: string;
}

export type TipoSintomaDigestivo =
  | 'hinchazon'
  | 'gases'
  | 'acidez'
  | 'nauseas'
  | 'dolor-abdominal'
  | 'diarrea'
  | 'estreñimiento'
  | 'reflujo'
  | 'malestar-general'
  | 'otro';

export interface ComparacionPlanRealidad {
  id: string;
  dietaId: string;
  clienteId: string;
  fecha: string;
  // Comparación de calorías
  comparacionCalorias: {
    plan: number;
    realidad: number;
    diferencia: number;
    porcentajeDiferencia: number;
    cumplimiento: number; // Porcentaje de cumplimiento (0-100)
  };
  // Comparación de macros
  comparacionMacros: {
    proteinas: { plan: number; realidad: number; diferencia: number; porcentajeDiferencia: number };
    carbohidratos: { plan: number; realidad: number; diferencia: number; porcentajeDiferencia: number };
    grasas: { plan: number; realidad: number; diferencia: number; porcentajeDiferencia: number };
  };
  // Comparación por tipo de comida
  comparacionPorComida: {
    tipoComida: TipoComida;
    plan: MacrosNutricionales;
    realidad: MacrosNutricionales;
    diferencia: MacrosNutricionales;
    cumplimiento: number;
  }[];
  // Síntomas digestivos registrados
  sintomasDigestivos: SintomaDigestivo[];
  // Análisis y recomendaciones
  analisis?: {
    areasMejora: string[];
    puntosFuertes: string[];
    recomendaciones: string[];
    patronesDetectados?: string[];
  };
  // Metadatos
  datosImportadosId: string;
  generadoEn: string;
}

export interface ConfiguracionImportacion {
  appOrigen: TipoAppSeguimiento;
  clienteId: string;
  dietaId: string;
  // Configuración de sincronización
  sincronizacionAutomatica: boolean;
  frecuenciaSincronizacion?: 'diaria' | 'semanal' | 'manual';
  // Campos a importar
  importarCalorias: boolean;
  importarMacros: boolean;
  importarSintomas: boolean;
  importarDatosAdicionales: boolean;
  // Rango de fechas
  fechaInicio?: string;
  fechaFin?: string;
  // Credenciales (encriptadas en producción)
  credenciales?: {
    apiKey?: string;
    token?: string;
    usuario?: string;
    configuracion?: Record<string, any>;
  };
  creadoEn: string;
  actualizadoEn: string;
}

// User Story 2: Integración con calendario del cliente para recordatorios
export type TipoRecordatorioCalendario = 'preparacion' | 'compra' | 'comida' | 'suplemento' | 'hidratacion';

export interface RecordatorioCalendario {
  id: string;
  dietaId: string;
  clienteId: string;
  tipo: TipoRecordatorioCalendario;
  titulo: string;
  descripcion: string;
  // Fecha y hora del recordatorio
  fechaRecordatorio: string; // ISO string
  horaRecordatorio?: string; // HH:mm
  // Antelación (días antes del evento)
  antelacionDias: number; // Ej: 2 días antes de la comida
  // Relación con la dieta
  relacionadoCon?: {
    tipo: 'comida' | 'dia' | 'semana' | 'lista-compra';
    id?: string; // ID de la comida, día, etc.
    nombre?: string;
  };
  // Configuración de repetición
  repeticion?: {
    activa: boolean;
    tipo: 'diaria' | 'semanal' | 'mensual' | 'personalizada';
    frecuencia?: number; // Cada X días/semanas/meses
    diasSemana?: string[]; // Para repetición semanal
    fechaFin?: string; // Fecha de fin de repetición
  };
  // Estado
  activo: boolean;
  enviado: boolean;
  fechaEnvio?: string;
  completado: boolean;
  fechaCompletado?: string;
  // Metadatos
  creadoEn: string;
  actualizadoEn: string;
  creadoPor: string;
}

export interface EventoCalendarioCliente {
  id: string;
  clienteId: string;
  titulo: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin?: string;
  horaInicio?: string;
  horaFin?: string;
  tipo: 'evento' | 'viaje' | 'compromiso' | 'competicion' | 'otro';
  // Relación con dieta
  dietaId?: string;
  impactoNutricional?: {
    requiereAjuste: boolean;
    tipoAjuste?: 'reducir-calorias' | 'aumentar-calorias' | 'modificar-macros' | 'sustituir-comidas';
    recomendaciones?: string[];
  };
  // Metadatos
  sincronizadoDesde?: string; // App de calendario origen (Google Calendar, Outlook, etc.)
  creadoEn: string;
  actualizadoEn: string;
}

export interface ConfiguracionCalendario {
  clienteId: string;
  dietaId: string;
  // Conexión con calendario externo
  calendarioExterno?: {
    tipo: 'google-calendar' | 'outlook' | 'apple-calendar' | 'otro';
    activo: boolean;
    credenciales?: {
      apiKey?: string;
      token?: string;
      calendarioId?: string;
      configuracion?: Record<string, any>;
    };
    ultimaSincronizacion?: string;
  };
  // Configuración de recordatorios automáticos
  recordatoriosAutomaticos: {
    preparacionComidas: {
      activo: boolean;
      antelacionDias: number; // Días antes de la comida
      horaRecordatorio: string; // HH:mm
    };
    listaCompra: {
      activo: boolean;
      antelacionDias: number; // Días antes del inicio de semana
      horaRecordatorio: string; // HH:mm
    };
    suplementos: {
      activo: boolean;
      recordarConComidas: boolean; // Recordar junto con comidas relacionadas
    };
  };
  // Notificaciones
  notificaciones: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  creadoEn: string;
  actualizadoEn: string;
}

// User Story 1: Exportación a dashboards externos (Power BI, Looker)
export type TipoDashboardExterno = 'power-bi' | 'looker' | 'tableau' | 'custom';

export interface ConfiguracionExportacionDashboard {
  id: string;
  nombre: string;
  tipo: TipoDashboardExterno;
  dietaId: string;
  clienteId: string;
  // Configuración de conexión
  conexion: {
    url?: string; // URL del endpoint del dashboard
    apiKey?: string; // API Key (encriptada en producción)
    workspaceId?: string; // ID del workspace (para Power BI)
    datasetId?: string; // ID del dataset (para Power BI)
    reportId?: string; // ID del reporte (para Looker)
    configuracionAdicional?: Record<string, any>;
  };
  // Datos a exportar
  datosExportar: {
    macros: boolean;
    coste: boolean;
    adherencia: boolean;
    seguimientoMacros?: boolean; // Datos históricos de seguimiento
    feedbackCliente?: boolean; // Feedback del cliente
    analisisClinicos?: boolean; // Análisis clínicos si están disponibles
  };
  // Configuración de sincronización
  sincronizacion: {
    automatica: boolean;
    frecuencia?: 'diaria' | 'semanal' | 'mensual' | 'manual';
    horaSincronizacion?: string; // HH:mm
    diasSemana?: string[]; // Para frecuencia semanal
  };
  // Filtros de datos
  filtros?: {
    fechaInicio?: string;
    fechaFin?: string;
    soloActivos?: boolean;
  };
  // Estado
  activa: boolean;
  ultimaSincronizacion?: string;
  ultimaSincronizacionExitosa?: string;
  erroresSincronizacion?: string[];
  creadoEn: string;
  actualizadoEn: string;
  creadoPor: string;
}

export interface DatosExportacionDashboard {
  dietaId: string;
  clienteId: string;
  clienteNombre?: string;
  fechaExportacion: string;
  // Macros
  macros?: {
    objetivo: MacrosNutricionales;
    promedio?: MacrosNutricionales; // Promedio del período
    variacion?: {
      calorias: number;
      proteinas: number;
      carbohidratos: number;
      grasas: number;
    };
  };
  // Coste
  coste?: {
    costeTotalSemanal: number;
    costeTotalMensual: number;
    costePorDia: number;
    costePorComida: number;
    tendencia?: 'aumento' | 'disminucion' | 'estable';
  };
  // Adherencia
  adherencia?: {
    promedio: number; // Porcentaje promedio
    tendencia: 'mejora' | 'estable' | 'empeora';
    cumplimientoMacros: number;
    cumplimientoComidas: number;
    diasCompletados: number;
    diasTotales: number;
  };
  // Seguimiento histórico (opcional)
  seguimientoHistorico?: {
    fecha: string;
    macrosConsumidos: MacrosNutricionales;
    macrosObjetivo: MacrosNutricionales;
    cumplimiento: number;
  }[];
  // Feedback del cliente (opcional)
  feedbackCliente?: {
    fecha: string;
    sensacion: number;
    saciedad: number;
    completada: boolean;
  }[];
  // Metadatos
  periodo?: {
    fechaInicio: string;
    fechaFin: string;
  };
}

export interface ResultadoExportacionDashboard {
  configuracionId: string;
  exito: boolean;
  fechaExportacion: string;
  datosExportados: DatosExportacionDashboard;
  errores?: string[];
  mensaje?: string;
  urlDashboard?: string; // URL para acceder al dashboard actualizado
}

// User Story 2: Notificaciones de sincronización de datos del cliente
export type TipoDatoSincronizado = 'peso' | 'medidas' | 'analisis-clinicos' | 'actividad' | 'sueño' | 'otro';

export interface DatosSincronizadosCliente {
  id: string;
  clienteId: string;
  dietaId: string;
  tipo: TipoDatoSincronizado;
  fecha: string;
  fechaSincronizacion: string;
  // Datos de peso
  peso?: {
    valor: number; // kg
    unidad: string;
    fuente?: string; // App o dispositivo origen
  };
  // Datos de medidas
  medidas?: {
    cintura?: number; // cm
    cadera?: number; // cm
    pecho?: number; // cm
    brazo?: number; // cm
    muslo?: number; // cm
    fuente?: string;
  };
  // Análisis clínicos
  analisisClinicos?: {
    tipo: string; // Ej: 'glucosa', 'colesterol', 'hemoglobina'
    valor: number;
    unidad: string;
    rangoNormal?: {
      minimo: number;
      maximo: number;
    };
    fechaAnalisis: string;
    laboratorio?: string;
  }[];
  // Datos de actividad
  actividad?: {
    pasos: number;
    caloriasQuemadas: number;
    distancia: number; // metros
    tipoActividad?: string;
  };
  // Datos de sueño
  sueño?: {
    duracion: number; // minutos
    calidad: 'poor' | 'fair' | 'good' | 'excellent';
    horasSueño: number;
  };
  // Metadatos
  fuente?: string; // App o dispositivo origen
  sincronizadoDesde?: string; // ID de la conexión externa
  requiereAtencion?: boolean; // Si requiere atención del dietista
  vinculadoAPlan?: boolean; // Si ya fue vinculado al plan
  creadoEn: string;
  actualizadoEn: string;
}

export interface NotificacionSincronizacionDatos {
  id: string;
  clienteId: string;
  clienteNombre?: string;
  dietaId: string;
  datosSincronizadosId: string;
  tipo: TipoDatoSincronizado;
  titulo: string;
  mensaje: string;
  // Detalles de los datos sincronizados
  datos: DatosSincronizadosCliente;
  // Estado
  leida: boolean;
  fechaLectura?: string;
  // Acción requerida
  requiereAccion: boolean;
  accionRequerida?: 'revisar' | 'ajustar-plan' | 'contactar-cliente' | 'ninguna';
  // Vinculación al plan
  vinculadoAPlan: boolean;
  fechaVinculacion?: string;
  // Prioridad
  prioridad: 'alta' | 'media' | 'baja';
  // Metadatos
  creadoEn: string;
  actualizadoEn: string;
}

export interface ConfiguracionNotificacionesSincronizacion {
  dietistaId: string;
  // Configuración por tipo de dato
  tiposDatos: {
    tipo: TipoDatoSincronizado;
    notificar: boolean;
    prioridad: 'alta' | 'media' | 'baja';
    umbrales?: {
      // Para peso: notificar si cambio > X kg
      cambioPesoMinimo?: number; // kg
      // Para medidas: notificar si cambio > X cm
      cambioMedidaMinimo?: number; // cm
      // Para análisis clínicos: notificar si fuera de rango normal
      notificarFueraRango?: boolean;
    };
  }[];
  // Configuración de notificaciones
  notificaciones: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  // Auto-vinculación al plan
  autoVincularPlan: boolean;
  // Filtros
  soloDatosRelevantes: boolean; // Solo notificar si los datos son relevantes (cambios significativos)
  creadoEn: string;
  actualizadoEn: string;
}

