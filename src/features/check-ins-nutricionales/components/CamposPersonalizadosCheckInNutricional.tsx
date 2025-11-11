import React from 'react';
import { Card, Input, Textarea, Select as SelectInput } from '../../../components/componentsreutilizables';
import { PlantillaCheckInNutricional, PreguntaCampo } from '../api/plantillas';

interface CamposPersonalizadosProps {
  plantilla: PlantillaCheckInNutricional;
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
}

export const CamposPersonalizadosCheckInNutricional: React.FC<CamposPersonalizadosProps> = ({
  plantilla,
  values,
  onChange,
}) => {
  const handleChange = (clave: string, value: any) => {
    onChange({ ...values, [clave]: value });
  };

  const renderCampo = (preg: PreguntaCampo) => {
    const v = values[preg.clave] ?? '';
    switch (preg.tipo) {
      case 'text':
        return (
          <Input
            value={v}
            onChange={(e) => handleChange(preg.clave, e.target.value)}
            placeholder={preg.ayuda || preg.etiqueta}
            className="w-full"
          />
        );
      case 'textarea':
        return (
          <Textarea
            value={v}
            onChange={(e) => handleChange(preg.clave, e.target.value)}
            placeholder={preg.ayuda || preg.etiqueta}
            rows={3}
            className="w-full"
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={v}
            min={preg.min}
            max={preg.max}
            onChange={(e) => handleChange(preg.clave, Number(e.target.value))}
            placeholder={preg.ayuda || preg.etiqueta}
            className="w-full"
          />
        );
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={!!v}
            onChange={(e) => handleChange(preg.clave, e.target.checked)}
            className="w-5 h-5"
          />
        );
      case 'select':
        return (
          <SelectInput
            value={v}
            onChange={(e) => handleChange(preg.clave, e.target.value)}
            options={(preg.opciones || []).map((o) => ({ value: o.value, label: o.label }))}
            placeholder={preg.ayuda || preg.etiqueta}
            className="w-full"
          />
        );
      case 'scale':
        return (
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={preg.min ?? 1}
              max={preg.max ?? 10}
              value={v || preg.min || 1}
              onChange={(e) => handleChange(preg.clave, Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-medium text-slate-700 w-10 text-right">{v || preg.min || 1}</span>
          </div>
        );
      default:
        return null;
    }
  };

  const preguntasOrdenadas = [...plantilla.preguntas].sort(
    (a, b) => (a.orden ?? 0) - (b.orden ?? 0)
  );

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Campos personalizados</h3>
        {plantilla.descripcion && (
          <p className="text-sm text-slate-600 mt-1">{plantilla.descripcion}</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {preguntasOrdenadas.map((preg) => (
          <div key={preg.id} className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              {preg.etiqueta} {preg.requerido && <span className="text-red-500">*</span>}
            </label>
            {renderCampo(preg)}
            {preg.ayuda && <p className="text-xs text-slate-500">{preg.ayuda}</p>}
          </div>
        ))}
      </div>
    </Card>
  );
};

