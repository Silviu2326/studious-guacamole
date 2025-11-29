/**
 * Componente para gestionar presets de automatizaciones
 * User Story: Como coach quiero guardar, versionar y compartir presets de automatizaciones con otros entrenadores,
 * para reutilizar procesos validados por el equipo.
 */

import { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Share2,
  Download,
  Upload,
  History,
  Copy,
  CheckCircle2,
  AlertCircle,
  Settings,
  Users,
  Star,
} from 'lucide-react';
import { Button, Card, Input, Select, Modal, Badge } from '../../../components/componentsreutilizables';
import {
  obtenerPresets,
  crearPreset,
  actualizarPreset,
  eliminarPreset,
  compartirPreset,
  obtenerVersionesPreset,
  restaurarVersionPreset,
  exportarPreset,
  importarPreset,
  usarPreset,
  obtenerPresetsPublicos,
} from '../utils/automationPresets';
import { obtenerReglasEncadenadas } from '../utils/chainedRules';
import { obtenerAutomatizaciones } from '../utils/recurringAutomations';
import type {
  PresetAutomatizacion,
  ReglaEncadenada,
  AutomatizacionRecurrente,
} from '../types';

interface GestorPresetsAutomatizacionesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuarioId?: string;
  usuarioNombre?: string;
  onSeleccionarPreset?: (preset: PresetAutomatizacion) => void;
}

export function GestorPresetsAutomatizaciones({
  open,
  onOpenChange,
  usuarioId = 'usuario-actual',
  usuarioNombre = 'Usuario',
  onSeleccionarPreset,
}: GestorPresetsAutomatizacionesProps) {
  const [presets, setPresets] = useState<PresetAutomatizacion[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [presetEditando, setPresetEditando] = useState<PresetAutomatizacion | null>(null);
  const [filtro, setFiltro] = useState<'todos' | 'mios' | 'compartidos' | 'publicos'>('todos');

  useEffect(() => {
    if (open) {
      cargarPresets();
    }
  }, [open, filtro]);

  const cargarPresets = () => {
    let presetsCargados: PresetAutomatizacion[] = [];

    switch (filtro) {
      case 'mios':
        presetsCargados = obtenerPresets().filter((p) => p.creadoPor === usuarioId);
        break;
      case 'compartidos':
        presetsCargados = obtenerPresets().filter(
          (p) => p.compartidoCon.includes(usuarioId) && p.creadoPor !== usuarioId
        );
        break;
      case 'publicos':
        presetsCargados = obtenerPresetsPublicos();
        break;
      default:
        presetsCargados = obtenerPresets();
    }

    setPresets(presetsCargados);
  };

  const handleNuevoPreset = () => {
    setPresetEditando(null);
    setMostrarModal(true);
  };

  const handleEditarPreset = (preset: PresetAutomatizacion) => {
    setPresetEditando(preset);
    setMostrarModal(true);
  };

  const handleEliminarPreset = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este preset?')) return;

    const exito = eliminarPreset(id);
    if (exito) {
      cargarPresets();
    }
  };

  const handleUsarPreset = (preset: PresetAutomatizacion) => {
    usarPreset(preset.id);
    if (onSeleccionarPreset) {
      onSeleccionarPreset(preset);
    }
    cargarPresets();
  };

  const handleCompartirPreset = (preset: PresetAutomatizacion) => {
    const usuarioIds = prompt(
      'Ingresa los IDs de usuarios separados por comas para compartir este preset:'
    );
    if (usuarioIds) {
      const ids = usuarioIds.split(',').map((id) => id.trim()).filter(Boolean);
      compartirPreset(preset.id, ids);
      cargarPresets();
    }
  };

  const handleExportarPreset = (preset: PresetAutomatizacion) => {
    const json = exportarPreset(preset.id);
    if (json) {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `preset-${preset.nombre.replace(/\s+/g, '-')}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImportarPreset = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const json = event.target?.result as string;
          const preset = importarPreset(json, usuarioId, usuarioNombre);
          if (preset) {
            cargarPresets();
            alert('Preset importado correctamente');
          } else {
            alert('Error al importar el preset');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <Modal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Gestor de Presets de Automatizaciones"
      size="lg"
    >
      <div className="space-y-6">
        {/* Filtros y acciones */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value as any)}
              options={[
                { value: 'todos', label: 'Todos' },
                { value: 'mios', label: 'Mis Presets' },
                { value: 'compartidos', label: 'Compartidos conmigo' },
                { value: 'publicos', label: 'Públicos' },
              ]}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleImportarPreset}>
              <Upload size={16} className="mr-2" />
              Importar
            </Button>
            <Button onClick={handleNuevoPreset}>
              <Plus size={18} />
              Nuevo Preset
            </Button>
          </div>
        </div>

        {/* Lista de presets */}
        {presets.length === 0 ? (
          <Card className="p-12 text-center">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay presets</h3>
            <p className="text-gray-600 mb-4">
              Crea tu primer preset para reutilizar configuraciones de automatizaciones.
            </p>
            <Button onClick={handleNuevoPreset}>Crear Primer Preset</Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {presets.map((preset) => (
              <Card key={preset.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{preset.nombre}</h3>
                      <Badge variant="info">v{preset.version}</Badge>
                      {preset.publico && (
                        <Badge variant="success" className="flex items-center gap-1">
                          <Users size={12} />
                          Público
                        </Badge>
                      )}
                      {preset.compartidoCon.length > 0 && (
                        <Badge variant="secondary">
                          Compartido con {preset.compartidoCon.length}
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{preset.descripcion}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {preset.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <strong>Reglas:</strong> {preset.reglasEncadenadas.length}
                      </div>
                      <div>
                        <strong>Automatizaciones:</strong> {preset.automatizacionesRecurrentes.length}
                      </div>
                      <div>
                        <strong>Creado por:</strong> {preset.creadoPorNombre}
                      </div>
                      <div>
                        <strong>Usado:</strong> {preset.estadisticas?.vecesUsado || 0} veces
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUsarPreset(preset)}
                      title="Usar este preset"
                    >
                      <CheckCircle2 size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCompartirPreset(preset)}
                      title="Compartir"
                    >
                      <Share2 size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportarPreset(preset)}
                      title="Exportar"
                    >
                      <Download size={16} />
                    </Button>
                    {preset.creadoPor === usuarioId && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditarPreset(preset)}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEliminarPreset(preset.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {mostrarModal && (
          <FormularioPreset
            preset={presetEditando}
            usuarioId={usuarioId}
            usuarioNombre={usuarioNombre}
            onClose={() => {
              setMostrarModal(false);
              setPresetEditando(null);
            }}
            onGuardar={() => {
              cargarPresets();
              setMostrarModal(false);
              setPresetEditando(null);
            }}
          />
        )}
      </div>
    </Modal>
  );
}

function FormularioPreset({
  preset,
  usuarioId,
  usuarioNombre,
  onClose,
  onGuardar,
}: {
  preset: PresetAutomatizacion | null;
  usuarioId: string;
  usuarioNombre: string;
  onClose: () => void;
  onGuardar: () => void;
}) {
  const [nombre, setNombre] = useState(preset?.nombre || '');
  const [descripcion, setDescripcion] = useState(preset?.descripcion || '');
  const [version, setVersion] = useState(preset?.version || '1.0.0');
  const [reglasSeleccionadas, setReglasSeleccionadas] = useState<string[]>(
    preset?.reglasEncadenadas || []
  );
  const [automatizacionesSeleccionadas, setAutomatizacionesSeleccionadas] = useState<string[]>(
    preset?.automatizacionesRecurrentes || []
  );
  const [tags, setTags] = useState<string[]>(preset?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [categoria, setCategoria] = useState(preset?.categoria || '');
  const [publico, setPublico] = useState(preset?.publico || false);
  const [guardando, setGuardando] = useState(false);

  const reglasDisponibles = obtenerReglasEncadenadas();
  const automatizacionesDisponibles = obtenerAutomatizaciones();

  const handleAgregarTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleEliminarTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    setGuardando(true);
    try {
      const datosPreset = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        version,
        reglasEncadenadas: reglasSeleccionadas,
        automatizacionesRecurrentes: automatizacionesSeleccionadas,
        tags,
        categoria: categoria || undefined,
        publico,
        compartidoCon: preset?.compartidoCon || [],
        creadoPor: preset?.creadoPor || usuarioId,
        creadoPorNombre: preset?.creadoPorNombre || usuarioNombre,
      };

      if (preset) {
        actualizarPreset(preset.id, datosPreset);
      } else {
        crearPreset(datosPreset);
      }

      onGuardar();
    } catch (error) {
      console.error('Error guardando preset:', error);
      alert('Error al guardar el preset');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={preset ? 'Editar Preset' : 'Nuevo Preset'}
      size="lg"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <Input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Preset para hipertrofia"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <Input
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe qué hace este preset"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Versión</label>
            <Input
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.0.0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <Input
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              placeholder="Ej: Hipertrofia"
            />
          </div>
        </div>

        {/* Reglas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reglas Encadenadas
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
            {reglasDisponibles.length === 0 ? (
              <p className="text-sm text-gray-500">No hay reglas disponibles</p>
            ) : (
              reglasDisponibles.map((regla) => (
                <label key={regla.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reglasSeleccionadas.includes(regla.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setReglasSeleccionadas([...reglasSeleccionadas, regla.id]);
                      } else {
                        setReglasSeleccionadas(
                          reglasSeleccionadas.filter((id) => id !== regla.id)
                        );
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">{regla.nombre}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Automatizaciones */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Automatizaciones Recurrentes
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
            {automatizacionesDisponibles.length === 0 ? (
              <p className="text-sm text-gray-500">No hay automatizaciones disponibles</p>
            ) : (
              automatizacionesDisponibles.map((auto) => (
                <label key={auto.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={automatizacionesSeleccionadas.includes(auto.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setAutomatizacionesSeleccionadas([
                          ...automatizacionesSeleccionadas,
                          auto.id,
                        ]);
                      } else {
                        setAutomatizacionesSeleccionadas(
                          automatizacionesSeleccionadas.filter((id) => id !== auto.id)
                        );
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">{auto.nombre}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAgregarTag();
                }
              }}
              placeholder="Agregar tag"
            />
            <Button variant="outline" onClick={handleAgregarTag}>
              Agregar
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="flex items-center gap-1">
                {tag}
                <button
                  onClick={() => handleEliminarTag(tag)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={publico}
            onChange={(e) => setPublico(e.target.checked)}
            className="rounded"
          />
          <label className="text-sm font-medium text-gray-700">
            Hacer público (visible para todos los entrenadores)
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X size={16} className="mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleGuardar} disabled={guardando}>
            <Save size={16} className="mr-2" />
            {guardando ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

