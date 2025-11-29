import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Bot, 
  User, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Loader2, 
  Calendar, 
  Target, 
  AlertTriangle,
  Dumbbell,
  Clock,
  Sparkles
} from 'lucide-react';
import { useProgramContext } from '../../context/ProgramContext';
import { useUIContext } from '../../context/UIContext';

type Step = 'objective' | 'structure' | 'constraints' | 'generating' | 'summary';

const GOALS = [
  { id: 'fat_loss', label: 'Pérdida de Grasa', icon: '🔥', desc: 'Maximizar quema calórica manteniendo masa muscular' },
  { id: 'hypertrophy', label: 'Hipertrofia', icon: '💪', desc: 'Maximizar ganancia de masa muscular' },
  { id: 'strength', label: 'Fuerza', icon: '🏋️', desc: 'Aumentar fuerza máxima en levantamientos principales' },
  { id: 'endurance', label: 'Resistencia', icon: '🏃', desc: 'Mejorar capacidad cardiovascular y resistencia muscular' },
];

const DAYS_OPTIONS = [
  { value: 3, label: '3 días/semana', desc: 'Full Body' },
  { value: 4, label: '4 días/semana', desc: 'Upper/Lower' },
  { value: 5, label: '5 días/semana', desc: 'PPL / Upper / Lower' },
  { value: 6, label: '6 días/semana', desc: 'Push / Pull / Legs x2' },
];

export const AIProgramGenerator: React.FC = () => {
  const { isAIProgramGeneratorOpen, setAIProgramGeneratorOpen } = useUIContext();
  const { saveCurrentVersion } = useProgramContext();
  const [step, setStep] = useState<Step>('objective');
  
  const isOpen = isAIProgramGeneratorOpen;
  const onClose = () => setAIProgramGeneratorOpen(false);
  
  // Form Data
  const [objective, setObjective] = useState<string>('');
  const [days, setDays] = useState<number>(4);
  const [duration, setDuration] = useState<number>(8);
  const [limitations, setLimitations] = useState<string>('');
  
  // Generation State
  const [progress, setProgress] = useState(0);
  const [generationLog, setGenerationLog] = useState<string[]>([]);
  
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('objective');
      setProgress(0);
      setGenerationLog([]);
      setObjective('');
      setLimitations('');
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        // Don't close if generating
        if (step !== 'generating') {
          onClose();
        }
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, step]);

  const handleGenerate = () => {
    setStep('generating');
    const steps = [
      { pct: 10, msg: 'Analizando perfil del cliente...' },
      { pct: 30, msg: 'Estructurando mesociclos...' },
      { pct: 50, msg: 'Seleccionando ejercicios óptimos...' },
      { pct: 70, msg: 'Aplicando restricciones y adaptaciones...' },
      { pct: 85, msg: 'Balanceando volumen e intensidad...' },
      { pct: 100, msg: 'Finalizando programa...' },
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep >= steps.length) {
        clearInterval(interval);
        setTimeout(() => setStep('summary'), 500);
        return;
      }

      const { pct, msg } = steps[currentStep];
      setProgress(pct);
      setGenerationLog(prev => [...prev, msg]);
      currentStep++;
    }, 800);
  };

  const handleApply = () => {
    // Mock applying the program
    saveCurrentVersion('Generado con IA');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-indigo-50/50">
          <div className="flex items-center gap-2 text-indigo-700">
            <Bot className="w-6 h-6" />
            <h2 className="font-bold text-lg">FitCoach IA</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            disabled={step === 'generating'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'objective' && (
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="bg-indigo-50 p-4 rounded-2xl rounded-tl-none text-gray-800 max-w-[90%]">
                  <p className="font-medium">¡Hola! Voy a ayudarte a crear un programa personalizado.</p>
                  <p className="mt-2">Para empezar, ¿cuál es el <strong>objetivo principal</strong> de este programa?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-14">
                {GOALS.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setObjective(goal.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      objective === goal.id 
                        ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{goal.icon}</div>
                    <div className="font-bold text-gray-900">{goal.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{goal.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'structure' && (
            <div className="space-y-6">
              <div className="flex gap-4 justify-end">
                <div className="bg-gray-100 p-4 rounded-2xl rounded-tr-none text-gray-800 max-w-[90%]">
                  <p>El objetivo es: <strong>{GOALS.find(g => g.id === objective)?.label}</strong></p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="bg-indigo-50 p-4 rounded-2xl rounded-tl-none text-gray-800 max-w-[90%]">
                  <p>Perfecto. Para ese objetivo, recomiendo una frecuencia de 4-5 días.</p>
                  <p className="mt-2">¿Cuántos <strong>días a la semana</strong> puede entrenar el cliente y cuánto debe durar el programa?</p>
                </div>
              </div>

              <div className="pl-14 space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Días por semana</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {DAYS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setDays(opt.value)}
                        className={`p-3 rounded-lg border text-sm transition-all ${
                          days === opt.value
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <div className="font-bold">{opt.label}</div>
                        <div className="text-xs opacity-70">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Duración del programa (semanas)</label>
                  <input 
                    type="range" 
                    min="4" 
                    max="16" 
                    step="4"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 font-medium">
                    <span>4 semanas</span>
                    <span>8 semanas</span>
                    <span>12 semanas</span>
                    <span>16 semanas</span>
                  </div>
                  <div className="text-center font-bold text-indigo-600">{duration} semanas</div>
                </div>
              </div>
            </div>
          )}

          {step === 'constraints' && (
            <div className="space-y-6">
              <div className="flex gap-4 justify-end">
                <div className="bg-gray-100 p-4 rounded-2xl rounded-tr-none text-gray-800 max-w-[90%]">
                  <p>{days} días/semana por {duration} semanas.</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="bg-indigo-50 p-4 rounded-2xl rounded-tl-none text-gray-800 max-w-[90%]">
                  <p>Entendido. Por último, ¿hay alguna <strong>lesión, limitación o preferencia</strong> que deba tener en cuenta?</p>
                  <p className="text-sm text-gray-500 mt-2 italic">Ej: "Molestia en hombro derecho, evitar press militar" o "Prefiere máquinas para pierna".</p>
                </div>
              </div>

              <div className="pl-14">
                <textarea 
                  value={limitations}
                  onChange={(e) => setLimitations(e.target.value)}
                  placeholder="Escribe aquí las limitaciones (opcional)..."
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] resize-none"
                />
              </div>
            </div>
          )}

          {step === 'generating' && (
            <div className="flex flex-col items-center justify-center h-full space-y-8 py-8">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                <div 
                  className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Bot className="w-10 h-10 text-indigo-600" />
                </div>
              </div>
              
              <div className="w-full max-w-md space-y-4">
                <h3 className="text-xl font-bold text-center text-gray-800 animate-pulse">
                  ✨ Generando programa...
                </h3>
                
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs text-gray-600 h-32 overflow-y-auto border border-gray-200 space-y-1">
                  {generationLog.map((log, idx) => (
                    <div key={idx} className="flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in duration-300">
                      <span className="text-green-500">✓</span> {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 'summary' && (
            <div className="space-y-6">
               <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="bg-indigo-50 p-4 rounded-2xl rounded-tl-none text-gray-800 max-w-[90%]">
                  <p className="font-bold text-lg">✅ ¡Programa creado exitosamente!</p>
                  <p className="mt-2">He diseñado un programa de <strong>{duration} semanas</strong> enfocado en <strong>{GOALS.find(g => g.id === objective)?.label}</strong>.</p>
                </div>
              </div>

              <div className="pl-14">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Resumen del Programa</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">IA GENERATED</span>
                  </div>
                  
                  <div className="p-4 grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Estructura</div>
                        <div className="text-sm text-gray-500">{duration} semanas • {days} días/sem</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Objetivo</div>
                        <div className="text-sm text-gray-500">{GOALS.find(g => g.id === objective)?.label}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Dumbbell className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Volumen</div>
                        <div className="text-sm text-gray-500">Progresión lineal (+8%/sem)</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Duración Sesión</div>
                        <div className="text-sm text-gray-500">60-75 minutos</div>
                      </div>
                    </div>
                  </div>

                  {limitations && (
                    <div className="p-4 bg-orange-50 border-t border-orange-100 flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      <div className="text-sm text-orange-800">
                        <strong>Adaptaciones aplicadas:</strong> {limitations}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Action Buttons */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
          {step === 'objective' && (
            <>
               <button 
                onClick={onClose}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => setStep('structure')}
                disabled={!objective}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                  objective 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 'structure' && (
            <>
              <button 
                onClick={() => setStep('objective')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Atrás
              </button>
              <button 
                onClick={() => setStep('constraints')}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 'constraints' && (
            <>
              <button 
                onClick={() => setStep('structure')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Atrás
              </button>
              <button 
                onClick={handleGenerate}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all animate-pulse hover:animate-none"
              >
                <Sparkles className="w-4 h-4" /> Generar Programa
              </button>
            </>
          )}

          {step === 'generating' && (
            <div className="w-full text-center text-sm text-gray-400 italic">
              La IA está trabajando... por favor espera.
            </div>
          )}

          {step === 'summary' && (
            <>
              <button 
                onClick={() => setStep('constraints')}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
              >
                Hacer ajustes
              </button>
              <button 
                onClick={handleApply}
                className="flex items-center gap-2 px-8 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition-all transform hover:scale-105"
              >
                <Check className="w-4 h-4" /> Aplicar Programa
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
