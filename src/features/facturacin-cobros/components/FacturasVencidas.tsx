import React, { useState, useEffect } from 'react';
import { Card, Button, Table, TableColumn, Modal, Input, Select, SelectOption, Badge, MetricCards } from '../../../components/componentsreutilizables';
import { FacturaVencida, ConfiguracionNotificacionesVencidas } from '../api/facturasVencidas';
import { 
  obtenerFacturasVencidas, 
  enviarNotificacionesFacturasVencidas,
  obtenerConfiguracionNotificacionesVencidas,
  actualizarConfiguracionNotificacionesVencidas,
  obtenerEstadisticasFacturasVencidas
} from '../api/facturasVencidas';
import { AlertCircle, Bell, Mail, Settings, DollarSign, Calendar, Send, CheckCircle } from 'lucide-react';

interface FacturasVencidasProps {
  onRefresh?: () => void;
}

export const FacturasVencidas: React.FC<FacturasVencidasProps> = ({ onRefresh }) => {
  const [facturasVencidas, setFacturasVencidas] = useState<FacturaVencida[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [enviandoNotificaciones, setEnviandoNotificaciones] = useState(false);
  const [configuracion, setConfiguracion] = useState<ConfiguracionNotificacionesVencidas>({
    diasVencimientoMinimo: 7,
    notificarPorEmail: true,
    notificarEnSistema: true,
    frecuenciaNotificacion: 'diaria'
  });
  const [estadisticas, setEstadisticas] = useState({
    totalFacturasVencidas: 0,
    montoTotalVencido: 0,
    promedioDiasVencidos: 0
  });

  useEffect(() => {
    cargarFacturasVencidas();
    cargarConfiguracion();
    cargarEstadisticas();
  }, []);

  const cargarFacturasVencidas = async () => {
    setLoading(true);
    try {
      const facturas = await obtenerFacturasVencidas();
      setFacturasVencidas(facturas);
    } catch (error) {
      console.error('Error al cargar facturas vencidas:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarConfiguracion = async () => {
    try {
      const config = await obtenerConfiguracionNotificacionesVencidas();
      setConfiguracion(config);
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const stats = await obtenerEstadisticasFacturasVencidas();
      setEstadisticas({
        totalFacturasVencidas: stats.totalFacturasVencidas,
        montoTotalVencido: stats.montoTotalVencido,
        promedioDiasVencidos: stats.promedioDiasVencidos
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleEnviarNotificaciones = async () => {
    if (facturasVencidas.length === 0) {
      alert('No hay facturas vencidas para notificar');
      return;
    }

    setEnviandoNotificaciones(true);
    try {
      const resultado = await enviarNotificacionesFacturasVencidas(facturasVencidas);
      alert(`Notificaciones enviadas: ${resultado.enviadas}\nFallidas: ${resultado.fallidas}`);
      cargarFacturasVencidas();
      cargarEstadisticas();
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error al enviar notificaciones:', error);
      alert('Error al enviar las notificaciones');
    } finally {
      setEnviandoNotificaciones(false);
    }
  };

  const handleGuardarConfiguracion = async () => {
    try {
      await actualizarConfiguracionNotificacionesVencidas(configuracion);
      setMostrarConfiguracion(false);
      cargarFacturasVencidas();
      cargarEstadisticas();
      alert('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      alert('Error al guardar la configuración');
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const obtenerBadgeDiasVencidos = (dias: number) => {
    if (dias >= 30) {
      return <Badge variant="red" size="sm">+{dias} días</Badge>;
    } else if (dias >= 15) {
      return <Badge variant="yellow" size="sm">+{dias} días</Badge>;
    } else {
      return <Badge variant="orange" size="sm">+{dias} días</Badge>;
    }
  };

  const columnas: TableColumn<FacturaVencida>[] = [
    {
      key: 'numeroFactura',
      label: 'Número Factura',
      sortable: true
    },
    {
      key: 'cliente',
      label: 'Cliente',
      render: (_, row) => (
        <div>
          <div className="font-medium">{row.cliente.nombre}</div>
          <div className="text-sm text-gray-500">{row.cliente.email}</div>
        </div>
      )
    },
    {
      key: 'diasVencidos',
      label: 'Días Vencidos',
      render: (_, row) => obtenerBadgeDiasVencidos(row.diasVencidos),
      sortable: true
    },
    {
      key: 'montoPendiente',
      label: 'Monto Pendiente',
      render: (_, row) => (
        <span className="font-medium text-red-600">
          {formatearMoneda(row.montoPendiente)}
        </span>
      ),
      align: 'right',
      sortable: true
    },
    {
      key: 'fechaVencimiento',
      label: 'Fecha Vencimiento',
      render: (_, row) => (
        <div className="text-sm">
          {row.fechaVencimiento.toLocaleDateString('es-ES')}
        </div>
      ),
      sortable: true
    },
    {
      key: 'vecesNotificada',
      label: 'Notificaciones',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-gray-500" />
          <span>{row.vecesNotificada}</span>
          {row.ultimaNotificacionEnviada && (
            <span className="text-xs text-gray-500">
              ({row.ultimaNotificacionEnviada.toLocaleDateString('es-ES')})
            </span>
          )}
        </div>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_, row) => (
        <Badge variant={row.estado === 'vencida' ? 'red' : 'yellow'} size="sm">
          {row.estado === 'vencida' ? 'Vencida' : row.estado === 'parcial' ? 'Parcial' : 'Pendiente'}
        </Badge>
      )
    }
  ];

  const metricas = [
    {
      title: 'Facturas Vencidas',
      value: estadisticas.totalFacturasVencidas.toString(),
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
      trend: null,
      color: 'red'
    },
    {
      title: 'Monto Total Vencido',
      value: formatearMoneda(estadisticas.montoTotalVencido),
      icon: <DollarSign className="w-5 h-5 text-orange-600" />,
      trend: null,
      color: 'orange'
    },
    {
      title: 'Promedio Días Vencidos',
      value: estadisticas.promedioDiasVencidos.toFixed(1),
      icon: <Calendar className="w-5 h-5 text-yellow-600" />,
      trend: null,
      color: 'yellow'
    },
    {
      title: 'Configuración',
      value: `${configuracion.diasVencimientoMinimo} días`,
      icon: <Settings className="w-5 h-5 text-blue-600" />,
      trend: null,
      color: 'blue'
    }
  ];

  const frecuenciaOptions: SelectOption[] = [
    { value: 'una_vez', label: 'Una vez' },
    { value: 'diaria', label: 'Diaria' },
    { value: 'semanal', label: 'Semanal' }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <MetricCards data={metricas} columns={4} />

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Facturas Vencidas</h2>
          <p className="text-sm text-gray-600 mt-1">
            Lista prioritaria de facturas con más de {configuracion.diasVencimientoMinimo} días vencidas
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setMostrarConfiguracion(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurar
          </Button>
          <Button
            variant="primary"
            onClick={handleEnviarNotificaciones}
            loading={enviandoNotificaciones}
            disabled={facturasVencidas.length === 0}
          >
            <Send className="w-4 h-4 mr-2" />
            Enviar Notificaciones
          </Button>
        </div>
      </div>

      {/* Tabla de facturas vencidas */}
      <Card className="p-0 bg-white shadow-sm">
        <Table
          data={facturasVencidas}
          columns={columnas}
          loading={loading}
          emptyMessage="No hay facturas vencidas que cumplan los criterios"
        />
      </Card>

      {/* Modal de configuración */}
      {mostrarConfiguracion && (
        <Modal
          isOpen={true}
          onClose={() => setMostrarConfiguracion(false)}
          title="Configurar Notificaciones de Facturas Vencidas"
          size="md"
          footer={
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setMostrarConfiguracion(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleGuardarConfiguracion}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Guardar Configuración
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Configura cómo y cuándo se envían las notificaciones para facturas vencidas.
              </p>
            </div>

            <Input
              label="Días Mínimos de Vencimiento"
              type="number"
              min="1"
              value={configuracion.diasVencimientoMinimo.toString()}
              onChange={(e) => setConfiguracion({
                ...configuracion,
                diasVencimientoMinimo: parseInt(e.target.value) || 7
              })}
              helperText="Número mínimo de días vencidos para considerar una factura como vencida"
            />

            <Select
              label="Frecuencia de Notificación"
              options={frecuenciaOptions}
              value={configuracion.frecuenciaNotificacion}
              onChange={(e) => setConfiguracion({
                ...configuracion,
                frecuenciaNotificacion: e.target.value as 'una_vez' | 'diaria' | 'semanal'
              })}
            />

            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={configuracion.notificarEnSistema}
                  onChange={(e) => setConfiguracion({
                    ...configuracion,
                    notificarEnSistema: e.target.checked
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Notificar en el sistema
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={configuracion.notificarPorEmail}
                  onChange={(e) => setConfiguracion({
                    ...configuracion,
                    notificarPorEmail: e.target.checked
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Enviar notificación por email
                </span>
              </label>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                <strong>Nota:</strong> Las notificaciones se enviarán automáticamente según la frecuencia configurada.
                También puedes enviarlas manualmente usando el botón "Enviar Notificaciones".
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};


