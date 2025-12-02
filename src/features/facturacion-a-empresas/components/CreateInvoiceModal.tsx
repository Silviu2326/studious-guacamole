import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { FacturacionService } from '../api/facturacionService';
import { Empresa, LineItem } from '../types';
import { Plus, X } from 'lucide-react';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [companyId, setCompanyId] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [lineItems, setLineItems] = useState<Omit<LineItem, 'id'>[]>([
    { description: '', quantity: 1, unitPrice: 0, total: 0, taxRate: 19 }
  ]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      cargarEmpresas();
      // Establecer fecha de vencimiento por defecto (30 días)
      const thirtyDaysLater = new Date();
      thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
      setDueDate(thirtyDaysLater.toISOString().split('T')[0]);
    }
  }, [isOpen]);

  const cargarEmpresas = async () => {
    try {
      const data = await FacturacionService.obtenerEmpresas();
      setEmpresas(data);
    } catch (error) {
      console.error('Error cargando empresas:', error);
    }
  };

  const agregarLineaItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, unitPrice: 0, total: 0, taxRate: 19 }]);
  };

  const eliminarLineaItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const actualizarLineaItem = (index: number, field: keyof LineItem, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    
    // Calcular total
    if (field === 'quantity' || field === 'unitPrice') {
      updated[index].total = updated[index].quantity * updated[index].unitPrice;
    }
    
    setLineItems(updated);
  };

  const validarFormulario = () => {
    const newErrors: Record<string, string> = {};

    if (!companyId) {
      newErrors.companyId = 'Seleccione una empresa';
    }
    if (!issueDate) {
      newErrors.issueDate = 'Fecha de emisión requerida';
    }
    if (!dueDate) {
      newErrors.dueDate = 'Fecha de vencimiento requerida';
    }
    if (new Date(dueDate) < new Date(issueDate)) {
      newErrors.dueDate = 'La fecha de vencimiento debe ser posterior a la de emisión';
    }
    
    lineItems.forEach((item, index) => {
      if (!item.description) {
        newErrors[`lineItem_${index}_description`] = 'Descripción requerida';
      }
      if (item.quantity <= 0) {
        newErrors[`lineItem_${index}_quantity`] = 'Cantidad debe ser mayor a 0';
      }
      if (item.unitPrice <= 0) {
        newErrors[`lineItem_${index}_unitPrice`] = 'Precio debe ser mayor a 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      await FacturacionService.crearFactura({
        companyId,
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        lineItems,
        notes: notes || undefined
      });
      onSubmit();
    } catch (error) {
      console.error('Error creando factura:', error);
      alert('Error al crear la factura');
    } finally {
      setLoading(false);
    }
  };

  const calcularTotales = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = lineItems.reduce((sum, item) => {
      return sum + (item.total * (item.taxRate || 0) / 100);
    }, 0);
    const total = subtotal + taxAmount;

    return { subtotal, taxAmount, total };
  };

  const { subtotal, taxAmount, total } = calcularTotales();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva Factura Corporativa"
      size="xl"
      footer={
        <div className="flex justify-between items-center">
          <div className="text-right">
            <div className="text-sm text-slate-600">
              <div className="flex justify-between mb-1">
                <span>Subtotal:</span>
                <span>{subtotal.toFixed(2)} EUR</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>IVA (19%):</span>
                <span>{taxAmount.toFixed(2)} EUR</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{total.toFixed(2)} EUR</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit} loading={loading}>
              Crear Factura
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Empresa *"
            options={empresas.map(e => ({ value: e.id, label: e.name }))}
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            error={errors.companyId}
            placeholder="Seleccione una empresa"
          />
          
          <Input
            label="Fecha de Emisión *"
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            error={errors.issueDate}
          />
          
          <Input
            label="Fecha de Vencimiento *"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            error={errors.dueDate}
          />
        </div>

        {/* Líneas de factura */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Conceptos
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={agregarLineaItem}
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Línea
            </Button>
          </div>

          <div className="space-y-3">
            {lineItems.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl ring-1 ring-slate-200">
                <div className="flex-1 grid grid-cols-12 gap-3">
                  <div className="col-span-12 md:col-span-5">
                    <Input
                      placeholder="Descripción"
                      value={item.description}
                      onChange={(e) => actualizarLineaItem(index, 'description', e.target.value)}
                      error={errors[`lineItem_${index}_description`]}
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <Input
                      label="Cantidad"
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => actualizarLineaItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      error={errors[`lineItem_${index}_quantity`]}
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <Input
                      label="Precio Unit."
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => actualizarLineaItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      error={errors[`lineItem_${index}_unitPrice`]}
                    />
                  </div>
                  <div className="col-span-2 md:col-span-2">
                    <Input
                      label="IVA %"
                      type="number"
                      min="0"
                      max="100"
                      value={item.taxRate || 19}
                      onChange={(e) => actualizarLineaItem(index, 'taxRate', parseFloat(e.target.value) || 19)}
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <div className="pt-7">
                      <span className="font-semibold">{item.total.toFixed(2)} EUR</span>
                    </div>
                  </div>
                </div>
                {lineItems.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => eliminarLineaItem(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notas */}
        <div>
          <Textarea
            label="Notas"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notas adicionales (opcional)"
          />
        </div>
      </div>
    </Modal>
  );
};

