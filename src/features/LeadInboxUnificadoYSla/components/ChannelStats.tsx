import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { 
  Instagram, 
  Facebook, 
  Mail, 
  MessageCircle, 
  Globe,
  TrendingUp,
  Users
} from 'lucide-react';
import { Lead } from '../api/inbox';

interface ChannelStatsProps {
  leads: Lead[];
}

interface ChannelData {
  channel: Lead['sourceChannel'];
  count: number;
  converted: number;
  icon: React.ReactNode;
  color: string;
  name: string;
}

export const ChannelStats: React.FC<ChannelStatsProps> = ({ leads }) => {
  const channelData: Record<Lead['sourceChannel'], ChannelData> = {
    instagram: {
      channel: 'instagram',
      count: 0,
      converted: 0,
      icon: <Instagram className="w-5 h-5" />,
      color: 'bg-pink-100 text-pink-700 border-pink-200',
      name: 'Instagram'
    },
    facebook: {
      channel: 'facebook',
      count: 0,
      converted: 0,
      icon: <Facebook className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      name: 'Facebook'
    },
    whatsapp: {
      channel: 'whatsapp',
      count: 0,
      converted: 0,
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'bg-green-100 text-green-700 border-green-200',
      name: 'WhatsApp'
    },
    email: {
      channel: 'email',
      count: 0,
      converted: 0,
      icon: <Mail className="w-5 h-5" />,
      color: 'bg-gray-100 text-gray-700 border-gray-200',
      name: 'Email'
    },
    web_form: {
      channel: 'web_form',
      count: 0,
      converted: 0,
      icon: <Globe className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      name: 'Web'
    }
  };

  // Calcular estadísticas por canal
  leads.forEach(lead => {
    if (channelData[lead.sourceChannel]) {
      channelData[lead.sourceChannel].count++;
      if (lead.status === 'converted') {
        channelData[lead.sourceChannel].converted++;
      }
    }
  });

  const channels = Object.values(channelData).filter(ch => ch.count > 0);

  const getConversionRate = (data: ChannelData) => {
    if (data.count === 0) return 0;
    return ((data.converted / data.count) * 100).toFixed(1);
  };

  return (
    <Card className="bg-white shadow-sm" padding="md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Leads por Canal</h3>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span>Estadísticas</span>
        </div>
      </div>

      {channels.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">No hay leads para mostrar</p>
        </div>
      ) : (
        <div className="space-y-3">
          {channels.map((data) => (
            <div
              key={data.channel}
              className={`p-4 rounded-lg border ${data.color} bg-opacity-50`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {data.icon}
                  <span className="font-medium">{data.name}</span>
                </div>
                <span className="text-lg font-bold">{data.count}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">
                  {data.converted} convertidos
                </span>
                <span className="font-medium">
                  {getConversionRate(data)}% tasa
                </span>
              </div>
              {/* Barra de progreso */}
              <div className="mt-2 w-full bg-white bg-opacity-50 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full ${data.color.split(' ')[0]}`}
                  style={{ width: `${getConversionRate(data)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

