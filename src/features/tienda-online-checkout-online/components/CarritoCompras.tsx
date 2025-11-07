import React from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { CarritoItem } from '../types';
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';

interface CarritoComprasProps {
  items: CarritoItem[];
  subtotal: number;
  impuestos: number;
  total: number;
  onActualizarCantidad: (productoId: string, cantidad: number) => void;
  onEliminar: (productoId: string) => void;
  onCheckout: () => void;
  onCerrar?: () => void;
}

export const CarritoCompras: React.FC<CarritoComprasProps> = ({
  items,
  subtotal,
  impuestos,
  total,
  onActualizarCantidad,
  onEliminar,
  onCheckout,
  onCerrar,
}) => {
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
                <h3 className="text-base font-semibold text-gray-900">
                  {item.producto.nombre}
                </h3>
                <p className="text-sm text-gray-600">
                  {item.producto.categoria}
                </p>
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
                <p className="text-base font-semibold text-gray-900">
                  €{item.subtotal.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  €{item.producto.precio.toFixed(2)} c/u
                </p>
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

        <div className="border-t border-slate-200 pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-base text-gray-600">
              Subtotal
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

