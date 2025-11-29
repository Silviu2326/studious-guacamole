import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards, Select, Button } from '../../../components/componentsreutilizables';
import { 
  CheckInsNutricion,
  SeguimientoPeso,
  HistorialNutricional,
  CalculadoraAdherencia,
  AnalizadorTendencias,
  ConfiguracionRecordatorios,
  ConfiguracionAlertas,
} from '../components';
import { getCheckInsNutricionales } from '../api/checkins';
import { getAnalyticsNutricional } from '../api/adherencia';
import { ClipboardCheck, Users, TrendingUp, AlertTriangle, Camera, Scale, Bell, Download } from 'lucide-react';
import { iniciarVerificacionRecordatoriosCheckInNutricional } from '../api/recordatorios';
import { iniciarVerificacionAlertas, verificarYCrearAlertas } from '../api/alertas';
import { exportarReporteExcel, exportarReportePDF } from '../api/exportacion';

export default function CheckInsNutricionalesPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const [tabActiva, setTabActiva] = useState<string>('checkins');
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>('');
  const [analytics, setAnalytics] = useState<any>(null);
  const [mostrarConfigRecordatorios, setMostrarConfigRecordatorios] = useState(false);
  const [mostrarConfigAlertas, setMostrarConfigAlertas] = useState(false);
  const [exportando, setExportando] = useState(false);

  useEffect(() => {
    if (clienteSeleccionado) {
      cargarAnalytics();
      // Iniciar verificación de recordatorios para este cliente
      if (user?.id) {
        const intervalIdRecordatorios = iniciarVerificacionRecordatoriosCheckInNutricional(user.id, clienteSeleccionado);
        
        // Iniciar verificación de alertas automáticas
        const obtenerDatosParaAlertas = async () => {
          const checkIns = await getCheckInsNutricionales(clienteSeleccionado);
          const analyticsData = await getAnalyticsNutricional(clienteSeleccionado);
          
          // Calcular días sin check-ins
          const ahora = new Date();
          const ultimoCheckIn = checkIns.length > 0 
            ? new Date(Math.max(...checkIns.map(ci => new Date(ci.fecha || ci.createdAt || '').getTime())))
            : null;
          
          const diasSinCheckIns = ultimoCheckIn
            ? Math.floor((ahora.getTime() - ultimoCheckIn.getTime()) / (1000 * 60 * 60 * 24))
            : 999; // Si no hay check-ins, considerar muchos días
          
          return {
            diasSinCheckIns,
            adherenciaActual: analyticsData?.promedioAdherencia || 0,
          };
        };
        
        const intervalIdAlertas = iniciarVerificacionAlertas(
          user.id,
          clienteSeleccionado,
          obtenerDatosParaAlertas
        );
        
        // Verificar alertas inmediatamente al cargar
        obtenerDatosParaAlertas().then(datos => {
          verificarYCrearAlertas(user.id, clienteSeleccionado, datos);
        });
        
        return () => {
          clearInterval(intervalIdRecordatorios);
          clearInterval(intervalIdAlertas);
        };
      }
    }
  }, [clienteSeleccionado, user?.id]);

  const cargarAnalytics = async () => {
    if (!clienteSeleccionado) return;
    try {
      const data = await getAnalyticsNutricional(clienteSeleccionado);
      setAnalytics(data);
    } catch (error) {
      console.error('Error al cargar analytics:', error);
    }
  };

  const handleExportar = async (formato: 'pdf' | 'excel') => {
    if (!clienteSeleccionado) return;
    
    setExportando(true);
    try {
      const clienteNombre = clientesMock.find(c => c.value === clienteSeleccionado)?.label || clienteSeleccionado;
      
      if (formato === 'pdf') {
        await exportarReportePDF({
          clienteId: clienteSeleccionado,
          nombreCliente: clienteNombre,
        });
      } else {
        await exportarReporteExcel({
          clienteId: clienteSeleccionado,
          nombreCliente: clienteNombre,
        });
      }
    } catch (error) {
      console.error('Error al exportar reporte:', error);
      alert('Error al exportar el reporte. Por favor, intenta nuevamente.');
    } finally {
      setExportando(false);
    }
  };

  const tabs = [
    {
      id: 'checkins',
      label: 'Check-ins',
      icon: <ClipboardCheck size={18} />,
    },
    {
      id: 'peso',
      label: 'Seguimiento Peso',
      icon: <Scale size={18} />,
    },
    {
      id: 'historial',
      label: 'Historial',
      icon: <TrendingUp size={18} />,
    },
    {
      id: 'adherencia',
      label: 'Adherencia',
      icon: <TrendingUp size={18} />,
    },
    {
      id: 'tendencias',
      label: 'Tendencias',
      icon: <TrendingUp size={18} />,
    },
  ];

  const metricas = analytics
    ? [
        {
          id: 'total-checkins',
          title: 'Total Check-ins',
          value: analytics.totalCheckIns.toString(),
          icon: <ClipboardCheck className="w-5 h-5" />,
          trend: { value: 0, direction: 'up' as const },
          color: 'primary' as const,
        },
        {
          id: 'adherencia',
          title: 'Adherencia Promedio',
          value: `${analytics.promedioAdherencia.toFixed(0)}%`,
          icon: <TrendingUp className="w-5 h-5" />,
          trend: { value: 0, direction: 'neutral' as const },
          color: analytics.promedioAdherencia >= 80 ? 'success' as const : 
                 analytics.promedioAdherencia >= 60 ? 'warning' as const : 'error' as const,
        },
        {
          id: 'fotos',
          title: 'Fotos Evaluadas',
          value: analytics.fotosEvaluadas.toString(),
          icon: <Camera className="w-5 h-5" />,
          trend: { value: 0, direction: 'up' as const },
          color: 'info' as const,
        },
        {
          id: 'macros',
          title: 'Cumplimiento Macros',
          value: `${analytics.cumplimientoMacros.toFixed(0)}%`,
          icon: <TrendingUp className="w-5 h-5" />,
          trend: { value: 0, direction: 'up' as const },
          color: analytics.cumplimientoMacros >= 80 ? 'success' as const : 
                 analytics.cumplimientoMacros >= 60 ? 'warning' as const : 'error' as const,
        },
      ]
    : [];

  const clientesMock = [
    { value: 'cliente1', label: 'Juan Pérez' },
    { value: 'cliente2', label: 'María González' },
    { value: 'cliente3', label: 'Carlos Rodríguez' },
  ];

  const renderTabContent = () => {
    if (!clienteSeleccionado) {
      return (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona un Cliente</h3>
          <p className="text-gray-600 mb-4">Selecciona un cliente de la lista para gestionar sus check-ins nutricionales</p>
        </Card>
      );
    }

    switch (tabActiva) {
      case 'checkins':
        return <CheckInsNutricion clienteId={clienteSeleccionado} />;

      case 'peso':
        return <SeguimientoPeso clienteId={clienteSeleccionado} />;

      case 'historial':
        return <HistorialNutricional clienteId={clienteSeleccionado} />;

      case 'adherencia':
        return <CalculadoraAdherencia clienteId={clienteSeleccionado} />;

      case 'tendencias':
        return <AnalizadorTendencias clienteId={clienteSeleccionado} />;

      default:
        return null;
    }
  };

  if (!esEntrenador) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <Card className="p-8 text-center bg-white shadow-sm">
            <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Acceso Restringido</h3>
            <p className="text-gray-600 mb-4">Esta página está disponible solo para entrenadores personales</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <ClipboardCheck size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Check-ins Nutricionales
                </h1>
                <p className="text-gray-600">
                  Sistema de seguimiento nutricional detallado con fotos de comidas, hambre, saciedad, peso diario y adherencia nutricional
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Selector de Cliente */}
          <Card className="p-4 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Seleccionar Cliente
                </label>
                <Select
                  value={clienteSeleccionado}
                  onChange={(e) => setClienteSeleccionado(e.target.value)}
                  options={clientesMock}
                  placeholder="Selecciona un cliente"
                  className="w-full"
                />
              </div>
              {clienteSeleccionado && (
                <div className="pt-6 flex gap-2">
                  <Button
                    variant="primary"
                    onClick={() => handleExportar('excel')}
                    loading={exportando}
                    disabled={exportando}
                  >
                    <Download size={18} className="mr-2" />
                    Exportar Excel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleExportar('pdf')}
                    loading={exportando}
                    disabled={exportando}
                  >
                    <Download size={18} className="mr-2" />
                    Exportar PDF
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setMostrarConfigRecordatorios(true)}
                  >
                    <Bell size={18} className="mr-2" />
                    Recordatorios
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setMostrarConfigAlertas(true)}
                  >
                    <AlertTriangle size={18} className="mr-2" />
                    Alertas
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Métricas */}
          {clienteSeleccionado && analytics && (
            <MetricCards data={metricas} columns={4} />
          )}

          {/* Sistema de Tabs */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTabActiva(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      tabActiva === tab.id
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                    role="tab"
                    aria-selected={tabActiva === tab.id}
                  >
                    <span className={tabActiva === tab.id ? 'opacity-100' : 'opacity-70'}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Contenido de la Tab Activa */}
          <div className="mt-6">{renderTabContent()}</div>
        </div>
      </div>

      {/* Modal de Configuración de Recordatorios */}
      {clienteSeleccionado && user?.id && (
        <>
          <ConfiguracionRecordatorios
            isOpen={mostrarConfigRecordatorios}
            onClose={() => setMostrarConfigRecordatorios(false)}
            entrenadorId={user.id}
            clienteId={clienteSeleccionado}
          />
          <ConfiguracionAlertas
            isOpen={mostrarConfigAlertas}
            onClose={() => setMostrarConfigAlertas(false)}
            entrenadorId={user.id}
            clienteId={clienteSeleccionado}
          />
        </>
      )}
    </div>
  );
}

