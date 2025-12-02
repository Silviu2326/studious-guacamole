import React, { useEffect } from 'react';
import { Modal } from '../../../../../components/componentsreutilizables/Modal';
import { Button } from '../../../../../components/componentsreutilizables/Button';
import { StepSelection } from './StepSelection';
import { StepConfiguration } from './StepConfiguration';
import { StepPreview } from './StepPreview';
import { useBatchTraining, BatchActionType } from '../../../hooks/useBatchTraining';
import { Zap, ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface BatchTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BatchTrainingModal: React.FC<BatchTrainingModalProps> = ({ isOpen, onClose }) => {
  const { 
    currentStep, 
    selectedAction, 
    config, 
    nextStep, 
    prevStep, 
    selectAction, 
    updateConfig, 
    applyChanges,
    reset
  } = useBatchTraining();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleSelect = (optionId: string) => {
    let action: BatchActionType = null;
    switch (optionId) {
      case 'duplicate': action = 'duplicate_week'; break;
      case 'progression': action = 'linear_progression'; break;
      case 'template': action = 'apply_template'; break;
      case 'adjust': action = 'mass_adjustment'; break;
      case 'reorganize': action = 'reorganize_days'; break;
    }
    selectAction(action);
  };

  const getSelectedOptionId = (): string | null => {
    switch (selectedAction) {
      case 'duplicate_week': return 'duplicate';
      case 'linear_progression': return 'progression';
      case 'apply_template': return 'template';
      case 'mass_adjustment': return 'adjust';
      case 'reorganize_days': return 'reorganize';
      default: return null;
    }
  };

  const handleNext = async () => {
    if (currentStep < 3) {
      nextStep();
    } else {
      await applyChanges();
      onClose();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepSelection onSelect={handleSelect} selectedOption={getSelectedOptionId()} />;
      case 2:
        return <StepConfiguration config={config} onChange={updateConfig} action={selectedAction} />;
      case 3:
        return <StepPreview config={config} action={selectedAction} />;
      default:
        return null;
    }
  };

  const renderFooter = () => {
    return (
      <>
        {currentStep === 1 ? (
            <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        ) : (
            <Button variant="secondary" onClick={prevStep} className="flex items-center gap-2">
                <ArrowLeft size={16} /> Atrás
            </Button>
        )}
        
        <Button 
            variant="primary" 
            onClick={handleNext}
            disabled={currentStep === 1 && !selectedAction}
            className="flex items-center gap-2"
        >
            {currentStep === 3 ? (
                <>
                    <Check size={16} /> Aplicar Cambios
                </>
            ) : (
                <>
                    Siguiente <ArrowRight size={16} />
                </>
            )}
        </Button>
      </>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
            <Zap size={20} className="text-yellow-500" />
            <span>BATCHTRAINING - Paso {currentStep} de 3</span>
        </div>
      }
      size="lg"
      footer={renderFooter()}
      className="transition-all duration-300 ease-in-out"
    >
       {/* Stepper Indicator - Visual only for now */}
      <div className="flex items-center justify-between mb-8 px-4 sm:px-12">
        <div className={`flex flex-col items-center relative z-10 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-300'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep >= 1 ? 'border-blue-600 bg-blue-50 font-bold' : 'border-gray-300 bg-white text-gray-400'}`}>1</div>
            <span className="text-xs mt-2 font-medium">Selección</span>
        </div>
        <div className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
        <div className={`flex flex-col items-center relative z-10 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-300'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep >= 2 ? 'border-blue-600 bg-blue-50 font-bold' : 'border-gray-300 bg-white text-gray-400'}`}>2</div>
            <span className="text-xs mt-2 font-medium">Configuración</span>
        </div>
        <div className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
        <div className={`flex flex-col items-center relative z-10 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-300'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep >= 3 ? 'border-blue-600 bg-blue-50 font-bold' : 'border-gray-300 bg-white text-gray-400'}`}>3</div>
            <span className="text-xs mt-2 font-medium">Preview</span>
        </div>
      </div>

      <div className="min-h-[400px]">
        {renderStep()}
      </div>
    </Modal>
  );
};
