// API para gestión de nóminas
import {
  PayrollRun,
  Period,
  AdjustmentData,
  PayrollRunItem,
  GeneratePayrollRunRequest,
  AddAdjustmentRequest,
} from '../types';

const API_BASE = '/api/hr/payroll';

// Mock delay para simular llamadas API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const payrollApi = {
  // GET /api/hr/payroll/runs
  obtenerPayrollRun: async (period: Period): Promise<PayrollRun | null> => {
    try {
      const params = new URLSearchParams();
      params.append('month', period.month.toString());
      params.append('year', period.year.toString());

      const response = await fetch(`${API_BASE}/runs?${params.toString()}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null; // No existe ciclo para ese período
        }
        throw new Error('Error al obtener el ciclo de nómina');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerPayrollRun:', error);
      // Retornar datos mock para desarrollo
      return mockPayrollRun(period);
    }
  },

  // POST /api/hr/payroll/runs
  generarPayrollRun: async (request: GeneratePayrollRunRequest): Promise<PayrollRun> => {
    try {
      await delay(1000);
      const response = await fetch(`${API_BASE}/runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('Ya existe un ciclo de nómina para este período');
        }
        throw new Error('Error al generar el ciclo de nómina');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en generarPayrollRun:', error);
      // Retornar datos mock para desarrollo
      return mockPayrollRun(request.period);
    }
  },

  // POST /api/hr/payroll/runs/{runId}/adjustments
  agregarAjuste: async (runId: string, adjustment: AddAdjustmentRequest): Promise<PayrollRunItem> => {
    try {
      await delay(500);
      const response = await fetch(`${API_BASE}/runs/${runId}/adjustments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adjustment),
      });

      if (!response.ok) {
        if (response.status === 422) {
          throw new Error('El ciclo de nómina ya está finalizado y no se pueden añadir más ajustes');
        }
        if (response.status === 404) {
          throw new Error('El ciclo de nómina o el empleado no existen');
        }
        throw new Error('Error al agregar el ajuste');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en agregarAjuste:', error);
      throw error;
    }
  },

  // PATCH /api/hr/payroll/runs/{runId}/finalize
  finalizarPayrollRun: async (runId: string): Promise<PayrollRun> => {
    try {
      await delay(500);
      const response = await fetch(`${API_BASE}/runs/${runId}/finalize`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('El ciclo de nómina no existe');
        }
        throw new Error('Error al finalizar el ciclo de nómina');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en finalizarPayrollRun:', error);
      throw error;
    }
  },

  // Exportar nómina a CSV
  exportarCSV: async (runId: string): Promise<Blob> => {
    try {
      const response = await fetch(`${API_BASE}/runs/${runId}/export/csv`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Error al exportar la nómina');
      }

      return await response.blob();
    } catch (error) {
      console.error('Error en exportarCSV:', error);
      throw error;
    }
  },

  // Exportar nómina a PDF
  exportarPDF: async (runId: string): Promise<Blob> => {
    try {
      const response = await fetch(`${API_BASE}/runs/${runId}/export/pdf`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Error al exportar la nómina');
      }

      return await response.blob();
    } catch (error) {
      console.error('Error en exportarPDF:', error);
      throw error;
    }
  },
};

// Datos mock para desarrollo
function mockPayrollRun(period: Period): PayrollRun {
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return {
    runId: `pr-${period.year}-${period.month}`,
    period,
    status: 'draft',
    totalBase: 15000,
    totalVariables: 3500.5,
    totalDeductions: -500,
    totalPayable: 18000.5,
    items: [
      {
        employeeId: 'emp-001',
        employeeName: 'Jane Trainer',
        basePay: 2000,
        variables: [
          {
            type: 'pt_commission',
            amount: 450.5,
            source_events: 20,
            description: 'Comisión por 20 sesiones de PT',
          },
        ],
        adjustments: [],
        total: 2450.5,
      },
      {
        employeeId: 'emp-002',
        employeeName: 'Carlos Martínez',
        basePay: 1800,
        variables: [
          {
            type: 'pt_commission',
            amount: 320,
            source_events: 15,
            description: 'Comisión por 15 sesiones de PT',
          },
          {
            type: 'class_bonus',
            amount: 150,
            source_events: 8,
            description: 'Bono por ocupación de clases',
          },
        ],
        adjustments: [
          {
            adjustmentId: 'adj-001',
            type: 'bonus',
            amount: 100,
            description: 'Bono por cubrir turno extra',
            createdAt: new Date().toISOString(),
            createdBy: 'admin-001',
          },
        ],
        total: 2370,
      },
      {
        employeeId: 'emp-003',
        employeeName: 'Laura García',
        basePay: 2200,
        variables: [
          {
            type: 'sales_commission',
            amount: 280,
            source_events: 4,
            description: 'Comisión por venta de 4 membresías',
          },
        ],
        adjustments: [],
        total: 2480,
      },
      {
        employeeId: 'emp-004',
        employeeName: 'Miguel Sánchez',
        basePay: 1500,
        variables: [],
        adjustments: [
          {
            adjustmentId: 'adj-002',
            type: 'deduction',
            amount: -200,
            description: 'Anticipo del mes anterior',
            createdAt: new Date().toISOString(),
            createdBy: 'admin-001',
          },
        ],
        total: 1300,
      },
    ],
    createdAt: new Date().toISOString(),
  };
}

