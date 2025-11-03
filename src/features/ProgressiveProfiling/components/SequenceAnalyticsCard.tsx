import React from 'react';
import { SequenceStats } from '../api/profiling';
import { TrendingUp, TrendingDown, Users, AlertCircle } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';

interface SequenceAnalyticsCardProps {
  stats: SequenceStats;
}

export const SequenceAnalyticsCard: React.FC<SequenceAnalyticsCardProps> = ({ stats }) => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Tasa de Finalización</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.completionRate.toFixed(1)}%</p>
        </Card>

        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Respuestas</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalResponses}</p>
        </Card>

        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Punto de Abandono</h3>
          <p className="text-sm font-bold text-gray-900">
            {stats.dropOffQuestion || 'N/A'}
          </p>
        </Card>
      </div>

      {/* Per Question Rates */}
      <Card className="p-6 bg-white shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Tasa de Respuesta por Pregunta</h3>
        <div className="space-y-4">
          {stats.perQuestionResponseRate.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{item.questionText}</span>
                <span className="text-sm font-bold text-blue-600">
                  {item.responseRate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${item.responseRate}%` }}
                />
              </div>
              {item.dropOffRate > 0 && (
                <div className="flex items-center gap-2 text-xs text-red-600">
                  <TrendingDown className="w-4 h-4" />
                  {item.dropOffRate.toFixed(1)}% de abandono en esta pregunta
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

