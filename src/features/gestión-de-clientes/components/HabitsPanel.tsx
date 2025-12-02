import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import {
  getHabitPanel,
  completeHabit,
  createHabit,
} from '../api/habits';
import {
  HabitPanelData,
  Habit,
  HabitCompletion,
} from '../types/habits';
import {
  Trophy,
  Award,
  Star,
  Flame,
  Target,
  Calendar,
  TrendingUp,
  Zap,
  Crown,
  Medal,
  Sparkles,
  CheckCircle,
  XCircle,
  Plus,
  Loader2,
  Clock,
  BarChart3,
} from 'lucide-react';

interface HabitsPanelProps {
  clienteId: string;
}

// Mapeo de iconos para badges
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Sparkles,
  Calendar,
  Flame,
  Trophy,
  Award,
  Star,
  Medal,
  Crown,
  Zap,
};

// Mapeo de colores para badges
const badgeColorMap: Record<string, string> = {
  blue: 'blue',
  green: 'green',
  orange: 'orange',
  purple: 'purple',
  gold: 'yellow',
  yellow: 'yellow',
};

// Mapeo de rareza a colores
const rarityColorMap: Record<string, string> = {
  comun: 'blue',
  raro: 'purple',
  epico: 'orange',
  legendario: 'yellow',
};

export const HabitsPanel: React.FC<HabitsPanelProps> = ({ clienteId }) => {
  const [data, setData] = useState<HabitPanelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  useEffect(() => {
    loadData();
  }, [clienteId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const panelData = await getHabitPanel(clienteId);
      setData(panelData);
    } catch (error) {
      console.error('Error cargando panel de hábitos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteHabit = async (habitId: string, completado: boolean) => {
    try {
      await completeHabit(clienteId, habitId, completado);
      await loadData(); // Recargar datos
    } catch (error) {
      console.error('Error completando hábito:', error);
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando panel de hábitos...</p>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <p className="text-gray-600">No se pudo cargar el panel de hábitos</p>
      </Card>
    );
  }

  const { habitPoints, badges, habitos, estadisticas, streaks } = data;

  return (
    <div className="space-y-6">
      {/* Header con puntos y nivel */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Panel de Hábitos</h3>
            <p className="text-gray-600">Motiva a tus clientes con puntos y badges</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <span className="text-4xl font-bold text-gray-900">{habitPoints.puntosTotales}</span>
            </div>
            <p className="text-sm text-gray-600">Puntos Totales</p>
          </div>
        </div>

        {/* Barra de progreso de nivel */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Nivel {habitPoints.nivel}
            </span>
            <span className="text-sm text-gray-600">
              {habitPoints.proximoNivel - habitPoints.puntosTotales} puntos para el siguiente nivel
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(habitPoints.progresoNivel, 100)}%` }}
            />
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                {estadisticas.sesionesEstaSemana}/{estadisticas.sesionesObjetivoSemana}
              </span>
            </div>
            <p className="text-xs text-gray-600">Sesiones esta semana</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Flame className="w-5 h-5 text-orange-600" />
              <span className="text-2xl font-bold text-gray-900">{estadisticas.diasConsecutivos}</span>
            </div>
            <p className="text-xs text-gray-600">Días consecutivos</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">{estadisticas.mejorRacha}</span>
            </div>
            <p className="text-xs text-gray-600">Mejor racha</p>
          </div>
        </div>
      </Card>

      {/* Badges obtenidos */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Badges Obtenidos
          </h4>
          <Badge variant="blue" size="sm">
            {badges.length} badges
          </Badge>
        </div>
        {badges.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Aún no hay badges obtenidos</p>
            <p className="text-xs text-gray-500 mt-1">Completa hábitos para ganar badges</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((clientBadge) => {
              const IconComponent = iconMap[clientBadge.badge.icono] || Trophy;
              const colorVariant = badgeColorMap[clientBadge.badge.color] || 'blue';
              
              // Mapeo de rareza a clases de color de Tailwind
              const rarityClasses: Record<string, { bg: string; text: string }> = {
                comun: { bg: 'bg-blue-100', text: 'text-blue-600' },
                raro: { bg: 'bg-purple-100', text: 'text-purple-600' },
                epico: { bg: 'bg-orange-100', text: 'text-orange-600' },
                legendario: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
              };
              
              const rarityClass = rarityClasses[clientBadge.badge.rareza] || rarityClasses.comun;

              return (
                <div
                  key={clientBadge.id}
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className={`p-3 rounded-full ${rarityClass.bg} mb-2`}>
                    <IconComponent className={`w-8 h-8 ${rarityClass.text}`} />
                  </div>
                  <h5 className="text-sm font-semibold text-gray-900 text-center mb-1">
                    {clientBadge.badge.nombre}
                  </h5>
                  <p className="text-xs text-gray-600 text-center mb-2">
                    {clientBadge.badge.descripcion}
                  </p>
                  <Badge variant={colorVariant as any} size="sm">
                    {clientBadge.badge.rareza}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(clientBadge.fechaObtenido).toLocaleDateString('es-ES', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Hábitos activos */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Hábitos Activos
          </h4>
          <Button size="sm" variant="secondary" leftIcon={<Plus size={16} />}>
            Nuevo Hábito
          </Button>
        </div>
        {habitos.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">No hay hábitos activos</p>
            <Button size="sm" variant="primary" className="mt-4" leftIcon={<Plus size={16} />}>
              Crear Primer Hábito
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {habitos.map((habito) => {
              const completions = data.completions.filter(c => c.habitId === habito.id);
              const completadasEstaSemana = completions.filter(c => {
                const fecha = new Date(c.fecha);
                const inicioSemana = new Date();
                inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
                return fecha >= inicioSemana && c.completado;
              }).length;

              const progreso = (completadasEstaSemana / habito.objetivo) * 100;

              return (
                <Card key={habito.id} variant="hover" className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h5 className="text-base font-semibold text-gray-900">{habito.nombre}</h5>
                        <Badge variant="green" size="sm">
                          Activo
                        </Badge>
                      </div>
                      {habito.descripcion && (
                        <p className="text-sm text-gray-600 mb-3">{habito.descripcion}</p>
                      )}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Objetivo: {habito.objetivo} {habito.unidad}/semana
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-gray-900">
                            {completadasEstaSemana}/{habito.objetivo} completadas
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(progreso, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleCompleteHabit(habito.id, true)}
                        leftIcon={<CheckCircle size={16} />}
                      >
                        Completar
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>

      {/* Racha actual */}
      {streaks.length > 0 && (
        <Card className="p-6 bg-white shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-orange-600" />
            Racha de Constancia
          </h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-orange-600 mb-1">
                {streaks[0].rachaActual} días
              </p>
              <p className="text-sm text-gray-600">Racha actual</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold text-gray-900 mb-1">
                {streaks[0].rachaMaxima} días
              </p>
              <p className="text-sm text-gray-600">Mejor racha</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-orange-50 rounded-lg">
            <p className="text-xs text-orange-800">
              <Flame className="w-4 h-4 inline mr-1" />
              ¡Sigue así! Mantén tu racha completando tus hábitos diarios
            </p>
          </div>
        </Card>
      )}

      {/* Historial de puntos reciente */}
      <Card className="p-6 bg-white shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Historial de Puntos
        </h4>
        {habitPoints.historial.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-4">
            No hay historial de puntos aún
          </p>
        ) : (
          <div className="space-y-2">
            {habitPoints.historial.slice(0, 5).map((entry, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{entry.motivo}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(entry.fecha).toLocaleDateString('es-ES', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-bold text-blue-600">+{entry.puntos}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

