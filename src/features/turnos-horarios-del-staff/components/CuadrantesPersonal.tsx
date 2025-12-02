import React, { useState, useEffect } from 'react';
import { Card, Button, Table } from '../../../components/componentsreutilizables';
import { Cuadrante, Turno } from '../types';
import { getCuadrantes } from '../api/cuadrantes';
import { getPersonal } from '../api/personal';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export const CuadrantesPersonal: React.FC = () => {
  const [cuadrantes, setCuadrantes] = useState<Cuadrante[]>([]);
  const [personal, setPersonal] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [semanaActual, setSemanaActual] = useState(1);
  const [añoActual, setAñoActual] = useState(new Date().getFullYear());

  useEffect(() => {
    cargarDatos();
  }, [semanaActual, añoActual]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [cuadrantesData, personalData] = await Promise.all([
        getCuadrantes(),
        getPersonal(),
      ]);
      setCuadrantes(cuadrantesData);
      setPersonal(personalData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const cuadranteActual = cuadrantes.find(c => c.semana === semanaActual && c.año === añoActual);

  const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const horas = Array.from({ length: 14 }, (_, i) => `${6 + i}:00`);

  const obtenerTurnosPorDiaHora = (dia: number, hora: string): Turno[] => {
    if (!cuadranteActual) return [];
    return cuadranteActual.turnos.filter(turno => {
      const fechaTurno = new Date(turno.fecha);
      const diaTurno = fechaTurno.getDay() === 0 ? 7 : fechaTurno.getDay();
      const horaInicio = turno.horaInicio.split(':')[0];
      return diaTurno === dia && parseInt(horaInicio) === parseInt(hora.split(':')[0]);
    });
  };

  const cambiarSemana = (direccion: 'anterior' | 'siguiente') => {
    if (direccion === 'anterior') {
      if (semanaActual > 1) {
        setSemanaActual(semanaActual - 1);
      } else {
        setSemanaActual(52);
        setAñoActual(añoActual - 1);
      }
    } else {
      if (semanaActual < 52) {
        setSemanaActual(semanaActual + 1);
      } else {
        setSemanaActual(1);
        setAñoActual(añoActual + 1);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => cambiarSemana('anterior')}>
            <ChevronLeft size={20} />
          </Button>
          <span className="text-sm font-medium text-gray-700">
            Semana {semanaActual} - {añoActual}
          </span>
          <Button variant="ghost" onClick={() => cambiarSemana('siguiente')}>
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      {loading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <p className="text-gray-600">Cargando cuadrantes...</p>
        </Card>
      ) : cuadranteActual ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Hora</th>
                  {diasSemana.map((dia, index) => (
                    <th key={index} className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                      {dia}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {horas.map((hora, horaIndex) => (
                  <tr key={horaIndex} className="border-b border-gray-100">
                    <td className="px-4 py-2 text-xs font-medium text-gray-500">{hora}</td>
                    {[1, 2, 3, 4, 5, 6, 7].map((dia) => {
                      const turnos = obtenerTurnosPorDiaHora(dia, hora);
                      return (
                        <td key={dia} className="px-2 py-1">
                          {turnos.map((turno) => {
                            const persona = personal.find(p => p.id === turno.personalId);
                            return (
                              <div
                                key={turno.id}
                                className="bg-blue-100 text-blue-800 text-xs p-1 rounded mb-1 flex items-center gap-1"
                              >
                                <Clock className="w-3 h-3" />
                                <span className="truncate">
                                  {persona ? `${persona.nombre}` : turno.personalId}
                                </span>
                              </div>
                            );
                          })}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No hay cuadrantes disponibles para esta semana</p>
        </Card>
      )}
    </div>
  );
};


