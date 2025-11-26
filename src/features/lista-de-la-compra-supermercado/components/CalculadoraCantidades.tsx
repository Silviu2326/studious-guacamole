import React, { useState } from 'react';
import { Card, Button, Input } from '../../../components/componentsreutilizables';
import { Calculator, Users } from 'lucide-react';
import { 
  type IngredienteLista,
  calcularCantidades,
  type CalculoData
} from '../api';

interface CalculadoraCantidadesProps {
  ingredientes: IngredienteLista[];
  numeroPersonasBase: number;
  onCantidadesCalculadas?: (ingredientes: IngredienteLista[]) => void;
}

export const CalculadoraCantidades: React.FC<CalculadoraCantidadesProps> = ({
  ingredientes,
  numeroPersonasBase,
  onCantidadesCalculadas,
}) => {
  const [numeroPersonas, setNumeroPersonas] = useState<number>(numeroPersonasBase);
  const [multiplicador, setMultiplicador] = useState<number>(1);
  const [calculando, setCalculando] = useState(false);
  const [resultado, setResultado] = useState<IngredienteLista[]>([]);

  const handleCalcular = async () => {
    if (!numeroPersonas || numeroPersonas < 1) {
      alert('El número de personas debe ser mayor a 0');
      return;
    }

    setCalculando(true);
    try {
      const data: CalculoData = {
        ingredientes,
        numeroPersonas,
        multiplicador,
      };

      const resultadoCalculado = await calcularCantidades(data);
      setResultado(resultadoCalculado);
      onCantidadesCalculadas?.(resultadoCalculado);
    } catch (error) {
      console.error('Error calculando cantidades:', error);
      alert('Error al calcular las cantidades');
    } finally {
      setCalculando(false);
    }
  };

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-900">
          Calculadora de Cantidades
        </h2>
      </div>

      <div className="space-y-4">
        <Input
          label="Número de Personas"
          type="number"
          min="1"
          value={numeroPersonas.toString()}
          onChange={(e) => setNumeroPersonas(parseInt(e.target.value) || 1)}
          leftIcon={<Users className="w-4 h-4" />}
        />

        <Input
          label="Multiplicador (opcional)"
          type="number"
          min="0.1"
          step="0.1"
          value={multiplicador.toString()}
          onChange={(e) => setMultiplicador(parseFloat(e.target.value) || 1)}
          helperText="Factor de ajuste adicional para las cantidades"
        />

        <Button onClick={handleCalcular} loading={calculando} fullWidth>
          <Calculator className="w-4 h-4 mr-2" />
          Calcular Cantidades
        </Button>

        {resultado.length > 0 && (
          <div className="mt-6 space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              Resultado del Cálculo
            </h3>
            <div className="space-y-2">
              {resultado.map((ingrediente) => (
                <div
                  key={ingrediente.id}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex justify-between items-center"
                >
                  <span className="font-medium">{ingrediente.nombre}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    {ingrediente.cantidad} {ingrediente.unidad}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

