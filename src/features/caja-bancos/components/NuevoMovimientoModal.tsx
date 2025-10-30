import React, { useState } from 'react';
import { Modal, Button, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { MovimientoCaja } from '../types';

interface NuevoMovimientoModalProps {
  onClose: () => void;
  onSubmit: (movimiento: Omit<MovimientoCaja, 'id'>) => Promise<void>;
}

export const NuevoMovimientoModal: React.FC<NuevoMovimientoModalProps> = ({
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    tipo: 'ingreso' as MovimientoCaja['tipo'],
    concepto: '',
    monto: '',
    metodoPago: 'efectivo' as MovimientoCaja['metodoPago'],
    categoria: '',
    descripcion: '',
    usuario: 'usuario_actual' // En una app real, esto vendría del contexto de autenticación
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categorias = [
    { value: 'Membresías', label: 'Membresías' },
    { value: 'Retail', label: 'Productos/Retail' },
    { value: 'Servicios', label: 'Servicios Adicionales' },
    { value: 'Gastos operativos', label: 'Gastos Operativos' },
    { value: 'Mantenimiento', label: 'Mantenimiento' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Personal', label: 'Personal' },
    { value: 'Otros', label: 'Otros' }
  ];

  const conceptosComunes = {
    ingreso: [
      'Pago mensualidad',
      'Venta producto',
      'Clase particular',
      'Inscripción',
      'Renovación',
      'Otros ingresos'
    ],
    egreso: [
      'Compra insumos',
      'Pago servicios',
      'Mantenimiento equipos',
      'Gastos administrativos',
      'Pago proveedores',
      'Otros gastos'
    ]
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.concepto.trim()) {
      newErrors.concepto = 'El concepto es requerido';
    }

    if (!formData.monto || Number(formData.monto) <= 0) {
      newErrors.monto = 'El monto debe ser mayor a 0';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'La categoría es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const movimiento: Omit<MovimientoCaja, 'id'> = {
        fecha: new Date(),
        tipo: formData.tipo,
        concepto: formData.concepto,
        monto: Number(formData.monto),
        metodoPago: formData.metodoPago,
        categoria: formData.categoria,
        descripcion: formData.descripcion || undefined,
        usuario: formData.usuario,
        estado: 'confirmado'
      };

      await onSubmit(movimiento);
    } catch (error) {
      console.error('Error al crear movimiento:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConceptoChange = (concepto: string) => {
    setFormData(prev => ({ ...prev, concepto }));
    
    // Auto-sugerir categoría basada en el concepto
    if (concepto.toLowerCase().includes('mensualidad') || concepto.toLowerCase().includes('inscripción')) {
      setFormData(prev => ({ ...prev, categoria: 'Membresías' }));
    } else if (concepto.toLowerCase().includes('producto') || concepto.toLowerCase().includes('venta')) {
      setFormData(prev => ({ ...prev, categoria: 'Retail' }));
    } else if (concepto.toLowerCase().includes('compra') || concepto.toLowerCase().includes('insumos')) {
      setFormData(prev => ({ ...prev, categoria: 'Gastos operativos' }));
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Nuevo Movimiento"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipo de movimiento */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, tipo: 'ingreso' }))}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              formData.tipo === 'ingreso'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
            }`}
          >
            <div className="flex items-center justify-center mb-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                formData.tipo === 'ingreso' ? 'bg-green-500' : 'bg-gray-400'
              }`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
            </div>
            <div className={`${ds.typography.body} font-semibold ${
              formData.tipo === 'ingreso' ? 'text-green-700 dark:text-green-300' : ds.color.textSecondary
            }`}>
              Ingreso
            </div>
            <div className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Dinero que entra
            </div>
          </button>

          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, tipo: 'egreso' }))}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              formData.tipo === 'egreso'
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-red-300'
            }`}
          >
            <div className="flex items-center justify-center mb-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                formData.tipo === 'egreso' ? 'bg-red-500' : 'bg-gray-400'
              }`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                </svg>
              </div>
            </div>
            <div className={`${ds.typography.body} font-semibold ${
              formData.tipo === 'egreso' ? 'text-red-700 dark:text-red-300' : ds.color.textSecondary
            }`}>
              Egreso
            </div>
            <div className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Dinero que sale
            </div>
          </button>
        </div>

        {/* Concepto */}
        <div>
          <Select
            label="Concepto"
            value={formData.concepto}
            onChange={handleConceptoChange}
            options={[
              { value: '', label: 'Seleccionar concepto...' },
              ...conceptosComunes[formData.tipo].map(concepto => ({
                value: concepto,
                label: concepto
              }))
            ]}
            error={errors.concepto}
            required
          />
          {formData.concepto === 'Otros ingresos' || formData.concepto === 'Otros gastos' ? (
            <Input
              label="Especificar concepto"
              value={formData.concepto}
              onChange={(e) => setFormData(prev => ({ ...prev, concepto: e.target.value }))}
              placeholder="Ingrese el concepto específico"
              className="mt-2"
              required
            />
          ) : null}
        </div>

        {/* Monto y Método de Pago */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Monto"
            type="number"
            value={formData.monto}
            onChange={(e) => setFormData(prev => ({ ...prev, monto: e.target.value }))}
            placeholder="0"
            error={errors.monto}
            required
          />

          <Select
            label="Método de Pago"
            value={formData.metodoPago}
            onChange={(value) => setFormData(prev => ({ ...prev, metodoPago: value as any }))}
            options={[
              { value: 'efectivo', label: 'Efectivo' },
              { value: 'tarjeta', label: 'Tarjeta' },
              { value: 'transferencia', label: 'Transferencia' }
            ]}
            required
          />
        </div>

        {/* Categoría */}
        <Select
          label="Categoría"
          value={formData.categoria}
          onChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}
          options={[
            { value: '', label: 'Seleccionar categoría...' },
            ...categorias
          ]}
          error={errors.categoria}
          required
        />

        {/* Descripción */}
        <Textarea
          label="Descripción (Opcional)"
          value={formData.descripcion}
          onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
          placeholder="Detalles adicionales del movimiento..."
          rows={3}
        />

        {/* Resumen */}
        <div className={`${ds.card} ${ds.cardPad} bg-gray-50 dark:bg-gray-800/50`}>
          <h4 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-3`}>
            Resumen del Movimiento
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>Tipo:</span>
              <span className={`font-medium ${
                formData.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
              }`}>
                {formData.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>Monto:</span>
              <span className={`font-semibold ${
                formData.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
              }`}>
                {formData.tipo === 'ingreso' ? '+' : '-'}
                {formData.monto ? new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0
                }).format(Number(formData.monto)) : '$0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>Método:</span>
              <span className="font-medium capitalize">{formData.metodoPago}</span>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Movimiento'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};