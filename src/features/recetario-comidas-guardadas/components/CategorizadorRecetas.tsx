import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { getCategorias, getEstadisticasCategoria } from '../api/categorias';
import { CategoriaReceta } from '../types';
import { FolderOpen } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';

interface CategorizadorRecetasProps {
  onCategoriaSeleccionada?: (categoria: CategoriaReceta) => void;
}

export const CategorizadorRecetas: React.FC<CategorizadorRecetasProps> = ({
  onCategoriaSeleccionada,
}) => {
  const [categorias, setCategorias] = useState<CategoriaReceta[]>([]);
  const [estadisticas, setEstadisticas] = useState<Record<CategoriaReceta, number>>({} as Record<CategoriaReceta, number>);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [cats, stats] = await Promise.all([
        getCategorias(),
        getEstadisticasCategoria(),
      ]);
      setCategorias(cats);
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const getLabelCategoria = (categoria: CategoriaReceta): string => {
    const labels: Record<CategoriaReceta, string> = {
      'desayuno': 'Desayuno',
      'almuerzo': 'Almuerzo',
      'cena': 'Cena',
      'snack': 'Snack',
      'postre': 'Postre',
      'bebida': 'Bebida',
      'smoothie': 'Smoothie',
      'ensalada': 'Ensalada',
      'sopa': 'Sopa',
      'plato-principal': 'Plato Principal',
      'acompanamiento': 'Acompañamiento',
      'personalizada': 'Personalizada',
    };
    return labels[categoria] || categoria;
  };

  return (
    <Card variant="hover" padding="md">
      <div className="flex items-center gap-2 mb-6">
        <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
          Categorías de Recetas
        </h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categorias.map((categoria) => (
          <button
            key={categoria}
            onClick={() => onCategoriaSeleccionada?.(categoria)}
            className="p-4 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition text-left border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {getLabelCategoria(categoria)}
              </span>
            </div>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              {estadisticas[categoria] || 0} recetas
            </p>
          </button>
        ))}
      </div>
    </Card>
  );
};

