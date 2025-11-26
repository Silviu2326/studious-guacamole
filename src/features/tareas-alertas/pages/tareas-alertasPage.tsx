import React, { useState, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card } from '../../../components/componentsreutilizables';
import {
  TasksManager,
  AlertsPanel,
  PriorityQueue,
  NotificationCenter,
  TaskHistory,
  AlertRules,
} from '../components';
import {
  CheckSquare,
  Bell,
  History,
  Settings,
  ListChecks,
} from 'lucide-react';

/**
 * Página principal de Tareas y Alertas
 * 
 * Adaptada según el rol del usuario:
 * - Entrenadores: Tareas personales (clientes sin check-in, leads sin seguimiento, pagos pendientes)
 * - Gimnasios: Tareas del centro (facturas vencidas, equipos rotos, aforo superado, mantenimiento)
 */
export default function TareasAlertasPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const role = esEntrenador ? 'entrenador' : 'gimnasio';

  const [tabActiva, setTabActiva] = useState<string>('tareas');

  const tabs = useMemo(() => {
    return [
      {
        id: 'tareas',
        label: 'Tareas',
        icon: CheckSquare,
      },
      {
        id: 'alertas',
        label: 'Alertas',
        icon: Bell,
      },
      {
        id: 'prioridades',
        label: 'Prioridades',
        icon: ListChecks,
      },
      {
        id: 'notificaciones',
        label: 'Notificaciones',
        icon: Bell,
      },
      {
        id: 'historial',
        label: 'Historial',
        icon: History,
      },
      {
        id: 'configuracion',
        label: 'Configuración',
        icon: Settings,
      },
    ];
  }, []);

  const renderContent = () => {
    switch (tabActiva) {
      case 'tareas':
        return <TasksManager role={role} />;
      case 'alertas':
        return (
          <div className="space-y-6">
            <AlertsPanel role={role} maxVisible={20} />
          </div>
        );
      case 'prioridades':
        return <PriorityQueue role={role} />;
      case 'notificaciones':
        return <NotificationCenter role={role} />;
      case 'historial':
        return <TaskHistory role={role} />;
      case 'configuracion':
        return <AlertRules role={role} />;
      default:
        return <TasksManager role={role} />;
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
                <CheckSquare size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  {esEntrenador ? 'Tareas y Alertas' : 'Tareas y Alertas del Centro'}
                </h1>
                <p className="text-gray-600">
                  {esEntrenador
                    ? 'Gestiona tus tareas personales y recibe alertas sobre clientes, leads y pagos pendientes'
                    : 'Gestiona tareas del centro, alertas operativas y asigna tareas al staff'}
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
        <div className="mt-6 space-y-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

