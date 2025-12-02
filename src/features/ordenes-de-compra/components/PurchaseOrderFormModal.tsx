import React, { useState } from 'react';
import { Modal } from '../../../components/componentsreutilizables';
import { Button } from '../../../components/componentsreutilizables/Button';
import { Input } from '../../../components/componentsreutilizables/Input';
import { Textarea } from '../../../components/componentsreutilizables/Textarea';
import { Select, SelectOption } from '../../../components/componentsreutilizables/Select';
import { PurchaseOrder, CreatePurchaseOrderData, OrderItem } from '../types';
import { Plus, Trash2 } from 'lucide-react';
import { mockSuppliers, mockProducts } from '../api';

interface PurchaseOrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePurchaseOrderData) => Promise<void>;
  initialData?: Partial<PurchaseOrder>;
}

export const PurchaseOrderFormModal: React.FC<PurchaseOrderFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [supplierId, setSupplierId] = useState(initialData?.supplier_id || '');
  const [items, setItems] = useState<Omit<OrderItem, 'id' | 'total'>[]>(
    initialData?.items?.map(({ id, total, ...item }) => item) || []
  );
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const supplierOptions: SelectOption[] = mockSuppliers.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const productOptions: SelectOption[] = mockProducts.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const getProductPrice = (productId: string): number => {
    const product = mockProducts.find((p) => p.id === productId);
    return product?.unit_price || 0;
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        product_id: '',
        product_name: '',
        quantity: 1,
        unit_price: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    if (field === 'product_id') {
      const product = mockProducts.find((p) => p.id === value);
      updatedItems[index].product_name = product?.name || '';
      updatedItems[index].unit_price = getProductPrice(value);
    }

    setItems(updatedItems);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!supplierId) {
      newErrors.supplierId = 'Debe seleccionar un proveedor';
    }

    if (items.length === 0) {
      newErrors.items = 'Debe agregar al menos un producto';
    }

    items.forEach((item, index) => {
      if (!item.product_id) {
        newErrors[`item_${index}_product`] = 'Debe seleccionar un producto';
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = 'La cantidad debe ser mayor a 0';
      }
      if (item.unit_price <= 0) {
        newErrors[`item_${index}_price`] = 'El precio debe ser mayor a 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        supplier_id: supplierId,
        items,
        notes: notes || undefined,
      });

      handleClose();
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSupplierId('');
    setItems([]);
    setNotes('');
    setErrors({});
    onClose();
  };

  const calculateItemTotal = (quantity: number, unitPrice: number): number => {
    return quantity * unitPrice;
  };

  const calculateTotal = (): number => {
    return items.reduce((sum, item) => sum + calculateItemTotal(item.quantity, item.unit_price), 0);
  };

  const footer = (
    <div className="flex justify-end gap-3">
      <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
        Cancelar
      </Button>
      <Button variant="primary" onClick={handleSubmit} loading={isSubmitting}>
        Guardar
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={initialData ? 'Editar Orden de Compra' : 'Nueva Orden de Compra'}
      size="xl"
      footer={footer}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Select
            label="Proveedor"
            options={supplierOptions}
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            error={errors.supplierId}
            placeholder="Seleccione un proveedor"
          />

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-slate-700">
                Productos
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                leftIcon={<Plus size={16} />}
                onClick={addItem}
              >
                Agregar Producto
              </Button>
            </div>

            {errors.items && (
              <p className="text-sm text-red-600 mb-2">
                {errors.items}
              </p>
            )}

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-600">
                      Producto {index + 1}
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-1 hover:bg-red-50 rounded text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-3">
                      <Select
                        label="Producto"
                        options={productOptions}
                        value={item.product_id}
                        onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                        error={errors[`item_${index}_product`]}
                        placeholder="Seleccione un producto"
                        fullWidth={false}
                      />
                    </div>

                    <Input
                      label="Cantidad"
                      type="number"
                      value={item.quantity.toString()}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      error={errors[`item_${index}_quantity`]}
                      fullWidth={false}
                    />

                    <Input
                      label="Precio Unitario"
                      type="number"
                      step="0.01"
                      value={item.unit_price.toString()}
                      onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                      error={errors[`item_${index}_price`]}
                      fullWidth={false}
                    />

                    <div className="flex items-end">
                      <div className="w-full p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">
                          Total:
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {calculateItemTotal(item.quantity, item.unit_price).toFixed(2)}€
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Textarea
            label="Notas"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            helperText="Información adicional sobre esta orden"
            rows={3}
          />

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">Total de la Orden:</span>
              <span className="text-2xl font-bold text-purple-600">
                {calculateTotal().toFixed(2)}€
              </span>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

