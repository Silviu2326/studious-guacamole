import { useState, useEffect, useCallback } from 'react';
import { 
  MovimientoCaja, 
  ArqueoCaja, 
  MovimientoBancario,
  ConciliacionBancaria,
  FiltroMovimientos,
  FiltroConciliacion,
  ConfiguracionCaja,
  CuentaBancaria
} from '../types';
import { CajaService } from '../services/cajaService';
import { BancosService } from '../services/bancosService';

export const useCajaBancos = () => {
  // Estados de caja
  const [movimientos, setMovimientos] = useState<MovimientoCaja[]>([]);
  const [arqueos, setArqueos] = useState<ArqueoCaja[]>([]);
  const [configuracion, setConfiguracion] = useState<ConfiguracionCaja | null>(null);
  
  // Estados bancarios
  const [movimientosBancarios, setMovimientosBancarios] = useState<MovimientoBancario[]>([]);
  const [conciliaciones, setConciliaciones] = useState<ConciliacionBancaria[]>([]);
  const [cuentasBancarias, setCuentasBancarias] = useState<CuentaBancaria[]>([]);
  
  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Funciones de caja
  const cargarMovimientos = useCallback(async (filtros?: FiltroMovimientos) => {
    try {
      setLoading(true);
      setError(null);
      const data = await CajaService.obtenerMovimientos(filtros);
      setMovimientos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar movimientos');
    } finally {
      setLoading(false);
    }
  }, []);

  const crearMovimiento = useCallback(async (movimiento: Omit<MovimientoCaja, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const nuevoMovimiento = await CajaService.crearMovimiento(movimiento);
      setMovimientos(prev => [nuevoMovimiento, ...prev]);
      return nuevoMovimiento;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear movimiento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const actualizarMovimiento = useCallback(async (id: string, datos: Partial<MovimientoCaja>) => {
    try {
      setLoading(true);
      setError(null);
      const movimientoActualizado = await CajaService.actualizarMovimiento(id, datos);
      setMovimientos(prev => prev.map(m => m.id === id ? movimientoActualizado : m));
      return movimientoActualizado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar movimiento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const eliminarMovimiento = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await CajaService.eliminarMovimiento(id);
      setMovimientos(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar movimiento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cargarArqueos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CajaService.obtenerArqueos();
      setArqueos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar arqueos');
    } finally {
      setLoading(false);
    }
  }, []);

  const crearArqueo = useCallback(async (arqueo: Omit<ArqueoCaja, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const nuevoArqueo = await CajaService.crearArqueo(arqueo);
      setArqueos(prev => [nuevoArqueo, ...prev]);
      return nuevoArqueo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear arqueo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerSaldoCaja = useCallback(async () => {
    try {
      return await CajaService.calcularSaldoCaja();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al calcular saldo');
      return 0;
    }
  }, []);

  // Funciones bancarias
  const cargarMovimientosBancarios = useCallback(async (filtros?: FiltroConciliacion) => {
    try {
      setLoading(true);
      setError(null);
      const data = await BancosService.obtenerMovimientosBancarios(filtros);
      setMovimientosBancarios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar movimientos bancarios');
    } finally {
      setLoading(false);
    }
  }, []);

  const importarMovimientosBancarios = useCallback(async (archivo: File) => {
    try {
      setLoading(true);
      setError(null);
      const nuevosMovimientos = await BancosService.importarMovimientosBancarios(archivo);
      setMovimientosBancarios(prev => [...nuevosMovimientos, ...prev]);
      return nuevosMovimientos;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al importar movimientos');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const marcarConciliado = useCallback(async (movimientoId: string) => {
    try {
      setLoading(true);
      setError(null);
      const movimientoActualizado = await BancosService.marcarConciliado(movimientoId);
      setMovimientosBancarios(prev => 
        prev.map(m => m.id === movimientoId ? movimientoActualizado : m)
      );
      return movimientoActualizado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al marcar como conciliado');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cargarConciliaciones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await BancosService.obtenerConciliaciones();
      setConciliaciones(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar conciliaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  const crearConciliacion = useCallback(async (datos: {
    banco: string;
    cuenta: string;
    fechaInicio: Date;
    fechaFin: Date;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const nuevaConciliacion = await BancosService.crearConciliacion(datos);
      setConciliaciones(prev => [nuevaConciliacion, ...prev]);
      return nuevaConciliacion;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear conciliación');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cargarCuentasBancarias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await BancosService.obtenerCuentasBancarias();
      setCuentasBancarias(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar cuentas bancarias');
    } finally {
      setLoading(false);
    }
  }, []);

  const cargarConfiguracion = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CajaService.obtenerConfiguracion();
      setConfiguracion(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar configuración');
    } finally {
      setLoading(false);
    }
  }, []);

  // Estadísticas
  const obtenerEstadisticasDiarias = useCallback(async (fecha: Date) => {
    try {
      return await CajaService.obtenerEstadisticasDiarias(fecha);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener estadísticas');
      return { ingresos: 0, egresos: 0, saldo: 0, movimientos: 0 };
    }
  }, []);

  const obtenerEstadisticasBancarias = useCallback(async (periodo: 'semana' | 'mes' | 'trimestre') => {
    try {
      return await BancosService.obtenerEstadisticasBancarias(periodo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener estadísticas bancarias');
      return { 
        totalIngresos: 0, 
        totalEgresos: 0, 
        saldoNeto: 0, 
        movimientosPendientes: 0, 
        porcentajeConciliado: 0 
      };
    }
  }, []);

  // Limpiar error
  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    cargarMovimientos();
    cargarArqueos();
    cargarMovimientosBancarios();
    cargarConciliaciones();
    cargarCuentasBancarias();
    cargarConfiguracion();
  }, []);

  return {
    // Estados
    movimientos,
    arqueos,
    movimientosBancarios,
    conciliaciones,
    cuentasBancarias,
    configuracion,
    loading,
    error,
    
    // Funciones de caja
    cargarMovimientos,
    crearMovimiento,
    actualizarMovimiento,
    eliminarMovimiento,
    cargarArqueos,
    crearArqueo,
    obtenerSaldoCaja,
    
    // Funciones bancarias
    cargarMovimientosBancarios,
    importarMovimientosBancarios,
    marcarConciliado,
    cargarConciliaciones,
    crearConciliacion,
    cargarCuentasBancarias,
    cargarConfiguracion,
    
    // Estadísticas
    obtenerEstadisticasDiarias,
    obtenerEstadisticasBancarias,
    
    // Utilidades
    limpiarError
  };
};