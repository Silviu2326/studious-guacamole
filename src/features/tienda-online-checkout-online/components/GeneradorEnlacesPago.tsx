import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Table, Badge, Modal } from '../../../components/componentsreutilizables';
import { EnlacePagoDirecto, Producto, OpcionesSeleccionadas } from '../types';
import { crearEnlacePago, getEnlacesPagoEntrenador, desactivarEnlacePago, eliminarEnlacePago } from '../api/enlacesPago';
import { getProductos } from '../api/productos';
import { Link2, Copy, Check, Trash2, Eye, EyeOff, Plus, Calendar, Users, ExternalLink } from 'lucide-react';

interface GeneradorEnlacesPagoProps {
  entrenadorId: string;
  rol: 'entrenador' | 'gimnasio';
}

export const GeneradorEnlacesPago: React.FC<GeneradorEnlacesPagoProps> = ({
  entrenadorId,
  rol,
}) => {
  const [enlaces, setEnlaces] = useState<EnlacePagoDirecto[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [copiado, setCopiado] = useState<string | null>(null);
  
  // Formulario para nuevo enlace
  const [productoSeleccionado, setProductoSeleccionado] = useState<string>('');
  const [importe, setImporte] = useState<string>('');
  const [cantidad, setCantidad] = useState<number>(1);
  const [descripcion, setDescripcion] = useState<string>('');
  const [fechaExpiracion, setFechaExpiracion] = useState<string>('');
  const [vecesMaximas, setVecesMaximas] = useState<number | undefined>(undefined);
  const [creando, setCreando] = useState(false);
  const [enlaceGenerado, setEnlaceGenerado] = useState<EnlacePagoDirecto | null>(null);

  useEffect(() => {
    cargarEnlaces();
    cargarProductos();
  }, [entrenadorId]);

  const cargarEnlaces = async () => {
    setCargando(true);
    try {
      const data = await getEnlacesPagoEntrenador(entrenadorId);
      setEnlaces(data);
    } catch (error) {
      console.error('Error cargando enlaces:', error);
    } finally {
      setCargando(false);
    }
  };

  const cargarProductos = async () => {
    try {
      const data = await getProductos(rol);
      setProductos(data.filter((p) => p.disponible));
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const handleCrearEnlace = async () => {
    if (!productoSeleccionado && !importe) {
      alert('Debes seleccionar un producto o especificar un importe');
      return;
    }

    setCreando(true);
    try {
      const fechaExp = fechaExpiracion ? new Date(fechaExpiracion) : undefined;
      
      // Si no hay producto seleccionado pero hay importe, necesitamos crear un producto temporal
      // Por ahora, requerimos producto, pero permitimos modificar el importe
      if (!productoSeleccionado) {
        alert('Por favor, selecciona un producto o servicio');
        setCreando(false);
        return;
      }

      const nuevoEnlace = await crearEnlacePago(entrenadorId, productoSeleccionado, {
        cantidad: cantidad > 0 ? cantidad : undefined,
        descripcion: descripcion.trim() || undefined,
        fechaExpiracion: fechaExp,
        vecesMaximas: vecesMaximas && vecesMaximas > 0 ? vecesMaximas : undefined,
      });

      setEnlaces([nuevoEnlace, ...enlaces]);
      setEnlaceGenerado(nuevoEnlace);
      setMostrarModal(false);
      // Resetear formulario
      setProductoSeleccionado('');
      setImporte('');
      setCantidad(1);
      setDescripcion('');
      setFechaExpiracion('');
      setVecesMaximas(undefined);
    } catch (error) {
      console.error('Error creando enlace:', error);
      alert('Error al crear el enlace de pago');
    } finally {
      setCreando(false);
    }
  };

  const handleCopiarEnlace = async (url: string, enlaceId: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(enlaceId);
      setTimeout(() => setCopiado(null), 2000);
    } catch (error) {
      console.error('Error copiando enlace:', error);
    }
  };

  const handleDesactivarEnlace = async (enlaceId: string) => {
    try {
      await desactivarEnlacePago(enlaceId);
      setEnlaces(enlaces.map((e) => (e.id === enlaceId ? { ...e, activo: false } : e)));
    } catch (error) {
      console.error('Error desactivando enlace:', error);
    }
  };

  const handleEliminarEnlace = async (enlaceId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este enlace?')) {
      return;
    }

    try {
      await eliminarEnlacePago(enlaceId);
      setEnlaces(enlaces.filter((e) => e.id !== enlaceId));
    } catch (error) {
      console.error('Error eliminando enlace:', error);
    }
  };

  const formatoFecha = (fecha: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(fecha));
  };

  const productoSeleccionadoObj = productos.find((p) => p.id === productoSeleccionado);

  const columnas = [
    {
      key: 'producto',
      label: 'Producto',
      render: (_: any, enlace: EnlacePagoDirecto) => (
        <div>
          <p className="font-medium text-gray-900">{enlace.producto.nombre}</p>
          {enlace.descripcion && (
            <p className="text-xs text-gray-600 mt-1">{enlace.descripcion}</p>
          )}
        </div>
      ),
    },
    {
      key: 'url',
      label: 'Enlace',
      render: (_: any, enlace: EnlacePagoDirecto) => (
        <div className="flex items-center gap-2">
          <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 max-w-xs truncate">
            {enlace.url}
          </code>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopiarEnlace(enlace.url, enlace.id)}
            title="Copiar enlace"
          >
            {copiado === enlace.id ? (
              <Check size={16} className="text-green-600" />
            ) : (
              <Copy size={16} />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(enlace.url, '_blank')}
            title="Abrir enlace"
          >
            <ExternalLink size={16} />
          </Button>
        </div>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_: any, enlace: EnlacePagoDirecto) => {
        const estaExpirado = enlace.fechaExpiracion && new Date() > enlace.fechaExpiracion;
        const limiteAlcanzado = enlace.vecesMaximas && enlace.vecesUsado >= enlace.vecesMaximas;
        
        if (!enlace.activo || estaExpirado || limiteAlcanzado) {
          return <Badge variant="error">Inactivo</Badge>;
        }
        return <Badge variant="success">Activo</Badge>;
      },
    },
    {
      key: 'uso',
      label: 'Uso',
      render: (_: any, enlace: EnlacePagoDirecto) => (
        <div className="text-sm">
          <div className="flex items-center gap-1">
            <Users size={14} className="text-gray-400" />
            <span className="text-gray-900">{enlace.vecesUsado}</span>
            {enlace.vecesMaximas && (
              <span className="text-gray-500">/ {enlace.vecesMaximas}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'fechaCreacion',
      label: 'Creado',
      render: (fecha: Date) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Calendar size={14} />
          <span>{formatoFecha(fecha)}</span>
        </div>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, enlace: EnlacePagoDirecto) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDesactivarEnlace(enlace.id)}
            title={enlace.activo ? 'Desactivar' : 'Activar'}
          >
            {enlace.activo ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEliminarEnlace(enlace.id)}
            title="Eliminar"
          >
            <Trash2 size={16} className="text-red-600" />
          </Button>
        </div>
      ),
      align: 'right' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Enlaces de Pago Directo</h2>
          <p className="text-gray-600 mt-1">
            Genera enlaces de pago directo para servicios específicos y compártelos con tus clientes
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setMostrarModal(true)}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          Crear Enlace
        </Button>
      </div>

      {/* Mostrar enlace generado */}
      {enlaceGenerado && (
        <Card className="p-6 bg-green-50 border-2 border-green-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                ✓ Enlace de pago generado exitosamente
              </h3>
              <p className="text-sm text-green-700 mb-4">
                Comparte este enlace con tus clientes para que puedan realizar el pago directamente.
              </p>
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-green-200">
                <code className="flex-1 text-sm font-mono text-gray-900 break-all">
                  {enlaceGenerado.url}
                </code>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleCopiarEnlace(enlaceGenerado.url, enlaceGenerado.id)}
                >
                  {copiado === enlaceGenerado.id ? (
                    <>
                      <Check size={16} className="mr-1" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="mr-1" />
                      Copiar
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open(enlaceGenerado.url, '_blank')}
                >
                  <ExternalLink size={16} className="mr-1" />
                  Abrir
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEnlaceGenerado(null)}
            >
              ✕
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-0 bg-white shadow-sm">
        <Table
          data={enlaces}
          columns={columnas}
          loading={cargando}
          emptyMessage="No hay enlaces de pago creados. Crea uno para empezar."
        />
      </Card>

      {/* Modal para crear nuevo enlace */}
      <Modal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        title="Crear Enlace de Pago Directo"
        size="lg"
      >
        <div className="space-y-4">
          <Select
            label="Producto/Servicio"
            options={productos.map((p) => ({
              value: p.id,
              label: `${p.nombre} - €${p.precio.toFixed(2)}`,
            }))}
            value={productoSeleccionado}
            onChange={(e) => setProductoSeleccionado(e.target.value)}
            placeholder="Selecciona un producto o servicio"
            required
          />

          {productoSeleccionadoObj && (
            <Card className="p-4 bg-gray-50">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">
                  {productoSeleccionadoObj.nombre}
                </p>
                <p className="text-xs text-gray-600">
                  {productoSeleccionadoObj.descripcion}
                </p>
                <p className="text-lg font-semibold text-blue-600">
                  €{productoSeleccionadoObj.precio.toFixed(2)}
                </p>
              </div>
            </Card>
          )}

          <Input
            label="Importe personalizado (€) - Opcional"
            type="number"
            step="0.01"
            min="0"
            value={importe}
            onChange={(e) => setImporte(e.target.value)}
            helperText="Si especificas un importe, se usará este en lugar del precio del producto"
            placeholder="Ej: 50.00"
          />

          <Input
            label="Cantidad por defecto"
            type="number"
            min="1"
            value={cantidad.toString()}
            onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
            helperText="Cantidad que se agregará automáticamente al carrito (opcional)"
          />

          <Input
            label="Descripción del enlace (opcional)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej: Pago para sesión de entrenamiento personal"
            helperText="Descripción que aparecerá en el enlace para identificarlo fácilmente"
          />

          <Input
            label="Fecha de expiración (opcional)"
            type="datetime-local"
            value={fechaExpiracion}
            onChange={(e) => setFechaExpiracion(e.target.value)}
            helperText="Fecha límite para usar este enlace"
          />

          <Input
            label="Límite de usos (opcional)"
            type="number"
            min="1"
            value={vecesMaximas?.toString() || ''}
            onChange={(e) => setVecesMaximas(e.target.value ? parseInt(e.target.value) : undefined)}
            helperText="Número máximo de veces que se puede usar este enlace"
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setMostrarModal(false)}
              disabled={creando}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleCrearEnlace}
              loading={creando}
              disabled={!productoSeleccionado && !importe}
              fullWidth
            >
              <Link2 size={16} className="mr-2" />
              Crear Enlace
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

