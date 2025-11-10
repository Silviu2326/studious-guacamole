import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Tooltip } from '../../../components/componentsreutilizables';
import { FiscalProfile } from '../api/types';
import { Save, Building2, Info, HelpCircle } from 'lucide-react';

interface FiscalProfileFormProps {
  initialData: FiscalProfile;
  onSubmit: (data: FiscalProfile) => void;
  isSaving?: boolean;
}

export const FiscalProfileForm: React.FC<FiscalProfileFormProps> = ({
  initialData,
  onSubmit,
  isSaving = false
}) => {
  const [formData, setFormData] = useState<FiscalProfile>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof FiscalProfile, string>>>({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (field: keyof FiscalProfile) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FiscalProfile, string>> = {};

    if (!formData.legalName.trim()) {
      newErrors.legalName = 'El nombre fiscal es requerido';
    }

    if (!formData.taxId.trim()) {
      newErrors.taxId = 'El CIF/NIF es requerido';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección fiscal es requerida';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'El país es requerido';
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
              <span>Nombre Fiscal</span>
              <Tooltip 
                content={
                  <div className="max-w-xs">
                    <p className="font-semibold mb-2">Nombre Fiscal:</p>
                    <p className="text-xs mb-2">Nombre completo que aparece en tus documentos fiscales y facturas. Debe coincidir exactamente con el que está registrado en Hacienda.</p>
                    <p className="text-xs font-semibold mt-2">Para empresas:</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      <li>Nombre completo de la sociedad (S.L., S.A., etc.)</li>
                      <li>Ejemplo: "Fit Center S.L." o "Gimnasio El Deporte S.A."</li>
                    </ul>
                    <p className="text-xs font-semibold mt-2">Para autónomos:</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      <li>Tu nombre completo tal como aparece en el DNI</li>
                      <li>Ejemplo: "Juan Pérez García"</li>
                    </ul>
                    <p className="text-xs mt-2 italic">Este nombre aparecerá en todas tus facturas y documentos fiscales.</p>
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
              value={formData.legalName}
              onChange={handleChange('legalName')}
              error={errors.legalName}
              placeholder="Ej: Fit Center S.L. o Tu Nombre"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <span>Número de Identificación Fiscal</span>
              <Tooltip 
                content={
                  <div className="max-w-xs">
                    <p className="font-semibold mb-2">CIF/NIF (Número de Identificación Fiscal):</p>
                    <p className="text-xs mb-2">Número único que identifica tu actividad fiscal ante Hacienda. Es obligatorio para todas las empresas y autónomos.</p>
                    <p className="text-xs font-semibold mt-2">Para empresas (CIF):</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      <li>Formato: Letra + 8 dígitos + letra de control</li>
                      <li>Ejemplos: "B12345678", "A87654321", "G12345678"</li>
                      <li>La letra inicial indica el tipo de sociedad (B=S.L., A=S.A., etc.)</li>
                    </ul>
                    <p className="text-xs font-semibold mt-2">Para autónomos (NIF):</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      <li>Formato: 8 dígitos + letra de control</li>
                      <li>Ejemplo: "12345678A"</li>
                      <li>Es el mismo número que aparece en tu DNI</li>
                    </ul>
                    <p className="text-xs mt-2 italic">Este número debe aparecer en todas tus facturas y documentos fiscales.</p>
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
              value={formData.taxId}
              onChange={handleChange('taxId')}
              error={errors.taxId}
              placeholder="Ej: B12345678 o 12345678A"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <span>Dirección Fiscal</span>
              <Tooltip 
                content={
                  <div className="max-w-xs">
                    <p className="font-semibold mb-2">Dirección Fiscal:</p>
                    <p className="text-xs mb-2">Dirección completa donde está registrada tu actividad fiscal. Esta dirección debe coincidir exactamente con la que aparece en tu alta de Hacienda.</p>
                    <p className="text-xs font-semibold mt-2">Información a incluir:</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      <li>Calle y número</li>
                      <li>Código postal</li>
                      <li>Ciudad</li>
                      <li>Provincia (si aplica)</li>
                    </ul>
                    <p className="text-xs font-semibold mt-2">Ejemplos:</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      <li>"Calle Mayor 123, 28013 Madrid"</li>
                      <li>"Avenida del Ejemplo 45, 08001 Barcelona"</li>
                      <li>"Plaza Central 7, 41001 Sevilla"</li>
                    </ul>
                    <p className="text-xs mt-2 italic">Esta dirección aparecerá en tus facturas y documentos fiscales. Debe ser una dirección física válida donde puedas recibir notificaciones oficiales.</p>
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
              value={formData.address}
              onChange={handleChange('address')}
              error={errors.address}
              placeholder="Ej: Calle Falsa 123, 28080 Madrid"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <span>País</span>
              <Tooltip 
                content={
                  <div className="max-w-xs">
                    <p className="font-semibold mb-2">País:</p>
                    <p className="text-xs mb-2">País donde está registrada tu actividad fiscal. Debe ser el mismo país donde realizas tu actividad económica principal.</p>
                    <p className="text-xs font-semibold mt-2">Código ISO de dos letras:</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      <li><strong>ES:</strong> España</li>
                      <li><strong>CO:</strong> Colombia</li>
                      <li><strong>MX:</strong> México</li>
                      <li><strong>AR:</strong> Argentina</li>
                      <li>Y otros códigos ISO estándar</li>
                    </ul>
                    <p className="text-xs mt-2 italic">Este código se usa en documentos fiscales internacionales y facturas. Si tu actividad está en España, usa "ES".</p>
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
              value={formData.country}
              onChange={handleChange('country')}
              error={errors.country}
              placeholder="Ej: ES"
              required
            />
          </div>

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
                        <p className="text-xs italic mt-1">Ideal para: Empresas con muchos gastos deducibles que quieren maximizar deducciones.</p>
                      </div>
                      <div>
                        <p className="font-semibold">Régimen Simplificado:</p>
                        <p className="text-xs">Aplicas coeficientes reductores a tus ingresos según el tipo de actividad.</p>
                        <p className="text-xs italic mt-1">Ideal para: Actividades con pocos gastos o que quieren simplificar la contabilidad.</p>
                      </div>
                      <div>
                        <p className="font-semibold">Exento:</p>
                        <p className="text-xs">No estás sujeto a estos impuestos (situaciones especiales o actividades exentas).</p>
                        <p className="text-xs italic mt-1">Solo en casos muy específicos. Consulta con tu gestor.</p>
                      </div>
                    </div>
                    <p className="text-xs mt-2 font-semibold">⚠️ Importante:</p>
                    <p className="text-xs">Si no estás seguro, consulta con tu gestor o asesor fiscal. El régimen fiscal puede afectar significativamente tus impuestos.</p>
                  </div>
                } 
                position="right"
                delay={100}
              >
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
              </Tooltip>
            </label>
            <select
              value={formData.taxRegime}
              onChange={handleChange('taxRegime')}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
            >
              <option value="General">General (Impuestos sobre beneficios reales)</option>
              <option value="Simplificado">Simplificado (Con coeficientes reductores)</option>
              <option value="Exento">Exento (No sujeto a estos impuestos)</option>
            </select>
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

