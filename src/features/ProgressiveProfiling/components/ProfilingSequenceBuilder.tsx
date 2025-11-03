import React, { useState, useEffect } from 'react';
import {
  ProfilingSequence,
  Question,
  QuestionType,
  createProfilingSequence,
  updateProfilingSequence,
  getQuestionTypeLabel
} from '../api/profiling';
import { Plus, Trash2, GripVertical, Save, X, Eye } from 'lucide-react';

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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            value={sequenceName}
            onChange={(e) => setSequenceName(e.target.value)}
            placeholder="Nombre de la secuencia"
            className="w-full text-2xl font-bold border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2"
          />
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <X className="w-4 h-4 inline mr-2" />
              Cancelar
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4 inline mr-2" />
            Guardar
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Preguntas</h3>
          <button
            onClick={handleAddQuestion}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <Plus className="w-4 h-4" />
            Añadir Pregunta
          </button>
        </div>

        {questionsList.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No hay preguntas. Crea tu primera pregunta.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {questionsList.map((question, idx) => (
              <div
                key={question.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-purple-500 transition"
              >
                <div className="flex items-start gap-3">
                  <button className="mt-2 cursor-move">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
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

                  <button
                    onClick={() => handleRemoveQuestion(question.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tu pregunta aquí..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as QuestionType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
            <label className="text-sm font-medium text-gray-700">Opciones</label>
            <button
              onClick={handleAddOption}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              + Añadir opción
            </button>
          </div>

          {options.map((option, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={option.label}
                onChange={(e) => handleUpdateOption(idx, { label: e.target.value })}
                placeholder="Opción..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={() => handleRemoveOption(idx)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Guardar Pregunta
        </button>
      </div>
    </div>
  );
};

