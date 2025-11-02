import React, { useState, useEffect } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Cita, VistaCalendario } from '../types';
import { getCitas } from '../api/calendario';

interface AgendaCalendarProps {
  role: 'entrenador' | 'gimnasio';
  citasAdicionales?: Cita[];
}

export const AgendaCalendar: React.FC<AgendaCalendarProps> = ({ role, citasAdicionales = [] }) => {
  const [fechaActual, setFechaActual] = useState(new Date());
  const [vista, setVista] = useState<VistaCalendario>('mes');
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('[AgendaCalendar] useEffect ejecutado, role:', role);
    cargarCitas();
  }, [fechaActual, role]);

  useEffect(() => {
    if (citasAdicionales.length > 0) {
      setCitas(prevCitas => {
        // Combinar citas existentes con las adicionales, evitando duplicados por ID
        const citasMap = new Map(prevCitas.map(c => [c.id, c]));
        citasAdicionales.forEach(c => citasMap.set(c.id, c));
        return Array.from(citasMap.values());
      });
    }
  }, [citasAdicionales]);

  const cargarCitas = async () => {
    console.log('[AgendaCalendar] cargarCitas ejecutado');
    setLoading(true);
    const inicioMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    const finMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
    const citasData = await getCitas(inicioMes, finMes, role);
    console.log('[AgendaCalendar] Citas recibidas:', citasData);
    console.log('[AgendaCalendar] Total citas:', citasData.length);
    setCitas(citasData);
    setLoading(false);
  };

  const cambiarMes = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setMonth(fechaActual.getMonth() + (direccion === 'siguiente' ? 1 : -1));
    setFechaActual(nuevaFecha);
  };

  const cambiarSemana = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setDate(fechaActual.getDate() + (direccion === 'siguiente' ? 7 : -7));
    setFechaActual(nuevaFecha);
  };

  const getDiasSemana = () => {
    const fecha = new Date(fechaActual);
    const dia = fecha.getDay(); // 0 = domingo, 1 = lunes, etc.
    const diff = fecha.getDate() - dia; // Calcular el domingo de esta semana
    const inicioSemana = new Date(fecha.getFullYear(), fecha.getMonth(), diff);
    const dias: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const dia = new Date(inicioSemana);
      dia.setDate(inicioSemana.getDate() + i);
      dias.push(dia);
    }
    return dias;
  };

  const getDiasMes = () => {
    const primerDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    const ultimoDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaInicioSemana = primerDia.getDay();

    const dias: (Date | null)[] = [];
    // Días vacíos al inicio
    for (let i = 0; i < diaInicioSemana; i++) {
      dias.push(null);
    }
    // Días del mes
    for (let dia = 1; dia <= diasEnMes; dia++) {
      dias.push(new Date(fechaActual.getFullYear(), fechaActual.getMonth(), dia));
    }
    return dias;
  };

  const getCitasDelDia = (fecha: Date | null): Cita[] => {
    if (!fecha) return [];
    console.log(`[AgendaCalendar] Buscando citas para fecha: ${fecha.toLocaleDateString()}`);
    const filtered = citas.filter(cita => {
      const fechaCita = new Date(cita.fechaInicio);
      return fechaCita.getDate() === fecha.getDate() &&
        fechaCita.getMonth() === fecha.getMonth() &&
        fechaCita.getFullYear() === fecha.getFullYear();
    });
    console.log(`[AgendaCalendar] Citas encontradas para ${fecha.toLocaleDateString()}:`, filtered);
    return filtered;
  };

  const getColorPorTipo = (tipo: string) => {
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

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <CalendarDays className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              {meses[fechaActual.getMonth()]} {fechaActual.getFullYear()}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVista('mes')}
              className={vista === 'mes' ? 'bg-slate-100 text-slate-900' : ''}
            >
              Mes
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVista('semana')}
              className={vista === 'semana' ? 'bg-slate-100 text-slate-900' : ''}
            >
              Semana
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVista('dia')}
              className={vista === 'dia' ? 'bg-slate-100 text-slate-900' : ''}
            >
              Día
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => vista === 'mes' ? cambiarMes('anterior') : cambiarSemana('anterior')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFechaActual(new Date())}
          >
            Hoy
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => vista === 'mes' ? cambiarMes('siguiente') : cambiarSemana('siguiente')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {vista === 'mes' && (
          <div className="grid grid-cols-7 gap-2">
            {diasSemana.map((dia) => (
              <div
                key={dia}
                className="text-sm font-semibold text-slate-600 text-center py-2"
              >
                {dia}
              </div>
            ))}
            {getDiasMes().map((fecha, index) => {
              const citasDelDia = getCitasDelDia(fecha);
              const esHoy = fecha && 
                fecha.getDate() === new Date().getDate() &&
                fecha.getMonth() === new Date().getMonth() &&
                fecha.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={index}
                  className={`
                    bg-white rounded-xl border border-slate-200 p-2
                    ${fecha ? 'cursor-pointer hover:bg-slate-50 transition-colors' : ''}
                    ${esHoy ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                    min-h-[100px]
                  `}
                >
                  {fecha && (
                    <>
                      <div className={`text-sm font-semibold mb-1 ${esHoy ? 'text-blue-600' : 'text-gray-900'}`}>
                        {fecha.getDate()}
                      </div>
                      <div className="space-y-1">
                        {citasDelDia.slice(0, 3).map((cita) => (
                          <div
                            key={cita.id}
                            className={`${getColorPorTipo(cita.tipo)} text-white text-xs px-2 py-1 rounded truncate`}
                            title={cita.titulo}
                          >
                            {cita.titulo}
                          </div>
                        ))}
                        {citasDelDia.length > 3 && (
                          <div className="text-xs text-slate-500">
                            +{citasDelDia.length - 3} más
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {vista === 'semana' && (
          <div className="grid grid-cols-7 gap-2">
            {getDiasSemana().map((fecha, index) => {
              const citasDelDia = getCitasDelDia(fecha);
              const esHoy = fecha && 
                fecha.getDate() === new Date().getDate() &&
                fecha.getMonth() === new Date().getMonth() &&
                fecha.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={index}
                  className={`
                    bg-white rounded-xl border border-slate-200 p-3
                    cursor-pointer hover:bg-slate-50 transition-colors
                    ${esHoy ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                    min-h-[300px]
                  `}
                >
                  <div className={`text-center mb-3 ${esHoy ? 'text-blue-600' : 'text-gray-900'}`}>
                    <div className="text-xs font-medium text-slate-600 mb-1">
                      {diasSemana[fecha.getDay()]}
                    </div>
                    <div className="text-xl font-bold">
                      {fecha.getDate()}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {citasDelDia.map((cita) => (
                      <div
                        key={cita.id}
                        className={`${getColorPorTipo(cita.tipo)} text-white text-xs p-2 rounded shadow-sm hover:opacity-90 cursor-pointer`}
                      >
                        <div className="font-semibold truncate">
                          {cita.titulo}
                        </div>
                        <div className="text-xs mt-1 opacity-90">
                          {new Date(cita.fechaInicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - {new Date(cita.fechaFin).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {cita.clienteNombre && (
                          <div className="text-xs mt-1 opacity-90 truncate">
                            {cita.clienteNombre}
                          </div>
                        )}
                        {cita.capacidadMaxima && (
                          <div className="text-xs mt-1 opacity-90">
                            {cita.inscritos}/{cita.capacidadMaxima}
                          </div>
                        )}
                      </div>
                    ))}
                    {citasDelDia.length === 0 && (
                      <div className="text-xs text-slate-400 text-center py-4">
                        Sin citas
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {vista === 'dia' && (
          <div className="space-y-4">
            {getCitasDelDia(fechaActual).map((cita) => (
              <div
                key={cita.id}
                className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className={`flex-shrink-0 w-16 h-16 ${getColorPorTipo(cita.tipo)} rounded-lg flex items-center justify-center text-white font-bold`}>
                  {new Date(cita.fechaInicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{cita.titulo}</h3>
                  {cita.clienteNombre && (
                    <p className="text-sm text-gray-600 mb-1">Cliente: {cita.clienteNombre}</p>
                  )}
                  {cita.instructorNombre && (
                    <p className="text-sm text-gray-600 mb-1">Instructor: {cita.instructorNombre}</p>
                  )}
                  {cita.capacidadMaxima && (
                    <p className="text-sm text-gray-600 mb-1">
                      Inscritos: {cita.inscritos}/{cita.capacidadMaxima}
                    </p>
                  )}
                  {cita.notas && (
                    <p className="text-sm text-gray-500 italic">{cita.notas}</p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    cita.estado === 'confirmada' ? 'bg-green-100 text-green-800' :
                    cita.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                    cita.estado === 'cancelada' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {cita.estado}
                  </span>
                </div>
              </div>
            ))}
            {getCitasDelDia(fechaActual).length === 0 && (
              <div className="text-center py-12">
                <Clock className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500 text-lg">No hay citas programadas para este día</p>
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="text-gray-600">
              Cargando...
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

