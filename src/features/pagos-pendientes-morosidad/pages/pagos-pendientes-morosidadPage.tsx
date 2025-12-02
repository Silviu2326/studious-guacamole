import React, { useState } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { FeatureCard } from '../../CampanasAutomatizacion/components/shared/FeatureCard';
import {
  MorosidadList,
  GestorRecordatorios,
  ReportesMorosidad,
  DashboardMorosidad,
  PlanPagos,
  ReporteMensualSimple,
} from '../components';
import {
  LayoutDashboard,
  List,
  Calendar,
  Bell,
  BarChart3,
  DollarSign,
  ArrowLeft,
} from 'lucide-react';

/**
 * Página principal de Pagos Pendientes & Morosidad
 * 
 * Sistema completo de gestión de morosidad y pagos pendientes para entrenadores y gimnasios.
 * Estructura de pestañas:
 * - Dashboard: Vista ejecutiva con métricas clave y reporte mensual integrado
 * - Listado: Lista completa de clientes morosos y pagos pendientes
 * - Planes de Pago: Gestión de planes de pago personalizados
 * - Recordatorios: Sistema de recordatorios escalonados
 * - Reportes: Reportes avanzados y reporte mensual integrado
 */
export const PagosPendientesMorosidadPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'menu' | 'morosidad' | 'recordatorios' | 'reportes'>('menu');
  const [subTab, setSubTab] = useState<string>('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const renderMenu = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* 1. Morosidad Card */}
      <FeatureCard
        title="Morosidad"
        description="Gestión de morosidad, listado de deudores y planes de pago"
        icon={<DollarSign size={24} />}
        color="sky"
        onClick={() => {
          setCurrentView('morosidad');
          setSubTab('dashboard');
        }}
        stats={[
          { label: 'Deudores', value: '24' },
          { label: 'Adeudado', value: '$12.5K' }
        ]}
      />

      {/* 2. Recordatorios Card */}
      <FeatureCard
        title="Recordatorios"
        description="Sistema de recordatorios escalonados y automatizados"
        icon={<Bell size={24} />}
        color="orange"
        onClick={() => setCurrentView('recordatorios')}
        stats={[
          { label: 'Pendientes', value: '8' },
          { label: 'Enviados', value: '156' }
        ]}
      />

      {/* 3. Reportes Card */}
      <FeatureCard
        title="Reportes"
        description="Reportes avanzados y análisis de morosidad"
        icon={<BarChart3 size={24} />}
        color="purple"
        onClick={() => setCurrentView('reportes')}
        stats={[
          { label: 'Disponibles', value: '5' },
          { label: 'Tipos', value: '3' }
        ]}
      />
    </div>
  );

  const renderContent = () => {
    if (currentView === 'morosidad') {
      // Render sub-navigation for Morosidad
      return (
        <>
          <Card className="p-0 bg-white shadow-sm mb-6">
            <div className="px-4 py-3">
              <div className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1 overflow-x-auto scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <button
                  onClick={() => setSubTab('dashboard')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${subTab === 'dashboard'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => setSubTab('listado')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${subTab === 'listado'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                >
                  <List className="w-4 h-4" />
                  <span>Listado</span>
                </button>
                <button
                  onClick={() => setSubTab('planes-pago')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${subTab === 'planes-pago'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Planes de Pago</span>
                </button>
              </div>
            </div>
          </Card>

          <div key={refreshKey}>
            {subTab === 'dashboard' && (
              <div className="space-y-6">
                <DashboardMorosidad onRefresh={handleRefresh} />
                <ReporteMensualSimple onRefresh={handleRefresh} />
              </div>
            )}
            {subTab === 'listado' && (
              <MorosidadList onRefresh={handleRefresh} />
            )}
            {subTab === 'planes-pago' && (
              <PlanPagos onRefresh={handleRefresh} />
            )}
          </div>
        </>
      );
    }

    if (currentView === 'recordatorios') {
      return (
        <div key={refreshKey}>
          <GestorRecordatorios onRefresh={handleRefresh} />
        </div>
      );
    }

    if (currentView === 'reportes') {
      return (
        <div key={refreshKey} className="space-y-6">
          <ReportesMorosidad onRefresh={handleRefresh} />
          <ReporteMensualSimple onRefresh={handleRefresh} />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
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
              {/* Back Button */}
              {currentView !== 'menu' && (
                <Button
                  variant="ghost"
                  onClick={() => setCurrentView('menu')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft size={20} />
                  Volver
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {currentView === 'menu' ? renderMenu() : renderContent()}
      </div>
    </div>
  );
};

export default PagosPendientesMorosidadPage;

