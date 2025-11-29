import React from 'react';
import { Clock, Plus, X, Check } from 'lucide-react';
import { Card, Button, Input } from '../../../components/componentsreutilizables';
import { BusinessHours } from '../types';
import { useBusinessHours } from '../hooks/useBusinessHours';

interface BusinessHoursCardProps {
  hours: BusinessHours[];
  onHoursChange: (hours: BusinessHours[]) => void;
}

const dayLabels: Record<BusinessHours['day'], string> = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

export const BusinessHoursCard: React.FC<BusinessHoursCardProps> = ({
  hours,
  onHoursChange,
}) => {
  const { hours: localHours, addTimeslot, removeTimeslot, toggleDayClosed, updateSlot, setHours } = useBusinessHours(hours);

  // Sincronizar cuando las props cambian externamente
  React.useEffect(() => {
    const hasExternalChanges = JSON.stringify(hours) !== JSON.stringify(localHours);
    if (hasExternalChanges) {
      setHours(hours);
    }
  }, [hours]);

  // Sincronizar cambios locales con el callback cuando cambian los horarios locales
  React.useEffect(() => {
    const hasChanges = JSON.stringify(localHours) !== JSON.stringify(hours);
    if (hasChanges) {
      onHoursChange(localHours);
    }
  }, [localHours]);

  const handleAddSlot = (day: BusinessHours['day']) => {
    addTimeslot(day, { open: '09:00', close: '18:00' });
  };

  const handleRemoveSlot = (day: BusinessHours['day'], slotIndex: number) => {
    removeTimeslot(day, slotIndex);
  };

  const handleToggleClosed = (day: BusinessHours['day']) => {
    toggleDayClosed(day);
  };

  const handleSlotChange = (day: BusinessHours['day'], slotIndex: number, field: 'open' | 'close', value: string) => {
    const currentDay = localHours.find(h => h.day === day);
    if (currentDay && currentDay.slots[slotIndex]) {
      updateSlot(day, slotIndex, { ...currentDay.slots[slotIndex], [field]: value });
    }
  };

  // Usar localHours en lugar de hours para el render
  const displayHours = localHours;

  return (
    <Card padding="none">
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Horarios de Apertura
          </h3>
        </div>

        <div className="space-y-4">
          {displayHours.map((dayHours) => (
            <div
              key={dayHours.day}
              className="rounded-2xl bg-white ring-1 ring-slate-200 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!dayHours.isClosed}
                    onChange={() => handleToggleClosed(dayHours.day)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-900">
                    {dayLabels[dayHours.day]}
                  </span>
                </label>
                {!dayHours.isClosed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddSlot(dayHours.day)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Añadir Franja
                  </Button>
                )}
              </div>

              {!dayHours.isClosed && (
                <div className="space-y-3">
                  {dayHours.slots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center gap-3">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <Input
                          type="time"
                          value={slot.open}
                          onChange={(e) => handleSlotChange(dayHours.day, slotIndex, 'open', e.target.value)}
                          label="Apertura"
                        />
                        <Input
                          type="time"
                          value={slot.close}
                          onChange={(e) => handleSlotChange(dayHours.day, slotIndex, 'close', e.target.value)}
                          label="Cierre"
                        />
                      </div>
                      {dayHours.slots.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSlot(dayHours.day, slotIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {dayHours.slots.length === 0 && (
                    <p className="text-sm text-gray-500 italic">
                      Haz clic en "Añadir Franja" para configurar los horarios
                    </p>
                  )}
                </div>
              )}

              {dayHours.isClosed && (
                <div className="flex items-center gap-2 text-gray-500">
                  <X className="w-4 h-4" />
                  <span className="text-sm">Cerrado</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

