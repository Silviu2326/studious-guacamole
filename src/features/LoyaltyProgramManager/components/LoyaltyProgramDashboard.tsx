import React, { useState, useEffect } from 'react';
import { Card, MetricCards, Button } from '../../../components/componentsreutilizables';
import { getLoyaltyProgram, getLoyaltyRewards, getLoyaltyStats, updateLoyaltyProgram, LoyaltyProgram, LoyaltyReward, LoyaltyStats } from '../api/loyalty';
import { Trophy, Gift, Settings, Plus, Edit, Trash2, TrendingUp, Users, Award, Target, AlertCircle, Power } from 'lucide-react';

export const LoyaltyProgramDashboard: React.FC = () => {
  const [program, setProgram] = useState<LoyaltyProgram | null>(null);
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [stats, setStats] = useState<LoyaltyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [programData, rewardsData, statsData] = await Promise.all([
        getLoyaltyProgram(),
        getLoyaltyRewards(),
        getLoyaltyStats()
      ]);

      setProgram(programData);
      setRewards(rewardsData);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleProgram = async () => {
    if (!program) return;

    try {
      const updated = await updateLoyaltyProgram({ isActive: !program.isActive });
      setProgram(updated);
    } catch (err: any) {
      alert('Error al actualizar el programa: ' + err.message);
    }
  };

  const handleDeleteReward = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta recompensa?')) {
      return;
    }

    try {
      setRewards(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const getRewardTypeIcon = (type: LoyaltyReward['type']) => {
    const icons = {
      physical: Trophy,
      service: Award,
      digital: Target,
      discount: Gift
    };
    return icons[type];
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  // Preparar métricas para MetricCards
  const metrics = stats ? [
    {
      id: 'participation',
      title: 'Tasa de Participación',
      value: `${stats.participationRate.toFixed(1)}%`,
      icon: <Users className="w-5 h-5" />,
      color: 'info' as const
    },
    {
      id: 'points-redeemed',
      title: 'Puntos Canjeados',
      value: stats.totalPointsRedeemed.toLocaleString(),
      subtitle: 'Total acumulado',
      icon: <Gift className="w-5 h-5" />,
      color: 'success' as const
    },
    {
      id: 'avg-points',
      title: 'Promedio Cliente',
      value: `${stats.avgPointsPerClient.toFixed(0)} pts`,
      subtitle: 'Por cliente',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'warning' as const
    }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Program Status */}
      {program && (
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{program.programName}</h2>
              <p className="text-gray-600 mt-1">Programa de Fidelización</p>
            </div>
            <Button
              variant={program.isActive ? 'secondary' : 'ghost'}
              onClick={handleToggleProgram}
              leftIcon={<Power size={20} />}
            >
              {program.isActive ? 'Desactivar Programa' : 'Activar Programa'}
            </Button>
          </div>

          {/* Program Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Niveles Configurados</p>
              <p className="text-3xl font-bold text-blue-700">{program.tiers.length}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Reglas Activas</p>
              <p className="text-3xl font-bold text-blue-700">
                {program.rules.filter(r => r.isActive).length}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Recompensas</p>
              <p className="text-3xl font-bold text-green-700">{rewards.length}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Cards */}
      {stats && metrics.length > 0 && (
        <MetricCards data={metrics} columns={3} />
      )}

      {/* Rewards Catalog */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Catálogo de Recompensas</h2>
          <Button variant="primary" leftIcon={<Plus size={20} />}>
            Añadir Recompensa
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => {
            const TypeIcon = getRewardTypeIcon(reward.type);
            return (
              <Card key={reward.id} variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden">
                {reward.imageUrl && (
                  <img
                    src={reward.imageUrl}
                    alt={reward.name}
                    className="w-full h-48 bg-gray-100 object-cover"
                  />
                )}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <TypeIcon className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {reward.pointsCost} pts
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{reward.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                  {reward.stock !== undefined && (
                    <p className="text-xs text-gray-500 mb-3">Stock: {reward.stock}</p>
                  )}
                  <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                    <Button variant="ghost" size="sm" className="flex-1" leftIcon={<Edit size={16} />}>
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteReward(reward.id)}
                      leftIcon={<Trash2 size={16} />}
                      title="Eliminar"
                    >
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

