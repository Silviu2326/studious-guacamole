import React from 'react';
import { Card, Badge, Modal } from '../../../components/componentsreutilizables';
import { Target, Dumbbell, TrendingUp, Clock, Zap, List, Users, Calendar, Tag, ArrowRight, Award } from 'lucide-react';
import { Ejercicio } from '../types';
import { ReproductorVideo } from './ReproductorVideo';
import { AdvertenciasLesion } from './AdvertenciasLesion';
import { GestorFavoritos } from './GestorFavoritos';
import { IntegradorProgramas } from './IntegradorProgramas';

interface VisorEjercicioProps {
  ejercicio: Ejercicio | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VisorEjercicio: React.FC<VisorEjercicioProps> = ({
  ejercicio,
  isOpen,
  onClose,
}) => {
  if (!ejercicio) return null;

  const getDificultadColor = (dificultad: string) => {
    switch (dificultad) {
      case 'principiante':
        return 'green';
      case 'intermedio':
        return 'yellow';
      case 'avanzado':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={ejercicio.nombre}
      size="xl"
      className="max-h-[90vh] overflow-y-auto"
    >
      <div className="space-y-4">
        {/* Header con badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={getDificultadColor(ejercicio.dificultad) as any}>
            {ejercicio.dificultad}
          </Badge>
          {ejercicio.grupoMuscular.map((grupo) => (
            <Badge key={grupo} variant="blue">
              <Target className="w-3 h-3 mr-1" />
              {grupo}
            </Badge>
          ))}
          {ejercicio.equipamiento.map((equipo) => (
            <Badge key={equipo} variant="purple">
              <Dumbbell className="w-3 h-3 mr-1" />
              {equipo}
            </Badge>
          ))}
        </div>

        {/* Video */}
        <ReproductorVideo
          videoUrl={ejercicio.videoUrl}
          titulo={ejercicio.nombre}
        />

        {/* Descripción */}
        <Card className="p-4 bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Descripción
          </h3>
          <p className="text-gray-600">
            {ejercicio.descripcion}
          </p>
        </Card>

        {/* Instrucciones */}
        {ejercicio.instrucciones && ejercicio.instrucciones.length > 0 && (
          <Card className="p-4 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <List className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Instrucciones de Ejecución
              </h3>
            </div>
            <ol className="space-y-3">
              {ejercicio.instrucciones.map((instruccion, index) => (
                <li key={index} className="flex gap-3 text-gray-900">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span className="flex-1">{instruccion}</span>
                </li>
              ))}
            </ol>
          </Card>
        )}

        {/* Información de entrenamiento */}
        {(ejercicio.seriesRecomendadas ||
          ejercicio.repeticionesRecomendadas ||
          ejercicio.descansoRecomendado ||
          ejercicio.rpeRecomendado) && (
          <Card className="p-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recomendaciones de Entrenamiento
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ejercicio.seriesRecomendadas && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">
                      Series
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {ejercicio.seriesRecomendadas}
                    </p>
                  </div>
                </div>
              )}
              {ejercicio.repeticionesRecomendadas && (
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">
                      Repeticiones
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {ejercicio.repeticionesRecomendadas}
                    </p>
                  </div>
                </div>
              )}
              {ejercicio.descansoRecomendado && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">
                      Descanso
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {ejercicio.descansoRecomendado}
                    </p>
                  </div>
                </div>
              )}
              {ejercicio.rpeRecomendado && (
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">
                      RPE
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {ejercicio.rpeRecomendado}/10
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Músculos Secundarios */}
        {ejercicio.musculosSecundarios && ejercicio.musculosSecundarios.length > 0 && (
          <Card className="p-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Músculos Secundarios
            </h3>
            <div className="flex flex-wrap gap-2">
              {ejercicio.musculosSecundarios.map((musculo, index) => (
                <Badge key={index} variant="blue" size="sm">
                  {musculo}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {/* Variaciones */}
        {ejercicio.variaciones && ejercicio.variaciones.length > 0 && (
          <Card className="p-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-green-600" />
              Variaciones del Ejercicio
            </h3>
            <ul className="space-y-2">
              {ejercicio.variaciones.map((variacion, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-600 mt-1">•</span>
                  <span>{variacion}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Tags */}
        {ejercicio.tags && ejercicio.tags.length > 0 && (
          <Card className="p-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Tag className="w-5 h-5 text-purple-600" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {ejercicio.tags.map((tag, index) => (
                <Badge key={index} variant="purple" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {/* Estadísticas e Información Adicional */}
        <Card className="p-4 bg-gray-50 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ejercicio.vecesUsado !== undefined && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Veces Usado</p>
                  <p className="text-sm font-semibold text-gray-900">{ejercicio.vecesUsado}</p>
                </div>
              </div>
            )}
            {ejercicio.fechaCreacion && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Fecha de Creación</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(ejercicio.fechaCreacion).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}
            {ejercicio.creadoPor && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Creado Por</p>
                  <p className="text-sm font-semibold text-gray-900">{ejercicio.creadoPor}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Advertencias */}
        {ejercicio.advertencias && ejercicio.advertencias.length > 0 && (
          <AdvertenciasLesion advertencias={ejercicio.advertencias} />
        )}

        {/* Acciones */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
          <GestorFavoritos
            ejercicioId={ejercicio.id}
            esFavoritoInicial={ejercicio.esFavorito}
          />
          <IntegradorProgramas
            ejercicioId={ejercicio.id}
            ejercicioNombre={ejercicio.nombre}
          />
        </div>
      </div>
    </Modal>
  );
};

