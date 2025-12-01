import React from 'react';
import { Modal } from '../../../components/componentsreutilizables';
import { StrategicProfileSetup } from './StrategicProfileSetup';
import { QuarterlyObjectivesSelector } from './QuarterlyObjectivesSelector';
import { StrategicProfile, QuarterlyObjectives } from '../types';

interface StrategicConfigModalProps {
  open: boolean;
  onClose: () => void;
  profile?: StrategicProfile;
  objectives?: QuarterlyObjectives;
  onSaveProfile: (profile: StrategicProfile) => Promise<void>;
  onSaveObjectives: (objectives: QuarterlyObjectives) => Promise<void>;
}

export const StrategicConfigModal: React.FC<StrategicConfigModalProps> = ({
  open,
  onClose,
  profile,
  objectives,
  onSaveProfile,
  onSaveObjectives,
}) => {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Configuración Estratégica"
      size="xl"
      showCloseButton={true}
      closeOnOverlayClick={true}
      closeOnEscape={true}
    >
      <div className="space-y-6">
        <StrategicProfileSetup
          profile={profile}
          onSave={onSaveProfile}
        />
        <QuarterlyObjectivesSelector
          objectives={objectives}
          onSave={onSaveObjectives}
        />
      </div>
    </Modal>
  );
};

