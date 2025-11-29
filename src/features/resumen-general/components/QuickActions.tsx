import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { useNavigate } from 'react-router-dom';

/**
 * Tipo para definir una acción rápida
 */
export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
  path: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

/**
 * Componente de accesos rápidos para el dashboard
 * 
 * Renderiza una lista de acciones como botones/tarjetas clickeables
 * que permiten navegar rápidamente a las secciones más usadas del sistema.
 */
export const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  const navigate = useNavigate();

  const handleActionClick = (path: string) => {
    navigate(path);
  };

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Accesos Rápidos
        </h3>
        <p className="text-gray-600 text-sm mt-1">
          Accede rápidamente a los módulos más utilizados
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action.path)}
            className="flex flex-col items-start p-4 rounded-xl bg-white ring-1 ring-gray-200 hover:ring-blue-400 hover:shadow-md transition-all duration-200 group text-left"
          >
            {action.icon && (
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {action.icon}
              </div>
            )}
            <span className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {action.label}
            </span>
            <span className="text-xs text-gray-600 leading-relaxed">
              {action.description}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
};
