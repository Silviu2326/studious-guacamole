import {
  ReferralLink,
  ReferralUsage,
  ReferralBenefit,
  ReferralConfig,
  BenefitConfig,
} from '../types/referrals';

// Mock data para desarrollo
const MOCK_REFERRAL_LINKS: ReferralLink[] = [];
const MOCK_REFERRAL_USAGES: ReferralUsage[] = [];
const MOCK_REFERRAL_BENEFITS: ReferralBenefit[] = [];

/**
 * Genera un código único para un enlace de referido
 */
const generateReferralCode = (clienteId: string, trainerId: string): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${trainerId.substring(0, 3)}-${clienteId.substring(0, 3)}-${timestamp}-${random}`.toUpperCase();
};

/**
 * Genera la URL completa del enlace de referido
 */
const generateReferralUrl = (codigo: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/referido/${codigo}`;
};

/**
 * Obtiene todos los enlaces de referido de un entrenador
 */
export const getReferralLinks = async (
  trainerId: string,
  clienteId?: string
): Promise<ReferralLink[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  let links = MOCK_REFERRAL_LINKS.filter(link => link.trainerId === trainerId);
  
  if (clienteId) {
    links = links.filter(link => link.clienteId === clienteId);
  }

  return links;
};

/**
 * Obtiene un enlace de referido específico
 */
export const getReferralLinkById = async (linkId: string): Promise<ReferralLink | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const link = MOCK_REFERRAL_LINKS.find(l => l.id === linkId);
  return link || null;
};

/**
 * Obtiene un enlace de referido por código
 */
export const getReferralLinkByCode = async (codigo: string): Promise<ReferralLink | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const link = MOCK_REFERRAL_LINKS.find(l => l.codigo === codigo && l.activo);
  return link || null;
};

/**
 * Crea un nuevo enlace de referido para un cliente
 */
export const createReferralLink = async (
  clienteId: string,
  clienteName: string,
  trainerId: string,
  config?: Partial<ReferralConfig>
): Promise<ReferralLink> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  // Configuración por defecto
  const defaultConfig: ReferralConfig = {
    beneficioReferidor: {
      tipo: 'descuento-porcentaje',
      valor: 10,
      descripcion: '10% de descuento en tu próxima mensualidad',
      aplicaA: 'primera-mensualidad',
    },
    beneficioReferido: {
      tipo: 'descuento-porcentaje',
      valor: 15,
      descripcion: '15% de descuento en tu primera mensualidad',
      aplicaA: 'primera-mensualidad',
    },
    descuentoAutomatico: true,
    requiereAprobacion: false,
  };

  const finalConfig = { ...defaultConfig, ...config };

  const codigo = generateReferralCode(clienteId, trainerId);
  const url = generateReferralUrl(codigo);

  const newLink: ReferralLink = {
    id: `ref_${Date.now()}`,
    clienteId,
    clienteName,
    trainerId,
    codigo,
    url,
    activo: true,
    fechaCreacion: new Date().toISOString(),
    configuracion: finalConfig,
    estadisticas: {
      totalClicks: 0,
      totalRegistros: 0,
      totalConversiones: 0,
      tasaConversion: 0,
      ingresosGenerados: 0,
      beneficiosOtorgados: 0,
    },
  };

  MOCK_REFERRAL_LINKS.push(newLink);
  return newLink;
};

/**
 * Actualiza un enlace de referido
 */
export const updateReferralLink = async (
  linkId: string,
  updates: Partial<ReferralLink>
): Promise<ReferralLink> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const index = MOCK_REFERRAL_LINKS.findIndex(l => l.id === linkId);
  if (index === -1) throw new Error('Referral link not found');

  MOCK_REFERRAL_LINKS[index] = { ...MOCK_REFERRAL_LINKS[index], ...updates };
  return MOCK_REFERRAL_LINKS[index];
};

/**
 * Desactiva un enlace de referido
 */
export const deactivateReferralLink = async (linkId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const index = MOCK_REFERRAL_LINKS.findIndex(l => l.id === linkId);
  if (index !== -1) {
    MOCK_REFERRAL_LINKS[index].activo = false;
  }
};

/**
 * Registra un click en un enlace de referido
 */
export const trackReferralClick = async (codigo: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 100));

  const link = MOCK_REFERRAL_LINKS.find(l => l.codigo === codigo);
  if (link) {
    link.estadisticas.totalClicks += 1;
    link.estadisticas.ultimoUso = new Date().toISOString();
  }
};

/**
 * Registra el uso de un enlace de referido (nuevo cliente registrado)
 */
export const registerReferralUsage = async (
  referralLinkId: string,
  clienteReferidorId: string,
  clienteReferidorName: string,
  clienteReferidoData: {
    id: string;
    name: string;
    email: string;
  }
): Promise<ReferralUsage> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const link = MOCK_REFERRAL_LINKS.find(l => l.id === referralLinkId);
  if (!link) throw new Error('Referral link not found');

  const usage: ReferralUsage = {
    id: `usage_${Date.now()}`,
    referralLinkId,
    clienteReferidorId,
    clienteReferidorName,
    clienteReferidoId: clienteReferidoData.id,
    clienteReferidoName: clienteReferidoData.name,
    clienteReferidoEmail: clienteReferidoData.email,
    fechaRegistro: new Date().toISOString(),
    estado: 'registrado',
    beneficioReferidorAplicado: false,
    beneficioReferidoAplicado: false,
  };

  MOCK_REFERRAL_USAGES.push(usage);
  
  // Actualizar estadísticas del enlace
  link.estadisticas.totalRegistros += 1;
  link.estadisticas.ultimoUso = new Date().toISOString();

  // Aplicar beneficios automáticos si está configurado
  if (link.configuracion.descuentoAutomatico) {
    await applyReferralBenefits(usage.id);
  }

  return usage;
};

/**
 * Aplica los beneficios de referido automáticamente
 */
export const applyReferralBenefits = async (usageId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const usage = MOCK_REFERRAL_USAGES.find(u => u.id === usageId);
  if (!usage) throw new Error('Referral usage not found');

  const link = MOCK_REFERRAL_LINKS.find(l => l.id === usage.referralLinkId);
  if (!link) throw new Error('Referral link not found');

  // Aplicar beneficio al referidor
  if (!usage.beneficioReferidorAplicado && link.configuracion.beneficioReferidor) {
    const benefitReferidor: ReferralBenefit = {
      id: `benefit_${Date.now()}_1`,
      referralUsageId: usageId,
      clienteId: usage.clienteReferidorId,
      tipo: link.configuracion.beneficioReferidor.tipo,
      valor: link.configuracion.beneficioReferidor.valor,
      descripcion: link.configuracion.beneficioReferidor.descripcion,
      fechaAplicacion: new Date().toISOString(),
      estado: 'aplicado',
      aplicadoAutomaticamente: true,
    };
    MOCK_REFERRAL_BENEFITS.push(benefitReferidor);
    usage.beneficioReferidorAplicado = true;
    link.estadisticas.beneficiosOtorgados += 1;
  }

  // Aplicar beneficio al referido
  if (!usage.beneficioReferidoAplicado && link.configuracion.beneficioReferido) {
    const benefitReferido: ReferralBenefit = {
      id: `benefit_${Date.now()}_2`,
      referralUsageId: usageId,
      clienteId: usage.clienteReferidoId,
      tipo: link.configuracion.beneficioReferido.tipo,
      valor: link.configuracion.beneficioReferido.valor,
      descripcion: link.configuracion.beneficioReferido.descripcion,
      fechaAplicacion: new Date().toISOString(),
      estado: 'aplicado',
      aplicadoAutomaticamente: true,
    };
    MOCK_REFERRAL_BENEFITS.push(benefitReferido);
    usage.beneficioReferidoAplicado = true;
    link.estadisticas.beneficiosOtorgados += 1;
  }
};

/**
 * Marca un referido como convertido (realizó su primer pago)
 */
export const markReferralAsConverted = async (
  usageId: string,
  montoTransaccion: number
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const usage = MOCK_REFERRAL_USAGES.find(u => u.id === usageId);
  if (!usage) throw new Error('Referral usage not found');

  usage.estado = 'convertido';
  usage.fechaConversion = new Date().toISOString();
  usage.montoTransaccion = montoTransaccion;

  const link = MOCK_REFERRAL_LINKS.find(l => l.id === usage.referralLinkId);
  if (link) {
    link.estadisticas.totalConversiones += 1;
    link.estadisticas.ingresosGenerados += montoTransaccion;
    link.estadisticas.tasaConversion = 
      (link.estadisticas.totalConversiones / link.estadisticas.totalRegistros) * 100;
  }
};

/**
 * Obtiene todos los usos de referidos de un entrenador
 */
export const getReferralUsages = async (
  trainerId: string,
  clienteId?: string
): Promise<ReferralUsage[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const linkIds = MOCK_REFERRAL_LINKS
    .filter(l => l.trainerId === trainerId)
    .map(l => l.id);

  let usages = MOCK_REFERRAL_USAGES.filter(u => linkIds.includes(u.referralLinkId));

  if (clienteId) {
    usages = usages.filter(u => 
      u.clienteReferidorId === clienteId || u.clienteReferidoId === clienteId
    );
  }

  return usages;
};

/**
 * Obtiene los beneficios de referido de un cliente
 */
export const getReferralBenefits = async (clienteId: string): Promise<ReferralBenefit[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  return MOCK_REFERRAL_BENEFITS.filter(b => b.clienteId === clienteId);
};

/**
 * Obtiene las estadísticas de referidos de un entrenador
 */
export const getReferralStats = async (trainerId: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const links = MOCK_REFERRAL_LINKS.filter(l => l.trainerId === trainerId);
  
  const totalLinks = links.length;
  const activeLinks = links.filter(l => l.activo).length;
  const totalClicks = links.reduce((sum, l) => sum + l.estadisticas.totalClicks, 0);
  const totalRegistros = links.reduce((sum, l) => sum + l.estadisticas.totalRegistros, 0);
  const totalConversiones = links.reduce((sum, l) => sum + l.estadisticas.totalConversiones, 0);
  const totalIngresos = links.reduce((sum, l) => sum + l.estadisticas.ingresosGenerados, 0);
  const totalBeneficios = links.reduce((sum, l) => sum + l.estadisticas.beneficiosOtorgados, 0);
  
  const tasaConversion = totalRegistros > 0 
    ? (totalConversiones / totalRegistros) * 100 
    : 0;

  return {
    totalLinks,
    activeLinks,
    totalClicks,
    totalRegistros,
    totalConversiones,
    totalIngresos,
    totalBeneficios,
    tasaConversion,
  };
};

