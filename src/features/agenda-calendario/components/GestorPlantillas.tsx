import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, FileText } from 'lucide-react';
import { Card, Button, Modal, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { PlantillaSesion, TipoCita } from '../types';
import { getPlantillas, crearPlantilla, actualizarPlantilla, eliminarPlantilla } from '../api/plantillas';

interface GestorPlantillasProps {
  onPlantillaSeleccionada?: (plantilla: PlantillaSesion) => void;
}

const TIPOS_SESION: Array<{ value: TipoCita; label: string }> = [
  { value: 'sesion-1-1', label: 'Sesión 1:1' },
  { value: 'videollamada', label: 'Videollamada' },
  { value: 'evaluacion', label: 'Evaluación' },
  { value: 'fisioterapia', label: 'Fisioterapia' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'otro', label: 'Otro' },
];

const DURACIONES = [
  { value: '15', label: '15 min' },
  { value: '30', label: '30 min' },
  { value: '45', label: '45 min' },
  { value: '60', label: '60 min' },
  { value: '90', label: '90 min' },
  { value: '120', label: '120 min' },
];

export const GestorPlantillas: React.FC<GestorPlantillasProps> = ({ onPlantillaSeleccionada }) => {
  const [plantillas, setPlantillas] = useState<PlantillaSesion[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [plantillaEditando, setPlantillaEditando] = useState<PlantillaSesion | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Formulario
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<TipoCita>('sesion-1-1');
  const [duracion, setDuracion] = useState('60');
  const [precio, setPrecio] = useState('');
  const [notas, setNotas] = useState('');

  useEffect(() => {
    cargarPlantillas();
  }, []);

  const cargarPlantillas = async () => {
    setLoading(true);
    try {
      const datos = await getPlantillas();
      setPlantillas(datos);
    } catch (error) {
      console.error('Error cargando plantillas:', error);
      setError('Error al cargar plantillas');
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNueva = () => {
    setPlantillaEditando(null);
    setNombre('');
    setTipo('sesion-1-1');
    setDuracion('60');
    setPrecio('');
    setNotas('');
    setError(null);
    setMostrarModal(true);
  };

  const abrirModalEditar = (plantilla: PlantillaSesion) => {
    setPlantillaEditando(plantilla);
    setNombre(plantilla.nombre);
    setTipo(plantilla.tipo);
    setDuracion(plantilla.duracion.toString());
    setPrecio(plantilla.precio?.toString() || '');
    setNotas(plantilla.notas || '');
    setError(null);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setPlantillaEditando(null);
    setError(null);
  };

  const validarFormulario = (): boolean => {
    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }
    if (!tipo) {
      setError('El tipo de sesión es obligatorio');
      return false;
    }
    if (!duracion) {
      setError('La duración es obligatoria');
      return false;
    }
    setError(null);
    return true;
  };

  const guardarPlantilla = async () => {
    if (!validarFormulario()) return;

    try {
      const datosPlantilla = {
        nombre: nombre.trim(),
        tipo,
        duracion: parseInt(duracion),
        precio: precio ? parseFloat(precio) : undefined,
        notas: notas.trim() || undefined,
      };

      if (plantillaEditando) {
        await actualizarPlantilla(plantillaEditando.id, datosPlantilla);
      } else {
        await crearPlantilla(datosPlantilla);
      }

      await cargarPlantillas();
      cerrarModal();
    } catch (error: any) {
      console.error('Error guardando plantilla:', error);
      setError(error.message || 'Error al guardar la plantilla');
    }
  };

  const eliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta plantilla?')) {
      return;
    }

    try {
      await eliminarPlantilla(id);
      await cargarPlantillas();
    } catch (error: any) {
      alert(error.message || 'Error al eliminar la plantilla');
    }
  };

  const aplicarPlantilla = (plantilla: PlantillaSesion) => {
    if (onPlantillaSeleccionada) {
      onPlantillaSeleccionada(plantilla);
    }
  };

  return (
    <>
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">Plantillas de Sesiones</h3>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={abrirModalNueva}
            >
              <Plus className="w-4 h-4 mr-1" />
              Nueva Plantilla
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando plantillas...</div>
          ) : plantillas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay plantillas. Crea una nueva para comenzar.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plantillas.map(plantilla => (
                <div
                  key={plantilla.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{plantilla.nombre}</h4>
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => abrirModalEditar(plantilla)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => eliminar(plantilla.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    <div>Tipo: {TIPOS_SESION.find(t => t.value === plantilla.tipo)?.label}</div>
                    <div>Duración: {plantilla.duracion} min</div>
                    {plantilla.precio && <div>Precio: €{plantilla.precio}</div>}
                  </div>

                  {plantilla.notas && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{plantilla.notas}</p>
                  )}

                  {onPlantillaSeleccionada && (
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      onClick={() => aplicarPlantilla(plantilla)}
                    >
                      Aplicar Plantilla
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Modal de crear/editar plantilla */}
      <Modal
        isOpen={mostrarModal}
        onClose={cerrarModal}
        title={plantillaEditando ? 'Editar Plantilla' : 'Nueva Plantilla'}
        size="md"
        footer={
          <div className="flex items-center justify-end space-x-3">
            <Button variant="ghost" onClick={cerrarModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={guardarPlantilla}>
              <Save className="w-4 h-4 mr-1" />
              {plantillaEditando ? 'Guardar Cambios' : 'Crear Plantilla'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          <Input
            label="Nombre de la plantilla *"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Sesión PT Estándar"
            error={error && !nombre ? error : undefined}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Tipo de sesión *"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoCita)}
              options={TIPOS_SESION}
            />
            <Select
              label="Duración *"
              value={duracion}
              onChange={(e) => setDuracion(e.target.value)}
              options={DURACIONES}
            />
          </div>

          <Input
            type="number"
            label="Precio (opcional)"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
          />

          <Textarea
            label="Notas predefinidas (opcional)"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Notas que se aplicarán automáticamente..."
            rows={4}
          />
        </div>
      </Modal>
    </>
  );
};


