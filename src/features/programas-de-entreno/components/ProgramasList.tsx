import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TableWithActions } from '../../../components/componentsreutilizables/TableWithActions';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { Button } from '../../../components/componentsreutilizables/Button';
import { Select } from '../../../components/componentsreutilizables/Select';
import { Card } from '../../../components/componentsreutilizables/Card';
import { Edit3, Trash2, Plus, Copy, User, Layout, Search, X } from 'lucide-react';
import * as programasApi from '../api/programas';
import * as categoriasApi from '../api/categorias';
import { useAuth } from '../../../context/AuthContext';

export function ProgramasList({ hideCreateButton = false }: { hideCreateButton?: boolean }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEntrenador = user?.role === 'entrenador';
  const [programas, setProgramas] = useState<programasApi.Programa[]>([]);
  const [categorias, setCategorias] = useState<categoriasApi.Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState<programasApi.FiltrosProgramas>({
    tipo: isEntrenador ? 'personalizado' : 'grupal',
  });
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    loadData();
  }, [filtros]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [progs, cats] = await Promise.all([
        programasApi.getProgramas({ ...filtros, busqueda }),
        categoriasApi.getCategorias(isEntrenador ? 'personalizado' : 'grupal'),
      ]);
      setProgramas(progs);
      setCategorias(cats);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tipoBadge = (tipo: programasApi.Programa['tipo']) => {
    const variants: Record<string, 'blue' | 'secondary' | 'outline'> = {
      personalizado: 'blue',
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

  const columns = useMemo(
    () => [
      { key: 'nombre', label: 'Nombre' },
      { 
        key: 'categoria', 
        label: 'Categoría',
        render: (_value: unknown, row: programasApi.Programa) => {
          const categoria = categorias.find(c => c.id === row.categoria);
          return categoria ? categoria.nombre : row.categoria;
        }
      },
      { key: 'tipo', label: 'Tipo', render: (_value: unknown, row: programasApi.Programa) => tipoBadge(row.tipo) },
      {
        key: 'cliente',
        label: 'Cliente',
        render: (_value: unknown, row: programasApi.Programa) => {
          // Dato falso determinista para demo
          const fakeNames = ['Juan Pérez', 'Ana García', 'Carlos López', 'María Rodríguez', 'Luis Martínez', 'Laura González', 'Pedro Sánchez', 'Sofía Ramírez'];
          const seed = (row.id.charCodeAt(0) + (row.nombre?.length || 0));
          const index = seed % fakeNames.length;
          const selectedName = fakeNames[index];
          
          return (
            <div className="flex items-center gap-2">
               <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                  {selectedName.charAt(0)}
               </div>
               <span className="text-sm text-gray-700">{selectedName}</span>
            </div>
          );
        },
      },
      {
        key: 'duracion',
        label: 'Duración',
        render: (_value: unknown, row: programasApi.Programa) =>
          row.duracionSemanas ? `${row.duracionSemanas} semanas` : '-',
      },
      {
        key: 'activo',
        label: 'Estado',
        render: (_value: unknown, row: programasApi.Programa) => (
          <Badge variant={row.activo ? 'green' : 'secondary'}>
            {row.activo ? 'Activo' : 'Inactivo'}
          </Badge>
        ),
      },
    ],
    [categorias]
  );

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este programa?')) {
      const ok = await programasApi.eliminarPrograma(id);
      if (ok) {
        setProgramas(programas.filter((p) => p.id !== id));
      }
    }
  };

  const handleDuplicar = async (programa: programasApi.Programa) => {
    const nuevo = await programasApi.duplicarPrograma(
      programa.id,
      `${programa.nombre} (copia)`
    );
    if (nuevo) {
      setProgramas([...programas, nuevo]);
    }
  };

  const hasFiltrosActivos = busqueda || filtros.categoria || (filtros.tipo && !isEntrenador);
  const filtrosActivosCount = [busqueda, filtros.categoria, filtros.tipo && !isEntrenador ? filtros.tipo : null].filter(Boolean).length;

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltros({
      tipo: isEntrenador ? 'personalizado' : 'grupal',
    });
  };

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      {!hideCreateButton && (
        <div className="flex items-center justify-end">
          <Button onClick={() => navigate('/editor-definitivo')} leftIcon={<Plus className="h-4 w-4" />}>
            Nuevo Programa
          </Button>
        </div>
      )}

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
                  placeholder="Buscar programas..."
                  value={busqueda}
                  onChange={(e) => {
                    setBusqueda(e.target.value);
                    setFiltros({ ...filtros, busqueda: e.target.value });
                  }}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>
              {hasFiltrosActivos && (
                <Button variant="ghost" onClick={limpiarFiltros} leftIcon={<X className="h-3.5 w-3.5" />} size="sm">
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>

          {/* Panel de filtros avanzados */}
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <User size={16} className="inline mr-1" />
                  Categoría
                </label>
                <Select
                  value={filtros.categoria || ''}
                  onChange={(event) => setFiltros({ ...filtros, categoria: event.target.value || undefined })}
                  options={[
                    { label: 'Todas', value: '' },
                    ...categorias.map((c) => ({ label: c.nombre, value: c.id })),
                  ]}
                />
              </div>
              {!isEntrenador && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Layout size={16} className="inline mr-1" />
                    Tipo
                  </label>
                  <Select
                    value={filtros.tipo || ''}
                    onChange={(event) =>
                      setFiltros({ ...filtros, tipo: (event.target.value || undefined) as any })
                    }
                    options={[
                      { label: 'Todos', value: '' },
                      { label: 'Grupal', value: 'grupal' },
                      { label: 'Plan Sala', value: 'plan-sala' },
                    ]}
                  />
                </div>
              )}
            </div>

            {/* Resumen de resultados */}
            {programas.length > 0 && (
              <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                <span>{programas.length} resultados encontrados</span>
                {filtrosActivosCount > 0 && (
                  <span>{filtrosActivosCount} filtros aplicados</span>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Lista de programas */}
      <TableWithActions
        columns={columns}
        data={programas}
        loading={loading}
        actions={(row) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate(`/editor-definitivo?id=${row.id}`)}
              leftIcon={<Edit3 className="h-4 w-4" />}
            >
              Editar
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleDuplicar(row)}
              leftIcon={<Copy className="h-4 w-4" />}
            >
              Duplicar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleEliminar(row.id)}
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              Eliminar
            </Button>
          </div>
        )}
      />
    </div>
  );
}

