import React from 'react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { Filter } from 'lucide-react';
import { CategoriaNutricional } from '../types';
import { getCategorias, CategoriaInfo } from '../api/categorias';
import { ds } from '../../adherencia/ui/ds';

interface CategorizadorNutricionProps {
  categoriaSeleccionada?: CategoriaNutricional;
  onCategoriaChange: (categoria: CategoriaNutricional | undefined) => void;
}

export const CategorizadorNutricion: React.FC<CategorizadorNutricionProps> = ({
  categoriaSeleccionada,
  onCategoriaChange,
}) => {
  const [categorias, setCategorias] = React.useState<CategoriaInfo[]>([]);

  React.useEffect(() => {
    getCategorias().then(setCategorias).catch(console.error);
  }, []);

  const getColorCategoria = (categoria: string) => {
    const colores: Record<string, string> = {
      vegetariana: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      vegana: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      keto: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      paleo: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      mediterranea: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'baja-carbohidratos': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'alta-proteina': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      balanceada: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      personalizada: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    };
    return colores[categoria] || colores.balanceada;
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-400" />
        <h3 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
          Categorías Nutricionales
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoriaChange(undefined)}
          className={`px-4 py-2 rounded-lg transition ${
            !categoriaSeleccionada
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Todas
        </button>
        {categorias.map((categoria) => (
          <button
            key={categoria.id}
            onClick={() => onCategoriaChange(categoria.id)}
            className={`px-4 py-2 rounded-lg transition ${
              categoriaSeleccionada === categoria.id
                ? 'ring-2 ring-blue-600'
                : ''
            } ${getColorCategoria(categoria.id)}`}
          >
            {categoria.nombre}
          </button>
        ))}
      </div>
    </Card>
  );
};

