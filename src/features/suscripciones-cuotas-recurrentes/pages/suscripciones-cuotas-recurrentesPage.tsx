import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Tabs, MetricCards, Button } from '../../../components/componentsreutilizables';
import {
  SuscripcionesManager,
  GestorCuotas,
  UpgradeDowngrade,
  FreezeSuscripcion,
  Multisesion,
  RenovacionesAutomaticas,
  AnalyticsSuscripciones,
} from '../components';
import {
  getSuscripciones,
  updateSuscripcion,
  deleteSuscripcion,
} from '../api/suscripciones';
import {
  CreditCard,
  Calendar,
  TrendingUp,
  RefreshCw,
  ArrowUpDown,
  Pause,
  Layers,
} from 'lucide-react';
import { Suscripcion } from '../types';

/**
 * Página principal de Suscripciones & Cuotas Recurrentes
 * 
 * Adaptada según el rol del usuario:
 * - Entrenadores: Paquetes mensuales PT (4/8/12 sesiones/mes), pagos recurrentes 1 a 1
 * - Gimnasios: Cuotas de socios, freeze, upgrade/downgrade, multisesión
 */
export default function SuscripcionesCuotasRecurrentesPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const role = esEntrenador ? 'entrenador' : 'gimnasio';

  const [tabActiva, setTabActiva] = useState<string>('suscripciones');
  const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [suscripcionSeleccionada, setSuscripcionSeleccionada] = useState<Suscripcion | null>(null);

  useEffect(() => {
    loadSuscripciones();
  }, [role, user?.id]);

  const loadSuscripciones = async () => {
    setLoading(true);
    try {
      const data = await getSuscripciones(role, user?.id);
      setSuscripciones(data);
    } catch (error) {
      console.error('Error cargando suscripciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSuscripcion = async (id: string, data: any) => {
    try {
      await updateSuscripcion(id, data);
      await loadSuscripciones();
    } catch (error) {
      console.error('Error actualizando suscripción:', error);
    }
  };

  const handleCancelSuscripcion = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres cancelar esta suscripción?')) {
      try {
        await deleteSuscripcion(id);
        await loadSuscripciones();
      } catch (error) {
        console.error('Error cancelando suscripción:', error);
      }
    }
  };

  // Métricas adaptadas según el rol
  const metricas = useMemo(() => {
    const activas = suscripciones.filter(s => s.estado === 'activa').length;
    const pausadas = suscripciones.filter(s => s.estado === 'pausada').length;
    const ingresosRecurrentes = suscripciones
      .filter(s => s.estado === 'activa')
      .reduce((sum, s) => sum + s.precio, 0);
    
    const sesionesDisponibles = esEntrenador
      ? suscripciones.reduce((sum, s) => sum + (s.sesionesDisponibles || 0), 0)
      : 0;

    return [
      {
        id: 'activas',
        title: esEntrenador ? 'Suscripciones PT' : 'Membresías Activas',
        value: activas.toString(),
        subtitle: `${suscripciones.length} total`,
        icon: <CreditCard className="w-5 h-5" />,
        color: 'success' as const,
      },
      {
        id: 'ingresos',
        title: 'Ingresos Recurrentes',
        value: `${ingresosRecurrentes.toFixed(0)} €`,
        subtitle: 'Mensual',
        icon: <TrendingUp className="w-5 h-5" />,
        color: 'primary' as const,
      },
      ...(esEntrenador
        ? [
            {
              id: 'sesiones',
              title: 'Sesiones Disponibles',
              value: sesionesDisponibles.toString(),
              subtitle: 'Total clientes',
              icon: <Calendar className="w-5 h-5" />,
              color: 'info' as const,
            },
          ]
        : [
            {
              id: 'freeze',
              title: 'En Freeze',
              value: pausadas.toString(),
              subtitle: pausadas > 0 ? 'Pausadas' : 'Todas activas',
              icon: <Pause className="w-5 h-5" />,
              color: pausadas > 0 ? ('warning' as const) : ('success' as const),
            },
          ]),
      {
        id: 'renovaciones',
        title: 'Próximas Renovaciones',
        value: suscripciones.filter(s => {
          if (!s.proximaRenovacion) return false;
          const fecha = new Date(s.proximaRenovacion);
          const hoy = new Date();
          const diffDias = (fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
          return diffDias <= 7 && diffDias >= 0;
        }).length.toString(),
        subtitle: 'Esta semana',
        icon: <RefreshCw className="w-5 h-5" />,
        color: 'info' as const,
      },
    ];
  }, [suscripciones, esEntrenador]);

  // Tabs adaptadas según el rol
  const tabs = useMemo(() => {
    const comunes = [
      {
        id: 'suscripciones',
        label: esEntrenador ? 'Mis Suscripciones PT' : 'Suscripciones',
        icon: <CreditCard className="w-4 h-4" />,
      },
      {
        id: 'cuotas',
        label: 'Cuotas Recurrentes',
        icon: <CreditCard className="w-4 h-4" />,
      },
      {
        id: 'renovaciones',
        label: 'Renovaciones',
        icon: <RefreshCw className="w-4 h-4" />,
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: <TrendingUp className="w-4 h-4" />,
      },
    ];

    // Solo para gimnasios
    if (!esEntrenador) {
      comunes.splice(2, 0, {
        id: 'freeze',
        label: 'Freeze',
        icon: <Pause className="w-4 h-4" />,
      });
      comunes.splice(3, 0, {
        id: 'multisesion',
        label: 'Multisesión',
        icon: <Layers className="w-4 h-4" />,
      });
      comunes.splice(4, 0, {
        id: 'upgrade-downgrade',
        label: 'Upgrade/Downgrade',
        icon: <ArrowUpDown className="w-4 h-4" />,
      });
    }

    return comunes;
  }, [esEntrenador]);

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'suscripciones':
        return (
          <SuscripcionesManager
            suscripciones={suscripciones}
            userType={role}
            onUpdate={handleUpdateSuscripcion}
            onCancel={handleCancelSuscripcion}
          />
        );
      case 'cuotas':
        return <GestorCuotas />;
      case 'renovaciones':
        return <RenovacionesAutomaticas />;
      case 'analytics':
        return (
          <AnalyticsSuscripciones
            suscripciones={suscripciones}
            userType={role}
          />
        );
      case 'freeze':
        if (!esEntrenador) {
          return (
            <div className="space-y-4">
              {suscripcionSeleccionada ? (
                <>
                  <Card className="bg-white shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Suscripción seleccionada: {suscripcionSeleccionada.clienteNombre}
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setSuscripcionSeleccionada(null)}>
                        Cambiar
                      </Button>
                    </div>
                  </Card>
                  <FreezeSuscripcion
                    suscripcion={suscripcionSeleccionada}
                    onSuccess={loadSuscripciones}
                  />
                </>
              ) : (
                <>
                  <Card className="bg-white shadow-sm p-6">
                    <p className="text-base text-gray-600 mb-4">
                      Selecciona una suscripción de la lista para gestionar el freeze
                    </p>
                  </Card>
                  <SuscripcionesManager
                    suscripciones={suscripciones}
                    userType={role}
                    onUpdate={handleUpdateSuscripcion}
                    onCancel={handleCancelSuscripcion}
                    onSelect={setSuscripcionSeleccionada}
                  />
                </>
              )}
            </div>
          );
        }
        return null;
      case 'multisesion':
        if (!esEntrenador) {
          return (
            <div className="space-y-4">
              {suscripcionSeleccionada ? (
                <>
                  <Card className="bg-white shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Suscripción seleccionada: {suscripcionSeleccionada.clienteNombre}
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setSuscripcionSeleccionada(null)}>
                        Cambiar
                      </Button>
                    </div>
                  </Card>
                  <Multisesion
                    suscripcion={suscripcionSeleccionada}
                    onSuccess={loadSuscripciones}
                  />
                </>
              ) : (
                <>
                  <Card className="bg-white shadow-sm p-6">
                    <p className="text-base text-gray-600 mb-4">
                      Selecciona una suscripción de la lista para gestionar multisesión
                    </p>
                  </Card>
                  <SuscripcionesManager
                    suscripciones={suscripciones}
                    userType={role}
                    onUpdate={handleUpdateSuscripcion}
                    onCancel={handleCancelSuscripcion}
                    onSelect={setSuscripcionSeleccionada}
                  />
                </>
              )}
            </div>
          );
        }
        return null;
      case 'upgrade-downgrade':
        if (!esEntrenador) {
          return (
            <div className="space-y-4">
              {suscripcionSeleccionada ? (
                <>
                  <Card className="bg-white shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Suscripción seleccionada: {suscripcionSeleccionada.clienteNombre}
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setSuscripcionSeleccionada(null)}>
                        Cambiar
                      </Button>
                    </div>
                  </Card>
                  <UpgradeDowngrade
                    suscripcion={suscripcionSeleccionada}
                    onSuccess={loadSuscripciones}
                  />
                </>
              ) : (
                <>
                  <Card className="bg-white shadow-sm p-6">
                    <p className="text-base text-gray-600 mb-4">
                      Selecciona una suscripción de la lista para cambiar de plan
                    </p>
                  </Card>
                  <SuscripcionesManager
                    suscripciones={suscripciones}
                    userType={role}
                    onUpdate={handleUpdateSuscripcion}
                    onCancel={handleCancelSuscripcion}
                    onSelect={setSuscripcionSeleccionada}
                  />
                </>
              )}
            </div>
          );
        }
        return null;
      default:
        return (
          <SuscripcionesManager
            suscripciones={suscripciones}
            userType={role}
            onUpdate={handleUpdateSuscripcion}
            onCancel={handleCancelSuscripcion}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header con icono y título */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <CreditCard size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  {esEntrenador ? 'Suscripciones PT & Cuotas Recurrentes' : 'Suscripciones & Cuotas Recurrentes'}
                </h1>
                <p className="text-gray-600">
                  {esEntrenador
                    ? 'Gestiona los paquetes mensuales PT de tus clientes (4/8/12 sesiones/mes) y automatiza los pagos recurrentes 1 a 1.'
                    : 'Gestiona las cuotas de socios, freeze de membresías, upgrades/downgrades y multisesión. Automatiza completamente la gestión de membresías.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Métricas */}
          <MetricCards data={metricas} columns={4} />

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
                    className={
                      tabActiva === tab.id
                        ? "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                        : "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70"
                    }
                  >
                    <span className={tabActiva === tab.id ? "opacity-100" : "opacity-70"}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6 px-4 pb-4">
              {renderTabContent()}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

