import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';

export const RecentWinsWidget: React.FC<{ className?: string }> = ({ className = '' }) => {
  const testimonials = [
    { name: 'Ana G.', text: '¡Increíble progreso en 3 semanas!', rating: 5 },
    { name: 'Carlos M.', text: 'El plan de nutrición es muy fácil de seguir.', rating: 5 },
  ];

  return (
    <Card className={className}>
      <div className="flex items-center gap-2 mb-3">
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        <h3 className={`${ds.typography.h4} ${ds.color.textPrimary}`}>Wins Recientes</h3>
      </div>
      
      <div className="space-y-3">
        {testimonials.map((t, i) => (
          <div key={i} className="p-3 bg-yellow-50/50 dark:bg-yellow-900/10 rounded-lg border border-yellow-100 dark:border-yellow-800/30">
            <Quote className="w-3 h-3 text-yellow-600/50 mb-1" />
            <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-2">"{t.text}"</p>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-900 dark:text-gray-100">{t.name}</span>
              <div className="flex">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-2 h-2 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
