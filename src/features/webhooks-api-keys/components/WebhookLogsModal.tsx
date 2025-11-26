import React, { useState, useEffect } from 'react';
import { WebhookDeliveryLog } from '../types';
import { webhooksApiKeysApi } from '../api';
import { Modal, Badge } from '../../../components/componentsreutilizables';
import { Activity } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';

interface WebhookLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  webhookId: string;
  webhookName: string;
}

export const WebhookLogsModal: React.FC<WebhookLogsModalProps> = ({
  isOpen,
  onClose,
  webhookId,
  webhookName,
}) => {
  const [logs, setLogs] = useState<WebhookDeliveryLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      cargarLogs();
    }
  }, [isOpen, webhookId]);

  const cargarLogs = async () => {
    try {
      setLoading(true);
      const logsData = await webhooksApiKeysApi.obtenerWebhookLogs(webhookId, 100);
      setLogs(logsData);
    } catch (error) {
      console.error('Error al cargar logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="success" size="sm">Éxito</Badge>;
      case 'failed':
        return <Badge variant="destructive" size="sm">Fallido</Badge>;
      case 'pending_retry':
        return <Badge variant="secondary" size="sm">Reintentando</Badge>;
      default:
        return <Badge variant="secondary" size="sm">{status}</Badge>;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Logs de Entrega - ${webhookName}`}
      size="xl"
      footer={
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Cerrar
        </button>
      }
    >
      {loading ? (
        <div className="py-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Cargando logs...
          </p>
        </div>
      ) : logs.length === 0 ? (
        <div className="py-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <p className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            No hay logs disponibles
          </p>
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Este webhook aún no ha recibido eventos para enviar.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left">
                  <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    Fecha
                  </span>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    Evento
                  </span>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    Estado
                  </span>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    Código
                  </span>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    Intentos
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                      {formatDateTime(log.timestamp)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} font-mono`}>
                      {log.eventType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(log.status)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                      {log.responseCode}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                      {log.attemptCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
};

