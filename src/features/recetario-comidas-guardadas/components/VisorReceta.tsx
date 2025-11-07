import React from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { Receta } from '../types';
import {
  Clock,
  Users,
  Flame,
  Heart,
  Share2,
  Edit,
  Copy,
  ChefHat,
  UtensilsCrossed,
} from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';

interface VisorRecetaProps {
  receta: Receta;
  onEditar?: () => void;
  onDuplicar?: () => void;
  onCompartir?: () => void;
  onToggleFavorito?: () => void;
}

export const VisorReceta: React.FC<VisorRecetaProps> = ({
  receta,
  onEditar,
  onDuplicar,
  onCompartir,
  onToggleFavorito,
}) => {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {receta.nombre}
            </h2>
            {receta.esFavorita && (
              <Badge variant="default" className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                <Heart className="w-3 h-3 mr-1 fill-current" />
                Favorita
              </Badge>
            )}
          </div>
          {receta.descripcion && (
            <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
              {receta.descripcion}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDificultadColor(receta.dificultad)}`}>
              {getDificultadLabel(receta.dificultad)}
            </span>
            {receta.tags?.map((tag, idx) => (
              <Badge key={idx} variant="default">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          {onToggleFavorito && (
            <Button variant="ghost" onClick={onToggleFavorito}>
              {receta.esFavorita ? (
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              ) : (
                <Heart className="w-5 h-5" />
              )}
            </Button>
          )}
          {onCompartir && (
            <Button variant="ghost" onClick={onCompartir}>
              <Share2 className="w-5 h-5" />
            </Button>
          )}
          {onDuplicar && (
            <Button variant="ghost" onClick={onDuplicar}>
              <Copy className="w-5 h-5" />
            </Button>
          )}
          {onEditar && (
            <Button variant="ghost" onClick={onEditar}>
              <Edit className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="hover" padding="sm">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Tiempo
              </p>
              <p className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {receta.tiempoPreparacion} min
              </p>
            </div>
          </div>
        </Card>
        <Card variant="hover" padding="sm">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <div>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Porciones
              </p>
              <p className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {receta.porciones}
              </p>
            </div>
          </div>
        </Card>
        <Card variant="hover" padding="sm">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <div>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Calorías
              </p>
              <p className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {receta.caloriasPorPorcion} kcal
              </p>
            </div>
          </div>
        </Card>
        <Card variant="hover" padding="sm">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Ingredientes
              </p>
              <p className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {receta.ingredientes.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingredientes */}
        <Card variant="hover" padding="md">
          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4 flex items-center gap-2`}>
            <UtensilsCrossed className="w-5 h-5" />
            Ingredientes
          </h3>
          <ul className="space-y-3">
            {receta.ingredientes.map((ingrediente, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
              >
                <span className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {ingrediente.nombre}
                  {ingrediente.notas && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      ({ingrediente.notas})
                    </span>
                  )}
                </span>
                <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                  {ingrediente.cantidad} {ingrediente.unidad}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Instrucciones */}
        <Card variant="hover" padding="md">
          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
            Instrucciones
          </h3>
          <ol className="space-y-3">
            {receta.instrucciones.map((instruccion, idx) => (
              <li
                key={idx}
                className="flex gap-3"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-semibold text-sm">
                  {idx + 1}
                </span>
                <p className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} flex-1 pt-1`}>
                  {instruccion}
                </p>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {/* Valor Nutricional */}
      <Card variant="hover" padding="md">
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
          Valor Nutricional (por porción)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Calorías
            </p>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {receta.valorNutricional.calorias}
            </p>
          </div>
          <div>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Proteínas
            </p>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {receta.valorNutricional.proteinas}g
            </p>
          </div>
          <div>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Carbohidratos
            </p>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {receta.valorNutricional.carbohidratos}g
            </p>
          </div>
          <div>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Grasas
            </p>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {receta.valorNutricional.grasas}g
            </p>
          </div>
        </div>
        {(receta.valorNutricional.fibra !== undefined ||
          receta.valorNutricional.azucares !== undefined ||
          receta.valorNutricional.sodio !== undefined) && (
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {receta.valorNutricional.fibra !== undefined && (
              <div>
                <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                  Fibra
                </p>
                <p className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {receta.valorNutricional.fibra}g
                </p>
              </div>
            )}
            {receta.valorNutricional.azucares !== undefined && (
              <div>
                <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                  Azúcares
                </p>
                <p className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {receta.valorNutricional.azucares}g
                </p>
              </div>
            )}
            {receta.valorNutricional.sodio !== undefined && (
              <div>
                <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                  Sodio
                </p>
                <p className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {receta.valorNutricional.sodio}mg
                </p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

