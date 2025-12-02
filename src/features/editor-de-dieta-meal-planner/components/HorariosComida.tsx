import React, { useState } from 'react';
import { Card, Button, Input, Select } from '../../../components/componentsreutilizables';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { type HorarioComida, type Comida } from '../api/editor';
import { ds } from '../../adherencia/ui/ds';

interface HorariosComidaProps {
  comidas: Comida[];
  horarios: HorarioComida[];
  onHorarioAgregado: (horario: HorarioComida) => void;
  onHorarioEliminado: (id: string) => void;
  onHorarioActualizado: (id: string, horario: Partial<HorarioComida>) => void;
}

export const HorariosComida: React.FC<HorariosComidaProps> = ({
  comidas,
  horarios,
  onHorarioAgregado,
  onHorarioEliminado,
  onHorarioActualizado,
}) => {
  const [nuevoHorario, setNuevoHorario] = useState<Partial<HorarioComida>>({
    comidaId: comidas[0]?.id || '',
    hora: '08:00',
    dias: [],
  });

  const diasSemana = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
  ];

  const handleAgregar = () => {
    if (!nuevoHorario.comidaId || !nuevoHorario.hora || !nuevoHorario.dias || nuevoHorario.dias.length === 0) {
      alert('Completa todos los campos');
      return;
    }

    const horario: HorarioComida = {
      id: Date.now().toString(),
      comidaId: nuevoHorario.comidaId,
      hora: nuevoHorario.hora,
      dias: nuevoHorario.dias,
    };

    onHorarioAgregado(horario);
    setNuevoHorario({
      comidaId: comidas[0]?.id || '',
      hora: '08:00',
      dias: [],
    });
  };

  const toggleDia = (dia: number) => {
    setNuevoHorario((prev) => ({
      ...prev,
      dias: prev.dias?.includes(dia)
        ? prev.dias.filter((d) => d !== dia)
        : [...(prev.dias || []), dia],
    }));
  };

  const obtenerNombreComida = (comidaId: string) => {
    return comidas.find((c) => c.id === comidaId)?.nombre || 'Comida no encontrada';
  };

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Clock size={24} className="text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">
          Horarios de Comidas
        </h2>
      </div>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Comida"
            options={comidas.map((c) => ({
              value: c.id,
              label: `${c.nombre} (${c.tipo})`,
            }))}
            value={nuevoHorario.comidaId || ''}
            onChange={(e) => setNuevoHorario({ ...nuevoHorario, comidaId: e.target.value })}
          />

          <Input
            label="Hora"
            type="time"
            value={nuevoHorario.hora}
            onChange={(e) => setNuevoHorario({ ...nuevoHorario, hora: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Días de la Semana
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {diasSemana.map((dia) => (
              <button
                key={dia.value}
                onClick={() => toggleDia(dia.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  nuevoHorario.dias?.includes(dia.value)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {dia.label}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={handleAgregar} fullWidth>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Horario
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          Horarios Configurados
        </h3>
        {horarios.length === 0 ? (
          <p className="text-gray-600 text-sm">
            No hay horarios configurados. Agrega uno usando el formulario arriba.
          </p>
        ) : (
          horarios.map((horario) => (
            <Card key={horario.id} className="p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">
                    {obtenerNombreComida(horario.comidaId)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {horario.hora} - {horario.dias.map((d) => diasSemana[d].label).join(', ')}
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onHorarioEliminado(horario.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </Card>
  );
};

