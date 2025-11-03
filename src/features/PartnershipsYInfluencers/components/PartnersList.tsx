import React from 'react';
import { Partner, getPartnerTypeLabel, getPartnerStatusLabel, getPartnerStatusColor } from '../api/partnerships';
import { ExternalLink, MoreVertical, Users, Package } from 'lucide-react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';

interface PartnersListProps {
  partners: Partner[];
  onSelectPartner: (partnerId: string) => void;
  onGenerateLink?: (partnerId: string) => void;
}

export const PartnersList: React.FC<PartnersListProps> = ({
  partners,
  onSelectPartner,
  onGenerateLink
}) => {
  const handleGenerateLink = (e: React.MouseEvent, partnerId: string) => {
    e.stopPropagation();
    onGenerateLink?.(partnerId);
  };

  return (
    <div className="space-y-4">
      {partners.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay partners registrados</h3>
          <p className="text-gray-600">Comienza añadiendo tu primer partner o influencer</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {partners.map((partner) => (
            <Card
              key={partner.id}
              variant="hover"
              className="h-full flex flex-col transition-shadow overflow-hidden"
              onClick={() => onSelectPartner(partner.id)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{partner.name}</h3>
                  {partner.specialty && (
                    <p className="text-sm text-gray-600">{partner.specialty}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="gray" leftIcon={<Users size={12} />}>
                    {getPartnerTypeLabel(partner.type)}
                  </Badge>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${getPartnerStatusColor(partner.status)}`}>
                    {getPartnerStatusLabel(partner.status)}
                  </span>
                </div>
              </div>

              {/* Stats */}
              {partner.stats && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 bg-blue-50 rounded-xl">
                    <p className="text-xs text-gray-600 mb-1">Referidos</p>
                    <p className="text-xl font-bold text-blue-700">{partner.stats.totalReferrals}</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-xl">
                    <p className="text-xs text-gray-600 mb-1">Conversiones</p>
                    <p className="text-xl font-bold text-green-700">{partner.stats.totalConversions}</p>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-xl">
                    <p className="text-xs text-gray-600 mb-1">Tasa</p>
                    <p className="text-xl font-bold text-blue-700">
                      {partner.stats.conversionRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              )}

              {/* Commission Info */}
              <div className="border-t border-gray-100 pt-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Comisión</span>
                  <span className="text-lg font-bold text-gray-900">
                    {partner.agreement.commissionValue}
                    {partner.agreement.commissionType === 'percentage' ? '%' : '€'}
                  </span>
                </div>
                {partner.stats && (
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600">Total Comisiones</span>
                    <span className="text-lg font-bold text-green-600">
                      €{partner.stats.totalCommissions.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGenerateLink(e, partner.id);
                  }}
                  leftIcon={<ExternalLink size={16} />}
                >
                  Generar Link
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPartner(partner.id);
                  }}
                  leftIcon={<MoreVertical size={16} />}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

