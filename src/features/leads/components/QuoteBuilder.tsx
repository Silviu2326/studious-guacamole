import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Modal, Input, Select } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Lead, Quote, QuoteItem } from '../types';
import { QuoteService } from '../services/quoteService';
import {
  Plus,
  Trash2,
  Save,
  Send,
  FileText,
  DollarSign
} from 'lucide-react';

interface QuoteBuilderProps {
  lead: Lead;
  quote?: Quote | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (quote: Quote) => void;
}

export const QuoteBuilder: React.FC<QuoteBuilderProps> = ({
  lead,
  quote,
  isOpen,
  onClose,
  onSave
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: quote?.title || `Presupuesto para ${lead.name}`,
    description: quote?.description || '',
    items: quote?.items || [] as QuoteItem[],
    discount: quote?.discount || undefined,
    validUntil: quote?.validUntil ? new Date(quote.validUntil).toISOString().split('T')[0] : ''
  });

  useEffect(() => {
    if (quote) {
      setFormData({
        title: quote.title || '',
        description: quote.description || '',
        items: quote.items || [],
        discount: quote.discount,
        validUntil: quote.validUntil ? new Date(quote.validUntil).toISOString().split('T')[0] : ''
      });
    } else {
      setFormData({
        title: `Presupuesto para ${lead.name}`,
        description: '',
        items: [],
        discount: undefined,
        validUntil: ''
      });
    }
  }, [quote, lead, isOpen]);

  const handleAddItem = () => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setFormData({
      ...formData,
      items: [...formData.items, newItem]
    });
  };

  const handleUpdateItem = (index: number, updates: Partial<QuoteItem>) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      ...updates,
      total: (updates.quantity || updatedItems[index].quantity) * (updates.unitPrice || updatedItems[index].unitPrice)
    };
    setFormData({ ...formData, items: updatedItems });
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateDiscount = () => {
    if (!formData.discount) return 0;
    const subtotal = calculateSubtotal();
    if (formData.discount.type === 'percentage') {
      return (subtotal * formData.discount.value) / 100;
    }
    return formData.discount.value;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const handleSave = async () => {
    if (!formData.title || formData.items.length === 0) {
      alert('Por favor completa el título y agrega al menos un ítem');
      return;
    }

    setLoading(true);
    try {
      const quoteData: Omit<Quote, 'id' | 'quoteNumber' | 'createdAt' | 'updatedAt' | 'status' | 'sentAt' | 'openedAt' | 'viewedAt' | 'approvedAt' | 'rejectedAt'> = {
        leadId: lead.id,
        title: formData.title,
        description: formData.description,
        items: formData.items,
        subtotal: calculateSubtotal(),
        discount: formData.discount,
        tax: undefined,
        total: calculateTotal(),
        validUntil: formData.validUntil ? new Date(formData.validUntil) : undefined,
        notes: ''
      };

      let savedQuote: Quote;
      if (quote) {
        savedQuote = await QuoteService.updateQuote(quote.id, quoteData);
      } else {
        savedQuote = await QuoteService.createQuote(quoteData);
      }

      onSave?.(savedQuote);
      onClose();
    } catch (error) {
      console.error('Error guardando presupuesto:', error);
      alert('Error al guardar el presupuesto');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!quote) {
      await handleSave();
      return;
    }

    setLoading(true);
    try {
      await QuoteService.sendQuote(quote.id);
      alert('Presupuesto enviado correctamente');
      onClose();
    } catch (error) {
      console.error('Error enviando presupuesto:', error);
      alert('Error al enviar el presupuesto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={quote ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={loading}
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
            {quote && (
              <Button
                variant="primary"
                onClick={handleSend}
                disabled={loading}
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Información básica */}
        <Input
          label="Título del Presupuesto *"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-[#F1F5F9] mb-2">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descripción del presupuesto..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-[#334155] rounded-lg bg-white dark:bg-[#1E1E2E] text-gray-900 dark:text-[#F1F5F9] min-h-[100px]"
          />
        </div>

        {/* Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-900 dark:text-[#F1F5F9]">
              Items del Presupuesto *
            </label>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddItem}
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Item
            </Button>
          </div>

          <div className="space-y-3">
            {formData.items.map((item, index) => (
              <Card key={item.id || index} padding="md">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-5">
                    <Input
                      placeholder="Nombre del servicio"
                      value={item.name}
                      onChange={(e) => handleUpdateItem(index, { name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      placeholder="Cantidad"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(index, { quantity: parseInt(e.target.value) || 0 })}
                      min="1"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      placeholder="Precio unit."
                      value={item.unitPrice}
                      onChange={(e) => handleUpdateItem(index, { unitPrice: parseFloat(e.target.value) || 0 })}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="font-semibold text-gray-900 dark:text-[#F1F5F9]">
                      ${item.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <Input
                    placeholder="Descripción (opcional)"
                    value={item.description}
                    onChange={(e) => handleUpdateItem(index, { description: e.target.value })}
                  />
                </div>
              </Card>
            ))}
          </div>

          {formData.items.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay items. Agrega al menos uno para continuar.</p>
            </div>
          )}
        </div>

        {/* Descuento */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Tipo de Descuento"
            value={formData.discount?.type || 'none'}
            onChange={(e) => {
              if (e.target.value === 'none') {
                setFormData({ ...formData, discount: undefined });
              } else {
                setFormData({
                  ...formData,
                  discount: {
                    type: e.target.value as 'percentage' | 'fixed',
                    value: formData.discount?.value || 0
                  }
                });
              }
            }}
            options={[
              { value: 'none', label: 'Sin descuento' },
              { value: 'percentage', label: 'Porcentaje (%)' },
              { value: 'fixed', label: 'Cantidad fija ($)' }
            ]}
          />
          {formData.discount && (
            <Input
              label="Valor del Descuento"
              type="number"
              min="0"
              step="0.01"
              value={formData.discount.value}
              onChange={(e) => setFormData({
                ...formData,
                discount: {
                  ...formData.discount!,
                  value: parseFloat(e.target.value) || 0
                }
              })}
            />
          )}
        </div>

        {/* Fecha de validez */}
        <Input
          label="Válido hasta"
          type="date"
          value={formData.validUntil}
          onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
        />

        {/* Resumen */}
        <Card padding="md" className="bg-gray-50 dark:bg-[#1E1E2E]">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-[#94A3B8]">Subtotal:</span>
              <span className="font-semibold text-gray-900 dark:text-[#F1F5F9]">
                ${calculateSubtotal().toFixed(2)}
              </span>
            </div>
            {formData.discount && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-[#94A3B8]">
                  Descuento ({formData.discount.type === 'percentage' ? `${formData.discount.value}%` : '$' + formData.discount.value.toFixed(2)}):
                </span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  -${calculateDiscount().toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-[#334155]">
              <span className="text-lg font-bold text-gray-900 dark:text-[#F1F5F9]">Total:</span>
              <span className="text-lg font-bold text-gray-900 dark:text-[#F1F5F9]">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </Modal>
  );
};

