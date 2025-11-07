import React from 'react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { 
  type ListaCompra, 
  type IngredienteLista,
  type SeccionSupermercado
} from '../api';
import { organizarPorSecciones, getNombreSeccion } from '../api/ingredientes';
import { CheckCircle2, Circle } from 'lucide-react';

interface OrganizadorSeccionesProps {
  lista: ListaCompra;
  onToggleMarcado?: (ingredienteId: string) => void;
}

export const OrganizadorSecciones: React.FC<OrganizadorSeccionesProps> = ({ 
  lista,
  onToggleMarcado 
}) => {
  const ingredientesOrganizados = organizarPorSecciones(lista.ingredientes);

  const secciones: SeccionSupermercado[] = [
    'frutas-verduras',
    'carnes-pescados',
    'lacteos-huevos',
    'panaderia-cereales',
    'condimentos-especias',
    'congelados',
    'conservas',
    'bebidas',
    'limpieza',
    'otros',
  ];

  const renderIngrediente = (ingrediente: IngredienteLista) => (
    <div
      key={ingrediente.id}
      className={`flex items-center gap-3 p-3 rounded-lg border ${
        ingrediente.marcado
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          : 'bg-white dark:bg-[#1E1E2E] border-gray-200 dark:border-gray-700'
      }`}
    >
      <button
        onClick={() => onToggleMarcado?.(ingrediente.id)}
        className="flex-shrink-0"
      >
        {ingrediente.marcado ? (
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        ) : (
          <Circle className="w-5 h-5 text-gray-400" />
        )}
      </button>
      <div className="flex-1">
        <div className={`flex items-center gap-2 ${
          ingrediente.marcado ? 'line-through text-gray-400' : ''
        }`}>
          <span className="font-medium">{ingrediente.nombre}</span>
          <Badge variant="gray" size="sm">
            {ingrediente.cantidad} {ingrediente.unidad}
          </Badge>
        </div>
        {ingrediente.notas && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {ingrediente.notas}
          </p>
        )}
        {ingrediente.precioAproximado && (
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
            ~{ingrediente.precioAproximado.toFixed(2)}€
          </p>
        )}
      </div>
    </div>
  );

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Lista Organizada por Secciones
        </h2>
        <p className="text-gray-600">
          Organizada según las secciones del supermercado para facilitar tus compras
        </p>
      </div>

      <div className="space-y-6">
        {secciones.map((seccion) => {
          const ingredientes = ingredientesOrganizados[seccion];
          if (ingredientes.length === 0) return null;

          return (
            <div key={seccion} className="space-y-3">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  {getNombreSeccion(seccion)}
                </h3>
                <Badge variant="blue">{ingredientes.length} items</Badge>
              </div>
              <div className="grid gap-2">
                {ingredientes.map(renderIngrediente)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Total ingredientes:</strong> {lista.ingredientes.length} |{' '}
          <strong>Marcados:</strong>{' '}
          {lista.ingredientes.filter((i) => i.marcado).length}
        </p>
      </div>
    </Card>
  );
};

