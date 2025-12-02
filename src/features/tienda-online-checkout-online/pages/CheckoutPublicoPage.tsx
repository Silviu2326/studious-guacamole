import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Input, Select, Badge } from '../../../components/componentsreutilizables';
import { EnlacePagoDirecto, Carrito, CarritoItem, DatosCheckout, MetodoPago } from '../types';
import { getEnlacePagoPorToken, incrementarUsoEnlace } from '../api/enlacesPago';
import { getMetodosPago, procesarCheckout } from '../api/checkout';
import { calcularPrecioConOpciones } from '../utils/precios';
import { aplicarDescuentosACarritoItem } from '../utils/descuentos';
import { CheckCircle, AlertCircle, CreditCard, Lock, Loader2, Store } from 'lucide-react';

export default function CheckoutPublicoPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [enlace, setEnlace] = useState<EnlacePagoDirecto | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [carrito, setCarrito] = useState<Carrito | null>(null);
  const [datos, setDatos] = useState<DatosCheckout>({
    nombre: '',
    email: '',
    telefono: '',
    metodoPago: '',
    terminosAceptados: false,
  });
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [procesando, setProcesando] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [mostrarExito, setMostrarExito] = useState(false);

  useEffect(() => {
    if (token) {
      cargarEnlace();
    }
  }, [token]);

  useEffect(() => {
    if (enlace) {
      construirCarrito();
      cargarMetodosPago();
    }
  }, [enlace]);

  const cargarEnlace = async () => {
    if (!token) {
      setError('Token no válido');
      setCargando(false);
      return;
    }

    try {
      const enlaceData = await getEnlacePagoPorToken(token);
      
      if (!enlaceData) {
        setError('Enlace de pago no encontrado o expirado');
        setCargando(false);
        return;
      }

      setEnlace(enlaceData);
    } catch (error) {
      console.error('Error cargando enlace:', error);
      setError('Error al cargar el enlace de pago');
    } finally {
      setCargando(false);
    }
  };

  const construirCarrito = () => {
    if (!enlace) return;

    const cantidad = enlace.cantidad || 1;
    const precioConOpciones = calcularPrecioConOpciones(
      enlace.producto,
      enlace.opcionesSeleccionadas || {}
    );

    const item: CarritoItem = {
      producto: enlace.producto,
      cantidad,
      subtotal: cantidad * precioConOpciones,
      precioBase: precioConOpciones,
      opcionesSeleccionadas: enlace.opcionesSeleccionadas,
    };

    // Aplicar descuentos
    const itemConDescuento = aplicarDescuentosACarritoItem(item);
    
    const subtotal = itemConDescuento.subtotal;
    const descuentoTotal = itemConDescuento.descuentoAplicado || 0;
    const impuestos = subtotal * 0.21;
    const total = subtotal + impuestos;

    setCarrito({
      items: [itemConDescuento],
      subtotal,
      descuentoTotal,
      impuestos,
      total,
    });
  };

  const cargarMetodosPago = async () => {
    try {
      const metodos = await getMetodosPago();
      setMetodosPago(metodos.filter((m) => m.disponible));
    } catch (error) {
      console.error('Error cargando métodos de pago:', error);
    }
  };

  const validarDatos = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!datos.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    }

    if (!datos.email.trim()) {
      nuevosErrores.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
      nuevosErrores.email = 'Email inválido';
    }

    if (!datos.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es obligatorio';
    }

    if (!datos.metodoPago) {
      nuevosErrores.metodoPago = 'Debes seleccionar un método de pago';
    }

    if (!datos.terminosAceptados) {
      nuevosErrores.terminos = 'Debes aceptar los términos y condiciones';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarDatos() || !carrito || !enlace) {
      return;
    }

    setProcesando(true);
    try {
      const resultado = await procesarCheckout({ carrito, datos });

      if (resultado.exito && resultado.ventaId && resultado.facturaId) {
        // Incrementar contador de usos del enlace
        await incrementarUsoEnlace(enlace.token);
        
        setMostrarExito(true);
      } else {
        setErrores({
          general: resultado.error || 'Error al procesar el pago',
        });
      }
    } catch (error) {
      setErrores({
        general: 'Error al procesar el checkout. Intenta de nuevo.',
      });
    } finally {
      setProcesando(false);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando enlace de pago...</p>
        </div>
      </div>
    );
  }

  if (error || !enlace || !carrito) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Enlace no válido</h2>
            <p className="text-gray-600 mb-6">
              {error || 'El enlace de pago no está disponible o ha expirado.'}
            </p>
            <Button variant="primary" onClick={() => navigate('/')}>
              Volver al inicio
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (mostrarExito) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h2>
            <p className="text-gray-600 mb-6">
              Tu compra se ha procesado correctamente. Recibirás un email de confirmación.
            </p>
            <Button variant="primary" onClick={() => navigate('/')}>
              Volver al inicio
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const item = carrito.items[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Store className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout de Pago</h1>
          {enlace.descripcion && (
            <p className="text-gray-600">{enlace.descripcion}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white shadow-sm sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Pedido</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.producto.nombre}</p>
                    <p className="text-sm text-gray-600">
                      Cantidad: {item.cantidad} × €{item.precioBase?.toFixed(2) || item.producto.precio.toFixed(2)}
                    </p>
                    {item.descuentoAplicado && item.descuentoAplicado > 0 && (
                      <p className="text-xs text-green-600 mt-1">
                        Descuento: -€{item.descuentoAplicado.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">€{carrito.subtotal.toFixed(2)}</span>
                </div>
                {carrito.descuentoTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Descuentos</span>
                    <span className="text-green-600">-€{carrito.descuentoTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Impuestos (21%)</span>
                  <span className="text-gray-900">€{carrito.impuestos.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-blue-600">€{carrito.total.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Formulario de checkout */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                  <Lock className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Datos de Facturación</h2>
              </div>

              {errores.general && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 mb-6">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-sm text-red-600">{errores.general}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre completo"
                    value={datos.nombre}
                    onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
                    error={errores.nombre}
                    required
                  />

                  <Input
                    label="Email"
                    type="email"
                    value={datos.email}
                    onChange={(e) => setDatos({ ...datos, email: e.target.value })}
                    error={errores.email}
                    required
                  />

                  <Input
                    label="Teléfono"
                    type="tel"
                    value={datos.telefono}
                    onChange={(e) => setDatos({ ...datos, telefono: e.target.value })}
                    error={errores.telefono}
                    required
                  />
                </div>

                <Select
                  label="Método de Pago"
                  options={metodosPago.map((m) => ({
                    value: m.id,
                    label: m.nombre,
                  }))}
                  value={datos.metodoPago}
                  onChange={(e) => setDatos({ ...datos, metodoPago: e.target.value })}
                  error={errores.metodoPago}
                  placeholder="Selecciona un método de pago"
                  required
                />

                {datos.metodoPago && (
                  <Card className="p-4 bg-slate-50 ring-1 ring-slate-200">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-600">
                        Pago seguro procesado mediante {metodosPago.find((m) => m.id === datos.metodoPago)?.nombre}
                      </span>
                    </div>
                  </Card>
                )}

                <div className="space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={datos.terminosAceptados}
                      onChange={(e) =>
                        setDatos({ ...datos, terminosAceptados: e.target.checked })
                      }
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400"
                    />
                    <span className="text-sm text-gray-600">
                      Acepto los términos y condiciones y la política de privacidad
                    </span>
                  </label>
                  {errores.terminos && (
                    <p className="text-xs text-red-600">{errores.terminos}</p>
                  )}
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={procesando}
                    fullWidth
                    className="text-lg py-3"
                  >
                    Procesar Pago (€{carrito.total.toFixed(2)})
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

