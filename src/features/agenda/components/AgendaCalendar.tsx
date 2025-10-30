import React, { useMemo, useState } from 'react';
import { Card, Tabs, TableWithActions, TableAction, TableColumn, Button } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { getCalendario } from '../api/calendario';

type Role = 'entrenador' | 'gimnasio';

interface Evento {
  id: string;
  titulo: string;
  fecha: string; // ISO date
  horaInicio: string; // HH:mm
  horaFin: string; // HH:mm
  tipo: 'sesion' | 'clase' | 'evaluacion' | 'videollamada';
  capacidad?: number;
  ocupacion?: number;
}

interface Props {
  role: Role;
}

export const AgendaCalendar: React.FC<Props> = ({ role }) => {
  const [vista, setVista] = useState<'mes' | 'semana' | 'dia'>('semana');
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  React.useEffect(() => {
    setLoading(true);
    getCalendario(role).then((data) => {
      setEventos(data);
      setLoading(false);
    });
  }, [role]);

  const vistaTabs = useMemo(() => ([
    { id: 'mes', label: 'Mes' },
    { id: 'semana', label: 'Semana' },
    { id: 'dia', label: 'Día' },
  ]), []);

  const columns: TableColumn<Evento>[] = [
    { key: 'titulo', label: 'Título', sortable: true },
    { key: 'tipo', label: 'Tipo' },
    { key: 'fecha', label: 'Fecha', sortable: true },
    { key: 'horaInicio', label: 'Inicio' },
    { key: 'horaFin', label: 'Fin' },
    ...(role === 'gimnasio' ? [
      { key: 'capacidad', label: 'Capacidad' },
      { key: 'ocupacion', label: 'Ocupación' },
    ] : []),
  ];

  const actions: TableAction<Evento>[] = [
    {
      label: 'Ver',
      variant: 'ghost',
      onClick: (row) => console.log('Ver evento', row),
    },
    {
      label: role === 'entrenador' ? 'Editar' : 'Editar clase',
      variant: 'secondary',
      onClick: (row) => console.log('Editar', row),
    },
    {
      label: 'Eliminar',
      variant: 'destructive',
      onClick: (row) => console.log('Eliminar', row),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs items={vistaTabs} activeTab={vista} onTabChange={(t) => setVista(t as typeof vista)} variant="underline" />
        <div className="flex gap-3">
          <Button variant="ghost">Hoy</Button>
          <Button variant="secondary">Exportar</Button>
        </div>
      </div>

      <Card padding="md">
        {/* Vista simplificada: listamos eventos según la vista seleccionada (mock) */}
        <TableWithActions<Evento>
          data={eventos}
          columns={columns}
          actions={actions}
          loading={loading}
          emptyMessage={role === 'entrenador' ? 'Sin sesiones programadas' : 'Sin clases programadas'}
        />
      </Card>
    </div>
  );
};