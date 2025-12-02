import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { Producto, Categoria, ProductoFormData } from '../types';
import { 
  Package, 
  DollarSign, 
  Hash, 
  Tag, 
  Image, 
  Star,
  AlertCircle,
  Plus,
  X
} from 'lucide-react';

interface ProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  producto?: Producto | null;
  categorias: Categoria[];
  modo: 'crear' | 'editar' | 'ver';
  onGuardar: (datos: ProductoFormData) => Promise<void>;
}

export const ProductoModal: React.FC<ProductoModalProps> = ({
  isOpen,
  onClose,
  producto,
  categorias,
  modo,
  onGuardar
}) => {
  const [formData, setFormData] = useState<ProductoFormData>({
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: '',
    subcategoria: '',
    stock: 0,
    stockMinimo: 5,
    sku: '',
    imagenes: [],
    activo: true,
    destacado: false,
    proveedor: '',
    marca: '',
    unidadMedida: 'unidad',
    tags: [],
    especificaciones: {}
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [subcategorias, setSubcategorias] = useState<Categoria[]>([]);
  const [nuevoTag, setNuevoTag] = useState('');
  const [nuevaEspecificacion, setNuevaEspecificacion] = useState({ clave: '', valor: '' });

  // Inicializar formulario cuando cambia el producto
  useEffect(() => {
    if (producto && (modo === 'editar' || modo === 'ver')) {
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        categoria: producto.categoria,
        subcategoria: producto.subcategoria || '',
        stock: producto.stock,
        stockMinimo: producto.stockMinimo,
        sku: producto.sku,
        imagenes: [], // Las imágenes existentes se manejan por separado
        activo: producto.activo,
        destacado: producto.destacado,
        proveedor: producto.proveedor || '',
        marca: producto.marca || '',
        unidadMedida: producto.unidadMedida,
        tags: [...producto.tags],
        especificaciones: { ...producto.especificaciones }
      });
    } else {
      // Resetear formulario para crear nuevo producto
      setFormData({
        nombre: '',
        descripcion: '',
        precio: 0,
        categoria: '',
        subcategoria: '',
        stock: 0,
        stockMinimo: 5,
        sku: '',
        imagenes: [],
        activo: true,
        destacado: false,
        proveedor: '',
        marca: '',
        unidadMedida: 'unidad',
        tags: [],
        especificaciones: {}
      });
    }
    setErrors({});
  }, [producto, modo, isOpen]);

  // Actualizar subcategorías cuando cambia la categoría
  useEffect(() => {
    if (formData.categoria) {
      const categoriaSeleccionada = categorias.find(c => c.id === formData.categoria);
      setSubcategorias(categoriaSeleccionada?.subcategorias || []);
    } else {
      setSubcategorias([]);
      setFormData(prev => ({ ...prev, subcategoria: '' }));
    }
  }, [formData.categoria, categorias]);

  const handleInputChange = (campo: keyof ProductoFormData, valor: any) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[campo]) {
      setErrors(prev => ({ ...prev, [campo]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, imagenes: files }));
  };

  const agregarTag = () => {
    if (nuevoTag.trim() && !formData.tags.includes(nuevoTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, nuevoTag.trim()]
      }));
      setNuevoTag('');
    }
  };

  const eliminarTag = (tagAEliminar: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagAEliminar)
    }));
  };

  const agregarEspecificacion = () => {
    if (nuevaEspecificacion.clave.trim() && nuevaEspecificacion.valor.trim()) {
      setFormData(prev => ({
        ...prev,
        especificaciones: {
          ...prev.especificaciones,
          [nuevaEspecificacion.clave.trim()]: nuevaEspecificacion.valor.trim()
        }
      }));
      setNuevaEspecificacion({ clave: '', valor: '' });
    }
  };

  const eliminarEspecificacion = (clave: string) => {
    setFormData(prev => {
      const nuevasEspecificaciones = { ...prev.especificaciones };
      delete nuevasEspecificaciones[clave];
      return {
        ...prev,
        especificaciones: nuevasEspecificaciones
      };
    });
  };

  const validarFormulario = (): boolean => {
    const nuevosErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      nuevosErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.descripcion.trim()) {
      nuevosErrors.descripcion = 'La descripción es obligatoria';
    }

    if (formData.precio <= 0) {
      nuevosErrors.precio = 'El precio debe ser mayor a 0';
    }

    if (!formData.categoria) {
      nuevosErrors.categoria = 'La categoría es obligatoria';
    }

    if (!formData.sku.trim()) {
      nuevosErrors.sku = 'El SKU es obligatorio';
    }

    if (formData.stock < 0) {
      nuevosErrors.stock = 'El stock no puede ser negativo';
    }

    if (formData.stockMinimo < 0) {
      nuevosErrors.stockMinimo = 'El stock mínimo no puede ser negativo';
    }

    setErrors(nuevosErrors);
    return Object.keys(nuevosErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modo === 'ver') return;

    if (!validarFormulario()) return;

    try {
      setLoading(true);
      await onGuardar(formData);
    } catch (error) {
      console.error('Error al guardar producto:', error);
    } finally {
      setLoading(false);
    }
  };

  const opcionesCategoria = categorias.map(categoria => ({
    value: categoria.id,
    label: categoria.nombre
  }));

  const opcionesSubcategoria = subcategorias.map(subcategoria => ({
    value: subcategoria.id,
    label: subcategoria.nombre
  }));

  const opcionesUnidadMedida = [
    { value: 'unidad', label: 'Unidad' },
    { value: 'kg', label: 'Kilogramo' },
    { value: 'gramo', label: 'Gramo' },
    { value: 'litro', label: 'Litro' },
    { value: 'ml', label: 'Mililitro' }
  ];

  const titulo = modo === 'crear' ? 'Nuevo Producto' : 
                 modo === 'editar' ? 'Editar Producto' : 
                 'Ver Producto';

  const soloLectura = modo === 'ver';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={titulo}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Package size={20} className="mr-2" />
            Información Básica
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre del producto *"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              error={errors.nombre}
              disabled={soloLectura}
              placeholder="Ej: Whey Protein Isolate"
            />

            <Input
              label="SKU *"
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
              error={errors.sku}
              disabled={soloLectura}
              placeholder="Ej: SUP-WPI-001"
              leftIcon={<Hash size={16} />}
            />
          </div>

          <Textarea
            label="Descripción *"
            value={formData.descripcion}
            onChange={(e) => handleInputChange('descripcion', e.target.value)}
            error={errors.descripcion}
            disabled={soloLectura}
            placeholder="Describe las características y beneficios del producto..."
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Marca"
              value={formData.marca}
              onChange={(e) => handleInputChange('marca', e.target.value)}
              disabled={soloLectura}
              placeholder="Ej: ProFit"
            />

            <Input
              label="Proveedor"
              value={formData.proveedor}
              onChange={(e) => handleInputChange('proveedor', e.target.value)}
              disabled={soloLectura}
              placeholder="Ej: NutriSport"
            />
          </div>
        </div>

        {/* Categorización */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Tag size={20} className="mr-2" />
            Categorización
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                label="Categoría *"
                options={opcionesCategoria}
                value={formData.categoria}
                onChange={(value) => handleInputChange('categoria', value)}
                error={errors.categoria}
                disabled={soloLectura}
                placeholder="Seleccionar categoría"
              />
            </div>

            {subcategorias.length > 0 && (
              <div>
                <Select
                  label="Subcategoría"
                  options={opcionesSubcategoria}
                  value={formData.subcategoria}
                  onChange={(value) => handleInputChange('subcategoria', value)}
                  disabled={soloLectura}
                  placeholder="Seleccionar subcategoría"
                />
              </div>
            )}
          </div>
        </div>

        {/* Precio e inventario */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <DollarSign size={20} className="mr-2" />
            Precio e Inventario
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Precio *"
              type="number"
              value={formData.precio.toString()}
              onChange={(e) => handleInputChange('precio', parseFloat(e.target.value) || 0)}
              error={errors.precio}
              disabled={soloLectura}
              placeholder="0.00"
              min="0"
              step="0.01"
              leftIcon={<DollarSign size={16} />}
            />

            <Input
              label="Stock actual"
              type="number"
              value={formData.stock.toString()}
              onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
              error={errors.stock}
              disabled={soloLectura}
              placeholder="0"
              min="0"
            />

            <Input
              label="Stock mínimo"
              type="number"
              value={formData.stockMinimo.toString()}
              onChange={(e) => handleInputChange('stockMinimo', parseInt(e.target.value) || 0)}
              error={errors.stockMinimo}
              disabled={soloLectura}
              placeholder="5"
              min="0"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Unidad de medida"
              options={opcionesUnidadMedida}
              value={formData.unidadMedida}
              onChange={(value) => handleInputChange('unidadMedida', value)}
              disabled={soloLectura}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
          
          {!soloLectura && (
            <div className="flex gap-2">
              <Input
                placeholder="Agregar tag..."
                value={nuevoTag}
                onChange={(e) => setNuevoTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarTag())}
              />
              <Button type="button" onClick={agregarTag} variant="secondary">
                <Plus size={16} />
              </Button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {tag}
                {!soloLectura && (
                  <button
                    type="button"
                    onClick={() => eliminarTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X size={14} />
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Especificaciones */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Especificaciones</h3>
          
          {!soloLectura && (
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Clave (ej: Sabor)"
                value={nuevaEspecificacion.clave}
                onChange={(e) => setNuevaEspecificacion(prev => ({ ...prev, clave: e.target.value }))}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Valor (ej: Vainilla)"
                  value={nuevaEspecificacion.valor}
                  onChange={(e) => setNuevaEspecificacion(prev => ({ ...prev, valor: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarEspecificacion())}
                />
                <Button type="button" onClick={agregarEspecificacion} variant="secondary">
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {Object.entries(formData.especificaciones || {}).map(([clave, valor]) => (
              <div key={clave} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">{clave}:</span>
                  <span className="ml-2 text-gray-700">{valor}</span>
                </div>
                {!soloLectura && (
                  <button
                    type="button"
                    onClick={() => eliminarEspecificacion(clave)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Imágenes */}
        {!soloLectura && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Image size={20} className="mr-2" />
              Imágenes
            </h3>
            
            <div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-sm text-gray-500 mt-1">
                Selecciona una o más imágenes del producto (JPG, PNG, WebP)
              </p>
            </div>
          </div>
        )}

        {/* Estados */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Estado</h3>
          
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.activo}
                onChange={(e) => handleInputChange('activo', e.target.checked)}
                disabled={soloLectura}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Producto activo</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.destacado}
                onChange={(e) => handleInputChange('destacado', e.target.checked)}
                disabled={soloLectura}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700 flex items-center">
                <Star size={16} className="mr-1" />
                Producto destacado
              </span>
            </label>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="secondary" onClick={onClose}>
            {modo === 'ver' ? 'Cerrar' : 'Cancelar'}
          </Button>
          
          {modo !== 'ver' && (
            <Button type="submit" loading={loading}>
              {modo === 'crear' ? 'Crear Producto' : 'Guardar Cambios'}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};