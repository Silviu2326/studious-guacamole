import { useState, useEffect } from 'react';
import { BookOpen, Plus, Save, X, Trash2, Edit2, Search, Filter, CheckCircle2, Tag } from 'lucide-react';
import { Button, Card, Input, Select, Textarea, Badge, Tabs } from '../../../components/componentsreutilizables';
import type {
  ContentLearning,
  LearningCategory,
  LearningFilter,
  SaveLearningRequest,
  ContentFormat,
  TrainerNiche,
} from '../types';
import {
  saveLearning,
  getLearnings,
  updateLearning,
  deleteLearning,
  getLearningStats,
} from '../api/contentLearnings';

interface ContentLearningsManagerProps {
  loading?: boolean;
}

const categoryOptions: Array<{ value: LearningCategory; label: string }> = [
  { value: 'formato', label: 'Por Formato' },
  { value: 'niche', label: 'Por Nicho' },
  { value: 'general', label: 'General' },
];

const formatOptions: Array<{ value: ContentFormat; label: string }> = [
  { value: 'post', label: 'Post' },
  { value: 'reel', label: 'Reel' },
  { value: 'carousel', label: 'Carousel' },
  { value: 'story', label: 'Story' },
  { value: 'email', label: 'Email' },
  { value: 'blog', label: 'Blog' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
];

const nicheOptions: Array<{ value: TrainerNiche; label: string }> = [
  { value: 'ejecutivos', label: 'Ejecutivos' },
  { value: 'postparto', label: 'Postparto' },
  { value: 'alto-rendimiento', label: 'Alto Rendimiento' },
  { value: 'rehabilitacion', label: 'Rehabilitación' },
  { value: 'perdida-peso', label: 'Pérdida de Peso' },
  { value: 'ganancia-masa', label: 'Ganancia de Masa' },
  { value: 'bienestar-general', label: 'Bienestar General' },
  { value: 'deportistas-amateur', label: 'Deportistas Amateur' },
];

const priorityOptions: Array<{ value: 'high' | 'medium' | 'low'; label: string }> = [
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Media' },
  { value: 'low', label: 'Baja' },
];

export function ContentLearningsManager({ loading: externalLoading }: ContentLearningsManagerProps) {
  const [learnings, setLearnings] = useState<ContentLearning[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingLearning, setEditingLearning] = useState<ContentLearning | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'formato' | 'niche' | 'general'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFormat, setFilterFormat] = useState<ContentFormat | ''>('');
  const [filterNiche, setFilterNiche] = useState<TrainerNiche | ''>('');

  const [formData, setFormData] = useState<SaveLearningRequest>({
    category: 'general',
    title: '',
    description: '',
    insights: [],
    bestPractices: [],
    whatWorks: [],
    whatDoesntWork: [],
    tags: [],
    priority: 'medium',
  });

  const [newInsight, setNewInsight] = useState('');
  const [newBestPractice, setNewBestPractice] = useState('');
  const [newWhatWorks, setNewWhatWorks] = useState('');
  const [newWhatDoesntWork, setNewWhatDoesntWork] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    loadLearnings();
  }, [activeTab, searchQuery, filterFormat, filterNiche]);

  const loadLearnings = async () => {
    setLoading(true);
    try {
      const filter: LearningFilter = {};
      if (activeTab !== 'all') {
        filter.category = activeTab;
      }
      if (filterFormat) {
        filter.format = filterFormat;
      }
      if (filterNiche) {
        filter.niche = filterNiche;
      }
      if (searchQuery) {
        filter.search = searchQuery;
      }
      const data = await getLearnings(filter);
      setLearnings(data);
    } catch (error) {
      console.error('Error loading learnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Por favor, completa el título y la descripción');
      return;
    }

    setSaving(true);
    try {
      if (editingLearning) {
        await updateLearning(editingLearning.id, formData);
      } else {
        await saveLearning(formData);
      }
      resetForm();
      loadLearnings();
    } catch (error) {
      console.error('Error saving learning:', error);
      alert('Error al guardar el aprendizaje. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (learning: ContentLearning) => {
    setEditingLearning(learning);
    setFormData({
      category: learning.category,
      format: learning.format,
      niche: learning.niche,
      title: learning.title,
      description: learning.description,
      insights: learning.insights,
      bestPractices: learning.bestPractices,
      whatWorks: learning.whatWorks,
      whatDoesntWork: learning.whatDoesntWork,
      examples: learning.examples,
      tags: learning.tags,
      priority: learning.priority,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este aprendizaje?')) {
      return;
    }

    try {
      await deleteLearning(id);
      loadLearnings();
    } catch (error) {
      console.error('Error deleting learning:', error);
      alert('Error al eliminar el aprendizaje. Intenta nuevamente.');
    }
  };

  const resetForm = () => {
    setFormData({
      category: 'general',
      title: '',
      description: '',
      insights: [],
      bestPractices: [],
      whatWorks: [],
      whatDoesntWork: [],
      tags: [],
      priority: 'medium',
    });
    setEditingLearning(null);
    setShowForm(false);
    setNewInsight('');
    setNewBestPractice('');
    setNewWhatWorks('');
    setNewWhatDoesntWork('');
    setNewTag('');
  };

  const addItem = (field: 'insights' | 'bestPractices' | 'whatWorks' | 'whatDoesntWork', value: string) => {
    if (value.trim()) {
      setFormData({
        ...formData,
        [field]: [...formData[field], value.trim()],
      });
      if (field === 'insights') setNewInsight('');
      if (field === 'bestPractices') setNewBestPractice('');
      if (field === 'whatWorks') setNewWhatWorks('');
      if (field === 'whatDoesntWork') setNewWhatDoesntWork('');
    }
  };

  const removeItem = (field: 'insights' | 'bestPractices' | 'whatWorks' | 'whatDoesntWork', index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  if (externalLoading || loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-slate-200 rounded" />
          <div className="h-24 bg-slate-100 rounded-2xl" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 shadow-sm border border-slate-100">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            Aprendizajes por Formato/Nicho
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Guarda aprendizajes para que la IA los considere en futuras ideas de contenido
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Nuevo aprendizaje
        </Button>
      </div>

      <div className="p-6 space-y-6">
        {/* Filtros y búsqueda */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar aprendizajes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          {activeTab === 'formato' && (
            <Select
              options={[{ value: '', label: 'Todos los formatos' }, ...formatOptions]}
              value={filterFormat}
              onChange={(e) => setFilterFormat(e.target.value as ContentFormat | '')}
            />
          )}
          {activeTab === 'niche' && (
            <Select
              options={[{ value: '', label: 'Todos los nichos' }, ...nicheOptions]}
              value={filterNiche}
              onChange={(e) => setFilterNiche(e.target.value as TrainerNiche | '')}
            />
          )}
        </div>

        {/* Tabs */}
        <Tabs
          items={[
            { id: 'all', label: 'Todos' },
            { id: 'formato', label: 'Por Formato' },
            { id: 'niche', label: 'Por Nicho' },
            { id: 'general', label: 'General' },
          ]}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab as any);
            setFilterFormat('');
            setFilterNiche('');
          }}
        />

        {/* Formulario */}
        {showForm && (
          <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingLearning ? 'Editar aprendizaje' : 'Nuevo aprendizaje'}
              </h3>
              <Button variant="ghost" size="sm" onClick={resetForm} leftIcon={<X className="w-4 h-4" />}>
                Cancelar
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Categoría *</label>
                <Select
                  options={categoryOptions}
                  value={formData.category}
                  onChange={(e) => {
                    setFormData({ ...formData, category: e.target.value as LearningCategory, format: undefined, niche: undefined });
                  }}
                />
              </div>
              {formData.category === 'formato' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Formato *</label>
                  <Select
                    options={formatOptions}
                    value={formData.format || ''}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value as ContentFormat })}
                  />
                </div>
              )}
              {formData.category === 'niche' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nicho *</label>
                  <Select
                    options={nicheOptions}
                    value={formData.niche || ''}
                    onChange={(e) => setFormData({ ...formData, niche: e.target.value as TrainerNiche })}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Prioridad</label>
                <Select
                  options={priorityOptions}
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'high' | 'medium' | 'low' })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Título *</label>
              <Input
                placeholder="Ej: Reels de ejercicios funcionan mejor en la mañana"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Descripción *</label>
              <Textarea
                placeholder="Describe el aprendizaje..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            {/* Insights */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Aprendizajes clave</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Añadir aprendizaje..."
                  value={newInsight}
                  onChange={(e) => setNewInsight(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addItem('insights', newInsight);
                    }
                  }}
                />
                <Button variant="secondary" size="sm" onClick={() => addItem('insights', newInsight)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.insights.map((insight, i) => (
                  <Badge key={i} variant="blue" size="md" className="flex items-center gap-2">
                    {insight}
                    <button type="button" onClick={() => removeItem('insights', i)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Best Practices */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Mejores prácticas</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Añadir práctica..."
                  value={newBestPractice}
                  onChange={(e) => setNewBestPractice(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addItem('bestPractices', newBestPractice);
                    }
                  }}
                />
                <Button variant="secondary" size="sm" onClick={() => addItem('bestPractices', newBestPractice)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.bestPractices.map((practice, i) => (
                  <Badge key={i} variant="green" size="md" className="flex items-center gap-2">
                    {practice}
                    <button type="button" onClick={() => removeItem('bestPractices', i)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* What Works */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Lo que funciona</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Añadir..."
                  value={newWhatWorks}
                  onChange={(e) => setNewWhatWorks(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addItem('whatWorks', newWhatWorks);
                    }
                  }}
                />
                <Button variant="secondary" size="sm" onClick={() => addItem('whatWorks', newWhatWorks)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.whatWorks.map((item, i) => (
                  <Badge key={i} variant="green" size="md" className="flex items-center gap-2">
                    {item}
                    <button type="button" onClick={() => removeItem('whatWorks', i)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* What Doesn't Work */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Lo que no funciona</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Añadir..."
                  value={newWhatDoesntWork}
                  onChange={(e) => setNewWhatDoesntWork(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addItem('whatDoesntWork', newWhatDoesntWork);
                    }
                  }}
                />
                <Button variant="secondary" size="sm" onClick={() => addItem('whatDoesntWork', newWhatDoesntWork)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.whatDoesntWork.map((item, i) => (
                  <Badge key={i} variant="red" size="md" className="flex items-center gap-2">
                    {item}
                    <button type="button" onClick={() => removeItem('whatDoesntWork', i)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Añadir tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button variant="secondary" size="sm" onClick={addTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, i) => (
                  <Badge key={i} variant="purple" size="md" className="flex items-center gap-2">
                    <Tag className="w-3 h-3" />
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
              <Button variant="secondary" size="md" onClick={resetForm}>
                Cancelar
              </Button>
              <Button variant="primary" size="md" onClick={handleSave} disabled={saving} leftIcon={<Save className="w-4 h-4" />}>
                {saving ? 'Guardando...' : 'Guardar aprendizaje'}
              </Button>
            </div>
          </div>
        )}

        {/* Lista de aprendizajes */}
        {learnings.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">No hay aprendizajes guardados aún</p>
            <Button variant="primary" size="sm" onClick={() => setShowForm(true)} leftIcon={<Plus className="w-4 h-4" />}>
              Crear primer aprendizaje
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {learnings.map((learning) => (
              <div key={learning.id} className="p-5 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{learning.title}</h3>
                      <Badge
                        variant={learning.priority === 'high' ? 'red' : learning.priority === 'medium' ? 'blue' : 'gray'}
                        size="sm"
                      >
                        {learning.priority === 'high' ? 'Alta' : learning.priority === 'medium' ? 'Media' : 'Baja'}
                      </Badge>
                      {learning.format && (
                        <Badge variant="blue" size="sm">
                          {learning.format}
                        </Badge>
                      )}
                      {learning.niche && (
                        <Badge variant="purple" size="sm">
                          {learning.niche}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{learning.description}</p>

                    {learning.insights.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-slate-700 mb-1">Aprendizajes clave:</p>
                        <div className="flex flex-wrap gap-2">
                          {learning.insights.map((insight, i) => (
                            <Badge key={i} variant="blue" size="sm">
                              {insight}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {learning.bestPractices.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-slate-700 mb-1">Mejores prácticas:</p>
                        <div className="flex flex-wrap gap-2">
                          {learning.bestPractices.map((practice, i) => (
                            <Badge key={i} variant="green" size="sm">
                              {practice}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {learning.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {learning.tags.map((tag, i) => (
                          <Badge key={i} variant="purple" size="sm" className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(learning)} leftIcon={<Edit2 className="w-4 h-4" />}>
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(learning.id)}
                      leftIcon={<Trash2 className="w-4 h-4" />}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-slate-400 mt-3">
                  Actualizado {new Date(learning.updatedAt).toLocaleDateString('es-ES')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

