/**
 * Archivo de barril que centraliza la importación de componentes del módulo de Facturación y Cobros.
 * 
 * Este archivo exporta todos los componentes clave del módulo para facilitar las importaciones
 * desde otros módulos y mantener una estructura organizada.
 */

// Componentes principales de gestión
export { FacturacionManager } from './FacturacionManager';
export { CreadorFactura } from './CreadorFactura';
export { GestorCobros } from './GestorCobros';
export { FacturasVencidas } from './FacturasVencidas';
export { RecordatoriosPago } from './RecordatoriosPago';
export { ConfiguracionRecordatoriosAutomaticos } from './ConfiguracionRecordatoriosAutomaticos';
export { EnviarLinkPago } from './EnviarLinkPago';
export { GestorSuscripcionesRecurrentes } from './GestorSuscripcionesRecurrentes';
export { ConfigurarCobrosRecurrentes } from './ConfigurarCobrosRecurrentes';

// Componentes de análisis y exportación
export { ReportesFacturacion } from './ReportesFacturacion';
export { ReporteIngresosPorServicio } from './ReporteIngresosPorServicio';
export { CalendarioIngresos } from './CalendarioIngresos';
export { DashboardWidget } from './DashboardWidget';
export { ModalFacturacionAutomatica } from './ModalFacturacionAutomatica';
export type { ConfiguracionFacturacionAutomatica } from './ModalFacturacionAutomatica';
export { ExportPDF } from './ExportPDF';
export { PlantillasFactura } from './PlantillasFactura';
export { HistorialPagosCliente } from './HistorialPagosCliente';
export { SeguimientoEstados } from './SeguimientoEstados';

// Componentes de reportes y análisis
export { ReportesFacturacion } from './ReportesFacturacion';
export { ReporteIngresosPorServicio } from './ReporteIngresosPorServicio';
export { CalendarioIngresos } from './CalendarioIngresos';
export { DashboardWidget } from './DashboardWidget';

// Modales y componentes de UI
export { ModalFacturacionAutomatica } from './ModalFacturacionAutomatica';
export { ModalPagoRapido } from './ModalPagoRapido';

// Utilidades
export { ExportPDF } from './ExportPDF';

