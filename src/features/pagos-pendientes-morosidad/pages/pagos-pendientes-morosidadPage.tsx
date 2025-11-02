import React, { useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import {
  MorosidadList,
  AlertasVencidos,
  GestorRecordatorios,
  SeguimientoPagos,
  ReportesMorosidad,
  ClasificadorRiesgo,
  EstrategiasCobro,
  DashboardMorosidad
} from '../components';
import {
  LayoutDashboard,
  AlertTriangle,
  Bell,
  TrendingUp,
  BarChart3,
  Shield,
  Target,
  DollarSign
} from 'lucide-react';

/**
 * Página principal de Pagos Pendientes & Morosidad
 * 
 * Sistema completo de gestión de morosidad y pagos pendientes para entrenadores y gimnasios.
 * Funcionalidades principales:
 * - Lista de morosidad: "Quién me debe dinero ahora mismo"
 * - Seguimiento de pagos vencidos
 * - Alertas de morosidad automáticas
 * - Gestión de recordatorios escalonados
 * - Clasificación de riesgo
 * - Estrategias de cobro diferenciadas
 * - Reportes de morosidad
 */
export const PagosPendientesMorosidadPage: React.FC = () => {
  const [tabActiva, setTabActiva] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'lista',
      label: 'Lista de Morosidad',
      icon: DollarSign
    },
    {
      id: 'alertas',
      label: 'Alertas',
      icon: AlertTriangle
    },
    {
      id: 'recordatorios',
      label: 'Recordatorios',
      icon: Bell
    },
    {
      id: 'seguimiento',
      label: 'Seguimiento',
      icon: TrendingUp
    },
    {
      id: 'riesgo',
      label: 'Clasificación Riesgo',
      icon: Shield
    },
    {
      id: 'estrategias',
      label: 'Estrategias',
      icon: Target
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: BarChart3
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <DollarSign size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Pagos Pendientes & Morosidad
                </h1>
                <p className="text-gray-600">
                  Sistema completo de gestión de morosidad y pagos pendientes. 
                  Identifique quién debe dinero, gestione recordatorios, clasifique riesgos y ejecute estrategias de cobro diferenciadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <Card className="p-0 bg-white shadow-sm">
          {/* Tablist */}
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones morosidad"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
            >
              {tabs.map(({ id, label, icon: Icon }) => {
                const activo = tabActiva === id;
                return (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={activo}
                    onClick={() => setTabActiva(id)}
                    className={[
                      'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                      activo
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    ].join(' ')}
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
        <div className="mt-6" key={refreshKey}>
          {tabActiva === 'dashboard' && <DashboardMorosidad onRefresh={handleRefresh} />}
          {tabActiva === 'lista' && <MorosidadList onRefresh={handleRefresh} />}
          {tabActiva === 'alertas' && <AlertasVencidos onRefresh={handleRefresh} />}
          {tabActiva === 'recordatorios' && <GestorRecordatorios onRefresh={handleRefresh} />}
          {tabActiva === 'seguimiento' && <SeguimientoPagos onRefresh={handleRefresh} />}
          {tabActiva === 'riesgo' && <ClasificadorRiesgo onRefresh={handleRefresh} />}
          {tabActiva === 'estrategias' && <EstrategiasCobro onRefresh={handleRefresh} />}
          {tabActiva === 'reportes' && <ReportesMorosidad onRefresh={handleRefresh} />}
        </div>
      </div>
    </div>
  );
};

export default PagosPendientesMorosidadPage;

