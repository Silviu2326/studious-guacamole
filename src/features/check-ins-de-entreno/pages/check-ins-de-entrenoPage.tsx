import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Tabs, MetricCards, Select, Button } from '../../../components/componentsreutilizables';
import { CheckInsEntreno } from '../components';
import { getCheckInsAnalytics, getCheckIns } from '../api/checkins';
import { ClipboardCheck, Users, TrendingUp, AlertTriangle } from 'lucide-react';

export default function CheckInsDeEntrenoPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const [tabActiva, setTabActiva] = useState<string>('checkins');
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>('');
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    if (clienteSeleccionado) {
      cargarAnalytics();
    }
  }, [clienteSeleccionado]);

  const cargarAnalytics = async () => {
    if (!clienteSeleccionado) return;
    const data = await getCheckInsAnalytics(clienteSeleccionado);
    setAnalytics(data);
  };

  const tabs = [
    {
      id: 'checkins',
      label: 'Check-ins',
      icon: <ClipboardCheck className="w-4 h-4" />,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <TrendingUp className="w-4 h-4" />,
    },
  ];

  const metricas = analytics
    ? [
        {
          title: 'Total Check-ins',
          value: analytics.totalCheckIns.toString(),
          icon: <ClipboardCheck className="w-5 h-5" />,
          trend: 'up' as const,
          trendValue: '+0%',
          color: 'blue' as const,
        },
        {
          title: 'Promedio Semáforo',
          value: analytics.promedioSemaforo.toFixed(1),
          icon: <TrendingUp className="w-5 h-5" />,
          trend: 'neutral' as const,
          trendValue: '0%',
          color: 'green' as const,
        },
        {
          title: 'Dolor Lumbar',
          value: analytics.dolorLumbarCount.toString(),
          icon: <AlertTriangle className="w-5 h-5" />,
          trend: 'down' as const,
          trendValue: '-0%',
          color: 'red' as const,
        },
        {
          title: 'RPE Promedio',
          value: analytics.promedioRPE > 0 ? analytics.promedioRPE.toFixed(1) : '-',
          icon: <Users className="w-5 h-5" />,
          trend: 'up' as const,
          trendValue: '+0%',
          color: 'purple' as const,
        },
      ]
    : [];

  const clientesMock = [
    { value: 'cliente1', label: 'Juan Pérez' },
    { value: 'cliente2', label: 'María González' },
    { value: 'cliente3', label: 'Carlos Rodríguez' },
  ];

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'checkins':
        return (
          <div className="space-y-6">
            <Card className="mb-6 bg-white shadow-sm">
              <div className="p-4 space-y-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Seleccionar Cliente
                </label>
                <div className="flex gap-2">
                  <Select
                    value={clienteSeleccionado}
                    onChange={(e) => setClienteSeleccionado(e.target.value)}
                    options={clientesMock}
                    placeholder="Selecciona un cliente"
                    className="flex-1"
                  />
                </div>
              </div>
            </Card>

            {clienteSeleccionado ? (
              <CheckInsEntreno clienteId={clienteSeleccionado} />
            ) : (
              <Card className="p-8 text-center bg-white shadow-sm">
                <Users size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Selecciona un Cliente
                </h3>
                <p className="text-gray-600">
                  Selecciona un cliente de la lista para gestionar sus check-ins de entrenamiento
                </p>
              </Card>
            )}
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            {analytics ? (
              <>
                <MetricCards data={metricas} />
                
                {/* Gráfico de Distribución de Semáforos */}
                {analytics.distribucionSemaforos && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 bg-white shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-600" />
                        Distribución de Semáforos
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700">Verde</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {analytics.distribucionSemaforos.verde} ({Math.round((analytics.distribucionSemaforos.verde / analytics.totalCheckIns) * 100)}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-3">
                            <div
                              className="bg-green-500 h-3 rounded-full transition-all"
                              style={{
                                width: `${(analytics.distribucionSemaforos.verde / analytics.totalCheckIns) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700">Amarillo</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {analytics.distribucionSemaforos.amarillo} ({Math.round((analytics.distribucionSemaforos.amarillo / analytics.totalCheckIns) * 100)}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-3">
                            <div
                              className="bg-yellow-500 h-3 rounded-full transition-all"
                              style={{
                                width: `${(analytics.distribucionSemaforos.amarillo / analytics.totalCheckIns) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700">Rojo</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {analytics.distribucionSemaforos.rojo} ({Math.round((analytics.distribucionSemaforos.rojo / analytics.totalCheckIns) * 100)}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-3">
                            <div
                              className="bg-red-500 h-3 rounded-full transition-all"
                              style={{
                                width: `${(analytics.distribucionSemaforos.rojo / analytics.totalCheckIns) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Evolución RPE */}
                    {analytics.evolucionRPE && analytics.evolucionRPE.length > 0 && (
                      <Card className="p-6 bg-white shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <TrendingUp size={20} className="text-purple-600" />
                          Evolución RPE (Últimos 7 días)
                        </h3>
                        <div className="space-y-3">
                          {analytics.evolucionRPE.map((dia: any, index: number) => (
                            <div key={index} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-600">{dia.fecha}</span>
                                <span className="text-xs font-semibold text-gray-900">
                                  Promedio: {dia.promedio} | Max: {dia.maximo} | Min: {dia.minimo}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="flex-1 bg-slate-200 rounded-full h-2 relative">
                                  <div
                                    className="absolute top-0 left-0 bg-purple-500 h-2 rounded-full"
                                    style={{
                                      width: `${((dia.promedio - 6) / 14) * 100}%`,
                                    }}
                                  />
                                  <div
                                    className="absolute top-0 bg-purple-300 h-2 rounded-full opacity-50"
                                    style={{
                                      left: `${((dia.minimo - 6) / 14) * 100}%`,
                                      width: `${((dia.maximo - dia.minimo) / 14) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}
                  </div>
                )}

                {/* Gráfico de Tendencias Diarias */}
                {analytics.tendencias.length > 0 && (
                  <Card className="p-6 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-600" />
                        Tendencias Diarias (Últimos 7 días)
                      </h3>
                      {analytics.tendenciaGeneral && (
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          analytics.tendenciaGeneral === 'mejora' 
                            ? 'bg-green-100 text-green-700'
                            : analytics.tendenciaGeneral === 'empeora'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          Tendencia: {analytics.tendenciaGeneral.charAt(0).toUpperCase() + analytics.tendenciaGeneral.slice(1)}
                        </span>
                      )}
                    </div>
                    <div className="space-y-3">
                      {analytics.tendencias.map((tendencia: any, index: number) => {
                        const total = tendencia.verde + tendencia.amarillo + tendencia.rojo;
                        const maxValue = Math.max(...analytics.tendencias.map((t: any) => t.verde + t.amarillo + t.rojo));
                        
                        return (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-700">{tendencia.fecha}</span>
                              <span className="text-xs text-slate-500">Total: {total} check-ins</span>
                            </div>
                            <div className="flex items-center gap-1 h-6 bg-slate-100 rounded-lg overflow-hidden">
                              {tendencia.verde > 0 && (
                                <div
                                  className="bg-green-500 h-full flex items-center justify-center text-white text-xs font-medium"
                                  style={{ width: `${(tendencia.verde / total) * 100}%` }}
                                  title={`Verde: ${tendencia.verde}`}
                                >
                                  {tendencia.verde > 2 && tendencia.verde}
                                </div>
                              )}
                              {tendencia.amarillo > 0 && (
                                <div
                                  className="bg-yellow-500 h-full flex items-center justify-center text-white text-xs font-medium"
                                  style={{ width: `${(tendencia.amarillo / total) * 100}%` }}
                                  title={`Amarillo: ${tendencia.amarillo}`}
                                >
                                  {tendencia.amarillo > 2 && tendencia.amarillo}
                                </div>
                              )}
                              {tendencia.rojo > 0 && (
                                <div
                                  className="bg-red-500 h-full flex items-center justify-center text-white text-xs font-medium"
                                  style={{ width: `${(tendencia.rojo / total) * 100}%` }}
                                  title={`Rojo: ${tendencia.rojo}`}
                                >
                                  {tendencia.rojo > 0 && tendencia.rojo}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 text-xs">
                              <span className="px-2 py-0.5 rounded bg-green-100 text-green-700">
                                Verde: {tendencia.verde}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">
                                Amarillo: {tendencia.amarillo}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-red-100 text-red-700">
                                Rojo: {tendencia.rojo}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                )}

                {/* Estadísticas Adicionales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analytics.frecuenciaDolor !== undefined && (
                    <Card className="p-6 bg-white shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <AlertTriangle size={20} className="text-red-600" />
                        Frecuencia de Dolor Lumbar
                      </h3>
                      <div className="space-y-3">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-red-600 mb-2">
                            {analytics.frecuenciaDolor}%
                          </div>
                          <p className="text-sm text-slate-600">
                            {analytics.dolorLumbarCount} de {analytics.totalCheckIns} check-ins
                          </p>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-4">
                          <div
                            className="bg-red-500 h-4 rounded-full transition-all flex items-center justify-end pr-2"
                            style={{ width: `${analytics.frecuenciaDolor}%` }}
                          >
                            {analytics.frecuenciaDolor > 10 && (
                              <span className="text-xs font-medium text-white">
                                {analytics.frecuenciaDolor}%
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 text-center mt-2">
                          {analytics.frecuenciaDolor < 10 
                            ? '✅ Frecuencia saludable' 
                            : analytics.frecuenciaDolor < 20
                            ? '⚠️ Requiere atención'
                            : '🔴 Requiere acción inmediata'}
                        </p>
                      </div>
                    </Card>
                  )}

                  <Card className="p-6 bg-white shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <ClipboardCheck size={20} className="text-blue-600" />
                      Resumen General
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                        <span className="text-sm font-medium text-slate-700">Promedio Semáforo</span>
                        <span className="text-lg font-bold text-blue-600">
                          {analytics.promedioSemaforo.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                        <span className="text-sm font-medium text-slate-700">RPE Promedio</span>
                        <span className="text-lg font-bold text-green-600">
                          {analytics.promedioRPE.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50">
                        <span className="text-sm font-medium text-slate-700">Total Check-ins</span>
                        <span className="text-lg font-bold text-purple-600">
                          {analytics.totalCheckIns}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              </>
            ) : (
              <Card className="p-8 text-center bg-white shadow-sm">
                <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Selecciona un cliente para ver analytics</p>
              </Card>
            )}
          </div>
        );

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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Acceso Restringido
            </h3>
            <p className="text-gray-600">
              Esta página está disponible solo para entrenadores personales
            </p>
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
                  Check-ins de Entrenamiento
                </h1>
                <p className="text-gray-600">
                  Sistema de check-ins detallados por serie/set con semáforos, evaluación de sensaciones y seguimiento personalizado
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Sistema de Tabs */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                {tabs.map((tab) => {
                  const Icon = tab.id === 'checkins' ? ClipboardCheck : TrendingUp;
                  const isActive = tabActiva === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setTabActiva(tab.id)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Contenido de Tabs */}
          <div className="mt-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

