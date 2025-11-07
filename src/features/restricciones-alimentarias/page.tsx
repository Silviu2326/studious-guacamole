import React, { useState } from 'react';
import { Card, Tabs, MetricCards } from '../../components/componentsreutilizables';
import { RestriccionesList, AlertasSeguridad, ValidacionIngredientes } from './components';
import { useEstadisticasRestricciones } from './hooks/useRestricciones';

export const RestriccionesAlimentariasPage: React.FC = () => {
  const { estadisticas, loading: loadingStats } = useEstadisticasRestricciones();
  const [tabActiva, setTabActiva] = useState('restricciones');

  // Configuración de pestañas
  const tabItems = [
    {
      id: 'restricciones',
      label: 'Restricciones',
      icon: '📋'
    },
    {
      id: 'alertas',
      label: 'Alertas',
      icon: '🚨'
    },
    {
      id: 'validacion',
      label: 'Validación',
      icon: '🔍'
    }
  ];

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'alertas':
        return <AlertasSeguridad />;
      case 'validacion':
        return <ValidacionIngredientes />;
      case 'restricciones':
      default:
        return <RestriccionesList />;
    }
  };

  // Datos para las tarjetas de métricas
  const metricas = estadisticas ? [
    {
      title: 'Total Restricciones',
      value: estadisticas.totalRestricciones.toString(),
      icon: '📋',
      trend: 'up',
      trendValue: '+12%',
      color: 'blue'
    },
    {
      title: 'Alertas (30 días)',
      value: estadisticas.alertasUltimos30Dias.toString(),
      icon: '🚨',
      trend: estadisticas.tendenciaAlertas === 'aumentando' ? 'up' : 
             estadisticas.tendenciaAlertas === 'disminuyendo' ? 'down' : 'neutral',
      trendValue: estadisticas.tendenciaAlertas === 'aumentando' ? '+15%' : 
                  estadisticas.tendenciaAlertas === 'disminuyendo' ? '-8%' : '0%',
      color: 'red'
    },
    {
      title: 'Clientes con Restricciones',
      value: estadisticas.clientesConRestricciones.toString(),
      icon: '👥',
      trend: 'up',
      trendValue: '+5%',
      color: 'green'
    },
    {
      title: 'Restricciones Críticas',
      value: (estadisticas.restriccionesPorSeveridad.severa + estadisticas.restriccionesPorSeveridad.critica).toString(),
      icon: '🔴',
      trend: 'down',
      trendValue: '-3%',
      color: 'orange'
    }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Restricciones Alimentarias
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sistema integral de gestión de restricciones alimentarias y alertas de seguridad sanitaria
          </p>
        </div>
        
        {/* Indicador de estado del sistema */}
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                Sistema Activo
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Monitoreo en tiempo real
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Métricas principales */}
      {!loadingStats && estadisticas && (
        <MetricCards data={metricas} />
      )}

      {/* Resumen por categorías */}
      {!loadingStats && estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Distribución por tipo */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Distribución por Tipo
            </h3>
            <div className="space-y-3">
              {Object.entries(estadisticas.restriccionesPorTipo).map(([tipo, cantidad]) => {
                const porcentaje = Math.round((cantidad / estadisticas.totalRestricciones) * 100);
                const iconos = {
                  alergia: '⚠️',
                  intolerancia: '🚫',
                  religiosa: '🕌',
                  cultural: '🌱'
                };
                const colores = {
                  alergia: 'bg-red-500',
                  intolerancia: 'bg-orange-500',
                  religiosa: 'bg-purple-500',
                  cultural: 'bg-green-500'
                };
                
                return (
                  <div key={tipo} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{iconos[tipo as keyof typeof iconos]}</span>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {tipo}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${colores[tipo as keyof typeof colores]}`}
                          style={{ width: `${porcentaje}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 w-12 text-right">
                        {cantidad}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Distribución por severidad */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Distribución por Severidad
            </h3>
            <div className="space-y-3">
              {Object.entries(estadisticas.restriccionesPorSeveridad).map(([severidad, cantidad]) => {
                const porcentaje = Math.round((cantidad / estadisticas.totalRestricciones) * 100);
                const iconos = {
                  leve: '🟢',
                  moderada: '🟡',
                  severa: '🟠',
                  critica: '🔴'
                };
                const colores = {
                  leve: 'bg-green-500',
                  moderada: 'bg-yellow-500',
                  severa: 'bg-orange-500',
                  critica: 'bg-red-500'
                };
                
                return (
                  <div key={severidad} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{iconos[severidad as keyof typeof iconos]}</span>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {severidad}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${colores[severidad as keyof typeof colores]}`}
                          style={{ width: `${porcentaje}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 w-12 text-right">
                        {cantidad}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Ingredientes más problemáticos */}
      {!loadingStats && estadisticas && estadisticas.ingredientesMasProblematicos.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ingredientes Más Problemáticos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {estadisticas.ingredientesMasProblematicos.map((item, index) => (
              <div key={item.ingrediente} className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {item.ingrediente}
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400">
                    {item.alertas} alertas
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Navegación por pestañas */}
      <Tabs
        items={tabItems}
        activeTab={tabActiva}
        onTabChange={setTabActiva}
      />

      {/* Contenido de la pestaña activa */}
      <div>
        {renderTabContent()}
      </div>

      {/* Información de compliance */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <span className="text-blue-500 text-xl">🛡️</span>
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Cumplimiento Normativo y Seguridad
            </h4>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <p>• <strong>Obligatorio:</strong> Este módulo es requerido por normativas sanitarias para centros que ofrecen servicios nutricionales</p>
              <p>• <strong>Protección Legal:</strong> Registra todas las restricciones y acciones tomadas para auditorías</p>
              <p>• <strong>Seguridad del Cliente:</strong> Previene reacciones adversas mediante validación automática</p>
              <p>• <strong>Monitoreo Continuo:</strong> Sistema de alertas en tiempo real para máxima seguridad</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};