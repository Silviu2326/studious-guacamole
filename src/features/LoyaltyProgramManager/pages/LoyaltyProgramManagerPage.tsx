import React, { useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { LoyaltyProgramDashboard } from '../components/LoyaltyProgramDashboard';
import { RulesEngineConfigurator } from '../components/RulesEngineConfigurator';
import { RewardsCatalogManager } from '../components/RewardsCatalogManager';
import { getLoyaltyProgram, getLoyaltyRewards, LoyaltyRule, LoyaltyReward } from '../api/loyalty';
import { Gift, Settings, BarChart3, Award } from 'lucide-react';

type TabType = 'overview' | 'rules' | 'rewards';

export default function LoyaltyProgramManagerPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: BarChart3 },
    { id: 'rules', label: 'Reglas', icon: Settings },
    { id: 'rewards', label: 'Recompensas', icon: Gift }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Award size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Programa de Fidelización
                </h1>
                <p className="text-gray-600">
                  Diseña y gestiona tu programa de lealtad para retener y fidelizar clientes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Sistema de Tabs */}
        <Card className="p-0 bg-white shadow-sm">
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    role="tab"
                    aria-selected={isActive}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Tab Content */}
        <div className="mt-6">
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
    </div>
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
      <Card className="p-8 text-center bg-white shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando...</p>
      </Card>
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
      <Card className="p-8 text-center bg-white shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando...</p>
      </Card>
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

