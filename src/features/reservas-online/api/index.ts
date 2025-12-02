/**
 * Archivo de barril que centraliza el acceso a la lógica de negocio simulada de Reservas Online.
 * 
 * Este archivo exporta todas las funciones y tipos necesarios para interactuar con
 * las diferentes funcionalidades del módulo de reservas online, incluyendo:
 * - Gestión de reservas y disponibilidad
 * - Configuraciones y políticas
 * - Notificaciones y confirmaciones
 * - Plantillas, paquetes y bonos
 * - Estadísticas e ingresos
 */

// Gestión de reservas y disponibilidad
export * from './reservas';
export * from './disponibilidad';
export * from './validacionReservas';
export * from './reservasRecurrentes';

// Configuraciones y políticas
export * from './configuracionAprobacion';
export * from './configuracionBufferTime';
export * from './configuracionTiempoMinimoAnticipacion';
export * from './configuracionDiasMaximosReserva';
export * from './politicasCancelacion';
export * from './fechasNoDisponibles';
export * from './duracionesSesion';
export * from './schedules';

// Plantillas, paquetes y bonos
export * from './plantillasSesion';
export * from './paquetesSesiones';
export * from './bonos';

// Enlaces y videollamadas
export * from './enlacePublico';
export * from './enlacesVideollamada';

// Notificaciones
export * from './notificacionesReserva';
export * from './notificacionesNuevasReservas';
export * from './notificacionesCancelacionReserva';

// Confirmaciones y tokens
export * from './tokensConfirmacion';

// Notas y estadísticas
export * from './notasSesion';
export * from './estadisticasAsistencia';
export * from './ingresos';

// Lista de espera
export * from './listaEspera';
