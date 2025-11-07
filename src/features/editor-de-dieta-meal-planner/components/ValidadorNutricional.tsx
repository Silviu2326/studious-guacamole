import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { CheckCircle, XCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { type Dieta, validarDieta } from '../api/editor';
import { ds } from '../../adherencia/ui/ds';

interface ValidadorNutricionalProps {
  dieta: Dieta;
  onValidacionCompletada?: (resultado: { valida: boolean; errores: string[]; advertencias: string[] }) => void;
}

export const ValidadorNutricional: React.FC<ValidadorNutricionalProps> = ({
  dieta,
  onValidacionCompletada,
}) => {
  const [validando, setValidando] = useState(false);
  const [resultado, setResultado] = useState<{ valida: boolean; errores: string[]; advertencias: string[] } | null>(null);

  useEffect(() => {
    if (dieta && dieta.comidas.length > 0) {
      validar();
    }
  }, [dieta]);

  const validar = async () => {
    setValidando(true);
    try {
      const resultado = await validarDieta(dieta);
      setResultado(resultado);
      onValidacionCompletada?.(resultado);
    } catch (error) {
      console.error('Error validando dieta:', error);
      setResultado({
        valida: false,
        errores: ['Error al validar la dieta'],
        advertencias: [],
      });
    } finally {
      setValidando(false);
    }
  };

  const calcularTotales = () => {
    return dieta.comidas.reduce(
      (totales, comida) => ({
        calorias: totales.calorias + comida.calorias,
        proteinas: totales.proteinas + comida.proteinas,
        carbohidratos: totales.carbohidratos + comida.carbohidratos,
        grasas: totales.grasas + comida.grasas,
      }),
      { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
    );
  };

  const totales = calcularTotales();

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 size={24} className="text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Validador Nutricional
          </h2>
        </div>
        <Button onClick={validar} loading={validando}>
          Validar Dieta
        </Button>
      </div>

      {dieta.macros && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Calorías</div>
            <div className="text-lg font-bold text-gray-900">
              {totales.calorias} / {dieta.macros.calorias}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {Math.round((totales.calorias / dieta.macros.calorias) * 100)}%
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Proteínas</div>
            <div className="text-lg font-bold text-gray-900">
              {totales.proteinas}g / {dieta.macros.proteinas}g
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {Math.round((totales.proteinas / dieta.macros.proteinas) * 100)}%
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Carbohidratos</div>
            <div className="text-lg font-bold text-gray-900">
              {totales.carbohidratos}g / {dieta.macros.carbohidratos}g
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {Math.round((totales.carbohidratos / dieta.macros.carbohidratos) * 100)}%
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Grasas</div>
            <div className="text-lg font-bold text-gray-900">
              {totales.grasas}g / {dieta.macros.grasas}g
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {Math.round((totales.grasas / dieta.macros.grasas) * 100)}%
            </div>
          </div>
        </div>
      )}

      {resultado && (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg flex items-center gap-3 ${
              resultado.valida
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {resultado.valida ? (
              <CheckCircle size={24} className="text-green-600" />
            ) : (
              <XCircle size={24} className="text-red-600" />
            )}
            <div>
              <div
                className={`font-semibold ${
                  resultado.valida ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {resultado.valida ? 'Dieta Validada Correctamente' : 'Errores Encontrados'}
              </div>
              <div
                className={`text-sm ${
                  resultado.valida ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {resultado.valida
                  ? 'La dieta cumple con todos los requerimientos nutricionales'
                  : `Se encontraron ${resultado.errores.length} error(es) que deben corregirse`}
              </div>
            </div>
          </div>

          {resultado.errores.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-red-800 flex items-center gap-2">
                <XCircle size={20} />
                Errores
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                {resultado.errores.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {resultado.advertencias.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-yellow-800 flex items-center gap-2">
                <AlertTriangle size={20} />
                Advertencias
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                {resultado.advertencias.map((advertencia, index) => (
                  <li key={index}>{advertencia}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

