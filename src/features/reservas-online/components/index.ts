/**
 * Archivo de barril que facilita importar componentes del módulo Reservas Online
 * desde un único punto de entrada.
 */

// Componente principal
export { ReservasOnline } from './ReservasOnline';

// Componentes de calendario y selección
export { CalendarioReservas } from './CalendarioReservas';
export { SelectorHuecos } from './SelectorHuecos';

// Componentes de historial y gestión
export { HistorialReservas } from './HistorialReservas';
export { Cancelaciones } from './Cancelaciones';
export { ListaEspera } from './ListaEspera';
export { ListaSesionesDia } from './ListaSesionesDia';

// Componentes de gestión de reservas
export { GestionReservasRecurrentes } from './GestionReservasRecurrentes';
export { GestionPlantillasSesion } from './GestionPlantillasSesion';
export { GestionPaquetesSesiones } from './GestionPaquetesSesiones';
export { GestionEnlacePublico } from './GestionEnlacePublico';
export { GestionFechasNoDisponibles } from './GestionFechasNoDisponibles';

// Componentes de configuración
export { ConfiguracionHorarios } from './ConfiguracionHorarios';
export { ConfiguracionDuracionesSesion } from './ConfiguracionDuracionesSesion';
export { ConfiguracionAprobacionReservas } from './ConfiguracionAprobacionReservas';
export { ConfiguracionBufferTimeYTiempoMinimo } from './ConfiguracionBufferTimeYTiempoMinimo';
export { ConfiguracionDiasMaximosReserva } from './ConfiguracionDiasMaximosReserva';
export { ConfiguracionPoliticasCancelacion } from './ConfiguracionPoliticasCancelacion';
export { ConfiguracionVideollamada } from './ConfiguracionVideollamada';

// Componentes de recordatorios
export { RecordatoriosReserva } from './RecordatoriosReserva';
export { RecordatoriosEntrenador } from './RecordatoriosEntrenador';
export { RecordatoriosPagoPendiente } from './RecordatoriosPagoPendiente';

// Componentes de notas
export { NotasCliente } from './NotasCliente';
export { AgregarNotaSesion } from './AgregarNotaSesion';

// Componentes de acciones
export { ReprogramarReserva } from './ReprogramarReserva';
export { ConfirmacionReserva } from './ConfirmacionReserva';
export type { ConfirmacionReservaProps } from './ConfirmacionReserva';

// Componentes de analytics y estadísticas
export { AnalyticsReservas } from './AnalyticsReservas';
export { EstadisticasAsistenciaClientes } from './EstadisticasAsistenciaClientes';
export { IngresosPorHorario } from './IngresosPorHorario';
export { IngresosPorCliente } from './IngresosPorCliente';
export { ResumenSesiones24Horas } from './ResumenSesiones24Horas';

// Componentes de notificaciones
export { NotificacionNuevaReservaToast } from './NotificacionNuevaReservaToast';
export { NotificacionesNuevasReservasProvider } from './NotificacionesNuevasReservasProvider';
