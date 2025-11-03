import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { 
  getPartnershipsKPI, 
  PartnershipsKPI 
} from '../api/partnerships';
import { Users, DollarSign, TrendingUp, Award, Send, Inbox } from 'lucide-react';

interface PartnersDashboardContainerProps {
  trainerId: string;
}

export const PartnersDashboardContainer: React.FC<PartnersDashboardContainerProps> = ({ 
  trainerId 
}) => {
  const [kpiData, setKpiData] = useState<PartnershipsKPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadKPIs();
  }, [trainerId]);

  const loadKPIs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getPartnershipsKPI();
      setKpiData(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las estadísticas');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <TrendingUp className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!kpiData) return null;

  return (
    <div className="space-y-6">
      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Partners Activos</h3>
          <p className="text-3xl font-bold text-gray-900">{kpiData.totalActivePartners}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Comisiones Totales</h3>
          <p className="text-3xl font-bold text-gray-900">€{kpiData.totalCommissionsGenerated.toFixed(2)}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Pendientes de Pago</h3>
          <p className="text-3xl font-bold text-gray-900">€{kpiData.totalCommissionsPending.toFixed(2)}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Ingresos por Referidos</h3>
          <p className="text-3xl font-bold text-gray-900">€{kpiData.totalRevenueFromReferrals.toFixed(2)}</p>
        </Card>
      </div>

      {/* Conversion Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Send className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Referidos Enviados</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total</span>
              <span className="text-2xl font-bold text-gray-900">{kpiData.conversionStats.sent.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Convertidos</span>
              <span className="text-2xl font-bold text-green-600">{kpiData.conversionStats.sent.converted}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t">
              <span className="font-semibold text-gray-900">Tasa de Conversión</span>
              <span className="text-2xl font-bold text-blue-600">
                {kpiData.conversionStats.sent.rate.toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Inbox className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">Referidos Recibidos</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total</span>
              <span className="text-2xl font-bold text-gray-900">{kpiData.conversionStats.received.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Convertidos</span>
              <span className="text-2xl font-bold text-green-600">{kpiData.conversionStats.received.converted}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t">
              <span className="font-semibold text-gray-900">Tasa de Conversión</span>
              <span className="text-2xl font-bold text-green-600">
                {kpiData.conversionStats.received.rate.toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Partners */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Top Partners</h2>
        </div>

        <div className="space-y-3">
          {kpiData.topPartners.map((partner, index) => (
            <div
              key={partner.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{partner.name}</p>
                  <p className="text-sm text-gray-600">{partner.type === 'influencer' ? 'Influencer' : 'Profesional'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-purple-600">{partner.conversions} conversiones</p>
                <p className="text-sm text-gray-600">€{partner.commissions.toFixed(2)} comisiones</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

