import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { BodyMeasurement } from '../types';
import { getBodyMeasurements } from '../api/client360';
import { Loader2, Ruler, Calendar, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface MeasurementsTabProps {
  clientId: string;
}

export const MeasurementsTab: React.FC<MeasurementsTabProps> = ({ clientId }) => {
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeasurements();
  }, [clientId]);

  const loadMeasurements = async () => {
    setLoading(true);
    try {
      const data = await getBodyMeasurements(clientId);
      setMeasurements(data);
    } catch (error) {
      console.error('Error cargando mediciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  const calculateChange = (current: number | undefined, previous: number | undefined) => {
    if (!current || !previous) return null;
    const change = current - previous;
    const percentChange = ((change / previous) * 100).toFixed(1);
    return { change, percentChange };
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp size={14} className="text-green-600" />;
    if (change < 0) return <TrendingDown size={14} className="text-red-600" />;
    return <Minus size={14} className="text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando mediciones...</p>
      </div>
    );
  }

  if (measurements.length === 0) {
    return (
      <div className="p-8 text-center">
        <Ruler size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay mediciones registradas</h3>
        <p className="text-gray-600">Aún no se han registrado mediciones para este cliente</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {measurements.map((measurement, index) => {
        const previous = index < measurements.length - 1 ? measurements[index + 1] : null;
        
        return (
          <Card key={measurement.id} className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Ruler size={20} className="text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={14} />
                    <span>{formatDate(measurement.date)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Peso */}
              {measurement.weightKg !== undefined && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm font-medium text-gray-600 mb-1">Peso</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {measurement.weightKg} kg
                    </span>
                    {(() => {
                      const changeData = calculateChange(measurement.weightKg, previous?.weightKg);
                      return changeData && (
                        <div className="flex items-center gap-1 text-sm">
                          {getChangeIcon(changeData.change)}
                          <span className={changeData.change > 0 ? 'text-red-600' : changeData.change < 0 ? 'text-green-600' : 'text-gray-400'}>
                            {changeData.change > 0 ? '+' : ''}{changeData.change.toFixed(1)} kg
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Grasa corporal */}
              {measurement.bodyFatPercentage !== undefined && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm font-medium text-gray-600 mb-1">Grasa Corporal</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {measurement.bodyFatPercentage}%
                    </span>
                    {(() => {
                      const changeData = calculateChange(measurement.bodyFatPercentage, previous?.bodyFatPercentage);
                      return changeData && (
                        <div className="flex items-center gap-1 text-sm">
                          {getChangeIcon(-changeData.change)}
                          <span className={changeData.change < 0 ? 'text-green-600' : changeData.change > 0 ? 'text-red-600' : 'text-gray-400'}>
                            {changeData.change > 0 ? '+' : ''}{changeData.change.toFixed(1)}%
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Masa muscular */}
              {measurement.muscleMassKg !== undefined && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm font-medium text-gray-600 mb-1">Masa Muscular</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {measurement.muscleMassKg} kg
                    </span>
                    {(() => {
                      const changeData = calculateChange(measurement.muscleMassKg, previous?.muscleMassKg);
                      return changeData && (
                        <div className="flex items-center gap-1 text-sm">
                          {getChangeIcon(changeData.change)}
                          <span className={changeData.change > 0 ? 'text-green-600' : changeData.change < 0 ? 'text-red-600' : 'text-gray-400'}>
                            {changeData.change > 0 ? '+' : ''}{changeData.change.toFixed(1)} kg
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Medidas corporales */}
            {(measurement.chest || measurement.waist || measurement.hips || measurement.arms || measurement.legs) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-sm font-medium text-gray-700 mb-3">Medidas (cm)</div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {measurement.chest && (
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">Pecho</div>
                      <div className="text-lg font-semibold text-gray-900">{measurement.chest}</div>
                    </div>
                  )}
                  {measurement.waist && (
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">Cintura</div>
                      <div className="text-lg font-semibold text-gray-900">{measurement.waist}</div>
                    </div>
                  )}
                  {measurement.hips && (
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">Cadera</div>
                      <div className="text-lg font-semibold text-gray-900">{measurement.hips}</div>
                    </div>
                  )}
                  {measurement.arms && (
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">Brazos</div>
                      <div className="text-lg font-semibold text-gray-900">{measurement.arms}</div>
                    </div>
                  )}
                  {measurement.legs && (
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">Piernas</div>
                      <div className="text-lg font-semibold text-gray-900">{measurement.legs}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {measurement.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 italic">{measurement.notes}</p>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

