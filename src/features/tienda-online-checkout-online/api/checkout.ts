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

  if (!request.datos.email || !request.datos.telefono) {
    return {
      exito: false,
      error: 'Email y teléfono son obligatorios',
    };
  }

  // Simular procesamiento exitoso
  const ventaId = `VENTA-${Date.now()}`;
  const facturaId = `FAC-${Date.now()}`;

  return {
    exito: true,
    ventaId,
    facturaId,
  };
}

