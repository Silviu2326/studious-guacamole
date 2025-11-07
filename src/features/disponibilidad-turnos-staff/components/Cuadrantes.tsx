import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Turno, Personal } from '../types';
import { getTurnos } from '../api/turnos';
import { getPersonal } from '../api/personal';
import { Calendar, ChevronLeft, ChevronRight, Clock, Loader2 } from 'lucide-react';

export const Cuadrantes: React.FC = () => {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [personal, setPersonal] = useState<Personal[]>([]);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [fechaActual]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const inicioSemana = obtenerInicioSemana(fechaActual);
      const finSemana = new Date(inicioSemana);
      finSemana.setDate(finSemana.getDate() + 6);

      const [turnosData, personalData] = await Promise.all([
        getTurnos({
          fechaDesde: inicioSemana.toISOString().split('T')[0],
          fechaHasta: finSemana.toISOString().split('T')[0],
        }),
        getPersonal(),
      ]);
      setTurnos(turnosData);
      setPersonal(personalData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const obtenerInicioSemana = (fecha: Date): Date => {
    const inicio = new Date(fecha);
    const dia = inicio.getDay();
    const diff = inicio.getDate() - dia + (dia === 0 ? -6 : 1);
    inicio.setDate(diff);
    inicio.setHours(0, 0, 0, 0);
    return inicio;
  };

  const obtenerDiasSemana = (): Date[] => {
    const inicio = obtenerInicioSemana(fechaActual);
    const dias: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const dia = new Date(inicio);
      dia.setDate(dia.getDate() + i);
      dias.push(dia);
    }
    return dias;
  };

  const obtenerTurnosPorDia = (fecha: Date): Turno[] => {
    const fechaStr = fecha.toISOString().split('T')[0];
    return turnos.filter(t => t.fecha === fechaStr);
  };

  const semanaAnterior = () => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setDate(nuevaFecha.getDate() - 7);
    setFechaActual(nuevaFecha);
  };

  const semanaSiguiente = () => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setDate(nuevaFecha.getDate() + 7);
    setFechaActual(nuevaFecha);
  };

  const hoy = () => {
    setFechaActual(new Date());
  };

  const dias = obtenerDiasSemana();
  const nombresDias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  if (loading && turnos.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando cuadrantes...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar Superior */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Semana:</span>
          <span className="text-sm text-slate-600">
            {obtenerInicioSemana(fechaActual).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - 
            {new Date(obtenerInicioSemana(fechaActual).getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={semanaAnterior}>
            <ChevronLeft size={16} />
          </Button>
          <Button variant="secondary" size="sm" onClick={hoy}>
            Hoy
          </Button>
          <Button variant="secondary" size="sm" onClick={semanaSiguiente}>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* Tabla de Cuadrantes */}
      <Card className="bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Hora
                </th>
                {dias.map((dia, index) => (
                  <th key={index} className="px-4 py-3 text-center text-sm font-semibold text-gray-900 min-w-[150px]">
                    <div className="flex flex-col items-center">
                      <span>{nombresDias[index]}</span>
                      <span className="text-xs text-slate-600">
                        {dia.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['mañana', 'tarde', 'noche'].map((tipoTurno) => (
                <tr key={tipoTurno} className="border-b border-gray-200">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-slate-500" />
                      <span className="capitalize">{tipoTurno}</span>
                    </div>
                  </td>
                  {dias.map((dia, diaIndex) => {
                    const turnosDia = obtenerTurnosPorDia(dia).filter(t => t.tipo === tipoTurno);
                    return (
                      <td key={diaIndex} className="px-4 py-3">
                        <div className="space-y-2">
                          {turnosDia.map((turno) => {
                            const persona = personal.find(p => p.id === turno.personalId);
                            return (
                              <div
                                key={turno.id}
                                className="p-2 bg-blue-50 border border-blue-200 rounded-xl text-xs transition-all"
                              >
                                <div className="font-medium text-blue-900">
                                  {persona ? `${persona.nombre} ${persona.apellidos}` : turno.personalId}
                                </div>
                                <div className="text-blue-700">
                                  {turno.horaInicio} - {turno.horaFin}
                                </div>
                              </div>
                            );
                          })}
                          {turnosDia.length === 0 && (
                            <div className="text-xs text-gray-400 text-center py-2">-</div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

