import React from 'react';
import { SurveyResults } from '../api/surveys';
import { TrendingUp, Users, MessageSquare, AlertTriangle } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';

interface SurveyResultsDashboardProps {
  results: SurveyResults;
}

/**
 * Dashboard de resultados de una encuesta
 */
export const SurveyResultsDashboard: React.FC<SurveyResultsDashboardProps> = ({
  results
}) => {
  const calculateNPSBreakdown = (breakdown: any) => {
    if (breakdown.stats && breakdown.type === 'nps') {
      const total = breakdown.stats.promoters + breakdown.stats.passives + breakdown.stats.detractors;
      return {
        promoters: breakdown.stats.promoters,
        passives: breakdown.stats.passives,
        detractors: breakdown.stats.detractors,
        total
      };
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Respuestas</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{results.summary.totalResponses}</p>
          <p className="text-xs text-gray-500 mt-1">
            {results.summary.responseRate}% tasa de respuesta
          </p>
        </Card>

        {results.summary.nps !== undefined && (
          <Card className="bg-white shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Net Promoter Score</span>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{results.summary.nps}</p>
            <p className="text-xs text-gray-500 mt-1">
              {results.summary.nps >= 50 ? 'Excelente' :
               results.summary.nps >= 0 ? 'Bueno' : 'Necesita mejora'}
            </p>
          </Card>
        )}

        {results.summary.csat !== undefined && (
          <Card className="bg-white shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">CSAT</span>
              <MessageSquare className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{results.summary.csat.toFixed(1)}/5</p>
            <p className="text-xs text-gray-500 mt-1">Satisfacción del cliente</p>
          </Card>
        )}
      </div>

      {/* Desglose por pregunta */}
      <div className="space-y-4">
        {results.breakdown.map((breakdown) => {
          const npsData = calculateNPSBreakdown(breakdown);
          
          return (
            <Card key={breakdown.questionId} className="bg-white shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{breakdown.text}</h3>
              
              {npsData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{npsData.promoters}</p>
                      <p className="text-sm text-gray-600 mt-1">Promotores</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">{npsData.passives}</p>
                      <p className="text-sm text-gray-600 mt-1">Pasivos</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{npsData.detractors}</p>
                      <p className="text-sm text-gray-600 mt-1">Detractores</p>
                    </div>
                  </div>
                </div>
              ) : breakdown.stats?.average !== undefined ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Promedio</span>
                    <span className="text-xl font-bold text-gray-900">
                      {breakdown.stats.average.toFixed(1)}
                    </span>
                  </div>
                  {breakdown.stats.distribution && (
                    <div className="space-y-1 mt-4">
                      {Object.entries(breakdown.stats.distribution)
                        .sort(([a], [b]) => Number(b) - Number(a))
                        .map(([value, count]) => (
                          <div key={value} className="flex items-center gap-2">
                            <span className="w-12 text-sm text-gray-600">{value}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-4">
                              <div
                                className="bg-blue-600 h-4 rounded-full"
                                style={{
                                  width: `${(Number(count) / results.summary.totalResponses) * 100}%`
                                }}
                              />
                            </div>
                            <span className="w-12 text-sm text-gray-900 text-right">{count as number}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Sin datos estadísticos disponibles</p>
              )}
            </Card>
          );
        })}
      </div>

      {/* Respuestas individuales */}
      {results.individualResponses.length > 0 && (
        <Card className="bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Respuestas Individuales ({results.individualResponses.length})
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {results.individualResponses.map((response) => (
              <div key={response.responseId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  {response.clientAvatar ? (
                    <img
                      src={response.clientAvatar}
                      alt={response.clientName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {response.clientName?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{response.clientName || 'Cliente'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(response.submittedAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {Object.entries(response.answers).map(([questionId, answer]) => (
                    <div key={questionId} className="text-sm">
                      <span className="font-medium text-gray-700">Q{questionId}:</span>{' '}
                      <span className="text-gray-900">{String(answer)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};


