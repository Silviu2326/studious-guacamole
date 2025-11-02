import { useEffect, useState } from 'react';
import { Card } from '../../../components/componentsreutilizables/Card';
import { Button } from '../../../components/componentsreutilizables/Button';
import { Input } from '../../../components/componentsreutilizables/Input';
import { Select } from '../../../components/componentsreutilizables/Select';
import { TableWithActions } from '../../../components/componentsreutilizables/TableWithActions';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { Layout, Plus, Eye, Edit3, Trash2, Search } from 'lucide-react';
import * as programasApi from '../api/programas';

export function PlanSala() {
  const [planes, setPlanes] = useState<programasApi.Programa[]>([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    loadPlanes();
  }, []);

  const loadPlanes = async () => {
    setLoading(true);
    try {
      const progs = await programasApi.getProgramas({ tipo: 'plan-sala', busqueda });
      setPlanes(progs);
    } catch (error) {
      console.error('Error loading planes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = () => {
    loadPlanes();
  };

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este plan de sala?')) {
      const ok = await programasApi.eliminarPrograma(id);
      if (ok) {
        setPlanes(planes.filter((p) => p.id !== id));
      }
    }
  };

  const columns = [
    { key: 'nombre', label: 'Nombre del Plan' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'categoria', label: 'Categoría' },
    {
      key: 'ejercicios',
      label: 'Ejercicios',
      render: (value: any, row: programasApi.Programa) => `${row.ejercicios?.length || 0} ejercicios`,
    },
    {
      key: 'activo',
      label: 'Estado',
      render: (value: any, row: programasApi.Programa) => (
        <Badge variant={row.activo ? 'default' : 'secondary'}>
          {row.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button onClick={() => window.location.href = '#editor?tipo=plan-sala'} iconLeft={Plus}>
          Nuevo Plan
        </Button>
      </div>

      {/* Sistema de Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar planes de sala..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>
              <Button onClick={handleBuscar}>Buscar</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabla de planes */}
      <Card className="bg-white shadow-sm">
        <TableWithActions
          columns={columns}
          data={planes}
          loading={loading}
          actions={(row) => (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => window.location.href = `#editor?id=${row.id}`}
                iconLeft={Eye}
              >
                Ver
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => window.location.href = `#editor?id=${row.id}`}
                iconLeft={Edit3}
              >
                Editar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleEliminar(row.id)}
                iconLeft={Trash2}
              >
                Eliminar
              </Button>
            </div>
          )}
        />
      </Card>

      <Card className="bg-blue-50/80 border-blue-200 shadow-sm">
        <div className="flex items-start gap-3 p-4">
          <Layout className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Planes de Sala para Socios</h4>
            <p className="text-sm text-blue-700">
              Los planes de sala son programas accesibles para todos los socios del gimnasio.
              Son rutinas estandarizadas que los socios pueden seguir de forma independiente
              cuando entrenan en la sala.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

