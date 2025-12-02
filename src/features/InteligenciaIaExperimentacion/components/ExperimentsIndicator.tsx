import React, { useState, useRef, useEffect } from 'react';
import { Button, Badge } from '../../../components/componentsreutilizables';
import { ExperimentRecord } from '../types';
import { FlaskConical, ChevronDown, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface ExperimentsIndicatorProps {
  experiments: ExperimentRecord[];
  onViewResults?: () => void;
}

export const ExperimentsIndicator: React.FC<ExperimentsIndicatorProps> = ({
  experiments,
  onViewResults,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const activeExperiments = experiments.filter((exp) => exp.status === 'running');
  const completedPendingReview = experiments.filter(
    (exp) => exp.status === 'completed' && exp.uplift !== null
  );
  const pendingCount = completedPendingReview.length;

  const totalActive = activeExperiments.length;
  const hasNotifications = pendingCount > 0;

  if (experiments.length === 0) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        leftIcon={<FlaskConical size={16} />}
        className="relative"
      >
        <span className="flex items-center gap-2">
          <span>Experimentos</span>
          {totalActive > 0 && (
            <Badge variant="success" size="sm" className="min-w-[20px]">
              {totalActive}
            </Badge>
          )}
          <ChevronDown size={16} className={isOpen ? 'transform rotate-180 transition-transform' : 'transition-transform'} />
          {hasNotifications && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </span>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FlaskConical size={20} className="text-rose-600" />
                <h3 className="font-semibold text-slate-900">Estado de Experimentos</h3>
                {hasNotifications && (
                  <Badge variant="destructive" size="sm" className="ml-auto">
                    {pendingCount} pendientes
                  </Badge>
                )}
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Active Experiments */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-blue-600" />
                  <span className="text-sm font-semibold text-slate-900">Activos</span>
                  <Badge variant="success" size="sm" className="ml-auto">
                    {totalActive}
                  </Badge>
                </div>
                {activeExperiments.length > 0 ? (
                  <div className="space-y-2">
                    {activeExperiments.map((exp) => (
                      <div
                        key={exp.id}
                        className="p-2 bg-blue-50 rounded-lg border border-blue-100"
                      >
                        <p className="text-sm font-medium text-slate-900">{exp.name}</p>
                        <p className="text-xs text-slate-600 mt-1">{exp.primaryMetric}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">No hay experimentos activos</p>
                )}
              </div>

              {/* Completed Pending Review */}
              {completedPendingReview.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={16} className="text-amber-600" />
                    <span className="text-sm font-semibold text-slate-900">Completados - Pendientes de Revisión</span>
                    <Badge variant="yellow" size="sm" className="ml-auto animate-pulse">
                      {pendingCount}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {completedPendingReview.map((exp) => (
                      <div
                        key={exp.id}
                        className="p-2 bg-amber-50 rounded-lg border border-amber-100"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">{exp.name}</p>
                            <p className="text-xs text-slate-600 mt-1">{exp.primaryMetric}</p>
                          </div>
                          {exp.uplift !== null && (
                            <Badge variant="success" size="sm" className="whitespace-nowrap">
                              +{exp.uplift}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Reviewed */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span className="text-sm font-semibold text-slate-900">Completados</span>
                  <Badge variant="secondary" size="sm" className="ml-auto">
                    {experiments.filter((exp) => exp.status === 'completed').length - pendingCount}
                  </Badge>
                </div>
              </div>
            </div>

            {hasNotifications && (
              <div className="p-4 border-t border-slate-200 bg-slate-50">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    onViewResults?.();
                    setIsOpen(false);
                  }}
                  className="w-full"
                  leftIcon={<CheckCircle2 size={16} />}
                >
                  Ver Resultados ({pendingCount})
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ExperimentsIndicator;

