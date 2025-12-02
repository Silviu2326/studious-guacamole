import React, { useState } from 'react';
import { Card, Button, Input, Select, Badge } from '../../../components/componentsreutilizables';
import { Save, Settings } from 'lucide-react';
import { RestriccionAlimentaria, TipoRestriccion, SeveridadRestriccion } from '../types';

export const ConfiguradorRestricciones: React.FC = () => {
  const [formData, setFormData] = useState<Partial<RestriccionAlimentaria>>({
    tipo: 'alergia',
    descripcion: '',
    ingredientesAfectados: [],
    severidad: 'leve',
  });

  const handleGuardar = () => {
    // Lógica para guardar configuración
    console.log('Guardando configuración:', formData);
  };

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Configurador de Restricciones
        </h2>
        <p className="text-gray-600 text-sm">
          Configura los valores por defecto para nuevas restricciones
        </p>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tipo de Restricción
          </label>
          <Select
            options={[
              { value: 'alergia', label: 'Alergia' },
              { value: 'intolerancia', label: 'Intolerancia' },
              { value: 'religiosa', label: 'Religiosa' },
              { value: 'cultural', label: 'Cultural' },
            ]}
            value={formData.tipo || 'alergia'}
            onChange={(e) => {
              const target = e.target as HTMLSelectElement;
              setFormData({ ...formData, tipo: target.value as TipoRestriccion });
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Severidad por Defecto
          </label>
          <Select
            options={[
              { value: 'leve', label: 'Leve' },
              { value: 'moderada', label: 'Moderada' },
              { value: 'severa', label: 'Severa' },
              { value: 'critica', label: 'Crítica' },
            ]}
            value={formData.severidad || 'leve'}
            onChange={(e) => {
              const target = e.target as HTMLSelectElement;
              setFormData({ ...formData, severidad: target.value as SeveridadRestriccion });
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Descripción
          </label>
          <Input
            value={formData.descripcion || ''}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            placeholder="Descripción de la restricción"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Ingredientes Afectados (separados por comas)
          </label>
          <Input
            value={formData.ingredientesAfectados?.join(', ') || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                ingredientesAfectados: e.target.value.split(',').map((i) => i.trim()),
              })
            }
            placeholder="Ej: cacahuetes, mariscos, gluten"
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleGuardar}>
            <Save size={20} className="mr-2" />
            Guardar Configuración
          </Button>
        </div>
      </div>
    </Card>
  );
};

