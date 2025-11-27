/**
 * Tipos TypeScript para Paquetes de Servicios
 * 
 * Este archivo define las interfaces y tipos relacionados con paquetes de servicios
 * que pueden ser facturados y gestionados en el sistema.
 * 
 * RELACIÓN CON FACTURA:
 * - Los paquetes de servicios pueden generar facturas cuando se venden a clientes.
 * - Una Factura puede tener origen 'paquete' (ver OrigenFactura en index.ts).
 * - Los items de un paquete (serviciosIncluidos) pueden convertirse en LineaFactura
 *   cuando se genera una factura desde un paquete.
 * - El HistorialFacturacionPaquete rastrea todas las facturas asociadas a un paquete
 *   vendido a un cliente específico.
 * 
 * USO EN COMPONENTES:
 * - Componentes de gestión de paquetes: creación, edición, listado de paquetes.
 * - Componentes de venta de paquetes: selección de paquetes para clientes.
 * - Componentes de seguimiento: visualización del consumo de sesiones del paquete.
 * - Componentes de facturación: generación automática de facturas desde paquetes.
 */

// ============================================================================
// 1. TIPOS BASE
// ============================================================================

/**
 * Período de recurrencia para paquetes recurrentes
 * Usado en: Configuración de paquetes, generación automática de facturas
 */
export type PeriodoRecurrente = 'mensual' | 'trimestral' | 'semestral' | 'anual';

/**
 * Item de servicio incluido en un paquete
 * Representa un servicio específico con su cantidad de sesiones
 */
export interface ServicioIncluido {
  servicioId: string; // ID del servicio en el catálogo de servicios
  nombreServicio: string; // Nombre del servicio (para evitar joins en listados)
  cantidadSesiones: number; // Número de sesiones incluidas en el paquete
}

// ============================================================================
// 2. INTERFACES PRINCIPALES
// ============================================================================

/**
 * Paquete de Servicios
 * 
 * Representa un paquete predefinido de servicios que puede ser vendido a clientes.
 * Los paquetes pueden ser únicos (una sola compra) o recurrentes (facturación periódica).
 * 
 * RELACIÓN CON FACTURA:
 * - Cuando se vende un paquete, se genera una Factura con origen 'paquete'.
 * - Los serviciosIncluidos se convierten en LineaFactura en la factura generada.
 * - El precio del paquete se refleja como el total de la factura.
 * - Si esRecurrente es true, se pueden generar múltiples facturas periódicamente.
 * 
 * USO EN COMPONENTES:
 * - GestorPaquetes: creación, edición, activación/desactivación de paquetes.
 * - SelectorPaquetes: selección de paquetes para asignar a clientes.
 * - GeneradorFacturasPaquetes: creación automática de facturas desde paquetes.
 */
export interface PaqueteServicio {
  id: string; // Identificador único del paquete
  nombre: string; // Nombre del paquete (ej: "Paquete Premium Mensual")
  descripcion: string; // Descripción detallada del paquete
  serviciosIncluidos: ServicioIncluido[]; // Lista de servicios y sesiones incluidas
  precio: number; // Precio total del paquete
  moneda: string; // Código de moneda (ej: 'EUR', 'USD', 'MXN')
  esRecurrente: boolean; // Indica si el paquete se factura periódicamente
  periodoRecurrenteOpcional?: PeriodoRecurrente; // Período de recurrencia (solo si esRecurrente es true)
  activo: boolean; // Indica si el paquete está disponible para venta
  creadoEn: Date; // Timestamp de creación del paquete
}

/**
 * Historial de Facturación de un Paquete
 * 
 * Rastrea el historial de facturación de un paquete específico vendido a un cliente.
 * Permite conocer cuántas facturas se han generado, el importe total facturado,
 * y el consumo de sesiones del paquete.
 * 
 * RELACIÓN CON FACTURA:
 * - numeroFacturasAsociadas contiene los IDs de todas las Facturas generadas
 *   para este paquete y cliente.
 * - importeTotalFacturado es la suma de los totales de todas las facturas asociadas.
 * - Las sesiones consumidas y restantes se calculan a partir de las facturas
 *   y los servicios utilizados por el cliente.
 * 
 * USO EN COMPONENTES:
 * - VistaHistorialPaquete: visualización del historial de facturación del paquete.
 * - SeguimientoConsumoSesiones: tracking de sesiones consumidas vs disponibles.
 * - ReportesPaquetes: análisis de facturación y consumo de paquetes.
 */
export interface HistorialFacturacionPaquete {
  paqueteId: string; // ID del paquete vendido
  clienteId: string; // ID del cliente que compró el paquete
  numeroFacturasAsociadas: string[]; // IDs de todas las facturas generadas para este paquete
  importeTotalFacturado: number; // Suma total de todas las facturas asociadas
  sesionesConsumidas: number; // Total de sesiones ya utilizadas del paquete
  sesionesRestantes: number; // Total de sesiones aún disponibles en el paquete
}

