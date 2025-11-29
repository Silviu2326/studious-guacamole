/**
 * API Mock de Enlaces de Pago - Sistema de Facturación y Cobros
 * 
 * Este archivo implementa la lógica mock para la generación y gestión de enlaces
 * de pago públicos, incluyendo:
 * - Creación de enlaces de pago con slug único
 * - Búsqueda de enlaces por slug para páginas públicas
 * - Expiración de enlaces de pago
 * 
 * NOTA: En producción, las llamadas a backend reales irían en endpoints como:
 * - POST /api/links-pago - Crear nuevo enlace de pago
 * - GET /api/links-pago/:slug - Obtener enlace por slug (público)
 * - PATCH /api/links-pago/:id/expirar - Expirar enlace de pago
 * 
 * Componentes que utilizan estos endpoints:
 * - EnviarLinkPago.tsx - Para crear y enviar enlaces de pago
 * - PaginaPagoPublica.tsx - Para mostrar y procesar pagos desde enlaces públicos
 */

import { LinkPago, EstadoLinkPago } from '../types';

// ============================================================================
// DATOS MOCK
// ============================================================================

/**
 * Almacenamiento mock de enlaces de pago en memoria
 * En producción, esto sería una base de datos (PostgreSQL, MongoDB, etc.)
 */
const mockLinksPago: LinkPago[] = [
  {
    id: 'link_001',
    facturaIdOpcional: '1',
    clienteIdOpcional: 'cliente_001',
    slug: 'pago-abc123xyz',
    urlPublica: 'https://app.example.com/pago/pago-abc123xyz',
    importe: 238000,
    moneda: 'EUR',
    fechaExpiracion: new Date('2025-02-15T23:59:59'),
    estado: 'activo',
    creadoEn: new Date('2025-01-15T10:00:00')
  },
  {
    id: 'link_002',
    facturaIdOpcional: '2',
    clienteIdOpcional: 'cliente_002',
    slug: 'pago-def456uvw',
    urlPublica: 'https://app.example.com/pago/pago-def456uvw',
    importe: 357000,
    moneda: 'EUR',
    fechaExpiracion: new Date('2025-01-25T23:59:59'),
    estado: 'usado',
    creadoEn: new Date('2025-01-10T09:00:00')
  },
  {
    id: 'link_003',
    clienteIdOpcional: 'cliente_003',
    slug: 'pago-ghi789rst',
    urlPublica: 'https://app.example.com/pago/pago-ghi789rst',
    importe: 95200,
    moneda: 'EUR',
    fechaExpiracion: new Date('2025-01-20T23:59:59'),
    estado: 'expirado',
    creadoEn: new Date('2025-01-05T08:00:00')
  }
];

// ============================================================================
// HELPERS INTERNOS
// ============================================================================

/**
 * Genera un slug único para el enlace de pago
 * Formato: pago-{randomString}
 * 
 * NOTA: En producción, esto se haría con:
 * - Un generador de slugs criptográficamente seguro
 * - Verificación de unicidad en la base de datos
 * - Considerando longitud y caracteres permitidos
 */
function generarSlugUnico(): string {
  const caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let slug = 'pago-';
  
  for (let i = 0; i < 10; i++) {
    slug += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  
  // Verificar que no exista (en producción esto sería una consulta a BD)
  const existe = mockLinksPago.some(link => link.slug === slug);
  if (existe) {
    // Si existe, generar uno nuevo (en producción esto sería un retry con límite)
    return generarSlugUnico();
  }
  
  return slug;
}

/**
 * Genera la URL pública completa del enlace de pago
 * 
 * NOTA: En producción, esto se construiría con:
 * - La URL base de la aplicación desde configuración
 * - El slug generado
 * - Endpoint real: /pago/:slug
 */
function generarUrlPublica(slug: string): string {
  // En producción, esto vendría de una variable de entorno o configuración
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://app.example.com';
  return `${baseUrl}/pago/${slug}`;
}

/**
 * Determina el estado de un enlace basándose en su fecha de expiración
 * y si ya fue usado
 * 
 * @param link - El enlace de pago a evaluar
 * @returns El estado actualizado del enlace
 */
function determinarEstadoLink(link: LinkPago): EstadoLinkPago {
  // Si ya está usado, mantener el estado usado
  if (link.estado === 'usado') {
    return 'usado';
  }
  
  // Si está expirado, cambiar a expirado
  const ahora = new Date();
  if (link.fechaExpiracion < ahora) {
    return 'expirado';
  }
  
  // Por defecto, está activo
  return 'activo';
}

// ============================================================================
// FUNCIONES API
// ============================================================================

/**
 * Crea un nuevo enlace de pago público
 * 
 * Endpoint real: POST /api/links-pago
 * Body: { facturaIdOpcional?, clienteIdOpcional?, importe, moneda, fechaExpiracion }
 * 
 * Usado en: EnviarLinkPago.tsx
 * 
 * @param datos - Datos parciales del enlace de pago (sin id, slug, urlPublica, estado, creadoEn)
 * @returns Promise con el enlace de pago creado
 */
export async function crearLinkPago(
  datos: Omit<
    LinkPago,
    'id' | 'slug' | 'urlPublica' | 'estado' | 'creadoEn'
  >
): Promise<LinkPago> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 400));

  // Validar que tenga importe positivo
  if (!datos.importe || datos.importe <= 0) {
    throw new Error('El importe debe ser mayor a cero');
  }

  // Validar que tenga moneda
  if (!datos.moneda || datos.moneda.trim() === '') {
    throw new Error('La moneda es requerida');
  }

  // Validar que tenga fecha de expiración futura
  const ahora = new Date();
  if (!datos.fechaExpiracion || datos.fechaExpiracion <= ahora) {
    throw new Error('La fecha de expiración debe ser futura');
  }

  // Generar ID único (en producción, lo generaría la base de datos)
  const id = `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Generar slug único
  const slug = generarSlugUnico();

  // Generar URL pública
  const urlPublica = generarUrlPublica(slug);

  // Crear fecha de creación
  const creadoEn = new Date();

  // Estado inicial siempre es 'activo'
  const nuevoLink: LinkPago = {
    ...datos,
    id,
    slug,
    urlPublica,
    estado: 'activo',
    creadoEn
  };

  // Agregar a la lista mock
  mockLinksPago.push(nuevoLink);

  return nuevoLink;
}

/**
 * Obtiene un enlace de pago por su slug (para páginas públicas)
 * 
 * Endpoint real: GET /api/links-pago/:slug
 * 
 * Usado en: PaginaPagoPublica.tsx
 * 
 * @param slug - Slug del enlace de pago a buscar
 * @returns Promise con el enlace de pago encontrado o null si no existe
 */
export async function getLinkPagoPorSlug(slug: string): Promise<LinkPago | null> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 300));

  const link = mockLinksPago.find(l => l.slug === slug);

  if (!link) {
    return null;
  }

  // Actualizar estado basándose en fecha de expiración antes de retornar
  // En producción, esto se haría automáticamente con triggers o al consultar
  const estadoActualizado = determinarEstadoLink(link);
  if (estadoActualizado !== link.estado) {
    link.estado = estadoActualizado;
  }

  return link;
}

/**
 * Expira un enlace de pago manualmente
 * 
 * Endpoint real: PATCH /api/links-pago/:id/expirar
 * 
 * Usado en: EnviarLinkPago.tsx (para invalidar enlaces antes de tiempo)
 * 
 * @param id - ID del enlace de pago a expirar
 * @returns Promise con el enlace de pago expirado
 */
export async function expirarLinkPago(id: string): Promise<LinkPago> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 300));

  const index = mockLinksPago.findIndex(l => l.id === id);

  if (index === -1) {
    throw new Error(`Enlace de pago con ID ${id} no encontrado`);
  }

  const link = mockLinksPago[index];

  // Validar que no esté ya expirado
  if (link.estado === 'expirado') {
    throw new Error('El enlace de pago ya está expirado');
  }

  // Validar que no esté usado (según reglas de negocio, no se puede expirar un enlace usado)
  if (link.estado === 'usado') {
    throw new Error('No se puede expirar un enlace de pago que ya fue usado');
  }

  // Actualizar enlace
  const linkExpirado: LinkPago = {
    ...link,
    estado: 'expirado'
  };

  // Guardar cambios
  mockLinksPago[index] = linkExpirado;

  return linkExpirado;
}

/**
 * Marca un enlace de pago como usado
 * 
 * Endpoint real: PATCH /api/links-pago/:id/marcar-usado
 * 
 * Usado en: PaginaPagoPublica.tsx (después de procesar el pago)
 * 
 * @param id - ID del enlace de pago a marcar como usado
 * @returns Promise con el enlace de pago marcado como usado
 */
export async function marcarLinkPagoComoUsado(id: string): Promise<LinkPago> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 200));

  const index = mockLinksPago.findIndex(l => l.id === id);

  if (index === -1) {
    throw new Error(`Enlace de pago con ID ${id} no encontrado`);
  }

  const link = mockLinksPago[index];

  // Validar que no esté ya usado
  if (link.estado === 'usado') {
    return link; // Ya está usado, retornar sin cambios
  }

  // Validar que no esté expirado
  if (link.estado === 'expirado') {
    throw new Error('No se puede marcar como usado un enlace de pago expirado');
  }

  // Actualizar enlace
  const linkUsado: LinkPago = {
    ...link,
    estado: 'usado'
  };

  // Guardar cambios
  mockLinksPago[index] = linkUsado;

  return linkUsado;
}

