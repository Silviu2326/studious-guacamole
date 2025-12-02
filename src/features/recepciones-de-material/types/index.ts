// Tipos y interfaces para el módulo de Recepciones de Material

export interface Reception {
  id: string;
  receptionDate: string;
  status: 'completed' | 'partial' | 'pending';
  purchaseOrderId: string;
  purchaseOrderReference?: string;
  supplier: {
    id: string;
    name: string;
  };
  receivedItems: ReceivedItem[];
  itemCount: number;
  notes?: string;
  createdBy: {
    userId: string;
    name: string;
  };
  createdAt: string;
  totalAmount?: number;
  discrepancyCount?: number;
}

export interface ReceivedItem {
  id?: string;
  productId: string;
  productName: string;
  quantityExpected: number;
  quantityReceived: number;
  condition: 'ok' | 'damaged' | 'missing';
  unitPrice?: number;
  notes?: string;
}

export interface ReceivedItemForm {
  productId: string;
  productName: string;
  quantityExpected: number;
  quantityReceived: number;
  condition: 'ok' | 'damaged' | 'missing';
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  reference: string;
  supplierName: string;
  supplierId: string;
  expectedDate?: string;
  status: string;
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  quantityExpected: number;
  unitPrice?: number;
  receivedQuantity?: number;
}

export interface ReceptionFilters {
  supplierId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  purchaseOrderId?: string;
}

export interface ReceptionsResponse {
  data: Reception[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface ReceptionDetailsResponse {
  id: string;
  receptionDate: string;
  status: 'completed' | 'partial' | 'pending';
  purchaseOrderId: string;
  supplier: {
    id: string;
    name: string;
  };
  notes?: string;
  receivedItems: ReceivedItem[];
  createdBy: {
    userId: string;
    name: string;
  };
  createdAt: string;
}

export interface CreateReceptionRequest {
  purchaseOrderId: string;
  receptionDate: string;
  notes?: string;
  receivedItems: ReceivedItemForm[];
}

