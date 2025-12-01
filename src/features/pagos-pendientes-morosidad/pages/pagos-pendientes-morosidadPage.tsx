import React, { useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
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
  // Estado de la pestaña activa
  const [tabActiva, setTabActiva] = useState('dashboard');
  // Key para forzar refresco de componentes
  const [refreshKey, setRefreshKey] = useState(0);
  // Estado de carga inicial (si hay datos globales que cargar)
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  /**
   * Tabs principales del módulo de morosidad
   * Estructura simplificada a 5 pestañas principales según especificación
   */
  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'listado',
      label: 'Listado',
      icon: List
    },
    {
      id: 'planes-pago',
      label: 'Planes de Pago',
      icon: Calendar
    },
    {
      id: 'recordatorios',
      label: 'Recordatorios',
      icon: Bell
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
          {/* Tablist - Responsive: scroll horizontal en móvil, normal en desktop */}
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones de morosidad"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1 overflow-x-auto scrollbar-hide"
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
                      'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap flex-shrink-0',
                      activo
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    ].join(' ')}
                  >
                    <Icon
                      size={18}
                      className={activo ? 'opacity-100' : 'opacity-70'}
                    />
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sm:hidden">{label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Contenido de la pestaña activa */}
        <div className="mt-6" key={refreshKey}>
          {/* Tab Dashboard: Dashboard principal + ReporteMensualSimple opcional */}
          {tabActiva === 'dashboard' && (
            <div className="space-y-6">
              <DashboardMorosidad onRefresh={handleRefresh} />
              <ReporteMensualSimple onRefresh={handleRefresh} />
            </div>
          )}

          {/* Tab Listado: Lista completa de morosidad */}
          {tabActiva === 'listado' && (
            <MorosidadList onRefresh={handleRefresh} />
          )}

          {/* Tab Planes de Pago: Gestión de planes de pago */}
          {tabActiva === 'planes-pago' && (
            <PlanPagos onRefresh={handleRefresh} />
          )}

          {/* Tab Recordatorios: Gestor de recordatorios escalonados */}
          {tabActiva === 'recordatorios' && (
            <GestorRecordatorios onRefresh={handleRefresh} />
          )}

          {/* Tab Reportes: Reportes avanzados + ReporteMensualSimple opcional */}
          {tabActiva === 'reportes' && (
            <div className="space-y-6">
              <ReportesMorosidad onRefresh={handleRefresh} />
              <ReporteMensualSimple onRefresh={handleRefresh} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PagosPendientesMorosidadPage;

