import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Day } from '../../types/training';
import { DayCard } from './canvas/DayCard';

interface MobileDayViewProps {
  days: Day[];
  onUpdateDay: (dayId: string, newDay: Day) => void;
}

export const MobileDayView: React.FC<MobileDayViewProps> = ({ days, onUpdateDay }) => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const activeDay = days[activeDayIndex];

  const handlePrev = () => {
    if (activeDayIndex > 0) {
      setActiveDayIndex(activeDayIndex - 1);
      setIsExpanded(false);
    }
  };

  const handleNext = () => {
    if (activeDayIndex < days.length - 1) {
      setActiveDayIndex(activeDayIndex + 1);
      setIsExpanded(false);
    }
  };

  const handleDayClick = (index: number) => {
    setActiveDayIndex(index);
    setIsExpanded(false);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Mobile Day Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide px-1 -mx-1">
        {days.map((day, index) => (
          <button
            key={day.id}
            onClick={() => handleDayClick(index)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeDayIndex === index
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            {day.name.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="flex-grow relative px-1">
        <DayCard
          day={activeDay}
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
          onUpdateDay={onUpdateDay}
        />

        <div className="flex justify-between mt-4 px-2">
          <button
            onClick={handlePrev}
            disabled={activeDayIndex === 0}
            className={`flex items-center gap-1 text-sm font-medium ${
              activeDayIndex === 0 ? 'text-gray-300' : 'text-blue-600'
            }`}
          >
            <ChevronLeft size={16} /> Anterior
          </button>
          <button
            onClick={handleNext}
            disabled={activeDayIndex === days.length - 1}
            className={`flex items-center gap-1 text-sm font-medium ${
              activeDayIndex === days.length - 1 ? 'text-gray-300' : 'text-blue-600'
            }`}
          >
            Siguiente <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
