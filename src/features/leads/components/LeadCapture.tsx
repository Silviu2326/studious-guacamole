import React, { useState } from 'react';
import { Button, Input, Select } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Lead, LeadSource } from '../types';

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

  const handleSubmit = (e: React.FormEvent) => {
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

    onSubmit(leadData);
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
    </form>
  );
};

