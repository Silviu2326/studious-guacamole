import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Modal, Button } from '../../../components/componentsreutilizables';
import {
  TiendaOnline,
  CheckoutManager,
  GestorVentas,
  CarritoCompras,
} from '../components';
import { Producto, CarritoItem, Carrito, Venta } from '../types';
import { ShoppingCart, Store, Receipt } from 'lucide-react';

export default function TiendaOnlineCheckoutOnlinePage() {
  const { user } = useAuth();
  const rol = user?.role === 'entrenador' ? 'entrenador' : 'gimnasio';

  const [tabActiva, setTabActiva] = useState<string>('tienda');
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarDetalleProducto, setMostrarDetalleProducto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [enCheckout, setEnCheckout] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState<Venta | null>(null);
  const [mostrarDetalleVenta, setMostrarDetalleVenta] = useState(false);

  const calcularCarrito = (): Carrito => {
    const subtotal = carrito.reduce((sum, item) => sum + item.subtotal, 0);
    const impuestos = subtotal * 0.21;
    const total = subtotal + impuestos;

    return {
      items: carrito,
      subtotal,
      impuestos,
      total,
    };
  };

  const handleAgregarCarrito = (producto: Producto, cantidad: number = 1) => {
    const itemExistente = carrito.find((item) => item.producto.id === producto.id);

    if (itemExistente) {
      setCarrito(
        carrito.map((item) =>
          item.producto.id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + cantidad,
                subtotal: (item.cantidad + cantidad) * producto.precio,
              }
            : item
        )
      );
    } else {
      setCarrito([
        ...carrito,
        {
          producto,
          cantidad,
          subtotal: cantidad * producto.precio,
        },
      ]);
    }
    setMostrarCarrito(true);
  };

  const handleActualizarCantidad = (productoId: string, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      handleEliminarCarrito(productoId);
      return;
    }

    setCarrito(
      carrito.map((item) =>
        item.producto.id === productoId
          ? {
              ...item,
              cantidad: nuevaCantidad,
              subtotal: nuevaCantidad * item.producto.precio,
            }
          : item
      )
    );
  };

  const handleEliminarCarrito = (productoId: string) => {
    setCarrito(carrito.filter((item) => item.producto.id !== productoId));
  };

  const handleCheckout = () => {
    setEnCheckout(true);
    setMostrarCarrito(false);
  };

  const handleCheckoutExitoso = (ventaId: string, facturaId: string) => {
    setCarrito([]);
    setEnCheckout(false);
    setTabActiva('ventas');
    // Aquí podrías mostrar una notificación de éxito
  };

  const handleCancelarCheckout = () => {
    setEnCheckout(false);
  };

  const handleVerDetalleProducto = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setMostrarDetalleProducto(true);
  };

  const handleVerDetalleVenta = (venta: Venta) => {
    setVentaSeleccionada(venta);
    setMostrarDetalleVenta(true);
  };

  const carritoCalculado = calcularCarrito();
  const cantidadCarrito = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Store size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    {rol === 'entrenador' ? 'Tienda de Servicios' : 'Tienda Online'}
                  </h1>
                  <p className="text-gray-600">
                    {rol === 'entrenador'
                      ? 'Vende servicios de entrenamiento y nutrición'
                      : 'Gestiona productos, suplementos y bonos regalo'}
                  </p>
                </div>
              </div>
              
              {/* Botón de carrito */}
              {!enCheckout && (
                <Button
                  variant="primary"
                  onClick={() => setMostrarCarrito(true)}
                  className="relative"
                >
                  <ShoppingCart size={20} className="mr-2" />
                  Carrito
                  {cantidadCarrito > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cantidadCarrito}
                    </span>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Contenido según estado */}
        {enCheckout ? (
          <CheckoutManager
            carrito={carritoCalculado}
            onCheckoutExitoso={handleCheckoutExitoso}
            onCancelar={handleCancelarCheckout}
          />
        ) : (
          <div className="space-y-6">
            {/* Sistema de Tabs */}
            <Card className="p-0 bg-white shadow-sm">
              <div className="px-4 py-3">
                <div
                  role="tablist"
                  aria-label="Secciones"
                  className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
                >
                  <button
                    onClick={() => setTabActiva('tienda')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      tabActiva === 'tienda'
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Store size={18} className={tabActiva === 'tienda' ? 'opacity-100' : 'opacity-70'} />
                    <span>Tienda</span>
                  </button>
                  <button
                    onClick={() => setTabActiva('ventas')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      tabActiva === 'ventas'
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Receipt size={18} className={tabActiva === 'ventas' ? 'opacity-100' : 'opacity-70'} />
                    <span>Mis Ventas</span>
                  </button>
                </div>
              </div>
            </Card>

            {tabActiva === 'tienda' && (
              <TiendaOnline
                rol={rol}
                carrito={carrito}
                onAgregarCarrito={handleAgregarCarrito}
                onVerDetalle={handleVerDetalleProducto}
              />
            )}

            {tabActiva === 'ventas' && (
              <GestorVentas
                rol={rol}
                onVerDetalle={handleVerDetalleVenta}
              />
            )}
          </div>
        )}
      </div>

      {/* Modal Carrito */}
      <Modal
        isOpen={mostrarCarrito && !enCheckout}
        onClose={() => setMostrarCarrito(false)}
        title="Carrito de Compras"
        size="lg"
      >
        <CarritoCompras
          items={carrito}
          subtotal={carritoCalculado.subtotal}
          impuestos={carritoCalculado.impuestos}
          total={carritoCalculado.total}
          onActualizarCantidad={handleActualizarCantidad}
          onEliminar={handleEliminarCarrito}
          onCheckout={handleCheckout}
          onCerrar={() => setMostrarCarrito(false)}
        />
      </Modal>

      {/* Modal Detalle Producto */}
      <Modal
        isOpen={mostrarDetalleProducto}
        onClose={() => {
          setMostrarDetalleProducto(false);
          setProductoSeleccionado(null);
        }}
        title={productoSeleccionado?.nombre}
        size="lg"
      >
        {productoSeleccionado && (
          <div className="space-y-4">
            <div className="w-full h-64 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center">
              <Store className="w-24 h-24 text-white opacity-80" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-900">
                €{productoSeleccionado.precio.toFixed(2)}
              </p>
              <p className="text-gray-600">
                {productoSeleccionado.descripcion}
              </p>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setMostrarDetalleProducto(false);
                    setProductoSeleccionado(null);
                  }}
                >
                  Cerrar
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    handleAgregarCarrito(productoSeleccionado);
                    setMostrarDetalleProducto(false);
                    setProductoSeleccionado(null);
                    setMostrarCarrito(true);
                  }}
                  disabled={!productoSeleccionado.disponible}
                >
                  <ShoppingCart size={16} className="mr-2" />
                  Agregar al Carrito
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Detalle Venta */}
      <Modal
        isOpen={mostrarDetalleVenta}
        onClose={() => {
          setMostrarDetalleVenta(false);
          setVentaSeleccionada(null);
        }}
        title={`Venta ${ventaSeleccionada?.id}`}
        size="lg"
      >
        {ventaSeleccionada && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-white shadow-sm">
                <p className="text-xs text-slate-600 mb-2">
                  Cliente
                </p>
                <p className="text-base text-gray-900 font-medium mt-1">
                  {ventaSeleccionada.cliente.nombre}
                </p>
                <p className="text-sm text-gray-600">
                  {ventaSeleccionada.cliente.email}
                </p>
              </Card>
              <Card className="p-4 bg-white shadow-sm">
                <p className="text-xs text-slate-600 mb-2">
                  Total
                </p>
                <p className="text-xl font-bold text-blue-600 mt-1">
                  €{ventaSeleccionada.total.toFixed(2)}
                </p>
              </Card>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Productos
              </h3>
              <div className="space-y-2">
                {ventaSeleccionada.productos.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 border border-slate-200 rounded-lg"
                  >
                    <div>
                      <p className="text-base font-medium text-gray-900">
                        {item.producto.nombre}
                      </p>
                      <p className="text-sm text-gray-600">
                        Cantidad: {item.cantidad}
                      </p>
                    </div>
                    <p className="text-base font-semibold text-gray-900">
                      €{item.subtotal.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

