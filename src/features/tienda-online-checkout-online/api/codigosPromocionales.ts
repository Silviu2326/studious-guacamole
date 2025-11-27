import { CodigoPromocional, ItemCarrito, ValidacionCodigoPromocional, Carrito } from '../types';

// Mock storage (en producción sería una base de datos)
let codigosPromocionales: CodigoPromocional[] = [];
// Tracking interno de usos (no está en el tipo pero es necesario para validación)
let usosCodigos: Map<string, { clienteEmail?: string; fecha: Date }[]> = new Map();
let contadorUsos: Map<string, number> = new Map();

/**
 * Interfaz de compatibilidad para componentes existentes
 */
export interface CrearCodigoPromocionalRequest {
  codigo: string;
  descripcion?: string;
  tipoDescuento: 'porcentual' | 'fijo' | 'porcentaje' | 'importe_fijo';
  valorDescuento: number;
  fechaInicio?: Date;
  fechaFin?: Date;
  vecesMaximas?: number;
  vecesMaximasPorCliente?: number;
  minimoCompra?: number;
  productosAplicables?: string[];
  categoriasAplicables?: string[];
  entrenadorId?: string;
  validoDesdeOpcional?: Date;
  validoHastaOpcional?: Date;
  maxUsosTotalesOpcional?: number;
  maxUsosPorClienteOpcional?: number;
  minimoCompraOpcional?: number;
  soloProductosIdsOpcionales?: string[];
  soloCategoriasIdsOpcionales?: string[];
  soloPrimerPedidoOpcional?: boolean;
  activo?: boolean;
}

/**
 * Obtiene todos los códigos promocionales
 */
export async function getCodigosPromocionales(entrenadorId?: string): Promise<CodigoPromocional[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  // Por ahora no filtramos por entrenadorId ya que no está en el tipo
  // En producción esto se haría en la base de datos
  return [...codigosPromocionales];
}

/**
 * Alias para compatibilidad con componentes existentes
 */
export const actualizarCodigoPromocional = updateCodigoPromocional;

/**
 * Crea un nuevo código promocional
 * Soporta tanto el formato nuevo (Omit<CodigoPromocional, 'id'>) como el formato antiguo (CrearCodigoPromocionalRequest)
 */
export async function crearCodigoPromocional(
  data: Omit<CodigoPromocional, 'id'> | CrearCodigoPromocionalRequest
): Promise<CodigoPromocional> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Convertir formato antiguo a nuevo si es necesario
  let codigoData: Omit<CodigoPromocional, 'id'>;
  
  if ('fechaInicio' in data || 'vecesMaximas' in data || 'tipoDescuento' in data && (data.tipoDescuento === 'porcentual' || data.tipoDescuento === 'fijo')) {
    // Formato antiguo - convertir
    const oldData = data as CrearCodigoPromocionalRequest;
    const tipoDescuento = oldData.tipoDescuento === 'porcentual' ? 'porcentaje' : 
                         oldData.tipoDescuento === 'fijo' ? 'importe_fijo' : 
                         oldData.tipoDescuento;
    
    codigoData = {
      codigo: oldData.codigo,
      tipoDescuento: tipoDescuento as 'porcentaje' | 'importe_fijo',
      valorDescuento: oldData.valorDescuento,
      minimoCompraOpcional: oldData.minimoCompra ?? oldData.minimoCompraOpcional,
      maxUsosTotalesOpcional: oldData.vecesMaximas ?? oldData.maxUsosTotalesOpcional,
      maxUsosPorClienteOpcional: oldData.vecesMaximasPorCliente ?? oldData.maxUsosPorClienteOpcional,
      validoDesdeOpcional: oldData.fechaInicio ?? oldData.validoDesdeOpcional,
      validoHastaOpcional: oldData.fechaFin ?? oldData.validoHastaOpcional,
      soloProductosIdsOpcionales: oldData.productosAplicables ?? oldData.soloProductosIdsOpcionales,
      soloCategoriasIdsOpcionales: oldData.categoriasAplicables ?? oldData.soloCategoriasIdsOpcionales,
      soloPrimerPedidoOpcional: oldData.soloPrimerPedidoOpcional,
      activo: oldData.activo ?? true,
    };
  } else {
    // Formato nuevo - usar directamente
    codigoData = data as Omit<CodigoPromocional, 'id'>;
  }

  // Validar que el código no exista
  const codigoExistente = codigosPromocionales.find(
    (c) => c.codigo.toUpperCase() === codigoData.codigo.toUpperCase()
  );

  if (codigoExistente) {
    throw new Error('Ya existe un código promocional con ese código');
  }

  // Validar fechas si están presentes
  if (codigoData.validoDesdeOpcional && codigoData.validoHastaOpcional) {
    if (codigoData.validoHastaOpcional <= codigoData.validoDesdeOpcional) {
      throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
    }
  }

  // Validar valor de descuento
  if (codigoData.tipoDescuento === 'porcentaje' && (codigoData.valorDescuento < 0 || codigoData.valorDescuento > 100)) {
    throw new Error('El descuento porcentual debe estar entre 0 y 100');
  }

  if (codigoData.tipoDescuento === 'importe_fijo' && codigoData.valorDescuento < 0) {
    throw new Error('El descuento fijo debe ser mayor o igual a 0');
  }

  const nuevoCodigo: CodigoPromocional = {
    id: `COD-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    ...codigoData,
    codigo: codigoData.codigo.toUpperCase(),
  };

  codigosPromocionales.push(nuevoCodigo);
  contadorUsos.set(nuevoCodigo.id, 0);
  usosCodigos.set(nuevoCodigo.id, []);

  return nuevoCodigo;
}

/**
 * Actualiza un código promocional existente
 * Soporta tanto el formato nuevo (Partial<CodigoPromocional>) como el formato antiguo
 */
export async function updateCodigoPromocional(
  id: string,
  data: Partial<CodigoPromocional> | Partial<CrearCodigoPromocionalRequest>
): Promise<CodigoPromocional> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const indice = codigosPromocionales.findIndex((c) => c.id === id);
  if (indice === -1) {
    throw new Error('Código promocional no encontrado');
  }

  // Convertir formato antiguo a nuevo si es necesario
  let updateData: Partial<CodigoPromocional>;
  
  if ('fechaInicio' in data || 'vecesMaximas' in data || ('tipoDescuento' in data && data.tipoDescuento && (data.tipoDescuento === 'porcentual' || data.tipoDescuento === 'fijo'))) {
    // Formato antiguo - convertir
    const oldData = data as Partial<CrearCodigoPromocionalRequest>;
    updateData = {};
    
    if (oldData.codigo !== undefined) updateData.codigo = oldData.codigo;
    if (oldData.tipoDescuento !== undefined) {
      updateData.tipoDescuento = oldData.tipoDescuento === 'porcentual' ? 'porcentaje' : 
                                 oldData.tipoDescuento === 'fijo' ? 'importe_fijo' : 
                                 oldData.tipoDescuento as 'porcentaje' | 'importe_fijo';
    }
    if (oldData.valorDescuento !== undefined) updateData.valorDescuento = oldData.valorDescuento;
    if (oldData.minimoCompra !== undefined) updateData.minimoCompraOpcional = oldData.minimoCompra;
    if (oldData.minimoCompraOpcional !== undefined) updateData.minimoCompraOpcional = oldData.minimoCompraOpcional;
    if (oldData.vecesMaximas !== undefined) updateData.maxUsosTotalesOpcional = oldData.vecesMaximas;
    if (oldData.maxUsosTotalesOpcional !== undefined) updateData.maxUsosTotalesOpcional = oldData.maxUsosTotalesOpcional;
    if (oldData.vecesMaximasPorCliente !== undefined) updateData.maxUsosPorClienteOpcional = oldData.vecesMaximasPorCliente;
    if (oldData.maxUsosPorClienteOpcional !== undefined) updateData.maxUsosPorClienteOpcional = oldData.maxUsosPorClienteOpcional;
    if (oldData.fechaInicio !== undefined) updateData.validoDesdeOpcional = oldData.fechaInicio;
    if (oldData.validoDesdeOpcional !== undefined) updateData.validoDesdeOpcional = oldData.validoDesdeOpcional;
    if (oldData.fechaFin !== undefined) updateData.validoHastaOpcional = oldData.fechaFin;
    if (oldData.validoHastaOpcional !== undefined) updateData.validoHastaOpcional = oldData.validoHastaOpcional;
    if (oldData.productosAplicables !== undefined) updateData.soloProductosIdsOpcionales = oldData.productosAplicables;
    if (oldData.soloProductosIdsOpcionales !== undefined) updateData.soloProductosIdsOpcionales = oldData.soloProductosIdsOpcionales;
    if (oldData.categoriasAplicables !== undefined) updateData.soloCategoriasIdsOpcionales = oldData.categoriasAplicables;
    if (oldData.soloCategoriasIdsOpcionales !== undefined) updateData.soloCategoriasIdsOpcionales = oldData.soloCategoriasIdsOpcionales;
    if (oldData.soloPrimerPedidoOpcional !== undefined) updateData.soloPrimerPedidoOpcional = oldData.soloPrimerPedidoOpcional;
    if (oldData.activo !== undefined) updateData.activo = oldData.activo;
  } else {
    // Formato nuevo - usar directamente
    updateData = data as Partial<CodigoPromocional>;
  }

  // Validar que el código no esté duplicado si se está cambiando
  if (updateData.codigo) {
    const codigoExistente = codigosPromocionales.find(
      (c) => c.id !== id && c.codigo.toUpperCase() === updateData.codigo!.toUpperCase()
    );
    if (codigoExistente) {
      throw new Error('Ya existe otro código promocional con ese código');
    }
  }

  // Validar fechas si están presentes
  const codigoActual = codigosPromocionales[indice];
  const validoDesde = updateData.validoDesdeOpcional ?? codigoActual.validoDesdeOpcional;
  const validoHasta = updateData.validoHastaOpcional ?? codigoActual.validoHastaOpcional;
  
  if (validoDesde && validoHasta && validoHasta <= validoDesde) {
    throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
  }

  // Validar valor de descuento si se está cambiando
  if (updateData.tipoDescuento || updateData.valorDescuento !== undefined) {
    const tipoDescuento = updateData.tipoDescuento ?? codigoActual.tipoDescuento;
    const valorDescuento = updateData.valorDescuento ?? codigoActual.valorDescuento;
    
    if (tipoDescuento === 'porcentaje' && (valorDescuento < 0 || valorDescuento > 100)) {
      throw new Error('El descuento porcentual debe estar entre 0 y 100');
    }
    
    if (tipoDescuento === 'importe_fijo' && valorDescuento < 0) {
      throw new Error('El descuento fijo debe ser mayor o igual a 0');
    }
  }

  codigosPromocionales[indice] = {
    ...codigosPromocionales[indice],
    ...updateData,
    codigo: updateData.codigo ? updateData.codigo.toUpperCase() : codigosPromocionales[indice].codigo,
  };

  return codigosPromocionales[indice];
}

/**
 * Valida un código promocional para un carrito específico
 */
export async function validarCodigoParaCarrito(
  codigo: string,
  items: ItemCarrito[]
): Promise<CodigoPromocional | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const codigoEncontrado = codigosPromocionales.find(
    (c) => c.codigo.toUpperCase() === codigo.toUpperCase()
  );

  if (!codigoEncontrado) {
    return null;
  }

  // Verificar si está activo
  if (!codigoEncontrado.activo) {
    return null;
  }

  // Verificar fechas de validez
  const ahora = new Date();
  if (codigoEncontrado.validoDesdeOpcional && ahora < codigoEncontrado.validoDesdeOpcional) {
    return null;
  }

  if (codigoEncontrado.validoHastaOpcional && ahora > codigoEncontrado.validoHastaOpcional) {
    return null;
  }

  // Verificar límite de usos totales
  if (codigoEncontrado.maxUsosTotalesOpcional) {
    const usosActuales = contadorUsos.get(codigoEncontrado.id) || 0;
    if (usosActuales >= codigoEncontrado.maxUsosTotalesOpcional) {
      return null;
    }
  }

  // Verificar monto mínimo de compra
  if (codigoEncontrado.minimoCompraOpcional) {
    const subtotal = items.reduce((sum, item) => sum + item.importeSubtotal, 0);
    if (subtotal < codigoEncontrado.minimoCompraOpcional) {
      return null;
    }
  }

  // Verificar productos aplicables
  if (codigoEncontrado.soloProductosIdsOpcionales && codigoEncontrado.soloProductosIdsOpcionales.length > 0) {
    const productosIdsEnCarrito = items.map((item) => item.productoId);
    const tieneProductoAplicable = codigoEncontrado.soloProductosIdsOpcionales.some((id) =>
      productosIdsEnCarrito.includes(id)
    );

    if (!tieneProductoAplicable) {
      return null;
    }
  }

  return codigoEncontrado;
}

/**
 * Obtiene un código promocional por ID
 */
export async function getCodigoPromocional(id: string): Promise<CodigoPromocional | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return codigosPromocionales.find((c) => c.id === id) || null;
}

/**
 * Aplica un código promocional y calcula el descuento
 */
export async function aplicarCodigoPromocional(
  codigo: CodigoPromocional,
  subtotal: number
): Promise<number> {
  // Calcular el descuento
  let descuento = 0;

  if (codigo.tipoDescuento === 'porcentaje') {
    descuento = (subtotal * codigo.valorDescuento) / 100;
  } else {
    // Descuento fijo (importe_fijo)
    descuento = codigo.valorDescuento;
    // No permitir que el descuento sea mayor que el subtotal
    if (descuento > subtotal) {
      descuento = subtotal;
    }
  }

  return Math.max(0, descuento);
}

/**
 * Registra el uso de un código promocional
 */
export async function registrarUsoCodigo(
  codigoId: string,
  clienteEmail?: string
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const codigo = codigosPromocionales.find((c) => c.id === codigoId);
  if (codigo) {
    // Incrementar contador de usos
    const usosActuales = contadorUsos.get(codigoId) || 0;
    contadorUsos.set(codigoId, usosActuales + 1);

    // Registrar uso por cliente si se proporciona email
    if (clienteEmail) {
      if (!usosCodigos.has(codigoId)) {
        usosCodigos.set(codigoId, []);
      }
      usosCodigos.get(codigoId)!.push({
        clienteEmail,
        fecha: new Date(),
      });
    }
  }
}

/**
 * Elimina un código promocional
 */
export async function eliminarCodigoPromocional(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const indice = codigosPromocionales.findIndex((c) => c.id === id);
  if (indice === -1) {
    throw new Error('Código promocional no encontrado');
  }

  codigosPromocionales.splice(indice, 1);
  contadorUsos.delete(id);
  usosCodigos.delete(id);
}

/**
 * Valida un código promocional con un carrito completo (compatibilidad con componentes existentes)
 */
export async function validarCodigoPromocional(
  codigo: string,
  carrito: Carrito,
  clienteEmail?: string
): Promise<ValidacionCodigoPromocional> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Convertir Carrito.items a ItemCarrito[] para usar la función principal
  const items: ItemCarrito[] = carrito.items.map((item) => ({
    id: item.producto.id,
    productoId: item.producto.id,
    nombreProducto: item.producto.nombre,
    cantidad: item.cantidad,
    precioUnitario: item.producto.precio,
    importeSubtotal: item.subtotal,
  }));

  const codigoValidado = await validarCodigoParaCarrito(codigo, items);

  if (!codigoValidado) {
    return {
      valido: false,
      error: 'Código promocional no válido o no aplicable',
    };
  }

  // Verificar límite de usos por cliente si se proporciona email
  if (clienteEmail && codigoValidado.maxUsosPorClienteOpcional) {
    const usosCliente = usosCodigos.get(codigoValidado.id)?.filter(
      (u) => u.clienteEmail?.toLowerCase() === clienteEmail.toLowerCase()
    ) || [];

    if (usosCliente.length >= codigoValidado.maxUsosPorClienteOpcional) {
      return {
        valido: false,
        error: 'Has alcanzado el límite de usos para este código promocional',
      };
    }
  }

  // Verificar monto mínimo de compra
  if (codigoValidado.minimoCompraOpcional && carrito.subtotal < codigoValidado.minimoCompraOpcional) {
    return {
      valido: false,
      error: `El monto mínimo de compra es €${codigoValidado.minimoCompraOpcional.toFixed(2)}`,
    };
  }

  return {
    valido: true,
    codigo: codigoValidado,
  };
}

