import { useState, useCallback } from 'react';
import { Employee, EmployeesListResponse, EmployeeStatus } from '../types';
import { portalEmpresaService } from '../api/portalEmpresaService';

interface UseEmployeesReturn {
  employees: Employee[];
  pagination: EmployeesListResponse['pagination'] | null;
  isLoading: boolean;
  error: string | null;
  filters: { page?: number; status?: string; search?: string };
  loadEmployees: (params?: { page?: number; status?: string; search?: string }) => Promise<void>;
  updateFilters: (newFilters: { page?: number; status?: string; search?: string }) => void;
  deactivateEmployee: (companyId: string, employeeId: string) => Promise<void>;
  resendInvite: (companyId: string, employeeId: string) => Promise<void>;
  clearError: () => void;
}

export const useEmployees = (companyId: string): UseEmployeesReturn => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [pagination, setPagination] = useState<EmployeesListResponse['pagination'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ page?: number; status?: string; search?: string }>({
    page: 1,
  });

  const loadEmployees = useCallback(async (params?: { page?: number; status?: string; search?: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await portalEmpresaService.getEmployees(companyId, params || filters);
      setEmployees(response.data);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los empleados';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [companyId, filters]);

  const updateFilters = useCallback((newFilters: { page?: number; status?: string; search?: string }) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const deactivateEmployee = useCallback(async (companyId: string, employeeId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await portalEmpresaService.updateEmployee(companyId, employeeId, { status: 'inactive' });
      await loadEmployees();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al desactivar el empleado';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [loadEmployees]);

  const resendInvite = useCallback(async (companyId: string, employeeId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const employee = employees.find(emp => emp.id === employeeId);
      if (employee) {
        await portalEmpresaService.sendInvitations(companyId, { emails: [employee.email] });
      }
      await loadEmployees();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al reenviar la invitación';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [employees, loadEmployees]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    employees,
    pagination,
    isLoading,
    error,
    filters,
    loadEmployees,
    updateFilters,
    deactivateEmployee,
    resendInvite,
    clearError,
  };
};

