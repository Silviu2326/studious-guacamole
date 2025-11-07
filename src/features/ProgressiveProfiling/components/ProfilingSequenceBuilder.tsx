import React, { useState, useEffect } from 'react';
import {
  ProfilingSequence,
  Question,
  QuestionType,
  QuestionOption,
  createProfilingSequence,
  updateProfilingSequence,
  getQuestionTypeLabel
} from '../api/profiling';
import { Plus, Trash2, GripVertical, Save, X, Eye, Loader2 } from 'lucide-react';
import { Card, Button, Input } from '../../../components/componentsreutilizables';

interface ProfilingSequenceBuilderProps {
  sequenceId: string | null;
  onSave: (sequence: ProfilingSequence) => void;
  onCancel?: () => void;
}

export const ProfilingSequenceBuilder: React.FC<ProfilingSequenceBuilderProps> = ({
  sequenceId,
  onSave,
  onCancel
}) => {
  const [sequenceName, setSequenceName] = useState('');
  const [questionsList, setQuestionsList] = useState<Question[]>([]);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sequenceId) {
      loadSequence();
    }
  }, [sequenceId]);

  const loadSequence = async () => {
    // En producción, cargar desde API
    setIsLoading(true);
    try {
      // Mock loading
      await new Promise(resolve => setTimeout(resolve, 300));
      setSequenceName('Embudo de Consulta Gratuita');
      setQuestionsList([
        {
          id: 'q_001',
          text: '¿Cuál es tu objetivo principal?',
          type: 'single_choice',
          options: [
            { value: 'lose_weight', label: 'Perder peso' },
            { value: 'gain_muscle', label: 'Ganar músculo' }
          ],
          isRequired: true,
          order: 1
        }
      ]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      text: '',
      type: 'single_choice',
      options: [],
      isRequired: false,
      order: questionsList.length + 1
    };
    setQuestionsList(prev => [...prev, newQuestion]);
    setActiveQuestionId(newQuestion.id);
  };

  const handleRemoveQuestion = (questionId: string) => {
    setQuestionsList(prev => prev.filter(q => q.id !== questionId));
    if (activeQuestionId === questionId) {
      setActiveQuestionId(null);
    }
  };

  const handleUpdateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuestionsList(prev =>
      prev.map(q =>
        q.id === questionId
          ? { ...q, ...updates }
          : q
      )
    );
  };

  const handleSave = async () => {
    if (!sequenceName.trim()) {
      alert('El nombre de la secuencia es obligatorio');
      return;
    }

    setIsLoading(true);
    try {
      const sequence: ProfilingSequence = {
        id: sequenceId || '',
        name: sequenceName,
        status: 'draft',
        questions: questionsList,
        questionCount: questionsList.length
      };

      await onSave(sequence);
    } catch (err: any) {
      alert('Error al guardar: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const activeQuestion = questionsList.find(q => q.id === activeQuestionId);

  if (isLoading && !sequenceName) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              value={sequenceName}
              onChange={(e) => setSequenceName(e.target.value)}
              placeholder="Nombre de la secuencia"
              className="text-2xl font-bold"
            />
          </div>
          <div className="flex gap-2">
            {onCancel && (
              <Button
                variant="secondary"
                onClick={onCancel}
                leftIcon={<X size={16} />}
              >
                Cancelar
              </Button>
            )}
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isLoading}
              loading={isLoading}
              leftIcon={<Save size={16} />}
            >
              Guardar
            </Button>
          </div>
        </div>
      </Card>

      {/* Questions List */}
      <Card className="p-4 bg-white shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Preguntas</h3>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddQuestion}
              leftIcon={<Plus size={16} />}
            >
              Añadir Pregunta
            </Button>
          </div>

          {questionsList.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <Eye size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No hay preguntas. Crea tu primera pregunta.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {questionsList.map((question, idx) => (
                <Card
                  key={question.id}
                  variant="hover"
                  className="p-4"
                >
                <div className="flex items-start gap-3">
                  <button className="mt-2 cursor-move">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-gray-600">
                        {getQuestionTypeLabel(question.type)}
                      </span>
                    </div>

                    {activeQuestionId === question.id ? (
                      <QuestionEditor
                        question={question}
                        onChange={(updates) => handleUpdateQuestion(question.id, updates)}
                        onClose={() => setActiveQuestionId(null)}
                      />
                    ) : (
                      <div>
                        <p
                          onClick={() => setActiveQuestionId(question.id)}
                          className="font-medium text-gray-900 cursor-pointer"
                        >
                          {question.text || 'Pregunta sin título'}
                        </p>
                        {question.options && question.options.length > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            {question.options.length} opciones
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveQuestion(question.id)}
                    leftIcon={<Trash2 size={16} />}
                  />
                </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

// QuestionEditor simplificado integrado
const QuestionEditor: React.FC<{
  question: Question;
  onChange: (updates: Partial<Question>) => void;
  onClose: () => void;
}> = ({ question, onChange }) => {
  const [text, setText] = useState(question.text);
  const [type, setType] = useState(question.type);
  const [options, setOptions] = useState(question.options || []);

  useEffect(() => {
    setText(question.text);
    setType(question.type);
    setOptions(question.options || []);
  }, [question.id]);

  const handleSave = () => {
    onChange({
      text,
      type,
      options: type === 'text' || type === 'number' ? undefined : options
    });
  };

  const handleAddOption = () => {
    setOptions(prev => [...prev, { value: '', label: '' }]);
  };

  const handleUpdateOption = (index: number, updates: Partial<QuestionOption>) => {
    setOptions(prev =>
      prev.map((opt, i) => i === index ? { ...opt, ...updates } : opt)
    );
  };

  const handleRemoveOption = (index: number) => {
    setOptions(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div>
        <Input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tu pregunta aquí..."
        />
      </div>

      <div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as QuestionType)}
          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
        >
          <option value="single_choice">Opción Única</option>
          <option value="multiple_choice">Múltiple Opción</option>
          <option value="text">Texto Libre</option>
          <option value="number">Número</option>
          <option value="scale">Escala</option>
        </select>
      </div>

      {(type === 'single_choice' || type === 'multiple_choice') && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700 mb-2">Opciones</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddOption}
              leftIcon={<Plus size={16} />}
            >
              Añadir opción
            </Button>
          </div>

          {options.map((option, idx) => (
            <div key={idx} className="flex gap-2">
              <Input
                type="text"
                value={option.label}
                onChange={(e) => handleUpdateOption(idx, { label: e.target.value })}
                placeholder="Opción..."
                className="flex-1"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveOption(idx)}
                leftIcon={<X size={16} />}
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={handleSave}
        >
          Guardar Pregunta
        </Button>
      </div>
    </div>
  );
};

