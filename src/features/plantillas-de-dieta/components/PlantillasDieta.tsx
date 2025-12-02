import React from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { 
  FileText, 
  Copy, 
  Eye, 
  Edit, 
  Trash2, 
  Star, 
  TrendingUp,
  Users,
  Loader2
} from 'lucide-react';
import { PlantillaDieta } from '../types';

interface PlantillasDietaProps {
  plantillas: PlantillaDieta[];
  cargando?: boolean;
  onVer: (plantilla: PlantillaDieta) => void;
  onEditar?: (plantilla: PlantillaDieta) => void;
  onDuplicar?: (plantilla: PlantillaDieta) => void;
  onEliminar?: (plantilla: PlantillaDieta) => void;
}

export const PlantillasDieta: React.FC<PlantillasDietaProps> = ({
  plantillas,
  cargando = false,
  onVer,
  onEditar,
  onDuplicar,
  onEliminar,
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

  if (cargando) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  if (plantillas.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No hay plantillas disponibles
        </h3>
        <p className="text-gray-600 mb-4">
          Comienza creando tu primera plantilla nutricional
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {plantillas.map((plantilla) => (
        <Card key={plantilla.id} variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden">
          <div className="p-4 flex flex-col flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {plantilla.nombre}
                </h3>
                <Badge className={getColorCategoria(plantilla.categoria)}>
                  {plantilla.categoria.replace('-', ' ')}
                </Badge>
              </div>
              {plantilla.publicada && (
                <Star size={20} className="text-yellow-500 fill-yellow-500" />
              )}
            </div>

            {plantilla.descripcion && (
              <p className="text-gray-600 mb-4 line-clamp-2">
                {plantilla.descripcion}
              </p>
            )}

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Calorías:</span>
                <span className="font-semibold text-gray-900">
                  {plantilla.calorias} kcal
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-gray-600">
                  P: {plantilla.macros.proteinas}g
                </span>
                <span className="text-gray-600">
                  C: {plantilla.macros.carbohidratos}g
                </span>
                <span className="text-gray-600">
                  G: {plantilla.macros.grasas}g
                </span>
              </div>
            </div>

            {plantilla.efectividad && (
              <div className="flex items-center gap-4 mb-4 text-xs">
                <div className="flex items-center gap-1">
                  <TrendingUp size={16} className="text-green-500" />
                  <span className="text-gray-600">
                    {plantilla.efectividad.tasaExito}% éxito
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} className="text-blue-500" />
                  <span className="text-gray-600">
                    {plantilla.usoCount} usos
                  </span>
                </div>
              </div>
            )}

            {plantilla.tags && plantilla.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {plantilla.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Botones de Acción */}
            <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => onVer(plantilla)}
              >
                <Eye size={16} className="mr-2" />
                Ver
              </Button>
              {onDuplicar && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onDuplicar(plantilla)}
                >
                  <Copy size={16} />
                </Button>
              )}
              {onEditar && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditar(plantilla)}
                >
                  <Edit size={16} />
                </Button>
              )}
              {onEliminar && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEliminar(plantilla)}
                >
                  <Trash2 size={16} className="text-red-500" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

