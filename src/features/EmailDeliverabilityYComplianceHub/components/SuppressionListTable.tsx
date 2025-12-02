import React, { useState } from 'react';
import { SuppressedEmail } from '../api/emailCompliance';
import { Card, Button, Input, Modal } from '../../../components/componentsreutilizables';
import { Plus, Search, Trash2, Mail } from 'lucide-react';

interface SuppressionListTableProps {
  trainerId: string;
  suppressedEmails: SuppressedEmail[];
  onAddEmail: (email: string, reason?: string) => Promise<void>;
  onRemoveEmail: (email: string) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Muestra la lista de supresión en una tabla paginada y con búsqueda.
 * Permite añadir y eliminar emails manualmente.
 */
export const SuppressionListTable: React.FC<SuppressionListTableProps> = ({
  trainerId,
  suppressedEmails,
  onAddEmail,
  onRemoveEmail,
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newEmail, setNewEmail] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const filteredEmails = suppressedEmails.filter(email =>
    email.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      hard_bounce: 'Rebote Hard',
      soft_bounce: 'Rebote Soft',
      spam_complaint: 'Queja de Spam',
      unsubscribe: 'Baja de Suscripción',
      manual_add: 'Añadido Manualmente'
    };
    return labels[reason] || reason;
  };

  const getReasonColor = (reason: string) => {
    const colors: Record<string, string> = {
      hard_bounce: 'bg-red-100 text-red-800',
      soft_bounce: 'bg-yellow-100 text-yellow-800',
      spam_complaint: 'bg-orange-100 text-orange-800',
      unsubscribe: 'bg-gray-100 text-gray-800',
      manual_add: 'bg-blue-100 text-blue-800'
    };
    return colors[reason] || 'bg-gray-100 text-gray-800';
  };

  const handleAddEmail = async () => {
    if (!newEmail.trim()) return;
    
    setIsAdding(true);
    try {
      await onAddEmail(newEmail.trim(), 'manual_add');
      setNewEmail('');
      setShowAddModal(false);
    } catch (error) {
      console.error('Error añadiendo email:', error);
      alert('Error al añadir el email. Verifica el formato.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveEmail = async (email: string) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar ${email} de la lista de supresión?`)) return;
    
    try {
      await onRemoveEmail(email);
    } catch (error) {
      console.error('Error eliminando email:', error);
      alert('Error al eliminar el email.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con búsqueda y botón añadir */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por email..."
                leftIcon={<Search size={18} />}
              />
            </div>
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
              leftIcon={<Plus size={20} />}
            >
              Añadir Email
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabla */}
      <Card className="p-0 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Razón
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Notas
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Cargando...
                  </td>
                </tr>
              ) : filteredEmails.length > 0 ? (
                filteredEmails.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{item.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getReasonColor(item.reason)}`}>
                        {getReasonLabel(item.reason)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(item.date).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.notes || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemoveEmail(item.email)}
                        className="text-red-600 hover:text-red-900 hover:bg-red-50 p-1.5 rounded transition"
                        title="Eliminar de la lista"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'No se encontraron resultados' : 'No hay emails en la lista de supresión'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal para añadir email */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNewEmail('');
        }}
        title="Añadir Email a Lista de Supresión"
        size="md"
      >
        <div className="space-y-4">
          <Input
            type="email"
            label="Email *"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="email@ejemplo.com"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddEmail();
              }
            }}
          />
          
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <Button
              variant="ghost"
              onClick={() => {
                setShowAddModal(false);
                setNewEmail('');
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleAddEmail}
              disabled={isAdding || !newEmail.trim()}
              loading={isAdding}
            >
              Añadir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};


