import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { adherenciaService } from '../services/adherenciaService';
import {
  AdherenciaCliente,
  OcupacionClase,
  MetricasAdherencia,
  AlertaAdherencia,
  TendenciaAdherencia,
  RecomendacionMejora,
  FiltrosAdherencia,
  TipoNegocio
} from '../types';

interface UseAdherenciaReturn {
  // Estado
  adherencias: AdherenciaCliente[];
  ocupaciones: OcupacionClase[];
  metricas: MetricasAdherencia | null;
  alertas: AlertaAdherencia[];
  tendencias: TendenciaAdherencia[];
  recomendaciones: RecomendacionMejora[];
  loading: boolean;
  error: string | null;

  // Acciones para Entrenadores
  obtenerAdherenciaCliente: (clienteId: string) => Promise<void>;
  registrarSesionCompletada: (sesionId: string, notas?: string) => Promise<void>;
  registrarSesionIncumplida: (sesionId: string, motivo: string) => Promise<void>;

  // Acciones para Gimnasios
  obtenerOcupacionClase: (claseId: string) => Promise<void>;
  registrarAsistenciaClase: (claseId: string, asistentes: string[]) => Promise<void>;

  // Acciones Comunes
  cargarMetricas: (filtros?: FiltrosAdherencia) => Promise<void>;
  cargarAlertas: (soloNoLeidas?: boolean) => Promise<void>;
  cargarTendencias: (periodo?: number) => Promise<void>;
  cargarRecomendaciones: (filtros?: FiltrosAdherencia) => Promise<void>;
  marcarAlertaComoLeida: (alertaId: string) => void;
  actualizarFiltros: (filtros: FiltrosAdherencia) => void;
}

export const useAdherencia = (): UseAdherenciaReturn => {
  const { user } = useAuth();
  const [adherencias, setAdherencias] = useState<AdherenciaCliente[]>([]);
  const [ocupaciones, setOcupaciones] = useState<OcupacionClase[]>([]);
  const [metricas, setMetricas] = useState<MetricasAdherencia | null>(null);
  const [alertas, setAlertas] = useState<AlertaAdherencia[]>([]);
  const [tendencias, setTendencias] = useState<TendenciaAdherencia[]>([]);
  const [recomendaciones, setRecomendaciones] = useState<RecomendacionMejora[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosAdherencia>({});

  const tipoNegocio: TipoNegocio = user?.role === 'entrenador' ? 'entrenador' : 'gimnasio';

  // Función para manejar errores
  const handleError = useCallback((error: any, mensaje: string) => {
    console.error(mensaje, error);
    setError(mensaje);
    setLoading(false);
  }, []);

  // Acciones para Entrenadores
  const obtenerAdherenciaCliente = useCallback(async (clienteId: string) => {
    if (!user || user.role !== 'entrenador') return;

    setLoading(true);
    setError(null);

    try {
      const adherencia = await adherenciaService.obtenerAdherenciaCliente(clienteId, user.id);
      if (adherencia) {
        setAdherencias(prev => {
          const index = prev.findIndex(a => a.clienteId === clienteId);
          if (index >= 0) {
            const newAdherencias = [...prev];
            newAdherencias[index] = adherencia;
            return newAdherencias;
          }
          return [...prev, adherencia];
        });
      }
    } catch (error) {
      handleError(error, 'Error al obtener adherencia del cliente');
    } finally {
      setLoading(false);
    }
  }, [user, handleError]);

  const registrarSesionCompletada = useCallback(async (sesionId: string, notas?: string) => {
    if (!user || user.role !== 'entrenador') return;

    setLoading(true);
    setError(null);

    try {
      await adherenciaService.registrarSesionCompletada(sesionId, notas);
      // Recargar métricas y alertas
      await cargarMetricas(filtros);
      await cargarAlertas();
    } catch (error) {
      handleError(error, 'Error al registrar sesión completada');
    } finally {
      setLoading(false);
    }
  }, [user, filtros, handleError]);

  const registrarSesionIncumplida = useCallback(async (sesionId: string, motivo: string) => {
    if (!user || user.role !== 'entrenador') return;

    setLoading(true);
    setError(null);

    try {
      await adherenciaService.registrarSesionIncumplida(sesionId, motivo);
      // Recargar métricas y alertas
      await cargarMetricas(filtros);
      await cargarAlertas();
    } catch (error) {
      handleError(error, 'Error al registrar sesión incumplida');
    } finally {
      setLoading(false);
    }
  }, [user, filtros, handleError]);

  // Acciones para Gimnasios
  const obtenerOcupacionClase = useCallback(async (claseId: string) => {
    if (!user || user.role !== 'gimnasio') return;

    setLoading(true);
    setError(null);

    try {
      const ocupacion = await adherenciaService.obtenerOcupacionClase(claseId);
      if (ocupacion) {
        setOcupaciones(prev => {
          const index = prev.findIndex(o => o.claseId === claseId);
          if (index >= 0) {
            const newOcupaciones = [...prev];
            newOcupaciones[index] = ocupacion;
            return newOcupaciones;
          }
          return [...prev, ocupacion];
        });
      }
    } catch (error) {
      handleError(error, 'Error al obtener ocupación de la clase');
    } finally {
      setLoading(false);
    }
  }, [user, handleError]);

  const registrarAsistenciaClase = useCallback(async (claseId: string, asistentes: string[]) => {
    if (!user || user.role !== 'gimnasio') return;

    setLoading(true);
    setError(null);

    try {
      await adherenciaService.registrarAsistenciaClase(claseId, asistentes);
      // Actualizar ocupación de la clase
      await obtenerOcupacionClase(claseId);
      // Recargar métricas y alertas
      await cargarMetricas(filtros);
      await cargarAlertas();
    } catch (error) {
      handleError(error, 'Error al registrar asistencia de la clase');
    } finally {
      setLoading(false);
    }
  }, [user, filtros, obtenerOcupacionClase, handleError]);

  // Acciones Comunes
  const cargarMetricas = useCallback(async (filtrosParam?: FiltrosAdherencia) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const filtrosActuales = filtrosParam || filtros;
      const metricasData = await adherenciaService.obtenerMetricas(tipoNegocio, filtrosActuales);
      setMetricas(metricasData);
    } catch (error) {
      handleError(error, 'Error al cargar métricas');
    } finally {
      setLoading(false);
    }
  }, [user, tipoNegocio, filtros, handleError]);

  const cargarAlertas = useCallback(async (soloNoLeidas: boolean = false) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const alertasData = await adherenciaService.obtenerAlertas(tipoNegocio, soloNoLeidas);
      setAlertas(alertasData);
    } catch (error) {
      handleError(error, 'Error al cargar alertas');
    } finally {
      setLoading(false);
    }
  }, [user, tipoNegocio, handleError]);

  const cargarTendencias = useCallback(async (periodo: number = 30) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const tendenciasData = await adherenciaService.obtenerTendencias(tipoNegocio, periodo);
      setTendencias(tendenciasData);
    } catch (error) {
      handleError(error, 'Error al cargar tendencias');
    } finally {
      setLoading(false);
    }
  }, [user, tipoNegocio, handleError]);

  const cargarRecomendaciones = useCallback(async (filtrosParam?: FiltrosAdherencia) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const filtrosActuales = filtrosParam || filtros;
      const recomendacionesData = await adherenciaService.obtenerRecomendaciones(tipoNegocio, filtrosActuales);
      setRecomendaciones(recomendacionesData);
    } catch (error) {
      handleError(error, 'Error al cargar recomendaciones');
    } finally {
      setLoading(false);
    }
  }, [user, tipoNegocio, filtros, handleError]);

  const marcarAlertaComoLeida = useCallback((alertaId: string) => {
    setAlertas(prev => 
      prev.map(alerta => 
        alerta.id === alertaId ? { ...alerta, leida: true } : alerta
      )
    );
  }, []);

  const actualizarFiltros = useCallback((nuevosFiltros: FiltrosAdherencia) => {
    setFiltros(nuevosFiltros);
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    if (user) {
      cargarMetricas();
      cargarAlertas();
      cargarTendencias();
      cargarRecomendaciones();
    }
  }, [user, cargarMetricas, cargarAlertas, cargarTendencias, cargarRecomendaciones]);

  // Recargar datos cuando cambien los filtros
  useEffect(() => {
    if (user && Object.keys(filtros).length > 0) {
      cargarMetricas(filtros);
      cargarRecomendaciones(filtros);
    }
  }, [filtros, user, cargarMetricas, cargarRecomendaciones]);

  return {
    // Estado
    adherencias,
    ocupaciones,
    metricas,
    alertas,
    tendencias,
    recomendaciones,
    loading,
    error,

    // Acciones para Entrenadores
    obtenerAdherenciaCliente,
    registrarSesionCompletada,
    registrarSesionIncumplida,

    // Acciones para Gimnasios
    obtenerOcupacionClase,
    registrarAsistenciaClase,

    // Acciones Comunes
    cargarMetricas,
    cargarAlertas,
    cargarTendencias,
    cargarRecomendaciones,
    marcarAlertaComoLeida,
    actualizarFiltros
  };
};