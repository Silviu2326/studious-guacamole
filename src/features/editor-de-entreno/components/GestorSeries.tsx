import React, { useState } from 'react';
import { Button, Card, Input } from '../../../components/componentsreutilizables';
import { Serie } from '../api';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface GestorSeriesProps {
  series: Serie[];
  onChange: (series: Serie[]) => void;
}

export const GestorSeries: React.FC<GestorSeriesProps> = ({ series, onChange }) => {
  const agregarSerie = () => {
    const nuevaSerie: Serie = {
      id: `serie-${Date.now()}`,
      repeticiones: 10,
      peso: 0,
      descanso: 60,
      rpe: 6,
    };
    onChange([...series, nuevaSerie]);
  };

  const eliminarSerie = (id: string) => {
    onChange(series.filter((s) => s.id !== id));
  };

  const actualizarSerie = (id: string, updates: Partial<Serie>) => {
    onChange(
      series.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Series y Repeticiones
        </h3>
        <Button size="sm" onClick={agregarSerie}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Serie
        </Button>
      </div>

      {series.length === 0 ? (
        <Card className="bg-white shadow-sm text-center p-6">
          <p className="text-gray-500">No hay series configuradas. Agrega la primera serie.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {series.map((serie, index) => (
            <Card key={serie.id} className="bg-white shadow-sm">
              <div className="p-4 flex items-center gap-4">
                <div className="flex items-center text-gray-400">
                  <GripVertical className="w-5 h-5" />
                  <span className="ml-2 font-semibold">Serie {index + 1}</span>
                </div>

                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Input
                    label="Repeticiones"
                    type="number"
                    value={serie.repeticiones || ''}
                    onChange={(e) =>
                      actualizarSerie(serie.id, {
                        repeticiones: parseInt(e.target.value) || 0,
                      })
                    }
                    fullWidth={false}
                  />

                  <Input
                    label="Peso (kg)"
                    type="number"
                    value={serie.peso || ''}
                    onChange={(e) =>
                      actualizarSerie(serie.id, {
                        peso: parseFloat(e.target.value) || 0,
                      })
                    }
                    fullWidth={false}
                  />

                  <Input
                    label="Descanso (seg)"
                    type="number"
                    value={serie.descanso || ''}
                    onChange={(e) =>
                      actualizarSerie(serie.id, {
                        descanso: parseInt(e.target.value) || 0,
                      })
                    }
                    fullWidth={false}
                  />

                  <Input
                    label="RPE (1-10)"
                    type="number"
                    min="1"
                    max="10"
                    value={serie.rpe || ''}
                    onChange={(e) =>
                      actualizarSerie(serie.id, {
                        rpe: parseInt(e.target.value) || 6,
                      })
                    }
                    fullWidth={false}
                  />
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => eliminarSerie(serie.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

