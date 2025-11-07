import { useEffect, useState } from 'react';
import { Card } from '../../../components/componentsreutilizables/Card';
import { Button } from '../../../components/componentsreutilizables/Button';
import { Select } from '../../../components/componentsreutilizables/Select';
import { Input } from '../../../components/componentsreutilizables/Input';
import { TableWithActions } from '../../../components/componentsreutilizables/TableWithActions';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { Modal } from '../../../components/componentsreutilizables/Modal';
import { User, Calendar, Plus, X } from 'lucide-react';
import * as asignacionesApi from '../api/asignaciones';
import * as programasApi from '../api/programas';
import { useAuth } from '../../../context/AuthContext';

interface Cliente {
  id: string;
  nombre: string;
  email?: string;
}

export function AsignacionCliente() {
  const { user } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [programas, setProgramas] = useState<programasApi.Programa[]>([]);
  const [asignaciones, setAsignaciones] = useState<asignacionesApi.Asignacion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<asignacionesApi.AsignacionInput>({
    programaId: '',
    clienteId: '',
    fechaInicio: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [progs, asigs] = await Promise.all([
        programasApi.getProgramas({ tipo: 'personalizado' }),
        asignacionesApi.getAsignaciones(),
      ]);
      setProgramas(progs);
      setAsignaciones(asigs.filter((a) => a.clienteId));

      // Simular carga de clientes (en producción vendría de API)
      setClientes([
        { id: '1', nombre: 'Carla', email: 'carla@example.com' },
        { id: '2', nombre: 'Miguel', email: 'miguel@example.com' },
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAsignar = async () => {
    if (!form.programaId || !form.clienteId) {
      alert('Por favor completa todos los campos');
      return;
    }

    const asignacion = await asignacionesApi.asignarPrograma(form);
    if (asignacion) {
      setAsignaciones([...asignaciones, asignacion]);
      setIsModalOpen(false);
      setForm({
        programaId: '',
        clienteId: '',
        fechaInicio: new Date().toISOString().split('T')[0],
      });
    }
  };

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta asignación?')) {
      const ok = await asignacionesApi.eliminarAsignacion(id);
      if (ok) {
        setAsignaciones(asignaciones.filter((a) => a.id !== id));
      }
    }
  };

  const estadoBadge = (estado: asignacionesApi.Asignacion['estado']) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      activa: 'default',
      pausada: 'secondary',
      completada: 'outline',
      cancelada: 'destructive',
    };
    return <Badge variant={variants[estado]}>{estado}</Badge>;
  };

  const columns = [
    { key: 'clienteNombre', label: 'Cliente' },
    { key: 'programaNombre', label: 'Programa' },
    { key: 'fechaInicio', label: 'Fecha Inicio' },
    { key: 'fechaFin', label: 'Fecha Fin' },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: any, row: asignacionesApi.Asignacion) => estadoBadge(row.estado),
    },
    {
      key: 'progreso',
      label: 'Progreso',
      render: (value: any, row: asignacionesApi.Asignacion) =>
        row.progreso !== undefined ? `${row.progreso}%` : '-',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button onClick={() => setIsModalOpen(true)} iconLeft={Plus}>
          Nueva Asignación
        </Button>
      </div>

      <Card className="bg-white shadow-sm">
        <TableWithActions
          columns={columns}
          data={asignaciones}
          loading={loading}
          actions={(row) => (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleEliminar(row.id)}
                iconLeft={X}
              >
                Eliminar
              </Button>
            </div>
          )}
        />
      </Card>

      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Asignar Programa a Cliente"
      >
        <div className="space-y-4">
          <Select
            label="Cliente"
            value={form.clienteId}
            onChange={(v) => setForm({ ...form, clienteId: v })}
            options={[
              { label: 'Selecciona un cliente', value: '' },
              ...clientes.map((c) => ({ label: c.nombre, value: c.id })),
            ]}
          />
          <Select
            label="Programa"
            value={form.programaId}
            onChange={(v) => setForm({ ...form, programaId: v })}
            options={[
              { label: 'Selecciona un programa', value: '' },
              ...programas.map((p) => ({ label: p.nombre, value: p.id })),
            ]}
          />
          <Input
            label="Fecha de Inicio"
            type="date"
            value={form.fechaInicio}
            onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
          />
          <Input
            label="Fecha de Fin (opcional)"
            type="date"
            value={form.fechaFin || ''}
            onChange={(e) => setForm({ ...form, fechaFin: e.target.value || undefined })}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAsignar}>Asignar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

