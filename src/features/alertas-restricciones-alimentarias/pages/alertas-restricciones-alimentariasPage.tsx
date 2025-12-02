import React, { useState, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
import { ShieldAlert, AlertTriangle, Search, History, RefreshCw, FileText, Bell, Settings } from 'lucide-react';
import {
  RestriccionesList,
  AlertasAlergias,
  ConfiguradorRestricciones,
  ValidacionIngredientes,
  HistorialAlertas,
  SustitucionesSeguras,
  ReportesCompliance,
  NotificacionesSeguridad,
} from '../components';

interface TabItem {
  id: string;
  label: string;
  icon: React.FC<{ size?: number; className?: string }>;
}

export default function AlertasRestriccionesAlimentariasPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const [tabActiva, setTabActiva] = useState<string>('restricciones');

  // Configuración de pestañas - igual para entrenadores y gimnasio
  const tabs: TabItem[] = useMemo(
    () => [
      {
        id: 'restricciones',
        label: 'Restricciones',
        icon: ShieldAlert,
      },
      {
        id: 'alertas',
        label: 'Alertas',
        icon: AlertTriangle,
      },
      {
        id: 'validacion',
        label: 'Validación',
        icon: Search,
      },
      {
        id: 'sustituciones',
        label: 'Sustituciones',
        icon: RefreshCw,
      },
      {
        id: 'historial',
        label: 'Historial',
        icon: History,
      },
      {
        id: 'configurador',
        label: 'Configurador',
        icon: Settings,
      },
      {
        id: 'compliance',
        label: 'Compliance',
        icon: FileText,
      },
      {
        id: 'notificaciones',
        label: 'Notificaciones',
        icon: Bell,
      },
    ],
    []
  );

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'restricciones':
        return <RestriccionesList />;
      case 'alertas':
        return <AlertasAlergias />;
      case 'validacion':
        return <ValidacionIngredientes />;
      case 'sustituciones':
        return <SustitucionesSeguras />;
      case 'historial':
        return <HistorialAlertas />;
      case 'configurador':
        return <ConfiguradorRestricciones />;
      case 'compliance':
        return <ReportesCompliance />;
      case 'notificaciones':
        return <NotificacionesSeguridad />;
      default:
        return <RestriccionesList />;
    }
  };

  // Métricas simuladas - usando el formato de la guía (info, success, warning, danger)
  const metricas = [
    {
      id: 'total-restricciones',
      title: 'Total Restricciones',
      value: '0',
      color: 'info' as const,
    },
    {
      id: 'alertas-activas',
      title: 'Alertas Activas',
      value: '0',
      color: 'danger' as const,
    },
    {
      id: 'cumplimiento',
      title: 'Cumplimiento',
      value: '100%',
      color: 'success' as const,
    },
    {
      id: 'clientes-afectados',
      title: 'Clientes Afectados',
      value: '0',
      color: 'warning' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <ShieldAlert size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Alertas y Restricciones Alimentarias
                </h1>
                <p className="text-gray-600">
                  Sistema completo de gestión de restricciones alimentarias y alertas de seguridad sanitaria
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Sistema de Tabs */}
        <Card className="p-0 bg-white shadow-sm">
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones"
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
        <div className="mt-6 space-y-6">
          {/* Métricas principales */}
          <MetricCards data={metricas} />

          {/* Contenido de la sección activa */}
          {renderTabContent()}
        </div>

        {/* Información de compliance */}
        <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 mt-6">
          <div className="flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 text-lg">
                Cumplimiento Normativo y Seguridad
              </h4>
              <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <p>• <strong>Obligatorio:</strong> Este módulo es requerido por normativas sanitarias para centros que ofrecen servicios nutricionales</p>
                <p>• <strong>Protección Legal:</strong> Registra todas las restricciones y acciones tomadas para auditorías</p>
                <p>• <strong>Seguridad del Cliente:</strong> Previene reacciones adversas mediante validación automática</p>
                <p>• <strong>Monitoreo Continuo:</strong> Sistema de alertas en tiempo real para máxima seguridad</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

