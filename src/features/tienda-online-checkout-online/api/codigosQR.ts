import { CodigoQR, Producto } from '../types';
import { getProducto } from './productos';

// Mock storage (en producción sería una base de datos)
let codigosQR: CodigoQR[] = [];

export interface CrearCodigoQRRequest {
  servicioId: string;
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

  // Obtener información del servicio
  const servicio = await getProducto(request.servicioId);
  if (!servicio) {
    throw new Error('Servicio no encontrado');
  }

  // Verificar que sea un servicio
  if (servicio.tipo !== 'servicio') {
    throw new Error('Solo se pueden generar códigos QR para servicios');
  }

  const token = generarToken();
  const url = generarURL(token);
  const imagenQR = await generarImagenQR(url);

  const nuevoCodigoQR: CodigoQR = {
    id: `QR-${Date.now()}`,
    servicioId: request.servicioId,
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

