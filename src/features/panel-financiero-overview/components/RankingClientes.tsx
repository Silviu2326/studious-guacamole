import React, { useState } from 'react';
import { Card, Table, TableColumn, Select, Button } from '../../../components/componentsreutilizables';
import { Trophy, TrendingUp, Users, Calendar, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { rankingClientesApi } from '../api';
import { ClienteRanking, PeriodoFiltro } from '../types';

export const RankingClientes: React.FC = () => {
  const { user } = useAuth();
  const [ranking, setRanking] = useState<ClienteRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState<PeriodoFiltro>('30d');
  const [fechaInicioCustom, setFechaInicioCustom] = useState<string>('');
  const [fechaFinCustom, setFechaFinCustom] = useState<string>('');

  React.useEffect(() => {
    cargarRanking();
  }, [periodo, fechaInicioCustom, fechaFinCustom, user?.id]);

  const cargarRanking = async () => {
    try {
      setLoading(true);
      const fechaInicio = periodo === 'custom' && fechaInicioCustom 
        ? new Date(fechaInicioCustom) 
        : undefined;
      const fechaFin = periodo === 'custom' && fechaFinCustom 
        ? new Date(fechaFinCustom) 
        : undefined;

      const data = await rankingClientesApi.obtenerRankingClientes(
        periodo,
        fechaInicio,
        fechaFin,
        user?.id
      );
      setRanking(data);
    } catch (error) {
      console.error('Error cargando ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedallaIcon = (posicion: number) => {
    if (posicion === 1) {
      return <Trophy className="w-5 h-5 text-yellow-500" />;
    } else if (posicion === 2) {
      return <Trophy className="w-5 h-5 text-gray-400" />;
    } else if (posicion === 3) {
      return <Trophy className="w-5 h-5 text-amber-600" />;
    }
    return null;
  };

  const columns: TableColumn<ClienteRanking & { posicion: number }>[] = [
    {
      key: 'posicion',
      label: '#',
      align: 'center',
      render: (val, row) => (
        <div className="flex items-center justify-center gap-2">
          {getMedallaIcon(row.posicion)}
          <span className="font-semibold text-gray-700">{row.posicion}</span>
        </div>
      )
    },
    { 
      key: 'nombre', 
      label: 'Cliente',
      render: (val) => <span className="font-medium text-gray-900">{val}</span>
    },
    { 
      key: 'totalIngresos', 
      label: 'Total Ingresos', 
      align: 'right',
      render: (val) => (
        <span className="font-semibold text-green-600">
          €{val.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      )
    },
    { 
      key: 'numeroTransacciones', 
      label: 'Transacciones', 
      align: 'center',
      render: (val) => (
        <span className="text-gray-700">{val}</span>
      )
    },
    { 
      key: 'promedioTransaccion', 
      label: 'Promedio', 
      align: 'right',
      render: (val) => (
        <span className="text-gray-600">
          €{val.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      )
    },
    { 
      key: 'ultimaTransaccion', 
      label: 'Última Transacción', 
      render: (val) => val ? new Date(val).toLocaleDateString('es-ES') : '-'
    }
  ];

  const rankingConPosicion = ranking.map((cliente, index) => ({
    ...cliente,
    posicion: index + 1
  }));

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Ranking de Clientes por Ingresos
              </h2>
              <p className="text-sm text-gray-600">
                Identifica tus clientes más valiosos
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <Select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value as PeriodoFiltro)}
            >
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
              <option value="ytd">Año en curso</option>
              <option value="custom">Personalizado</option>
            </Select>
          </div>

          {periodo === 'custom' && (
            <>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={fechaInicioCustom}
                  onChange={(e) => setFechaInicioCustom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={fechaFinCustom}
                  onChange={(e) => setFechaFinCustom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}

          <Button
            variant="primary"
            onClick={cargarRanking}
            leftIcon={<Calendar className="w-4 h-4" />}
          >
            Aplicar Filtros
          </Button>
        </div>

        {/* Resumen */}
        {!loading && ranking.length > 0 && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Total Clientes</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{ranking.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Ingresos Totales</span>
              </div>
              <p className="text-2xl font-bold text-green-900">
                €{ranking.reduce((sum, c) => sum + c.totalIngresos, 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Top Cliente</span>
              </div>
              <p className="text-lg font-bold text-purple-900">
                {ranking[0]?.nombre || '-'}
              </p>
              <p className="text-sm text-purple-700">
                €{ranking[0]?.totalIngresos.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}
              </p>
            </div>
          </div>
        )}

        {/* Tabla de ranking */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : ranking.length > 0 ? (
          <Table 
            data={rankingConPosicion} 
            columns={columns} 
            loading={loading}
            emptyMessage="No hay datos disponibles"
          />
        ) : (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay clientes con ingresos en el período seleccionado</p>
          </div>
        )}
      </div>
    </Card>
  );
};

