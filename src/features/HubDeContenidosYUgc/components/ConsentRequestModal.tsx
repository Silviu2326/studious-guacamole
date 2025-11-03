import React, { useState } from 'react';
import { X, Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';
import { requestConsent } from '../api/ugc';

interface ConsentRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  clientInfo: {
    name: string;
    email: string;
  };
}

export const ConsentRequestModal: React.FC<ConsentRequestModalProps> = ({
  isOpen,
  onClose,
  contentId,
  clientInfo
}) => {
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSendError(null);

    try {
      await requestConsent(contentId, customMessage);
      setSendSuccess(true);
      
      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error: any) {
      setSendError(error.message || 'Error al enviar la solicitud');
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setCustomMessage('');
    setIsSending(false);
    setSendSuccess(false);
    setSendError(null);
    onClose();
  };

  const defaultMessage = `¡Hola ${clientInfo.name}!

Me encantaría obtener tu permiso para usar tu contenido en mis materiales de marketing. Tu éxito es increíble y quiero compartirlo para inspirar a otros clientes.

¿Te importaría otorgar tu consentimiento? Puedes revisar los detalles y términos de uso en el enlace que recibirás por email.

¡Gracias por tu apoyo!
`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Solicitar Consentimiento
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Para usar el contenido de {clientInfo.name}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Success Message */}
        {sendSuccess && (
          <div className="p-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900 mb-1">
                  Solicitud enviada exitosamente
                </p>
                <p className="text-sm text-green-700">
                  {clientInfo.name} recibirá un email con los detalles y podrá otorgar su consentimiento.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {!sendSuccess && (
          <div className="flex-1 overflow-y-auto p-6">
            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Importante</p>
                  <p>
                    Se enviará un email profesional a {clientInfo.email} con un enlace único 
                    para que {clientInfo.name} pueda revisar los términos y otorgar su consentimiento 
                    de forma segura.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Client Info */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Información del Cliente
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Nombre:</span>{' '}
                    <span className="text-gray-900">{clientInfo.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Email:</span>{' '}
                    <span className="text-gray-900">{clientInfo.email}</span>
                  </div>
                </div>
              </div>

              {/* Message Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Mensaje Personalizado (Opcional)
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={8}
                  placeholder={defaultMessage}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none text-sm"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Deja este campo vacío para usar el mensaje por defecto, o personalízalo según tus necesidades.
                </p>
              </div>

              {/* Preview */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Vista Previa del Email
                </h3>
                <div className="bg-white rounded-lg p-4 border border-gray-200 text-sm">
                  <div className="space-y-3">
                    <div>
                      <strong>Para:</strong> {clientInfo.email}
                    </div>
                    <div>
                      <strong>Asunto:</strong> Solicitud de Consentimiento de Uso de Imagen
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {customMessage || defaultMessage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {sendError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900 mb-1">Error</p>
                    <p className="text-sm text-red-700">{sendError}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  type="button"
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  disabled={isSending}
                  loading={isSending}
                  leftIcon={<Send size={20} />}
                  type="submit"
                >
                  Enviar Solicitud
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

