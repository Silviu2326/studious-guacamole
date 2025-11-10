import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Input } from '../../../components/componentsreutilizables/Input';
import { Clock, Plus, Trash2, Save, AlertCircle, CheckCircle, MoveUp, MoveDown } from 'lucide-react';
import {
  getDuracionesSesion,
  guardarDuracionesSesion,
  DuracionSesion,
  DURACIONES_PREDEFINIDAS,
} from '../api/duracionesSesion';

interface ConfiguracionDuracionesSesionProps {
  entrenadorId: string;
}

export const ConfiguracionDuracionesSesion: React.FC<ConfiguracionDuracionesSesionProps> = ({
  entrenadorId,
}) => {
  const [duraciones, setDuraciones] = useState<DuracionSesion[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaDuracion, setNuevaDuracion] = useState({
    duracionMinutos: 60,
    nombre: '',
    descripcion: '',
    precio: 50,
    activo: true,
  });

  useEffect(() => {
    cargarDuraciones();
  }, [entrenadorId]);

  const cargarDuraciones = async () => {
    setLoading(true);
    try {
      const duracionesData = await getDuracionesSesion(entrenadorId);
      setDuraciones(duracionesData.sort((a, b) => a.orden - b.orden));
    } catch (error) {
      console.error('Error cargando duraciones de sesión:', error);
      setError('Error al cargar las duraciones de sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async () => {
    setGuardando(true);
    setError(null);

    try {
      await guardarDuracionesSesion(entrenadorId, duraciones);
      setMensajeExito('Duraciones guardadas correctamente');
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (error) {
      console.error('Error guardando duraciones:', error);
      setError('Error al guardar las duraciones');
    } finally {
      setGuardando(false);
    }
  };

  const handleAgregarDuracion = () => {
    if (!nuevaDuracion.nombre.trim() || nuevaDuracion.duracionMinutos <= 0) {
      setError('Por favor, completa todos los campos requeridos');
      return;
    }

    const maxOrden = duraciones.length > 0 ? Math.max(...duraciones.map(d => d.orden)) : 0;
    const nueva: DuracionSesion = {
      id: `duracion-${Date.now()}`,
      entrenadorId,
      ...nuevaDuracion,
      orden: maxOrden + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setDuraciones([...duraciones, nueva].sort((a, b) => a.orden - b.orden));
    setNuevaDuracion({
      duracionMinutos: 60,
      nombre: '',
      descripcion: '',
      precio: 50,
      activo: true,
    });
    setMostrarFormulario(false);
    setError(null);
  };

  const handleEliminarDuracion = (id: string) => {
    setDuraciones(duraciones.filter(d => d.id !== id).map((d, index) => ({ ...d, orden: index + 1 })));
  };

  const handleToggleActivo = (id: string) => {
    setDuraciones(duraciones.map(d => (d.id === id ? { ...d, activo: !d.activo } : d)));
  };

  const handleActualizarDuracion = (id: string, campo: keyof DuracionSesion, valor: any) => {
    setDuraciones(duraciones.map(d => (d.id === id ? { ...d, [campo]: valor } : d)));
  };

  const handleMoverOrden = (id: string, direccion: 'up' | 'down') => {
    const index = duraciones.findIndex(d => d.id === id);
    if (index === -1) return;

    const nuevoIndex = direccion === 'up' ? index - 1 : index + 1;
    if (nuevoIndex < 0 || nuevoIndex >= duraciones.length) return;

    const nuevasDuraciones = [...duraciones];
    [nuevasDuraciones[index], nuevasDuraciones[nuevoIndex]] = [
      nuevasDuraciones[nuevoIndex],
      nuevasDuraciones[index],
    ];

    // Actualizar orden
    nuevasDuraciones.forEach((d, i) => {
      d.orden = i + 1;
    });

    setDuraciones(nuevasDuraciones);
  };

  const handleUsarPredefinidas = () => {
    const duracionesPredefinidas: DuracionSesion[] = DURACIONES_PREDEFINIDAS.map((d, index) => ({
      ...d,
      id: `duracion-${entrenadorId}-${index}`,
      entrenadorId,
      orden: index + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    setDuraciones(duracionesPredefinidas);
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando duraciones de sesión...</p>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">Duraciones de Sesión</h3>
              <p className="text-sm text-gray-600 mt-1">
                Configura diferentes duraciones de sesión para ofrecer flexibilidad según el tipo de entrenamiento
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {duraciones.length === 0 && (
              <Button
                variant="secondary"
                onClick={handleUsarPredefinidas}
                size="sm"
              >
                Usar Predefinidas
              </Button>
            )}
            <Button
              variant="primary"
              onClick={handleGuardar}
              disabled={guardando}
              loading={guardando}
              iconLeft={Save}
            >
              Guardar
            </Button>
          </div>
        </div>

        {mensajeExito && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-800">{mensajeExito}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {mostrarFormulario && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Agregar Duración</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombre"
                value={nuevaDuracion.nombre}
                onChange={(e) => setNuevaDuracion({ ...nuevaDuracion, nombre: e.target.value })}
                placeholder="Ej: 1 hora"
                required
              />
              <Input
                label="Duración (minutos)"
                type="number"
                value={nuevaDuracion.duracionMinutos.toString()}
                onChange={(e) =>
                  setNuevaDuracion({ ...nuevaDuracion, duracionMinutos: parseInt(e.target.value) || 0 })
                }
                min="15"
                step="15"
                required
              />
              <Input
                label="Descripción (opcional)"
                value={nuevaDuracion.descripcion}
                onChange={(e) => setNuevaDuracion({ ...nuevaDuracion, descripcion: e.target.value })}
                placeholder="Ej: Sesión completa"
              />
              <Input
                label="Precio (€)"
                type="number"
                value={nuevaDuracion.precio?.toString() || ''}
                onChange={(e) =>
                  setNuevaDuracion({ ...nuevaDuracion, precio: parseFloat(e.target.value) || 0 })
                }
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="primary" onClick={handleAgregarDuracion}>
                Agregar
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setMostrarFormulario(false);
                  setError(null);
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {!mostrarFormulario && (
          <Button
            variant="secondary"
            onClick={() => setMostrarFormulario(true)}
            iconLeft={Plus}
            className="mb-4"
          >
            Agregar Duración
          </Button>
        )}

        {duraciones.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay duraciones configuradas</p>
            <p className="text-sm text-gray-500 mt-2">
              Agrega duraciones de sesión para ofrecer flexibilidad a tus clientes
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {duraciones.map((duracion, index) => (
              <div
                key={duracion.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMoverOrden(duracion.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mover arriba"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMoverOrden(duracion.id, 'down')}
                    disabled={index === duraciones.length - 1}
                    className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mover abajo"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={duracion.nombre}
                      onChange={(e) => handleActualizarDuracion(duracion.id, 'nombre', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Duración (min)</label>
                    <input
                      type="number"
                      value={duracion.duracionMinutos}
                      onChange={(e) =>
                        handleActualizarDuracion(duracion.id, 'duracionMinutos', parseInt(e.target.value) || 0)
                      }
                      min="15"
                      step="15"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Precio (€)</label>
                    <input
                      type="number"
                      value={duracion.precio || 0}
                      onChange={(e) =>
                        handleActualizarDuracion(duracion.id, 'precio', parseFloat(e.target.value) || 0)
                      }
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Estado</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={duracion.activo}
                        onChange={() => handleToggleActivo(duracion.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {duracion.activo ? 'Activa' : 'Inactiva'}
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={() => handleEliminarDuracion(duracion.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Eliminar duración"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};


