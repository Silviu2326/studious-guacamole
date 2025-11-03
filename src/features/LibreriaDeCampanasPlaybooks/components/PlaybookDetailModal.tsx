import React, { useState, useEffect } from 'react';
import { X, Mail, MessageSquare, Globe, Smartphone, Rocket, Loader } from 'lucide-react';
import { getPlaybookTemplate, activatePlaybook, PlaybookAsset, PlaybookDetail } from '../api/playbooks';

interface PlaybookDetailModalProps {
  playbookId: string | null;
  onClose: () => void;
  onActivated?: (campaignId: string) => void;
}

export const PlaybookDetailModal: React.FC<PlaybookDetailModalProps> = ({
  playbookId,
  onClose,
  onActivated
}) => {
  const [playbookDetails, setPlaybookDetails] = useState<PlaybookDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActivating, setIsActivating] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [showActivationForm, setShowActivationForm] = useState(false);

  useEffect(() => {
    if (playbookId) {
      loadPlaybookDetails();
    }
  }, [playbookId]);

  const loadPlaybookDetails = async () => {
    if (!playbookId) return;
    
    setIsLoading(true);
    try {
      const details = await getPlaybookTemplate(playbookId);
      setPlaybookDetails(details);
      if (details) {
        setCampaignName(`${details.name} - Mi Campaña`);
      }
    } catch (error) {
      console.error('Error loading playbook details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!playbookId || !campaignName.trim()) return;

    setIsActivating(true);
    try {
      const response = await activatePlaybook(playbookId, campaignName);
      onActivated?.(response.campaignId);
      onClose();
      setTimeout(() => {
        alert(`¡Campaña "${campaignName}" activada exitosamente!`);
      }, 500);
    } catch (error) {
      alert('Error al activar la campaña. Por favor, inténtalo de nuevo.');
    } finally {
      setIsActivating(false);
    }
  };

  const getAssetIcon = (type: PlaybookAsset['type']) => {
    const icons = {
      email: Mail,
      social_post: MessageSquare,
      landing_page: Globe,
      sms: Smartphone
    };
    return icons[type];
  };

  const getAssetColor = (type: PlaybookAsset['type']) => {
    const colors = {
      email: 'bg-purple-100 text-purple-600',
      social_post: 'bg-blue-100 text-blue-600',
      landing_page: 'bg-green-100 text-green-600',
      sms: 'bg-orange-100 text-orange-600'
    };
    return colors[type];
  };

  if (!playbookId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {playbookDetails?.name || 'Cargando...'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : playbookDetails ? (
            <>
              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Descripción Completa</h3>
                <p className="text-gray-700 leading-relaxed">
                  {playbookDetails.fullDescription}
                </p>
              </div>

              {/* Activation Form */}
              {showActivationForm && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-3">Activar Campaña</h3>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="Nombre de tu campaña"
                    className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleActivate}
                      disabled={!campaignName.trim() || isActivating}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {isActivating ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Activando...
                        </>
                      ) : (
                        <>
                          <Rocket className="w-4 h-4" />
                          Activar Ahora
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowActivationForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Assets */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Activos Incluidos ({playbookDetails.assets.length})
                </h3>
                <div className="space-y-3">
                  {playbookDetails.assets.map((asset) => {
                    const AssetIcon = getAssetIcon(asset.type);
                    return (
                      <div
                        key={asset.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${getAssetColor(asset.type)}`}>
                            <AssetIcon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">{asset.name}</h4>
                            <p className="text-sm text-gray-600">{asset.previewContent}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No se pudo cargar el detalle del playbook</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          {!showActivationForm ? (
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Cerrar
              </button>
              <button
                onClick={() => setShowActivationForm(true)}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                <Rocket className="w-4 h-4" />
                Activar Campaña
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

