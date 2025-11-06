import React, { useState, useEffect } from 'react';
import { SocialPost, ViewMode, getSocialPosts } from '../api/social';
import { Calendar, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { PostCard } from './PostCard';
import { Card, Button } from '../../../components/componentsreutilizables';

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
      <Card className="bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateDate('prev')}
              leftIcon={<ChevronLeft size={18} />}
            />
            <h3 className="text-lg font-bold text-gray-900">
              {weekStart.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
              {' - '}
              {weekEnd.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateDate('next')}
              leftIcon={<ChevronRight size={18} />}
            />
          </div>

          <div className="flex gap-2 rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'week'
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'month'
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              Mes
            </button>
          </div>
        </div>

        {/* Week View */}
        {isLoading ? (
          <Card className="p-8 text-center bg-white shadow-sm">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando...</p>
          </Card>
        ) : (
          <div className="grid grid-cols-7 gap-4">
            {weekDates.map((date, idx) => {
              const dayPosts = getPostsForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <Card
                  key={idx}
                  className={`p-3 min-h-[300px] ${
                    isToday
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'ring-1 ring-gray-200 bg-white'
                  }`}
                >
                  {/* Day Header */}
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-600">
                      {date.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase()}
                    </p>
                    <p className={`text-2xl font-bold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
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
                        className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer"
                      >
                        <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-600">Click para agregar</p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>
    );
  }

  // Month view (complete implementation)
  const getMonthDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const dates: Date[] = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  };

  const monthDates = getMonthDates();
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  return (
    <Card className="bg-white shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setMonth(newDate.getMonth() - 1);
              setCurrentDate(newDate);
            }}
            leftIcon={<ChevronLeft size={18} />}
          />
          <h3 className="text-lg font-bold text-gray-900">
            {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setMonth(newDate.getMonth() + 1);
              setCurrentDate(newDate);
            }}
            leftIcon={<ChevronRight size={18} />}
          />
        </div>
        <div className="flex gap-2 rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setViewMode('week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'week'
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'month'
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
            }`}
          >
            Mes
          </button>
        </div>
      </div>

      {isLoading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day, idx) => (
              <div key={idx} className="p-2 text-center">
                <p className="text-xs font-semibold text-gray-600">{day}</p>
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {monthDates.map((date, idx) => {
              const dayPosts = getPostsForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              
              return (
                <Card
                  key={idx}
                  className={`p-2 min-h-[100px] transition-all ${
                    isToday
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : isCurrentMonth
                      ? 'ring-1 ring-gray-200 bg-white hover:ring-blue-400'
                      : 'ring-1 ring-gray-100 bg-gray-50 opacity-50'
                  }`}
                  onClick={() => onPostSelect(null)}
                >
                  <div className="mb-2">
                    <p className={`text-sm font-semibold ${
                      isToday ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {date.getDate()}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    {dayPosts.slice(0, 2).map((post) => (
                      <div
                        key={post.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onPostSelect(post.id);
                        }}
                        className="text-xs p-1 bg-blue-100 text-blue-700 rounded cursor-pointer hover:bg-blue-200 transition truncate"
                        title={post.content}
                      >
                        {post.content.substring(0, 20)}...
                      </div>
                    ))}
                    {dayPosts.length > 2 && (
                      <p className="text-xs text-gray-500 text-center">
                        +{dayPosts.length - 2} más
                      </p>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
};

