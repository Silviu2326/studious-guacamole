import React, { useEffect, useMemo, useState } from 'react';
import { Card, TableWithActions, TableColumn, TableAction, Button, Modal, Input, Select } from '../../../components/componentsreutilizables';
import { useAuth } from '../../../context/AuthContext';
import { getCitas, crearCita, cancelarCita } from '../api/citas';
import { getClases, publicarClase, cancelarClase } from '../api/clases';
import { Plus } from 'lucide-react';

interface ReservaBase { id: string; fecha: string; inicio: string; fin: string; }

interface Cita extends ReservaBase { cliente: string; tipo: '1a1' | 'videollamada' | 'evaluacion'; }
interface Clase extends ReservaBase { clase: string; capacidad: number; ocupacion: number; instructor: string; }

export const ReservasCitas: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'entrenador';
  const [loading, setLoading] = useState(false);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [clases, setClases] = useState<Clase[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    setLoading(true);
    if (role === 'entrenador') {
      getCitas().then(data => { setCitas(data); setLoading(false); });
    } else {
      getClases().then(data => { setClases(data); setLoading(false); });
    }
  }, [role]);

  const columnsCitas: TableColumn<Cita>[] = [
    { key: 'cliente', label: 'Cliente' },
    { 
      key: 'tipo', 
      label: 'Tipo',
      render: (cita: Cita) => cita.tipo === '1a1' ? 'Sesión 1 a 1' : cita.tipo === 'videollamada' ? 'Videollamada' : 'Evaluación',
    },
    { 
      key: 'fecha', 
      label: 'Fecha',
      render: (cita: Cita) => new Date(cita.fecha).toLocaleDateString('es-ES'),
    },
    { key: 'inicio', label: 'Inicio' },
    { key: 'fin', label: 'Fin' },
  ];

  const actionsCitas: TableAction<Cita>[] = [
    { label: 'Cancelar', variant: 'destructive', onClick: async (row) => { setLoading(true); await cancelarCita(row.id); const refreshed = await getCitas(); setCitas(refreshed); setLoading(false); } }
  ];

  const columnsClases: TableColumn<Clase>[] = [
    { key: 'clase', label: 'Clase' },
    { key: 'instructor', label: 'Instructor' },
    { key: 'capacidad', label: 'Capacidad' },
    { 
      key: 'ocupacion', 
      label: 'Ocupación',
      render: (clase: Clase) => `${clase.ocupacion}/${clase.capacidad}`,
    },
    { 
      key: 'fecha', 
      label: 'Fecha',
      render: (clase: Clase) => new Date(clase.fecha).toLocaleDateString('es-ES'),
    },
    { key: 'inicio', label: 'Inicio' },
    { key: 'fin', label: 'Fin' },
  ];

  const actionsClases: TableAction<Clase>[] = [
    { label: 'Cancelar', variant: 'destructive', onClick: async (row) => { setLoading(true); await cancelarClase(row.id); const refreshed = await getClases(); setClases(refreshed); setLoading(false); } }
  ];

  const opcionesTipo = useMemo(() => role === 'entrenador'
    ? [
        { value: '1a1', label: 'Sesión 1 a 1' },
        { value: 'videollamada', label: 'Videollamada' },
        { value: 'evaluacion', label: 'Evaluación' },
      ]
    : [
        { value: 'clase', label: 'Clase Colectiva' },
      ], [role]);

  const abrirCrear = () => { setForm({ tipo: role === 'entrenador' ? '1a1' : 'clase', fecha: '', inicio: '', fin: '' }); setShowModal(true); };

  const guardar = async () => {
    setLoading(true);
    if (role === 'entrenador') {
      await crearCita({ id: Math.random().toString(), cliente: form.cliente || 'Cliente', tipo: form.tipo, fecha: form.fecha, inicio: form.inicio, fin: form.fin });
      setCitas(await getCitas());
    } else {
      await publicarClase({ id: Math.random().toString(), clase: form.clase || 'Nueva clase', instructor: form.instructor || 'Instructor', capacidad: parseInt(form.capacidad || '10'), ocupacion: 0, fecha: form.fecha, inicio: form.inicio, fin: form.fin });
      setClases(await getClases());
    }
    setLoading(false);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">{role === 'entrenador' ? 'Reservas de Citas' : 'Gestión de Clases'}</h3>
          <Button variant="primary" onClick={abrirCrear}>
            <Plus size={20} className="mr-2" />
            {role === 'entrenador' ? 'Nueva cita' : 'Publicar clase'}
          </Button>
        </div>
      </Card>

      <Card className="p-0 bg-white shadow-sm">
        {role === 'entrenador' ? (
          <TableWithActions data={citas} columns={columnsCitas} actions={actionsCitas} loading={loading} />
        ) : (
          <TableWithActions data={clases} columns={columnsClases} actions={actionsClases} loading={loading} />
        )}
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={role === 'entrenador' ? 'Nueva cita' : 'Nueva clase'}>
        <div className="space-y-4">
          <Select label="Tipo" value={form.tipo || ''} onChange={(value) => setForm((f: any) => ({ ...f, tipo: value }))} options={opcionesTipo} />
          {role === 'entrenador' ? (
            <Input label="Cliente" value={form.cliente || ''} onChange={(e) => setForm((f: any) => ({ ...f, cliente: e.target.value }))} />
          ) : (
            <>
              <Input label="Clase" value={form.clase || ''} onChange={(e) => setForm((f: any) => ({ ...f, clase: e.target.value }))} />
              <Input label="Instructor" value={form.instructor || ''} onChange={(e) => setForm((f: any) => ({ ...f, instructor: e.target.value }))} />
              <Input label="Capacidad" type="number" min="1" value={form.capacidad || ''} onChange={(e) => setForm((f: any) => ({ ...f, capacidad: e.target.value }))} />
            </>
          )}
          <Input label="Fecha" type="date" value={form.fecha || ''} onChange={(e) => setForm((f: any) => ({ ...f, fecha: e.target.value }))} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Inicio" type="time" value={form.inicio || ''} onChange={(e) => setForm((f: any) => ({ ...f, inicio: e.target.value }))} />
            <Input label="Fin" type="time" value={form.fin || ''} onChange={(e) => setForm((f: any) => ({ ...f, fin: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="primary" onClick={guardar}>Guardar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};