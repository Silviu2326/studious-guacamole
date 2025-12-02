import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Select, Input, Textarea } from '../../../components/componentsreutilizables';
import { getCancellationReasons, logCancellation } from '../api';
import { CancellationReason, UserType } from '../types';
import { X, Upload, FileText } from 'lucide-react';

interface LogCancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { cancellationId: string; message: string }) => void;
  userType: UserType;
  clientId: string;
  clientName?: string;
}

export const LogCancellationModal: React.FC<LogCancellationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userType,
  clientId,
  clientName,
}) => {
  const [reasons, setReasons] = useState<CancellationReason[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    reasonId: '',
    cancellationDate: new Date().toISOString().split('T')[0],
    notes: '',
    document: null as File | null,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const loadReasons = useCallback(async () => {
    setLoading(true);
    try {
      const reasonsData = await getCancellationReasons();
      // Filtrar por tipo según el userType
      const filteredReasons = reasonsData.filter(r => 
        userType === 'gym' ? r.type === 'formal' : r.type === 'informal'
      );
      setReasons(filteredReasons);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar motivos');
    } finally {
      setLoading(false);
    }
  }, [userType]);

  useEffect(() => {
    if (isOpen) {
      loadReasons();
      // Reset form
      setFormData({
        reasonId: '',
        cancellationDate: new Date().toISOString().split('T')[0],
        notes: '',
        document: null,
      });
      setFormErrors({});
      setError(null);
    }
  }, [isOpen, loadReasons]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.reasonId) {
      errors.reasonId = 'Debe seleccionar un motivo de baja';
    }
    
    if (!formData.cancellationDate) {
      errors.cancellationDate = 'Debe seleccionar una fecha';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('reasonId', formData.reasonId);
      formDataToSend.append('cancellationDate', new Date(formData.cancellationDate).toISOString());
      
      if (formData.notes) {
        formDataToSend.append('notes', formData.notes);
      }
      
      if (userType === 'gym' && formData.document) {
        formDataToSend.append('document', formData.document);
      }

      const result = await logCancellation(clientId, formDataToSend);
      onSubmit(result);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar la baja');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, document: file }));
      setFormErrors(prev => ({ ...prev, document: '' }));
    }
  };

  const isGym = userType === 'gym';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isGym ? 'Registrar Baja Formal' : 'Registrar Baja/Pausa'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-50 ring-1 ring-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {clientName && (
          <div className="p-3 rounded-xl bg-slate-50 ring-1 ring-slate-200 text-sm text-gray-900">
            Cliente: <strong>{clientName}</strong>
          </div>
        )}

        <Select
          label="Motivo de baja"
          placeholder={loading ? 'Cargando motivos...' : 'Seleccione un motivo'}
          options={reasons.map(r => ({ value: r.id, label: r.label }))}
          value={formData.reasonId}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, reasonId: e.target.value }));
            setFormErrors(prev => ({ ...prev, reasonId: '' }));
          }}
          error={formErrors.reasonId}
          disabled={loading}
        />

        <Input
          label="Fecha de solicitud"
          type="date"
          value={formData.cancellationDate}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, cancellationDate: e.target.value }));
            setFormErrors(prev => ({ ...prev, cancellationDate: '' }));
          }}
          error={formErrors.cancellationDate}
        />

        {isGym && (
          <Input
            label="Fecha efectiva de baja"
            type="date"
            value={formData.cancellationDate}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, cancellationDate: e.target.value }));
            }}
            helperText="Fecha en que finaliza el servicio"
          />
        )}

        <Textarea
          label={isGym ? 'Notas adicionales' : 'Notas'}
          placeholder={
            isGym
              ? 'Información relevante sobre la baja del cliente...'
              : 'Notas sobre el motivo de la pausa o baja...'
          }
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={4}
        />

        {isGym && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Adjuntar documento (opcional)
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center justify-center gap-2 px-4 py-3 ring-2 ring-dashed ring-slate-300 rounded-xl cursor-pointer hover:ring-blue-500 transition-colors bg-white">
                <Upload className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {formData.document ? formData.document.name : 'Seleccionar archivo'}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </label>
              {formData.document && (
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-700">{formData.document.name}</span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, document: null }))}
                    className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            {formErrors.document && (
              <p className="mt-1 text-xs text-red-600">
                {formErrors.document}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Formatos permitidos: PDF, DOC, DOCX, JPG, PNG. Tamaño máximo: 10MB
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={submitting || loading}
            loading={submitting}
          >
            {isGym ? 'Confirmar Baja' : 'Registrar Baja'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

