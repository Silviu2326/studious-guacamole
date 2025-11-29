import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useAdherencia } from '../hooks/useAdherencia';
import { MetricasAdherencia } from './MetricasAdherencia';
import { CumplimientoCliente } from './CumplimientoCliente';
import { OcupacionClase } from './OcupacionClase';
import { AlertasAdherencia } from './AlertasAdherencia';
import { AnalizadorTendencias } from './AnalizadorTendencias';
import { OptimizadorAdherencia } from './OptimizadorAdherencia';
import { FiltrosAdherencia } from '../types';
import { ds } from '../ui/ds';
import { Icon } from '../ui/icons';
import { Card, Tabs, Button } from '../../../components/componentsreutilizables';
import { Loader2, AlertCircle } from 'lucide-react';

export const AdherenciaTracker: React.FC = () => {
  const { user } = useAuth();
  const {
    metricas,
    alertas,
    tendencias,
    recomendaciones,
    loading,
    error,
    actualizarFiltros
  } = useAdherencia();

  const [vistaActiva, setVistaActiva] = useState<'resumen' | 'clientes' | 'clases' | 'alertas' | 'tendencias' | 'optimizacion'>('resumen');
  const [filtros, setFiltros] = useState<FiltrosAdherencia>({});

  const esEntrenador = user?.role === 'entrenador';
  const esGimnasio = user?.role === 'gimnasio';

  const handleFiltrosChange = (nuevosFiltros: FiltrosAdherencia) => {
    setFiltros(nuevosFiltros);
    actualizarFiltros(nuevosFiltros);
  };

  const navegacionItems = [
    { id: 'resumen', label: 'Resumen', iconName: 'chart' as const },
    ...(esEntrenador ? [{ id: 'clientes' as const, label: 'Clientes', iconName: 'users' as const }] : []),
    ...(esGimnasio ? [{ id: 'clases' as const, label: 'Clases', iconName: 'clipboard' as const }] : []),
    { id: 'alertas', label: 'Alertas', iconName: 'warning' as const },
    { id: 'tendencias', label: 'Tendencias', iconName: 'trendUp' as const },
    { id: 'optimizacion', label: 'Optimización', iconName: 'bolt' as const }
  ];

  if (loading && !metricas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <Card className="p-8 text-center bg-white shadow-sm">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando métricas...</p>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <Card className="p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Icon name="chart" className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    {esEntrenador ? 'Adherencia de Clientes' : 'Ocupación de Clases'}
                  </h1>
                  <p className="text-gray-600">
                    {esEntrenador 
                      ? 'Seguimiento del cumplimiento de sesiones de entrenamiento'
                      : 'Análisis de ocupación y asistencia a clases grupales'
                    }
                  </p>
                </div>
              </div>
              {alertas.filter(a => !a.leida).length > 0 && (
                <div className="relative">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 animate-pulse">
                    {alertas.filter(a => !a.leida).length} alertas
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Navegación */}
        <Card className="p-0 bg-white shadow-sm">
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
            >
              {navegacionItems.map((item) => {
                const isActive = vistaActiva === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setVistaActiva(item.id as any)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Icon name={item.iconName} className={`w-[18px] h-[18px] ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Contenido Principal */}
        <div className="mt-6 space-y-6">
        {vistaActiva === 'resumen' && (
          <MetricasAdherencia 
            metricas={metricas}
            filtros={filtros}
            onFiltrosChange={handleFiltrosChange}
          />
        )}

        {vistaActiva === 'clientes' && esEntrenador && (
          <CumplimientoCliente 
            filtros={filtros}
            onFiltrosChange={handleFiltrosChange}
          />
        )}

        {vistaActiva === 'clases' && esGimnasio && (
          <OcupacionClase 
            filtros={filtros}
            onFiltrosChange={handleFiltrosChange}
          />
        )}

        {vistaActiva === 'alertas' && (
          <AlertasAdherencia 
            alertas={alertas}
            loading={loading}
          />
        )}

        {vistaActiva === 'tendencias' && (
          <AnalizadorTendencias 
            tendencias={tendencias}
            tipoNegocio={esEntrenador ? 'entrenador' : 'gimnasio'}
          />
        )}

        {vistaActiva === 'optimizacion' && (
          <OptimizadorAdherencia 
            recomendaciones={recomendaciones}
            metricas={metricas}
            tipoNegocio={esEntrenador ? 'entrenador' : 'gimnasio'}
          />
        )}
        </div>
      </div>
    </div>
  );
};