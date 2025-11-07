import { useEffect, useState } from 'react';
import { Card } from '../../../components/componentsreutilizables/Card';
import { Button } from '../../../components/componentsreutilizables/Button';
import { Input } from '../../../components/componentsreutilizables/Input';
import { Textarea } from '../../../components/componentsreutilizables/Textarea';
import { Select } from '../../../components/componentsreutilizables/Select';
import { TableWithActions } from '../../../components/componentsreutilizables/TableWithActions';
import { Modal } from '../../../components/componentsreutilizables/Modal';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { FolderTree, Plus, Edit3, Trash2 } from 'lucide-react';
import * as categoriasApi from '../api/categorias';
import { useAuth } from '../../../context/AuthContext';

export function CategorizadorProgramas() {
  const { user } = useAuth();
  const isEntrenador = user?.role === 'entrenador';
  const [categorias, setCategorias] = useState<categoriasApi.Categoria[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<categoriasApi.Categoria | null>(null);
  const [form, setForm] = useState<Omit<categoriasApi.Categoria, 'id'>>({
    nombre: '',
    descripcion: '',
    tipo: isEntrenador ? 'personalizado' : 'grupal',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    setLoading(true);
    try {
      const cats = await categoriasApi.getCategorias(isEntrenador ? 'personalizado' : 'grupal');
      setCategorias(cats);
    } catch (error) {
      console.error('Error loading categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirModal = (categoria?: categoriasApi.Categoria) => {
    if (categoria) {
      setEditingCategoria(categoria);
      setForm({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || '',
        tipo: categoria.tipo,
        color: categoria.color,
        icono: categoria.icono,
      });
    } else {
      setEditingCategoria(null);
      setForm({
        nombre: '',
        descripcion: '',
        tipo: isEntrenador ? 'personalizado' : 'grupal',
      });
    }
    setIsModalOpen(true);
  };

  const handleGuardar = async () => {
    if (!form.nombre) {
      alert('Por favor ingresa el nombre de la categoría');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (editingCategoria) {
        result = await categoriasApi.actualizarCategoria(editingCategoria.id, form);
        if (result) {
          await loadCategorias();
          setIsModalOpen(false);
        }
      } else {
        result = await categoriasApi.crearCategoria(form);
        if (result) {
          await loadCategorias();
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      console.error('Error saving categoria:', error);
      alert('Error al guardar la categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      const ok = await categoriasApi.eliminarCategoria(id);
      if (ok) {
        await loadCategorias();
      }
    }
  };

  const tipoBadge = (tipo: categoriasApi.Categoria['tipo']) => {
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
    { key: 'descripcion', label: 'Descripción' },
    { key: 'tipo', label: 'Tipo', render: (value: any, row: categoriasApi.Categoria) => tipoBadge(row.tipo) },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button onClick={() => handleAbrirModal()} iconLeft={Plus}>
          Nueva Categoría
        </Button>
      </div>

      <Card className="bg-white shadow-sm">
        <TableWithActions
          columns={columns}
          data={categorias}
          loading={loading}
          actions={(row) => (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleAbrirModal(row)}
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

      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
      >
        <div className="space-y-4">
          <Input
            label="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            placeholder="Ej: Fuerza, Cardio, Rehabilitación"
            required
          />

          <Textarea
            label="Descripción"
            value={form.descripcion || ''}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            placeholder="Descripción opcional de la categoría"
            rows={3}
          />

          <Select
            label="Tipo"
            value={form.tipo}
            onChange={(v) => setForm({ ...form, tipo: v as any })}
            options={[
              { label: 'Personalizado', value: 'personalizado' },
              { label: 'Grupal', value: 'grupal' },
              { label: 'Plan Sala', value: 'plan-sala' },
            ]}
          />

          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleGuardar} loading={loading}>
              {editingCategoria ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

