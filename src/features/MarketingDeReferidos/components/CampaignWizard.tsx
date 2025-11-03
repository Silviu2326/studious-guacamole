import React, { useState } from 'react';
import { ReferralCampaign, RewardType } from '../api/referrals';
import { X, ChevronRight, Calendar, Gift, Target } from 'lucide-react';

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Nueva Campaña de Referidos</h2>
            <button
              onClick={onCancel}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      currentStep >= step
                        ? 'bg-purple-600 text-white'
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
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Información Básica
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Campaña *
                    </label>
                    <input
                      type="text"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      placeholder="Ej: Reto de Verano"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Inicio *
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Fin *
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Rewards */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-purple-600" />
                  Recompensas
                </h3>

                <div className="space-y-6">
                  {/* Referrer Reward */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Recompensa para el Referente</h4>
                    <div className="space-y-3">
                      <select
                        value={referrerRewardType}
                        onChange={(e) => setReferrerRewardType(e.target.value as RewardType)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="free_sessions">Sesiones Gratis</option>
                        <option value="percentage_discount">Descuento Porcentual</option>
                        <option value="fixed_discount">Descuento Fijo</option>
                        <option value="content_access">Acceso a Contenido</option>
                      </select>
                      <input
                        type="number"
                        value={referrerRewardValue}
                        onChange={(e) => setReferrerRewardValue(parseInt(e.target.value) || 0)}
                        placeholder="Valor"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Referred Reward */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Recompensa para el Referido</h4>
                    <div className="space-y-3">
                      <select
                        value={referredRewardType}
                        onChange={(e) => setReferredRewardType(e.target.value as RewardType)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="free_sessions">Sesiones Gratis</option>
                        <option value="percentage_discount">Descuento Porcentual</option>
                        <option value="fixed_discount">Descuento Fijo</option>
                        <option value="content_access">Acceso a Contenido</option>
                      </select>
                      <input
                        type="number"
                        value={referredRewardValue}
                        onChange={(e) => setReferredRewardValue(parseInt(e.target.value) || 0)}
                        placeholder="Valor"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Terms */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Términos y Condiciones
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Términos (Opcional)
                  </label>
                  <textarea
                    value={termsAndConditions}
                    onChange={(e) => setTermsAndConditions(e.target.value)}
                    placeholder="Ej: La recompensa se aplica solo cuando el referido contrata un plan mensual."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <div className="flex justify-between">
            <button
              onClick={currentStep > 1 ? handlePrevious : onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              {currentStep > 1 ? 'Anterior' : 'Cancelar'}
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Crear Campaña
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

