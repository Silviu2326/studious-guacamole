import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Badge, Modal, Input } from '../../../components/componentsreutilizables';
import {
  generarResumenActividad,
  getConfiguracionResumenActividad,
  actualizarConfiguracionResumenActividad,
} from '../api/suscripciones';
import {
  ResumenActividadSuscripciones as ResumenActividadType,
  ConfiguracionResumenActividad,
  FrecuenciaResumen,
} from '../types';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Settings,
  Download,
  RefreshCw,
} from 'lucide-react';

interface ResumenActividadSuscripcionesProps {
  entrenadorId?: string;
  onRefresh?: () => void;
}

export const ResumenActividadSuscripciones: React.FC<ResumenActividadSuscripcionesProps> = ({
  entrenadorId,
  onRefresh,
}) => {
  const [resumen, setResumen] = useState<ResumenActividadType | null>(null);
  const [loading, setLoading] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [periodo, setPeriodo] = useState<'semana' | 'mes' | 'custom'>('semana');
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');
  const [configuracion, setConfiguracion] = useState<ConfiguracionResumenActividad | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(false);

  // Calcular fechas por defecto
  useEffect(() => {
    const hoy = new Date();
    const calcularFechas = () => {
      switch (periodo) {
        case 'semana':
          const inicioSemana = new Date(hoy);
          inicioSemana.setDate(hoy.getDate() - 7);
          setFechaInicio(inicioSemana.toISOString().split('T')[0]);
          setFechaFin(hoy.toISOString().split('T')[0]);
          break;
        case 'mes':
          const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
          setFechaInicio(inicioMes.toISOString().split('T')[0]);
          setFechaFin(hoy.toISOString().split('T')[0]);
          break;
        default:
          break;
      }
    };
    calcularFechas();
  }, [periodo]);

  // Cargar configuración
  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        const config = await getConfiguracionResumenActividad(entrenadorId);
        setConfiguracion(config);
      } catch (error) {
        console.error('Error cargando configuración:', error);
      }
    };
    cargarConfiguracion();
  }, [entrenadorId]);

  // Generar resumen
  const generarResumen = async () => {
    if (!fechaInicio || !fechaFin) {
      alert('Por favor, selecciona las fechas del período');
      return;
    }

    setLoading(true);
    try {
      const nuevoResumen = await generarResumenActividad({
        entrenadorId,
        fechaInicio,
        fechaFin,
        incluirDetalles: true,
      });
      setResumen(nuevoResumen);
    } catch (error) {
      console.error('Error generando resumen:', error);
      alert('Error al generar el resumen');
    } finally {
      setLoading(false);
    }
  };

  // Guardar configuración
  const handleGuardarConfiguracion = async () => {
    if (!configuracion) return;

    setLoadingConfig(true);
    try {
      await actualizarConfiguracionResumenActividad(configuracion);
      setConfigModalOpen(false);
      alert('Configuración guardada correctamente');
    } catch (error) {
      console.error('Error guardando configuración:', error);
      alert('Error al guardar la configuración');
    } finally {
      setLoadingConfig(false);
    }
  };

  // Exportar resumen (simulado)
  const handleExportar = () => {
    if (!resumen) return;
    // En producción, esto generaría un PDF o Excel
    alert('Función de exportación en desarrollo');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Resumen de Actividad de Suscripciones
            </h2>
            <p className="text-gray-600">
              Mantente informado sobre la actividad de tus suscripciones sin revisar manualmente cada día
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setConfigModalOpen(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </Button>
            {resumen && (
              <Button
                variant="secondary"
                onClick={handleExportar}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Select
            label="Período"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value as 'semana' | 'mes' | 'custom')}
            options={[
              { value: 'semana', label: 'Última semana' },
              { value: 'mes', label: 'Este mes' },
              { value: 'custom', label: 'Personalizado' },
            ]}
          />
          <Input
            label="Fecha inicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            disabled={periodo !== 'custom'}
          />
          <Input
            label="Fecha fin"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            disabled={periodo !== 'custom'}
          />
          <div className="flex items-end">
            <Button
              variant="primary"
              onClick={generarResumen}
              loading={loading}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Generar Resumen
            </Button>
          </div>
        </div>

        {/* Configuración activa */}
        {configuracion && configuracion.activo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Resumen automático configurado
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Frecuencia: {configuracion.frecuencia} | 
                  Canales: {configuracion.canalesEnvio.join(', ')}
                </p>
              </div>
              <Badge variant="success">Activo</Badge>
            </div>
          </div>
        )}
      </Card>

      {/* Resumen */}
      {resumen && (
        <div className="space-y-6">
          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-white border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Suscripciones Activas</p>
                  <p className="text-2xl font-bold text-gray-900">{resumen.suscripcionesActivas}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nuevas Suscripciones</p>
                  <p className="text-2xl font-bold text-green-600">{resumen.suscripcionesNuevas}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Canceladas</p>
                  <p className="text-2xl font-bold text-red-600">{resumen.suscripcionesCanceladas}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ingresos Recurrentes</p>
                  <p className="text-2xl font-bold text-gray-900">{resumen.ingresosRecurrentes.toFixed(0)} €</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Métricas de sesiones */}
          {resumen.totalSesionesIncluidas !== undefined && (
            <Card className="p-6 bg-white shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Métricas de Sesiones
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Sesiones Incluidas</p>
                  <p className="text-xl font-bold text-gray-900">{resumen.totalSesionesIncluidas}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Sesiones Usadas</p>
                  <p className="text-xl font-bold text-gray-900">{resumen.totalSesionesUsadas}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Sesiones Disponibles</p>
                  <p className="text-xl font-bold text-gray-900">{resumen.totalSesionesDisponibles}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tasa de Uso</p>
                  <p className="text-xl font-bold text-gray-900">{resumen.tasaUsoSesiones?.toFixed(1)}%</p>
                </div>
              </div>
              {resumen.totalSesionesTransferidas !== undefined && resumen.totalSesionesTransferidas > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Sesiones transferidas:</strong> {resumen.totalSesionesTransferidas}
                  </p>
                </div>
              )}
            </Card>
          )}

          {/* Métricas financieras */}
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Métricas Financieras
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ingresos Recurrentes</p>
                <p className="text-2xl font-bold text-gray-900">{resumen.ingresosRecurrentes.toFixed(2)} €</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Ingresos Nuevos</p>
                <p className="text-2xl font-bold text-green-600">{resumen.ingresosNuevos.toFixed(2)} €</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Ingresos Perdidos</p>
                <p className="text-2xl font-bold text-red-600">{resumen.ingresosPerdidos.toFixed(2)} €</p>
              </div>
            </div>
          </Card>

          {/* Alertas */}
          {resumen.alertas && resumen.alertas.length > 0 && (
            <Card className="p-6 bg-white shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Alertas y Notificaciones
              </h3>
              <div className="space-y-2">
                {resumen.alertas.map((alerta, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      alerta.tipo === 'error'
                        ? 'bg-red-50 border-red-200'
                        : alerta.tipo === 'warning'
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start">
                      {alerta.tipo === 'error' ? (
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-2" />
                      ) : alerta.tipo === 'warning' ? (
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{alerta.mensaje}</p>
                        {alerta.accionRequerida && (
                          <Badge variant="warning" className="mt-2">
                            Acción requerida
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Detalles */}
          {(resumen.detallesNuevas || resumen.detallesCanceladas || resumen.detallesRenovadas) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {resumen.detallesNuevas && resumen.detallesNuevas.length > 0 && (
                <Card className="p-4 bg-white shadow-sm">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">
                    Nuevas Suscripciones
                  </h4>
                  <div className="space-y-2">
                    {resumen.detallesNuevas.slice(0, 5).map((detalle) => (
                      <div key={detalle.suscripcionId} className="p-2 bg-green-50 rounded">
                        <p className="text-sm font-medium text-gray-900">{detalle.clienteNombre}</p>
                        <p className="text-xs text-gray-600">{detalle.planNombre}</p>
                        <p className="text-xs text-gray-500">{detalle.precio.toFixed(2)} €</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {resumen.detallesCanceladas && resumen.detallesCanceladas.length > 0 && (
                <Card className="p-4 bg-white shadow-sm">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">
                    Suscripciones Canceladas
                  </h4>
                  <div className="space-y-2">
                    {resumen.detallesCanceladas.slice(0, 5).map((detalle) => (
                      <div key={detalle.suscripcionId} className="p-2 bg-red-50 rounded">
                        <p className="text-sm font-medium text-gray-900">{detalle.clienteNombre}</p>
                        <p className="text-xs text-gray-600">{detalle.planNombre}</p>
                        <p className="text-xs text-gray-500">{detalle.precio.toFixed(2)} €</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {resumen.detallesRenovadas && resumen.detallesRenovadas.length > 0 && (
                <Card className="p-4 bg-white shadow-sm">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">
                    Suscripciones Renovadas
                  </h4>
                  <div className="space-y-2">
                    {resumen.detallesRenovadas.slice(0, 5).map((detalle) => (
                      <div key={detalle.suscripcionId} className="p-2 bg-blue-50 rounded">
                        <p className="text-sm font-medium text-gray-900">{detalle.clienteNombre}</p>
                        <p className="text-xs text-gray-600">{detalle.planNombre}</p>
                        <p className="text-xs text-gray-500">{detalle.precio.toFixed(2)} €</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Transferencias */}
          {resumen.detallesTransferencias && resumen.detallesTransferencias.length > 0 && (
            <Card className="p-6 bg-white shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Transferencias de Sesiones
              </h3>
              <div className="space-y-2">
                {resumen.detallesTransferencias.map((transferencia, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{transferencia.clienteNombre}</p>
                        <p className="text-xs text-gray-600">
                          {transferencia.sesionesTransferidas} sesiones de {transferencia.periodoOrigen} a {transferencia.periodoDestino}
                        </p>
                      </div>
                      <Badge variant="info">{transferencia.sesionesTransferidas}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Modal de configuración */}
      <Modal
        isOpen={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        title="Configurar Resumen de Actividad"
      >
        {configuracion && (
          <div className="space-y-4">
            <Select
              label="Frecuencia"
              value={configuracion.frecuencia}
              onChange={(e) => setConfiguracion({
                ...configuracion,
                frecuencia: e.target.value as FrecuenciaResumen,
              })}
              options={[
                { value: 'diario', label: 'Diario' },
                { value: 'semanal', label: 'Semanal' },
                { value: 'mensual', label: 'Mensual' },
              ]}
            />

            <Input
              label="Hora de envío"
              type="time"
              value={configuracion.horaEnvio || '09:00'}
              onChange={(e) => setConfiguracion({
                ...configuracion,
                horaEnvio: e.target.value,
              })}
            />

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Activar resumen automático
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Recibirás el resumen según la frecuencia configurada
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracion.activo}
                  onChange={(e) => setConfiguracion({
                    ...configuracion,
                    activo: e.target.checked,
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="ghost"
                onClick={() => setConfigModalOpen(false)}
                disabled={loadingConfig}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleGuardarConfiguracion}
                loading={loadingConfig}
              >
                Guardar Configuración
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

