import { CodigoQR, Producto } from '../types';
import { getProducto } from './productos';

// Mock storage (en producción sería una base de datos)
let codigosQR: CodigoQR[] = [];

export interface CrearCodigoQRRequest {
  tipo: 'producto' | 'bono' | 'enlace_pago';
  servicioId?: string; // Para tipo 'producto'
  bonoId?: string; // Para tipo 'bono'
  enlacePagoId?: string; // Para tipo 'enlace_pago'
  entrenadorId: string;
  descripcion?: string;
}

// Generar token único
function generarToken(): string {
  return `QR-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
}

// Generar URL para el código QR
function generarURL(token: string): string {
  // En producción, esto sería la URL real de la aplicación
  const baseURL = window.location.origin;
  return `${baseURL}/checkout/qr/${token}`;
}

// Generar imagen QR (mock - en producción usarías una librería como qrcode)
async function generarImagenQR(url: string): Promise<string> {
  // En producción, usarías una librería como 'qrcode' o un servicio externo
  // Por ahora, retornamos un placeholder
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  // En producción, esto generaría la imagen QR real
  // const QRCode = require('qrcode');
  // return await QRCode.toDataURL(url);
  
  // Placeholder: retornamos una URL de servicio QR público (solo para desarrollo)
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
}

export async function crearCodigoQR(
  request: CrearCodigoQRRequest
): Promise<CodigoQR> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let servicio: Producto | null = null;
  let servicioId: string;

  // Obtener información según el tipo
  if (request.tipo === 'producto') {
    if (!request.servicioId) {
      throw new Error('Se requiere servicioId para tipo producto');
    }
    servicio = await getProducto(request.servicioId);
    if (!servicio) {
      throw new Error('Producto/Servicio no encontrado');
    }
    servicioId = request.servicioId;
  } else if (request.tipo === 'bono') {
    if (!request.bonoId) {
      throw new Error('Se requiere bonoId para tipo bono');
    }
    // Para bonos, creamos un producto temporal o usamos el bono directamente
    // Por ahora, usamos el bonoId como servicioId
    servicioId = request.bonoId;
    // Crear un producto temporal para el bono
    servicio = {
      id: request.bonoId,
      nombre: `Bono ${request.bonoId}`,
      slug: `bono-${request.bonoId}`,
      descripcionCorta: 'Bono de regalo',
      categoriaId: '',
      precioBase: 0,
      activo: true,
      tipo: 'bono',
      variantes: [],
    } as Producto;
  } else if (request.tipo === 'enlace_pago') {
    if (!request.enlacePagoId) {
      throw new Error('Se requiere enlacePagoId para tipo enlace_pago');
    }
    // Importar getEnlacePagoPorToken o similar
    const { getEnlacesPagoEntrenador } = await import('./enlacesPago');
    const enlaces = await getEnlacesPagoEntrenador(request.entrenadorId);
    const enlace = enlaces.find((e) => e.id === request.enlacePagoId);
    if (!enlace) {
      throw new Error('Enlace de pago no encontrado');
    }
    servicio = enlace.producto;
    servicioId = enlace.productoId;
  } else {
    throw new Error('Tipo de código QR no válido');
  }

  const token = generarToken();
  const url = generarURL(token);
  const imagenQR = await generarImagenQR(url);

  const nuevoCodigoQR: CodigoQR = {
    id: `QR-${Date.now()}`,
    servicioId,
    servicio,
    entrenadorId: request.entrenadorId,
    token,
    url,
    fechaCreacion: new Date(),
    activo: true,
    vecesUsado: 0,
    descripcion: request.descripcion,
    imagenQR,
  };

  codigosQR.push(nuevoCodigoQR);
  return nuevoCodigoQR;
}

export async function getCodigosQR(entrenadorId: string): Promise<CodigoQR[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const codigos = codigosQR.filter((qr) => qr.entrenadorId === entrenadorId);
  
  // Ordenar por fecha de creación (más recientes primero)
  return codigos.sort((a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime());
}

export async function getCodigoQRPorToken(token: string): Promise<CodigoQR | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return codigosQR.find((qr) => qr.token === token && qr.activo) || null;
}

export async function getCodigoQR(id: string): Promise<CodigoQR | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return codigosQR.find((qr) => qr.id === id) || null;
}

export async function actualizarCodigoQR(
  id: string,
  actualizaciones: Partial<CodigoQR>
): Promise<CodigoQR> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const indice = codigosQR.findIndex((qr) => qr.id === id);
  if (indice === -1) {
    throw new Error('Código QR no encontrado');
  }

  codigosQR[indice] = {
    ...codigosQR[indice],
    ...actualizaciones,
  };

  return codigosQR[indice];
}

export async function registrarUsoCodigoQR(token: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const codigo = codigosQR.find((qr) => qr.token === token);
  if (codigo) {
    codigo.vecesUsado += 1;
  }
}

export async function eliminarCodigoQR(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const indice = codigosQR.findIndex((qr) => qr.id === id);
  if (indice === -1) {
    throw new Error('Código QR no encontrado');
  }

  codigosQR.splice(indice, 1);
}

