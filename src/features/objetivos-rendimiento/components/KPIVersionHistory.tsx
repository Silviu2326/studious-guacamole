import React, { useState, useEffect } from 'react';
import { KPI, KPIVersionHistoryEntry, KPIVersion } from '../types';
import { getKPIVersionHistory, getKPIVersion, restoreKPIVersion } from '../api/metrics';
import { Card, Button, Modal, Badge, Table } from '../../../components/componentsreutilizables';
import { History, RotateCcw, Eye, Loader2, AlertCircle, GitBranch, Calendar, User } from 'lucide-react';

interface KPIVersionHistoryProps {
  kpi: KPI;
  onClose?: () => void;
  onVersionRestored?: () => void;
}

export const KPIVersionHistory: React.FC<KPIVersionHistoryProps> = ({
  kpi,
  onClose,
  onVersionRestored,
}) => {
  const [history, setHistory] = useState<KPIVersionHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<KPIVersion | null>(null);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [versionToRestore, setVersionToRestore] = useState<KPIVersionHistoryEntry | null>(null);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [kpi.id]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const historyData = await getKPIVersionHistory(kpi.id);
      setHistory(historyData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      console.error('Error loading version history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewVersion = async (entry: KPIVersionHistoryEntry) => {
    try {
      const version = await getKPIVersion(entry.versionId);
      if (version) {
        setSelectedVersion(version);
        setIsVersionModalOpen(true);
      }
    } catch (error) {
      console.error('Error loading version:', error);
      alert('Error al cargar la versión');
    }
  };

  const handleRestoreVersion = async () => {
    if (!versionToRestore) return;

    setRestoring(true);
    try {
      await restoreKPIVersion(
        kpi.id,
        versionToRestore.versionId,
        'user-1', // En producción, usar el usuario actual
        'Usuario'
      );
      setIsRestoreModalOpen(false);
      setVersionToRestore(null);
      loadHistory();
      if (onVersionRestored) {
        onVersionRestored();
      }
      alert('Versión restaurada exitosamente');
    } catch (error) {
      console.error('Error restoring version:', error);
      alert('Error al restaurar la versión');
    } finally {
      setRestoring(false);
    }
  };

  const columns = [
    {
      key: 'version',
      label: 'Versión',
      render: (value: string, row: KPIVersionHistoryEntry) => (
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-900">{value}</span>
          {row.isCurrentVersion && (
            <Badge variant="green">Actual</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'changes',
      label: 'Cambios',
      render: (value: any[], row: KPIVersionHistoryEntry) => (
        <div>
          {value.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {value.slice(0, 3).map((change, idx) => (
                <Badge key={idx} variant="blue" className="text-xs">
                  {change.fieldLabel}
                </Badge>
              ))}
              {value.length > 3 && (
                <Badge variant="gray" className="text-xs">
                  +{value.length - 3} más
                </Badge>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-400">Sin cambios detectados</span>
          )}
        </div>
      ),
    },
    {
      key: 'changeNotes',
      label: 'Notas',
      render: (value: string | undefined) => (
        <span className="text-sm text-gray-600">
          {value || '-'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Fecha',
      render: (value: string, row: KPIVersionHistoryEntry) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{new Date(value).toLocaleString('es-ES')}</span>
        </div>
      ),
    },
    {
      key: 'createdByName',
      label: 'Creado por',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: KPIVersionHistoryEntry) => (
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleViewVersion(row)}
          >
            <Eye size={16} className="mr-1" />
            Ver
          </Button>
          {!row.isCurrentVersion && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setVersionToRestore(row);
                setIsRestoreModalOpen(true);
              }}
            >
              <RotateCcw size={16} className="mr-1" />
              Restaurar
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando historial de versiones...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Historial de Versiones - {kpi.name}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Visualiza y gestiona el historial de cambios de este KPI
          </p>
        </div>
        {onClose && (
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        )}
      </div>

      <Card className="p-4 bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <History className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900 mb-1">
              Versionado de KPIs
            </h3>
            <p className="text-sm text-blue-700">
              Cada vez que modificas un KPI, se crea automáticamente una nueva versión. 
              Puedes ver el historial completo de cambios, comparar versiones y restaurar 
              versiones anteriores si es necesario.
            </p>
          </div>
        </div>
      </Card>

      {history.length === 0 ? (
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">
            No hay historial de versiones para este KPI
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Las versiones se crean automáticamente cuando modificas el KPI
          </p>
        </Card>
      ) : (
        <Table
          data={history}
          columns={columns}
          loading={false}
          emptyMessage="No hay versiones"
        />
      )}

      {/* Modal para ver detalles de versión */}
      <Modal
        isOpen={isVersionModalOpen}
        onClose={() => {
          setIsVersionModalOpen(false);
          setSelectedVersion(null);
        }}
        title={`Versión ${selectedVersion?.version || ''}`}
        size="lg"
        footer={
          <Button
            variant="secondary"
            onClick={() => {
              setIsVersionModalOpen(false);
              setSelectedVersion(null);
            }}
          >
            Cerrar
          </Button>
        }
      >
        {selectedVersion && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nombre</label>
                <p className="text-gray-900">{selectedVersion.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Métrica</label>
                <p className="text-gray-900">{selectedVersion.metric}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Unidad</label>
                <p className="text-gray-900">{selectedVersion.unit}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Categoría</label>
                <p className="text-gray-900">{selectedVersion.category}</p>
              </div>
              {selectedVersion.target !== undefined && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Objetivo</label>
                  <p className="text-gray-900">{selectedVersion.target} {selectedVersion.unit}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700">Estado</label>
                <Badge variant={selectedVersion.enabled ? 'green' : 'gray'}>
                  {selectedVersion.enabled ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>
            {selectedVersion.description && (
              <div>
                <label className="text-sm font-medium text-gray-700">Descripción</label>
                <p className="text-gray-900">{selectedVersion.description}</p>
              </div>
            )}
            {selectedVersion.changeNotes && (
              <div>
                <label className="text-sm font-medium text-gray-700">Notas de Cambio</label>
                <p className="text-gray-900">{selectedVersion.changeNotes}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-700">Creado</label>
              <p className="text-gray-900">
                {new Date(selectedVersion.createdAt).toLocaleString('es-ES')} por {selectedVersion.createdByName}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de confirmación para restaurar */}
      <Modal
        isOpen={isRestoreModalOpen}
        onClose={() => {
          setIsRestoreModalOpen(false);
          setVersionToRestore(null);
        }}
        title="Restaurar Versión"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsRestoreModalOpen(false);
                setVersionToRestore(null);
              }}
              disabled={restoring}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleRestoreVersion}
              disabled={restoring}
            >
              {restoring ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Restaurando...
                </>
              ) : (
                <>
                  <RotateCcw size={16} className="mr-2" />
                  Restaurar Versión
                </>
              )}
            </Button>
          </div>
        }
      >
        {versionToRestore && (
          <div className="space-y-4">
            <p className="text-gray-700">
              ¿Estás seguro de que deseas restaurar la versión <strong>{versionToRestore.version}</strong>?
            </p>
            <p className="text-sm text-gray-600">
              Esto creará una nueva versión con los valores de la versión seleccionada. 
              La versión actual se mantendrá en el historial.
            </p>
            {versionToRestore.changeNotes && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Notas de la versión:</p>
                <p className="text-sm text-gray-600">{versionToRestore.changeNotes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

