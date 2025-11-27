/**
 * Tipos TypeScript para Plantillas de Facturas
 * 
 * Este archivo define las interfaces y tipos relacionados con plantillas personalizables
 * para la generación y visualización de facturas.
 * 
 * RELACIÓN CON FACTURA:
 * - Las plantillas definen cómo se renderiza y presenta una Factura al cliente.
 * - Cada Factura puede estar asociada a una PlantillaFactura específica.
 * - Los camposOpcionales de la plantilla pueden almacenar información adicional
 *   que se incluye en la factura pero no forma parte de la estructura base de Factura.
 * - El diseño de la plantilla (clasica, minimal, detallada) determina el layout
 *   y la presentación visual de la factura.
 * 
 * USO EN COMPONENTES:
 * - EditorPlantillas: creación y edición de plantillas de facturas.
 * - SelectorPlantillas: selección de plantilla al generar una factura.
 * - RenderizadorFacturas: aplicación de la plantilla para mostrar la factura.
 * - ConfiguracionFacturacion: gestión de plantilla por defecto.
 */

// ============================================================================
// 1. TIPOS BASE Y ENUMS
// ============================================================================

/**
 * Estilos de diseño disponibles para plantillas de facturas
 * Usado en: Selector de diseño, renderizado de facturas, preview de plantillas
 */
export type DisenoPlantilla = 'clasica' | 'minimal' | 'detallada';

/**
 * Tipos de campos personalizados que se pueden agregar a una plantilla
 * Usado en: Editor de campos personalizados, validación de campos, renderizado
 */
export type TipoCampoPersonalizado = 'texto' | 'numero' | 'fecha' | 'boolean';

// ============================================================================
// 2. INTERFACES PRINCIPALES
// ============================================================================

/**
 * Campo Personalizado de Factura
 * 
 * Representa un campo adicional que puede ser incluido en una plantilla de factura.
 * Estos campos permiten agregar información personalizada más allá de los campos
 * estándar de la Factura (como notas adicionales, términos específicos, etc.).
 * 
 * RELACIÓN CON FACTURA:
 * - Los campos personalizados se almacenan en la plantilla, no directamente en Factura.
 * - Cuando se renderiza una factura con una plantilla, los campos personalizados
 *   se muestran según su tipo y valorPorDefectoOpcional.
 * - El valor real del campo puede ser proporcionado al generar la factura o
 *   usar el valorPorDefectoOpcional si está definido.
 * 
 * USO EN COMPONENTES:
 * - EditorCamposPersonalizados: agregar, editar, eliminar campos personalizados.
 * - FormularioGeneracionFactura: completar valores de campos personalizados.
 * - RenderizadorFacturas: mostrar campos personalizados en la factura renderizada.
 */
export interface CampoPersonalizadoFactura {
  id: string; // Identificador único del campo personalizado
  nombreCampo: string; // Nombre del campo (ej: "Términos de pago", "Referencia interna")
  tipo: TipoCampoPersonalizado; // Tipo de dato del campo
  valorPorDefectoOpcional?: string | number | boolean | Date; // Valor por defecto (opcional)
}

/**
 * Plantilla de Factura
 * 
 * Define el diseño, estilo y campos personalizados para la presentación de facturas.
 * Las plantillas permiten personalizar la apariencia visual y la información adicional
 * que se muestra en las facturas generadas.
 * 
 * RELACIÓN CON FACTURA:
 * - Una Factura puede estar asociada a una PlantillaFactura mediante un campo
 *   plantillaId (que debería agregarse a la interfaz Factura si no existe).
 * - El diseño (clasica, minimal, detallada) determina cómo se estructura visualmente
 *   la información de la Factura.
 * - Los camposOpcionales permiten incluir información adicional en la factura
 *   que no está en la estructura base de Factura.
 * - logoUrlOpcional y colorPrimarioOpcional personalizan la apariencia visual.
 * - textoLegalOpcional permite agregar términos legales específicos a la factura.
 * - esPorDefecto indica si esta plantilla se usa automáticamente para nuevas facturas.
 * 
 * USO EN COMPONENTES:
 * - GestorPlantillas: creación, edición, activación de plantillas.
 * - SelectorPlantillas: selección de plantilla al crear/editar facturas.
 * - PreviewPlantilla: vista previa de cómo se verá una factura con la plantilla.
 * - RenderizadorFacturas: aplicación de la plantilla para generar el PDF/HTML de la factura.
 * - ConfiguracionFacturacion: gestión de plantilla por defecto del sistema.
 */
export interface PlantillaFactura {
  id: string; // Identificador único de la plantilla
  nombre: string; // Nombre de la plantilla (ej: "Plantilla Clásica", "Plantilla Minimalista")
  descripcion: string; // Descripción de la plantilla y cuándo usarla
  diseño: DisenoPlantilla; // Estilo de diseño de la plantilla
  logoUrlOpcional?: string; // URL del logo a mostrar en la factura (opcional)
  colorPrimarioOpcional?: string; // Color primario en formato hex (ej: "#FF5733") (opcional)
  camposOpcionales: CampoPersonalizadoFactura[]; // Lista de campos personalizados de la plantilla
  textoLegalOpcional?: string; // Texto legal adicional a incluir en la factura (opcional)
  esPorDefecto: boolean; // Indica si esta es la plantilla por defecto para nuevas facturas
}

