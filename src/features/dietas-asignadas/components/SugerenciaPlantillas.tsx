import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { Sparkles, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import type {
  RespuestaCuestionarioMetodologia,
  PlantillaSugerida,
} from '../types';
import { sugerirPlantillas, aplicarPlantillaSugerida } from '../api/plantillasSugeridas';

interface SugerenciaPlantillasProps {
  cuestionario: RespuestaCuestionarioMetodologia;
  onAplicarPlantilla?: (cuestionarioActualizado: RespuestaCuestionarioMetodologia) => void;
  onCerrar?: () => void;
}

export const SugerenciaPlantillas: React.FC<SugerenciaPlantillasProps> = ({
  cuestionario,
  onAplicarPlantilla,
  onCerrar,
}) => {
  const [plantillas, setPlantillas] = useState<PlantillaSugerida[]>([]);
  const [cargando, setCargando] = useState(true);
  const [aplicando, setAplicando] = useState<string | null>(null);

  useEffect(() => {
    cargarPlantillas();
  }, [cuestionario]);

  const cargarPlantillas = async () => {
    setCargando(true);
    try {
      const sugeridas = await sugerirPlantillas(cuestionario);
      setPlantillas(sugeridas);
    } catch (error) {
      console.error('Error cargando plantillas sugeridas:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleAplicarPlantilla = async (plantilla: PlantillaSugerida) => {
    setAplicando(plantilla.id);
    try {
      const cuestionarioActualizado = await aplicarPlantillaSugerida(cuestionario, plantilla);
      if (onAplicarPlantilla) {
        onAplicarPlantilla(cuestionarioActualizado);
      }
    } catch (error) {
      console.error('Error aplicando plantilla:', error);
      alert('Error al aplicar la plantilla. Por favor, intenta de nuevo.');
    } finally {
      setAplicando(null);
    }
  };

  const getPuntuacionColor = (puntuacion: number): string => {
    if (puntuacion >= 80) return 'bg-green-100 text-green-800 border-green-300';
    if (puntuacion >= 60) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (puntuacion >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (cargando) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200">
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-blue-600">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-medium">Analizando tus respuestas...</span>
          </div>
        </div>
      </Card>
    );
  }

  if (plantillas.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Plantillas Sugeridas para Ti
          </h3>
        </div>
        {onCerrar && (
          <Button variant="ghost" size="sm" onClick={onCerrar}>
            Cerrar
          </Button>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Basándonos en tus respuestas, estas plantillas se adaptan mejor a tu metodología de trabajo.
        Aplicar una plantilla ajustará automáticamente las columnas y resúmenes de tu vista Excel.
      </p>

      <div className="space-y-3">
        {plantillas.map((plantilla) => (
          <div
            key={plantilla.id}
            className="bg-white rounded-lg border-2 border-gray-200 p-4 hover:border-blue-300 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                {plantilla.icono && (
                  <div className="text-2xl flex-shrink-0">{plantilla.icono}</div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{plantilla.nombre}</h4>
                    <Badge
                      className={getPuntuacionColor(plantilla.puntuacionCoincidencia)}
                    >
                      {plantilla.puntuacionCoincidencia}% match
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{plantilla.descripcion}</p>
                </div>
              </div>
            </div>

            {/* Razones de la sugerencia */}
            {plantilla.razones.length > 0 && (
              <div className="mb-3 pl-8">
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium mb-1">¿Por qué esta plantilla?</div>
                    <ul className="list-disc list-inside space-y-1">
                      {plantilla.razones.map((razon, index) => (
                        <li key={index} className="text-gray-600">
                          {razon}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Columnas recomendadas */}
            <div className="mb-3 pl-8">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Columnas incluidas:
              </div>
              <div className="flex flex-wrap gap-1">
                {plantilla.columnasRecomendadas.slice(0, 6).map((columna) => (
                  <Badge
                    key={columna}
                    variant="secondary"
                    className="text-xs bg-gray-100 text-gray-700"
                  >
                    {columna}
                  </Badge>
                ))}
                {plantilla.columnasRecomendadas.length > 6 && (
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                    +{plantilla.columnasRecomendadas.length - 6} más
                  </Badge>
                )}
              </div>
            </div>

            {/* Botón de aplicar */}
            <div className="flex justify-end pt-2 border-t border-gray-200">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAplicarPlantilla(plantilla)}
                disabled={aplicando === plantilla.id}
                rightIcon={
                  aplicando === plantilla.id ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )
                }
              >
                {aplicando === plantilla.id ? 'Aplicando...' : 'Aplicar Plantilla'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-2 text-sm text-blue-900">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <strong>Nota:</strong> Al aplicar una plantilla, se actualizarán tus columnas y
            fórmulas. Siempre puedes modificar la configuración después desde el editor.
          </div>
        </div>
      </div>
    </Card>
  );
};

