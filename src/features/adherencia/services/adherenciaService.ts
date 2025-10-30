import {
  SesionEntrenamiento,
  ClaseGimnasio,
  AdherenciaCliente,
  OcupacionClase,
  MetricasAdherencia,
  AlertaAdherencia,
  TendenciaAdherencia,
  RecomendacionMejora,
  FiltrosAdherencia,
  TipoNegocio
} from '../types';

class AdherenciaService {
  // Simulación de datos - En producción vendría de una API
  private sesiones: SesionEntrenamiento[] = [];
  private clases: ClaseGimnasio[] = [];
  private adherencias: AdherenciaCliente[] = [];
  private ocupaciones: OcupacionClase[] = [];
  private alertas: AlertaAdherencia[] = [];

  // Métodos para Entrenadores Personales
  async obtenerAdherenciaCliente(clienteId: string, entrenadorId: string): Promise<AdherenciaCliente | null> {
    const sesionesCliente = this.sesiones.filter(
      s => s.clienteId === clienteId && s.entrenadorId === entrenadorId
    );

    if (sesionesCliente.length === 0) return null;

    const sesionesCompletadas = sesionesCliente.filter(s => s.completada).length;
    const porcentajeAdherencia = (sesionesCompletadas / sesionesCliente.length) * 100;

    return {
      clienteId,
      entrenadorId,
      sesionesTotales: sesionesCliente.length,
      sesionesCompletadas,
      porcentajeAdherencia,
      ultimaSesion: sesionesCliente
        .filter(s => s.fechaEjecucion)
        .sort((a, b) => new Date(b.fechaEjecucion!).getTime() - new Date(a.fechaEjecucion!).getTime())[0]?.fechaEjecucion,
      tendencia: this.calcularTendenciaCliente(clienteId, entrenadorId),
      alertaActiva: porcentajeAdherencia < 70
    };
  }

  async registrarSesionCompletada(sesionId: string, notas?: string): Promise<void> {
    const sesion = this.sesiones.find(s => s.id === sesionId);
    if (sesion) {
      sesion.completada = true;
      sesion.fechaEjecucion = new Date();
      if (notas) sesion.notas = notas;
      
      // Actualizar adherencia del cliente
      await this.actualizarAdherenciaCliente(sesion.clienteId, sesion.entrenadorId);
    }
  }

  async registrarSesionIncumplida(sesionId: string, motivo: string): Promise<void> {
    const sesion = this.sesiones.find(s => s.id === sesionId);
    if (sesion) {
      sesion.completada = false;
      sesion.motivoIncumplimiento = motivo;
      
      // Crear alerta si es necesario
      await this.verificarYCrearAlerta(sesion.clienteId, sesion.entrenadorId);
    }
  }

  // Métodos para Gimnasios
  async obtenerOcupacionClase(claseId: string): Promise<OcupacionClase | null> {
    const clase = this.clases.find(c => c.id === claseId);
    if (!clase) return null;

    const porcentajeOcupacion = (clase.plazasOcupadas / clase.plazasDisponibles) * 100;

    return {
      claseId,
      fecha: clase.fechaHora,
      porcentajeOcupacion,
      plazasDisponibles: clase.plazasDisponibles,
      plazasOcupadas: clase.plazasOcupadas,
      tendenciaOcupacion: this.calcularTendenciaClase(claseId)
    };
  }

  async registrarAsistenciaClase(claseId: string, asistentes: string[]): Promise<void> {
    const clase = this.clases.find(c => c.id === claseId);
    if (clase) {
      clase.asistentes = asistentes;
      clase.plazasOcupadas = asistentes.length;
      
      // Verificar si necesita alerta por baja ocupación
      const porcentajeOcupacion = (clase.plazasOcupadas / clase.plazasDisponibles) * 100;
      if (porcentajeOcupacion < 50) {
        await this.crearAlertaBajaOcupacion(claseId);
      }
    }
  }

  // Métodos de Análisis y Métricas
  async obtenerMetricas(tipoNegocio: TipoNegocio, filtros: FiltrosAdherencia): Promise<MetricasAdherencia> {
    const periodo = {
      inicio: filtros.fechaInicio || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      fin: filtros.fechaFin || new Date()
    };

    if (tipoNegocio === 'entrenador') {
      return this.calcularMetricasEntrenador(periodo, filtros);
    } else {
      return this.calcularMetricasGimnasio(periodo, filtros);
    }
  }

  async obtenerTendencias(tipoNegocio: TipoNegocio, periodo: number = 30): Promise<TendenciaAdherencia[]> {
    const fechaInicio = new Date(Date.now() - periodo * 24 * 60 * 60 * 1000);
    const fechaFin = new Date();

    if (tipoNegocio === 'entrenador') {
      return this.calcularTendenciasEntrenador(fechaInicio, fechaFin);
    } else {
      return this.calcularTendenciasGimnasio(fechaInicio, fechaFin);
    }
  }

  async obtenerAlertas(tipoNegocio: TipoNegocio, soloNoLeidas: boolean = false): Promise<AlertaAdherencia[]> {
    let alertasFiltradas = this.alertas.filter(alerta => {
      if (tipoNegocio === 'entrenador') {
        return alerta.tipo === 'baja_adherencia_cliente' || alerta.tipo === 'tendencia_negativa';
      } else {
        return alerta.tipo === 'baja_ocupacion_clase' || alerta.tipo === 'tendencia_negativa';
      }
    });

    if (soloNoLeidas) {
      alertasFiltradas = alertasFiltradas.filter(a => !a.leida);
    }

    return alertasFiltradas.sort((a, b) => 
      new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
    );
  }

  async obtenerRecomendaciones(tipoNegocio: TipoNegocio, filtros: FiltrosAdherencia): Promise<RecomendacionMejora[]> {
    if (tipoNegocio === 'entrenador') {
      return this.generarRecomendacionesEntrenador(filtros);
    } else {
      return this.generarRecomendacionesGimnasio(filtros);
    }
  }

  // Métodos privados de cálculo
  private calcularTendenciaCliente(clienteId: string, entrenadorId: string): 'mejorando' | 'estable' | 'empeorando' {
    // Lógica simplificada - en producción sería más compleja
    const sesionesRecientes = this.sesiones
      .filter(s => s.clienteId === clienteId && s.entrenadorId === entrenadorId)
      .sort((a, b) => new Date(b.fechaProgramada).getTime() - new Date(a.fechaProgramada).getTime())
      .slice(0, 10);

    if (sesionesRecientes.length < 5) return 'estable';

    const recientes = sesionesRecientes.slice(0, 5).filter(s => s.completada).length;
    const anteriores = sesionesRecientes.slice(5, 10).filter(s => s.completada).length;

    if (recientes > anteriores) return 'mejorando';
    if (recientes < anteriores) return 'empeorando';
    return 'estable';
  }

  private calcularTendenciaClase(claseId: string): 'creciente' | 'estable' | 'decreciente' {
    // Lógica simplificada para calcular tendencia de ocupación
    return 'estable';
  }

  private async actualizarAdherenciaCliente(clienteId: string, entrenadorId: string): Promise<void> {
    const adherencia = await this.obtenerAdherenciaCliente(clienteId, entrenadorId);
    if (adherencia) {
      const index = this.adherencias.findIndex(
        a => a.clienteId === clienteId && a.entrenadorId === entrenadorId
      );
      if (index >= 0) {
        this.adherencias[index] = adherencia;
      } else {
        this.adherencias.push(adherencia);
      }
    }
  }

  private async verificarYCrearAlerta(clienteId: string, entrenadorId: string): Promise<void> {
    const adherencia = await this.obtenerAdherenciaCliente(clienteId, entrenadorId);
    if (adherencia && adherencia.porcentajeAdherencia < 70) {
      const alerta: AlertaAdherencia = {
        id: `alerta_${Date.now()}`,
        tipo: 'baja_adherencia_cliente',
        mensaje: `Cliente con baja adherencia: ${adherencia.porcentajeAdherencia.toFixed(1)}%`,
        prioridad: adherencia.porcentajeAdherencia < 50 ? 'alta' : 'media',
        fechaCreacion: new Date(),
        leida: false,
        clienteId,
        accionRecomendada: 'Contactar al cliente para revisar el programa de entrenamiento'
      };
      this.alertas.push(alerta);
    }
  }

  private async crearAlertaBajaOcupacion(claseId: string): Promise<void> {
    const clase = this.clases.find(c => c.id === claseId);
    if (clase) {
      const porcentajeOcupacion = (clase.plazasOcupadas / clase.plazasDisponibles) * 100;
      const alerta: AlertaAdherencia = {
        id: `alerta_ocupacion_${Date.now()}`,
        tipo: 'baja_ocupacion_clase',
        mensaje: `Clase con baja ocupación: ${porcentajeOcupacion.toFixed(1)}%`,
        prioridad: porcentajeOcupacion < 30 ? 'alta' : 'media',
        fechaCreacion: new Date(),
        leida: false,
        claseId,
        accionRecomendada: 'Revisar horario y promocionar la clase'
      };
      this.alertas.push(alerta);
    }
  }

  private calcularMetricasEntrenador(periodo: { inicio: Date; fin: Date }, filtros: FiltrosAdherencia): MetricasAdherencia {
    const sesionesEnPeriodo = this.sesiones.filter(s => 
      new Date(s.fechaProgramada) >= periodo.inicio && 
      new Date(s.fechaProgramada) <= periodo.fin &&
      (!filtros.entrenadorId || s.entrenadorId === filtros.entrenadorId)
    );

    const sesionesCompletadas = sesionesEnPeriodo.filter(s => s.completada).length;
    const clientesUnicos = new Set(sesionesEnPeriodo.map(s => s.clienteId)).size;
    const adherenciaPromedio = sesionesEnPeriodo.length > 0 ? 
      (sesionesCompletadas / sesionesEnPeriodo.length) * 100 : 0;

    return {
      tipoNegocio: 'entrenador',
      periodo,
      adherenciaPromedio,
      clientesActivos: clientesUnicos,
      clientesConBajaAdherencia: this.adherencias.filter(a => a.porcentajeAdherencia < 70).length,
      sesionesTotalesProgramadas: sesionesEnPeriodo.length,
      sesionesCompletadas
    };
  }

  private calcularMetricasGimnasio(periodo: { inicio: Date; fin: Date }, filtros: FiltrosAdherencia): MetricasAdherencia {
    const clasesEnPeriodo = this.clases.filter(c => 
      new Date(c.fechaHora) >= periodo.inicio && 
      new Date(c.fechaHora) <= periodo.fin &&
      (!filtros.tipoClase || c.tipoClase === filtros.tipoClase)
    );

    const ocupacionTotal = clasesEnPeriodo.reduce((sum, c) => sum + c.plazasOcupadas, 0);
    const capacidadTotal = clasesEnPeriodo.reduce((sum, c) => sum + c.plazasDisponibles, 0);
    const ocupacionPromedio = capacidadTotal > 0 ? (ocupacionTotal / capacidadTotal) * 100 : 0;

    return {
      tipoNegocio: 'gimnasio',
      periodo,
      ocupacionPromedio,
      clasesTotales: clasesEnPeriodo.length,
      clasesConBajaOcupacion: clasesEnPeriodo.filter(c => 
        (c.plazasOcupadas / c.plazasDisponibles) * 100 < 50
      ).length,
      asistenciaTotal: ocupacionTotal,
      capacidadTotal
    };
  }

  private calcularTendenciasEntrenador(fechaInicio: Date, fechaFin: Date): TendenciaAdherencia[] {
    // Implementación simplificada - en producción sería más detallada
    return [
      { periodo: 'Última semana', valor: 85, cambio: 5, porcentajeCambio: 6.25 },
      { periodo: 'Último mes', valor: 80, cambio: -2, porcentajeCambio: -2.44 }
    ];
  }

  private calcularTendenciasGimnasio(fechaInicio: Date, fechaFin: Date): TendenciaAdherencia[] {
    return [
      { periodo: 'Última semana', valor: 75, cambio: 3, porcentajeCambio: 4.17 },
      { periodo: 'Último mes', valor: 72, cambio: -1, porcentajeCambio: -1.37 }
    ];
  }

  private generarRecomendacionesEntrenador(filtros: FiltrosAdherencia): RecomendacionMejora[] {
    return [
      {
        id: 'rec_1',
        tipo: 'comunicacion',
        titulo: 'Mejorar comunicación con clientes',
        descripcion: 'Implementar recordatorios automáticos 24h antes de cada sesión',
        impactoEstimado: 15,
        facilidadImplementacion: 'facil'
      },
      {
        id: 'rec_2',
        tipo: 'programa',
        titulo: 'Personalizar programas',
        descripcion: 'Ajustar intensidad según adherencia histórica del cliente',
        impactoEstimado: 25,
        facilidadImplementacion: 'medio'
      }
    ];
  }

  private generarRecomendacionesGimnasio(filtros: FiltrosAdherencia): RecomendacionMejora[] {
    return [
      {
        id: 'rec_gym_1',
        tipo: 'horario',
        titulo: 'Optimizar horarios de clases',
        descripcion: 'Mover clases con baja ocupación a horarios de mayor demanda',
        impactoEstimado: 20,
        facilidadImplementacion: 'medio'
      },
      {
        id: 'rec_gym_2',
        tipo: 'motivacion',
        titulo: 'Programa de incentivos',
        descripcion: 'Crear sistema de puntos por asistencia regular a clases',
        impactoEstimado: 30,
        facilidadImplementacion: 'dificil'
      }
    ];
  }
}

export const adherenciaService = new AdherenciaService();