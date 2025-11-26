import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/componentsreutilizables';
import { Button } from '../../../components/componentsreutilizables';
import { Input } from '../../../components/componentsreutilizables';
import { Select, SelectOption } from '../../../components/componentsreutilizables';
import { Textarea } from '../../../components/componentsreutilizables';
import { receptionsApi } from '../api/receptionsApi';
import { PurchaseOrder, ReceivedItemForm } from '../types';
import { Search, PackageCheck, AlertCircle, Plus, X, Check } from 'lucide-react';

interface NewReceptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReceptionCreated: () => void;
}

interface PurchaseOrderResult {
  id: string;
  reference: string;
  supplierName: string;
  expectedDate?: string;
}

export const NewReceptionModal: React.FC<NewReceptionModalProps> = ({
  isOpen,
  onClose,
  onReceptionCreated
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderResult[]>([]);
  const [isLoadingPO, setIsLoadingPO] = useState(false);
  const [receptionDate, setReceptionDate] = useState(new Date().toISOString().split('T')[0]);
  const [receivedItems, setReceivedItems] = useState<ReceivedItemForm[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar órdenes de compra cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      loadPurchaseOrders();
    }
  }, [isOpen]);

  // Buscar órdenes de compra cuando cambia el término de búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isOpen) {
        loadPurchaseOrders();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, isOpen]);

  // Cargar items cuando se selecciona una orden de compra
  useEffect(() => {
    if (selectedPO && selectedPO.items) {
      const items: ReceivedItemForm[] = selectedPO.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantityExpected: item.quantityExpected,
        quantityReceived: item.quantityExpected, // Por defecto, todo se recibe
        condition: 'ok'
      }));
      setReceivedItems(items);
    }
  }, [selectedPO]);

  const loadPurchaseOrders = async () => {
    setIsLoadingPO(true);
    try {
      const results = await receptionsApi.getPendingPurchaseOrders(searchTerm || undefined);
      setPurchaseOrders(results.map(po => ({
        id: po.id,
        reference: po.reference,
        supplierName: po.supplierName,
        expectedDate: po.expectedDate
      })));
    } catch (err) {
      console.error('Error loading purchase orders:', err);
      setError('Error al cargar órdenes de compra');
    } finally {
      setIsLoadingPO(false);
    }
  };

  const handlePOSelect = async (poId: string) => {
    try {
      const allPOs = await receptionsApi.getPendingPurchaseOrders();
      const po = allPOs.find(p => p.id === poId);
      if (po) {
        setSelectedPO(po);
        setSearchTerm(po.reference);
      }
    } catch (err) {
      console.error('Error loading PO details:', err);
      setError('Error al cargar detalles de la orden de compra');
    }
  };

  const updateReceivedItem = (index: number, field: keyof ReceivedItemForm, value: any) => {
    const updatedItems = [...receivedItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setReceivedItems(updatedItems);
  };

  const addDiscrepancy = (index: number) => {
    const item = receivedItems[index];
    const discrepancyItem: ReceivedItemForm = {
      ...item,
      quantityExpected: 0,
      quantityReceived: 0,
      condition: 'damaged'
    };
    setReceivedItems([...receivedItems, discrepancyItem]);
  };

  const removeItem = (index: number) => {
    setReceivedItems(receivedItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedPO) {
      setError('Debe seleccionar una orden de compra');
      return;
    }

    if (receivedItems.length === 0) {
      setError('Debe agregar al menos un item recibido');
      return;
    }

    // Validar que no haya items sin cantidad recibida
    const hasInvalidItems = receivedItems.some(item => item.quantityReceived === 0 && item.condition !== 'missing');
    if (hasInvalidItems) {
      setError('Todos los items deben tener cantidad recibida o marcarse como faltantes');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const receptionData = {
        purchaseOrderId: selectedPO.id,
        receptionDate: `${receptionDate}T00:00:00Z`,
        notes: notes || undefined,
        receivedItems
      };

      await receptionsApi.createReception(receptionData);
      onReceptionCreated();
      handleClose();
    } catch (err: any) {
      console.error('Error creating reception:', err);
      setError(err.message || 'Error al crear la recepción');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedPO(null);
    setReceivedItems([]);
    setNotes('');
    setSearchTerm('');
    setReceptionDate(new Date().toISOString().split('T')[0]);
    setError(null);
    onClose();
  };

  const getConditionBadge = (condition: string) => {
    const config = {
      ok: { label: 'OK', color: 'bg-green-100 text-green-700' },
      damaged: { label: 'Dañado', color: 'bg-red-100 text-red-700' },
      missing: { label: 'Faltante', color: 'bg-yellow-100 text-yellow-700' }
    };
    return config[condition as keyof typeof config] || config.ok;
  };

  const conditionOptions: SelectOption[] = [
    { value: 'ok', label: 'OK - En buen estado' },
    { value: 'damaged', label: 'Dañado' },
    { value: 'missing', label: 'Faltante' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Registrar Nueva Recepción"
      size="xl"
    >
      <div className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {/* Búsqueda de Orden de Compra */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-900">
            Buscar Orden de Compra
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por número de referencia o proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {!selectedPO && searchTerm && (
            <div className="border border-gray-200 rounded-xl max-h-60 overflow-y-auto">
              {isLoadingPO ? (
                <div className="p-4 text-center text-gray-500">Buscando...</div>
              ) : purchaseOrders.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {purchaseOrders.map(po => (
                    <button
                      key={po.id}
                      onClick={() => handlePOSelect(po.id)}
                      className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <PackageCheck className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-gray-900">{po.reference}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{po.supplierName}</p>
                        </div>
                        {po.expectedDate && (
                          <span className="text-xs text-gray-500">{po.expectedDate}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">No se encontraron órdenes de compra</div>
              )}
            </div>
          )}

          {selectedPO && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">{selectedPO.reference}</span>
                  </div>
                  <p className="text-sm text-gray-600">{selectedPO.supplierName}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPO(null);
                    setReceivedItems([]);
                  }}
                >
                  Cambiar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Fecha de Recepción */}
        {selectedPO && (
          <>
            <Input
              type="date"
              label="Fecha de Recepción"
              value={receptionDate}
              onChange={(e) => setReceptionDate(e.target.value)}
            />

            {/* Items Recibidos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-900">
                  Items Recibidos
                </label>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {receivedItems.map((item, index) => {
                  const badgeConfig = getConditionBadge(item.condition);
                  return (
                    <div key={index} className="p-4 border border-gray-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-base font-medium text-gray-900">
                            {item.productName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Esperado: {item.quantityExpected} unidades
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(index)}
                          className="p-1 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar item"
                        >
                          <X className="w-5 h-5 text-red-600" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          type="number"
                          label="Cantidad Recibida"
                          value={item.quantityReceived.toString()}
                          onChange={(e) => updateReceivedItem(index, 'quantityReceived', parseInt(e.target.value) || 0)}
                          min="0"
                        />

                        <Select
                          label="Condición"
                          options={conditionOptions}
                          value={item.condition}
                          onChange={(e) => updateReceivedItem(index, 'condition', e.target.value as any)}
                        />
                      </div>

                      {badgeConfig && (
                        <div className="inline-flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${badgeConfig.color}`}>
                            {badgeConfig.label}
                          </span>
                        </div>
                      )}

                      {item.condition !== 'ok' && (
                        <Input
                          label="Notas"
                          placeholder="Detalles de la discrepancia..."
                          value={item.notes || ''}
                          onChange={(e) => updateReceivedItem(index, 'notes', e.target.value)}
                          fullWidth
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notas Generales */}
            <Textarea
              label="Notas Generales (Opcional)"
              placeholder="Añade cualquier nota adicional sobre esta recepción..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={!selectedPO || receivedItems.length === 0}
          >
            Confirmar Recepción
          </Button>
        </div>
      </div>
    </Modal>
  );
};

