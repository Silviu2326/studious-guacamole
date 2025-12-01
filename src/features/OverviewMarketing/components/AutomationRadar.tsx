import React from 'react';
import { Send, Clock, AlertTriangle } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';

export const AutomationRadar: React.FC<{ className?: string }> = ({ className = '' }) => {
  // Mock data - En producción vendría del Service
  const stats = { sent: 1250, scheduled: 45, errors: 2 };
  
  return (
    <Card className={className}>
      <h3 className={`${ds.typography.h4} mb-3 ${ds.color.textPrimary} flex items-center gap-2`}>
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        Radar Automatización
      </h3>
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 text-center">
          <Send className="w-4 h-4 mx-auto text-blue-500 mb-1" />
          <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{stats.sent}</div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-blue-600/70 dark:text-blue-400/70">Enviados</div>
        </div>
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800 text-center">
          <Clock className="w-4 h-4 mx-auto text-purple-500 mb-1" />
          <div className="text-lg font-bold text-purple-700 dark:text-purple-300">{stats.scheduled}</div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-purple-600/70 dark:text-purple-400/70">Futuro</div>
        </div>
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800 text-center">
          <AlertTriangle className="w-4 h-4 mx-auto text-red-500 mb-1" />
          <div className="text-lg font-bold text-red-700 dark:text-red-300">{stats.errors}</div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-red-600/70 dark:text-red-400/70">Errores</div>
        </div>
      </div>
    </Card>
  );
};
