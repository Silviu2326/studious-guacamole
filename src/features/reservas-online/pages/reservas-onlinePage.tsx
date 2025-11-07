import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
import {
  ReservasOnline,
  HistorialReservas,
  Cancelaciones,
  ListaEspera,
  RecordatoriosReserva,
  AnalyticsReservas,
} from '../components';
import { Calendar, Clock, DollarSign, TrendingUp, Users, Bell, XCircle, BarChart3 } from 'lucide-react';
import { Reserva } from '../types';
import { getReservas } from '../api';

/**
 * Página principal de Reservas Online
 * 
 * Adaptada según el rol del usuario:
 * - Entrenadores: Sesiones 1 a 1, reservas directas con clientes según horarios disponibles
 * - Gimnasios: Clases grupales, reservas de plazas en spinning, boxeo, HIIT, fisio, nutrición, masaje
 */
export default function ReservasOnlinePage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const role = esEntrenador ? 'entrenador' : 'gimnasio';
  
  const [tabActiva, setTabActiva] = useState<string>('nueva-reserva');
  const [reservas, setReservas] = useState<Reserva[]>([]);

  useEffect(() => {
    const cargarReservas = async () => {
      const fechaInicio = new Date();
      fechaInicio.setMonth(fechaInicio.getMonth() - 1);
      const fechaFin = new Date();
      fechaFin.setMonth(fechaFin.getMonth() + 1);
      
      const datos = await getReservas(fechaInicio, fechaFin, role);
      setReservas(datos);
    };
    cargarReservas();
  }, [role]);

  const tabItems = useMemo(() => {
    const comunes = [
      { id: 'nueva-reserva', label: 'Nueva Reserva', icon: Calendar },
      { id: 'historial', label: 'Historial', icon: Clock },
      { id: 'cancelaciones', label: 'Cancelaciones', icon: XCircle },
      { id: 'recordatorios', label: 'Recordatorios', icon: Bell },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ];
    
    if (!esEntrenador) {
      comunes.splice(3, 0, { id: 'lista-espera', label: 'Lista de Espera', icon: Users });
    }
    
    return comunes;
  }, [esEntrenador]);

  const handleReservaCreada = (reserva: Reserva) => {
    setReservas([...reservas, reserva]);
    setTabActiva('historial');
  };

  const handleCancelar = (reservaId: string) => {
    setReservas(reservas.map((r) => (r.id === reservaId ? { ...r, estado: 'cancelada' } : r)));
  };

  const reservasConfirmadas = reservas.filter((r) => r.estado === 'confirmada').length;
  const reservasCanceladas = reservas.filter((r) => r.estado === 'cancelada').length;
  const ingresosTotales = reservas.filter((r) => r.pagado).reduce((sum, r) => sum + r.precio, 0);
  const tasaOcupacion = reservas.length > 0 
    ? Math.round((reservasConfirmadas / reservas.length) * 100) 
    : 0;

  const metrics = [
    {
      id: 'reservas-totales',
      title: 'Reservas Totales',
      value: reservas.length.toString(),
      icon: <Calendar className="w-6 h-6" />,
      color: 'info' as const,
      trend: {
        value: 12,
        direction: 'up' as const,
      },
    },
    {
      id: 'confirmadas',
      title: 'Confirmadas',
      value: reservasConfirmadas.toString(),
      icon: <Clock className="w-6 h-6" />,
      color: 'success' as const,
      trend: {
        value: 8,
        direction: 'up' as const,
      },
    },
    {
      id: 'ingresos',
      title: 'Ingresos',
      value: `€${ingresosTotales.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'primary' as const,
      trend: {
        value: 15,
        direction: 'up' as const,
      },
    },
    {
      id: 'tasa-ocupacion',
      title: 'Tasa Ocupación',
      value: `${tasaOcupacion}%`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'warning' as const,
      trend: {
        value: 5,
        direction: 'up' as const,
      },
    },
  ];

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'nueva-reserva':
        return <ReservasOnline role={role} onReservaCreada={handleReservaCreada} />;
      case 'historial':
        return <HistorialReservas role={role} />;
      case 'cancelaciones':
        return <Cancelaciones reservas={reservas} role={role} onCancelar={handleCancelar} />;
      case 'lista-espera':
        return <ListaEspera role={role} />;
      case 'recordatorios':
        return <RecordatoriosReserva reservas={reservas} role={role} />;
      case 'analytics':
        return <AnalyticsReservas role={role} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Calendar size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Reservas Online
                </h1>
                <p className="text-gray-600">
                  {esEntrenador
                    ? 'Gestiona las reservas de sesiones 1 a 1 con tus clientes'
                    : 'Gestiona las reservas de clases grupales y servicios del centro'
                  }
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
          <MetricCards data={metrics} />

          {/* Sistema de Tabs */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones reservas"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                {tabItems.map(({ id, label, icon: Icon }) => {
                  const activo = tabActiva === id;
                  return (
                    <button
                      key={id}
                      role="tab"
                      aria-selected={activo}
                      onClick={() => setTabActiva(id)}
                      className={[
                        'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                        activo
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      ].join(' ')}
                    >
                      <Icon
                        size={18}
                        className={activo ? 'opacity-100' : 'opacity-70'}
                      />
                      <span>{label}</span>
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
