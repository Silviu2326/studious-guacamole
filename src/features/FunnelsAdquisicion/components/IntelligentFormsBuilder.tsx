import { useState, useEffect } from 'react';
import { FileText, Sparkles, Plus, Trash2, Save, Eye } from 'lucide-react';
import { Button, Card, Input, Textarea, Select } from '../../../components/componentsreutilizables';
import { FunnelsAdquisicionService } from '../services/funnelsAdquisicionService';
import {
  IntelligentForm,
  IntelligentFormField,
  IntelligentFormSuggestionRequest,
  FormFieldType,
} from '../types';

interface IntelligentFormsBuilderProps {
  funnelId?: string;
  landingPageId?: string;
  onFormSaved?: (form: IntelligentForm) => void;
}

const FIELD_TYPE_OPTIONS: { value: FormFieldType; label: string }[] = [
  { value: 'text', label: 'Texto' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Teléfono' },
  { value: 'select', label: 'Selección única' },
  { value: 'multiselect', label: 'Selección múltiple' },
  { value: 'date', label: 'Fecha' },
  { value: 'time', label: 'Hora' },
  { value: 'textarea', label: 'Área de texto' },
  { value: 'number', label: 'Número' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio' },
];

const DATA_CATEGORY_OPTIONS = [
  { value: 'objectives', label: 'Objetivos' },
  { value: 'availability', label: 'Disponibilidad' },
  { value: 'preferences', label: 'Preferencias' },
  { value: 'contact', label: 'Contacto' },
  { value: 'health', label: 'Salud' },
  { value: 'other', label: 'Otro' },
];

export function IntelligentFormsBuilder({
  funnelId,
  landingPageId,
  onFormSaved,
}: IntelligentFormsBuilderProps) {
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [fields, setFields] = useState<IntelligentFormField[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedForms, setSavedForms] = useState<IntelligentForm[]>([]);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [suggestionObjective, setSuggestionObjective] = useState('');
  const [suggestionFunnelStage, setSuggestionFunnelStage] = useState<'TOFU' | 'MOFU' | 'BOFU'>('TOFU');
  const [suggestionDataNeeded, setSuggestionDataNeeded] = useState<string[]>(['objectives', 'availability']);

  useEffect(() => {
    loadSavedForms();
  }, [funnelId, landingPageId]);

  const loadSavedForms = async () => {
    try {
      const forms = await FunnelsAdquisicionService.getIntelligentFormsList(funnelId, landingPageId);
      setSavedForms(forms);
    } catch (error) {
      console.error('[IntelligentFormsBuilder] Error cargando formularios:', error);
    }
  };

  const handleSuggestFields = async () => {
    if (!suggestionObjective.trim()) {
      alert('Por favor, indica el objetivo del formulario');
      return;
    }

    setIsSuggesting(true);
    try {
      const request: IntelligentFormSuggestionRequest = {
        objective: suggestionObjective.trim(),
        funnelStage: suggestionFunnelStage,
        dataNeeded: suggestionDataNeeded as any,
        existingFields: fields.map((f) => f.id),
      };

      const suggestion = await FunnelsAdquisicionService.suggestIntelligentFormFields(request);
      setFields((prev) => [...prev, ...suggestion.suggestedFields]);
      setShowSuggestionForm(false);
      alert(`Se han agregado ${suggestion.suggestedFields.length} campos sugeridos por IA.\n\n${suggestion.reasoning}`);
    } catch (error) {
      console.error('[IntelligentFormsBuilder] Error sugiriendo campos:', error);
      alert('Error al generar sugerencias. Por favor, intenta de nuevo.');
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleAddField = () => {
    const newField: IntelligentFormField = {
      id: `field-${Date.now()}`,
      label: '',
      fieldType: 'text',
      required: false,
      dataCategory: 'other',
    };
    setFields((prev) => [...prev, newField]);
  };

  const handleUpdateField = (fieldId: string, updates: Partial<IntelligentFormField>) => {
    setFields((prev) =>
      prev.map((field) => (field.id === fieldId ? { ...field, ...updates } : field))
    );
  };

  const handleDeleteField = (fieldId: string) => {
    setFields((prev) => prev.filter((field) => field.id !== fieldId));
  };

  const handleAddOption = (fieldId: string) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === fieldId
          ? { ...field, options: [...(field.options || []), ''] }
          : field
      )
    );
  };

  const handleUpdateOption = (fieldId: string, optionIndex: number, value: string) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              options: field.options?.map((opt, idx) => (idx === optionIndex ? value : opt)),
            }
          : field
      )
    );
  };

  const handleDeleteOption = (fieldId: string, optionIndex: number) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === fieldId
          ? { ...field, options: field.options?.filter((_, idx) => idx !== optionIndex) }
          : field
      )
    );
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      alert('Por favor, ingresa un nombre para el formulario');
      return;
    }

    if (fields.length === 0) {
      alert('Agrega al menos un campo al formulario');
      return;
    }

    // Validar que todos los campos tengan label
    const invalidFields = fields.filter((f) => !f.label.trim());
    if (invalidFields.length > 0) {
      alert('Todos los campos deben tener un label');
      return;
    }

    setIsSaving(true);
    try {
      const form = await FunnelsAdquisicionService.saveIntelligentFormData({
        name: formName.trim(),
        description: formDescription.trim() || undefined,
        funnelId,
        landingPageId,
        fields: fields.filter((f) => f.label.trim()),
        settings: {
          showProgress: true,
          allowSaveProgress: false,
          redirectUrl: '/gracias',
          thankYouMessage: '¡Gracias! Te contactaremos pronto.',
          autoQualify: true,
          triggerCampaigns: [],
        },
      });

      setSavedForms((prev) => [...prev, form]);
      setFormName('');
      setFormDescription('');
      setFields([]);
      onFormSaved?.(form);
      alert('Formulario guardado correctamente');
    } catch (error) {
      console.error('[IntelligentFormsBuilder] Error guardando formulario:', error);
      alert('Error al guardar el formulario. Por favor, intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50/80 to-white p-6 shadow-sm dark:border-indigo-500/30 dark:from-indigo-900/20 dark:to-slate-900/60">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Crear Formulario Inteligente
          </h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Crea formularios que capturen datos relevantes (objetivos, disponibilidad) para nutrir campañas posteriores.
        </p>

        <div className="space-y-4">
          <Input
            label="Nombre del formulario *"
            placeholder="Ej: Formulario de Captación - Objetivos y Disponibilidad"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />

          <Textarea
            label="Descripción"
            placeholder="Describe el propósito de este formulario..."
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            rows={2}
          />

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowSuggestionForm(!showSuggestionForm)}
              className="inline-flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Sugerir Campos con IA
            </Button>
            <Button
              variant="ghost"
              onClick={handleAddField}
              className="inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Agregar Campo Manualmente
            </Button>
          </div>

          {showSuggestionForm && (
            <Card className="p-5 bg-white dark:bg-slate-900/60">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Sugerencia de Campos con IA
              </h4>
              <div className="space-y-4">
                <Input
                  label="Objetivo del formulario *"
                  placeholder="Ej: Captar objetivos y disponibilidad de nuevos leads"
                  value={suggestionObjective}
                  onChange={(e) => setSuggestionObjective(e.target.value)}
                />

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    Etapa del Funnel
                  </label>
                  <select
                    value={suggestionFunnelStage}
                    onChange={(e) => setSuggestionFunnelStage(e.target.value as any)}
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 pl-4 pr-3 py-2.5 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700"
                  >
                    <option value="TOFU">TOFU (Top of Funnel)</option>
                    <option value="MOFU">MOFU (Middle of Funnel)</option>
                    <option value="BOFU">BOFU (Bottom of Funnel)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    Datos Necesarios
                  </label>
                  <div className="grid gap-2 md:grid-cols-3">
                    {DATA_CATEGORY_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={suggestionDataNeeded.includes(option.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSuggestionDataNeeded([...suggestionDataNeeded, option.value]);
                            } else {
                              setSuggestionDataNeeded(
                                suggestionDataNeeded.filter((v) => v !== option.value)
                              );
                            }
                          }}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-200">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button
                  variant="primary"
                  onClick={handleSuggestFields}
                  disabled={isSuggesting || !suggestionObjective.trim()}
                  className="w-full inline-flex items-center justify-center gap-2"
                >
                  {isSuggesting ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-spin" />
                      Generando sugerencias...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generar Campos Sugeridos
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}

          {fields.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                Campos del Formulario ({fields.length})
              </h4>
              {fields.map((field, index) => (
                <Card key={field.id} className="p-5 bg-white dark:bg-slate-900/60">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Campo {index + 1}
                      {field.aiSuggested && (
                        <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                          <Sparkles className="h-3 w-3" />
                          IA
                        </span>
                      )}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteField(field.id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="Label *"
                      placeholder="Ej: ¿Cuál es tu objetivo principal?"
                      value={field.label}
                      onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                    />

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                        Tipo de Campo *
                      </label>
                      <select
                        value={field.fieldType}
                        onChange={(e) =>
                          handleUpdateField(field.id, { fieldType: e.target.value as FormFieldType })
                        }
                        className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 pl-4 pr-3 py-2.5 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700"
                      >
                        {FIELD_TYPE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                        Categoría de Datos
                      </label>
                      <select
                        value={field.dataCategory}
                        onChange={(e) =>
                          handleUpdateField(field.id, { dataCategory: e.target.value as any })
                        }
                        className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 pl-4 pr-3 py-2.5 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700"
                      >
                        {DATA_CATEGORY_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Input
                      label="Campo de Mapeo (CRM)"
                      placeholder="Ej: objetivo_principal, disponibilidad_horaria"
                      value={field.mappingField || ''}
                      onChange={(e) => handleUpdateField(field.id, { mappingField: e.target.value })}
                      helperText="Campo al que se mapeará en el CRM"
                    />
                  </div>

                  {['text', 'email', 'phone', 'textarea'].includes(field.fieldType) && (
                    <Input
                      label="Placeholder"
                      placeholder="Ej: tu@email.com"
                      value={field.placeholder || ''}
                      onChange={(e) => handleUpdateField(field.id, { placeholder: e.target.value })}
                      className="mt-4"
                    />
                  )}

                  {['select', 'multiselect', 'radio'].includes(field.fieldType) && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                        Opciones
                      </label>
                      <div className="space-y-2">
                        {field.options?.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <Input
                              value={option}
                              onChange={(e) =>
                                handleUpdateOption(field.id, optIndex, e.target.value)
                              }
                              placeholder={`Opción ${optIndex + 1}`}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteOption(field.id, optIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddOption(field.id)}
                          className="inline-flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Agregar Opción
                        </Button>
                      </div>
                    </div>
                  )}

                  <label className="mt-4 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-200">Campo requerido</span>
                  </label>
                </Card>
              ))}
            </div>
          )}

          {fields.length > 0 && (
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaving || !formName.trim()}
              className="w-full inline-flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Guardar Formulario
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {savedForms.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Formularios Guardados
          </h4>
          {savedForms.map((form) => (
            <Card key={form.id} className="p-5 bg-white dark:bg-slate-900/60">
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-semibold text-slate-900 dark:text-slate-100">{form.name}</h5>
                  {form.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {form.description}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {form.fields.length} campo{form.fields.length !== 1 ? 's' : ''} • Creado{' '}
                    {new Date(form.createdAt).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="inline-flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Ver
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

