import React, { useMemo } from 'react';
import { User, Video, ClipboardCheck, Clock, Calendar, TrendingUp } from 'lucide-react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { Cita } from '../types';

interface VistaPersonalProps {
  citas?: Cita[];
  /** ID del entrenador para filtrar sus citas */
  entrenadorId?: string;
}

export const VistaPersonal: React.FC<VistaPersonalProps> = ({ 
  citas = [], 
  entrenadorId 
}) => {
  const getIconoPorTipo = (tipo: string) => {
    switch (tipo) {
      case 'sesion-1-1':
        return <User className="w-5 h-5 text-blue-600" />;
      case 'videollamada':
        return <Video className="w-5 h-5 text-purple-600" />;
      case 'evaluacion':
        return <ClipboardCheck className="w-5 h-5 text-orange-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'confirmada':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'cancelada':
        return 'error';
      default:
        return 'info';
    }
  };

  const formatearHora = (fecha: Date) => {
    return new Date(fecha).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Filtrar citas del entrenador si se proporciona entrenadorId
  const citasFiltradas = useMemo(() => {
    let filtradas = citas;
    
    if (entrenadorId) {
      filtradas = citas.filter(cita => 
        cita.entrenador?.id === entrenadorId || 
        cita.instructorId === entrenadorId
      );
    }
    
    return filtradas;
  }, [citas, entrenadorId]);

  // Citas de hoy
  const citasHoy = useMemo(() => {
    const hoy = new Date();
    return citasFiltradas.filter(cita => {
      const fechaCita = new Date(cita.fechaInicio);
      return fechaCita.getDate() === hoy.getDate() &&
        fechaCita.getMonth() === hoy.getMonth() &&
        fechaCita.getFullYear() === hoy.getFullYear();
    }).sort((a, b) => 
      new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime()
    );
  }, [citasFiltradas]);

  // Citas de esta semana
  const citasSemana = useMemo(() => {
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay() + 1); // Lunes
    inicioSemana.setHours(0, 0, 0, 0);
    
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6); // Domingo
    finSemana.setHours(23, 59, 59, 999);

    return citasFiltradas.filter(cita => {
      const fechaCita = new Date(cita.fechaInicio);
      return fechaCita >= inicioSemana && fechaCita <= finSemana;
    }).sort((a, b) => 
      new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime()
    );
  }, [citasFiltradas]);

  // Estadísticas
  const estadisticas = useMemo(() => {
    const total = citasFiltradas.length;
    const completadas = citasFiltradas.filter(c => c.estado === 'completada').length;
    const confirmadas = citasFiltradas.filter(c => c.estado === 'confirmada').length;
    const pendientes = citasFiltradas.filter(c => c.estado === 'pendiente' || c.estado === 'reservada').length;
    
    return { total, completadas, confirmadas, pendientes };
  }, [citasFiltradas]);

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Agenda Personal
          </h3>
          {entrenadorId && (
            <p className="text-sm text-gray-600 mt-1">
              Calendario del entrenador
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Badge color="info">
            {citasHoy.length} hoy
          </Badge>
          <Badge color="success">
            {estadisticas.completadas} completadas
          </Badge>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">Total</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{estadisticas.total}</div>
          </div>
        </Card>
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Completadas</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{estadisticas.completadas}</div>
          </div>
        </Card>
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">Confirmadas</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{estadisticas.confirmadas}</div>
          </div>
        </Card>
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="text-sm text-gray-600">Pendientes</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">{estadisticas.pendientes}</div>
          </div>
        </Card>
      </div>

      {/* Citas de hoy */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Citas de Hoy
          </h4>
          <div className="space-y-4">
            {citasHoy.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No hay citas programadas para hoy
                </p>
              </div>
            ) : (
              citasHoy.map((cita) => (
                <div
                  key={cita.id}
                  className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getIconoPorTipo(cita.tipo || 'sesion-1-1')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {cita.titulo}
                      </h4>
                      <Badge color={getColorEstado(cita.estado) as any}>
                        {cita.estado}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{formatearHora(cita.fechaInicio)} - {formatearHora(cita.fechaFin)}</span>
                      </div>
                      {cita.clienteNombre && (
                        <div className="flex items-center space-x-1 text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{cita.clienteNombre}</span>
                        </div>
                      )}
                    </div>
                    {cita.notas && (
                      <p className="mt-2 text-sm text-gray-500">
                        {cita.notas}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Citas de esta semana */}
      {citasSemana.length > citasHoy.length && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Citas de Esta Semana ({citasSemana.length})
            </h4>
            <div className="space-y-3">
              {citasSemana
                .filter(cita => {
                  const fechaCita = new Date(cita.fechaInicio);
                  const hoy = new Date();
                  return !(fechaCita.getDate() === hoy.getDate() &&
                    fechaCita.getMonth() === hoy.getMonth() &&
                    fechaCita.getFullYear() === hoy.getFullYear());
                })
                .slice(0, 5)
                .map((cita) => (
                  <div
                    key={cita.id}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {getIconoPorTipo(cita.tipo || 'sesion-1-1')}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{cita.titulo}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(cita.fechaInicio).toLocaleDateString('es-ES', { 
                            weekday: 'short', 
                            day: 'numeric', 
                            month: 'short' 
                          })} - {formatearHora(cita.fechaInicio)}
                        </div>
                      </div>
                    </div>
                    <Badge color={getColorEstado(cita.estado) as any}>
                      {cita.estado}
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
