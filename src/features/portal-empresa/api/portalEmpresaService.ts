// Servicio API para Portal Empresa
import { 
  Company, 
  EmployeesListResponse, 
  InvitationRequest, 
  InvitationResponse,
  EmployeeUpdateRequest,
  Employee,
  AnalyticsData,
  DateRange
} from '../types';

// Simulación de delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Datos mock para simulación
const mockCompany: Company = {
  id: 'abc-123',
  name: 'Acme Corp',
  contact_person: 'John Doe',
  contact_email: 'john.doe@acme.com',
  plan: {
    id: 'plan-gold-456',
    name: 'Plan Corporativo Gold',
    max_employees: 100,
    services: ['gym', 'pool', 'group_classes']
  }
};

const mockEmployees: Employee[] = [
  { id: 'emp-001', name: 'Alice Smith', email: 'alice.smith@acme.com', status: 'active', joined_date: '2023-10-26T10:00:00Z' },
  { id: 'emp-002', name: 'Bob Johnson', email: 'bob.johnson@acme.com', status: 'active', joined_date: '2023-11-15T14:30:00Z' },
  { id: 'emp-003', name: 'Charlie Brown', email: 'charlie.brown@acme.com', status: 'invited', joined_date: '2024-01-10T09:00:00Z' },
  { id: 'emp-004', name: 'Diana Wilson', email: 'diana.wilson@acme.com', status: 'inactive', joined_date: '2023-09-05T11:20:00Z' },
];

export const portalEmpresaService = {
  // Obtener detalles de una empresa
  async getCompany(companyId: string): Promise<Company> {
    await delay(500);
    if (companyId !== 'abc-123') {
      throw new Error('Company not found');
    }
    return mockCompany;
  },

  // Obtener lista de empleados
  async getEmployees(
    companyId: string, 
    params?: { page?: number; status?: string; search?: string }
  ): Promise<EmployeesListResponse> {
    await delay(600);
    
    let filteredEmployees = [...mockEmployees];
    
    // Filtrar por estado
    if (params?.status) {
      filteredEmployees = filteredEmployees.filter(emp => emp.status === params.status);
    }
    
    // Buscar por nombre o email
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredEmployees = filteredEmployees.filter(
        emp => emp.name.toLowerCase().includes(searchLower) || 
               emp.email.toLowerCase().includes(searchLower)
      );
    }
    
    const page = params?.page || 1;
    const limit = 20;
    const totalPages = Math.ceil(filteredEmployees.length / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      pagination: {
        total: filteredEmployees.length,
        page,
        limit,
        totalPages
      },
      data: filteredEmployees.slice(startIndex, endIndex)
    };
  },

  // Enviar invitaciones
  async sendInvitations(companyId: string, request: InvitationRequest): Promise<InvitationResponse> {
    await delay(800);
    
    const details = request.emails.map(email => {
      // Simular algunas invitaciones fallidas
      if (email.includes('duplicate')) {
        return { email, status: 'failed' as const, reason: 'already_member' };
      }
      return { email, status: 'sent' as const };
    });
    
    const success_count = details.filter(d => d.status === 'sent').length;
    const failed_count = details.filter(d => d.status === 'failed').length;
    
    return { success_count, failed_count, details };
  },

  // Actualizar estado de empleado
  async updateEmployee(
    companyId: string, 
    employeeId: string, 
    updates: EmployeeUpdateRequest
  ): Promise<Employee> {
    await delay(500);
    
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }
    
    return { ...employee, status: updates.status };
  },

  // Obtener analytics
  async getAnalytics(companyId: string, dateRange: DateRange): Promise<AnalyticsData> {
    await delay(700);
    
    return {
      adoption_rate: 0.75,
      avg_attendance: 4.2,
      active_employees_trend: [
        { month: 'Jan', count: 50 },
        { month: 'Feb', count: 65 },
        { month: 'Mar', count: 70 },
        { month: 'Apr', count: 75 },
      ],
      popular_classes: [
        { name: 'Yoga', count: 120 },
        { name: 'Spinning', count: 95 },
        { name: 'CrossFit', count: 85 },
        { name: 'Pilates', count: 70 },
      ],
      usage_by_service: {
        gym: 400,
        pool: 150,
        group_classes: 215
      }
    };
  }
};

