import React from 'react';
import {
  Pixel,
  getPlatformLabel,
  getPlatformIcon,
  getStatusLabel,
  getStatusColor,
  formatLastEvent
} from '../api/pixels';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Settings, Trash2 } from 'lucide-react';

interface PixelCardProps {
  pixel: Pixel;
  onToggleStatus: (pixelId: string, newStatus: boolean) => void;
  onDelete: (pixelId: string) => void;
}

export const PixelCard: React.FC<PixelCardProps> = ({ pixel, onToggleStatus, onDelete }) => {
  const platformIcon = getPlatformIcon(pixel.platform);
  const statusColor = getStatusColor(pixel.isActive);
  const statusLabel = getStatusLabel(pixel.isActive);

  return (
    <Card variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <span className="text-lg font-bold text-blue-600">{pixel.platform.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{getPlatformLabel(pixel.platform)}</h3>
              <p className="text-sm text-gray-600 font-mono">{pixel.pixelId}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (window.confirm('¿Editar este pixel?')) {
                  console.log('Editar:', pixel.id);
                }
              }}
              className="p-2"
            >
              <Settings size={18} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (window.confirm('¿Eliminar este pixel?')) {
                  onDelete(pixel.id);
                }
              }}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 size={18} />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                {statusLabel}
              </span>
            </div>
            {pixel.lastEventTimestamp && (
              <p className="text-sm text-gray-600">
                Último evento: {formatLastEvent(pixel.lastEventTimestamp)}
              </p>
            )}
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={pixel.isActive}
              onChange={(e) => onToggleStatus(pixel.id, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </Card>
  );
};

