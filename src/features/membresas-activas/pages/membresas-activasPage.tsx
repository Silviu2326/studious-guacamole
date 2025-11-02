import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards, Button } from '../../../components/componentsreutilizables';
import {
  MembresiasList,
  EstadoPagoComponent,
  SeguimientoMensualidades,
  AlertasVencimiento,
} from '../components';
import {
  getMembresiasActivas,
  getSociosActivos,
  updateMembresia,
  cancelMembresia,
  renewMembresia,
  processPayment,
  sendReminder,
  getEstadoPago,
} from '../api/membresias';
import {
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CreditCard,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { Membresia, EstadoMembresia } from '../types';

/**
 * Página principal de Membresías Activas
 * 
 * Adaptada según el rol del usuario:
 * - Entrenadores: Quién me está pagando la mensualidad privada
 * - Gimnasios: Todos los socios activos, su estado de pago
 */
export default function MembresiasActivasPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const role = esEntrenador ? 'entrenador' : 'gimnasio';

  const [tabActiva, setTabActiva] = useState<string>('membresias');
  const [membresias, setMembresias] = useState<Membresia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembresias();
  }, [role, user?.id]);

  const loadMembresias = async () => {
    setLoading(true);
    try {
      const data = await getMembresiasActivas(role, user?.id);
      setMembresias(data);
    } catch (error) {
      console.error('Error cargando membresías:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMembresia = async (id: string, data: any) => {
    try {
      await updateMembresia(id, data);
      await loadMembresias();
    } catch (error) {
      console.error('Error actualizando membresía:', error);
    }
  };

  const handleCancelMembresia = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres cancelar esta membresía?')) {
      try {
        await cancelMembresia(id);
        await loadMembresias();
      } catch (error) {
        console.error('Error cancelando membresía:', error);
      }
    }
  };

  const handleRenewMembresia = async (id: string) => {
    try {
      await renewMembresia(id);
      await loadMembresias();
    } catch (error) {
      console.error('Error renovando membresía:', error);
    }
  };

  const handleProcessPayment = async (id: string) => {
    try {
      const membresia = membresias.find(m => m.id === id);
      if (!membresia) return;
      
      await processPayment(id, membresia.precioMensual, 'transferencia');
      await loadMembresias();
    } catch (error) {
      console.error('Error procesando pago:', error);
    }
  };

  const handleSendReminder = async (id: string) => {
    try {
      await sendReminder(id);
      alert('Recordatorio enviado');
    } catch (error) {
      console.error('Error enviando recordatorio:', error);
    }
  };

  // Métricas adaptadas según el rol
  const metricas = useMemo(() => {
    const activas = membresias.filter(m => m.estado === 'activa').length;
    const vencidas = membresias.filter(m => m.estado === 'vencida').length;
    const totalIngresos = membresias
      .filter(m => m.estado === 'activa')
      .reduce((sum, m) => sum + m.precioMensual, 0);
    const pagosPendientes = membresias.filter(m => m.estadoPago === 'pendiente').length;

    return [
      {
        id: 'activas',
        title: esEntrenador ? 'Clientes Activos' : 'Socios Activos',
        value: activas.toString(),
        subtitle: `${membresias.length} total`,
        icon: <Users className="w-5 h-5" />,
        color: 'success' as const,
      },
      {
        id: 'vencidas',
        title: 'Vencidas',
        value: vencidas.toString(),
        subtitle: vencidas > 0 ? 'Requieren atención' : 'Todas al día',
        icon: <AlertTriangle className="w-5 h-5" />,
        color: vencidas > 0 ? ('error' as const) : ('success' as const),
      },
      {
        id: 'ingresos',
        title: 'Ingresos Mensuales',
        value: `${totalIngresos.toFixed(0)} €`,
        subtitle: 'Estimado',
        icon: <DollarSign className="w-5 h-5" />,
        color: 'primary' as const,
      },
      {
        id: 'pendientes',
        title: 'Pagos Pendientes',
        value: pagosPendientes.toString(),
        subtitle: pagosPendientes > 0 ? 'Requieren seguimiento' : 'Al día',
        icon: <CreditCard className="w-5 h-5" />,
        color: pagosPendientes > 0 ? ('warning' as const) : ('success' as const),
      },
    ];
  }, [membresias, esEntrenador]);

  // Tabs adaptadas según el rol
  const tabs = useMemo(() => {
    const comunes = [
      {
        id: 'membresias',
        label: esEntrenador ? 'Mis Membresías PT' : 'Membresías Activas',
        icon: Users,
      },
      {
        id: 'seguimiento',
        label: 'Seguimiento Mensual',
        icon: Calendar,
      },
      {
        id: 'alertas',
        label: 'Alertas',
        icon: AlertTriangle,
      },
    ];

    return comunes;
  }, [esEntrenador]);

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'membresias':
        return (
          <MembresiasList
            membresias={membresias}
            userType={role}
            onUpdate={handleUpdateMembresia}
            onCancel={handleCancelMembresia}
            onRenew={handleRenewMembresia}
            onProcessPayment={handleProcessPayment}
          />
        );
      case 'seguimiento':
        return <SeguimientoMensualidades role={role} userId={user?.id} />;
      case 'alertas':
        return <AlertasVencimiento role={role} userId={user?.id} />;
      default:
        return (
          <MembresiasList
            membresias={membresias}
            userType={role}
            onUpdate={handleUpdateMembresia}
            onCancel={handleCancelMembresia}
            onRenew={handleRenewMembresia}
            onProcessPayment={handleProcessPayment}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Users size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    {esEntrenador ? 'Membresías PT Activas' : 'Membresías Activas'}
                  </h1>
                  <p className="text-gray-600">
                    {esEntrenador
                      ? 'Gestiona las membresías privadas de entrenamiento personal. Ve quién te está pagando la mensualidad y el estado de cada membresía.'
                      : 'Gestiona todos los socios activos del gimnasio. Controla el estado de pago, vencimientos y alertas de cada membresía.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Button variant="primary" size="md" onClick={loadMembresias} disabled={loading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Actualizar
                </Button>
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
                aria-label="Secciones membresías"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                {tabs.map((tab) => {
                  const activo = tabActiva === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={activo}
                      onClick={() => setTabActiva(tab.id)}
                      className={[
                        'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                        activo
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      ].join(' ')}
                    >
                      {Icon && <Icon size={18} className={activo ? 'opacity-100' : 'opacity-70'} />}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Contenido de la pestaña activa */}
          <div className="mt-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

