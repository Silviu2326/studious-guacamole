import React, { useState } from 'react';
import { Filter, Megaphone, X, Save } from 'lucide-react';
import { Badge, Button, Input, Modal, Select } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { InsightSource, FunnelCampaignDraft } from '../types';
import { MarketingOverviewService } from '../services/marketingOverviewService';

interface CreateFunnelCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  insight: InsightSource | null;
  onSuccess?: (draft: FunnelCampaignDraft) => void;
}

export const CreateFunnelCampaignModal: React.FC<CreateFunnelCampaignModalProps> = ({
  isOpen,
  onClose,
  insight,
  onSuccess,
}) => {
  const [type, setType] = useState<'funnel' | 'campaign'>('campaign');
  const [name, setName] = useState('');
  const [stage, setStage] = useState<'TOFU' | 'MOFU' | 'BOFU'>('TOFU');
  const [channel, setChannel] = useState('Meta Ads');
  const [objective, setObjective] = useState('');
  const [budget, setBudget] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);

  React.useEffect(() => {
    if (insight && isOpen) {
      // Pre-llenar campos basados en el insight
      if (insight.type === 'suggestion') {
        setName(`Campaña: ${insight.title}`);
        setType('campaign');
        setObjective('Leads');
        setDescription(insight.description);
      } else if (insight.type === 'attribution') {
        setName(`Funnel: ${insight.title}`);
        setType('funnel');
        setStage('MOFU');
        setObjective('Conversión');
        setDescription(insight.description);
      } else {
        setName('');
        setDescription(insight.description);
      }
    }
  }, [insight, isOpen]);

  const handleSave = async () => {
    if (!insight || !name.trim()) return;

    setIsSaving(true);
    try {
      const draft = await MarketingOverviewService.createFunnelCampaign(insight, {
        type,
        name: name.trim(),
        stage: type === 'funnel' ? stage : undefined,
        channel: type === 'campaign' ? channel : undefined,
        objective: objective || undefined,
        budget: budget ? parseFloat(budget) : undefined,
        targetAudience: targetAudience || undefined,
        description: description || undefined,
      });

      setSavedSuccessfully(true);
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(draft);
        }
        handleClose();
      }, 1500);
    } catch (error) {
      console.error('Error creando funnel/campaña:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setName('');
    setStage('TOFU');
    setChannel('Meta Ads');
    setObjective('');
    setBudget('');
    setTargetAudience('');
    setDescription('');
    setSavedSuccessfully(false);
    onClose();
  };

  if (!insight) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Crear funnel o campaña desde insight">
      <div className="space-y-4">
        {/* Información del insight */}
        <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-start gap-2">
            {insight.type === 'suggestion' ? (
              <Megaphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
            ) : (
              <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                {insight.title}
              </p>
              <p className={`text-xs ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                {insight.description}
              </p>
            </div>
          </div>
        </div>

        {/* Tipo */}
        <div>
          <label className={`block ${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Tipo *
          </label>
          <div className="flex gap-2">
            <Button
              variant={type === 'campaign' ? 'primary' : 'secondary'}
              onClick={() => setType('campaign')}
              className="flex-1"
            >
              <Megaphone className="w-4 h-4 mr-2" />
              Campaña
            </Button>
            <Button
              variant={type === 'funnel' ? 'primary' : 'secondary'}
              onClick={() => setType('funnel')}
              className="flex-1"
            >
              <Filter className="w-4 h-4 mr-2" />
              Funnel
            </Button>
          </div>
        </div>

        {/* Nombre */}
        <div>
          <label className={`block ${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Nombre *
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Campaña de retargeting Q4"
            disabled={isSaving}
          />
        </div>

        {/* Stage (solo para funnels) */}
        {type === 'funnel' && (
          <div>
            <Select
              label="Etapa del funnel *"
              value={stage}
              onChange={(e) => setStage(e.target.value as 'TOFU' | 'MOFU' | 'BOFU')}
              disabled={isSaving}
              options={[
                { value: 'TOFU', label: 'TOFU - Top of Funnel (Awareness)' },
                { value: 'MOFU', label: 'MOFU - Middle of Funnel (Consideration)' },
                { value: 'BOFU', label: 'BOFU - Bottom of Funnel (Conversion)' },
              ]}
            />
          </div>
        )}

        {/* Channel (solo para campañas) */}
        {type === 'campaign' && (
          <div>
            <Select
              label="Canal *"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              disabled={isSaving}
              options={[
                { value: 'Meta Ads', label: 'Meta Ads' },
                { value: 'Google Ads', label: 'Google Ads' },
                { value: 'LinkedIn Ads', label: 'LinkedIn Ads' },
                { value: 'TikTok Ads', label: 'TikTok Ads' },
                { value: 'Email', label: 'Email' },
              ]}
            />
          </div>
        )}

        {/* Objective */}
        <div>
          <label className={`block ${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Objetivo
          </label>
          <Input
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder={type === 'funnel' ? 'Ej: Conversión' : 'Ej: Leads'}
            disabled={isSaving}
          />
        </div>

        {/* Budget */}
        <div>
          <label className={`block ${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Presupuesto (€)
          </label>
          <Input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Ej: 500"
            disabled={isSaving}
          />
        </div>

        {/* Target Audience */}
        <div>
          <label className={`block ${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Audiencia objetivo
          </label>
          <Input
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="Ej: Leads que visitaron pricing en últimos 7 días"
            disabled={isSaving}
          />
        </div>

        {/* Description */}
        <div>
          <label className={`block ${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe el funnel o campaña..."
            className={`w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 ${ds.color.textPrimary} ${ds.color.textPrimaryDark} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            rows={3}
            disabled={isSaving}
          />
        </div>

        {savedSuccessfully && (
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <p className={`text-sm text-green-700 dark:text-green-300`}>
              ✓ {type === 'funnel' ? 'Funnel' : 'Campaña'} creado exitosamente
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button variant="secondary" onClick={handleClose} disabled={isSaving}>
            <X className="w-4 h-4" />
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!name.trim() || isSaving || savedSuccessfully}
            className="inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Guardando...' : savedSuccessfully ? 'Guardado' : `Crear ${type === 'funnel' ? 'funnel' : 'campaña'}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

