import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Table, Button } from '../../../components/componentsreutilizables';
import { ClientSegment } from '../types';
import { getSegments, createSegment, deleteSegment } from '../api/segmentation';
import { Users, Plus, Trash2, Loader2 } from 'lucide-react';
import { Modal, Input, Select } from '../../../components/componentsreutilizables';

export const ClientSegmentation: React.FC = () => {
  const { user } = useAuth();
  const [segments, setSegments] = useState<ClientSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSegmentName, setNewSegmentName] = useState('');

  useEffect(() => {
    loadSegments();
  }, []);

  const loadSegments = async () => {
    setLoading(true);
    try {
      const data = await getSegments(user?.role || 'entrenador', user?.id);
      setSegments(data);
    } catch (error) {
      console.error('Error cargando segmentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSegment = async () => {
    if (!newSegmentName.trim()) return;

    try {
      await createSegment({
        name: newSegmentName,
        criteria: {},
      });
      setNewSegmentName('');
      setShowCreateModal(false);
      loadSegments();
    } catch (error) {
      console.error('Error creando segmento:', error);
    }
  };

  const handleDeleteSegment = async (segmentId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este segmento?')) return;

    try {
      await deleteSegment(segmentId);
      loadSegments();
    } catch (error) {
      console.error('Error eliminando segmento:', error);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Nombre del Segmento',
      render: (value: string) => (
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-semibold text-gray-900">
            {value}
          </span>
        </div>
      ),
    },
    {
      key: 'clientCount',
      label: 'Clientes',
      render: (value: number) => (
        <span className={`${ds.typography.body} ${ds.color.textPrimary}`}>
          {value} {value === 1 ? 'cliente' : 'clientes'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: ClientSegment) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteSegment(row.id)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Card padding="none">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  Segmentación de Clientes
                </h3>
                <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                  Organiza tus clientes en grupos personalizados
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Segmento
            </Button>
          </div>
        </div>
        <div className="p-6">
          <Table
            data={segments}
            columns={columns}
            loading={loading}
            emptyMessage="No hay segmentos creados"
          />
        </div>
      </Card>

      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setNewSegmentName('');
        }}
        title="Crear Nuevo Segmento"
        footer={
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setShowCreateModal(false);
                setNewSegmentName('');
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateSegment}
              disabled={!newSegmentName.trim()}
            >
              Crear Segmento
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nombre del Segmento"
            value={newSegmentName}
            onChange={(e) => setNewSegmentName(e.target.value)}
            placeholder="Ej: Clientes Premium, En Riesgo, etc."
            fullWidth
          />
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary}`}>
            Puedes configurar criterios más detallados después de crear el segmento.
          </p>
        </div>
      </Modal>
    </>
  );
};

