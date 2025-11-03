import React from 'react';
import {
  Pixel,
  getPlatformLabel,
  getPlatformIcon,
  getStatusLabel,
  getStatusColor,
  formatLastEvent
} from '../api/pixels';
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
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg bg-gray-50 ${platformIcon}`}>
            <span className="text-xl font-bold">{pixel.platform.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{getPlatformLabel(pixel.platform)}</h3>
            <p className="text-sm text-gray-600 font-mono">{pixel.pixelId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.confirm('¿Editar este pixel?')) {
                console.log('Editar:', pixel.id);
              }
            }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              if (window.confirm('¿Eliminar este pixel?')) {
                onDelete(pixel.id);
              }
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
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
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
        </label>
      </div>
    </div>
  );
};

