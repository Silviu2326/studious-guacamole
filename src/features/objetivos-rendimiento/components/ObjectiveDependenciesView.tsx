import React, { useState, useEffect } from 'react';
import { Objective, ObjectiveDependency, DependencyImpact } from '../types';
import { getObjectiveDependencies, createObjectiveDependency, deleteObjectiveDependency, calculateDependencyImpact, getObjectives } from '../api/objectives';
import { Card, Button, Modal, Select, Input, Textarea, Badge } from '../../../components/componentsreutilizables';
import { GitBranch, TrendingUp, AlertTriangle, Plus, X, ArrowRight, Target, BarChart3 } from 'lucide-react';

interface ObjectiveDependenciesViewProps {
  objective: Objective;
  onDependencyCreated?: () => void;
}

export const ObjectiveDependenciesView: React.FC<ObjectiveDependenciesViewProps> = ({
  objective,
  onDependencyCreated,
}) => {
  const [dependencies, setDependencies] = useState<{
    feeds: ObjectiveDependency[];
    fedBy: ObjectiveDependency[];
  }>({ feeds: [], fedBy: [] });
  const [impacts, setImpacts] = useState<DependencyImpact[]>([]);
  const [allObjectives, setAllObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDependency, setNewDependency] = useState({
    sourceObjectiveId: '',
    type: 'feeds' as 'feeds' | 'blocks' | 'enables',
    weight: 50,
    description: '',
  });

  useEffect(() => {
    loadData();
  }, [objective.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [deps, allObjs, impactData] = await Promise.all([
        getObjectiveDependencies(objective.id),
        getObjectives({}, 'gimnasio'), // En producción, usar el rol correcto
        calculateDependencyImpact(objective.id),
      ]);
      setDependencies(deps);
      setAllObjectives(allObjs.filter(obj => obj.id !== objective.id));
      setImpacts(impactData);
    } catch (error) {
      console.error('Error loading dependencies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDependency = async () => {
    if (!newDependency.sourceObjectiveId) {
      alert('Por favor, selecciona un objetivo');
      return;
    }

    try {
      await createObjectiveDependency(
        newDependency.sourceObjectiveId,
        objective.id,
        {
          type: newDependency.type,
          weight: newDependency.weight,
          description: newDependency.description || undefined,
        }
      );
      setShowCreateModal(false);
      setNewDependency({
        sourceObjectiveId: '',
        type: 'feeds',
        weight: 50,
        description: '',
      });
      loadData();
      onDependencyCreated?.();
    } catch (error) {
      console.error('Error creating dependency:', error);
      alert('Error al crear la dependencia');
    }
  };

  const handleDeleteDependency = async (dependencyId: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta dependencia?')) {
      return;
    }

    try {
      await deleteObjectiveDependency(dependencyId);
      loadData();
      onDependencyCreated?.();
    } catch (error) {
      console.error('Error deleting dependency:', error);
      alert('Error al eliminar la dependencia');
    }
  };

  const getDependencyTypeLabel = (type: string) => {
    switch (type) {
      case 'feeds':
        return 'Alimenta';
      case 'blocks':
        return 'Bloquea';
      case 'enables':
        return 'Habilita';
      default:
        return type;
    }
  };

  const getDependencyTypeColor = (type: string) => {
    switch (type) {
      case 'feeds':
        return 'blue';
      case 'blocks':
        return 'red';
      case 'enables':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getImpactStatusColor = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'green';
      case 'at_risk':
        return 'yellow';
      case 'blocking':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getImpactStatusLabel = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'En camino';
      case 'at_risk':
        return 'En riesgo';
      case 'blocking':
        return 'Bloqueando';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-600">Cargando dependencias...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Dependencias del Objetivo
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Visualiza cómo otros objetivos impactan en este objetivo y viceversa
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Dependencia
        </Button>
      </div>

      {/* Impact Summary */}
      {impacts.length > 0 && (
        <Card className="p-4 bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-blue-900">Impacto de Dependencias</h4>
          </div>
          <div className="space-y-2">
            {impacts.map((impact) => {
              const sourceObj = allObjectives.find(obj => obj.id === impact.sourceObjectiveId);
              if (!sourceObj) return null;
              
              return (
                <div key={impact.sourceObjectiveId} className="flex items-center justify-between p-2 bg-white rounded">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{sourceObj.title}</span>
                    <Badge variant={getImpactStatusColor(impact.status) as any}>
                      {getImpactStatusLabel(impact.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600">
                      Progreso fuente: {impact.sourceProgress.toFixed(0)}%
                    </span>
                    <span className="font-semibold text-blue-600">
                      Impacto: {impact.impactPercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Objectives that feed this one */}
      {dependencies.fedBy.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-gray-900">Objetivos que Alimentan este Objetivo</h4>
            <Badge variant="blue">{dependencies.fedBy.length}</Badge>
          </div>
          <div className="space-y-3">
            {dependencies.fedBy.map((dep) => {
              const sourceObj = allObjectives.find(obj => obj.id === dep.sourceObjectiveId);
              if (!sourceObj) return null;
              
              const impact = impacts.find(imp => imp.sourceObjectiveId === dep.sourceObjectiveId);
              
              return (
                <div
                  key={dep.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{sourceObj.title}</span>
                        <Badge variant={getDependencyTypeColor(dep.type) as any}>
                          {getDependencyTypeLabel(dep.type)}
                        </Badge>
                        {impact && (
                          <Badge variant={getImpactStatusColor(impact.status) as any}>
                            {getImpactStatusLabel(impact.status)}
                          </Badge>
                        )}
                      </div>
                      {dep.description && (
                        <p className="text-sm text-gray-600 mb-2">{dep.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Peso: {dep.weight}%</span>
                        <span>Progreso: {sourceObj.progress.toFixed(0)}%</span>
                        {impact && (
                          <span className="font-semibold text-blue-600">
                            Impacto: {impact.impactPercentage.toFixed(1)}%
                          </span>
                        )}
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            sourceObj.progress >= 75 ? 'bg-green-600' :
                            sourceObj.progress >= 50 ? 'bg-yellow-600' :
                            'bg-red-600'
                          }`}
                          style={{ width: `${Math.min(sourceObj.progress, 100)}%` }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteDependency(dep.id)}
                      className="ml-4 p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Eliminar dependencia"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Objectives that this one feeds */}
      {dependencies.feeds.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ArrowRight className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900">Objetivos que este Objetivo Alimenta</h4>
            <Badge variant="blue">{dependencies.feeds.length}</Badge>
          </div>
          <div className="space-y-3">
            {dependencies.feeds.map((dep) => {
              const targetObj = allObjectives.find(obj => obj.id === dep.targetObjectiveId);
              if (!targetObj) return null;
              
              return (
                <div
                  key={dep.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{targetObj.title}</span>
                        <Badge variant={getDependencyTypeColor(dep.type) as any}>
                          {getDependencyTypeLabel(dep.type)}
                        </Badge>
                      </div>
                      {dep.description && (
                        <p className="text-sm text-gray-600 mb-2">{dep.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Peso: {dep.weight}%</span>
                        <span>Progreso: {targetObj.progress.toFixed(0)}%</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            targetObj.progress >= 75 ? 'bg-green-600' :
                            targetObj.progress >= 50 ? 'bg-yellow-600' :
                            'bg-red-600'
                          }`}
                          style={{ width: `${Math.min(targetObj.progress, 100)}%` }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteDependency(dep.id)}
                      className="ml-4 p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Eliminar dependencia"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Empty state */}
      {dependencies.fedBy.length === 0 && dependencies.feeds.length === 0 && (
        <Card className="p-8 text-center">
          <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No hay dependencias</h4>
          <p className="text-sm text-gray-600 mb-4">
            Este objetivo no tiene dependencias con otros objetivos aún.
          </p>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Primera Dependencia
          </Button>
        </Card>
      )}

      {/* Create Dependency Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Dependencia"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreateDependency}>
              Crear Dependencia
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm font-medium text-blue-900 mb-1">Objetivo Principal</div>
            <div className="text-sm text-blue-700">{objective.title}</div>
          </div>
          <Select
            label="Objetivo que Alimenta (Secundario)"
            value={newDependency.sourceObjectiveId}
            onChange={(e) => setNewDependency({ ...newDependency, sourceObjectiveId: e.target.value })}
            options={[
              { value: '', label: 'Selecciona un objetivo' },
              ...allObjectives.map(obj => ({
                value: obj.id,
                label: `${obj.title} (${obj.progress.toFixed(0)}%)`,
              })),
            ]}
            required
          />
          <Select
            label="Tipo de Dependencia"
            value={newDependency.type}
            onChange={(e) => setNewDependency({ ...newDependency, type: e.target.value as any })}
            options={[
              { value: 'feeds', label: 'Alimenta - El objetivo secundario contribuye al principal' },
              { value: 'blocks', label: 'Bloquea - El objetivo secundario puede bloquear al principal' },
              { value: 'enables', label: 'Habilita - El objetivo secundario habilita al principal' },
            ]}
          />
          <Input
            label="Peso de la Dependencia (0-100)"
            type="number"
            min="0"
            max="100"
            value={newDependency.weight}
            onChange={(e) => setNewDependency({ ...newDependency, weight: parseInt(e.target.value) || 50 })}
            placeholder="50"
          />
          <Textarea
            label="Descripción (opcional)"
            value={newDependency.description}
            onChange={(e) => setNewDependency({ ...newDependency, description: e.target.value })}
            placeholder="Describe cómo este objetivo impacta al objetivo principal..."
            rows={3}
          />
        </div>
      </Modal>
    </div>
  );
};

