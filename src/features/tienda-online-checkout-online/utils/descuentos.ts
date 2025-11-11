import { Producto, CarritoItem, DescuentoPorCantidad, Carrito, CodigoPromocional } from '../types';
import { calcularPrecioConOpciones } from './precios';
import { aplicarCodigoPromocional } from '../api/codigosPromocionales';

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
  const descuentoCodigo = await aplicarCodigoPromocional(codigoPromocional, carrito.subtotal);

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

