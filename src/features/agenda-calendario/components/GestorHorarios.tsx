import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { Card, Button, Input, Select, Modal } from '../../../components/componentsreutilizables';
import { HorarioDisponibilidad } from '../types';
import { getDisponibilidad } from '../api/disponibilidad';

export const GestorHorarios: React.FC = () => {
  const [horarios, setHorarios] = useState<HorarioDisponibilidad[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoHorario, setNuevoHorario] = useState<Partial<HorarioDisponibilidad>>({
    diaSemana: 1,
    horaInicio: '09:00',
    horaFin: '18:00',
    disponible: true,
  });

  useEffect(() => {
    cargarHorarios();
  }, []);

  const cargarHorarios = async () => {
    setLoading(true);
    const disponibilidad = await getDisponibilidad(new Date(), 'entrenador');
    setHorarios(disponibilidad);
    setLoading(false);
  };

  const diasSemana = [
    { value: '0', label: 'Domingo' },
    { value: '1', label: 'Lunes' },
    { value: '2', label: 'Martes' },
    { value: '3', label: 'Miercoles' },
    { value: '4', label: 'Jueves' },
    { value: '5', label: 'Viernes' },
    { value: '6', label: 'Sabado' },
  ];

  const agregarHorario = () => {
    if (nuevoHorario.diaSemana !== undefined && nuevoHorario.horaInicio && nuevoHorario.horaFin) {
      const horario: HorarioDisponibilidad = {
        id: Date.now().toString(),
        diaSemana: nuevoHorario.diaSemana,
        horaInicio: nuevoHorario.horaInicio,
        horaFin: nuevoHorario.horaFin,
        disponible: nuevoHorario.disponible ?? true,
      };
      setHorarios([...horarios, horario]);
      setMostrarModal(false);
      setNuevoHorario({
        diaSemana: 1,
        horaInicio: '09:00',
        horaFin: '18:00',
        disponible: true,
      });
    }
  };

  const eliminarHorario = (id: string) => {
    setHorarios(horarios.filter(h => h.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Gestión de Horarios
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Configura tus horarios de disponibilidad
          </p>
        </div>
        <Button onClick={() => setMostrarModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Horario
        </Button>
      </div>

      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="space-y-4">
            {horarios.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No hay horarios configurados
                </p>
              </div>
            ) : (
              horarios.map((horario) => (
                <div
                  key={horario.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {diasSemana.find(d => parseInt(d.value) === horario.diaSemana)?.label}
                      </div>
                      <div className="text-sm text-gray-600">
                        {horario.horaInicio} - {horario.horaFin}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      horario.disponible 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {horario.disponible ? 'Disponible' : 'No disponible'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => eliminarHorario(horario.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>

      <Modal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        title="Agregar Horario"
        footer={
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={() => setMostrarModal(false)}>
              Cancelar
            </Button>
            <Button onClick={agregarHorario}>
              Agregar
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Select
            label="Día de la Semana"
            options={diasSemana}
            value={nuevoHorario.diaSemana?.toString() || ''}
            onChange={(e) => setNuevoHorario({ ...nuevoHorario, diaSemana: parseInt(e.target.value) })}
          />
          <Input
            label="Hora de Inicio"
            type="time"
            value={nuevoHorario.horaInicio}
            onChange={(e) => setNuevoHorario({ ...nuevoHorario, horaInicio: e.target.value })}
          />
          <Input
            label="Hora de Fin"
            type="time"
            value={nuevoHorario.horaFin}
            onChange={(e) => setNuevoHorario({ ...nuevoHorario, horaFin: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
};

