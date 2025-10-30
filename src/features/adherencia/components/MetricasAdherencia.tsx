import React from 'react';
import { MetricasAdherencia as MetricasType, FiltrosAdherencia } from '../types';
import { ds } from '../ui/ds';
import { Icon } from '../ui/icons';
import { Card, Input, Select, MetricCards } from '../../../components/componentsreutilizables';

interface Props {
  metricas: MetricasType | null;
  filtros: FiltrosAdherencia;
  onFiltrosChange: (filtros: FiltrosAdherencia) => void;
}

export const MetricasAdherencia: React.FC<Props> = ({ metricas, filtros, onFiltrosChange }) => {
  const esEntrenador = metricas?.tipoNegocio === 'entrenador';

  const handleFiltroChange = (campo: keyof FiltrosAdherencia, valor: any) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor
    });
  };

  if (!metricas) {
    return (
      <div className={`${ds.card} ${ds.cardPad}`}>
        <div className="space-y-6">
          <div className={`h-6 ${ds.skeleton} w-1/4`}></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`h-32 ${ds.shimmer} rounded-xl`}></div>
            ))}
          </div>
          <div className="space-y-4">
            <div className={`h-4 ${ds.skeleton} w-1/3`}></div>
            <div className={`h-32 ${ds.shimmer} rounded-xl`}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card variant="hover" padding="lg">
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-6`}>
          Filtros de Análisis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            type="date"
            label="Fecha Inicio"
            value={filtros.fechaInicio?.toISOString().split('T')[0] || ''}
            onChange={(e) => handleFiltroChange('fechaInicio', e.target.value ? new Date(e.target.value) : undefined)}
          />
          <Input
            type="date"
            label="Fecha Fin"
            value={filtros.fechaFin?.toISOString().split('T')[0] || ''}
            onChange={(e) => handleFiltroChange('fechaFin', e.target.value ? new Date(e.target.value) : undefined)}
          />
          {esEntrenador && (
            <Input
              type="number"
              label="Umbral de Adherencia (%)"
              min="0"
              max="100"
              value={filtros.umbralAdherencia || 70}
              onChange={(e) => handleFiltroChange('umbralAdherencia', parseInt(e.target.value))}
              placeholder="70"
            />
          )}
          {!esEntrenador && (
            <Select
              label="Tipo de Clase"
              value={filtros.tipoClase || ''}
              onChange={(value) => handleFiltroChange('tipoClase', value || undefined)}
              options={[
                { value: '', label: 'Todas las clases' },
                { value: 'yoga', label: 'Yoga' },
                { value: 'spinning', label: 'Spinning' },
                { value: 'crossfit', label: 'CrossFit' },
                { value: 'pilates', label: 'Pilates' },
                { value: 'zumba', label: 'Zumba' }
              ]}
            />
          )}
        </div>
      </Card>

      {/* Métricas Principales */}
      <Card variant="hover" padding="lg">
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-8`}>
          {esEntrenador ? 'Métricas de Adherencia' : 'Métricas de Ocupación'}
        </h3>
        
        <MetricCards
          data={esEntrenador ? [
            {
              id: '1',
              title: 'Adherencia Promedio',
              value: `${metricas.adherenciaPromedio?.toFixed(1)}%`,
              icon: <Icon name="chart" className="w-6 h-6 text-white" />,
              variant: 'info'
            },
            {
              id: '2',
              title: 'Clientes Activos',
              value: metricas.clientesActivos.toString(),
              icon: <Icon name="users" className="w-6 h-6 text-white" />,
              variant: 'success'
            },
            {
              id: '3',
              title: 'Sesiones Completadas',
              value: `${metricas.sesionesCompletadas}/${metricas.sesionesTotalesProgramadas}`,
              icon: <Icon name="check" className="w-6 h-6 text-white" />,
              variant: 'gradient'
            },
            {
              id: '4',
              title: 'Baja Adherencia',
              value: metricas.clientesConBajaAdherencia.toString(),
              icon: <Icon name="warning" className="w-6 h-6 text-white" />,
              variant: 'error'
            }
          ] : [
            {
              id: '1',
              title: 'Ocupación Promedio',
              value: `${metricas.ocupacionPromedio?.toFixed(1)}%`,
              icon: <Icon name="chart" className="w-6 h-6 text-white" />,
              variant: 'info'
            },
            {
              id: '2',
              title: 'Clases Totales',
              value: metricas.clasesTotales.toString(),
              icon: <Icon name="clipboard" className="w-6 h-6 text-white" />,
              variant: 'success'
            },
            {
              id: '3',
              title: 'Asistencia Total',
              value: `${metricas.asistenciaTotal}/${metricas.capacidadTotal}`,
              icon: <Icon name="users" className="w-6 h-6 text-white" />,
              variant: 'gradient'
            },
            {
              id: '4',
              title: 'Baja Ocupación',
              value: metricas.clasesConBajaOcupacion.toString(),
              icon: <Icon name="warning" className="w-6 h-6 text-white" />,
              variant: 'error'
            }
          ]}
          columns={4}
        />
      </Card>

      {/* Gráfico de Progreso */}
      <Card variant="hover" padding="lg">
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-6`}>
          {esEntrenador ? 'Progreso de Adherencia' : 'Progreso de Ocupación'}
        </h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                {esEntrenador ? 'Adherencia Actual' : 'Ocupación Actual'}
              </span>
              <span className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {esEntrenador 
                  ? `${metricas.adherenciaPromedio?.toFixed(1)}%`
                  : `${metricas.ocupacionPromedio?.toFixed(1)}%`
                }
              </span>
            </div>
            <div className="w-full bg-[#F1F5F9] dark:bg-[#2A2A3A] rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                  (esEntrenador ? metricas.adherenciaPromedio : metricas.ocupacionPromedio) || 0 >= 80
                    ? 'bg-gradient-to-r from-[#10B981] to-[#059669]'
                    : (esEntrenador ? metricas.adherenciaPromedio : metricas.ocupacionPromedio) || 0 >= 60
                    ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706]'
                    : 'bg-gradient-to-r from-[#EF4444] to-[#DC2626]'
                }`}
                style={{
                  width: `${(esEntrenador ? metricas.adherenciaPromedio : metricas.ocupacionPromedio) || 0}%`
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>0%</span>
              <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>100%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Resumen del Período */}
      <Card variant="hover" padding="lg">
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-6`}>Resumen del Período</h3>
        <div className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-[#6366F1] rounded-full"></div>
            <p className="font-semibold">
              <span className={ds.color.textPrimary}>Período:</span> {metricas.periodo.inicio.toLocaleDateString('es-ES')} - {metricas.periodo.fin.toLocaleDateString('es-ES')}
            </p>
          </div>
          {esEntrenador ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#F8FAFC] dark:bg-[#1E1E2E] rounded-xl p-4">
                <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>Sesiones Programadas</p>
                <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>{metricas.sesionesTotalesProgramadas}</p>
              </div>
              <div className="bg-[#F8FAFC] dark:bg-[#1E1E2E] rounded-xl p-4">
                <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>Sesiones Completadas</p>
                <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>{metricas.sesionesCompletadas}</p>
              </div>
              <div className="bg-[#F8FAFC] dark:bg-[#1E1E2E] rounded-xl p-4">
                <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>Tasa de Cumplimiento</p>
                <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {metricas.sesionesTotalesProgramadas && metricas.sesionesCompletadas
                    ? ((metricas.sesionesCompletadas / metricas.sesionesTotalesProgramadas) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#F8FAFC] dark:bg-[#1E1E2E] rounded-xl p-4">
                <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>Total de Clases</p>
                <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>{metricas.clasesTotales}</p>
              </div>
              <div className="bg-[#F8FAFC] dark:bg-[#1E1E2E] rounded-xl p-4">
                <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>Capacidad Total</p>
                <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>{metricas.capacidadTotal} plazas</p>
              </div>
              <div className="bg-[#F8FAFC] dark:bg-[#1E1E2E] rounded-xl p-4">
                <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>Asistencia Total</p>
                <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>{metricas.asistenciaTotal} personas</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};