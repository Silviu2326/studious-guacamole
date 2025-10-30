import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Textarea, Select } from '../../../components/componentsreutilizables';
import { Plan, UserRole, CreateBonoRequest, CreateTipoCuotaRequest } from '../types';
import { X, Save, AlertCircle } from 'lucide-react';

interface PlanFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (planData: Partial<Plan>) => void;
  userType: UserRole;
  editingPlan?: Plan | null;
  title?: string;
}

export const PlanForm: React.FC<PlanFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userType,
  editingPlan,
  title
}) => {
  const [formData, setFormData] = useState<Partial<Plan>>({
    nombre: '',
    descripcion: '',
    precio: {
      base: 0,
      descuento: 0,
      moneda: 'EUR'
    },
    activo: true,
    // Campos específicos para entrenador
    sesiones: userType === 'entrenador' ? 1 : undefined,
    validezMeses: userType === 'entrenador' ? 1 : undefined,
    // Campos específicos para gimnasio
    tipoAcceso: userType === 'gimnasio' ? 'basica' : undefined,
    clasesIlimitadas: userType === 'gimnasio' ? false : undefined,
    instalacionesIncluidas: userType === 'gimnasio' ? [] : undefined
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nuevaInstalacion, setNuevaInstalacion] = useState('');

  useEffect(() => {
    if (editingPlan) {
      setFormData({
        ...editingPlan,
        instalacionesIncluidas: editingPlan.instalacionesIncluidas || []
      });
    } else {
      // Reset form for new plan
      setFormData({
        nombre: '',
        descripcion: '',
        precio: {
          base: 0,
          descuento: 0,
          moneda: 'EUR'
        },
        activo: true,
        sesiones: userType === 'entrenador' ? 1 : undefined,
        validezMeses: userType === 'entrenador' ? 1 : undefined,
        tipoAcceso: userType === 'gimnasio' ? 'basica' : undefined,
        clasesIlimitadas: userType === 'gimnasio' ? false : undefined,
        instalacionesIncluidas: userType === 'gimnasio' ? [] : undefined
      });
    }
    setErrors({});
  }, [editingPlan, userType, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre?.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.descripcion?.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }

    if (!formData.precio?.base || formData.precio.base <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    if (userType === 'entrenador') {
      if (!formData.sesiones || formData.sesiones <= 0) {
        newErrors.sesiones = 'El número de sesiones debe ser mayor a 0';
      }

      if (!formData.validezMeses || formData.validezMeses <= 0) {
        newErrors.validezMeses = 'La validez debe ser mayor a 0 meses';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const planData: Partial<Plan> = {
      ...formData,
      tipo: userType === 'entrenador' ? 'bono_pt' : 'cuota_gimnasio',
      fechaActualizacion: new Date(),
      ...(editingPlan ? {} : { fechaCreacion: new Date() })
    };

    onSubmit(planData);
    onClose();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePrecioChange = (field: 'base' | 'descuento', value: number) => {
    setFormData(prev => ({
      ...prev,
      precio: {
        ...prev.precio!,
        [field]: value
      }
    }));
  };

  const agregarInstalacion = () => {
    if (nuevaInstalacion.trim() && !formData.instalacionesIncluidas?.includes(nuevaInstalacion.trim())) {
      setFormData(prev => ({
        ...prev,
        instalacionesIncluidas: [...(prev.instalacionesIncluidas || []), nuevaInstalacion.trim()]
      }));
      setNuevaInstalacion('');
    }
  };

  const eliminarInstalacion = (instalacion: string) => {
    setFormData(prev => ({
      ...prev,
      instalacionesIncluidas: prev.instalacionesIncluidas?.filter(i => i !== instalacion) || []
    }));
  };

  const tipoAccesoOptions = [
    { value: 'basica', label: 'Básica' },
    { value: 'premium', label: 'Premium' },
    { value: 'libre_acceso', label: 'Libre Acceso 24/7' }
  ];

  const precioFinal = (formData.precio?.base || 0) * (1 - (formData.precio?.descuento || 0) / 100);

  const getModalTitle = () => {
    if (title) return title;
    const action = editingPlan ? 'Editar' : 'Crear';
    const type = userType === 'entrenador' ? 'Bono PT' : 'Membresía';
    return `${action} ${type}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getModalTitle()}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <div className="space-y-4">
          <div>
            <Input
              label="Nombre del plan"
              value={formData.nombre || ''}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              error={errors.nombre}
              placeholder={userType === 'entrenador' ? 'Ej: Bono Premium PT' : 'Ej: Membresía Premium'}
            />
          </div>

          <div>
            <Textarea
              label="Descripción"
              value={formData.descripcion || ''}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              error={errors.descripcion}
              placeholder="Describe los beneficios y características del plan"
              rows={3}
            />
          </div>
        </div>

        {/* Configuración específica por tipo */}
        {userType === 'entrenador' ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Configuración del Bono</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Número de sesiones"
                type="number"
                min="1"
                value={formData.sesiones || ''}
                onChange={(e) => handleInputChange('sesiones', parseInt(e.target.value) || 0)}
                error={errors.sesiones}
              />
              
              <Input
                label="Validez (meses)"
                type="number"
                min="1"
                value={formData.validezMeses || ''}
                onChange={(e) => handleInputChange('validezMeses', parseInt(e.target.value) || 0)}
                error={errors.validezMeses}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Configuración de Membresía</h3>
            
            <Select
              label="Tipo de acceso"
              options={tipoAccesoOptions}
              value={formData.tipoAcceso || 'basica'}
              onChange={(value) => handleInputChange('tipoAcceso', value)}
            />
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="clasesIlimitadas"
                checked={formData.clasesIlimitadas || false}
                onChange={(e) => handleInputChange('clasesIlimitadas', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="clasesIlimitadas" className="text-sm font-medium text-gray-700">
                Clases grupales ilimitadas
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instalaciones incluidas
              </label>
              
              <div className="flex space-x-2 mb-2">
                <Input
                  value={nuevaInstalacion}
                  onChange={(e) => setNuevaInstalacion(e.target.value)}
                  placeholder="Agregar instalación"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarInstalacion())}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={agregarInstalacion}
                  disabled={!nuevaInstalacion.trim()}
                >
                  Agregar
                </Button>
              </div>
              
              {formData.instalacionesIncluidas && formData.instalacionesIncluidas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.instalacionesIncluidas.map((instalacion, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                    >
                      {instalacion}
                      <button
                        type="button"
                        onClick={() => eliminarInstalacion(instalacion)}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Configuración de precio */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Precio</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Precio base (€)"
              type="number"
              min="0"
              step="0.01"
              value={formData.precio?.base || ''}
              onChange={(e) => handlePrecioChange('base', parseFloat(e.target.value) || 0)}
              error={errors.precio}
            />
            
            <Input
              label="Descuento (%)"
              type="number"
              min="0"
              max="100"
              value={formData.precio?.descuento || ''}
              onChange={(e) => handlePrecioChange('descuento', parseFloat(e.target.value) || 0)}
            />
          </div>
          
          {precioFinal !== (formData.precio?.base || 0) && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">
                  Precio final: <strong>{precioFinal.toFixed(2)}€</strong>
                  {userType === 'gimnasio' && ' /mes'}
                  {userType === 'entrenador' && formData.sesiones && 
                    ` (${(precioFinal / formData.sesiones).toFixed(2)}€ por sesión)`
                  }
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Estado */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="activo"
            checked={formData.activo || false}
            onChange={(e) => handleInputChange('activo', e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="activo" className="text-sm font-medium text-gray-700">
            Plan activo
          </label>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            <Save className="h-4 w-4 mr-2" />
            {editingPlan ? 'Actualizar' : 'Crear'} Plan
          </Button>
        </div>
      </form>
    </Modal>
  );
};