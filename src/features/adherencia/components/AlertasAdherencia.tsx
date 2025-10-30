import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useAdherencia } from '../hooks/useAdherencia';
import { AlertaAdherencia as AlertaType } from '../types';
import { ds } from '../ui/ds';
import { Icon } from '../ui/icons';
import { Card, Select, Button, Modal } from '../../../components/componentsreutilizables';

export const AlertasAdherencia: React.FC = () => {
  const { user } = useAuth();
  const { alertas, obtenerAlertas, loading } = useAdherencia();
  const [filtroTipo, setFiltroTipo] = useState<string>('todas');
  const [filtroSeveridad, setFiltroSeveridad] = useState<string>('todas');
  const [alertasDismissed, setAlertasDismissed] = useState<string[]>([]);

  useEffect(() => {
    obtenerAlertas();
  }, [obtenerAlertas]);

  const alertasFiltradas = alertas.filter(alerta => {
    if (alertasDismissed.includes(alerta.id)) return false;
    
    const cumpleTipo = filtroTipo === 'todas' || alerta.tipo === filtroTipo;
    const cumpleSeveridad = filtroSeveridad === 'todas' || alerta.severidad === filtroSeveridad;
    
    return cumpleTipo && cumpleSeveridad;
  });

  const dismissAlerta = (alertaId: string) => {
    setAlertasDismissed([...alertasDismissed, alertaId]);
  };

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'baja_adherencia': return '📉';
      case 'ausencia_prolongada': return '⏰';
      case 'baja_ocupacion': return '📊';
      case 'cancelacion_frecuente': return '❌';
      case 'objetivo_no_cumplido': return '🎯';
      default: return '⚠️';
    }
  };

  const getColorSeveridad = (severidad: string) => {
    switch (severidad) {
      case 'alta':
        return `${ds.color.errorBg} border-red-200 ${ds.color.error.replace('text-', '') ? 'text-red-800' : ''}`;
      case 'media':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'baja':
        return `${ds.color.infoBg} border-blue-200 text-blue-800`;
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getColorBotonSeveridad = (severidad: string) => {
    switch (severidad) {
      case 'alta':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'media':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'baja':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const contarPorSeveridad = (severidad: string) => {
    return alertasFiltradas.filter(alerta => alerta.severidad === severidad).length;
  };

  const tiposAlerta = user?.role === 'entrenador' 
    ? ['baja_adherencia', 'ausencia_prolongada', 'objetivo_no_cumplido']
    : ['baja_ocupacion', 'cancelacion_frecuente', 'objetivo_no_cumplido'];

  if (loading) {
    return (
      <div className={`${ds.card} ${ds.cardPad}`}>
        <div className="space-y-6">
          <div className={`h-6 ${ds.skeleton} w-1/4`}></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`h-24 ${ds.shimmer} rounded-xl`}></div>
            ))}
          </div>
          <div className="space-y-4">
            <div className={`h-4 ${ds.skeleton} w-1/3`}></div>
            <div className="space-y-3">
              <div className={`h-20 ${ds.shimmer} rounded-xl`}></div>
              <div className={`h-20 ${ds.shimmer} rounded-xl`}></div>
              <div className={`h-20 ${ds.shimmer} rounded-xl`}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen de Alertas */}
      <Card variant="hover" padding="lg">
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-6`}>Resumen de Alertas</h3>
        <MetricCards
          data={[
            {
              id: '1',
              title: 'Total',
              value: alertasFiltradas.length.toString(),
              icon: <Icon name="clipboard" className="w-6 h-6 text-white" />,
              variant: 'default'
            },
            {
              id: '2',
              title: 'Alta Prioridad',
              value: contarPorSeveridad('alta').toString(),
              icon: <Icon name="warning" className="w-6 h-6 text-white" />,
              variant: 'error'
            },
            {
              id: '3',
              title: 'Media Prioridad',
              value: contarPorSeveridad('media').toString(),
              icon: <Icon name="warning" className="w-6 h-6 text-white" />,
              variant: 'warning'
            },
            {
              id: '4',
              title: 'Baja Prioridad',
              value: contarPorSeveridad('baja').toString(),
              icon: <Icon name="info" className="w-6 h-6 text-white" />,
              variant: 'info'
            }
          ]}
          columns={4}
        />
      </Card>

      {/* Filtros */}
      <Card variant="hover" padding="lg">
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-6`}>Filtros de Alertas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Tipo de Alerta"
            value={filtroTipo}
            onChange={setFiltroTipo}
            options={[
              { value: 'todas', label: 'Todas las alertas' },
              ...tiposAlerta.map(tipo => ({
                value: tipo,
                label: tipo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
              }))
            ]}
          />
          <Select
            label="Severidad"
            value={filtroSeveridad}
            onChange={setFiltroSeveridad}
            options={[
              { value: 'todas', label: 'Todas las severidades' },
              { value: 'alta', label: 'Alta' },
              { value: 'media', label: 'Media' },
              { value: 'baja', label: 'Baja' }
            ]}
          />
        </div>
      </Card>

      {/* Lista de Alertas */}
      <Card variant="hover" padding="lg">
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-6`}>
          Alertas Activas ({alertasFiltradas.length})
        </h3>
        
        {alertasFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🎉</span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>¡Excelente!</p>
            <p className={`${ds.typography.bodyLarge} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>No hay alertas activas en este momento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alertasFiltradas.map((alerta) => (
              <div
                key={alerta.id}
                className={`border rounded-2xl p-6 ${getColorSeveridad(alerta.severidad)} ${ds.animation.normal} hover:scale-[1.02]`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-white/20 dark:bg-black/20 rounded-xl flex items-center justify-center text-2xl">
                      {getIconoTipo(alerta.tipo)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className={`${ds.typography.h3} font-semibold`}>{alerta.titulo}</h4>
                        <span className={`${ds.badge.base} ${getColorBotonSeveridad(alerta.severidad)}`}>
                          {alerta.severidad.toUpperCase()}
                        </span>
                      </div>
                      <p className={`${ds.typography.body} mb-3`}>{alerta.mensaje}</p>
                      
                      {alerta.clienteId && (
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-2 h-2 bg-current rounded-full"></div>
                          <p className={`${ds.typography.caption} opacity-75`}>
                            Cliente: {alerta.clienteId}
                          </p>
                        </div>
                      )}
                      
                      {alerta.claseId && (
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-2 h-2 bg-current rounded-full"></div>
                          <p className={`${ds.typography.caption} opacity-75`}>
                            Clase: {alerta.claseId}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-2 h-2 bg-current rounded-full"></div>
                        <p className={`${ds.typography.caption} opacity-75`}>
                          {formatearFecha(alerta.fechaCreacion)}
                        </p>
                      </div>
                      
                      {alerta.accionRecomendada && (
                        <div className="mt-4 p-4 bg-white/30 dark:bg-black/30 rounded-xl border-l-4 border-current">
                          <p className={`${ds.typography.bodySmall} font-semibold mb-2`}>Acción Recomendada:</p>
                          <p className={`${ds.typography.bodySmall}`}>{alerta.accionRecomendada}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => dismissAlerta(alerta.id)}
                    className="ml-4 w-8 h-8 bg-white/20 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-black/40 rounded-lg flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
                    title="Descartar alerta"
                  >
                    <span className="text-lg">✕</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Alertas Críticas Destacadas */}
      {contarPorSeveridad('alta') > 0 && (
        <div className={`${ds.color.errorBg} ${ds.color.errorBgDark} border border-[#FECACA] dark:border-[#991B1B] rounded-2xl p-8 shadow-lg`}>
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-[#EF4444] dark:bg-[#F87171] rounded-xl flex items-center justify-center mr-4">
              <span className="text-2xl">🚨</span>
            </div>
            <h3 className={`${ds.typography.h2} font-semibold ${ds.color.error}`}>
              Alertas Críticas que Requieren Atención Inmediata
            </h3>
          </div>
          <div className="space-y-4">
            {alertasFiltradas
              .filter(alerta => alerta.severidad === 'alta')
              .slice(0, 3)
              .map((alerta) => (
                <div key={alerta.id} className="bg-white dark:bg-[#1E1E2E] rounded-2xl p-6 border border-[#FECACA] dark:border-[#991B1B] shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-[#EF4444] dark:bg-[#F87171] rounded-lg flex items-center justify-center">
                        <span className="text-lg">{getIconoTipo(alerta.tipo)}</span>
                      </div>
                      <div>
                        <p className={`${ds.typography.h3} font-semibold ${ds.color.error}`}>{alerta.titulo}</p>
                        <p className={`${ds.typography.body} text-[#991B1B] dark:text-[#FECACA]`}>{alerta.mensaje}</p>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      onClick={() => {
                        // Aquí se podría implementar una acción específica
                        console.log('Acción para alerta:', alerta.id);
                      }}
                    >
                      Actuar Ahora
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};