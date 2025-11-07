import React, { useState } from 'react';
import { Card, Button, Input, Modal } from '../../../components/componentsreutilizables';
import { Categoria, CategoriaFormData } from '../types';
import { useProductos } from '../hooks/useProductos';
import { 
  Plus, 
  Edit, 
  Package,
  Eye,
  EyeOff,
  Palette,
  Hash
} from 'lucide-react';

// Iconos disponibles para categorías
const iconosDisponibles = [
  { nombre: 'Pill', icono: 'Pill', label: 'Suplementos' },
  { nombre: 'Shirt', icono: 'Shirt', label: 'Ropa' },
  { nombre: 'Dumbbell', icono: 'Dumbbell', label: 'Accesorios' },
  { nombre: 'Award', icono: 'Award', label: 'Merchandising' },
  { nombre: 'Coffee', icono: 'Coffee', label: 'Bebidas' },
  { nombre: 'Package', icono: 'Package', label: 'General' },
  { nombre: 'Tag', icono: 'Tag', label: 'Etiqueta' },
  { nombre: 'Heart', icono: 'Heart', label: 'Salud' },
  { nombre: 'Zap', icono: 'Zap', label: 'Energía' }
];

// Colores disponibles para categorías
const coloresDisponibles = [
  '#10B981', '#6366F1', '#F59E0B', '#EF4444', '#3B82F6',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#84CC16'
];

interface GestorCategoriasProps {
  onCategoriaCreada?: () => void;
}

export const GestorCategorias: React.FC<GestorCategoriasProps> = ({
  onCategoriaCreada
}) => {
  const { categorias, cargarCategorias } = useProductos();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [modoModal, setModoModal] = useState<'crear' | 'editar'>('crear');

  const handleCrearCategoria = () => {
    setCategoriaSeleccionada(null);
    setModoModal('crear');
    setModalAbierto(true);
  };

  const handleEditarCategoria = (categoria: Categoria) => {
    setCategoriaSeleccionada(categoria);
    setModoModal('editar');
    setModalAbierto(true);
  };

  const handleCategoriaGuardada = () => {
    setModalAbierto(false);
    setCategoriaSeleccionada(null);
    cargarCategorias();
    onCategoriaCreada?.();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gestión de Categorías</h2>
          <p className="text-gray-600">Organiza los productos en categorías</p>
        </div>
        
        <Button onClick={handleCrearCategoria}>
          <Plus size={20} className="mr-2" />
          Nueva Categoría
        </Button>
      </div>

      {/* Lista de categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categorias.map((categoria) => (
          <CategoriaCard
            key={categoria.id}
            categoria={categoria}
            onEditar={handleEditarCategoria}
          />
        ))}
      </div>

      {/* Modal de categoría */}
      <CategoriaModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        categoria={categoriaSeleccionada}
        modo={modoModal}
        onGuardar={handleCategoriaGuardada}
      />
    </div>
  );
};

// Componente de tarjeta de categoría
interface CategoriaCardProps {
  categoria: Categoria;
  onEditar: (categoria: Categoria) => void;
}

const CategoriaCard: React.FC<CategoriaCardProps> = ({ categoria, onEditar }) => {
  const IconComponent = ({ name: _name }: { name: string }) => {
    // En una implementación real, aquí mapearías el nombre del icono al componente
    return <Package size={24} style={{ color: categoria.color }} />;
  };

  return (
    <Card variant="hover" className="p-4 bg-white shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div 
            className="p-2 rounded-lg mr-3"
            style={{ backgroundColor: `${categoria.color}20` }}
          >
            <IconComponent name={categoria.icono} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{categoria.nombre}</h3>
            <p className="text-sm text-gray-600">{categoria.descripcion}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {categoria.activa ? (
            <Eye size={16} className="text-green-500" />
          ) : (
            <EyeOff size={16} className="text-gray-400" />
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center text-sm text-gray-600">
          <Hash size={14} className="mr-1" />
          <span>{categoria.cantidadProductos} productos</span>
        </div>
        
        <div className="text-sm text-gray-500">
          Orden: {categoria.orden}
        </div>
      </div>

      {/* Subcategorías */}
      {categoria.subcategorias && categoria.subcategorias.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500 mb-2">Subcategorías:</p>
          <div className="flex flex-wrap gap-1">
            {categoria.subcategorias.map((sub) => (
              <span
                key={sub.id}
                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
              >
                {sub.nombre}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEditar(categoria)}
          className="flex-1"
        >
          <Edit size={16} className="mr-1" />
          Editar
        </Button>
      </div>
    </Card>
  );
};

// Modal de categoría
interface CategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoria?: Categoria | null;
  modo: 'crear' | 'editar';
  onGuardar: () => void;
}

const CategoriaModal: React.FC<CategoriaModalProps> = ({
  isOpen,
  onClose,
  categoria,
  modo,
  onGuardar
}) => {
  const [formData, setFormData] = useState<CategoriaFormData>({
    nombre: '',
    descripcion: '',
    icono: 'Package',
    color: '#6366F1',
    activa: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Inicializar formulario
  React.useEffect(() => {
    if (categoria && modo === 'editar') {
      setFormData({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
        icono: categoria.icono,
        color: categoria.color,
        activa: categoria.activa
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        icono: 'Package',
        color: '#6366F1',
        activa: true
      });
    }
    setErrors({});
  }, [categoria, modo, isOpen]);

  const handleInputChange = (campo: keyof CategoriaFormData, valor: any) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
    if (errors[campo]) {
      setErrors(prev => ({ ...prev, [campo]: '' }));
    }
  };

  const validarFormulario = (): boolean => {
    const nuevosErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      nuevosErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.descripcion.trim()) {
      nuevosErrors.descripcion = 'La descripción es obligatoria';
    }

    setErrors(nuevosErrors);
    return Object.keys(nuevosErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    try {
      setLoading(true);
      // Aquí iría la lógica para guardar la categoría
      // await productosService.crearCategoria(formData) o actualizarCategoria
      onGuardar();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
    } finally {
      setLoading(false);
    }
  };

  const titulo = modo === 'crear' ? 'Nueva Categoría' : 'Editar Categoría';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={titulo}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <div className="space-y-4">
          <Input
            label="Nombre de la categoría *"
            value={formData.nombre}
            onChange={(e) => handleInputChange('nombre', e.target.value)}
            error={errors.nombre}
            placeholder="Ej: Suplementos"
          />

          <Input
            label="Descripción *"
            value={formData.descripcion}
            onChange={(e) => handleInputChange('descripcion', e.target.value)}
            error={errors.descripcion}
            placeholder="Ej: Suplementos deportivos y nutricionales"
          />
        </div>

        {/* Personalización visual */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Palette size={20} className="mr-2" />
            Personalización Visual
          </h3>

          {/* Selector de icono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icono
            </label>
            <div className="grid grid-cols-5 gap-2">
              {iconosDisponibles.map((icono) => (
                <button
                  key={icono.nombre}
                  type="button"
                  onClick={() => handleInputChange('icono', icono.nombre)}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center hover:bg-gray-50 ${
                    formData.icono === icono.nombre
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <Package size={20} />
                  <span className="text-xs mt-1">{icono.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selector de color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {coloresDisponibles.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleInputChange('color', color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color
                      ? 'border-gray-400 scale-110'
                      : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Vista previa */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
            <div className="flex items-center">
              <div 
                className="p-2 rounded-lg mr-3"
                style={{ backgroundColor: `${formData.color}20` }}
              >
                <Package size={24} style={{ color: formData.color }} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {formData.nombre || 'Nombre de la categoría'}
                </h4>
                <p className="text-sm text-gray-600">
                  {formData.descripcion || 'Descripción de la categoría'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Estado */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.activa}
              onChange={(e) => handleInputChange('activa', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Categoría activa</span>
          </label>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          
          <Button type="submit" loading={loading}>
            {modo === 'crear' ? 'Crear Categoría' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};