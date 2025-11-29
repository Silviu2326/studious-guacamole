import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input } from '../../../components/componentsreutilizables';
import { 
  getEstadisticasAsistenciaPorCliente, 
  getResumenEstadisticasAsistencia,
  EstadisticasCliente,
  ResumenEstadisticasAsistencia
} from '../api/estadisticasAsistencia';
import { useAuth } from '../../../context/AuthContext';
import { 
  BarChart3, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  TrendingDown,
  TrendingUp,
  Calendar,
  Loader2
} from 'lucide-react';

interface EstadisticasAsistenciaClientesProps {
  entrenadorId: string;
}

export const EstadisticasAsistenciaClientes: React.FC<EstadisticasAsistenciaClientesProps> = ({
  entrenadorId,
}) => {
  const { user } = useAuth();
  const [estadisticas, setEstadisticas] = useState<EstadisticasCliente[]>([]);
  const [resumen, setResumen] = useState<ResumenEstadisticasAsistencia | null>(null);
  const [loading, setLoading] = useState(true);
  const [fechaInicio, setFechaInicio] = useState<string>(() => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() - 6);
    return fecha.toISOString().split('T')[0];
  });
  const [fechaFin, setFechaFin] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const cargarEstadisticas = async () => {
    setLoading(true);
    try {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      fin.setHours(23, 59, 59, 999); // Incluir todo el día

      const [estadisticasData, resumenData] = await Promise.all([
        getEstadisticasAsistenciaPorCliente(entrenadorId, inicio, fin),
        getResumenEstadisticasAsistencia(entrenadorId, inicio, fin),
      ]);

      setEstadisticas(estadisticasData);
      setResumen(resumenData);
    } catch (error) {
      console.error('Error cargando estadísticas de asistencia:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEstadisticas();
  }, [entrenadorId, fechaInicio, fechaFin]);

  const getColorTasaAsistencia = (tasa: number): string => {
    if (tasa >= 80) return 'text-green-600';
    if (tasa >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getColorTasaNoShow = (tasa: number): string => {
    if (tasa <= 10) return 'text-green-600';
    if (tasa <= 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBadgeClienteProblematico = (estadistica: EstadisticasCliente): string => {
    if (estadistica.tasaNoShow > 20 || estadistica.reservasNoShow >= 3) {
      return 'Cliente problemático';
    }
    return '';
  };

  const columns = [
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (value: string, row: EstadisticasCliente) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{value}</span>
          {(row.tasaNoShow > 20 || row.reservasNoShow >= 3) && (
            <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
              Problemático
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'totalReservas',
      label: 'Total Reservas',
      render: (value: number) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
      align: 'center' as const,
    },
    {
      key: 'reservasCompletadas',
      label: 'Completadas',
      render: (value: number, row: EstadisticasCliente) => (
        <div className="flex items-center gap-2 justify-center">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-green-700 font-medium">{value}</span>
        </div>
      ),
      align: 'center' as const,
    },
    {
      key: 'reservasNoShow',
      label: 'No Shows',
      render: (value: number, row: EstadisticasCliente) => (
        <div className="flex items-center gap-2 justify-center">
          <XCircle className="w-4 h-4 text-red-600" />
          <span className={`font-medium ${value > 0 ? 'text-red-700' : 'text-gray-600'}`}>
            {value}
          </span>
        </div>
      ),
      align: 'center' as const,
    },
    {
      key: 'reservasCanceladas',
      label: 'Canceladas',
      render: (value: number) => (
        <span className="text-gray-600">{value}</span>
      ),
      align: 'center' as const,
    },
    {
      key: 'tasaAsistencia',
      label: 'Tasa Asistencia',
      render: (value: number) => (
        <div className="flex items-center gap-2 justify-center">
          <TrendingUp className={`w-4 h-4 ${getColorTasaAsistencia(value)}`} />
          <span className={`font-semibold ${getColorTasaAsistencia(value)}`}>
            {value}%
          </span>
        </div>
      ),
      align: 'center' as const,
    },
    {
      key: 'tasaNoShow',
      label: 'Tasa No Show',
      render: (value: number) => (
        <div className="flex items-center gap-2 justify-center">
          <TrendingDown className={`w-4 h-4 ${getColorTasaNoShow(value)}`} />
          <span className={`font-semibold ${getColorTasaNoShow(value)}`}>
            {value}%
          </span>
        </div>
      ),
      align: 'center' as const,
    },
    {
      key: 'ultimaReserva',
      label: 'Última Reserva',
      render: (value: Date | undefined) => (
        <span className="text-sm text-gray-600">
          {value ? new Date(value).toLocaleDateString('es-ES') : '-'}
        </span>
      ),
      align: 'center' as const,
    },
  ];

  if (loading) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-8 text-center">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando estadísticas de asistencia...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen general */}
      {resumen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white shadow-sm">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Clientes</p>
                  <p className="text-2xl font-bold text-gray-900">{resumen.totalClientes}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="bg-white shadow-sm">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tasa Asistencia</p>
                  <p className={`text-2xl font-bold ${getColorTasaAsistencia(resumen.tasaAsistenciaGeneral)}`}>
                    {resumen.tasaAsistenciaGeneral}%
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="bg-white shadow-sm">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tasa No Show</p>
                  <p className={`text-2xl font-bold ${getColorTasaNoShow(resumen.tasaNoShowGeneral)}`}>
                    {resumen.tasaNoShowGeneral}%
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </Card>

          <Card className="bg-white shadow-sm">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Clientes Problemáticos</p>
                  <p className="text-2xl font-bold text-red-600">{resumen.clientesProblematicos}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filtros de fecha */}
      <Card className="bg-white shadow-sm">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">
              Filtros de Fecha
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Inicio
              </label>
              <Input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Fin
              </label>
              <Input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="primary"
                onClick={cargarEstadisticas}
                className="w-full"
              >
                Actualizar
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabla de estadísticas por cliente */}
      <Card className="bg-white shadow-sm">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">
              Estadísticas por Cliente
            </h3>
          </div>

          {estadisticas.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay estadísticas disponibles para el período seleccionado</p>
            </div>
          ) : (
            <Table
              data={estadisticas}
              columns={columns}
              emptyMessage="No hay estadísticas disponibles"
            />
          )}
        </div>
      </Card>

      {/* Información sobre clientes problemáticos */}
      {resumen && resumen.clientesProblematicos > 0 && (
        <Card className="bg-yellow-50 border border-yellow-200 shadow-sm">
          <div className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-lg font-semibold text-yellow-900 mb-2">
                  Clientes Problemáticos Detectados
                </h4>
                <p className="text-sm text-yellow-800 mb-2">
                  Se han identificado <strong>{resumen.clientesProblematicos}</strong> cliente(s) con una tasa de no show superior al 20% o con 3 o más no shows.
                </p>
                <p className="text-sm text-yellow-800">
                  Se recomienda revisar estos clientes y considerar aplicar políticas más estrictas o establecer medidas preventivas.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};


