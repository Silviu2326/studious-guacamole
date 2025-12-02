import React, { useState } from 'react';
import { Modal, Button, Input, Textarea } from '../../../components/componentsreutilizables';
import { portalEmpresaService } from '../api/portalEmpresaService';
import { Mail, Upload, UserPlus } from 'lucide-react';

interface InviteEmployeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  onSuccess?: () => void;
}

type InviteMethod = 'single' | 'bulk';

export const InviteEmployeesModal: React.FC<InviteEmployeesModalProps> = ({
  isOpen,
  onClose,
  companyId,
  onSuccess,
}) => {
  const [inviteMethod, setInviteMethod] = useState<InviteMethod>('single');
  const [emailList, setEmailList] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleSingleInvite = async () => {
    const emails = emailList
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && line.includes('@'));

    if (emails.length === 0) {
      setError('Por favor, ingresa al menos un email válido');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const response = await portalEmpresaService.sendInvitations(companyId, { emails });
      
      // Mostrar resultado
      alert(`${response.success_count} invitaciones enviadas. ${response.failed_count} fallidas.`);
      
      onSuccess?.();
      handleClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al enviar invitaciones';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkInvite = async () => {
    if (!csvFile) {
      setError('Por favor, selecciona un archivo CSV');
      return;
    }

    // Leer archivo CSV
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const emails = lines
          .slice(1) // Saltar header
          .map(line => line.split(',')[0]?.trim())
          .filter(line => line && line.includes('@'));

        if (emails.length === 0) {
          setError('No se encontraron emails válidos en el archivo');
          return;
        }

        setIsSubmitting(true);
        setError(null);
        const response = await portalEmpresaService.sendInvitations(companyId, { emails });
        
        alert(`${response.success_count} invitaciones enviadas. ${response.failed_count} fallidas.`);
        
        onSuccess?.();
        handleClose();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al procesar el archivo';
        setError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    };
    
    reader.readAsText(csvFile);
  };

  const handleClose = () => {
    setEmailList('');
    setCsvFile(null);
    setError(null);
    setInviteMethod('single');
    onClose();
  };

  const handleSubmit = async () => {
    setError(null);
    if (inviteMethod === 'single') {
      await handleSingleInvite();
    } else {
      await handleBulkInvite();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Invitar Empleados"
      size="lg"
      footer={
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar Invitaciones'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Método de invitación */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Método de invitación
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setInviteMethod('single')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                inviteMethod === 'single'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <UserPlus className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <span className="font-semibold text-gray-900">Individual</span>
              <p className="text-xs text-gray-600 mt-1">Ingresar emails manualmente</p>
            </button>
            <button
              type="button"
              onClick={() => setInviteMethod('bulk')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                inviteMethod === 'bulk'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <span className="font-semibold text-gray-900">Masivo (CSV)</span>
              <p className="text-xs text-gray-600 mt-1">Subir archivo CSV</p>
            </button>
          </div>
        </div>

        {/* Formulario según método */}
        {inviteMethod === 'single' ? (
          <div>
            <Textarea
              label="Emails de empleados"
              placeholder="Ingresa un email por línea:&#10;empleado1@empresa.com&#10;empleado2@empresa.com"
              value={emailList}
              onChange={(e) => setEmailList(e.target.value)}
              rows={6}
              helperText="Separa múltiples emails con un salto de línea"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Seleccionar archivo CSV
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-600 transition-colors">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-900 font-medium">
                  {csvFile ? csvFile.name : 'Haz clic para seleccionar archivo'}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Formato: email en la primera columna
                </p>
              </label>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Mail className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 font-semibold">Sobre las invitaciones</p>
              <p className="text-xs text-blue-700 mt-1">
                Los empleados recibirán un email con instrucciones para registrarse y activar su membresía.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

