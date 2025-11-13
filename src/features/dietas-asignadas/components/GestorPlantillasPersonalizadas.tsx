import React, { useState, useEffect } from 'react';
import { Modal, Card, Button } from '../../../components/componentsreutilizables';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Star,
  StarOff,
  Search,
  X,
  Save,
  Copy,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import type { PlantillaPersonalizada, RespuestaCuestionarioMetodologia } from '../types';
import {
  getPlantillasPersonalizadas,
  crearPlantillaPersonalizada,
  actualizarPlantillaPersonalizada,
  eliminarPlantillaPersonalizada,
  toggleFavoritaPlantilla,
  buscarPlantillasPersonalizadas,
  aplicarPlantillaPersonalizada,
  guardarConfiguracionComoPlantilla,
} from '../api/plantillasPersonalizadas';

interface GestorPlantillasPersonalizadasProps {
  isOpen: boolean;
  onClose: () => void;
  dietistaId: string;
  configuracionActual?: RespuestaCuestionarioMetodologia;
  onAplicarPlantilla?: (configuracion: RespuestaCuestionarioMetodologia) => void;
}

export const GestorPlantillasPersonalizadas: React.FC<GestorPlantillasPersonalizadasProps> = ({
  isOpen,
  onClose,
  dietistaId,
  configuracionActual,
  onAplicarPlantilla,
}) => {
  const [plantillas, setPlantillas] = useState<PlantillaPersonalizada[]>([]);
  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [plantillaEditando, setPlantillaEditando] = useState<PlantillaPersonalizada | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tags: [] as string[],
    tagInput: '',
  });
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (isOpen) {
      cargarPlantillas();
    }
  }, [isOpen, dietistaId]);

  const cargarPlantillas = async () => {
    setCargando(true);
    try {
      const data = await getPlantillasPersonalizadas(dietistaId);
      setPlantillas(data);
    } catch (error) {
      console.error('Error cargando plantillas:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleBuscar = async () => {
    if (!busqueda.trim()) {
      cargarPlantillas();
      return;
    }

    setCargando(true);
    try {
      const resultados = await buscarPlantillasPersonalizadas(dietistaId, busqueda);
      setPlantillas(resultados);
    } catch (error) {
      console.error('Error buscando plantillas:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleGuardarConfiguracion = async () => {
    if (!formData.nombre.trim() || !configuracionActual) {
      alert('El nombre es requerido y debe haber una configuración actual');
      return;
    }

    setGuardando(true);
    try {
      const nuevaPlantilla = await guardarConfiguracionComoPlantilla(
        dietistaId,
        formData.nombre,
        formData.descripcion || undefined,
        configuracionActual,
        undefined,
        undefined,
        formData.tags.length > 0 ? formData.tags : undefined
      );

      setPlantillas([...plantillas, nuevaPlantilla]);
      resetFormulario();
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Error guardando plantilla:', error);
      alert('Error al guardar la plantilla');
    } finally {
      setGuardando(false);
    }
  };

  const handleAplicar = async (plantilla: PlantillaPersonalizada) => {
    try {
      const configuracion = await aplicarPlantillaPersonalizada(plantilla);
      if (onAplicarPlantilla) {
        onAplicarPlantilla(configuracion);
      }
      await cargarPlantillas(); // Recargar para actualizar contador de uso
      onClose();
    } catch (error) {
      console.error('Error aplicando plantilla:', error);
      alert('Error al aplicar la plantilla');
    }
  };

  const handleEliminar = async (plantilla: PlantillaPersonalizada) => {
    if (!confirm(`¿Eliminar la plantilla "${plantilla.nombre}"?`)) {
      return;
    }

    try {
      await eliminarPlantillaPersonalizada(dietistaId, plantilla.id);
      await cargarPlantillas();
    } catch (error) {
      console.error('Error eliminando plantilla:', error);
      alert('Error al eliminar la plantilla');
    }
  };

  const handleToggleFavorita = async (plantilla: PlantillaPersonalizada) => {
    try {
      await toggleFavoritaPlantilla(dietistaId, plantilla.id);
      await cargarPlantillas();
    } catch (error) {
      console.error('Error actualizando favorita:', error);
    }
  };

  const resetFormulario = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      tags: [],
      tagInput: '',
    });
    setPlantillaEditando(null);
  };

  const agregarTag = () => {
    if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.tagInput.trim()],
        tagInput: '',
      });
    }
  };

  const eliminarTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const plantillasFiltradas = plantillas.sort((a, b) => {
    // Primero las favoritas
    if (a.favorita && !b.favorita) return -1;
    if (!a.favorita && b.favorita) return 1;
    // Luego por uso
    return b.vecesUsada - a.vecesUsada;
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gestor de Plantillas Personalizadas" size="xl">
      <div className="space-y-4">
        {/* Barra de búsqueda y acciones */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar plantillas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button variant="secondary" size="sm" onClick={handleBuscar}>
            Buscar
          </Button>
          {configuracionActual && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                resetFormulario();
                setMostrarFormulario(true);
              }}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Guardar Configuración Actual
            </Button>
          )}
        </div>

        {/* Formulario para guardar configuración */}
        {mostrarFormulario && configuracionActual && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la plantilla *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Plantilla para pérdida de peso"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Descripción opcional de la plantilla"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={formData.tagInput}
                    onChange={(e) => setFormData({ ...formData, tagInput: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarTag())}
                    placeholder="Añadir tag"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <Button variant="secondary" size="sm" onClick={agregarTag}>
                    Añadir
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => eliminarTag(tag)}
                          className="hover:text-blue-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    resetFormulario();
                    setMostrarFormulario(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleGuardarConfiguracion}
                  disabled={guardando || !formData.nombre.trim()}
                  leftIcon={guardando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                >
                  Guardar Plantilla
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Lista de plantillas */}
        {cargando ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        ) : plantillasFiltradas.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No hay plantillas guardadas.</p>
            {configuracionActual && (
              <p className="text-sm mt-2">
                Guarda tu configuración actual como plantilla para reutilizarla.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {plantillasFiltradas.map((plantilla) => (
              <Card
                key={plantilla.id}
                className="p-4 hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">{plantilla.nombre}</h3>
                      {plantilla.favorita && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    {plantilla.descripcion && (
                      <p className="text-sm text-gray-600 mb-2">{plantilla.descripcion}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{plantilla.columnasExcel.length} columnas</span>
                      <span>
                        {Object.keys(plantilla.formulasPersonalizadas || {}).length} fórmulas
                      </span>
                      <span>Usada {plantilla.vecesUsada} veces</span>
                      {plantilla.ultimoUso && (
                        <span>
                          Último uso: {new Date(plantilla.ultimoUso).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {plantilla.tags && plantilla.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {plantilla.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => handleToggleFavorita(plantilla)}
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      title={plantilla.favorita ? 'Quitar de favoritos' : 'Marcar como favorita'}
                    >
                      {plantilla.favorita ? (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <StarOff className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAplicar(plantilla)}
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Aplicar
                    </Button>
                    <button
                      onClick={() => handleEliminar(plantilla)}
                      className="p-2 hover:bg-red-50 rounded transition-colors text-red-600"
                      title="Eliminar plantilla"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

