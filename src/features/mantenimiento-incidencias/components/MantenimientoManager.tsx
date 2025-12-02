import React, { useState, useEffect } from 'react';
import { Tabs, MetricCards, Card, Button } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { MantenimientoService } from '../services/mantenimientoService';
import { EstadisticasMantenimiento } from '../types';
import { GestorIncidencias } from './GestorIncidencias';
import { ChecklistMantenimiento } from './ChecklistMantenimiento';
import { SeguimientoReparaciones } from './SeguimientoReparaciones';
import { AlertasMantenimiento } from './AlertasMantenimiento';
import { 
  AlertTriangle, 
  Wrench, 
  CheckCircle, 
  Calendar, 
  TrendingUp, 
  DollarSign,
  Package,
  Settings,
  FileCheck,
  Bell
} from 'lucide-react';

export const MantenimientoManager: React.FC = () => {
  const [tabActiva, setTabActiva] = useState('dashboard');
  const [estadisticas, setEstadisticas] = useState<EstadisticasMantenimiento>({
    totalEquipamiento: 0,
    equipamientoOperativo: 0,
    equipamientoFueraServicio: 0,
    incidenciasPendientes: 0,
    incidenciasCriticas: 0,
    mantenimientosProgramados: 0,
    mantenimientosAtrasados: 0,
    reparacionesEnCurso: 0,
    costoTotalMes: 0,
    alertasPendientes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const stats = await MantenimientoService.obtenerEstadisticas();
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: 'incidencias',
      label: 'Incidencias',
      icon: <AlertTriangle className="w-4 h-4" />
    },
    {
      id: 'checklist',
      label: 'Checklist',
      icon: <FileCheck className="w-4 h-4" />
    },
    {
      id: 'reparaciones',
      label: 'Reparaciones',
      icon: <Wrench className="w-4 h-4" />
    },
    {
      id: 'alertas',
      label: 'Alertas',
      icon: <Bell className="w-4 h-4" />
    },
  ];

  const metricas = [
    {
      id: 'equipamiento-total',
      title: 'Equipamiento Total',
      value: estadisticas.totalEquipamiento,
      subtitle: `${estadisticas.equipamientoOperativo} operativo`,
      icon: <Package className="w-6 h-6" />,
      color: 'primary' as const,
    },
    {
      id: 'incidencias-pendientes',
      title: 'Incidencias Pendientes',
      value: estadisticas.incidenciasPendientes,
      subtitle: `${estadisticas.incidenciasCriticas} críticas`,
      icon: <AlertTriangle className="w-6 h-6" />,
      color: estadisticas.incidenciasCriticas > 0 ? 'error' as const : 'warning' as const,
      trend: estadisticas.incidenciasPendientes > 0 ? {
        value: estadisticas.incidenciasPendientes,
        direction: 'up' as const,
        label: 'requieren atención'
      } : undefined,
    },
    {
      id: 'mantenimientos-programados',
      title: 'Mantenimientos Programados',
      value: estadisticas.mantenimientosProgramados,
      subtitle: `${estadisticas.mantenimientosAtrasados} atrasados`,
      icon: <Calendar className="w-6 h-6" />,
      color: estadisticas.mantenimientosAtrasados > 0 ? 'warning' as const : 'info' as const,
    },
    {
      id: 'reparaciones-curso',
      title: 'Reparaciones en Curso',
      value: estadisticas.reparacionesEnCurso,
      subtitle: 'En proceso',
      icon: <Wrench className="w-6 h-6" />,
      color: estadisticas.reparacionesEnCurso > 0 ? 'warning' as const : 'success' as const,
    },
    {
      id: 'alertas-pendientes',
      title: 'Alertas Pendientes',
      value: estadisticas.alertasPendientes,
      subtitle: 'Sin resolver',
      icon: <Bell className="w-6 h-6" />,
      color: estadisticas.alertasPendientes > 0 ? 'warning' as const : 'success' as const,
    },
    {
      id: 'costo-total-mes',
      title: 'Costo Total Mes',
      value: new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
      }).format(estadisticas.costoTotalMes),
      subtitle: 'Reparaciones y mantenimiento',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'info' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <Tabs
        items={tabs}
        activeTab={tabActiva}
        onTabChange={setTabActiva}
        variant="pills"
        fullWidth
      />

      {/* Contenido según tab */}
      {tabActiva === 'dashboard' && (
        <div className="space-y-6">
          <MetricCards data={metricas} columns={3} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card padding="lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    Equipamiento Fuera de Servicio
                  </h3>
                  <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    {estadisticas.equipamientoFueraServicio} equipos no disponibles
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  variant="primary"
                  onClick={() => setTabActiva('incidencias')}
                >
                  Ver Incidencias
                </Button>
              </div>
            </Card>

            <Card padding="lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    Estado del Sistema
                  </h3>
                  <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    {estadisticas.equipamientoOperativo} / {estadisticas.totalEquipamiento} operativo
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{
                      width: `${estadisticas.totalEquipamiento > 0 
                        ? (estadisticas.equipamientoOperativo / estadisticas.totalEquipamiento) * 100 
                        : 0}%`
                    }}
                  />
                </div>
                <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-2`}>
                  {estadisticas.totalEquipamiento > 0 
                    ? Math.round((estadisticas.equipamientoOperativo / estadisticas.totalEquipamiento) * 100)
                    : 0}% de equipamiento operativo
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {tabActiva === 'incidencias' && <GestorIncidencias />}
      {tabActiva === 'checklist' && <ChecklistMantenimiento />}
      {tabActiva === 'reparaciones' && <SeguimientoReparaciones />}
      {tabActiva === 'alertas' && <AlertasMantenimiento />}
    </div>
  );
};

