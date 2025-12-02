import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Modal, Input, Select, Table } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { CampaignCost, LeadSource } from '../types';
import { ROIService } from '../services/roiService';
import {
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface CampaignCostManagerProps {
  businessType: 'entrenador' | 'gimnasio';
}

export const CampaignCostManager: React.FC<CampaignCostManagerProps> = ({ businessType }) => {
  const { user } = useAuth();
  const [costs, setCosts] = useState<CampaignCost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCost, setEditingCost] = useState<CampaignCost | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [costToDelete, setCostToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadCosts();
  }, [businessType]);

  const loadCosts = async () => {
    setLoading(true);
    try {
      const data = await ROIService.getCampaignCosts({ businessType });
      setCosts(data);
    } catch (error) {
      console.error('Error cargando costos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (costData: Omit<CampaignCost, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    try {
      if (editingCost) {
        await ROIService.updateCampaignCost(editingCost.id, costData);
      } else {
        await ROIService.createCampaignCost({
          ...costData,
          createdBy: user?.id || 'unknown'
        });
      }
      setShowModal(false);
      setEditingCost(null);
      await loadCosts();
    } catch (error) {
      console.error('Error guardando costo:', error);
      alert('Error al guardar el costo de campaña');
    }
  };

  const handleDelete = async () => {
    if (!costToDelete) return;
    try {
      await ROIService.deleteCampaignCost(costToDelete);
      setShowDeleteModal(false);
      setCostToDelete(null);
      await loadCosts();
    } catch (error) {
      console.error('Error eliminando costo:', error);
    }
  };

  const sourceLabels: Record<LeadSource, string> = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    tiktok: 'TikTok',
    whatsapp: 'WhatsApp',
    referido: 'Referido',
    landing_page: 'Landing Page',
    google_ads: 'Google Ads',
    evento: 'Evento',
    visita_centro: 'Visita al Centro',
    campaña_pagada: 'Campaña Pagada',
    contenido_organico: 'Contenido Orgánico',
    otro: 'Otro'
  };

  const columns = [
    {
      key: 'campaignName' as keyof CampaignCost,
      label: 'Campaña',
      render: (value: any, row: CampaignCost) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-[#F1F5F9]">{row.campaignName}</div>
          <div className="text-sm text-gray-600 dark:text-[#94A3B8]">{sourceLabels[row.source]}</div>
        </div>
      )
    },
    {
      key: 'period' as keyof CampaignCost,
      label: 'Período',
      render: (value: any, row: CampaignCost) => (
        <div className="text-sm">
          <div className="text-gray-900 dark:text-[#F1F5F9]">
            {new Date(row.period.start).toLocaleDateString()} - {new Date(row.period.end).toLocaleDateString()}
          </div>
        </div>
      )
    },
    {
      key: 'cost' as keyof CampaignCost,
      label: 'Costo',
      render: (value: any, row: CampaignCost) => (
        <div className="font-semibold text-gray-900 dark:text-[#F1F5F9]">
          {row.cost.toFixed(2)} {row.currency}
        </div>
      )
    },
    {
      key: 'actions' as keyof CampaignCost,
      label: 'Acciones',
      render: (value: any, row: CampaignCost) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingCost(row);
              setShowModal(true);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCostToDelete(row.id);
              setShowDeleteModal(true);
            }}
          >
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-[#F1F5F9]">
            Costos de Campañas
          </h2>
          <p className="text-gray-600 dark:text-[#94A3B8] mt-1">
            Gestiona los costos de tus campañas de marketing por fuente
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditingCost(null);
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Costo
        </Button>
      </div>

      {/* Tabla de costos */}
      <Card>
        <Table
          data={costs}
          columns={columns}
          loading={loading}
          emptyMessage="No hay costos de campañas registrados"
        />
      </Card>

      {/* Modal de crear/editar */}
      <CostFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCost(null);
        }}
        onSave={handleSave}
        cost={editingCost}
        businessType={businessType}
      />

      {/* Modal de eliminar */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setCostToDelete(null);
        }}
        title="Eliminar Costo de Campaña"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setCostToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Eliminar
            </Button>
          </div>
        }
      >
        <p className="text-gray-600 dark:text-[#94A3B8]">
          ¿Estás seguro de que quieres eliminar este costo de campaña? Esta acción no se puede deshacer.
        </p>
      </Modal>
    </div>
  );
};

// Modal de formulario
interface CostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cost: Omit<CampaignCost, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
  cost?: CampaignCost | null;
  businessType: 'entrenador' | 'gimnasio';
}

const CostFormModal: React.FC<CostFormModalProps> = ({ isOpen, onClose, onSave, cost, businessType }) => {
  const [formData, setFormData] = useState({
    source: (cost?.source || 'google_ads') as LeadSource,
    campaignName: cost?.campaignName || '',
    cost: cost?.cost || 0,
    currency: cost?.currency || 'EUR',
    notes: cost?.notes || '',
    periodStart: cost?.period.start ? new Date(cost.period.start).toISOString().split('T')[0] : '',
    periodEnd: cost?.period.end ? new Date(cost.period.end).toISOString().split('T')[0] : ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.campaignName || !formData.periodStart || !formData.periodEnd) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    onSave({
      source: formData.source,
      campaignName: formData.campaignName,
      cost: formData.cost,
      currency: formData.currency,
      notes: formData.notes || undefined,
      period: {
        start: new Date(formData.periodStart),
        end: new Date(formData.periodEnd)
      },
      businessType
    });
  };

  const sourceLabels: Record<LeadSource, string> = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    tiktok: 'TikTok',
    whatsapp: 'WhatsApp',
    referido: 'Referido',
    landing_page: 'Landing Page',
    google_ads: 'Google Ads',
    evento: 'Evento',
    visita_centro: 'Visita al Centro',
    campaña_pagada: 'Campaña Pagada',
    contenido_organico: 'Contenido Orgánico',
    otro: 'Otro'
  };

  const sources: LeadSource[] = businessType === 'entrenador'
    ? ['instagram', 'facebook', 'tiktok', 'whatsapp', 'referido', 'contenido_organico', 'otro']
    : ['google_ads', 'facebook', 'instagram', 'landing_page', 'evento', 'campaña_pagada', 'referido', 'otro'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={cost ? 'Editar Costo de Campaña' : 'Nuevo Costo de Campaña'}
      size="lg"
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
        <Select
          label="Fuente *"
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSource })}
          options={sources.map(source => ({
            value: source,
            label: sourceLabels[source]
          }))}
          required
        />

        <Input
          label="Nombre de la Campaña *"
          value={formData.campaignName}
          onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
          placeholder="Ej: Google Ads - Enero 2024"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Fecha Inicio *"
            type="date"
            value={formData.periodStart}
            onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
            required
          />
          <Input
            label="Fecha Fin *"
            type="date"
            value={formData.periodEnd}
            onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Costo *"
            type="number"
            step="0.01"
            min="0"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
            required
          />
          <Select
            label="Moneda *"
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            options={[
              { value: 'EUR', label: 'EUR' },
              { value: 'USD', label: 'USD' },
              { value: 'GBP', label: 'GBP' }
            ]}
            required
          />
        </div>

        <Input
          label="Notas"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Información adicional sobre la campaña"
        />
      </form>
    </Modal>
  );
};

