// API para gestión de fichajes / parte horaria
import { 
  TimeEntry, 
  TimeEntriesResponse, 
  TimeEntryFilters,
  TimeTrackingKPIs,
  ManualEntryFormData,
  ClockInRequest,
  UpdateEntryRequest
} from '../types';

const API_BASE = '/api/v1/hr/time-entries';

// Delay simulado para desarrollo
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Datos mock para desarrollo
const mockEmployees = [
  { id: 'emp_1', name: 'Ana Torres' },
  { id: 'emp_2', name: 'Carlos Ruiz' },
  { id: 'emp_3', name: 'María González' },
  { id: 'emp_4', name: 'Juan Pérez' },
];

const mockTimeEntries: TimeEntry[] = [
  {
    id: 'entry_1',
    employee: mockEmployees[0],
    clockIn: new Date(new Date().setHours(9, 0, 0)).toISOString(),
    clockOut: new Date(new Date().setHours(17, 30, 0)).toISOString(),
    totalHours: 8.5,
    isManual: false,
    status: 'completed',
  },
  {
    id: 'entry_2',
    employee: mockEmployees[1],
    clockIn: new Date(new Date().setHours(10, 15, 0)).toISOString(),
    clockOut: null,
    totalHours: 0,
    isManual: false,
    status: 'ongoing',
  },
  {
    id: 'entry_3',
    employee: mockEmployees[2],
    clockIn: new Date(new Date().setHours(8, 30, 0)).toISOString(),
    clockOut: new Date(new Date().setHours(16, 45, 0)).toISOString(),
    totalHours: 8.25,
    isManual: true,
    status: 'completed',
    audit: {
      editedBy: 'admin_001',
      editTimestamp: new Date().toISOString(),
      reason: 'Corrección de olvido al fichar por la mañana.',
    },
  },
];

export const timeEntriesApi = {
  // Obtener lista de fichajes con filtros
  getTimeEntries: async (filters: TimeEntryFilters): Promise<TimeEntriesResponse> => {
    try {
      const params = new URLSearchParams();
      params.append('startDate', filters.dateRange.start.toISOString());
      params.append('endDate', filters.dateRange.end.toISOString());
      if (filters.employeeId) {
        params.append('employeeId', filters.employeeId);
      }
      if (filters.page) {
        params.append('page', filters.page.toString());
      }

      const response = await fetch(`${API_BASE}?${params.toString()}`);
      if (!response.ok) throw new Error('Error al obtener fichajes');
      return await response.json();
    } catch (error) {
      console.error('Error en getTimeEntries:', error);
      await delay(500);
      // Retornar datos mock para desarrollo
      return {
        data: mockTimeEntries,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: mockTimeEntries.length,
        },
      };
    }
  },

  // Fichar entrada
  clockIn: async (request: ClockInRequest): Promise<TimeEntry> => {
    try {
      const response = await fetch(`${API_BASE}/clock-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('El empleado ya tiene un fichaje de entrada activo');
        }
        if (response.status === 404) {
          throw new Error('Empleado no encontrado');
        }
        throw new Error('Error al fichar entrada');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en clockIn:', error);
      await delay(300);
      // Retornar datos mock
      return {
        id: `entry_${Date.now()}`,
        employee: mockEmployees.find(e => e.id === request.employeeId) || mockEmployees[0],
        clockIn: request.timestamp,
        clockOut: null,
        totalHours: 0,
        isManual: false,
        status: 'ongoing',
      };
    }
  },

  // Fichar salida (usando PUT en el endpoint de actualización)
  clockOut: async (entryId: string, timestamp: string): Promise<TimeEntry> => {
    try {
      const response = await fetch(`${API_BASE}/${entryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clockOut: timestamp,
          reason: 'Fichaje de salida',
        }),
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Fichaje no encontrado');
        }
        throw new Error('Error al fichar salida');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en clockOut:', error);
      await delay(300);
      throw error;
    }
  },

  // Crear nuevo fichaje manual (para administradores)
  createManualEntry: async (request: ManualEntryFormData): Promise<TimeEntry> => {
    try {
      // En producción, esto debería ser un endpoint específico POST /api/v1/hr/time-entries
      // Por ahora simulamos creando primero la entrada y luego actualizándola si hay salida
      const clockInResponse = await fetch(`${API_BASE}/clock-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: request.employeeId,
          timestamp: request.clockIn,
        }),
      });

      if (!clockInResponse.ok) throw new Error('Error al crear fichaje de entrada');
      const clockInEntry = await clockInResponse.json();

      // Si hay salida, actualizar el fichaje
      if (request.clockOut) {
        const updateResponse = await fetch(`${API_BASE}/${clockInEntry.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clockOut: request.clockOut,
            reason: request.reason,
          }),
        });
        
        if (!updateResponse.ok) throw new Error('Error al actualizar fichaje');
        return await updateResponse.json();
      }

      return clockInEntry;
    } catch (error) {
      console.error('Error en createManualEntry:', error);
      await delay(300);
      // Retornar datos mock para desarrollo
      const employee = mockEmployees.find(e => e.id === request.employeeId) || mockEmployees[0];
      return {
        id: `entry_${Date.now()}`,
        employee,
        clockIn: request.clockIn,
        clockOut: request.clockOut,
        totalHours: request.clockOut 
          ? (new Date(request.clockOut).getTime() - new Date(request.clockIn).getTime()) / (1000 * 60 * 60)
          : 0,
        isManual: true,
        status: request.clockOut ? 'completed' : 'ongoing',
      };
    }
  },

  // Actualizar registro de fichaje (para administradores)
  updateEntry: async (entryId: string, request: UpdateEntryRequest): Promise<TimeEntry> => {
    try {
      const response = await fetch(`${API_BASE}/${entryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Datos inválidos o falta justificación');
        }
        if (response.status === 404) {
          throw new Error('Fichaje no encontrado');
        }
        throw new Error('Error al actualizar fichaje');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en updateEntry:', error);
      await delay(300);
      throw error;
    }
  },

  // Obtener resumen/KPIs
  getSummary: async (startDate: Date, endDate: Date): Promise<TimeTrackingKPIs> => {
    try {
      const params = new URLSearchParams();
      params.append('startDate', startDate.toISOString());
      params.append('endDate', endDate.toISOString());

      const response = await fetch(`${API_BASE}/summary?${params.toString()}`);
      if (!response.ok) throw new Error('Error al obtener resumen');
      return await response.json();
    } catch (error) {
      console.error('Error en getSummary:', error);
      await delay(500);
      // Retornar datos mock
      return {
        activeEmployees: 2,
        totalHoursMonth: 1240.5,
        overtimeHoursMonth: 55.2,
        estimatedLaborCost: 18607.5,
        punctualityRate: '95.8%',
        manualEditsCount: 12,
      };
    }
  },

  // Obtener lista de empleados
  getEmployees: async (): Promise<{ id: string; name: string }[]> => {
    try {
      const response = await fetch('/api/v1/hr/employees');
      if (!response.ok) throw new Error('Error al obtener empleados');
      return await response.json();
    } catch (error) {
      console.error('Error en getEmployees:', error);
      await delay(300);
      return mockEmployees;
    }
  },
};

