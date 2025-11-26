// API mock para Objetivos y Comisiones
import type {
  IncentiveScheme,
  SchemeStatus,
  Objective,
  ObjectiveAssignmentData,
  IncentivePayoutReport,
  EmployeePerformance,
} from '../types';

const API_BASE = '/api/team';

// Mock data
const mockSchemes: IncentiveScheme[] = [
  {
    id: 'sch_123',
    name: 'Comisión Membresía Anual',
    type: 'commission',
    status: 'active',
    rules: {
      target_product_id: 'prod_abc',
      calculation: {
        type: 'percentage',
        value: 10,
      },
    },
    applies_to_roles: ['sales', 'front-desk'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'sch_456',
    name: 'Bonus NPS Trimestral',
    type: 'bonus',
    status: 'active',
    rules: {
      target_kpi: 'nps_avg',
      threshold: {
        operator: 'gte',
        value: 90,
      },
      calculation: {
        type: 'fixed',
        value: 250,
      },
      period: 'quarterly',
    },
    applies_to_roles: ['trainer'],
    created_at: new Date().toISOString(),
  },
];

const mockObjectives: Objective[] = [
  {
    id: 'obj_789',
    employee_id: 'emp_xyz',
    employee_name: 'Laura García',
    description: 'Vender 20 paquetes de PT de 10 sesiones',
    metric: 'pt_package_sales',
    target_value: 20,
    current_value: 12,
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'in_progress',
    created_at: new Date().toISOString(),
  },
];

// GET /api/team/incentive-schemes
export const getIncentiveSchemes = async (
  status?: SchemeStatus
): Promise<{ data: IncentiveScheme[] }> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = mockSchemes;
  if (status) {
    filtered = mockSchemes.filter((s) => s.status === status);
  }

  return { data: filtered };
};

// POST /api/team/incentive-schemes
export const createIncentiveScheme = async (
  schemeData: Omit<IncentiveScheme, 'id' | 'created_at' | 'updated_at'>
): Promise<IncentiveScheme> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newScheme: IncentiveScheme = {
    ...schemeData,
    id: `sch_${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  mockSchemes.push(newScheme);
  return newScheme;
};

// PUT /api/team/incentive-schemes/:id
export const updateIncentiveScheme = async (
  id: string,
  schemeData: Partial<IncentiveScheme>
): Promise<IncentiveScheme> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = mockSchemes.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error('Scheme not found');
  }

  mockSchemes[index] = {
    ...mockSchemes[index],
    ...schemeData,
    updated_at: new Date().toISOString(),
  };

  return mockSchemes[index];
};

// DELETE /api/team/incentive-schemes/:id
export const deleteIncentiveScheme = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const index = mockSchemes.findIndex((s) => s.id === id);
  if (index !== -1) {
    mockSchemes.splice(index, 1);
  }
};

// POST /api/team/employees/:employeeId/objectives
export const assignObjective = async (
  employeeId: string,
  objectiveData: Omit<ObjectiveAssignmentData, 'employee_ids'>
): Promise<Objective> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newObjective: Objective = {
    id: `obj_${Date.now()}`,
    employee_id: employeeId,
    description: objectiveData.description,
    metric: objectiveData.metric,
    target_value: objectiveData.target_value,
    current_value: 0,
    due_date: objectiveData.due_date,
    status: 'in_progress',
    created_at: new Date().toISOString(),
  };

  mockObjectives.push(newObjective);
  return newObjective;
};

// GET /api/team/objectives
export const getObjectives = async (
  employeeId?: string
): Promise<{ data: Objective[] }> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = mockObjectives;
  if (employeeId) {
    filtered = mockObjectives.filter((o) => o.employee_id === employeeId);
  }

  return { data: filtered };
};

// GET /api/reports/incentive-payouts
export const getIncentivePayoutReport = async (
  startDate: string,
  endDate: string
): Promise<IncentivePayoutReport> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    summary: {
      total_payout: 5450.75,
      total_commissions: 4200.75,
      total_bonuses: 1250,
    },
    payouts_by_employee: [
      {
        employee_id: 'emp_abc',
        employee_name: 'Ana García',
        total_payout: 1550.25,
        breakdown: {
          commissions: 1300.25,
          bonuses: 250,
        },
      },
      {
        employee_id: 'emp_xyz',
        employee_name: 'Laura García',
        total_payout: 1200.5,
        breakdown: {
          commissions: 1100.5,
          bonuses: 100,
        },
      },
    ],
  };
};

// GET /api/team/employees/performance
export const getEmployeePerformance = async (): Promise<{
  data: EmployeePerformance[];
}> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    data: [
      {
        employee: {
          id: 'emp_abc',
          name: 'Ana García',
          role: 'sales',
        },
        totalCommissions: 1300.25,
        totalBonuses: 250,
        totalPayout: 1550.25,
        objectives: [
          {
            id: 'obj_1',
            name: 'Vender 30 membresías Premium',
            progress: 22,
            target: 30,
            status: 'in_progress',
            due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
      },
      {
        employee: {
          id: 'emp_xyz',
          name: 'Laura García',
          role: 'trainer',
        },
        totalCommissions: 1100.5,
        totalBonuses: 100,
        totalPayout: 1200.5,
        objectives: [
          {
            id: 'obj_789',
            name: 'Vender 20 paquetes de PT de 10 sesiones',
            progress: 12,
            target: 20,
            status: 'in_progress',
            due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
      },
    ],
  };
};

