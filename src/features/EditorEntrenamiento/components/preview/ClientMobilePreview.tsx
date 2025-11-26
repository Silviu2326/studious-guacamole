import React, { useState } from 'react';
import { X, Smartphone, ChevronLeft, Play, CheckCircle, Circle, Calendar, Clock, Activity } from 'lucide-react';
import { useProgramContext } from '../../context/ProgramContext';
import { useUIContext } from '../../context/UIContext';
import { Day, Exercise, Set } from '../../types/training';

export const ClientMobilePreview: React.FC = () => {
  const { daysData } = useProgramContext();
  const { isClientPreviewOpen, setClientPreviewOpen } = useUIContext();
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [completedSets, setCompletedSets] = useState<string[]>([]);

  if (!isClientPreviewOpen) return null;

  const toggleSetComplete = (setId: string) => {
    setCompletedSets(prev => 
      prev.includes(setId) ? prev.filter(id => id !== setId) : [...prev, setId]
    );
  };

  const handleClose = () => {
    setClientPreviewOpen(false);
    setSelectedDay(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden">
      <div className="relative w-full max-w-md h-[85vh] bg-white rounded-[30px] shadow-2xl overflow-hidden flex flex-col border-8 border-gray-900">
        
        {/* Fake Status Bar */}
        <div className="h-8 bg-gray-900 flex items-center justify-between px-6 text-white text-xs rounded-t-[22px]">
          <span>9:41</span>
          <div className="flex gap-1">
            <div className="w-4 h-3 bg-white/20 rounded-sm"></div>
            <div className="w-4 h-3 bg-white/20 rounded-sm"></div>
            <div className="w-6 h-3 bg-white rounded-sm"></div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center gap-3 shadow-md z-10">
          {selectedDay ? (
            <button onClick={() => setSelectedDay(null)} className="p-1 hover:bg-blue-700 rounded-full">
              <ChevronLeft size={24} />
            </button>
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <Smartphone size={18} />
            </div>
          )}
          <div>
            <h2 className="font-bold text-lg leading-tight">
              {selectedDay ? selectedDay.name : 'Mi Programa'}
            </h2>
            <p className="text-xs text-blue-100">Vista Previa Cliente</p>
          </div>
          <button 
            onClick={handleClose}
            className="ml-auto p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            title="Cerrar Previsualización"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 custom-scrollbar">
          
          {/* View: Day List */}
          {!selectedDay && (
            <div className="p-4 space-y-3">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 text-lg">Esta Semana</h3>
                <p className="text-sm text-gray-500">7 días • {daysData.filter(d => d.blocks.length > 0).length} entrenamientos</p>
              </div>

              {daysData.map((day) => {
                const hasWorkout = day.blocks.length > 0;
                return (
                  <button 
                    key={day.id}
                    onClick={() => hasWorkout && setSelectedDay(day)}
                    disabled={!hasWorkout}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group
                      ${hasWorkout 
                        ? 'bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 active:scale-[0.98]' 
                        : 'bg-gray-50 border-transparent opacity-60 cursor-not-allowed'
                      }
                    `}
                  >
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{day.name.substring(0, 3)}</span>
                      <h4 className={`font-bold text-lg ${hasWorkout ? 'text-gray-900' : 'text-gray-400'}`}>
                        {hasWorkout ? day.name : 'Descanso'}
                      </h4>
                      {hasWorkout && (
                        <div className="flex gap-2 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Clock size={12} /> {day.totalDuration} min</span>
                          <span className="flex items-center gap-1"><Activity size={12} /> RPE {day.averageRpe}</span>
                        </div>
                      )}
                    </div>
                    
                    {hasWorkout && (
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Play size={14} fill="currentColor" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* View: Workout Detail */}
          {selectedDay && (
            <div className="pb-20">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-2 p-4 bg-white border-b border-gray-100">
                 <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <span className="block text-2xl font-bold text-blue-700">{selectedDay.totalDuration}</span>
                    <span className="text-xs text-blue-600 uppercase font-semibold">Minutos</span>
                 </div>
                 <div className="bg-orange-50 p-3 rounded-lg text-center">
                    <span className="block text-2xl font-bold text-orange-700">{selectedDay.averageRpe}</span>
                    <span className="text-xs text-orange-600 uppercase font-semibold">Intensidad</span>
                 </div>
              </div>

              <div className="p-4 space-y-6">
                {selectedDay.blocks.length === 0 && (
                   <div className="text-center py-10 text-gray-500">No hay ejercicios asignados.</div>
                )}

                {selectedDay.blocks.map((block) => (
                  <div key={block.id} className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {block.name}
                    </h3>
                    
                    <div className="space-y-4">
                      {block.exercises.map((exercise) => (
                        <ExerciseCard 
                          key={exercise.id} 
                          exercise={exercise} 
                          completedSets={completedSets}
                          onToggleSet={toggleSetComplete}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="fixed bottom-8 left-0 right-0 px-8 pointer-events-none flex justify-center">
                 <button 
                  className="pointer-events-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-95 transition-transform flex items-center gap-2"
                  onClick={() => setSelectedDay(null)} // Just goes back for now
                 >
                   <CheckCircle size={20} />
                   Finalizar Entrenamiento
                 </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Fake Home Indicator */}
        <div className="h-5 bg-white flex justify-center items-center rounded-b-[22px]">
           <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
        </div>

      </div>
    </div>
  );
};

const ExerciseCard: React.FC<{
  exercise: Exercise;
  completedSets: string[];
  onToggleSet: (id: string) => void;
}> = ({ exercise, completedSets, onToggleSet }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-50 flex justify-between items-start">
        <div>
          <h4 className="font-bold text-gray-900 text-lg">{exercise.name}</h4>
          <div className="flex gap-2 mt-1">
            {exercise.tags.map(tag => (
              <span key={tag.id} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                {tag.label}
              </span>
            ))}
          </div>
        </div>
        {exercise.videoUrl && (
          <button className="p-2 text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors">
            <Play size={16} fill="currentColor" />
          </button>
        )}
      </div>

      <div className="p-2">
        {/* Header Row */}
        <div className="grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 px-3 py-2 text-xs font-medium text-gray-400 uppercase text-center">
          <span>Set</span>
          <span>Reps</span>
          <span>Kg</span>
          <span></span>
        </div>

        {exercise.sets.map((set, idx) => {
          const isCompleted = completedSets.includes(set.id);
          return (
            <div 
              key={set.id} 
              className={`grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 px-3 py-3 items-center text-center rounded-lg transition-colors mb-1
                ${isCompleted ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-700'}
              `}
            >
              <span className="font-bold text-sm">{idx + 1}</span>
              <span className="font-semibold">{set.reps}</span>
              <span className="text-gray-500 text-sm">-</span>
              <button 
                onClick={() => onToggleSet(set.id)}
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all
                  ${isCompleted 
                    ? 'bg-green-500 text-white shadow-sm' 
                    : 'bg-gray-200 text-white hover:bg-gray-300'
                  }
                `}
              >
                {isCompleted ? <CheckCircle size={16} /> : <Circle size={16} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
