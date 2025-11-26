import React, { useState, useMemo } from 'react';
import { Card, Tabs, MetricCards } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import {
  SegmentationEngine,
  SmartListsManager,
  SegmentBuilder,
  BehaviorAnalyzer,
  PredictiveSegmentation,
  SegmentAnalytics,
  AutomationRules,
  SegmentComparison
} from '../components';
import { 
  Users, 
  List, 
  Wrench, 
  Activity, 
  Brain, 
  BarChart3, 
  Zap, 
  GitCompare,
  Target
} from 'lucide-react';

export const ListasInteligentesSegmentosGuardadosPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('segments');

  const tabs = useMemo(() => [
    {
      id: 'segments',
      label: 'Segmentos',
      icon: <Users className="w-4 h-4" />
    },
    {
      id: 'smart-lists',
      label: 'Listas Inteligentes',
      icon: <List className="w-4 h-4" />
    },
    {
      id: 'builder',
      label: 'Constructor',
      icon: <Wrench className="w-4 h-4" />
    },
    {
      id: 'behavior',
      label: 'Análisis Comportamiento',
      icon: <Activity className="w-4 h-4" />
    },
    {
      id: 'predictive',
      label: 'Segmentación Predictiva',
      icon: <Brain className="w-4 h-4" />
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'automation',
      label: 'Automatización',
      icon: <Zap className="w-4 h-4" />
    },
    {
      id: 'comparison',
      label: 'Comparación',
      icon: <GitCompare className="w-4 h-4" />
    }
  ], []);

  const metrics = useMemo(() => [
    {
      id: 'total-segments',
      title: 'Segmentos Activos',
      value: '3',
      subtitle: 'Total creados',
      icon: <Users className="w-5 h-5" />,
      color: 'primary' as const
    },
    {
      id: 'smart-lists',
      title: 'Listas Inteligentes',
      value: '3',
      subtitle: 'En tiempo real',
      icon: <List className="w-5 h-5" />,
      color: 'success' as const
    },
    {
      id: 'total-members',
      title: 'Total Miembros',
      value: '465',
      subtitle: 'En todos los segmentos',
      icon: <Target className="w-5 h-5" />,
      color: 'info' as const
    },
    {
      id: 'automation-rules',
      title: 'Reglas Automatizadas',
      value: '8',
      subtitle: 'Activas',
      icon: <Zap className="w-5 h-5" />,
      color: 'warning' as const
    }
  ], []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'segments':
        return <SegmentationEngine />;
      case 'smart-lists':
        return <SmartListsManager />;
      case 'builder':
        return <SegmentBuilder />;
      case 'behavior':
        return <BehaviorAnalyzer />;
      case 'predictive':
        return <PredictiveSegmentation />;
      case 'analytics':
        return <SegmentAnalytics />;
      case 'automation':
        return <AutomationRules />;
      case 'comparison':
        return <SegmentComparison />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header principal */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className={`${ds.typography.h1} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Listas Inteligentes y Segmentos
          </h1>
          <p className={`${ds.typography.bodyLarge} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} max-w-2xl`}>
            Sistema avanzado de segmentación automática y listas inteligentes especializado para gimnasios con alto volumen de clientes
          </p>
        </div>
      </div>

      {/* Métricas */}
      <MetricCards data={metrics} columns={4} />

      {/* Navegación por tabs */}
      <Card variant="hover" padding="md">
        <Tabs 
          items={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          variant="pills" 
        />
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </Card>
    </div>
  );
};

export default ListasInteligentesSegmentosGuardadosPage;

