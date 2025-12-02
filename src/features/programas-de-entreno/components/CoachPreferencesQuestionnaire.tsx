import { useState } from 'react';
import { CheckCircle2, FileSpreadsheet, BarChart3, Settings, Save } from 'lucide-react';
import { Button, Card, Modal, Select, Badge } from '../../../components/componentsreutilizables';
import type { MetricasClave, FrecuenciaRevision, NivelDetalle } from '../types';
import { guardarPreferenciasCoach, getDefaultMetricas } from '../api/coach-preferences';
import { useAuth } from '../../../context/AuthContext';

type CoachPreferencesQuestionnaireProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
};

export function CoachPreferencesQuestionnaire({
  isOpen,
  onClose,
  onSave,
}: CoachPreferencesQuestionnaireProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [metricasClave, setMetricasClave] = useState<MetricasClave>(getDefaultMetricas());
  const [frecuenciaRevision, setFrecuenciaRevision] = useState<FrecuenciaRevision>('semanal');
  const [nivelDetalle, setNivelDetalle] = useState<NivelDetalle>('intermedio');

  const metricasOptions = [
    { key: 'volumen' as const, label: 'Volumen', description: 'Total de series y ejercicios' },
    { key: 'intensidad' as const, label: 'Intensidad', description: 'RPE, porcentaje de 1RM' },
    { key: 'duracion' as const, label: 'Duración', description: 'Tiempo total de entrenamiento' },
    { key: 'calorias' as const, label: 'Calorías', description: 'Estimación de gasto calórico' },
    { key: 'series' as const, label: 'Series', description: 'Número de series por ejercicio' },
    { key: 'repeticiones' as const, label: 'Repeticiones', description: 'Repeticiones por serie' },
    { key: 'peso' as const, label: 'Peso', description: 'Carga utilizada' },
    { key: 'rpe' as const, label: 'RPE', description: 'Esfuerzo percibido' },
    { key: 'frecuencia' as const, label: 'Frecuencia', description: 'Sesiones por semana' },
    { key: 'adherencia' as const, label: 'Adherencia', description: 'Cumplimiento del programa' },
    { key: 'progreso' as const, label: 'Progreso', description: 'Evolución de métricas' },
  ];

  const frecuenciaOptions: { value: FrecuenciaRevision; label: string; description: string }[] = [
    { value: 'diaria', label: 'Diaria', description: 'Reviso los programas cada día' },
    { value: 'semanal', label: 'Semanal', description: 'Reviso los programas una vez por semana' },
    { value: 'mensual', label: 'Mensual', description: 'Reviso los programas mensualmente' },
    { value: 'por-programa', label: 'Por programa', description: 'Reviso cuando creo o modifico un programa' },
  ];

  const nivelDetalleOptions: { value: NivelDetalle; label: string; description: string }[] = [
    { value: 'basico', label: 'Básico', description: 'Solo información esencial: día, sesión, ejercicios' },
    { value: 'intermedio', label: 'Intermedio', description: 'Incluye volumen, intensidad y duración' },
    { value: 'avanzado', label: 'Avanzado', description: 'Añade series, repeticiones y peso' },
    { value: 'completo', label: 'Completo', description: 'Todas las métricas disponibles' },
  ];

  const toggleMetrica = (key: keyof MetricasClave) => {
    setMetricasClave(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      await guardarPreferenciasCoach(user.id, {
        metricasClave,
        frecuenciaRevision,
        nivelDetalle,
        columnasPersonalizadas: [],
        ordenColumnas: [],
        mostrarGraficos: true,
        mostrarTotales: true,
        mostrarPromedios: true,
        formatoNumerico: 'decimal',
      });
      onSave();
      onClose();
    } catch (error) {
      console.error('Error al guardar preferencias:', error);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSave();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configuración de Vista Excel"
      size="lg"
    >
      <div className="space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  step >= s
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    step > s ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Métricas clave */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Métricas Clave
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Selecciona las métricas que más utilizas para revisar y analizar los programas de entrenamiento.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {metricasOptions.map((metrica) => (
                <Card
                  key={metrica.key}
                  className={`cursor-pointer transition ${
                    metricasClave[metrica.key]
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => toggleMetrica(metrica.key)}
                >
                  <div className="flex items-start gap-3 p-3">
                    <input
                      type="checkbox"
                      checked={metricasClave[metrica.key]}
                      onChange={() => toggleMetrica(metrica.key)}
                      className="mt-1 h-4 w-4 text-indigo-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {metrica.label}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {metrica.description}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Frecuencia de revisión */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Frecuencia de Revisión
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                ¿Con qué frecuencia revisas los programas de entrenamiento?
              </p>
            </div>
            <div className="space-y-3">
              {frecuenciaOptions.map((option) => (
                <Card
                  key={option.value}
                  className={`cursor-pointer transition ${
                    frecuenciaRevision === option.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setFrecuenciaRevision(option.value)}
                >
                  <div className="flex items-start gap-3 p-4">
                    <input
                      type="radio"
                      name="frecuencia"
                      checked={frecuenciaRevision === option.value}
                      onChange={() => setFrecuenciaRevision(option.value)}
                      className="mt-1 h-4 w-4 text-indigo-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {option.label}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Nivel de detalle */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Nivel de Detalle
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                ¿Qué nivel de detalle prefieres ver en la vista Excel?
              </p>
            </div>
            <div className="space-y-3">
              {nivelDetalleOptions.map((option) => (
                <Card
                  key={option.value}
                  className={`cursor-pointer transition ${
                    nivelDetalle === option.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setNivelDetalle(option.value)}
                >
                  <div className="flex items-start gap-3 p-4">
                    <input
                      type="radio"
                      name="nivelDetalle"
                      checked={nivelDetalle === option.value}
                      onChange={() => setNivelDetalle(option.value)}
                      className="mt-1 h-4 w-4 text-indigo-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {option.label}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <Button
            variant="ghost"
            onClick={step === 1 ? onClose : handleBack}
          >
            {step === 1 ? 'Cancelar' : 'Atrás'}
          </Button>
          <Button
            variant="primary"
            onClick={handleNext}
            leftIcon={step === 3 ? <Save className="h-4 w-4" /> : undefined}
          >
            {step === 3 ? 'Guardar y Configurar' : 'Siguiente'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

