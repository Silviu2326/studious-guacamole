import React, { useEffect, useState } from 'react';
import { Card, MetricCards, Table, TableColumn, Select } from '../../../components/componentsreutilizables';
import { getAnalytics } from '../api/analytics';
import { useAuth } from '../../../context/AuthContext';

interface OcupacionRow { recurso: string; periodo: string; ocupacion: number; capacidad?: number; }

export const AnalyticsOcupacion: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'entrenador';
  const [periodo, setPeriodo] = useState<string>('semana');
  const [rows, setRows] = useState<OcupacionRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    getAnalytics(role, periodo).then(data => { setRows(data.rows); setLoading(false); });
  }, [role, periodo]);

  const metrics = [
    { id: 'a1', title: 'Ocupación media', value: `${Math.round(rows.reduce((acc, r) => acc + r.ocupacion, 0) / Math.max(rows.length, 1))}%`, trend: { value: 1, direction: 'up' as const }, color: 'info' as const },
    { id: 'a2', title: role === 'entrenador' ? 'Sesiones totales' : 'Clases totales', value: String(rows.length), trend: { value: 0, direction: 'neutral' as const }, color: 'info' as const },
    { id: 'a3', title: 'Capacidad media', value: role === 'gimnasio' ? String(Math.round(rows.reduce((acc, r) => acc + (r.capacidad || 0), 0) / Math.max(rows.length, 1))) : '-', trend: { value: 2, direction: 'up' as const }, color: 'success' as const },
  ];

  const columns: TableColumn<OcupacionRow>[] = [
    { key: 'recurso', label: role === 'entrenador' ? 'Cliente/Sesión' : 'Clase' },
    { key: 'periodo', label: 'Periodo' },
    { key: 'ocupacion', label: 'Ocupación (%)' },
    ...(role === 'gimnasio' ? [{ key: 'capacidad', label: 'Capacidad' }] : []),
  ];

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Analytics de Ocupación</h3>
          <div className="w-48">
            <Select label="Periodo" value={periodo} onChange={(v) => setPeriodo(v || 'semana')} options={[{ value: 'dia', label: 'Día' }, { value: 'semana', label: 'Semana' }, { value: 'mes', label: 'Mes' }]} />
          </div>
        </div>
      </Card>
      <MetricCards data={metrics} />
      <Card className="p-0 bg-white shadow-sm">
        <Table data={rows} columns={columns} loading={loading} />
      </Card>
    </div>
  );
};