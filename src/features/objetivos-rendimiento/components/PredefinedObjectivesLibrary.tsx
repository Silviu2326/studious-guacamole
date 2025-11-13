/**
 * Componente de librería de objetivos predefinidos
 * User Story: Como manager quiero acceso a librerías de objetivos predefinidos
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Badge, Input, Select } from '../../../components/componentsreutilizables';
import {
  Library,
  Target,
  TrendingUp,
  Filter,
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  Plus,
} from 'lucide-react';
import {
  getPredefinedTemplates,
  getLibraries,
  getPredefinedTemplate,
  createObjectiveFromTemplate,
  incrementTemplateUsage,
  PredefinedObjectiveTemplate,
  ObjectiveLibrary,
} from '../api/predefinedObjectives';
import { Objective } from '../types';
import { useAuth } from '../../../context/AuthContext';

interface PredefinedObjectivesLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onObjectiveCreated?: (objective: Objective) => void;
}

export const PredefinedObjectivesLibrary: React.FC<PredefinedObjectivesLibraryProps> = ({
  isOpen,
  onClose,
  onObjectiveCreated,
}) => {
  const { user } = useAuth();
  const [libraries, setLibraries] = useState<ObjectiveLibrary[]>([]);
  const [templates, setTemplates] = useState<PredefinedObjectiveTemplate[]>([]);
  const [selectedLibrary, setSelectedLibrary] = useState<ObjectiveLibrary | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PredefinedObjectiveTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customizations, setCustomizations] = useState({
    targetValue: 0,
    deadline: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadLibraries();
      loadTemplates();
    }
  }, [isOpen, categoryFilter]);

  const loadLibraries = async () => {
    try {
      const data = await getLibraries();
      setLibraries(data);
      if (data.length > 0 && !selectedLibrary) {
        setSelectedLibrary(data[0]);
      }
    } catch (error) {
      console.error('Error loading libraries:', error);
    }
  };

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (categoryFilter !== 'all') {
        filters.category = categoryFilter;
      }
      if (user?.role) {
        filters.role = user.role;
      }
      const data = await getPredefinedTemplates(filters);
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateClick = async (template: PredefinedObjectiveTemplate) => {
    const fullTemplate = await getPredefinedTemplate(template.id);
    if (fullTemplate) {
      setSelectedTemplate(fullTemplate);
      setCustomizations({
        targetValue: fullTemplate.suggestedTargetValue,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
    }
  };

  const handleCreateObjective = async () => {
    if (!selectedTemplate) return;

    try {
      setLoading(true);
      const objective = await createObjectiveFromTemplate(selectedTemplate.id, {
        targetValue: customizations.targetValue,
        deadline: customizations.deadline,
        responsible: user?.id,
      });
      
      await incrementTemplateUsage(selectedTemplate.id);
      
      if (onObjectiveCreated) {
        onObjectiveCreated(objective);
      }
      
      setShowCreateModal(false);
      setSelectedTemplate(null);
      onClose();
    } catch (error) {
      console.error('Error creating objective:', error);
      alert('Error al crear el objetivo. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getSuccessRateColor = (rate?: number) => {
    if (!rate) return 'bg-gray-100 text-gray-700';
    if (rate >= 70) return 'bg-green-100 text-green-700';
    if (rate >= 50) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      principiante: 'bg-green-100 text-green-700',
      intermedio: 'bg-yellow-100 text-yellow-700',
      avanzado: 'bg-red-100 text-red-700',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-700';
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Librería de Objetivos Predefinidos" size="xl">
        <div className="space-y-6">
          {/* Libraries Tabs */}
          {libraries.length > 0 && (
            <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto">
              {libraries.map((library) => (
                <button
                  key={library.id}
                  onClick={() => {
                    setSelectedLibrary(library);
                    setCategoryFilter(library.category);
                  }}
                  className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                    selectedLibrary?.id === library.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Library size={18} />
                    {library.name}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Search and Filters */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar objetivos predefinidos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas las categorías</option>
              <option value="finanzas">Finanzas</option>
              <option value="retencion">Retención</option>
              <option value="operaciones">Operaciones</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>

          {/* Templates Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Cargando...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleTemplateClick(template)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Target className="text-blue-600" size={20} />
                      <h3 className="font-semibold text-gray-900">{template.title}</h3>
                    </div>
                    {template.isOfficial && (
                      <Badge className="bg-blue-100 text-blue-700">
                        <Sparkles size={12} className="mr-1" />
                        Oficial
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Métrica:</span>
                      <span className="text-gray-700">{template.metric}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Objetivo sugerido:</span>
                      <span className="text-gray-700">
                        {template.suggestedTargetValue} {template.unit}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getDifficultyColor(template.difficulty)}>
                        {template.difficulty}
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-700">{template.category}</Badge>
                      {template.successRate !== undefined && (
                        <Badge className={getSuccessRateColor(template.successRate)}>
                          {template.successRate}% éxito
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <TrendingUp size={14} />
                        {template.usageCount} usos
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Template Detail and Create Modal */}
      {selectedTemplate && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedTemplate(null);
          }}
          title={`Crear Objetivo: ${selectedTemplate.title}`}
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Descripción</h3>
              <p className="text-gray-700">{selectedTemplate.description}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Mejores Prácticas</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {selectedTemplate.bestPractices.map((practice, idx) => (
                  <li key={idx}>{practice}</li>
                ))}
              </ul>
            </div>

            {selectedTemplate.commonPitfalls.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="text-yellow-600" size={18} />
                  Errores Comunes
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {selectedTemplate.commonPitfalls.map((pitfall, idx) => (
                    <li key={idx}>{pitfall}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold">Personalizar Objetivo</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Objetivo
                </label>
                <Input
                  type="number"
                  value={customizations.targetValue}
                  onChange={(e) =>
                    setCustomizations({
                      ...customizations,
                      targetValue: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder={selectedTemplate.suggestedTargetValue.toString()}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Valor sugerido: {selectedTemplate.suggestedTargetValue} {selectedTemplate.unit}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Límite
                </label>
                <Input
                  type="date"
                  value={customizations.deadline}
                  onChange={(e) =>
                    setCustomizations({ ...customizations, deadline: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleCreateObjective}
                disabled={loading}
                className="flex-1"
              >
                <Plus size={18} className="mr-2" />
                Crear Objetivo
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedTemplate(null);
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Template Preview Modal */}
      {selectedTemplate && !showCreateModal && (
        <Modal
          isOpen={!!selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          title={selectedTemplate.title}
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Descripción</h3>
              <p className="text-gray-700">{selectedTemplate.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600">Métrica</span>
                <p className="text-gray-900">{selectedTemplate.metric}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Valor Objetivo Sugerido</span>
                <p className="text-gray-900">
                  {selectedTemplate.suggestedTargetValue} {selectedTemplate.unit}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Categoría</span>
                <p className="text-gray-900">{selectedTemplate.category}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Dificultad</span>
                <Badge className={getDifficultyColor(selectedTemplate.difficulty)}>
                  {selectedTemplate.difficulty}
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Mejores Prácticas</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {selectedTemplate.bestPractices.map((practice, idx) => (
                  <li key={idx}>{practice}</li>
                ))}
              </ul>
            </div>

            {selectedTemplate.commonPitfalls.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="text-yellow-600" size={18} />
                  Errores Comunes
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {selectedTemplate.commonPitfalls.map((pitfall, idx) => (
                    <li key={idx}>{pitfall}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center gap-3 pt-4 border-t">
              <Button onClick={() => setShowCreateModal(true)} className="flex-1">
                <Plus size={18} className="mr-2" />
                Usar este Template
              </Button>
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                Cerrar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

