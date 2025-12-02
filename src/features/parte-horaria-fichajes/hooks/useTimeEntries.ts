// Hook personalizado para gestión de fichajes
import { useState, useEffect, useCallback } from 'react';
import { 
  TimeEntry, 
  TimeEntryFilters, 
  TimeTrackingKPIs,
  Employee
} from '../types';
import { timeEntriesApi } from '../api/timeEntriesApi';

interface UseTimeEntriesState {
  entries: TimeEntry[];
  kpis: TimeTrackingKPIs | null;
  employees: Employee[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export const useTimeEntries = (filters: TimeEntryFilters) => {
  const [state, setState] = useState<UseTimeEntriesState>({
    entries: [],
    kpis: null,
    employees: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
    },
  });

  // Cargar fichajes
  const loadEntries = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await timeEntriesApi.getTimeEntries(filters);
      setState(prev => ({
        ...prev,
        entries: response.data,
        pagination: response.pagination,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error al cargar fichajes',
      }));
    }
  }, [filters]);

  // Cargar KPIs
  const loadKPIs = useCallback(async () => {
    try {
      const kpis = await timeEntriesApi.getSummary(
        filters.dateRange.start,
        filters.dateRange.end
      );
      setState(prev => ({ ...prev, kpis }));
    } catch (error) {
      console.error('Error al cargar KPIs:', error);
    }
  }, [filters.dateRange.start, filters.dateRange.end]);

  // Cargar empleados
  const loadEmployees = useCallback(async () => {
    try {
      const employees = await timeEntriesApi.getEmployees();
      setState(prev => ({ ...prev, employees }));
    } catch (error) {
      console.error('Error al cargar empleados:', error);
    }
  }, []);

  // Fichar entrada
  const clockIn = useCallback(async (employeeId: string): Promise<TimeEntry | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const entry = await timeEntriesApi.clockIn({
        employeeId,
        timestamp: new Date().toISOString(),
      });
      
      // Recargar fichajes
      await loadEntries();
      await loadKPIs();
      
      setState(prev => ({ ...prev, loading: false }));
      return entry;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error al fichar entrada',
      }));
      return null;
    }
  }, [loadEntries, loadKPIs]);

  // Fichar salida
  const clockOut = useCallback(async (entryId: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await timeEntriesApi.clockOut(entryId, new Date().toISOString());
      
      // Recargar fichajes
      await loadEntries();
      await loadKPIs();
      
      setState(prev => ({ ...prev, loading: false }));
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error al fichar salida',
      }));
      return false;
    }
  }, [loadEntries, loadKPIs]);

  // Crear fichaje manual (para administradores)
  const createManualEntry = useCallback(async (
    employeeId: string,
    clockIn: string,
    clockOut: string | null,
    reason: string
  ): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await timeEntriesApi.createManualEntry({
        employeeId,
        clockIn,
        clockOut,
        reason,
      });
      
      // Recargar fichajes
      await loadEntries();
      await loadKPIs();
      
      setState(prev => ({ ...prev, loading: false }));
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error al crear fichaje',
      }));
      return false;
    }
  }, [loadEntries, loadKPIs]);

  // Actualizar fichaje (para administradores)
  const updateEntry = useCallback(async (
    entryId: string,
    clockIn?: string,
    clockOut?: string | null,
    reason: string = 'Corrección manual'
  ): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await timeEntriesApi.updateEntry(entryId, {
        clockIn,
        clockOut,
        reason,
      });
      
      // Recargar fichajes
      await loadEntries();
      await loadKPIs();
      
      setState(prev => ({ ...prev, loading: false }));
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error al actualizar fichaje',
      }));
      return false;
    }
  }, [loadEntries, loadKPIs]);

  // Cargar datos iniciales
  useEffect(() => {
    loadEntries();
    loadKPIs();
    loadEmployees();
  }, [loadEntries, loadKPIs, loadEmployees]);

  return {
    ...state,
    clockIn,
    clockOut,
    createManualEntry,
    updateEntry,
    refetch: loadEntries,
  };
};

