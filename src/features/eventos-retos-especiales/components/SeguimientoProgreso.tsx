import React, { useState } from 'react';
import { ProgresoParticipante, Participante, TipoActividad } from '../types';
import { Card, Button, Select, Input, Textarea } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { TrendingUp, Calendar, CheckCircle, XCircle } from 'lucide-react';

interface SeguimientoProgresoProps {
  participantes: Participante[];
  eventoId: string;
  onRegistrarProgreso?: (progreso: Omit<ProgresoParticipante, 'fecha'>) => void;
}

export const SeguimientoProgreso: React.FC<SeguimientoProgresoProps> = ({
  participantes,
  eventoId,
  onRegistrarProgreso,
}) => {
  const [participanteSeleccionado, setParticipanteSeleccionado] = useState<string>('');
  const [actividad, setActividad] = useState<TipoActividad | ''>('');
  const [valor, setValor] = useState<string>('');
  const [completado, setCompletado] = useState(true);
  const [notas, setNotas] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!participanteSeleccionado) {
      return;
    }

    const progreso: Omit<ProgresoParticipante, 'fecha'> = {
      participanteId: participanteSeleccionado,
      actividad: actividad || undefined,
      valor: valor ? parseFloat(valor) : undefined,
      completado,
      notas: notas || undefined,
    };

    if (onRegistrarProgreso) {
      onRegistrarProgreso(progreso);
    }

    // Reset form
    setParticipanteSeleccionado('');
    setActividad('');
    setValor('');
    setCompletado(true);
    setNotas('');
  };

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-gray-500" />
          <h3 className="text-xl font-bold text-gray-900">
            Registrar Progreso
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Participante"
            value={participanteSeleccionado}
            onChange={(e) => setParticipanteSeleccionado(e.target.value)}
            options={participantes.map(p => ({
              value: p.id,
              label: p.nombre,
            }))}
            placeholder="Selecciona un participante"
          />

          <Select
            label="Tipo de Actividad (opcional)"
            value={actividad}
            onChange={(e) => setActividad(e.target.value as TipoActividad | '')}
            options={[
              { value: '', label: 'Sin actividad específica' },
              { value: 'pasos_diarios', label: 'Pasos diarios' },
              { value: 'entrenamientos', label: 'Entrenamientos' },
              { value: 'comidas_saludables', label: 'Comidas saludables' },
              { value: 'agua', label: 'Agua' },
              { value: 'sueño', label: 'Sueño' },
            ]}
          />

          {actividad && (
            <Input
              label="Valor"
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="Cantidad (ej: 10000 pasos, 8 horas)"
            />
          )}

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={completado}
                onChange={(e) => setCompletado(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className={ds.typography.bodySmall}>Completado</span>
            </label>
          </div>

          <Textarea
            label="Notas (opcional)"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={3}
            placeholder="Observaciones o comentarios..."
          />

          <Button type="submit" variant="primary" fullWidth>
            Registrar Progreso
          </Button>
        </form>
      </div>
    </Card>
  );
};

