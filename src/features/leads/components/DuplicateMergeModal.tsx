import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Lead } from '../types';
import { DuplicateDetectionService } from '../services/duplicateDetectionService';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
  Merge
} from 'lucide-react';

interface DuplicateMergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  duplicates: Array<{
    lead: Lead;
    similarity: number;
    matchType: 'email' | 'phone' | 'name';
  }>;
  onMerge?: (primaryId: string, duplicateId: string) => void;
}

export const DuplicateMergeModal: React.FC<DuplicateMergeModalProps> = ({
  isOpen,
  onClose,
  lead,
  duplicates,
  onMerge
}) => {
  const [selectedPrimary, setSelectedPrimary] = useState<string>(lead.id);
  const [mergePreview, setMergePreview] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && duplicates.length > 0) {
      generatePreview();
    }
  }, [isOpen, selectedPrimary, duplicates]);

  const generatePreview = async () => {
    try {
      const primary = selectedPrimary === lead.id ? lead : duplicates.find(d => d.lead.id === selectedPrimary)?.lead;
      if (!primary) return;

      const duplicateIds = duplicates
        .filter(d => d.lead.id !== selectedPrimary)
        .map(d => d.lead.id);

      if (duplicateIds.length === 0) return;

      const preview = await DuplicateDetectionService.previewMerge(selectedPrimary, duplicateIds[0]);
      setMergePreview(preview);
    } catch (error) {
      console.error('Error generando preview:', error);
    }
  };

  const handleMerge = async () => {
    if (!mergePreview) return;

    setLoading(true);
    try {
      const duplicateIds = duplicates
        .filter(d => d.lead.id !== selectedPrimary)
        .map(d => d.lead.id);

      for (const duplicateId of duplicateIds) {
        await DuplicateDetectionService.mergeLeads(selectedPrimary, duplicateId);
        onMerge?.(selectedPrimary, duplicateId);
      }

      onClose();
    } catch (error) {
      console.error('Error mergeando leads:', error);
      alert('Error al mergear leads');
    } finally {
      setLoading(false);
    }
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 90) return 'text-red-600 dark:text-red-400';
    if (similarity >= 70) return 'text-orange-600 dark:text-orange-400';
    return 'text-yellow-600 dark:text-yellow-400';
  };

  const getMatchTypeLabel = (type: string) => {
    switch (type) {
      case 'email':
        return 'Email';
      case 'phone':
        return 'Teléfono';
      case 'name':
        return 'Nombre';
      default:
        return type;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Leads Duplicados Detectados"
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleMerge}
            disabled={loading || !mergePreview}
          >
            <Merge className="w-4 h-4 mr-2" />
            {loading ? 'Mergeando...' : 'Mergear Leads'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Alerta */}
        <div className={`${ds.spacing.md} bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg`}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-900 dark:text-yellow-300 mb-1">
                Se detectaron {duplicates.length} lead(s) posiblemente duplicado(s)
              </p>
              <p className="text-sm text-yellow-800 dark:text-yellow-400">
                Revisa la información y selecciona qué lead mantener como principal. Los datos se combinarán preservando el historial completo.
              </p>
            </div>
          </div>
        </div>

        {/* Selector de lead principal */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-[#F1F5F9] mb-2">
            Lead Principal (se mantendrá)
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-[#334155] rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1E1E2E]">
              <input
                type="radio"
                name="primary"
                value={lead.id}
                checked={selectedPrimary === lead.id}
                onChange={(e) => setSelectedPrimary(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-[#F1F5F9]">{lead.name}</div>
                <div className="text-sm text-gray-600 dark:text-[#94A3B8]">
                  {lead.email} • {lead.phone}
                </div>
              </div>
            </label>
            {duplicates.map((dup, index) => (
              <label
                key={dup.lead.id}
                className="flex items-center gap-3 p-3 border border-gray-300 dark:border-[#334155] rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1E1E2E]"
              >
                <input
                  type="radio"
                  name="primary"
                  value={dup.lead.id}
                  checked={selectedPrimary === dup.lead.id}
                  onChange={(e) => setSelectedPrimary(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-[#F1F5F9]">{dup.lead.name}</div>
                  <div className="text-sm text-gray-600 dark:text-[#94A3B8]">
                    {dup.lead.email} • {dup.lead.phone}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Coincidencia: {getMatchTypeLabel(dup.matchType)} ({dup.similarity.toFixed(0)}%)
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Preview del merge */}
        {mergePreview && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-[#F1F5F9] mb-3">
              Preview del Merge
            </h3>
            <Card padding="md">
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-medium text-gray-600 dark:text-[#94A3B8] mb-1">Nombre</div>
                  <div className="text-sm text-gray-900 dark:text-[#F1F5F9]">
                    {mergePreview.name}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600 dark:text-[#94A3B8] mb-1">Email</div>
                  <div className="text-sm text-gray-900 dark:text-[#F1F5F9]">
                    {mergePreview.email}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600 dark:text-[#94A3B8] mb-1">Teléfono</div>
                  <div className="text-sm text-gray-900 dark:text-[#F1F5F9]">
                    {mergePreview.phone}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600 dark:text-[#94A3B8] mb-1">Interacciones combinadas</div>
                  <div className="text-sm text-gray-900 dark:text-[#F1F5F9]">
                    {mergePreview.totalInteractions} interacciones
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600 dark:text-[#94A3B8] mb-1">Notas combinadas</div>
                  <div className="text-sm text-gray-900 dark:text-[#F1F5F9]">
                    {mergePreview.totalNotes} notas
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Lista de duplicados */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-[#F1F5F9] mb-3">
            Detalles de Coincidencias
          </h3>
          <div className="space-y-2">
            {duplicates.map((dup, index) => (
              <Card key={dup.lead.id} padding="sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-[#F1F5F9]">
                        {dup.lead.name}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${getSimilarityColor(dup.similarity)} bg-opacity-10`}>
                        {dup.similarity.toFixed(0)}% similar
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-[#94A3B8] space-y-1">
                      {dup.matchType === 'email' && dup.lead.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          <span>{dup.lead.email}</span>
                        </div>
                      )}
                      {dup.matchType === 'phone' && dup.lead.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          <span>{dup.lead.phone}</span>
                        </div>
                      )}
                      {dup.matchType === 'name' && (
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3" />
                          <span>Nombre similar</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {selectedPrimary === dup.lead.id && (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

