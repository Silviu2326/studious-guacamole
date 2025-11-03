import React from 'react';
import { Partner, getPartnerTypeLabel, getPartnerStatusLabel, getPartnerStatusColor } from '../api/partnerships';
import { ExternalLink, MoreVertical, TrendingUp, Users, DollarSign } from 'lucide-react';

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
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No hay partners registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.id}
              onClick={() => onSelectPartner(partner.id)}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{partner.name}</h3>
                  {partner.specialty && (
                    <p className="text-sm text-gray-600">{partner.specialty}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium px-2 py-1 rounded bg-purple-100 text-purple-700">
                    {getPartnerTypeLabel(partner.type)}
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${getPartnerStatusColor(partner.status)}`}>
                    {getPartnerStatusLabel(partner.status)}
                  </span>
                </div>
              </div>

              {/* Stats */}
              {partner.stats && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <p className="text-xs text-gray-600 mb-1">Referidos</p>
                    <p className="text-xl font-bold text-blue-700">{partner.stats.totalReferrals}</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <p className="text-xs text-gray-600 mb-1">Conversiones</p>
                    <p className="text-xl font-bold text-green-700">{partner.stats.totalConversions}</p>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <p className="text-xs text-gray-600 mb-1">Tasa</p>
                    <p className="text-xl font-bold text-purple-700">
                      {partner.stats.conversionRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              )}

              {/* Commission Info */}
              <div className="border-t border-gray-200 pt-4 mb-4">
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
              <div className="flex gap-2">
                <button
                  onClick={(e) => handleGenerateLink(e, partner.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  Generar Link
                </button>
                <button
                  onClick={() => onSelectPartner(partner.id)}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

