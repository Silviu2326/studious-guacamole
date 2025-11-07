import React, { useState, useEffect } from 'react';
import { MetricCards, MetricCardData } from '../../../components/componentsreutilizables';
import { getPersonalizationKPIs, PersonalizationKPI } from '../api/personalization';
import { TrendingUp, CheckCircle, Target, DollarSign, BookOpen, Loader2 } from 'lucide-react';

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
        <Loader2 size={48} className="text-blue-500 animate-spin" />
      </div>
    );
  }

  const mainKPIs: MetricCardData[] = [
    {
      id: 'acceptance-rate',
      title: 'Tasa de Aceptación',
      value: `${kpiData.acceptanceRate.toFixed(1)}%`,
      color: 'success',
      icon: <CheckCircle size={20} />
    },
    {
      id: 'adherence-impact',
      title: 'Impacto Adherencia',
      value: `+${kpiData.adherenceImpact.toFixed(1)}%`,
      color: 'success',
      icon: <TrendingUp size={20} />
    },
    {
      id: 'prediction-accuracy',
      title: 'Precisión Predicción',
      value: `${kpiData.riskPredictionAccuracy.toFixed(1)}%`,
      color: 'info',
      icon: <Target size={20} />
    },
    {
      id: 'offer-conversion',
      title: 'Conversión Ofertas',
      value: `${kpiData.offerConversionRate.toFixed(1)}%`,
      color: 'info',
      icon: <DollarSign size={20} />
    }
  ];

  const additionalKPIs: MetricCardData[] = [
    {
      id: 'content-engagement',
      title: 'Engagement Contenido',
      value: `${kpiData.contentEngagementRate.toFixed(1)}%`,
      subtitle: 'CTR en contenido recomendado',
      color: 'info',
      icon: <BookOpen size={20} />
    },
    {
      id: 'churn-rate',
      title: 'Churn Rate IA',
      value: `${kpiData.churnRateIA.toFixed(1)}%`,
      subtitle: 'vs grupo de control',
      color: 'error',
      icon: <Target size={20} />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main KPI Cards */}
      <MetricCards data={mainKPIs} columns={4} />

      {/* Additional Stats */}
      <MetricCards data={additionalKPIs} columns={3} />
    </div>
  );
};

