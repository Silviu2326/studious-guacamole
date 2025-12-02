import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { TimelineEntry, TimelinePhoto, PhysicalMeasurement } from '../types';
import {
  getTimelineEntries,
  createTimelineEntry,
  deleteTimelineEntry,
  addPhotoToTimeline,
  addMeasurementToTimeline,
} from '../api/timeline';
import {
  Camera,
  Ruler,
  Plus,
  Trash2,
  Edit,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Image as ImageIcon,
  Loader2,
  Award,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TimelinePanelProps {
  clienteId: string;
}

export const TimelinePanel: React.FC<TimelinePanelProps> = ({ clienteId }) => {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEntryType, setSelectedEntryType] = useState<'photo' | 'measurement' | 'milestone'>('photo');

  useEffect(() => {
    loadTimeline();
  }, [clienteId]);

  const loadTimeline = async () => {
    setLoading(true);
    try {
      const data = await getTimelineEntries(clienteId);
      setEntries(data);
    } catch (error) {
      console.error('Error cargando timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta entrada?')) return;
    try {
      await deleteTimelineEntry(entryId);
      setEntries(prev => prev.filter(e => e.id !== entryId));
    } catch (error) {
      console.error('Error eliminando entrada:', error);
    }
  };

  const getMeasurementLabel = (type: string): string => {
    const labels: Record<string, string> = {
      weight: 'Peso',
      'body-fat': 'Grasa Corporal',
      'muscle-mass': 'Masa Muscular',
      chest: 'Pecho',
      waist: 'Cintura',
      hips: 'Cadera',
      arms: 'Brazos',
      thighs: 'Muslos',
      height: 'Altura',
      bmi: 'IMC',
      other: 'Otro',
    };
    return labels[type] || type;
  };

  const getMeasurementUnit = (unit: string): string => {
    const units: Record<string, string> = {
      kg: 'kg',
      g: 'g',
      cm: 'cm',
      m: 'm',
      '%': '%',
      bmi: '',
    };
    return units[unit] || unit;
  };

  const getMeasurementTrend = (current: number, previous?: number): 'up' | 'down' | 'neutral' => {
    if (!previous) return 'neutral';
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'neutral';
  };

  const getPreviousMeasurement = (
    entryIndex: number,
    measurementType: string
  ): number | undefined => {
    for (let i = entryIndex + 1; i < entries.length; i++) {
      const measurement = entries[i].measurements?.find(m => m.type === measurementType);
      if (measurement) return measurement.value;
    }
    return undefined;
  };

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "d 'de' MMMM, yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando línea de tiempo...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Línea de Tiempo de Progreso</h3>
          <p className="text-sm text-gray-600 mt-1">
            Visualiza la evolución del cliente con fotos y mediciones
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Entrada
        </Button>
      </div>

      {/* Timeline */}
      {entries.length === 0 ? (
        <Card className="p-12 text-center bg-white shadow-sm">
          <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-2">No hay entradas en la línea de tiempo</p>
          <p className="text-sm text-gray-400 mb-4">
            Comienza agregando fotos de progreso o mediciones físicas
          </p>
          <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Primera Entrada
          </Button>
        </Card>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

          {/* Timeline Entries */}
          <div className="space-y-8">
            {entries.map((entry, index) => (
              <div key={entry.id} className="relative flex gap-6">
                {/* Timeline Dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-white shadow-lg ${
                      entry.type === 'photo'
                        ? 'bg-blue-500'
                        : entry.type === 'measurement'
                        ? 'bg-green-500'
                        : 'bg-purple-500'
                    }`}
                  >
                    {entry.type === 'photo' && <Camera className="w-6 h-6 text-white" />}
                    {entry.type === 'measurement' && <Ruler className="w-6 h-6 text-white" />}
                    {entry.type === 'milestone' && <Award className="w-6 h-6 text-white" />}
                  </div>
                </div>

                {/* Entry Content */}
                <div className="flex-1 pb-8">
                  <Card variant="hover" className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-lg font-semibold text-gray-900">{entry.title}</h4>
                          <Badge
                            variant={
                              entry.type === 'photo'
                                ? 'blue'
                                : entry.type === 'measurement'
                                ? 'green'
                                : 'purple'
                            }
                          >
                            {entry.type === 'photo'
                              ? 'Foto'
                              : entry.type === 'measurement'
                              ? 'Medición'
                              : 'Hito'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(entry.date)}</span>
                        </div>
                        {entry.description && (
                          <p className="text-sm text-gray-600 mt-2">{entry.description}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Photos */}
                    {entry.photos && entry.photos.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          Fotos ({entry.photos.length})
                        </h5>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {entry.photos.map((photo) => (
                            <div
                              key={photo.id}
                              className="relative group aspect-[3/4] rounded-lg overflow-hidden bg-gray-100"
                            >
                              <img
                                src={photo.url}
                                alt={photo.description || 'Foto de progreso'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = `https://via.placeholder.com/400x600/94A3B8/FFFFFF?text=${encodeURIComponent(
                                    photo.description || 'Foto'
                                  )}`;
                                }}
                              />
                              {photo.description && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2">
                                  {photo.description}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Measurements */}
                    {entry.measurements && entry.measurements.length > 0 && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Ruler className="w-4 h-4" />
                          Mediciones ({entry.measurements.length})
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {entry.measurements.map((measurement) => {
                            const previous = getPreviousMeasurement(index, measurement.type);
                            const trend = getMeasurementTrend(measurement.value, previous);
                            const diff = previous ? measurement.value - previous : 0;
                            const diffAbs = Math.abs(diff);

                            return (
                              <div
                                key={measurement.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-900">
                                      {getMeasurementLabel(measurement.type)}
                                    </span>
                                    {trend !== 'neutral' && previous && (
                                      <div
                                        className={`flex items-center gap-1 text-xs ${
                                          trend === 'up'
                                            ? measurement.type === 'weight' ||
                                              measurement.type === 'body-fat' ||
                                              measurement.type === 'waist'
                                              ? 'text-red-600'
                                              : 'text-green-600'
                                            : measurement.type === 'weight' ||
                                              measurement.type === 'body-fat' ||
                                              measurement.type === 'waist'
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                        }`}
                                      >
                                        {trend === 'up' ? (
                                          <TrendingUp className="w-3 h-3" />
                                        ) : (
                                          <TrendingDown className="w-3 h-3" />
                                        )}
                                        <span>
                                          {diff > 0 ? '+' : ''}
                                          {diff.toFixed(1)} {getMeasurementUnit(measurement.unit)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-lg font-bold text-gray-900">
                                      {measurement.value} {getMeasurementUnit(measurement.unit)}
                                    </span>
                                    {previous && (
                                      <span className="text-xs text-gray-500">
                                        (antes: {previous} {getMeasurementUnit(measurement.unit)})
                                      </span>
                                    )}
                                  </div>
                                  {measurement.notes && (
                                    <p className="text-xs text-gray-600 mt-1">{measurement.notes}</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Entry Modal - Simplified version */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6 m-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Nueva Entrada</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Funcionalidad de creación de entradas en desarrollo. Por ahora, puedes ver las
              entradas existentes en la línea de tiempo.
            </p>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cerrar
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

