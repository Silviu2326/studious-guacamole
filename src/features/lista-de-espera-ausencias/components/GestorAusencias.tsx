import React, { useState, useEffect } from 'react';
import { Card, Table, MetricCards } from '../../../components/componentsreutilizables';
import { getAusencias, registrarAusencia, liberarPlaza } from '../api';
import { Ausencia } from '../types';
import { UserX, Calendar, AlertTriangle, DollarSign, Clock } from 'lucide-react';

export const GestorAusencias: React.FC = () => {
  const [ausencias, setAusencias] = useState<Ausencia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarAusencias();
  }, []);

  const cargarAusencias = async () => {
    try {
      setLoading(true);
      const data = await getAusencias();
      setAusencias(data);
    } catch (error) {
      console.error('Error al cargar ausencias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarAusencia = async (
    reservaId: string,
    tipo: 'no_show' | 'cancelacion_tardia' | 'ausencia_justificada'
  ) => {
    try {
      await registrarAusencia(reservaId, tipo);
      await liberarPlaza(reservaId);
      cargarAusencias();
    } catch (error) {
      console.error('Error al registrar ausencia:', error);
    }
  };

  const getTipoBadge = (tipo: string) => {
    const colors = {
      no_show: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      cancelacion_tardia: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      ausencia_justificada: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    };
    return colors[tipo as keyof typeof colors] || colors.no_show;
  };

  const columns = [
    {
      key: 'fechaAusencia',
      label: 'Fecha',
      sortable: true,
      render: (value: Date) => new Date(value).toLocaleDateString('es-ES'),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value: string) => (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getTipoBadge(value)}`}>
          {value.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'socioId',
      label: 'Socio',
      render: (_: any, row: Ausencia) => (
        <div className="font-medium">Socio {row.socioId}</div>
      ),
    },
    {
      key: 'claseId',
      label: 'Clase',
      render: (_: any, row: Ausencia) => (
        <div className="font-medium">Clase {row.claseId}</div>
      ),
    },
    {
      key: 'penalizacion',
      label: 'Penalización',
      render: (value: any) => {
        if (!value) return <span className="text-gray-500">Sin penalización</span>;
        return (
          <div className="flex items-center gap-2">
            {value.tipo === 'multa' && value.monto && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>{value.monto}€</span>
              </div>
            )}
            {value.tipo === 'bloqueo_temporal' && value.diasBloqueo && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{value.diasBloqueo} días</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'notificadoListaEspera',
      label: 'Notificado',
      render: (value: boolean) => (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${value ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
          {value ? 'Sí' : 'No'}
        </span>
      ),
    },
  ];

  const estadisticas = {
    total: ausencias.length,
    noShow: ausencias.filter(a => a.tipo === 'no_show').length,
    cancelacionesTardias: ausencias.filter(a => a.tipo === 'cancelacion_tardia').length,
    justificadas: ausencias.filter(a => a.tipo === 'ausencia_justificada').length,
  };

  return (
    <div className="space-y-6">
      {/* KPIs de Ausencias */}
      <MetricCards
        data={[
          {
            id: 'total',
            title: 'Total Ausencias',
            value: estadisticas.total,
            color: 'error',
            icon: <UserX />,
          },
          {
            id: 'no-show',
            title: 'No Show',
            value: estadisticas.noShow,
            color: 'warning',
            icon: <AlertTriangle />,
          },
          {
            id: 'cancelaciones-tardias',
            title: 'Cancelaciones Tardías',
            value: estadisticas.cancelacionesTardias,
            color: 'warning',
            icon: <Clock />,
          },
          {
            id: 'justificadas',
            title: 'Justificadas',
            value: estadisticas.justificadas,
            color: 'info',
            icon: <Calendar />,
          },
        ]}
      />

      {/* Tabla de Registro de Ausencias */}
      <Card className="p-6 bg-white shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Registro de Ausencias
        </h3>

        <Table
          data={ausencias}
          columns={columns}
          loading={loading}
          emptyMessage="No hay ausencias registradas"
        />
      </Card>
    </div>
  );
};

