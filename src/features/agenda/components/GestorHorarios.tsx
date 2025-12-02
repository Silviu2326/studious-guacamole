import React, { useEffect, useState } from 'react';
import { Card, TableWithActions, TableColumn, TableAction, Button, Modal, Input, Select } from '../../../components/componentsreutilizables';
import { getDisponibilidad, addDisponibilidad, removeDisponibilidad } from '../api/disponibilidad';
import { useAuth } from '../../../context/AuthContext';
import { Plus } from 'lucide-react';

interface Franja {
  id: string;
  dia: string; // L-V
  inicio: string; // HH:mm
  fin: string; // HH:mm
  tipo: 'general' | 'videollamada' | 'evaluacion' | 'clase';
}

export const GestorHorarios: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'entrenador';
  const [franjas, setFranjas] = useState<Franja[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [nuevo, setNuevo] = useState<Partial<Franja>>({ dia: 'L', inicio: '09:00', fin: '12:00', tipo: 'general' });

  useEffect(() => {
    setLoading(true);
    getDisponibilidad(role).then((data) => { setFranjas(data); setLoading(false); });
  }, [role]);

  const columns: TableColumn<Franja>[] = [
    { key: 'dia', label: 'Día' },
    { key: 'inicio', label: 'Inicio' },
    { key: 'fin', label: 'Fin' },
    { key: 'tipo', label: 'Tipo' },
  ];

  const actions: TableAction<Franja>[] = [
    { label: 'Eliminar', variant: 'destructive', onClick: async (row) => {
      setLoading(true);
      await removeDisponibilidad(row.id);
      const refreshed = await getDisponibilidad(role);
      setFranjas(refreshed);
      setLoading(false);
    }}
  ];

  const guardarNuevo = async () => {
    if (!nuevo.dia || !nuevo.inicio || !nuevo.fin || !nuevo.tipo) return;
    setLoading(true);
    await addDisponibilidad(nuevo as Franja);
    const refreshed = await getDisponibilidad(role);
    setFranjas(refreshed);
    setLoading(false);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Gestión de Horarios</h3>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus size={20} className="mr-2" />
            Añadir franja
          </Button>
        </div>
      </Card>

      <Card className="p-0 bg-white shadow-sm">
        <TableWithActions data={franjas} columns={columns} actions={actions} loading={loading} />
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nueva franja">
        <div className="space-y-4">
          <Select label="Día" value={nuevo.dia || ''} onChange={(value) => setNuevo(v => ({ ...v, dia: value || 'L' }))}
            options={[{ value: 'L', label: 'Lunes' }, { value: 'M', label: 'Martes' }, { value: 'X', label: 'Miércoles' }, { value: 'J', label: 'Jueves' }, { value: 'V', label: 'Viernes' }, { value: 'S', label: 'Sábado' }, { value: 'D', label: 'Domingo' }]} />
          <Input label="Inicio" type="time" value={nuevo.inicio || ''} onChange={(e) => setNuevo(v => ({ ...v, inicio: e.target.value }))} />
          <Input label="Fin" type="time" value={nuevo.fin || ''} onChange={(e) => setNuevo(v => ({ ...v, fin: e.target.value }))} />
          <Select label="Tipo" value={nuevo.tipo || ''} onChange={(value) => setNuevo(v => ({ ...v, tipo: (value as Franja['tipo']) || 'general' }))}
            options={role === 'entrenador' ? [
              { value: 'general', label: 'General' },
              { value: 'videollamada', label: 'Videollamada' },
              { value: 'evaluacion', label: 'Evaluación' },
            ] : [
              { value: 'general', label: 'General' },
              { value: 'clase', label: 'Clase colectiva' },
              { value: 'evaluacion', label: 'Evaluación física' },
            ]} />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="primary" onClick={guardarNuevo}>Guardar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};