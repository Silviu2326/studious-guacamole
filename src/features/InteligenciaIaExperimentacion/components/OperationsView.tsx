import React from 'react';
import { DetailViewLayout } from './DetailViewLayout';
import { Smartphone } from 'lucide-react';
import { MobileApprovalSection } from '../components';

interface OperationsViewProps {
    onBack: () => void;
    trainerId?: string;
    onApprovalChange: () => void;
}

export const OperationsView: React.FC<OperationsViewProps> = ({
    onBack,
    trainerId,
    onApprovalChange,
}) => {
    const tabs = [
        { id: 'mobile-approval', label: 'Aprobación Móvil', icon: <Smartphone size={16} /> },
    ];

    return (
        <DetailViewLayout
            title="Operaciones"
            description="Gestiona tus tareas diarias de forma eficiente"
            icon={<Smartphone size={24} />}
            tabs={tabs}
            onBack={onBack}
        >
            <div id="mobile-approval">
                <MobileApprovalSection
                    trainerId={trainerId}
                    onApprovalChange={onApprovalChange}
                />
            </div>
        </DetailViewLayout>
    );
};
