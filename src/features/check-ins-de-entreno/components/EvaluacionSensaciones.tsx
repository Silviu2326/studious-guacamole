import React, { useState } from 'react';
import { Card, Button, Textarea } from '../../../components/componentsreutilizables';
import { Heart, AlertCircle, Smile, Frown } from 'lucide-react';

interface EvaluacionSensacionesProps {
  onEvaluar: (sensacion: string, dolorLumbar: boolean) => void;
  valorInicial?: string;
  dolorLumbarInicial?: boolean;
}

export const EvaluacionSensaciones: React.FC<EvaluacionSensacionesProps> = ({
  onEvaluar,
  valorInicial = '',
  dolorLumbarInicial = false,
}) => {
  const [sensacion, setSensacion] = useState(valorInicial);
  const [dolorLumbar, setDolorLumbar] = useState(dolorLumbarInicial);
  const [sensacionRapida, setSensacionRapida] = useState<string | null>(null);

  const sensacionesRapidas = [
    { valor: 'Excelente', icono: <Smile className="w-4 h-4" />, colorClass: 'green', borderClass: 'border-green-500', bgClass: 'bg-green-50', textClass: 'text-green-600' },
    { valor: 'Bien', icono: <Heart className="w-4 h-4" />, colorClass: 'blue', borderClass: 'border-blue-500', bgClass: 'bg-blue-50', textClass: 'text-blue-600' },
    { valor: 'Regular', icono: <AlertCircle className="w-4 h-4" />, colorClass: 'yellow', borderClass: 'border-yellow-500', bgClass: 'bg-yellow-50', textClass: 'text-yellow-600' },
    { valor: 'Mal', icono: <Frown className="w-4 h-4" />, colorClass: 'red', borderClass: 'border-red-500', bgClass: 'bg-red-50', textClass: 'text-red-600' },
  ];

  const handleSensacionRapida = (valor: string) => {
    setSensacionRapida(valor);
    setSensacion(valor);
  };

  const handleGuardar = () => {
    onEvaluar(sensacion, dolorLumbar);
  };

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Heart size={20} className="text-red-500" />
          Evaluación de Sensaciones
        </h3>
        <p className="text-sm text-slate-600">
          Describe cómo te sentiste durante esta serie para ayudarnos a ajustar tu entrenamiento
        </p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Sensaciones rápidas
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {sensacionesRapidas.map((item) => (
              <button
                key={item.valor}
                onClick={() => handleSensacionRapida(item.valor)}
                className={`
                  p-4 rounded-xl border-2 transition-all hover:scale-105
                  ${sensacionRapida === item.valor
                    ? `${item.borderClass} ${item.bgClass} shadow-md`
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                  }
                  flex flex-col items-center gap-2
                `}
              >
                <span className={`${sensacionRapida === item.valor ? item.textClass : 'text-slate-400'}`}>
                  {item.icono}
                </span>
                <span className={`text-sm font-semibold ${
                  sensacionRapida === item.valor ? item.textClass : 'text-slate-700'
                }`}>
                  {item.valor}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Descripción detallada (opcional)
          </label>
          <Textarea
            value={sensacion}
            onChange={(e) => setSensacion(e.target.value)}
            placeholder="Describe cómo te sentiste durante el ejercicio..."
            rows={3}
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
          />
        </div>

        <div className="p-4 rounded-lg border-2 border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="dolor-lumbar"
              checked={dolorLumbar}
              onChange={(e) => setDolorLumbar(e.target.checked)}
              className="w-5 h-5 text-red-600 border-slate-300 rounded focus:ring-red-500 cursor-pointer"
            />
            <label htmlFor="dolor-lumbar" className="text-sm font-medium text-slate-700 cursor-pointer flex items-center gap-2">
              <AlertCircle size={16} className={dolorLumbar ? 'text-red-600' : 'text-slate-400'} />
              <span className={dolorLumbar ? 'text-red-700 font-semibold' : ''}>
                ¿Tienes dolor lumbar?
              </span>
            </label>
          </div>
          {dolorLumbar && (
            <p className="mt-2 text-xs text-red-600 pl-8">
              ⚠️ Si el dolor persiste, considera detener el ejercicio y consultar con tu entrenador
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button 
            onClick={handleGuardar} 
            fullWidth
            disabled={!sensacion}
            className="py-3 text-base font-semibold"
          >
            {sensacion ? 'Guardar Evaluación' : 'Selecciona una sensación para continuar'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

