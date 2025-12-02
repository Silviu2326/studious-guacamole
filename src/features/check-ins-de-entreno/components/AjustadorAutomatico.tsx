import React, { useState } from 'react';
import { Card, Button, Select } from '../../../components/componentsreutilizables';
import { Settings, Zap, RotateCcw } from 'lucide-react';
import { aplicarAjusteAutomatico } from '../api/patrones';

interface AjustadorAutomaticoProps {
  clienteId: string;
  checkInId: string;
  onAjusteAplicado?: () => void;
}

export const AjustadorAutomatico: React.FC<AjustadorAutomaticoProps> = ({
  clienteId,
  checkInId,
  onAjusteAplicado,
}) => {
  const [tipoAjuste, setTipoAjuste] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [aplicado, setAplicado] = useState(false);

  const opcionesAjuste = [
    { value: 'reducir_intensidad', label: 'Reducir Intensidad' },
    { value: 'cambiar_ejercicio', label: 'Cambiar Ejercicio' },
    { value: 'aumentar_descanso', label: 'Aumentar Descanso' },
    { value: 'mantener', label: 'Mantener Plan Actual' },
  ];

  const handleAplicarAjuste = async () => {
    if (!tipoAjuste) return;

    setLoading(true);
    try {
      const exito = await aplicarAjusteAutomatico(
        clienteId,
        checkInId,
        tipoAjuste as any
      );
      if (exito) {
        setAplicado(true);
        onAjusteAplicado?.();
      }
    } catch (error) {
      console.error('Error al aplicar ajuste:', error);
    } finally {
      setLoading(false);
    }
  };

  if (aplicado) {
    return (
      <Card className="p-4 bg-white shadow-sm">
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Zap size={24} className="text-green-600" />
          </div>
          <p className="font-semibold text-gray-900 mb-1">Ajuste Aplicado</p>
          <p className="text-sm text-gray-600">El ajuste se ha aplicado correctamente</p>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setAplicado(false);
              setTipoAjuste('');
            }}
            className="mt-3"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Aplicar Otro Ajuste
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-white shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Settings size={20} className="text-purple-600" />
        Ajuste Automático
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tipo de Ajuste
          </label>
          <Select
            value={tipoAjuste}
            onChange={(e) => setTipoAjuste(e.target.value)}
            options={opcionesAjuste}
            placeholder="Selecciona un tipo de ajuste"
          />
        </div>

        <Button
          onClick={handleAplicarAjuste}
          disabled={!tipoAjuste || loading}
          fullWidth
          loading={loading}
        >
          <Zap className="w-4 h-4 mr-2" />
          Aplicar Ajuste
        </Button>
      </div>
    </Card>
  );
};

