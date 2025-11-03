import React, { useState } from 'react';
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Catálogo de Recompensas</h2>
        <button
          onClick={handleAddReward}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          <Plus className="w-4 h-4" />
          Añadir Recompensa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
          >
            {reward.imageUrl ? (
              <img
                src={reward.imageUrl}
                alt={reward.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
            ) : (
              <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-gray-400" />
              </div>
            )}

            <div className="mb-2">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                {reward.pointsCost} puntos
              </span>
              {reward.stock !== undefined && (
                <span className="ml-2 text-xs text-gray-600">Stock: {reward.stock}</span>
              )}
            </div>

            <h3 className="font-semibold text-gray-900 mb-1">{reward.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{reward.description}</p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEditReward(reward)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => handleDelete(reward.id)}
                className="px-3 py-2 text-sm text-red-600 bg-red-50 rounded hover:bg-red-100 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Simplified Add/Edit Modal - In production, this would be a more complex form */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              {isAddModalOpen ? 'Añadir Recompensa' : 'Editar Recompensa'}
            </h3>
            <p className="text-gray-600 mb-4">
              Esta funcionalidad requiere un formulario completo con validación.
              Implementación completa pendiente.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  setSelectedReward(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

