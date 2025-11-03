import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { getPersonalizationKPIs, PersonalizationKPI } from '../api/personalization';
import { TrendingUp, CheckCircle, XCircle, Target, DollarSign, BookOpen } from 'lucide-react';

interface PersonalizationEngineDashboardProps {
  isLoading?: boolean;
}

export const PersonalizationEngineDashboard: React.FC<PersonalizationEngineDashboardProps> = () => {
  const [kpiData, setKpiData] = useState<PersonalizationKPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadKPIs();
  }, []);

  const loadKPIs = async () => {
    setIsLoading(true);
    try {
      const data = await getPersonalizationKPIs();
      setKpiData(data);
    } catch (err) {
      console.error('Error loading KPIs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !kpiData) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Tasa de Aceptación</h3>
          <p className="text-3xl font-bold text-gray-900">{kpiData.acceptanceRate.toFixed(1)}%</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Impacto Adherencia</h3>
          <p className="text-3xl font-bold text-green-600">+{kpiData.adherenceImpact.toFixed(1)}%</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Target className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Precisión Predicción</h3>
          <p className="text-3xl font-bold text-gray-900">{kpiData.riskPredictionAccuracy.toFixed(1)}%</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Conversión Ofertas</h3>
          <p className="text-3xl font-bold text-gray-900">{kpiData.offerConversionRate.toFixed(1)}%</p>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Engagement Contenido</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{kpiData.contentEngagementRate.toFixed(1)}%</p>
          <p className="text-xs text-gray-600 mt-1">CTR en contenido recomendado</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-bold text-gray-900">Churn Rate IA</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">{kpiData.churnRateIA.toFixed(1)}%</p>
          <p className="text-xs text-gray-600 mt-1">vs grupo de control</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">Sugerencias</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Generadas</span>
              <span className="text-xl font-bold text-gray-900">{kpiData.totalSuggestionsGenerated}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Aceptadas</span>
              <span className="text-xl font-bold text-green-600">{kpiData.totalSuggestionsAccepted}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Rechazadas</span>
              <span className="text-xl font-bold text-red-600">{kpiData.totalSuggestionsRejected}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

