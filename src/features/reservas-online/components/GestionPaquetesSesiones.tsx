import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, TableWithActions } from '../../../components/componentsreutilizables';
import { PaqueteSesiones } from '../types';
import {
  getPaquetesSesiones,
  crearPaqueteSesiones,
  actualizarPaqueteSesiones,
  eliminarPaqueteSesiones,
} from '../api/paquetesSesiones';
import { Plus, Package, Edit, Trash2, Save, X, Percent, Calendar, Users } from 'lucide-react';

interface GestionPaquetesSesionesProps {
  entrenadorId: string;
}

export const GestionPaquetesSesiones: React.FC<GestionPaquetesSesionesProps> = ({
  entrenadorId,
}) => {
  const [paquetes, setPaquetes] = useState<PaqueteSesiones[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPaquete, setEditingPaquete] = useState<PaqueteSesiones | null>(null);
  
  // Form state
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [numeroSesiones, setNumeroSesiones] = useState<number>(5);
  const [precioPorSesion, setPrecioPorSesion] = useState<number>(50);
  const [validezMeses, setValidezMeses] = useState<number>(3);
  const [tipoSesion, setTipoSesion] = useState<'presencial' | 'videollamada' | 'ambos'>('ambos');
  const [tipoEntrenamiento, setTipoEntrenamiento] = useState<'sesion-1-1' | 'fisio' | 'nutricion' | 'masaje' | 'todos'>('sesion-1-1');
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    cargarPaquetes();
  }, [entrenadorId]);

  const cargarPaquetes = async () => {
    setLoading(true);
    try {
      const datos = await getPaquetesSesiones(entrenadorId);
      setPaquetes(datos);
    } catch (error) {
      console.error('Error cargando paquetes:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularPrecioTotal = () => {
    const precioSinDescuento = numeroSesiones * precioPorSesion;
    // Calcular descuento basado en número de sesiones
    let descuento = 0;
    if (numeroSesiones >= 20) {
      descuento = 20;
    } else if (numeroSesiones >= 10) {
      descuento = 15;
    } else if (numeroSesiones >= 5) {
      descuento = 10;
    }
    const precioConDescuento = precioSinDescuento * (1 - descuento / 100);
    return { precioTotal: precioConDescuento, descuento };
  };

  const resetForm = () => {
    setNombre('');
    setDescripcion('');
    setNumeroSesiones(5);
    setPrecioPorSesion(50);
    setValidezMeses(3);
    setTipoSesion('ambos');
    setTipoEntrenamiento('sesion-1-1');
    setActivo(true);
    setEditingPaquete(null);
    setShowForm(false);
  };

  const handleEdit = (paquete: PaqueteSesiones) => {
    setEditingPaquete(paquete);
    setNombre(paquete.nombre);
    setDescripcion(paquete.descripcion || '');
    setNumeroSesiones(paquete.numeroSesiones);
    setPrecioPorSesion(paquete.precioPorSesion);
    setValidezMeses(paquete.validezMeses);
    setTipoSesion(paquete.tipoSesion || 'ambos');
    setTipoEntrenamiento(paquete.tipoEntrenamiento || 'sesion-1-1');
    setActivo(paquete.activo);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!nombre.trim() || numeroSesiones <= 0 || precioPorSesion <= 0) {
      alert('Por favor, completa todos los campos requeridos');
      return;
    }

    const { precioTotal, descuento } = calcularPrecioTotal();

    try {
      if (editingPaquete) {
        await actualizarPaqueteSesiones(entrenadorId, editingPaquete.id, {
          nombre,
          descripcion: descripcion || undefined,
          numeroSesiones,
          precioTotal,
          precioPorSesion,
          descuento,
          validezMeses,
          tipoSesion,
          tipoEntrenamiento,
          activo,
        });
      } else {
        await crearPaqueteSesiones(entrenadorId, {
          nombre,
          descripcion: descripcion || undefined,
          numeroSesiones,
          precioTotal,
          precioPorSesion,
          descuento,
          validezMeses,
          tipoSesion,
          tipoEntrenamiento,
          activo,
        });
      }
      resetForm();
      cargarPaquetes();
    } catch (error) {
      console.error('Error guardando paquete:', error);
      alert('Error al guardar el paquete');
    }
  };

  const handleDelete = async (paqueteId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este paquete?')) {
      try {
        await eliminarPaqueteSesiones(entrenadorId, paqueteId);
        cargarPaquetes();
      } catch (error) {
        console.error('Error eliminando paquete:', error);
        alert('Error al eliminar el paquete');
      }
    }
  };

  const { precioTotal, descuento } = calcularPrecioTotal();

  const columns = [
    {
      key: 'nombre',
      label: 'Nombre',
      render: (paquete: PaqueteSesiones) => (
        <div>
          <div className="font-medium text-gray-900">{paquete.nombre}</div>
          {paquete.descripcion && (
            <div className="text-sm text-gray-500">{paquete.descripcion}</div>
          )}
        </div>
      ),
    },
    {
      key: 'sesiones',
      label: 'Sesiones',
      render: (paquete: PaqueteSesiones) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{paquete.numeroSesiones}</span>
        </div>
      ),
    },
    {
      key: 'precio',
      label: 'Precio',
      render: (paquete: PaqueteSesiones) => (
        <div>
          <div className="font-medium text-gray-900">€{paquete.precioTotal.toFixed(2)}</div>
          <div className="text-sm text-gray-500">
            €{paquete.precioPorSesion.toFixed(2)}/sesión
          </div>
        </div>
      ),
    },
    {
      key: 'descuento',
      label: 'Descuento',
      render: (paquete: PaqueteSesiones) => (
        <div className="flex items-center gap-1 text-green-600">
          <Percent className="w-4 h-4" />
          <span className="font-medium">{paquete.descuento}%</span>
        </div>
      ),
    },
    {
      key: 'validez',
      label: 'Validez',
      render: (paquete: PaqueteSesiones) => (
        <div className="flex items-center gap-1 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{paquete.validezMeses} meses</span>
        </div>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (paquete: PaqueteSesiones) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            paquete.activo
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {paquete.activo ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: 'Editar',
      onClick: (paquete: PaqueteSesiones) => handleEdit(paquete),
      variant: 'secondary' as const,
    },
    {
      label: 'Eliminar',
      onClick: (paquete: PaqueteSesiones) => handleDelete(paquete.id),
      variant: 'destructive' as const,
    },
  ];

  if (loading) {
    return (
      <Card>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando paquetes...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Paquetes de Sesiones</h2>
          <p className="text-gray-600 mt-1">
            Crea paquetes de múltiples sesiones con precio especial para fidelizar clientes
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo Paquete</span>
        </Button>
      </div>

      {/* Formulario */}
      {showForm && (
        <Card>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingPaquete ? 'Editar Paquete' : 'Nuevo Paquete'}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre del Paquete"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Paquete Básico 5 Sesiones"
                required
              />

              <Input
                label="Descripción (opcional)"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción del paquete"
              />

              <Input
                label="Número de Sesiones"
                type="number"
                value={numeroSesiones.toString()}
                onChange={(e) => setNumeroSesiones(parseInt(e.target.value) || 0)}
                min="1"
                required
              />

              <Input
                label="Precio por Sesión (€)"
                type="number"
                value={precioPorSesion.toString()}
                onChange={(e) => setPrecioPorSesion(parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                required
              />

              <Input
                label="Validez (meses)"
                type="number"
                value={validezMeses.toString()}
                onChange={(e) => setValidezMeses(parseInt(e.target.value) || 0)}
                min="1"
                required
              />

              <Select
                label="Tipo de Sesión"
                value={tipoSesion}
                onChange={(value) => setTipoSesion(value as any)}
                options={[
                  { value: 'ambos', label: 'Presencial y Videollamada' },
                  { value: 'presencial', label: 'Solo Presencial' },
                  { value: 'videollamada', label: 'Solo Videollamada' },
                ]}
              />

              <Select
                label="Tipo de Entrenamiento"
                value={tipoEntrenamiento}
                onChange={(value) => setTipoEntrenamiento(value as any)}
                options={[
                  { value: 'sesion-1-1', label: 'Sesión 1 a 1' },
                  { value: 'fisio', label: 'Fisioterapia' },
                  { value: 'nutricion', label: 'Nutrición' },
                  { value: 'masaje', label: 'Masaje' },
                  { value: 'todos', label: 'Todos los tipos' },
                ]}
              />
            </div>

            {/* Resumen de precio */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Precio sin descuento:</span>
                <span className="text-sm text-gray-600">
                  €{(numeroSesiones * precioPorSesion).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Descuento ({descuento}%):</span>
                <span className="text-sm text-green-600">
                  -€{((numeroSesiones * precioPorSesion) * (descuento / 100)).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-blue-200">
                <span className="text-base font-bold text-gray-900">Precio Total:</span>
                <span className="text-xl font-bold text-blue-600">€{precioTotal.toFixed(2)}</span>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Ahorro por sesión: €{(precioPorSesion - precioTotal / numeroSesiones).toFixed(2)}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={activo}
                  onChange={(e) => setActivo(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Paquete activo</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={resetForm}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                <Save className="w-4 h-4 mr-2" />
                {editingPaquete ? 'Actualizar' : 'Crear'} Paquete
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Lista de paquetes */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Paquetes Disponibles</h3>
          </div>
          {paquetes.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay paquetes creados aún</p>
              <Button
                variant="primary"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Paquete
              </Button>
            </div>
          ) : (
            <TableWithActions
              data={paquetes}
              columns={columns}
              actions={actions}
              emptyMessage="No hay paquetes disponibles"
            />
          )}
        </div>
      </Card>
    </div>
  );
};


