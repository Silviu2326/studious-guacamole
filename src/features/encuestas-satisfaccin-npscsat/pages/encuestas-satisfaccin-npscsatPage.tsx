import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards, Button } from '../../../components/componentsreutilizables';
import {
  SurveysManager,
  SatisfactionDashboard,
  ResponseAnalytics,
  ComparisonReports,
  AutomationRules,
} from '../components';
import {
  FileText,
  BarChart3,
  TrendingUp,
  Settings,
  MessageSquare,
  Users,
} from 'lucide-react';
import { getAnalytics } from '../api';

export default function EncuestasSatisfaccinNPSCSATPage() {
  const { user } = useAuth();
  const esGimnasio = user?.role === 'gimnasio';
  const [tabActiva, setTabActiva] = useState<string>('dashboard');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);

  React.useEffect(() => {
    if (esGimnasio) {
      loadMetrics();
    }
  }, [esGimnasio]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await getAnalytics();
      setMetrics(data);
    } catch (error) {
      console.error('Error cargando métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
    },
    {
      id: 'surveys',
      label: 'Encuestas',
      icon: FileText,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
    },
    {
      id: 'comparison',
      label: 'Comparaciones',
      icon: MessageSquare,
    },
    {
      id: 'automation',
      label: 'Automatización',
      icon: Settings,
    },
  ];

  const metricCards = metrics
    ? [
        {
          id: 'nps',
          title: 'NPS Score',
          value: metrics.nps.score,
          subtitle: `${metrics.nps.total} respuestas`,
          icon: <TrendingUp className="w-5 h-5" />,
          color: metrics.nps.score >= 50 ? 'success' : metrics.nps.score >= 0 ? 'warning' : 'error' as const,
          trend: {
            value: 5.2,
            direction: metrics.nps.score >= 50 ? 'up' as const : 'down' as const,
            label: 'vs mes anterior',
          },
        },
        {
          id: 'csat',
          title: 'CSAT Promedio',
          value: metrics.csat.average.toFixed(1),
          subtitle: `${metrics.csat.total} respuestas`,
          icon: <BarChart3 className="w-5 h-5" />,
          color: metrics.csat.average >= 4 ? 'success' : metrics.csat.average >= 3 ? 'warning' : 'error' as const,
        },
        {
          id: 'promotors',
          title: 'Promotores',
          value: metrics.nps.promotors,
          subtitle: `${Math.round((metrics.nps.promotors / metrics.nps.total) * 100) || 0}% del total`,
          icon: <Users className="w-5 h-5" />,
          color: 'success' as const,
        },
        {
          id: 'detractors',
          title: 'Detractores',
          value: metrics.nps.detractors,
          subtitle: `${Math.round((metrics.nps.detractors / metrics.nps.total) * 100) || 0}% del total`,
          icon: <TrendingUp className="w-5 h-5" />,
          color: 'error' as const,
        },
      ]
    : [];

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'dashboard':
        return <SatisfactionDashboard />;
      case 'surveys':
        return <SurveysManager />;
      case 'analytics':
        return <ResponseAnalytics />;
      case 'comparison':
        return <ComparisonReports />;
      case 'automation':
        return <AutomationRules />;
      default:
        return <SatisfactionDashboard />;
    }
  };

  if (!esGimnasio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <Card className="p-8 text-center bg-white shadow-sm">
            <p className="text-gray-600">
              Este módulo está disponible solo para gimnasios
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <MessageSquare size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Encuestas de Satisfacción NPS/CSAT
                </h1>
                <p className="text-gray-600">
                  Sistema completo de evaluación de satisfacción del cliente mediante encuestas NPS y CSAT
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Toolbar superior */}
          <div className="flex items-center justify-end">
            <Button variant="primary" size="md" onClick={loadMetrics}>
              <BarChart3 size={20} className="mr-2" />
              Actualizar Métricas
            </Button>
          </div>

          {/* Métricas */}
          {metrics && <MetricCards data={metricCards} columns={4} />}

          {/* Sistema de Tabs */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = tabActiva === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setTabActiva(tab.id)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Contenido de la sección activa */}
          <div className="mt-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

