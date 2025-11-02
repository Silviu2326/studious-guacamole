import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Table } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { MantenimientoService } from '../services/mantenimientoService';
import { AlertaMantenimiento, PrioridadIncidencia } from '../types';
import { Bell, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

export const AlertasMantenimiento: React.FC = () => {
  const [alertas, setAlertas] = useState<AlertaMantenimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroResuelta, setFiltroResuelta] = useState<boolean | undefined>(false);

  useEffect(() => {
    cargarDatos();
  }, [filtroResuelta]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const alertasData = await MantenimientoService.obtenerAlertas(
        filtroResuelta !== undefined ? { resuelta: filtroResuelta } : {}
      );
      setAlertas(alertasData);
    } catch (error) {
      console.error('Error al cargar alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoResuelta = async (id: string) => {
    try {
      await MantenimientoService.marcarAlertaResuelta(id);
      cargarDatos();
    } catch (error) {
      console.error('Error al marcar alerta como resuelta:', error);
    }
  };

  const obtenerIconoAlerta = (tipo: string) => {
    switch (tipo) {
      case 'vencimiento_mantenimiento':
        return <Clock className="w-5 h-5" />;
      case 'incidencia_critica':
        return <AlertTriangle className="w-5 h-5" />;
      case 'tarea_pendiente':
        return <Bell className="w-5 h-5" />;
      case 'repuesto_faltante':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const obtenerColorPrioridad = (prioridad: PrioridadIncidencia) => {
    switch (prioridad) {
      case 'critica':
        return 'red';
      case 'media':
        return 'yellow';
      case 'baja':
        return 'green';
      default:
        return 'gray';
    }
  };

  const obtenerColorTipo = (tipo: string) => {
    switch (tipo) {
      case 'vencimiento_mantenimiento':
        return 'blue';
      case 'incidencia_critica':
        return 'red';
      case 'tarea_pendiente':
        return 'yellow';
      case 'repuesto_faltante':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const columnas = [
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          {obtenerIconoAlerta(value)}
          <Badge variant={obtenerColorTipo(value) as any}>
            {value.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
      ),
    },
    {
      key: 'titulo',
      label: 'Título',
      sortable: true,
    },
    {
      key: 'mensaje',
      label: 'Mensaje',
      render: (value: string) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
      ),
    },
    {
      key: 'prioridad',
      label: 'Prioridad',
      render: (value: PrioridadIncidencia) => (
        <Badge variant={obtenerColorPrioridad(value) as any}>
          {value.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'fechaCreacion',
      label: 'Fecha',
      render: (value: string) => new Date(value).toLocaleDateString('es-ES'),
    },
    {
      key: 'resuelta',
      label: 'Estado',
      render: (value: boolean) => (
        <Badge variant={value ? 'green' : 'yellow'}>
          {value ? 'RESUELTA' : 'PENDIENTE'}
        </Badge>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (value: any, row: AlertaMantenimiento) => (
        !row.resuelta && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => marcarComoResuelta(row.id)}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Resolver
          </Button>
        )
      ),
    },
  ];

  const alertasPendientes = alertas.filter(a => !a.resuelta);
  const alertasCriticas = alertasPendientes.filter(a => a.prioridad === 'critica');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
          Alertas de Mantenimiento
        </h2>
        <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-1`}>
          Monitorea y gestiona alertas automáticas de mantenimiento e incidencias
        </p>
      </div>

      {/* Resumen de Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Alertas Pendientes
              </p>
              <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {alertasPendientes.length}
              </p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Alertas Críticas
              </p>
              <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {alertasCriticas.length}
              </p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Alertas Resueltas
              </p>
              <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {alertas.filter(a => a.resuelta).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <div className="flex items-center gap-4">
          <Button
            variant={filtroResuelta === false ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFiltroResuelta(false)}
          >
            Pendientes
          </Button>
          <Button
            variant={filtroResuelta === true ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFiltroResuelta(true)}
          >
            Resueltas
          </Button>
          <Button
            variant={filtroResuelta === undefined ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFiltroResuelta(undefined)}
          >
            Todas
          </Button>
        </div>
      </Card>

      {/* Tabla de Alertas */}
      <Table
        data={alertas}
        columns={columnas}
        loading={loading}
        emptyMessage="No hay alertas registradas"
      />
    </div>
  );
};

