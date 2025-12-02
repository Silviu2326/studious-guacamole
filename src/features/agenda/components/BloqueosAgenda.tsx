import React, { useEffect, useState } from 'react';
import { Card, TableWithActions, TableColumn, TableAction, Button, Modal, Input, Textarea } from '../../../components/componentsreutilizables';
import { getBloqueos, addBloqueo, removeBloqueo } from '../api/bloqueos';
import { useAuth } from '../../../context/AuthContext';
import { Plus } from 'lucide-react';

interface Bloqueo {
  id: string;
  fechaInicio: string; // ISO
  fechaFin: string; // ISO
  motivo: string;
}

export const BloqueosAgenda: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'entrenador';
  const [bloqueos, setBloqueos] = useState<Bloqueo[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [nuevo, setNuevo] = useState<Partial<Bloqueo>>({ fechaInicio: '', fechaFin: '', motivo: '' });

  useEffect(() => {
    setLoading(true);
    getBloqueos(role).then(data => { setBloqueos(data); setLoading(false); });
  }, [role]);

  const columns: TableColumn<Bloqueo>[] = [
    { 
      key: 'fechaInicio', 
      label: 'Inicio',
      render: (bloqueo: Bloqueo) => new Date(bloqueo.fechaInicio).toLocaleDateString('es-ES'),
    },
    { 
      key: 'fechaFin', 
      label: 'Fin',
      render: (bloqueo: Bloqueo) => new Date(bloqueo.fechaFin).toLocaleDateString('es-ES'),
    },
    { key: 'motivo', label: 'Motivo' },
  ];

  const actions: TableAction<Bloqueo>[] = [
    { label: 'Eliminar', variant: 'destructive', onClick: async (row) => { setLoading(true); await removeBloqueo(row.id); const refreshed = await getBloqueos(role); setBloqueos(refreshed); setLoading(false); } }
  ];

  const guardarNuevo = async () => {
    if (!nuevo.fechaInicio || !nuevo.fechaFin) return;
    setLoading(true);
    await addBloqueo(nuevo as Bloqueo);
    const refreshed = await getBloqueos(role);
    setBloqueos(refreshed);
    setLoading(false);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Bloqueos de Agenda</h3>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus size={20} className="mr-2" />
            Añadir bloqueo
          </Button>
        </div>
      </Card>

      <Card className="p-0 bg-white shadow-sm">
        <TableWithActions data={bloqueos} columns={columns} actions={actions} loading={loading} />
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nuevo bloqueo">
        <div className="space-y-4">
          <Input label="Fecha inicio" type="date" value={nuevo.fechaInicio || ''} onChange={(e) => setNuevo(v => ({ ...v, fechaInicio: e.target.value }))} />
          <Input label="Fecha fin" type="date" value={nuevo.fechaFin || ''} onChange={(e) => setNuevo(v => ({ ...v, fechaFin: e.target.value }))} />
          <Textarea label="Motivo" value={nuevo.motivo || ''} onChange={(e) => setNuevo(v => ({ ...v, motivo: e.target.value }))} />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="primary" onClick={guardarNuevo}>Guardar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};