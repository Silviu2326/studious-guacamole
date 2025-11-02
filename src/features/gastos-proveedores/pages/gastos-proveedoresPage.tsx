import React, { useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import {
  GastosManager,
  ProveedoresList,
  CategoriasGastos,
  OrdenesCompra,
  MantenimientoCostos,
  ControlPresupuesto,
  EvaluacionProveedores,
  ReportesGastos,
} from '../components';
import { Receipt, Building2, Tag, ShoppingCart, Wrench, DollarSign, Star, BarChart } from 'lucide-react';

/**
 * Página principal de Gastos & Proveedores
 * 
 * Sistema completo de gestión de gastos y proveedores para gimnasios.
 * Funcionalidades principales:
 * - Gestión de gastos operativos, inversión y mantenimiento
 * - Base de datos de proveedores con evaluación
 * - Control de presupuestos y alertas
 * - Órdenes de compra
 * - Reportes y análisis financiero
 */
export const GastosProveedoresPage: React.FC = () => {
  const [tabActiva, setTabActiva] = useState('gastos');

  const tabs = [
    {
      id: 'gastos',
      label: 'Gastos',
      icon: Receipt,
    },
    {
      id: 'proveedores',
      label: 'Proveedores',
      icon: Building2,
    },
    {
      id: 'categorias',
      label: 'Categorías',
      icon: Tag,
    },
    {
      id: 'ordenes',
      label: 'Órdenes de Compra',
      icon: ShoppingCart,
    },
    {
      id: 'mantenimiento',
      label: 'Mantenimiento',
      icon: Wrench,
    },
    {
      id: 'presupuesto',
      label: 'Presupuesto',
      icon: DollarSign,
    },
    {
      id: 'evaluacion',
      label: 'Evaluación',
      icon: Star,
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: BarChart,
    },
  ];

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'gastos':
        return <GastosManager />;
      case 'proveedores':
        return <ProveedoresList />;
      case 'categorias':
        return <CategoriasGastos />;
      case 'ordenes':
        return <OrdenesCompra />;
      case 'mantenimiento':
        return <MantenimientoCostos />;
      case 'presupuesto':
        return <ControlPresupuesto />;
      case 'evaluacion':
        return <EvaluacionProveedores />;
      case 'reportes':
        return <ReportesGastos />;
      default:
        return <GastosManager />;
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
                <Receipt size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Gastos & Proveedores
                </h1>
                <p className="text-gray-600">
                  Sistema completo de gestión de gastos y proveedores para gimnasios
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Sistema de Tabs */}
        <Card className="p-0 bg-white shadow-sm">
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
            >
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
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
                    <IconComponent size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
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
  );
};

export default GastosProveedoresPage;

