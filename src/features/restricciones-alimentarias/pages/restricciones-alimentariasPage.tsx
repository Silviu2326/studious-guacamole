import { useEffect, useState } from 'react';
import { Card } from '../../componentsreutilizables/Card';
import { Button } from '../../componentsreutilizables/Button';
import { ShieldAlert, ListChecks, Replace, ClipboardList, Bell, FileText, Search, ChevronDown, ChevronUp, X } from 'lucide-react';
import { RestriccionesList } from '../components/RestriccionesList';
import { ConfiguradorRestricciones } from '../components/ConfiguradorRestricciones';
import { ValidacionIngredientes } from '../components/ValidacionIngredientes';
import { AlertasAlergias } from '../components/AlertasAlergias';
import { SustitucionesSeguras } from '../components/SustitucionesSeguras';
import { HistorialAlertas } from '../components/HistorialAlertas';
import { ReportesCompliance } from '../components/ReportesCompliance';
import { NotificacionesSeguridad } from '../components/NotificacionesSeguridad';
import * as restriccionesApi from '../api/restricciones';
import * as alertasApi from '../api/alertas';

export function RestriccionesAlimentariasPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [tabActiva, setTabActiva] = useState('lista');
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);

  useEffect(() => {
    // Carga inicial liviana para validar conectividad
    setLoading(true);
    restriccionesApi
      .getRestricciones()
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const tabItems = [
    { id: 'lista', label: 'Restricciones', icon: ListChecks },
    { id: 'config', label: 'Configuración', icon: ClipboardList },
    { id: 'validacion', label: 'Validación', icon: ShieldAlert },
    { id: 'alertas', label: 'Alertas', icon: Bell },
    { id: 'sustituciones', label: 'Sustituciones', icon: Replace },
    { id: 'historial', label: 'Historial', icon: FileText },
    { id: 'reportes', label: 'Reportes', icon: FileText },
  ];

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'config':
        return <ConfiguradorRestricciones onSaved={() => setError(undefined)} onError={setError} />;
      case 'validacion':
        return <ValidacionIngredientes />;
      case 'alertas':
        return <AlertasAlergias />;
      case 'sustituciones':
        return <SustitucionesSeguras />;
      case 'historial':
        return <HistorialAlertas />;
      case 'reportes':
        return <ReportesCompliance />;
      case 'lista':
      default:
        return <RestriccionesList />;
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
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <ShieldAlert size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Restricciones Alimentarias
                  </h1>
                  <p className="text-gray-600">
                    Gestión y alertas de seguridad sanitaria
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => alertasApi.getAlertas()}>
                  Refrescar alertas
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {error && (
          <Card className="mb-6 bg-white shadow-sm">
            <div className="text-sm text-red-700">{error}</div>
          </Card>
        )}

        {/* Sistema de Tabs */}
        <Card className="p-0 bg-white shadow-sm mb-6">
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
            >
              {tabItems.map((tab) => {
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
                  >
                    <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Contenido de la sección activa */}
        <div className="space-y-6">
          {renderTabContent()}
          {tabActiva === 'lista' && <NotificacionesSeguridad />}
        </div>
      </div>
    </div>
  );
}

export default RestriccionesAlimentariasPage;


