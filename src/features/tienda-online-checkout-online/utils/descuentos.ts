import { Producto, CarritoItem, DescuentoPorCantidad, Carrito, CodigoPromocional, ItemCarrito, OfertaEspecial } from '../types';
import { calcularPrecioConOpciones } from './precios';
import { aplicarCodigoPromocional as aplicarCodigoPromocionalAPI } from '../api/codigosPromocionales';

/**
 * Calcula el descuento aplicable para un producto según la cantidad
 * @param producto El producto con sus descuentos configurados
 * @param cantidad La cantidad de unidades en el carrito
 * @returns El descuento aplicable (porcentaje) o null si no aplica
 */
export function calcularDescuentoPorCantidad(
  producto: Producto,
  cantidad: number
): DescuentoPorCantidad | null {
  if (!producto.metadatos?.descuentosPorCantidad || producto.metadatos.descuentosPorCantidad.length === 0) {
    return null;
  }

  // Ordenar descuentos por cantidad mínima (de mayor a menor)
  const descuentosOrdenados = [...producto.metadatos.descuentosPorCantidad].sort(
    (a, b) => b.cantidadMinima - a.cantidadMinima
  );

  // Encontrar el descuento más alto que aplica para esta cantidad
  for (const descuento of descuentosOrdenados) {
    if (cantidad >= descuento.cantidadMinima) {
      return descuento;
    }
  }

  return null;
}

/**
 * Calcula el precio con descuento para un item del carrito
 * @param producto El producto
 * @param cantidad La cantidad de unidades
 * @param opcionesSeleccionadas Opciones personalizables seleccionadas (opcional)
 * @returns Objeto con información del descuento aplicado
 */
export function calcularPrecioConDescuento(
  producto: Producto,
  cantidad: number,
  opcionesSeleccionadas?: CarritoItem['opcionesSeleccionadas']
): {
  precioUnitario: number;
  precioUnitarioConDescuento: number;
  porcentajeDescuento: number;
  descuentoAplicado: number;
  subtotal: number;
  precioBase: number;
  modificadorPrecioOpciones: number;
} {
  // Primero calcular el precio base con opciones personalizables
  const precioBase = calcularPrecioConOpciones(producto, opcionesSeleccionadas);
  const modificadorPrecioOpciones = precioBase - producto.precio;
  
  const descuento = calcularDescuentoPorCantidad(producto, cantidad);

  if (!descuento) {
    return {
      precioUnitario: producto.precio,
      precioUnitarioConDescuento: precioBase,
      porcentajeDescuento: 0,
      descuentoAplicado: 0,
      subtotal: precioBase * cantidad,
      precioBase,
      modificadorPrecioOpciones,
    };
  }

  const porcentajeDescuento = descuento.porcentajeDescuento;
  // Aplicar descuento sobre el precio con opciones
  const precioUnitarioConDescuento = precioBase * (1 - porcentajeDescuento / 100);
  const subtotalSinDescuento = precioBase * cantidad;
  const subtotalConDescuento = precioUnitarioConDescuento * cantidad;
  const descuentoAplicado = subtotalSinDescuento - subtotalConDescuento;

  return {
    precioUnitario: producto.precio,
    precioUnitarioConDescuento,
    porcentajeDescuento,
    descuentoAplicado,
    subtotal: subtotalConDescuento,
    precioBase,
    modificadorPrecioOpciones,
  };
}

/**
 * Actualiza un item del carrito con los descuentos aplicados
 * @param item El item del carrito
 * @returns El item actualizado con información de descuentos
 */
export function aplicarDescuentosACarritoItem(item: CarritoItem): CarritoItem {
  const calculoDescuento = calcularPrecioConDescuento(
    item.producto,
    item.cantidad,
    item.opcionesSeleccionadas
  );

  return {
    ...item,
    subtotal: calculoDescuento.subtotal,
    descuentoAplicado: calculoDescuento.descuentoAplicado,
    porcentajeDescuento: calculoDescuento.porcentajeDescuento,
    precioUnitarioConDescuento: calculoDescuento.precioUnitarioConDescuento,
    precioBase: calculoDescuento.precioBase,
    modificadorPrecioOpciones: calculoDescuento.modificadorPrecioOpciones,
  };
}

/**
 * Aplica un código promocional al carrito
 * @param carrito El carrito actual
 * @param codigoPromocional El código promocional a aplicar
 * @returns El carrito actualizado con el descuento del código promocional
 */
export async function aplicarCodigoPromocionalACarrito(
  carrito: Carrito,
  codigoPromocional: CodigoPromocional
): Promise<Carrito> {
  // Calcular el descuento del código promocional sobre el subtotal con descuentos de cantidad
  const descuentoCodigo = await aplicarCodigoPromocionalAPI(codigoPromocional, carrito.subtotal);

  // Recalcular totales
  const subtotalConDescuentos = carrito.subtotal - descuentoCodigo;
  const impuestos = subtotalConDescuentos * 0.21;
  const total = subtotalConDescuentos + impuestos;

  return {
    ...carrito,
    descuentoCodigoPromocional: descuentoCodigo,
    codigoPromocional,
    impuestos,
    total,
  };
}

// ============================================================================
// FUNCIONES DE DESCUENTOS PARA CHECKOUT Y CARRITO
// ============================================================================
// Estas funciones están diseñadas para ser utilizadas en:
// - checkout.ts: Para aplicar descuentos durante el proceso de checkout
// - CarritoCompras.tsx: Para mostrar descuentos aplicados en tiempo real
// - CheckoutManager.tsx: Para gestionar códigos promocionales y ofertas especiales

/**
 * Aplica un código promocional a un subtotal y calcula el descuento resultante
 * 
 * @param subtotal - Subtotal sobre el que aplicar el descuento
 * @param codigo - Código promocional a aplicar
 * @returns Objeto con el descuento calculado y el subtotal con descuento aplicado
 * 
 * @example
 * ```ts
 * const codigo: CodigoPromocional = {
 *   id: '1',
 *   codigo: 'DESCUENTO10',
 *   tipoDescuento: 'porcentaje',
 *   valorDescuento: 10,
 *   activo: true
 * };
 * 
 * const resultado = aplicarCodigoPromocional(100, codigo);
 * // resultado = { descuento: 10, subtotalConDescuento: 90 }
 * 
 * // Con descuento fijo
 * const codigoFijo: CodigoPromocional = {
 *   tipoDescuento: 'importe_fijo',
 *   valorDescuento: 15,
 *   // ...
 * };
 * const resultado2 = aplicarCodigoPromocional(100, codigoFijo);
 * // resultado2 = { descuento: 15, subtotalConDescuento: 85 }
 * ```
 * 
 * Uso en checkout.ts:
 * ```ts
 * const subtotal = calcularSubtotalCarrito(items);
 * const { descuento, subtotalConDescuento } = aplicarCodigoPromocional(subtotal, codigo);
 * ```
 * 
 * Uso en CarritoCompras.tsx:
 * ```tsx
 * const handleAplicarCodigo = async (codigo: string) => {
 *   const codigoValidado = await validarCodigoPromocional(codigo, carrito);
 *   if (codigoValidado.valido && codigoValidado.codigo) {
 *     const { descuento, subtotalConDescuento } = aplicarCodigoPromocional(
 *       carrito.subtotal,
 *       codigoValidado.codigo
 *     );
 *     // Actualizar estado del carrito
 *   }
 * };
 * ```
 * 
 * Nota: Esta función calcula el descuento pero NO valida si el código es aplicable.
 * La validación debe hacerse previamente usando validarCodigoPromocional de la API.
 */
export function aplicarCodigoPromocional(
  subtotal: number,
  codigo: CodigoPromocional
): { descuento: number; subtotalConDescuento: number } {
  let descuento = 0;

  if (codigo.tipoDescuento === 'porcentaje') {
    // Descuento porcentual
    descuento = (subtotal * codigo.valorDescuento) / 100;
  } else if (codigo.tipoDescuento === 'importe_fijo') {
    // Descuento fijo (no puede exceder el subtotal)
    descuento = Math.min(codigo.valorDescuento, subtotal);
  }

  // Asegurar que el descuento no sea negativo
  descuento = Math.max(0, descuento);
  
  const subtotalConDescuento = Math.max(0, subtotal - descuento);

  return {
    descuento,
    subtotalConDescuento,
  };
}

/**
 * Aplica una oferta especial a los items del carrito
 * 
 * Esta función puede manejar diferentes tipos de ofertas:
 * - tiempo_limitado: Ofertas con fecha de inicio y fin
 * - volumen: Descuentos por cantidad de productos
 * - bundle: Packs de productos con precio especial
 * - flash: Ofertas flash de tiempo limitado
 * 
 * @param items - Array de items del carrito
 * @param oferta - Oferta especial a aplicar
 * @returns Objeto con el descuento total aplicado y los items actualizados
 * 
 * @example
 * ```ts
 * // Oferta de volumen: 10% de descuento si compras 3+ productos
 * const oferta: OfertaEspecial = {
 *   id: '1',
 *   nombre: 'Oferta Volumen',
 *   tipo: 'volumen',
 *   productosIds: ['prod-1', 'prod-2'],
 *   reglasDescuento: {
 *     tipo: 'porcentaje',
 *     valor: 10,
 *     cantidadMinima: 3
 *   },
 *   activa: true,
 *   fechaInicio: new Date(),
 *   fechaFin: new Date(Date.now() + 86400000)
 * };
 * 
 * const resultado = aplicarOfertaEspecial(items, oferta);
 * // resultado = { descuento: 15.50, itemsActualizados: [...] }
 * ```
 * 
 * Uso en CheckoutManager.tsx:
 * ```tsx
 * const ofertasAplicables = ofertas.filter(o => 
 *   o.activa && 
 *   items.some(item => o.productosIds.includes(item.productoId))
 * );
 * 
 * let descuentoTotalOfertas = 0;
 * let itemsActualizados = items;
 * 
 * for (const oferta of ofertasAplicables) {
 *   const resultado = aplicarOfertaEspecial(itemsActualizados, oferta);
 *   descuentoTotalOfertas += resultado.descuento;
 *   itemsActualizados = resultado.itemsActualizados;
 * }
 * ```
 * 
 * Nota: Esta es una implementación simplificada (mock). En producción, las reglas
 * de descuento pueden ser más complejas y requerir lógica específica por tipo de oferta.
 * La estructura de reglasDescuento puede variar según el tipo de oferta.
 */
export function aplicarOfertaEspecial(
  items: ItemCarrito[],
  oferta: OfertaEspecial
): { descuento: number; itemsActualizados: ItemCarrito[] } {
  // Validar que la oferta esté activa y dentro del rango de fechas
  const ahora = new Date();
  if (!oferta.activa || ahora < oferta.fechaInicio || ahora > oferta.fechaFin) {
    return { descuento: 0, itemsActualizados: items };
  }

  // Filtrar items que aplican a esta oferta
  const itemsAplicables = items.filter(item => 
    oferta.productosIds.includes(item.productoId)
  );

  if (itemsAplicables.length === 0) {
    return { descuento: 0, itemsActualizados: items };
  }

  // Calcular subtotal de items aplicables
  const subtotalAplicable = itemsAplicables.reduce(
    (sum, item) => sum + (item.precioUnitario * item.cantidad),
    0
  );

  // Aplicar descuento según el tipo de oferta y reglas
  let descuento = 0;
  const itemsActualizados = [...items];

  if (oferta.tipo === 'volumen' || oferta.tipo === 'bundle') {
    // Descuento por volumen o bundle
    // Simplificado: asumimos que reglasDescuento tiene { tipo: 'porcentaje' | 'fijo', valor: number }
    const reglas = oferta.reglasDescuento as any;
    
    if (reglas?.tipo === 'porcentaje') {
      descuento = (subtotalAplicable * reglas.valor) / 100;
    } else if (reglas?.tipo === 'fijo') {
      descuento = Math.min(reglas.valor, subtotalAplicable);
    } else if (typeof reglas?.valor === 'number') {
      // Fallback: si solo hay un valor numérico, asumimos porcentaje
      descuento = (subtotalAplicable * reglas.valor) / 100;
    }

    // Aplicar descuento proporcionalmente a los items
    if (descuento > 0) {
      const factorDescuento = 1 - (descuento / subtotalAplicable);
      itemsAplicables.forEach((item, index) => {
        const itemIndex = itemsActualizados.findIndex(i => i.id === item.id);
        if (itemIndex !== -1) {
          itemsActualizados[itemIndex] = {
            ...itemsActualizados[itemIndex],
            precioUnitario: itemsActualizados[itemIndex].precioUnitario * factorDescuento,
            importeSubtotal: itemsActualizados[itemIndex].precioUnitario * itemsActualizados[itemIndex].cantidad,
          };
        }
      });
    }
  } else if (oferta.tipo === 'tiempo_limitado' || oferta.tipo === 'flash') {
    // Ofertas de tiempo limitado o flash
    const reglas = oferta.reglasDescuento as any;
    
    if (reglas?.tipo === 'porcentaje') {
      descuento = (subtotalAplicable * reglas.valor) / 100;
    } else if (reglas?.tipo === 'fijo') {
      descuento = Math.min(reglas.valor, subtotalAplicable);
    }

    // Aplicar descuento proporcionalmente
    if (descuento > 0) {
      const factorDescuento = 1 - (descuento / subtotalAplicable);
      itemsAplicables.forEach((item) => {
        const itemIndex = itemsActualizados.findIndex(i => i.id === item.id);
        if (itemIndex !== -1) {
          itemsActualizados[itemIndex] = {
            ...itemsActualizados[itemIndex],
            precioUnitario: itemsActualizados[itemIndex].precioUnitario * factorDescuento,
            importeSubtotal: itemsActualizados[itemIndex].precioUnitario * itemsActualizados[itemIndex].cantidad,
          };
        }
      });
    }
  }

  return {
    descuento: Math.max(0, descuento),
    itemsActualizados,
  };
}

/**
 * Combina múltiples descuentos (códigos promocionales y ofertas especiales) en un solo cálculo
 * 
 * Esta función aplica todos los descuentos disponibles y calcula el total de descuentos
 * y el subtotal final después de aplicar todos los descuentos.
 * 
 * @param base - Objeto base con el subtotal inicial
 * @param base.subtotal - Subtotal antes de aplicar descuentos
 * @param entrada - Objeto con los descuentos a aplicar
 * @param entrada.codigo - Código promocional opcional
 * @param entrada.ofertas - Array de ofertas especiales opcionales
 * @returns Objeto con los descuentos totales y el subtotal con descuentos aplicados
 * 
 * @example
 * ```ts
 * const subtotal = calcularSubtotalCarrito(items);
 * 
 * const codigo: CodigoPromocional = {
 *   tipoDescuento: 'porcentaje',
 *   valorDescuento: 10,
 *   // ...
 * };
 * 
 * const ofertas: OfertaEspecial[] = [
 *   { tipo: 'volumen', reglasDescuento: { tipo: 'porcentaje', valor: 5 }, ... },
 *   { tipo: 'bundle', reglasDescuento: { tipo: 'fijo', valor: 20 }, ... }
 * ];
 * 
 * const resultado = combinarDescuentos(
 *   { subtotal: 100 },
 *   { codigo, ofertas }
 * );
 * 
 * // Si el código da 10€ de descuento y las ofertas dan 5€ y 20€:
 * // resultado = { 
 * //   descuentosTotales: 35, 
 * //   subtotalConDescuentos: 65 
 * // }
 * ```
 * 
 * Uso en checkout.ts:
 * ```ts
 * const subtotal = calcularSubtotalCarrito(items);
 * 
 * // Obtener descuentos aplicables
 * const codigoPromocional = await obtenerCodigoPromocional(codigoInput);
 * const ofertasAplicables = await obtenerOfertasAplicables(items);
 * 
 * // Combinar todos los descuentos
 * const { descuentosTotales, subtotalConDescuentos } = combinarDescuentos(
 *   { subtotal },
 *   { 
 *     codigo: codigoPromocional?.valido ? codigoPromocional.codigo : undefined,
 *     ofertas: ofertasAplicables
 *   }
 * );
 * 
 * // Calcular totales finales
 * const impuestos = calcularImpuestos(subtotalConDescuentos);
 * const gastosEnvio = calcularGastosEnvio(items);
 * const total = calcularTotal(subtotalConDescuentos, impuestos, gastosEnvio, 0);
 * ```
 * 
 * Uso en CheckoutManager.tsx:
 * ```tsx
 * const calcularTotales = () => {
 *   const subtotal = calcularSubtotalCarrito(carritoItems);
 *   
 *   const { descuentosTotales, subtotalConDescuentos } = combinarDescuentos(
 *     { subtotal },
 *     {
 *       codigo: codigoPromocionalAplicado,
 *       ofertas: ofertasEspecialesAplicadas
 *     }
 *   );
 *   
 *   setDescuentos(descuentosTotales);
 *   setSubtotalConDescuentos(subtotalConDescuentos);
 * };
 * ```
 * 
 * Nota: El orden de aplicación de descuentos puede afectar el resultado final.
 * Esta implementación aplica primero las ofertas especiales (sobre items específicos)
 * y luego el código promocional (sobre el subtotal resultante).
 * 
 * IMPORTANTE: Para aplicar ofertas especiales correctamente, se recomienda usar
 * `aplicarOfertaEspecial` directamente sobre los items del carrito antes de llamar
 * a esta función. Esta función calcula descuentos de ofertas de forma simplificada
 * basándose solo en el subtotal.
 * 
 * Para casos más complejos, puede ser necesario definir un orden de prioridad
 * o reglas de combinación específicas.
 */
export function combinarDescuentos(
  base: { subtotal: number },
  entrada: { codigo?: CodigoPromocional; ofertas?: OfertaEspecial[] }
): { descuentosTotales: number; subtotalConDescuentos: number } {
  let subtotalActual = base.subtotal;
  let descuentosTotales = 0;

  // Si hay ofertas especiales, aplicarlas primero
  // Nota: Esta es una implementación simplificada que calcula descuentos basándose
  // solo en el subtotal. Para una implementación completa, se recomienda:
  // 1. Aplicar ofertas usando aplicarOfertaEspecial(items, oferta) sobre cada oferta
  // 2. Recalcular el subtotal con los items actualizados
  // 3. Luego aplicar el código promocional sobre el nuevo subtotal
  if (entrada.ofertas && entrada.ofertas.length > 0) {
    // Simplificado: calculamos descuento estimado de ofertas
    // Asumimos que las ofertas aplican a una porción del subtotal
    // En producción, usa aplicarOfertaEspecial con los items reales del carrito
    entrada.ofertas.forEach(oferta => {
      if (oferta.activa) {
        const ahora = new Date();
        // Validar fechas
        if (ahora >= oferta.fechaInicio && ahora <= oferta.fechaFin) {
          const reglas = oferta.reglasDescuento as any;
          if (reglas?.tipo === 'porcentaje' && reglas.valor) {
            // Aplicar descuento porcentual sobre una estimación del subtotal afectado
            // (simplificado: asumimos que afecta al 50% del subtotal como estimación)
            const descuentoOferta = (subtotalActual * 0.5 * reglas.valor) / 100;
            descuentosTotales += descuentoOferta;
            subtotalActual -= descuentoOferta;
          } else if (reglas?.tipo === 'fijo' && reglas.valor) {
            // Descuento fijo (no puede exceder el subtotal restante)
            const descuentoOferta = Math.min(reglas.valor, subtotalActual);
            descuentosTotales += descuentoOferta;
            subtotalActual -= descuentoOferta;
          } else if (typeof reglas?.valor === 'number') {
            // Fallback: si solo hay un valor numérico, asumimos porcentaje
            const descuentoOferta = (subtotalActual * 0.5 * reglas.valor) / 100;
            descuentosTotales += descuentoOferta;
            subtotalActual -= descuentoOferta;
          }
        }
      }
    });
  }

  // Aplicar código promocional sobre el subtotal después de ofertas
  if (entrada.codigo) {
    const resultadoCodigo = aplicarCodigoPromocional(subtotalActual, entrada.codigo);
    descuentosTotales += resultadoCodigo.descuento;
    subtotalActual = resultadoCodigo.subtotalConDescuento;
  }

  // Asegurar que los valores no sean negativos
  descuentosTotales = Math.max(0, descuentosTotales);
  subtotalConDescuentos = Math.max(0, subtotalActual);

  return {
    descuentosTotales,
    subtotalConDescuentos,
  };
}

