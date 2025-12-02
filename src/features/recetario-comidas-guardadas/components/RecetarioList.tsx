import React from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Receta } from '../types';
import { Clock, Users, Flame, Star, Eye, Edit, Trash2, Heart } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';

interface RecetarioListProps {
  recetas: Receta[];
  cargando?: boolean;
  onVer?: (receta: Receta) => void;
  onEditar?: (receta: Receta) => void;
  onEliminar?: (receta: Receta) => void;
  onToggleFavorito?: (receta: Receta) => void;
}

export const RecetarioList: React.FC<RecetarioListProps> = ({
  recetas,
  cargando = false,
  onVer,
  onEditar,
  onEliminar,
  onToggleFavorito,
}) => {
  if (cargando) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} variant="hover" padding="md">
            <div className="animate-pulse space-y-4">
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (recetas.length === 0) {
    return (
      <Card variant="hover" padding="xl">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Flame className="w-10 h-10 text-white" />
          </div>
          <p className={`${ds.typography.bodyLarge} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            No se encontraron recetas
          </p>
        </div>
      </Card>
    );
  }

  const getDificultadColor = (dificultad: string) => {
    switch (dificultad) {
      case 'facil':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'media':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'dificil':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getDificultadLabel = (dificultad: string) => {
    switch (dificultad) {
      case 'facil':
        return 'Fácil';
      case 'media':
        return 'Media';
      case 'dificil':
        return 'Difícil';
      default:
        return dificultad;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recetas.map((receta) => (
        <Card key={receta.id} variant="hover" padding="none" className="overflow-hidden">
          {receta.imagen && (
            <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
              <img
                src={receta.imagen}
                alt={receta.nombre}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => onToggleFavorito?.(receta)}
                className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition"
              >
                {receta.esFavorita ? (
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                ) : (
                  <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          )}
          {!receta.imagen && (
            <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative flex items-center justify-center">
              <Flame className="w-16 h-16 text-white opacity-50" />
              <button
                onClick={() => onToggleFavorito?.(receta)}
                className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition"
              >
                {receta.esFavorita ? (
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                ) : (
                  <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          )}
          <div className="p-6 space-y-4">
            <div>
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                {receta.nombre}
              </h3>
              {receta.descripcion && (
                <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} line-clamp-2`}>
                  {receta.descripcion}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDificultadColor(receta.dificultad)}`}>
                {getDificultadLabel(receta.dificultad)}
              </span>
              {receta.tags?.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{receta.tiempoPreparacion} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{receta.porciones} porciones</span>
              </div>
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4" />
                <span>{receta.caloriasPorPorcion} kcal</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Eye className="w-4 h-4" />
                <span>{receta.usoCount || 0} usos</span>
              </div>
              <div className="flex gap-2">
                {onVer && (
                  <Button variant="ghost" size="sm" onClick={() => onVer(receta)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                )}
                {onEditar && (
                  <Button variant="ghost" size="sm" onClick={() => onEditar(receta)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
                {onEliminar && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEliminar(receta)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

