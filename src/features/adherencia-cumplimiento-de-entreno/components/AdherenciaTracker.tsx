import React, { useState, useMemo, useCallback } from 'react';
import { MetricCards, Card, Table, Badge, Modal, Button, Input } from '../../../components/componentsreutilizables';
import { BarChart3, Users, CheckCircle, TrendingDown, Calendar, Users2, Clock, Target, Award, AlertCircle, Settings, Save } from 'lucide-react';
import type { MetricCardData } from '../../../components/componentsreutilizables';
import { ConfiguracionResumenSemanal } from './ConfiguracionResumenSemanal';

interface Props {
  modo: 'entrenador' | 'gimnasio';
}

interface AdherenceThresholds {
  excelente: number; // >= este valor
  buena: number; // >= este valor
  regular: number; // >= este valor
  baja: number; // >= este valor
  critica: number; // < este valor
  riesgoTendencia: number; // Si la tendencia es menor que este valor, es riesgo
}

export const AdherenciaTracker: React.FC<Props> = ({ modo }) => {
  // Estado para configuración de umbrales (solo para entrenadores)
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [thresholds, setThresholds] = useState<AdherenceThresholds>(() => {
    try {
      const saved = localStorage.getItem('adherencia_thresholds');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    // Valores por defecto
    return {
      excelente: 85,
      buena: 70,
      regular: 55,
      baja: 40,
      critica: 40,
      riesgoTendencia: -5, // Si la tendencia es menor que -5%, es riesgo
    };
  });

  const [tempThresholds, setTempThresholds] = useState<AdherenceThresholds>(thresholds);

  const handleSaveThresholds = useCallback(() => {
    setThresholds(tempThresholds);
    try {
      localStorage.setItem('adherencia_thresholds', JSON.stringify(tempThresholds));
    } catch {
      // ignore persistence errors
    }
    setIsConfigOpen(false);
  }, [tempThresholds]);

  const handleResetThresholds = useCallback(() => {
    const defaults: AdherenceThresholds = {
      excelente: 85,
      buena: 70,
      regular: 55,
      baja: 40,
      critica: 40,
      riesgoTendencia: -5,
    };
    setTempThresholds(defaults);
  }, []);

  // Función para determinar el estado de adherencia basado en umbrales personalizados
  const getAdherenceStatus = useCallback((adherencePercent: number, tendencia: string): { variant: string; label: string; isCritical: boolean } => {
    const tendenciaNum = parseFloat(tendencia.replace('%', '').replace('+', '').replace('-', ''));
    const isNegativeTrend = tendencia.startsWith('-');
    const isRiskTrend = isNegativeTrend && Math.abs(tendenciaNum) >= Math.abs(thresholds.riesgoTendencia);

    if (adherencePercent >= thresholds.excelente) {
      return { variant: 'green', label: 'Excelente', isCritical: false };
    } else if (adherencePercent >= thresholds.buena) {
      return { variant: 'blue', label: 'Buena', isCritical: isRiskTrend };
    } else if (adherencePercent >= thresholds.regular) {
      return { variant: 'yellow', label: 'Regular', isCritical: isRiskTrend || adherencePercent < thresholds.baja };
    } else if (adherencePercent >= thresholds.baja) {
      return { variant: 'orange', label: 'Baja', isCritical: true };
    } else {
      return { variant: 'red', label: 'Crítica', isCritical: true };
    }
  }, [thresholds]);

  const columns =
    modo === 'entrenador'
      ? [
          { key: 'cliente', label: 'Cliente' },
          { key: 'programadas', label: 'Programadas' },
          { key: 'completadas', label: 'Completadas' },
          { key: 'adherencia', label: 'Adherencia' },
          { key: 'estado', label: 'Estado' },
          { key: 'tendencia', label: 'Tendencia' },
        ]
      : [
          { key: 'clase', label: 'Clase' },
          { key: 'horario', label: 'Horario' },
          { key: 'plazas', label: 'Plazas' },
          { key: 'asistentes', label: 'Asistentes' },
          { key: 'ocupacion', label: 'Ocupación' },
          { key: 'status', label: 'Status' },
        ];

  // Datos de clientes con estados calculados según umbrales personalizados
  const rawClientData = [
    { id: 1, cliente: 'María Pérez', programadas: 8, completadas: 7, adherencia: 87.5, tendencia: '+5%' },
    { id: 2, cliente: 'Carlos Ruiz', programadas: 8, completadas: 8, adherencia: 100, tendencia: '+2%' },
    { id: 3, cliente: 'Ana Martínez', programadas: 8, completadas: 6, adherencia: 75, tendencia: '0%' },
    { id: 4, cliente: 'Luis García', programadas: 8, completadas: 5, adherencia: 62.5, tendencia: '-8%' },
    { id: 5, cliente: 'Sofia López', programadas: 8, completadas: 4, adherencia: 50, tendencia: '-12%' },
    { id: 6, cliente: 'Diego Fernández', programadas: 8, completadas: 7, adherencia: 87.5, tendencia: '+3%' },
    { id: 7, cliente: 'Elena Sánchez', programadas: 8, completadas: 3, adherencia: 37.5, tendencia: '-15%' },
    { id: 8, cliente: 'Roberto Martín', programadas: 8, completadas: 6, adherencia: 75, tendencia: '+1%' },
    { id: 9, cliente: 'Laura Torres', programadas: 8, completadas: 8, adherencia: 100, tendencia: '0%' },
    { id: 10, cliente: 'Miguel Vargas', programadas: 8, completadas: 5, adherencia: 62.5, tendencia: '-3%' },
  ];

  const data = useMemo(() => {
    if (modo !== 'entrenador') {
      return [
        { id: 1, clase: 'HIIT Intensivo', horario: 'Lunes 18:00-19:00', plazas: 20, asistentes: 18, ocupacion: '90%', status: <Badge variant="red">Saturado</Badge> },
        { id: 2, clase: 'Yoga Restaurativo', horario: 'Martes 19:00-20:00', plazas: 25, asistentes: 24, ocupacion: '96%', status: <Badge variant="red">Saturado</Badge> },
        { id: 3, clase: 'Cross Training', horario: 'Miércoles 18:00-19:00', plazas: 20, asistentes: 16, ocupacion: '80%', status: <Badge variant="green">Óptimo</Badge> },
        { id: 4, clase: 'Pilates Mat', horario: 'Jueves 09:00-10:00', plazas: 15, asistentes: 9, ocupacion: '60%', status: <Badge variant="yellow">Regular</Badge> },
        { id: 5, clase: 'Zumba Fitness', horario: 'Viernes 19:00-20:00', plazas: 30, asistentes: 28, ocupacion: '93%', status: <Badge variant="red">Saturado</Badge> },
        { id: 6, clase: 'TRX Training', horario: 'Lunes 10:00-11:00', plazas: 12, asistentes: 12, ocupacion: '100%', status: <Badge variant="red">Saturado</Badge> },
        { id: 7, clase: 'Spinning', horario: 'Martes 18:00-19:00', plazas: 25, asistentes: 20, ocupacion: '80%', status: <Badge variant="green">Óptimo</Badge> },
        { id: 8, clase: 'Boxeo Funcional', horario: 'Miércoles 19:00-20:00', plazas: 16, asistentes: 14, ocupacion: '87.5%', status: <Badge variant="green">Óptimo</Badge> },
        { id: 9, clase: 'Stretching', horario: 'Jueves 20:00-21:00', plazas: 20, asistentes: 8, ocupacion: '40%', status: <Badge variant="orange">Baja</Badge> },
        { id: 10, clase: 'Body Pump', horario: 'Viernes 18:00-19:00', plazas: 22, asistentes: 21, ocupacion: '95%', status: <Badge variant="red">Saturado</Badge> },
      ];
    }

    return rawClientData.map((client) => {
      const status = getAdherenceStatus(client.adherencia, client.tendencia);
      return {
        ...client,
        adherencia: `${client.adherencia}%`,
        estado: <Badge variant={status.variant as any}>{status.label}</Badge>,
        tendencia: client.tendencia,
        isCritical: status.isCritical,
      };
    });
  }, [modo, getAdherenceStatus, rawClientData]);

  // Contar clientes críticos según umbrales personalizados
  const clientesCriticos = useMemo(() => {
    if (modo !== 'entrenador') return 0;
    return data.filter((item: any) => item.isCritical).length;
  }, [data, modo]);

  const metrics: MetricCardData[] =
    modo === 'entrenador'
      ? [
          {
            id: '1',
            title: 'Adherencia Promedio',
            value: '86%',
            trend: { value: 3.2, direction: 'up' },
            icon: <BarChart3 size={24} />,
            color: 'info'
          },
          {
            id: '2',
            title: 'Clientes Activos',
            value: '42',
            trend: { value: 2, direction: 'up' },
            icon: <Users size={24} />,
            color: 'success'
          },
          {
            id: '3',
            title: 'Sesiones Completadas (7d)',
            value: '142',
            trend: { value: 12, direction: 'up' },
            icon: <CheckCircle size={24} />,
            color: 'success'
          },
          {
            id: '4',
            title: 'Clientes en Riesgo',
            value: clientesCriticos.toString(),
            trend: { value: 1, direction: 'down' },
            icon: <AlertCircle size={24} />,
            color: 'error'
          },
          {
            id: '5',
            title: 'Objetivos Alcanzados',
            value: '68%',
            trend: { value: 5.2, direction: 'up' },
            icon: <Target size={24} />,
            color: 'primary'
          },
          {
            id: '6',
            title: 'Tiempo Medio Sesión',
            value: '52 min',
            trend: { value: 2, direction: 'up' },
            icon: <Clock size={24} />,
            color: 'info'
          },
        ]
      : [
          {
            id: '1',
            title: 'Ocupación Promedio',
            value: '72%',
            trend: { value: 1.1, direction: 'up' },
            icon: <BarChart3 size={24} />,
            color: 'info'
          },
          {
            id: '2',
            title: 'Clases Activas',
            value: '48',
            trend: { value: 3, direction: 'up' },
            icon: <Calendar size={24} />,
            color: 'success'
          },
          {
            id: '3',
            title: 'Asistencia Total (7d)',
            value: '1,248',
            trend: { value: 87, direction: 'up' },
            icon: <Users2 size={24} />,
            color: 'success'
          },
          {
            id: '4',
            title: 'Clases con Baja Ocupación',
            value: '3',
            trend: { value: 2, direction: 'down' },
            icon: <TrendingDown size={24} />,
            color: 'warning'
          },
          {
            id: '5',
            title: 'Seguimiento Plan Grupal',
            value: '64%',
            trend: { value: 4.4, direction: 'up' },
            icon: <Award size={24} />,
            color: 'primary'
          },
          {
            id: '6',
            title: 'Puntos Saturados',
            value: '8',
            trend: { value: 2, direction: 'up' },
            icon: <AlertCircle size={24} />,
            color: 'error'
          },
        ];

  return (
    <div className="space-y-6">
      <MetricCards data={metrics} columns={3} />
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {modo === 'entrenador' ? 'Detalle por Cliente' : 'Detalle por Clase'}
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            {modo === 'entrenador' 
              ? 'Seguimiento individual de sesiones programadas vs completadas en las últimas 2 semanas'
              : 'Comparativa de plazas disponibles vs asistencia real por clase semanal'}
          </p>
        </div>
        {modo === 'entrenador' && (
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Settings className="h-4 w-4" />}
            onClick={() => {
              setTempThresholds(thresholds);
              setIsConfigOpen(true);
            }}
          >
            Configurar Umbrales
          </Button>
        )}
      </div>
      <Card className="bg-white shadow-sm p-6">
        <Table 
          columns={columns} 
          data={data}
          getRowProps={(row: any) => {
            // Resaltar filas críticas
            if (modo === 'entrenador' && row.isCritical) {
              return {
                className: 'bg-red-50 dark:bg-red-900/10 border-l-4 border-l-red-500',
              };
            }
            return {};
          }}
        />
      </Card>

      {/* Configuración de Resumen Semanal (solo para entrenadores) */}
      {modo === 'entrenador' && (
        <div className="mt-8">
          <ConfiguracionResumenSemanal />
        </div>
      )}

      {/* Modal de configuración de umbrales */}
      {modo === 'entrenador' && (
        <Modal
          isOpen={isConfigOpen}
          onClose={() => setIsConfigOpen(false)}
          title="Configurar Umbrales de Adherencia y Banderas de Riesgo"
          size="lg"
        >
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-sm dark:border-slate-800/70 dark:bg-slate-900/40">
              <p className="text-slate-700 dark:text-slate-300">
                Configura tus propios umbrales de adherencia y banderas de riesgo. El tablero destacará automáticamente a los clientes críticos según tu metodología de trabajo.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Umbrales de Adherencia (%)</h4>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Excelente (≥)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={tempThresholds.excelente}
                    onChange={(e) => setTempThresholds({ ...tempThresholds, excelente: parseInt(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-slate-500 mt-1">Adherencia excelente o superior</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Buena (≥)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={tempThresholds.buena}
                    onChange={(e) => setTempThresholds({ ...tempThresholds, buena: parseInt(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-slate-500 mt-1">Adherencia buena o superior</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Regular (≥)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={tempThresholds.regular}
                    onChange={(e) => setTempThresholds({ ...tempThresholds, regular: parseInt(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-slate-500 mt-1">Adherencia regular o superior</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Baja (≥)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={tempThresholds.baja}
                    onChange={(e) => setTempThresholds({ ...tempThresholds, baja: parseInt(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-slate-500 mt-1">Adherencia baja o superior</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Crítica (&lt;)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={tempThresholds.critica}
                    onChange={(e) => setTempThresholds({ ...tempThresholds, critica: parseInt(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-slate-500 mt-1">Adherencia crítica (menor que este valor)</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Banderas de Riesgo</h4>
              
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Tendencia Negativa Crítica (≤ %)
                </label>
                <Input
                  type="number"
                  value={tempThresholds.riesgoTendencia}
                  onChange={(e) => setTempThresholds({ ...tempThresholds, riesgoTendencia: parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Si la tendencia es menor o igual a este valor (negativo), se marca como riesgo
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button variant="ghost" onClick={handleResetThresholds}>
                Restablecer
              </Button>
              <Button variant="ghost" onClick={() => setIsConfigOpen(false)}>
                Cancelar
              </Button>
              <Button variant="secondary" leftIcon={<Save className="h-4 w-4" />} onClick={handleSaveThresholds}>
                Guardar Configuración
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};


