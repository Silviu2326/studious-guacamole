import React from 'react';
import { ThumbsUp, TrendingUp, Users } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';

export const SatisfactionPulse: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`${ds.typography.h4} ${ds.color.textPrimary}`}>Pulso Comunidad</h3>
        <Users className="w-4 h-4 text-gray-400" />
      </div>
      
      <div className="flex items-end justify-between mb-2">
        <div>
          <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">72</span>
          <span className="text-sm text-gray-500 ml-1">NPS</span>
        </div>
        <div className="flex items-center text-green-500 text-sm font-medium">
          <TrendingUp className="w-3 h-3 mr-1" />
          +4 pts
        </div>
      </div>
      
      <div className="w-full bg-gray-100 rounded-full h-2 mb-4 dark:bg-gray-700">
        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '72%' }}></div>
      </div>

      <div className="flex justify-between items-center text-sm border-t pt-3 border-gray-100 dark:border-gray-800">
        <span className={ds.color.textSecondary}>Retención</span>
        <span className="font-semibold text-gray-900 dark:text-white">94%</span>
      </div>
    </Card>
  );
};
