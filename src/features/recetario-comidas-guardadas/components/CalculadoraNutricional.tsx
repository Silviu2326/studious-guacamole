import React, { useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { IngredienteReceta, ValorNutricional } from '../types';
import { Calculator } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';

interface CalculadoraNutricionalProps {
  ingredientes: IngredienteReceta[];
  porciones?: number;
  onCalcular?: (valorNutricional: ValorNutricional) => void;
}

export const CalculadoraNutricional: React.FC<CalculadoraNutricionalProps> = ({
  ingredientes,
  porciones = 1,
  onCalcular,
}) => {
  const [valorCalculado, setValorCalculado] = useState<ValorNutricional | null>(null);

  React.useEffect(() => {
    calcularValorNutricional();
  }, [ingredientes, porciones]);

  const calcularValorNutricional = () => {
    const total: ValorNutricional = {
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0,
      fibra: 0,
      azucares: 0,
      sodio: 0,
    };

    ingredientes.forEach((ingrediente) => {
      if (ingrediente.valorNutricional) {
        total.calorias += ingrediente.valorNutricional.calorias;
        total.proteinas += ingrediente.valorNutricional.proteinas;
        total.carbohidratos += ingrediente.valorNutricional.carbohidratos;
        total.grasas += ingrediente.valorNutricional.grasas;
        if (ingrediente.valorNutricional.fibra) {
          total.fibra = (total.fibra || 0) + ingrediente.valorNutricional.fibra;
        }
        if (ingrediente.valorNutricional.azucares) {
          total.azucares = (total.azucares || 0) + ingrediente.valorNutricional.azucares;
        }
        if (ingrediente.valorNutricional.sodio) {
          total.sodio = (total.sodio || 0) + ingrediente.valorNutricional.sodio;
        }
      }
    });

    // Dividir por porciones
    const porPorcion: ValorNutricional = {
      calorias: Math.round(total.calorias / porciones),
      proteinas: Math.round((total.proteinas / porciones) * 10) / 10,
      carbohidratos: Math.round((total.carbohidratos / porciones) * 10) / 10,
      grasas: Math.round((total.grasas / porciones) * 10) / 10,
      fibra: total.fibra ? Math.round((total.fibra / porciones) * 10) / 10 : undefined,
      azucares: total.azucares ? Math.round((total.azucares / porciones) * 10) / 10 : undefined,
      sodio: total.sodio ? Math.round(total.sodio / porciones) : undefined,
    };

    setValorCalculado(porPorcion);
    if (onCalcular) {
      onCalcular(porPorcion);
    }
  };

  if (!valorCalculado) {
    return (
      <Card variant="hover" padding="md">
        <div className="text-center py-8">
          <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Agrega ingredientes para calcular el valor nutricional
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="hover" padding="md">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
          Valor Nutricional Calculado (por porción)
        </h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-1`}>
            Calorías
          </p>
          <p className={`${ds.typography.h2} font-bold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            {valorCalculado.calorias}
          </p>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-1`}>
            Proteínas
          </p>
          <p className={`${ds.typography.h2} font-bold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            {valorCalculado.proteinas}g
          </p>
        </div>
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-1`}>
            Carbohidratos
          </p>
          <p className={`${ds.typography.h2} font-bold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            {valorCalculado.carbohidratos}g
          </p>
        </div>
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-1`}>
            Grasas
          </p>
          <p className={`${ds.typography.h2} font-bold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            {valorCalculado.grasas}g
          </p>
        </div>
      </div>
      {(valorCalculado.fibra || valorCalculado.azucares || valorCalculado.sodio) && (
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {valorCalculado.fibra !== undefined && (
            <div>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Fibra
              </p>
              <p className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {valorCalculado.fibra}g
              </p>
            </div>
          )}
          {valorCalculado.azucares !== undefined && (
            <div>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Azúcares
              </p>
              <p className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {valorCalculado.azucares}g
              </p>
            </div>
          )}
          {valorCalculado.sodio !== undefined && (
            <div>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Sodio
              </p>
              <p className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {valorCalculado.sodio}mg
              </p>
            </div>
          )}
        </div>
      )}
      {porciones > 1 && (
        <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-4 text-center`}>
          Valores calculados para {porciones} porciones
        </p>
      )}
    </Card>
  );
};

