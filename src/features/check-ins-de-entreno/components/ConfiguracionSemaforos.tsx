import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { getConfigSemaforos, setConfigSemaforos, ConfigSemaforos } from '../api/semaforos';

interface Props {
  entrenadorId: string;
}

export const ConfiguracionSemaforos: React.FC<Props> = ({ entrenadorId }) => {
  const [config, setConfig] = useState<ConfigSemaforos | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (entrenadorId) {
      getConfigSemaforos(entrenadorId).then(setConfig);
    }
  }, [entrenadorId]);

  const handleChange = (campo: keyof Omit<ConfigSemaforos, 'entrenadorId' | 'actualizadoEn'>, value: any) => {
    if (!config) return;
    setConfig({ ...config, [campo]: value });
  };

  const handleGuardar = async () => {
    if (!config) return;
    setGuardando(true);
    const { entrenadorId: id, actualizadoEn, ...rest } = config;
    const nuevo = await setConfigSemaforos(config.entrenadorId, rest);
    setConfig(nuevo);
    setGuardando(false);
  };

  if (!config) return null;

  return (
    <Card className="p-6 bg-white shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Semáforos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Umbral Amarillo (RPE ≥)</label>
          <input
            type="number"
            min={6}
            max={20}
            step={1}
            className="border rounded-md px-3 py-2 w-full"
            value={config.umbralAmarilloRPE}
            onChange={(e) => handleChange('umbralAmarilloRPE', Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Umbral Rojo (RPE ≥)</label>
          <input
            type="number"
            min={6}
            max={20}
            step={1}
            className="border rounded-md px-3 py-2 w-full"
            value={config.umbralRojoRPE}
            onChange={(e) => handleChange('umbralRojoRPE', Number(e.target.value))}
          />
        </div>
        <div className="md:col-span-2">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.dolorLumbarEsRojo}
              onChange={(e) => handleChange('dolorLumbarEsRojo', e.target.checked)}
            />
            <span className="text-sm text-slate-700">Dolor lumbar marca Rojo automáticamente</span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Palabras clave Amarillo</label>
          <input
            type="text"
            className="border rounded-md px-3 py-2 w-full"
            value={config.palabrasClaveAmarillo.join(', ')}
            onChange={(e) =>
              handleChange(
                'palabrasClaveAmarillo',
                e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
            placeholder="regular, pesado, fatiga"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Palabras clave Rojo</label>
          <input
            type="text"
            className="border rounded-md px-3 py-2 w-full"
            value={config.palabrasClaveRojo.join(', ')}
            onChange={(e) =>
              handleChange(
                'palabrasClaveRojo',
                e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
            placeholder="dolor, lesión, parar"
          />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <button
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          onClick={handleGuardar}
          disabled={guardando}
        >
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
        <span className="text-xs text-slate-500">Última actualización: {new Date(config.actualizadoEn).toLocaleString('es-ES')}</span>
      </div>
    </Card>
  );
};


