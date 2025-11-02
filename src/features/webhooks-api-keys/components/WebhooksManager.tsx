import React, { useState, useEffect } from 'react';
import { Webhook } from '../types';
import { webhooksApiKeysApi } from '../api';
import { Card, Button, ConfirmModal, Badge } from '../../../components/componentsreutilizables';
import { Plus, Webhook as WebhookIcon, Activity, XCircle } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import { WebhookForm } from './WebhookForm';
import { WebhookLogsModal } from './WebhookLogsModal';

export const WebhooksManager: React.FC = () => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [webhookToDelete, setWebhookToDelete] = useState<string | null>(null);

  useEffect(() => {
    cargarWebhooks();
  }, []);

  const cargarWebhooks = async () => {
    try {
      setLoading(true);
      const hooks = await webhooksApiKeysApi.obtenerWebhooks();
      setWebhooks(hooks);
    } catch (error) {
      console.error('Error al cargar webhooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWebhook = async (data: any) => {
    try {
      await webhooksApiKeysApi.crearWebhook(data);
      setIsCreateModalOpen(false);
      await cargarWebhooks();
    } catch (error) {
      console.error('Error al crear webhook:', error);
      throw error;
    }
  };

  const handleEditWebhook = async (data: any) => {
    if (!selectedWebhook) return;
    
    try {
      await webhooksApiKeysApi.actualizarWebhook(selectedWebhook.id, data);
      setIsEditModalOpen(false);
      setSelectedWebhook(null);
      await cargarWebhooks();
    } catch (error) {
      console.error('Error al actualizar webhook:', error);
      throw error;
    }
  };

  const handleDeleteWebhook = async () => {
    if (!webhookToDelete) return;

    try {
      await webhooksApiKeysApi.eliminarWebhook(webhookToDelete);
      setIsDeleteModalOpen(false);
      setWebhookToDelete(null);
      await cargarWebhooks();
    } catch (error) {
      console.error('Error al eliminar webhook:', error);
      alert('Error al eliminar el webhook. Por favor, intente nuevamente.');
    }
  };

  const openEditModal = (webhook: Webhook) => {
    setSelectedWebhook(webhook);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (webhookId: string) => {
    setWebhookToDelete(webhookId);
    setIsDeleteModalOpen(true);
  };

  const openLogsModal = (webhook: Webhook) => {
    setSelectedWebhook(webhook);
    setIsLogsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" size="sm">Activo</Badge>;
      case 'disabled':
        return <Badge variant="secondary" size="sm">Deshabilitado</Badge>;
      case 'failed':
        return <Badge variant="destructive" size="sm">Fallido</Badge>;
      default:
        return <Badge variant="secondary" size="sm">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            Webhooks
          </h2>
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-1`}>
            Configura notificaciones automáticas a sistemas externos
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          leftIcon={<Plus className="w-5 h-5" />}
        >
          Crear Webhook
        </Button>
      </div>

      <Card padding="none" variant="default">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Cargando webhooks...
            </p>
          </div>
        ) : webhooks.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <WebhookIcon className="w-10 h-10 text-white" />
            </div>
            <p className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
              No hay webhooks configurados
            </p>
            <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
              Crea tu primer webhook para recibir notificaciones en tiempo real
            </p>
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<Plus className="w-5 h-5" />}
            >
              Crear Webhook
            </Button>
          </div>
        ) : (
          <div>
            {webhooks.map((webhook) => (
              <div
                key={webhook.id}
                className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {webhook.name}
                      </h3>
                      {getStatusBadge(webhook.status)}
                    </div>

                    <div className="mb-2">
                      <span className={`${ds.typography.bodySmall} ${ds.color.textMuted} ${ds.color.textMutedDark} font-mono break-all`}>
                        {webhook.targetUrl}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-2">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="secondary" size="sm">
                          {event}
                        </Badge>
                      ))}
                    </div>

                    <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                      Creado: {formatDate(webhook.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => openLogsModal(webhook)}
                      className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Ver logs"
                    >
                      <Activity className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => openEditModal(webhook)}
                      className="p-2 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      title="Editar webhook"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => openDeleteModal(webhook.id)}
                      className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      title="Eliminar webhook"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal para crear/editar webhook */}
      <WebhookForm
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedWebhook(null);
        }}
        webhookToEdit={selectedWebhook}
        onSubmit={selectedWebhook ? handleEditWebhook : handleCreateWebhook}
      />

      {/* Modal para ver logs */}
      {selectedWebhook && (
        <WebhookLogsModal
          isOpen={isLogsModalOpen}
          onClose={() => {
            setIsLogsModalOpen(false);
            setSelectedWebhook(null);
          }}
          webhookId={selectedWebhook.id}
          webhookName={selectedWebhook.name}
        />
      )}

      {/* Modal de confirmación para eliminar */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setWebhookToDelete(null);
        }}
        onConfirm={handleDeleteWebhook}
        title="Eliminar Webhook"
        message="¿Estás seguro de que deseas eliminar este webhook? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="destructive"
      />
    </div>
  );
};

