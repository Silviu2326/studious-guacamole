import { useEffect, useState } from 'react';
import { Card } from '../../../components/componentsreutilizables/Card';
import { Button } from '../../../components/componentsreutilizables/Button';
import { Select } from '../../../components/componentsreutilizables/Select';
import { TableWithActions } from '../../../components/componentsreutilizables/TableWithActions';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { MetricCards } from '../../../components/componentsreutilizables/MetricCards';
import { TrendingUp, Calendar, Users, Target, Eye } from 'lucide-react';
import * as asignacionesApi from '../api/asignaciones';
import * as programasApi from '../api/programas';

export function SeguimientoPrograma() {
  const [asignaciones, setAsignaciones] = useState<asignacionesApi.Asignacion[]>([]);
  const [programas, setProgramas] = useState<programasApi.Programa[]>([]);
  const [programaSeleccionado, setProgramaSeleccionado] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [programaSeleccionado]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [progs, asigs] = await Promise.all([
        programasApi.getProgramas(),
        asignacionesApi.getAsignaciones(programaSeleccionado ? { programaId: programaSeleccionado } : undefined),
      ]);
      setProgramas(progs);
      setAsignaciones(asigs);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const asignacionesActivas = asignaciones.filter((a) => a.estado === 'activa').length;
  const asignacionesCompletadas = asignaciones.filter((a) => a.estado === 'completada').length;
  const progresoPromedio =
    asignaciones.reduce((acc, a) => acc + (a.progreso || 0), 0) / (asignaciones.length || 1);

  const metricas = [
    {
      title: 'Asignaciones Activas',
      value: asignacionesActivas.toString(),
      icon: <TrendingUp className="w-5 h-5" />,
      trend: 'up' as const,
      trendValue: `${asignacionesActivas}`,
      color: 'blue' as const,
    },
    {
      title: 'Completadas',
      value: asignacionesCompletadas.toString(),
      icon: <Target className="w-5 h-5" />,
      trend: 'neutral' as const,
      trendValue: `${asignacionesCompletadas}`,
      color: 'green' as const,
    },
    {
      title: 'Progreso Promedio',
      value: `${Math.round(progresoPromedio)}%`,
      icon: <Calendar className="w-5 h-5" />,
      trend: progresoPromedio > 50 ? 'up' : 'down',
      trendValue: `${Math.round(progresoPromedio)}%`,
      color: 'purple' as const,
    },
    {
      title: 'Total Asignaciones',
      value: asignaciones.length.toString(),
      icon: <Users className="w-5 h-5" />,
      trend: 'neutral' as const,
      trendValue: `${asignaciones.length}`,
      color: 'orange' as const,
    },
  ];

  const estadoBadge = (estado: asignacionesApi.Asignacion['estado']) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      activa: 'default',
      pausada: 'secondary',
      completada: 'outline',
      cancelada: 'destructive',
    };
    return <Badge variant={variants[estado]}>{estado}</Badge>;
  };

  const columns = [
    { key: 'programaNombre', label: 'Programa' },
    { key: 'clienteNombre', label: 'Cliente' },
    { key: 'grupoNombre', label: 'Grupo' },
    { key: 'fechaInicio', label: 'Fecha Inicio' },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: any, row: asignacionesApi.Asignacion) => estadoBadge(row.estado),
    },
    {
      key: 'progreso',
      label: 'Progreso',
      render: (value: any, row: asignacionesApi.Asignacion) => {
        const progress = row.progreso || 0;
        return (
          <div className="flex items-center gap-2">
            <div className="w-20 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm">{progress}%</span>
          </div>
        );
      },
    },
    {
      key: 'fechaFin',
      label: 'Fecha Fin',
      render: (value: any, row: asignacionesApi.Asignacion) => row.fechaFin || '-',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <Select
            label="Filtrar por Programa"
            value={programaSeleccionado}
            onChange={(v) => setProgramaSeleccionado(v)}
            options={[
              { label: 'Todos los programas', value: '' },
              ...programas.map((p) => ({ label: p.nombre, value: p.id })),
            ]}
          />
        </div>
      </Card>

      {/* Métricas */}
      <MetricCards data={metricas} />

      {/* Tabla de seguimiento */}
      <Card className="bg-white shadow-sm">
        <TableWithActions
          columns={columns}
          data={asignaciones}
          loading={loading}
          actions={(row) => (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => window.location.href = `#seguimiento/${row.id}`}
                iconLeft={Eye}
              >
                Ver Detalle
              </Button>
            </div>
          )}
        />
      </Card>
    </div>
  );
}

