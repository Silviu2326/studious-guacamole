import { Producto, OpcionesSeleccionadas, OpcionValor, ItemCarrito } from '../types';

/**
 * Calcula el precio de un producto considerando las opciones personalizables seleccionadas
 */
export function calcularPrecioConOpciones(
  producto: Producto,
  opcionesSeleccionadas?: OpcionesSeleccionadas
): number {
  let precio = producto.precio;

  if (!opcionesSeleccionadas || !producto.metadatos?.opcionesPersonalizables) {
    return precio;
  }

  // Aplicar modificadores de precio de las opciones seleccionadas
  producto.metadatos.opcionesPersonalizables.forEach((opcion) => {
    const valorIdSeleccionado = opcionesSeleccionadas[opcion.id];
    if (!valorIdSeleccionado) {
      return;
    }

    const valorSeleccionado = opcion.valores.find((v) => v.id === valorIdSeleccionado);
    if (!valorSeleccionado || !valorSeleccionado.disponible) {
      return;
    }

    // Aplicar modificador en euros
    if (valorSeleccionado.modificadorPrecio !== undefined) {
      precio += valorSeleccionado.modificadorPrecio;
    }

    // Aplicar modificador en porcentaje (sobre el precio base)
    if (valorSeleccionado.modificadorPorcentaje !== undefined) {
      precio += (producto.precio * valorSeleccionado.modificadorPorcentaje) / 100;
    }
  });

  return Math.max(0, precio); // Asegurar que el precio no sea negativo
}

/**
 * Obtiene el modificador total de precio por opciones seleccionadas
 */
export function obtenerModificadorPrecioOpciones(
  producto: Producto,
  opcionesSeleccionadas?: OpcionesSeleccionadas
): number {
  const precioConOpciones = calcularPrecioConOpciones(producto, opcionesSeleccionadas);
  return precioConOpciones - producto.precio;
}

/**
 * Valida que todas las opciones requeridas estén seleccionadas
 */
export function validarOpcionesRequeridas(
  producto: Producto,
  opcionesSeleccionadas?: OpcionesSeleccionadas
): { valido: boolean; errores: string[] } {
  const errores: string[] = [];

  if (!producto.metadatos?.opcionesPersonalizables) {
    return { valido: true, errores: [] };
  }

  producto.metadatos.opcionesPersonalizables.forEach((opcion) => {
    if (opcion.requerida) {
      const valorSeleccionado = opcionesSeleccionadas?.[opcion.id];
      if (!valorSeleccionado) {
        errores.push(`La opción "${opcion.nombre}" es obligatoria`);
        return;
      }

      const valor = opcion.valores.find((v) => v.id === valorSeleccionado);
      if (!valor || !valor.disponible) {
        errores.push(`El valor seleccionado para "${opcion.nombre}" no está disponible`);
      }
    }
  });

  return {
    valido: errores.length === 0,
    errores,
  };
}

/**
 * Obtiene el texto descriptivo de las opciones seleccionadas
 */
export function obtenerDescripcionOpciones(
  producto: Producto,
  opcionesSeleccionadas?: OpcionesSeleccionadas
): string {
  if (!opcionesSeleccionadas || !producto.metadatos?.opcionesPersonalizables) {
    return '';
  }

  const descripciones: string[] = [];

  producto.metadatos.opcionesPersonalizables.forEach((opcion) => {
    const valorIdSeleccionado = opcionesSeleccionadas[opcion.id];
    if (valorIdSeleccionado) {
      const valor = opcion.valores.find((v) => v.id === valorIdSeleccionado);
      if (valor) {
        descripciones.push(`${opcion.nombre}: ${valor.nombre}`);
      }
    }
  });

  return descripciones.join(', ');
}

// ============================================================================
// FUNCIONES DE CÁLCULO DE PRECIOS PARA CHECKOUT Y CARRITO
// ============================================================================
// Estas funciones están diseñadas para ser utilizadas en:
// - checkout.ts: Para calcular totales durante el proceso de checkout
// - CarritoCompras.tsx: Para mostrar subtotales y totales en tiempo real
// - CheckoutManager.tsx: Para gestionar cálculos de precios en el flujo de checkout

/**
 * Calcula el subtotal de un item individual del carrito
 * 
 * @param item - Item del carrito con cantidad y precio unitario
 * @returns Subtotal del item (precioUnitario * cantidad)
 * 
 * @example
 * ```ts
 * const item: ItemCarrito = {
 *   id: '1',
 *   productoId: 'prod-1',
 *   nombreProducto: 'Producto A',
 *   cantidad: 2,
 *   precioUnitario: 10.50,
 *   importeSubtotal: 0 // Se calculará
 * };
 * const subtotal = calcularSubtotalItem(item); // 21.00
 * ```
 * 
 * Uso en CarritoCompras.tsx:
 * ```tsx
 * {items.map(item => (
 *   <div key={item.id}>
 *     Subtotal: €{calcularSubtotalItem(item).toFixed(2)}
 *   </div>
 * ))}
 * ```
 */
export function calcularSubtotalItem(item: ItemCarrito): number {
  return item.precioUnitario * item.cantidad;
}

/**
 * Calcula el subtotal total del carrito sumando todos los items
 * 
 * @param items - Array de items del carrito
 * @returns Subtotal total del carrito (suma de todos los subtotales de items)
 * 
 * @example
 * ```ts
 * const items: ItemCarrito[] = [
 *   { cantidad: 2, precioUnitario: 10.50, ... },
 *   { cantidad: 1, precioUnitario: 25.00, ... }
 * ];
 * const subtotal = calcularSubtotalCarrito(items); // 46.00
 * ```
 * 
 * Uso en checkout.ts:
 * ```ts
 * const subtotal = calcularSubtotalCarrito(pedido.items);
 * const impuestos = calcularImpuestos(subtotal);
 * ```
 */
export function calcularSubtotalCarrito(items: ItemCarrito[]): number {
  return items.reduce((total, item) => {
    return total + calcularSubtotalItem(item);
  }, 0);
}

/**
 * Calcula los impuestos sobre una base imponible
 * 
 * @param baseImponible - Base imponible sobre la que calcular impuestos
 * @param opciones - Opciones de configuración de impuestos
 * @param opciones.tipoIVA - Tipo de IVA a aplicar (por defecto: 21% para España)
 * @returns Importe de impuestos calculado
 * 
 * @example
 * ```ts
 * // Con IVA por defecto (21%)
 * const impuestos = calcularImpuestos(100); // 21.00
 * 
 * // Con IVA personalizado
 * const impuestos = calcularImpuestos(100, { tipoIVA: 10 }); // 10.00
 * 
 * // Para otros países (ej: México con 16%)
 * const impuestos = calcularImpuestos(100, { tipoIVA: 16 }); // 16.00
 * ```
 * 
 * Uso en CheckoutManager.tsx:
 * ```tsx
 * const subtotal = calcularSubtotalCarrito(items);
 * const impuestos = calcularImpuestos(subtotal, { tipoIVA: 21 });
 * const total = calcularTotal(subtotal, impuestos, gastosEnvio, descuentos);
 * ```
 * 
 * Nota: El tipo de IVA es configurable para soportar diferentes países y regímenes fiscales.
 * Por defecto usa 21% (IVA estándar en España), pero puede ajustarse según necesidades.
 */
export function calcularImpuestos(
  baseImponible: number,
  opciones?: { tipoIVA?: number }
): number {
  const tipoIVA = opciones?.tipoIVA ?? 21; // Por defecto 21% (IVA estándar España)
  return baseImponible * (tipoIVA / 100);
}

/**
 * Calcula los gastos de envío según los items del carrito y opciones de envío
 * 
 * @param items - Array de items del carrito
 * @param opciones - Opciones de configuración de envío
 * @param opciones.envioGratisDesde - Monto mínimo para envío gratis (opcional)
 * @param opciones.tarifaBase - Tarifa base de envío (por defecto: 5.00)
 * @returns Importe de gastos de envío (0 si aplica envío gratis)
 * 
 * @example
 * ```ts
 * // Envío estándar
 * const gastos = calcularGastosEnvio(items); // 5.00
 * 
 * // Con envío gratis desde 50€
 * const gastos = calcularGastosEnvio(items, { 
 *   envioGratisDesde: 50,
 *   tarifaBase: 5.00 
 * }); // 0 si subtotal >= 50, 5.00 si < 50
 * 
 * // Tarifa personalizada
 * const gastos = calcularGastosEnvio(items, { tarifaBase: 7.50 }); // 7.50
 * ```
 * 
 * Uso en CarritoCompras.tsx:
 * ```tsx
 * const subtotal = calcularSubtotalCarrito(items);
 * const gastosEnvio = calcularGastosEnvio(items, {
 *   envioGratisDesde: 50,
 *   tarifaBase: 5.00
 * });
 * ```
 * 
 * Nota: Esta función puede extenderse para incluir lógica más compleja como:
 * - Envío por peso o volumen
 * - Tarifas por zonas geográficas
 * - Envío express con tarifas adicionales
 */
export function calcularGastosEnvio(
  items: ItemCarrito[],
  opciones?: { envioGratisDesde?: number; tarifaBase?: number }
): number {
  const tarifaBase = opciones?.tarifaBase ?? 5.00; // Tarifa base por defecto
  const envioGratisDesde = opciones?.envioGratisDesde;
  
  // Si hay umbral de envío gratis, verificar si aplica
  if (envioGratisDesde !== undefined) {
    const subtotal = calcularSubtotalCarrito(items);
    if (subtotal >= envioGratisDesde) {
      return 0; // Envío gratis
    }
  }
  
  return tarifaBase;
}

/**
 * Calcula el total final sumando subtotal, impuestos, gastos de envío y restando descuentos
 * 
 * @param subtotal - Subtotal del carrito (sin impuestos)
 * @param impuestos - Importe de impuestos calculado
 * @param gastosEnvio - Gastos de envío calculados
 * @param descuentos - Total de descuentos aplicados (códigos promocionales, ofertas, etc.)
 * @returns Total final a pagar
 * 
 * @example
 * ```ts
 * const subtotal = 100.00;
 * const impuestos = calcularImpuestos(subtotal); // 21.00
 * const gastosEnvio = 5.00;
 * const descuentos = 10.00; // Descuento de código promocional
 * 
 * const total = calcularTotal(subtotal, impuestos, gastosEnvio, descuentos);
 * // total = 100 + 21 + 5 - 10 = 116.00
 * ```
 * 
 * Uso en checkout.ts:
 * ```ts
 * const subtotal = calcularSubtotalCarrito(items);
 * const impuestos = calcularImpuestos(subtotal);
 * const gastosEnvio = calcularGastosEnvio(items);
 * const descuentos = combinarDescuentos({ subtotal }, { codigo, ofertas }).descuentosTotales;
 * const total = calcularTotal(subtotal, impuestos, gastosEnvio, descuentos);
 * 
 * const pedido: Pedido = {
 *   // ...
 *   importeProductos: subtotal,
 *   impuestos,
 *   gastosEnvio,
 *   descuentosTotales: descuentos,
 *   importeTotal: total
 * };
 * ```
 * 
 * Fórmula: Total = Subtotal + Impuestos + Gastos de Envío - Descuentos
 * 
 * Nota: Los descuentos se aplican sobre el subtotal antes de calcular impuestos,
 * pero esta función recibe los valores ya calculados para mayor flexibilidad.
 */
export function calcularTotal(
  subtotal: number,
  impuestos: number,
  gastosEnvio: number,
  descuentos: number
): number {
  // Asegurar que el total nunca sea negativo
  return Math.max(0, subtotal + impuestos + gastosEnvio - descuentos);
}

