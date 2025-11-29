import React from 'react';
import { HashtagAnalysis } from '../api/social';
import { Card } from '../../../components/componentsreutilizables';
import { Hash, TrendingUp, TrendingDown, Minus, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface HashtagAnalyzerProps {
  hashtags: HashtagAnalysis[];
}

export const HashtagAnalyzer: React.FC<HashtagAnalyzerProps> = ({ hashtags }) => {
  const getTrendIcon = (trend: HashtagAnalysis['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="text-green-600" />;
      case 'down':
        return <TrendingDown size={16} className="text-red-600" />;
      case 'stable':
        return <Minus size={16} className="text-gray-600" />;
      default:
        return null;
    }
  };

  const getRecommendationIcon = (rec: HashtagAnalysis['recommendation']) => {
    switch (rec) {
      case 'use':
        return <CheckCircle2 size={16} className="text-green-600" />;
      case 'avoid':
        return <XCircle size={16} className="text-red-600" />;
      case 'test':
        return <AlertCircle size={16} className="text-yellow-600" />;
      default:
        return null;
    }
  };

  const getRecommendationColor = (rec: HashtagAnalysis['recommendation']) => {
    switch (rec) {
      case 'use':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'avoid':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'test':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRecommendationLabel = (rec: HashtagAnalysis['recommendation']) => {
    switch (rec) {
      case 'use':
        return 'Usar';
      case 'avoid':
        return 'Evitar';
      case 'test':
        return 'Probar';
      default:
        return rec;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hash size={20} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Análisis de Hashtags</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {hashtags.map((hashtag, idx) => (
          <Card
            key={idx}
            className="p-4 bg-white shadow-sm ring-1 ring-gray-200 hover:ring-blue-400 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-semibold text-gray-900">{hashtag.hashtag}</span>
                  {getTrendIcon(hashtag.trend)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRecommendationColor(hashtag.recommendation)}`}>
                    {getRecommendationIcon(hashtag.recommendation)}
                    <span className="ml-1">{getRecommendationLabel(hashtag.recommendation)}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Veces usado</p>
                <p className="text-lg font-semibold text-gray-900">{hashtag.usageCount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Engagement promedio</p>
                <p className="text-lg font-semibold text-gray-900">{hashtag.avgEngagement}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Alcance</p>
                <p className="text-lg font-semibold text-gray-900">{hashtag.reach.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Tendencia</p>
                <div className="flex items-center gap-1">
                  {getTrendIcon(hashtag.trend)}
                  <span className="text-sm font-semibold text-gray-900 capitalize">{hashtag.trend}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {hashtags.length === 0 && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Hash size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay hashtags</h3>
          <p className="text-gray-600">Los hashtags aparecerán cuando publiques contenido</p>
        </Card>
      )}
    </div>
  );
};

