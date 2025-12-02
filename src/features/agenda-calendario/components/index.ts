/**
 * Archivo de barril que facilita la importación de componentes de agenda/calendario
 * desde un único punto de entrada.
 * 
 * Este archivo centraliza todas las exportaciones de componentes del módulo
 * Agenda y Calendario, simplificando las importaciones en otros archivos.
 */

// Componente principal del calendario
export { AgendaCalendar } from './AgendaCalendar';

// Vistas del calendario
export { VistaDiaCompleto } from './VistaDiaCompleto';
export { VistaPersonal } from './VistaPersonal';
export { VistaCentro } from './VistaCentro';

// Modales de sesiones
export { ModalRapidoCrearSesion } from './ModalRapidoCrearSesion';
export { ModalEditarSesion } from './ModalEditarSesion';
export { ModalDetalleSesion } from './ModalDetalleSesion';

// Gestores y configuradores
export { GestorHorarios } from './GestorHorarios';
export { ConfiguradorHorariosTrabajo } from './ConfiguradorHorariosTrabajo';
export { BloqueosAgenda } from './BloqueosAgenda';
export { GestorListaEspera } from './GestorListaEspera';

// Funcionalidades y recordatorios
export { RecordatoriosAutomaticos } from './RecordatoriosAutomaticos';
export { ConfiguracionResumenDiario } from './ConfiguracionResumenDiario';
export { VistaResumenDiario } from './VistaResumenDiario';
export { ConfiguracionTiempoDescanso } from './ConfiguracionTiempoDescanso';
export { SincronizacionCalendario } from './SincronizacionCalendario';
export { GestorEnlacesReserva } from './GestorEnlacesReserva';

// Historial
export { HistorialCliente } from './HistorialCliente';
export { HistorialBasicoSesiones } from './HistorialBasicoSesiones';

// Analytics y dashboards
export { AnalyticsOcupacion } from './AnalyticsOcupacion';
export { DashboardFinanciero } from './DashboardFinanciero';
export { EstadisticasConfirmacion } from './EstadisticasConfirmacion';
export { EstadisticasNoShows } from './EstadisticasNoShows';
export { EstadisticasCumplimientoPolitica } from './EstadisticasCumplimientoPolitica';
export { DashboardMetricasSesiones } from './DashboardMetricasSesiones';
export { MapaCalorHorarios } from './MapaCalorHorarios';

// Configuración
export { ConfiguracionPoliticaCancelacion } from './ConfiguracionPoliticaCancelacion';
export { ClienteAutocomplete } from './ClienteAutocomplete';
