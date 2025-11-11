import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Modal, Button } from '../../../components/componentsreutilizables';
import {
  TiendaOnline,
  CheckoutManager,
  GestorVentas,
  CarritoCompras,
  GestorBonosClientes,
  GeneradorEnlacesPago,
  GestorCodigosPromocionales,
  GeneradorCodigosQR,
  GestorBonosRegaloB2B,
  GestorRecordatoriosBonos,
  GestorOfertasEspeciales,
} from '../components';
import { SelectorOpcionesProducto } from '../components/SelectorOpcionesProducto';
import { Producto, CarritoItem, Carrito, Venta, OpcionesSeleccionadas, CodigoPromocional, ValoracionProducto, EstadisticasValoraciones } from '../types';
import { ShoppingCart, Store, Receipt, Users, Tag, QrCode, Building2, Bell, Gift } from 'lucide-react';
import { aplicarDescuentosACarritoItem } from '../utils/descuentos';
import { calcularPrecioConOpciones } from '../utils/precios';
import { validarCodigoPromocional as validarCodigoAPI } from '../api/codigosPromocionales';
import { getValoracionesDestacadas, getEstadisticasValoraciones } from '../api/valoraciones';
import { ValoracionesProducto } from '../components/ValoracionesProducto';

export default function TiendaOnlineCheckoutOnlinePage() {
  const { user } = useAuth();
  const rol = user?.role === 'entrenador' ? 'entrenador' : 'gimnasio';

  const [tabActiva, setTabActiva] = useState<string>('tienda');
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarDetalleProducto, setMostrarDetalleProducto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [opcionesSeleccionadasProducto, setOpcionesSeleccionadasProducto] = useState<OpcionesSeleccionadas>({});
  const [valoracionesProducto, setValoracionesProducto] = useState<ValoracionProducto[]>([]);
  const [estadisticasValoraciones, setEstadisticasValoraciones] = useState<EstadisticasValoraciones | null>(null);
  const [cargandoValoraciones, setCargandoValoraciones] = useState(false);
  const [enCheckout, setEnCheckout] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState<Venta | null>(null);
  const [mostrarDetalleVenta, setMostrarDetalleVenta] = useState(false);
  const [codigoPromocional, setCodigoPromocional] = useState<CodigoPromocional | null>(null);

  const calcularCarrito = (descuentoFidelidad?: { porcentaje: number; descripcion: string }): Carrito => {
    // Aplicar descuentos a cada item del carrito
    const itemsConDescuentos = carrito.map((item) => aplicarDescuentosACarritoItem(item));
    
    // Subtotal después de descuentos por cantidad
    const subtotalConDescuentosCantidad = itemsConDescuentos.reduce((sum, item) => sum + item.subtotal, 0);
    const descuentoTotal = itemsConDescuentos.reduce((sum, item) => sum + (item.descuentoAplicado || 0), 0);
    
    let subtotalFinal = subtotalConDescuentosCantidad;
    let descuentoCodigoPromocional = 0;
    let descuentoFidelidadCalculado = 0;
    let porcentajeDescuentoFidelidad = 0;

    // Aplicar descuento de fidelidad si existe (se aplica antes del código promocional)
    if (descuentoFidelidad) {
      porcentajeDescuentoFidelidad = descuentoFidelidad.porcentaje;
      descuentoFidelidadCalculado = (subtotalConDescuentosCantidad * porcentajeDescuentoFidelidad) / 100;
      subtotalFinal = subtotalConDescuentosCantidad - descuentoFidelidadCalculado;
    }

    // Aplicar código promocional si existe (se aplica después del descuento de fidelidad)
    if (codigoPromocional) {
      if (codigoPromocional.tipoDescuento === 'porcentual') {
        descuentoCodigoPromocional = (subtotalFinal * codigoPromocional.valorDescuento) / 100;
      } else {
        descuentoCodigoPromocional = codigoPromocional.valorDescuento;
        if (descuentoCodigoPromocional > subtotalFinal) {
          descuentoCodigoPromocional = subtotalFinal;
        }
      }
      subtotalFinal = subtotalFinal - descuentoCodigoPromocional;
    }

    const impuestos = subtotalFinal * 0.21;
    const total = subtotalFinal + impuestos;

    return {
      items: itemsConDescuentos,
      subtotal: subtotalFinal,
      descuentoTotal,
      descuentoCodigoPromocional: descuentoCodigoPromocional > 0 ? descuentoCodigoPromocional : undefined,
      codigoPromocional: codigoPromocional || undefined,
      descuentoFidelidad: descuentoFidelidadCalculado > 0 ? descuentoFidelidadCalculado : undefined,
      porcentajeDescuentoFidelidad: porcentajeDescuentoFidelidad > 0 ? porcentajeDescuentoFidelidad : undefined,
      impuestos,
      total,
    };
  };

  const handleAplicarCodigoPromocional = async (codigo: string) => {
    const carritoCalculado = calcularCarrito();
    const validacion = await validarCodigoAPI(codigo, carritoCalculado);
    
    if (validacion.valido && validacion.codigo) {
      setCodigoPromocional(validacion.codigo);
      return { exito: true };
    } else {
      return { exito: false, error: validacion.error || 'Código inválido' };
    }
  };

  const handleRemoverCodigoPromocional = () => {
    setCodigoPromocional(null);
  };

  const handleAgregarCarrito = (
    product: Producto,
    cantidad: number = 1,
    opciones?: OpcionesSeleccionadas
  ) => {
    const opcionesFinales = opciones || {};
    const precioConOpciones = calcularPrecioConOpciones(product, opcionesFinales);
    
    // Buscar si existe un item con el mismo producto y las mismas opciones
    const itemExistente = carrito.find((item) => {
      if (item.producto.id !== product.id) return false;
      
      // Comparar opciones seleccionadas
      const itemOpciones = item.opcionesSeleccionadas || {};
      const opcionesKeys = Object.keys(opcionesFinales);
      const itemOpcionesKeys = Object.keys(itemOpciones);
      
      if (opcionesKeys.length !== itemOpcionesKeys.length) return false;
      
      return opcionesKeys.every(
        (key) => itemOpciones[key] === opcionesFinales[key]
      );
    });

    if (itemExistente) {
      const nuevaCantidad = itemExistente.cantidad + cantidad;
      setCarrito(
        carrito.map((item) =>
          item.producto.id === product.id &&
          JSON.stringify(item.opcionesSeleccionadas || {}) === JSON.stringify(opcionesFinales)
            ? {
                ...item,
                cantidad: nuevaCantidad,
                subtotal: nuevaCantidad * precioConOpciones, // Se recalculará con descuentos en calcularCarrito
              }
            : item
        )
      );
    } else {
      const nuevoItem: CarritoItem = {
        producto: product,
        cantidad,
        subtotal: cantidad * precioConOpciones, // Se recalculará con descuentos en calcularCarrito
        opcionesSeleccionadas: Object.keys(opcionesFinales).length > 0 ? opcionesFinales : undefined,
        precioBase: precioConOpciones,
      };
      setCarrito([...carrito, nuevoItem]);
    }
    setMostrarCarrito(true);
    // Limpiar opciones seleccionadas después de agregar
    setOpcionesSeleccionadasProducto({});
  };

  const handleActualizarCantidad = (productoId: string, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      handleEliminarCarrito(productoId);
      return;
    }

    setCarrito(
      carrito.map((item) => {
        if (item.producto.id === productoId) {
          return {
            ...item,
            cantidad: nuevaCantidad,
            subtotal: nuevaCantidad * item.producto.precio, // Se recalculará con descuentos en calcularCarrito
          };
        }
        return item;
      })
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
    setCodigoPromocional(null);
    setEnCheckout(false);
    setTabActiva('ventas');
    // Aquí podrías mostrar una notificación de éxito
  };

  const handleCancelarCheckout = () => {
    setEnCheckout(false);
  };

  const handleVerDetalleProducto = async (producto: Producto) => {
    setProductoSeleccionado(producto);
    setOpcionesSeleccionadasProducto({});
    setMostrarDetalleProducto(true);
    
    // Cargar valoraciones del producto
    setCargandoValoraciones(true);
    try {
      const [valoraciones, estadisticas] = await Promise.all([
        getValoracionesDestacadas(producto.id, 5),
        getEstadisticasValoraciones(producto.id),
      ]);
      setValoracionesProducto(valoraciones);
      setEstadisticasValoraciones(estadisticas);
    } catch (error) {
      console.error('Error cargando valoraciones:', error);
      setValoracionesProducto([]);
      setEstadisticasValoraciones(null);
    } finally {
      setCargandoValoraciones(false);
    }
  };

  const handleVerDetalleVenta = (venta: Venta) => {
    setVentaSeleccionada(venta);
    setMostrarDetalleVenta(true);
  };

  // Calcular carrito sin descuento de fidelidad (se calculará en CheckoutManager)
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
            carritoBase={carrito}
            onCheckoutExitoso={handleCheckoutExitoso}
            onCancelar={handleCancelarCheckout}
            entrenadorId={rol === 'entrenador' ? user?.id : undefined}
            onAplicarCodigoPromocional={handleAplicarCodigoPromocional}
            onRemoverCodigoPromocional={handleRemoverCodigoPromocional}
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
                  {rol === 'entrenador' && (
                    <>
                      <button
                        onClick={() => setTabActiva('bonos')}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                          tabActiva === 'bonos'
                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                        }`}
                      >
                        <Users size={18} className={tabActiva === 'bonos' ? 'opacity-100' : 'opacity-70'} />
                        <span>Bonos y Sesiones</span>
                      </button>
                      <button
                        onClick={() => setTabActiva('bonos-b2b')}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                          tabActiva === 'bonos-b2b'
                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                        }`}
                      >
                        <Building2 size={18} className={tabActiva === 'bonos-b2b' ? 'opacity-100' : 'opacity-70'} />
                        <span>Bonos B2B</span>
                      </button>
                      <button
                        onClick={() => setTabActiva('enlaces-pago')}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                          tabActiva === 'enlaces-pago'
                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                        }`}
                      >
                        <Store size={18} className={tabActiva === 'enlaces-pago' ? 'opacity-100' : 'opacity-70'} />
                        <span>Enlaces de Pago</span>
                      </button>
                      <button
                        onClick={() => setTabActiva('codigos-promocionales')}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                          tabActiva === 'codigos-promocionales'
                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                        }`}
                      >
                        <Tag size={18} className={tabActiva === 'codigos-promocionales' ? 'opacity-100' : 'opacity-70'} />
                        <span>Códigos Promocionales</span>
                      </button>
                      <button
                        onClick={() => setTabActiva('codigos-qr')}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                          tabActiva === 'codigos-qr'
                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                        }`}
                      >
                        <QrCode size={18} className={tabActiva === 'codigos-qr' ? 'opacity-100' : 'opacity-70'} />
                        <span>Códigos QR</span>
                      </button>
                      <button
                        onClick={() => setTabActiva('recordatorios-bonos')}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                          tabActiva === 'recordatorios-bonos'
                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                        }`}
                      >
                        <Bell size={18} className={tabActiva === 'recordatorios-bonos' ? 'opacity-100' : 'opacity-70'} />
                        <span>Recordatorios</span>
                      </button>
                      <button
                        onClick={() => setTabActiva('ofertas-especiales')}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                          tabActiva === 'ofertas-especiales'
                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                        }`}
                      >
                        <Gift size={18} className={tabActiva === 'ofertas-especiales' ? 'opacity-100' : 'opacity-70'} />
                        <span>Ofertas Especiales</span>
                      </button>
                    </>
                  )}
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

            {tabActiva === 'bonos' && rol === 'entrenador' && (
              <GestorBonosClientes entrenadorId={user?.id} />
            )}

            {tabActiva === 'bonos-b2b' && rol === 'entrenador' && (
              <GestorBonosRegaloB2B entrenadorId={user?.id} />
            )}

            {tabActiva === 'enlaces-pago' && rol === 'entrenador' && (
              <GeneradorEnlacesPago entrenadorId={user?.id || ''} rol={rol} />
            )}

            {tabActiva === 'codigos-promocionales' && rol === 'entrenador' && (
              <GestorCodigosPromocionales entrenadorId={user?.id} />
            )}

            {tabActiva === 'codigos-qr' && rol === 'entrenador' && (
              <GeneradorCodigosQR entrenadorId={user?.id || ''} rol={rol} />
            )}

            {tabActiva === 'recordatorios-bonos' && rol === 'entrenador' && (
              <GestorRecordatoriosBonos entrenadorId={user?.id} />
            )}

            {tabActiva === 'ofertas-especiales' && rol === 'entrenador' && (
              <GestorOfertasEspeciales entrenadorId={user?.id} />
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
          items={carritoCalculado.items}
          subtotal={carritoCalculado.subtotal}
          descuentoTotal={carritoCalculado.descuentoTotal}
          descuentoCodigoPromocional={carritoCalculado.descuentoCodigoPromocional}
          codigoPromocional={carritoCalculado.codigoPromocional}
          impuestos={carritoCalculado.impuestos}
          total={carritoCalculado.total}
          onActualizarCantidad={handleActualizarCantidad}
          onEliminar={handleEliminarCarrito}
          onCheckout={handleCheckout}
          onCerrar={() => setMostrarCarrito(false)}
          onAplicarCodigoPromocional={handleAplicarCodigoPromocional}
          onRemoverCodigoPromocional={handleRemoverCodigoPromocional}
        />
      </Modal>

      {/* Modal Detalle Producto */}
      <Modal
        isOpen={mostrarDetalleProducto}
        onClose={() => {
          setMostrarDetalleProducto(false);
          setProductoSeleccionado(null);
          setOpcionesSeleccionadasProducto({});
          setValoracionesProducto([]);
          setEstadisticasValoraciones(null);
        }}
        title={productoSeleccionado?.nombre}
        size="lg"
      >
        {productoSeleccionado && (
          <div className="space-y-4">
            <div className="w-full h-64 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center">
              <Store className="w-24 h-24 text-white opacity-80" />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  €{productoSeleccionado.precio.toFixed(2)}
                  {productoSeleccionado.metadatos?.suscripcion?.esSuscripcion && (
                    <span className="text-sm text-gray-600 ml-2">
                      / {productoSeleccionado.metadatos.suscripcion.cicloFacturacion === 'mensual' ? 'mes' : productoSeleccionado.metadatos.suscripcion.cicloFacturacion}
                    </span>
                  )}
                </p>
                {productoSeleccionado.metadatos?.suscripcion?.esSuscripcion && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Suscripción con cargo automático recurrente</strong>
                    </p>
                    {productoSeleccionado.metadatos.suscripcion.precioInicial && (
                      <p className="text-xs text-blue-600 mt-1">
                        Precio especial primer mes: €{productoSeleccionado.metadatos.suscripcion.precioInicial.toFixed(2)}
                      </p>
                    )}
                  </div>
                )}
                <p className="text-gray-600 mt-2">
                  {productoSeleccionado.descripcion}
                </p>
              </div>

              {/* Selector de opciones personalizables */}
              {productoSeleccionado.metadatos?.opcionesPersonalizables && 
               productoSeleccionado.metadatos.opcionesPersonalizables.length > 0 && (
                <SelectorOpcionesProducto
                  producto={productoSeleccionado}
                  opcionesIniciales={opcionesSeleccionadasProducto}
                  onOpcionesCambiadas={(opciones, precioFinal) => {
                    setOpcionesSeleccionadasProducto(opciones);
                  }}
                />
              )}

              {/* Valoraciones y comentarios */}
              {estadisticasValoraciones && estadisticasValoraciones.totalValoraciones > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <ValoracionesProducto
                    estadisticas={estadisticasValoraciones}
                    valoraciones={valoracionesProducto}
                    mostrarComentarios={true}
                    limiteComentarios={5}
                  />
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setMostrarDetalleProducto(false);
                    setProductoSeleccionado(null);
                    setOpcionesSeleccionadasProducto({});
                  }}
                >
                  Cerrar
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    handleAgregarCarrito(
                      productoSeleccionado,
                      1,
                      Object.keys(opcionesSeleccionadasProducto).length > 0
                        ? opcionesSeleccionadasProducto
                        : undefined
                    );
                    setMostrarDetalleProducto(false);
                    setProductoSeleccionado(null);
                    setOpcionesSeleccionadasProducto({});
                    setValoracionesProducto([]);
                    setEstadisticasValoraciones(null);
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

