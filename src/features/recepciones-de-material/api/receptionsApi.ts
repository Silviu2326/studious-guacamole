import {
  Reception,
  ReceptionsResponse,
  ReceptionDetailsResponse,
  CreateReceptionRequest,
  ReceptionFilters,
  PurchaseOrder,
  PurchaseOrderItem,
  ReceivedItem,
  ReceivedItemForm
} from '../types';

// Simulación de delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data - En producción estos serían datos reales
const mockReceptions: Reception[] = [
  {
    id: 'rec_001',
    receptionDate: '2024-01-15T10:00:00Z',
    status: 'completed',
    purchaseOrderId: 'po_001',
    purchaseOrderReference: 'PO-2024-015',
    supplier: {
      id: 'sup_001',
      name: 'SupplierFit'
    },
    receivedItems: [
      {
        productId: 'prod_001',
        productName: 'Proteína de Chocolate 2kg',
        quantityExpected: 20,
        quantityReceived: 20,
        condition: 'ok'
      },
      {
        productId: 'prod_002',
        productName: 'Barritas Energéticas',
        quantityExpected: 50,
        quantityReceived: 50,
        condition: 'ok'
      }
    ],
    itemCount: 2,
    notes: 'Entrega completa y en buen estado',
    createdBy: {
      userId: 'user_001',
      name: 'Carlos García'
    },
    createdAt: '2024-01-15T10:15:00Z',
    totalAmount: 850.00
  },
  {
    id: 'rec_002',
    receptionDate: '2024-01-20T14:30:00Z',
    status: 'partial',
    purchaseOrderId: 'po_002',
    purchaseOrderReference: 'PO-2024-018',
    supplier: {
      id: 'sup_002',
      name: 'NutriPro'
    },
    receivedItems: [
      {
        productId: 'prod_003',
        productName: 'Creatina Monohidrato 500g',
        quantityExpected: 30,
        quantityReceived: 28,
        condition: 'ok'
      },
      {
        productId: 'prod_003',
        productName: 'Creatina Monohidrato 500g',
        quantityExpected: 0,
        quantityReceived: 2,
        condition: 'damaged'
      },
      {
        productId: 'prod_004',
        productName: 'Toallas de Gimnasio',
        quantityExpected: 100,
        quantityReceived: 0,
        condition: 'missing'
      }
    ],
    itemCount: 3,
    notes: 'Falta entrega de toallas, pendiente confirmación proveedor',
    createdBy: {
      userId: 'user_001',
      name: 'Carlos García'
    },
    createdAt: '2024-01-20T14:45:00Z',
    totalAmount: 420.00,
    discrepancyCount: 2
  },
  {
    id: 'rec_003',
    receptionDate: '2024-02-01T09:00:00Z',
    status: 'completed',
    purchaseOrderId: 'po_003',
    purchaseOrderReference: 'PO-2024-025',
    supplier: {
      id: 'sup_001',
      name: 'SupplierFit'
    },
    receivedItems: [
      {
        productId: 'prod_005',
        productName: 'Producto de Limpieza 5L',
        quantityExpected: 10,
        quantityReceived: 10,
        condition: 'ok'
      },
      {
        productId: 'prod_006',
        productName: 'Guantes de Entrenamiento',
        quantityExpected: 25,
        quantityReceived: 25,
        condition: 'ok'
      }
    ],
    itemCount: 2,
    createdBy: {
      userId: 'user_002',
      name: 'Ana Martínez'
    },
    createdAt: '2024-02-01T09:10:00Z',
    totalAmount: 325.50
  }
];

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po_001',
    reference: 'PO-2024-015',
    supplierName: 'SupplierFit',
    supplierId: 'sup_001',
    expectedDate: '2024-01-15',
    status: 'sent',
    items: [
      {
        id: 'poi_001',
        productId: 'prod_001',
        productName: 'Proteína de Chocolate 2kg',
        quantityExpected: 20,
        unitPrice: 35.00
      },
      {
        id: 'poi_002',
        productId: 'prod_002',
        productName: 'Barritas Energéticas',
        quantityExpected: 50,
        unitPrice: 3.00
      }
    ]
  },
  {
    id: 'po_002',
    reference: 'PO-2024-018',
    supplierName: 'NutriPro',
    supplierId: 'sup_002',
    expectedDate: '2024-01-20',
    status: 'partially_received',
    items: [
      {
        id: 'poi_003',
        productId: 'prod_003',
        productName: 'Creatina Monohidrato 500g',
        quantityExpected: 30,
        unitPrice: 15.00,
        receivedQuantity: 28
      },
      {
        id: 'poi_004',
        productId: 'prod_004',
        productName: 'Toallas de Gimnasio',
        quantityExpected: 100,
        unitPrice: 5.50,
        receivedQuantity: 0
      }
    ]
  },
  {
    id: 'po_003',
    reference: 'PO-2024-025',
    supplierName: 'SupplierFit',
    supplierId: 'sup_001',
    expectedDate: '2024-02-01',
    status: 'sent',
    items: [
      {
        id: 'poi_005',
        productId: 'prod_005',
        productName: 'Producto de Limpieza 5L',
        quantityExpected: 10,
        unitPrice: 12.50
      },
      {
        id: 'poi_006',
        productId: 'prod_006',
        productName: 'Guantes de Entrenamiento',
        quantityExpected: 25,
        unitPrice: 8.00
      }
    ]
  }
];

const mockSuppliers = [
  { id: 'sup_001', name: 'SupplierFit' },
  { id: 'sup_002', name: 'NutriPro' },
  { id: 'sup_003', name: 'FitStore' },
  { id: 'sup_004', name: 'ProNutrition' }
];

// API de Recepciones
export const receptionsApi = {
  // Obtener lista de recepciones con filtros y paginación
  getReceptions: async (
    filters?: ReceptionFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<ReceptionsResponse> => {
    await delay(500);

    let filteredReceptions = [...mockReceptions];

    // Aplicar filtros
    if (filters?.supplierId) {
      filteredReceptions = filteredReceptions.filter(
        r => r.supplier.id === filters.supplierId
      );
    }

    if (filters?.status) {
      filteredReceptions = filteredReceptions.filter(
        r => r.status === filters.status
      );
    }

    if (filters?.dateFrom) {
      filteredReceptions = filteredReceptions.filter(
        r => r.receptionDate >= filters.dateFrom!
      );
    }

    if (filters?.dateTo) {
      filteredReceptions = filteredReceptions.filter(
        r => r.receptionDate <= filters.dateTo!
      );
    }

    if (filters?.purchaseOrderId) {
      filteredReceptions = filteredReceptions.filter(
        r => r.purchaseOrderId === filters.purchaseOrderId
      );
    }

    // Ordenar por fecha de recepción (más reciente primero)
    filteredReceptions.sort((a, b) => 
      new Date(b.receptionDate).getTime() - new Date(a.receptionDate).getTime()
    );

    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReceptions = filteredReceptions.slice(startIndex, endIndex);

    return {
      data: paginatedReceptions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredReceptions.length / limit),
        totalItems: filteredReceptions.length,
        itemsPerPage: limit
      }
    };
  },

  // Obtener detalles de una recepción específica
  getReceptionById: async (id: string): Promise<ReceptionDetailsResponse | null> => {
    await delay(300);

    const reception = mockReceptions.find(r => r.id === id);
    if (!reception) return null;

    return {
      id: reception.id,
      receptionDate: reception.receptionDate,
      status: reception.status,
      purchaseOrderId: reception.purchaseOrderId,
      supplier: reception.supplier,
      notes: reception.notes,
      receivedItems: reception.receivedItems,
      createdBy: reception.createdBy,
      createdAt: reception.createdAt
    };
  },

  // Crear una nueva recepción
  createReception: async (receptionData: CreateReceptionRequest): Promise<Reception> => {
    await delay(800);

    const purchaseOrder = mockPurchaseOrders.find(po => po.id === receptionData.purchaseOrderId);
    if (!purchaseOrder) {
      throw new Error('Orden de compra no encontrada');
    }

    const newReception: Reception = {
      id: `rec_${Date.now()}`,
      receptionDate: receptionData.receptionDate,
      status: 'completed' as const,
      purchaseOrderId: receptionData.purchaseOrderId,
      purchaseOrderReference: purchaseOrder.reference,
      supplier: {
        id: purchaseOrder.supplierId,
        name: purchaseOrder.supplierName
      },
      receivedItems: receptionData.receivedItems,
      itemCount: receptionData.receivedItems.length,
      notes: receptionData.notes,
      createdBy: {
        userId: 'user_current',
        name: 'Usuario Actual'
      },
      createdAt: new Date().toISOString(),
      totalAmount: receptionData.receivedItems.reduce((sum, item) => {
        const poItem = purchaseOrder.items?.find(poi => poi.productId === item.productId);
        return sum + (item.quantityReceived * (poItem?.unitPrice || 0));
      }, 0),
      discrepancyCount: receptionData.receivedItems.filter(item => 
        item.condition !== 'ok' || item.quantityReceived !== item.quantityExpected
      ).length
    };

    // Determinar estado basado en discrepancias
    if (newReception.discrepancyCount && newReception.discrepancyCount > 0) {
      // Verificar si hay items faltantes
      const hasMissingItems = receptionData.receivedItems.some(
        item => item.condition === 'missing' || item.quantityReceived < item.quantityExpected
      );
      newReception.status = hasMissingItems ? 'partial' : 'completed';
    }

    mockReceptions.unshift(newReception);
    return newReception;
  },

  // Obtener órdenes de compra pendientes
  getPendingPurchaseOrders: async (searchTerm?: string): Promise<PurchaseOrder[]> => {
    await delay(400);

    let pendingOrders = mockPurchaseOrders.filter(po => 
      po.status === 'sent' || po.status === 'partially_received'
    );

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      pendingOrders = pendingOrders.filter(po =>
        po.reference.toLowerCase().includes(search) ||
        po.supplierName.toLowerCase().includes(search)
      );
    }

    return pendingOrders;
  },

  // Obtener lista de proveedores (para filtros)
  getSuppliers: async () => {
    await delay(200);
    return mockSuppliers;
  }
};

