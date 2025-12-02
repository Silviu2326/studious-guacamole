import React, { useState } from 'react';
import { ReferralCampaign, RewardType } from '../api/referrals';
import { ChevronRight, Calendar, Gift, Target } from 'lucide-react';
import { Modal, Button, Input, Select, Textarea } from '../../../components/componentsreutilizables';

interface CampaignWizardProps {
  onSubmit: (campaignData: Omit<ReferralCampaign, 'id' | 'stats'>) => void;
  onCancel: () => void;
  initialCampaignData?: Partial<ReferralCampaign>;
}

export const CampaignWizard: React.FC<CampaignWizardProps> = ({ onSubmit, onCancel, initialCampaignData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignName, setCampaignName] = useState(initialCampaignData?.name || '');
  const [startDate, setStartDate] = useState(initialCampaignData?.startDate || '');
  const [endDate, setEndDate] = useState(initialCampaignData?.endDate || '');
  const [referrerRewardType, setReferrerRewardType] = useState<RewardType>(
    initialCampaignData?.referrerReward?.type || 'free_sessions'
  );
  const [referrerRewardValue, setReferrerRewardValue] = useState(
    initialCampaignData?.referrerReward?.value || 0
  );
  const [referredRewardType, setReferredRewardType] = useState<RewardType>(
    initialCampaignData?.referredReward?.type || 'percentage_discount'
  );
  const [referredRewardValue, setReferredRewardValue] = useState(
    initialCampaignData?.referredReward?.value || 0
  );
  const [termsAndConditions, setTermsAndConditions] = useState(
    initialCampaignData?.termsAndConditions || ''
  );

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const campaignData: Omit<ReferralCampaign, 'id' | 'stats'> = {
      name: campaignName,
      status: 'active',
      startDate,
      endDate,
      referrerReward: {
        type: referrerRewardType,
        value: referrerRewardValue
      },
      referredReward: {
        type: referredRewardType,
        value: referredRewardValue
      },
      termsAndConditions
    };

    onSubmit(campaignData);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return campaignName && startDate && endDate && new Date(endDate) > new Date(startDate);
      case 2:
        return referrerRewardValue > 0 && referredRewardValue > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const rewardTypeOptions = [
    { value: 'free_sessions', label: 'Sesiones Gratis' },
    { value: 'percentage_discount', label: 'Descuento Porcentual' },
    { value: 'fixed_discount', label: 'Descuento Fijo' },
    { value: 'content_access', label: 'Acceso a Contenido' },
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title="Nueva Campaña de Referidos"
      size="lg"
      footer={
        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={currentStep > 1 ? handlePrevious : onCancel}
          >
            {currentStep > 1 ? 'Anterior' : 'Cancelar'}
          </Button>
          {currentStep < 3 ? (
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              Siguiente
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!isStepValid()}
            >
              Crear Campaña
            </Button>
          )}
        </div>
      }
    >
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-6 pb-4 border-b border-gray-200">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${
                  currentStep >= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Información Básica
              </h3>
            </div>

            <div className="space-y-4">
              <Input
                label="Nombre de la Campaña *"
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Ej: Reto de Verano"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Fecha de Inicio *"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />

                <Input
                  label="Fecha de Fin *"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Rewards */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Gift className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Recompensas
              </h3>
            </div>

            <div className="space-y-6">
              {/* Referrer Reward */}
              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Recompensa para el Referente</h4>
                <div className="space-y-3">
                  <Select
                    label="Tipo de Recompensa"
                    options={rewardTypeOptions}
                    value={referrerRewardType}
                    onChange={(e) => setReferrerRewardType(e.target.value as RewardType)}
                  />
                  <Input
                    label="Valor"
                    type="number"
                    value={referrerRewardValue.toString()}
                    onChange={(e) => setReferrerRewardValue(parseInt(e.target.value) || 0)}
                    placeholder="Valor"
                  />
                </div>
              </div>

              {/* Referred Reward */}
              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Recompensa para el Referido</h4>
                <div className="space-y-3">
                  <Select
                    label="Tipo de Recompensa"
                    options={rewardTypeOptions}
                    value={referredRewardType}
                    onChange={(e) => setReferredRewardType(e.target.value as RewardType)}
                  />
                  <Input
                    label="Valor"
                    type="number"
                    value={referredRewardValue.toString()}
                    onChange={(e) => setReferredRewardValue(parseInt(e.target.value) || 0)}
                    placeholder="Valor"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Terms */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Términos y Condiciones
              </h3>
            </div>

            <Textarea
              label="Términos (Opcional)"
              value={termsAndConditions}
              onChange={(e) => setTermsAndConditions(e.target.value)}
              placeholder="Ej: La recompensa se aplica solo cuando el referido contrata un plan mensual."
              rows={4}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

