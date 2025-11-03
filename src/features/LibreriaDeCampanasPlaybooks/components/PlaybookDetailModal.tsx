import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Globe, Smartphone, Rocket, Loader2 } from 'lucide-react';
import { getPlaybookTemplate, activatePlaybook, PlaybookAsset, PlaybookDetail } from '../api/playbooks';
import { Modal, Button, Input } from '../../../components/componentsreutilizables';

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
      email: 'bg-blue-100 text-blue-600',
      social_post: 'bg-blue-100 text-blue-600',
      landing_page: 'bg-green-100 text-green-600',
      sms: 'bg-orange-100 text-orange-600'
    };
    return colors[type];
  };

  const footerContent = !showActivationForm ? (
    <div className="flex justify-end gap-3">
      <Button variant="secondary" onClick={onClose}>
        Cerrar
      </Button>
      <Button
        variant="primary"
        onClick={() => setShowActivationForm(true)}
        leftIcon={<Rocket size={20} />}
      >
        Activar Campaña
      </Button>
    </div>
  ) : null;

  return (
    <Modal
      isOpen={!!playbookId}
      onClose={onClose}
      title={playbookDetails?.name || 'Cargando...'}
      size="xl"
      footer={footerContent}
      className="max-h-[90vh] overflow-hidden flex flex-col"
    >
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
          </div>
        ) : playbookDetails ? (
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción Completa</h3>
              <p className="text-gray-700 leading-relaxed">
                {playbookDetails.fullDescription}
              </p>
            </div>

            {/* Activation Form */}
            {showActivationForm && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Activar Campaña</h3>
                <Input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Nombre de tu campaña"
                  className="mb-3"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleActivate}
                    disabled={!campaignName.trim() || isActivating}
                    loading={isActivating}
                    leftIcon={!isActivating ? <Rocket size={20} /> : undefined}
                  >
                    {isActivating ? 'Activando...' : 'Activar Ahora'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowActivationForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {/* Assets */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
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
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No se pudo cargar el detalle del playbook</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

