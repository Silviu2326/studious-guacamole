import React, { useState } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { LoyaltyReward } from '../api/loyalty';
import { Edit, Trash2, Plus, Image as ImageIcon } from 'lucide-react';

interface RewardsCatalogManagerProps {
  rewards: LoyaltyReward[];
  onAddReward: (newReward: Omit<LoyaltyReward, 'id'>) => void;
  onEditReward: (rewardId: string, updates: Partial<LoyaltyReward>) => void;
  onDeleteReward: (rewardId: string) => void;
}

export const RewardsCatalogManager: React.FC<RewardsCatalogManagerProps> = ({
  rewards,
  onAddReward,
  onEditReward,
  onDeleteReward
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<LoyaltyReward | null>(null);

  const handleAddReward = () => {
    setIsAddModalOpen(true);
  };

  const handleEditReward = (reward: LoyaltyReward) => {
    setSelectedReward(reward);
    setIsEditModalOpen(true);
  };

  const handleDelete = (rewardId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta recompensa?')) {
      onDeleteReward(rewardId);
    }
  };

  const handleModalSubmit = (formData: any) => {
    if (selectedReward) {
      onEditReward(selectedReward.id, formData);
      setIsEditModalOpen(false);
      setSelectedReward(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button variant="primary" onClick={handleAddReward} leftIcon={<Plus size={20} />}>
          Añadir Recompensa
        </Button>
      </div>

      {/* Grid de recompensas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rewards.map((reward) => (
          <Card key={reward.id} variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden">
            {reward.imageUrl ? (
              <img
                src={reward.imageUrl}
                alt={reward.name}
                className="w-full h-48 bg-gray-100 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-gray-400" />
              </div>
            )}

            <div className="p-4 flex flex-col flex-1">
              <div className="mb-2">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                  {reward.pointsCost} puntos
                </span>
                {reward.stock !== undefined && (
                  <span className="ml-2 text-xs text-gray-600">Stock: {reward.stock}</span>
                )}
              </div>

              <h3 className="font-semibold text-gray-900 mb-1">{reward.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{reward.description}</p>

              <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEditReward(reward)}
                  leftIcon={<Edit size={16} />}
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(reward.id)}
                  leftIcon={<Trash2 size={16} />}
                >
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Simplified Add/Edit Modal - In production, this would be a more complex form */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full bg-white shadow-sm">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                {isAddModalOpen ? 'Añadir Recompensa' : 'Editar Recompensa'}
              </h3>
              <p className="text-gray-600 mb-4">
                Esta funcionalidad requiere un formulario completo con validación.
                Implementación completa pendiente.
              </p>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    setSelectedReward(null);
                  }}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

