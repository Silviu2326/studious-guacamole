import { Producto, OpcionesSeleccionadas, OpcionValor } from '../types';

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

