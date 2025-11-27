import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { getLeads } from '../../leads/api';
import { LeadStatus } from '../../leads/types';
import { BusinessType } from '../../pipeline-de-venta-kanban/types';
import { 
  TrendingUp, 
  Users, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowDown,
  Loader2
} from 'lucide-react';

interface FunnelPanelProps {
  businessType: BusinessType;
  userId?: string;
  onFunnelPhaseClick?: (phase: FunnelPhase, statusFilter?: LeadStatus) => void;
}

type FunnelPhase = 'nuevo' | 'contactado' | 'seguimiento' | 'ganado' | 'perdido';

interface FunnelData {
  nuevo: number;
  contactado: number;
  seguimiento: number;
  ganado: number;
  perdido: number;
}

const FunnelPanel: React.FC<FunnelPanelProps> = ({
  businessType,
  userId,
  onFunnelPhaseClick,
}) => {
  const [funnelData, setFunnelData] = useState<FunnelData>({
    nuevo: 0,
    contactado: 0,
    seguimiento: 0,
    ganado: 0,
    perdido: 0,
  });
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadFunnelData();
  }, [businessType, userId]);

  const loadFunnelData = async () => {
    setLoading(true);
    try {
      // Obtener leads desde el módulo de leads
      const filters: {
        businessType: BusinessType;
        assignedTo?: string[];
      } = {
        businessType,
        ...(businessType === 'entrenador' && userId ? { assignedTo: [userId] } : {}),
      };
      
      const leads = await getLeads(filters);

      // Agrupar leads por estado según las fases del funnel
      const data: FunnelData = {
        nuevo: leads.filter(l => l.status === 'new').length,
        contactado: leads.filter(l => 
          l.status === 'contacted' || 
          l.status === 'qualified'
        ).length,
        seguimiento: leads.filter(l => 
          l.status === 'nurturing' || 
          l.status === 'meeting_scheduled' || 
          l.status === 'proposal_sent' || 
          l.status === 'negotiation'
        ).length,
        ganado: leads.filter(l => l.status === 'converted').length,
        perdido: leads.filter(l => l.status === 'lost' || l.status === 'unqualified').length,
      };

      setFunnelData(data);
      setTotal(leads.length);
    } catch (error) {
      console.error('[FunnelPanel] Error cargando datos del funnel:', error);
    } finally {
      setLoading(false);
    }
  };

  const funnelPhases: Array<{
    key: FunnelPhase;
    label: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor: string;
    statusFilter?: LeadStatus[];
  }> = [
    {
      key: 'nuevo',
      label: 'Nuevo',
      icon: <Users className="w-5 h-5" />,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
      borderColor: 'border-blue-200 dark:border-blue-800',
      statusFilter: ['new'],
    },
    {
      key: 'contactado',
      label: 'Contactado',
      icon: <UserCheck className="w-5 h-5" />,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/30',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
      statusFilter: ['contacted', 'qualified'],
    },
    {
      key: 'seguimiento',
      label: 'En Seguimiento',
      icon: <Clock className="w-5 h-5" />,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-900/30',
      borderColor: 'border-amber-200 dark:border-amber-800',
      statusFilter: ['nurturing', 'meeting_scheduled', 'proposal_sent', 'negotiation'],
    },
    {
      key: 'ganado',
      label: 'Ganado',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/30',
      borderColor: 'border-green-200 dark:border-green-800',
      statusFilter: ['converted'],
    },
    {
      key: 'perdido',
      label: 'Perdido',
      icon: <XCircle className="w-5 h-5" />,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/30',
      borderColor: 'border-red-200 dark:border-red-800',
      statusFilter: ['lost', 'unqualified'],
    },
  ];

  const handlePhaseClick = (phase: FunnelPhase) => {
    if (onFunnelPhaseClick) {
      const phaseConfig = funnelPhases.find(p => p.key === phase);
      // Para esta fase, pasamos el primer status filter si existe
      // La página padre manejará cómo aplicar los filtros múltiples
      onFunnelPhaseClick(phase, phaseConfig?.statusFilter?.[0]);
    }
  };

  // Calcular porcentajes para la visualización del funnel
  const maxValue = Math.max(...Object.values(funnelData), 1);
  const getPercentage = (value: number) => {
    return maxValue > 0 ? (value / maxValue) * 100 : 0;
  };

  if (loading) {
    return (
      <Card className="p-6 bg-white dark:bg-[#1E1E2E] shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white dark:bg-[#1E1E2E] shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Distribución por Fase del Funnel
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {total} leads en total
        </p>
      </div>

      {/* Visualización del Funnel */}
      <div className="space-y-3 mb-6">
        {funnelPhases.map((phase, index) => {
          const count = funnelData[phase.key];
          const percentage = getPercentage(count);
          
          return (
            <div key={phase.key} className="relative">
              {/* Barra del Funnel */}
              <button
                onClick={() => handlePhaseClick(phase.key)}
                className={`w-full ${phase.bgColor} ${phase.borderColor} border-2 rounded-lg p-4 transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer group`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`${phase.color}`}>
                      {phase.icon}
                    </div>
                    <span className={`font-semibold ${phase.color} group-hover:underline`}>
                      {phase.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-2xl font-bold ${phase.color}`}>
                      {count}
                    </span>
                    {index < funnelPhases.length - 1 && (
                      <ArrowDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                </div>
                
                {/* Barra de progreso visual */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      phase.key === 'nuevo' ? 'bg-blue-500 dark:bg-blue-600' :
                      phase.key === 'contactado' ? 'bg-indigo-500 dark:bg-indigo-600' :
                      phase.key === 'seguimiento' ? 'bg-amber-500 dark:bg-amber-600' :
                      phase.key === 'ganado' ? 'bg-green-500 dark:bg-green-600' :
                      'bg-red-500 dark:bg-red-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Vista compacta horizontal (opcional, para pantallas grandes) */}
      <div className="hidden lg:grid grid-cols-5 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        {funnelPhases.map((phase) => {
          const count = funnelData[phase.key];
          return (
            <button
              key={phase.key}
              onClick={() => handlePhaseClick(phase.key)}
              className={`${phase.bgColor} ${phase.borderColor} border rounded-lg p-3 text-center transition-all hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer group`}
              title={`Clic para ver leads en fase: ${phase.label}`}
            >
              <div className={`${phase.color} mb-2 flex justify-center`}>
                {phase.icon}
              </div>
              <div className={`text-lg font-bold ${phase.color} mb-1`}>
                {count}
              </div>
              <div className={`text-xs font-medium ${phase.color} opacity-75`}>
                {phase.label}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default FunnelPanel;

