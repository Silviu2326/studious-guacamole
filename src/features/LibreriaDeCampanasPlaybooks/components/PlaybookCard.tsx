import React from 'react';
import { PlaybookSummary } from '../api/playbooks';
import { Target, Users, DollarSign, Eye, Rocket, Mail, MessageSquare, Globe, Smartphone, Tag } from 'lucide-react';
import { Card, Button } from '../../../components/componentsreutilizables';

interface PlaybookCardProps {
  playbook: PlaybookSummary;
  onPreview: (playbookId: string) => void;
  onActivate: (playbookId: string) => void;
}

export const PlaybookCard: React.FC<PlaybookCardProps> = ({
  playbook,
  onPreview,
  onActivate
}) => {
  const getObjectiveConfig = () => {
    const configs = {
      lead_generation: {
        icon: Target,
        label: 'Captación',
        color: 'bg-blue-100 text-blue-700',
        bgGradient: 'from-blue-500 to-blue-600'
      },
      retention: {
        icon: Users,
        label: 'Retención',
        color: 'bg-green-100 text-green-700',
        bgGradient: 'from-green-500 to-green-600'
      },
      monetization: {
        icon: DollarSign,
        label: 'Monetización',
        color: 'bg-purple-100 text-purple-700',
        bgGradient: 'from-purple-500 to-purple-600'
      }
    };
    return configs[playbook.objective];
  };

  const config = getObjectiveConfig();
  const ObjectiveIcon = config.icon;

  return (
    <Card variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden">
      {/* Header con gradiente */}
      <div className={`bg-gradient-to-br ${config.bgGradient} p-6 text-white`}>
        <div className="flex items-start justify-between mb-4">
          <div className="bg-white bg-opacity-20 backdrop-blur px-3 py-1 rounded-lg flex items-center gap-2">
            <ObjectiveIcon className="w-4 h-4" />
            <span className="text-sm font-medium">{config.label}</span>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2">{playbook.name}</h3>
        <p className="text-sm text-white text-opacity-90 line-clamp-2">
          {playbook.description}
        </p>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Asset Counts */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600">{playbook.assetCounts.emails} Emails</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600">{playbook.assetCounts.socialPosts} Posts</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Globe className="w-4 h-4 text-green-600" />
            <span className="text-gray-600">{playbook.assetCounts.landingPages} Landing</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Smartphone className="w-4 h-4 text-orange-600" />
            <span className="text-gray-600">{playbook.assetCounts.sms} SMS</span>
          </div>
        </div>

        {/* Tags */}
        {playbook.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {playbook.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
            {playbook.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{playbook.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPreview(playbook.id)}
            className="flex-1"
            leftIcon={<Eye size={16} />}
          >
            Previsualizar
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onActivate(playbook.id)}
            className="flex-1"
            leftIcon={<Rocket size={16} />}
          >
            Activar
          </Button>
        </div>
      </div>
    </Card>
  );
};

