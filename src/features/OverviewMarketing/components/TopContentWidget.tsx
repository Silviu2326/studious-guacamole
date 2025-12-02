import React from 'react';
import { PlayCircle, TrendingUp } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';

export const TopContentWidget: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <Card className={`overflow-hidden relative ${className} p-0`}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
      <img 
        src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
        alt="Top Content" 
        className="w-full h-full object-cover absolute inset-0"
      />
      <div className="relative z-20 p-4 h-full flex flex-col justify-end">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-medium border border-white/10">
            Top Performer
          </span>
          <PlayCircle className="w-3 h-3 text-white" />
        </div>
        <p className="text-white text-sm font-medium line-clamp-1">Rutina de Abdominales en 5 min</p>
        <div className="flex items-center gap-3 mt-2 text-white/90 text-xs">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 12.5k views
          </span>
          <span>8.2% CTR</span>
        </div>
      </div>
    </Card>
  );
};
