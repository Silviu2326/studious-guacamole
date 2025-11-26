// Hook personalizado para gestionar empleados corporativos

import { useState, useEffect, useCallback } from 'react';
import { EmpleadosService } from '../api/empleadosService';
import { CorporateEmployee, EmployeeFilters, EmployeeKPIs, CorporateEmployeesResponse } from '../types';

interface UseCorporateEmployeesOptions {
  companyId: string;
  filters: EmployeeFilters;
}

export const useCorporateEmployees = ({ companyId, filters }: UseCorporateEmployeesOptions) => {
  const [employees, setEmployees] = useState<CorporateEmployee[]>([]);
  const [pagination, setPagination] = useState<CorporateEmployeesResponse['pagination'] | null>(null);
  const [kpis, setKpis] = useState<EmployeeKPIs | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [kpisLoading, setKpisLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);

  // Cargar empleados
  const loadEmployees = useCallback(async () => {
    if (!companyId) return;

    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      const response = await EmpleadosService.getEmployees(companyId, filters);
      setEmployees(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err.message : 'Error al cargar empleados');
    } finally {
      setIsLoading(false);
    }
  }, [companyId, filters]);

  // Cargar KPIs
  const loadKPIs = useCallback(async () => {
    if (!companyId) return;

    try {
      setKpisLoading(true);
      const kpisData = await EmpleadosService.getEmployeeKPIs(companyId);
      setKpis(kpisData);
    } catch (err) {
      console.error('Error al cargar KPIs:', err);
    } finally {
      setKpisLoading(false);
    }
  }, [companyId]);

  // Actualizar estado de empleado
  const updateEmployeeStatus = useCallback(
    async (employeeId: string, status: 'active' | 'inactive') => {
      try {
        setIsUpdatingStatus(true);
        setError(null);
        const updatedEmployee = await EmpleadosService.updateEmployeeStatus(employeeId, status);
        setEmployees((prev) =>
          prev.map((emp) => (emp.id === employeeId ? updatedEmployee : emp))
        );
        await loadKPIs(); // Actualizar KPIs
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al actualizar el estado');
        throw err;
      } finally {
        setIsUpdatingStatus(false);
      }
    },
    [loadKPIs]
  );

  // Importar empleados
  const importEmployees = useCallback(
    async (file: File) => {
      if (!companyId) return;

      try {
        setIsImporting(true);
        setError(null);
        const result = await EmpleadosService.bulkImportEmployees(companyId, file);
        setImportResult(result);
        await loadEmployees(); // Recargar lista
        await loadKPIs(); // Actualizar KPIs
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al importar empleados');
        throw err;
      } finally {
        setIsImporting(false);
      }
    },
    [companyId, loadEmployees, loadKPIs]
  );

  // Exportar empleados
  const exportEmployees = useCallback(
    async () => {
      if (!companyId) return;

      try {
        setIsExporting(true);
        setError(null);
        const blob = await EmpleadosService.exportEmployees(companyId, filters);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `empleados_${companyId}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al exportar empleados');
        throw err;
      } finally {
        setIsExporting(false);
      }
    },
    [companyId, filters]
  );

  // Cargar datos cuando cambian los filtros o companyId
  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    loadKPIs();
  }, [loadKPIs]);

  return {
    employees,
    pagination,
    kpis,
    isLoading,
    kpisLoading,
    isError,
    error,
    updateEmployeeStatus,
    importEmployees,
    exportEmployees,
    isUpdatingStatus,
    isImporting,
    isExporting,
    importResult,
    refetch: loadEmployees,
  };
};

