/**
 * PlantillasFactura - Componente para gestionar plantillas de facturas
 * 
 * Este componente permite:
 * - Listar todas las plantillas de factura disponibles
 * - Crear nuevas plantillas de factura
 * - Editar plantillas existentes
 * - Eliminar plantillas (excepto la plantilla por defecto)
 * - Marcar una plantilla como por defecto
 * 
 * INTEGRACIÓN CON CreadorFactura.tsx:
 * - CreadorFactura.tsx usa getPlantillasFactura() para cargar las plantillas disponibles
 * - Al crear una factura, el usuario puede seleccionar una plantilla del selector
 * - Si no se selecciona una plantilla, se usa automáticamente la plantilla marcada como por defecto
 * - La plantilla seleccionada determina:
 *   * El diseño visual de la factura (clasica, minimal, detallada)
 *   * Los campos personalizados que se muestran en la factura
 *   * El logo y colores de la factura
 *   * El texto legal adicional
 * 
 * FLUJO DE USO:
 * 1. Usuario crea/edita plantillas en este componente
 * 2. Usuario marca una plantilla como por defecto
 * 3. Al crear una factura en CreadorFactura.tsx, se muestra la plantilla por defecto seleccionada
 * 4. Usuario puede cambiar la plantilla en el selector de CreadorFactura.tsx
 * 5. La factura se renderiza usando la plantilla seleccionada
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Input, 
  Select, 
  Textarea, 
  Modal,
  Badge 
} from '../../../components/componentsreutilizables';
import { 
  PlantillaFactura, 
  DisenoPlantilla,
  CampoPersonalizadoFactura,
  TipoCampoPersonalizado
} from '../types/plantillas';
import { 
  getPlantillasFactura,
  crearPlantillaFactura,
  actualizarPlantillaFactura,
  eliminarPlantillaFactura,
  establecerPlantillaPorDefecto
} from '../api/plantillas';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Star, 
  StarOff,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  Palette,
  Type,
  Settings
} from 'lucide-react';

export const PlantillasFactura: React.FC = () => {
  // Estados principales
  const [plantillas, setPlantillas] = useState<PlantillaFactura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados del modal
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [plantillaActual, setPlantillaActual] = useState<Partial<PlantillaFactura>>({
    nombre: '',
    descripcion: '',
    diseño: 'clasica',
    camposOpcionales: [],
    esPorDefecto: false
  });
  
  // Estados de campos personalizados
  const [nuevoCampo, setNuevoCampo] = useState<Partial<CampoPersonalizadoFactura>>({
    nombreCampo: '',
    tipo: 'texto'
  });

  // Cargar plantillas al montar el componente
  useEffect(() => {
    cargarPlantillas();
  }, []);

  /**
   * Carga todas las plantillas desde la API
   */
  const cargarPlantillas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPlantillasFactura();
      setPlantillas(data);
    } catch (err) {
      console.error('Error cargando plantillas:', err);
      setError('Error al cargar las plantillas');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Abre el modal para crear una nueva plantilla
   */
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setPlantillaActual({
      nombre: '',
      descripcion: '',
      diseño: 'clasica',
      logoUrlOpcional: '',
      colorPrimarioOpcional: '#3B82F6',
      camposOpcionales: [],
      textoLegalOpcional: '',
      esPorDefecto: false
    });
    setNuevoCampo({ nombreCampo: '', tipo: 'texto' });
    setMostrarModal(true);
  };

  /**
   * Abre el modal para editar una plantilla existente
   */
  const abrirModalEditar = (plantilla: PlantillaFactura) => {
    setModoEdicion(true);
    setPlantillaActual({ ...plantilla });
    setNuevoCampo({ nombreCampo: '', tipo: 'texto' });
    setMostrarModal(true);
  };

  /**
   * Cierra el modal y resetea los estados
   */
  const cerrarModal = () => {
    setMostrarModal(false);
    setModoEdicion(false);
    setPlantillaActual({});
    setNuevoCampo({ nombreCampo: '', tipo: 'texto' });
    setError(null);
  };

  /**
   * Guarda la plantilla (crear o actualizar)
   */
  const handleGuardar = async () => {
    // Validación básica
    if (!plantillaActual.nombre || !plantillaActual.diseño) {
      setError('El nombre y el diseño son requeridos');
      return;
    }

    setError(null);
    try {
      if (modoEdicion && plantillaActual.id) {
        // Actualizar plantilla existente
        await actualizarPlantillaFactura(plantillaActual.id, {
          nombre: plantillaActual.nombre,
          descripcion: plantillaActual.descripcion || '',
          diseño: plantillaActual.diseño,
          logoUrlOpcional: plantillaActual.logoUrlOpcional,
          colorPrimarioOpcional: plantillaActual.colorPrimarioOpcional,
          camposOpcionales: plantillaActual.camposOpcionales || [],
          textoLegalOpcional: plantillaActual.textoLegalOpcional,
          esPorDefecto: plantillaActual.esPorDefecto || false
        });
      } else {
        // Crear nueva plantilla
        await crearPlantillaFactura({
          nombre: plantillaActual.nombre,
          descripcion: plantillaActual.descripcion || '',
          diseño: plantillaActual.diseño as DisenoPlantilla,
          logoUrlOpcional: plantillaActual.logoUrlOpcional,
          colorPrimarioOpcional: plantillaActual.colorPrimarioOpcional,
          camposOpcionales: plantillaActual.camposOpcionales || [],
          textoLegalOpcional: plantillaActual.textoLegalOpcional,
          esPorDefecto: plantillaActual.esPorDefecto || false
        });
      }
      
      // Recargar plantillas y cerrar modal
      await cargarPlantillas();
      cerrarModal();
    } catch (err) {
      console.error('Error guardando plantilla:', err);
      setError(err instanceof Error ? err.message : 'Error al guardar la plantilla');
    }
  };

  /**
   * Elimina una plantilla
   */
  const handleEliminar = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta plantilla?')) {
      return;
    }

    try {
      await eliminarPlantillaFactura(id);
      await cargarPlantillas();
    } catch (err) {
      console.error('Error eliminando plantilla:', err);
      alert(err instanceof Error ? err.message : 'Error al eliminar la plantilla');
    }
  };

  /**
   * Establece una plantilla como por defecto
   */
  const handleEstablecerPorDefecto = async (id: string) => {
    try {
      await establecerPlantillaPorDefecto(id);
      await cargarPlantillas();
    } catch (err) {
      console.error('Error estableciendo plantilla por defecto:', err);
      alert(err instanceof Error ? err.message : 'Error al establecer la plantilla por defecto');
    }
  };

  /**
   * Agrega un campo personalizado a la plantilla actual
   */
  const agregarCampoPersonalizado = () => {
    if (!nuevoCampo.nombreCampo) {
      return;
    }

    const campo: CampoPersonalizadoFactura = {
      id: `campo_${Date.now()}`,
      nombreCampo: nuevoCampo.nombreCampo,
      tipo: nuevoCampo.tipo as TipoCampoPersonalizado,
      valorPorDefectoOpcional: nuevoCampo.valorPorDefectoOpcional
    };

    setPlantillaActual({
      ...plantillaActual,
      camposOpcionales: [...(plantillaActual.camposOpcionales || []), campo]
    });

    setNuevoCampo({ nombreCampo: '', tipo: 'texto' });
  };

  /**
   * Elimina un campo personalizado de la plantilla actual
   */
  const eliminarCampoPersonalizado = (campoId: string) => {
    setPlantillaActual({
      ...plantillaActual,
      camposOpcionales: (plantillaActual.camposOpcionales || []).filter(c => c.id !== campoId)
    });
  };

  /**
   * Obtiene el badge del diseño
   */
  const getDiseñoBadge = (diseño: DisenoPlantilla) => {
    const configs: Record<DisenoPlantilla, { label: string; variant: 'blue' | 'green' | 'purple' }> = {
      clasica: { label: 'Clásica', variant: 'blue' },
      minimal: { label: 'Minimal', variant: 'green' },
      detallada: { label: 'Detallada', variant: 'purple' }
    };
    
    const config = configs[diseño];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Plantillas de Factura
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona las plantillas que se usan al crear facturas. 
            La plantilla por defecto se aplica automáticamente en CreadorFactura.tsx
          </p>
        </div>
        <Button onClick={abrirModalCrear}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Plantilla
        </Button>
      </div>

      {/* Mensaje de error global */}
      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </Card>
      )}

      {/* Lista de plantillas */}
      {plantillas.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay plantillas creadas
          </h3>
          <p className="text-gray-600 mb-4">
            Crea tu primera plantilla para comenzar a personalizar tus facturas
          </p>
          <Button onClick={abrirModalCrear}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Primera Plantilla
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plantillas.map((plantilla) => (
            <Card key={plantilla.id} className="p-6 hover:shadow-lg transition-shadow" variant="hover">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {plantilla.nombre}
                    </h3>
                    {plantilla.esPorDefecto && (
                      <Badge variant="blue" className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Por Defecto
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {plantilla.descripcion || 'Sin descripción'}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <Palette className="w-4 h-4 text-gray-400" />
                    {getDiseñoBadge(plantilla.diseño)}
                  </div>
                  {plantilla.colorPrimarioOpcional && (
                    <div className="flex items-center gap-2 mb-3">
                      <div 
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: plantilla.colorPrimarioOpcional }}
                      />
                      <span className="text-sm text-gray-600">
                        {plantilla.colorPrimarioOpcional}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Type className="w-4 h-4" />
                    <span>
                      {plantilla.camposOpcionales?.length || 0} campo(s) personalizado(s)
                    </span>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => abrirModalEditar(plantilla)}
                  className="flex-1"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                {!plantilla.esPorDefecto ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEstablecerPorDefecto(plantilla.id)}
                      className="flex-1"
                    >
                      <StarOff className="w-4 h-4 mr-1" />
                      Por Defecto
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEliminar(plantilla.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Activa
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de crear/editar plantilla */}
      <Modal
        isOpen={mostrarModal}
        onClose={cerrarModal}
        title={modoEdicion ? 'Editar Plantilla' : 'Nueva Plantilla'}
        size="xl"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={cerrarModal}>
              Cancelar
            </Button>
            <Button onClick={handleGuardar}>
              {modoEdicion ? 'Actualizar' : 'Crear'} Plantilla
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Información Básica
            </h3>
            
            <Input
              label="Nombre de la Plantilla *"
              value={plantillaActual.nombre || ''}
              onChange={(e) => setPlantillaActual({ ...plantillaActual, nombre: e.target.value })}
              placeholder="Ej: Plantilla Corporativa"
            />

            <Textarea
              label="Descripción"
              value={plantillaActual.descripcion || ''}
              onChange={(e) => setPlantillaActual({ ...plantillaActual, descripcion: e.target.value })}
              placeholder="Describe cuándo usar esta plantilla"
              rows={3}
            />

            <Select
              label="Diseño *"
              value={plantillaActual.diseño || 'clasica'}
              onChange={(e) => setPlantillaActual({ ...plantillaActual, diseño: e.target.value as DisenoPlantilla })}
              options={[
                { value: 'clasica', label: 'Clásica - Diseño tradicional y profesional' },
                { value: 'minimal', label: 'Minimal - Diseño limpio y moderno' },
                { value: 'detallada', label: 'Detallada - Diseño completo con todos los campos' }
              ]}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="URL del Logo (opcional)"
                value={plantillaActual.logoUrlOpcional || ''}
                onChange={(e) => setPlantillaActual({ ...plantillaActual, logoUrlOpcional: e.target.value })}
                placeholder="https://example.com/logo.png"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color Primario (opcional)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={plantillaActual.colorPrimarioOpcional || '#3B82F6'}
                    onChange={(e) => setPlantillaActual({ ...plantillaActual, colorPrimarioOpcional: e.target.value })}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <Input
                    value={plantillaActual.colorPrimarioOpcional || '#3B82F6'}
                    onChange={(e) => setPlantillaActual({ ...plantillaActual, colorPrimarioOpcional: e.target.value })}
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <Textarea
              label="Texto Legal (opcional)"
              value={plantillaActual.textoLegalOpcional || ''}
              onChange={(e) => setPlantillaActual({ ...plantillaActual, textoLegalOpcional: e.target.value })}
              placeholder="Términos legales adicionales que aparecerán en la factura"
              rows={3}
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="esPorDefecto"
                checked={plantillaActual.esPorDefecto || false}
                onChange={(e) => setPlantillaActual({ ...plantillaActual, esPorDefecto: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-gray-300"
              />
              <label htmlFor="esPorDefecto" className="text-sm font-medium text-gray-700">
                Marcar como plantilla por defecto
              </label>
            </div>
            <p className="text-xs text-gray-500 ml-6">
              Esta plantilla se usará automáticamente en CreadorFactura.tsx si no se selecciona otra
            </p>
          </div>

          {/* Campos personalizados */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Type className="w-5 h-5" />
              Campos Personalizados
            </h3>

            {/* Agregar nuevo campo */}
            <Card className="p-4 bg-gray-50">
              <div className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-5">
                  <Input
                    label="Nombre del Campo"
                    value={nuevoCampo.nombreCampo || ''}
                    onChange={(e) => setNuevoCampo({ ...nuevoCampo, nombreCampo: e.target.value })}
                    placeholder="Ej: Términos de pago"
                  />
                </div>
                <div className="col-span-4">
                  <Select
                    label="Tipo"
                    value={nuevoCampo.tipo || 'texto'}
                    onChange={(e) => setNuevoCampo({ ...nuevoCampo, tipo: e.target.value as TipoCampoPersonalizado })}
                    options={[
                      { value: 'texto', label: 'Texto' },
                      { value: 'numero', label: 'Número' },
                      { value: 'fecha', label: 'Fecha' },
                      { value: 'boolean', label: 'Booleano' }
                    ]}
                  />
                </div>
                <div className="col-span-3">
                  <Button
                    onClick={agregarCampoPersonalizado}
                    disabled={!nuevoCampo.nombreCampo}
                    variant="secondary"
                    fullWidth
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar
                  </Button>
                </div>
              </div>
            </Card>

            {/* Lista de campos existentes */}
            {plantillaActual.camposOpcionales && plantillaActual.camposOpcionales.length > 0 ? (
              <div className="space-y-2">
                {plantillaActual.camposOpcionales.map((campo) => (
                  <Card key={campo.id} className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900">{campo.nombreCampo}</span>
                      <Badge variant="blue" className="ml-2">
                        {campo.tipo}
                      </Badge>
                      {campo.valorPorDefectoOpcional !== undefined && (
                        <span className="text-sm text-gray-500 ml-2">
                          (Por defecto: {String(campo.valorPorDefectoOpcional)})
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => eliminarCampoPersonalizado(campo.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay campos personalizados. Agrega campos para incluir información adicional en las facturas.
              </p>
            )}
          </div>

          {/* Mensaje de error en el modal */}
          {error && (
            <Card className="p-3 bg-red-50 border-red-200">
              <div className="flex items-center gap-2 text-red-800 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </Card>
          )}
        </div>
      </Modal>
    </div>
  );
};

