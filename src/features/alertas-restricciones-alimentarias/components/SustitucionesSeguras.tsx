import React, { useState } from 'react';
import { Card, Button, Input, Badge } from '../../../components/componentsreutilizables';
import { RefreshCw, CheckCircle, Search } from 'lucide-react';
import * as api from '../api/validacion';
import { SustitucionSegura } from '../types';

export const SustitucionesSeguras: React.FC = () => {
  const [ingrediente, setIngrediente] = useState('');
  const [sustituciones, setSustituciones] = useState<SustitucionSegura[]>([]);
  const [loading, setLoading] = useState(false);

  const handleBuscar = async () => {
    if (!ingrediente.trim()) return;
    setLoading(true);
    const sustitucionesData = await api.buscarSustituciones(ingrediente, []);
    setSustituciones(sustitucionesData);
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
                onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                placeholder="Ej: cacahuetes, mariscos, gluten"
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
              />
            </div>
            <div className="flex items-center">
              <Button onClick={handleBuscar} loading={loading}>
                <RefreshCw size={20} className="mr-2" />
                Buscar Sustituciones
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Lista de sustituciones */}
      {sustituciones.length > 0 && (
        <div className="space-y-4">
          {sustituciones.map((sust, idx) => (
            <Card key={idx} className="p-4 bg-white shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    Ingrediente Original
                  </p>
                  <p className="text-base text-gray-900 font-semibold">
                    {sust.ingredienteOriginal}
                  </p>
                </div>
                <Badge variant="green" leftIcon={<CheckCircle className="w-3 h-3" />}>
                  {sust.compatibilidad}% Compatible
                </Badge>
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Sustituto Recomendado
                </p>
                <p className="text-base text-gray-900 font-semibold">
                  {sust.ingredienteSustituto}
                </p>
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Razón
                </p>
                <p className="text-base text-gray-900">
                  {sust.razon}
                </p>
              </div>
              {sust.notas && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    Notas
                  </p>
                  <p className="text-base text-gray-900">
                    {sust.notas}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

