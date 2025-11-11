import { CodigoPromocional, ValidacionCodigoPromocional, Carrito } from '../types';

// Mock storage (en producción sería una base de datos)
let codigosPromocionales: CodigoPromocional[] = [];
let usosCodigos: Map<string, { clienteEmail: string; fecha: Date }[]> = new Map();

export interface CrearCodigoPromocionalRequest {
  codigo: string;
  descripcion: string;
  tipoDescuento: 'porcentual' | 'fijo';
  valorDescuento: number;
  fechaInicio: Date;
  fechaFin: Date;
  vecesMaximas?: number;
  vecesMaximasPorCliente?: number;
  minimoCompra?: number;
  productosAplicables?: string[];
  categoriasAplicables?: string[];
  entrenadorId?: string;
}

export async function crearCodigoPromocional(
  request: CrearCodigoPromocionalRequest
): Promise<CodigoPromocional> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Validar que el código no exista
  const codigoExistente = codigosPromocionales.find(
    (c) => c.codigo.toUpperCase() === request.codigo.toUpperCase()
  );

  if (codigoExistente) {
    throw new Error('Ya existe un código promocional con ese nombre');
  }

  // Validar fechas
  if (request.fechaFin <= request.fechaInicio) {
    throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
  }

  // Validar valor de descuento
  if (request.tipoDescuento === 'porcentual' && (request.valorDescuento < 0 || request.valorDescuento > 100)) {
    throw new Error('El descuento porcentual debe estar entre 0 y 100');
  }

  if (request.tipoDescuento === 'fijo' && request.valorDescuento < 0) {
    throw new Error('El descuento fijo debe ser mayor o igual a 0');
  }

  const nuevoCodigo: CodigoPromocional = {
    id: `COD-${Date.now()}`,
    codigo: request.codigo.toUpperCase(),
    descripcion: request.descripcion,
    tipoDescuento: request.tipoDescuento,
    valorDescuento: request.valorDescuento,
    fechaInicio: request.fechaInicio,
    fechaFin: request.fechaFin,
    activo: true,
    vecesUsado: 0,
    vecesMaximas: request.vecesMaximas,
    vecesMaximasPorCliente: request.vecesMaximasPorCliente,
    minimoCompra: request.minimoCompra,
    productosAplicables: request.productosAplicables,
    categoriasAplicables: request.categoriasAplicables,
    entrenadorId: request.entrenadorId,
    fechaCreacion: new Date(),
  };

  codigosPromocionales.push(nuevoCodigo);
  return nuevoCodigo;
}

export async function getCodigosPromocionales(
  entrenadorId?: string
): Promise<CodigoPromocional[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  let codigos = [...codigosPromocionales];

  // Filtrar por entrenador si se especifica
  if (entrenadorId) {
    codigos = codigos.filter((c) => c.entrenadorId === entrenadorId || !c.entrenadorId);
  }

  // Ordenar por fecha de creación (más recientes primero)
  return codigos.sort((a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime());
}

export async function getCodigoPromocional(id: string): Promise<CodigoPromocional | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return codigosPromocionales.find((c) => c.id === id) || null;
}

export async function validarCodigoPromocional(
  codigo: string,
  carrito: Carrito,
  clienteEmail?: string
): Promise<ValidacionCodigoPromocional> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const codigoEncontrado = codigosPromocionales.find(
    (c) => c.codigo.toUpperCase() === codigo.toUpperCase()
  );

  if (!codigoEncontrado) {
    return {
      valido: false,
      error: 'Código promocional no encontrado',
    };
  }

  // Verificar si está activo
  if (!codigoEncontrado.activo) {
    return {
      valido: false,
      error: 'Este código promocional no está activo',
    };
  }

  // Verificar fechas
  const ahora = new Date();
  if (ahora < codigoEncontrado.fechaInicio) {
    return {
      valido: false,
      error: 'Este código promocional aún no está vigente',
    };
  }

  if (ahora > codigoEncontrado.fechaFin) {
    return {
      valido: false,
      error: 'Este código promocional ha expirado',
    };
  }

  // Verificar límite de usos totales
  if (codigoEncontrado.vecesMaximas && codigoEncontrado.vecesUsado >= codigoEncontrado.vecesMaximas) {
    return {
      valido: false,
      error: 'Este código promocional ha alcanzado su límite de usos',
    };
  }

  // Verificar límite de usos por cliente
  if (clienteEmail && codigoEncontrado.vecesMaximasPorCliente) {
    const usosCliente = usosCodigos.get(codigoEncontrado.id)?.filter(
      (u) => u.clienteEmail.toLowerCase() === clienteEmail.toLowerCase()
    ) || [];

    if (usosCliente.length >= codigoEncontrado.vecesMaximasPorCliente) {
      return {
        valido: false,
        error: 'Has alcanzado el límite de usos para este código promocional',
      };
    }
  }

  // Verificar monto mínimo de compra
  if (codigoEncontrado.minimoCompra && carrito.subtotal < codigoEncontrado.minimoCompra) {
    return {
      valido: false,
      error: `El monto mínimo de compra es €${codigoEncontrado.minimoCompra.toFixed(2)}`,
    };
  }

  // Verificar productos aplicables
  if (codigoEncontrado.productosAplicables && codigoEncontrado.productosAplicables.length > 0) {
    const productosEnCarrito = carrito.items.map((item) => item.producto.id);
    const tieneProductoAplicable = codigoEncontrado.productosAplicables.some((id) =>
      productosEnCarrito.includes(id)
    );

    if (!tieneProductoAplicable) {
      return {
        valido: false,
        error: 'Este código no es aplicable a los productos en tu carrito',
      };
    }
  }

  // Verificar categorías aplicables
  if (codigoEncontrado.categoriasAplicables && codigoEncontrado.categoriasAplicables.length > 0) {
    const categoriasEnCarrito = carrito.items.map((item) => item.producto.categoria);
    const tieneCategoriaAplicable = codigoEncontrado.categoriasAplicables.some((cat) =>
      categoriasEnCarrito.includes(cat)
    );

    if (!tieneCategoriaAplicable) {
      return {
        valido: false,
        error: 'Este código no es aplicable a las categorías en tu carrito',
      };
    }
  }

  return {
    valido: true,
    codigo: codigoEncontrado,
  };
}

export async function aplicarCodigoPromocional(
  codigo: CodigoPromocional,
  subtotal: number
): Promise<number> {
  // Calcular el descuento
  let descuento = 0;

  if (codigo.tipoDescuento === 'porcentual') {
    descuento = (subtotal * codigo.valorDescuento) / 100;
  } else {
    // Descuento fijo
    descuento = codigo.valorDescuento;
    // No permitir que el descuento sea mayor que el subtotal
    if (descuento > subtotal) {
      descuento = subtotal;
    }
  }

  return Math.max(0, descuento);
}

export async function registrarUsoCodigo(
  codigoId: string,
  clienteEmail: string
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const codigo = codigosPromocionales.find((c) => c.id === codigoId);
  if (codigo) {
    codigo.vecesUsado += 1;

    // Registrar uso por cliente
    if (!usosCodigos.has(codigoId)) {
      usosCodigos.set(codigoId, []);
    }
    usosCodigos.get(codigoId)!.push({
      clienteEmail,
      fecha: new Date(),
    });
  }
}

export async function actualizarCodigoPromocional(
  id: string,
  actualizaciones: Partial<CodigoPromocional>
): Promise<CodigoPromocional> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const indice = codigosPromocionales.findIndex((c) => c.id === id);
  if (indice === -1) {
    throw new Error('Código promocional no encontrado');
  }

  codigosPromocionales[indice] = {
    ...codigosPromocionales[indice],
    ...actualizaciones,
  };

  return codigosPromocionales[indice];
}

export async function eliminarCodigoPromocional(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const indice = codigosPromocionales.findIndex((c) => c.id === id);
  if (indice === -1) {
    throw new Error('Código promocional no encontrado');
  }

  codigosPromocionales.splice(indice, 1);
}

