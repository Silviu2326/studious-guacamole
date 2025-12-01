import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Tooltip } from '../../../components/componentsreutilizables';
import { PerfilFiscal, RegimenFiscal, TipoActividad, TipoIVAFiscal } from '../api/types';
import { Save, Building2, Info, HelpCircle } from 'lucide-react';

interface FiscalProfileFormProps {
  initialData: PerfilFiscal;
  onSubmit: (data: PerfilFiscal) => void;
  isSaving?: boolean;
}

export const FiscalProfileForm: React.FC<FiscalProfileFormProps> = ({
  initialData,
  onSubmit,
  isSaving = false
}) => {
  const [formData, setFormData] = useState<PerfilFiscal>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof PerfilFiscal, string>>>({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (field: keyof PerfilFiscal) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.type === 'number' 
      ? parseFloat(e.target.value) || 0 
      : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PerfilFiscal, string>> = {};

    if (!formData.regimenFiscal) {
      newErrors.regimenFiscal = 'El régimen fiscal es requerido';
    }

    if (!formData.tipoActividad) {
      newErrors.tipoActividad = 'El tipo de actividad es requerido';
    }

    if (!formData.tipoIVA) {
      newErrors.tipoIVA = 'El tipo de IVA es requerido';
    }

    if (formData.retencionIRPF < 0 || formData.retencionIRPF > 100) {
      newErrors.retencionIRPF = 'La retención IRPF debe estar entre 0 y 100';
    }

    if (!formData.pais.trim()) {
      newErrors.pais = 'El país es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="p-0 bg-white shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <Building2 size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Datos Fiscales
            </h3>
            <p className="text-sm text-gray-600">
              Configura tu información fiscal. Estos datos aparecerán en tus facturas y exportaciones contables. 
              Pasa el cursor sobre los iconos de información para más detalles.
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <span>Régimen Fiscal</span>
              <Tooltip 
                content={
                  <div className="max-w-xs text-xs space-y-2">
                    <p className="font-semibold mb-2">Régimen Fiscal:</p>
                    <p className="mb-2">El régimen fiscal determina cómo se calculan tus impuestos. Selecciona el que corresponde a tu situación.</p>
                    <div className="space-y-2">
                      <div>
                        <p className="font-semibold">Régimen General:</p>
                        <p className="text-xs">Pagas impuestos sobre tus beneficios reales (ingresos menos gastos deducibles).</p>
                      </div>
                      <div>
                        <p className="font-semibold">Régimen Simplificado:</p>
                        <p className="text-xs">Aplicas coeficientes reductores a tus ingresos según el tipo de actividad.</p>
                      </div>
                      <div>
                        <p className="font-semibold">Estimación Objetiva:</p>
                        <p className="text-xs">Se usa un módulo base según el tipo de actividad.</p>
                      </div>
                      <div>
                        <p className="font-semibold">Exento:</p>
                        <p className="text-xs">No estás sujeto a estos impuestos (situaciones especiales).</p>
                      </div>
                    </div>
                  </div>
                } 
                position="right"
                delay={100}
              >
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
              </Tooltip>
            </label>
            <select
              value={formData.regimenFiscal}
              onChange={handleChange('regimenFiscal')}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
            >
              <option value="general">General</option>
              <option value="simplificado">Simplificado</option>
              <option value="estimacion_objetiva">Estimación Objetiva</option>
              <option value="exento">Exento</option>
            </select>
            {errors.regimenFiscal && (
              <p className="text-xs text-red-600 mt-1">{errors.regimenFiscal}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <span>Tipo de Actividad</span>
              <Tooltip 
                content={
                  <div className="max-w-xs text-xs">
                    <p className="font-semibold mb-2">Tipo de Actividad:</p>
                    <p className="mb-2">Selecciona el tipo de actividad económica que mejor describe tu situación fiscal.</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li><strong>Autónomo:</strong> Trabajador por cuenta propia</li>
                      <li><strong>Sociedad Limitada:</strong> S.L.</li>
                      <li><strong>Sociedad Anónima:</strong> S.A.</li>
                      <li><strong>Comunidad de Bienes:</strong> C.B.</li>
                      <li><strong>Sociedad Civil:</strong> S.C.</li>
                    </ul>
                  </div>
                }
                position="right"
                delay={100}
              >
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
              </Tooltip>
            </label>
            <select
              value={formData.tipoActividad}
              onChange={handleChange('tipoActividad')}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
            >
              <option value="autonomo">Autónomo</option>
              <option value="sociedad_limitada">Sociedad Limitada (S.L.)</option>
              <option value="sociedad_anonima">Sociedad Anónima (S.A.)</option>
              <option value="comunidad_bienes">Comunidad de Bienes (C.B.)</option>
              <option value="sociedad_civil">Sociedad Civil (S.C.)</option>
            </select>
            {errors.tipoActividad && (
              <p className="text-xs text-red-600 mt-1">{errors.tipoActividad}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <span>Tipo de IVA</span>
              <Tooltip 
                content={
                  <div className="max-w-xs text-xs">
                    <p className="font-semibold mb-2">Tipo de IVA:</p>
                    <p className="mb-2">Selecciona el tipo de IVA que aplica a tu actividad.</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li><strong>General:</strong> 21% (tipo estándar)</li>
                      <li><strong>Reducido:</strong> 10% (algunos servicios)</li>
                      <li><strong>Superreducido:</strong> 4% (casos especiales)</li>
                      <li><strong>Exento:</strong> No sujeto a IVA</li>
                      <li><strong>No Sujeto:</strong> No aplica IVA</li>
                    </ul>
                  </div>
                }
                position="right"
                delay={100}
              >
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
              </Tooltip>
            </label>
            <select
              value={formData.tipoIVA}
              onChange={handleChange('tipoIVA')}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
            >
              <option value="general">General (21%)</option>
              <option value="reducido">Reducido (10%)</option>
              <option value="superreducido">Superreducido (4%)</option>
              <option value="exento">Exento</option>
              <option value="no_sujeto">No Sujeto</option>
            </select>
            {errors.tipoIVA && (
              <p className="text-xs text-red-600 mt-1">{errors.tipoIVA}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <span>Retención IRPF (%)</span>
              <Tooltip 
                content={
                  <div className="max-w-xs text-xs">
                    <p className="font-semibold mb-2">Retención IRPF:</p>
                    <p className="mb-2">Porcentaje de retención de IRPF que se aplica sobre tus ingresos. Suele estar entre 15% y 30% para autónomos.</p>
                    <p className="text-xs italic">Ejemplo: Si ingresas 15, significa que se retiene el 15% de tus ingresos.</p>
                  </div>
                }
                position="right"
                delay={100}
              >
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
              </Tooltip>
            </label>
            <Input
              label=""
              type="number"
              value={formData.retencionIRPF}
              onChange={handleChange('retencionIRPF')}
              error={errors.retencionIRPF}
              placeholder="Ej: 15"
              min="0"
              max="100"
              step="0.1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <span>País</span>
              <Tooltip 
                content={
                  <div className="max-w-xs text-xs">
                    <p className="font-semibold mb-2">País:</p>
                    <p className="mb-2">País donde está registrada tu actividad fiscal.</p>
                  </div>
                }
                position="right"
                delay={100}
              >
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
              </Tooltip>
            </label>
            <Input
              label=""
              value={formData.pais}
              onChange={handleChange('pais')}
              error={errors.pais}
              placeholder="Ej: España"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <span>Comunidad Autónoma (Opcional)</span>
              <Tooltip 
                content={
                  <div className="max-w-xs text-xs">
                    <p className="font-semibold mb-2">Comunidad Autónoma:</p>
                    <p className="mb-2">Solo aplica si tu actividad está en España. Puede afectar a algunos impuestos autonómicos.</p>
                  </div>
                }
                position="right"
                delay={100}
              >
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
              </Tooltip>
            </label>
            <Input
              label=""
              value={formData.comunidadAutonomaOpcional || ''}
              onChange={handleChange('comunidadAutonomaOpcional')}
              placeholder="Ej: Madrid, Cataluña, etc."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <span>Observaciones (Opcional)</span>
              <Tooltip 
                content={
                  <div className="max-w-xs text-xs">
                    <p className="font-semibold mb-2">Observaciones:</p>
                    <p className="mb-2">Notas adicionales sobre tu perfil fiscal que puedan ser relevantes para los cálculos.</p>
                  </div>
                }
                position="right"
                delay={100}
              >
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
              </Tooltip>
            </label>
            <textarea
              value={formData.observaciones || ''}
              onChange={handleChange('observaciones')}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm min-h-[80px]"
              placeholder="Notas adicionales sobre tu perfil fiscal..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button
            type="submit"
            variant="primary"
            loading={isSaving}
            disabled={isSaving}
          >
            <Save size={20} className="mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </form>
    </Card>
  );
};

