import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select } from '../../../components/componentsreutilizables';
import {
  getPlantillasSesion,
  guardarPlantillasSesion,
  crearPlantillaSesion,
  actualizarPlantillaSesion,
  eliminarPlantillaSesion,
  PlantillaSesion,
  PLANTILLAS_PREDEFINIDAS,
} from '../api/plantillasSesion';
import { Plus, Trash2, Save, AlertCircle, CheckCircle, MoveUp, MoveDown, FileText } from 'lucide-react';

interface GestionPlantillasSesionProps {
  entrenadorId: string;
}

export const GestionPlantillasSesion: React.FC<GestionPlantillasSesionProps> = ({
  entrenadorId,
}) => {
  const [plantillas, setPlantillas] = useState<PlantillaSesion[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [plantillaEditando, setPlantillaEditando] = useState<PlantillaSesion | null>(null);
  const [nuevaPlantilla, setNuevaPlantilla] = useState({
    nombre: '',
    descripcion: '',
    duracionMinutos: 60,
    precio: 50,
    tipoSesion: 'presencial' as 'presencial' | 'videollamada',
    tipoEntrenamiento: 'sesion-1-1' as 'sesion-1-1' | 'fisio' | 'nutricion' | 'masaje',
    activo: true,
  });

  useEffect(() => {
    cargarPlantillas();
  }, [entrenadorId]);

  const cargarPlantillas = async () => {
    setLoading(true);
    try {
      const plantillasData = await getPlantillasSesion(entrenadorId);
      setPlantillas(plantillasData.sort((a, b) => a.orden - b.orden));
    } catch (error) {
      console.error('Error cargando plantillas de sesión:', error);
      setError('Error al cargar las plantillas de sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async () => {
    setGuardando(true);
    setError(null);

    try {
      await guardarPlantillasSesion(entrenadorId, plantillas);
      setMensajeExito('Plantillas guardadas correctamente');
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (error) {
      console.error('Error guardando plantillas:', error);
      setError('Error al guardar las plantillas');
    } finally {
      setGuardando(false);
    }
  };

  const handleAgregarPlantilla = async () => {
    if (!nuevaPlantilla.nombre.trim() || nuevaPlantilla.duracionMinutos <= 0 || nuevaPlantilla.precio <= 0) {
      setError('Por favor, completa todos los campos requeridos');
      return;
    }

    try {
      const plantilla = await crearPlantillaSesion(entrenadorId, nuevaPlantilla);
      setPlantillas([...plantillas, plantilla].sort((a, b) => a.orden - b.orden));
      setNuevaPlantilla({
        nombre: '',
        descripcion: '',
        duracionMinutos: 60,
        precio: 50,
        tipoSesion: 'presencial',
        tipoEntrenamiento: 'sesion-1-1',
        activo: true,
      });
      setMostrarFormulario(false);
      setError(null);
    } catch (error) {
      console.error('Error creando plantilla:', error);
      setError('Error al crear la plantilla');
    }
  };

  const handleEditarPlantilla = (plantilla: PlantillaSesion) => {
    setPlantillaEditando(plantilla);
    setNuevaPlantilla({
      nombre: plantilla.nombre,
      descripcion: plantilla.descripcion || '',
      duracionMinutos: plantilla.duracionMinutos,
      precio: plantilla.precio,
      tipoSesion: plantilla.tipoSesion,
      tipoEntrenamiento: plantilla.tipoEntrenamiento,
      activo: plantilla.activo,
    });
    setMostrarFormulario(true);
  };

  const handleActualizarPlantilla = async () => {
    if (!plantillaEditando) return;
    if (!nuevaPlantilla.nombre.trim() || nuevaPlantilla.duracionMinutos <= 0 || nuevaPlantilla.precio <= 0) {
      setError('Por favor, completa todos los campos requeridos');
      return;
    }

    try {
      const plantillaActualizada = await actualizarPlantillaSesion(
        entrenadorId,
        plantillaEditando.id,
        nuevaPlantilla
      );
      setPlantillas(
        plantillas.map(p => (p.id === plantillaActualizada.id ? plantillaActualizada : p))
          .sort((a, b) => a.orden - b.orden)
      );
      setPlantillaEditando(null);
      setNuevaPlantilla({
        nombre: '',
        descripcion: '',
        duracionMinutos: 60,
        precio: 50,
        tipoSesion: 'presencial',
        tipoEntrenamiento: 'sesion-1-1',
        activo: true,
      });
      setMostrarFormulario(false);
      setError(null);
    } catch (error) {
      console.error('Error actualizando plantilla:', error);
      setError('Error al actualizar la plantilla');
    }
  };

  const handleEliminarPlantilla = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta plantilla?')) return;

    try {
      await eliminarPlantillaSesion(entrenadorId, id);
      setPlantillas(plantillas.filter(p => p.id !== id).map((p, index) => ({ ...p, orden: index + 1 })));
    } catch (error) {
      console.error('Error eliminando plantilla:', error);
      setError('Error al eliminar la plantilla');
    }
  };

  const handleToggleActivo = async (id: string) => {
    const plantilla = plantillas.find(p => p.id === id);
    if (!plantilla) return;

    try {
      const plantillaActualizada = await actualizarPlantillaSesion(entrenadorId, id, {
        activo: !plantilla.activo,
      });
      setPlantillas(plantillas.map(p => (p.id === plantillaActualizada.id ? plantillaActualizada : p)));
    } catch (error) {
      console.error('Error actualizando plantilla:', error);
      setError('Error al actualizar la plantilla');
    }
  };

  const handleActualizarCampo = (id: string, campo: keyof PlantillaSesion, valor: any) => {
    setPlantillas(plantillas.map(p => (p.id === id ? { ...p, [campo]: valor } : p)));
  };

  const handleMoverOrden = (id: string, direccion: 'up' | 'down') => {
    const index = plantillas.findIndex(p => p.id === id);
    if (index === -1) return;

    const nuevoIndex = direccion === 'up' ? index - 1 : index + 1;
    if (nuevoIndex < 0 || nuevoIndex >= plantillas.length) return;

    const nuevasPlantillas = [...plantillas];
    [nuevasPlantillas[index], nuevasPlantillas[nuevoIndex]] = [
      nuevasPlantillas[nuevoIndex],
      nuevasPlantillas[index],
    ];

    // Actualizar orden
    nuevasPlantillas.forEach((p, i) => {
      p.orden = i + 1;
    });

    setPlantillas(nuevasPlantillas);
  };

  const handleCancelarFormulario = () => {
    setPlantillaEditando(null);
    setNuevaPlantilla({
      nombre: '',
      descripcion: '',
      duracionMinutos: 60,
      precio: 50,
      tipoSesion: 'presencial',
      tipoEntrenamiento: 'sesion-1-1',
      activo: true,
    });
    setMostrarFormulario(false);
    setError(null);
  };

  const handleUsarPredefinidas = async () => {
    try {
      const plantillasPredefinidas: PlantillaSesion[] = PLANTILLAS_PREDEFINIDAS.map((p, index) => ({
        ...p,
        id: `plantilla-${entrenadorId}-${index}`,
        entrenadorId,
        orden: index + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await guardarPlantillasSesion(entrenadorId, plantillasPredefinidas);
      setPlantillas(plantillasPredefinidas);
      setMensajeExito('Plantillas predefinidas cargadas correctamente');
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (error) {
      console.error('Error cargando plantillas predefinidas:', error);
      setError('Error al cargar las plantillas predefinidas');
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando plantillas de sesión...</p>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">Plantillas de Sesión</h3>
              <p className="text-sm text-gray-600 mt-1">
                Crea plantillas de sesión con nombre, descripción, duración y precio para agilizar el proceso de reserva
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {plantillas.length === 0 && (
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
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              {plantillaEditando ? 'Editar Plantilla' : 'Agregar Plantilla'}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombre"
                value={nuevaPlantilla.nombre}
                onChange={(e) => setNuevaPlantilla({ ...nuevaPlantilla, nombre: e.target.value })}
                placeholder="Ej: Sesión 1 a 1 - Presencial"
                required
              />
              <Input
                label="Duración (minutos)"
                type="number"
                value={nuevaPlantilla.duracionMinutos.toString()}
                onChange={(e) =>
                  setNuevaPlantilla({ ...nuevaPlantilla, duracionMinutos: parseInt(e.target.value) || 0 })
                }
                min="15"
                step="15"
                required
              />
              <Input
                label="Descripción (opcional)"
                value={nuevaPlantilla.descripcion}
                onChange={(e) => setNuevaPlantilla({ ...nuevaPlantilla, descripcion: e.target.value })}
                placeholder="Ej: Sesión personal presencial de 1 hora"
              />
              <Input
                label="Precio (€)"
                type="number"
                value={nuevaPlantilla.precio.toString()}
                onChange={(e) =>
                  setNuevaPlantilla({ ...nuevaPlantilla, precio: parseFloat(e.target.value) || 0 })
                }
                min="0"
                step="0.01"
                required
              />
              <Select
                label="Tipo de Sesión"
                value={nuevaPlantilla.tipoSesion}
                onChange={(e) =>
                  setNuevaPlantilla({ ...nuevaPlantilla, tipoSesion: e.target.value as 'presencial' | 'videollamada' })
                }
                options={[
                  { value: 'presencial', label: 'Presencial' },
                  { value: 'videollamada', label: 'Videollamada' },
                ]}
              />
              <Select
                label="Tipo de Entrenamiento"
                value={nuevaPlantilla.tipoEntrenamiento}
                onChange={(e) =>
                  setNuevaPlantilla({
                    ...nuevaPlantilla,
                    tipoEntrenamiento: e.target.value as 'sesion-1-1' | 'fisio' | 'nutricion' | 'masaje',
                  })
                }
                options={[
                  { value: 'sesion-1-1', label: 'Sesión 1 a 1' },
                  { value: 'fisio', label: 'Fisioterapia' },
                  { value: 'nutricion', label: 'Nutrición' },
                  { value: 'masaje', label: 'Masaje' },
                ]}
              />
            </div>
            <div className="flex gap-3 mt-4">
              <Button
                variant="primary"
                onClick={plantillaEditando ? handleActualizarPlantilla : handleAgregarPlantilla}
              >
                {plantillaEditando ? 'Actualizar' : 'Agregar'}
              </Button>
              <Button variant="secondary" onClick={handleCancelarFormulario}>
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
            Agregar Plantilla
          </Button>
        )}

        {plantillas.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay plantillas configuradas</p>
            <p className="text-sm text-gray-500 mt-2">
              Agrega plantillas de sesión para agilizar el proceso de reserva
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {plantillas.map((plantilla, index) => (
              <div
                key={plantilla.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMoverOrden(plantilla.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mover arriba"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMoverOrden(plantilla.id, 'down')}
                    disabled={index === plantillas.length - 1}
                    className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mover abajo"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 grid grid-cols-6 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={plantilla.nombre}
                      onChange={(e) => handleActualizarCampo(plantilla.id, 'nombre', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Duración (min)</label>
                    <input
                      type="number"
                      value={plantilla.duracionMinutos}
                      onChange={(e) =>
                        handleActualizarCampo(plantilla.id, 'duracionMinutos', parseInt(e.target.value) || 0)
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
                      value={plantilla.precio}
                      onChange={(e) =>
                        handleActualizarCampo(plantilla.id, 'precio', parseFloat(e.target.value) || 0)
                      }
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Tipo Sesión</label>
                    <select
                      value={plantilla.tipoSesion}
                      onChange={(e) =>
                        handleActualizarCampo(plantilla.id, 'tipoSesion', e.target.value as 'presencial' | 'videollamada')
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="presencial">Presencial</option>
                      <option value="videollamada">Videollamada</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Tipo Entrenamiento</label>
                    <select
                      value={plantilla.tipoEntrenamiento}
                      onChange={(e) =>
                        handleActualizarCampo(
                          plantilla.id,
                          'tipoEntrenamiento',
                          e.target.value as 'sesion-1-1' | 'fisio' | 'nutricion' | 'masaje'
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="sesion-1-1">Sesión 1 a 1</option>
                      <option value="fisio">Fisioterapia</option>
                      <option value="nutricion">Nutrición</option>
                      <option value="masaje">Masaje</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Estado</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={plantilla.activo}
                        onChange={() => handleToggleActivo(plantilla.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {plantilla.activo ? 'Activa' : 'Inactiva'}
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={() => handleEditarPlantilla(plantilla)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Editar plantilla"
                >
                  <Save className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleEliminarPlantilla(plantilla.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Eliminar plantilla"
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


