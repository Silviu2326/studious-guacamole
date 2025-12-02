import { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Modal, Textarea } from '../../../components/componentsreutilizables';
import {
  Calculator,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import {
  FormulaPersonalizada,
  TipoFormulaPersonalizada,
  getFormulasPredefinidas,
  cargarFormulasPersonalizadas,
  guardarFormulasPersonalizadas,
  type ConfiguracionFormulasPersonalizadas,
} from '../utils/formulasPersonalizadas';

interface GestorFormulasProps {
  isOpen: boolean;
  onClose: () => void;
  onFormulasChange?: (formulas: FormulaPersonalizada[]) => void;
}

export function GestorFormulas({
  isOpen,
  onClose,
  onFormulasChange,
}: GestorFormulasProps) {
  const [formulas, setFormulas] = useState<FormulaPersonalizada[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingFormula, setEditingFormula] = useState<FormulaPersonalizada | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<FormulaPersonalizada>>({
    nombre: '',
    descripcion: '',
    formula: '',
    tipo: 'custom',
    variables: [],
    formato: 'numero',
    unidad: '',
    recalculoAutomatico: true,
    activa: true,
  });

  useEffect(() => {
    if (isOpen) {
      loadFormulas();
    }
  }, [isOpen]);

  const loadFormulas = async () => {
    setLoading(true);
    try {
      const config = await cargarFormulasPersonalizadas();
      setFormulas(config.formulas);
    } catch (error) {
      console.error('Error cargando fórmulas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const config: ConfiguracionFormulasPersonalizadas = {
        formulas,
        ultimaActualizacion: new Date().toISOString(),
      };
      await guardarFormulasPersonalizadas(config);
      onFormulasChange?.(formulas);
      onClose();
    } catch (error) {
      console.error('Error guardando fórmulas:', error);
      alert('Error al guardar las fórmulas');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPredefinida = (predefinida: Omit<FormulaPersonalizada, 'id' | 'creadoEn' | 'actualizadoEn' | 'activa' | 'orden'>) => {
    const nuevaFormula: FormulaPersonalizada = {
      ...predefinida,
      id: `formula-${Date.now()}`,
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
      activa: true,
      orden: formulas.length,
    };
    setFormulas([...formulas, nuevaFormula]);
  };

  const handleEdit = (formula: FormulaPersonalizada) => {
    setEditingFormula(formula);
    setFormData(formula);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta fórmula?')) {
      setFormulas(formulas.filter((f) => f.id !== id));
    }
  };

  const handleToggleActiva = (id: string) => {
    setFormulas(
      formulas.map((f) => (f.id === id ? { ...f, activa: !f.activa } : f))
    );
  };

  const handleSaveFormula = () => {
    if (!formData.nombre || !formData.formula) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (editingFormula) {
      // Actualizar fórmula existente
      setFormulas(
        formulas.map((f) =>
          f.id === editingFormula.id
            ? {
                ...f,
                ...formData,
                actualizadoEn: new Date().toISOString(),
              }
            : f
        )
      );
    } else {
      // Crear nueva fórmula
      const nuevaFormula: FormulaPersonalizada = {
        ...formData,
        id: `formula-${Date.now()}`,
        creadoEn: new Date().toISOString(),
        actualizadoEn: new Date().toISOString(),
        activa: formData.activa ?? true,
        orden: formulas.length,
        variables: formData.variables || [],
        tipo: formData.tipo || 'custom',
        formato: formData.formato || 'numero',
        unidad: formData.unidad || '',
        recalculoAutomatico: formData.recalculoAutomatico ?? true,
      } as FormulaPersonalizada;
      setFormulas([...formulas, nuevaFormula]);
    }

    setShowForm(false);
    setEditingFormula(null);
    setFormData({
      nombre: '',
      descripcion: '',
      formula: '',
      tipo: 'custom',
      variables: [],
      formato: 'numero',
      unidad: '',
      recalculoAutomatico: true,
      activa: true,
    });
  };

  const formulasPredefinidas = getFormulasPredefinidas();

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gestor de Fórmulas Personalizadas"
      size="xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calculator className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">
              Fórmulas Personalizadas
            </h2>
            <p className="text-sm text-gray-600">
              Añade fórmulas tipo Excel (volumen, tonelaje, densidad) que se recalcularán automáticamente
            </p>
          </div>
        </div>

        {/* Fórmulas Predefinidas */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Fórmulas Predefinidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {formulasPredefinidas.map((predefinida, index) => {
              const yaExiste = formulas.some((f) => f.nombre === predefinida.nombre);
              return (
                <Card
                  key={index}
                  className={`p-3 ${yaExiste ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-gray-900">
                        {predefinida.nombre}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {predefinida.descripcion}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">
                          {predefinida.formula}
                        </span>
                        <span className="text-xs text-blue-600">
                          ({predefinida.unidad})
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAddPredefinida(predefinida)}
                      disabled={yaExiste}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Lista de Fórmulas */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Mis Fórmulas ({formulas.length})
            </h3>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                setShowForm(true);
                setEditingFormula(null);
                setFormData({
                  nombre: '',
                  descripcion: '',
                  formula: '',
                  tipo: 'custom',
                  variables: [],
                  formato: 'numero',
                  unidad: '',
                  recalculoAutomatico: true,
                  activa: true,
                });
              }}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Nueva Fórmula
            </Button>
          </div>

          {formulas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calculator className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay fórmulas personalizadas. Añade una nueva o usa una predefinida.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {formulas.map((formula) => (
                <Card key={formula.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {formula.nombre}
                        </h4>
                        {formula.activa ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {formula.tipo}
                        </span>
                        {formula.recalculoAutomatico && (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                            Auto
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {formula.descripcion}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>
                          <strong>Fórmula:</strong> {formula.formula}
                        </span>
                        <span>
                          <strong>Unidad:</strong> {formula.unidad}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleActiva(formula.id)}
                      >
                        {formula.activa ? 'Desactivar' : 'Activar'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(formula)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(formula.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Formulario de edición/creación */}
        {showForm && (
          <Card className="p-4 bg-gray-50">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  {editingFormula ? 'Editar Fórmula' : 'Nueva Fórmula'}
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowForm(false);
                    setEditingFormula(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <Input
                label="Nombre"
                value={formData.nombre || ''}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Tonelaje Total"
                required
              />

              <Textarea
                label="Descripción"
                value={formData.descripcion || ''}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Describe qué calcula esta fórmula"
                rows={2}
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Tipo"
                  value={formData.tipo || 'custom'}
                  onChange={(v) => setFormData({ ...formData, tipo: v as TipoFormulaPersonalizada })}
                  options={[
                    { label: 'Volumen', value: 'volumen' },
                    { label: 'Tonelaje', value: 'tonelaje' },
                    { label: 'Densidad', value: 'densidad' },
                    { label: 'Personalizada', value: 'custom' },
                  ]}
                />

                <Select
                  label="Formato"
                  value={formData.formato || 'numero'}
                  onChange={(v) => setFormData({ ...formData, formato: v as 'numero' | 'porcentaje' | 'moneda' })}
                  options={[
                    { label: 'Número', value: 'numero' },
                    { label: 'Porcentaje', value: 'porcentaje' },
                    { label: 'Moneda', value: 'moneda' },
                  ]}
                />
              </div>

              <Input
                label="Fórmula"
                value={formData.formula || ''}
                onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                placeholder="Ej: SUM(peso * series * repeticiones)"
                required
              />

              <div className="flex items-center gap-4">
                <Input
                  label="Unidad"
                  value={formData.unidad || ''}
                  onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                  placeholder="Ej: kg, min, %"
                  className="flex-1"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.recalculoAutomatico ?? true}
                    onChange={(e) =>
                      setFormData({ ...formData, recalculoAutomatico: e.target.checked })
                    }
                  />
                  <span className="text-sm text-gray-700">Recálculo automático</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.activa ?? true}
                    onChange={(e) => setFormData({ ...formData, activa: e.target.checked })}
                  />
                  <span className="text-sm text-gray-700">Activa</span>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <p className="text-xs text-gray-600">
                  Usa funciones como SUM(), AVG() y variables como peso, series, repeticiones, duracion, rpe
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={handleSaveFormula}>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} loading={loading}>
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </div>
    </Modal>
  );
}

