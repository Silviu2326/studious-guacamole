import React, { useState } from 'react';
import { ComparisonData } from '../types';
import { comparePerformance } from '../api/performance';
import { Card, Button } from '../../../components/componentsreutilizables';
import { TrendingUp, TrendingDown, Minus, Calendar, Loader2 } from 'lucide-react';

interface ComparisonToolProps {
  role: 'entrenador' | 'gimnasio';
}

export const ComparisonTool: React.FC<ComparisonToolProps> = ({ role }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ComparisonData | null>(null);
  const [currentPeriod, setCurrentPeriod] = useState('2024-11');
  const [previousPeriod, setPreviousPeriod] = useState('2024-10');

  const handleCompare = async () => {
    setLoading(true);
    try {
      const comparison = await comparePerformance(role, currentPeriod, previousPeriod);
      setData(comparison);
    } catch (error) {
      console.error('Error comparing performance:', error);
      alert('Error al comparar períodos');
    } finally {
      setLoading(false);
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getChangeColor = (change: number, metric: string) => {
    // Para tasa de bajas, menos es mejor
    if (metric.toLowerCase().includes('bajas') || metric.toLowerCase().includes('baja')) {
      return change < 0 ? 'text-green-600' : change > 0 ? 'text-red-600' : 'text-gray-600';
    }
    return change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Período Actual
            </label>
            <input
              type="month"
              value={currentPeriod}
              onChange={(e) => setCurrentPeriod(e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Período Anterior
            </label>
            <input
              type="month"
              value={previousPeriod}
              onChange={(e) => setPreviousPeriod(e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>
          <div className="flex items-end">
            <Button
              variant="primary"
              onClick={handleCompare}
              disabled={loading}
              className="w-full"
            >
              <Calendar size={20} className="mr-2" />
              Comparar
            </Button>
          </div>
        </div>
      </Card>

      {loading && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </Card>
      )}

      {data && !loading && (
        <Card className="p-6 bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Resultados de la Comparación
          </h3>
          
          <div className="space-y-4">
            {data.changes.map((change, index) => (
              <Card
                key={index}
                variant="hover"
                className="p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base font-semibold text-gray-900">
                    {change.metric}
                  </h4>
                  <div className="flex items-center gap-2">
                    {getChangeIcon(change.change)}
                    <span className={`text-base font-semibold ${getChangeColor(change.change, change.metric)}`}>
                      {change.change > 0 ? '+' : ''}{change.change.toFixed(2)} ({change.changePercent > 0 ? '+' : ''}{change.changePercent.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Período Anterior
                    </p>
                    <p className="text-base text-gray-900">
                      {change.previous.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Período Actual
                    </p>
                    <p className="text-base text-gray-900">
                      {change.current.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {!data && !loading && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona períodos para comparar</h3>
          <p className="text-gray-600">Selecciona los períodos y haz clic en "Comparar" para ver los resultados</p>
        </Card>
      )}
    </div>
  );
};

