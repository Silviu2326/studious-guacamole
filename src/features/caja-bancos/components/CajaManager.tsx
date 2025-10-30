import React, { useState, useEffect } from 'react';
import { Card, Button, MetricCards, Tabs } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { useCajaBancos } from '../hooks/useCajaBancos';
import { MovimientoCaja } from '../types';
import { MovimientosList } from './MovimientosList';
import { NuevoMovimientoModal } from './NuevoMovimientoModal';
import { ArqueoCajaModal } from './ArqueoCajaModal';

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
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
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
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      ),
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
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
        </svg>
      ),
      color: 'warning' as const
    },
    {
      id: 'saldo-neto',
      title: 'Saldo Neto Hoy',
      value: formatearMoneda(estadisticasHoy.saldo),
      subtitle: 'Ingresos - Egresos',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: estadisticasHoy.saldo >= 0 ? 'success' as const : 'error' as const
    }
  ];

  const tabs = [
    {
      id: 'movimientos',
      label: 'Movimientos',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      id: 'estadisticas',
      label: 'Estadísticas',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Error al cargar datos
          </h3>
          <p className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
            {error}
          </p>
          <Button onClick={limpiarError} variant="primary">
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`${ds.typography.h1} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            Gestión de Caja
          </h1>
          <p className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-1`}>
            Control de efectivo y movimientos diarios
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setMostrarArqueo(true)}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Arqueo de Caja
          </Button>
          <Button
            variant="primary"
            onClick={() => setMostrarNuevoMovimiento(true)}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Movimiento
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <MetricCards data={metricas} columns={4} />

      {/* Contenido principal */}
      <Card>
        <div className="p-6">
          <Tabs
            items={tabs}
            activeTab={tabActiva}
            onTabChange={setTabActiva}
          />
          
          <div className="mt-6">
            {tabActiva === 'movimientos' && (
              <MovimientosList 
                movimientos={movimientos}
                loading={loading}
                onRefresh={cargarDatos}
              />
            )}
            
            {tabActiva === 'estadisticas' && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                  Estadísticas Detalladas
                </h3>
                <p className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                  Próximamente: Gráficos y análisis detallados de movimientos
                </p>
              </div>
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