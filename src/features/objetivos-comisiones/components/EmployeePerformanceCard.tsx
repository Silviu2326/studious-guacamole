// Componente para mostrar el rendimiento de un empleado
import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { User, Target, TrendingUp, Award } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import type { EmployeePerformance } from '../types';

interface EmployeePerformanceCardProps {
  performance: EmployeePerformance;
}

export const EmployeePerformanceCard: React.FC<EmployeePerformanceCardProps> = ({
  performance,
}) => {
  const { employee, totalCommissions, totalBonuses, totalPayout, objectives } = performance;

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600';
      case 'failed':
        return 'bg-red-600';
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <Card variant="hover" padding="lg" className="h-full">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
          {employee.avatarUrl ? (
            <img
              src={employee.avatarUrl}
              alt={employee.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {employee.name}
          </h3>
          {employee.role && (
            <p className="text-sm text-gray-600">
              {employee.role}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600 mb-1">
            Comisiones
          </p>
          <p className="text-lg font-semibold text-gray-900">
            {totalCommissions.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">
            Bonus
          </p>
          <p className="text-lg font-semibold text-gray-900">
            {totalBonuses.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">
            Total
          </p>
          <p className="text-lg font-semibold text-blue-600">
            {totalPayout.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          </p>
        </div>
      </div>

      {objectives.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-semibold text-gray-900">
              Objetivos
            </h4>
          </div>
          {objectives.map((objective) => {
            const progress = getProgressPercentage(objective.progress, objective.target);
            return (
              <div key={objective.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {objective.name}
                  </p>
                  <span className="text-xs font-semibold text-gray-900">
                    {objective.progress} / {objective.target}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${getStatusColor(objective.status)} transition-all duration-300 rounded-full`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {objectives.length === 0 && (
        <div className="text-center py-6">
          <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            Sin objetivos asignados
          </p>
        </div>
      )}
    </Card>
  );
};

