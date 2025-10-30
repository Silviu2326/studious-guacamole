import { useState, useEffect, useCallback } from 'react';
import {
  RestriccionAlimentaria,
  AlertaSeguridad,
  ValidacionIngrediente,
  SustitucionSegura,
  FormularioRestriccion,
  FiltrosRestricciones,
  FiltrosAlertas,
  UseRestriccionesResult,
  UseAlertasResult,
  ReporteCompliance
} from '../types';
import { restriccionesService } from '../services/restriccionesService';

export const useRestricciones = (clienteId?: string): UseRestriccionesResult => {
  const [restricciones, setRestricciones] = useState<RestriccionAlimentaria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarRestricciones = useCallback(async (filtros?: FiltrosRestricciones) => {
    try {
      setLoading(true);
      setError(null);
      
      const filtrosConCliente = clienteId 
        ? { ...filtros, clienteId }
        : filtros;
      
      const data = await restriccionesService.obtenerRestricciones(filtrosConCliente);
      setRestricciones(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar restricciones');
    } finally {
      setLoading(false);
    }
  }, [clienteId]);

  const crearRestriccion = useCallback(async (restriccion: FormularioRestriccion, targetClienteId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const nuevaRestriccion = await restriccionesService.crearRestriccion(restriccion, targetClienteId);
      setRestricciones(prev => [...prev, nuevaRestriccion]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear restricción');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const actualizarRestriccion = useCallback(async (id: string, restriccion: Partial<FormularioRestriccion>) => {
    try {
      setLoading(true);
      setError(null);
      
      const restriccionActualizada = await restriccionesService.actualizarRestriccion(id, restriccion);
      setRestricciones(prev => 
        prev.map(r => r.id === id ? restriccionActualizada : r)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar restricción');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const eliminarRestriccion = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await restriccionesService.eliminarRestriccion(id);
      setRestricciones(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar restricción');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const validarIngrediente = useCallback(async (ingredienteId: string, targetClienteId: string): Promise<ValidacionIngrediente> => {
    try {
      setError(null);
      return await restriccionesService.validarIngrediente(ingredienteId, targetClienteId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al validar ingrediente';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const obtenerSustituciones = useCallback(async (ingredienteId: string, tipoRestriccion: any): Promise<SustitucionSegura[]> => {
    try {
      setError(null);
      return await restriccionesService.obtenerSustituciones(ingredienteId, tipoRestriccion);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener sustituciones';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  useEffect(() => {
    cargarRestricciones();
  }, [cargarRestricciones]);

  return {
    restricciones,
    loading,
    error,
    crearRestriccion,
    actualizarRestriccion,
    eliminarRestriccion,
    validarIngrediente,
    obtenerSustituciones
  };
};

export const useAlertas = (clienteId?: string): UseAlertasResult => {
  const [alertas, setAlertas] = useState<AlertaSeguridad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarAlertas = useCallback(async (filtros?: FiltrosAlertas) => {
    try {
      setLoading(true);
      setError(null);
      
      const filtrosConCliente = clienteId 
        ? { ...filtros, clienteId }
        : filtros;
      
      const data = await restriccionesService.obtenerAlertas(filtrosConCliente);
      setAlertas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar alertas');
    } finally {
      setLoading(false);
    }
  }, [clienteId]);

  const marcarComoResuelta = useCallback(async (alertaId: string, accion: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await restriccionesService.marcarAlertaComoResuelta(alertaId, accion);
      setAlertas(prev => 
        prev.map(a => a.id === alertaId 
          ? { ...a, estado: 'resuelta' as const, fechaResolucion: new Date() }
          : a
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al resolver alerta');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const ignorarAlerta = useCallback(async (alertaId: string, razon: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await restriccionesService.ignorarAlerta(alertaId, razon);
      setAlertas(prev => 
        prev.map(a => a.id === alertaId 
          ? { ...a, estado: 'ignorada' as const }
          : a
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al ignorar alerta');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generarReporte = useCallback(async (periodo: { inicio: Date; fin: Date }): Promise<ReporteCompliance> => {
    try {
      setError(null);
      return await restriccionesService.generarReporteCompliance(periodo);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al generar reporte';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  useEffect(() => {
    cargarAlertas();
  }, [cargarAlertas]);

  return {
    alertas,
    loading,
    error,
    marcarComoResuelta,
    ignorarAlerta,
    generarReporte
  };
};

// Hook para estadísticas
export const useEstadisticasRestricciones = () => {
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarEstadisticas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular carga de estadísticas
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const stats = {
        totalRestricciones: 156,
        restriccionesPorTipo: {
          alergia: 45,
          intolerancia: 38,
          religiosa: 42,
          cultural: 31
        },
        restriccionesPorSeveridad: {
          leve: 62,
          moderada: 54,
          severa: 28,
          critica: 12
        },
        clientesConRestricciones: 89,
        alertasUltimos30Dias: 23,
        tendenciaAlertas: 'disminuyendo' as const,
        ingredientesMasProblematicos: [
          { ingrediente: 'Gluten', alertas: 12 },
          { ingrediente: 'Lactosa', alertas: 8 },
          { ingrediente: 'Maní', alertas: 6 },
          { ingrediente: 'Huevo', alertas: 4 }
        ]
      };
      
      setEstadisticas(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarEstadisticas();
  }, [cargarEstadisticas]);

  return {
    estadisticas,
    loading,
    error,
    recargar: cargarEstadisticas
  };
};