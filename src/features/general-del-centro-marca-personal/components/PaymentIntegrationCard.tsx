import React, { useState } from 'react';
import { CreditCard, CheckCircle2, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { PaymentStatus } from '../types';
import { profileApi } from '../api/profileApi';

interface PaymentIntegrationCardProps {
  paymentStatus: PaymentStatus;
  onStatusChange: (status: PaymentStatus) => void;
}

const statusConfig: Record<PaymentStatus, { label: string; icon: React.ReactNode; color: string; description: string }> = {
  connected: {
    label: 'Conectado',
    icon: <CheckCircle2 className="w-5 h-5" />,
    color: 'text-green-600',
    description: 'Tu cuenta de Stripe está conectada y activa',
  },
  incomplete: {
    label: 'Conexión Incompleta',
    icon: <AlertCircle className="w-5 h-5" />,
    color: 'text-yellow-600',
    description: 'La conexión con Stripe no se completó. Por favor, inténtalo de nuevo.',
  },
  not_connected: {
    label: 'No Conectado',
    icon: <XCircle className="w-5 h-5" />,
    color: 'text-red-600',
    description: 'Conecta tu cuenta de Stripe para recibir pagos',
  },
};

export const PaymentIntegrationCard: React.FC<PaymentIntegrationCardProps> = ({
  paymentStatus,
  onStatusChange,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const response = await profileApi.connectStripe();
      // Redirigir a Stripe
      window.location.href = response.redirectUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con Stripe');
      setIsConnecting(false);
    }
  };

  const config = statusConfig[paymentStatus];

  return (
    <Card padding="none">
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Integración de Pagos
          </h3>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <div className={config.color}>{config.icon}</div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{config.label}</p>
            <p className="text-sm text-gray-600">{config.description}</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {paymentStatus !== 'connected' && (
          <Button
            variant="primary"
            onClick={handleConnect}
            loading={isConnecting}
            fullWidth
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            {paymentStatus === 'incomplete' ? 'Reintentar Conexión' : 'Conectar con Stripe'}
          </Button>
        )}

        <p className="text-xs text-gray-500">
          La conexión con Stripe es necesaria para recibir pagos por membresías, sesiones y productos.
          El proceso se realiza de forma segura a través de Stripe Connect.
        </p>
      </div>
    </Card>
  );
};

