// Componente ChecklistItem - Presentacional
import React, { useState } from 'react';
import { TaskStatus } from '../types';
import { Input, Textarea, Button, Modal } from '../../../components/componentsreutilizables';
import { CheckCircle2, Circle, Ban, AlertCircle, Paperclip, X } from 'lucide-react';

interface ChecklistItemProps {
  taskText: string;
  status: TaskStatus;
  onStatusChange: (newStatus: TaskStatus, notes?: string) => void;
  notes?: string;
  isCritical?: boolean;
}

const statusConfig: Record<TaskStatus, { label: string; icon: React.ReactNode; color: string }> = {
  pending: { label: 'Pendiente', icon: <Circle className="w-5 h-5" />, color: 'text-gray-400' },
  completed: { label: 'Completada', icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-green-600' },
  skipped: { label: 'Omitida', icon: <Ban className="w-5 h-5" />, color: 'text-orange-500' },
  issue_reported: { label: 'Incidencia', icon: <AlertCircle className="w-5 h-5" />, color: 'text-red-600' }
};

export const ChecklistItemComponent: React.FC<ChecklistItemProps> = ({
  taskText,
  status,
  onStatusChange,
  notes,
  isCritical = false
}) => {
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notesValue, setNotesValue] = useState(notes || '');
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(status);

  const handleStatusChange = (newStatus: TaskStatus) => {
    setSelectedStatus(newStatus);
    
    if (newStatus === 'issue_reported' || notes) {
      setShowNotesModal(true);
    } else {
      onStatusChange(newStatus);
    }
  };

  const handleSaveNotes = () => {
    onStatusChange(selectedStatus, notesValue);
    setShowNotesModal(false);
  };

  const currentStatus = statusConfig[status];

  return (
    <>
      <div className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
        isCritical ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'
      }`}>
        {/* Status Icon */}
        <button
          onClick={() => {
            if (status === 'pending') {
              handleStatusChange('completed');
            } else if (status === 'completed') {
              handleStatusChange('pending');
            }
          }}
          className={`flex-shrink-0 ${currentStatus.color} hover:opacity-80 transition`}
        >
          {currentStatus.icon}
        </button>

        {/* Task Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-gray-900">
              {taskText}
            </p>
            {isCritical && (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-semibold">
                Crítica
              </span>
            )}
          </div>
          
          {notes && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
              {notes}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-1 flex-shrink-0">
          {status === 'pending' && (
            <>
              <button
                onClick={() => handleStatusChange('completed')}
                className="p-2 text-green-600 hover:bg-green-50 rounded transition"
                title="Completar"
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleStatusChange('issue_reported')}
                className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                title="Reportar Incidencia"
              >
                <AlertCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleStatusChange('skipped')}
                className="p-2 text-orange-600 hover:bg-orange-50 rounded transition"
                title="Omitir"
              >
                <Ban className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Notes Modal */}
      <Modal
        isOpen={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        title={selectedStatus === 'issue_reported' ? 'Reportar Incidencia' : 'Agregar Notas'}
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowNotesModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSaveNotes}>
              Guardar
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Textarea
            label={selectedStatus === 'issue_reported' ? 'Descripción de la incidencia' : 'Notas'}
            value={notesValue}
            onChange={(e) => setNotesValue(e.target.value)}
            placeholder="Describe la situación o agrega observaciones..."
            rows={4}
          />
        </div>
      </Modal>
    </>
  );
};

