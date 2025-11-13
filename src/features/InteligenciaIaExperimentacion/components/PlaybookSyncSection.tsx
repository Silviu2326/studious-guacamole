import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Loader2,
  BookOpen,
  Eye,
} from 'lucide-react';
import { Card, Button, Badge, Modal } from '../../../components/componentsreutilizables';
import {
  PlaybookRecord,
  PlaybookSync,
  SyncStatus,
  Location,
  Trainer,
} from '../types';
import {
  getAvailableLocationsService,
  getAvailableTrainersService,
  syncPlaybookService,
  getSyncStatusService,
  resolveSyncConflictService,
} from '../services/intelligenceService';
import { useAuth } from '../../../context/AuthContext';

interface PlaybookSyncSectionProps {
  playbooks: PlaybookRecord[];
  trainerId?: string;
  onSyncComplete?: () => void;
}

const syncStatusVariant: Record<SyncStatus, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  synced: 'success',
  pending: 'warning',
  conflict: 'destructive',
  error: 'destructive',
};

const syncStatusLabel: Record<SyncStatus, string> = {
  synced: 'Sincronizado',
  pending: 'Pendiente',
  conflict: 'Conflicto',
  error: 'Error',
};

export const PlaybookSyncSection: React.FC<PlaybookSyncSectionProps> = ({
  playbooks,
  trainerId,
  onSyncComplete,
}) => {
  const { user } = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [syncs, setSyncs] = useState<PlaybookSync[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [selectedPlaybook, setSelectedPlaybook] = useState<PlaybookRecord | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedSync, setSelectedSync] = useState<PlaybookSync | null>(null);
  
  // Form state
  const [syncType, setSyncType] = useState<'location' | 'trainer' | 'both'>('both');
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);
  const [selectedTrainerIds, setSelectedTrainerIds] = useState<string[]>([]);
  const [includeStrategy, setIncludeStrategy] = useState(true);
  const [includeCopy, setIncludeCopy] = useState(true);
  const [includeAssets, setIncludeAssets] = useState(true);
  const [includeMeasurement, setIncludeMeasurement] = useState(true);
  const [adaptToTarget, setAdaptToTarget] = useState(true);

  useEffect(() => {
    loadData();
  }, [trainerId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [locationsData, trainersData, syncsData] = await Promise.all([
        getAvailableLocationsService({ excludeLocationId: user?.locationId }),
        getAvailableTrainersService({ excludeTrainerId: trainerId || user?.id }),
        getSyncStatusService({ trainerId: trainerId || user?.id, limit: 20 }),
      ]);
      setLocations(locationsData.locations);
      setTrainers(trainersData.trainers);
      setSyncs(syncsData.syncs);
    } catch (error) {
      console.error('Error cargando datos de sincronización:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncPlaybook = (playbook: PlaybookRecord) => {
    setSelectedPlaybook(playbook);
    setSyncType('both');
    setSelectedLocationIds([]);
    setSelectedTrainerIds([]);
    setIncludeStrategy(true);
    setIncludeCopy(true);
    setIncludeAssets(true);
    setIncludeMeasurement(true);
    setAdaptToTarget(true);
    setIsSyncModalOpen(true);
  };

  const handleConfirmSync = async () => {
    if (!selectedPlaybook) return;

    // Validar que al menos una sede o entrenador esté seleccionado
    if (
      (syncType === 'location' || syncType === 'both') &&
      selectedLocationIds.length === 0
    ) {
      alert('Por favor selecciona al menos una sede');
      return;
    }

    if (
      (syncType === 'trainer' || syncType === 'both') &&
      selectedTrainerIds.length === 0
    ) {
      alert('Por favor selecciona al menos un entrenador');
      return;
    }

    setSyncing(true);
    try {
      await syncPlaybookService({
        playbookId: selectedPlaybook.id,
        syncType,
        targetLocationIds: selectedLocationIds.length > 0 ? selectedLocationIds : undefined,
        targetTrainerIds: selectedTrainerIds.length > 0 ? selectedTrainerIds : undefined,
        includeStrategy,
        includeCopy,
        includeAssets,
        includeMeasurement,
        adaptToTarget,
      });

      await loadData();
      setIsSyncModalOpen(false);
      setSelectedPlaybook(null);
      setSelectedLocationIds([]);
      setSelectedTrainerIds([]);

      if (onSyncComplete) {
        onSyncComplete();
      }
    } catch (error) {
      console.error('Error sincronizando playbook:', error);
      alert('Error al sincronizar el playbook. Intenta nuevamente.');
    } finally {
      setSyncing(false);
    }
  };

  const handleViewSyncStatus = (sync: PlaybookSync) => {
    setSelectedSync(sync);
    setIsStatusModalOpen(true);
  };

  const handleResolveConflict = async (sync: PlaybookSync, resolution: 'source' | 'target' | 'merge') => {
    try {
      await resolveSyncConflictService({
        syncId: sync.id,
        resolution,
      });
      await loadData();
      setIsStatusModalOpen(false);
      setSelectedSync(null);
    } catch (error) {
      console.error('Error resolviendo conflicto:', error);
      alert('Error al resolver el conflicto. Intenta nuevamente.');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-0 shadow-sm border border-slate-200/70">
        <div className="px-6 py-5 border-b border-slate-200/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                <RefreshCw size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Sincronizar Playbooks
                </h2>
                <p className="text-sm text-slate-600">
                  Sincroniza playbooks con otras sedes o entrenadores para escalar tu metodología
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RefreshCw size={16} />}
              onClick={loadData}
              disabled={loading}
            >
              Actualizar
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Lista de playbooks disponibles para sincronizar */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              Playbooks Disponibles
            </h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-emerald-600" />
                <span className="ml-2 text-sm text-slate-600">Cargando playbooks...</span>
              </div>
            ) : playbooks.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen size={48} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-600 font-medium">No hay playbooks disponibles</p>
                <p className="text-sm text-slate-500 mt-1">
                  Crea un playbook para comenzar a sincronizar
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {playbooks.slice(0, 5).map((playbook) => (
                  <Card
                    key={playbook.id}
                    className="p-4 border border-slate-200 hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-1">{playbook.name}</h4>
                        <p className="text-sm text-slate-600 mb-2">{playbook.objective}</p>
                        <div className="flex items-center gap-2">
                          {playbook.channels.map((channel) => (
                            <Badge key={channel} variant="secondary" size="sm">
                              {channel}
                            </Badge>
                          ))}
                          <Badge
                            variant={playbook.impact === 'Alto' ? 'purple' : playbook.impact === 'Medio' ? 'blue' : 'secondary'}
                            size="sm"
                          >
                            {playbook.impact}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<RefreshCw size={16} />}
                        onClick={() => handleSyncPlaybook(playbook)}
                      >
                        Sincronizar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Lista de sincronizaciones recientes */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              Sincronizaciones Recientes
            </h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-emerald-600" />
                <span className="ml-2 text-sm text-slate-600">Cargando sincronizaciones...</span>
              </div>
            ) : syncs.length === 0 ? (
              <div className="text-center py-8">
                <RefreshCw size={48} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-600 font-medium">No hay sincronizaciones</p>
                <p className="text-sm text-slate-500 mt-1">
                  Las sincronizaciones aparecerán aquí
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {syncs.map((sync) => (
                  <Card
                    key={sync.id}
                    className="p-4 border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer"
                    onClick={() => handleViewSyncStatus(sync)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-slate-900">{sync.playbookName}</h4>
                          <Badge variant={syncStatusVariant[sync.status]} size="sm">
                            {syncStatusLabel[sync.status]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Building2 size={14} />
                            <span>
                              {sync.sourceLocationName || 'Sede origen'} →{' '}
                              {sync.targetLocationName || 'Sede destino'}
                            </span>
                          </div>
                          {sync.targetTrainerName && (
                            <div className="flex items-center gap-1">
                              <Users size={14} />
                              <span>{sync.targetTrainerName}</span>
                            </div>
                          )}
                        </div>
                        {sync.syncedAt && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock size={12} />
                            <span>Sincronizado: {formatDate(sync.syncedAt)}</span>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Eye size={16} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewSyncStatus(sync);
                        }}
                      >
                        Ver
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Modal de sincronización */}
      <Modal
        isOpen={isSyncModalOpen}
        onClose={() => {
          setIsSyncModalOpen(false);
          setSelectedPlaybook(null);
        }}
        title={`Sincronizar Playbook: ${selectedPlaybook?.name || ''}`}
        size="lg"
      >
        {selectedPlaybook && (
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-1">{selectedPlaybook.name}</h4>
              <p className="text-sm text-slate-600">{selectedPlaybook.objective}</p>
            </div>

            {/* Tipo de sincronización */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tipo de sincronización
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSyncType('location')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    syncType === 'location'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Building2 size={16} className="inline mr-2" />
                  Sedes
                </button>
                <button
                  onClick={() => setSyncType('trainer')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    syncType === 'trainer'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Users size={16} className="inline mr-2" />
                  Entrenadores
                </button>
                <button
                  onClick={() => setSyncType('both')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    syncType === 'both'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Ambos
                </button>
              </div>
            </div>

            {/* Selección de sedes */}
            {(syncType === 'location' || syncType === 'both') && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Seleccionar sedes destino
                </label>
                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg">
                  {locations.map((location) => (
                    <div
                      key={location.id}
                      className="p-3 flex items-center gap-3 hover:bg-slate-50 cursor-pointer border-b border-slate-200 last:border-b-0"
                      onClick={() => {
                        if (selectedLocationIds.includes(location.id)) {
                          setSelectedLocationIds(selectedLocationIds.filter((id) => id !== location.id));
                        } else {
                          setSelectedLocationIds([...selectedLocationIds, location.id]);
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedLocationIds.includes(location.id)}
                        onChange={() => {
                          if (selectedLocationIds.includes(location.id)) {
                            setSelectedLocationIds(selectedLocationIds.filter((id) => id !== location.id));
                          } else {
                            setSelectedLocationIds([...selectedLocationIds, location.id]);
                          }
                        }}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <Building2 size={16} className="text-slate-500" />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{location.name}</p>
                        {location.city && (
                          <p className="text-xs text-slate-500">{location.city}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selección de entrenadores */}
            {(syncType === 'trainer' || syncType === 'both') && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Seleccionar entrenadores destino
                </label>
                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg">
                  {trainers.map((trainer) => (
                    <div
                      key={trainer.id}
                      className="p-3 flex items-center gap-3 hover:bg-slate-50 cursor-pointer border-b border-slate-200 last:border-b-0"
                      onClick={() => {
                        if (selectedTrainerIds.includes(trainer.id)) {
                          setSelectedTrainerIds(selectedTrainerIds.filter((id) => id !== trainer.id));
                        } else {
                          setSelectedTrainerIds([...selectedTrainerIds, trainer.id]);
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTrainerIds.includes(trainer.id)}
                        onChange={() => {
                          if (selectedTrainerIds.includes(trainer.id)) {
                            setSelectedTrainerIds(selectedTrainerIds.filter((id) => id !== trainer.id));
                          } else {
                            setSelectedTrainerIds([...selectedTrainerIds, trainer.id]);
                          }
                        }}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <Users size={16} className="text-slate-500" />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{trainer.name}</p>
                        <p className="text-xs text-slate-500">{trainer.email}</p>
                        {trainer.locationName && (
                          <p className="text-xs text-slate-400">{trainer.locationName}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Opciones de sincronización */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contenido a sincronizar
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeStrategy}
                    onChange={(e) => setIncludeStrategy(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700">Estrategia</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeCopy}
                    onChange={(e) => setIncludeCopy(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700">Copy</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeAssets}
                    onChange={(e) => setIncludeAssets(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700">Assets</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeMeasurement}
                    onChange={(e) => setIncludeMeasurement(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700">Medición</span>
                </label>
              </div>
            </div>

            {/* Adaptar al destino */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={adaptToTarget}
                  onChange={(e) => setAdaptToTarget(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-sm text-slate-700">
                  Adaptar al estilo del entrenador/sede destino
                </span>
              </label>
              <p className="text-xs text-slate-500 mt-1">
                El playbook se adaptará automáticamente al estilo y audiencia del destino
              </p>
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsSyncModalOpen(false);
                  setSelectedPlaybook(null);
                }}
                disabled={syncing}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmSync}
                disabled={
                  syncing ||
                  ((syncType === 'location' || syncType === 'both') && selectedLocationIds.length === 0) ||
                  ((syncType === 'trainer' || syncType === 'both') && selectedTrainerIds.length === 0)
                }
                leftIcon={syncing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              >
                {syncing ? 'Sincronizando...' : 'Sincronizar'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de estado de sincronización */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setSelectedSync(null);
        }}
        title={`Estado de Sincronización: ${selectedSync?.playbookName || ''}`}
        size="lg"
      >
        {selectedSync && (
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={syncStatusVariant[selectedSync.status]} size="sm">
                  {syncStatusLabel[selectedSync.status]}
                </Badge>
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">{selectedSync.playbookName}</h4>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Building2 size={14} />
                  <span>
                    {selectedSync.sourceLocationName || 'Sede origen'} →{' '}
                    {selectedSync.targetLocationName || 'Sede destino'}
                  </span>
                </div>
                {selectedSync.targetTrainerName && (
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{selectedSync.targetTrainerName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Información de sincronización */}
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-700">Origen:</p>
                <p className="text-sm text-slate-600">{selectedSync.sourceTrainerName}</p>
                {selectedSync.sourceLocationName && (
                  <p className="text-xs text-slate-500">{selectedSync.sourceLocationName}</p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Destino:</p>
                {selectedSync.targetTrainerName && (
                  <p className="text-sm text-slate-600">{selectedSync.targetTrainerName}</p>
                )}
                {selectedSync.targetLocationName && (
                  <p className="text-xs text-slate-500">{selectedSync.targetLocationName}</p>
                )}
              </div>
              {selectedSync.syncedAt && (
                <div>
                  <p className="text-sm font-medium text-slate-700">Sincronizado:</p>
                  <p className="text-sm text-slate-600">{formatDate(selectedSync.syncedAt)}</p>
                </div>
              )}
              {selectedSync.errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-700">Error:</p>
                  <p className="text-sm text-red-600">{selectedSync.errorMessage}</p>
                </div>
              )}
            </div>

            {/* Resolver conflicto */}
            {selectedSync.status === 'conflict' && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-yellow-700 mb-3">
                  Conflicto detectado. Selecciona una resolución:
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleResolveConflict(selectedSync, 'source')}
                  >
                    Usar versión origen
                  </Button>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleResolveConflict(selectedSync, 'target')}
                  >
                    Usar versión destino
                  </Button>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleResolveConflict(selectedSync, 'merge')}
                  >
                    Combinar
                  </Button>
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsStatusModalOpen(false);
                  setSelectedSync(null);
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PlaybookSyncSection;

