import { TokenConfirmacionReserva } from '../types';

// Almacenamiento en memoria para tokens (simulado - en producción sería una BD)
const tokensStore: Map<string, TokenConfirmacionReserva> = new Map();

/**
 * Genera un token único para confirmación de reserva
 */
export const generarTokenConfirmacion = (): string => {
  // Generar token aleatorio seguro
  try {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    // Fallback si crypto no está disponible
  }
  
  // Fallback: generar token usando Math.random (menos seguro pero funciona en todos los entornos)
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
};

/**
 * Crea un token de confirmación para una reserva
 */
export const crearTokenConfirmacion = async (
  reservaId: string
): Promise<TokenConfirmacionReserva> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const token = generarTokenConfirmacion();
  const ahora = new Date();
  const expiraEn = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000); // Expira en 7 días
  
  const tokenConfirmacion: TokenConfirmacionReserva = {
    id: `token-${Date.now()}`,
    reservaId,
    token,
    expiraEn,
    usado: false,
    createdAt: ahora,
  };
  
  // Guardar en almacenamiento simulado (en producción sería en BD)
  tokensStore.set(token, tokenConfirmacion);
  
  console.log('[TokensConfirmacion] Token creado:', {
    reservaId,
    token,
    expiraEn: expiraEn.toISOString(),
  });
  
  return tokenConfirmacion;
};

/**
 * Valida y obtiene un token de confirmación
 * En producción, esto buscaría en la base de datos
 */
export const obtenerTokenConfirmacion = async (
  token: string
): Promise<TokenConfirmacionReserva | null> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Buscar en almacenamiento simulado (en producción sería en BD)
  const tokenData = tokensStore.get(token);
  
  if (tokenData) {
    return tokenData;
  }
  
  // Si no se encuentra, retornar null
  return null;
};

/**
 * Obtiene un token de confirmación por reservaId
 * Útil para buscar tokens existentes de una reserva
 */
export const obtenerTokenPorReservaId = async (
  reservaId: string
): Promise<TokenConfirmacionReserva | null> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // En producción, esto buscaría: SELECT * FROM tokens_confirmacion WHERE reserva_id = ? AND usado = false AND expira_en > NOW() ORDER BY created_at DESC LIMIT 1
  // Por ahora, retornamos null (no hay token previo)
  return null;
};

/**
 * Marca un token como usado
 */
export const marcarTokenComoUsado = async (
  token: string,
  accion: 'confirmar' | 'cancelar'
): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Actualizar en almacenamiento simulado (en producción sería en BD)
  const tokenData = tokensStore.get(token);
  if (tokenData) {
    tokenData.usado = true;
    tokenData.fechaUso = new Date();
    tokenData.accion = accion;
    tokensStore.set(token, tokenData);
  }
  
  console.log('[TokensConfirmacion] Token marcado como usado:', {
    token,
    accion,
    fechaUso: new Date().toISOString(),
  });
  
  return true;
};

/**
 * Verifica si un token es válido (no expirado y no usado)
 */
export const esTokenValido = (token: TokenConfirmacionReserva): boolean => {
  const ahora = new Date();
  return !token.usado && token.expiraEn > ahora;
};

