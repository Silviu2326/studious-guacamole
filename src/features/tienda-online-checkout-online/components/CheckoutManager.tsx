import React, { useState } from 'react';
import { Card, Button, Input, Select, Modal } from '../../../components/componentsreutilizables';
import { Carrito, DatosCheckout, MetodoPago } from '../types';
import { getMetodosPago, procesarCheckout } from '../api/checkout';
import { CheckCircle, AlertCircle, CreditCard, Lock } from 'lucide-react';

interface CheckoutManagerProps {
  carrito: Carrito;
  onCheckoutExitoso: (ventaId: string, facturaId: string) => void;
  onCancelar: () => void;
}

export const CheckoutManager: React.FC<CheckoutManagerProps> = ({
  carrito,
  onCheckoutExitoso,
  onCancelar,
}) => {
  const [datos, setDatos] = useState<DatosCheckout>({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    pais: 'España',
    metodoPago: '',
    terminosAceptados: false,
  });
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [procesando, setProcesando] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [mostrarExito, setMostrarExito] = useState(false);
  const [ventaExito, setVentaExito] = useState<{ ventaId: string; facturaId: string } | null>(null);

  React.useEffect(() => {
    cargarMetodosPago();
  }, []);

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

    if (!datos.direccion.trim()) {
      nuevosErrores.direccion = 'La dirección es obligatoria';
    }

    if (!datos.ciudad.trim()) {
      nuevosErrores.ciudad = 'La ciudad es obligatoria';
    }

    if (!datos.codigoPostal.trim()) {
      nuevosErrores.codigoPostal = 'El código postal es obligatorio';
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

    if (!validarDatos()) {
      return;
    }

    setProcesando(true);
    try {
      const resultado = await procesarCheckout({ carrito, datos });

      if (resultado.exito && resultado.ventaId && resultado.facturaId) {
        setVentaExito({
          ventaId: resultado.ventaId,
          facturaId: resultado.facturaId,
        });
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

  const handleExitoConfirmar = () => {
    if (ventaExito) {
      onCheckoutExitoso(ventaExito.ventaId, ventaExito.facturaId);
    }
    setMostrarExito(false);
  };

  return (
    <>
      <Card className="p-6 bg-white shadow-sm">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <Lock size={20} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Datos de Facturación
            </h2>
          </div>

          {errores.general && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} className="text-red-600" />
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

              <Input
                label="Código Postal"
                value={datos.codigoPostal}
                onChange={(e) => setDatos({ ...datos, codigoPostal: e.target.value })}
                error={errores.codigoPostal}
                required
              />

              <Input
                label="Dirección"
                value={datos.direccion}
                onChange={(e) => setDatos({ ...datos, direccion: e.target.value })}
                error={errores.direccion}
                required
              />

              <Input
                label="Ciudad"
                value={datos.ciudad}
                onChange={(e) => setDatos({ ...datos, ciudad: e.target.value })}
                error={errores.ciudad}
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
                  <CreditCard size={20} className="text-blue-600" />
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
                <p className="text-xs text-red-600">
                  {errores.terminos}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onCancelar}
                disabled={procesando}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={procesando}
                fullWidth
              >
                Procesar Pago (€{carrito.total.toFixed(2)})
              </Button>
            </div>
          </form>
        </div>
      </Card>

      <Modal
        isOpen={mostrarExito}
        onClose={handleExitoConfirmar}
        title="Compra Exitosa"
        size="md"
        footer={
          <Button variant="primary" onClick={handleExitoConfirmar}>
            Aceptar
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle size={40} className="text-green-600" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-base font-medium text-gray-900">
              Tu compra se ha procesado correctamente
            </p>
            {ventaExito && (
              <div className="space-y-1 mt-4">
                <p className="text-sm text-gray-600">
                  ID de Venta: <span className="font-mono text-gray-900">{ventaExito.ventaId}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Factura: <span className="font-mono text-gray-900">{ventaExito.facturaId}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

