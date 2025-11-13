/**
 * Componente de formación in-app (tutoriales y casos de uso)
 * User Story: Como manager quiero recibir formación in-app (tutoriales, casos de uso)
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Badge } from '../../../components/componentsreutilizables';
import {
  BookOpen,
  Video,
  PlayCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Lightbulb,
  X,
  Search,
  Filter,
} from 'lucide-react';
import {
  getTutorials,
  getUseCases,
  getTutorial,
  getUseCase,
  markTutorialAsCompleted,
  Tutorial,
  UseCase,
} from '../api/inAppTraining';
import { useAuth } from '../../../context/AuthContext';

interface InAppTrainingProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InAppTraining: React.FC<InAppTrainingProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'tutoriales' | 'casos-uso'>('tutoriales');
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      loadTutorials();
      loadUseCases();
    }
  }, [isOpen, categoryFilter]);

  const loadTutorials = async () => {
    setLoading(true);
    try {
      const category = categoryFilter !== 'all' ? (categoryFilter as Tutorial['category']) : undefined;
      const data = await getTutorials(category);
      setTutorials(data);
    } catch (error) {
      console.error('Error loading tutorials:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUseCases = async () => {
    try {
      const category = categoryFilter !== 'all' ? categoryFilter : undefined;
      const data = await getUseCases(category);
      setUseCases(data);
    } catch (error) {
      console.error('Error loading use cases:', error);
    }
  };

  const handleTutorialClick = async (tutorial: Tutorial) => {
    const fullTutorial = await getTutorial(tutorial.id);
    if (fullTutorial) {
      setSelectedTutorial(fullTutorial);
    }
  };

  const handleUseCaseClick = async (useCase: UseCase) => {
    const fullUseCase = await getUseCase(useCase.id);
    if (fullUseCase) {
      setSelectedUseCase(fullUseCase);
    }
  };

  const handleCompleteTutorial = async (tutorialId: string) => {
    if (user?.id) {
      await markTutorialAsCompleted(user.id, tutorialId);
      // Actualizar estado local
      setTutorials(prev =>
        prev.map(t =>
          t.id === tutorialId
            ? { ...t, completedBy: [...(t.completedBy || []), user.id] }
            : t
        )
      );
    }
  };

  const filteredTutorials = tutorials.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredUseCases = useCases.filter(uc =>
    uc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    uc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      basico: 'Básico',
      avanzado: 'Avanzado',
      'casos-uso': 'Casos de Uso',
      'mejores-practicas': 'Mejores Prácticas',
    };
    return labels[category] || category;
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
      <Modal isOpen={isOpen} onClose={onClose} title="Formación In-App" size="xl">
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('tutoriales')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'tutoriales'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen size={18} />
                Tutoriales
              </div>
            </button>
            <button
              onClick={() => setActiveTab('casos-uso')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'casos-uso'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Lightbulb size={18} />
                Casos de Uso
              </div>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar tutoriales o casos de uso..."
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
              <option value="basico">Básico</option>
              <option value="avanzado">Avanzado</option>
              <option value="casos-uso">Casos de Uso</option>
              <option value="mejores-practicas">Mejores Prácticas</option>
            </select>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Cargando...</div>
            </div>
          ) : activeTab === 'tutoriales' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
              {filteredTutorials.map((tutorial) => {
                const isCompleted = user?.id && tutorial.completedBy?.includes(user.id);
                return (
                  <Card
                    key={tutorial.id}
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleTutorialClick(tutorial)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {tutorial.videoUrl ? (
                          <Video className="text-blue-600" size={20} />
                        ) : (
                          <BookOpen className="text-blue-600" size={20} />
                        )}
                        <h3 className="font-semibold text-gray-900">{tutorial.title}</h3>
                      </div>
                      {isCompleted && (
                        <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tutorial.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getDifficultyColor(tutorial.difficulty)}>
                        {tutorial.difficulty}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-700">
                        {getCategoryLabel(tutorial.category)}
                      </Badge>
                      {tutorial.duration && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock size={14} />
                          {tutorial.duration} min
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto">
              {filteredUseCases.map((useCase) => (
                <Card
                  key={useCase.id}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleUseCaseClick(useCase)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{useCase.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <TrendingUp size={16} />
                      {useCase.views} vistas
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{useCase.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-purple-100 text-purple-700">{useCase.category}</Badge>
                    {useCase.industry && (
                      <Badge className="bg-gray-100 text-gray-700">{useCase.industry}</Badge>
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span>👍 {useCase.likes}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Tutorial Detail Modal */}
      {selectedTutorial && (
        <Modal
          isOpen={!!selectedTutorial}
          onClose={() => setSelectedTutorial(null)}
          title={selectedTutorial.title}
          size="lg"
        >
          <div className="space-y-4">
            {selectedTutorial.videoUrl && (
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={selectedTutorial.videoUrl}
                  title={selectedTutorial.title}
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
            <div>
              <h3 className="font-semibold mb-2">Descripción</h3>
              <p className="text-gray-700">{selectedTutorial.description}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Contenido</h3>
              <div className="prose max-w-none">{selectedTutorial.content}</div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {selectedTutorial.tags.map((tag) => (
                <Badge key={tag} className="bg-gray-100 text-gray-700">
                  {tag}
                </Badge>
              ))}
            </div>
            {user?.id && !selectedTutorial.completedBy?.includes(user.id) && (
              <Button
                onClick={() => handleCompleteTutorial(selectedTutorial.id)}
                className="w-full"
              >
                <CheckCircle2 size={18} className="mr-2" />
                Marcar como completado
              </Button>
            )}
          </div>
        </Modal>
      )}

      {/* Use Case Detail Modal */}
      {selectedUseCase && (
        <Modal
          isOpen={!!selectedUseCase}
          onClose={() => setSelectedUseCase(null)}
          title={selectedUseCase.title}
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Escenario</h3>
              <p className="text-gray-700">{selectedUseCase.scenario}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Solución</h3>
              <p className="text-gray-700">{selectedUseCase.solution}</p>
            </div>
            {selectedUseCase.objectives.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Objetivos Relacionados</h3>
                <div className="space-y-2">
                  {selectedUseCase.objectives.map((obj) => (
                    <Card key={obj.id} className="p-3">
                      <h4 className="font-medium">{obj.title}</h4>
                      <p className="text-sm text-gray-600">{obj.description}</p>
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Métrica:</span> {obj.metric} -{' '}
                        <span className="font-medium">Objetivo:</span> {obj.targetValue} {obj.unit}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {selectedUseCase.bestPractices.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Mejores Prácticas</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {selectedUseCase.bestPractices.map((practice, idx) => (
                    <li key={idx}>{practice}</li>
                  ))}
                </ul>
              </div>
            )}
            {selectedUseCase.lessonsLearned.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Lecciones Aprendidas</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {selectedUseCase.lessonsLearned.map((lesson, idx) => (
                    <li key={idx}>{lesson}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

