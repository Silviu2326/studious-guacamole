import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import {
  PurchaseOrderTable,
  PurchaseOrderFormModal,
  OrderDetailModal,
  PurchaseOrderFilters,
  PurchaseOrderKPIs,
} from '../components';
import { Button } from '../../../components/componentsreutilizables/Button';
import {
  PurchaseOrder,
  PurchaseOrderFilters as Filters,
  CreatePurchaseOrderData,
  OrderStatus,
} from '../types';
import { mockPurchaseOrders, createPurchaseOrder, updateOrderStatus, getPurchaseOrderById } from '../api';

/**
 * Página principal de Órdenes de Compra
 * 
 * Sistema de gestión de órdenes de compra para gimnasios.
 * Funcionalidades principales:
 * - Creación y edición de órdenes de compra
 * - Flujo de aprobación personalizable
 * - Seguimiento del estado de las órdenes
 * - Historial completo y trazabilidad
 * - Filtros y búsqueda avanzada
 */
export const OrdenesDeCompraPage: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [filters, setFilters] = useState<Filters>({});

  useEffect(() => {
    loadOrders();
  }, [filters]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = mockPurchaseOrders;
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrder = async (data: CreatePurchaseOrderData) => {
    try {
      const newOrder = await createPurchaseOrder(data);
      setOrders([newOrder, ...orders]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const handleViewDetails = async (orderId: string) => {
    try {
      const order = await getPurchaseOrderById(orderId);
      setSelectedOrder(order);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('Error loading order details:', error);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, { status: newStatus });
      setOrders(orders.map((o) => (o.id === orderId ? updatedOrder : o)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updatedOrder);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filters.status && order.status !== filters.status) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.supplier_name.toLowerCase().includes(searchLower) ||
        order.requester_name.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <ShoppingCart size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Órdenes de Compra
                </h1>
                <p className="text-gray-600">
                  Gestione todas sus órdenes de compra desde un solo lugar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Toolbar superior */}
          <div className="flex items-center justify-end">
            <Button
              variant="primary"
              leftIcon={<ShoppingCart size={20} className="mr-2" />}
              onClick={() => setIsModalOpen(true)}
            >
              Nueva Orden de Compra
            </Button>
          </div>

          {/* KPIs */}
          <PurchaseOrderKPIs orders={orders} />

          {/* Filtros */}
          <PurchaseOrderFilters filters={filters} onFiltersChange={setFilters} />

          {/* Tabla de Órdenes */}
          <PurchaseOrderTable
            orders={filteredOrders}
            loading={isLoading}
            onViewDetails={handleViewDetails}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>

      {/* Modales */}
      <PurchaseOrderFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrder}
      />

      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrdenesDeCompraPage;

