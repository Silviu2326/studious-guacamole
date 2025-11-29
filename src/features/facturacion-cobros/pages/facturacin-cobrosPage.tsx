import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card } from '../../../components/componentsreutilizables';
import {
  FacturacionManager,
  PlantillasFactura,
  DashboardWidget,
} from '../components';
import { RolFacturacion } from '../types';
import { FileText, LayoutTemplate } from 'lucide-react';

/**
 * Página principal de Facturación y Cobros
 * 
 * Esta página orquesta los componentes principales del módulo de facturación
 * mediante un sistema de pestañas:
 * 
 * - Tab "Facturación": Muestra el gestor principal de facturas (FacturacionManager)
 *   y opcionalmente un widget de resumen (DashboardWidget) en la parte superior.
 *   Permite gestionar facturas, filtros, pagos y acciones rápidas.
 * 
 * - Tab "Plantillas": Muestra el componente de gestión de plantillas (PlantillasFactura).
 *   Permite crear, editar y configurar plantillas de factura que se usan al crear nuevas facturas.
 * 
 * El módulo se adapta al rol del usuario (entrenador/gimnasio) para mostrar
 * filtros y vistas personalizadas según el contexto.
 */
export default function FacturacionCobrosPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const role: RolFacturacion = esEntrenador ? 'entrenador' : 'gimnasio';

  // Estado del tab activo (por defecto "Facturación")
  const [tabActiva, setTabActiva] = useState<string>('facturacion');

  // Estado de error global (para manejar errores a nivel de página)
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);

  /**
   * Maneja errores provenientes de los componentes hijos
   */
  const handleError = (errorMessage: string) => {
    setErrorGlobal(errorMessage);
    // El error se puede limpiar automáticamente después de un tiempo
    setTimeout(() => setErrorGlobal(null), 5000);
  };

  /**
   * Renderiza el contenido del tab activo
   */
  const renderTabContent = () => {
    switch (tabActiva) {
      case 'facturacion':
        return (
          <div className="space-y-6">
            {/* Widget de resumen opcional - muestra métricas clave de facturación */}
            <DashboardWidget onError={handleError} />
            
            {/* Gestor principal de facturas - listado, filtros y acciones */}
            <FacturacionManager role={role} onError={handleError} />
          </div>
        );
      
      case 'plantillas':
        return (
          <div className="space-y-6">
            {/* Gestor de plantillas - crear, editar y configurar plantillas de factura */}
            <PlantillasFactura />
          </div>
        );
      
      default:
        return null;
    }
  };

  // Configuración de las pestañas
  const tabs = [
    {
      id: 'facturacion',
      label: 'Facturación',
      icon: FileText,
      description: 'Gestiona facturas, pagos y cobros',
    },
    {
      id: 'plantillas',
      label: 'Plantillas',
      icon: LayoutTemplate,
      description: 'Configura plantillas de factura',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de la página */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Facturación y Cobros
              </h1>
              <p className="text-gray-600 mt-1">
                Gestiona tus facturas, cobros y plantillas de facturación
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Mensaje de error global */}
        {errorGlobal && (
          <Card className="mb-6 p-4 bg-red-50 border-red-200">
            <div className="flex items-center gap-2 text-red-800">
              <span className="text-sm font-medium">{errorGlobal}</span>
            </div>
          </Card>
        )}

        {/* Sistema de Tabs */}
        <Card className="p-0 bg-white shadow-sm">
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones de facturación"
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
                    title={tab.description}
                  >
                    <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Contenido de la pestaña activa */}
          <div className="px-6 py-6">
            {renderTabContent()}
          </div>
        </Card>
      </div>
    </div>
  );
}

