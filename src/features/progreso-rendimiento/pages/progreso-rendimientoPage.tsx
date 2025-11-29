import React, { useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import {
  ProgresoCliente,
  GraficosEvolucion,
  MetricasFuerza,
  AnalizadorTendencias,
  HistorialRendimiento,
  FotosComparativas,
  AlertasEstancamiento,
  OptimizadorProgreso,
} from '../components';
import {
  TrendingUp,
  BarChart3,
  Dumbbell,
  Activity,
  History,
  Camera,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

type TabId =
  | 'progreso'
  | 'graficos'
  | 'metricas'
  | 'tendencias'
  | 'historial'
  | 'fotos'
  | 'alertas'
  | 'optimizador';

interface TabItem {
  id: TabId;
  label: string;
  icon: React.FC<{ size?: number; className?: string }>;
}

export default function ProgresoRendimientoPage() {
  const [tabActiva, setTabActiva] = useState<TabId>('progreso');

  const tabItems: TabItem[] = [
    { id: 'progreso', label: 'Progreso Cliente', icon: TrendingUp },
    { id: 'graficos', label: 'Gráficos', icon: BarChart3 },
    { id: 'metricas', label: 'Métricas Fuerza', icon: Dumbbell },
    { id: 'tendencias', label: 'Análisis Tendencias', icon: Activity },
    { id: 'historial', label: 'Historial', icon: History },
    { id: 'fotos', label: 'Fotos Comparativas', icon: Camera },
    { id: 'alertas', label: 'Alertas', icon: AlertCircle },
    { id: 'optimizador', label: 'Optimizador', icon: Sparkles },
  ];

  const renderContent = () => {
    switch (tabActiva) {
      case 'progreso':
        return <ProgresoCliente />;
      case 'graficos':
        return <GraficosEvolucion />;
      case 'metricas':
        return <MetricasFuerza />;
      case 'tendencias':
        return <AnalizadorTendencias />;
      case 'historial':
        return <HistorialRendimiento />;
      case 'fotos':
        return <FotosComparativas />;
      case 'alertas':
        return <AlertasEstancamiento />;
      case 'optimizador':
        return <OptimizadorProgreso />;
      default:
        return <ProgresoCliente />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <TrendingUp size={24} className="text-blue-600" />
              </div>

              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Progreso y Rendimiento
                </h1>
                <p className="text-gray-600">
                  Monitorea el progreso de tus clientes, analiza tendencias, visualiza métricas de fuerza y optimiza el rendimiento con análisis avanzados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Sistema de Tabs */}
        <Card className="p-0 bg-white shadow-sm">
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1 overflow-x-auto"
            >
              {tabItems.map(({ id, label, icon: Icon }) => {
                const activo = tabActiva === id;
                return (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={activo}
                    onClick={() => setTabActiva(id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      activo
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Icon
                      size={18}
                      className={activo ? 'opacity-100' : 'opacity-70'}
                    />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Contenido de la pestaña activa */}
        <div className="mt-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

