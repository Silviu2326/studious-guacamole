import { useState, useRef, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Button, Input, Textarea } from '../../../components/componentsreutilizables';
import type { DaySession } from '../types';

type EditableField = 'series' | 'repeticiones' | 'duration' | 'intensity' | 'peso' | 'tempo' | 'descanso' | 'materialAlternativo';

type InlineBlockEditorProps = {
  session: DaySession;
  onSave: (updatedSession: DaySession) => void;
  onCancel: () => void;
  field: EditableField;
  fullMode?: boolean; // User Story: Modo completo vs rápido
};

export function InlineBlockEditor({ session, onSave, onCancel, field, fullMode = false }: InlineBlockEditorProps) {
  // User Story: Modo completo - estado para todos los campos
  const [values, setValues] = useState({
    series: session.series?.toString() || '',
    repeticiones: session.repeticiones || '',
    duration: session.duration || '',
    intensity: session.intensity || '',
    peso: session.peso?.toString() || '',
    tempo: session.tempo || '',
    descanso: session.descanso?.toString() || '',
    materialAlternativo: session.materialAlternativo || '',
  });

  const [value, setValue] = useState<string>(() => {
    switch (field) {
      case 'series':
        return session.series?.toString() || '';
      case 'repeticiones':
        return session.repeticiones || '';
      case 'duration':
        return session.duration || '';
      case 'intensity':
        return session.intensity || '';
      case 'peso':
        return session.peso?.toString() || '';
      case 'tempo':
        return session.tempo || '';
      case 'descanso':
        return session.descanso?.toString() || '';
      case 'materialAlternativo':
        return session.materialAlternativo || '';
      default:
        return '';
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSave = () => {
    const updatedSession: DaySession = { ...session };
    
    if (fullMode) {
      // Modo completo: guardar todos los campos
      const seriesNum = parseInt(values.series);
      if (!isNaN(seriesNum) && seriesNum > 0) {
        updatedSession.series = seriesNum;
      }
      updatedSession.repeticiones = values.repeticiones;
      updatedSession.duration = values.duration;
      updatedSession.intensity = values.intensity;
      
      const pesoNum = parseFloat(values.peso);
      if (!isNaN(pesoNum) && pesoNum > 0) {
        updatedSession.peso = pesoNum;
      }
      updatedSession.tempo = values.tempo;
      const descansoNum = parseInt(values.descanso);
      if (!isNaN(descansoNum) && descansoNum > 0) {
        updatedSession.descanso = descansoNum;
      }
      updatedSession.materialAlternativo = values.materialAlternativo;
    } else {
      // Modo rápido: guardar solo el campo actual
      switch (field) {
        case 'series':
          const seriesNum = parseInt(value);
          if (!isNaN(seriesNum) && seriesNum > 0) {
            updatedSession.series = seriesNum;
          }
          break;
        case 'repeticiones':
          updatedSession.repeticiones = value;
          break;
        case 'duration':
          updatedSession.duration = value;
          break;
        case 'intensity':
          updatedSession.intensity = value;
          break;
        case 'peso':
          const pesoNum = parseFloat(value);
          if (!isNaN(pesoNum) && pesoNum > 0) {
            updatedSession.peso = pesoNum;
          }
          break;
        case 'tempo':
          updatedSession.tempo = value;
          break;
        case 'descanso':
          const descansoNum = parseInt(value);
          if (!isNaN(descansoNum) && descansoNum > 0) {
            updatedSession.descanso = descansoNum;
          }
          break;
        case 'materialAlternativo':
          updatedSession.materialAlternativo = value;
          break;
      }
    }
    
    onSave(updatedSession);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  const getPlaceholder = () => {
    switch (field) {
      case 'series':
        return 'Ej: 3';
      case 'repeticiones':
        return 'Ej: 10-12';
      case 'duration':
        return 'Ej: 30 min';
      case 'intensity':
        return 'Ej: RPE 7';
      case 'peso':
        return 'Ej: 20.5';
      case 'tempo':
        return 'Ej: 3-1-1';
      case 'descanso':
        return 'Ej: 90';
      case 'materialAlternativo':
        return 'Ej: Mancuernas, Bandas';
      default:
        return '';
    }
  };

  const getLabel = () => {
    switch (field) {
      case 'series':
        return 'Series';
      case 'repeticiones':
        return 'Repeticiones';
      case 'duration':
        return 'Duración';
      case 'intensity':
        return 'Intensidad';
      case 'peso':
        return 'Peso (kg)';
      case 'tempo':
        return 'Tempo';
      case 'descanso':
        return 'Descanso (s)';
      case 'materialAlternativo':
        return 'Material alternativo';
      default:
        return '';
    }
  };

  // User Story: Modo completo - renderizar todos los campos
  if (fullMode) {
    return (
      <div className="absolute z-50 rounded-lg border-2 border-indigo-500 bg-white p-4 shadow-xl">
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-slate-800">Edición completa</h4>
          <p className="text-xs text-slate-500">Configuración avanzada del ejercicio</p>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Series</label>
              <Input
                value={values.series}
                onChange={(e) => setValues({ ...values, series: e.target.value })}
                placeholder="Ej: 3"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Repeticiones</label>
              <Input
                value={values.repeticiones}
                onChange={(e) => setValues({ ...values, repeticiones: e.target.value })}
                placeholder="Ej: 10-12"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Peso (kg)</label>
              <Input
                value={values.peso}
                onChange={(e) => setValues({ ...values, peso: e.target.value })}
                placeholder="Ej: 20.5"
                className="h-8 text-sm"
                type="number"
                step="0.5"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Tempo</label>
              <Input
                value={values.tempo}
                onChange={(e) => setValues({ ...values, tempo: e.target.value })}
                placeholder="Ej: 3-1-1"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Descanso (s)</label>
              <Input
                value={values.descanso}
                onChange={(e) => setValues({ ...values, descanso: e.target.value })}
                placeholder="Ej: 90"
                className="h-8 text-sm"
                type="number"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Duración</label>
              <Input
                value={values.duration}
                onChange={(e) => setValues({ ...values, duration: e.target.value })}
                placeholder="Ej: 30 min"
                className="h-8 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Intensidad</label>
            <Input
              value={values.intensity}
              onChange={(e) => setValues({ ...values, intensity: e.target.value })}
              placeholder="Ej: RPE 7"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Material alternativo</label>
            <Textarea
              value={values.materialAlternativo}
              onChange={(e) => setValues({ ...values, materialAlternativo: e.target.value })}
              placeholder="Ej: Mancuernas, Bandas, Peso corporal"
              className="min-h-[60px] text-sm"
              rows={2}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-red-600 hover:bg-red-50"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Check className="mr-1 h-4 w-4" />
            Guardar
          </Button>
        </div>
      </div>
    );
  }

  // Modo rápido: solo un campo
  return (
    <div className="absolute z-50 rounded-lg border-2 border-indigo-500 bg-white p-2 shadow-xl">
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-slate-600">{getLabel()}:</label>
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          className="h-8 w-32 text-sm"
          type={field === 'peso' || field === 'descanso' || field === 'series' ? 'number' : 'text'}
          step={field === 'peso' ? '0.5' : undefined}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

