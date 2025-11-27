import { DatosCheckout, Carrito, MetodoPago, ItemCarrito, Pedido, EstadoPedido, CodigoPromocional, OfertaEspecial } from '../types';
import { calcularSubtotalCarrito, calcularImpuestos, calcularGastosEnvio, calcularTotal } from '../utils/precios';
import { combinarDescuentos, aplicarOfertaEspecial } from '../utils/descuentos';
import { validarCodigoPromocional } from './codigosPromocionales';

export async function getMetodosPago(): Promise<MetodoPago[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return [
    {
      id: 'tarjeta',
      nombre: 'Tarjeta de Crédito/Débito',
      tipo: 'tarjeta',
      disponible: true,
    },
    {
      id: 'paypal',
      nombre: 'PayPal',
      tipo: 'paypal',
      disponible: true,
    },
    {
      id: 'transferencia',
      nombre: 'Transferencia Bancaria',
      tipo: 'transferencia',
      disponible: true,
    },
  ];
}

export interface CheckoutRequest {
  carrito: Carrito;
  datos: DatosCheckout;
}

export interface CheckoutResponse {
  exito: boolean;
  ventaId?: string;
  facturaId?: string;
  suscripcionId?: string;
  pagoFraccionadoId?: string;
  error?: string;
}

export async function procesarCheckout(
  request: CheckoutRequest
): Promise<CheckoutResponse> {
  // Simular delay de procesamiento
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Validaciones
  if (!request.datos.terminosAceptados) {
    return {
      exito: false,
      error: 'Debes aceptar los términos y condiciones',
    };
  }

  if (!request.datos.email || !request.datos.telefono || !request.datos.nombre) {
    return {
      exito: false,
      error: 'Nombre, email y teléfono son obligatorios',
    };
  }

  // Verificar si hay bonos y si tienen fecha de caducidad
  const contieneBonos = request.carrito.items.some(
    (item) => item.producto.metadatos?.esBono === true
  );

  if (contieneBonos && !request.datos.fechaVencimientoBonos) {
    return {
      exito: false,
      error: 'Debes establecer una fecha de caducidad para los bonos',
    };
  }

  // Verificar si hay suscripciones y validar datos requeridos
  const contieneSuscripciones = request.carrito.items.some(
    (item) => item.producto.metadatos?.suscripcion?.esSuscripcion === true
  );

  if (contieneSuscripciones) {
    if (!request.datos.aceptaCargoRecurrente) {
      return {
        exito: false,
        error: 'Debes aceptar el cargo recurrente automático para suscripciones',
      };
    }

    // Validar que el método de pago soporte cargos recurrentes
    const metodoPago = await getMetodosPago().then((metodos) =>
      metodos.find((m) => m.id === request.datos.metodoPago)
    );

    if (metodoPago?.tipo === 'transferencia') {
      return {
        exito: false,
        error: 'Las suscripciones requieren un método de pago que soporte cargos automáticos (tarjeta o PayPal)',
      };
    }
  }

  // Simular procesamiento exitoso
  const ventaId = `VENTA-${Date.now()}`;
  const facturaId = `FAC-${Date.now()}`;
  let suscripcionId: string | undefined;
  let pagoFraccionadoId: string | undefined;

  // Procesar pago fraccionado si aplica
  if (request.datos.pagoFraccionado) {
    pagoFraccionadoId = `PAGO-FRAC-${Date.now()}`;
    // En producción, aquí se crearían los registros de cuotas pendientes
    console.log('Pago fraccionado configurado:', {
      planId: request.datos.pagoFraccionado.planId,
      numeroCuotas: request.datos.pagoFraccionado.numeroCuotas,
      montoPorCuota: request.datos.pagoFraccionado.montoPorCuota,
      fechasCuotas: request.datos.pagoFraccionado.fechasCuotas,
    });
  }

  // Crear suscripciones si hay productos con suscripción
  if (contieneSuscripciones && request.datos.aceptaCargoRecurrente) {
    try {
      const { crearSuscripcion, calcularFechaProximoCargo } = await import('./suscripciones');
      const { getClients } = await import('../../gestión-de-clientes/api/clients');

      // Buscar o crear cliente por email
      const clientes = await getClients('entrenador');
      let cliente = clientes.find((c) => c.email === request.datos.email);

      // Si no existe el cliente, crear uno temporal (en producción se crearía en la BD)
      if (!cliente) {
        cliente = {
          id: `client-${Date.now()}`,
          name: request.datos.nombre,
          email: request.datos.email,
          phone: request.datos.telefono,
          status: 'activo',
          type: 'socio',
          registrationDate: new Date().toISOString().split('T')[0],
          lastCheckIn: undefined,
          lastSession: undefined,
          planId: undefined,
          planName: undefined,
          adherenceRate: 0,
          riskScore: 0,
        };
      }

      // Crear suscripciones para cada item que sea una suscripción
      for (const item of request.carrito.items) {
        const suscripcionInfo = item.producto.metadatos?.suscripcion;
        if (suscripcionInfo?.esSuscripcion) {
          const fechaInicio = request.datos.fechaInicioSuscripcion || new Date();
          const precioFinal = item.precioBase || item.producto.precio;
          
          // Aplicar precio inicial si existe
          const precioSuscripcion = suscripcionInfo.precioInicial || precioFinal;

          const suscripcion = await crearSuscripcion({
            ventaId,
            productoId: item.producto.id,
            clienteId: cliente.id,
            clienteEmail: request.datos.email,
            fechaInicio,
            fechaProximoCargo: calcularFechaProximoCargo(
              fechaInicio,
              suscripcionInfo.cicloFacturacion
            ),
            cicloFacturacion: suscripcionInfo.cicloFacturacion,
            precio: precioSuscripcion,
            estado: 'activa',
            metodoPagoId: request.datos.metodoPago,
            cargoAutomatico: suscripcionInfo.cargoAutomatico,
          });

          // Guardar el ID de la primera suscripción creada
          if (!suscripcionId) {
            suscripcionId = suscripcion.id;
          }
        }
      }
    } catch (error) {
      console.error('Error creando suscripciones:', error);
      // No fallar el checkout si hay error creando suscripciones, solo loguear
    }
  }

  // Crear bonos si hay productos que son bonos
  if (contieneBonos && request.datos.fechaVencimientoBonos) {
    try {
      const { createBonoFromCheckout } = await import('./bonos');
      const { getClients } = await import('../../gestión-de-clientes/api/clients');

      // Buscar o crear cliente por email
      const clientes = await getClients('entrenador');
      let cliente = clientes.find((c) => c.email === request.datos.email);

      // Si no existe el cliente, crear uno temporal (en producción se crearía en la BD)
      if (!cliente) {
        cliente = {
          id: `client-${Date.now()}`,
          name: request.datos.nombre,
          email: request.datos.email,
          phone: request.datos.telefono,
          status: 'activo',
          type: 'socio',
          registrationDate: new Date().toISOString().split('T')[0],
          lastCheckIn: undefined,
          lastSession: undefined,
          planId: undefined,
          planName: undefined,
          adherenceRate: 0,
          riskScore: 0,
        };
      }

      // Crear bonos para cada item que sea un bono
      for (const item of request.carrito.items) {
        if (item.producto.metadatos?.esBono && item.producto.metadatos?.sesiones) {
          for (let i = 0; i < item.cantidad; i++) {
            await createBonoFromCheckout({
              clienteId: cliente.id,
              clienteNombre: cliente.name,
              clienteEmail: cliente.email,
              productoId: item.producto.id,
              productoNombre: item.producto.nombre,
              sesionesTotal: item.producto.metadatos.sesiones,
              precio: item.producto.precio,
              fechaVencimiento: request.datos.fechaVencimientoBonos!,
              ventaId,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error creando bonos:', error);
      // No fallar el checkout si hay error creando bonos, solo loguear
    }
  }

  // User Story: Programa de Referidos - Registrar referido si hay código
  if (request.datos.codigoReferido) {
    try {
      const { registrarReferido } = await import('./referidos');
      const descuentoAplicado = request.carrito.descuentoReferido || 0;
      
      await registrarReferido(
        request.datos.codigoReferido,
        request.datos.email,
        request.datos.nombre,
        ventaId,
        descuentoAplicado
      );
      
      console.log('Referido registrado exitosamente:', {
        codigo: request.datos.codigoReferido,
        referidoEmail: request.datos.email,
        ventaId,
        descuentoAplicado,
      });
    } catch (error) {
      console.error('Error registrando referido:', error);
      // No fallar el checkout si hay error registrando el referido, solo loguear
    }
  }

  return {
    exito: true,
    ventaId,
    facturaId,
    suscripcionId,
    pagoFraccionadoId,
  };
}

// ============================================================================
// MOCK STORAGE PARA PEDIDOS
// ============================================================================
// En producción, esto sería una base de datos (PostgreSQL, MongoDB, etc.)
let pedidosMock: Pedido[] = [];
let contadorPedidos = 1;

// ============================================================================
// API MOCK DE CHECKOUT Y PEDIDOS
// ============================================================================

/**
 * Crea un pedido desde los items del carrito
 * 
 * Esta función:
 * 1. Convierte los items del carrito en un pedido
 * 2. Calcula todos los importes (productos, impuestos, envío, descuentos, total)
 * 3. Aplica códigos promocionales y ofertas especiales
 * 4. Crea el pedido con estado inicial "pendiente_pago"
 * 
 * @param payload - Datos del pedido a crear
 * @param payload.items - Items del carrito
 * @param payload.emailCliente - Email del cliente
 * @param payload.datosEnvio - Datos de envío opcionales
 * @param payload.metodoPago - Método de pago seleccionado
 * @param payload.codigoPromocionalOpcional - Código promocional opcional
 * @param payload.ofertasAplicadasIdsOpcionales - IDs de ofertas especiales aplicadas
 * @returns Pedido creado
 * 
 * @example
 * ```ts
 * const pedido = await crearPedidoDesdeCarrito({
 *   items: [
 *     { id: '1', productoId: 'prod-1', nombreProducto: 'Producto A', cantidad: 2, precioUnitario: 10, importeSubtotal: 20 }
 *   ],
 *   emailCliente: 'cliente@example.com',
 *   metodoPago: 'tarjeta',
 *   codigoPromocionalOpcional: 'DESCUENTO10'
 * });
 * ```
 */
export async function crearPedidoDesdeCarrito(payload: {
  items: ItemCarrito[];
  emailCliente: string;
  datosEnvio?: any;
  metodoPago: MetodoPago;
  codigoPromocionalOpcional?: string;
  ofertasAplicadasIdsOpcionales?: string[];
}): Promise<Pedido> {
  // Simular delay de procesamiento
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Validaciones básicas
  if (!payload.items || payload.items.length === 0) {
    throw new Error('El carrito no puede estar vacío');
  }

  if (!payload.emailCliente) {
    throw new Error('El email del cliente es obligatorio');
  }

  // ============================================================================
  // CÁLCULO DE PRECIOS Y DESCUENTOS
  // ============================================================================
  // Utilizamos los helpers de precios.ts y descuentos.ts para calcular todos los importes

  // 1. Calcular subtotal de productos (suma de todos los items)
  const importeProductos = calcularSubtotalCarrito(payload.items);

  // 2. Obtener y aplicar código promocional si existe
  let codigoPromocional: CodigoPromocional | undefined;
  if (payload.codigoPromocionalOpcional) {
    try {
      // Crear un carrito temporal para validar el código
      const carritoTemp: Carrito = {
        items: payload.items.map(item => ({
          producto: {
            id: item.productoId,
            nombre: item.nombreProducto,
            precio: item.precioUnitario,
            categoria: '',
            tipo: 'servicio',
            disponible: true,
            rolPermitido: 'entrenador',
          } as any),
          cantidad: item.cantidad,
          subtotal: item.importeSubtotal,
        }),
        subtotal: importeProductos,
        descuentoTotal: 0,
        impuestos: 0,
        total: importeProductos,
      };

      const validacion = await validarCodigoPromocional(
        payload.codigoPromocionalOpcional,
        carritoTemp,
        payload.emailCliente
      );

      if (validacion.valido && validacion.codigo) {
        codigoPromocional = validacion.codigo;
      }
    } catch (error) {
      console.warn('Error validando código promocional:', error);
      // Continuar sin código promocional si hay error
    }
  }

  // 3. Obtener ofertas especiales aplicables
  // NOTA: En producción, aquí se obtendrían las ofertas desde la base de datos
  // Por ahora, simulamos que las ofertas vienen en los IDs proporcionados
  let ofertasAplicables: OfertaEspecial[] = [];
  if (payload.ofertasAplicadasIdsOpcionales && payload.ofertasAplicadasIdsOpcionales.length > 0) {
    // En producción: ofertasAplicables = await getOfertasEspecialesByIds(payload.ofertasAplicadasIdsOpcionales);
    // Por ahora, creamos ofertas mock básicas
    ofertasAplicables = payload.ofertasAplicadasIdsOpcionales.map(id => ({
      id,
      nombre: `Oferta ${id}`,
      tipo: 'tiempo_limitado' as const,
      fechaInicio: new Date(),
      fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      productosIds: payload.items.map(item => item.productoId),
      reglasDescuento: { tipo: 'porcentaje', valor: 10 },
      activa: true,
    }));
  }

  // 4. Aplicar ofertas especiales a los items (si hay)
  let itemsConOfertas = [...payload.items];
  let descuentoOfertas = 0;
  
  for (const oferta of ofertasAplicables) {
    const resultadoOferta = aplicarOfertaEspecial(itemsConOfertas, oferta);
    descuentoOfertas += resultadoOferta.descuento;
    itemsConOfertas = resultadoOferta.itemsActualizados;
  }

  // 5. Recalcular subtotal después de aplicar ofertas
  const subtotalConOfertas = calcularSubtotalCarrito(itemsConOfertas);

  // 6. Combinar descuentos (código promocional + ofertas)
  const { descuentosTotales, subtotalConDescuentos } = combinarDescuentos(
    { subtotal: subtotalConOfertas },
    {
      codigo: codigoPromocional,
      ofertas: ofertasAplicables,
    }
  );

  // 7. Calcular impuestos sobre el subtotal con descuentos aplicados
  const impuestos = calcularImpuestos(subtotalConDescuentos, { tipoIVA: 21 });

  // 8. Calcular gastos de envío
  // NOTA: Para servicios, normalmente no hay gastos de envío
  // En producción, esto dependería del tipo de productos y dirección de envío
  const gastosEnvio = calcularGastosEnvio(itemsConOfertas, {
    envioGratisDesde: 50, // Envío gratis desde 50€
    tarifaBase: 5.00,
  });

  // 9. Calcular total final
  const importeTotal = calcularTotal(
    subtotalConDescuentos,
    impuestos,
    gastosEnvio,
    descuentosTotales
  );

  // ============================================================================
  // CREAR EL PEDIDO
  // ============================================================================
  const ahora = new Date();
  const numeroPedido = `PED-${String(contadorPedidos).padStart(6, '0')}`;
  contadorPedidos++;

  const pedido: Pedido = {
    id: `pedido-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    numeroPedido,
    emailCliente: payload.emailCliente,
    items: itemsConOfertas, // Items con ofertas aplicadas
    importeProductos: subtotalConDescuentos, // Subtotal después de descuentos
    impuestos,
    gastosEnvio,
    descuentosTotales,
    importeTotal,
    moneda: 'EUR',
    estado: 'pendiente_pago' as EstadoPedido,
    metodoPago: payload.metodoPago,
    createdAt: ahora,
    updatedAt: ahora,
    notasOpcionales: payload.datosEnvio ? `Envío a: ${JSON.stringify(payload.datosEnvio)}` : undefined,
  };

  // Guardar pedido en mock storage
  pedidosMock.push(pedido);

  return pedido;
}

/**
 * Procesa el pago de un pedido
 * 
 * Esta función:
 * 1. Simula el procesamiento del pago a través de la pasarela de pago
 * 2. Actualiza el estado del pedido según el resultado
 * 3. Retorna el pedido actualizado y opcionalmente una URL de redirección
 * 
 * NOTA IMPORTANTE: En producción, aquí se integraría la pasarela de pago real:
 * - Stripe: https://stripe.com/docs/payments
 * - Redsys: https://www.redsys.es/
 * - PayPal: https://developer.paypal.com/
 * - Otros proveedores según el método de pago
 * 
 * @param pedidoId - ID del pedido a procesar
 * @returns Pedido actualizado y opcionalmente URL de redirección a la pasarela
 * 
 * @example
 * ```ts
 * const resultado = await procesarPago('pedido-123');
 * if (resultado.redirectUrlPasarelaOpcional) {
 *   // Redirigir al usuario a la pasarela de pago
 *   window.location.href = resultado.redirectUrlPasarelaOpcional;
 * } else {
 *   // Pago procesado directamente
 *   console.log('Pedido:', resultado.pedidoActualizado.estado);
 * }
 * ```
 */
export async function procesarPago(pedidoId: string): Promise<{
  pedidoActualizado: Pedido;
  redirectUrlPasarelaOpcional?: string;
}> {
  // Simular delay de procesamiento de pago
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Buscar el pedido
  const pedidoIndex = pedidosMock.findIndex(p => p.id === pedidoId);
  if (pedidoIndex === -1) {
    throw new Error(`Pedido con ID ${pedidoId} no encontrado`);
  }

  const pedido = pedidosMock[pedidoIndex];

  // Validar que el pedido esté en estado pendiente
  if (pedido.estado !== 'pendiente_pago') {
    throw new Error(`El pedido ${pedido.numeroPedido} no está en estado pendiente_pago. Estado actual: ${pedido.estado}`);
  }

  // ============================================================================
  // INTEGRACIÓN CON PASARELA DE PAGO (SIMULADA)
  // ============================================================================
  // 
  // EN PRODUCCIÓN, AQUÍ SE INTEGRARÍA LA PASARELA DE PAGO REAL:
  //
  // Ejemplo con Stripe:
  // ```ts
  // import Stripe from 'stripe';
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  // 
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: Math.round(pedido.importeTotal * 100), // Stripe usa centavos
  //   currency: pedido.moneda.toLowerCase(),
  //   metadata: { pedidoId: pedido.id, numeroPedido: pedido.numeroPedido },
  // });
  // 
  // if (paymentIntent.status === 'requires_action') {
  //   // Requiere autenticación 3D Secure
  //   return {
  //     pedidoActualizado: { ...pedido, estado: 'pendiente_pago' },
  //     redirectUrlPasarelaOpcional: paymentIntent.next_action?.redirect_to_url?.url,
  //   };
  // }
  // ```
  //
  // Ejemplo con Redsys:
  // ```ts
  // import { createPaymentRequest } from './redsys';
  // 
  // const paymentRequest = await createPaymentRequest({
  //   amount: pedido.importeTotal,
  //   orderId: pedido.numeroPedido,
  //   merchantUrl: process.env.MERCHANT_URL,
  // });
  // 
  // return {
  //   pedidoActualizado: { ...pedido, estado: 'pendiente_pago' },
  //   redirectUrlPasarelaOpcional: paymentRequest.redirectUrl,
  // };
  // ```
  //
  // Ejemplo con PayPal:
  // ```ts
  // import { createOrder } from './paypal';
  // 
  // const paypalOrder = await createOrder({
  //   amount: pedido.importeTotal,
  //   currency: pedido.moneda,
  //   returnUrl: `${process.env.BASE_URL}/checkout/return`,
  //   cancelUrl: `${process.env.BASE_URL}/checkout/cancel`,
  // });
  // 
  // return {
  //   pedidoActualizado: { ...pedido, estado: 'pendiente_pago' },
  //   redirectUrlPasarelaOpcional: paypalOrder.approveUrl,
  // };
  // ```
  //
  // ============================================================================

  // Simulación: Determinar si el pago es exitoso o fallido
  // En producción, esto lo determinaría la respuesta de la pasarela de pago
  const pagoExitoso = Math.random() > 0.1; // 90% de éxito (simulación)

  // Simulación: Algunos métodos de pago requieren redirección
  const requiereRedireccion = ['tarjeta', 'paypal'].includes(pedido.metodoPago);

  let nuevoEstado: EstadoPedido;
  let redirectUrl: string | undefined;

  if (pagoExitoso) {
    if (requiereRedireccion) {
      // Simular que algunos métodos requieren redirección a pasarela
      // En producción, esto vendría de la respuesta de la pasarela
      redirectUrl = `https://pasarela-pago-mock.com/pay?pedidoId=${pedidoId}&amount=${pedido.importeTotal}`;
      nuevoEstado = 'pendiente_pago'; // Se mantiene pendiente hasta confirmación
    } else {
      // Pago procesado directamente (ej: transferencia, efectivo)
      nuevoEstado = 'pagado';
    }
  } else {
    nuevoEstado = 'fallido';
  }

  // Actualizar el pedido
  const pedidoActualizado: Pedido = {
    ...pedido,
    estado: nuevoEstado,
    updatedAt: new Date(),
  };

  pedidosMock[pedidoIndex] = pedidoActualizado;

  return {
    pedidoActualizado,
    redirectUrlPasarelaOpcional: redirectUrl,
  };
}

/**
 * Obtiene un pedido por su ID
 * 
 * @param id - ID del pedido
 * @returns Pedido encontrado o null si no existe
 * 
 * @example
 * ```ts
 * const pedido = await getPedidoById('pedido-123');
 * if (pedido) {
 *   console.log(`Pedido ${pedido.numeroPedido}: ${pedido.estado}`);
 * }
 * ```
 */
export async function getPedidoById(id: string): Promise<Pedido | null> {
  // Simular delay de consulta
  await new Promise((resolve) => setTimeout(resolve, 200));

  const pedido = pedidosMock.find(p => p.id === id);
  return pedido || null;
}

/**
 * Obtiene todos los pedidos de un cliente por su email
 * 
 * @param email - Email del cliente
 * @returns Array de pedidos del cliente, ordenados por fecha de creación (más recientes primero)
 * 
 * @example
 * ```ts
 * const pedidos = await getPedidosCliente('cliente@example.com');
 * console.log(`Cliente tiene ${pedidos.length} pedidos`);
 * ```
 */
export async function getPedidosCliente(email: string): Promise<Pedido[]> {
  // Simular delay de consulta
  await new Promise((resolve) => setTimeout(resolve, 200));

  const pedidos = pedidosMock.filter(
    p => p.emailCliente.toLowerCase() === email.toLowerCase()
  );

  // Ordenar por fecha de creación (más recientes primero)
  return pedidos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

