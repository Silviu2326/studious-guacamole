import { FiscalProfile, TaxSummary, AccountingExport, ExportRequest, ExportJob } from './types';

// Mock API para Impuestos & Export Contable
// En producción, estas llamadas irían a un backend real

const API_BASE_URL = '/api/v1/finance';

export const fiscalProfileApi = {
  // GET /api/v1/finance/fiscal-profile
  getProfile: async (): Promise<FiscalProfile> => {
    // Simulación de delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      legalName: 'Fit Center S.L.',
      taxId: 'B12345678',
      address: 'Calle Falsa 123, 28080 Madrid',
      taxRegime: 'General',
      country: 'ES'
    };
  },

  // PUT /api/v1/finance/fiscal-profile
  updateProfile: async (profileData: Partial<FiscalProfile>): Promise<FiscalProfile> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      legalName: profileData.legalName || 'Fit Center S.L.',
      taxId: profileData.taxId || 'B12345678',
      address: profileData.address || 'Calle Falsa 123, 28080 Madrid',
      taxRegime: profileData.taxRegime || 'General',
      country: profileData.country || 'ES'
    };
  }
};

export const taxSummaryApi = {
  // GET /api/v1/finance/tax-summary
  getSummary: async (from: string, to: string): Promise<TaxSummary> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Datos mock según el periodo
    return {
      totalGross: 15250.75,
      totalNet: 12603.92,
      totalVat: 2646.83,
      transactionCount: 350,
      currency: 'EUR'
    };
  }
};

export const accountingExportApi = {
  // POST /api/v1/finance/exports/accounting
  createExport: async (request: ExportRequest): Promise<ExportJob> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      jobId: `export-job-${Date.now()}`,
      status: 'pending',
      message: 'La exportación se está procesando y estará disponible en breve.',
      statusUrl: `${API_BASE_URL}/exports/jobs/export-job-${Date.now()}`
    };
  },

  // GET /api/v1/finance/exports/history
  getHistory: async (page = 1, limit = 10): Promise<{ pagination: any; data: AccountingExport[] }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockExports: AccountingExport[] = [
      {
        id: 'exp-12345',
        createdAt: '2023-10-15T10:30:00Z',
        generatedBy: 'admin@gimnasio.com',
        dateRange: '2023-07-01 - 2023-09-30',
        format: 'csv',
        status: 'completed',
        downloadUrl: '/downloads/export-q3-2023.csv'
      },
      {
        id: 'exp-12346',
        createdAt: '2023-09-10T14:20:00Z',
        generatedBy: 'admin@gimnasio.com',
        dateRange: '2023-07-01 - 2023-07-31',
        format: 'pdf',
        status: 'completed',
        downloadUrl: '/downloads/export-julio-2023.pdf'
      },
      {
        id: 'exp-12347',
        createdAt: '2023-08-05T09:15:00Z',
        generatedBy: 'admin@gimnasio.com',
        dateRange: '2023-04-01 - 2023-06-30',
        format: 'a3',
        status: 'completed',
        downloadUrl: '/downloads/export-q2-2023.a3'
      }
    ];
    
    return {
      pagination: {
        totalItems: mockExports.length,
        totalPages: 1,
        currentPage: page
      },
      data: mockExports.slice((page - 1) * limit, page * limit)
    };
  }
};

