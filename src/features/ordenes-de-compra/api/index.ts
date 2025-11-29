import axios from 'axios';
import { OrderStatus, PurchaseOrder, CreatePurchaseOrderData, UpdateOrderStatusData, PurchaseOrderListResponse, PurchaseOrderFilters } from '../types';

const API_BASE_URL = '/api/v1/purchasing/orders';

/**
 * Mock data para desarrollo - Simula las respuestas de la API
 */
export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po_001',
    supplier_id: 'sup_001',
    supplier_name: 'Equipamiento Fitness Pro',
    requester_id: 'user_001',
    requester_name: 'María González',
    items: [
      {
        id: 'item_001',
        product_id: 'prod_dumbbell_10kg',
        product_name: 'Mancuerna 10kg',
        quantity: 5,
        unit_price: 45.99,
        total: 229.95,
      },
    ],
    total_amount: 229.95,
    currency: 'EUR',
    status: OrderStatus.APPROVED,
    notes: 'Urgente para nueva sala',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-16T14:30:00Z',
    audit_log: [
      {
        id: 'log_001',
        user: 'María González',
        action: 'Created',
        timestamp: '2024-01-15T10:00:00Z',
      },
      {
        id: 'log_002',
        user: 'Carlos Ruiz',
        action: 'Approved',
        timestamp: '2024-01-16T14:30:00Z',
      },
    ],
  },
  {
    id: 'po_002',
    supplier_id: 'sup_002',
    supplier_name: 'Suplementos NutriPro',
    requester_id: 'user_002',
    requester_name: 'Juan Martín',
    items: [
      {
        id: 'item_002',
        product_id: 'prod_protein_whey',
        product_name: 'Proteína Whey Gold 2kg',
        quantity: 20,
        unit_price: 39.99,
        total: 799.80,
      },
    ],
    total_amount: 799.80,
    currency: 'EUR',
    status: OrderStatus.PENDING_APPROVAL,
    notes: 'Reposición de stock semanal',
    created_at: '2024-01-18T09:00:00Z',
    updated_at: '2024-01-18T09:00:00Z',
    audit_log: [
      {
        id: 'log_003',
        user: 'Juan Martín',
        action: 'Created',
        timestamp: '2024-01-18T09:00:00Z',
      },
    ],
  },
  {
    id: 'po_003',
    supplier_id: 'sup_003',
    supplier_name: 'Material Deportivo Plus',
    requester_id: 'user_001',
    requester_name: 'María González',
    items: [
      {
        id: 'item_003',
        product_id: 'prod_mat_pilates',
        product_name: 'Esterilla Pilates Premium',
        quantity: 15,
        unit_price: 25.50,
        total: 382.50,
      },
      {
        id: 'item_004',
        product_id: 'prod_banda_elastica',
        product_name: 'Banda Elástica Resistencia',
        quantity: 20,
        unit_price: 8.99,
        total: 179.80,
      },
    ],
    total_amount: 562.30,
    currency: 'EUR',
    status: OrderStatus.ORDERED,
    notes: 'Pedido confirmado telefónicamente',
    created_at: '2024-01-10T11:00:00Z',
    updated_at: '2024-01-12T16:00:00Z',
    audit_log: [
      {
        id: 'log_004',
        user: 'María González',
        action: 'Created',
        timestamp: '2024-01-10T11:00:00Z',
      },
      {
        id: 'log_005',
        user: 'Carlos Ruiz',
        action: 'Approved',
        timestamp: '2024-01-11T10:00:00Z',
      },
      {
        id: 'log_006',
        user: 'María González',
        action: 'Ordered',
        timestamp: '2024-01-12T16:00:00Z',
      },
    ],
  },
  {
    id: 'po_004',
    supplier_id: 'sup_002',
    supplier_name: 'Suplementos NutriPro',
    requester_id: 'user_003',
    requester_name: 'Laura Sánchez',
    items: [
      {
        id: 'item_005',
        product_id: 'prod_creatina',
        product_name: 'Creatina Monohidrato 500g',
        quantity: 10,
        unit_price: 24.99,
        total: 249.90,
      },
    ],
    total_amount: 249.90,
    currency: 'EUR',
    status: OrderStatus.COMPLETED,
    notes: 'Recepción completada sin incidencias',
    created_at: '2024-01-05T08:00:00Z',
    updated_at: '2024-01-08T17:00:00Z',
    audit_log: [
      {
        id: 'log_007',
        user: 'Laura Sánchez',
        action: 'Created',
        timestamp: '2024-01-05T08:00:00Z',
      },
      {
        id: 'log_008',
        user: 'Carlos Ruiz',
        action: 'Approved',
        timestamp: '2024-01-05T14:00:00Z',
      },
      {
        id: 'log_009',
        user: 'Laura Sánchez',
        action: 'Ordered',
        timestamp: '2024-01-06T10:00:00Z',
      },
      {
        id: 'log_010',
        user: 'Laura Sánchez',
        action: 'Completed',
        timestamp: '2024-01-08T17:00:00Z',
      },
    ],
  },
  {
    id: 'po_005',
    supplier_id: 'sup_001',
    supplier_name: 'Equipamiento Fitness Pro',
    requester_id: 'user_002',
    requester_name: 'Juan Martín',
    items: [
      {
        id: 'item_006',
        product_id: 'prod_treadmill',
        product_name: 'Cinta de Correr Pro X',
        quantity: 1,
        unit_price: 1500.00,
        total: 1500.00,
      },
    ],
    total_amount: 1500.00,
    currency: 'EUR',
    status: OrderStatus.PARTIALLY_RECEIVED,
    notes: 'Recibido sin manual de instrucciones, pendiente',
    created_at: '2023-12-20T09:00:00Z',
    updated_at: '2024-01-15T11:00:00Z',
    audit_log: [
      {
        id: 'log_011',
        user: 'Juan Martín',
        action: 'Created',
        timestamp: '2023-12-20T09:00:00Z',
      },
      {
        id: 'log_012',
        user: 'Carlos Ruiz',
        action: 'Approved',
        timestamp: '2023-12-21T10:00:00Z',
      },
      {
        id: 'log_013',
        user: 'Juan Martín',
        action: 'Ordered',
        timestamp: '2023-12-22T14:00:00Z',
      },
      {
        id: 'log_014',
        user: 'Juan Martín',
        action: 'Partially Received',
        timestamp: '2024-01-15T11:00:00Z',
      },
    ],
  },
];

export const mockSuppliers = [
  { id: 'sup_001', name: 'Equipamiento Fitness Pro' },
  { id: 'sup_002', name: 'Suplementos NutriPro' },
  { id: 'sup_003', name: 'Material Deportivo Plus' },
];

export const mockProducts = [
  { id: 'prod_dumbbell_10kg', name: 'Mancuerna 10kg', unit_price: 45.99 },
  { id: 'prod_protein_whey', name: 'Proteína Whey Gold 2kg', unit_price: 39.99 },
  { id: 'prod_mat_pilates', name: 'Esterilla Pilates Premium', unit_price: 25.50 },
  { id: 'prod_banda_elastica', name: 'Banda Elástica Resistencia', unit_price: 8.99 },
  { id: 'prod_creatina', name: 'Creatina Monohidrato 500g', unit_price: 24.99 },
  { id: 'prod_treadmill', name: 'Cinta de Correr Pro X', unit_price: 1500.00 },
];

/**
 * Obtiene una lista paginada y filtrada de órdenes de compra
 */
export const getPurchaseOrders = async (
  page: number = 1,
  limit: number = 20,
  filters?: PurchaseOrderFilters
): Promise<PurchaseOrderListResponse> => {
  // Mock implementation for development
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
  
  const data = mockPurchaseOrders;
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      pageSize: limit,
    },
  };
};

/**
 * Obtiene los detalles completos de una orden de compra específica
 */
export const getPurchaseOrderById = async (orderId: string): Promise<PurchaseOrder> => {
  // Mock implementation for development
  await new Promise(resolve => setTimeout(resolve, 200)); // Simulate API delay
  
  const order = mockPurchaseOrders.find(o => o.id === orderId);
  if (!order) {
    throw new Error('Order not found');
  }
  
  return order;
};

/**
 * Crea una nueva orden de compra
 */
export const createPurchaseOrder = async (data: CreatePurchaseOrderData): Promise<PurchaseOrder> => {
  // Mock implementation for development
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  const supplier = mockSuppliers.find(s => s.id === data.supplier_id);
  const items = data.items.map((item, index) => ({
    id: `item_new_${Date.now()}_${index}`,
    ...item,
    total: item.quantity * item.unit_price,
  }));
  
  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
  
  const newOrder: PurchaseOrder = {
    id: `po_new_${Date.now()}`,
    supplier_id: data.supplier_id,
    supplier_name: supplier?.name || 'Unknown Supplier',
    requester_id: 'user_current',
    requester_name: 'Usuario Actual',
    items,
    total_amount: totalAmount,
    currency: 'EUR',
    status: OrderStatus.DRAFT,
    notes: data.notes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    audit_log: [
      {
        id: `log_${Date.now()}`,
        user: 'Usuario Actual',
        action: 'Created',
        timestamp: new Date().toISOString(),
      },
    ],
  };

  mockPurchaseOrders.unshift(newOrder);
  return newOrder;
};

/**
 * Actualiza el estado de una orden de compra
 */
export const updateOrderStatus = async (
  orderId: string,
  data: UpdateOrderStatusData
): Promise<PurchaseOrder> => {
  // Mock implementation for development
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
  
  const orderIndex = mockPurchaseOrders.findIndex(o => o.id === orderId);
  if (orderIndex === -1) {
    throw new Error('Order not found');
  }
  
  const order = mockPurchaseOrders[orderIndex];
  const updatedOrder: PurchaseOrder = {
    ...order,
    status: data.status,
    updated_at: new Date().toISOString(),
    audit_log: [
      ...(order.audit_log || []),
      {
        id: `log_${Date.now()}`,
        user: 'Usuario Actual',
        action: data.status,
        timestamp: new Date().toISOString(),
        notes: data.notes,
      },
    ],
  };
  
  mockPurchaseOrders[orderIndex] = updatedOrder;
  return updatedOrder;
};
