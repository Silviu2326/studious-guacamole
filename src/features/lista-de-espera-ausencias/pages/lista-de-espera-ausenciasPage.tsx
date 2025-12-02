import React, { useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import {
  ListaEspera,
  GestorAusencias,
  NotificacionesAutomaticas,
  LiberacionPlazas,
  ControlAforo,
  PrioridadesLista,
  TiempoRespuesta,
  AnalyticsAusencias,
} from '../components';
import { Users, UserX, Bell, RefreshCw, Users as UsersIcon, Star, Clock, BarChart } from 'lucide-react';

type TabId = 'lista-espera' | 'ausencias' | 'notificaciones' | 'liberacion' | 'aforo' | 'prioridades' | 'tiempo-respuesta' | 'analytics';

interface TabItem {
  id: TabId;
  label: string;
  icon: React.FC<{ size?: number; className?: string }>;
}

/**
 * Página principal de Lista de Espera y Ausencias
 * 
 * Sistema completo de gestión de lista de espera y ausencias para clases grupales con aforo limitado.
 * Funcionalidades principales:
 * - Lista de espera automática cuando las clases se llenan
 * - Gestión de ausencias y no-show
 * - Notificaciones automáticas
 * - Liberación automática de plazas
 * - Control de aforo
 * - Analytics de ocupación y ausencias
 */
export const ListaEsperaAusenciasPage: React.FC = () => {
  const [tabActiva, setTabActiva] = useState<TabId>('lista-espera');

  const tabs: TabItem[] = [
    { id: 'lista-espera', label: 'Lista de Espera', icon: Users },
    { id: 'ausencias', label: 'Gestión de Ausencias', icon: UserX },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
    { id: 'liberacion', label: 'Liberación de Plazas', icon: RefreshCw },
    { id: 'aforo', label: 'Control de Aforo', icon: UsersIcon },
    { id: 'prioridades', label: 'Prioridades', icon: Star },
    { id: 'tiempo-respuesta', label: 'Tiempo de Respuesta', icon: Clock },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
  ];

  const renderContent = () => {
    switch (tabActiva) {
      case 'lista-espera':
        return <ListaEspera />;
      case 'ausencias':
        return <GestorAusencias />;
      case 'notificaciones':
        return <NotificacionesAutomaticas />;
      case 'liberacion':
        return <LiberacionPlazas />;
      case 'aforo':
        return <ControlAforo />;
      case 'prioridades':
        return <PrioridadesLista />;
      case 'tiempo-respuesta':
        return <TiempoRespuesta />;
      case 'analytics':
        return <AnalyticsAusencias />;
      default:
        return <ListaEspera />;
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
                <Users size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Lista de Espera & Ausencias
                </h1>
                <p className="text-gray-600">
                  Sistema completo de gestión de lista de espera y ausencias para clases grupales con aforo limitado
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
              aria-label="Secciones lista de espera"
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
        <div className="mt-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ListaEsperaAusenciasPage;

