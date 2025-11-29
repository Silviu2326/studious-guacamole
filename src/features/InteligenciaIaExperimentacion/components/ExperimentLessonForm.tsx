import React, { useState } from 'react';
import { Card, Button, Input, Textarea, Badge } from '../../../components/componentsreutilizables';
import { ExperimentLesson, ExperimentRecord } from '../types';
import { BookOpen, X, Plus, Save } from 'lucide-react';
import { recordExperimentLessonService } from '../services/intelligenceService';

interface ExperimentLessonFormProps {
  experiment: ExperimentRecord;
  onLessonSaved?: (lesson: ExperimentLesson) => void;
  onCancel?: () => void;
}

const categoryLabels: Record<ExperimentLesson['category'], string> = {
  success: 'Éxito',
  failure: 'Fracaso',
  insight: 'Insight',
  methodology: 'Metodología',
};

const impactLabels: Record<ExperimentLesson['impact'], string> = {
  high: 'Alto',
  medium: 'Medio',
  low: 'Bajo',
};

export const ExperimentLessonForm: React.FC<ExperimentLessonFormProps> = ({
  experiment,
  onLessonSaved,
  onCancel,
}) => {
  const [category, setCategory] = useState<ExperimentLesson['category']>('insight');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [impact, setImpact] = useState<ExperimentLesson['impact']>('medium');
  const [applicableTo, setApplicableTo] = useState<string[]>([]);
  const [newApplicableTo, setNewApplicableTo] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddApplicableTo = () => {
    if (newApplicableTo.trim() && !applicableTo.includes(newApplicableTo.trim())) {
      setApplicableTo([...applicableTo, newApplicableTo.trim()]);
      setNewApplicableTo('');
    }
  };

  const handleRemoveApplicableTo = (itemToRemove: string) => {
    setApplicableTo(applicableTo.filter((item) => item !== itemToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim()) {
      setError('El título y la descripción son obligatorios');
      return;
    }

    setIsSaving(true);
    try {
      const response = await recordExperimentLessonService({
        experimentId: experiment.id,
        category,
        title: title.trim(),
        description: description.trim(),
        tags,
        impact,
        applicableTo,
      });

      if (response.success && onLessonSaved) {
        onLessonSaved(response.lesson);
      }
    } catch (err) {
      console.error('Error guardando lección:', err);
      setError('Error al guardar la lección. Por favor, intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-6 bg-white shadow-sm border border-slate-200/70">
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
            <BookOpen size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900">Registrar Lección Aprendida</h3>
            <p className="text-sm text-slate-600 mt-1">
              Documenta lo que aprendiste de "{experiment.name}". La IA recordará esta lección para futuros experimentos.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Categoría *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(Object.keys(categoryLabels) as ExperimentLesson['category'][]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    category === cat
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Título *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Personalización aumenta engagement en 15%"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descripción *
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe en detalle qué aprendiste, qué funcionó o qué no funcionó, y por qué..."
              rows={5}
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tags (opcional)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Ej: timing, audience, content"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddTag}
                leftIcon={<Plus size={16} />}
              >
                Agregar
              </Button>
            </div>
          </div>

          {/* Impacto */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Impacto
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(impactLabels) as ExperimentLesson['impact'][]).map((imp) => (
                <button
                  key={imp}
                  type="button"
                  onClick={() => setImpact(imp)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    impact === imp
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {impactLabels[imp]}
                </button>
              ))}
            </div>
          </div>

          {/* Aplicable a */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Aplicable a tipos de experimentos (opcional)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {applicableTo.map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveApplicableTo(item)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newApplicableTo}
                onChange={(e) => setNewApplicableTo(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddApplicableTo();
                  }
                }}
                placeholder="Ej: A/B testing, pricing, content"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddApplicableTo}
                leftIcon={<Plus size={16} />}
              >
                Agregar
              </Button>
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            {onCancel && (
              <Button type="button" variant="ghost" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={isSaving} leftIcon={<Save size={16} />}>
              {isSaving ? 'Guardando...' : 'Guardar Lección'}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default ExperimentLessonForm;

