import React, { useState, useEffect } from 'react';
import { Card, Button, MetricCards } from '../../../components/componentsreutilizables';
import { useCajaBancos } from '../hooks/useCajaBancos';
import { MovimientoCaja } from '../types';
import { MovimientosList } from './MovimientosList';
import { NuevoMovimientoModal } from './NuevoMovimientoModal';
import { ArqueoCajaModal } from './ArqueoCajaModal';
import { Wallet, ArrowUp, ArrowDown, TrendingUp, ClipboardCheck, Plus, AlertCircle } from 'lucide-react';

export const CajaManager: React.FC = () => {
  const {
    movimientos,
    loading,
    error,
    obtenerSaldoCaja,
    obtenerEstadisticasDiarias,
    crearMovimiento,
    limpiarError
  } = useCajaBancos();

  const [saldoCaja, setSaldoCaja] = useState(0);
  const [estadisticasHoy, setEstadisticasHoy] = useState({
    ingresos: 0,
    egresos: 0,
    saldo: 0,
    movimientos: 0
  });
  const [mostrarNuevoMovimiento, setMostrarNuevoMovimiento] = useState(false);
  const [mostrarArqueo, setMostrarArqueo] = useState(false);
  const [tabActiva, setTabActiva] = useState('movimientos');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [saldo, estadisticas] = await Promise.all([
        obtenerSaldoCaja(),
        obtenerEstadisticasDiarias(new Date())
      ]);
      setSaldoCaja(saldo);
      setEstadisticasHoy(estadisticas);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const handleNuevoMovimiento = async (movimiento: Omit<MovimientoCaja, 'id'>) => {
    try {
      await crearMovimiento(movimiento);
      setMostrarNuevoMovimiento(false);
      cargarDatos(); // Recargar estadísticas
    } catch (error) {
      console.error('Error al crear movimiento:', error);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const metricas = [
    {
      id: 'saldo-caja',
      title: 'Saldo en Caja',
      value: formatearMoneda(saldoCaja),
      subtitle: 'Efectivo disponible',
      icon: <Wallet className="w-6 h-6" />,
      color: 'primary' as const
    },
    {
      id: 'ingresos-hoy',
      title: 'Ingresos Hoy',
      value: formatearMoneda(estadisticasHoy.ingresos),
      subtitle: `${estadisticasHoy.movimientos} movimientos`,
      trend: {
        value: 12.5,
        direction: 'up' as const,
        label: 'vs ayer'
      },
      icon: <ArrowUp className="w-6 h-6" />,
      color: 'success' as const
    },
    {
      id: 'egresos-hoy',
      title: 'Egresos Hoy',
      value: formatearMoneda(estadisticasHoy.egresos),
      subtitle: 'Gastos del día',
      trend: {
        value: 8.2,
        direction: 'down' as const,
        label: 'vs ayer'
      },
      icon: <ArrowDown className="w-6 h-6" />,
      color: 'warning' as const
    },
    {
      id: 'saldo-neto',
      title: 'Saldo Neto Hoy',
      value: formatearMoneda(estadisticasHoy.saldo),
      subtitle: 'Ingresos - Egresos',
      icon: <TrendingUp className="w-6 h-6" />,
      color: estadisticasHoy.saldo >= 0 ? 'success' as const : 'error' as const
    }
  ];

  const tabs = [
    {
      id: 'movimientos',
      label: 'Movimientos',
      icon: <ClipboardCheck className="w-4 h-4" />
    },
    {
      id: 'estadisticas',
      label: 'Estadísticas',
      icon: <TrendingUp className="w-4 h-4" />
    }
  ];

  if (error) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Error al cargar datos
        </h3>
        <p className="text-gray-600 mb-4">
          {error}
        </p>
        <Button onClick={limpiarError} variant="primary">
          Reintentar
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setMostrarArqueo(true)}
          >
            <ClipboardCheck size={20} className="mr-2" />
            Arqueo de Caja
          </Button>
          <Button
            variant="primary"
            onClick={() => setMostrarNuevoMovimiento(true)}
          >
            <Plus size={20} className="mr-2" />
            Nuevo Movimiento
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <MetricCards data={metricas} />

      {/* Contenido principal */}
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
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  tabActiva === tab.id
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                {tab.icon && (
                  <span className={tabActiva === tab.id ? 'opacity-100' : 'opacity-70'}>
                    {tab.icon}
                  </span>
                )}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="px-4 pb-6">
          <div className="mt-6">
            {tabActiva === 'movimientos' && (
              <MovimientosList 
                movimientos={movimientos}
                loading={loading}
                onRefresh={cargarDatos}
              />
            )}
            
            {tabActiva === 'estadisticas' && (
              <Card className="p-8 text-center bg-white shadow-sm">
                <TrendingUp size={48} className="mx-auto text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Estadísticas Detalladas
                </h3>
                <p className="text-gray-600">
                  Próximamente: Gráficos y análisis detallados de movimientos
                </p>
              </Card>
            )}
          </div>
        </div>
      </Card>

      {/* Modales */}
      {mostrarNuevoMovimiento && (
        <NuevoMovimientoModal
          onClose={() => setMostrarNuevoMovimiento(false)}
          onSubmit={handleNuevoMovimiento}
        />
      )}

      {mostrarArqueo && (
        <ArqueoCajaModal
          onClose={() => setMostrarArqueo(false)}
          saldoSistema={saldoCaja}
          onArqueoCompleto={cargarDatos}
        />
      )}
    </div>
  );
};