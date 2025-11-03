import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Deal } from '../api/abm';
import { Building2, DollarSign, Calendar, TrendingUp } from 'lucide-react';

interface DealCardProps {
  deal: Deal;
  onClick?: () => void;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, onClick }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <Card
      variant="hover"
      padding="sm"
      onClick={onClick}
      className="h-full flex flex-col transition-shadow overflow-hidden bg-white shadow-sm"
    >
      {/* Título */}
      <h3 className="font-semibold text-gray-900 mb-2 text-sm">
        {deal.title}
      </h3>

      {/* Cuenta */}
      <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
        <Building2 className="w-3 h-3" />
        <span>{deal.accountName}</span>
      </div>

      {/* Valor */}
      <div className="flex items-center gap-2 mb-3">
        <DollarSign className="w-4 h-4 text-green-600" />
        <span className="font-bold text-green-700 text-sm">
          {formatCurrency(deal.value)}
        </span>
      </div>

      {/* Probabilidad y próxima acción */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
        {deal.probability !== undefined && (
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-blue-500" />
            <span className="text-xs text-gray-600">{deal.probability}%</span>
          </div>
        )}
        {deal.nextStepDate && (
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">
              {formatDate(deal.nextStepDate)}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};


