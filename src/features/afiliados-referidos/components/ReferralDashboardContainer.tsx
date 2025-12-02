import React, { useState, useMemo } from 'react';
import { Card, Button, MetricCards } from '../../../components/componentsreutilizables';
import { useReferralStats } from '../hooks/useReferralStats';
import { useReferralPrograms } from '../hooks/useReferralPrograms';
import { ProgramList } from './ProgramList';
import { ProgramConfigurationModal } from './ProgramConfigurationModal';
import { ReferralProgram, ProgramFormData, UserType } from '../types';
import { 
  TrendingUp, 
  Users, 
  MousePointerClick, 
  DollarSign, 
  Award,
  Plus,
  Calendar,
  UserPlus
} from 'lucide-react';

interface ReferralDashboardContainerProps {
  userType: UserType;
}

export const ReferralDashboardContainer: React.FC<ReferralDashboardContainerProps> = ({
  userType,
}) => {
  const { stats, isLoading: statsLoading, fetchStats } = useReferralStats();
  const { programs, isLoading: programsLoading, createProgram, updateProgram } = useReferralPrograms();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ReferralProgram | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const handleCreateProgram = () => {
    setEditingProgram(null);
    setIsModalOpen(true);
  };

  const handleEditProgram = (program: ReferralProgram) => {
    setEditingProgram(program);
    setIsModalOpen(true);
  };

  const handleSubmitProgram = async (programData: ProgramFormData) => {
    try {
      if (editingProgram) {
        await updateProgram(editingProgram.id, programData);
      } else {
        await createProgram({
          name: programData.name,
          startDate: programData.startDate,
          endDate: programData.endDate,
          referrerReward: {
            type: programData.referrerRewardType,
            value: programData.referrerRewardValue,
          },
          referredReward: {
            type: programData.referredRewardType,
            value: programData.referredRewardValue,
          },
          description: programData.description,
          isActive: programData.isActive ?? true,
        });
      }
      setIsModalOpen(false);
      setEditingProgram(null);
    } catch (error) {
      console.error('Error al guardar programa:', error);
    }
  };

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    const newRange = { ...dateRange, [field]: value };
    setDateRange(newRange);
    fetchStats({
      startDate: new Date(newRange.startDate).toISOString(),
      endDate: new Date(newRange.endDate + 'T23:59:59').toISOString(),
    });
  };

  const metrics = useMemo(() => {
    if (!stats) return [];

    const baseMetrics = [
      {
        id: 'total-conversions',
        title: 'Conversiones Totales',
        value: stats.totalConversions.toLocaleString(),
        subtitle: 'Nuevos clientes referidos',
        icon: <Users size={20} />,
        color: 'success' as const,
        trend: stats.conversionRate > 5 ? {
          value: Math.round(stats.conversionRate),
          direction: 'up' as const,
          label: 'tasa de conversión',
        } : undefined,
      },
      {
        id: 'conversion-rate',
        title: 'Tasa de Conversión',
        value: `${stats.conversionRate.toFixed(2)}%`,
        subtitle: `${stats.totalClicks} clics totales`,
        icon: <TrendingUp size={20} />,
        color: 'primary' as const,
      },
      {
        id: 'revenue',
        title: 'Ingresos Generados',
        value: `$${stats.revenueFromReferrals.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        subtitle: 'Por referidos',
        icon: <DollarSign size={20} />,
        color: 'info' as const,
      },
    ];

    // Solo mostrar coste de recompensas para gimnasios
    if (userType === 'gym') {
      baseMetrics.push({
        id: 'rewards-cost',
        title: 'Coste de Recompensas',
        value: `$${stats.totalRewardsCost.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        subtitle: 'Total invertido',
        icon: <Award size={20} />,
        color: 'warning' as const,
      });
    }

    return baseMetrics;
  }, [stats, userType]);

  return (
    <>
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <UserPlus size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Afiliados & Referidos
                  </h1>
                  <p className="text-gray-600">
                    {userType === 'gym' 
                      ? 'Gestiona programas de referidos y analiza su rendimiento'
                      : 'Programa simple de referidos para tus clientes'}
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                onClick={handleCreateProgram}
              >
                <Plus size={20} className="mr-2" />
                Crear Programa
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Filtro de fechas */}
          <Card className="bg-white shadow-sm">
            <div className="p-4">
              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">
                      Período:
                    </span>
                  </div>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                    className="rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                  />
                  <span className="text-slate-600 text-sm">hasta</span>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                    className="rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* KPIs */}
          <MetricCards 
            data={statsLoading ? metrics.map(m => ({ ...m, loading: true })) : metrics}
            columns={userType === 'gym' ? 4 : 3}
          />

          {/* Top Referentes - Solo para gimnasios */}
          {userType === 'gym' && stats && stats.topReferrers.length > 0 && (
            <Card className="bg-white shadow-sm">
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Top Referentes
                </h2>
                <div className="space-y-3">
                  {stats.topReferrers.map((referrer, index) => (
                    <div
                      key={referrer.userId}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-purple-600 font-bold">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {referrer.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {referrer.conversions} {referrer.conversions === 1 ? 'conversión' : 'conversiones'}
                          </p>
                        </div>
                      </div>
                      <Award size={20} className="text-purple-600" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Lista de Programas */}
          <ProgramList
            programs={programs}
            isLoading={programsLoading}
            onEdit={handleEditProgram}
            onCopyCode={(code) => {
              navigator.clipboard.writeText(code);
              // Aquí podrías mostrar un toast de confirmación
            }}
            userType={userType}
          />
        </div>
      </div>

      {/* Modal */}
      <ProgramConfigurationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProgram(null);
        }}
        onSubmit={handleSubmitProgram}
        initialData={editingProgram}
        userType={userType}
      />
    </>
  );
};

