/**
 * API para gestión de enlaces públicos de reserva
 * 
 * NOTA: En producción, estos módulos se conectarían con:
 * - Backend REST/GraphQL para almacenar configuraciones en base de datos
 * - Servicios de envío de emails (SendGrid, AWS SES, etc.) para notificaciones
 * - Servicios de SMS/WhatsApp para confirmaciones de reserva
 * - Sistemas de analytics para tracking de visitas y conversiones
 */
import { EnlacePublico, ConfiguracionEnlacePublico, ContextoEnlacePublico } from '../types';

/**
 * Genera un token único para el enlace público
 */
const generarToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * Obtiene el enlace público de un entrenador
 */
export const getEnlacePublico = async (entrenadorId: string): Promise<EnlacePublico | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Simulación: obtener enlace público desde el backend
  // En producción, esto haría una llamada real a la API
  const enlaceGuardado = localStorage.getItem(`enlacePublico_${entrenadorId}`);
  
  if (enlaceGuardado) {
    return JSON.parse(enlaceGuardado);
  }
  
  return null;
};

/**
 * Crea o actualiza un enlace público para un entrenador
 */
export const crearOActualizarEnlacePublico = async (
  entrenadorId: string,
  datos: {
    activo?: boolean;
    nombrePersonalizado?: string;
    descripcion?: string;
  }
): Promise<EnlacePublico> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Verificar si ya existe un enlace
  const enlaceExistente = await getEnlacePublico(entrenadorId);
  
  if (enlaceExistente) {
    // Actualizar enlace existente
    const enlaceActualizado: EnlacePublico = {
      ...enlaceExistente,
      ...datos,
      updatedAt: new Date(),
    };
    
    localStorage.setItem(`enlacePublico_${entrenadorId}`, JSON.stringify(enlaceActualizado));
    return enlaceActualizado;
  }
  
  // Crear nuevo enlace
  const nuevoEnlace: EnlacePublico = {
    id: `enlace_${Date.now()}`,
    entrenadorId,
    token: generarToken(),
    activo: datos.activo ?? true,
    nombrePersonalizado: datos.nombrePersonalizado,
    descripcion: datos.descripcion,
    visitas: 0,
    reservasDesdeEnlace: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  localStorage.setItem(`enlacePublico_${entrenadorId}`, JSON.stringify(nuevoEnlace));
  return nuevoEnlace;
};

/**
 * Obtiene un enlace público por su token (para la página pública)
 */
export const getEnlacePublicoPorToken = async (token: string): Promise<EnlacePublico | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Simulación: buscar enlace por token
  // En producción, esto haría una llamada real a la API
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('enlacePublico_')) {
      const enlace: EnlacePublico = JSON.parse(localStorage.getItem(key) || '{}');
      if (enlace.token === token && enlace.activo) {
        // Incrementar contador de visitas
        enlace.visitas += 1;
        enlace.updatedAt = new Date();
        localStorage.setItem(key, JSON.stringify(enlace));
        return enlace;
      }
    }
  }
  
  return null;
};

/**
 * Incrementa el contador de reservas desde el enlace
 */
export const incrementarReservasDesdeEnlace = async (token: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Buscar y actualizar el contador
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('enlacePublico_')) {
      const enlace: EnlacePublico = JSON.parse(localStorage.getItem(key) || '{}');
      if (enlace.token === token) {
        enlace.reservasDesdeEnlace += 1;
        enlace.updatedAt = new Date();
        localStorage.setItem(key, JSON.stringify(enlace));
        break;
      }
    }
  }
};

/**
 * Regenera el token de un enlace público
 */
export const regenerarTokenEnlace = async (entrenadorId: string): Promise<EnlacePublico> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const enlace = await getEnlacePublico(entrenadorId);
  if (!enlace) {
    throw new Error('Enlace público no encontrado');
  }
  
  const enlaceActualizado: EnlacePublico = {
    ...enlace,
    token: generarToken(),
    updatedAt: new Date(),
  };
  
  localStorage.setItem(`enlacePublico_${entrenadorId}`, JSON.stringify(enlaceActualizado));
  return enlaceActualizado;
};

/**
 * Almacenamiento mock para configuraciones de enlaces públicos
 * En producción, esto estaría en una base de datos
 */
const configuracionesEnlacePublico: Map<string, ConfiguracionEnlacePublico> = new Map();

/**
 * Obtiene la configuración del enlace público
 * 
 * @param contexto - Contexto con entrenadorId, token opcional, o slug opcional
 * @returns Configuración del enlace público o null si no existe
 * 
 * @example
 * ```typescript
 * // Obtener configuración por entrenadorId
 * const config = await getConfiguracionEnlacePublico({ entrenadorId: 'entrenador1' });
 * 
 * // Obtener configuración por token
 * const config = await getConfiguracionEnlacePublico({ 
 *   entrenadorId: 'entrenador1', 
 *   token: 'abc123' 
 * });
 * ```
 * 
 * @remarks
 * En producción, esta función se conectaría con un backend REST/GraphQL:
 * - REST: GET /api/enlaces-publicos/configuracion?entrenadorId=...&token=...
 * - GraphQL: query { configuracionEnlacePublico(entrenadorId: "...", token: "...") { ... } }
 * 
 * También se integraría con servicios de envío de emails para notificaciones de confirmación.
 */
export const getConfiguracionEnlacePublico = async (
  contexto: ContextoEnlacePublico
): Promise<ConfiguracionEnlacePublico | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Buscar configuración guardada en localStorage o en el Map
  const key = `configEnlacePublico_${contexto.entrenadorId}`;
  const configGuardada = localStorage.getItem(key);
  
  if (configGuardada) {
    const config: ConfiguracionEnlacePublico = JSON.parse(configGuardada);
    
    // Si se proporciona token o slug, validar que coincida
    if (contexto.token && config.url && !config.url.includes(contexto.token)) {
      return null;
    }
    if (contexto.slug && config.slug !== contexto.slug) {
      return null;
    }
    
    return config;
  }
  
  // Si no existe, buscar en el enlace público existente para crear configuración por defecto
  const enlace = await getEnlacePublico(contexto.entrenadorId);
  if (enlace) {
    // Generar slug por defecto basado en el entrenadorId
    const slugPorDefecto = `enlace-${contexto.entrenadorId.substring(0, 8)}`;
    const urlPorDefecto = `${window.location.origin}/reservar/${enlace.token}`;
    
    const configPorDefecto: ConfiguracionEnlacePublico = {
      id: `config_${Date.now()}`,
      entrenadorId: contexto.entrenadorId,
      slug: slugPorDefecto,
      url: urlPorDefecto,
      opcionesVisibilidad: 'publico',
      tiposSesionPermitidos: 'ambos',
      activo: enlace.activo,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Guardar configuración por defecto
    localStorage.setItem(key, JSON.stringify(configPorDefecto));
    configuracionesEnlacePublico.set(contexto.entrenadorId, configPorDefecto);
    
    return configPorDefecto;
  }
  
  return null;
};

/**
 * Guarda la configuración del enlace público
 * 
 * @param data - Datos de configuración a guardar
 * @returns Configuración guardada
 * 
 * @example
 * ```typescript
 * const config = await saveConfiguracionEnlacePublico({
 *   entrenadorId: 'entrenador1',
 *   slug: 'sesiones-juan',
 *   url: 'https://app.example.com/reservar/sesiones-juan',
 *   opcionesVisibilidad: 'publico',
 *   tiposSesionPermitidos: 'ambos',
 *   activo: true
 * });
 * ```
 * 
 * @remarks
 * En producción, esta función se conectaría con un backend REST/GraphQL:
 * - REST: POST/PUT /api/enlaces-publicos/configuracion { body: data }
 * - GraphQL: mutation { saveConfiguracionEnlacePublico(input: {...}) { ... } }
 * 
 * También se integraría con servicios de envío de emails para notificaciones de confirmación
 * y con servicios de proveedores externos (Zoom, Meet, etc.) para enlaces de videollamada.
 */
export const saveConfiguracionEnlacePublico = async (
  data: Omit<ConfiguracionEnlacePublico, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
): Promise<ConfiguracionEnlacePublico> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const ahora = new Date();
  const key = `configEnlacePublico_${data.entrenadorId}`;
  const configExistente = localStorage.getItem(key);
  
  let configuracion: ConfiguracionEnlacePublico;
  
  if (configExistente) {
    // Actualizar configuración existente
    const configAnterior: ConfiguracionEnlacePublico = JSON.parse(configExistente);
    configuracion = {
      ...configAnterior,
      ...data,
      id: data.id || configAnterior.id,
      updatedAt: ahora,
      createdAt: data.createdAt || configAnterior.createdAt || ahora,
    };
  } else {
    // Crear nueva configuración
    configuracion = {
      ...data,
      id: data.id || `config_${Date.now()}`,
      createdAt: data.createdAt || ahora,
      updatedAt: ahora,
    };
  }
  
  // Validar que el slug solo contenga caracteres válidos para URL
  const slugValido = data.slug.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  configuracion.slug = slugValido;
  
  // Asegurar que la URL esté bien formada
  if (!configuracion.url.startsWith('http')) {
    configuracion.url = `${window.location.origin}${configuracion.url.startsWith('/') ? '' : '/'}${configuracion.url}`;
  }
  
  // Guardar en localStorage (mock)
  localStorage.setItem(key, JSON.stringify(configuracion));
  configuracionesEnlacePublico.set(data.entrenadorId, configuracion);
  
  console.log('[EnlacePublico] Configuración guardada:', {
    entrenadorId: data.entrenadorId,
    slug: configuracion.slug,
    url: configuracion.url,
    opcionesVisibilidad: configuracion.opcionesVisibilidad,
    tiposSesionPermitidos: configuracion.tiposSesionPermitidos,
  });
  
  return configuracion;
};


