import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { ResumenDiario, ResumenSesion, TipoCita } from '../types';
import { getResumenDiario, getResumenesDiarios, marcarResumenLeido, generarResumenDiario } from '../api/resumenDiario';
import { useAuth } from '../../../context/AuthContext';

export const VistaResumenDiario: React.FC = () => {
  const { user } = useAuth();
  const [resumenes, setResumenes] = useState<ResumenDiario[]>([]);
  const [resumenActual, setResumenActual] = useState<ResumenDiario | null>(null);
  const [loading, setLoading] = useState(true);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  useEffect(() => {
    cargarResumenes();
  }, []);

  useEffect(() => {
    if (resumenes.length > 0) {
      const resumen = resumenes.find(
        (r) =>
          r.fechaResumen.getDate() === fechaSeleccionada.getDate() &&
          r.fechaResumen.getMonth() === fechaSeleccionada.getMonth() &&
          r.fechaResumen.getFullYear() === fechaSeleccionada.getFullYear()
      );
      if (resumen) {
        setResumenActual(resumen);
        if (!resumen.leido) {
          marcarResumenComoLeido(resumen.id);
        }
      } else {
        cargarResumenFecha(fechaSeleccionada);
      }
    }
  }, [fechaSeleccionada, resumenes]);

  const cargarResumenes = async () => {
    setLoading(true);
    try {
      // Generar resúmenes para entrenador (los próximos 7 días)
      const hoy = new Date();
      const resumenesData: ResumenDiario[] = [];
      
      for (let i = 0; i < 7; i++) {
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() + i);
        const resumen = await generarResumenDiario(fecha, user?.id, 'entrenador');
        resumenesData.push(resumen);
      }
      
      setResumenes(resumenesData);
      if (resumenesData.length > 0) {
        // Mostrar el resumen de mañana por defecto
        const manana = new Date(hoy);
        manana.setDate(hoy.getDate() + 1);
        const resumenManana = resumenesData.find(
          (r) =>
            r.fechaResumen.getDate() === manana.getDate() &&
            r.fechaResumen.getMonth() === manana.getMonth() &&
            r.fechaResumen.getFullYear() === manana.getFullYear()
        );
        setResumenActual(resumenManana || resumenesData[0]);
        setFechaSeleccionada(resumenManana?.fechaResumen || resumenesData[0].fechaResumen);
      }
    } catch (error) {
      console.error('Error cargando resúmenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarResumenFecha = async (fecha: Date) => {
    try {
      // Generar resumen para entrenador
      const resumen = await generarResumenDiario(fecha, user?.id, 'entrenador');
      if (resumen) {
        setResumenActual(resumen);
        setResumenes((prev) => {
          const index = prev.findIndex((r) => r.id === resumen.id);
          if (index >= 0) {
            const nuevos = [...prev];
            nuevos[index] = resumen;
            return nuevos;
          }
          return [...prev, resumen];
        });
      }
    } catch (error) {
      console.error('Error cargando resumen:', error);
    }
  };

  const marcarResumenComoLeido = async (resumenId: string) => {
    try {
      await marcarResumenLeido(resumenId);
      setResumenActual((prev) => (prev ? { ...prev, leido: true, fechaLectura: new Date() } : null));
    } catch (error) {
      console.error('Error marcando resumen como leído:', error);
    }
  };

  const cambiarFecha = (dias: number) => {
    const nuevaFecha = new Date(fechaSeleccionada);
    nuevaFecha.setDate(fechaSeleccionada.getDate() + dias);
    setFechaSeleccionada(nuevaFecha);
  };

  const getColorTipoSesion = (tipo: TipoCita): string => {
    const colores: Record<TipoCita, string> = {
      'sesion-1-1': 'bg-blue-100 text-blue-800',
      'videollamada': 'bg-purple-100 text-purple-800',
      'evaluacion': 'bg-orange-100 text-orange-800',
      'clase-colectiva': 'bg-green-100 text-green-800',
      'fisioterapia': 'bg-pink-100 text-pink-800',
      'mantenimiento': 'bg-gray-100 text-gray-800',
      'otro': 'bg-indigo-100 text-indigo-800',
    };
    return colores[tipo] || 'bg-gray-100 text-gray-800';
  };

  const getNombreTipoSesion = (tipo: TipoCita): string => {
    const nombres: Record<TipoCita, string> = {
      'sesion-1-1': 'Sesión 1:1',
      'videollamada': 'Videollamada',
      'evaluacion': 'Evaluación',
      'clase-colectiva': 'Clase Colectiva',
      'fisioterapia': 'Fisioterapia',
      'mantenimiento': 'Mantenimiento',
      'otro': 'Otro',
    };
    return nombres[tipo] || tipo;
  };

  if (loading) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-6 text-center">Cargando resúmenes...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con navegación */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Resumen Diario de Sesiones</h3>
              <p className="text-sm text-gray-600 mt-1">
                Revisa las sesiones programadas para el día siguiente
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => cambiarFecha(-1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFechaSeleccionada(new Date())}
              >
                Hoy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => cambiarFecha(1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-lg font-semibold text-gray-900">
              {fechaSeleccionada.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </Card>

      {/* Resumen del día */}
      {resumenActual ? (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900">
                {resumenActual.sesiones.length} sesión(es) programada(s)
              </h4>
              {resumenActual.enviado && (
                <Badge color="success">Enviado</Badge>
              )}
              {resumenActual.leido && (
                <Badge color="info">Leído</Badge>
              )}
            </div>

            {resumenActual.sesiones.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500 text-lg">No hay sesiones programadas para este día</p>
              </div>
            ) : (
              <div className="space-y-4">
                {resumenActual.sesiones.map((sesion) => (
                  <div
                    key={sesion.id}
                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="text-lg font-semibold text-gray-900">{sesion.titulo}</h5>
                          <Badge className={getColorTipoSesion(sesion.tipo)}>
                            {getNombreTipoSesion(sesion.tipo)}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(sesion.fechaInicio).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}{' '}
                              -{' '}
                              {new Date(sesion.fechaFin).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          {sesion.clienteNombre && (
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{sesion.clienteNombre}</span>
                            </div>
                          )}
                          {sesion.ubicacion && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{sesion.ubicacion}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {sesion.notas && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
                          <p className="text-sm text-blue-900">{sesion.notas}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      ) : (
        <Card className="bg-white shadow-sm">
          <div className="p-6 text-center py-12">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No hay resumen disponible para esta fecha</p>
          </div>
        </Card>
      )}
    </div>
  );
};

