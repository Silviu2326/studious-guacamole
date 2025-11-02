import React, { useState, useEffect } from 'react';
import { ApiKey, ApiKeyFormData } from '../types';
import { webhooksApiKeysApi } from '../api';
import { ApiKeyListItem } from './ApiKeyListItem';
import { Card, Button, Modal, Input, ConfirmModal, Badge } from '../../../components/componentsreutilizables';
import { AVAILABLE_SCOPES } from '../types';
import { Plus, Key } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';

export const ApiKeysManager: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [newKeyModalOpen, setNewKeyModalOpen] = useState(false);
  const [selectedKeyToRevoke, setSelectedKeyToRevoke] = useState<string | null>(null);
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<ApiKey | null>(null);
  
  const [formData, setFormData] = useState<ApiKeyFormData>({
    name: '',
    scopes: [],
  });
  const [formErrors, setFormErrors] = useState<{ name?: string; scopes?: string }>({});

  useEffect(() => {
    cargarApiKeys();
  }, []);

  const cargarApiKeys = async () => {
    try {
      setLoading(true);
      const keys = await webhooksApiKeysApi.obtenerApiKeys();
      setApiKeys(keys);
    } catch (error) {
      console.error('Error al cargar API Keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async () => {
    setFormErrors({});

    if (!formData.name.trim()) {
      setFormErrors({ name: 'El nombre es requerido' });
      return;
    }

    if (formData.scopes.length === 0) {
      setFormErrors({ scopes: 'Debe seleccionar al menos un permiso' });
      return;
    }

    try {
      const newKey = await webhooksApiKeysApi.crearApiKey(formData);
      setNewlyGeneratedKey(newKey);
      setNewKeyModalOpen(true);
      setIsCreateModalOpen(false);
      setFormData({ name: '', scopes: [] });
      await cargarApiKeys();
    } catch (error) {
      console.error('Error al crear API Key:', error);
      alert('Error al crear la API Key. Por favor, intente nuevamente.');
    }
  };

  const handleRevokeKey = async () => {
    if (!selectedKeyToRevoke) return;

    try {
      await webhooksApiKeysApi.revocarApiKey(selectedKeyToRevoke);
      setIsRevokeModalOpen(false);
      setSelectedKeyToRevoke(null);
      await cargarApiKeys();
    } catch (error) {
      console.error('Error al revocar API Key:', error);
      alert('Error al revocar la API Key. Por favor, intente nuevamente.');
    }
  };

  const handleToggleScope = (scopeValue: string) => {
    setFormData({
      ...formData,
      scopes: formData.scopes.includes(scopeValue)
        ? formData.scopes.filter((s) => s !== scopeValue)
        : [...formData.scopes, scopeValue],
    });
  };

  const handleNewKeyModalClose = () => {
    setNewKeyModalOpen(false);
    setNewlyGeneratedKey(null);
  };

  const openRevokeModal = (keyId: string) => {
    setSelectedKeyToRevoke(keyId);
    setIsRevokeModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            API Keys
          </h2>
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-1`}>
            Genera claves de API seguras para integrar sistemas externos
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          leftIcon={<Plus className="w-5 h-5" />}
        >
          Generar Nueva Clave
        </Button>
      </div>

      <Card padding="none" variant="default">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Cargando API Keys...
            </p>
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="w-10 h-10 text-white" />
            </div>
            <p className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
              No hay API Keys creadas
            </p>
            <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
              Genera tu primera API Key para comenzar con las integraciones
            </p>
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<Plus className="w-5 h-5" />}
            >
              Generar API Key
            </Button>
          </div>
        ) : (
          <div>
            {apiKeys.map((apiKey) => (
              <ApiKeyListItem
                key={apiKey.id}
                apiKey={apiKey}
                onRevoke={openRevokeModal}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Modal para crear nueva API Key */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Generar Nueva API Key"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateKey}
            >
              Generar Clave
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <Input
            label="Nombre de la API Key"
            placeholder="Ej: CRM Integration, Access Control System..."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
            helperText="Un nombre descriptivo para identificar esta clave"
          />

          <div>
            <label className={`block ${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-3`}>
              Permisos (Scopes)
              {formErrors.scopes && (
                <span className={`${ds.typography.caption} ${ds.color.error} ml-2`}>
                  {formErrors.scopes}
                </span>
              )}
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              {AVAILABLE_SCOPES.map((scope) => (
                <label
                  key={scope.value}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.scopes.includes(scope.value)}
                    onChange={() => handleToggleScope(scope.value)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <div className="flex-1">
                    <span className={`${ds.typography.body} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {scope.label}
                    </span>
                    <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} ml-2 font-mono`}>
                      ({scope.value})
                    </span>
                  </div>
                </label>
              ))}
            </div>
            <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mt-2`}>
              Selecciona los permisos que necesitará tu aplicación. Se recomienda usar el principio de mínimo privilegio.
            </p>
          </div>
        </div>
      </Modal>

      {/* Modal para mostrar la nueva API Key generada */}
      <Modal
        isOpen={newKeyModalOpen}
        onClose={handleNewKeyModalClose}
        title="API Key Generada Exitosamente"
        size="lg"
        showCloseButton={false}
      >
        {newlyGeneratedKey && (
          <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className={`${ds.typography.body} font-semibold text-yellow-900 dark:text-yellow-100 mb-2`}>
                Importante: Guarda esta clave ahora
              </p>
              <p className={`${ds.typography.bodySmall} text-yellow-800 dark:text-yellow-200`}>
                Esta es la única vez que podrás ver la clave secreta completa. No podrás recuperarla más tarde.
              </p>
            </div>

            <div>
              <label className={`block ${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                Nombre
              </label>
              <p className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {newlyGeneratedKey.name}
              </p>
            </div>

            <div>
              <label className={`block ${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                API Key Completa
              </label>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm break-all">
                {newlyGeneratedKey.secretKey}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {newlyGeneratedKey.scopes.map((scope) => (
                <Badge key={scope} variant="secondary" size="sm">
                  {scope}
                </Badge>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={handleNewKeyModalClose}
              >
                He guardado la clave
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de confirmación para revocar */}
      <ConfirmModal
        isOpen={isRevokeModalOpen}
        onClose={() => {
          setIsRevokeModalOpen(false);
          setSelectedKeyToRevoke(null);
        }}
        onConfirm={handleRevokeKey}
        title="Revocar API Key"
        message="¿Estás seguro de que deseas revocar esta API Key? Esta acción no se puede deshacer y cualquier aplicación que use esta clave dejará de funcionar inmediatamente."
        confirmText="Revocar"
        variant="destructive"
      />
    </div>
  );
};

