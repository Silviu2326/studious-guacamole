import React, { useState, useMemo } from 'react';
import { Users, Building2, Calendar, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, Badge, MetricCards, Button } from '../../../components/componentsreutilizables';
import { Cita } from '../types';

interface VistaCentroProps {
  citas?: Cita[];
}

type VistaPeriodo = 'semana' | 'mes';

export const VistaCentro: React.FC<VistaCentroProps> = ({ citas = [] }) => {
  const [vistaPeriodo, setVistaPeriodo] = useState<VistaPeriodo>('semana');
  const [fechaActual, setFechaActual] = useState(new Date());

  // Calcular rango de fechas según la vista
  const rangoFechas = useMemo(() => {
    const inicio = new Date(fechaActual);
    const fin = new Date(fechaActual);

    if (vistaPeriodo === 'semana') {
      // Lunes de la semana
      const dia = inicio.getDay();
      const diff = inicio.getDate() - dia + (dia === 0 ? -6 : 1);
      inicio.setDate(diff);
      inicio.setHours(0, 0, 0, 0);
      
      // Domingo de la semana
      fin.setDate(inicio.getDate() + 6);
      fin.setHours(23, 59, 59, 999);
    } else {
      // Primer día del mes
      inicio.setDate(1);
      inicio.setHours(0, 0, 0, 0);
      
      // Último día del mes
      fin.setMonth(fin.getMonth() + 1);
      fin.setDate(0);
      fin.setHours(23, 59, 59, 999);
    }

    return { inicio, fin };
  }, [fechaActual, vistaPeriodo]);

  // Filtrar citas en el rango
  const citasEnRango = useMemo(() => {
    return citas.filter(cita => {
      const fechaCita = new Date(cita.fechaInicio);
      return fechaCita >= rangoFechas.inicio && fechaCita <= rangoFechas.fin;
    });
  }, [citas, rangoFechas]);

  // Citas de hoy
  const citasHoy = useMemo(() => {
    const hoy = new Date();
    return citas.filter(cita => {
      const fechaCita = new Date(cita.fechaInicio);
      return fechaCita.getDate() === hoy.getDate() &&
        fechaCita.getMonth() === hoy.getMonth() &&
        fechaCita.getFullYear() === hoy.getFullYear();
    });
  }, [citas]);

  const clasesHoy = citasHoy.filter(cita => cita.tipo === 'clase-colectiva');
  const ocupacionPromedio = clasesHoy.length > 0
    ? Math.round((clasesHoy.reduce((acc, c) => acc + (c.inscritos || 0), 0) / 
                  clasesHoy.reduce((acc, c) => acc + (c.capacidadMaxima || 1), 0)) * 100)
    : 0;

  // Agrupar citas por día
  const citasPorDia = useMemo(() => {
    const grupos: Map<string, Cita[]> = new Map();
    
    citasEnRango.forEach(cita => {
      const fecha = new Date(cita.fechaInicio);
      const clave = fecha.toISOString().split('T')[0];
      
      if (!grupos.has(clave)) {
        grupos.set(clave, []);
      }
      
      grupos.get(clave)!.push(cita);
    });

    return Array.from(grupos.entries())
      .map(([fecha, citas]) => ({
        fecha: new Date(fecha),
        citas: citas.sort((a, b) => 
          new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime()
        )
      }))
      .sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
  }, [citasEnRango]);

  // Estadísticas agregadas
  const estadisticas = useMemo(() => {
    const totalCitas = citasEnRango.length;
    const clasesColectivas = citasEnRango.filter(c => c.tipo === 'clase-colectiva');
    const totalInscritos = clasesColectivas.reduce((acc, c) => acc + (c.inscritos || 0), 0);
    const totalCapacidad = clasesColectivas.reduce((acc, c) => acc + (c.capacidadMaxima || 1), 0);
    const ocupacionPromedio = totalCapacidad > 0 
      ? Math.round((totalInscritos / totalCapacidad) * 100) 
      : 0;
    
    return {
      totalCitas,
      clasesColectivas: clasesColectivas.length,
      totalInscritos,
      ocupacionPromedio
    };
  }, [citasEnRango]);

  const cambiarPeriodo = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaActual);
    
    if (vistaPeriodo === 'semana') {
      nuevaFecha.setDate(nuevaFecha.getDate() + (direccion === 'siguiente' ? 7 : -7));
    } else {
      nuevaFecha.setMonth(nuevaFecha.getMonth() + (direccion === 'siguiente' ? 1 : -1));
    }
    
    setFechaActual(nuevaFecha);
  };

  const irAHoy = () => {
    setFechaActual(new Date());
  };

  const metricas = [
    {
      id: '1',
      title: 'Clases Hoy',
      value: clasesHoy.length.toString(),
      icon: <Calendar className="w-6 h-6" />,
      color: 'primary' as const,
    },
    {
      id: '2',
      title: 'Ocupación Promedio',
      value: `${ocupacionPromedio}%`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'success' as const,
    },
    {
      id: '3',
      title: 'Total Citas',
      value: citasHoy.length.toString(),
      icon: <Building2 className="w-6 h-6" />,
      color: 'info' as const,
    },
    {
      id: '4',
      title: 'Inscritos Totales',
      value: clasesHoy.reduce((acc, c) => acc + (c.inscritos || 0), 0).toString(),
      icon: <Users className="w-6 h-6" />,
      color: 'warning' as const,
    },
  ];

  const formatearHora = (fecha: Date) => {
    return new Date(fecha).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatearHora = (fecha: Date) => {
    return new Date(fecha).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const metricas = [
    {
      id: '1',
      title: 'Clases Hoy',
      value: clasesHoy.length.toString(),
      icon: <Calendar className="w-6 h-6" />,
      color: 'primary' as const,
    },
    {
      id: '2',
      title: 'Ocupación Promedio',
      value: `${ocupacionPromedio}%`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'success' as const,
    },
    {
      id: '3',
      title: vistaPeriodo === 'semana' ? 'Total Semana' : 'Total Mes',
      value: estadisticas.totalCitas.toString(),
      icon: <Building2 className="w-6 h-6" />,
      color: 'info' as const,
    },
    {
      id: '4',
      title: 'Inscritos Totales',
      value: estadisticas.totalInscritos.toString(),
      icon: <Users className="w-6 h-6" />,
      color: 'warning' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Agenda del Centro
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Vista {vistaPeriodo === 'semana' ? 'semanal' : 'mensual'} agregada
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setVistaPeriodo('semana')}
            className={vistaPeriodo === 'semana' ? 'bg-blue-100 text-blue-900' : ''}
          >
            Semana
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setVistaPeriodo('mes')}
            className={vistaPeriodo === 'mes' ? 'bg-blue-100 text-blue-900' : ''}
          >
            Mes
          </Button>
        </div>
      </div>

      {/* Controles de navegación */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => cambiarPeriodo('anterior')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-center min-w-[200px]">
            <div className="font-semibold text-gray-900">
              {vistaPeriodo === 'semana' 
                ? `Semana del ${rangoFechas.inicio.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`
                : rangoFechas.inicio.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
              }
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => cambiarPeriodo('siguiente')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={irAHoy}
        >
          Ir a Hoy
        </Button>
      </div>

      <MetricCards data={metricas} columns={4} />

      {/* Vista agregada por día */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h4 className="text-xl font-bold text-gray-900 mb-4">
            Clases y Servicios {vistaPeriodo === 'semana' ? 'de la Semana' : 'del Mes'}
          </h4>
          <div className="space-y-6">
            {citasPorDia.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No hay clases o servicios programados en este período
                </p>
              </div>
            ) : (
              citasPorDia.map(({ fecha, citas }) => (
                <div key={fecha.toISOString()} className="border-b border-slate-200 last:border-b-0 pb-6 last:pb-0">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-lg font-semibold text-gray-900">
                      {formatearFecha(fecha)}
                    </h5>
                    <Badge color="info">
                      {citas.length} {citas.length === 1 ? 'evento' : 'eventos'}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {citas.map((cita) => (
                      <div
                        key={cita.id}
                        className="flex items-start justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h6 className="font-semibold text-gray-900">
                              {cita.titulo}
                            </h6>
                            <Badge color={cita.estado === 'confirmada' ? 'success' : 'warning'}>
                              {cita.estado}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center space-x-1 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{formatearHora(cita.fechaInicio)} - {formatearHora(cita.fechaFin)}</span>
                            </div>
                            {cita.capacidadMaxima && (
                              <div className="flex items-center space-x-1 text-gray-600">
                                <Users className="w-4 h-4" />
                                <span>{cita.inscritos || 0} / {cita.capacidadMaxima}</span>
                              </div>
                            )}
                            {cita.instructorNombre && (
                              <div className="text-gray-600">
                                Instructor: {cita.instructorNombre}
                              </div>
                            )}
                          </div>
                          {cita.ubicacion && (
                            <p className="mt-2 text-sm text-gray-500">
                              Ubicación: {cita.ubicacion}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
