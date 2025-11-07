import React, { useState, useEffect } from 'react';
import { Table, Card, MetricCards, Button } from '../../../components/componentsreutilizables';
import { salasApi, Sala } from '../api';
import { Users, AlertTriangle, TrendingUp, Building2 } from 'lucide-react';

export const ControlAforo: React.FC = () => {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarSalas();
  }, []);

  const cargarSalas = async () => {
    try {
      setLoading(true);
      const datos = await salasApi.obtenerSalas();
      setSalas(datos);
    } catch (error) {
      console.error('Error al cargar salas:', error);
    } finally {
      setLoading(false);
    }
  };

  const salasConAforoAlto = salas.filter(s => (s.ocupacionActual / s.capacidad) >= 0.8);
  const ocupacionPromedio = salas.length > 0
    ? Math.round(salas.reduce((sum, s) => sum + (s.ocupacionActual / s.capacidad * 100), 0) / salas.length)
    : 0;
  const totalOcupacion = salas.reduce((sum, s) => sum + s.ocupacionActual, 0);
  const totalCapacidad = salas.reduce((sum, s) => sum + s.capacidad, 0);

  const metricas = [
    {
      id: 'ocupacion-total',
      title: 'Ocupación Total',
      value: `${totalOcupacion}/${totalCapacidad}`,
      subtitle: `${Math.round((totalOcupacion / totalCapacidad) * 100)}% del total`,
      icon: <Users className="w-6 h-6" />,
      color: (totalOcupacion / totalCapacidad) > 0.8 ? 'error' as const : (totalOcupacion / totalCapacidad) > 0.5 ? 'warning' as const : 'success' as const,
    },
    {
      id: 'ocupacion-promedio',
      title: 'Ocupación Promedio',
      value: `${ocupacionPromedio}%`,
      subtitle: 'Por sala',
      icon: <TrendingUp className="w-6 h-6" />,
      color: ocupacionPromedio > 80 ? 'error' as const : ocupacionPromedio > 50 ? 'info' as const : 'success' as const,
    },
    {
      id: 'salas-alta-ocupacion',
      title: 'Aforo Alto',
      value: salasConAforoAlto.length,
      subtitle: 'Salas con >80%',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: salasConAforoAlto.length > 0 ? 'warning' as const : 'success' as const,
    },
    {
      id: 'total-salas',
      title: 'Total Salas',
      value: salas.length,
      subtitle: 'Monitoreadas',
      icon: <Building2 className="w-6 h-6" />,
      color: 'primary' as const,
    }
  ];

  const getPorcentajeOcupacion = (ocupacion: number, capacidad: number) => {
    return Math.round((ocupacion / capacidad) * 100);
  };

  const getColorOcupacion = (porcentaje: number) => {
    if (porcentaje >= 90) return 'text-red-600 dark:text-red-400';
    if (porcentaje >= 80) return 'text-orange-600 dark:text-orange-400';
    if (porcentaje >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const columns = [
    {
      key: 'nombre',
      label: 'Sala',
      render: (value: string, row: Sala) => (
        <div className="flex items-center gap-3">
          <Building2 className="w-5 h-5 text-gray-400" />
          <div>
            <div className="font-semibold">{value}</div>
            <div className="text-sm text-gray-500">{row.ubicacion}</div>
          </div>
        </div>
      )
    },
    {
      key: 'capacidad',
      label: 'Capacidad Máxima',
      render: (value: number) => (
        <span className="font-semibold">{value} personas</span>
      )
    },
    {
      key: 'ocupacionActual',
      label: 'Ocupación Actual',
      render: (value: number, row: Sala) => {
        const porcentaje = getPorcentajeOcupacion(value, row.capacidad);
        return (
          <div>
            <div className={`font-semibold ${getColorOcupacion(porcentaje)}`}>
              {value} personas
            </div>
            <div className="text-sm text-gray-500">{porcentaje}%</div>
          </div>
        );
      }
    },
    {
      key: 'ocupacion',
      label: 'Nivel de Ocupación',
      render: (_: any, row: Sala) => {
        const porcentaje = getPorcentajeOcupacion(row.ocupacionActual, row.capacidad);
        const colorBar = porcentaje >= 90 ? 'bg-red-500' :
                        porcentaje >= 80 ? 'bg-orange-500' :
                        porcentaje >= 50 ? 'bg-yellow-500' : 'bg-green-500';
        
        return (
          <div className="w-full">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-semibold ${getColorOcupacion(porcentaje)}`}>
                {porcentaje}%
              </span>
              {porcentaje >= 90 && (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              )}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${colorBar}`}
                style={{ width: `${Math.min(porcentaje, 100)}%` }}
              />
            </div>
            {porcentaje >= 90 && (
              <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                Aforo crítico - Considerar alternativas
              </div>
            )}
          </div>
        );
      }
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_: any, row: Sala) => {
        const porcentaje = getPorcentajeOcupacion(row.ocupacionActual, row.capacidad);
        if (row.estado === 'mantenimiento' || row.estado === 'bloqueada') {
          return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">Mantenimiento</span>;
        }
        if (porcentaje >= 90) {
          return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">Crítico</span>;
        }
        if (porcentaje >= 80) {
          return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">Alto</span>;
        }
        return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Normal</span>;
      }
    }
  ];

  return (
    <div className="space-y-6">
      <MetricCards data={metricas} columns={4} />

      {salasConAforoAlto.length > 0 && (
        <Card className="border-orange-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-orange-600">
              Alertas de Aforo Alto
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            {salasConAforoAlto.length} {salasConAforoAlto.length === 1 ? 'sala tiene' : 'salas tienen'} un nivel de ocupación superior al 80%.
            Considera alternativas o ajustes de capacidad.
          </p>
        </Card>
      )}

      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Control de Aforo por Sala
          </h3>
          <Button size="sm" variant="secondary" onClick={cargarSalas}>
            Actualizar
          </Button>
        </div>
        <Table
          data={salas}
          columns={columns}
          loading={loading}
          emptyMessage="No hay salas disponibles"
        />
      </Card>
    </div>
  );
};

