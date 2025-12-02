import React, { useState, useEffect } from 'react';
import { MetricCards, Card, type MetricCardData } from '../../../components/componentsreutilizables';
import { 
  getPartnershipsKPI, 
  PartnershipsKPI 
} from '../api/partnerships';
import { Users, DollarSign, TrendingUp, Award, Send, Inbox, Loader2, AlertCircle } from 'lucide-react';

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
      <Card className="p-8 text-center bg-white shadow-sm">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
        <p className="text-gray-600 mb-4">{error}</p>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  if (!kpiData) return null;

  const metricCardsData: MetricCardData[] = [
    {
      id: 'active-partners',
      title: 'Partners Activos',
      value: kpiData.totalActivePartners,
      color: 'info',
      icon: <Users size={24} />
    },
    {
      id: 'total-commissions',
      title: 'Comisiones Totales',
      value: `€${kpiData.totalCommissionsGenerated.toFixed(2)}`,
      color: 'success',
      icon: <DollarSign size={24} />
    },
    {
      id: 'pending-payments',
      title: 'Pendientes de Pago',
      value: `€${kpiData.totalCommissionsPending.toFixed(2)}`,
      color: 'warning',
      icon: <TrendingUp size={24} />
    },
    {
      id: 'revenue-referrals',
      title: 'Ingresos por Referidos',
      value: `€${kpiData.totalRevenueFromReferrals.toFixed(2)}`,
      color: 'info',
      icon: <Award size={24} />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main KPI Cards */}
      <MetricCards data={metricCardsData} columns={4} />

      {/* Conversion Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Send className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Referidos Enviados</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total</span>
              <span className="text-2xl font-bold text-gray-900">{kpiData.conversionStats.sent.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Convertidos</span>
              <span className="text-2xl font-bold text-green-600">{kpiData.conversionStats.sent.converted}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-900">Tasa de Conversión</span>
              <span className="text-2xl font-bold text-blue-600">
                {kpiData.conversionStats.sent.rate.toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Inbox className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">Referidos Recibidos</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total</span>
              <span className="text-2xl font-bold text-gray-900">{kpiData.conversionStats.received.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Convertidos</span>
              <span className="text-2xl font-bold text-green-600">{kpiData.conversionStats.received.converted}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-900">Tasa de Conversión</span>
              <span className="text-2xl font-bold text-green-600">
                {kpiData.conversionStats.received.rate.toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Partners */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Top Partners</h2>
        </div>

        <div className="space-y-3">
          {kpiData.topPartners.map((partner, index) => (
            <div
              key={partner.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{partner.name}</p>
                  <p className="text-sm text-gray-600">{partner.type === 'influencer' ? 'Influencer' : 'Profesional'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">{partner.conversions} conversiones</p>
                <p className="text-sm text-gray-600">€{partner.commissions.toFixed(2)} comisiones</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

