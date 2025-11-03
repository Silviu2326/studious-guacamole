import React from 'react';
import { Preference, CommunicationChannel } from '../api/preferences';
import { Mail, MessageCircle } from 'lucide-react';

interface PreferenceCategoryRowProps {
  categoryName: string;
  description?: string;
  isSubscribed: boolean;
  selectedChannel: CommunicationChannel;
  availableChannels?: ('email' | 'sms')[];
  onToggle: (isSubscribed: boolean) => void;
  onChannelChange: (channel: CommunicationChannel) => void;
}

export const PreferenceCategoryRow: React.FC<PreferenceCategoryRowProps> = ({
  categoryName,
  description,
  isSubscribed,
  selectedChannel,
  availableChannels = ['email', 'sms'],
  onToggle,
  onChannelChange
}) => {
  const handleChannelChange = (channel: 'email' | 'sms') => {
    if (isSubscribed) {
      onChannelChange(channel);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header with Toggle */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">{categoryName}</h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isSubscribed}
                onChange={(e) => onToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      </div>

      {/* Channel Selector */}
      <div className="flex gap-4">
        {availableChannels.map((channel) => (
          <button
            key={channel}
            onClick={() => handleChannelChange(channel)}
            disabled={!isSubscribed}
            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition ${
              isSubscribed && selectedChannel === channel
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${
              !isSubscribed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {channel === 'email' ? (
              <Mail className={`w-6 h-6 ${selectedChannel === channel ? 'text-purple-600' : 'text-gray-400'}`} />
            ) : (
              <MessageCircle className={`w-6 h-6 ${selectedChannel === channel ? 'text-purple-600' : 'text-gray-400'}`} />
            )}
            <span className={`text-sm font-medium ${
              isSubscribed && selectedChannel === channel ? 'text-purple-600' : 'text-gray-600'
            }`}>
              {channel === 'email' ? 'Email' : 'SMS/WhatsApp'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

