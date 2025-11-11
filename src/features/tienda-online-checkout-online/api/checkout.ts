import { DatosCheckout, Carrito, MetodoPago } from '../types';

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

