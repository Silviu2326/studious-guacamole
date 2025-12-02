import React, { useState } from 'react';
import { Button, Input, Select } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Lead, LeadSource } from '../types';
import { DuplicateMergeModal } from './DuplicateMergeModal';
import { detectDuplicates } from '../api/duplicates';

interface LeadCaptureProps {
  businessType: 'entrenador' | 'gimnasio';
  onSubmit: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const LeadCapture: React.FC<LeadCaptureProps> = ({
  businessType,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'instagram' as LeadSource,
    notes: '',
  });
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicates, setDuplicates] = useState<Array<{
    lead: Lead;
    similarity: number;
    matchType: 'email' | 'phone' | 'name';
  }>>([]);
  const [pendingLeadData, setPendingLeadData] = useState<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      source: formData.source,
      status: 'new',
      stage: 'captacion',
      score: 50, // Score inicial
      businessType,
      interactions: [],
      notes: formData.notes ? [formData.notes] : [],
      tags: [],
    };

    // Crear lead temporal para verificar duplicados
    const tempLead: Lead = {
      ...leadData,
      id: 'temp',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Verificar duplicados
    const detectedDuplicates = await detectDuplicates(tempLead, 70);
    
    if (detectedDuplicates.length > 0) {
      setDuplicates(detectedDuplicates);
      setPendingLeadData(leadData);
      setShowDuplicateModal(true);
    } else {
      onSubmit(leadData);
    }
  };

  const handleMergeComplete = () => {
    setShowDuplicateModal(false);
    setDuplicates([]);
    setPendingLeadData(null);
    // Limpiar formulario
    setFormData({
      name: '',
      email: '',
      phone: '',
      source: 'instagram',
      notes: '',
    });
  };

  const handleSkipDuplicate = () => {
    if (pendingLeadData) {
      onSubmit(pendingLeadData);
      handleMergeComplete();
    }
  };

  const sourcesByBusinessType: LeadSource[] = businessType === 'entrenador'
    ? ['instagram', 'facebook', 'tiktok', 'whatsapp', 'referido', 'contenido_organico', 'otro']
    : ['landing_page', 'google_ads', 'evento', 'visita_centro', 'campaña_pagada', 'referido', 'whatsapp', 'otro'];

  const sourceLabels: Record<LeadSource, string> = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    tiktok: 'TikTok',
    whatsapp: 'WhatsApp',
    referido: 'Referido',
    landing_page: 'Landing Page',
    google_ads: 'Google Ads',
    evento: 'Evento',
    visita_centro: 'Visita al Centro',
    campaña_pagada: 'Campaña Pagada',
    contenido_organico: 'Contenido Orgánico',
    otro: 'Otro',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre completo *"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
        placeholder="Ej: Juan Pérez"
      />

      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="ejemplo@email.com"
      />

      <Input
        label="Teléfono"
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        placeholder="+34 612 345 678"
      />

      <Select
        label="Origen *"
        value={formData.source}
        onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSource })}
        required
        options={sourcesByBusinessType.map((source) => ({
          value: source,
          label: sourceLabels[source],
        }))}
        helperText={businessType === 'entrenador'
          ? 'Selecciona el canal por el cual conociste este lead'
          : 'Selecciona la fuente de captación del lead'}
        className="w-full"
      />

      <div>
        <label className={`block ${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
          Notas iniciales
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className={`w-full ${ds.input}`}
          rows={3}
          placeholder="Añade cualquier información relevante sobre este lead..."
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        <Button variant="secondary" onClick={onCancel} type="button">
          Cancelar
        </Button>
        <Button variant="primary" type="submit">
          Crear Lead
        </Button>
      </div>

      {/* Modal de duplicados */}
      {pendingLeadData && (
        <DuplicateMergeModal
          isOpen={showDuplicateModal}
          onClose={handleSkipDuplicate}
          lead={{
            ...pendingLeadData,
            id: 'temp',
            createdAt: new Date(),
            updatedAt: new Date()
          }}
          duplicates={duplicates}
          onMerge={handleMergeComplete}
        />
      )}
    </form>
  );
};

