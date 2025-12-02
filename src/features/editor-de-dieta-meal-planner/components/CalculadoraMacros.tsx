import React, { useState } from 'react';
import { Card, Button, Input, Select } from '../../../components/componentsreutilizables';
import { Calculator, TrendingUp, Target, Activity } from 'lucide-react';
import { calcularMacros, calcularTMB, calcularGET, ajustarPorObjetivo, distribuirMacros, type CalculoMacrosParams, type MacrosCalculados } from '../api/macros';
import { ds } from '../../adherencia/ui/ds';

export const CalculadoraMacros: React.FC = () => {
  const [params, setParams] = useState<CalculoMacrosParams>({
    edad: 30,
    sexo: 'masculino',
    peso: 70,
    altura: 175,
    nivelActividad: 'moderado',
    objetivo: 'mantenimiento',
    deficitCalorico: 20,
    superavitCalorico: 10,
  });

  const [resultados, setResultados] = useState<MacrosCalculados | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof CalculoMacrosParams, value: any) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleCalcular = async () => {
    setLoading(true);
    try {
      const calculado = await calcularMacros(params);
      if (calculado) {
        setResultados(calculado);
      } else {
        // Fallback a cálculo local
        const tmb = calcularTMB(params.edad, params.sexo, params.peso, params.altura);
        const get = calcularGET(tmb, params.nivelActividad);
        const calorias = ajustarPorObjetivo(
          get,
          params.objetivo,
          params.deficitCalorico,
          params.superavitCalorico
        );
        const macros = distribuirMacros(calorias, params.objetivo);
        setResultados({
          ...macros,
          calorias,
        });
      }
    } catch (error) {
      console.error('Error calculando macros:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Calculator size={24} className="text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Calculadora de Macronutrientes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Edad"
            type="number"
            value={params.edad.toString()}
            onChange={(e) => handleChange('edad', parseInt(e.target.value) || 0)}
          />
          
          <Select
            label="Sexo"
            options={[
              { value: 'masculino', label: 'Masculino' },
              { value: 'femenino', label: 'Femenino' },
            ]}
            value={params.sexo}
            onChange={(e) => handleChange('sexo', e.target.value as 'masculino' | 'femenino')}
          />

          <Input
            label="Peso (kg)"
            type="number"
            value={params.peso.toString()}
            onChange={(e) => handleChange('peso', parseFloat(e.target.value) || 0)}
          />

          <Input
            label="Altura (cm)"
            type="number"
            value={params.altura.toString()}
            onChange={(e) => handleChange('altura', parseInt(e.target.value) || 0)}
          />

          <Select
            label="Nivel de Actividad"
            options={[
              { value: 'sedentario', label: 'Sedentario' },
              { value: 'ligero', label: 'Ligero (1-3 días/semana)' },
              { value: 'moderado', label: 'Moderado (3-5 días/semana)' },
              { value: 'intenso', label: 'Intenso (6-7 días/semana)' },
              { value: 'muy-intenso', label: 'Muy Intenso (2x día)' },
            ]}
            value={params.nivelActividad}
            onChange={(e) => handleChange('nivelActividad', e.target.value as CalculoMacrosParams['nivelActividad'])}
          />

          <Select
            label="Objetivo"
            options={[
              { value: 'perdida-peso', label: 'Pérdida de Peso' },
              { value: 'ganancia-muscular', label: 'Ganancia Muscular' },
              { value: 'mantenimiento', label: 'Mantenimiento' },
              { value: 'rendimiento', label: 'Rendimiento Deportivo' },
              { value: 'salud-general', label: 'Salud General' },
            ]}
            value={params.objetivo}
            onChange={(e) => handleChange('objetivo', e.target.value as CalculoMacrosParams['objetivo'])}
          />

          {(params.objetivo === 'perdida-peso' || params.objetivo === 'rendimiento') && (
            <Input
              label={params.objetivo === 'perdida-peso' ? 'Déficit Calórico (%)' : 'Superávit Calórico (%)'}
              type="number"
              value={params.objetivo === 'perdida-peso' 
                ? (params.deficitCalorico || 20).toString() 
                : (params.superavitCalorico || 10).toString()}
              onChange={(e) => {
                if (params.objetivo === 'perdida-peso') {
                  handleChange('deficitCalorico', parseInt(e.target.value) || 20);
                } else {
                  handleChange('superavitCalorico', parseInt(e.target.value) || 10);
                }
              }}
            />
          )}
        </div>

        <div className="mt-6">
          <Button onClick={handleCalcular} loading={loading} fullWidth>
            <Calculator className="w-4 h-4 mr-2" />
            Calcular Macros
          </Button>
        </div>
      </Card>

      {resultados && (
        <Card className="p-6 bg-blue-50 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Target size={24} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Resultados Calculados
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Calorías</div>
              <div className="text-2xl font-bold text-gray-900">
                {resultados.calorias}
              </div>
              <div className="text-xs text-gray-500 mt-1">kcal/día</div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Proteínas</div>
              <div className="text-2xl font-bold text-gray-900">
                {resultados.proteinas}g
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((resultados.proteinas * 4 / resultados.calorias) * 100)}% del total
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Carbohidratos</div>
              <div className="text-2xl font-bold text-gray-900">
                {resultados.carbohidratos}g
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((resultados.carbohidratos * 4 / resultados.calorias) * 100)}% del total
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Grasas</div>
              <div className="text-2xl font-bold text-gray-900">
                {resultados.grasas}g
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((resultados.grasas * 9 / resultados.calorias) * 100)}% del total
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

