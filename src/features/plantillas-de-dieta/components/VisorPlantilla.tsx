import React from 'react';
import { Card, Badge, Button } from '../../../components/componentsreutilizables';
import {
  Calendar,
  Clock,
  TrendingUp,
  Users,
  Star,
  Copy,
  Share2,
  FileText,
} from 'lucide-react';
import { PlantillaDieta } from '../types';
import { ds } from '../../adherencia/ui/ds';

interface VisorPlantillaProps {
  plantilla: PlantillaDieta;
  onDuplicar?: () => void;
  onCompartir?: () => void;
  onEditar?: () => void;
}

export const VisorPlantilla: React.FC<VisorPlantillaProps> = ({
  plantilla,
  onDuplicar,
  onCompartir,
  onEditar,
}) => {
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
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {plantilla.nombre}
              </h2>
              {plantilla.publicada && (
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              )}
            </div>
            <Badge className={getColorCategoria(plantilla.categoria)}>
              {plantilla.categoria.replace('-', ' ')}
            </Badge>
          </div>
          <div className="flex gap-2">
            {onDuplicar && (
              <Button variant="secondary" size="sm" onClick={onDuplicar}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicar
              </Button>
            )}
            {onCompartir && (
              <Button variant="ghost" size="sm" onClick={onCompartir}>
                <Share2 className="w-4 h-4" />
              </Button>
            )}
            {onEditar && (
              <Button variant="ghost" size="sm" onClick={onEditar}>
                <FileText className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {plantilla.descripcion && (
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-6`}>
            {plantilla.descripcion}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
              {plantilla.calorias}
            </div>
            <div className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Calorías (kcal)
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
              {plantilla.macros.proteinas}g
            </div>
            <div className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Proteínas
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
              {plantilla.macros.carbohidratos}g
            </div>
            <div className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Carbohidratos
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
              {plantilla.macros.grasas}g
            </div>
            <div className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Grasas
            </div>
          </Card>
        </div>

        {plantilla.efectividad && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  Tasa de Éxito
                </span>
              </div>
              <div className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {plantilla.efectividad.tasaExito}%
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  Satisfacción
                </span>
              </div>
              <div className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {plantilla.efectividad.satisfaccionPromedio}/5
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  Seguimiento
                </span>
              </div>
              <div className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {plantilla.efectividad.seguimientoPromedio}%
              </div>
            </Card>
          </div>
        )}

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              {plantilla.usoCount} usos
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Versión {plantilla.version}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              {new Date(plantilla.actualizadoEn).toLocaleDateString()}
            </span>
          </div>
        </div>

        {plantilla.tags && plantilla.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {plantilla.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </Card>

      {plantilla.comidas.length > 0 && (
        <Card className="p-6">
          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
            Comidas ({plantilla.comidas.length})
          </h3>
          <div className="space-y-3">
            {plantilla.comidas.map((comida) => (
              <Card key={comida.id} variant="hover" className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    {comida.nombre}
                  </h4>
                  <Badge variant="outline">{comida.tipo.replace('-', ' ')}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    {comida.calorias} kcal
                  </span>
                  <span className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    P: {comida.proteinas}g | C: {comida.carbohidratos}g | G: {comida.grasas}g
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

