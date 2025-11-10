export interface Reserva {
  id: string;
  clienteId: string;
  clienteNombre: string;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  tipo: 'sesion-1-1' | 'clase-grupal' | 'fisio' | 'nutricion' | 'masaje';
  tipoSesion?: 'presencial' | 'videollamada';
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada' | 'no-show';
  precio: number;
  pagado: boolean;
  claseId?: string;
  claseNombre?: string;
  capacidad?: number;
  ocupacion?: number;
  observaciones?: string;
  duracionMinutos?: number; // Duración de la sesión en minutos
  enlaceVideollamada?: string; // Enlace de reunión para sesiones de videollamada
  bonoId?: string; // ID del bono aplicado (si se usó un bono)
  bonoNombre?: string; // Nombre del bono aplicado
  createdAt: Date;
  updatedAt: Date;
}

export interface Disponibilidad {
  id: string;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
  tipo?: 'sesion-1-1' | 'clase-grupal';
  claseId?: string;
  claseNombre?: string;
  capacidad?: number;
  ocupacion?: number;
  duracionMinutos?: number; // Duración de la sesión en minutos para este slot
}

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

export interface Recordatorio {
  id: string;
  reservaId: string;
  tipo: 'email' | 'sms' | 'push' | 'whatsapp';
  enviado: boolean;
  fechaEnvio?: Date;
  programadoPara: Date;
}

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
 * Plantilla de sesión para agilizar el proceso de reserva
 * Permite crear plantillas con nombre, descripción, duración, precio y tipo de sesión
 */
export interface PlantillaSesion {
  id: string;
  entrenadorId: string;
  nombre: string;
  descripcion?: string;
  duracionMinutos: number;
  precio: number;
  tipoSesion: 'presencial' | 'videollamada';
  tipoEntrenamiento: 'sesion-1-1' | 'fisio' | 'nutricion' | 'masaje';
  activo: boolean;
  orden: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Configuración de precios diferenciados según tipo de sesión, duración y modalidad
 */
export interface ConfiguracionPrecios {
  id: string;
  entrenadorId: string;
  tipoEntrenamiento: 'sesion-1-1' | 'fisio' | 'nutricion' | 'masaje';
  duracionMinutos: number;
  tipoSesion: 'presencial' | 'videollamada';
  precioBase: number;
  multiplicadorModalidad?: number; // Multiplicador para videollamada (ej: 0.9 para 10% descuento)
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Enlace público personalizado para que los clientes puedan reservar sesiones directamente
 */
export interface EnlacePublico {
  id: string;
  entrenadorId: string;
  token: string; // Token único para el enlace público
  activo: boolean;
  nombrePersonalizado?: string; // Nombre personalizado para el enlace (opcional)
  descripcion?: string; // Descripción que aparece en la página pública
  visitas: number; // Contador de visitas al enlace
  reservasDesdeEnlace: number; // Contador de reservas realizadas desde el enlace
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Configuración de aprobación de reservas para entrenadores
 */
export interface ConfiguracionAprobacionReservas {
  id: string;
  entrenadorId: string;
  aprobacionAutomatica: boolean; // true = automática, false = manual
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Nota de sesión para entrenadores
 * Permite añadir notas después de cada sesión sobre qué trabajaron, rendimiento y observaciones
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
  queTrabajamos: string; // Qué se trabajó en la sesión
  rendimiento: string; // Rendimiento del cliente
  observaciones: string; // Observaciones adicionales
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Paquete de sesiones múltiples con precio especial
 * Permite a los entrenadores crear paquetes de múltiples sesiones con precio especial
 * para fidelizar clientes y obtener pagos anticipados
 */
export interface PaqueteSesiones {
  id: string;
  entrenadorId: string;
  nombre: string;
  descripcion?: string;
  numeroSesiones: number;
  precioTotal: number;
  precioPorSesion: number; // Precio por sesión individual (sin descuento)
  descuento: number; // Porcentaje de descuento
  validezMeses: number; // Validez del paquete en meses
  tipoSesion?: 'presencial' | 'videollamada' | 'ambos'; // Tipo de sesión permitido
  tipoEntrenamiento?: 'sesion-1-1' | 'fisio' | 'nutricion' | 'masaje' | 'todos'; // Tipo de entrenamiento
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Bono activo de un cliente (relación entre cliente y paquete comprado)
 */
export interface BonoActivo {
  id: string;
  paqueteId: string;
  paqueteNombre: string;
  clienteId: string;
  clienteNombre: string;
  sesionesTotal: number;
  sesionesUsadas: number;
  sesionesRestantes: number;
  fechaCompra: Date;
  fechaVencimiento: Date;
  estado: 'activo' | 'vencido' | 'agotado' | 'suspendido';
  precio: number;
}

/**
 * Información del cliente para reservas
 */
export interface ClienteInfo {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
}

/**
 * Política de cancelación para reservas
 * Permite establecer reglas claras sobre cancelaciones y evitar cancelaciones de último momento
 */
export interface PoliticaCancelacion {
  id: string;
  entrenadorId: string;
  activa: boolean; // Si la política está activa
  horasAnticipacionMinimas: number; // Horas mínimas de anticipación para cancelar sin penalización (ej: 24)
  permitirCancelacionUltimoMomento: boolean; // Si se permite cancelar después del tiempo mínimo
  aplicarMultaCancelacionUltimoMomento: boolean; // Si se aplica multa por cancelación de último momento
  porcentajeMulta?: number; // Porcentaje del precio a cobrar como multa (ej: 50 para 50%)
  montoMultaFijo?: number; // Monto fijo a cobrar como multa (alternativa al porcentaje)
  aplicarPenalizacionBono: boolean; // Si se descuenta una sesión del bono al cancelar de último momento
  notificarCliente: boolean; // Si se notifica al cliente sobre las políticas
  mensajePersonalizado?: string; // Mensaje personalizado que se muestra al cliente
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Configuración de tiempo de buffer entre sesiones
 * Permite configurar un tiempo automático de buffer entre sesiones para tener tiempo de descanso, limpieza o desplazamiento
 */
export interface ConfiguracionBufferTime {
  id: string;
  entrenadorId: string;
  activo: boolean; // Si el buffer time está activo
  minutosBuffer: number; // Minutos de buffer entre sesiones (ej: 15, 30, 60)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Configuración de tiempo mínimo de anticipación para nuevas reservas
 * Permite configurar un tiempo mínimo de anticipación para evitar reservas de último momento
 */
export interface ConfiguracionTiempoMinimoAnticipacion {
  id: string;
  entrenadorId: string;
  activo: boolean; // Si la restricción está activa
  horasMinimasAnticipacion: number; // Horas mínimas de anticipación requeridas (ej: 2, 12, 24)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Configuración de días máximos en el futuro para reservas
 * Permite configurar hasta cuántos días en el futuro se pueden hacer reservas
 */
export interface ConfiguracionDiasMaximosReserva {
  id: string;
  entrenadorId: string;
  activo: boolean; // Si la restricción está activa
  diasMaximos: number; // Días máximos en el futuro para reservas (ej: 7, 14, 30, 90)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Configuración de reserva recurrente
 * Permite crear reservas que se repiten automáticamente según un patrón
 */
export interface ReservaRecurrente {
  id: string;
  entrenadorId: string;
  clienteId: string;
  clienteNombre: string;
  fechaInicio: Date; // Fecha de la primera reserva
  horaInicio: string;
  horaFin: string;
  tipo: 'sesion-1-1' | 'fisio' | 'nutricion' | 'masaje';
  tipoSesion?: 'presencial' | 'videollamada';
  frecuencia: 'diaria' | 'semanal' | 'quincenal' | 'mensual';
  diaSemana?: number; // 0-6 (Domingo-Sábado) para frecuencia semanal
  numeroRepeticiones?: number; // Número total de repeticiones (si no se especifica, se crea indefinidamente)
  fechaFin?: Date; // Fecha límite para crear reservas (alternativa a numeroRepeticiones)
  precio: number;
  duracionMinutos: number;
  plantillaSesionId?: string;
  bonoId?: string;
  observaciones?: string;
  activo: boolean; // Si la recurrencia está activa
  reservasCreadas: number; // Contador de reservas creadas desde esta recurrencia
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Patrón de recurrencia para crear reservas
 */
export interface PatronRecurrencia {
  frecuencia: 'diaria' | 'semanal' | 'quincenal' | 'mensual';
  diaSemana?: number; // 0-6 (Domingo-Sábado) para frecuencia semanal
  numeroRepeticiones?: number; // Número total de repeticiones
  fechaFin?: Date; // Fecha límite
}
