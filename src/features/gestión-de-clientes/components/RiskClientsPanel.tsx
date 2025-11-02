import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Table, Button, Badge } from '../../../components/componentsreutilizables';
import { Client } from '../types';
import { getRiskClients } from '../api/clients';
import { createRetentionAction } from '../api/retention';
import { AlertTriangle, Mail, MessageSquare, Phone, Calendar, TrendingDown, Loader2, Package } from 'lucide-react';
import { ConfirmModal } from '../../../components/componentsreutilizables';

interface RiskClientsPanelProps {
  onClientClick?: (client: Client) => void;
}

export const RiskClientsPanel: React.FC<RiskClientsPanelProps> = ({ onClientClick }) => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showRetentionModal, setShowRetentionModal] = useState(false);
  const [retentionType, setRetentionType] = useState<'email' | 'whatsapp' | 'sms' | 'call' | 'offer'>('email');

  useEffect(() => {
    loadClients();
  }, [user]);

  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await getRiskClients(user?.role || 'entrenador', user?.id);
      setClients(data);
    } catch (error) {
      console.error('Error cargando clientes en riesgo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRetentionAction = async (clientId: string, type: 'email' | 'whatsapp' | 'sms' | 'call' | 'offer') => {
    try {
      await createRetentionAction({
        clientId,
        type,
        scheduledDate: new Date().toISOString(),
        status: 'pending',
      });
      setShowRetentionModal(false);
      setSelectedClient(null);
      // Recargar clientes
      loadClients();
    } catch (error) {
      console.error('Error creando acción de retención:', error);
    }
  };

  const getRiskBadge = (riskScore?: number) => {
    if (!riskScore) return <Badge variant="gray">N/A</Badge>;
    if (riskScore >= 80) return <Badge variant="red">Alto</Badge>;
    if (riskScore >= 60) return <Badge variant="yellow">Medio</Badge>;
    return <Badge variant="gray">Bajo</Badge>;
  };

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      render: (value: string, row: Client) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white font-semibold">
            {value.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {value}
            </div>
            {row.email && (
              <div className="text-sm text-gray-600">
                {row.email}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'riskScore',
      label: 'Nivel de Riesgo',
      render: (value: number, row: Client) => (
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-600" />
          <span className="text-sm font-semibold text-gray-900">
            {row.riskScore || 0}%
          </span>
          {getRiskBadge(row.riskScore)}
        </div>
      ),
    },
    {
      key: 'daysSinceLastVisit',
      label: 'Días sin visita',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-900">
            {value || 0} días
          </span>
        </div>
      ),
    },
    {
      key: 'adherenceRate',
      label: 'Adherencia',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-red-600" />
          <span className="text-sm font-semibold text-gray-900">
            {value || 0}%
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: Client) => (
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setSelectedClient(row);
              setRetentionType('email');
              setShowRetentionModal(true);
            }}
          >
            <Mail className="w-4 h-4 mr-1" />
            Email
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedClient(row);
              setRetentionType('whatsapp');
              setShowRetentionModal(true);
            }}
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            WhatsApp
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onClientClick?.(row)}
          >
            Ver perfil
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  if (clients.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay clientes en riesgo</h3>
        <p className="text-gray-600 mb-4">Todos los {user?.role === 'entrenador' ? 'clientes' : 'socios'} están en buen estado.</p>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-xl ring-1 ring-orange-200/70">
                <AlertTriangle size={20} className="text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Clientes en Riesgo
                </h3>
                <p className="text-sm text-gray-600">
                  {clients.length} {user?.role === 'entrenador' ? 'clientes' : 'socios'} requieren atención
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <Table
            data={clients}
            columns={columns}
            loading={false}
            emptyMessage="No hay clientes en riesgo"
          />
        </div>
      </Card>

      {showRetentionModal && selectedClient && (
        <ConfirmModal
          isOpen={showRetentionModal}
          onClose={() => {
            setShowRetentionModal(false);
            setSelectedClient(null);
          }}
          onConfirm={() => handleCreateRetentionAction(selectedClient.id, retentionType)}
          title={`Crear acción de retención para ${selectedClient.name}`}
          message={`¿Deseas crear una acción de retención de tipo ${retentionType} para este cliente?`}
          confirmText="Crear acción"
          cancelText="Cancelar"
        />
      )}
    </>
  );
};

