import React from 'react';
import { Card, Input, Select, Textarea, Button } from '../../../components/componentsreutilizables';
import { EjercicioEnSesion, SesionEntrenamiento } from '../api';
import { GestorSeries } from './GestorSeries';
import { ConfiguradorRPE } from './ConfiguradorRPE';
import { GripVertical, X } from 'lucide-react';

interface ConstructorSesionProps {
  sesion: Partial<SesionEntrenamiento>;
  onChange: (sesion: Partial<SesionEntrenamiento>) => void;
  onAgregarEjercicio: (ejercicio: any) => void;
}

export const ConstructorSesion: React.FC<ConstructorSesionProps> = ({
  sesion,
  onChange,
  onAgregarEjercicio,
}) => {
  const eliminarEjercicio = (ejercicioId: string) => {
    const ejercicios = sesion.ejercicios?.filter((ej) => ej.id !== ejercicioId) || [];
    onChange({ ...sesion, ejercicios });
  };

  const actualizarEjercicio = (ejercicioId: string, updates: Partial<EjercicioEnSesion>) => {
    const ejercicios =
      sesion.ejercicios?.map((ej) => (ej.id === ejercicioId ? { ...ej, ...updates } : ej)) || [];
    onChange({ ...sesion, ejercicios });
  };

  const actualizarSeries = (ejercicioId: string, series: any[]) => {
    const ejercicios =
      sesion.ejercicios?.map((ej) =>
        ej.id === ejercicioId ? { ...ej, series } : ej
      ) || [];
    onChange({ ...sesion, ejercicios });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Información de la Sesión
            </h2>
          </div>

          <Input
            label="Nombre de la Sesión"
            value={sesion.nombre || ''}
            onChange={(e) => onChange({ ...sesion, nombre: e.target.value })}
            placeholder="Ej: Entrenamiento de Fuerza - Piernas"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duración (minutos)"
              type="number"
              value={sesion.duracion || ''}
              onChange={(e) => onChange({ ...sesion, duracion: parseInt(e.target.value) || 0 })}
              fullWidth={false}
            />

            <Select
              label="Tipo de Sesión"
              value={sesion.tipo || 'fuerza'}
              onChange={(e) =>
                onChange({ ...sesion, tipo: e.target.value as SesionEntrenamiento['tipo'] })
              }
              options={[
                { value: 'fuerza', label: 'Fuerza' },
                { value: 'cardio', label: 'Cardio' },
                { value: 'hiit', label: 'HIIT' },
                { value: 'flexibilidad', label: 'Flexibilidad' },
                { value: 'mixto', label: 'Mixto' },
              ]}
              fullWidth={false}
            />
          </div>

          <Textarea
            label="Objetivo"
            value={sesion.objetivo || ''}
            onChange={(e) => onChange({ ...sesion, objetivo: e.target.value })}
            placeholder="Describe el objetivo de esta sesión de entrenamiento"
            rows={3}
          />
        </div>
      </Card>

      {sesion.ejercicios && sesion.ejercicios.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Ejercicios de la Sesión
          </h3>

          {sesion.ejercicios.map((ejercicio, index) => (
            <Card key={ejercicio.id} className="bg-white shadow-sm">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {index + 1}. {ejercicio.ejercicio.nombre}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {ejercicio.ejercicio.categoria}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => eliminarEjercicio(ejercicio.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <GestorSeries
                  series={ejercicio.series}
                  onChange={(series) => actualizarSeries(ejercicio.id, series)}
                />

                {ejercicio.series.length > 0 && ejercicio.series[0] && (
                  <ConfiguradorRPE
                    serie={ejercicio.series[0]}
                    onChange={(rpe) => {
                      const nuevasSeries = ejercicio.series.map((s) => ({ ...s, rpe }));
                      actualizarSeries(ejercicio.id, nuevasSeries);
                    }}
                  />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

