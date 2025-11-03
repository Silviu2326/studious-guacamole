import React, { useState, useEffect } from 'react';
import { SocialPost, ViewMode, getSocialPosts } from '../api/social';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { PostCard } from './PostCard';

interface SocialPlannerCalendarProps {
  currentDate: Date;
  onPostSelect: (postId: string | null) => void;
}

export const SocialPlannerCalendar: React.FC<SocialPlannerCalendarProps> = ({
  currentDate: initialDate,
  onPostSelect
}) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<SocialPost[]>([]);

  useEffect(() => {
    loadPosts();
  }, [currentDate, viewMode]);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const startDate = new Date(currentDate);
      const endDate = new Date(currentDate);

      if (viewMode === 'week') {
        // Ajustar al inicio de la semana
        const dayOfWeek = startDate.getDay();
        const diff = startDate.getDate() - dayOfWeek;
        startDate.setDate(diff);
        endDate.setDate(diff + 6);
        endDate.setHours(23, 59, 59);
      } else {
        // Mes
        startDate.setDate(1);
        const lastDay = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
        endDate.setDate(lastDay);
        endDate.setHours(23, 59, 59);
      }

      const data = await getSocialPosts(startDate.toISOString(), endDate.toISOString());
      setPosts(data);
    } catch (err) {
      console.error('Error loading posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getWeekDates = () => {
    const dates = [];
    const startDate = new Date(currentDate);
    const dayOfWeek = startDate.getDay();
    const diff = startDate.getDate() - dayOfWeek;
    startDate.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getPostsForDate = (date: Date): SocialPost[] => {
    return posts.filter(post => {
      if (!post.scheduledAt) return false;
      const postDate = new Date(post.scheduledAt);
      return postDate.toDateString() === date.toDateString();
    });
  };

  if (viewMode === 'week') {
    const weekDates = getWeekDates();
    const weekStart = weekDates[0];
    const weekEnd = weekDates[6];

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-gray-900">
              {weekStart.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
              {' - '}
              {weekEnd.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </h3>
            <button
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded transition ${
                viewMode === 'week'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded transition ${
                viewMode === 'month'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Mes
            </button>
          </div>
        </div>

        {/* Week View */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-4">
            {weekDates.map((date, idx) => {
              const dayPosts = getPostsForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <div
                  key={idx}
                  className={`border rounded-lg p-3 min-h-[300px] ${
                    isToday
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {/* Day Header */}
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-600">
                      {date.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase()}
                    </p>
                    <p className={`text-2xl font-bold ${isToday ? 'text-purple-600' : 'text-gray-900'}`}>
                      {date.getDate()}
                    </p>
                  </div>

                  {/* Posts */}
                  <div className="space-y-2">
                    {dayPosts.length > 0 ? (
                      dayPosts.map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          onClick={() => onPostSelect(post.id)}
                        />
                      ))
                    ) : (
                      <div
                        onClick={() => onPostSelect(null)}
                        className="text-center py-8 border-2 border-dashed border-gray-300 rounded hover:border-purple-500 hover:bg-purple-50 transition cursor-pointer"
                      >
                        <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-600">Click para agregar</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Month view (simplified)
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">
          {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1 rounded transition ${
              viewMode === 'week'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1 rounded transition ${
              viewMode === 'month'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Mes
          </button>
        </div>
      </div>
      <div className="text-center py-12 text-gray-600">
        Vista mensual en construcción
      </div>
    </div>
  );
};

