import { useState, useCallback } from 'react';
import { BusinessHours, BusinessHoursSlot } from '../types';

export interface UseBusinessHoursReturn {
  hours: BusinessHours[];
  addTimeslot: (day: BusinessHours['day'], slot: BusinessHoursSlot) => void;
  removeTimeslot: (day: BusinessHours['day'], slotIndex: number) => void;
  toggleDayClosed: (day: BusinessHours['day']) => void;
  updateSlot: (day: BusinessHours['day'], slotIndex: number, slot: BusinessHoursSlot) => void;
  setHours: (hours: BusinessHours[]) => void;
}

export function useBusinessHours(initialHours: BusinessHours[] = []): UseBusinessHoursReturn {
  const defaultHours: BusinessHours[] = [
    { day: 'monday', slots: [], isClosed: false },
    { day: 'tuesday', slots: [], isClosed: false },
    { day: 'wednesday', slots: [], isClosed: false },
    { day: 'thursday', slots: [], isClosed: false },
    { day: 'friday', slots: [], isClosed: false },
    { day: 'saturday', slots: [], isClosed: false },
    { day: 'sunday', slots: [], isClosed: false },
  ];

  const [hours, setHours] = useState<BusinessHours[]>(() => {
    if (initialHours.length === 0) {
      return defaultHours;
    }
    // Merge initial hours with default structure
    return defaultHours.map(defaultDay => {
      const initialDay = initialHours.find(h => h.day === defaultDay.day);
      return initialDay || defaultDay;
    });
  });

  const addTimeslot = useCallback((day: BusinessHours['day'], slot: BusinessHoursSlot) => {
    setHours(prevHours =>
      prevHours.map(h =>
        h.day === day
          ? { ...h, slots: [...h.slots, slot], isClosed: false }
          : h
      )
    );
  }, []);

  const removeTimeslot = useCallback((day: BusinessHours['day'], slotIndex: number) => {
    setHours(prevHours =>
      prevHours.map(h =>
        h.day === day
          ? { ...h, slots: h.slots.filter((_, idx) => idx !== slotIndex) }
          : h
      )
    );
  }, []);

  const toggleDayClosed = useCallback((day: BusinessHours['day']) => {
    setHours(prevHours =>
      prevHours.map(h =>
        h.day === day
          ? { ...h, isClosed: !h.isClosed, slots: h.isClosed ? h.slots : [] }
          : h
      )
    );
  }, []);

  const updateSlot = useCallback((day: BusinessHours['day'], slotIndex: number, slot: BusinessHoursSlot) => {
    setHours(prevHours =>
      prevHours.map(h =>
        h.day === day
          ? {
              ...h,
              slots: h.slots.map((s, idx) => idx === slotIndex ? slot : s),
            }
          : h
      )
    );
  }, []);

  return {
    hours,
    addTimeslot,
    removeTimeslot,
    toggleDayClosed,
    updateSlot,
    setHours,
  };
}

