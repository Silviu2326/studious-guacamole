import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  DollarSign,
  Dumbbell,
  UtensilsCrossed,
  BarChart3,
  UserPlus,
  Package,
} from 'lucide-react';

interface QuickActionsProps {
  role: 'entrenador' | 'gimnasio';
}

export const QuickActions: React.FC<QuickActionsProps> = ({ role }) => {
  const navigate = useNavigate();

  const getActions = () => {
    if (role === 'entrenador') {
      return [
        {
          id: 'clientes',
          label: 'Mis Clientes',
          icon: <Users className="w-5 h-5" />,
          path: '/gestión-de-clientes',
          color: 'blue',
        },
        {
          id: 'agenda',
          label: 'Agenda',
          icon: <Calendar className="w-5 h-5" />,
          path: '/agenda',
          color: 'purple',
        },
        {
          id: 'entrenos',
          label: 'Editor de Entreno',
          icon: <Dumbbell className="w-5 h-5" />,
          path: '/editor-de-entreno',
          color: 'green',
        },
        {
          id: 'dietas',
          label: 'Editor de Dieta',
          icon: <UtensilsCrossed className="w-5 h-5" />,
          path: '/editor-de-dieta-meal-planner',
          color: 'orange',
        },
        {
          id: 'facturacion',
          label: 'Facturación',
          icon: <DollarSign className="w-5 h-5" />,
          path: '/facturacin-cobros',
          color: 'emerald',
        },
        {
          id: 'leads',
          label: 'Leads',
          icon: <UserPlus className="w-5 h-5" />,
          path: '/leads',
          color: 'indigo',
        },
      ];
    } else {
      return [
        {
          id: 'socios',
          label: 'Gestión de Socios',
          icon: <Users className="w-5 h-5" />,
          path: '/gestión-de-clientes',
          color: 'purple',
        },
        {
          id: 'facturacion',
          label: 'Facturación & Cobros',
          icon: <DollarSign className="w-5 h-5" />,
          path: '/facturacin-cobros',
          color: 'green',
        },
        {
          id: 'agenda',
          label: 'Agenda',
          icon: <Calendar className="w-5 h-5" />,
          path: '/agenda',
          color: 'blue',
        },
        {
          id: 'panel-financiero',
          label: 'Panel Financiero',
          icon: <BarChart3 className="w-5 h-5" />,
          path: '/panel-financiero-overview',
          color: 'emerald',
        },
        {
          id: 'leads',
          label: 'Pipeline Comercial',
          icon: <UserPlus className="w-5 h-5" />,
          path: '/leads',
          color: 'indigo',
        },
        {
          id: 'productos',
          label: 'Catálogo Productos',
          icon: <Package className="w-5 h-5" />,
          path: '/catalogo-productos',
          color: 'orange',
        },
      ];
    }
  };

  const actions = getActions();

  return (
    <Card className="p-4 bg-white shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Accesos Rápidos
        </h3>
        <p className="text-gray-600 text-sm mt-1">
          Accede rápidamente a los módulos más utilizados
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => navigate(action.path)}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-white ring-1 ring-gray-200 hover:ring-blue-400 transition-all duration-200 hover:scale-105 group"
          >
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-2 bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              {action.icon}
            </div>
            <span className="text-sm font-medium text-gray-900 text-center">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
};
