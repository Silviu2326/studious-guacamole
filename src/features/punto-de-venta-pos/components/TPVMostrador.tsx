import React, { useState } from 'react';
import { Card, Button, Modal } from '../../../components/componentsreutilizables';
import { ProductoPOS, ItemCarrito, Venta } from '../types';
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  DollarSign,
  X,
  Search,
  Package,
  Loader2,
  AlertCircle
} from 'lucide-react';

/**
 * Componente TPV Mostrador
 * Interfaz de venta rápida para mostrador físico
 */
export const TPVMostrador: React.FC = () => {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [productos, setProductos] = useState<ProductoPOS[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'tarjeta' | 'mixto'>('efectivo');

  // Calcular totales del carrito
  const calcularTotales = () => {
    const subtotal = carrito.reduce((sum, item) => sum + item.subtotal, 0);
    const descuentoTotal = carrito.reduce((sum, item) => sum + (item.descuento || 0), 0);
    const subtotalConDescuento = subtotal - descuentoTotal;
    const impuestos = subtotalConDescuento * 0.21;
    const total = subtotalConDescuento + impuestos;

    return {
      subtotal,
      descuentoTotal,
      subtotalConDescuento,
      impuestos,
      total
    };
  };

  const totales = calcularTotales();

  // Filtrar productos por búsqueda
  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    producto.categoria?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Manejar agregar producto al carrito
  const handleAgregarProducto = (producto: ProductoPOS) => {
    const itemExistente = carrito.find(item => item.producto.id === producto.id);

    if (itemExistente) {
      setCarrito(carrito.map(item =>
        item.producto.id === producto.id
          ? {
              ...item,
              cantidad: item.cantidad + 1,
              subtotal: (item.cantidad + 1) * producto.precio
            }
          : item
      ));
    } else {
      setCarrito([
        ...carrito,
        {
          producto,
          cantidad: 1,
          subtotal: producto.precio
        }
      ]);
    }
  };

  // Manejar actualizar cantidad
  const handleActualizarCantidad = (productoId: string, cambio: number) => {
    const item = carrito.find(item => item.producto.id === productoId);
    if (!item) return;

    const nuevaCantidad = item.cantidad + cambio;
    if (nuevaCantidad <= 0) {
      handleEliminarItem(productoId);
      return;
    }

    setCarrito(carrito.map(item =>
      item.producto.id === productoId
        ? {
            ...item,
            cantidad: nuevaCantidad,
            subtotal: nuevaCantidad * item.producto.precio
          }
        : item
    ));
  };

  // Manejar eliminar item
  const handleEliminarItem = (productoId: string) => {
    setCarrito(carrito.filter(item => item.producto.id !== productoId));
  };

  // Manejar limpiar carrito
  const handleLimpiarCarrito = () => {
    setCarrito([]);
  };

  // Manejar proceso de pago
  const handleProcesarPago = async () => {
    if (carrito.length === 0) return;

    setLoading(true);
    try {
      // Aquí iría la lógica de procesamiento de pago
      // await procesarVenta(carrito, metodoPago);
      
      // Simulación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCarrito([]);
      setMostrarModalPago(false);
      setMetodoPago('efectivo');
      // Mostrar mensaje de éxito
    } catch (err) {
      setError('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button
          variant="primary"
          onClick={() => setMostrarModalPago(true)}
          disabled={carrito.length === 0}
        >
          <CreditCard size={20} className="mr-2" />
          Procesar Venta
        </Button>
      </div>

      {/* Grid principal: Productos y Carrito */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de Productos */}
        <div className="lg:col-span-2 space-y-4">
          {/* Barra de búsqueda */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Grid de Productos */}
          {error && (
            <Card className="p-8 text-center bg-white shadow-sm">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar productos</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => setError(null)}>Reintentar</Button>
            </Card>
          )}

          {loading ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando productos...</p>
            </Card>
          ) : productosFiltrados.length === 0 ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay productos disponibles</h3>
              <p className="text-gray-600">Busca productos o agrega nuevos al catálogo</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productosFiltrados.map((producto) => (
                <Card
                  key={producto.id}
                  variant="hover"
                  className="h-full flex flex-col transition-shadow overflow-hidden"
                >
                  <div className="p-4 space-y-3">
                    {producto.imagen && (
                      <div className="h-48 bg-gray-100 rounded-xl overflow-hidden">
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {producto.nombre}
                      </h3>
                      {producto.descripcion && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {producto.descripcion}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xl font-bold text-blue-600">
                          €{producto.precio.toFixed(2)}
                        </span>
                        {producto.stock !== undefined && (
                          <span className="text-xs text-gray-500">
                            Stock: {producto.stock}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                      <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        onClick={() => handleAgregarProducto(producto)}
                        disabled={producto.stock === 0}
                      >
                        <Plus size={16} className="mr-1" />
                        Agregar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Panel de Carrito */}
        <div className="lg:col-span-1">
          <Card className="bg-white shadow-sm sticky top-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={20} className="text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Carrito</h2>
                  {carrito.length > 0 && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {carrito.length}
                    </span>
                  )}
                </div>
                {carrito.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLimpiarCarrito}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>

              {carrito.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">El carrito está vacío</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {carrito.map((item) => (
                      <div
                        key={item.producto.id}
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {item.producto.nombre}
                          </h4>
                          <p className="text-xs text-gray-600">
                            €{item.producto.precio.toFixed(2)} c/u
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleActualizarCantidad(item.producto.id, -1)}
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="w-8 text-center text-sm font-semibold">
                            {item.cantidad}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleActualizarCantidad(item.producto.id, 1)}
                          >
                            <Plus size={14} />
                          </Button>
                        </div>

                        <div className="text-right min-w-[4rem]">
                          <p className="text-sm font-semibold text-gray-900">
                            €{item.subtotal.toFixed(2)}
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEliminarItem(item.producto.id)}
                        >
                          <Trash2 size={14} className="text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Resumen de totales */}
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold text-gray-900">
                        €{totales.subtotal.toFixed(2)}
                      </span>
                    </div>
                    {totales.descuentoTotal > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Descuento:</span>
                        <span className="font-semibold text-green-600">
                          -€{totales.descuentoTotal.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">IVA (21%):</span>
                      <span className="font-semibold text-gray-900">
                        €{totales.impuestos.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-blue-600">
                        €{totales.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => setMostrarModalPago(true)}
                  >
                    <CreditCard size={20} className="mr-2" />
                    Finalizar Venta
                  </Button>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de Pago */}
      <Modal
        isOpen={mostrarModalPago}
        onClose={() => setMostrarModalPago(false)}
        title="Procesar Pago"
        size="md"
      >
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total a pagar:</span>
              <span className="text-xl font-bold text-blue-600">
                €{totales.total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Método de pago
            </label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={metodoPago === 'efectivo' ? 'primary' : 'secondary'}
                onClick={() => setMetodoPago('efectivo')}
                className="flex flex-col items-center gap-2"
              >
                <DollarSign size={24} />
                Efectivo
              </Button>
              <Button
                variant={metodoPago === 'tarjeta' ? 'primary' : 'secondary'}
                onClick={() => setMetodoPago('tarjeta')}
                className="flex flex-col items-center gap-2"
              >
                <CreditCard size={24} />
                Tarjeta
              </Button>
              <Button
                variant={metodoPago === 'mixto' ? 'primary' : 'secondary'}
                onClick={() => setMetodoPago('mixto')}
                className="flex flex-col items-center gap-2"
              >
                <ShoppingCart size={24} />
                Mixto
              </Button>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setMostrarModalPago(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleProcesarPago}
              loading={loading}
            >
              Confirmar Pago
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

