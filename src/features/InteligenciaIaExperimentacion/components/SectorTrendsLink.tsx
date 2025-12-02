import React, { useState } from 'react';
import { Button, Card, Badge } from '../../../components/componentsreutilizables';
import { SectorTrendsData } from '../types';
import { TrendingUp, Clock, FileText, ChevronRight, X, Lightbulb } from 'lucide-react';

interface SectorTrendsLinkProps {
  sectorTrends: SectorTrendsData;
}

export const SectorTrendsLink: React.FC<SectorTrendsLinkProps> = ({ sectorTrends }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryIcons = {
    strategy: <TrendingUp size={18} className="text-indigo-600" />,
    timing: <Clock size={18} className="text-indigo-600" />,
    content: <FileText size={18} className="text-indigo-600" />,
  };

  const impactColors = {
    high: 'bg-red-50 text-red-700 border-red-200',
    medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    low: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  const allTrends = [
    ...sectorTrends.successfulStrategies,
    ...sectorTrends.bestPostingTimes,
    ...sectorTrends.topContentTypes,
  ];

  const categoryLabels = {
    strategy: 'Estrategias Exitosas',
    timing: 'Mejores Momentos',
    content: 'Tipos de Contenido',
  };

  return (
    <>
      <Button
        onClick={() => setIsExpanded(true)}
        variant="secondary"
        leftIcon={<TrendingUp size={18} />}
        rightIcon={<ChevronRight size={16} />}
        className="w-full sm:w-auto"
      >
        Tendencias del Sector
      </Button>
      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
        >
          <Card
            className="p-6 bg-white shadow-xl border border-slate-200/70 w-full max-w-4xl max-h-[85vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600">
                <Lightbulb size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Tendencias del Sector</h3>
                <p className="text-sm text-slate-600">Insights agregados sobre estrategias exitosas</p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Cerrar"
            >
              <X size={20} className="text-slate-600" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Estrategias Exitosas */}
            {sectorTrends.successfulStrategies.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  {categoryIcons.strategy}
                  <h4 className="text-lg font-semibold text-slate-900">
                    {categoryLabels.strategy}
                  </h4>
                  <Badge variant="blue" size="sm">
                    {sectorTrends.successfulStrategies.length}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sectorTrends.successfulStrategies.map((trend) => (
                    <div
                      key={trend.id}
                      className={`p-4 rounded-lg border ${impactColors[trend.impact]} transition-all hover:shadow-md`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h5 className="font-semibold text-slate-900 flex-1">{trend.title}</h5>
                        <Badge
                          variant={trend.impact === 'high' ? 'red' : trend.impact === 'medium' ? 'yellow' : 'blue'}
                          size="sm"
                        >
                          {trend.impact === 'high' ? 'Alto' : trend.impact === 'medium' ? 'Medio' : 'Bajo'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{trend.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mejores Momentos para Publicar */}
            {sectorTrends.bestPostingTimes.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  {categoryIcons.timing}
                  <h4 className="text-lg font-semibold text-slate-900">
                    {categoryLabels.timing}
                  </h4>
                  <Badge variant="blue" size="sm">
                    {sectorTrends.bestPostingTimes.length}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sectorTrends.bestPostingTimes.map((trend) => (
                    <div
                      key={trend.id}
                      className={`p-4 rounded-lg border ${impactColors[trend.impact]} transition-all hover:shadow-md`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h5 className="font-semibold text-slate-900 flex-1">{trend.title}</h5>
                        <Badge
                          variant={trend.impact === 'high' ? 'red' : trend.impact === 'medium' ? 'yellow' : 'blue'}
                          size="sm"
                        >
                          {trend.impact === 'high' ? 'Alto' : trend.impact === 'medium' ? 'Medio' : 'Bajo'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{trend.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tipos de Contenido que Generan Más Leads */}
            {sectorTrends.topContentTypes.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  {categoryIcons.content}
                  <h4 className="text-lg font-semibold text-slate-900">
                    {categoryLabels.content}
                  </h4>
                  <Badge variant="blue" size="sm">
                    {sectorTrends.topContentTypes.length}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sectorTrends.topContentTypes.map((trend) => (
                    <div
                      key={trend.id}
                      className={`p-4 rounded-lg border ${impactColors[trend.impact]} transition-all hover:shadow-md`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h5 className="font-semibold text-slate-900 flex-1">{trend.title}</h5>
                        <Badge
                          variant={trend.impact === 'high' ? 'red' : trend.impact === 'medium' ? 'yellow' : 'blue'}
                          size="sm"
                        >
                          {trend.impact === 'high' ? 'Alto' : trend.impact === 'medium' ? 'Medio' : 'Bajo'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{trend.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <Button
                onClick={() => setIsExpanded(false)}
                variant="secondary"
                className="w-full"
              >
                Cerrar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default SectorTrendsLink;

