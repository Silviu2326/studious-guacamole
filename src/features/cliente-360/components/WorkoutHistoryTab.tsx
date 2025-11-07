import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { WorkoutHistory, ExerciseRecord } from '../types';
import { getWorkoutHistory } from '../api/client360';
import { Loader2, Dumbbell, Calendar, Clock, TrendingUp } from 'lucide-react';

interface WorkoutHistoryTabProps {
  clientId: string;
}

export const WorkoutHistoryTab: React.FC<WorkoutHistoryTabProps> = ({ clientId }) => {
  const [workouts, setWorkouts] = useState<WorkoutHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, [clientId]);

  const loadWorkouts = async () => {
    setLoading(true);
    try {
      const data = await getWorkoutHistory(clientId);
      setWorkouts(data);
    } catch (error) {
      console.error('Error cargando historial de entrenamientos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando historial de entrenamientos...</p>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="p-8 text-center">
        <Dumbbell size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay entrenamientos registrados</h3>
        <p className="text-gray-600">Aún no se han registrado entrenamientos para este cliente</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {workouts.map((workout) => (
        <Card key={workout.id} className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Dumbbell size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Calendar size={14} />
                  <span>{formatDate(workout.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Clock size={14} />
                  <span>{workout.duration} minutos</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-3">
            {workout.exercises.map((exercise, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{exercise.exerciseName}</span>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span>{exercise.sets} series</span>
                  <span>•</span>
                  <span>{exercise.reps} rep</span>
                  {exercise.weight && (
                    <>
                      <span>•</span>
                      <span>{exercise.weight} kg</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {workout.notes && (
            <div className="pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-600 italic">{workout.notes}</p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

