import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { FacturacionManager, PlantillasFactura } from '../components';
import { FileText, Palette, Receipt } from 'lucide-react';

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
  const [tabActiva, setTabActiva] = React.useState('facturacion');

  const renderContent = () => {
    switch (tabActiva) {
      case 'facturacion':
        return <FacturacionManager />;
      case 'plantillas':
        return <PlantillasFactura />;
      default:
        return <FacturacionManager />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
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
              aria-label="Secciones facturación"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
            >
              <button
                role="tab"
                aria-selected={tabActiva === 'facturacion'}
                onClick={() => setTabActiva('facturacion')}
                className={[
                  'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                  tabActiva === 'facturacion'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                ].join(' ')}
              >
                <FileText
                  size={18}
                  className={tabActiva === 'facturacion' ? 'opacity-100' : 'opacity-70'}
                />
                <span>Facturación</span>
              </button>
              <button
                role="tab"
                aria-selected={tabActiva === 'plantillas'}
                onClick={() => setTabActiva('plantillas')}
                className={[
                  'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                  tabActiva === 'plantillas'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                ].join(' ')}
              >
                <Palette
                  size={18}
                  className={tabActiva === 'plantillas' ? 'opacity-100' : 'opacity-70'}
                />
                <span>Plantillas</span>
              </button>
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
};

export default FacturacinCobrosPage;

