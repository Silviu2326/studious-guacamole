import React, { useState } from 'react';
import { Card, Tabs } from '../../../components/componentsreutilizables';
import {
  DashboardVentas,
  ReportesRetail,
  AnalisisVentas,
  MetricasRetail,
  RentabilidadProductos
} from '../components';
import { LayoutDashboard, FileText, BarChart3, TrendingUp, DollarSign } from 'lucide-react';

/**
 * Página principal de Informe de Ventas Retail
 * 
 * Sistema completo de reportes de ventas retail para gimnasios con tienda física.
 * Funcionalidades principales:
 * - Dashboard ejecutivo de ventas
 * - Reportes detallados de ventas
 * - Análisis de ventas y tendencias
 * - Métricas de retail
 * - Análisis de rentabilidad por producto
 * 
 * NOTA: Este módulo es exclusivo para gimnasios con tienda física.
 * NO aplica para entrenadores personales sin tienda.
 */
export const InformeDeVentasRetailPage: React.FC = () => {
  const [tabActiva, setTabActiva] = useState('dashboard');

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: <FileText size={18} />
    },
    {
      id: 'analisis',
      label: 'Análisis',
      icon: <BarChart3 size={18} />
    },
    {
      id: 'metricas',
      label: 'Métricas',
      icon: <TrendingUp size={18} />
    },
    {
      id: 'rentabilidad',
      label: 'Rentabilidad',
      icon: <DollarSign size={18} />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <BarChart3 size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Informe de Ventas Retail
                </h1>
                <p className="text-gray-600">
                  Sistema completo de reportes y análisis de ventas retail para gimnasios con tienda física
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Sistema de Tabs */}
        <Card className="p-0 bg-white shadow-sm mb-6">
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTabActiva(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    tabActiva === tab.id
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <span className={tabActiva === tab.id ? 'opacity-100' : 'opacity-70'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Contenido de la sección activa */}
        <div className="mt-6">
          {tabActiva === 'dashboard' && <DashboardVentas />}
          {tabActiva === 'reportes' && <ReportesRetail />}
          {tabActiva === 'analisis' && <AnalisisVentas />}
          {tabActiva === 'metricas' && <MetricasRetail />}
          {tabActiva === 'rentabilidad' && <RentabilidadProductos />}
        </div>
      </div>
    </div>
  );
};

export default InformeDeVentasRetailPage;

