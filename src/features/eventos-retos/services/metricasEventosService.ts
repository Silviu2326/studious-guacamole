// Servicio para métricas generales de eventos (User Story US-ER-24)

import { Evento, TipoEvento, EstadoEvento } from '../api/events';
import { cargarEventos } from '../api/events';

export interface MetricasGeneralesEventos {
  // KPIs principales
  totalEventos: number;
  eventosProgramados: number;
  eventosEnCurso: number;
  eventosFinalizados: number;
  eventosCancelados: number;
  totalParticipantes: number;
  promedioParticipantesPorEvento: number;
  promedioAsistencia: number;
  totalIngresos: number;
  promedioIngresosPorEvento: number;
  
  // Tendencia mensual
  tendenciaMensual: TendenciaMensual[];
  
  // Comparativa con periodo anterior
  comparativaPeriodo: ComparativaPeriodo;
  
  // Tipo de evento más popular
  tipoEventoMasPopular: TipoEvento;
  eventosPorTipo: {
    presencial: number;
    virtual: number;
    reto: number;
  };
  participantesPorTipo: {
    presencial: number;
    virtual: number;
    reto: number;
  };
  ingresosPorTipo: {
    presencial: number;
    virtual: number;
    reto: number;
  };
  
  // Ingresos totales por eventos
  ingresosTotales: number;
  ingresosPorMes: IngresoPorMes[];
  
  // Eventos recientes
  eventosRecientes: EventoResumen[];
}

export interface TendenciaMensual {
  mes: string;
  año: number;
  totalEventos: number;
  totalParticipantes: number;
  totalAsistentes: number;
  tasaAsistencia: number;
  totalIngresos: number;
  eventosFinalizados: number;
}

export interface ComparativaPeriodo {
  periodoActual: {
    totalEventos: number;
    totalParticipantes: number;
    promedioAsistencia: number;
    totalIngresos: number;
    eventosFinalizados: number;
  };
  periodoAnterior: {
    totalEventos: number;
    totalParticipantes: number;
    promedioAsistencia: number;
    totalIngresos: number;
    eventosFinalizados: number;
  };
  variacion: {
    totalEventos: number;
    totalParticipantes: number;
    promedioAsistencia: number;
    totalIngresos: number;
    eventosFinalizados: number;
  };
  tendencia: {
    totalEventos: 'aumentando' | 'disminuyendo' | 'estable';
    totalParticipantes: 'aumentando' | 'disminuyendo' | 'estable';
    promedioAsistencia: 'aumentando' | 'disminuyendo' | 'estable';
    totalIngresos: 'aumentando' | 'disminuyendo' | 'estable';
    eventosFinalizados: 'aumentando' | 'disminuyendo' | 'estable';
  };
}

export interface IngresoPorMes {
  mes: string;
  año: number;
  ingresos: number;
  eventos: number;
}

export interface EventoResumen {
  id: string;
  nombre: string;
  tipo: TipoEvento;
  fechaInicio: Date;
  estado: EstadoEvento;
  participantes: number;
  asistentes: number;
  ingresos: number;
}

/**
 * Obtiene todas las métricas generales de eventos
 */
export const obtenerMetricasGeneralesEventos = (
  entrenadorId?: string,
  periodoMeses: number = 12
): MetricasGeneralesEventos => {
  const eventos = cargarEventos();
  
  // Filtrar por entrenador si se especifica
  const eventosFiltrados = entrenadorId
    ? eventos.filter(e => e.creadoPor === entrenadorId)
    : eventos;

  // KPIs principales
  const totalEventos = eventosFiltrados.length;
  const eventosProgramados = eventosFiltrados.filter(e => e.estado === 'programado').length;
  const eventosEnCurso = eventosFiltrados.filter(e => e.estado === 'en-curso').length;
  const eventosFinalizados = eventosFiltrados.filter(e => e.estado === 'finalizado').length;
  const eventosCancelados = eventosFiltrados.filter(e => e.estado === 'cancelado').length;

  // Calcular participantes y asistencias
  let totalParticipantes = 0;
  let totalAsistentes = 0;
  
  eventosFiltrados.forEach(evento => {
    const participantes = evento.participantesDetalle || [];
    const participantesActivos = participantes.filter(p => !p.fechaCancelacion);
    totalParticipantes += participantesActivos.length;
    totalAsistentes += participantesActivos.filter(p => p.asistencia).length;
  });

  const promedioParticipantesPorEvento = totalEventos > 0
    ? Math.round((totalParticipantes / totalEventos) * 10) / 10
    : 0;
  
  const promedioAsistencia = totalParticipantes > 0
    ? Math.round((totalAsistentes / totalParticipantes) * 100 * 10) / 10
    : 0;

  // Calcular ingresos
  let totalIngresos = 0;
  eventosFiltrados.forEach(evento => {
    if (evento.precio && !evento.esGratuito) {
      const participantes = evento.participantesDetalle || [];
      const participantesActivos = participantes.filter(p => !p.fechaCancelacion);
      totalIngresos += participantesActivos.length * evento.precio;
    } else if (evento.preciosPorTipoCliente) {
      const participantes = evento.participantesDetalle || [];
      const participantesActivos = participantes.filter(p => !p.fechaCancelacion);
      participantesActivos.forEach(participante => {
        // Simular cálculo de precio por tipo de cliente (simplificado)
        const precio = evento.preciosPorTipoCliente!['general'] || evento.precio || 0;
        totalIngresos += precio;
      });
    }
  });

  const promedioIngresosPorEvento = eventosFinalizados > 0
    ? Math.round((totalIngresos / eventosFinalizados) * 10) / 10
    : 0;

  // Tendencia mensual
  const tendenciaMensual = calcularTendenciaMensual(eventosFiltrados, periodoMeses);

  // Comparativa con periodo anterior
  const comparativaPeriodo = calcularComparativaPeriodo(eventosFiltrados);

  // Tipo de evento más popular
  const eventosPorTipo = {
    presencial: eventosFiltrados.filter(e => e.tipo === 'presencial').length,
    virtual: eventosFiltrados.filter(e => e.tipo === 'virtual').length,
    reto: eventosFiltrados.filter(e => e.tipo === 'reto').length,
  };

  const participantesPorTipo = {
    presencial: calcularParticipantesPorTipo(eventosFiltrados, 'presencial'),
    virtual: calcularParticipantesPorTipo(eventosFiltrados, 'virtual'),
    reto: calcularParticipantesPorTipo(eventosFiltrados, 'reto'),
  };

  const ingresosPorTipo = {
    presencial: calcularIngresosPorTipo(eventosFiltrados, 'presencial'),
    virtual: calcularIngresosPorTipo(eventosFiltrados, 'virtual'),
    reto: calcularIngresosPorTipo(eventosFiltrados, 'reto'),
  };

  const tipoEventoMasPopular = eventosPorTipo.presencial > eventosPorTipo.virtual && eventosPorTipo.presencial > eventosPorTipo.reto
    ? 'presencial' as TipoEvento
    : eventosPorTipo.virtual > eventosPorTipo.reto
    ? 'virtual' as TipoEvento
    : 'reto' as TipoEvento;

  // Ingresos por mes
  const ingresosPorMes = calcularIngresosPorMes(eventosFiltrados, periodoMeses);

  // Eventos recientes
  const eventosRecientes = eventosFiltrados
    .sort((a, b) => b.fechaInicio.getTime() - a.fechaInicio.getTime())
    .slice(0, 10)
    .map(evento => ({
      id: evento.id,
      nombre: evento.nombre,
      tipo: evento.tipo,
      fechaInicio: evento.fechaInicio,
      estado: evento.estado,
      participantes: (evento.participantesDetalle || []).filter(p => !p.fechaCancelacion).length,
      asistentes: (evento.participantesDetalle || []).filter(p => p.asistencia).length,
      ingresos: calcularIngresosEvento(evento),
    }));

  return {
    totalEventos,
    eventosProgramados,
    eventosEnCurso,
    eventosFinalizados,
    eventosCancelados,
    totalParticipantes,
    promedioParticipantesPorEvento,
    promedioAsistencia,
    totalIngresos: Math.round(totalIngresos * 100) / 100,
    promedioIngresosPorEvento,
    tendenciaMensual,
    comparativaPeriodo,
    tipoEventoMasPopular,
    eventosPorTipo,
    participantesPorTipo,
    ingresosPorTipo,
    ingresosTotales: Math.round(totalIngresos * 100) / 100,
    ingresosPorMes,
    eventosRecientes,
  };
};

/**
 * Calcula la tendencia mensual
 */
const calcularTendenciaMensual = (eventos: Evento[], periodoMeses: number): TendenciaMensual[] => {
  const ahora = new Date();
  const tendencia: TendenciaMensual[] = [];
  const meses: Record<string, TendenciaMensual> = {};

  // Inicializar meses
  for (let i = periodoMeses - 1; i >= 0; i--) {
    const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
    const clave = `${fecha.getFullYear()}-${fecha.getMonth()}`;
    const nombreMes = fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    
    meses[clave] = {
      mes: nombreMes,
      año: fecha.getFullYear(),
      totalEventos: 0,
      totalParticipantes: 0,
      totalAsistentes: 0,
      tasaAsistencia: 0,
      totalIngresos: 0,
      eventosFinalizados: 0,
    };
  }

  // Procesar eventos
  eventos.forEach(evento => {
    const fechaInicio = new Date(evento.fechaInicio);
    const clave = `${fechaInicio.getFullYear()}-${fechaInicio.getMonth()}`;
    
    if (meses[clave]) {
      meses[clave].totalEventos++;
      
      const participantes = evento.participantesDetalle || [];
      const participantesActivos = participantes.filter(p => !p.fechaCancelacion);
      const asistentes = participantesActivos.filter(p => p.asistencia);
      
      meses[clave].totalParticipantes += participantesActivos.length;
      meses[clave].totalAsistentes += asistentes.length;
      meses[clave].totalIngresos += calcularIngresosEvento(evento);
      
      if (evento.estado === 'finalizado') {
        meses[clave].eventosFinalizados++;
      }
    }
  });

  // Calcular tasas de asistencia
  Object.values(meses).forEach(mes => {
    mes.tasaAsistencia = mes.totalParticipantes > 0
      ? Math.round((mes.totalAsistentes / mes.totalParticipantes) * 100 * 10) / 10
      : 0;
    mes.totalIngresos = Math.round(mes.totalIngresos * 100) / 100;
  });

  return Object.values(meses);
};

/**
 * Calcula la comparativa con el periodo anterior
 */
const calcularComparativaPeriodo = (eventos: Evento[]): ComparativaPeriodo => {
  const ahora = new Date();
  const mesActual = ahora.getMonth();
  const añoActual = ahora.getFullYear();
  
  // Periodo actual (últimos 30 días)
  const fechaInicioActual = new Date(añoActual, mesActual, 1);
  const fechaFinActual = new Date(añoActual, mesActual + 1, 0);
  
  // Periodo anterior (mes anterior)
  const fechaInicioAnterior = new Date(añoActual, mesActual - 1, 1);
  const fechaFinAnterior = new Date(añoActual, mesActual, 0);

  const eventosActual = eventos.filter(e => {
    const fecha = new Date(e.fechaInicio);
    return fecha >= fechaInicioActual && fecha <= fechaFinActual;
  });

  const eventosAnterior = eventos.filter(e => {
    const fecha = new Date(e.fechaInicio);
    return fecha >= fechaInicioAnterior && fecha <= fechaFinAnterior;
  });

  const periodoActual = calcularMetricasPeriodo(eventosActual);
  const periodoAnterior = calcularMetricasPeriodo(eventosAnterior);

  // Calcular variaciones
  const variacion = {
    totalEventos: periodoAnterior.totalEventos > 0
      ? Math.round(((periodoActual.totalEventos - periodoAnterior.totalEventos) / periodoAnterior.totalEventos) * 100 * 10) / 10
      : periodoActual.totalEventos > 0 ? 100 : 0,
    totalParticipantes: periodoAnterior.totalParticipantes > 0
      ? Math.round(((periodoActual.totalParticipantes - periodoAnterior.totalParticipantes) / periodoAnterior.totalParticipantes) * 100 * 10) / 10
      : periodoActual.totalParticipantes > 0 ? 100 : 0,
    promedioAsistencia: periodoAnterior.promedioAsistencia > 0
      ? Math.round((periodoActual.promedioAsistencia - periodoAnterior.promedioAsistencia) * 10) / 10
      : periodoActual.promedioAsistencia,
    totalIngresos: periodoAnterior.totalIngresos > 0
      ? Math.round(((periodoActual.totalIngresos - periodoAnterior.totalIngresos) / periodoAnterior.totalIngresos) * 100 * 10) / 10
      : periodoActual.totalIngresos > 0 ? 100 : 0,
    eventosFinalizados: periodoAnterior.eventosFinalizados > 0
      ? Math.round(((periodoActual.eventosFinalizados - periodoAnterior.eventosFinalizados) / periodoAnterior.eventosFinalizados) * 100 * 10) / 10
      : periodoActual.eventosFinalizados > 0 ? 100 : 0,
  };

  // Determinar tendencias
  const determinarTendencia = (variacion: number): 'aumentando' | 'disminuyendo' | 'estable' => {
    if (variacion > 5) return 'aumentando';
    if (variacion < -5) return 'disminuyendo';
    return 'estable';
  };

  const tendencia = {
    totalEventos: determinarTendencia(variacion.totalEventos),
    totalParticipantes: determinarTendencia(variacion.totalParticipantes),
    promedioAsistencia: determinarTendencia(variacion.promedioAsistencia),
    totalIngresos: determinarTendencia(variacion.totalIngresos),
    eventosFinalizados: determinarTendencia(variacion.eventosFinalizados),
  };

  return {
    periodoActual,
    periodoAnterior,
    variacion,
    tendencia,
  };
};

/**
 * Calcula métricas para un periodo
 */
const calcularMetricasPeriodo = (eventos: Evento[]): {
  totalEventos: number;
  totalParticipantes: number;
  promedioAsistencia: number;
  totalIngresos: number;
  eventosFinalizados: number;
} => {
  let totalParticipantes = 0;
  let totalAsistentes = 0;
  let totalIngresos = 0;
  let eventosFinalizados = 0;

  eventos.forEach(evento => {
    const participantes = evento.participantesDetalle || [];
    const participantesActivos = participantes.filter(p => !p.fechaCancelacion);
    totalParticipantes += participantesActivos.length;
    totalAsistentes += participantesActivos.filter(p => p.asistencia).length;
    totalIngresos += calcularIngresosEvento(evento);
    
    if (evento.estado === 'finalizado') {
      eventosFinalizados++;
    }
  });

  const promedioAsistencia = totalParticipantes > 0
    ? Math.round((totalAsistentes / totalParticipantes) * 100 * 10) / 10
    : 0;

  return {
    totalEventos: eventos.length,
    totalParticipantes,
    promedioAsistencia,
    totalIngresos: Math.round(totalIngresos * 100) / 100,
    eventosFinalizados,
  };
};

/**
 * Calcula participantes por tipo de evento
 */
const calcularParticipantesPorTipo = (eventos: Evento[], tipo: TipoEvento): number => {
  return eventos
    .filter(e => e.tipo === tipo)
    .reduce((total, evento) => {
      const participantes = evento.participantesDetalle || [];
      return total + participantes.filter(p => !p.fechaCancelacion).length;
    }, 0);
};

/**
 * Calcula ingresos por tipo de evento
 */
const calcularIngresosPorTipo = (eventos: Evento[], tipo: TipoEvento): number => {
  return eventos
    .filter(e => e.tipo === tipo)
    .reduce((total, evento) => total + calcularIngresosEvento(evento), 0);
};

/**
 * Calcula ingresos de un evento
 */
const calcularIngresosEvento = (evento: Evento): number => {
  if (evento.esGratuito || !evento.precio) {
    return 0;
  }

  const participantes = evento.participantesDetalle || [];
  const participantesActivos = participantes.filter(p => !p.fechaCancelacion);

  if (evento.preciosPorTipoCliente) {
    // Calcular ingresos por tipo de cliente (simplificado)
    return participantesActivos.length * (evento.preciosPorTipoCliente['general'] || evento.precio || 0);
  }

  return participantesActivos.length * evento.precio;
};

/**
 * Calcula ingresos por mes
 */
const calcularIngresosPorMes = (eventos: Evento[], periodoMeses: number): IngresoPorMes[] => {
  const ahora = new Date();
  const ingresos: Record<string, IngresoPorMes> = {};

  // Inicializar meses
  for (let i = periodoMeses - 1; i >= 0; i--) {
    const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
    const clave = `${fecha.getFullYear()}-${fecha.getMonth()}`;
    const nombreMes = fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    
    ingresos[clave] = {
      mes: nombreMes,
      año: fecha.getFullYear(),
      ingresos: 0,
      eventos: 0,
    };
  }

  // Procesar eventos
  eventos.forEach(evento => {
    const fechaInicio = new Date(evento.fechaInicio);
    const clave = `${fechaInicio.getFullYear()}-${fechaInicio.getMonth()}`;
    
    if (ingresos[clave]) {
      ingresos[clave].ingresos += calcularIngresosEvento(evento);
      ingresos[clave].eventos++;
    }
  });

  return Object.values(ingresos).map(i => ({
    ...i,
    ingresos: Math.round(i.ingresos * 100) / 100,
  }));
};


