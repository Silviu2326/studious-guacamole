import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../../../components/componentsreutilizables';
import {
  RenovacionesManager,
  GestorBajas,
  MotivosBaja,
  AlertasVencimiento,
  AnalisisChurn,
} from '../components';
import * as renovacionesApi from '../api/renovaciones';
import * as bajasApi from '../api/bajas';
import * as alertasApi from '../api/alertas';
import * as churnApi from '../api/churn';
import {
  Renovacion,
  Baja,
  MotivoBaja,
  AlertaVencimiento,
  ChurnData,
  ProcessRenovacionRequest,
  UserType,
} from '../types';
import { RotateCcw, FileText, AlertCircle, TrendingDown, MoreHorizontal, ChevronDown } from 'lucide-react';

export default function RenovacionesBajasPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const userType: UserType = user?.role === 'entrenador' ? 'entrenador' : 'gimnasio';

  // Obtener tab desde query params o usar default
  const defaultTab = userType === 'entrenador' ? 'alertas' : 'renovaciones';
  const validTabs = useMemo(() => {
    return userType === 'entrenador' 
      ? ['alertas', 'renovaciones']
      : ['renovaciones', 'bajas', 'motivos', 'alertas', 'churn'];
  }, [userType]);
  
  const tabFromUrl = searchParams.get('tab');
  const initialTab = tabFromUrl && validTabs.includes(tabFromUrl) ? tabFromUrl : defaultTab;

  const [tabActiva, setTabActiva] = useState<string>(initialTab);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [renovaciones, setRenovaciones] = useState<Renovacion[]>([]);
  const [bajas, setBajas] = useState<Baja[]>([]);
  const [motivos, setMotivos] = useState<MotivoBaja[]>([]);
  const [alertas, setAlertas] = useState<AlertaVencimiento[]>([]);
  const [datosChurn, setDatosChurn] = useState<ChurnData[]>([]);
  const [loading, setLoading] = useState(false);
  const [periodoChurn, setPeriodoChurn] = useState<'mensual' | 'trimestral' | 'anual'>('mensual');

  // Sincronizar tab con URL
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && validTabs.includes(tabFromUrl) && tabFromUrl !== tabActiva) {
      setTabActiva(tabFromUrl);
    }
  }, [searchParams, validTabs, tabActiva]);

  // Actualizar URL cuando cambia la tab
  const handleTabChange = (tabId: string) => {
    setTabActiva(tabId);
    setSearchParams({ tab: tabId });
    setShowMoreMenu(false);
  };

  useEffect(() => {
    cargarDatos();
  }, [userType]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [renovacionesData, alertasData] = await Promise.all([
        renovacionesApi.getRenovaciones(userType),
        alertasApi.getAlertasVencimiento(userType),
      ]);

      setRenovaciones(renovacionesData);
      setAlertas(alertasData);

      if (userType === 'gimnasio') {
        const [bajasData, motivosData, churnData] = await Promise.all([
          bajasApi.getBajas(),
          bajasApi.getMotivosBaja(),
          churnApi.getAnalisisChurn({
            tipo: periodoChurn,
            fechaInicio: obtenerFechaInicio(periodoChurn),
            fechaFin: new Date().toISOString(),
          }),
        ]);
        setBajas(bajasData);
        setMotivos(motivosData);
        setDatosChurn(churnData);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const obtenerFechaInicio = (
    periodo: 'mensual' | 'trimestral' | 'anual'
  ): string => {
    const fecha = new Date();
    switch (periodo) {
      case 'mensual':
        fecha.setMonth(fecha.getMonth() - 1);
        break;
      case 'trimestral':
        fecha.setMonth(fecha.getMonth() - 3);
        break;
      case 'anual':
        fecha.setFullYear(fecha.getFullYear() - 1);
        break;
    }
    return fecha.toISOString();
  };

  const handleProcessRenovacion = async (
    id: string,
    data: ProcessRenovacionRequest
  ) => {
    const resultado = await renovacionesApi.procesarRenovacion(id, data);
    if (resultado) {
      setRenovaciones(renovaciones.map(r => (r.id === id ? resultado : r)));
    }
  };

  const handleCancelRenovacion = async (id: string) => {
    const resultado = await renovacionesApi.cancelarRenovacion(id);
    if (resultado) {
      setRenovaciones(renovaciones.map(r =>
        r.id === id ? { ...r, estado: 'cancelada' } : r
      ));
    }
  };

  const handleSendReminder = async (id: string) => {
    const resultado = await renovacionesApi.enviarRecordatorio(id);
    if (resultado) {
      setRenovaciones(renovaciones.map(r =>
        r.id === id ? { ...r, intentosRecordatorio: r.intentosRecordatorio + 1 } : r
      ));
    }
  };

  const handleProcessBaja = async (
    id: string,
    motivoId?: string,
    motivoTexto?: string
  ) => {
    const resultado = await bajasApi.procesarBaja(id, motivoId, motivoTexto);
    if (resultado) {
      setBajas(bajas.map(b => (b.id === id ? resultado : b)));
    }
  };

  const handleCancelBaja = async (id: string) => {
    const resultado = await bajasApi.cancelarBaja(id);
    if (resultado) {
      setBajas(bajas.filter(b => b.id !== id));
    }
  };

  const handleExportBajas = async () => {
    const blob = await bajasApi.exportarBajas();
    if (blob) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bajas.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const handleAddMotivo = async (data: Parameters<typeof bajasApi.crearMotivoBaja>[0]) => {
    const resultado = await bajasApi.crearMotivoBaja(data);
    if (resultado) {
      setMotivos([...motivos, resultado]);
    }
  };

  const handleUpdateMotivo = async (
    id: string,
    data: Parameters<typeof bajasApi.actualizarMotivoBaja>[1]
  ) => {
    const resultado = await bajasApi.actualizarMotivoBaja(id, data);
    if (resultado) {
      setMotivos(motivos.map(m => (m.id === id ? { ...m, ...data } : m)));
    }
  };

  const handleDeleteMotivo = async (id: string) => {
    const resultado = await bajasApi.eliminarMotivoBaja(id);
    if (resultado) {
      setMotivos(motivos.filter(m => m.id !== id));
    }
  };

  const handleMarkAsRead = async (alertaId: string) => {
    const resultado = await alertasApi.marcarAlertaLeida(alertaId);
    if (resultado) {
      setAlertas(alertas.map(a =>
        a.id === alertaId ? { ...a, leida: true } : a
      ));
    }
  };

  const handleProcessAlerta = async (alertaId: string, accion: string) => {
    const resultado = await alertasApi.procesarAlerta(
      alertaId,
      accion as Parameters<typeof alertasApi.procesarAlerta>[1]
    );
    if (resultado) {
      setAlertas(alertas.filter(a => a.id !== alertaId));
    }
  };

  const handleDismissAlerta = async (alertaId: string) => {
    const resultado = await alertasApi.descartarAlerta(alertaId);
    if (resultado) {
      setAlertas(alertas.filter(a => a.id !== alertaId));
    }
  };

  const handleVerSuscripcion = (suscripcionId: string) => {
    // Navegar a la página de suscripciones con el ID en la URL o estado
    navigate('/suscripciones-cuotas-recurrentes', { 
      state: { suscripcionId } 
    });
  };

  const handleCambiarPeriodoChurn = async (periodo: string) => {
    setPeriodoChurn(periodo as typeof periodoChurn);
    const churnData = await churnApi.getAnalisisChurn({
      tipo: periodo as typeof periodoChurn,
      fechaInicio: obtenerFechaInicio(periodo as typeof periodoChurn),
      fechaFin: new Date().toISOString(),
    });
    setDatosChurn(churnData);
  };

  const handleExportReporteChurn = async () => {
    const blob = await churnApi.exportarReporteChurn({
      tipo: periodoChurn,
      fechaInicio: obtenerFechaInicio(periodoChurn),
      fechaFin: new Date().toISOString(),
    });
    if (blob) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-churn-${periodoChurn}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const tabItems = useMemo(() => {
    if (userType === 'entrenador') {
      return [
        {
          id: 'alertas',
          label: 'Alertas de Vencimiento',
          icon: <AlertCircle size={18} />,
          description: 'Recibe alertas sobre bonos que están próximos a vencer. Actúa rápidamente para contactar a tus clientes y renovar sus servicios.',
        },
        {
          id: 'renovaciones',
          label: 'Renovaciones',
          icon: <RotateCcw size={18} />,
          description: 'Gestiona las renovaciones de bonos de tus clientes. Procesa renovaciones, envía recordatorios y mantén un seguimiento de todas las solicitudes.',
        },
      ];
    }
    return [
      {
        id: 'renovaciones',
        label: 'Renovaciones',
        icon: <RotateCcw size={18} />,
        description: 'Gestiona todas las renovaciones de membresías y servicios. Procesa renovaciones, envía recordatorios automáticos y mantén un control completo del ciclo de vida de tus clientes.',
      },
      {
        id: 'bajas',
        label: 'Bajas',
        icon: <FileText size={18} />,
        description: 'Registra y gestiona las bajas de clientes. Documenta los motivos, intenta retener clientes y mantén un historial completo de todas las bajas.',
      },
      {
        id: 'motivos',
        label: 'Motivos de Baja',
        icon: <FileText size={18} />,
        description: 'Configura y gestiona los motivos de baja más comunes. Organiza los motivos por categorías para facilitar el análisis y la toma de decisiones.',
      },
      {
        id: 'alertas',
        label: 'Alertas',
        icon: <AlertCircle size={18} />,
        description: 'Mantente informado sobre suscripciones próximas a vencer, pagos pendientes y otras situaciones que requieren tu atención inmediata.',
      },
      {
        id: 'churn',
        label: 'Análisis Churn',
        icon: <TrendingDown size={18} />,
        description: 'Analiza la tasa de abandono de clientes, identifica patrones y motivos principales. Utiliza estos datos para mejorar la retención y reducir el churn.',
      },
    ];
  }, [userType]);

  // Separar tabs para móvil: principales (2-3) y resto en "Más"
  const mobileMainTabs = useMemo(() => {
    if (userType === 'entrenador') {
      return tabItems; // Solo 2 tabs, mostrar todos
    }
    // Para gimnasio, mostrar las 3 primeras
    return tabItems.slice(0, 3);
  }, [tabItems, userType]);

  const mobileMoreTabs = useMemo(() => {
    if (userType === 'entrenador') {
      return []; // No hay tabs extra para entrenador
    }
    return tabItems.slice(3); // Resto de tabs para gimnasio
  }, [tabItems, userType]);

  const renderTabContent = () => {
    const activeTabConfig = tabItems.find(tab => tab.id === tabActiva);
    
    return (
      <div className="space-y-6">
        {/* Texto introductorio para cada tab */}
        {activeTabConfig?.description && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 leading-relaxed">
              {activeTabConfig.description}
            </p>
          </div>
        )}

        {/* Contenido de la tab */}
        <div>
          {(() => {
            switch (tabActiva) {
              case 'renovaciones':
                return (
                  <RenovacionesManager
                    role={userType}
                    onError={(error) => console.error('Error en RenovacionesManager:', error)}
                  />
                );
              case 'bajas':
                return (
                  <GestorBajas
                    role={userType}
                    onError={(error) => console.error('Error en GestorBajas:', error)}
                  />
                );
              case 'motivos':
                return (
                  <MotivosBaja
                    motivos={motivos}
                    onAddMotivo={handleAddMotivo}
                    onUpdateMotivo={handleUpdateMotivo}
                    onDeleteMotivo={handleDeleteMotivo}
                    loading={loading}
                  />
                );
              case 'alertas':
                return (
                  <AlertasVencimiento
                    alertas={alertas}
                    onMarkAsRead={handleMarkAsRead}
                    onProcessAlerta={handleProcessAlerta}
                    onDismissAlerta={handleDismissAlerta}
                    onVerSuscripcion={handleVerSuscripcion}
                    loading={loading}
                  />
                );
              case 'churn':
                return (
                  <AnalisisChurn
                    datosChurn={datosChurn}
                    periodo={periodoChurn}
                    onCambiarPeriodo={handleCambiarPeriodoChurn}
                    onExportReporte={handleExportReporteChurn}
                    loading={loading}
                  />
                );
              default:
                return null;
            }
          })()}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <RotateCcw size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Renovaciones & Bajas
                </h1>
                <p className="text-gray-600">
                  Controla las renovaciones, bajas y churn de tu negocio
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Sistema de Tabs */}
        <Card className="p-0 bg-white shadow-sm mb-6">
          <div className="px-4 py-3">
            {/* Desktop: mostrar todos los tabs */}
            <div
              role="tablist"
              aria-label="Secciones"
              className="hidden md:flex items-center gap-2 rounded-2xl bg-slate-100 p-1 overflow-x-auto"
            >
              {tabItems.map((tab) => {
                const isActive = tabActiva === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                    role="tab"
                    aria-selected={isActive}
                  >
                    {tab.icon && (
                      <span className={isActive ? 'opacity-100' : 'opacity-70'}>
                        {tab.icon}
                      </span>
                    )}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile: mostrar tabs principales + "Más" si hay más tabs */}
            <div className="md:hidden relative">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1 overflow-x-auto"
              >
                {mobileMainTabs.map((tab) => {
                  const isActive = tabActiva === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all min-h-[44px] whitespace-nowrap ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      }`}
                      role="tab"
                      aria-selected={isActive}
                    >
                      {tab.icon && (
                        <span className={isActive ? 'opacity-100' : 'opacity-70'}>
                          {tab.icon}
                        </span>
                      )}
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
                
                {/* Tab "Más" con menú desplegable */}
                {mobileMoreTabs.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setShowMoreMenu(!showMoreMenu)}
                      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all min-h-[44px] whitespace-nowrap ${
                        mobileMoreTabs.some(tab => tabActiva === tab.id)
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      }`}
                      role="tab"
                      aria-selected={mobileMoreTabs.some(tab => tabActiva === tab.id)}
                    >
                      <MoreHorizontal size={18} />
                      <span className="hidden sm:inline">Más</span>
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform ${showMoreMenu ? 'rotate-180' : ''}`}
                      />
                    </button>
                    
                    {/* Menú desplegable */}
                    {showMoreMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowMoreMenu(false)}
                        />
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-20 py-2">
                          {mobileMoreTabs.map((tab) => {
                            const isActive = tabActiva === tab.id;
                            return (
                              <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all min-h-[44px] ${
                                  isActive
                                    ? 'bg-blue-50 text-blue-900'
                                    : 'text-slate-700 hover:bg-slate-50'
                                }`}
                                role="menuitem"
                              >
                                {tab.icon}
                                <span>{tab.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Contenido de la Tab Activa */}
        <div className="space-y-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
