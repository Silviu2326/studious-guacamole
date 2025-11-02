// Hook personalizado para gestionar la API de incentivos
import { useState, useEffect } from 'react';
import type {
  IncentiveScheme,
  SchemeStatus,
  Objective,
  ObjectiveAssignmentData,
  IncentivePayoutReport,
  EmployeePerformance,
} from '../types';
import {
  getIncentiveSchemes,
  createIncentiveScheme,
  updateIncentiveScheme,
  deleteIncentiveScheme,
  assignObjective,
  getObjectives,
  getIncentivePayoutReport,
  getEmployeePerformance,
} from '../api/incentivesApi';

export const useIncentivesApi = () => {
  const [schemes, setSchemes] = useState<IncentiveScheme[]>([]);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [employeePerformance, setEmployeePerformance] = useState<EmployeePerformance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar esquemas
  const loadSchemes = async (status?: SchemeStatus) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getIncentiveSchemes(status);
      setSchemes(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar esquemas');
    } finally {
      setIsLoading(false);
    }
  };

  // Crear esquema
  const createScheme = async (schemeData: Omit<IncentiveScheme, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newScheme = await createIncentiveScheme(schemeData);
      setSchemes((prev) => [...prev, newScheme]);
      return newScheme;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear esquema');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar esquema
  const updateScheme = async (id: string, schemeData: Partial<IncentiveScheme>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedScheme = await updateIncentiveScheme(id, schemeData);
      setSchemes((prev) => prev.map((s) => (s.id === id ? updatedScheme : s)));
      return updatedScheme;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar esquema');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar esquema
  const removeScheme = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteIncentiveScheme(id);
      setSchemes((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar esquema');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar objetivos
  const loadObjectives = async (employeeId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getObjectives(employeeId);
      setObjectives(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar objetivos');
    } finally {
      setIsLoading(false);
    }
  };

  // Asignar objetivo
  const assignObjectiveToEmployee = async (
    employeeId: string,
    objectiveData: Omit<ObjectiveAssignmentData, 'employee_ids'>
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const newObjective = await assignObjective(employeeId, objectiveData);
      setObjectives((prev) => [...prev, newObjective]);
      return newObjective;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al asignar objetivo');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar rendimiento de empleados
  const loadEmployeePerformance = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getEmployeePerformance();
      setEmployeePerformance(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar rendimiento');
    } finally {
      setIsLoading(false);
    }
  };

  // Generar reporte de pagos
  const generatePayoutReport = async (startDate: string, endDate: string): Promise<IncentivePayoutReport> => {
    setIsLoading(true);
    setError(null);
    try {
      return await getIncentivePayoutReport(startDate, endDate);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar reporte');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSchemes();
    loadObjectives();
    loadEmployeePerformance();
  }, []);

  return {
    schemes,
    objectives,
    employeePerformance,
    isLoading,
    error,
    loadSchemes,
    createScheme,
    updateScheme,
    removeScheme,
    loadObjectives,
    assignObjectiveToEmployee,
    loadEmployeePerformance,
    generatePayoutReport,
  };
};

