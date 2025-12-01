import React, { useState, useMemo, useEffect } from 'react';
import { AlertaVencimiento, AccionAlerta, PrioridadAlerta, ConfiguracionAlertas } from '../types';
import {
  Card,
  Button,
  Select,
  MetricCards,
  MetricCardData,
  Modal,
  Input,
  Badge
} from '../../../components/componentsreutilizables';
import {
  Bell,
  Check,
  X,
  Clock,
  Phone,
  Mail,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Eye,
  Settings,
  HelpCircle,
  Filter,
  XCircle,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  getConfiguracionAlertas,
  configurarDiasAnticipacion
} from '../api/alertas';

interface AlertasVencimientoProps {
  alertas: AlertaVencimiento[];
  onMarkAsRead: (alertaId: string) => Promise<void>;
  onProcessAlerta: (alertaId: string, accion: AccionAlerta) => Promise<void>;
  onDismissAlerta: (alertaId: string) => Promise<void>;
  onVerSuscripcion?: (suscripcionId: string) => void;
  loading?: boolean;
}

type FiltroPrioridad = 'todas' | 'alta' | 'media' | 'baja';
type FiltroEstado = 'todas' | 'leidas' | 'no-leidas';

interface FiltrosAlertas {
  prioridad: FiltroPrioridad;
  estado: FiltroEstado;
  diasMin: string;
  diasMax: string;
}

export const AlertasVencimiento: React.FC<AlertasVencimientoProps> = ({
  alertas,
  onMarkAsRead,
  onProcessAlerta,
  onDismissAlerta,
  onVerSuscripcion,
  loading = false,
}) => {
  const [filtros, setFiltros] = useState<FiltrosAlertas>({
    prioridad: 'todas',
    estado: 'todas',
    diasMin: '',
    diasMax: '',
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [mostrarAyuda, setMostrarAyuda] = useState(false);
  const [configuracion, setConfiguracion] = useState<ConfiguracionAlertas | null>(null);
  const [configGuardando, setConfigGuardando] = useState(false);
  const [configForm, setConfigForm] = useState({
    diasAnticipacion: 30,
    prioridadAltaUmbral: 7,
    prioridadMediaUmbral: 15,
  });

  // Cargar configuración al abrir el modal
  useEffect(() => {
    if (mostrarConfiguracion && !configuracion) {
      cargarConfiguracion();
    }
  }, [mostrarConfiguracion]);

  const cargarConfiguracion = async () => {
    try {
      const config = await getConfiguracionAlertas();
      setConfiguracion(config);
      setConfigForm({
        diasAnticipacion: config.diasAnticipacion,
        prioridadAltaUmbral: config.prioridadAltaUmbral,
        prioridadMediaUmbral: config.prioridadMediaUmbral,
      });
    } catch (error) {
      console.error('Error cargando configuración:', error);
    }
  };

  const handleGuardarConfiguracion = async () => {
    setConfigGuardando(true);
    try {
      await configurarDiasAnticipacion(configForm);
      await cargarConfiguracion();
      // Opcional: mostrar mensaje de éxito
    } catch (error) {
      console.error('Error guardando configuración:', error);
      alert('Error al guardar la configuración. Por favor, verifica los valores.');
    } finally {
      setConfigGuardando(false);
    }
  };

  // Filtrar y ordenar alertas
  const alertasFiltradasYOrdenadas = useMemo(() => {
    let filtradas = [...alertas];

    // Aplicar filtro de prioridad
    if (filtros.prioridad !== 'todas') {
      filtradas = filtradas.filter(a => a.prioridad === filtros.prioridad);
    }

    // Aplicar filtro de estado
    if (filtros.estado === 'leidas') {
      filtradas = filtradas.filter(a => a.leida);
    } else if (filtros.estado === 'no-leidas') {
      filtradas = filtradas.filter(a => !a.leida);
    }

    // Aplicar filtro de días restantes
    if (filtros.diasMin) {
      const min = parseInt(filtros.diasMin);
      if (!isNaN(min)) {
        filtradas = filtradas.filter(a => a.diasRestantes >= min);
      }
    }
    if (filtros.diasMax) {
      const max = parseInt(filtros.diasMax);
      if (!isNaN(max)) {
        filtradas = filtradas.filter(a => a.diasRestantes <= max);
      }
    }

    // Ordenar por prioridad (alta > media > baja) y luego por días restantes (ascendente)
    const ordenPrioridad = { alta: 1, media: 2, baja: 3 };
    filtradas.sort((a, b) => {
      const diffPrioridad = ordenPrioridad[a.prioridad] - ordenPrioridad[b.prioridad];
      if (diffPrioridad !== 0) return diffPrioridad;
      return a.diasRestantes - b.diasRestantes;
    });

    return filtradas;
  }, [alertas, filtros]);

  // Calcular métricas
  const metricas = useMemo(() => {
    const total = alertas.length;
    const noLeidas = alertas.filter(a => !a.leida).length;
    const urgentes = alertas.filter(a => a.prioridad === 'alta').length;
    const porVencer = alertas.filter(a => a.diasRestantes <= 7).length;

    return {
      total,
      noLeidas,
      urgentes,
      porVencer,
    };
  }, [alertas]);

  const metricCards: MetricCardData[] = [
    {
      id: 'total-alertas',
      title: 'Total Alertas',
      value: metricas.total.toString(),
      subtitle: 'Alertas activas',
      color: 'info',
      icon: <Bell className="w-6 h-6" />,
    },
    {
      id: 'no-leidas',
      title: 'No Leídas',
      value: metricas.noLeidas.toString(),
      subtitle: 'Pendientes de revisar',
      color: 'warning',
      icon: <Eye className="w-6 h-6" />,
    },
    {
      id: 'urgentes',
      title: 'Urgentes',
      value: metricas.urgentes.toString(),
      subtitle: 'Alta prioridad',
      color: 'error',
      icon: <AlertTriangle className="w-6 h-6" />,
    },
    {
      id: 'por-vencer',
      title: 'Por Vencer',
      value: metricas.porVencer.toString(),
      subtitle: 'Menos de 7 días',
      color: metricas.porVencer > 5 ? 'error' : 'warning',
      icon: <Clock className="w-6 h-6" />,
    },
  ];

  const getPrioridadColor = (prioridad: PrioridadAlerta) => {
    switch (prioridad) {
      case 'alta':
        return 'border-red-500 bg-red-50';
      case 'media':
        return 'border-yellow-500 bg-yellow-50';
      case 'baja':
        return 'border-green-500 bg-green-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getPrioridadBadge = (prioridad: PrioridadAlerta) => {
    const prioridades = {
      alta: { bg: 'bg-red-100 text-red-800 border-red-200', text: 'Urgente', icon: <AlertTriangle size={14} /> },
      media: { bg: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Media', icon: <Clock size={14} /> },
      baja: { bg: 'bg-green-100 text-green-800 border-green-200', text: 'Baja', icon: <Check size={14} /> },
    };
    const pri = prioridades[prioridad];
    return (
      <Badge
        variant={prioridad === 'alta' ? 'red' : prioridad === 'media' ? 'yellow' : 'green'}
        className="flex items-center gap-1.5 px-2.5 py-1"
      >
        {pri.icon}
        {pri.text}
      </Badge>
    );
  };

  const getDiasRestantesBadge = (dias: number) => {
    if (dias <= 3) {
      return (
        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-100 text-red-800 border border-red-200">
          {dias} {dias === 1 ? 'día' : 'días'}
        </span>
      );
    } else if (dias <= 7) {
      return (
        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
          {dias} días
        </span>
      );
    } else if (dias <= 15) {
      return (
        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
          {dias} días
        </span>
      );
    } else {
      return (
        <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          {dias} días
        </span>
      );
    }
  };

  const limpiarFiltros = () => {
    setFiltros({
      prioridad: 'todas',
      estado: 'todas',
      diasMin: '',
      diasMax: '',
    });
  };

  const tieneFiltrosActivos = filtros.prioridad !== 'todas' ||
    filtros.estado !== 'todas' ||
    filtros.diasMin !== '' ||
    filtros.diasMax !== '';

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando alertas...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <MetricCards data={metricCards} columns={4} />

      {/* Toolbar Superior */}
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="flex items-center gap-2"
            >
              <Filter size={18} />
              Filtros
              {tieneFiltrosActivos && (
                <span className="ml-1 px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                  {[
                    filtros.prioridad !== 'todas' ? 1 : 0,
                    filtros.estado !== 'todas' ? 1 : 0,
                    filtros.diasMin !== '' ? 1 : 0,
                    filtros.diasMax !== '' ? 1 : 0,
                  ].reduce((a, b) => a + b, 0)}
                </span>
              )}
            </Button>
            {tieneFiltrosActivos && (
              <Button
                variant="ghost"
                size="sm"
                onClick={limpiarFiltros}
                className="flex items-center gap-2 text-gray-600"
              >
                <XCircle size={18} />
                Limpiar
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMostrarAyuda(true)}
              className="flex items-center gap-2"
            >
              <HelpCircle size={18} />
              Ayuda
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setMostrarConfiguracion(true)}
              className="flex items-center gap-2"
            >
              <Settings size={18} />
              Configuración
            </Button>
          </div>
        </div>

        {/* Panel de Filtros Expandible */}
        {mostrarFiltros && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad
                </label>
                <Select
                  value={filtros.prioridad}
                  onChange={(e) => setFiltros({ ...filtros, prioridad: e.target.value as FiltroPrioridad })}
                  options={[
                    { value: 'todas', label: 'Todas' },
                    { value: 'alta', label: 'Alta' },
                    { value: 'media', label: 'Media' },
                    { value: 'baja', label: 'Baja' },
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <Select
                  value={filtros.estado}
                  onChange={(e) => setFiltros({ ...filtros, estado: e.target.value as FiltroEstado })}
                  options={[
                    { value: 'todas', label: 'Todas' },
                    { value: 'no-leidas', label: 'No Leídas' },
                    { value: 'leidas', label: 'Leídas' },
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Días Mínimos
                </label>
                <Input
                  type="number"
                  placeholder="Ej: 0"
                  value={filtros.diasMin}
                  onChange={(e) => setFiltros({ ...filtros, diasMin: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Días Máximos
                </label>
                <Input
                  type="number"
                  placeholder="Ej: 30"
                  value={filtros.diasMax}
                  onChange={(e) => setFiltros({ ...filtros, diasMax: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Lista de Alertas */}
      <div className="space-y-4">
        {alertasFiltradasYOrdenadas.length === 0 ? (
          <Card className="p-8 text-center bg-white shadow-sm">
            <Bell size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay alertas disponibles</h3>
            <p className="text-gray-600">
              {tieneFiltrosActivos
                ? 'No se encontraron alertas con los filtros seleccionados.'
                : 'No hay alertas de vencimiento en este momento.'}
            </p>
            {tieneFiltrosActivos && (
              <Button
                variant="secondary"
                size="sm"
                onClick={limpiarFiltros}
                className="mt-4"
              >
                Limpiar filtros
              </Button>
            )}
          </Card>
        ) : (
          alertasFiltradasYOrdenadas.map(alerta => (
            <Card
              key={alerta.id}
              variant="hover"
              className={`p-6 bg-white shadow-sm border-l-4 ${!alerta.leida ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                } ${getPrioridadColor(alerta.prioridad)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <Bell className={`w-5 h-5 ${alerta.leida ? 'text-gray-400' : 'text-blue-600'}`} />
                    <h3 className="font-semibold text-lg text-gray-900">
                      {alerta.cliente?.nombre || `Cliente ${alerta.clienteId}`}
                    </h3>
                    {getPrioridadBadge(alerta.prioridad)}
                    {getDiasRestantesBadge(alerta.diasRestantes)}
                    {!alerta.leida && (
                      <Badge variant="blue" className="flex items-center gap-1">
                        <Eye size={12} />
                        Nueva
                      </Badge>
                    )}
                  </div>
                  {alerta.mensaje && (
                    <p className="text-gray-700 mb-3">{alerta.mensaje}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <Clock size={16} />
                      Vence: {new Date(alerta.fechaVencimiento).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    {alerta.cliente?.email && (
                      <span className="flex items-center gap-1.5">
                        <Mail size={16} />
                        {alerta.cliente.email}
                      </span>
                    )}
                    {alerta.canalPreferido !== 'ninguno' && (
                      <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                        Canal: {alerta.canalPreferido}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 flex-wrap">
                {!alerta.leida && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onMarkAsRead(alerta.id)}
                    className="flex items-center gap-2"
                  >
                    <Check size={16} />
                    Marcar como Leída
                  </Button>
                )}
                {onVerSuscripcion && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onVerSuscripcion(alerta.suscripcionId)}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink size={16} />
                    Ver Suscripción
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onProcessAlerta(alerta.id, 'renovar')}
                  className="flex items-center gap-2"
                >
                  <Check size={16} />
                  Renovar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onProcessAlerta(alerta.id, 'contactar')}
                  className="flex items-center gap-2"
                >
                  <Phone size={16} />
                  Contactar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDismissAlerta(alerta.id)}
                  className="flex items-center gap-2 text-gray-500"
                >
                  <X size={16} />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal de Configuración */}
      <Modal
        isOpen={mostrarConfiguracion}
        onClose={() => setMostrarConfiguracion(false)}
        title="Configuración de Alertas"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setMostrarConfiguracion(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleGuardarConfiguracion}
              loading={configGuardando}
            >
              Guardar Configuración
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Configuración de Anticipación</p>
                <p>
                  Define cuántos días antes del vencimiento se generan las alertas y los umbrales
                  de prioridad. Las alertas se clasifican automáticamente según estos valores.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Días de Anticipación
              </label>
              <Input
                type="number"
                min="1"
                max="365"
                value={configForm.diasAnticipacion}
                onChange={(e) => setConfigForm({
                  ...configForm,
                  diasAnticipacion: parseInt(e.target.value) || 30
                })}
              />
              <p className="mt-1 text-xs text-gray-500">
                Días antes del vencimiento en que se generan las alertas (1-365)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Umbral Prioridad Alta (días)
              </label>
              <Input
                type="number"
                min="0"
                value={configForm.prioridadAltaUmbral}
                onChange={(e) => setConfigForm({
                  ...configForm,
                  prioridadAltaUmbral: parseInt(e.target.value) || 7
                })}
              />
              <p className="mt-1 text-xs text-gray-500">
                Alertas con {configForm.prioridadAltaUmbral} días o menos = Prioridad Alta
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Umbral Prioridad Media (días)
              </label>
              <Input
                type="number"
                min={configForm.prioridadAltaUmbral}
                value={configForm.prioridadMediaUmbral}
                onChange={(e) => setConfigForm({
                  ...configForm,
                  prioridadMediaUmbral: parseInt(e.target.value) || 15
                })}
              />
              <p className="mt-1 text-xs text-gray-500">
                Alertas entre {configForm.prioridadAltaUmbral + 1} y {configForm.prioridadMediaUmbral} días = Prioridad Media
              </p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal de Ayuda */}
      <Modal
        isOpen={mostrarAyuda}
        onClose={() => setMostrarAyuda(false)}
        title="Guía de Alertas de Vencimiento"
        size="lg"
        footer={
          <Button variant="primary" onClick={() => setMostrarAyuda(false)}>
            Entendido
          </Button>
        }
      >
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Sistema de Prioridades
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex-shrink-0 mt-0.5">
                  <Badge variant="red">Urgente</Badge>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-red-900">Prioridad Alta</p>
                  <p className="text-sm text-red-700">
                    Suscripciones que vencen en 7 días o menos. Requieren acción inmediata para evitar
                    la pérdida del cliente. Impacto operativo: Crítico - riesgo alto de churn.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex-shrink-0 mt-0.5">
                  <Badge variant="yellow">Media</Badge>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-yellow-900">Prioridad Media</p>
                  <p className="text-sm text-yellow-700">
                    Suscripciones que vencen entre 8 y 15 días. Planificar contacto y renovación.
                    Impacto operativo: Moderado - tiempo suficiente para acciones preventivas.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex-shrink-0 mt-0.5">
                  <Badge variant="green">Baja</Badge>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-green-900">Prioridad Baja</p>
                  <p className="text-sm text-green-700">
                    Suscripciones que vencen en más de 15 días. Monitoreo rutinario.
                    Impacto operativo: Bajo - oportunidad de planificación proactiva.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Contador de Días Restantes
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                El contador muestra los días restantes hasta el vencimiento con códigos de color:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><span className="font-semibold text-red-600">Rojo (≤3 días):</span> Crítico - acción urgente</li>
                <li><span className="font-semibold text-orange-600">Naranja (4-7 días):</span> Importante - atención prioritaria</li>
                <li><span className="font-semibold text-yellow-600">Amarillo (8-15 días):</span> Moderado - planificar contacto</li>
                <li><span className="font-semibold text-blue-600">Azul (&gt;15 días):</span> Normal - seguimiento rutinario</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-purple-500" />
              Impacto en la Operativa Diaria
            </h3>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-900 mb-2">
                <strong>Gestión proactiva de renovaciones:</strong>
              </p>
              <ul className="text-sm text-purple-800 space-y-1 list-disc list-inside">
                <li>Reduce la tasa de churn al anticipar vencimientos</li>
                <li>Permite planificar campañas de retención segmentadas</li>
                <li>Optimiza el flujo de trabajo del equipo de atención al cliente</li>
                <li>Mejora la experiencia del cliente con recordatorios oportunos</li>
                <li>Facilita la identificación de patrones de renovación</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-500" />
              Acciones Disponibles
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Marcar como Leída:</strong> Marca la alerta como revisada sin procesarla.</p>
              <p><strong>Ver Suscripción:</strong> Navega al detalle de la suscripción para más información.</p>
              <p><strong>Renovar:</strong> Inicia el proceso de renovación de la suscripción.</p>
              <p><strong>Contactar:</strong> Abre opciones para contactar al cliente.</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
