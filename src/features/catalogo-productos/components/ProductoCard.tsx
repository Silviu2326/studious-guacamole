import React from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { Producto, Categoria } from '../types';
import { 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  AlertTriangle, 
  Package, 
  Tag,
  Star,
  StarOff
} from 'lucide-react';

interface ProductoCardProps {
  producto: Producto;
  categoria?: Categoria;
  onEditar: (producto: Producto) => void;
  onEliminar: (producto: Producto) => void;
  onDuplicar: (producto: Producto) => void;
  onVer: (producto: Producto) => void;
  onToggleDestacado?: (producto: Producto) => void;
}

export const ProductoCard: React.FC<ProductoCardProps> = ({
  producto,
  categoria,
  onEditar,
  onEliminar,
  onDuplicar,
  onVer,
  onToggleDestacado
}) => {
  const stockBajo = producto.stock <= producto.stockMinimo;
  const sinStock = producto.stock === 0;

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(precio);
  };

  const getEstadoStock = () => {
    if (sinStock) return { texto: 'Sin stock', color: 'text-red-600', bg: 'bg-red-100' };
    if (stockBajo) return { texto: 'Stock bajo', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { texto: 'En stock', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const estadoStock = getEstadoStock();

  return (
    <Card variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden">
      {/* Imagen del producto */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {producto.imagenes.length > 0 ? (
          <img
            src={producto.imagenes[0]}
            alt={producto.nombre}
            className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-[1.03]"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-product.svg';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Package size={48} />
          </div>
        )}
        
        {/* Badges superiores */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {producto.destacado && (
            <Badge variant="yellow" leftIcon={<Star size={12} />}>Destacado</Badge>
          )}
          {!producto.activo && (
            <Badge variant="gray">Inactivo</Badge>
          )}
        </div>

        {/* Estado de stock */}
        <div className="absolute top-2 right-2">
          <Badge
            variant={sinStock ? 'red' : stockBajo ? 'yellow' : 'green'}
            leftIcon={sinStock ? <AlertTriangle size={12} /> : undefined}
          >
            {estadoStock.texto}
          </Badge>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Categoría */}
        {categoria && (
          <div className="flex items-center mb-2">
            <Tag size={14} className="text-gray-400 mr-1" />
            <span className="text-sm text-gray-600">{categoria.nombre}</span>
          </div>
        )}

        {/* Nombre y descripción */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {producto.nombre}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
          {producto.descripcion}
        </p>

        {/* Información del producto */}
        <div className="space-y-2 mb-4">
          {/* SKU */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">SKU:</span>
            <span className="font-mono text-gray-900">{producto.sku}</span>
          </div>

          {/* Stock */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Stock:</span>
            <span className={`font-semibold ${estadoStock.color}`}>
              {producto.stock} {producto.unidadMedida}
            </span>
          </div>

          {/* Marca */}
          {producto.marca && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Marca:</span>
              <span className="text-gray-900">{producto.marca}</span>
            </div>
          )}
        </div>

        {/* Precio */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {formatearPrecio(producto.precio)}
            </span>
            {producto.precioOriginal && producto.precioOriginal > producto.precio && (
              <span className="text-sm text-gray-500 line-through">
                {formatearPrecio(producto.precioOriginal)}
              </span>
            )}
          </div>
          {producto.descuento && (
            <span className="text-sm text-green-600 font-medium">
              {producto.descuento}% de descuento
            </span>
          )}
        </div>

        {/* Tags */}
        {producto.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {producto.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {producto.tags.length > 3 && (
                <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                  +{producto.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onVer(producto)}
            className="flex-1"
          >
            <Eye size={16} className="mr-1" />
            Ver
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditar(producto)}
            className="flex-1"
          >
            <Edit size={16} className="mr-1" />
            Editar
          </Button>

          <div className="flex gap-1">
            {onToggleDestacado && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleDestacado(producto)}
                className="p-2"
              >
                {producto.destacado ? (
                  <Star size={16} className="text-yellow-500" />
                ) : (
                  <StarOff size={16} className="text-gray-400" />
                )}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDuplicar(producto)}
              className="p-2"
            >
              <Copy size={16} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEliminar(producto)}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};