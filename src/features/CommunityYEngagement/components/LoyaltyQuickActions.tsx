import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { MessageSquare, UserPlus, Brain, Sparkles } from 'lucide-react';

interface LoyaltyQuickActionsProps {
  onRequestTestimonial?: () => void;
  onLaunchReferralCampaign?: () => void;
  onCreateSmartSurvey?: () => void;
}

/**
 * Panel de Quick Actions de Fidelización
 * 
 * Agrupa las acciones clave para fidelización:
 * - Solicitar testimonios
 * - Lanzar campañas de referidos
 * - Crear encuestas inteligentes
 */
export const LoyaltyQuickActions: React.FC<LoyaltyQuickActionsProps> = ({
  onRequestTestimonial,
  onLaunchReferralCampaign,
  onCreateSmartSurvey,
}) => {
  const actions = [
    {
      id: 'testimonial',
      title: 'Pide un testimonio',
      description: 'Solicita testimonios de clientes satisfechos para aumentar la confianza',
      icon: <MessageSquare size={24} className="text-blue-600" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:bg-blue-100',
      onClick: onRequestTestimonial || (() => console.log('Solicitar testimonio')),
    },
    {
      id: 'referral',
      title: 'Lanza una campaña de referidos',
      description: 'Crea programas de referidos para atraer nuevos clientes',
      icon: <UserPlus size={24} className="text-green-600" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverColor: 'hover:bg-green-100',
      onClick: onLaunchReferralCampaign || (() => console.log('Lanzar campaña de referidos')),
    },
    {
      id: 'smart-survey',
      title: 'Crea una encuesta inteligente',
      description: 'Diseña encuestas inteligentes con IA para obtener insights valiosos',
      icon: <Brain size={24} className="text-indigo-600" />,
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      hoverColor: 'hover:bg-indigo-100',
      onClick: onCreateSmartSurvey || (() => console.log('Crear encuesta inteligente')),
      badge: (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
          <Sparkles size={12} />
          IA
        </span>
      ),
    },
  ];

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Acciones Rápidas de Fidelización
        </h3>
        <p className="text-sm text-gray-600">
          Acciones clave para mejorar la fidelización y engagement de tus clientes
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`
              relative flex flex-col items-start p-5 rounded-xl border-2 transition-all
              ${action.bgColor} ${action.borderColor} ${action.hoverColor}
              hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
              text-left group
            `}
          >
            <div className="flex items-start justify-between w-full mb-3">
              <div className={`p-2 rounded-lg ${action.bgColor.replace('50', '100')} group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              {action.badge}
            </div>
            
            <h4 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-gray-950">
              {action.title}
            </h4>
            
            <p className="text-sm text-gray-600 leading-relaxed">
              {action.description}
            </p>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default LoyaltyQuickActions;

