import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Input, Textarea, Select, Badge } from '../../../components/componentsreutilizables';
import { Plan, TipoPlan, EstadoPlan, Periodicidad, Caracteristica } from '../types';
import { PlanCard } from './PlanCard';
import { 
  X, 
  Save, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Star,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';

interface PlanFormProps {
  /** Plan inicial para modo edición. Si no se proporciona, es modo creación */
  initialPlan?: Plan;
  /** Callback cuando se envía el formulario */
  onSubmit: (planData: Partial<Plan> | Plan) => void;
  /** Callback cuando se cancela */
  onCancel: () => void;
  /** Lista de planes existentes para validar nombre único */
  existingPlans?: Plan[];
  /** Si es true, muestra el preview de PlanCard a la derecha (solo escritorio) */
  showPreview?: boolean;
}

// Opciones para los selects
const tipoPlanOptions = [
  { value: 'suscripcion', label: 'Suscripción' },
  { value: 'bono', label: 'Bono' },
  { value: 'paquete', label: 'Paquete' },
  { value: 'pt', label: 'PT' },
  { value: 'grupal', label: 'Grupal' }
];

const estadoPlanOptions = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'archivado', label: 'Archivado' },
  { value: 'borrador', label: 'Borrador' }
];

const periodicidadOptions = [
  { value: 'mensual', label: 'Mensual' },
  { value: 'trimestral', label: 'Trimestral' },
  { value: 'anual', label: 'Anual' },
  { value: 'puntual', label: 'Puntual' }
];

const monedaOptions = [
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'GBP', label: 'GBP (£)' }
];

const tipoSesionOptions = [
  { value: '1a1', label: '1 a 1 (Personal)' },
  { value: 'grupal', label: 'Grupal' },
  { value: 'online', label: 'Online' },
  { value: 'presencial', label: 'Presencial' },
  { value: 'videollamada', label: 'Videollamada' }
];

export const PlanForm: React.FC<PlanFormProps> = ({
  initialPlan,
  onSubmit,
  onCancel,
  existingPlans = [],
  showPreview = true
}) => {
  // Estado del formulario
  const [formData, setFormData] = useState<Partial<Plan>>({
    nombre: '',
    descripcion: '',
    tipo: 'suscripcion',
    estado: 'borrador',
    periodicidad: 'mensual',
    precioBase: 0,
    moneda: 'EUR',
    caracteristicas: [],
    beneficiosAdicionales: [],
    sesionesIncluidasOpcional: undefined,
    esRecomendado: false,
    esPopular: false,
    esNuevo: false
  });

  // Estado para descuento por pago anticipado (campo opcional)
  const [descuentoPagoAnticipado, setDescuentoPagoAnticipado] = useState<number>(0);

  // Estado para tipos de sesión seleccionados
  const [tiposSesionSeleccionados, setTiposSesionSeleccionados] = useState<string[]>([]);

  // Estado para nueva característica
  const [nuevaCaracteristica, setNuevaCaracteristica] = useState({
    label: '',
    descripcionOpcional: '',
    destacadoOpcional: false
  });

  // Estado para nuevo beneficio adicional
  const [nuevoBeneficio, setNuevoBeneficio] = useState('');

  // Errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Inicializar formulario con datos del plan si existe
  useEffect(() => {
    if (initialPlan) {
      setFormData({
        nombre: initialPlan.nombre || '',
        descripcion: initialPlan.descripcion || '',
        tipo: initialPlan.tipo || 'suscripcion',
        estado: initialPlan.estado || 'borrador',
        periodicidad: initialPlan.periodicidad || 'mensual',
        precioBase: initialPlan.precioBase || 0,
        moneda: initialPlan.moneda || 'EUR',
        caracteristicas: initialPlan.caracteristicas || [],
        beneficiosAdicionales: initialPlan.beneficiosAdicionales || [],
        sesionesIncluidasOpcional: initialPlan.sesionesIncluidasOpcional,
        esRecomendado: initialPlan.esRecomendado || false,
        esPopular: initialPlan.esPopular || false,
        esNuevo: initialPlan.esNuevo || false
      });

      // Extraer descuento del precio legacy si existe
      if (initialPlan.precio?.descuento) {
        setDescuentoPagoAnticipado(initialPlan.precio.descuento);
      }
    } else {
      // Reset para modo creación
      setFormData({
        nombre: '',
        descripcion: '',
        tipo: 'suscripcion',
        estado: 'borrador',
        periodicidad: 'mensual',
        precioBase: 0,
        moneda: 'EUR',
        caracteristicas: [],
        beneficiosAdicionales: [],
        sesionesIncluidasOpcional: undefined,
        esRecomendado: false,
        esPopular: false,
        esNuevo: false
      });
      setDescuentoPagoAnticipado(0);
      setTiposSesionSeleccionados([]);
    }
    setErrors({});
  }, [initialPlan]);

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar nombre
    if (!formData.nombre?.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else {
      // Validar nombre único (excluyendo el plan actual si estamos editando)
      const nombreDuplicado = existingPlans.some(
        plan => plan.nombre.toLowerCase() === formData.nombre?.toLowerCase().trim() &&
        plan.id !== initialPlan?.id
      );
      if (nombreDuplicado) {
        newErrors.nombre = 'Ya existe un plan con este nombre';
      }
    }

    // Validar descripción
    if (!formData.descripcion?.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }

    // Validar precio
    if (!formData.precioBase || formData.precioBase <= 0) {
      newErrors.precioBase = 'El precio debe ser mayor a 0';
    }

    // Validar periodicidad para planes de suscripción
    if (formData.tipo === 'suscripcion' && !formData.periodicidad) {
      newErrors.periodicidad = 'La periodicidad es obligatoria para planes de suscripción';
    }

    // Validar al menos una característica
    if (!formData.caracteristicas || formData.caracteristicas.length === 0) {
      newErrors.caracteristicas = 'Debe agregar al menos una característica';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambio de campo
  const handleChange = (field: keyof Plan, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  // Agregar característica
  const agregarCaracteristica = () => {
    if (!nuevaCaracteristica.label.trim()) return;

    const nueva: Caracteristica = {
      id: `car-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      label: nuevaCaracteristica.label.trim(),
      descripcionOpcional: nuevaCaracteristica.descripcionOpcional.trim() || undefined,
      destacadoOpcional: nuevaCaracteristica.destacadoOpcional
    };

    handleChange('caracteristicas', [...(formData.caracteristicas || []), nueva]);
    setNuevaCaracteristica({ label: '', descripcionOpcional: '', destacadoOpcional: false });
  };

  // Eliminar característica
  const eliminarCaracteristica = (id: string) => {
    handleChange('caracteristicas', (formData.caracteristicas || []).filter(c => c.id !== id));
  };

  // Agregar beneficio adicional
  const agregarBeneficio = () => {
    if (!nuevoBeneficio.trim()) return;

    handleChange('beneficiosAdicionales', [
      ...(formData.beneficiosAdicionales || []),
      nuevoBeneficio.trim()
    ]);
    setNuevoBeneficio('');
  };

  // Eliminar beneficio adicional
  const eliminarBeneficio = (index: number) => {
    const nuevos = [...(formData.beneficiosAdicionales || [])];
    nuevos.splice(index, 1);
    handleChange('beneficiosAdicionales', nuevos);
  };

  // Toggle tipo de sesión
  const toggleTipoSesion = (tipo: string) => {
    const nuevos = tiposSesionSeleccionados.includes(tipo)
      ? tiposSesionSeleccionados.filter(t => t !== tipo)
      : [...tiposSesionSeleccionados, tipo];
    setTiposSesionSeleccionados(nuevos);
  };

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Construir objeto Plan completo
    const planData: Partial<Plan> | Plan = {
      ...(initialPlan ? { id: initialPlan.id } : {}),
      nombre: formData.nombre!.trim(),
      descripcion: formData.descripcion!.trim(),
      tipo: formData.tipo!,
      estado: formData.estado!,
      periodicidad: formData.periodicidad!,
      precioBase: formData.precioBase!,
      moneda: formData.moneda!,
      caracteristicas: formData.caracteristicas || [],
      beneficiosAdicionales: formData.beneficiosAdicionales && formData.beneficiosAdicionales.length > 0
        ? formData.beneficiosAdicionales
        : undefined,
      sesionesIncluidasOpcional: formData.sesionesIncluidasOpcional && formData.sesionesIncluidasOpcional > 0
        ? formData.sesionesIncluidasOpcional
        : undefined,
      esRecomendado: formData.esRecomendado || false,
      esPopular: formData.esPopular || false,
      esNuevo: formData.esNuevo || false,
      // Mantener precio legacy para compatibilidad si hay descuento
      ...(descuentoPagoAnticipado > 0 ? {
        precio: {
          base: formData.precioBase!,
          descuento: descuentoPagoAnticipado,
          moneda: formData.moneda!
        }
      } : {}),
      // Fechas
      ...(initialPlan ? {
        createdAt: initialPlan.createdAt,
        updatedAt: new Date()
      } : {
        createdAt: new Date(),
        updatedAt: new Date()
      })
    };

    onSubmit(planData);
  };

  // Crear plan preview para PlanCard
  const planPreview: Plan = useMemo(() => {
    const basePlan: Plan = {
      id: initialPlan?.id || 'preview',
      nombre: formData.nombre || 'Nombre del plan',
      descripcion: formData.descripcion || 'Descripción del plan',
      tipo: (formData.tipo || 'suscripcion') as TipoPlan,
      estado: (formData.estado || 'borrador') as EstadoPlan,
      periodicidad: (formData.periodicidad || 'mensual') as Periodicidad,
      precioBase: formData.precioBase || 0,
      moneda: formData.moneda || 'EUR',
      caracteristicas: formData.caracteristicas || [],
      beneficiosAdicionales: formData.beneficiosAdicionales,
      sesionesIncluidasOpcional: formData.sesionesIncluidasOpcional,
      esRecomendado: formData.esRecomendado,
      esPopular: formData.esPopular,
      esNuevo: formData.esNuevo,
      ...(descuentoPagoAnticipado > 0 ? {
        precio: {
          base: formData.precioBase || 0,
          descuento: descuentoPagoAnticipado,
          moneda: formData.moneda || 'EUR'
        }
      } : {}),
      createdAt: initialPlan?.createdAt || new Date(),
      updatedAt: new Date()
    };
    return basePlan;
  }, [formData, descuentoPagoAnticipado, initialPlan]);

  // Verificar si el nombre es único (para mostrar advertencia visual)
  const nombreDuplicado = useMemo(() => {
    if (!formData.nombre?.trim()) return false;
    return existingPlans.some(
      plan => plan.nombre.toLowerCase() === formData.nombre?.toLowerCase().trim() &&
      plan.id !== initialPlan?.id
    );
  }, [formData.nombre, existingPlans, initialPlan]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Formulario principal */}
      <div className={`flex-1 ${showPreview ? 'lg:max-w-2xl' : ''}`}>
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Título */}
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {initialPlan ? 'Editar Plan' : 'Crear Nuevo Plan'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {initialPlan 
                  ? 'Modifica la información del plan' 
                  : 'Completa el formulario para crear un nuevo plan'}
              </p>
            </div>

            {/* Sección 1: Información Básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                Información Básica
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Nombre del plan"
                    value={formData.nombre || ''}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    error={errors.nombre}
                    placeholder="Ej: Plan Premium Mensual"
                    required
                  />
                  {nombreDuplicado && !errors.nombre && (
                    <div className="mt-1 flex items-center gap-2 text-amber-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>Ya existe un plan con este nombre</span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Textarea
                    label="Descripción"
                    value={formData.descripcion || ''}
                    onChange={(e) => handleChange('descripcion', e.target.value)}
                    error={errors.descripcion}
                    placeholder="Describe los beneficios y características del plan"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Select
                    label="Tipo de plan"
                    options={tipoPlanOptions}
                    value={formData.tipo || 'suscripcion'}
                    onChange={(e) => handleChange('tipo', e.target.value)}
                  />
                </div>

                <div>
                  <Select
                    label="Estado"
                    options={estadoPlanOptions}
                    value={formData.estado || 'borrador'}
                    onChange={(e) => handleChange('estado', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Sección 2: Precios */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                Precios
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Input
                    label="Precio base"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.precioBase || ''}
                    onChange={(e) => handleChange('precioBase', parseFloat(e.target.value) || 0)}
                    error={errors.precioBase}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <Select
                    label="Moneda"
                    options={monedaOptions}
                    value={formData.moneda || 'EUR'}
                    onChange={(e) => handleChange('moneda', e.target.value)}
                  />
                </div>

                <div>
                  <Select
                    label="Periodicidad"
                    options={periodicidadOptions}
                    value={formData.periodicidad || 'mensual'}
                    onChange={(e) => handleChange('periodicidad', e.target.value)}
                    error={errors.periodicidad}
                  />
                </div>
              </div>

              {/* Descuento por pago anticipado (opcional) */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 text-blue-600" />
                  <label className="text-sm font-medium text-gray-700">
                    Descuento por pago anticipado (opcional)
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="Porcentaje de descuento"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={descuentoPagoAnticipado || ''}
                      onChange={(e) => setDescuentoPagoAnticipado(parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      helperText="Ej: 10 para un 10% de descuento"
                    />
                  </div>
                  {descuentoPagoAnticipado > 0 && (
                    <div className="flex items-end">
                      <div className="bg-white border border-gray-200 rounded-lg p-3 w-full">
                        <p className="text-xs text-gray-500 mb-1">Precio con descuento:</p>
                        <p className="text-lg font-semibold text-green-600">
                          {((formData.precioBase || 0) * (1 - descuentoPagoAnticipado / 100)).toFixed(2)} {formData.moneda}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sección 3: Características y Beneficios */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                Características y Beneficios
              </h3>

              {/* Agregar característica */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    label="Etiqueta de característica"
                    value={nuevaCaracteristica.label}
                    onChange={(e) => setNuevaCaracteristica(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="Ej: Acceso 24/7"
                  />
                  <Input
                    label="Descripción opcional"
                    value={nuevaCaracteristica.descripcionOpcional}
                    onChange={(e) => setNuevaCaracteristica(prev => ({ ...prev, descripcionOpcional: e.target.value }))}
                    placeholder="Descripción adicional"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={nuevaCaracteristica.destacadoOpcional}
                      onChange={(e) => setNuevaCaracteristica(prev => ({ ...prev, destacadoOpcional: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Marcar como destacada</span>
                  </label>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={agregarCaracteristica}
                    disabled={!nuevaCaracteristica.label.trim()}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </div>
              </div>

              {/* Lista de características */}
              {formData.caracteristicas && formData.caracteristicas.length > 0 ? (
                <div className="space-y-2">
                  {formData.caracteristicas.map((caracteristica) => (
                    <div
                      key={caracteristica.id}
                      className="flex items-start justify-between p-3 bg-white border border-gray-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{caracteristica.label}</span>
                          {caracteristica.destacadoOpcional && (
                            <Badge variant="yellow" size="sm">
                              <Star className="h-3 w-3 mr-1" />
                              Destacada
                            </Badge>
                          )}
                        </div>
                        {caracteristica.descripcionOpcional && (
                          <p className="text-sm text-gray-600 mt-1">{caracteristica.descripcionOpcional}</p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarCaracteristica(caracteristica.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No hay características agregadas
                </div>
              )}
              {errors.caracteristicas && (
                <div className="text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {errors.caracteristicas}
                </div>
              )}

              {/* Beneficios adicionales */}
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beneficios adicionales (texto libre)
                </label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={nuevoBeneficio}
                    onChange={(e) => setNuevoBeneficio(e.target.value)}
                    placeholder="Ej: App móvil incluida"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarBeneficio())}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={agregarBeneficio}
                    disabled={!nuevoBeneficio.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.beneficiosAdicionales && formData.beneficiosAdicionales.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.beneficiosAdicionales.map((beneficio, index) => (
                      <Badge
                        key={index}
                        variant="gray"
                        className="flex items-center gap-1"
                      >
                        {beneficio}
                        <button
                          type="button"
                          onClick={() => eliminarBeneficio(index)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sección 4: Sesiones Incluidas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                Sesiones Incluidas
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Número de sesiones por periodo (opcional)"
                  type="number"
                  min="0"
                  value={formData.sesionesIncluidasOpcional || ''}
                  onChange={(e) => handleChange('sesionesIncluidasOpcional', parseInt(e.target.value) || undefined)}
                  placeholder="Ej: 12"
                  helperText="Aplica principalmente a bonos y paquetes PT"
                />
              </div>

              {/* Tipos de sesión */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipos de sesión permitidos
                </label>
                <div className="flex flex-wrap gap-2">
                  {tipoSesionOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggleTipoSesion(option.value)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        tiposSesionSeleccionados.includes(option.value)
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {tiposSesionSeleccionados.includes(option.value) && (
                        <CheckCircle2 className="h-4 w-4 inline mr-1" />
                      )}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Opciones adicionales */}
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900">Opciones Adicionales</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.esRecomendado || false}
                    onChange={(e) => handleChange('esRecomendado', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Marcar como recomendado</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.esPopular || false}
                    onChange={(e) => handleChange('esPopular', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Marcar como popular</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.esNuevo || false}
                    onChange={(e) => handleChange('esNuevo', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Marcar como nuevo</span>
                </label>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button type="button" variant="ghost" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                <Save className="h-4 w-4 mr-2" />
                {initialPlan ? 'Actualizar Plan' : 'Crear Plan'}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Preview de PlanCard (solo en escritorio) */}
      {showPreview && (
        <div className="hidden lg:block lg:w-80 flex-shrink-0">
          <div className="sticky top-6">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Vista Previa</h3>
                <Badge variant="gray" size="sm">
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Badge>
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                <PlanCard
                  plan={planPreview}
                  viewMode="grid"
                />
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
