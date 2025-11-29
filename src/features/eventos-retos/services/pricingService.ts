/**
 * Servicio para cálculo de precios diferenciados por tipo de cliente
 * 
 * Este servicio calcula el precio final de un participante basado en:
 * - Tipo de cliente (regular, premium, vip)
 * - Precios configurados en el evento (EventPricingTier)
 * - Si el evento es gratuito
 */

import { Evento, Participante } from '../api/events';
import { ClientType, EventPricingTier } from '../types';

/**
 * Calcula el precio final para un participante según su tipo de cliente
 * 
 * @param evento Evento con configuración de precios
 * @param participante Participante con tipoCliente
 * @returns Precio final calculado (0 si es gratuito)
 */
export const calcularPrecioParticipante = (
  evento: Evento,
  participante: Participante
): number => {
  // Si el evento es gratuito, retornar 0
  if (evento.esGratuito) {
    return 0;
  }

  // Obtener tipo de cliente del participante (por defecto 'regular')
  const tipoCliente: ClientType = participante.tipoCliente || 'regular';

  // Si hay precios diferenciados por tipo de cliente
  if (evento.preciosPorTipoCliente) {
    const precio = evento.preciosPorTipoCliente[tipoCliente] || 
                   evento.preciosPorTipoCliente.regular ||
                   evento.preciosPorTipoCliente.general ||
                   evento.precio ||
                   0;
    return precio;
  }

  // Si solo hay precio general
  if (evento.precio) {
    return evento.precio;
  }

  // Sin precio configurado
  return 0;
};

/**
 * Obtiene el precio configurado para un tipo de cliente específico
 * 
 * @param evento Evento con configuración de precios
 * @param tipoCliente Tipo de cliente
 * @returns Precio para ese tipo de cliente
 */
export const obtenerPrecioPorTipoCliente = (
  evento: Evento,
  tipoCliente: ClientType
): number => {
  if (evento.esGratuito) {
    return 0;
  }

  if (evento.preciosPorTipoCliente) {
    return evento.preciosPorTipoCliente[tipoCliente] || 
           evento.preciosPorTipoCliente.regular ||
           evento.preciosPorTipoCliente.general ||
           evento.precio ||
           0;
  }

  return evento.precio || 0;
};

/**
 * Calcula los ingresos totales de un evento basado en participantes y precios
 * 
 * @param evento Evento con participantes y precios
 * @param soloAsistentes Si true, solo cuenta participantes que asistieron
 * @returns Ingresos totales calculados
 */
export const calcularIngresosEvento = (
  evento: Evento,
  soloAsistentes: boolean = false
): number => {
  const participantes = evento.participantesDetalle || [];
  
  // Filtrar participantes según criterio
  const participantesAContar = soloAsistentes
    ? participantes.filter(p => p.asistencia === true && !p.fechaCancelacion)
    : participantes.filter(p => !p.fechaCancelacion);

  // Calcular ingresos sumando precios de cada participante
  const ingresos = participantesAContar.reduce((total, participante) => {
    const precio = calcularPrecioParticipante(evento, participante);
    return total + precio;
  }, 0);

  return ingresos;
};

/**
 * Obtiene el rango de precios de un evento (mínimo y máximo)
 * 
 * @param evento Evento con configuración de precios
 * @returns Objeto con precioMinimo y precioMaximo
 */
export const obtenerRangoPrecios = (
  evento: Evento
): { precioMinimo: number; precioMaximo: number } => {
  if (evento.esGratuito) {
    return { precioMinimo: 0, precioMaximo: 0 };
  }

  if (evento.preciosPorTipoCliente) {
    const precios = Object.values(evento.preciosPorTipoCliente)
      .filter(p => p !== undefined && p !== null) as number[];
    
    if (precios.length === 0) {
      const precioGeneral = evento.precio || 0;
      return { precioMinimo: precioGeneral, precioMaximo: precioGeneral };
    }

    return {
      precioMinimo: Math.min(...precios),
      precioMaximo: Math.max(...precios),
    };
  }

  const precioGeneral = evento.precio || 0;
  return { precioMinimo: precioGeneral, precioMaximo: precioGeneral };
};

/**
 * Formatea el precio para mostrar en la UI
 * 
 * @param precio Precio numérico
 * @param moneda Código de moneda (por defecto 'EUR')
 * @returns String formateado (ej: "€25.00" o "Gratis")
 */
export const formatearPrecio = (
  precio: number,
  moneda: string = 'EUR'
): string => {
  if (precio === 0) {
    return 'Gratis';
  }

  const simbolosMoneda: Record<string, string> = {
    EUR: '€',
    USD: '$',
    GBP: '£',
  };

  const simbolo = simbolosMoneda[moneda] || moneda;
  return `${simbolo}${precio.toFixed(2)}`;
};

/**
 * Obtiene la etiqueta de precio para mostrar según tipo de cliente
 * 
 * @param evento Evento con configuración de precios
 * @param tipoCliente Tipo de cliente
 * @returns String con el precio formateado
 */
export const obtenerEtiquetaPrecio = (
  evento: Evento,
  tipoCliente: ClientType
): string => {
  const precio = obtenerPrecioPorTipoCliente(evento, tipoCliente);
  return formatearPrecio(precio);
};

