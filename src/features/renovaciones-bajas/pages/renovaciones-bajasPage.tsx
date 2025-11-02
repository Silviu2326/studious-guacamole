import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
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
import { RotateCcw, FileText, AlertCircle, TrendingDown } from 'lucide-react';

export default function RenovacionesBajasPage() {
  const { user } = useAuth();
  const userType: UserType = user?.role === 'entrenador' ? 'entrenador' : 'gimnasio';

  const [tabActiva, setTabActiva] = useState<string>(
    userType === 'entrenador' ? 'alertas' : 'renovaciones'
  );
  const [renovaciones, setRenovaciones] = useState<Renovacion[]>([]);
  const [bajas, setBajas] = useState<Baja[]>([]);
  const [motivos, setMotivos] = useState<MotivoBaja[]>([]);
  const [alertas, setAlertas] = useState<AlertaVencimiento[]>([]);
  const [datosChurn, setDatosChurn] = useState<ChurnData[]>([]);
  const [loading, setLoading] = useState(false);
  const [periodoChurn, setPeriodoChurn] = useState<'mensual' | 'trimestral' | 'anual'>('mensual');

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

  const tabItems = userType === 'entrenador'
    ? [
        {
          id: 'alertas',
          label: 'Alertas de Vencimiento',
          icon: <AlertCircle size={18} />,
        },
        {
          id: 'renovaciones',
          label: 'Renovaciones',
          icon: <RotateCcw size={18} />,
        },
      ]
    : [
        {
          id: 'renovaciones',
          label: 'Renovaciones',
          icon: <RotateCcw size={18} />,
        },
        {
          id: 'bajas',
          label: 'Bajas',
          icon: <FileText size={18} />,
        },
        {
          id: 'motivos',
          label: 'Motivos de Baja',
          icon: <FileText size={18} />,
        },
        {
          id: 'alertas',
          label: 'Alertas',
          icon: <AlertCircle size={18} />,
        },
        {
          id: 'churn',
          label: 'Análisis Churn',
          icon: <TrendingDown size={18} />,
        },
      ];

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'renovaciones':
        return (
          <RenovacionesManager
            userType={userType}
            renovaciones={renovaciones}
            onProcessRenovacion={handleProcessRenovacion}
            onCancelRenovacion={handleCancelRenovacion}
            onSendReminder={handleSendReminder}
            loading={loading}
          />
        );
      case 'bajas':
        return (
          <GestorBajas
            bajas={bajas}
            onProcessBaja={handleProcessBaja}
            onCancelBaja={handleCancelBaja}
            onExportBajas={handleExportBajas}
            loading={loading}
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
                  {userType === 'entrenador' ? 'Renovaciones de Bonos' : 'Renovaciones & Bajas'}
                </h1>
                <p className="text-gray-600">
                  {userType === 'entrenador'
                    ? 'Gestión de renovaciones y alertas de bonos PT'
                    : 'Gestión completa de renovaciones, bajas y análisis de churn'}
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
            <div
              role="tablist"
              aria-label="Secciones"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
            >
              {tabItems.map((tab) => (
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
                  {tab.icon && (
                    <span className={tabActiva === tab.id ? 'opacity-100' : 'opacity-70'}>
                      {tab.icon}
                    </span>
                  )}
                  <span>{tab.label}</span>
                </button>
              ))}
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
