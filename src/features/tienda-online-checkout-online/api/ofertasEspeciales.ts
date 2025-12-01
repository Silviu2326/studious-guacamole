import { Venta, OfertaEspecial, Producto } from '../types';
import { getVentas } from './ventas';
import { getClients } from '../../gestión-de-clientes/api/clients';

// ============================================================================
// GESTIÓN DE OFERTAS ESPECIALES (OfertaEspecial)
// ============================================================================

// Mock storage (en producción sería una base de datos)
let ofertasEspeciales: OfertaEspecial[] = [];

/**
 * Obtiene todas las ofertas especiales
 */
export async function getOfertasEspeciales(): Promise<OfertaEspecial[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return [...ofertasEspeciales];
}

/**
 * Crea una nueva oferta especial
 */
export async function crearOfertaEspecial(
  data: Omit<OfertaEspecial, 'id'>
): Promise<OfertaEspecial> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Validar fechas
  if (data.fechaFin <= data.fechaInicio) {
    throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
  }

  // Validar que haya al menos un producto
  if (!data.productosIds || data.productosIds.length === 0) {
    throw new Error('Debe especificar al menos un producto para la oferta');
  }

  const nuevaOferta: OfertaEspecial = {
    id: `OFE-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    ...data,
  };

  ofertasEspeciales.push(nuevaOferta);
  return nuevaOferta;
}

/**
 * Actualiza una oferta especial existente
 */
export async function updateOfertaEspecial(
  id: string,
  data: Partial<OfertaEspecial>
): Promise<OfertaEspecial> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const indice = ofertasEspeciales.findIndex((o) => o.id === id);
  if (indice === -1) {
    throw new Error('Oferta especial no encontrada');
  }

  // Validar fechas si están presentes
  const ofertaActual = ofertasEspeciales[indice];
  const fechaInicio = data.fechaInicio ?? ofertaActual.fechaInicio;
  const fechaFin = data.fechaFin ?? ofertaActual.fechaFin;

  if (fechaFin <= fechaInicio) {
    throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
  }

  // Validar productos si se está cambiando
  if (data.productosIds !== undefined) {
    if (!data.productosIds || data.productosIds.length === 0) {
      throw new Error('Debe especificar al menos un producto para la oferta');
    }
  }

  ofertasEspeciales[indice] = {
    ...ofertasEspeciales[indice],
    ...data,
  };

  return ofertasEspeciales[indice];
}

/**
 * Obtiene las ofertas especiales activas para los productos especificados
 */
export async function getOfertasActivasParaProductos(
  productosIds: string[]
): Promise<OfertaEspecial[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const ahora = new Date();

  return ofertasEspeciales.filter((oferta) => {
    // Debe estar activa
    if (!oferta.activa) {
      return false;
    }

    // Debe estar dentro del rango de fechas
    if (ahora < oferta.fechaInicio || ahora > oferta.fechaFin) {
      return false;
    }

    // Debe aplicar a al menos uno de los productos solicitados
    const tieneProductoAplicable = oferta.productosIds.some((id) =>
      productosIds.includes(id)
    );

    return tieneProductoAplicable;
  });
}

// ============================================================================
// GESTIÓN DE OFERTAS ESPECIALES AUTOMÁTICAS (Cliente Reactivation)
// ============================================================================

/**
 * Tipo de canal de comunicación para ofertas
 */
export type CanalOferta = 'email' | 'sms' | 'whatsapp' | 'todos';

/**
 * Configuración de ofertas especiales automáticas
 */
export interface ConfiguracionOfertasEspeciales {
  activo: boolean;
  diasInactividad: number; // Días sin comprar para considerar cliente inactivo (ej: 60 días = 2 meses)
  frecuenciaVerificacion: 'diario' | 'semanal'; // Frecuencia de verificación
  canal: CanalOferta;
  descuentoPorDefecto: number; // Porcentaje de descuento por defecto (ej: 20)
  productosExcluidos?: string[]; // IDs de productos excluidos de las ofertas
  categoriasIncluidas?: string[]; // Categorías de productos a incluir en ofertas
  limiteOfertasPorCliente?: number; // Límite de ofertas enviadas por cliente (opcional)
  diasEntreOfertas?: number; // Días mínimos entre ofertas al mismo cliente
}

/**
 * Información de oferta especial enviada
 */
export interface OfertaEspecialEnviada {
  id: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  productoId?: string;
  productoNombre?: string;
  descuento: number;
  codigoPromocional?: string;
  fechaEnvio: Date;
  canal: CanalOferta;
  mensaje: string;
  estado: 'enviado' | 'entregado' | 'fallido' | 'usado';
  fechaUso?: Date;
  diasInactividad: number;
  ultimaCompra?: Date;
}

/**
 * Cliente inactivo que califica para oferta especial
 */
export interface ClienteInactivo {
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string;
  ultimaCompra: Date;
  diasInactividad: number;
  totalCompras: number;
  totalGastado: number;
  productosComprados: string[]; // IDs de productos comprados anteriormente
}

/**
 * Información de oferta personalizada para un cliente
 */
export interface OfertaPersonalizada {
  producto?: Producto;
  descuento: number;
  codigoPromocional?: string;
  mensaje: string;
  motivo: string;
}

/**
 * Configuración por defecto de ofertas especiales
 */
export const crearConfiguracionOfertasPorDefecto = (): ConfiguracionOfertasEspeciales => {
  return {
    activo: true,
    diasInactividad: 60, // 2 meses
    frecuenciaVerificacion: 'diario',
    canal: 'email',
    descuentoPorDefecto: 20, // 20% de descuento
    productosExcluidos: [],
    categoriasIncluidas: [],
    limiteOfertasPorCliente: undefined, // Sin límite
    diasEntreOfertas: 30, // Mínimo 30 días entre ofertas
  };
};

/**
 * Obtiene clientes inactivos que califican para ofertas especiales
 */
export async function obtenerClientesInactivos(
  entrenadorId?: string,
  configuracion?: ConfiguracionOfertasEspeciales
): Promise<ClienteInactivo[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const config = configuracion || crearConfiguracionOfertasPorDefecto();

  if (!config.activo) {
    return [];
  }

  // Obtener todas las ventas
  const ventas = await getVentas('entrenador');
  
  // Obtener información de clientes
  const clientes = await getClients('entrenador', entrenadorId);
  
  const ahora = new Date();
  const diasInactividadMs = config.diasInactividad * 24 * 60 * 60 * 1000;
  const clientesInactivos: ClienteInactivo[] = [];

  // Agrupar ventas por cliente
  const ventasPorCliente = new Map<string, Venta[]>();
  ventas.forEach((venta) => {
    const email = venta.cliente.email.toLowerCase();
    if (!ventasPorCliente.has(email)) {
      ventasPorCliente.set(email, []);
    }
    ventasPorCliente.get(email)!.push(venta);
  });

  // Procesar cada cliente
  for (const cliente of clientes) {
    const email = cliente.email.toLowerCase();
    const ventasCliente = ventasPorCliente.get(email) || [];
    
    if (ventasCliente.length === 0) {
      // Cliente sin compras - no se incluye en ofertas de reactivación
      continue;
    }

    // Ordenar ventas por fecha (más reciente primero)
    ventasCliente.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
    const ultimaVenta = ventasCliente[0];
    
    // Calcular días de inactividad
    const diasInactividad = Math.floor((ahora.getTime() - ultimaVenta.fecha.getTime()) / (1000 * 60 * 60 * 24));
    
    // Verificar si cumple el criterio de inactividad
    if (diasInactividad >= config.diasInactividad) {
      // Calcular total gastado y productos comprados
      const totalGastado = ventasCliente.reduce((sum, v) => sum + v.total, 0);
      const productosComprados = new Set<string>();
      ventasCliente.forEach((v) => {
        v.productos.forEach((p) => {
          productosComprados.add(p.producto.id);
        });
      });

      clientesInactivos.push({
        clienteId: cliente.id,
        clienteNombre: cliente.name,
        clienteEmail: cliente.email,
        clienteTelefono: cliente.phone,
        ultimaCompra: ultimaVenta.fecha,
        diasInactividad,
        totalCompras: ventasCliente.length,
        totalGastado,
        productosComprados: Array.from(productosComprados),
      });
    }
  }

  return clientesInactivos;
}

/**
 * Genera oferta personalizada para un cliente inactivo
 */
export async function generarOfertaPersonalizada(
  cliente: ClienteInactivo,
  productosDisponibles?: Producto[],
  configuracion?: ConfiguracionOfertasEspeciales
): Promise<OfertaPersonalizada> {
  const config = configuracion || crearConfiguracionOfertasPorDefecto();
  
  // En producción, esto buscaría productos relevantes basados en:
  // - Productos que el cliente compró anteriormente
  // - Productos populares en la categoría
  // - Productos nuevos
  // Por ahora, generamos una oferta genérica
  
  const descuento = config.descuentoPorDefecto;
  const codigoPromocional = `REACTIVA${descuento}-${cliente.clienteId.substring(0, 6).toUpperCase()}`;
  
  let mensaje = `Hola ${cliente.clienteNombre},\n\n`;
  mensaje += `Hace ${cliente.diasInactividad} días que no nos visitas y te echamos de menos. 🏋️‍♀️\n\n`;
  mensaje += `Sabemos que la vida puede ser ajetreada, pero queremos ayudarte a retomar tu rutina de entrenamiento.\n\n`;
  mensaje += `🎁 Por eso, tenemos una oferta especial solo para ti:\n\n`;
  mensaje += `✨ ${descuento}% DE DESCUENTO en tu próxima compra\n\n`;
  mensaje += `Usa el código: ${codigoPromocional}\n\n`;
  mensaje += `Esta oferta es válida por tiempo limitado. No dejes pasar esta oportunidad de reactivar tu entrenamiento.\n\n`;
  mensaje += `Puedes ver nuestros productos y servicios disponibles en nuestra tienda online.\n\n`;
  mensaje += `¡Esperamos verte pronto!\n\n`;
  mensaje += `Saludos,\n`;
  mensaje += `Tu Equipo de Entrenamiento`;

  const motivo = cliente.totalCompras > 5 
    ? 'Cliente fiel inactivo - Oferta de reactivación'
    : 'Cliente inactivo - Oferta de reactivación';

  return {
    descuento,
    codigoPromocional,
    mensaje,
    motivo,
  };
}

/**
 * Envía oferta especial a un cliente inactivo
 */
export async function enviarOfertaEspecial(
  cliente: ClienteInactivo,
  oferta: OfertaPersonalizada,
  canal: CanalOferta
): Promise<OfertaEspecialEnviada> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const ofertaEnviada: OfertaEspecialEnviada = {
    id: `oferta-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    clienteId: cliente.clienteId,
    clienteNombre: cliente.clienteNombre,
    clienteEmail: cliente.clienteEmail,
    productoId: oferta.producto?.id,
    productoNombre: oferta.producto?.nombre,
    descuento: oferta.descuento,
    codigoPromocional: oferta.codigoPromocional,
    fechaEnvio: new Date(),
    canal,
    mensaje: oferta.mensaje,
    estado: 'enviado',
    diasInactividad: cliente.diasInactividad,
    ultimaCompra: cliente.ultimaCompra,
  };

  // Simular envío de notificación
  console.log('[OfertasEspeciales] Enviando oferta especial:', {
    cliente: cliente.clienteNombre,
    clienteEmail: cliente.clienteEmail,
    clienteTelefono: cliente.clienteTelefono,
    descuento: oferta.descuento,
    codigoPromocional: oferta.codigoPromocional,
    canal,
    diasInactividad: cliente.diasInactividad,
    mensaje: oferta.mensaje.substring(0, 100) + '...',
  });

  // En producción, aquí se enviaría el mensaje real por el canal correspondiente
  // Por ejemplo:
  // if (canal === 'email' || canal === 'todos') {
  //   await emailService.send(cliente.clienteEmail, 'Oferta Especial - Reactiva tu Entrenamiento', oferta.mensaje);
  // }
  // if (canal === 'sms' || canal === 'whatsapp' || canal === 'todos') {
  //   await smsService.send(cliente.clienteTelefono, oferta.mensaje);
  // }

  // Simular entrega después de un tiempo
  setTimeout(() => {
    ofertaEnviada.estado = 'entregado';
  }, 1000);

  return ofertaEnviada;
}

/**
 * Verifica si se debe enviar oferta a un cliente (respetando límites y frecuencia)
 */
export async function debeEnviarOferta(
  clienteId: string,
  configuracion?: ConfiguracionOfertasEspeciales
): Promise<boolean> {
  const config = configuracion || crearConfiguracionOfertasPorDefecto();
  
  // En producción, esto verificaría:
  // - Historial de ofertas enviadas al cliente
  // - Si se ha alcanzado el límite de ofertas
  // - Si han pasado los días mínimos entre ofertas
  // - Si el cliente ha usado una oferta reciente
  
  // Por ahora, siempre retornamos true si está activo
  return config.activo;
}

/**
 * Envía ofertas especiales automáticas a clientes inactivos
 */
export async function enviarOfertasEspecialesAutomaticas(
  entrenadorId?: string,
  configuracion?: ConfiguracionOfertasEspeciales,
  productosDisponibles?: Producto[]
): Promise<OfertaEspecialEnviada[]> {
  const config = configuracion || crearConfiguracionOfertasPorDefecto();

  if (!config.activo) {
    return [];
  }

  const clientesInactivos = await obtenerClientesInactivos(entrenadorId, config);
  const ofertasEnviadas: OfertaEspecialEnviada[] = [];

  for (const cliente of clientesInactivos) {
    try {
      // Verificar si se debe enviar oferta
      const puedeEnviar = await debeEnviarOferta(cliente.clienteId, config);
      if (!puedeEnviar) {
        continue;
      }

      // Generar oferta personalizada
      const oferta = await generarOfertaPersonalizada(cliente, productosDisponibles, config);
      
      // Enviar oferta
      const ofertaEnviada = await enviarOfertaEspecial(cliente, oferta, config.canal);
      ofertasEnviadas.push(ofertaEnviada);
    } catch (error) {
      console.error(`Error enviando oferta a ${cliente.clienteNombre}:`, error);
    }
  }

  return ofertasEnviadas;
}

/**
 * Programa la verificación periódica de ofertas especiales
 */
export function iniciarVerificacionOfertasEspeciales(
  entrenadorId?: string,
  configuracion?: ConfiguracionOfertasEspeciales,
  productosDisponibles?: Producto[]
): NodeJS.Timeout {
  const config = configuracion || crearConfiguracionOfertasPorDefecto();
  
  if (!config.activo) {
    return setInterval(() => {}, 24 * 60 * 60 * 1000); // No hacer nada
  }

  const intervalo = config.frecuenciaVerificacion === 'diario' 
    ? 24 * 60 * 60 * 1000 // 24 horas
    : 7 * 24 * 60 * 60 * 1000; // 7 días

  return setInterval(async () => {
    try {
      const ofertas = await enviarOfertasEspecialesAutomaticas(entrenadorId, config, productosDisponibles);
      if (ofertas.length > 0) {
        console.log(`[OfertasEspeciales] Se enviaron ${ofertas.length} ofertas especiales automáticas`);
      }
    } catch (error) {
      console.error('[OfertasEspeciales] Error en verificación periódica:', error);
    }
  }, intervalo);
}

/**
 * Obtiene el historial de ofertas especiales enviadas
 */
export async function obtenerHistorialOfertas(
  entrenadorId?: string,
  clienteId?: string
): Promise<OfertaEspecialEnviada[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  
  // En producción, esto obtendría el historial de la base de datos
  // Por ahora retornamos un array vacío
  console.log('[OfertasEspeciales] Obteniendo historial de ofertas:', {
    entrenadorId,
    clienteId,
  });
  
  return [];
}

/**
 * Marca una oferta como usada cuando el cliente la utiliza
 */
export async function marcarOfertaComoUsada(
  ofertaId: string,
  ventaId: string
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  
  // En producción, esto actualizaría el estado de la oferta en la base de datos
  console.log('[OfertasEspeciales] Marcando oferta como usada:', {
    ofertaId,
    ventaId,
  });
}

