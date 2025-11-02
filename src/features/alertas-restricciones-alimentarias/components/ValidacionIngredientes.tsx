import React, { useState } from 'react';
import { Card, Button, Input, Badge } from '../../../components/componentsreutilizables';
import { Search, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import * as api from '../api/validacion';
import { ValidacionIngrediente } from '../types';

export const ValidacionIngredientes: React.FC = () => {
  const [ingrediente, setIngrediente] = useState('');
  const [resultado, setResultado] = useState<ValidacionIngrediente | null>(null);
  const [loading, setLoading] = useState(false);

  const handleValidar = async () => {
    if (!ingrediente.trim()) return;
    setLoading(true);
    const validacion = await api.validarIngrediente(ingrediente);
    setResultado(validacion);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda */}
      <Card className="bg-white shadow-sm">
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                value={ingrediente}
                onChange={(e) => setIngrediente(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleValidar()}
                placeholder="Ej: cacahuetes, mariscos, gluten"
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
              />
            </div>
            <div className="flex items-center">
              <Button onClick={handleValidar} loading={loading}>
                <Search size={20} className="mr-2" />
                Validar
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Resultado de validación */}
      {resultado && (
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            {resultado.esSeguro ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
            <h3 className="text-lg font-semibold text-gray-900">
              {resultado.esSeguro ? 'Ingrediente Seguro' : 'Ingrediente No Seguro'}
            </h3>
          </div>

          {!resultado.esSeguro && resultado.restriccionesAfectadas.length > 0 && (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">
                  Restricciones Afectadas:
                </p>
                <div className="flex flex-wrap gap-2">
                  {resultado.restriccionesAfectadas.map((restriccion, idx) => (
                    <Badge key={idx} variant="red">
                      {restriccion}
                    </Badge>
                  ))}
                </div>
              </div>
              {resultado.clientesAfectados.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">
                    Clientes Afectados:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {resultado.clientesAfectados.map((cliente, idx) => (
                      <Badge key={idx} variant="yellow">
                        {cliente}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {resultado.recomendaciones && resultado.recomendaciones.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">
                    Recomendaciones:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {resultado.recomendaciones.map((rec, idx) => (
                      <li key={idx} className="text-base text-gray-900">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {resultado.esSeguro && (
            <p className="text-base text-green-600">
              Este ingrediente es seguro y puede ser utilizado sin restricciones.
            </p>
          )}
        </Card>
      )}
    </div>
  );
};

