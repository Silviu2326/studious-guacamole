/**
 * API para gestión de tokens de confirmación de reservas
 * 
 * NOTA: En producción, estos módulos se conectarían con:
 * - Backend REST/GraphQL para almacenar tokens en base de datos
 * - Servicios de envío de emails (SendGrid, AWS SES, Mailgun, etc.) para enviar:
 *   - Enlaces de confirmación de reserva
 *   - Enlaces de cancelación de reserva
 *   - Recordatorios de reserva próxima
 * - Servicios de SMS/WhatsApp para notificaciones adicionales
 * - Servicios de almacenamiento seguro para tokens con expiración
 * 
 * Flujo típico en producción:
 * 1. Generar token seguro y almacenarlo en BD con fecha de expiración
 * 2. Enviar email al cliente con enlaces de confirmación/cancelación
 * 3. Validar token cuando el usuario hace clic en el enlace
 * 4. Ejecutar la acción (confirmar/cancelar) y marcar token como usado
 * 5. Enviar confirmación por email después de la acción
 */
import { TokenConfirmacionReserva, InfoReservaToken, Reserva } from '../types';

// Almacenamiento en memoria para tokens (simulado - en producción sería una BD)
const tokensStore: Map<string, TokenConfirmacionReserva> = new Map();

/**
 * Genera un token único (string) para confirmación de reserva
 * Función interna para generar el string del token
 */
const generarTokenString = (): string => {
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
  
  const token = generarTokenString();
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

/**
 * Genera un token de confirmación para una reserva
 * 
 * Esta es una función de conveniencia que crea un token de confirmación
 * para una reserva específica. En producción, esto también enviaría
 * un email al cliente con el enlace de confirmación.
 * 
 * @param reservaId - ID de la reserva para la cual generar el token
 * @returns Token de confirmación creado
 * 
 * @example
 * ```typescript
 * const token = await generarTokenConfirmacion('reserva123');
 * console.log(token.token); // Token generado
 * ```
 * 
 * @remarks
 * En producción, esta función:
 * 1. Crearía el token en la base de datos
 * 2. Enviaría un email al cliente con el enlace de confirmación
 * 3. El enlace incluiría el token para confirmar o cancelar la reserva
 * 
 * El email típicamente contendría:
 * - Información de la reserva (fecha, hora, tipo de sesión)
 * - Enlace para confirmar: /confirmar-reserva?token=...
 * - Enlace para cancelar: /cancelar-reserva?token=...
 */
export const generarTokenConfirmacion = async (
  reservaId: string
): Promise<TokenConfirmacionReserva> => {
  // Usar la función existente crearTokenConfirmacion
  return crearTokenConfirmacion(reservaId);
};

/**
 * Valida un token de confirmación y devuelve la información de la reserva asociada
 * 
 * @param token - Token de confirmación a validar
 * @returns Información de la reserva asociada o null si el token no es válido
 * 
 * @example
 * ```typescript
 * const infoReserva = await validarTokenConfirmacion('abc123...');
 * if (infoReserva) {
 *   console.log('Reserva:', infoReserva.reservaId);
 *   console.log('Cliente:', infoReserva.clienteNombre);
 *   console.log('Fecha:', infoReserva.fechaInicio);
 * }
 * ```
 * 
 * @remarks
 * En producción, esta función:
 * 1. Validaría el token en la base de datos
 * 2. Verificaría que no esté expirado ni usado
 * 3. Obtendría la información de la reserva asociada
 * 4. Retornaría la información necesaria para mostrar al usuario
 * 
 * También se usaría para:
 * - Páginas de confirmación de reserva
 * - Páginas de cancelación de reserva
 * - Verificación de tokens en enlaces de email
 */
export const validarTokenConfirmacion = async (
  token: string
): Promise<InfoReservaToken | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  // Obtener el token de confirmación
  const tokenData = await obtenerTokenConfirmacion(token);
  
  if (!tokenData) {
    console.log('[TokensConfirmacion] Token no encontrado:', token);
    return null;
  }

  // Verificar si el token es válido (no usado y no expirado)
  if (!esTokenValido(tokenData)) {
    console.log('[TokensConfirmacion] Token inválido (usado o expirado):', {
      token,
      usado: tokenData.usado,
      expiraEn: tokenData.expiraEn.toISOString(),
      ahora: new Date().toISOString(),
    });
    return null;
  }

  // Obtener información de la reserva asociada
  try {
    const { getReservas } = await import('./reservas');
    
    // Buscar la reserva en un rango amplio de fechas
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 1);
    const fechaFin = new Date();
    fechaFin.setMonth(fechaFin.getMonth() + 1);
    
    const reservas = await getReservas({ fechaInicio, fechaFin }, 'entrenador');
    const reserva = reservas.find(r => r.id === tokenData.reservaId);
    
    if (!reserva) {
      console.error('[TokensConfirmacion] Reserva no encontrada para token:', {
        token,
        reservaId: tokenData.reservaId,
      });
      return null;
    }

    // Construir información de la reserva
    const infoReserva: InfoReservaToken = {
      reservaId: reserva.id,
      clienteId: reserva.clienteId,
      clienteNombre: reserva.clienteNombre,
      entrenadorId: reserva.entrenadorId,
      fechaInicio: reserva.fechaInicio || reserva.fecha || new Date(),
      fechaFin: reserva.fechaFin || reserva.fecha || new Date(),
      estado: reserva.estado,
      tipoSesion: reserva.tipoSesion || (reserva.esOnline ? 'videollamada' : 'presencial'),
      precio: reserva.precio,
    };

    console.log('[TokensConfirmacion] Token validado exitosamente:', {
      token,
      reservaId: infoReserva.reservaId,
      clienteNombre: infoReserva.clienteNombre,
    });

    return infoReserva;
  } catch (error) {
    console.error('[TokensConfirmacion] Error obteniendo información de reserva:', error);
    return null;
  }
};

