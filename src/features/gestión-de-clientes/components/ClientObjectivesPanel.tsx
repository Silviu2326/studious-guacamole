import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Badge, Modal, Input, Textarea } from '../../../components/componentsreutilizables';
import { ClientObjective } from '../types';
import { 
  getClientObjectives, 
  createClientObjective, 
  updateClientObjective, 
  deleteClientObjective 
} from '../api/client-objectives';
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface ClientObjectivesPanelProps {
  clientId: string;
}

export const ClientObjectivesPanel: React.FC<ClientObjectivesPanelProps> = ({ clientId }) => {
  const { user } = useAuth();
  const [objectives, setObjectives] = useState<ClientObjective[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingObjective, setEditingObjective] = useState<ClientObjective | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetValue: '',
    currentValue: '',
    unit: 'kg',
    deadline: '',
    category: 'fitness' as ClientObjective['category'],
  });

  useEffect(() => {
    loadObjectives();
  }, [clientId]);

  const loadObjectives = async () => {
    setLoading(true);
    try {
      const data = await getClientObjectives(clientId);
      setObjectives(data);
    } catch (error) {
      console.error('Error cargando objetivos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (objective?: ClientObjective) => {
    if (objective) {
      setEditingObjective(objective);
      setFormData({
        title: objective.title,
        description: objective.description || '',
        targetValue: objective.targetValue.toString(),
        currentValue: objective.currentValue.toString(),
        unit: objective.unit,
        deadline: objective.deadline,
        category: objective.category,
      });
    } else {
      setEditingObjective(null);
      setFormData({
        title: '',
        description: '',
        targetValue: '',
        currentValue: '',
        unit: 'kg',
        deadline: '',
        category: 'fitness',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingObjective(null);
  };

  const handleSave = async () => {
    try {
      if (editingObjective) {
        await updateClientObjective(editingObjective.id, {
          title: formData.title,
          description: formData.description,
          targetValue: parseFloat(formData.targetValue),
          currentValue: parseFloat(formData.currentValue),
          unit: formData.unit,
          deadline: formData.deadline,
          category: formData.category,
        });
      } else {
        await createClientObjective({
          clientId,
          title: formData.title,
          description: formData.description,
          targetValue: parseFloat(formData.targetValue),
          currentValue: parseFloat(formData.currentValue),
          unit: formData.unit,
          deadline: formData.deadline,
          category: formData.category,
          status: 'not_started',
          createdBy: user?.role === 'entrenador' ? 'trainer' : 'client',
        });
      }
      await loadObjectives();
      handleCloseModal();
    } catch (error) {
      console.error('Error guardando objetivo:', error);
    }
  };

  const handleDelete = async (objectiveId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este objetivo?')) {
      try {
        await deleteClientObjective(objectiveId);
        await loadObjectives();
      } catch (error) {
        console.error('Error eliminando objetivo:', error);
      }
    }
  };

  const getStatusBadge = (status: ClientObjective['status']) => {
    switch (status) {
      case 'achieved':
        return <Badge variant="green">Alcanzado</Badge>;
      case 'in_progress':
        return <Badge variant="blue">En Progreso</Badge>;
      case 'at_risk':
        return <Badge variant="yellow">En Riesgo</Badge>;
      case 'failed':
        return <Badge variant="red">No Alcanzado</Badge>;
      default:
        return <Badge variant="gray">No Iniciado</Badge>;
    }
  };

  const getCategoryLabel = (category: ClientObjective['category']) => {
    const labels: Record<ClientObjective['category'], string> = {
      fitness: 'Fitness',
      nutrition: 'Nutrición',
      health: 'Salud',
      weight: 'Peso',
      strength: 'Fuerza',
      endurance: 'Resistencia',
      other: 'Otro',
    };
    return labels[category];
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando objetivos...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                <Target size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Mis Objetivos
                </h3>
                <p className="text-sm text-gray-600">
                  Gestiona tus objetivos y sigue tu progreso
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => handleOpenModal()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Objetivo
            </Button>
          </div>
        </div>

        <div className="p-6">
          {objectives.length === 0 ? (
            <div className="text-center py-8">
              <Target size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">No tienes objetivos definidos</p>
              <Button variant="primary" onClick={() => handleOpenModal()}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Objetivo
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {objectives.map((objective) => (
                <div
                  key={objective.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {objective.title}
                        </h4>
                        {getStatusBadge(objective.status)}
                        <Badge variant="gray">{getCategoryLabel(objective.category)}</Badge>
                      </div>
                      {objective.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {objective.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>
                            {objective.currentValue} / {objective.targetValue} {objective.unit}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Fecha límite: {new Date(objective.deadline).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal(objective)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(objective.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Progreso</span>
                      <span>{Math.round(objective.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          objective.progress >= 100
                            ? 'bg-green-500'
                            : objective.progress >= 50
                            ? 'bg-blue-500'
                            : objective.progress >= 25
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, objective.progress)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={editingObjective ? 'Editar Objetivo' : 'Nuevo Objetivo'}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Perder 5 kg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe tu objetivo..."
                rows={3}
                className="min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Actual
                </label>
                <Input
                  type="number"
                  value={formData.currentValue}
                  onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Objetivo
                </label>
                <Input
                  type="number"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unidad
                </label>
                <Input
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="kg, km, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ClientObjective['category'] })}
                >
                  <option value="fitness">Fitness</option>
                  <option value="nutrition">Nutrición</option>
                  <option value="health">Salud</option>
                  <option value="weight">Peso</option>
                  <option value="strength">Fuerza</option>
                  <option value="endurance">Resistencia</option>
                  <option value="other">Otro</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Límite
              </label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleSave}>
                {editingObjective ? 'Actualizar' : 'Crear'} Objetivo
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

