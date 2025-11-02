import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables';
import { Button } from '../../../components/componentsreutilizables';
import { Settings, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Integration } from '../types';
import { INTEGRATION_STATUS_COLORS, INTEGRATION_STATUS_LABELS } from '../types';

interface IntegrationCardProps {
  integration: Integration;
  onConnect: (integrationId: string) => void;
  onManage: (integrationId: string, userIntegrationId: string) => void;
  onDisconnect?: (userIntegrationId: string) => void;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  onConnect,
  onManage,
  onDisconnect,
}) => {
  const getStatusIcon = () => {
    switch (integration.status) {
      case 'connected':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const handleAction = () => {
    if (integration.status === 'connected' && integration.userIntegrationId) {
      onManage(integration.id, integration.userIntegrationId);
    } else {
      onConnect(integration.id);
    }
  };

  const getActionLabel = () => {
    if (integration.status === 'connected') {
      return 'Gestionar';
    }
    return 'Conectar';
  };

  return (
    <Card variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden bg-white shadow-sm">
      <div className="flex flex-col flex-1 p-4">
        {/* Logo and Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
              {integration.logoUrl ? (
                <img
                  src={integration.logoUrl}
                  alt={integration.name}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                  {integration.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {integration.name}
              </h3>
              <Badge
                variant={INTEGRATION_STATUS_COLORS[integration.status] as any}
                size="sm"
                className="mt-1"
              >
                {getStatusIcon()}
                <span className="ml-1">
                  {INTEGRATION_STATUS_LABELS[integration.status]}
                </span>
              </Badge>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 flex-1">
          {integration.description}
        </p>

        {/* Last Sync Info */}
        {integration.status === 'connected' && integration.lastSync && (
          <div className="text-xs text-gray-500 mb-4">
            Última sincronización: {new Date(integration.lastSync).toLocaleString('es-ES')}
          </div>
        )}

        {/* Error Message */}
        {integration.status === 'error' && integration.errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-800">{integration.errorMessage}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100 px-4 pb-4">
        {integration.status === 'connected' ? (
          <>
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={() => onManage(integration.id, integration.userIntegrationId!)}
            >
              <Settings size={16} className="mr-2" />
              Gestionar
            </Button>
            {onDisconnect && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDisconnect(integration.userIntegrationId!)}
              >
                Desconectar
              </Button>
            )}
          </>
        ) : (
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={handleAction}
          >
            Conectar
          </Button>
        )}
      </div>
    </Card>
  );
};

