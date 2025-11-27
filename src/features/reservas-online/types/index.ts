// ============================================================================
// TIPOS AUXILIARES - Enums y tipos unión
// ============================================================================

/**
 * Estados posibles de una reserva
 * Utilizado para rastrear el ciclo de vida completo de una reserva
 */
export type EstadoReserva =
  | 'pendiente'      // Reserva creada pero no confirmada
  | 'confirmada'     // Reserva confirmada y activa
  | 'rechazada'      // Reserva rechazada por el entrenador/centro
  | 'completada'     // Sesión realizada exitosamente
  | 'canceladaCliente' // Cancelada por el cliente
  | 'canceladaCentro' // Cancelada por el centro/entrenador
  | 'noShow';        // Cliente no se presentó

/**
 * Origen de la reserva
 * Permite rastrear cómo se creó la reserva para análisis y estadísticas
 */
export type OrigenReserva =
  | 'manual'              // Creada manualmente por el entrenador/administrador
  | 'appCliente'          // Creada desde la aplicación del cliente
  | 'enlacePublico'       // Creada desde un enlace público de reserva
  | 'integracionExterna'; // Creada mediante integración externa (API, webhook, etc.)

/**
 * Tipos de notificaciones relacionadas con reservas
 * Utilizado para gestionar el envío de notificaciones en diferentes momentos
 */
export type TipoNotificacionReserva =
  | 'creacion'        // Notificación al crear la reserva
  | 'recordatorio'    // Recordatorio antes de la sesión
  | 'cancelacion'     // Notificación de cancelación
  | 'reprogramacion'; // Notificación de reprogramación

/**
 * Alcance de aplicación de una configuración
 * Permite aplicar configuraciones a nivel global o específico
 */
export type AlcanceAplicacion =
  | 'global'      // Aplica a todas las sesiones/tipos
  | 'tipoSesion'  // Aplica solo a un tipo de sesión específico
  | 'entrenador'  // Aplica solo a un entrenador específico
  | 'centro';     // Aplica solo a un centro específico

// ============================================================================
// INTERFACES PRINCIPALES
// ============================================================================

/**
 * Reserva - Representa una reserva de sesión individual
 * 
 * Esta es la interfaz central del módulo de reservas. Contiene toda la información
 * necesaria para gestionar una reserva desde su creación hasta su finalización.
 * 
 * Relaciones:
 * - Se relaciona con Cliente (clienteId)
 * - Se relaciona con Entrenador (entrenadorId)
 * - Puede estar vinculada a una PlantillaSesion (tipoSesionId)
 * - Puede usar un PaqueteSesiones (paqueteIdOpcional)
 * - Puede usar un BonoActivo (bonoIdOpcional)
 * - Puede tener NotaSesion asociadas
 * 
 * Utilizado por: Agenda, Finanzas, Clientes, Notificaciones
 */
export interface Reserva {
  id: string;
  clienteId: string;
  entrenadorId: string;
  tipoSesionId?: string; // ID de la plantilla de sesión utilizada (opcional)
  
  // Fechas y horarios
  fechaInicio: Date; // Fecha y hora de inicio de la sesión
  fechaFin: Date;    // Fecha y hora de fin de la sesión
  
  // Estado y origen
  estado: EstadoReserva;
  origen: OrigenReserva;
  
  // Modalidad
  esOnline: boolean; // true si es videollamada, false si es presencial
  enlaceVideollamadaId?: string; // ID del enlace de videollamada (si aplica)
  
  // Paquetes y bonos
  paqueteIdOpcional?: string; // ID del paquete utilizado (si aplica)
  bonoIdOpcional?: string;   // ID del bono utilizado (si aplica)
  
  // Reservas recurrentes
  /**
   * ID de la reserva recurrente que generó esta reserva (si aplica)
   * 
   * Este campo permite asociar una reserva individual con la configuración de
   * reserva recurrente que la originó. Útil para:
   * - Rastrear qué reservas fueron generadas automáticamente
   * - Cancelar/modificar todas las reservas de una serie recurrente
   * - Reportes y análisis de reservas recurrentes
   * 
   * Relación: Reserva.reservaRecurrenteId -> ReservaRecurrente.id
   * 
   * @see ReservaRecurrente
   */
  reservaRecurrenteId?: string;
  
  // Información adicional
  notasInternas?: string; // Notas internas del entrenador/centro
  
  // Campos de compatibilidad (mantenidos para retrocompatibilidad)
  clienteNombre?: string;
  fecha?: Date; // Alias de fechaInicio para compatibilidad
  horaInicio?: string; // Extraído de fechaInicio
  horaFin?: string;   // Extraído de fechaFin
  tipo?: 'sesion-1-1' | 'clase-grupal' | 'fisio' | 'nutricion' | 'masaje';
  tipoSesion?: 'presencial' | 'videollamada';
  precio?: number;
  pagado?: boolean;
  claseId?: string;
  claseNombre?: string;
  capacidad?: number;
  ocupacion?: number;
  observaciones?: string;
  duracionMinutos?: number;
  enlaceVideollamada?: string;
  bonoId?: string;
  bonoNombre?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Disponibilidad - Representa un slot de tiempo disponible para reservas
 * 
 * Define los períodos de tiempo en los que se pueden realizar reservas.
 * Puede representar disponibilidad de un entrenador, una sala, o un tipo de sesión.
 * 
 * Relaciones:
 * - Se relaciona con Entrenador (entrenadorId implícito)
 * - Se relaciona con PlantillaSesion (tipoSesionId implícito)
 * 
 * Utilizado por: Calendario, Selector de horarios, Validación de reservas
 */
export interface Disponibilidad {
  fecha: Date;
  slots: Array<{
    horaInicio: string; // Formato HH:MM
    horaFin: string;   // Formato HH:MM
  }>;
  capacidad: number; // Número de plazas disponibles en este slot
  esReservable: boolean; // Si el slot está disponible para reservas
  motivoNoDisponible?: string; // Razón por la que no está disponible (si aplica)
  
  // Campos de compatibilidad
  id?: string;
  horaInicio?: string;
  horaFin?: string;
  disponible?: boolean;
  tipo?: 'sesion-1-1' | 'clase-grupal';
  claseId?: string;
  claseNombre?: string;
  ocupacion?: number;
  duracionMinutos?: number;
}

/**
 * PlantillaSesion - Plantilla reutilizable para crear reservas
 * 
 * Permite definir sesiones preconfiguradas con duración, precio y características
 * para agilizar el proceso de reserva. Los entrenadores pueden crear múltiples
 * plantillas para diferentes tipos de sesiones.
 * 
 * Relaciones:
 * - Se relaciona con Entrenador (entrenadorId)
 * - Puede ser utilizada por Reserva (tipoSesionId)
 * - Puede ser utilizada por ReservaRecurrente (plantillaId)
 * 
 * Utilizado por: Creación de reservas, Reservas recurrentes, Configuración
 */
export interface PlantillaSesion {
  id: string;
  nombre: string;
  duracionMinutos: number;
  precio: number;
  tipoSesion: 'presencial' | 'videollamada' | 'ambos';
  ubicacion?: string; // Ubicación física (si es presencial)
  esOnline: boolean; // true si permite videollamada
  color?: string; // Color para visualización en calendario (hex)
  limitePlazas?: number; // Límite de plazas (para clases grupales)
  permiteRecurrente: boolean; // Si permite crear reservas recurrentes
  
  // Campos adicionales
  entrenadorId?: string;
  descripcion?: string;
  tipoEntrenamiento?: 'sesion-1-1' | 'fisio' | 'nutricion' | 'masaje';
  activo?: boolean;
  orden?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * PaqueteSesiones - Paquete de múltiples sesiones con precio especial
 * 
 * Permite a los entrenadores crear ofertas de paquetes de sesiones con descuento
 * para fidelizar clientes y obtener pagos anticipados. Los clientes pueden comprar
 * estos paquetes y utilizarlos para realizar reservas.
 * 
 * Relaciones:
 * - Se relaciona con Entrenador (entrenadorId)
 * - Puede generar múltiples BonoActivo cuando se compra
 * - Puede ser referenciado por Reserva (paqueteIdOpcional)
 * 
 * Utilizado por: Ventas, Finanzas, Gestión de bonos
 */
export interface PaqueteSesiones {
  id: string;
  nombre: string;
  numeroSesiones: number;
  precio: number; // Precio total del paquete
  caducidadOpcional?: number; // Días de validez desde la compra (opcional)
  tiposSesionIncluidos: Array<'presencial' | 'videollamada' | 'ambos'>;
  condicionesUso?: string; // Condiciones de uso del paquete
  
  // Campos adicionales
  entrenadorId?: string;
  descripcion?: string;
  precioTotal?: number; // Alias de precio
  precioPorSesion?: number;
  descuento?: number;
  validezMeses?: number;
  tipoSesion?: 'presencial' | 'videollamada' | 'ambos';
  tipoEntrenamiento?: 'sesion-1-1' | 'fisio' | 'nutricion' | 'masaje' | 'todos';
  activo?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * BonoActivo - Bono activo de un cliente (relación cliente-paquete)
 * 
 * Representa la compra de un paquete por parte de un cliente. Rastrea cuántas
 * sesiones se han usado y cuántas quedan disponibles. Se crea cuando un cliente
 * compra un PaqueteSesiones.
 * 
 * Relaciones:
 * - Se relaciona con Cliente (clienteId)
 * - Se relaciona con PaqueteSesiones (paqueteId)
 * - Puede ser utilizado por Reserva (bonoIdOpcional)
 * 
 * Utilizado por: Reservas, Finanzas, Gestión de clientes
 */
export interface BonoActivo {
  id: string;
  clienteId: string;
  paqueteId: string;
  sesionesUsadas: number;
  sesionesRestantes: number;
  fechaCompra: Date;
  fechaCaducidadOpcional?: Date; // Fecha de caducidad (si aplica)
  
  // Campos adicionales
  paqueteNombre?: string;
  clienteNombre?: string;
  sesionesTotal?: number;
  fechaVencimiento?: Date; // Alias de fechaCaducidadOpcional
  estado?: 'activo' | 'vencido' | 'agotado' | 'suspendido';
  precio?: number;
}

/**
 * ReservaRecurrente - Configuración de reservas recurrentes
 * 
 * Permite crear reservas que se repiten automáticamente según un patrón definido.
 * El sistema genera automáticamente las reservas individuales basándose en esta
 * configuración.
 * 
 * Relaciones:
 * - Se relaciona con Cliente (clienteId)
 * - Se relaciona con Entrenador (entrenadorId)
 * - Puede usar una PlantillaSesion (plantillaId)
 * - Puede usar un BonoActivo (bonoId)
 * - Genera múltiples Reserva (mediante el campo reservaRecurrenteId)
 * 
 * Asociación con Reserva:
 * Las reservas generadas desde una ReservaRecurrente incluyen el campo
 * `Reserva.reservaRecurrenteId` que apunta al `id` de esta ReservaRecurrente.
 * 
 * Ejemplo de flujo:
 * 1. Se crea una ReservaRecurrente con patrón semanal, los lunes a las 10:00
 * 2. Se llama a `expandirReservaRecurrente()` para generar las reservas
 * 3. Cada Reserva generada tendrá `reservaRecurrenteId = ReservaRecurrente.id`
 * 4. Esto permite:
 *    - Rastrear qué reservas pertenecen a una serie recurrente
 *    - Cancelar/modificar todas las reservas de una serie de forma masiva
 *    - Generar reportes sobre reservas recurrentes
 * 
 * Utilizado por: Creación automática de reservas, Gestión de suscripciones
 * 
 * @see Reserva.reservaRecurrenteId
 */
export interface ReservaRecurrente {
  id: string;
  reservaBaseId?: string; // ID de la reserva base que originó la recurrencia
  plantillaId?: string;   // ID de la plantilla utilizada
  reglaRecurrencia: {
    frecuencia: 'diaria' | 'semanal' | 'quincenal' | 'mensual';
    diaSemana?: number; // 0-6 (Domingo-Sábado) para frecuencia semanal
    numeroRepeticiones?: number; // Número total de repeticiones
    fechaFin?: Date; // Fecha límite para crear reservas
  };
  fechaInicio: Date;
  fechaFinOpcional?: Date; // Fecha de finalización de la recurrencia
  estado: 'activa' | 'pausada' | 'cancelada' | 'completada';
  
  // Campos adicionales
  entrenadorId?: string;
  clienteId?: string;
  clienteNombre?: string;
  horaInicio?: string;
  horaFin?: string;
  tipo?: 'sesion-1-1' | 'fisio' | 'nutricion' | 'masaje';
  tipoSesion?: 'presencial' | 'videollamada';
  frecuencia?: 'diaria' | 'semanal' | 'quincenal' | 'mensual';
  diaSemana?: number;
  numeroRepeticiones?: number;
  precio?: number;
  duracionMinutos?: number;
  bonoId?: string;
  observaciones?: string;
  activo?: boolean;
  reservasCreadas?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * PoliticaCancelacion - Política de cancelación de reservas
 * 
 * Define las reglas y penalizaciones aplicables cuando se cancela una reserva.
 * Puede aplicarse globalmente, a un tipo de sesión específico, o a un paquete.
 * 
 * Relaciones:
 * - Se relaciona con Entrenador (entrenadorId)
 * - Puede aplicarse a PlantillaSesion (tipoSesion)
 * - Puede aplicarse a PaqueteSesiones (paquete)
 * 
 * Utilizado por: Validación de cancelaciones, Cálculo de penalizaciones
 */
export interface PoliticaCancelacion {
  id: string;
  nombre: string;
  plazoHoras: number; // Horas mínimas de anticipación para cancelar sin penalización
  tipoPenalizacion: 'porcentaje' | 'montoFijo' | 'sesionBono' | 'ninguna';
  valorPenalizacion?: number; // Porcentaje o monto fijo según tipoPenalizacion
  aplicaA: AlcanceAplicacion | 'tipoSesion' | 'paquete' | 'global';
  tipoSesionId?: string; // Si aplicaA es 'tipoSesion'
  paqueteId?: string;    // Si aplicaA es 'paquete'
  
  // Campos adicionales
  entrenadorId?: string;
  activa?: boolean;
  horasAnticipacionMinimas?: number;
  permitirCancelacionUltimoMomento?: boolean;
  aplicarMultaCancelacionUltimoMomento?: boolean;
  porcentajeMulta?: number;
  montoMultaFijo?: number;
  aplicarPenalizacionBono?: boolean;
  notificarCliente?: boolean;
  mensajePersonalizado?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * ConfiguracionBufferTime - Configuración de tiempo de buffer entre sesiones
 * 
 * Define el tiempo mínimo que debe transcurrir entre el fin de una sesión y el
 * inicio de la siguiente. Útil para tiempo de descanso, limpieza o desplazamiento.
 * 
 * Relaciones:
 * - Se relaciona con Entrenador (entrenadorId)
 * - Puede aplicarse a PlantillaSesion (tipoSesionId)
 * 
 * Utilizado por: Validación de disponibilidad, Cálculo de slots disponibles
 */
export interface ConfiguracionBufferTime {
  minutosAntes: number;  // Minutos de buffer antes de la sesión
  minutosDespues: number; // Minutos de buffer después de la sesión
  aplicaA: AlcanceAplicacion | 'tipoSesion' | 'global';
  tipoSesionId?: string; // Si aplicaA es 'tipoSesion'
  
  // Campos adicionales
  id?: string;
  entrenadorId?: string;
  activo?: boolean;
  minutosBuffer?: number; // Alias de minutosDespues
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * ConfiguracionTiempoMinimoAnticipacion - Tiempo mínimo de anticipación para reservas
 * 
 * Define el tiempo mínimo que debe transcurrir entre la creación de una reserva
 * y su fecha de inicio. Evita reservas de último momento.
 * 
 * Relaciones:
 * - Se relaciona con Entrenador (entrenadorId)
 * - Puede aplicarse a PlantillaSesion (tipoSesionId)
 * 
 * Utilizado por: Validación de reservas, Restricciones de tiempo
 */
export interface ConfiguracionTiempoMinimoAnticipacion {
  minutosMinimos: number; // Minutos mínimos de anticipación requeridos
  aplicaA: AlcanceAplicacion | 'tipoSesion' | 'global';
  tipoSesionId?: string; // Si aplicaA es 'tipoSesion'
  
  // Campos adicionales
  id?: string;
  entrenadorId?: string;
  activo?: boolean;
  horasMinimasAnticipacion?: number; // Alias en horas
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * ConfiguracionDiasMaximosReserva - Días máximos en el futuro para reservas
 * 
 * Define cuántos días en el futuro se pueden realizar reservas. Limita la
 * planificación a largo plazo.
 * 
 * Relaciones:
 * - Se relaciona con Entrenador (entrenadorId)
 * - Puede aplicarse a PlantillaSesion (tipoSesionId)
 * 
 * Utilizado por: Validación de reservas, Restricciones de calendario
 */
export interface ConfiguracionDiasMaximosReserva {
  maxDiasEnFuturo: number; // Días máximos en el futuro para reservas
  aplicaA: AlcanceAplicacion | 'tipoSesion' | 'global';
  tipoSesionId?: string; // Si aplicaA es 'tipoSesion'
  
  // Campos adicionales
  id?: string;
  entrenadorId?: string;
  activo?: boolean;
  diasMaximos?: number; // Alias de maxDiasEnFuturo
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * DuracionSesionConfig - Configuración de duraciones permitidas para sesiones
 * 
 * Define qué duraciones están disponibles para un tipo de sesión específico.
 * Permite restringir las opciones de duración según el tipo de sesión.
 * 
 * Relaciones:
 * - Se relaciona con PlantillaSesion (tipoSesionId)
 * 
 * Utilizado por: Selector de duraciones, Validación de reservas
 */
export interface DuracionSesionConfig {
  tipoSesionId: string;
  duracionesPermitidasMinutos: number[]; // Array de duraciones en minutos permitidas
}

/**
 * FechaNoDisponible - Bloqueo de fechas completas
 * 
 * Permite marcar fechas o rangos de fechas como no disponibles para reservas.
 * Útil para días festivos, vacaciones, o mantenimiento.
 * 
 * Relaciones:
 * - Se relaciona con Entrenador (entrenadorId) o Centro (centroId)
 * 
 * Utilizado por: Validación de disponibilidad, Calendario
 */
export interface FechaNoDisponible {
  id: string;
  fechaInicio: Date;
  fechaFin: Date; // Si es igual a fechaInicio, es un solo día
  motivo: string; // Razón por la que no está disponible
  aplicaA: 'entrenador' | 'centro';
  entrenadorId?: string; // Si aplicaA es 'entrenador'
  centroId?: string;     // Si aplicaA es 'centro'
  
  // Campos adicionales
  fecha?: Date; // Alias de fechaInicio para compatibilidad
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * NotaSesion - Nota asociada a una sesión
 * 
 * Permite añadir notas sobre una sesión realizada. Puede ser visible solo para
 * el entrenador, o compartida con el cliente según la configuración de visibilidad.
 * 
 * Relaciones:
 * - Se relaciona con Reserva (reservaId)
 * - Se relaciona con Cliente (clienteId)
 * - Se relaciona con Entrenador (entrenadorId)
 * 
 * Utilizado por: Historial de sesiones, Seguimiento de clientes
 */
export interface NotaSesion {
  id: string;
  reservaId: string;
  clienteId: string;
  entrenadorId: string;
  contenido: string; // Contenido de la nota
  fechaCreacion: Date;
  etiquetas?: string[]; // Etiquetas para categorizar la nota
  visibilidad: 'privada' | 'compartida' | 'publica'; // Quién puede ver la nota
  
  // Campos adicionales (compatibilidad con NotaDeSesion)
  clienteNombre?: string;
  fechaSesion?: Date;
  horaInicio?: string;
  horaFin?: string;
  queTrabajamos?: string;
  rendimiento?: string;
  observaciones?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * EstadisticasAsistencia - Estadísticas de asistencia de un cliente
 * 
 * Agrupa métricas de asistencia, cancelaciones y no-shows para un cliente específico.
 * Útil para identificar patrones y clientes problemáticos.
 * 
 * Relaciones:
 * - Se relaciona con Cliente (clienteId)
 * 
 * Utilizado por: Reportes, Análisis de clientes, Gestión de retención
 */
export interface EstadisticasAsistencia {
  clienteId: string;
  totalReservas: number;
  asistencias: number;      // Reservas completadas
  noShows: number;          // Reservas con no-show
  cancelaciones: number;    // Reservas canceladas
  tasaAsistencia: number;   // Porcentaje de asistencia (0-100)
  tasaNoShow?: number;      // Porcentaje de no-show (0-100)
  reservasCompletadas?: number; // Alias de asistencias
  reservasNoShow?: number;      // Alias de noShows
  reservasCanceladas?: number;   // Alias de cancelaciones
  reservasPendientes?: number;
  ultimaReserva?: Date;
  ultimaAsistencia?: Date;
  ultimoNoShow?: Date;
  clienteNombre?: string;
}

/**
 * IngresosPorFranja - Ingresos agrupados por franja horaria
 * 
 * Agrupa los ingresos generados en diferentes franjas horarias. Útil para
 * identificar los horarios más rentables.
 * 
 * Utilizado por: Reportes financieros, Análisis de rentabilidad
 */
export interface IngresosPorFranja {
  franja: string;        // Formato: "HH:MM-HH:MM" (ej: "10:00-11:00")
  ingresos: number;      // Ingresos totales en esta franja
  numeroSesiones: number; // Número de sesiones en esta franja
  
  // Campos adicionales
  hora?: string;         // Hora de inicio (formato HH:MM)
  cantidadReservas?: number; // Alias de numeroSesiones
  promedioPorReserva?: number;
}

/**
 * IngresosPorCliente - Ingresos agrupados por cliente
 * 
 * Agrupa los ingresos generados por cada cliente. Útil para identificar
 * los clientes más valiosos y el ticket medio.
 * 
 * Relaciones:
 * - Se relaciona con Cliente (clienteId)
 * 
 * Utilizado por: Reportes financieros, Análisis de clientes VIP
 */
export interface IngresosPorCliente {
  clienteId: string;
  ingresosTotales: number; // Ingresos totales del cliente
  sesiones: number;        // Número de sesiones realizadas
  ticketMedio: number;     // Ingreso promedio por sesión
  
  // Campos adicionales
  clienteNombre?: string;
  cantidadReservas?: number; // Alias de sesiones
  promedioPorReserva?: number; // Alias de ticketMedio
  ultimaReserva?: Date;
  reservasCompletadas?: number;
  reservasCanceladas?: number;
}

// ============================================================================
// INTERFACES AUXILIARES (Mantenidas para compatibilidad)
// ============================================================================

/**
 * Clase - Representa una clase grupal
 * @deprecated Considerar usar Reserva con tipo 'clase-grupal'
 */
export interface Clase {
  id: string;
  nombre: string;
  tipo: 'spinning' | 'boxeo' | 'hiit' | 'fisio' | 'nutricion' | 'masaje';
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  capacidad: number;
  ocupacion: number;
  entrenadorId?: string;
  entrenadorNombre?: string;
  salaId?: string;
  salaNombre?: string;
  precio: number;
  disponible: boolean;
}

/**
 * ListaEspera - Lista de espera para clases completas
 */
export interface ListaEspera {
  id: string;
  claseId: string;
  claseNombre: string;
  clienteId: string;
  clienteNombre: string;
  fecha: Date;
  hora: string;
  posicion: number;
  notificado: boolean;
  createdAt: Date;
}

/**
 * Recordatorio - Recordatorio programado para una reserva
 */
export interface Recordatorio {
  id: string;
  reservaId: string;
  tipo: 'email' | 'sms' | 'push' | 'whatsapp';
  enviado: boolean;
  fechaEnvio?: Date;
  programadoPara: Date;
}

/**
 * TokenConfirmacionReserva - Token para confirmar/cancelar reservas
 */
export interface TokenConfirmacionReserva {
  id: string;
  reservaId: string;
  token: string;
  expiraEn: Date;
  usado: boolean;
  fechaUso?: Date;
  accion?: 'confirmar' | 'cancelar';
  createdAt: Date;
}

/**
 * AnalyticsReservas - Análisis agregado de reservas
 */
export interface AnalyticsReservas {
  totalReservas: number;
  reservasConfirmadas: number;
  reservasCanceladas: number;
  tasaOcupacion: number;
  ingresosTotales: number;
  promedioPorReserva: number;
  reservasPorTipo: Record<string, number>;
  reservasPorMes: Array<{ mes: string; cantidad: number }>;
  horariosMasReservados: Array<{ hora: string; cantidad: number }>;
}

/**
 * ConfiguracionPrecios - Configuración de precios diferenciados
 */
export interface ConfiguracionPrecios {
  id: string;
  entrenadorId: string;
  tipoEntrenamiento: 'sesion-1-1' | 'fisio' | 'nutricion' | 'masaje';
  duracionMinutos: number;
  tipoSesion: 'presencial' | 'videollamada';
  precioBase: number;
  multiplicadorModalidad?: number;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * EnlacePublico - Enlace público para reservas
 */
export interface EnlacePublico {
  id: string;
  entrenadorId: string;
  token: string;
  activo: boolean;
  nombrePersonalizado?: string;
  descripcion?: string;
  visitas: number;
  reservasDesdeEnlace: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Opciones de visibilidad para un enlace público
 */
export type OpcionVisibilidad = 'publico' | 'privado' | 'conContrasena';

/**
 * Tipos de sesión permitidos en un enlace público
 */
export type TipoSesionPermitido = 'presencial' | 'videollamada' | 'ambos';

/**
 * ConfiguracionEnlacePublico - Configuración completa de un enlace público
 * 
 * Permite personalizar el comportamiento del enlace público de reservas:
 * - Slug personalizado para la URL
 * - Opciones de visibilidad (público, privado, con contraseña)
 * - Tipos de sesión permitidos (presencial, videollamada, ambos)
 */
export interface ConfiguracionEnlacePublico {
  id?: string;
  entrenadorId: string;
  slug: string; // URL amigable personalizada (ej: "sesiones-juan")
  url: string; // URL completa del enlace público
  opcionesVisibilidad: OpcionVisibilidad;
  contrasena?: string; // Solo si opcionesVisibilidad es 'conContrasena'
  tiposSesionPermitidos: TipoSesionPermitido;
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Contexto para obtener configuración de enlace público
 */
export interface ContextoEnlacePublico {
  entrenadorId: string;
  token?: string; // Token del enlace público (opcional)
  slug?: string; // Slug del enlace público (opcional)
}

/**
 * Información de reserva asociada a un token de confirmación
 */
export interface InfoReservaToken {
  reservaId: string;
  clienteId?: string;
  clienteNombre?: string;
  entrenadorId?: string;
  fechaInicio: Date;
  fechaFin: Date;
  estado: EstadoReserva;
  tipoSesion?: 'presencial' | 'videollamada';
  precio?: number;
}

/**
 * ConfiguracionAprobacionReservas - Configuración de aprobación automática
 * 
 * Permite configurar si las reservas se aprueban automáticamente o requieren
 * aprobación manual. También permite definir excepciones por tipo de sesión.
 */
export interface ConfiguracionAprobacionReservas {
  id: string;
  entrenadorId: string;
  aprobacionAutomatica: boolean; // Configuración global: auto-aprobar sí/no
  excepcionesPorTipoSesion?: {
    // Excepciones por tipo de sesión: si está definido, sobrescribe la configuración global
    // Clave: tipoSesionId o tipo de sesión (ej: 'presencial', 'videollamada', 'fisio', etc.)
    // Valor: true = auto-aprobar, false = requiere aprobación manual
    [tipoSesionId: string]: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * NotaDeSesion - Nota de sesión (alias de NotaSesion para compatibilidad)
 * @deprecated Usar NotaSesion en su lugar
 */
export interface NotaDeSesion {
  id: string;
  reservaId: string;
  entrenadorId: string;
  clienteId: string;
  clienteNombre: string;
  fechaSesion: Date;
  horaInicio: string;
  horaFin: string;
  queTrabajamos: string;
  rendimiento: string;
  observaciones: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ClienteInfo - Información básica del cliente
 */
export interface ClienteInfo {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
}

/**
 * PatronRecurrencia - Patrón de recurrencia para reservas
 */
export interface PatronRecurrencia {
  frecuencia: 'diaria' | 'semanal' | 'quincenal' | 'mensual';
  diaSemana?: number;
  numeroRepeticiones?: number;
  fechaFin?: Date;
}
