/**
 * Tipos base del módulo Catálogo de Planes
 * Define la estructura de datos para planes, bonos, periodicidades y estados
 */

// ============================================================================
// ENUMS Y UNION TYPES BASE
// ============================================================================

/**
 * TipoPlan - Define los diferentes tipos de planes disponibles en el catálogo
 * 
 * Uso en componentes:
 * - CatalogoPlanes.tsx: Filtra planes por tipo según el rol del usuario (entrenador/gimnasio)
 * - PlanCard.tsx: Muestra diferentes iconos y contenido según el tipo de plan
 * - PlanForm.tsx: Valida campos específicos según el tipo seleccionado
 * - GestorBonos.tsx: Filtra y agrupa bonos por tipo de plan asociado
 */
export type TipoPlan = 'suscripcion' | 'bono' | 'paquete' | 'pt' | 'grupal';

/**
 * Periodicidad - Define la frecuencia de facturación o validez de un plan
 * 
 * Uso en componentes:
 * - CatalogoPlanes.tsx: Permite filtrar planes por periodicidad (ej: solo planes mensuales)
 * - PlanCard.tsx: Muestra la periodicidad en la tarjeta del plan (ej: "/mes", "/año")
 * - PlanForm.tsx: Campo seleccionable al crear/editar un plan
 * - GestorBonos.tsx: Calcula fechas de vencimiento basadas en la periodicidad
 */
export type Periodicidad = 'mensual' | 'trimestral' | 'anual' | 'puntual';

/**
 * EstadoPlan - Define el estado de un plan en el catálogo
 * 
 * Significado de cada estado:
 * - 'activo': Plan disponible y visible para los clientes. Puede ser seleccionado, comprado o asignado.
 *             Es el estado operativo normal de un plan en producción.
 * 
 * - 'inactivo': Plan temporalmente deshabilitado pero no eliminado. No es visible para clientes nuevos,
 *               pero puede reactivarse fácilmente. Útil para pausar planes sin perder su configuración.
 * 
 * - 'archivado': Plan que ya no se utiliza pero se mantiene por razones históricas o de reportes.
 *                No es visible en búsquedas normales y no puede ser activado directamente.
 *                Requiere desarchivar para volver a estar disponible.
 * 
 * - 'borrador': Plan en proceso de creación o edición. No está completo y no es visible para clientes.
 *               Estado inicial al crear un nuevo plan. Debe cambiarse a 'activo' o 'inactivo' para publicarlo.
 * 
 * Uso en componentes:
 * - CatalogoPlanes.tsx: Filtra planes por estado (activos, inactivos, archivados, borradores)
 * - PlanCard.tsx: Muestra badge de estado y deshabilita acciones en planes inactivos/archivados
 * - PlanForm.tsx: Campo seleccionable para cambiar el estado del plan
 * - GestorBonos.tsx: Permite filtrar bonos por el estado de su plan asociado
 */
export type EstadoPlan = 'activo' | 'inactivo' | 'archivado' | 'borrador';

/**
 * UserRole - Rol del usuario en el sistema
 * Mantenido para compatibilidad con componentes existentes
 */
export type UserRole = 'entrenador' | 'gimnasio';

// ============================================================================
// TIPOS DE CARACTERÍSTICAS Y BENEFICIOS
// ============================================================================

/**
 * Caracteristica - Describe una característica o beneficio incluido en un plan
 * 
 * Uso en componentes:
 * - PlanCard.tsx: Renderiza lista de características como bullet points o checkmarks
 * - PlanForm.tsx: Permite agregar/editar/eliminar características con opción de destacarlas
 * - CatalogoPlanes.tsx: Puede usar las características para búsqueda y filtrado avanzado
 */
export interface Caracteristica {
  /** Identificador único de la característica */
  id: string;
  /** Etiqueta principal de la característica (ej: "Acceso 24/7", "5 sesiones PT") */
  label: string;
  /** Descripción opcional adicional de la característica */
  descripcionOpcional?: string;
  /** Si es true, la característica se muestra de forma destacada en la UI */
  destacadoOpcional?: boolean;
}

// ============================================================================
// TIPO PRINCIPAL: PLAN
// ============================================================================

/**
 * Plan - Representa un plan de suscripción, bono, paquete, PT o grupal en el catálogo
 * 
 * Uso en componentes:
 * - CatalogoPlanes.tsx: Lista principal de planes, filtrado, búsqueda y ordenamiento
 * - PlanCard.tsx: Renderiza la tarjeta visual del plan con toda su información
 * - PlanForm.tsx: Formulario completo para crear/editar planes con validación
 * - GestorBonos.tsx: Referencia planes disponibles para asignar a bonos
 * 
 * Nota: Este tipo está diseñado para ser extensible. En el futuro se pueden agregar campos como:
 * - preciosDiferenciados?: PrecioPorTipoCliente[] (para precios especiales por segmento)
 * - restriccionesGeograficas?: string[]
 * - metadatosPersonalizados?: Record<string, any>
 */
export interface Plan {
  /** Identificador único del plan */
  id: string;
  
  /** Nombre del plan visible para el usuario */
  nombre: string;
  
  /** Descripción detallada del plan y sus beneficios */
  descripcion: string;
  
  /** Tipo de plan (suscripción, bono, paquete, pt, grupal) */
  tipo: TipoPlan;
  
  /** Periodicidad de facturación o validez del plan */
  periodicidad: Periodicidad;
  
  /** Precio base del plan antes de descuentos */
  precioBase: number;
  
  /** Código de moneda (ISO 4217, ej: "EUR", "USD") */
  moneda: string;
  
  /** Número de sesiones incluidas (opcional, aplica principalmente a bonos y paquetes PT) */
  sesionesIncluidasOpcional?: number;
  
  /** Lista de características o beneficios del plan */
  caracteristicas: Caracteristica[];
  
  /** Lista opcional de beneficios adicionales en formato texto libre */
  beneficiosAdicionales?: string[];
  
  /** Si es true, el plan se marca como recomendado en la UI */
  esRecomendado?: boolean;
  
  /** Si es true, el plan se muestra como popular (ej: con badge "Más Popular") */
  esPopular?: boolean;
  
  /** Si es true, el plan se marca como nuevo (ej: con badge "Nuevo") */
  esNuevo?: boolean;
  
  /** Estado actual del plan en el catálogo */
  estado: EstadoPlan;
  
  /** Orden visual para personalizar la posición en listados (menor número = primero) */
  ordenVisual?: number;
  
  /** Fecha de creación del plan */
  createdAt: Date;
  
  /** Fecha de última actualización del plan */
  updatedAt: Date;
  
  // ============================================================================
  // CAMPOS LEGACY PARA COMPATIBILIDAD CON CÓDIGO EXISTENTE
  // Estos campos se mantienen temporalmente para evitar romper componentes existentes
  // ============================================================================
  
  /** @deprecated Usar precioBase y moneda en su lugar. Mantenido para compatibilidad */
  precio?: {
    base: number;
    descuento: number;
    moneda: string;
  };
  
  /** @deprecated Usar estado === 'activo' en su lugar. Mantenido para compatibilidad */
  activo?: boolean;
  
  /** @deprecated Usar sesionesIncluidasOpcional en su lugar. Mantenido para compatibilidad */
  sesiones?: number;
  
  /** @deprecated Usar periodicidad y características en su lugar. Mantenido para compatibilidad */
  validezMeses?: number;
  
  /** @deprecated Usar características en su lugar. Mantenido para compatibilidad */
  tipoAcceso?: 'basica' | 'premium' | 'libre_acceso';
  
  /** @deprecated Usar características en su lugar. Mantenido para compatibilidad */
  clasesIlimitadas?: boolean;
  
  /** @deprecated Usar características en su lugar. Mantenido para compatibilidad */
  instalacionesIncluidas?: string[];
  
  /** @deprecated Usar createdAt en su lugar. Mantenido para compatibilidad */
  fechaCreacion?: Date;
  
  /** @deprecated Usar updatedAt en su lugar. Mantenido para compatibilidad */
  fechaActualizacion?: Date;
}

// ============================================================================
// TIPO PRINCIPAL: BONO
// ============================================================================

/**
 * Bono - Representa un bono individual asignado a un cliente
 * 
 * Uso en componentes:
 * - GestorBonos.tsx: Componente principal para gestionar bonos (crear, editar, eliminar, filtrar)
 * - CatalogoPlanes.tsx: Puede mostrar planes de tipo "bono" disponibles para compra
 * - PlanCard.tsx: Si se muestra un plan de tipo bono, puede mostrar información del bono
 * - PlanForm.tsx: No se usa directamente, pero el formulario puede crear planes de tipo bono
 */
export interface Bono {
  /** Identificador único del bono */
  id: string;
  
  /** Nombre descriptivo del bono */
  nombre: string;
  
  /** Descripción detallada del bono */
  descripcion: string;
  
  /** Número de sesiones incluidas en el bono */
  numeroSesiones: number;
  
  /** Precio del bono */
  precio: number;
  
  /** Tipos de sesiones permitidas (ej: ["pt", "grupal", "online"]) */
  tiposSesiones: string[];
  
  /** Fecha opcional de caducidad del bono */
  fechaCaducidadOpcional?: Date;
  
  /** Si es true, el bono puede ser transferido a otro cliente */
  transferible: boolean;
  
  /** Restricciones de uso opcionales del bono (ej: "Válido solo en horario matutino") */
  restriccionesUso?: string;
  
  /** Estado del bono en el sistema */
  estado: EstadoPlan;
  
  // ============================================================================
  // CAMPOS LEGACY PARA COMPATIBILIDAD CON CÓDIGO EXISTENTE
  // Estos campos se mantienen temporalmente para evitar romper componentes existentes
  // ============================================================================
  
  /** @deprecated Mantenido para compatibilidad con GestorBonos.tsx existente */
  planId?: string;
  
  /** @deprecated Mantenido para compatibilidad con GestorBonos.tsx existente */
  clienteId?: string;
  
  /** @deprecated Usar numeroSesiones en su lugar. Mantenido para compatibilidad */
  sesionesTotal?: number;
  
  /** @deprecated Mantenido para compatibilidad con GestorBonos.tsx existente */
  sesionesUsadas?: number;
  
  /** @deprecated Mantenido para compatibilidad con GestorBonos.tsx existente */
  sesionesRestantes?: number;
  
  /** @deprecated Mantenido para compatibilidad con GestorBonos.tsx existente */
  fechaCompra?: Date;
  
  /** @deprecated Usar fechaCaducidadOpcional en su lugar. Mantenido para compatibilidad */
  fechaVencimiento?: Date;
  
  /** @deprecated Mantenido para compatibilidad. Considerar extender EstadoPlan si se necesitan más estados específicos de bono */
  estadoLegacy?: 'activo' | 'vencido' | 'agotado' | 'suspendido';
}

// ============================================================================
// TIPOS AUXILIARES Y DE APOYO
// ============================================================================

/**
 * PrecioConfig - Configuración de precio con descuento
 * @deprecated Considerar usar precioBase y agregar campo descuentoPorcentaje al Plan
 * Mantenido para compatibilidad con código existente
 */
export interface PrecioConfig {
  base: number;
  descuento: number;
  moneda: string;
}

/**
 * TipoCuota - Tipo de cuota de gimnasio
 * @deprecated Considerar usar Plan con tipo='suscripcion' en su lugar
 * Mantenido para compatibilidad con código existente
 */
export interface TipoCuota {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionMeses: number;
  beneficios: string[];
  limitaciones?: string[];
  activo: boolean;
}

/**
 * PlanAsignado - Representa un plan asignado a un cliente
 * Mantenido para compatibilidad con código existente
 */
export interface PlanAsignado {
  id: string;
  clienteId: string;
  planId: string;
  fechaAsignacion: Date;
  fechaVencimiento: Date;
  estado: 'activo' | 'vencido' | 'suspendido';
  pagado: boolean;
}

/**
 * Cliente - Información básica de un cliente
 * Mantenido para compatibilidad con GestorBonos.tsx
 */
export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  fechaRegistro: Date;
}

/**
 * EstadisticasPlanes - Estadísticas relacionadas con planes y bonos
 * Mantenido para compatibilidad con código existente
 */
export interface EstadisticasPlanes {
  totalPlanes: number;
  planesActivos: number;
  bonosVendidos: number;
  ingresosMensuales: number;
  clientesActivos: number;
}

// ============================================================================
// TIPOS PARA REQUESTS/API (mantenidos para compatibilidad)
// ============================================================================

export interface CreateBonoRequest {
  planId: string;
  clienteId: string;
  sesiones: number;
  validezMeses: number;
  precio: number;
}

export interface UpdateBonoRequest {
  sesiones?: number;
  validezMeses?: number;
  precio?: number;
  estado?: 'activo' | 'vencido' | 'agotado' | 'suspendido';
}

export interface CreateTipoCuotaRequest {
  nombre: string;
  descripcion: string;
  precio: number;
  duracionMeses: number;
  beneficios: string[];
  limitaciones?: string[];
}

export interface UpdateTipoCuotaRequest {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  duracionMeses?: number;
  beneficios?: string[];
  limitaciones?: string[];
  activo?: boolean;
}

// ============================================================================
// TIPOS PARA FUTURAS EXTENSIONES
// ============================================================================

/**
 * PrecioPorTipoCliente - Permite precios diferenciados según el tipo de cliente
 * Ejemplo de uso futuro: estudiantes, seniors, corporativos
 * 
 * Uso futuro en componentes:
 * - PlanForm.tsx: Sección para configurar precios especiales
 * - PlanCard.tsx: Muestra precio según el tipo de cliente del usuario actual
 */
export interface PrecioPorTipoCliente {
  tipoCliente: string;
  precio: number;
  descuentoPorcentaje?: number;
}

/**
 * RestriccionPlan - Restricciones adicionales que se pueden aplicar a un plan
 * Ejemplo futuro: horarios, ubicaciones, límites de uso
 */
export interface RestriccionPlan {
  tipo: 'horario' | 'ubicacion' | 'limite_uso' | 'otro';
  descripcion: string;
  valor?: string | number;
}

/**
 * MetadatosPersonalizados - Permite extender planes con información adicional sin modificar el tipo base
 * Útil para integraciones futuras o características específicas del negocio
 */
export type MetadatosPersonalizados = Record<string, any>;
