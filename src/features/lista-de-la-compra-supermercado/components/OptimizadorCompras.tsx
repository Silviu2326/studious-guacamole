import React from 'react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { MapPin, ShoppingBag } from 'lucide-react';
import { type ListaCompra } from '../api';

interface OptimizadorComprasProps {
  lista: ListaCompra;
}

export const OptimizadorCompras: React.FC<OptimizadorComprasProps> = ({ lista }) => {
  const supermercados = [
    { nombre: 'Carrefour', distancia: '2.5 km', tiempo: '5 min' },
    { nombre: 'Mercadona', distancia: '1.8 km', tiempo: '4 min' },
    { nombre: 'El Corte Inglés', distancia: '3.2 km', tiempo: '6 min' },
  ];

  const supermercadoRecomendado = lista.supermercadoPreferido
    ? supermercados.find((s) => s.nombre.toLowerCase().includes(lista.supermercadoPreferido!.toLowerCase()))
    : supermercados[0];

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-900">
          Optimización de Compras
        </h2>
      </div>

      <div className="space-y-4">
        {lista.supermercadoPreferido && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">
                Supermercado Preferido
              </h3>
            </div>
            <p className="text-gray-600">
              {lista.supermercadoPreferido}
            </p>
          </div>
        )}

        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Supermercados Cercanos
          </h3>
          <div className="space-y-2">
            {supermercados.map((supermercado, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  supermercado.nombre === supermercadoRecomendado?.nombre
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-white dark:bg-[#1E1E2E] border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{supermercado.nombre}</span>
                      {supermercado.nombre === supermercadoRecomendado?.nombre && (
                        <Badge variant="green">Recomendado</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {supermercado.distancia} • {supermercado.tiempo}
                    </p>
                  </div>
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-700">
            <strong>Tip:</strong> La lista está organizada por secciones para que puedas comprar
            de forma eficiente recorriendo el supermercado de manera ordenada.
          </p>
        </div>
      </div>
    </Card>
  );
};

