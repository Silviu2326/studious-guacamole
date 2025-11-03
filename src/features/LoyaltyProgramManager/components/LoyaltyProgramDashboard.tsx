import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Program Status */}
      {program && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{program.programName}</h2>
              <p className="text-gray-600 mt-1">Programa de Fidelización</p>
            </div>
            <button
              onClick={handleToggleProgram}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                program.isActive
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Power className="w-5 h-5" />
              {program.isActive ? 'Desactivar Programa' : 'Activar Programa'}
            </button>
          </div>

          {/* Program Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Niveles Configurados</p>
              <p className="text-3xl font-bold text-purple-700">{program.tiers.length}</p>
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
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Tasa de Participación</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.participationRate.toFixed(1)}%</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Gift className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Puntos Canjeados</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalPointsRedeemed.toLocaleString()}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Promedio Cliente</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.avgPointsPerClient.toFixed(0)} pts</p>
          </Card>
        </div>
      )}

      {/* Rewards Catalog */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Catálogo de Recompensas</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            <Plus className="w-4 h-4" />
            Añadir Recompensa
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward) => {
            const TypeIcon = getRewardTypeIcon(reward.type);
            return (
              <Card key={reward.id} className="p-4 hover:shadow-lg transition">
                {reward.imageUrl && (
                  <img
                    src={reward.imageUrl}
                    alt={reward.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}
                <div className="flex items-start justify-between mb-2">
                  <TypeIcon className="w-5 h-5 text-purple-600" />
                  <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-700 rounded">
                    {reward.pointsCost} pts
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{reward.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                {reward.stock !== undefined && (
                  <p className="text-xs text-gray-500 mb-3">Stock: {reward.stock}</p>
                )}
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition">
                    <Edit className="w-4 h-4 inline mr-1" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteReward(reward.id)}
                    className="px-3 py-1 text-sm text-red-600 bg-red-50 rounded hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

