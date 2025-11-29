export enum OrderStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ORDERED = 'ORDERED',
  PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface AuditLogEntry {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  supplier_id: string;
  supplier_name: string;
  requester_id: string;
  requester_name: string;
  items: OrderItem[];
  total_amount: number;
  currency: string;
  status: OrderStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
  audit_log?: AuditLogEntry[];
}

export interface CreatePurchaseOrderData {
  supplier_id: string;
  items: Omit<OrderItem, 'id' | 'total'>[];
  notes?: string;
}

export interface UpdateOrderStatusData {
  status: OrderStatus;
  notes?: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export interface PurchaseOrderFilters {
  status?: OrderStatus;
  supplier_id?: string;
  dateRange?: [Date, Date];
  search?: string;
}

export interface PurchaseOrderListResponse {
  data: PurchaseOrder[];
  pagination: PaginationMeta;
}

