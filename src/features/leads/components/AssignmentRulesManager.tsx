import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Modal, Input, Select, Table } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { AssignmentService } from '../services/assignmentService';
import type { AssignmentRule, AssignmentStats } from '../services/assignmentService';

// Re-exportar tipos si es necesario
export type { AssignmentRule, AssignmentStats };
import {
  Plus,
  Edit,
  Trash2,
  Users,
  BarChart3,
  Settings,
  RefreshCw
} from 'lucide-react';

interface AssignmentRulesManagerProps {
  businessType: 'entrenador' | 'gimnasio';
}

export const AssignmentRulesManager: React.FC<AssignmentRulesManagerProps> = ({ businessType }) => {
  const { user } = useAuth();
  const [rules, setRules] = useState<AssignmentRule[]>([]);
  const [stats, setStats] = useState<AssignmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<AssignmentRule | null>(null);

  useEffect(() => {
    if (businessType === 'gimnasio') {
      loadRules();
      loadStats();
    }
  }, [businessType]);

  const loadRules = async () => {
    setLoading(true);
    try {
      const data = await AssignmentService.getAssignmentRules();
      setRules(data);
    } catch (error) {
      console.error('Error cargando reglas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await AssignmentService.getAssignmentStats();
      setStats(data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const handleSave = async (ruleData: Omit<AssignmentRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingRule) {
        await AssignmentService.updateAssignmentRule(editingRule.id, ruleData);
      } else {
        await AssignmentService.createAssignmentRule(ruleData);
      }
      setShowModal(false);
      setEditingRule(null);
      await loadRules();
    } catch (error) {
      console.error('Error guardando regla:', error);
      alert('Error al guardar la regla');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta regla?')) {
      try {
        await AssignmentService.deleteAssignmentRule(id);
        await loadRules();
      } catch (error) {
        console.error('Error eliminando regla:', error);
      }
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      await AssignmentService.updateAssignmentRule(id, { active: !active });
      await loadRules();
    } catch (error) {
      console.error('Error cambiando estado:', error);
    }
  };

  const getRuleTypeLabel = (type: AssignmentRule['type']) => {
    switch (type) {
      case 'round_robin':
        return 'Round Robin';
      case 'by_specialty':
        return 'Por Especialidad';
      case 'by_load':
        return 'Por Carga';
      case 'by_score':
        return 'Por Score';
      case 'by_source':
        return 'Por Fuente';
      default:
        return type;
    }
  };

  const columns = [
    {
      key: 'name' as keyof AssignmentRule,
      label: 'Nombre',
      render: (value: any, row: AssignmentRule) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-[#F1F5F9]">{row.name}</div>
          <div className="text-sm text-gray-600 dark:text-[#94A3B8]">
            {getRuleTypeLabel(row.type)}
          </div>
        </div>
      )
    },
    {
      key: 'priority' as keyof AssignmentRule,
      label: 'Prioridad',
      render: (value: any, row: AssignmentRule) => (
        <span className="text-gray-900 dark:text-[#F1F5F9]">{row.priority}</span>
      )
    },
    {
      key: 'active' as keyof AssignmentRule,
      label: 'Estado',
      render: (value: any, row: AssignmentRule) => (
        <span className={`px-2 py-1 rounded text-xs ${
          row.active
            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
            : 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300'
        }`}>
          {row.active ? 'Activa' : 'Inactiva'}
        </span>
      )
    },
    {
      key: 'actions' as keyof AssignmentRule,
      label: 'Acciones',
      render: (value: any, row: AssignmentRule) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleActive(row.id, row.active)}
            title={row.active ? 'Desactivar' : 'Activar'}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingRule(row);
              setShowModal(true);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
          </Button>
        </div>
      )
    }
  ];

  if (businessType !== 'gimnasio') {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-[#94A3B8]">
          La asignación inteligente solo está disponible para gimnasios
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-[#F1F5F9]">
            Reglas de Asignación
          </h2>
          <p className="text-gray-600 dark:text-[#94A3B8] mt-1">
            Configura cómo se asignan automáticamente los leads a tu equipo
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditingRule(null);
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Regla
        </Button>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          <Card padding="md">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-[#F1F5F9]">
                  {stats.totalUsers}
                </div>
                <div className="text-sm text-gray-600 dark:text-[#94A3B8]">
                  Vendedores
                </div>
              </div>
            </div>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-green-600 dark:text-green-400" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-[#F1F5F9]">
                  {stats.totalAssigned}
                </div>
                <div className="text-sm text-gray-600 dark:text-[#94A3B8]">
                  Asignados
                </div>
              </div>
            </div>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-[#F1F5F9]">
                  {stats.totalReassigned}
                </div>
                <div className="text-sm text-gray-600 dark:text-[#94A3B8]">
                  Reasignados
                </div>
              </div>
            </div>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-[#F1F5F9]">
                  {stats.activeRules}
                </div>
                <div className="text-sm text-gray-600 dark:text-[#94A3B8]">
                  Reglas Activas
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tabla de reglas */}
      <Card>
        <Table
          data={rules}
          columns={columns}
          loading={loading}
          emptyMessage="No hay reglas de asignación configuradas"
        />
      </Card>

      {/* Modal de crear/editar */}
      <AssignmentRuleFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingRule(null);
        }}
        onSave={handleSave}
        rule={editingRule}
      />
    </div>
  );
};

// Modal de formulario
interface AssignmentRuleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: Omit<AssignmentRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  rule?: AssignmentRule | null;
}

const AssignmentRuleFormModal: React.FC<AssignmentRuleFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  rule
}) => {
  const [formData, setFormData] = useState({
    name: rule?.name || '',
    type: rule?.type || 'round_robin',
    priority: rule?.priority || 1,
    active: rule?.active ?? true,
    conditions: rule?.conditions || {},
    settings: rule?.settings || {}
  });

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name || '',
        type: rule.type || 'round_robin',
        priority: rule.priority || 1,
        active: rule.active ?? true,
        conditions: rule.conditions || {},
        settings: rule.settings || {}
      });
    } else {
      setFormData({
        name: '',
        type: 'round_robin',
        priority: 1,
        active: true,
        conditions: {},
        settings: {}
      });
    }
  }, [rule, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Por favor completa el nombre de la regla');
      return;
    }

    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={rule ? 'Editar Regla de Asignación' : 'Nueva Regla de Asignación'}
      size="md"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre de la Regla *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: Asignación por Round Robin"
          required
        />

        <Select
          label="Tipo de Asignación *"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
          options={[
            { value: 'round_robin', label: 'Round Robin (Rotativo)' },
            { value: 'by_specialty', label: 'Por Especialidad' },
            { value: 'by_load', label: 'Por Carga de Trabajo' },
            { value: 'by_score', label: 'Por Score del Lead' },
            { value: 'by_source', label: 'Por Fuente del Lead' }
          ]}
          required
        />

        <Input
          label="Prioridad (1-10) *"
          type="number"
          min="1"
          max="10"
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
          required
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="active"
            checked={formData.active}
            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="active" className="text-sm font-medium text-gray-900 dark:text-[#F1F5F9]">
            Regla activa
          </label>
        </div>
      </form>
    </Modal>
  );
};

