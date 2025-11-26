import React from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';

export const PlaybooksProgressWidget: React.FC<{ className?: string }> = ({ className = '' }) => {
  const playbooks = [
    { name: 'Lanzamiento Verano', progress: 65 },
    { name: 'Reto 21 Días', progress: 30 },
  ];

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`${ds.typography.h4} ${ds.color.textPrimary}`}>Playbooks Activos</h3>
        <BookOpen className="w-4 h-4 text-gray-400" />
      </div>

      <div className="space-y-4">
        {playbooks.map((pb, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700 dark:text-gray-300">{pb.name}</span>
              <span className="text-indigo-600 font-semibold">{pb.progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 dark:bg-gray-700">
              <div 
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${pb.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-center text-gray-500">
        2 estrategias en curso
      </div>
    </Card>
  );
};
