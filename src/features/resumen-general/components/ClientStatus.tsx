import React from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, UserMinus, UserCheck, TrendingUp, TrendingDown, AlertCircle, RefreshCw } from 'lucide-react';
import { ClientStatus as ClientStatusType } from '../api';

interface ClientStatusProps {
  data: ClientStatusType | null;
  role?: 'entrenador' | 'gimnasio';
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}

/**
 * Componente que visualiza el estado de la base de clientes de forma clara y legible.
 * Muestra categorías: Activos, Nuevos, Inactivos y Leads con sus variaciones.
 * 
 * @param data - Objeto ClientStatus con los datos de la API
 * @param role - Rol opcional para adaptar textos (entrenador/gimnasio)
 * @param loading - Estado de carga opcional
 */
export const ClientStatus: React.FC<ClientStatusProps> = ({
  data,
  role = 'entrenador',
  loading = false,
  error,
  onRetry,
}) => {
  const navigate = useNavigate();

  if (error) {
    return (
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="p-3 bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Error al cargar el estado de clientes
          </h3>
          <p className="text-sm text-gray-600 text-center mb-4 max-w-xs">
            {error}
          </p>
          {onRetry && (
            <Button 
              variant="primary" 
              size="sm"
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          )}
        </div>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  // Textos adaptados por rol
  const getCategoryLabel = (category: 'activos' | 'nuevos' | 'inactivos' | 'leads') => {
    const labels = {
      activos: role === 'entrenador' ? 'Clientes activos' : 'Socios activos',
      nuevos: role === 'entrenador' ? 'Nuevos clientes' : 'Nuevos socios',
      inactivos: role === 'entrenador' ? 'Clientes inactivos' : 'Socios inactivos',
      leads: 'Leads',
    };
    return labels[category];
  };

  // Formatea la variación como texto legible (ej: "↑ 12 este mes")
  // La variación porcentual se calcula como: ((actual - anterior) / anterior) * 100
  // Por lo tanto: cambio = actual - anterior = actual - (actual / (variation/100 + 1))
  const formatVariation = (variation: number | undefined, currentCount: number): string | null => {
    if (variation === undefined) return null;
    
    const isPositive = variation >= 0;
    const absVariation = Math.abs(variation);
    
    // Si la variación es muy pequeña, mostrar "Sin cambios"
    if (absVariation < 0.1) {
      return 'Sin cambios';
    }
    
    // Calcula el cambio aproximado basado en la variación porcentual
    // previous = current / (variation/100 + 1)
    // change = current - previous
    const previousCount = currentCount / (variation / 100 + 1);
    const change = Math.round(currentCount - previousCount);
    
    if (change === 0) {
      return 'Sin cambios';
    }
    
    const arrow = isPositive ? '↑' : '↓';
    return `${arrow} ${Math.abs(change)} este mes`;
  };

  // Configuración de colores y estilos por categoría
  const categoryConfig = {
    activos: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      iconColor: 'text-green-600',
      textColor: 'text-green-700',
      numberColor: 'text-green-900',
      icon: UserCheck,
    },
    nuevos: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-700',
      numberColor: 'text-blue-900',
      icon: UserPlus,
    },
    inactivos: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      iconColor: 'text-gray-500',
      textColor: 'text-gray-600',
      numberColor: 'text-gray-800',
      icon: UserMinus,
    },
    leads: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      iconColor: 'text-indigo-600',
      textColor: 'text-indigo-700',
      numberColor: 'text-indigo-900',
      icon: Users,
    },
  };

  if (loading) {
    return (
      <Card className="p-6 bg-white shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  // Valores con fallback a campos legacy
  const activeCount = data.active ?? data.activos ?? 0;
  const newCount = data.newThisMonth ?? data.nuevos ?? 0;
  const inactiveCount = data.inactive ?? data.inactivos ?? 0;
  const leadsCount = data.leads ?? data.leadsPendientes ?? 0;

  return (
    <Card className="p-6 bg-white shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {role === 'entrenador' ? 'Estado de Clientes' : 'Estado de Socios'}
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            {role === 'entrenador' 
              ? `${data.total} clientes en tu cartera`
              : `${data.total} socios del centro`}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/gestión-de-clientes')}
        >
          Ver todos
        </Button>
      </div>

      {/* Grid de categorías */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Activos */}
        <div className={`p-5 rounded-lg border ${categoryConfig.activos.bg} ${categoryConfig.activos.border}`}>
          <div className="flex items-center gap-2 mb-3">
            <categoryConfig.activos.icon className={`w-5 h-5 ${categoryConfig.activos.iconColor}`} />
            <span className={`text-sm font-medium ${categoryConfig.activos.textColor}`}>
              {getCategoryLabel('activos')}
            </span>
          </div>
          <p className={`text-3xl font-bold ${categoryConfig.activos.numberColor} mb-1`}>
            {activeCount}
          </p>
          {data.activeVariation !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {data.activeVariation >= 0 ? (
                <TrendingUp className="w-3 h-3 text-green-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              <span className={`text-xs font-medium ${
                data.activeVariation >= 0 ? 'text-green-600' : 'text-red-500'
              }`}>
                {formatVariation(data.activeVariation, activeCount)}
              </span>
            </div>
          )}
        </div>

        {/* Nuevos */}
        <div className={`p-5 rounded-lg border ${categoryConfig.nuevos.bg} ${categoryConfig.nuevos.border}`}>
          <div className="flex items-center gap-2 mb-3">
            <categoryConfig.nuevos.icon className={`w-5 h-5 ${categoryConfig.nuevos.iconColor}`} />
            <span className={`text-sm font-medium ${categoryConfig.nuevos.textColor}`}>
              {getCategoryLabel('nuevos')}
            </span>
          </div>
          <p className={`text-3xl font-bold ${categoryConfig.nuevos.numberColor} mb-1`}>
            {newCount}
          </p>
          {data.newVariation !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {data.newVariation >= 0 ? (
                <TrendingUp className="w-3 h-3 text-blue-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              <span className={`text-xs font-medium ${
                data.newVariation >= 0 ? 'text-blue-600' : 'text-red-500'
              }`}>
                {formatVariation(data.newVariation, newCount)}
              </span>
            </div>
          )}
        </div>

        {/* Inactivos */}
        <div className={`p-5 rounded-lg border ${categoryConfig.inactivos.bg} ${categoryConfig.inactivos.border}`}>
          <div className="flex items-center gap-2 mb-3">
            <categoryConfig.inactivos.icon className={`w-5 h-5 ${categoryConfig.inactivos.iconColor}`} />
            <span className={`text-sm font-medium ${categoryConfig.inactivos.textColor}`}>
              {getCategoryLabel('inactivos')}
            </span>
          </div>
          <p className={`text-3xl font-bold ${categoryConfig.inactivos.numberColor} mb-1`}>
            {inactiveCount}
          </p>
          {data.inactiveVariation !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {data.inactiveVariation < 0 ? (
                <TrendingDown className="w-3 h-3 text-green-600" />
              ) : (
                <TrendingUp className="w-3 h-3 text-red-500" />
              )}
              <span className={`text-xs font-medium ${
                data.inactiveVariation < 0 ? 'text-green-600' : 'text-red-500'
              }`}>
                {formatVariation(data.inactiveVariation, inactiveCount)}
              </span>
            </div>
          )}
        </div>

        {/* Leads */}
        <div className={`p-5 rounded-lg border ${categoryConfig.leads.bg} ${categoryConfig.leads.border}`}>
          <div className="flex items-center gap-2 mb-3">
            <categoryConfig.leads.icon className={`w-5 h-5 ${categoryConfig.leads.iconColor}`} />
            <span className={`text-sm font-medium ${categoryConfig.leads.textColor}`}>
              {getCategoryLabel('leads')}
            </span>
          </div>
          <p className={`text-3xl font-bold ${categoryConfig.leads.numberColor} mb-1`}>
            {leadsCount}
          </p>
          {data.leadsVariation !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {data.leadsVariation >= 0 ? (
                <TrendingUp className="w-3 h-3 text-indigo-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-gray-500" />
              )}
              <span className={`text-xs font-medium ${
                data.leadsVariation >= 0 ? 'text-indigo-600' : 'text-gray-500'
              }`}>
                {formatVariation(data.leadsVariation, leadsCount)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* CTA para leads pendientes */}
      {leadsCount > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate('/leads')}
          >
            Gestionar {leadsCount} {leadsCount === 1 ? 'lead pendiente' : 'leads pendientes'}
          </Button>
        </div>
      )}
    </Card>
  );
};
