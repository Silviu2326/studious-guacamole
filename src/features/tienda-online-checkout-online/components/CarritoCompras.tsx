import React, { useState, useMemo } from 'react';
import { Card, Button, Badge, Input } from '../../../components/componentsreutilizables';
import { ItemCarrito, CodigoPromocional } from '../types';
import { 
  calcularSubtotalItem, 
  calcularSubtotalCarrito, 
  calcularImpuestos, 
  calcularGastosEnvio, 
  calcularTotal 
} from '../utils/precios';
import { aplicarCodigoPromocional } from '../utils/descuentos';
import { validarCodigoParaCarrito } from '../api/codigosPromocionales';
import { ShoppingCart, Plus, Minus, Trash2, X, Tag, Check, AlertCircle } from 'lucide-react';

interface CarritoComprasProps {
  items: ItemCarrito[];
  codigoPromocionalAplicadoOpcional?: CodigoPromocional;
  onUpdateCantidad: (idItem: string, nuevaCantidad: number) => void;
  onRemoveItem: (idItem: string) => void;
  onAplicarCodigo: (codigo: string) => void;
  onIrAlCheckout: () => void;
}

export const CarritoCompras: React.FC<CarritoComprasProps> = ({
  items,
  codigoPromocionalAplicadoOpcional,
  onUpdateCantidad,
  onRemoveItem,
  onAplicarCodigo,
  onIrAlCheckout,
}) => {
  const [codigoInput, setCodigoInput] = useState('');
  const [aplicandoCodigo, setAplicandoCodigo] = useState(false);
  const [errorCodigo, setErrorCodigo] = useState<string | null>(null);
  const [mensajeExitoCodigo, setMensajeExitoCodigo] = useState<string | null>(null);

  // Calcular subtotal de productos
  const subtotalProductos = useMemo(() => {
    return calcularSubtotalCarrito(items);
  }, [items]);

  // Calcular descuento del código promocional
  const descuentoCodigo = useMemo(() => {
    if (!codigoPromocionalAplicadoOpcional) return 0;
    const resultado = aplicarCodigoPromocional(subtotalProductos, codigoPromocionalAplicadoOpcional);
    return resultado.descuento;
  }, [subtotalProductos, codigoPromocionalAplicadoOpcional]);

  // Subtotal después de descuentos
  const subtotalConDescuentos = useMemo(() => {
    return subtotalProductos - descuentoCodigo;
  }, [subtotalProductos, descuentoCodigo]);

  // Calcular impuestos (21% IVA por defecto)
  const impuestos = useMemo(() => {
    return calcularImpuestos(subtotalConDescuentos, { tipoIVA: 21 });
  }, [subtotalConDescuentos]);

  // Calcular gastos de envío
  const gastosEnvio = useMemo(() => {
    return calcularGastosEnvio(items, {
      envioGratisDesde: 50, // Envío gratis desde 50€
      tarifaBase: 5.00,
    });
  }, [items]);

  // Calcular total final
  const total = useMemo(() => {
    return calcularTotal(subtotalConDescuentos, impuestos, gastosEnvio, 0);
  }, [subtotalConDescuentos, impuestos, gastosEnvio]);

  const handleAplicarCodigo = async () => {
    if (!codigoInput.trim()) return;

    setAplicandoCodigo(true);
    setErrorCodigo(null);
    setMensajeExitoCodigo(null);

    try {
      const codigoValidado = await validarCodigoParaCarrito(codigoInput.trim().toUpperCase(), items);

      if (codigoValidado) {
        setMensajeExitoCodigo(`Código "${codigoValidado.codigo}" aplicado correctamente`);
        setCodigoInput('');
        onAplicarCodigo(codigoInput.trim().toUpperCase());
      } else {
        setErrorCodigo('Código promocional no válido o no aplicable');
      }
    } catch (error) {
      setErrorCodigo('Error al validar el código promocional');
    } finally {
      setAplicandoCodigo(false);
    }
  };

  const handleEliminarCodigo = () => {
    // Para eliminar el código, llamamos a onAplicarCodigo con string vacío
    // El componente padre deberá manejar esto para remover el código aplicado
    setErrorCodigo(null);
    setMensajeExitoCodigo(null);
    onAplicarCodigo('');
  };

  // Renderizar información de variante
  const renderVariante = (item: ItemCarrito) => {
    if (!item.varianteSeleccionadaOpcional) return null;

    const atributos = Object.entries(item.varianteSeleccionadaOpcional.atributos);
    if (atributos.length === 0) return null;

    return (
      <div className="mt-1 flex flex-wrap gap-2">
        {atributos.map(([key, value]) => (
          <Badge key={key} variant="secondary" className="text-xs">
            {key}: {value}
          </Badge>
        ))}
        {item.varianteSeleccionadaOpcional.precioAdicionalOpcional && 
         item.varianteSeleccionadaOpcional.precioAdicionalOpcional > 0 && (
          <span className="text-xs text-blue-600">
            (+€{item.varianteSeleccionadaOpcional.precioAdicionalOpcional.toFixed(2)})
          </span>
        )}
      </div>
    );
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
        {/* Header */}
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
        </div>

        {/* Lista de items */}
        <div className="space-y-4">
          {items.map((item) => {
            const subtotalItem = calcularSubtotalItem(item);
            
            return (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl hover:shadow-md transition-shadow"
              >
                {/* Información del producto */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {item.nombreProducto}
                  </h3>
                  
                  {/* Variante */}
                  {renderVariante(item)}
                  
                  {/* Notas opcionales */}
                  {item.notasOpcionales && (
                    <p className="text-xs text-gray-500 mt-1 italic">
                      {item.notasOpcionales}
                    </p>
                  )}

                  {/* Precio unitario */}
                  <p className="text-sm text-gray-600 mt-2">
                    €{item.precioUnitario.toFixed(2)} c/u
                  </p>
                </div>

                {/* Controles de cantidad */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (item.cantidad > 1) {
                        onUpdateCantidad(item.id, item.cantidad - 1);
                      }
                    }}
                    disabled={item.cantidad <= 1}
                    className="p-1"
                  >
                    <Minus size={16} />
                  </Button>
                  <input
                    type="number"
                    min="1"
                    value={item.cantidad}
                    onChange={(e) => {
                      const nuevaCantidad = parseInt(e.target.value, 10);
                      if (!isNaN(nuevaCantidad) && nuevaCantidad > 0) {
                        onUpdateCantidad(item.id, nuevaCantidad);
                      }
                    }}
                    className="w-16 text-center text-base font-semibold text-gray-900 border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onUpdateCantidad(item.id, item.cantidad + 1)}
                    className="p-1"
                  >
                    <Plus size={16} />
                  </Button>
                </div>

                {/* Subtotal del item */}
                <div className="text-right min-w-[6rem]">
                  <p className="text-base font-semibold text-gray-900">
                    €{subtotalItem.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Subtotal
                  </p>
                </div>

                {/* Botón eliminar */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-600 p-1"
                  title="Eliminar del carrito"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            );
          })}
        </div>

        {/* Campo de código promocional */}
        <div className="border-t border-slate-200 pt-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Código Promocional
          </h3>
          
          {codigoPromocionalAplicadoOpcional ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      Código aplicado: <code className="font-mono bg-green-100 px-1 rounded">{codigoPromocionalAplicadoOpcional.codigo}</code>
                    </p>
                    <p className="text-xs text-green-700 mt-0.5">
                      {codigoPromocionalAplicadoOpcional.tipoDescuento === 'porcentaje' 
                        ? `${codigoPromocionalAplicadoOpcional.valorDescuento}% de descuento`
                        : `€${codigoPromocionalAplicadoOpcional.valorDescuento.toFixed(2)} de descuento`}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEliminarCodigo}
                  className="text-red-500 hover:text-red-600"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Introduce tu código promocional"
                  value={codigoInput}
                  onChange={(e) => {
                    setCodigoInput(e.target.value.toUpperCase());
                    setErrorCodigo(null);
                    setMensajeExitoCodigo(null);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAplicarCodigo();
                    }
                  }}
                  className="flex-1"
                  error={errorCodigo || undefined}
                  disabled={aplicandoCodigo}
                />
                <Button
                  variant="secondary"
                  onClick={handleAplicarCodigo}
                  disabled={!codigoInput.trim() || aplicandoCodigo}
                >
                  {aplicandoCodigo ? 'Aplicando...' : 'Aplicar'}
                </Button>
              </div>
              {errorCodigo && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle size={16} />
                  <span>{errorCodigo}</span>
                </div>
              )}
              {mensajeExitoCodigo && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Check size={16} />
                  <span>{mensajeExitoCodigo}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Resumen de totales */}
        <div className="border-t border-slate-200 pt-4 space-y-3">
          <div className="flex justify-between text-base text-gray-600">
            <span>Subtotal productos</span>
            <span className="font-medium text-gray-900">
              €{subtotalProductos.toFixed(2)}
            </span>
          </div>

          {descuentoCodigo > 0 && (
            <div className="flex justify-between text-base text-green-600">
              <span className="flex items-center gap-1">
                <Tag size={14} />
                Descuento ({codigoPromocionalAplicadoOpcional?.codigo})
              </span>
              <span className="font-medium">
                -€{descuentoCodigo.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-base text-gray-600">
            <span>Impuestos (21%)</span>
            <span className="font-medium text-gray-900">
              €{impuestos.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-base text-gray-600">
            <span>Gastos de envío</span>
            <span className="font-medium text-gray-900">
              {gastosEnvio === 0 ? (
                <span className="text-green-600">Gratis</span>
              ) : (
                `€${gastosEnvio.toFixed(2)}`
              )}
            </span>
          </div>

          <div className="flex justify-between pt-3 border-t-2 border-slate-300">
            <span className="text-lg font-semibold text-gray-900">
              Total
            </span>
            <span className="text-xl font-bold text-blue-600">
              €{total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Botón de checkout */}
        <Button 
          variant="primary" 
          fullWidth 
          size="lg" 
          onClick={onIrAlCheckout}
          className="mt-4"
        >
          Ir al Checkout
        </Button>
      </div>
    </Card>
  );
};
