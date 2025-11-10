import React, { useState } from 'react';
import { Card, Button, Badge, Input } from '../../../components/componentsreutilizables';
import { CarritoItem, CodigoPromocional } from '../types';
import { ShoppingCart, Plus, Minus, Trash2, X, Tag, Repeat, Settings, Check, AlertCircle } from 'lucide-react';
import { obtenerDescripcionOpciones } from '../utils/precios';

interface CarritoComprasProps {
  items: CarritoItem[];
  subtotal: number;
  descuentoTotal?: number;
  descuentoCodigoPromocional?: number;
  codigoPromocional?: CodigoPromocional;
  impuestos: number;
  total: number;
  onActualizarCantidad: (productoId: string, cantidad: number) => void;
  onEliminar: (productoId: string) => void;
  onCheckout: () => void;
  onCerrar?: () => void;
  onAplicarCodigoPromocional?: (codigo: string) => Promise<{ exito: boolean; error?: string }>;
  onRemoverCodigoPromocional?: () => void;
}

export const CarritoCompras: React.FC<CarritoComprasProps> = ({
  items,
  subtotal,
  descuentoTotal = 0,
  descuentoCodigoPromocional = 0,
  codigoPromocional,
  impuestos,
  total,
  onActualizarCantidad,
  onEliminar,
  onCheckout,
  onCerrar,
  onAplicarCodigoPromocional,
  onRemoverCodigoPromocional,
}) => {
  const [codigoInput, setCodigoInput] = useState('');
  const [aplicandoCodigo, setAplicandoCodigo] = useState(false);
  const [errorCodigo, setErrorCodigo] = useState<string | null>(null);

  const handleAplicarCodigo = async () => {
    if (!codigoInput.trim() || !onAplicarCodigoPromocional) return;

    setAplicandoCodigo(true);
    setErrorCodigo(null);

    try {
      const resultado = await onAplicarCodigoPromocional(codigoInput.trim());
      if (resultado.exito) {
        setCodigoInput('');
      } else {
        setErrorCodigo(resultado.error || 'Error al aplicar el código');
      }
    } catch (error) {
      setErrorCodigo('Error al aplicar el código promocional');
    } finally {
      setAplicandoCodigo(false);
    }
  };
  if (items.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tu carrito está vacío</h3>
        <p className="text-gray-600">
          Agrega productos desde la tienda para comenzar
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <ShoppingCart size={20} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Carrito de Compras
            </h2>
            <Badge variant="primary">{items.length}</Badge>
          </div>
          {onCerrar && (
            <Button variant="ghost" size="sm" onClick={onCerrar}>
              <X size={16} />
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.producto.id}
              className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-gray-900">
                    {item.producto.nombre}
                  </h3>
                  {item.producto.metadatos?.suscripcion?.esSuscripcion && (
                    <Badge variant="info" className="text-xs">
                      <Repeat size={10} className="mr-1" />
                      Suscripción
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {item.producto.categoria}
                </p>
                {item.opcionesSeleccionadas && Object.keys(item.opcionesSeleccionadas).length > 0 && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-blue-600">
                    <Settings size={12} />
                    <span>{obtenerDescripcionOpciones(item.producto, item.opcionesSeleccionadas)}</span>
                  </div>
                )}
                {item.modificadorPrecioOpciones && item.modificadorPrecioOpciones !== 0 && (
                  <p className="text-xs text-blue-600 mt-1">
                    Modificador: {item.modificadorPrecioOpciones > 0 ? '+' : ''}€{item.modificadorPrecioOpciones.toFixed(2)}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onActualizarCantidad(item.producto.id, item.cantidad - 1)}
                  disabled={item.cantidad <= 1}
                >
                  <Minus size={16} />
                </Button>
                <span className="text-base font-semibold text-gray-900 min-w-[2rem] text-center">
                  {item.cantidad}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onActualizarCantidad(item.producto.id, item.cantidad + 1)}
                >
                  <Plus size={16} />
                </Button>
              </div>

              <div className="text-right min-w-[6rem]">
                {item.descuentoAplicado && item.descuentoAplicado > 0 ? (
                  <>
                    <p className="text-base font-semibold text-gray-900">
                      €{item.subtotal.toFixed(2)}
                    </p>
                    <p className="text-xs text-green-600 font-medium flex items-center justify-end gap-1">
                      <Tag size={12} />
                      -{item.porcentajeDescuento}% (€{item.descuentoAplicado.toFixed(2)})
                    </p>
                    <p className="text-xs text-gray-400 line-through">
                      €{(item.subtotal + item.descuentoAplicado).toFixed(2)}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-base font-semibold text-gray-900">
                      €{item.subtotal.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      €{(item.precioBase || item.producto.precio).toFixed(2)} c/u
                    </p>
                  </>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEliminar(item.producto.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>

        {/* Código Promocional */}
        {onAplicarCodigoPromocional && (
          <div className="border-t border-slate-200 pt-4">
            {codigoPromocional ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        Código aplicado: <code className="font-mono">{codigoPromocional.codigo}</code>
                      </p>
                      <p className="text-xs text-green-700">{codigoPromocional.descripcion}</p>
                    </div>
                  </div>
                  {onRemoverCodigoPromocional && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onRemoverCodigoPromocional();
                        setErrorCodigo(null);
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Código promocional"
                    value={codigoInput}
                    onChange={(e) => {
                      setCodigoInput(e.target.value.toUpperCase());
                      setErrorCodigo(null);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAplicarCodigo();
                      }
                    }}
                    className="flex-1"
                    error={errorCodigo || undefined}
                  />
                  <Button
                    variant="secondary"
                    onClick={handleAplicarCodigo}
                    loading={aplicandoCodigo}
                    disabled={!codigoInput.trim()}
                  >
                    Aplicar
                  </Button>
                </div>
                {errorCodigo && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle size={16} />
                    <span>{errorCodigo}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="border-t border-slate-200 pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-base text-gray-600">
              Subtotal
            </span>
            <span className="text-base font-medium text-gray-900">
              €{(subtotal + descuentoTotal + descuentoCodigoPromocional).toFixed(2)}
            </span>
          </div>
          {descuentoTotal > 0 && (
            <div className="flex justify-between">
              <span className="text-base text-green-600 font-medium flex items-center gap-1">
                <Tag size={14} />
                Descuentos por cantidad
              </span>
              <span className="text-base font-medium text-green-600">
                -€{descuentoTotal.toFixed(2)}
              </span>
            </div>
          )}
          {descuentoCodigoPromocional > 0 && (
            <div className="flex justify-between">
              <span className="text-base text-green-600 font-medium flex items-center gap-1">
                <Tag size={14} />
                Código promocional {codigoPromocional?.codigo}
              </span>
              <span className="text-base font-medium text-green-600">
                -€{descuentoCodigoPromocional.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-base text-gray-600">
              Subtotal con descuentos
            </span>
            <span className="text-base font-medium text-gray-900">
              €{subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-base text-gray-600">
              Impuestos (21%)
            </span>
            <span className="text-base font-medium text-gray-900">
              €{impuestos.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-200">
            <span className="text-lg font-semibold text-gray-900">
              Total
            </span>
            <span className="text-xl font-bold text-blue-600">
              €{total.toFixed(2)}
            </span>
          </div>
        </div>

        <Button variant="primary" fullWidth size="lg" onClick={onCheckout}>
          Proceder al Checkout
        </Button>
      </div>
    </Card>
  );
};

