import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import {
  obtenerAlertasAforo,
  marcarAlertaLeida,
  marcarTodasLeidas,
  obtenerEstadisticasAlertas,
  type AlertaAforo,
  type EstadisticasAlertas,
} from '../api';
import { 
  Bell, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Info,
  RefreshCw 
} from 'lucide-react';

export const AlertasAforo: React.FC = () => {
  const [alertas, setAlertas] = useState<AlertaAforo[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasAlertas | null>(null);
  const [filtro, setFiltro] = useState<'todas' | 'no_leidas' | 'criticas'>('todas');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 10000);
    return () => clearInterval(interval);
  }, [filtro]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [alertasData, estadisticasData] = await Promise.all([
        obtenerAlertasAforo({
          leida: filtro === 'no_leidas' ? false : undefined,
          nivel: filtro === 'criticas' ? 'critical' : undefined,
        }),
        obtenerEstadisticasAlertas(),
      ]);
      setAlertas(alertasData);
      setEstadisticas(estadisticasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarLeida = async (alertaId: string) => {
    try {
      await marcarAlertaLeida(alertaId);
      await cargarDatos();
    } catch (error) {
      console.error('Error al marcar alerta como leída:', error);
    }
  };

  const handleMarcarTodasLeidas = async () => {
    try {
      await marcarTodasLeidas();
      await cargarDatos();
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    }
  };

  const getNivelIcon = (nivel: string) => {
    switch (nivel) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'critical':
        return 'bg-red-100 border-red-300 dark:bg-red-900 dark:border-red-700';
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-700';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900 dark:border-yellow-700';
      default:
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900 dark:border-blue-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      {estadisticas && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Estadísticas de Alertas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl ring-1 ring-slate-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Total Alertas
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {estadisticas.totalAlertas}
                    </p>
                  </div>
                  <Bell className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl ring-1 ring-slate-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      No Leídas
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {estadisticas.alertasNoLeidas}
                    </p>
                  </div>
                  <Bell className="w-8 h-8 text-yellow-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl ring-1 ring-slate-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Críticas
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {estadisticas.alertasCriticas}
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl ring-1 ring-slate-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Hoy
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {estadisticas.alertasHoy}
                    </p>
                  </div>
                  <RefreshCw className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Filtros y acciones */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Alertas de Aforo
            </h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarcarTodasLeidas}
                disabled={loading || estadisticas?.alertasNoLeidas === 0}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Marcar Todas Leídas
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={cargarDatos}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={filtro === 'todas' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFiltro('todas')}
            >
              Todas
            </Button>
            <Button
              variant={filtro === 'no_leidas' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFiltro('no_leidas')}
            >
              No Leídas ({estadisticas?.alertasNoLeidas || 0})
            </Button>
            <Button
              variant={filtro === 'criticas' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFiltro('criticas')}
            >
              Críticas ({estadisticas?.alertasCriticas || 0})
            </Button>
          </div>

          {/* Lista de alertas */}
          <div className="space-y-3">
            {loading && (
              <Card className="p-8 text-center bg-white shadow-sm">
                <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
                <p className="text-gray-600">Cargando alertas...</p>
              </Card>
            )}

            {!loading && alertas.length === 0 && (
              <Card className="p-8 text-center bg-white shadow-sm">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin Alertas</h3>
                <p className="text-gray-600">
                  No hay alertas {filtro !== 'todas' && `(${filtro})`}
                </p>
              </Card>
            )}

            {!loading && alertas.map((alerta) => (
              <div
                key={alerta.id}
                className={`bg-white rounded-xl ring-1 ring-slate-200 p-4 shadow-sm border-l-4 ${getNivelColor(alerta.nivel)} ${
                  !alerta.leida ? 'ring-2 ring-blue-200' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getNivelIcon(alerta.nivel)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-gray-900">
                          {alerta.titulo}
                        </h3>
                        {!alerta.leida && (
                          <Badge variant="yellow">Nueva</Badge>
                        )}
                        {alerta.zona && (
                          <Badge variant="blue">{alerta.zona}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {alerta.mensaje}
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500">
                          {new Date(alerta.fechaHora).toLocaleString('es-ES')}
                        </span>
                        {alerta.accionRequerida && (
                          <span className="text-xs font-semibold text-yellow-600">
                            Acción requerida
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {!alerta.leida && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => alerta.id && handleMarcarLeida(alerta.id)}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

