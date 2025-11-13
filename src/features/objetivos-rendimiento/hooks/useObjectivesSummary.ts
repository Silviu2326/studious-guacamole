import { useState, useEffect } from 'react';
import { getObjectives } from '../api/objectives';
import { Objective } from '../types';
import { useAuth } from '../../../context/AuthContext';

export interface ObjectivesSummary {
  total: number;
  onTrack: number;
  atRisk: number;
  achieved: number;
  loading: boolean;
}

/**
 * Hook para obtener el resumen de objetivos para mostrar en la Sidebar
 * Calcula cuántos objetivos están "on track" y "at risk"
 */
export const useObjectivesSummary = (): ObjectivesSummary => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<ObjectivesSummary>({
    total: 0,
    onTrack: 0,
    atRisk: 0,
    achieved: 0,
    loading: true,
  });

  useEffect(() => {
    const loadSummary = async () => {
      if (!user) return;

      const role = user.role === 'entrenador' ? 'entrenador' : 'gimnasio';
      
      try {
        const objectives = await getObjectives({}, role);
        
        // Calcular resumen
        const total = objectives.length;
        const achieved = objectives.filter(obj => obj.status === 'achieved').length;
        
        // Objetivos "on track": in_progress con progreso >= 50% o status que no sea at_risk/failed
        const onTrack = objectives.filter(obj => {
          if (obj.status === 'achieved') return false;
          if (obj.status === 'at_risk' || obj.status === 'failed') return false;
          if (obj.status === 'in_progress' && obj.progress >= 50) return true;
          if (obj.status === 'in_progress' && obj.progress < 50) return false;
          return obj.status === 'in_progress';
        }).length;
        
        // Objetivos "at risk": status at_risk o failed, o in_progress con progreso < 50%
        const atRisk = objectives.filter(obj => {
          if (obj.status === 'at_risk' || obj.status === 'failed') return true;
          if (obj.status === 'in_progress' && obj.progress < 50) return true;
          return false;
        }).length;

        setSummary({
          total,
          onTrack,
          atRisk,
          achieved,
          loading: false,
        });
      } catch (error) {
        console.error('Error loading objectives summary:', error);
        setSummary(prev => ({ ...prev, loading: false }));
      }
    };

    loadSummary();
    
    // Recargar cada 30 segundos para mantener los datos actualizados
    const interval = setInterval(loadSummary, 30000);
    
    return () => clearInterval(interval);
  }, [user]);

  return summary;
};

