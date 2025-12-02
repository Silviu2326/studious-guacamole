import React from 'react';
import { Button } from '../../../components/componentsreutilizables';
import { FeatureCard } from '../../CampanasAutomatizacion/components/shared/FeatureCard';
import { FacturacionManager, PlantillasFactura } from '../components';
import {
  FileText,
  Palette,
  Receipt,
  Bell,
  TrendingUp,
  Repeat,
  BarChart3,
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react';

/**
 * Página principal de Facturación & Cobros
 * 
 * Sistema universal de facturación y gestión de cobros para entrenadores y gimnasios.
 * Funcionalidades principales:
 * - Creación de facturas
 * - Gestión de cobros
 * - Recordatorios automáticos
 * - Exportación PDF
 * - Plantillas personalizables
 * - Seguimiento de estados
 * - Reportes financieros
 */
export const FacturacinCobrosPage: React.FC = () => {
  const [currentView, setCurrentView] = React.useState<'menu' | 'facturacion' | 'dashboard' | 'suscripciones' | 'recordatorios' | 'seguimiento' | 'reportes' | 'plantillas'>('menu');
  const [subTab, setSubTab] = React.useState<string>('calendario');

  const renderMenu = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* 1. Facturación Card */}
      <FeatureCard
        title="Facturación"
        description="Gestión completa de facturas, cobros y calendario de ingresos"
        icon={<FileText size={24} />}
        color="sky"
        onClick={() => {
          setCurrentView('facturacion');
          setSubTab('calendario');
        }}
        stats={[
          { label: 'Gestión', value: '5' },
          { label: 'Secciones', value: '5' }
        ]}
      />

      {/* 2. Dashboard Card */}
      <FeatureCard
        title="Dashboard"
        description="Vista general de métricas y estadísticas de facturación"
        icon={<LayoutDashboard size={24} />}
        color="purple"
        onClick={() => setCurrentView('dashboard')}
        stats={[
          { label: 'Métricas', value: '4' },
          { label: 'Widgets', value: '3' }
        ]}
      />

      {/* 3. Suscripciones Card */}
      <FeatureCard
        title="Suscripciones"
        description="Gestión de cobros recurrentes y suscripciones"
        icon={<Repeat size={24} />}
        color="emerald"
        onClick={() => setCurrentView('suscripciones')}
        stats={[
          { label: 'Activas', value: '12' },
          { label: 'Total', value: '15' }
        ]}
      />

      {/* 4. Recordatorios Card */}
      <FeatureCard
        title="Recordatorios"
        description="Recordatorios automáticos de pago a clientes"
        icon={<Bell size={24} />}
        color="orange"
        onClick={() => setCurrentView('recordatorios')}
        stats={[
          { label: 'Pendientes', value: '8' },
          { label: 'Enviados', value: '24' }
        ]}
      />

      {/* 5. Seguimiento Card */}
      <FeatureCard
        title="Seguimiento"
        description="Seguimiento de estados y cambios en facturas"
        icon={<TrendingUp size={24} />}
        color="indigo"
        onClick={() => setCurrentView('seguimiento')}
        stats={[
          { label: 'En proceso', value: '6' },
          { label: 'Total', value: '45' }
        ]}
      />

      {/* 6. Reportes Card */}
      <FeatureCard
        title="Reportes"
        description="Reportes financieros y análisis de facturación"
        icon={<BarChart3 size={24} />}
        color="rose"
        onClick={() => setCurrentView('reportes')}
        stats={[
          { label: 'Disponibles', value: '5' },
          { label: 'Tipos', value: '3' }
        ]}
      />

      {/* 7. Plantillas Card */}
      <FeatureCard
        title="Plantillas"
        description="Plantillas personalizables para facturas"
        icon={<Palette size={24} />}
        color="orange"
        onClick={() => setCurrentView('plantillas')}
        stats={[
          { label: 'Activas', value: '3' },
          { label: 'Total', value: '8' }
        ]}
      />
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'facturacion':
        return <FacturacionManager initialTab={subTab} onTabChange={setSubTab} />;
      case 'dashboard':
        return <FacturacionManager initialTab="dashboard" />;
      case 'suscripciones':
        return <FacturacionManager initialTab="suscripciones" />;
      case 'recordatorios':
        return <FacturacionManager initialTab="recordatorios" />;
      case 'seguimiento':
        return <FacturacionManager initialTab="seguimiento" />;
      case 'reportes':
        return <FacturacionManager initialTab="reportes" />;
      case 'plantillas':
        return <PlantillasFactura />;
      default:
        return null;
    }
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
                  <Receipt size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Facturación & Cobros
                  </h1>
                  <p className="text-gray-600">
                    Sistema completo de facturación y gestión de cobros para entrenadores y gimnasios
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

export default FacturacinCobrosPage;

