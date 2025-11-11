import React, { useState, useEffect } from 'react';
import { Clock, User, MapPin, FileText, CheckCircle2, Circle, Play, Edit, X } from 'lucide-react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Cita } from '../types';

interface VistaDiaCompletoProps {
  citas: Cita[];
  fecha: Date;
  onEditarSesion: (cita: Cita) => void;
  onCancelarSesion: (cita: Cita) => void;
  onVerDetalle: (cita: Cita) => void;
}

interface ChecklistItem {
  id: string;
  texto: string;
  completado: boolean;
}

export const VistaDiaCompleto: React.FC<VistaDiaCompletoProps> = ({
  citas,
  fecha,
  onEditarSesion,
  onCancelarSesion,
  onVerDetalle,
}) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [countdown, setCountdown] = useState<string>('');

  // Filtrar solo las citas de hoy
  const citasHoy = citas.filter(cita => {
    const fechaCita = new Date(cita.fechaInicio);
    return fechaCita.getDate() === fecha.getDate() &&
           fechaCita.getMonth() === fecha.getMonth() &&
           fechaCita.getFullYear() === fecha.getFullYear();
  }).sort((a, b) => 
    new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime()
  );

  // Cargar checklist del localStorage
  useEffect(() => {
    const clave = `checklist-${fecha.toISOString().split('T')[0]}`;
    const checklistGuardado = localStorage.getItem(clave);
    if (checklistGuardado) {
      setChecklist(JSON.parse(checklistGuardado));
    } else {
      // Checklist por defecto
      setChecklist([
        { id: '1', texto: 'Revisar agenda del día', completado: false },
        { id: '2', texto: 'Preparar material de entrenamiento', completado: false },
        { id: '3', texto: 'Confirmar asistencia de clientes', completado: false },
        { id: '4', texto: 'Revisar notas de sesiones anteriores', completado: false },
      ]);
    }
  }, [fecha]);

  // Guardar checklist en localStorage
  useEffect(() => {
    const clave = `checklist-${fecha.toISOString().split('T')[0]}`;
    localStorage.setItem(clave, JSON.stringify(checklist));
  }, [checklist, fecha]);

  // Calcular countdown a próxima sesión
  useEffect(() => {
    const actualizarCountdown = () => {
      const ahora = new Date();
      const proximaSesion = citasHoy.find(cita => {
        const fechaCita = new Date(cita.fechaInicio);
        return fechaCita > ahora && cita.estado !== 'cancelada';
      });

      if (proximaSesion) {
        const fechaSesion = new Date(proximaSesion.fechaInicio);
        const diferencia = fechaSesion.getTime() - ahora.getTime();

        if (diferencia > 0) {
          const horas = Math.floor(diferencia / (1000 * 60 * 60));
          const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
          const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

          if (horas > 0) {
            setCountdown(`${horas}h ${minutos}m`);
          } else if (minutos > 0) {
            setCountdown(`${minutos}m ${segundos}s`);
          } else {
            setCountdown(`${segundos}s`);
          }
        } else {
          setCountdown('En curso');
        }
      } else {
        setCountdown('No hay más sesiones hoy');
      }
    };

    actualizarCountdown();
    const intervalo = setInterval(actualizarCountdown, 1000);

    return () => clearInterval(intervalo);
  }, [citasHoy]);

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completado: !item.completado } : item
      )
    );
  };

  const agregarChecklistItem = () => {
    const nuevoItem: ChecklistItem = {
      id: Date.now().toString(),
      texto: '',
      completado: false,
    };
    setChecklist(prev => [...prev, nuevoItem]);
  };

  const eliminarChecklistItem = (id: string) => {
    setChecklist(prev => prev.filter(item => item.id !== id));
  };

  const actualizarChecklistItem = (id: string, texto: string) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, texto } : item
      )
    );
  };

  const obtenerNombreTipo = (tipo: string): string => {
    const tipos: Record<string, string> = {
      'sesion-1-1': 'Sesión 1-1',
      'videollamada': 'Videollamada',
      'evaluacion': 'Evaluación',
      'clase-colectiva': 'Clase Colectiva',
      'fisioterapia': 'Fisioterapia',
      'mantenimiento': 'Mantenimiento',
      'otro': 'Otro'
    };
    return tipos[tipo] || tipo;
  };

  const formatoHora = (fecha: Date): string => {
    return fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ahora = new Date();
  const proximaSesion = citasHoy.find(cita => {
    const fechaCita = new Date(cita.fechaInicio);
    return fechaCita > ahora && cita.estado !== 'cancelada';
  });

  const sesionesCompletadas = citasHoy.filter(c => c.estado === 'completada').length;
  const sesionesPendientes = citasHoy.filter(c => 
    c.estado === 'pendiente' || c.estado === 'confirmada'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header con estadísticas del día */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {fecha.toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h2>
              <p className="text-blue-100">
                {citasHoy.length} sesión{citasHoy.length !== 1 ? 'es' : ''} programada{citasHoy.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-right">
              {proximaSesion && (
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-sm text-blue-100 mb-1">Próxima sesión en</div>
                  <div className="text-3xl font-bold">{countdown}</div>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-sm text-blue-100">Total</div>
              <div className="text-2xl font-bold">{citasHoy.length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-sm text-blue-100">Pendientes</div>
              <div className="text-2xl font-bold">{sesionesPendientes}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-sm text-blue-100">Completadas</div>
              <div className="text-2xl font-bold">{sesionesCompletadas}</div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal: Sesiones */}
        <div className="lg:col-span-2 space-y-4">
          {proximaSesion && (
            <Card className="border-2 border-blue-500 bg-blue-50">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Play className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">Próxima Sesión</span>
                  </div>
                  <span className="text-sm text-blue-700">{countdown}</span>
                </div>
                <SesionCard
                  cita={proximaSesion}
                  destacada
                  onEditar={onEditarSesion}
                  onCancelar={onCancelarSesion}
                  onVerDetalle={onVerDetalle}
                  obtenerNombreTipo={obtenerNombreTipo}
                  formatoHora={formatoHora}
                />
              </div>
            </Card>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Todas las Sesiones</h3>
            {citasHoy.length === 0 ? (
              <Card>
                <div className="p-8 text-center text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg">No hay sesiones programadas para hoy</p>
                </div>
              </Card>
            ) : (
              citasHoy.map((cita) => (
                <SesionCard
                  key={cita.id}
                  cita={cita}
                  destacada={false}
                  onEditar={onEditarSesion}
                  onCancelar={onCancelarSesion}
                  onVerDetalle={onVerDetalle}
                  obtenerNombreTipo={obtenerNombreTipo}
                  formatoHora={formatoHora}
                />
              ))
            )}
          </div>
        </div>

        {/* Columna lateral: Checklist */}
        <div className="space-y-4">
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Checklist Diario</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={agregarChecklistItem}
                >
                  + Agregar
                </Button>
              </div>
              <div className="space-y-2">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <button
                      onClick={() => toggleChecklistItem(item.id)}
                      className="mt-1 text-gray-400 hover:text-gray-600"
                    >
                      {item.completado ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <input
                      type="text"
                      value={item.texto}
                      onChange={(e) => actualizarChecklistItem(item.id, e.target.value)}
                      onBlur={() => {
                        if (!item.texto.trim()) {
                          eliminarChecklistItem(item.id);
                        }
                      }}
                      placeholder="Nueva tarea..."
                      className={`flex-1 text-sm border-none outline-none bg-transparent ${
                        item.completado ? 'line-through text-gray-400' : 'text-gray-700'
                      }`}
                    />
                    <button
                      onClick={() => eliminarChecklistItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              {checklist.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay tareas. Haz clic en "+ Agregar" para crear una.
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface SesionCardProps {
  cita: Cita;
  destacada: boolean;
  onEditar: (cita: Cita) => void;
  onCancelar: (cita: Cita) => void;
  onVerDetalle: (cita: Cita) => void;
  obtenerNombreTipo: (tipo: string) => string;
  formatoHora: (fecha: Date) => string;
}

const SesionCard: React.FC<SesionCardProps> = ({
  cita,
  destacada,
  onEditar,
  onCancelar,
  onVerDetalle,
  obtenerNombreTipo,
  formatoHora,
}) => {
  const getColorCita = (cita: Cita): string => {
    if (cita.estado === 'completada' || cita.estado === 'no-show' || cita.estado === 'cancelada') {
      return getColorPorEstado(cita.estado);
    }
    return getColorPorTipo(cita.tipo);
  };

  const fechaInicio = new Date(cita.fechaInicio);
  const fechaFin = new Date(cita.fechaFin);
  const duracion = (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60);

  return (
    <Card
      className={`${
        destacada ? 'ring-2 ring-blue-500 shadow-lg' : ''
      } hover:shadow-md transition-shadow cursor-pointer`}
      onClick={() => onVerDetalle(cita)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${getColorCita(cita)}`} />
              <h4 className="text-xl font-bold text-gray-900">{cita.titulo}</h4>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatoHora(fechaInicio)} - {formatoHora(fechaFin)}</span>
                <span className="text-gray-400">({duracion} min)</span>
              </div>
              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-semibold">
                {obtenerNombreTipo(cita.tipo)}
              </span>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              cita.estado === 'completada'
                ? 'bg-green-100 text-green-800'
                : cita.estado === 'cancelada'
                ? 'bg-yellow-100 text-yellow-800'
                : cita.estado === 'no-show'
                ? 'bg-red-100 text-red-800'
                : cita.estado === 'confirmada'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {cita.estado === 'no-show'
              ? 'No Show'
              : cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
          </span>
        </div>

        {cita.clienteNombre && (
          <div className="flex items-center gap-2 mb-3 text-gray-700">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{cita.clienteNombre}</span>
          </div>
        )}

        {cita.ubicacion && (
          <div className="flex items-center gap-2 mb-3 text-gray-700">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{cita.ubicacion}</span>
          </div>
        )}

        {cita.notas && (
          <div className="flex items-start gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
            <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
            <p className="text-sm text-gray-700">{cita.notas}</p>
          </div>
        )}

        <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEditar(cita);
            }}
            leftIcon={<Edit className="w-4 h-4" />}
          >
            Editar
          </Button>
          {cita.estado !== 'cancelada' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onCancelar(cita);
              }}
              leftIcon={<X className="w-4 h-4" />}
            >
              Cancelar
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

// Exportar funciones de utilidad para uso en AgendaCalendar
export const getColorPorTipo = (tipo: string): string => {
  const colores: Record<string, string> = {
    'sesion-1-1': 'bg-blue-500',
    'videollamada': 'bg-purple-500',
    'evaluacion': 'bg-orange-500',
    'clase-colectiva': 'bg-green-500',
    'fisioterapia': 'bg-pink-500',
    'mantenimiento': 'bg-gray-500',
    'otro': 'bg-indigo-500',
  };
  return colores[tipo] || 'bg-gray-500';
};

export const getColorPorEstado = (estado: string): string => {
  const colores: Record<string, string> = {
    'completada': 'bg-green-500',
    'no-show': 'bg-red-500',
    'cancelada': 'bg-yellow-500',
    'pendiente': 'bg-gray-400',
    'confirmada': 'bg-blue-500',
    'en-curso': 'bg-purple-500',
  };
  return colores[estado] || 'bg-gray-500';
};

