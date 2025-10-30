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
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366F1]"></div>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-sm font-medium">Cargando métricas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FEE2E2] dark:bg-[#7F1D1D] border border-[#FECACA] dark:border-[#991B1B] rounded-2xl p-6 shadow-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-[#EF4444] dark:bg-[#F87171] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">⚠</span>
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-[#B91C1C] dark:text-[#FCA5A5]">Error al cargar datos</h3>
            <div className="mt-2 text-sm text-[#991B1B] dark:text-[#FECACA]">
              <p>{error}</p>
            </div>
            <Button 
              variant="destructive"
              size="md"
              onClick={() => window.location.reload()}
              className="mt-3"
            >
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="hover" padding="lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`${ds.typography.h1} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {esEntrenador ? 'Adherencia de Clientes' : 'Ocupación de Clases'}
            </h1>
            <p className={`mt-2 ${ds.typography.bodyLarge} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              {esEntrenador 
                ? 'Seguimiento del cumplimiento de sesiones de entrenamiento'
                : 'Análisis de ocupación y asistencia a clases grupales'
              }
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {alertas.filter(a => !a.leida).length > 0 && (
              <div className="relative">
                <span className={`${ds.badge.base} ${ds.badge.error} animate-pulse`}>
                  {alertas.filter(a => !a.leida).length} alertas
                </span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#EF4444] rounded-full animate-ping"></div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Navegación */}
      <Card>
        <Tabs
          items={navegacionItems.map(item => ({
            id: item.id,
            label: item.label,
            icon: <Icon name={item.iconName} className="w-5 h-5" />
          }))}
          activeTab={vistaActiva}
          onTabChange={(tabId) => setVistaActiva(tabId as any)}
        />
      </Card>

      {/* Contenido Principal */}
      <div className="space-y-6">
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
  );
};