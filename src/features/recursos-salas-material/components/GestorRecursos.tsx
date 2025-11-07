import React, { useState, useEffect } from 'react';
import { MetricCards, Card } from '../../../components/componentsreutilizables';
import { SalasDisponibles } from './SalasDisponibles';
import { ControlAforo } from './ControlAforo';
import { BloqueosMantenimiento } from './BloqueosMantenimiento';
import { MaterialDisponible } from './MaterialDisponible';
import { ReservasSalas } from './ReservasSalas';
import { MantenimientoPreventivo } from './MantenimientoPreventivo';
import { AnalyticsRecursos } from './AnalyticsRecursos';
import { salasApi, materialApi } from '../api';
import { 
  Building2, 
  Users, 
  Package, 
  Calendar, 
  Wrench, 
  BarChart3
} from 'lucide-react';

export const GestorRecursos: React.FC = () => {
  const [tabActiva, setTabActiva] = useState('overview');
  const [stats, setStats] = useState({
    totalSalas: 0,
    salasDisponibles: 0,
    salasOcupadas: 0,
    salasMantenimiento: 0,
    totalMaterial: 0,
    materialDisponible: 0,
    materialEnUso: 0,
    reservasHoy: 0,
    ocupacionPromedio: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const salas = await salasApi.obtenerSalas();
      const material = await materialApi.obtenerMaterial();

      const salasDisponibles = salas.filter(s => s.estado === 'disponible').length;
      const salasOcupadas = salas.filter(s => s.estado === 'ocupada').length;
      const salasMantenimiento = salas.filter(s => s.estado === 'mantenimiento' || s.estado === 'bloqueada').length;
      
      const materialDisponible = material.filter(m => m.estado === 'disponible').reduce((sum, m) => sum + m.cantidadDisponible, 0);
      const materialEnUso = material.reduce((sum, m) => sum + m.cantidadEnUso, 0);
      
      const ocupacionPromedio = salas.length > 0 
        ? Math.round(salas.reduce((sum, s) => sum + (s.ocupacionActual / s.capacidad * 100), 0) / salas.length)
        : 0;

      setStats({
        totalSalas: salas.length,
        salasDisponibles,
        salasOcupadas,
        salasMantenimiento,
        totalMaterial: material.length,
        materialDisponible,
        materialEnUso,
        reservasHoy: 0,
        ocupacionPromedio
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: 'overview',
      label: 'Resumen',
      icon: BarChart3
    },
    {
      id: 'salas',
      label: 'Salas',
      icon: Building2
    },
    {
      id: 'material',
      label: 'Material',
      icon: Package
    },
    {
      id: 'aforo',
      label: 'Control Aforo',
      icon: Users
    },
    {
      id: 'reservas',
      label: 'Reservas',
      icon: Calendar
    },
    {
      id: 'bloqueos',
      label: 'Bloqueos',
      icon: Wrench
    },
    {
      id: 'mantenimiento',
      label: 'Mantenimiento',
      icon: Wrench
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3
    }
  ];

  const metricas = [
    {
      id: 'salas-total',
      title: 'Salas Totales',
      value: stats.totalSalas,
      subtitle: `${stats.salasDisponibles} disponibles`,
      color: 'info' as const,
      loading
    },
    {
      id: 'ocupacion',
      title: 'Ocupación Promedio',
      value: `${stats.ocupacionPromedio}%`,
      subtitle: `${stats.salasOcupadas} salas ocupadas`,
      color: stats.ocupacionPromedio > 80 ? 'success' as const : stats.ocupacionPromedio > 50 ? 'info' as const : 'warning' as const,
      loading
    },
    {
      id: 'material-disponible',
      title: 'Material Disponible',
      value: stats.materialDisponible,
      subtitle: `${stats.materialEnUso} en uso`,
      color: 'info' as const,
      loading
    },
    {
      id: 'mantenimiento',
      title: 'En Mantenimiento',
      value: stats.salasMantenimiento,
      subtitle: 'Salas bloqueadas',
      color: stats.salasMantenimiento > 0 ? 'warning' as const : 'success' as const,
      loading
    }
  ];

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'overview':
        return (
          <div className="space-y-6">
            <MetricCards data={metricas} columns={4} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-4 bg-white shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Salas por Estado
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Disponibles</span>
                    <span className="text-base font-semibold text-green-600">
                      {stats.salasDisponibles}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ocupadas</span>
                    <span className="text-base font-semibold text-blue-600">
                      {stats.salasOcupadas}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Mantenimiento</span>
                    <span className="text-base font-semibold text-yellow-600">
                      {stats.salasMantenimiento}
                    </span>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-white shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Material por Estado
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Disponible</span>
                    <span className="text-base font-semibold text-green-600">
                      {stats.materialDisponible}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">En Uso</span>
                    <span className="text-base font-semibold text-blue-600">
                      {stats.materialEnUso}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Items</span>
                    <span className="text-base font-semibold text-gray-900">
                      {stats.totalMaterial}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );
      case 'salas':
        return <SalasDisponibles />;
      case 'material':
        return <MaterialDisponible />;
      case 'aforo':
        return <ControlAforo />;
      case 'reservas':
        return <ReservasSalas />;
      case 'bloqueos':
        return <BloqueosMantenimiento />;
      case 'mantenimiento':
        return <MantenimientoPreventivo />;
      case 'analytics':
        return <AnalyticsRecursos />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sistema de Tabs según guía */}
      <Card className="p-0 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div
            role="tablist"
            aria-label="Secciones"
            className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
          >
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
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
                  role="tab"
                  aria-selected={isActive}
                >
                  <IconComponent size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>
      
      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

