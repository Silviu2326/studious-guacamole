import React, { useState, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card } from '../../../components/componentsreutilizables';
import {
  ObjectivesManager,
  PerformanceDashboard,
  MetricsChart,
  GoalTracker,
  ReportsGenerator,
  AlertsManager,
  ComparisonTool,
  KPIConfigurator,
} from '../components';
import { Target, BarChart3, TrendingUp, FileText, AlertTriangle, GitCompare, Settings } from 'lucide-react';

/**
 * Página principal de Objetivos y Rendimiento
 * 
 * Adaptada según el rol del usuario:
 * - Entrenadores: Enfocados en facturación personal, adherencia de clientes y retención
 * - Gimnasios: Enfocados en objetivos comerciales globales, ocupación y tasa de bajas
 */
export default function ObjetivosRendimientoPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const esGimnasio = user?.role === 'gimnasio';
  const role = esEntrenador ? 'entrenador' : 'gimnasio';

  const [tabActiva, setTabActiva] = useState<string>('dashboard');

  const tabs = useMemo(() => {
    const comunes = [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'objetivos', label: 'Objetivos', icon: Target },
      { id: 'metricas', label: 'Métricas', icon: TrendingUp },
      { id: 'seguimiento', label: 'Seguimiento', icon: Target },
      { id: 'reportes', label: 'Reportes', icon: FileText },
      { id: 'alertas', label: 'Alertas', icon: AlertTriangle },
      { id: 'comparacion', label: 'Comparación', icon: GitCompare },
      { id: 'configuracion', label: 'KPIs', icon: Settings },
    ];
    return comunes;
  }, []);

  const renderContent = () => {
    switch (tabActiva) {
      case 'dashboard':
        return <PerformanceDashboard role={role} />;
      case 'objetivos':
        return <ObjectivesManager role={role} />;
      case 'metricas':
        return <MetricsChart role={role} />;
      case 'seguimiento':
        return <GoalTracker role={role} />;
      case 'reportes':
        return <ReportsGenerator role={role} />;
      case 'alertas':
        return <AlertsManager role={role} />;
      case 'comparacion':
        return <ComparisonTool role={role} />;
      case 'configuracion':
        return <KPIConfigurator role={role} />;
      default:
        return <PerformanceDashboard role={role} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header según guía de estilos */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Target size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Objetivos y Rendimiento
                </h1>
                <p className="text-gray-600">
                  {esEntrenador
                    ? 'Establece y monitorea tus objetivos de facturación personal, adherencia de clientes y retención. Visualiza tu rendimiento en tiempo real y toma decisiones basadas en datos.'
                    : 'Gestiona los objetivos comerciales del centro, monitorea la ocupación media y controla la tasa de bajas. Dashboard ejecutivo para tomar decisiones estratégicas.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Sistema de Tabs según guía */}
        <Card className="p-0 bg-white shadow-sm mb-6">
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
                    role="tab"
                    aria-selected={isActive}
                  >
                    <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Contenido según tab activa */}
        <div className="space-y-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

