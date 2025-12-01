import React, { useState, useEffect, useMemo } from 'react';
import { Baja, MotivoBaja, FiltrosBajas, EstadisticasBajas } from '../types';
import { getBajas, registrarBaja, actualizarIntentoRetencion, getMotivosBaja, getEstadisticasBajas } from '../api/bajas';
import { 
  Card, 
  Button, 
  Input, 
  Select, 
  Table, 
  Modal, 
  Textarea,
  Badge,
  MetricCards,
} from '../../../components/componentsreutilizables';
import type { TableColumn, MetricCardData, SelectOption } from '../../../components/componentsreutilizables';
import { 
  Plus, 
  Search, 
  Filter, 
  X, 
  Check, 
  AlertTriangle,
  Calendar,
  TrendingDown,
  Users,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronRight,
  ChevronLeft,
  User,
  FileText,
  Target,
  MessageSquare,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface GestorBajasProps {
  role?: 'entrenador' | 'gimnasio';
  onError?: (errorMessage: string) => void;
}

// Tipos para el wizard
interface WizardStep1Data {
  clienteId: string;
  clienteNombre?: string;
  clienteEmail?: string;
  suscripcionId?: string;
  suscripcionNombre?: string;
  fechaVencimientoSuscripcion?: string;
}

interface WizardStep2Data {
  motivoPrincipalId: string;
  otrosMotivosIds: string[];
}

interface WizardStep3Data {
  tipoEfecto: 'inmediata' | 'fin_periodo';
  intentoRetencionRealizado: boolean;
  ofertaRetencion?: string;
  resultadoRetencion?: 'retenido' | 'no_retenido';
}

interface WizardStep4Data {
  comentarios?: string;
}

interface NuevaBajaWizardData {
  paso1: WizardStep1Data;
  paso2: WizardStep2Data;
  paso3: WizardStep3Data;
  paso4: WizardStep4Data;
}

export const GestorBajas: React.FC<GestorBajasProps> = ({ 
  role = 'gimnasio',
  onError 
}) => {
  const [bajas, setBajas] = useState<Baja[]>([]);
  const [motivosBaja, setMotivosBaja] = useState<MotivoBaja[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasBajas | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMetricas, setLoadingMetricas] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para filtros
  const [filtros, setFiltros] = useState<FiltrosBajas>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para el wizard
  const [showWizard, setShowWizard] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<NuevaBajaWizardData>({
    paso1: {
      clienteId: '',
    },
    paso2: {
      motivoPrincipalId: '',
      otrosMotivosIds: [],
    },
    paso3: {
      tipoEfecto: 'fin_periodo',
      intentoRetencionRealizado: false,
    },
    paso4: {},
  });
  const [saving, setSaving] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
    loadMetricas();
    loadMotivos();
  }, [filtros]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBajas(filtros);
      setBajas(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'No se pudieron cargar las bajas';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMotivos = async () => {
    try {
      const data = await getMotivosBaja();
      setMotivosBaja(data);
    } catch (err) {
      console.error('Error loading motivos:', err);
    }
  };

  const loadMetricas = async () => {
    setLoadingMetricas(true);
    try {
      const ahora = new Date();
      const stats = await getEstadisticasBajas({
        anio: ahora.getFullYear(),
        mes: ahora.getMonth() + 1,
      });
      setEstadisticas(stats);
    } catch (err) {
      console.error('Error loading metricas:', err);
    } finally {
      setLoadingMetricas(false);
    }
  };

  // Filtrar bajas por término de búsqueda
  const bajasFiltradas = useMemo(() => {
    let resultado = [...bajas];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      // Aquí se podría buscar por cliente si tuvieras datos completos del cliente
      resultado = resultado.filter(baja => 
        baja.id.toLowerCase().includes(term) ||
        baja.clienteId.toLowerCase().includes(term) ||
        (baja.comentarios || '').toLowerCase().includes(term)
      );
    }

    return resultado;
  }, [bajas, searchTerm]);

  // Métricas para las tarjetas
  const metricCards: MetricCardData[] = useMemo(() => {
    if (!estadisticas) {
      return [
        {
          id: 'total-bajas',
          title: 'Total Bajas',
          value: '0',
          subtitle: 'En el período',
          color: 'error',
          icon: <TrendingDown className="w-6 h-6" />,
        },
        {
          id: 'tasa-intento',
          title: 'Intento Retención',
          value: '0%',
          subtitle: 'Bajas con intento',
          color: 'warning',
          icon: <Target className="w-6 h-6" />,
        },
        {
          id: 'tasa-exitosa',
          title: 'Retención Exitosa',
          value: '0%',
          subtitle: 'Clientes retenidos',
          color: 'success',
          icon: <CheckCircle2 className="w-6 h-6" />,
        },
      ];
    }

    return [
      {
        id: 'total-bajas',
        title: 'Total Bajas',
        value: estadisticas.totalBajas.toString(),
        subtitle: `Inmediatas: ${estadisticas.bajasInmediatas} | Fin período: ${estadisticas.bajasFinPeriodo}`,
        color: 'error',
        icon: <TrendingDown className="w-6 h-6" />,
      },
      {
        id: 'tasa-intento',
        title: 'Intento Retención',
        value: `${estadisticas.tasaRetencionIntentada.toFixed(1)}%`,
        subtitle: 'Bajas con intento de retención',
        color: 'warning',
        icon: <Target className="w-6 h-6" />,
      },
      {
        id: 'tasa-exitosa',
        title: 'Retención Exitosa',
        value: `${estadisticas.tasaRetencionExitosa.toFixed(1)}%`,
        subtitle: 'Clientes retenidos exitosamente',
        color: estadisticas.tasaRetencionExitosa > 50 ? 'success' : 'warning',
        icon: <CheckCircle2 className="w-6 h-6" />,
      },
    ];
  }, [estadisticas]);

  // Handlers del wizard
  const handleOpenWizard = () => {
    setShowWizard(true);
    setCurrentStep(1);
    setWizardData({
      paso1: { clienteId: '' },
      paso2: { motivoPrincipalId: '', otrosMotivosIds: [] },
      paso3: { tipoEfecto: 'fin_periodo', intentoRetencionRealizado: false },
      paso4: {},
    });
  };

  const handleCloseWizard = () => {
    if (!saving) {
      setShowWizard(false);
      setCurrentStep(1);
    }
  };

  const handleNextStep = () => {
    // Validaciones por paso
    if (currentStep === 1) {
      if (!wizardData.paso1.clienteId) {
        setError('Debe seleccionar un cliente');
        return;
      }
    } else if (currentStep === 2) {
      if (!wizardData.paso2.motivoPrincipalId) {
        setError('Debe seleccionar un motivo principal');
        return;
      }
    } else if (currentStep === 3) {
      if (wizardData.paso3.intentoRetencionRealizado && !wizardData.paso3.resultadoRetencion) {
        setError('Si se realizó un intento de retención, debe indicar el resultado');
        return;
      }
    }

    setError(null);
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const handleSaveBaja = async () => {
    setSaving(true);
    setError(null);
    try {
      const fechaActual = new Date().toISOString();
      const fechaEfectiva = wizardData.paso3.tipoEfecto === 'inmediata' 
        ? fechaActual
        : wizardData.paso1.fechaVencimientoSuscripcion || fechaActual;

      // Crear la baja
      const nuevaBaja = await registrarBaja({
        clienteId: wizardData.paso1.clienteId,
        suscripcionId: wizardData.paso1.suscripcionId,
        fechaSolicitud: fechaActual,
        fechaEfectiva: fechaEfectiva,
        tipoEfecto: wizardData.paso3.tipoEfecto,
        motivoPrincipalId: wizardData.paso2.motivoPrincipalId,
        otrosMotivosIds: wizardData.paso2.otrosMotivosIds.length > 0 
          ? wizardData.paso2.otrosMotivosIds 
          : undefined,
        intentoRetencionRealizado: wizardData.paso3.intentoRetencionRealizado,
        resultadoRetencion: wizardData.paso3.resultadoRetencion,
        comentarios: wizardData.paso4.comentarios || wizardData.paso3.ofertaRetencion || undefined,
      });

      // Si se realizó intento de retención y no se registró resultado en el paso 3, actualizar
      if (wizardData.paso3.intentoRetencionRealizado && wizardData.paso3.resultadoRetencion) {
        await actualizarIntentoRetencion(
          nuevaBaja.id,
          wizardData.paso3.resultadoRetencion,
          wizardData.paso4.comentarios || wizardData.paso3.ofertaRetencion
        );
      }

      // Recargar datos
      await loadData();
      await loadMetricas();
      
      // Cerrar wizard
      setShowWizard(false);
      setCurrentStep(1);
      setWizardData({
        paso1: { clienteId: '' },
        paso2: { motivoPrincipalId: '', otrosMotivosIds: [] },
        paso3: { tipoEfecto: 'fin_periodo', intentoRetencionRealizado: false },
        paso4: {},
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar la baja';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  // Columnas de la tabla
  const columns: TableColumn<Baja>[] = [
    {
      key: 'clienteId',
      label: 'Cliente',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{row.clienteId}</span>
        </div>
      ),
    },
    {
      key: 'fechaSolicitud',
      label: 'Fecha Solicitud',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{new Date(row.fechaSolicitud).toLocaleDateString('es-ES')}</span>
        </div>
      ),
    },
    {
      key: 'tipoEfecto',
      label: 'Tipo Efecto',
      render: (_, row) => (
        <Badge variant={row.tipoEfecto === 'inmediata' ? 'red' : 'yellow'}>
          {row.tipoEfecto === 'inmediata' ? 'Inmediata' : 'Fin Período'}
        </Badge>
      ),
    },
    {
      key: 'motivoPrincipalId',
      label: 'Motivo',
      render: (_, row) => {
        const motivo = motivosBaja.find(m => m.id === row.motivoPrincipalId);
        return (
          <div>
            <span className="font-medium">{motivo?.descripcion || row.motivoPrincipalId}</span>
            {row.otrosMotivosIds && row.otrosMotivosIds.length > 0 && (
              <span className="text-xs text-gray-500 ml-2">
                +{row.otrosMotivosIds.length} más
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'resultadoRetencion',
      label: 'Retención',
      render: (_, row) => {
        if (!row.intentoRetencionRealizado) {
          return <span className="text-gray-400">Sin intento</span>;
        }
        if (row.resultadoRetencion === 'retenido') {
          return (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>Retenido</span>
            </div>
          );
        }
        return (
          <div className="flex items-center gap-1 text-red-600">
            <XCircle className="w-4 h-4" />
            <span>No retenido</span>
          </div>
        );
      },
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, row) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            // Aquí se podría abrir un modal de detalles
            console.log('Ver detalles de baja:', row.id);
          }}
        >
          Ver detalles
        </Button>
      ),
    },
  ];

  // Opciones de motivos para el select
  const motivosOptions: SelectOption[] = useMemo(() => {
    return motivosBaja.map(motivo => ({
      value: motivo.id,
      label: motivo.descripcion,
    }));
  }, [motivosBaja]);

  // Renderizar paso del wizard
  const renderWizardStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Datos del Cliente y Suscripción</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente ID <span className="text-red-500">*</span>
                </label>
                <Input
                  value={wizardData.paso1.clienteId}
                  onChange={(e) => setWizardData({
                    ...wizardData,
                    paso1: { ...wizardData.paso1, clienteId: e.target.value }
                  })}
                  placeholder="Ingrese el ID del cliente"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Buscar por ID de cliente (en producción, aquí habría un autocomplete)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suscripción ID (opcional)
                </label>
                <Input
                  value={wizardData.paso1.suscripcionId || ''}
                  onChange={(e) => setWizardData({
                    ...wizardData,
                    paso1: { ...wizardData.paso1, suscripcionId: e.target.value || undefined }
                  })}
                  placeholder="ID de la suscripción afectada"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Vencimiento de Suscripción (opcional)
                </label>
                <Input
                  type="date"
                  value={wizardData.paso1.fechaVencimientoSuscripcion || ''}
                  onChange={(e) => setWizardData({
                    ...wizardData,
                    paso1: { 
                      ...wizardData.paso1, 
                      fechaVencimientoSuscripcion: e.target.value || undefined 
                    }
                  })}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Necesario si la baja es al final del período
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Motivos de la Baja</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo Principal <span className="text-red-500">*</span>
                </label>
                <Select
                  options={motivosOptions}
                  value={wizardData.paso2.motivoPrincipalId}
                  onChange={(e) => setWizardData({
                    ...wizardData,
                    paso2: { ...wizardData.paso2, motivoPrincipalId: e.target.value }
                  })}
                  placeholder="Seleccione el motivo principal"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivos Secundarios (opcional)
                </label>
                <Select
                  options={motivosOptions.filter(m => m.value !== wizardData.paso2.motivoPrincipalId)}
                  value=""
                  onChange={(e) => {
                    if (e.target.value && !wizardData.paso2.otrosMotivosIds.includes(e.target.value)) {
                      setWizardData({
                        ...wizardData,
                        paso2: {
                          ...wizardData.paso2,
                          otrosMotivosIds: [...wizardData.paso2.otrosMotivosIds, e.target.value]
                        }
                      });
                    }
                  }}
                  placeholder="Agregar motivo secundario"
                />
                {wizardData.paso2.otrosMotivosIds.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {wizardData.paso2.otrosMotivosIds.map((motivoId) => {
                      const motivo = motivosBaja.find(m => m.id === motivoId);
                      return (
                        <Badge
                          key={motivoId}
                          variant="blue"
                          className="flex items-center gap-1"
                        >
                          {motivo?.descripcion || motivoId}
                          <button
                            onClick={() => setWizardData({
                              ...wizardData,
                              paso2: {
                                ...wizardData.paso2,
                                otrosMotivosIds: wizardData.paso2.otrosMotivosIds.filter(id => id !== motivoId)
                              }
                            })}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Tipo de Efecto e Intento de Retención</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Efecto <span className="text-red-500">*</span>
                </label>
                <Select
                  options={[
                    { value: 'inmediata', label: 'Baja Inmediata' },
                    { value: 'fin_periodo', label: 'Baja al Final del Período' },
                  ]}
                  value={wizardData.paso3.tipoEfecto}
                  onChange={(e) => setWizardData({
                    ...wizardData,
                    paso3: {
                      ...wizardData.paso3,
                      tipoEfecto: e.target.value as 'inmediata' | 'fin_periodo'
                    }
                  })}
                />
                
                {/* Avisos según el tipo de efecto */}
                {wizardData.paso3.tipoEfecto === 'inmediata' && (
                  <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-900 mb-1">Aviso: Baja Inmediata</h4>
                        <p className="text-sm text-red-800">
                          La baja se aplicará inmediatamente. El cliente perderá acceso a todos los servicios ahora mismo.
                          Verifique que el cliente comprenda las consecuencias antes de confirmar.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {wizardData.paso3.tipoEfecto === 'fin_periodo' && (
                  <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Baja al Final del Período</h4>
                        <p className="text-sm text-blue-800">
                          La baja se aplicará al finalizar el período actual de la suscripción. 
                          El cliente mantendrá acceso hasta entonces.
                          {!wizardData.paso1.fechaVencimientoSuscripcion && (
                            <span className="font-semibold block mt-1">
                              Asegúrese de haber ingresado la fecha de vencimiento en el paso anterior.
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Se realizó un intento de retención?
                </label>
                <div className="flex gap-4">
                  <Button
                    variant={wizardData.paso3.intentoRetencionRealizado ? 'primary' : 'secondary'}
                    onClick={() => setWizardData({
                      ...wizardData,
                      paso3: {
                        ...wizardData.paso3,
                        intentoRetencionRealizado: true
                      }
                    })}
                  >
                    Sí
                  </Button>
                  <Button
                    variant={!wizardData.paso3.intentoRetencionRealizado ? 'primary' : 'secondary'}
                    onClick={() => setWizardData({
                      ...wizardData,
                      paso3: {
                        ...wizardData.paso3,
                        intentoRetencionRealizado: false,
                        resultadoRetencion: undefined,
                        ofertaRetencion: undefined,
                      }
                    })}
                  >
                    No
                  </Button>
                </div>
              </div>

              {wizardData.paso3.intentoRetencionRealizado && (
                <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Oferta de Retención
                    </label>
                    <Textarea
                      value={wizardData.paso3.ofertaRetencion || ''}
                      onChange={(e) => setWizardData({
                        ...wizardData,
                        paso3: {
                          ...wizardData.paso3,
                          ofertaRetencion: e.target.value
                        }
                      })}
                      placeholder="Describe la oferta realizada al cliente (descuento, plan alternativo, etc.)"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resultado del Intento <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4">
                      <Button
                        variant={wizardData.paso3.resultadoRetencion === 'retenido' ? 'primary' : 'secondary'}
                        onClick={() => setWizardData({
                          ...wizardData,
                          paso3: {
                            ...wizardData.paso3,
                            resultadoRetencion: 'retenido'
                          }
                        })}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Retenido
                      </Button>
                      <Button
                        variant={wizardData.paso3.resultadoRetencion === 'no_retenido' ? 'primary' : 'secondary'}
                        onClick={() => setWizardData({
                          ...wizardData,
                          paso3: {
                            ...wizardData.paso3,
                            resultadoRetencion: 'no_retenido'
                          }
                        })}
                        className="flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        No Retenido
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Confirmación y Resumen</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3">Resumen de la Baja</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cliente:</span>
                    <span className="font-medium">{wizardData.paso1.clienteId}</span>
                  </div>
                  {wizardData.paso1.suscripcionId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Suscripción:</span>
                      <span className="font-medium">{wizardData.paso1.suscripcionId}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo de Efecto:</span>
                    <Badge variant={wizardData.paso3.tipoEfecto === 'inmediata' ? 'red' : 'yellow'}>
                      {wizardData.paso3.tipoEfecto === 'inmediata' ? 'Inmediata' : 'Fin Período'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Motivo Principal:</span>
                    <span className="font-medium">
                      {motivosBaja.find(m => m.id === wizardData.paso2.motivoPrincipalId)?.descripcion || wizardData.paso2.motivoPrincipalId}
                    </span>
                  </div>
                  {wizardData.paso2.otrosMotivosIds.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Motivos Secundarios:</span>
                      <span className="font-medium">{wizardData.paso2.otrosMotivosIds.length}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Intento de Retención:</span>
                    <span className="font-medium">
                      {wizardData.paso3.intentoRetencionRealizado ? 'Sí' : 'No'}
                    </span>
                  </div>
                  {wizardData.paso3.intentoRetencionRealizado && wizardData.paso3.resultadoRetencion && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Resultado:</span>
                      <Badge variant={wizardData.paso3.resultadoRetencion === 'retenido' ? 'green' : 'red'}>
                        {wizardData.paso3.resultadoRetencion === 'retenido' ? 'Retenido' : 'No Retenido'}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentarios Adicionales (opcional)
                </label>
                <Textarea
                  value={wizardData.paso4.comentarios || ''}
                  onChange={(e) => setWizardData({
                    ...wizardData,
                    paso4: { ...wizardData.paso4, comentarios: e.target.value }
                  })}
                  placeholder="Notas adicionales sobre la baja..."
                  rows={4}
                />
              </div>

              {/* Aviso final */}
              {wizardData.paso3.tipoEfecto === 'inmediata' && (
                <div className="p-4 bg-red-50 border border-red-300 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900 mb-1">Confirmación Requerida</h4>
                      <p className="text-sm text-red-800">
                        Está a punto de registrar una baja inmediata. El cliente perderá acceso inmediatamente.
                        ¿Está seguro de continuar?
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <MetricCards data={metricCards} columns={3} />

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button onClick={handleOpenWizard} variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Registrar Nueva Baja
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button variant="secondary" onClick={loadData}>
            <Loader2 className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <Card className="p-4 bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Desde
              </label>
              <Input
                type="date"
                value={filtros.fechaDesde || ''}
                onChange={(e) => setFiltros({
                  ...filtros,
                  fechaDesde: e.target.value || undefined
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Hasta
              </label>
              <Input
                type="date"
                value={filtros.fechaHasta || ''}
                onChange={(e) => setFiltros({
                  ...filtros,
                  fechaHasta: e.target.value || undefined
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resultado Retención
              </label>
              <Select
                options={[
                  { value: '', label: 'Todos' },
                  { value: 'retenido', label: 'Retenidos' },
                  { value: 'no_retenido', label: 'No Retenidos' },
                ]}
                value={filtros.resultadoRetencion || ''}
                onChange={(e) => setFiltros({
                  ...filtros,
                  resultadoRetencion: e.target.value as 'retenido' | 'no_retenido' | undefined || undefined
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Efecto
              </label>
              <Select
                options={[
                  { value: '', label: 'Todos' },
                  { value: 'inmediata', label: 'Inmediata' },
                  { value: 'fin_periodo', label: 'Fin Período' },
                ]}
                value={filtros.tipoEfecto || ''}
                onChange={(e) => setFiltros({
                  ...filtros,
                  tipoEfecto: e.target.value as 'inmediata' | 'fin_periodo' | undefined || undefined
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo Principal
              </label>
              <Select
                options={[
                  { value: '', label: 'Todos' },
                  ...motivosOptions,
                ]}
                value={filtros.motivoPrincipalId || ''}
                onChange={(e) => setFiltros({
                  ...filtros,
                  motivoPrincipalId: e.target.value || undefined
                })}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setFiltros({});
                setSearchTerm('');
              }}
            >
              Limpiar Filtros
            </Button>
          </div>
        </Card>
      )}

      {/* Búsqueda */}
      <Card className="p-4 bg-white shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por ID de cliente, ID de baja o comentarios..."
            className="pl-10"
          />
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {bajasFiltradas.length} baja{bajasFiltradas.length !== 1 ? 's' : ''} encontrada{bajasFiltradas.length !== 1 ? 's' : ''}
        </div>
      </Card>

      {/* Tabla de Bajas */}
      <Card className="p-0 bg-white shadow-sm">
        <Table
          data={bajasFiltradas}
          columns={columns}
          loading={loading}
          emptyMessage="No hay bajas registradas"
        />
      </Card>

      {/* Modal del Wizard */}
      <Modal
        isOpen={showWizard}
        onClose={handleCloseWizard}
        title={`Registrar Nueva Baja - Paso ${currentStep} de 4`}
        size="xl"
        closeOnOverlayClick={!saving}
        closeOnEscape={!saving}
        footer={
          <div className="flex items-center justify-between w-full">
            <Button
              variant="secondary"
              onClick={handlePreviousStep}
              disabled={currentStep === 1 || saving}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={handleCloseWizard}
                disabled={saving}
              >
                Cancelar
              </Button>
              {currentStep < 4 ? (
                <Button
                  variant="primary"
                  onClick={handleNextStep}
                  disabled={saving}
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleSaveBaja}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Confirmar y Registrar
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        }
      >
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Indicador de progreso */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex-1 flex items-center ${
                  step < 4 ? 'pr-2' : ''
                }`}
              >
                <div className="flex items-center w-full">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      step < currentStep
                        ? 'bg-green-500 text-white'
                        : step === currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step < currentStep ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Datos Cliente</span>
            <span>Motivos</span>
            <span>Retención</span>
            <span>Confirmación</span>
          </div>
        </div>

        {renderWizardStep()}
      </Modal>
    </div>
  );
};
