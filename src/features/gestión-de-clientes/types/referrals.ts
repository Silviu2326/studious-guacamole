/**
 * Tipos para el sistema de referidos y enlaces de referido
 */

export interface ReferralLink {
  id: string;
  clienteId: string;
  clienteName: string;
  trainerId: string;
  codigo: string; // Código único del enlace de referido
  url: string; // URL completa del enlace
  activo: boolean;
  fechaCreacion: string;
  fechaExpiracion?: string; // Opcional: fecha de expiración del enlace
  configuracion: ReferralConfig;
  estadisticas: ReferralStats;
}

export interface ReferralConfig {
  beneficioReferidor: BenefitConfig; // Beneficio para el cliente que refiere
  beneficioReferido: BenefitConfig; // Beneficio para el nuevo cliente referido
  descuentoAutomatico: boolean; // Si el descuento se aplica automáticamente
  maxUsos?: number; // Máximo número de veces que se puede usar el enlace
  requiereAprobacion: boolean; // Si requiere aprobación manual del entrenador
}

export interface BenefitConfig {
  tipo: 'descuento-porcentaje' | 'descuento-fijo' | 'sesion-gratis' | 'mes-gratis' | 'descuento-plan' | 'puntos';
  valor: number; // Porcentaje, cantidad fija, número de sesiones, etc.
  descripcion: string;
  aplicaA?: 'primera-mensualidad' | 'primera-sesion' | 'plan-completo' | 'todos-los-pagos';
}

export interface ReferralStats {
  totalClicks: number;
  totalRegistros: number;
  totalConversiones: number; // Clientes que se registraron y pagaron
  tasaConversion: number; // Porcentaje de conversión
  ingresosGenerados: number; // Ingresos totales generados por referidos
  beneficiosOtorgados: number; // Número de beneficios otorgados
  ultimoUso?: string;
}

export interface ReferralUsage {
  id: string;
  referralLinkId: string;
  clienteReferidorId: string;
  clienteReferidorName: string;
  clienteReferidoId: string;
  clienteReferidoName: string;
  clienteReferidoEmail: string;
  fechaRegistro: string;
  fechaConversion?: string; // Fecha en que el referido realizó su primer pago
  estado: 'pendiente' | 'registrado' | 'convertido' | 'beneficio-aplicado' | 'expirado';
  beneficioReferidorAplicado: boolean;
  beneficioReferidoAplicado: boolean;
  montoTransaccion?: number; // Monto de la primera transacción del referido
  notas?: string;
}

export interface ReferralBenefit {
  id: string;
  referralUsageId: string;
  clienteId: string;
  tipo: BenefitConfig['tipo'];
  valor: number;
  descripcion: string;
  fechaAplicacion: string;
  fechaExpiracion?: string;
  estado: 'pendiente' | 'aplicado' | 'utilizado' | 'expirado';
  aplicadoAutomaticamente: boolean;
}

