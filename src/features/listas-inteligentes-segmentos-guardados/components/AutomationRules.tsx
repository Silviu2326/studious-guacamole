import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Badge, Select, Input, Modal } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { AutomationRule } from '../types';
import { Plus, Edit, Trash2, Zap, ToggleLeft, ToggleRight } from 'lucide-react';

// Mock data
const mockAutomationRules: AutomationRule[] = [
  {
    id: 'ar1',
    name: 'Email de Bienvenida',
    segmentId: '1',
    trigger: 'member_added',
    action: 'send_email',
    actionConfig: { template: 'welcome', subject: 'Bienvenido al gimnasio' },
    enabled: true,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    id: 'ar2',
    name: 'SMS de Recordatorio',
    segmentId: '1',
    trigger: 'schedule',
    action: 'send_sms',
    actionConfig: { time: '09:00', message: 'Recordatorio de tu sesión' },
    enabled: true,
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-18T10:15:00Z'
  },
  {
    id: 'ar3',
    name: 'Añadir a Campaña Premium',
    segmentId: '2',
    trigger: 'member_added',
    action: 'add_to_campaign',
    actionConfig: { campaignId: 'camp-123', priority: 'high' },
    enabled: false,
    createdAt: '2024-01-14T13:20:00Z',
    updatedAt: '2024-01-19T16:45:00Z'
  }
];

export const AutomationRulesComponent: React.FC = () => {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setRules([...mockAutomationRules]);
    setLoading(false);
  };

  const handleToggle = (id: string) => {
    setRules(rules.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta regla de automatización?')) {
      setRules(rules.filter(r => r.id !== id));
    }
  };

  const handleEdit = (rule: AutomationRule) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  const getTriggerLabel = (trigger: string) => {
    const labels = {
      member_added: 'Miembro Añadido',
      member_removed: 'Miembro Eliminado',
      segment_updated: 'Segmento Actualizado',
      schedule: 'Programado'
    };
    return labels[trigger as keyof typeof labels] || trigger;
  };

  const getActionLabel = (action: string) => {
    const labels = {
      send_email: 'Enviar Email',
      send_sms: 'Enviar SMS',
      add_to_campaign: 'Añadir a Campaña',
      assign_tag: 'Asignar Etiqueta',
      webhook: 'Webhook'
    };
    return labels[action as keyof typeof labels] || action;
  };

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
      render: (value: string, row: AutomationRule) => (
        <div>
          <div className="font-semibold">{value}</div>
          <div className="text-xs text-gray-500">Segmento: {row.segmentId}</div>
        </div>
      )
    },
    {
      key: 'trigger',
      label: 'Trigger',
      sortable: true,
      render: (value: string) => (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {getTriggerLabel(value)}
        </Badge>
      )
    },
    {
      key: 'action',
      label: 'Acción',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span>{getActionLabel(value)}</span>
        </div>
      )
    },
    {
      key: 'enabled',
      label: 'Estado',
      sortable: true,
      align: 'center' as const,
      render: (value: boolean, row: AutomationRule) => (
        <button
          onClick={() => handleToggle(row.id)}
          className="flex items-center justify-center"
        >
          {value ? (
            <ToggleRight className="w-6 h-6 text-green-600" />
          ) : (
            <ToggleLeft className="w-6 h-6 text-gray-400" />
          )}
        </button>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      align: 'right' as const,
      render: (_: any, row: AutomationRule) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row)}
            title="Editar regla"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.id)}
            title="Eliminar regla"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Reglas de Automatización
            </h3>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-1`}>
              Automatiza acciones basadas en cambios en segmentos
            </p>
          </div>
          <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Regla
          </Button>
        </div>

        <Table
          data={rules}
          columns={columns}
          loading={loading}
          emptyMessage="No se encontraron reglas de automatización"
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRule(null);
        }}
        title={editingRule ? 'Editar Regla de Automatización' : 'Nueva Regla de Automatización'}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Nombre de la Regla"
            placeholder="Ej: Email de bienvenida"
            defaultValue={editingRule?.name || ''}
          />
          <Select
            label="Segmento"
            options={[
              { value: '1', label: 'Segmento 1' },
              { value: '2', label: 'Segmento 2' },
              { value: '3', label: 'Segmento 3' }
            ]}
            defaultValue={editingRule?.segmentId || ''}
          />
          <Select
            label="Trigger"
            options={[
              { value: 'member_added', label: 'Miembro Añadido' },
              { value: 'member_removed', label: 'Miembro Eliminado' },
              { value: 'segment_updated', label: 'Segmento Actualizado' },
              { value: 'schedule', label: 'Programado' }
            ]}
            defaultValue={editingRule?.trigger || ''}
          />
          <Select
            label="Acción"
            options={[
              { value: 'send_email', label: 'Enviar Email' },
              { value: 'send_sms', label: 'Enviar SMS' },
              { value: 'add_to_campaign', label: 'Añadir a Campaña' },
              { value: 'assign_tag', label: 'Asignar Etiqueta' },
              { value: 'webhook', label: 'Webhook' }
            ]}
            defaultValue={editingRule?.action || ''}
          />
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => {
              setIsModalOpen(false);
              setEditingRule(null);
            }}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => {
              alert('Regla guardada (simulado)');
              setIsModalOpen(false);
              setEditingRule(null);
              loadRules();
            }}>
              Guardar Regla
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

