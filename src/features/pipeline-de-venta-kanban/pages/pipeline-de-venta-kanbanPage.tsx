import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards, Button, Tabs } from '../../../components/componentsreutilizables';
import {
  PipelineKanban,
  PipelineFilters,
  PipelineMetrics,
  PhaseConfigurator,
  PipelineAutomation,
  PipelineReports,
} from '../components';
import { PipelineFilters as PipelineFiltersType } from '../types';
import {
  TrendingUp,
  DollarSign,
  Target,
  Settings,
  FileText,
  Kanban,
  BarChart3,
  CalendarDays,
} from 'lucide-react';

export default function PipelineDeVentaKanbanPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const businessType = esEntrenador ? 'entrenador' : 'gimnasio';

  const [filters, setFilters] = useState<PipelineFiltersType>({
    businessType,
  });
  const [activeTab, setActiveTab] = useState('kanban');
  const [showPhaseConfig, setShowPhaseConfig] = useState(false);

  // Métricas adaptadas por rol
  const metrics = esEntrenador
    ? [
        {
          id: 'total',
          title: 'Total Ventas',
          value: 12,
          subtitle: 'En pipeline',
          icon: <TrendingUp className="w-5 h-5" />,
          color: 'primary' as const,
        },
        {
          id: 'valor',
          title: 'Valor Total',
          value: '6.500€',
          subtitle: 'Valor potencial',
          icon: <DollarSign className="w-5 h-5" />,
          color: 'success' as const,
        },
        {
          id: 'conversion',
          title: 'Tasa Conversión',
          value: '33%',
          subtitle: 'Últimos 30 días',
          icon: <Target className="w-5 h-5" />,
          color: 'warning' as const,
          trend: {
            value: 5.2,
            direction: 'up' as const,
            label: 'vs mes anterior',
          },
        },
        {
          id: 'tiempo',
          title: 'Tiempo Promedio',
          value: '12 días',
          subtitle: 'Hasta el cierre',
          icon: <CalendarDays className="w-5 h-5" />,
          color: 'info' as const,
        },
      ]
    : [
        {
          id: 'total',
          title: 'Total Ventas',
          value: 45,
          subtitle: 'En pipeline',
          icon: <TrendingUp className="w-5 h-5" />,
          color: 'primary' as const,
        },
        {
          id: 'valor',
          title: 'Valor Total',
          value: '67.500€',
          subtitle: 'Valor potencial',
          icon: <DollarSign className="w-5 h-5" />,
          color: 'success' as const,
        },
        {
          id: 'conversion',
          title: 'Tasa Conversión',
          value: '22%',
          subtitle: 'Promedio mensual',
          icon: <Target className="w-5 h-5" />,
          color: 'warning' as const,
          trend: {
            value: 3.5,
            direction: 'up' as const,
            label: 'vs mes anterior',
          },
        },
        {
          id: 'tiempo',
          title: 'Tiempo Promedio',
          value: '18 días',
          subtitle: 'Hasta el cierre',
          icon: <CalendarDays className="w-5 h-5" />,
          color: 'info' as const,
        },
      ];

  const tabs = [
    {
      id: 'kanban',
      label: 'Pipeline Kanban',
      icon: <Kanban className="w-4 h-4" />,
    },
    {
      id: 'metrics',
      label: 'Métricas',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'automation',
      label: 'Automatización',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Kanban size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    {esEntrenador ? 'Pipeline de Ventas' : 'Pipeline Comercial'}
                  </h1>
                  <p className="text-gray-600">
                    {esEntrenador
                      ? 'Gestiona tu pipeline de ventas personal: contactado → enviado precio → llamada → cerrado. Sigue el progreso de cada lead en tiempo real.'
                      : 'Sistema completo de gestión de pipeline comercial. Gestiona tours, ofertas, matrículas y altas. Visualiza y optimiza tu proceso de ventas.'}
                  </p>
                </div>
              </div>
              
              {/* Botón de acción principal */}
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setShowPhaseConfig(true)}
                >
                  <Settings size={20} className="mr-2" />
                  Configurar Fases
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Métricas */}
          <MetricCards data={metrics} columns={4} />

          {/* Filtros */}
          <PipelineFilters
            businessType={businessType}
            filters={filters}
            onFiltersChange={setFilters}
          />

          {/* Navegación por tabs */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      }`}
                    >
                      {tab.icon && React.cloneElement(tab.icon, {
                        size: 18,
                        className: isActive ? 'opacity-100' : 'opacity-70',
                      })}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="px-4 pb-6 pt-6">
              {activeTab === 'kanban' && (
                <PipelineKanban
                  businessType={businessType}
                  userId={esEntrenador ? user?.id : undefined}
                />
              )}

              {activeTab === 'metrics' && (
                <PipelineMetrics
                  businessType={businessType}
                  userId={esEntrenador ? user?.id : undefined}
                />
              )}

              {activeTab === 'reports' && (
                <PipelineReports businessType={businessType} />
              )}

              {activeTab === 'automation' && (
                <PipelineAutomation businessType={businessType} />
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de configuración de fases */}
      <PhaseConfigurator
        businessType={businessType}
        isOpen={showPhaseConfig}
        onClose={() => setShowPhaseConfig(false)}
      />
    </div>
  );
}

