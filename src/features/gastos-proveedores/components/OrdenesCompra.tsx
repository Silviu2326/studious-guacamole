import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Modal } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { getOrdenesCompra, createOrdenCompra, updateOrdenCompra, aprobarOrdenCompra, recibirOrdenCompra, pagarOrdenCompra } from '../api/ordenes-compra';
import { getProveedores } from '../api/proveedores';
import { OrdenCompra, Proveedor } from '../types';
import { ShoppingCart, Plus, CheckCircle, Package, Eye } from 'lucide-react';

export const OrdenesCompra: React.FC = () => {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<OrdenCompra | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [ordenesData, proveedoresData] = await Promise.all([
        getOrdenesCompra(),
        getProveedores({ activo: true }),
      ]);
      setOrdenes(ordenesData);
      setProveedores(proveedoresData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerOrden = (orden: OrdenCompra) => {
    setOrdenSeleccionada(orden);
    setMostrarModal(true);
  };

  const handleAprobarOrden = async (id: string) => {
    try {
      await aprobarOrdenCompra(id);
      await cargarDatos();
    } catch (error) {
      console.error('Error al aprobar orden:', error);
    }
  };

  const handleRecibirOrden = async (id: string) => {
    try {
      await recibirOrdenCompra(id);
      await cargarDatos();
    } catch (error) {
      console.error('Error al recibir orden:', error);
    }
  };

  const handlePagarOrden = async (id: string) => {
    try {
      await pagarOrdenCompra(id);
      await cargarDatos();
    } catch (error) {
      console.error('Error al pagar orden:', error);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { color: string; label: string }> = {
      pendiente: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendiente' },
      enviada: { color: 'bg-blue-100 text-blue-800', label: 'Enviada' },
      recibida: { color: 'bg-green-100 text-green-800', label: 'Recibida' },
      aprobada: { color: 'bg-purple-100 text-purple-800', label: 'Aprobada' },
      rechazada: { color: 'bg-red-100 text-red-800', label: 'Rechazada' },
      pagada: { color: 'bg-green-100 text-green-800', label: 'Pagada' },
    };
    const estadoInfo = estados[estado] || estados.pendiente;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoInfo.color}`}>
        {estadoInfo.label}
      </span>
    );
  };

  const columnas = [
    {
      key: 'numero',
      label: 'Número',
    },
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value: Date) => value.toLocaleDateString('es-CO'),
    },
    {
      key: 'proveedor',
      label: 'Proveedor',
      render: (value: string | undefined) => value || 'N/A',
    },
    {
      key: 'total',
      label: 'Total',
      render: (value: number) => formatearMoneda(value),
      align: 'right' as const,
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: string) => getEstadoBadge(value),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: OrdenCompra) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleVerOrden(row)}
            className="text-blue-600 hover:text-blue-800"
            title="Ver Detalles"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.estado === 'pendiente' && (
            <button
              onClick={() => handleAprobarOrden(row.id)}
              className="text-green-600 hover:text-green-800"
              title="Aprobar"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          {row.estado === 'aprobada' && (
            <button
              onClick={() => handleRecibirOrden(row.id)}
              className="text-purple-600 hover:text-purple-800"
              title="Marcar como Recibida"
            >
              <Package className="w-4 h-4" />
            </button>
          )}
          {row.estado === 'recibida' && (
            <button
              onClick={() => handlePagarOrden(row.id)}
              className="text-green-600 hover:text-green-800"
              title="Marcar como Pagada"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar Superior */}
      <div className="flex items-center justify-end">
        <Button onClick={() => {}}>
          <Plus size={20} className="mr-2" />
          Nueva Orden
        </Button>
      </div>

      {/* Tabla de Órdenes */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <Table
            data={ordenes}
            columns={columnas}
            loading={loading}
            emptyMessage="No hay órdenes de compra registradas"
          />
        </div>
      </Card>

      {ordenSeleccionada && (
        <Modal
          isOpen={mostrarModal}
          onClose={() => setMostrarModal(false)}
          title={`Orden de Compra ${ordenSeleccionada.numero}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                  Proveedor
                </p>
                <p className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {ordenSeleccionada.proveedor || 'N/A'}
                </p>
              </div>
              <div>
                <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                  Fecha
                </p>
                <p className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {ordenSeleccionada.fecha.toLocaleDateString('es-CO')}
                </p>
              </div>
              <div>
                <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                  Estado
                </p>
                <div>{getEstadoBadge(ordenSeleccionada.estado)}</div>
              </div>
              <div>
                <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                  Total
                </p>
                <p className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} font-semibold`}>
                  {formatearMoneda(ordenSeleccionada.total)}
                </p>
              </div>
            </div>

            <div>
              <p className={`${ds.typography.bodySmall} font-semibold mb-2 ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Items
              </p>
              <div className="space-y-2">
                {ordenSeleccionada.items.map((item) => (
                  <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.producto}</p>
                        {item.descripcion && (
                          <p className="text-sm text-gray-500">{item.descripcion}</p>
                        )}
                        <p className="text-sm text-gray-500">
                          Cantidad: {item.cantidad} × {formatearMoneda(item.precioUnitario)}
                        </p>
                      </div>
                      <p className="font-semibold">{formatearMoneda(item.subtotal)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

