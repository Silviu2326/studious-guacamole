import React, { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, Tabs, Button } from '../../components/componentsreutilizables';
import { ds } from '../adherencia/ui/ds';
import { AgendaCalendar } from './components/AgendaCalendar';
import { VistaPersonal } from './components/VistaPersonal';
import { VistaCentro } from './components/VistaCentro';
import { GestorHorarios } from './components/GestorHorarios';
import { BloqueosAgenda } from './components/BloqueosAgenda';
import { ReservasCitas } from './components/ReservasCitas';
import { RecordatoriosAutomaticos } from './components/RecordatoriosAutomaticos';
import { AnalyticsOcupacion } from './components/AnalyticsOcupacion';

export const AgendaPage: React.FC = () => {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const esGimnasio = user?.role === 'gimnasio';

  const [tabActiva, setTabActiva] = useState<string>('calendario');

  const tabs = useMemo(() => {
    const comunes = [
      { id: 'calendario', label: 'Calendario' },
      { id: 'reservas', label: 'Reservas' },
      { id: 'bloqueos', label: 'Bloqueos' },
      { id: 'horarios', label: 'Gestión de Horarios' },
      { id: 'recordatorios', label: 'Recordatorios' },
      { id: 'analytics', label: 'Analytics' },
    ];
    return comunes;
  }, []);

  return (
    <div className={`p-6 space-y-6`}>
      <div className="flex items-center justify-between">
        <h1 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>Agenda</h1>
        <div className="flex items-center gap-3">
          {esEntrenador && (
            <Button variant="primary">Nueva cita 1:1</Button>
          )}
          {esGimnasio && (
            <Button variant="primary">Publicar nueva clase</Button>
          )}
        </div>
      </div>

      <Card variant="hover" padding="md">
        <Tabs items={tabs} activeTab={tabActiva} onTabChange={setTabActiva} variant="pills" />
      </Card>

      {tabActiva === 'calendario' && (
        <Card padding="lg" className="space-y-6">
          <AgendaCalendar role={esEntrenador ? 'entrenador' : 'gimnasio'} />
          {esEntrenador ? <VistaPersonal /> : <VistaCentro />}
        </Card>
      )}

      {tabActiva === 'reservas' && (
        <ReservasCitas />
      )}

      {tabActiva === 'horarios' && (
        <GestorHorarios />
      )}

      {tabActiva === 'bloqueos' && (
        <BloqueosAgenda />
      )}

      {tabActiva === 'recordatorios' && (
        <RecordatoriosAutomaticos />
      )}

      {tabActiva === 'analytics' && (
        <AnalyticsOcupacion />
      )}
    </div>
  );
};

export default AgendaPage;