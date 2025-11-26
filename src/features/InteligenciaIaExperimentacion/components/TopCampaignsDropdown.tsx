import React, { useState, useRef, useEffect } from 'react';
import { Button, Badge } from '../../../components/componentsreutilizables';
import { TopCampaign } from '../types';
import { Trophy, ChevronDown, Copy, Eye, TrendingUp, DollarSign, Users } from 'lucide-react';

interface TopCampaignsDropdownProps {
  campaigns: TopCampaign[];
  onViewDetails?: (campaignId: string) => void;
  onDuplicate?: (campaignId: string) => void;
}

export const TopCampaignsDropdown: React.FC<TopCampaignsDropdownProps> = ({
  campaigns,
  onViewDetails,
  onDuplicate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!campaigns || campaigns.length === 0) {
    return null;
  }

  const top3Campaigns = campaigns.slice(0, 3);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        leftIcon={<Trophy size={16} className="text-amber-500" />}
        className="relative"
      >
        <span className="flex items-center gap-2">
          Mis Top 3 Campañas
          <ChevronDown size={16} className={isOpen ? 'transform rotate-180 transition-transform' : 'transition-transform'} />
        </span>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Trophy size={20} className="text-amber-600" />
                <h3 className="font-semibold text-slate-900">Mis Top 3 Campañas</h3>
              </div>
              <p className="text-sm text-slate-600 mt-1">Campañas más exitosas con métricas clave</p>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {top3Campaigns.map((campaign, index) => (
                <div
                  key={campaign.id}
                  className="p-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="yellow" size="sm" className="w-6 h-6 flex items-center justify-center p-0">
                          {index + 1}
                        </Badge>
                        <h4 className="font-semibold text-slate-900 text-sm">{campaign.name}</h4>
                      </div>
                      <p className="text-xs text-slate-500">{campaign.channel}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <TrendingUp size={12} className="text-emerald-600" />
                        <span className="text-xs text-slate-600">Conversión</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{campaign.conversionRate.toFixed(1)}%</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <DollarSign size={12} className="text-blue-600" />
                        <span className="text-xs text-slate-600">Ingresos</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">
                        ${(campaign.revenue / 1000).toFixed(0)}k
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Users size={12} className="text-purple-600" />
                        <span className="text-xs text-slate-600">Engagement</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{campaign.engagementRate.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <span>{campaign.sent.toLocaleString()} enviados</span>
                    <span>•</span>
                    <span>{campaign.converted.toLocaleString()} convertidos</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onViewDetails?.(campaign.id);
                        setIsOpen(false);
                      }}
                      leftIcon={<Eye size={14} />}
                      className="flex-1 text-xs"
                    >
                      Ver detalles
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onDuplicate?.(campaign.id);
                        setIsOpen(false);
                      }}
                      leftIcon={<Copy size={14} />}
                      className="flex-1 text-xs"
                    >
                      Duplicar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TopCampaignsDropdown;

