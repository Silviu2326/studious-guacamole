import React, { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, Button } from '../../components/componentsreutilizables';
import { AgendaCalendar } from './components/AgendaCalendar';
import { VistaPersonal } from './components/VistaPersonal';
import { VistaCentro } from './components/VistaCentro';
import { GestorHorarios } from './components/GestorHorarios';
import { BloqueosAgenda } from './components/BloqueosAgenda';
import { ReservasCitas } from './components/ReservasCitas';
import { RecordatoriosAutomaticos } from './components/RecordatoriosAutomaticos';
import { AnalyticsOcupacion } from './components/AnalyticsOcupacion';
import {
  Calendar,
  BookOpen,
  Ban,
  Clock,
  Bell,
  BarChart3
} from 'lucide-react';

type TabId = 'calendario' | 'reservas' | 'bloqueos' | 'horarios' | 'recordatorios' | 'analytics';

interface TabItem {
  id: TabId;
  label: string;
  icon: React.FC<{ size?: number; className?: string }>;
}

export const AgendaPage: React.FC = () => {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const esGimnasio = user?.role === 'gimnasio';

  const [tabActiva, setTabActiva] = useState<TabId>('calendario');

  const tabItems: TabItem[] = useMemo(() => [
    { id: 'calendario', label: 'Calendario', icon: Calendar },
    { id: 'reservas', label: 'Reservas', icon: BookOpen },
    { id: 'bloqueos', label: 'Bloqueos', icon: Ban },
    { id: 'horarios', label: 'Gestión de Horarios', icon: Clock },
    { id: 'recordatorios', label: 'Recordatorios', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ], []);

  const renderContent = () => {
    switch (tabActiva) {
      case 'calendario':
        return (
          <div className="space-y-6">
            <AgendaCalendar role={esEntrenador ? 'entrenador' : 'gimnasio'} />
            {esEntrenador ? <VistaPersonal /> : <VistaCentro />}
          </div>
        );
      case 'reservas':
        return <ReservasCitas />;
      case 'horarios':
        return <GestorHorarios />;
      case 'bloqueos':
        return <BloqueosAgenda />;
      case 'recordatorios':
        return <RecordatoriosAutomaticos />;
      case 'analytics':
        return <AnalyticsOcupacion />;
      default:
        return (
          <div className="space-y-6">
            <AgendaCalendar role={esEntrenador ? 'entrenador' : 'gimnasio'} />
            {esEntrenador ? <VistaPersonal /> : <VistaCentro />}
          </div>
        );
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
                  <Calendar size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Agenda
                  </h1>
                  <p className="text-gray-600">
                    Gestiona tu calendario, reservas y disponibilidad
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {esEntrenador && (
                  <Button variant="primary">
                    Nueva cita 1:1
                  </Button>
                )}
                {esGimnasio && (
                  <Button variant="primary">
                    Publicar nueva clase
                  </Button>
                )}
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
              aria-label="Secciones agenda"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
            >
              {tabItems.map(({ id, label, icon: Icon }) => {
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

export default AgendaPage;