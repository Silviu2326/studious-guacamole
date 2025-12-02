import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Table, Button, Select } from '../../../components/componentsreutilizables';
import { Client, RetentionReason } from '../types';
import { getLostClients, updateClient } from '../api/clients';
import { markClientAsLost, recoverClient } from '../api/retention';
import { Users, RotateCcw, Calendar, Loader2, Package } from 'lucide-react';
import { Modal } from '../../../components/componentsreutilizables';

interface LostClientsManagerProps {
  onClientClick?: (client: Client) => void;
}

const LOSS_REASONS: { value: RetentionReason; label: string }[] = [
  { value: 'problemas-economicos', label: 'Problemas Económicos' },
  { value: 'falta-tiempo', label: 'Falta de Tiempo' },
  { value: 'mudanza', label: 'Mudanza' },
  { value: 'insatisfaccion', label: 'Insatisfacción' },
  { value: 'lesion', label: 'Lesión' },
  { value: 'otro', label: 'Otro' },
];

export const LostClientsManager: React.FC<LostClientsManagerProps> = ({ onClientClick }) => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showRecoverModal, setShowRecoverModal] = useState(false);
  const [showLossReasonModal, setShowLossReasonModal] = useState(false);
  const [lossReason, setLossReason] = useState<RetentionReason>('otro');
  const [lossNotes, setLossNotes] = useState('');

  useEffect(() => {
    loadClients();
  }, [user]);

  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await getLostClients(user?.role || 'entrenador', user?.id);
      setClients(data);
    } catch (error) {
      console.error('Error cargando clientes perdidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverClient = async () => {
    if (!selectedClient) return;
    
    try {
      await recoverClient(selectedClient.id);
      await updateClient(selectedClient.id, { status: 'activo' });
      setShowRecoverModal(false);
      setSelectedClient(null);
      loadClients();
    } catch (error) {
      console.error('Error recuperando cliente:', error);
    }
  };

  const handleMarkAsLost = async () => {
    if (!selectedClient) return;
    
    try {
      await markClientAsLost(selectedClient.id, lossReason, lossNotes);
      await updateClient(selectedClient.id, { status: 'perdido' });
      setShowLossReasonModal(false);
      setSelectedClient(null);
      setLossReason('otro');
      setLossNotes('');
      loadClients();
    } catch (error) {
      console.error('Error marcando cliente como perdido:', error);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      render: (value: string, row: Client) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-semibold">
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
      label: 'Última Adherencia',
      render: (value: number) => (
        <span className="text-sm text-gray-600">
          {value || 0}%
        </span>
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
              setShowRecoverModal(true);
            }}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Recuperar
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay clientes perdidos</h3>
        <p className="text-gray-600 mb-4">Todos los {user?.role === 'entrenador' ? 'clientes' : 'socios'} están activos.</p>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-xl ring-1 ring-gray-200/70">
                <Users size={20} className="text-gray-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Clientes Perdidos
                </h3>
                <p className="text-sm text-gray-600">
                  {clients.length} {user?.role === 'entrenador' ? 'clientes' : 'socios'} dados de baja
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
            emptyMessage="No hay clientes perdidos"
          />
        </div>
      </Card>

      {/* Modal de recuperación */}
      <Modal
        isOpen={showRecoverModal}
        onClose={() => {
          setShowRecoverModal(false);
          setSelectedClient(null);
        }}
        title={`Recuperar cliente: ${selectedClient?.name}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            ¿Estás seguro de que deseas recuperar este cliente y marcarlo como activo?
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => {
                setShowRecoverModal(false);
                setSelectedClient(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleRecoverClient}
            >
              Recuperar Cliente
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

