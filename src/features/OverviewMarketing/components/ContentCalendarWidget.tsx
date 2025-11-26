import React from 'react';
import { Calendar as CalendarIcon, Instagram, Video, Linkedin } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';

export const ContentCalendarWidget: React.FC<{ className?: string }> = ({ className = '' }) => {
  const days = [
    { day: 'L', date: '12', content: 'reel', platform: 'ig' },
    { day: 'M', date: '13', content: null },
    { day: 'M', date: '14', content: 'post', platform: 'li' },
    { day: 'J', date: '15', content: 'video', platform: 'tk' },
    { day: 'V', date: '16', content: null },
  ];

  const getIcon = (type: string | null) => {
    switch (type) {
      case 'reel': return <Instagram className="w-3 h-3 text-pink-600" />;
      case 'post': return <Linkedin className="w-3 h-3 text-blue-600" />;
      case 'video': return <Video className="w-3 h-3 text-black dark:text-white" />;
      default: return null;
    }
  };

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`${ds.typography.h4} ${ds.color.textPrimary}`}>Calendario</h3>
        <CalendarIcon className="w-4 h-4 text-gray-400" />
      </div>

      <div className="flex justify-between items-center">
        {days.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-400">{d.day}</span>
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center border
              ${d.content ? 'bg-white border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700' : 'bg-transparent border-transparent'}
            `}>
              {d.content ? getIcon(d.content) : <span className="w-1 h-1 rounded-full bg-gray-300"></span>}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
