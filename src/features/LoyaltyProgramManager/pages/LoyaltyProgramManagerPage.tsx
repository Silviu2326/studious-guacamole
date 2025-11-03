import React, { useState } from 'react';
import { Layout } from '../../../components/layout';
import { LoyaltyProgramDashboard } from '../components/LoyaltyProgramDashboard';
import { RulesEngineConfigurator } from '../components/RulesEngineConfigurator';
import { RewardsCatalogManager } from '../components/RewardsCatalogManager';
import { getLoyaltyProgram, getLoyaltyRewards, LoyaltyRule, LoyaltyReward } from '../api/loyalty';
import { Gift, Settings, BarChart3 } from 'lucide-react';

type TabType = 'overview' | 'rules' | 'rewards';

export default function LoyaltyProgramManagerPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: BarChart3 },
    { id: 'rules', label: 'Reglas', icon: Settings },
    { id: 'rewards', label: 'Recompensas', icon: Gift }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Programa de Fidelización</h1>
          <p className="text-gray-600 mt-2">
            Diseña y gestiona tu programa de lealtad para retener y fidelizar clientes
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition
                    ${
                      activeTab === tab.id
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && (
            <LoyaltyProgramDashboard />
          )}
          {activeTab === 'rules' && (
            <RulesTabContent />
          )}
          {activeTab === 'rewards' && (
            <RewardsTabContent />
          )}
        </div>
      </div>
    </Layout>
  );
}

// Componente para la pestaña de Reglas
const RulesTabContent: React.FC = () => {
  const [rules, setRules] = useState<LoyaltyRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    setIsLoading(true);
    try {
      const program = await getLoyaltyProgram();
      setRules(program.rules);
    } catch (err) {
      console.error('Error loading rules:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRule = async (
    ruleId: string,
    updates: { points?: number; isActive?: boolean }
  ) => {
    // Actualizar estado local inmediatamente
    setRules(prevRules =>
      prevRules.map(rule =>
        rule.id === ruleId
          ? {
              ...rule,
              points: updates.points !== undefined ? updates.points : rule.points,
              isActive: updates.isActive !== undefined ? updates.isActive : rule.isActive
            }
          : rule
      )
    );

    // Aquí en producción haríamos la llamada a la API
    console.log('Actualizando regla:', ruleId, updates);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <RulesEngineConfigurator
      rules={rules}
      onUpdateRule={handleUpdateRule}
    />
  );
};

// Componente para la pestaña de Recompensas
const RewardsTabContent: React.FC = () => {
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    setIsLoading(true);
    try {
      const data = await getLoyaltyRewards();
      setRewards(data);
    } catch (err) {
      console.error('Error loading rewards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddReward = async (newReward: Omit<LoyaltyReward, 'id'>) => {
    // Crear nueva recompensa localmente
    const reward: LoyaltyReward = {
      id: `rew_${Date.now()}`,
      ...newReward
    };
    setRewards(prev => [...prev, reward]);
  };

  const handleEditReward = async (rewardId: string, updates: Partial<LoyaltyReward>) => {
    setRewards(prev =>
      prev.map(r =>
        r.id === rewardId
          ? { ...r, ...updates }
          : r
      )
    );
  };

  const handleDeleteReward = async (rewardId: string) => {
    setRewards(prev => prev.filter(r => r.id !== rewardId));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <RewardsCatalogManager
      rewards={rewards}
      onAddReward={handleAddReward}
      onEditReward={handleEditReward}
      onDeleteReward={handleDeleteReward}
    />
  );
};

