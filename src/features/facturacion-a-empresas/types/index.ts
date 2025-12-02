// Tipos para Facturación a Empresas (B2B)

export interface Factura {
  id: string;
  invoiceNumber: string;
  company: {
    id: string;
    name: string;
  };
  issueDate: Date;
  dueDate: Date;
  totalAmount: number;
  balanceDue: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'void' | 'partially_paid';
  lineItems: LineItem[];
  taxAmount?: number;
  subtotal?: number;
  currency: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate?: number;
}

export interface Pago {
  id: string;
  amount: number;
  paymentDate: Date;
  method: 'bank_transfer' | 'cash' | 'credit_card' | 'check';
  transactionId?: string;
  notes?: string;
  invoiceId: string;
}

export interface Empresa {
  id: string;
  name: string;
  taxId?: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  active: boolean;
}

export interface FiltrosFacturas {
  query?: string;
  status?: Factura['status'];
  companyId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
  sortBy?: string;
}

export interface Paginacion {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

export interface RespuestaFacturas {
  data: Factura[];
  pagination: Paginacion;
}

export interface KPIsFacturacion {
  totalFacturado: number;
  totalCobrado: number;
  cuentasPorCobrar: number;
  diasPromedioCobro: number;
  porcentajeFacturasVencidas: number;
  ingresoPromedioPorCuenta: number;
  periodo: 'month' | 'quarter' | 'year';
}

export interface NuevaFactura {
  companyId: string;
  issueDate: Date;
  dueDate: Date;
  lineItems: Omit<LineItem, 'id'>[];
  notes?: string;
}

export interface NuevoPago {
  invoiceId: string;
  amount: number;
  paymentDate: Date;
  method: Pago['method'];
  transactionId?: string;
  notes?: string;
}

