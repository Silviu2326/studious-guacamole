import React, { useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import {
  LayoutDashboard,
  DollarSign,
  TrendingUp,
  Receipt,
  AlertTriangle,
  BarChart3,
  Target,
  TrendingUp as TrendingUpIcon,
  FileText
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import {
  PanelFinanciero,
  MetricasIngresos,
  GastosEstructurales,
  GastosProfesionales,
  RendimientoMensual,
  AlertasPagos,
  AnalisisRentabilidad,
  ProyeccionesFinancieras,
  ReportesPersonalizados,
  Transacciones
} from '../components';

/**
 * Página principal del Panel Financiero / Overview
 * 
 * Sistema completo de overview financiero para entrenadores y gimnasios con métricas diferenciadas.
 * 
 * Para Entrenadores:
 * - Ingresos personales (sesiones 1 a 1, paquetes, consultas online)
 * - Clientes con pagos pendientes
 * - Rendimiento mensual individual
 * 
 * Para Gimnasios:
 * - Facturación total del centro
 * - Reparto por líneas (cuotas, PT, tienda, servicios)
 * - Costes estructurales
 * - Análisis de rentabilidad
 */
export default function PanelFinancieroOverviewPage() {
  const { user } = useAuth();
  const [tabActiva, setTabActiva] = useState('overview');
  const isEntrenador = user?.role === 'entrenador';

  // Tabs comunes para ambos roles
  const tabsComunes = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard
    },
    {
      id: 'ingresos',
      label: isEntrenador ? 'Mis Ingresos' : 'Facturación',
      icon: DollarSign
    },
    {
      id: 'transacciones',
      label: 'Transacciones',
      icon: Receipt
    },
    {
      id: 'rendimiento',
      label: 'Rendimiento',
      icon: TrendingUpIcon
    },
    {
      id: 'alertas',
      label: 'Alertas de Pagos',
      icon: AlertTriangle
    },
    {
      id: 'proyecciones',
      label: 'Proyecciones',
      icon: BarChart3
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: FileText
    }
  ];

  // Tabs adicionales para entrenadores
  const tabsEntrenador = [
    {
      id: 'gastos-profesionales',
      label: 'Gastos Profesionales',
      icon: Receipt
    }
  ];

  // Tabs adicionales para gimnasios
  const tabsGimnasio = [
    {
      id: 'gastos',
      label: 'Costes Estructurales',
      icon: Receipt
    },
    {
      id: 'rentabilidad',
      label: 'Rentabilidad',
      icon: Target
    }
  ];

  const tabs = isEntrenador 
    ? [...tabsComunes.slice(0, 2), ...tabsEntrenador, ...tabsComunes.slice(2)]
    : [...tabsComunes.slice(0, 2), ...tabsGimnasio, ...tabsComunes.slice(2)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <DollarSign size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  {isEntrenador ? 'Panel Financiero' : 'Overview Financiero'}
                </h1>
                <p className="text-gray-600">
                  {isEntrenador 
                    ? 'Visión completa de tus ingresos personales, clientes pendientes y rendimiento mensual. Controla tu economía y gestiona tus cobros de manera eficiente.'
                    : 'Visión completa de la facturación del centro, reparto por líneas, costes estructurales y análisis de rentabilidad. Toma decisiones informadas sobre la salud financiera de tu negocio.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <Card className="p-0 bg-white shadow-sm">
          {/* Tablist claro */}
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
            >
              {tabs.map((tab) => {
                const activo = tabActiva === tab.id;
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activo}
                    onClick={() => setTabActiva(tab.id)}
                    className={[
                      'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                      activo
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    ].join(' ')}
                  >
                    <IconComponent
                      size={18}
                      className={activo ? 'opacity-100' : 'opacity-70'}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Contenido de la pestaña activa */}
        <div className="mt-6">
          {tabActiva === 'overview' && <PanelFinanciero />}
          {tabActiva === 'ingresos' && <MetricasIngresos />}
          {tabActiva === 'transacciones' && <Transacciones />}
          {tabActiva === 'gastos' && <GastosEstructurales />}
          {tabActiva === 'gastos-profesionales' && <GastosProfesionales />}
          {tabActiva === 'rendimiento' && <RendimientoMensual />}
          {tabActiva === 'alertas' && <AlertasPagos />}
          {tabActiva === 'rentabilidad' && <AnalisisRentabilidad />}
          {tabActiva === 'proyecciones' && <ProyeccionesFinancieras />}
          {tabActiva === 'reportes' && <ReportesPersonalizados />}
        </div>
      </div>
    </div>
  );
}

