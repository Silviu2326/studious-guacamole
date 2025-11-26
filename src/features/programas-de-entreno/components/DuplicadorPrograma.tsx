import { useEffect, useState } from 'react';
import { Card } from '../../../components/componentsreutilizables/Card';
import { Button } from '../../../components/componentsreutilizables/Button';
import { Input } from '../../../components/componentsreutilizables/Input';
import { Select } from '../../../components/componentsreutilizables/Select';
import { TableWithActions } from '../../../components/componentsreutilizables/TableWithActions';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { Modal } from '../../../components/componentsreutilizables/Modal';
import { Copy, CheckCircle } from 'lucide-react';
import * as programasApi from '../api/programas';

export function DuplicadorPrograma() {
  const [programas, setProgramas] = useState<programasApi.Programa[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programaSeleccionado, setProgramaSeleccionado] = useState<programasApi.Programa | null>(null);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  useEffect(() => {
    loadProgramas();
  }, []);

  const loadProgramas = async () => {
    setLoading(true);
    try {
      const progs = await programasApi.getProgramas({ activo: true });
      setProgramas(progs);
    } catch (error) {
      console.error('Error loading programas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirDuplicar = (programa: programasApi.Programa) => {
    setProgramaSeleccionado(programa);
    setNuevoNombre(`${programa.nombre} (copia)`);
    setIsModalOpen(true);
  };

  const handleDuplicar = async () => {
    if (!programaSeleccionado) return;

    const nombreFinal = nuevoNombre.trim() || `${programaSeleccionado.nombre} (copia)`;
    const duplicado = await programasApi.duplicarPrograma(programaSeleccionado.id, nombreFinal);

    if (duplicado) {
      setProgramas([...programas, duplicado]);
      setMensajeExito(`Programa "${nombreFinal}" duplicado correctamente`);
      setIsModalOpen(false);
      setProgramaSeleccionado(null);
      setNuevoNombre('');
      setTimeout(() => setMensajeExito(null), 3000);
    } else {
      alert('Error al duplicar el programa');
    }
  };

  const tipoBadge = (tipo: programasApi.Programa['tipo']) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      personalizado: 'default',
      grupal: 'secondary',
      'plan-sala': 'outline',
    };
    const labels: Record<string, string> = {
      personalizado: 'Personalizado',
      grupal: 'Grupal',
      'plan-sala': 'Plan Sala',
    };
    return <Badge variant={variants[tipo]}>{labels[tipo]}</Badge>;
  };

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'tipo', label: 'Tipo', render: (value: any, row: programasApi.Programa) => tipoBadge(row.tipo) },
    {
      key: 'ejercicios',
      label: 'Ejercicios',
      render: (value: any, row: programasApi.Programa) => `${row.ejercicios?.length || 0} ejercicios`,
    },
  ];

  return (
    <div className="space-y-6">
      {mensajeExito && (
        <Card className="bg-green-50 border-green-200 shadow-sm">
          <div className="flex items-center gap-2 text-green-800 p-4">
            <CheckCircle className="w-5 h-5" />
            <span>{mensajeExito}</span>
          </div>
        </Card>
      )}

      <Card className="bg-white shadow-sm">
        <div className="p-4 space-y-4">
          <p className="text-sm text-slate-600">
            Selecciona un programa exitoso para duplicarlo y crear una nueva versión.
            Útil para reutilizar programas que funcionaron bien con otros clientes o grupos.
          </p>

          <TableWithActions
          columns={columns}
          data={programas}
          loading={loading}
          actions={(row) => (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleAbrirDuplicar(row)}
              iconLeft={Copy}
            >
              Duplicar
            </Button>
          )}
        />
        </div>
      </Card>

      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Duplicar Programa"
      >
        <div className="space-y-4">
          {programaSeleccionado && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Programa original:</p>
              <p className="font-medium">{programaSeleccionado.nombre}</p>
              <p className="text-sm text-gray-600 mt-1">
                {programaSeleccionado.ejercicios?.length || 0} ejercicios
              </p>
            </div>
          )}

          <Input
            label="Nombre del Nuevo Programa"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            placeholder="Ej: Rutina de fuerza para Carla (copia)"
          />

          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleDuplicar} iconLeft={Copy}>
              Duplicar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

