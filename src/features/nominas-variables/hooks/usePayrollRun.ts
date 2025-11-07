// Hook personalizado para gestión de ciclos de nómina
import { useState, useEffect, useCallback } from 'react';
import { payrollApi } from '../api/payrollApi';
import { PayrollRun, Period, AdjustmentData } from '../types';

interface UsePayrollRunParams {
  gymId: string;
  period: Period;
}

interface UsePayrollRunReturn {
  data: PayrollRun | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  generateRun: () => Promise<void>;
  finalizeRun: () => Promise<void>;
  addAdjustment: (adjustment: AdjustmentData) => Promise<void>;
  exportCSV: () => Promise<void>;
  exportPDF: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const usePayrollRun = ({ gymId, period }: UsePayrollRunParams): UsePayrollRunReturn => {
  const [data, setData] = useState<PayrollRun | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar ciclo de nómina
  const loadPayrollRun = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const payrollRun = await payrollApi.obtenerPayrollRun(period);
      setData(payrollRun);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err.message : 'Error al cargar el ciclo de nómina');
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  // Generar nuevo ciclo de nómina
  const generateRun = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const newRun = await payrollApi.generarPayrollRun({ period });
      setData(newRun);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err.message : 'Error al generar el ciclo de nómina');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  // Finalizar ciclo de nómina
  const finalizeRun = useCallback(async () => {
    if (!data) {
      throw new Error('No hay ciclo de nómina para finalizar');
    }

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const finalizedRun = await payrollApi.finalizarPayrollRun(data.runId);
      setData(finalizedRun);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err.message : 'Error al finalizar el ciclo de nómina');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  // Agregar ajuste manual
  const addAdjustment = useCallback(async (adjustment: AdjustmentData) => {
    if (!data) {
      throw new Error('No hay ciclo de nómina para agregar ajuste');
    }

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      await payrollApi.agregarAjuste(data.runId, adjustment);
      // Recargar el ciclo para obtener los datos actualizados
      await loadPayrollRun();
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err.message : 'Error al agregar el ajuste');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [data, loadPayrollRun]);

  // Exportar a CSV
  const exportCSV = useCallback(async () => {
    if (!data) {
      throw new Error('No hay ciclo de nómina para exportar');
    }

    try {
      const blob = await payrollApi.exportarCSV(data.runId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nomina_${data.period.month}_${data.period.year}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al exportar la nómina');
      throw err;
    }
  }, [data]);

  // Exportar a PDF
  const exportPDF = useCallback(async () => {
    if (!data) {
      throw new Error('No hay ciclo de nómina para exportar');
    }

    try {
      const blob = await payrollApi.exportarPDF(data.runId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nomina_${data.period.month}_${data.period.year}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al exportar la nómina');
      throw err;
    }
  }, [data]);

  // Refrescar datos
  const refresh = useCallback(async () => {
    await loadPayrollRun();
  }, [loadPayrollRun]);

  // Cargar datos iniciales
  useEffect(() => {
    loadPayrollRun();
  }, [loadPayrollRun]);

  return {
    data,
    isLoading,
    isError,
    error,
    generateRun,
    finalizeRun,
    addAdjustment,
    exportCSV,
    exportPDF,
    refresh,
  };
};

